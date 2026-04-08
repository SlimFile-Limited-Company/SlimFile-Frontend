import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Upload,
  Zap,
  CheckCircle,
  ChevronRight,
  Info,
  Target,
  Star,
  Check,
  RefreshCw,
  Table,
  Edit,
  Calculator,
  BarChart,
  Database
} from "lucide-react";

export default function BlogConvertPdfToXlsx() {
  return (
    <div className="min-h-screen pt-28">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 mb-4 sm:mb-0 sm:mr-4">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100">
                <Table className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              How to Convert PDF to Excel: Complete Guide 2025
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Extract tables and data from PDFs into editable Excel spreadsheets. Perfect for 
              financial reports, invoices, and data analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/convert">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Convert PDF to XLSX Now
                </Button>
              </Link>
              <Link to="/compress">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary px-8 py-3 rounded-lg font-semibold">
                  <Zap className="w-5 h-5 mr-2" />
                  Compress PDF
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center text-green-600 font-medium text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Updated for 2025 • Table Extraction • Free Tool
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Editable Data</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">Accurate</div>
              <div className="text-xs sm:text-sm text-gray-600">Table Detection</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">&lt;15s</div>
              <div className="text-xs sm:text-sm text-gray-600">Conversion Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">Free</div>
              <div className="text-xs sm:text-sm text-gray-600">No Limits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href="#why-convert" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Why Convert PDF to Excel?
              </a>
              <a href="#step-by-step" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </a>
              <a href="#what-to-expect" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                What to Expect
              </a>
              <a href="#use-cases" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Use Cases
              </a>
              <a href="#best-practices" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                Best Practices
              </a>
              <a href="#faq" className="flex items-center text-green-600 hover:text-green-700 font-medium">
                <ChevronRight className="w-4 h-4 mr-2" />
                FAQ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">

            <h2 id="why-convert" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Info className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Why Convert PDF to Excel?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              PDF tables look great but are impossible to work with. Converting PDF to Excel (XLSX) 
              extracts data into cells where you can sort, filter, calculate, and analyze. It's 
              essential for anyone working with financial data, reports, or statistics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Edit Data</h4>
                <p className="text-green-800 text-xs sm:text-sm">
                  Modify values, add new rows, and update information that was locked in PDF.
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Run Calculations</h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  Use Excel formulas to sum, average, and calculate with extracted data.
                </p>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Create Charts</h4>
                <p className="text-purple-800 text-xs sm:text-sm">
                  Visualize data with Excel charts, graphs, and pivot tables.
                </p>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Integrate Data</h4>
                <p className="text-orange-800 text-xs sm:text-sm">
                  Import extracted data into databases, accounting software, and other systems.
                </p>
              </div>
            </div>

            <h2 id="step-by-step" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Step-by-Step Conversion Guide
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Upload Your PDF</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Drag and drop your PDF file or click to browse. Our converter handles multi-page 
                    PDFs with multiple tables, financial statements, and complex data layouts.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Automatic Table Detection</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Our AI scans each page, detecting table structures, row/column boundaries, and 
                    extracting data into properly organized Excel cells.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-white font-bold text-lg sm:text-xl mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Download XLSX</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    Download your Excel file. Open it in Microsoft Excel, Google Sheets, or any 
                    compatible spreadsheet application.
                  </p>
                </div>
              </div>
            </div>

            <h2 id="what-to-expect" className="text-3xl font-bold text-gray-900 mb-6 flex items-center mt-12">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              What to Expect from Conversion
            </h2>

            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Conversion Results</h3>
              <ul className="space-y-3 text-green-800">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span><strong>Tables:</strong> Converted to native Excel tables with proper cell structure</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span><strong>Numbers:</strong> Recognized and formatted as numeric values for calculations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span><strong>Headers:</strong> Table headers identified and placed in first row</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span><strong>Multiple Tables:</strong> Each table placed on separate sheets when possible</span>
                </li>
              </ul>
            </div>

            <h2 id="use-cases" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Table className="w-8 h-8 text-green-500 mr-3" />
              Common Use Cases
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 Financial Reports</h3>
                <p className="text-gray-600 text-sm">Extract income statements, balance sheets, and cash flow data for analysis.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🧾 Invoices & Receipts</h3>
                <p className="text-gray-600 text-sm">Pull line items and totals from invoices into trackable spreadsheets.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Survey Results</h3>
                <p className="text-gray-600 text-sm">Convert PDF reports with tabular survey data into analyzable spreadsheets.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📈 Sales Data</h3>
                <p className="text-gray-600 text-sm">Extract product lists, pricing, and sales figures for business intelligence.</p>
              </div>
            </div>

            <h2 id="best-practices" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              Best Practices
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Use PDFs with clear, well-structured tables for best results</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Native PDF tables convert better than scanned document images</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Review extracted data and verify numbers after conversion</p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Merged cells in PDFs may need manual adjustment in Excel</p>
              </div>
            </div>

            <h2 id="faq" className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <RefreshCw className="w-8 h-8 text-teal-500 mr-3" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will formulas be preserved?</h3>
                <p className="text-gray-600">PDFs don't contain formulas - only the displayed values. You'll get the numbers, which you can then add formulas to in Excel.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What about PDFs with multiple tables?</h3>
                <p className="text-gray-600">Multiple tables are detected and extracted. They may be placed on separate worksheets or stacked on a single sheet.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I convert scanned PDF documents?</h3>
                <p className="text-gray-600">Yes, but quality depends on scan clarity. Native PDFs (created digitally) produce significantly better results than scanned images.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Convert PDF to Excel?</h2>
          <p className="text-xl mb-8 opacity-90">Extract data and start analyzing in seconds</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/convert">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                <Table className="w-5 h-5 mr-2" />
                Convert Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/blog/convert-pdf-to-word" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <FileText className="w-10 h-10 text-blue-500 mb-4 group-hover:text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Convert PDF to Word</h3>
              <p className="text-gray-600 text-sm mb-3">Edit PDF content in Word format.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-blue-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-pdf-to-pptx" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <FileText className="w-10 h-10 text-orange-500 mb-4 group-hover:text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600">Convert PDF to PowerPoint</h3>
              <p className="text-gray-600 text-sm mb-3">Create presentations from PDFs.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-orange-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link to="/blog/convert-docx-to-pdf" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <Download className="w-10 h-10 text-red-500 mb-4 group-hover:text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600">Convert DOCX to PDF</h3>
              <p className="text-gray-600 text-sm mb-3">Create professional PDF documents.</p>
              <div className="flex items-center text-primary font-medium group-hover:text-red-600">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
