import { Link, useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/utils";

// The same tools as the cards on Home, grouped like its tabs.
const columns = [
  {
    heading: "PDF",
    links: [
      { label: "PDF Merger & Splitter", path: "/forge" },
      { label: "Merge & Compress PDFs", path: "/merge-compress" },
      { label: "Split & Compress PDFs", path: "/split-compress" },
      { label: "Text to PDF", path: "/text-to-pdf" },
      { label: "OCR Tool", path: "/ocr-tool" },
      { label: "PDF Password Protect", path: "/lock" },
      { label: "eSign PDF", path: "/esign" },
    ],
  },
  {
    heading: "Files",
    links: [
      { label: "Compress Files", path: "/compress" },
      { label: "Convert Formats", path: "/convert-only" },
      { label: "Convert & Compress", path: "/convert-compress" },
      { label: "Zip Files & Folders", path: "/zip" },
      { label: "QR Code Generator", path: "/qr-code" },
    ],
  },
  {
    heading: "Scan",
    links: [
      { label: "Scan & Compress", path: "/scan-compress" },
      { label: "Batch Scan & Merge", path: "/scan-merge" },
      { label: "Batch Scan & Split", path: "/scan-split" },
      { label: "Scan & Convert", path: "/scan-convert" },
    ],
  },
  {
    heading: "AI Lab",
    links: [
      { label: "Translate Text", path: "/ai-lab?feature=translate" },
      { label: "Summarize Document", path: "/ai-lab?feature=summarize" },
      { label: "Rewrite Content", path: "/ai-lab?feature=rewrite" },
      { label: "Ask Questions", path: "/ai-lab?feature=question" },
      { label: "Extract Keywords", path: "/ai-lab?feature=keywords" },
      { label: "Analyze Sentiment", path: "/ai-lab?feature=sentiment" },
      { label: "Compare Texts", path: "/ai-lab?feature=compare" },
      { label: "Email Generator", path: "/ai-lab?feature=email" },
    ],
  },
  {
    heading: "Team",
    links: [
      { label: "Whiteboards", path: "/my-whiteboards" },
      { label: "SlimDocx", path: "/documents" },
      { label: "Team Workspaces", path: "/workspaces" },
      { label: "Activity Feed", path: "/feed" },
    ],
  },
];

const legal = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Use", path: "/terms" },
];

export const Footer = () => {
  const location = useLocation();

  // Hide footer on AI Lab page and B2B admin page
  if (location.pathname === '/ai-lab' || location.pathname === '/b2b-api-keys-admin') {
    return null;
  }

  const track = (path: string, label: string) => trackEvent('footer_link_click', { path, label });

  return (
    <footer className="bg-[#f5f5f7] text-[12px] leading-[1.35] text-[#6e6e73]">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8">
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-semibold text-[#1d1d1f] mb-2.5">{col.heading}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={() => track(link.path, link.label)}
                      className="hover:text-[#1d1d1f] hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-[#d2d2d7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p>Copyright © {new Date().getFullYear()} SlimFile. All rights reserved.</p>
          <ul className="flex items-center">
            {legal.map((link, i) => (
              <li key={link.path} className="flex items-center">
                {i > 0 && <span className="mx-2.5 h-3 w-px bg-[#d2d2d7]" aria-hidden="true" />}
                <Link
                  to={link.path}
                  onClick={() => track(link.path, link.label)}
                  className="text-[#424245] hover:text-[#1d1d1f] hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
