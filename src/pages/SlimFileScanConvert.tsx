import { useState } from 'react';
import { Download, Repeat, Smartphone, AlertTriangle } from 'lucide-react';
import ScanToolPage from './ScanToolPage';
import { accent } from '@/lib/scanAccents';

const FORMATS = [
  { value: 'docx', label: 'Word (.docx)' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
  { value: 'pptx', label: 'PowerPoint (.pptx)' },
  { value: 'jpg',  label: 'JPG images (.zip)' },
  { value: 'png',  label: 'PNG images (.zip)' },
  { value: 'pdf',  label: 'PDF (no conversion)' },
];

const SlimFileScanConvert = () => {
  const [format, setFormat] = useState('docx');
  const isOcr = ['docx', 'xlsx', 'pptx'].includes(format);

  return (
    <ScanToolPage
      config={{
        title: 'Scan & Convert',
        seoTitle: 'Scan & Convert — Turn Photos Into Editable Documents',
        seoDescription: 'Photograph a page and convert it into Word, Excel, PowerPoint or images. Text is recovered from the photo, so check the result before you rely on it.',
        blurb: 'Photograph a page and turn it into an editable document.',
        accentKey: 'purple',
        endpoint: '/scan/scan-convert',
        submitLabel: 'Scan & Convert',
        workingLabel: 'Converting your scan…',
        downloadName: 'scanned.docx',
        successTitle: 'Scan converted!',
        successBody: pages => `${pages} page${pages > 1 ? 's' : ''} converted. Check the text before you rely on it.`,
        desktopHint: 'Convert scans into Word, Excel or images. Open this page on your phone to use the camera.',
        operationType: 'scan-convert',
        pills: [
          { icon: <Smartphone className="w-3.5 h-3.5 text-purple-500" />, label: 'Uses your camera' },
          { icon: <Repeat    className="w-3.5 h-3.5 text-purple-500" />, label: 'Word, Excel, PPT' },
          { icon: <Download  className="w-3.5 h-3.5 text-purple-500" />, label: 'One file out' },
        ],
        extraBody: () => ({ targetFormat: format }),
        extraFields: (
          <div className="space-y-2">
            <label htmlFor="scan-convert-format" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Convert to
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FORMATS.map(f => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFormat(f.value)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    format === f.value
                      ? 'border-purple-400 bg-purple-50 text-purple-600'
                      : 'border-gray-200 text-gray-600 hover:border-purple-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {isOcr && (
              <p className="flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-2.5 leading-relaxed">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  A photo has no text to read, so the text is guessed from the
                  image. Check spelling, tables and layout before you use it.
                </span>
              </p>
            )}
          </div>
        ),
        postProcess: async blob => ({
          blob,
          filename: format === 'jpg' || format === 'png'
            ? 'scanned_pages.zip'
            : format === 'pdf' ? 'scanned.pdf' : `scanned.${format}`,
        }),
      }}
    />
  );
};

export default SlimFileScanConvert;
