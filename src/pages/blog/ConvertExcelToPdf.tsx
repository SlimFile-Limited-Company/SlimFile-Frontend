import { Link } from "react-router-dom";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { BarChart2, CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function BlogConvertExcelToPdf() {
  useSEO({
    title: 'How to Convert Excel to PDF — Free & Easy Methods 2026 | SlimFile Blog',
    description: 'Convert Excel spreadsheets to PDF for easy sharing. Built-in Excel export, Google Sheets, and online converters — all free methods with step-by-step instructions.',
    canonical: 'https://slim-file.com/blog/convert-excel-to-pdf',
  });
  return (
    <div className="min-h-screen pt-28 bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6"><BarChart2 className="w-10 h-10 text-green-600" /></div>
          <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">File Conversion</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">How to Convert Excel to PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Sharing an Excel file as PDF locks the formatting and prevents edits. Perfect for sending financial reports, invoices, and data summaries.</p>
          <Link to="/convert-only"><Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold">Convert Files Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          <p className="text-sm text-gray-500 mt-4">Updated January 2026 · 4 min read</p>
        </div>
      </section>

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 1: Export PDF Directly from Excel</h2>
            <div className="space-y-3">
              {[
                { os: "Windows (Excel)", steps: "File → Save As → PDF, or File → Export → Create PDF/XPS" },
                { os: "Mac (Excel)", steps: "File → Save As → Format: PDF, or File → Export as PDF" },
                { os: "Excel for Web", steps: "File → Export → Download as PDF" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{item.os}</p>
                  <p className="text-gray-600 text-xs mt-1">{item.steps}</p>
                </div>
              ))}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-800 text-sm"><strong>Tip:</strong> Before exporting, set the print area (Page Layout → Print Area → Set Print Area) to include only the cells you want in the PDF — avoids exporting blank space.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Method 2: Google Sheets (Free, No Software)</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Upload to Google Sheets", desc: "Go to sheets.google.com → open the Excel file from your Drive or upload it." },
                { step: "2", title: "Export as PDF", desc: "File → Download → PDF Document (.pdf)" },
                { step: "3", title: "Configure settings", desc: "Choose page orientation, paper size, scaling, and which sheets to include." },
                { step: "4", title: "Download and share", desc: "The PDF is saved locally and ready to email or upload." },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{item.step}</div>
                  <div><p className="font-semibold text-gray-900">{item.title}</p><p className="text-gray-600 text-sm mt-1">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Excel to PDF Formatting Tips</h2>
            <ul className="space-y-3">
              {[
                "Set print area before converting to avoid blank pages in the PDF output",
                "Use 'Fit to Page' in Page Layout to prevent columns from being cut off",
                "Freeze panes don't apply in PDF — add column headers on each page if needed via Page Layout → Print Titles",
                "For landscape data (wide spreadsheets), set orientation to Landscape before exporting",
                "After converting, compress the PDF with SlimFile — Excel PDFs often have large embedded fonts",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span>{tip}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Does Excel to PDF preserve formulas?", a: "No — PDFs show the calculated values, not the formulas. This is usually what you want when sharing." },
                { q: "Can I convert multiple Excel sheets to one PDF?", a: "Yes. When exporting from Excel, choose 'Entire Workbook' to include all sheets in one PDF." },
                { q: "How do I convert a specific page range?", a: "Set the Print Area to the range you want before exporting: Page Layout → Print Area → Set Print Area." },
              ].map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold text-gray-900 mb-2">{faq.q}</p>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Convert Excel to PDF — Compress It Free</h2>
          <p className="text-red-100 mb-8 text-lg">Smaller, shareable PDFs. No account. Works in any browser.</p>
          <Link to="/compress-pdf-online"><Button className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 rounded-xl font-bold text-lg">Compress PDF Free <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
