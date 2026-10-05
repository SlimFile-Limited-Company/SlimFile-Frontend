import { useState } from 'react';
import { Download, Scissors, Smartphone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ScanToolPage from './ScanToolPage';

const SlimFileScanSplit = () => {
  const [ranges, setRanges] = useState('');

  return (
    <ScanToolPage
      config={{
        title: 'Batch Scan & Split',
        seoTitle: 'Batch Scan & Split — Scan Pages and Split Them Into PDFs',
        seoDescription: 'Photograph a document and split it into separate small PDFs. Leave ranges blank for one file per page, or use 1-3,5 for groups.',
        blurb: 'Scan a document, then split it into separate small PDFs.',
        accentKey: 'green',
        endpoint: '/scan/scan-split',
        submitLabel: 'Scan & Split',
        workingLabel: 'Splitting your scan…',
        downloadName: 'scanned_split.zip',
        successTitle: 'Scan split!',
        successBody: pages => `${pages} page${pages > 1 ? 's' : ''} split into separate PDFs, delivered as a zip.`,
        desktopHint: 'Scan and split into separate PDFs. Open this page on your phone to use the camera.',
        operationType: 'scan-split',
        pills: [
          { icon: <Smartphone className="w-3.5 h-3.5 text-green-500" />, label: 'Uses your camera' },
          { icon: <Scissors   className="w-3.5 h-3.5 text-green-500" />, label: 'One PDF per page' },
          { icon: <Download   className="w-3.5 h-3.5 text-green-500" />, label: 'Delivered as a zip' },
        ],
        extraBody: () => ({ ranges: ranges.trim() }),
        extraFields: (
          <div className="space-y-1.5">
            <label htmlFor="scan-split-ranges" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Page ranges — optional
            </label>
            <Input
              id="scan-split-ranges"
              value={ranges}
              onChange={e => setRanges(e.target.value)}
              placeholder="Leave blank for one file per page, or use 1-3,5,7-9"
              className="rounded-xl"
            />
            <p className="text-xs text-gray-400">
              Blank gives one PDF per page. Ranges give one PDF per group, e.g. 1-3,5 makes two files.
            </p>
          </div>
        ),
      }}
    />
  );
};

export default SlimFileScanSplit;
