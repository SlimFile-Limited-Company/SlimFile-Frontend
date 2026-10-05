import { Download, Sparkles, Smartphone, FileImage } from 'lucide-react';
import ScanToolPage from './ScanToolPage';

const SlimFileScanCompress = () => (
  <ScanToolPage
    config={{
      title: 'Scan & Compress',
      seoTitle: 'Scan & Compress — Photograph Pages and Shrink the PDF',
      seoDescription: 'Photograph paper with your phone camera and get a small, shareable PDF. Pages are downsampled and packed into one A4 document automatically.',
      blurb: 'Photograph your pages and get back one small, shareable PDF.',
      accentKey: 'orange',
      endpoint: '/scan/scan-compress',
      submitLabel: 'Scan & Compress',
      workingLabel: 'Building your PDF…',
      downloadName: 'scanned_compressed.pdf',
      successTitle: 'Scan compressed!',
      successBody: (pages, savedKb) =>
        `${pages} page${pages > 1 ? 's' : ''} turned into one PDF${savedKb > 0 ? `, saving about ${(savedKb / 1024).toFixed(1)} MB.` : '.'}`,
      desktopHint: 'Scan and compress up to 30 pages. Open this page on your phone to use the camera.',
      operationType: 'scan-compress',
      pills: [
        { icon: <Smartphone className="w-3.5 h-3.5 text-orange-500" />, label: 'Uses your camera' },
        { icon: <Sparkles   className="w-3.5 h-3.5 text-orange-500" />, label: 'Shrinks as it scans' },
        { icon: <Download   className="w-3.5 h-3.5 text-orange-500" />, label: 'One A4 PDF out' },
      ],
    }}
  />
);

export default SlimFileScanCompress;
