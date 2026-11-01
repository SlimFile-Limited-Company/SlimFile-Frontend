import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackCampusUse } from '@/lib/campus';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

const TITLE_SAVE_DELAY_MS = 800;

// ONLYOFFICE's browser API, loaded from our document server.
declare global {
  interface Window {
    DocsAPI?: { DocEditor: new (elementId: string, config: unknown) => { destroyEditor: () => void } };
  }
}

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('jwt')}` });

const loadDocsApi = (serverUrl: string) =>
  new Promise<void>((resolve, reject) => {
    if (window.DocsAPI) return resolve();
    const src = `${serverUrl}web-apps/apps/api/documents/api.js`;
    let script = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = src;
      document.body.appendChild(script);
    }
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Could not load the editor')));
  });

/**
 * Documents open in ONLYOFFICE, a full Word-style editor. ONLYOFFICE saves on
 * its own: it sends the file back to our backend once the editor closes.
 */
const DocumentEditor = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [reloadKey, setReloadKey] = useState(0);
  const titleLoaded = useRef<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const holder = useRef<HTMLDivElement>(null);

  // Title for the bar
  useEffect(() => {
    fetch(`${API_BASE_URL}/documents/${documentId}`, { headers: authHeaders(), cache: 'no-store' })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(({ document }) => {
        titleLoaded.current = document.title || '';
        setTitle(document.title || '');
      })
      .catch(() => {});
  }, [documentId]);

  // The editor itself
  useEffect(() => {
    let editor: { destroyEditor: () => void } | null = null;
    let cancelled = false;
    setState('loading');

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/documents/${documentId}/office`, { headers: authHeaders(), cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to open document');
        const { serverUrl, config } = await res.json();
        await loadDocsApi(serverUrl);
        if (cancelled || !window.DocsAPI || !holder.current) return;
        // ONLYOFFICE replaces this element with its iframe, so React doesn't own it.
        const placeholder = document.createElement('div');
        placeholder.id = `office-editor-${documentId}-${reloadKey}`;
        holder.current.appendChild(placeholder);
        editor = new window.DocsAPI.DocEditor(placeholder.id, {
          ...config,
          // The free edition's phone layout is view-only, so phones get the full editor too.
          type: 'desktop',
          width: '100%',
          height: '100%',
          events: {
            onAppReady: () => {
              setState('ready');
              trackCampusUse('slimdocx');
            },
            // Let ONLYOFFICE show its own error message instead of our spinner.
            onError: () => setState('ready'),
          },
        });
      } catch (err) {
        console.error('Error opening document:', err);
        if (!cancelled) setState('failed');
      }
    })();

    return () => {
      cancelled = true;
      editor?.destroyEditor();
      if (holder.current) holder.current.innerHTML = '';
    };
  }, [documentId, reloadKey]);

  // Renaming saves after a short pause
  useEffect(() => {
    if (titleLoaded.current === null || title === titleLoaded.current) return;
    const timer = setTimeout(async () => {
      const res = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() || 'Untitled Document' }),
      }).catch(() => null);
      if (res?.ok) titleLoaded.current = title;
    }, TITLE_SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [title, documentId]);

  const importWord = async (file: File) => {
    const body = new FormData();
    body.append('file', file);
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${documentId}/office/upload`, { method: 'POST', headers: authHeaders(), body });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Import failed');
      toast({ title: 'Imported', description: `"${file.name}" replaced this document.` });
      setReloadKey(k => k + 1);
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to import that Word file', variant: 'destructive' });
    }
  };

  return (
    <div className="fixed inset-x-0 top-12 bottom-0 flex flex-col bg-[#f5f5f7]">
      {/* Document bar, styled like the site header */}
      <div className="h-12 shrink-0 flex items-center gap-3 px-3 sm:px-4 border-b border-black/[0.06] bg-[#fbfbfd]/80 backdrop-blur-xl backdrop-saturate-150">
        <button onClick={() => navigate('/documents')} className="flex items-center gap-0.5 text-[13px] text-red-600 hover:text-red-700 shrink-0">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">All documents</span>
        </button>
        <span className="hidden md:flex items-center gap-1.5 shrink-0 text-[13px] font-semibold text-[#1d1d1f]">
          <img src="/logo.gif" alt="" className="w-4 h-4" />
          SlimDocx
          <span className="font-normal text-[11px] text-[#6e6e73]">· Powered by ONLYOFFICE</span>
        </span>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled Document"
          aria-label="Document title"
          className="flex-1 min-w-0 text-center truncate text-[13px] font-semibold text-[#1d1d1f] placeholder:text-[#6e6e73] bg-transparent focus:outline-none"
        />
        <span className="hidden sm:inline text-xs text-[#6e6e73]">Saves automatically</span>
        <input
          ref={fileInput}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) importWord(f); e.target.value = ''; }}
        />
        <button
          onClick={() => fileInput.current?.click()}
          title="Replace this document with a Word file"
          className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[13px] text-[#1d1d1f] hover:bg-black/[0.05]"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Import Word</span>
        </button>
      </div>

      {/* Editor */}
      <div className="relative flex-1 min-h-0">
        <div ref={holder} className="absolute inset-0 [&>iframe]:block" />
        {state !== 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f7] text-[#6e6e73]">
            {state === 'failed' ? (
              <button onClick={() => navigate('/documents')} className="text-[15px] text-red-600 hover:text-red-700">
                Couldn't open this document. Back to SlimDocx
              </button>
            ) : (
              <span className="flex items-center gap-2 text-[15px]">
                <Loader2 className="w-5 h-5 animate-spin" />
                Opening document…
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;
