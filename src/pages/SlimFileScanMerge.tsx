import { Download, Layers, Smartphone, FileStack } from 'lucide-react';
import ScanToolPage from './ScanToolPage';

const SlimFileScanMerge = () => (
  <ScanToolPage
    config={{
      title: 'Batch Scan & Merge',
      seoTitle: 'Batch Scan & Merge — Combine Scans Into One PDF',
      seoDescription: 'Photograph several documents and merge every page into a single PDF. Capture page by page and reorder before you build.',
      blurb: 'Scan several documents and combine every page into one PDF.',
      accentKey: 'blue',
      endpoint: '/scan/scan-merge',
      submitLabel: 'Merge Pages',
      workingLabel: 'Merging your pages…',
      downloadName: 'batch_scanned_merged.pdf',
      minPages: 2,
      preSubmitError: 'Add at least 2 pages',
      successTitle: 'Pages merged!',
      successBody: (pages, savedKb) =>
        `${pages} pages combined into one PDF${savedKb > 0 ? `, saving about ${(savedKb / 1024).toFixed(1)} MB.` : '.'}`,
      desktopHint: 'Merge scanned pages into one PDF. Open this page on your phone to use the camera.',
      operationType: 'scan-merge',
      pills: [
        { icon: <Smartphone  className="w-3.5 h-3.5 text-blue-500" />, label: 'Uses your camera' },
        { icon: <Layers      className="w-3.5 h-3.5 text-blue-500" />, label: 'Reorder before merging' },
        { icon: <FileStack   className="w-3.5 h-3.5 text-blue-500" />, label: 'One document out' },
      ],
    }}
  />
);

export default SlimFileScanMerge;
