import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn, ZoomOut, Undo2, Redo2, Download, ChevronLeft, ChevronRight,
  FileUp, PanelLeft, X, Settings, Scissors, Combine,
  FileText, ChevronDown,
} from 'lucide-react';
import { PDFEditorProvider, usePDFEditor } from '@/contexts/PDFEditorContext';
import PDFCanvas from '@/components/pdf-editor/PDFCanvas';
import PageThumbnail from '@/components/pdf-editor/PageThumbnail';
import PageOperationsDialog from '@/components/pdf-editor/dialogs/PageOperationsDialog';
import AddPageDialog from '@/components/pdf-editor/dialogs/AddPageDialog';
import MergePDFDialog from '@/components/pdf-editor/dialogs/MergePDFDialog';
import SplitPDFDialog from '@/components/pdf-editor/dialogs/SplitPDFDialog';

export default function PDFEditor() {
  return (
    <PDFEditorProvider>
      <PDFEditorContent />
    </PDFEditorProvider>
  );
}

const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200];

function PDFEditorContent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    documentState, loadPDF, savePDF,
    viewState, zoomIn, zoomOut, setZoom,
    documentState: { currentPage, totalPages },
    nextPage, previousPage, goToPage,
    undo, redo, canUndo, canRedo,
  } = usePDFEditor();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [selectedPageForOps, setSelectedPageForOps] = useState<number | null>(null);
  const [showAddPageDialog, setShowAddPageDialog] = useState(false);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [isEditingPage, setIsEditingPage] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsLoading(true);
      try { await loadPDF(file); } catch (err) { console.error(err); } finally { setIsLoading(false); }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setIsLoading(true);
      try { await loadPDF(file); } catch (err) { console.error(err); } finally { setIsLoading(false); }
    }
  };

  const handleDownload = useCallback(async () => {
    setIsSaving(true);
    try {
      const blob = await savePDF();
      const url = URL.createObjectURL(blob ?? (documentState.pdfDoc as File));
      const a = document.createElement('a');
      a.href = url;
      a.download = blob
        ? documentState.fileName.replace(/\.pdf$/i, '') + '_edited.pdf'
        : documentState.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [savePDF, documentState.fileName, documentState.pdfDoc]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleDownload(); return; }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, handleDownload]);

  const hasFile = !!documentState.fileName;

  // Upload screen
  if (!hasFile) {
    return (
      <div className="h-screen bg-zinc-900 flex flex-col items-center justify-center pt-16">
        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />

        {isLoading ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FileUp className="w-10 h-10 text-red-400" />
            </div>
            <p className="text-white text-xl font-semibold mb-2">Loading PDF...</p>
            <p className="text-zinc-400 text-sm">Please wait</p>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer text-center max-w-md w-full mx-4"
          >
            <div className="border-2 border-dashed border-zinc-600 group-hover:border-red-500 rounded-3xl p-16 transition-all duration-200 group-hover:bg-red-500/5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
                <FileUp className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-3">Open a PDF to Edit</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Drag & drop your PDF here or click to browse.<br />
                Click any text on the page to edit it directly.
              </p>
              <div className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
                <FileUp className="w-4 h-4" />
                Select PDF File
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const zoomPercent = Math.round(viewState.zoom * 100);

  return (
    <div className="h-screen bg-zinc-900 flex flex-col pt-16 overflow-hidden">

      {/* Top Toolbar */}
      <div className="h-12 bg-zinc-800 border-b border-zinc-700 flex items-center px-3 gap-2 flex-shrink-0">

        {/* File name */}
        <div className="flex items-center gap-2 min-w-0 mr-2">
          <div className="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-3 h-3 text-red-400" />
          </div>
          <span className="text-white text-sm font-medium truncate max-w-[200px]">{documentState.fileName}</span>
          {documentState.isDirty && <span className="text-amber-400 text-xs font-medium flex-shrink-0">• Unsaved</span>}
        </div>

        <div className="w-px h-5 bg-zinc-700 mx-1" />

        {/* Undo / Redo */}
        <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Undo2 className="w-4 h-4" />
        </button>
        <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-zinc-700 mx-1" />

        {/* Zoom */}
        <button onClick={zoomOut} title="Zoom out"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className="h-8 px-2 rounded-lg flex items-center gap-1 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors text-sm font-medium min-w-[64px] justify-between"
          >
            <span>{zoomPercent}%</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showZoomMenu && (
            <div className="absolute top-10 left-0 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 py-1 min-w-[100px]">
              {ZOOM_PRESETS.map((z) => (
                <button key={z}
                  onClick={() => { setZoom(z / 100); setShowZoomMenu(false); }}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-zinc-700 transition-colors ${zoomPercent === z ? 'text-red-400' : 'text-zinc-300'}`}
                >
                  {z}%
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={zoomIn} title="Zoom in"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-zinc-700 mx-1" />

        {/* More tools */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="h-8 px-3 rounded-lg flex items-center gap-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-sm"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>More</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showMoreMenu && (
            <div className="absolute top-10 left-0 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 py-1 min-w-[160px]">
              {[
                { icon: Combine,  label: 'Merge PDFs', action: () => setShowMergeDialog(true) },
                { icon: Scissors, label: 'Split PDF',  action: () => setShowSplitDialog(true) },
              ].map(({ icon: Icon, label, action }) => (
                <button key={label}
                  onClick={() => { action(); setShowMoreMenu(false); }}
                  className="w-full px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-3 text-left">
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Toggle thumbnails */}
        <button onClick={() => setShowThumbnails(!showThumbnails)} title="Toggle pages panel"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showThumbnails ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-700'}`}>
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-zinc-700 mx-1" />

        {/* Download */}
        <button onClick={handleDownload} disabled={isSaving}
          className="h-8 px-4 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Download'}
        </button>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Page thumbnails sidebar */}
        {showThumbnails && (
          <div className="w-52 bg-zinc-900 border-r border-zinc-800 flex flex-col flex-shrink-0 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Pages</span>
              <div className="flex items-center gap-1">
                <span className="text-zinc-500 text-xs">{totalPages}</span>
                <button onClick={() => setShowThumbnails(false)} className="text-zinc-600 hover:text-zinc-400 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            {/* Download button */}
            <div className="px-2 py-2 border-b border-zinc-800">
              <button
                onClick={handleDownload}
                disabled={isSaving}
                className="w-full h-9 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Download PDF'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1.5 scrollbar-hide">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <div key={pageNum} className="relative group">
                  <div
                    onClick={() => goToPage(pageNum)}
                    className={`rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                      pageNum === currentPage ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-transparent hover:border-zinc-600'
                    }`}
                  >
                    <PageThumbnail pageNumber={pageNum} onClick={() => goToPage(pageNum)} />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedPageForOps(pageNum); }}
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 rounded-md p-1 shadow-lg hover:bg-zinc-700"
                  >
                    <Settings className="w-3 h-3 text-zinc-300" />
                  </button>
                  <div className="text-center mt-1">
                    <span className={`text-xs ${pageNum === currentPage ? 'text-red-400' : 'text-zinc-500'}`}>{pageNum}</span>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowAddPageDialog(true)}
                className="w-full border border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg p-3 flex flex-col items-center gap-1.5 transition-all hover:bg-zinc-800/50 group"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                  <FileUp className="w-4 h-4 text-zinc-400" />
                </div>
                <span className="text-xs text-zinc-500 group-hover:text-zinc-400">Add Page</span>
              </button>
            </div>
          </div>
        )}

        {/* Canvas area */}
        <div
          className="flex-1 bg-[#2c2c2c] overflow-auto relative flex items-start justify-center"
          onClick={() => { setShowZoomMenu(false); setShowMoreMenu(false); }}
        >
          <div className="my-8">
            <PDFCanvas className="max-w-full" />
          </div>

          {/* Page navigation pill */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-800/95 backdrop-blur border border-zinc-700 rounded-full px-4 py-2 shadow-2xl">
            <button onClick={previousPage} disabled={currentPage <= 1}
              className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {isEditingPage ? (
              <input
                autoFocus
                type="number"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={() => { const n = parseInt(pageInput); if (!isNaN(n)) goToPage(n); setIsEditingPage(false); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { const n = parseInt(pageInput); if (!isNaN(n)) goToPage(n); setIsEditingPage(false); }
                  if (e.key === 'Escape') setIsEditingPage(false);
                }}
                className="w-10 text-center text-white text-sm bg-zinc-700 rounded-lg py-0.5 outline-none"
              />
            ) : (
              <button
                onClick={() => { setPageInput(String(currentPage)); setIsEditingPage(true); }}
                className="text-zinc-300 text-sm font-medium hover:text-white transition-colors px-1"
              >
                {currentPage}
              </button>
            )}

            <span className="text-zinc-500 text-sm">/ {totalPages}</span>

            <button onClick={nextPage} disabled={currentPage >= totalPages}
              className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {selectedPageForOps && (
        <PageOperationsDialog pageNumber={selectedPageForOps} onClose={() => setSelectedPageForOps(null)} />
      )}
      <AddPageDialog isOpen={showAddPageDialog} onClose={() => setShowAddPageDialog(false)} />
      <MergePDFDialog isOpen={showMergeDialog} onClose={() => setShowMergeDialog(false)} currentPDF={documentState.pdfDoc as File} />
      <SplitPDFDialog isOpen={showSplitDialog} onClose={() => setShowSplitDialog(false)} />
    </div>
  );
}
