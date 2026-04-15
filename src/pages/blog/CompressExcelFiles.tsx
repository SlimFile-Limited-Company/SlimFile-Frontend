import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { BarChart2, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogCompressExcelFiles() {
  useSEO({
    title: 'How to Compress Excel Files — Reduce XLSX Size Free 2026 | SlimFile Blog',
    description: 'Compress large Excel spreadsheets to reduce XLSX file size. Free methods to shrink Excel files with embedded images, pivot tables, and large data sets.',
    canonical: 'https://slim-file.com/blog/compress-excel-files',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6"><BarChart2 className="w-10 h-10 text-green-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Document Compression</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Compress Excel Files</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Excel spreadsheets can balloon to 50MB+ when filled with charts, images, and external data links. Here's how to slim them down without losing your data.</p>
          <Link to="/compress"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Compress Files Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 5 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Excel Files Get So Large</h2>
            <p className="text-gray-600 leading-relaxed mb-4">An XLSX file is a ZIP containing XML data. It grows for several reasons — and unlike Word documents, the culprits in Excel can be less obvious.</p>
            <div className="space-y-3">
              {[
                { cause: "Embedded images and charts", fix: "Compress images via Format Picture → Compress Pictures" },
                { cause: "Unused cells with formatting", fix: "Select last used cell, delete all rows/columns below and to the right" },
                { cause: "External data connections", fix: "Remove unused queries in Data → Queries & Connections" },
                { cause: "Pivot table caches", fix: "Right-click pivot → Options → Data → Uncheck 'Save source data with file'" },
                { cause: "Named ranges accumulating", fix: "Manage and delete unused named ranges via Formulas → Name Manager" },
                { cause: "Unnecessary conditional formatting", fix: "Home → Conditional Formatting → Clear Rules on unused ranges" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-2 h-2 rounded-full bg-red-400 shrink-0 mt-2" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.cause}</p>
                    <p className="text-gray-600 text-xs mt-1">Fix: {item.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step: Reduce Excel File Size</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Remove pivot table source data cache", desc: "Right-click any pivot table → PivotTable Options → Data tab → uncheck 'Save source data with file'. Refresh the pivot when needed instead." },
                { step: "2", title: "Compress embedded images", desc: "Click any image → Picture Format tab → Compress Pictures → select Email (96 ppi) → Apply to all pictures." },
                { step: "3", title: "Delete empty rows and columns", desc: "Press Ctrl+End to find the last used cell. If it's far beyond your data, select the unused rows/columns and delete them." },
                { step: "4", title: "Save as .xlsx not .xls", desc: "The modern XLSX format uses ZIP compression internally — it's always smaller than the legacy XLS format." },
                { step: "5", title: "Save as PDF if sharing (not editing)", desc: "If recipients only need to view the data, export as PDF and compress with SlimFile — often 80% smaller." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Export to PDF for Sharing</h2>
            <p className="text-gray-600 mb-4">If you're sharing an Excel file for viewing (not editing), converting to PDF eliminates most of the bloat:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>In Excel, click <strong>File → Save As → PDF</strong></li>
              <li>Choose only the sheets you need to include</li>
              <li>Upload the PDF to SlimFile for further compression</li>
              <li>Share the compressed PDF — typically 70–90% smaller than the original XLSX</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Excel File Compression Tips</h2>
            <ul className="space-y-3">
              {[
                "Close all other workbooks before saving — external links bloat the file if unresolved",
                "Remove duplicate worksheets that contain the same data",
                "Replace formulas with values (Paste Special → Values) for static reports you won't recalculate",
                "Use tables (Ctrl+T) instead of manually formatted ranges — more efficient storage",
                "Avoid storing images at original resolution in Excel — resize in an image editor first",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Share Excel Data as Compressed PDF — Free</h2>
          <p className="text-red-100 mb-8 text-lg">Convert to PDF and compress for sharing. Instant. No account needed.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
