import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MousePointer2, Type, Pen, Highlighter, Square, Stamp, EyeOff,
  ZoomIn, ZoomOut, Undo2, Redo2, Download, ChevronLeft, ChevronRight,
  FileUp, PanelRight, X, Settings, Scissors, Combine, Droplet, Lock,
  FileText, FileSearch, Users, MessageCircle, RotateCw, ChevronDown,
} from 'lucide-react';
import { PDFEditorProvider, usePDFEditor } from '@/contexts/PDFEditorContext';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import PDFCanvas from '@/components/pdf-editor/PDFCanvas';
import PageThumbnail from '@/components/pdf-editor/PageThumbnail';
import PageOperationsDialog from '@/components/pdf-editor/dialogs/PageOperationsDialog';
import AddPageDialog from '@/components/pdf-editor/dialogs/AddPageDialog';
import MergePDFDialog from '@/components/pdf-editor/dialogs/MergePDFDialog';
import SplitPDFDialog from '@/components/pdf-editor/dialogs/SplitPDFDialog';
import WatermarkDialog from '@/components/pdf-editor/dialogs/WatermarkDialog';
import SecurityDialog from '@/components/pdf-editor/dialogs/SecurityDialog';
import FormsDialog from '@/components/pdf-editor/dialogs/FormsDialog';
import OCRDialog from '@/components/pdf-editor/dialogs/OCRDialog';
import CollaborationDialog from '@/components/pdf-editor/dialogs/CollaborationDialog';
import ChatSidebar from '@/components/pdf-editor/collaboration/ChatSidebar';

export default function PDFEditor() {
  return (
    <CollaborationProvider>
      <PDFEditorProvider>
        <PDFEditorContent />
      </PDFEditorProvider>
    </CollaborationProvider>
  );
}

// Tool definitions
const TOOLS = [
  { id: 'select',    Icon: MousePointer2, label: 'Select',    shortcut: 'S' },
  { id: 'text',      Icon: Type,          label: 'Text',      shortcut: 'T' },
  { id: 'draw',      Icon: Pen,           label: 'Draw',      shortcut: 'D' },
  { id: 'highlight', Icon: Highlighter,   label: 'Highlight', shortcut: 'H' },
  { id: 'shape',     Icon: Square,        label: 'Shape',     shortcut: 'G' },
  { id: 'stamp',     Icon: Stamp,         label: 'Stamp',     shortcut: '' },
  { id: 'redact',    Icon: EyeOff,        label: 'Redact',    shortcut: 'R' },
] as const;

const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200];

const DRAW_COLORS = [
  { label: 'Red',    value: '#ef4444' },
  { label: 'Blue',   value: '#3b82f6' },
  { label: 'Green',  value: '#10b981' },
  { label: 'Yellow', value: '#eab308' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Black',  value: '#000000' },
];

function PDFEditorContent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    documentState, loadPDF, savePDF,
    viewState, zoomIn, zoomOut, setZoom,
    editState, setEditState,
    documentState: { currentPage, totalPages },
    nextPage, previousPage, goToPage,
    undo, redo, canUndo, canRedo,
  } = usePDFEditor();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(3);
  const [selectedPageForOps, setSelectedPageForOps] = useState<number | null>(null);
  const [showAddPageDialog, setShowAddPageDialog] = useState(false);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [showWatermarkDialog, setShowWatermarkDialog] = useState(false);
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [showFormsDialog, setShowFormsDialog] = useState(false);
  const [showOCRDialog, setShowOCRDialog] = useState(false);
  const [showCollaborationDialog, setShowCollaborationDialog] = useState(false);
  const [showChatSidebar, setShowChatSidebar] = useState(false);
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
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = documentState.fileName.replace(/\.pdf$/i, '') + '_edited.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // If no annotations, download original file
        const url = URL.createObjectURL(documentState.pdfDoc as File);
        const a = document.createElement('a');
        a.href = url;
        a.download = documentState.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [savePDF, documentState.fileName, documentState.pdfDoc]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleDownload(); return; }
      switch (e.key.toLowerCase()) {
        case 's': setEditState({ selectedTool: 'select' }); break;
        case 't': setEditState({ selectedTool: 'text' }); break;
        case 'd': setEditState({ selectedTool: 'draw' }); break;
        case 'h': setEditState({ selectedTool: 'highlight' }); break;
        case 'g': setEditState({ selectedTool: 'shape' }); break;
        case 'r': setEditState({ selectedTool: 'redact' }); break;
        case 'escape': setEditState({ selectedTool: 'select' }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setEditState, handleDownload]);

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
              <h2 className="text-white text-2xl font-bold mb-3">Open a PDF</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Drag & drop your PDF here or click to browse.<br />
                Annotate, draw, highlight, and download — all free.
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

  // Editor screen
  const zoomPercent = Math.round(viewState.zoom * 100);
  const activeTool = editState.selectedTool;
  const showColorPicker = activeTool === 'draw' || activeTool === 'highlight' || activeTool === 'shape';

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

        {/* Zoom controls */}
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

        {/* More tools dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="h-8 px-3 rounded-lg flex items-center gap-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-sm"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Tools</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showMoreMenu && (
            <div className="absolute top-10 left-0 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 py-1 min-w-[180px]">
              {[
                { icon: Combine,    label: 'Merge PDFs',     action: () => setShowMergeDialog(true) },
                { icon: Scissors,   label: 'Split PDF',      action: () => setShowSplitDialog(true) },
                { icon: Droplet,    label: 'Watermark',      action: () => setShowWatermarkDialog(true) },
                { icon: Lock,       label: 'Security',       action: () => setShowSecurityDialog(true) },
                { icon: FileText,   label: 'Forms',          action: () => setShowFormsDialog(true) },
                { icon: FileSearch, label: 'OCR',            action: () => setShowOCRDialog(true) },
                { icon: Users,      label: 'Collaborate',    action: () => setShowCollaborationDialog(true) },
                { icon: MessageCircle, label: 'Team Chat',   action: () => setShowChatSidebar(true) },
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Panel toggles */}
        <button onClick={() => setShowThumbnails(!showThumbnails)} title="Toggle pages panel"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showThumbnails ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-700'}`}>
          <PanelRight className="w-4 h-4 scale-x-[-1]" />
        </button>
        <button onClick={() => setShowRightPanel(!showRightPanel)} title="Toggle properties"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showRightPanel ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-700'}`}>
          <PanelRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-zinc-700 mx-1" />

        {/* Download */}
        <button onClick={handleDownload} disabled={isSaving}
          className="h-8 px-4 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Download'}
        </button>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Tool Sidebar */}
        <div className="w-14 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-3 gap-1 flex-shrink-0">
          {TOOLS.map(({ id, Icon, label, shortcut }) => (
            <button key={id}
              onClick={() => setEditState({ selectedTool: id as any })}
              title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 group relative ${
                activeTool === id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}>
              <Icon className="w-5 h-5" />
              {/* Tooltip */}
              <div className="absolute left-12 bg-zinc-700 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {label}{shortcut && <span className="ml-1 text-zinc-400">{shortcut}</span>}
              </div>
            </button>
          ))}

          <div className="flex-1" />

          {/* Rotate page */}
          <button title="Rotate view"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Page Thumbnails Sidebar */}
        {showThumbnails && (
          <div className="w-52 bg-zinc-900 border-r border-zinc-800 flex flex-col flex-shrink-0 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Pages</span>
              <span className="text-zinc-500 text-xs">{totalPages}</span>
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

              {/* Add Page */}
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

        {/* Canvas Area */}
        <div className="flex-1 bg-[#2c2c2c] overflow-auto relative flex items-start justify-center"
          onClick={() => { setShowZoomMenu(false); setShowMoreMenu(false); }}>
          <div className="my-8">
            <PDFCanvas className="max-w-full" />
          </div>

          {/* Page Navigation */}
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
                onBlur={() => {
                  const n = parseInt(pageInput);
                  if (!isNaN(n)) goToPage(n);
                  setIsEditingPage(false);
                }}
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

        {/* Right Properties Panel */}
        {showRightPanel && (
          <div className="w-64 bg-zinc-900 border-l border-zinc-800 flex flex-col flex-shrink-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-white text-sm font-semibold">Properties</span>
              <button onClick={() => setShowRightPanel(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {/* Active Tool Info */}
              <div className="px-4 py-3 border-b border-zinc-800">
                <div className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Active Tool</div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600/20 flex items-center justify-center">
                    {(() => {
                      const tool = TOOLS.find(t => t.id === activeTool);
                      if (!tool) return null;
                      const { Icon } = tool;
                      return <Icon className="w-4 h-4 text-red-400" />;
                    })()}
                  </div>
                  <span className="text-white text-sm capitalize">{activeTool}</span>
                </div>
              </div>

              {/* Color picker */}
              {showColorPicker && (
                <div className="px-4 py-3 border-b border-zinc-800">
                  <div className="text-zinc-500 text-xs uppercase tracking-wider mb-2.5">Color</div>
                  <div className="grid grid-cols-6 gap-2">
                    {DRAW_COLORS.map((c) => (
                      <button key={c.value}
                        onClick={() => setSelectedColor(c.value)}
                        title={c.label}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          selectedColor === c.value ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Brush size */}
              {(activeTool === 'draw' || activeTool === 'highlight') && (
                <div className="px-4 py-3 border-b border-zinc-800">
                  <div className="text-zinc-500 text-xs uppercase tracking-wider mb-2.5">
                    Size — <span className="text-zinc-300">{brushSize}px</span>
                  </div>
                  <input
                    type="range" min="1" max="20" value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>
              )}

              {/* Document info */}
              <div className="px-4 py-3 border-b border-zinc-800">
                <div className="text-zinc-500 text-xs uppercase tracking-wider mb-2.5">Document</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Pages</span>
                    <span className="text-white font-medium">{totalPages}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Size</span>
                    <span className="text-white font-medium">{(documentState.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Zoom</span>
                    <span className="text-white font-medium">{zoomPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Keyboard shortcuts */}
              <div className="px-4 py-3">
                <div className="text-zinc-500 text-xs uppercase tracking-wider mb-2.5">Shortcuts</div>
                <div className="space-y-1">
                  {[
                    ['S', 'Select'],
                    ['T', 'Text'],
                    ['D', 'Draw'],
                    ['H', 'Highlight'],
                    ['G', 'Shape'],
                    ['R', 'Redact'],
                    ['Ctrl+Z', 'Undo'],
                    ['Ctrl+S', 'Download'],
                  ].map(([key, label]) => (
                    <div key={key} className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400">{label}</span>
                      <kbd className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded text-xs font-mono">{key}</kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {selectedPageForOps && (
        <PageOperationsDialog pageNumber={selectedPageForOps} onClose={() => setSelectedPageForOps(null)} />
      )}
      <AddPageDialog isOpen={showAddPageDialog} onClose={() => setShowAddPageDialog(false)} />
      <MergePDFDialog isOpen={showMergeDialog} onClose={() => setShowMergeDialog(false)} currentPDF={documentState.pdfDoc as File} />
      <SplitPDFDialog isOpen={showSplitDialog} onClose={() => setShowSplitDialog(false)} />
      <WatermarkDialog isOpen={showWatermarkDialog} onClose={() => setShowWatermarkDialog(false)} />
      <SecurityDialog isOpen={showSecurityDialog} onClose={() => setShowSecurityDialog(false)} />
      <FormsDialog isOpen={showFormsDialog} onClose={() => setShowFormsDialog(false)} />
      <OCRDialog isOpen={showOCRDialog} onClose={() => setShowOCRDialog(false)} />
      <CollaborationDialog isOpen={showCollaborationDialog} onClose={() => setShowCollaborationDialog(false)} />
      <ChatSidebar isOpen={showChatSidebar} onClose={() => setShowChatSidebar(false)} />
    </div>
  );
}
