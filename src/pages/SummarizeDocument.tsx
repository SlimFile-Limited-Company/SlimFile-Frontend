import { useState, useRef, useCallback } from 'react';
import { FileText, Upload, Sparkles, Download, RotateCcw, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

// pdfjs worker — use local bundled worker instead of CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

type Step = 'idle' | 'compressing' | 'extracting' | 'summarizing' | 'done' | 'error';

interface SummarySection {
  title: string;
  content: string;
}

function parseStructuredSummary(raw: string): SummarySection[] {
  const sections: SummarySection[] = [];
  // Try to detect markdown-style headers like "**Title:**" or "## Title"
  const lines = raw.split('\n');
  let current: SummarySection | null = null;
  for (const line of lines) {
    const headerMatch = line.match(/^(?:#{1,3}\s*|[*]{2})(.+?)(?:[*]{2})?:?\s*$/);
    if (headerMatch && line.trim().length < 80) {
      if (current) sections.push(current);
      current = { title: headerMatch[1].replace(/\*\*/g, '').trim(), content: '' };
    } else if (current) {
      current.content += (current.content ? '\n' : '') + line;
    } else {
      // No header yet — treat as intro
      if (!sections.length) {
        current = { title: 'Overview', content: line };
      }
    }
  }
  if (current) sections.push(current);
  // If parsing failed or only one section, return raw as single block
  if (sections.length <= 1) {
    return [{ title: 'Summary', content: raw }];
  }
  return sections.filter(s => s.content.trim());
}

async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ') + '\n';
  }
  return text.trim();
}

async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value.trim();
}

async function compressFile(file: File): Promise<ArrayBuffer> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/compress`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Compression failed');
  }
  return response.arrayBuffer();
}

async function callGroq(text: string): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('VITE_GROQ_API_KEY is not set in your .env file');

  // Truncate to ~12k chars to stay within token limits
  const truncated = text.length > 12000 ? text.slice(0, 12000) + '\n\n[Document truncated for length...]' : text;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional document analyst. Summarize the provided document in a clear, structured format. ' +
            'Use these sections: **Key Purpose**, **Main Points**, **Important Details**, **Action Items or Recommendations**. ' +
            'Be concise and professional. Use plain English. Avoid fluff.',
        },
        {
          role: 'user',
          content: `Please summarize the following document:\n\n${truncated}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No summary returned.';
}

const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ACCEPTED_EXT = '.pdf,.docx';

export default function SummarizeDocument() {
  const [step, setStep] = useState<Step>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [sections, setSections] = useState<SummarySection[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const process = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setErrorMsg('');
    setSections([]);
    setExpandedIdx(null);

    try {
      // Step 1: Compress
      setStep('compressing');
      const compressedBuffer = await compressFile(selectedFile);
      setCompressedSize(compressedBuffer.byteLength);

      // Store compressed file in localStorage as base64
      const uint8 = new Uint8Array(compressedBuffer);
      let binary = '';
      uint8.forEach(b => (binary += String.fromCharCode(b)));
      const b64 = btoa(binary);
      localStorage.setItem('slimfile_summarize_doc', b64);
      localStorage.setItem('slimfile_summarize_name', selectedFile.name);

      // Step 2: Extract text from compressed buffer
      setStep('extracting');
      let text = '';
      const lowerName = selectedFile.name.toLowerCase();
      if (lowerName.endsWith('.pdf') || selectedFile.type === 'application/pdf') {
        text = await extractTextFromPdf(compressedBuffer);
      } else {
        text = await extractTextFromDocx(compressedBuffer);
      }

      if (!text.trim()) throw new Error('Could not extract text from this document. It may be image-based or encrypted.');

      // Step 3: Summarize via Groq
      setStep('summarizing');
      const rawSummary = await callGroq(text);
      const parsed = parseStructuredSummary(rawSummary);
      setSections(parsed);
      setExpandedIdx(0);
      setStep('done');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
      setStep('error');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) process(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (ACCEPTED_TYPES.includes(f.type) || f.name.endsWith('.docx') || f.name.endsWith('.pdf'))) {
      process(f);
    }
  };

  const reset = () => {
    setStep('idle');
    setFile(null);
    setErrorMsg('');
    setSections([]);
    setOriginalSize(0);
    setCompressedSize(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const downloadSummary = () => {
    const content = sections.map(s => `${s.title}\n${'─'.repeat(s.title.length)}\n${s.content}`).join('\n\n');
    const blob = new Blob([`Document Summary — ${file?.name}\n${'═'.repeat(40)}\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary_${file?.name?.replace(/\.[^.]+$/, '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepLabels: Record<Step, string> = {
    idle: '',
    compressing: 'Compressing with SlimFile...',
    extracting: 'Extracting document text...',
    summarizing: 'Generating AI summary...',
    done: '',
    error: '',
  };

  const stepOrder: Step[] = ['compressing', 'extracting', 'summarizing'];

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-36 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-3">
            Summarize Documents
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Upload a PDF or DOCX. SlimFile compresses it, extracts the text, then generates a structured AI summary instantly.
          </p>
        </div>

        {/* Upload Zone */}
        {step === 'idle' && (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`bg-white rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center p-12 text-center ${
              isDragging ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-5 shadow-md">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-1">Drop your document here</p>
            <p className="text-gray-400 text-sm mb-5">or click to browse</p>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">PDF</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">DOCX</span>
            </div>
            <input ref={inputRef} type="file" accept={ACCEPTED_EXT} className="hidden" onChange={handleFileChange} />
          </div>
        )}

        {/* Processing State */}
        {(step === 'compressing' || step === 'extracting' || step === 'summarizing') && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{file?.name}</p>
                <p className="text-xs text-gray-400">{formatSize(originalSize)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {stepOrder.map((s, idx) => {
                const currentIdx = stepOrder.indexOf(step);
                const isDone = idx < currentIdx;
                const isActive = idx === currentIdx;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isDone ? 'bg-green-500' : isActive ? 'bg-purple-500' : 'bg-gray-100'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : isActive ? (
                        <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <span className={`text-sm ${isDone ? 'text-gray-400 line-through' : isActive ? 'text-gray-900 font-medium' : 'text-gray-300'}`}>
                      {stepLabels[s]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error State */}
        {step === 'error' && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <p className="font-semibold text-gray-900 mb-2">Something went wrong</p>
            <p className="text-sm text-gray-500 mb-6">{errorMsg}</p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Done State */}
        {step === 'done' && (
          <div className="space-y-4">
            {/* Stats bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{file?.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatSize(originalSize)} → {formatSize(compressedSize)}
                    {originalSize > 0 && (
                      <span className="ml-1.5 text-green-600 font-medium">
                        ({Math.round((1 - compressedSize / originalSize) * 100)}% smaller)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadSummary}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save Summary
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Document
                </button>
              </div>
            </div>

            {/* Summary sections */}
            <div className="space-y-3">
              {sections.map((section, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{section.title}</span>
                    </div>
                    {expandedIdx === idx ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedIdx === idx && (
                    <div className="px-6 pb-5 border-t border-gray-50">
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap pt-4">
                        {section.content.trim()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
