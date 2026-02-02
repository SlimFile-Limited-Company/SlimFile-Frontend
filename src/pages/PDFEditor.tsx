import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  FileUp,
  Download,
  Share2,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Eye,
  Save,
  PanelLeftClose,
  PanelRightClose,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Undo2,
  Redo2,
  Stamp,
  Ban,
  Combine,
  Scissors,
  Droplet,
  Lock,
  FileText,
  FileSearch,
  Users,
  MessageCircle
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
import OnlineUsers from '@/components/pdf-editor/collaboration/OnlineUsers';
import ActivityFeed from '@/components/pdf-editor/collaboration/ActivityFeed';
import ChatSidebar from '@/components/pdf-editor/collaboration/ChatSidebar';

// Main PDF Editor with Context
export default function PDFEditor() {
  return (
    <CollaborationProvider>
      <PDFEditorProvider>
        <PDFEditorContent />
      </PDFEditorProvider>
    </CollaborationProvider>
  );
}

// PDF Editor Content Component
function PDFEditorContent() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { documentState, loadPDF, viewState, zoomIn, zoomOut, nextPage, previousPage, goToPage, editState, setEditState, undo, redo, canUndo, canRedo } = usePDFEditor();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsLoading(true);
      try {
        await loadPDF(file);
        console.log('PDF loaded successfully:', file.name);
      } catch (error) {
        console.error('Failed to load PDF:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setIsLoading(true);
      try {
        await loadPDF(file);
        console.log('PDF loaded successfully:', file.name);
      } catch (error) {
        console.error('Failed to load PDF:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Keyboard shortcuts for undo/redo and tools
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo shortcuts
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
          console.log('Undo triggered via Ctrl+Z');
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
          console.log('Redo triggered via Ctrl+Y');
        }
      }

      // Tool shortcuts (when not in input field)
      if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        switch (e.key.toLowerCase()) {
          case 't':
            setEditState({ selectedTool: 'text' });
            break;
          case 'd':
            setEditState({ selectedTool: 'draw' });
            break;
          case 'h':
            setEditState({ selectedTool: 'highlight' });
            break;
          case 's':
            setEditState({ selectedTool: 'select' });
            break;
          case 'r':
            setEditState({ selectedTool: 'redact' });
            break;
          case 'escape':
            setEditState({ selectedTool: 'select' });
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setEditState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              SlimFile PDF Editor
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Edit, annotate, merge, split, and collaborate on PDFs in real-time.
              Completely free. No limits.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Eye className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Unlimited Pages</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Share2 className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Real-Time Collaboration</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Save className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Auto-Save</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          /* Loading State */
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-purple-600 mb-6 animate-pulse">
              <FileUp className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Loading PDF...
            </h2>
            <p className="text-gray-600">
              Please wait while we prepare your document
            </p>
          </div>
        ) : !documentState.fileName ? (
          /* Upload Section */
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-dashed border-gray-300 hover:border-red-500 transition-all">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-purple-600 mb-6">
                <FileUp className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upload Your PDF
              </h2>

              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Drag and drop your PDF file here, or click the button below to browse.
                Works with any PDF, any size, completely free.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileUp className="w-5 h-5 mr-2" />
                Select PDF File
              </Button>

              <p className="text-sm text-gray-500 mt-6">
                Supported format: PDF • No file size limit • Secure & Private
              </p>
            </div>
          </div>
        ) : (
          /* Editor Interface - 3-Column Layout */
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-[calc(100vh-200px)]">
            {/* Toolbar */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-300 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-gray-900 truncate max-w-md">
                  {documentState.fileName}
                </h2>
                <div className="text-sm text-gray-500">
                  {(documentState.fileSize / 1024 / 1024).toFixed(2)} MB
                  {documentState.isDirty && <span className="ml-2 text-red-600">• Unsaved</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Undo/Redo Buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* PDF Operations Buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMergeDialog(true)}
                  title="Merge PDFs"
                >
                  <Combine className="w-4 h-4 mr-1" />
                  Merge
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSplitDialog(true)}
                  title="Split PDF"
                >
                  <Scissors className="w-4 h-4 mr-1" />
                  Split
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWatermarkDialog(true)}
                  title="Add Watermark"
                >
                  <Droplet className="w-4 h-4 mr-1" />
                  Watermark
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Security, Forms, and OCR Buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecurityDialog(true)}
                  title="Security Settings"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  Security
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFormsDialog(true)}
                  title="PDF Forms"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Forms
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOCRDialog(true)}
                  title="OCR - Text Recognition"
                >
                  <FileSearch className="w-4 h-4 mr-1" />
                  OCR
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <Button variant="outline" size="sm" onClick={zoomOut}>
                  <ZoomOut className="w-4 h-4 mr-1" />
                  {Math.round(viewState.zoom * 100)}%
                </Button>
                <Button variant="outline" size="sm" onClick={zoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCw className="w-4 h-4 mr-1" />
                  Rotate
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Collaboration Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCollaborationDialog(true)}
                  className="bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700"
                  title="Start Collaboration"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Collaborate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChatSidebar(true)}
                  title="Team Chat"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            {/* Main Editor Layout */}
            <div className="flex h-[calc(100%-60px)]">
              {/* Left Sidebar - Page Thumbnails */}
              {viewState.showThumbnails && (
                <div className="w-60 bg-gray-50 border-r border-gray-300 overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-700">Pages</h3>
                      <Button variant="ghost" size="sm">
                        <PanelLeftClose className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Page Thumbnails */}
                    <div className="space-y-3">
                      {Array.from({ length: documentState.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <div key={pageNum} className="relative group">
                          <PageThumbnail
                            pageNumber={pageNum}
                            onClick={() => goToPage(pageNum)}
                          />
                          {/* Page Operations Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPageForOps(pageNum);
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg p-1.5 shadow-lg hover:bg-gray-50"
                          >
                            <Settings className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      ))}

                      {/* Add Page Button */}
                      <button
                        onClick={() => setShowAddPageDialog(true)}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-red-500 rounded-lg p-6 flex flex-col items-center justify-center gap-2 transition-all hover:bg-red-50 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                          <FileUp className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-red-600 transition-colors">
                          Add Page
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Center - Canvas */}
              <div className="flex-1 bg-gray-200 overflow-auto relative">
                <div className="min-h-full flex items-center justify-center p-8">
                  {/* PDF Canvas with PDF.js Rendering */}
                  <PDFCanvas className="max-w-full" />
                </div>

                {/* Page Navigation Overlay */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl border border-gray-300 px-6 py-3 flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={previousPage} disabled={documentState.currentPage <= 1}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
                    Page {documentState.currentPage} / {documentState.totalPages || 0}
                  </span>
                  <Button variant="ghost" size="sm" onClick={nextPage} disabled={documentState.currentPage >= (documentState.totalPages || 0)}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Right Sidebar - Properties */}
              {viewState.showProperties && (
                <div className="w-80 bg-gray-50 border-l border-gray-300 overflow-y-auto">
                  {/* Collaboration Components */}
                  <OnlineUsers />
                  <ActivityFeed />

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-700">Properties</h3>
                      <Button variant="ghost" size="sm">
                        <PanelRightClose className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Tool Selection */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annotation Tools
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { name: 'Select', value: 'select' },
                            { name: 'Text', value: 'text' },
                            { name: 'Draw', value: 'draw' },
                            { name: 'Highlight', value: 'highlight' },
                            { name: 'Shape', value: 'shape' },
                            { name: 'Stamp', value: 'stamp' },
                            { name: 'Redact', value: 'redact' },
                            { name: 'Eraser', value: 'eraser' },
                          ].map((tool) => (
                            <Button
                              key={tool.value}
                              variant={editState.selectedTool === tool.value ? 'default' : 'outline'}
                              size="sm"
                              className={`text-xs ${
                                editState.selectedTool === tool.value
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : ''
                              }`}
                              onClick={() => setEditState({ selectedTool: tool.value as any })}
                            >
                              {tool.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Drawing Options */}
                      {(editState.selectedTool === 'draw' || editState.selectedTool === 'highlight' || editState.selectedTool === 'shape') && (
                        <div className="space-y-4 border-t pt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Color
                            </label>
                            <div className="grid grid-cols-6 gap-2">
                              {[
                                { name: 'Red', value: '#ef4444' },
                                { name: 'Blue', value: '#3b82f6' },
                                { name: 'Green', value: '#10b981' },
                                { name: 'Yellow', value: '#eab308' },
                                { name: 'Purple', value: '#a855f7' },
                                { name: 'Black', value: '#000000' },
                              ].map((color) => (
                                <button
                                  key={color.value}
                                  className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-600 transition-all hover:scale-110"
                                  style={{ backgroundColor: color.value }}
                                  title={color.name}
                                  onClick={() => {
                                    // TODO: Update annotation color
                                    console.log('Selected color:', color.value);
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          {editState.selectedTool !== 'highlight' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thickness
                              </label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min="1"
                                  max="10"
                                  defaultValue="3"
                                  className="flex-1"
                                  onChange={(e) => {
                                    // TODO: Update line thickness
                                    console.log('Thickness:', e.target.value);
                                  }}
                                />
                                <span className="text-sm text-gray-600 w-8">3px</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          View Options
                        </label>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Maximize2 className="w-4 h-4 mr-2" />
                            Full Screen
                          </Button>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Document Info</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Pages: {documentState.totalPages || 'Loading...'}</div>
                          <div>Size: {(documentState.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                          <div>Zoom: {Math.round(viewState.zoom * 100)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Edit & Annotate</h3>
            <p className="text-gray-600">
              Add text, draw, highlight, and annotate PDFs with professional tools.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Collaboration</h3>
            <p className="text-gray-600">
              Work together with your team in real-time with live cursors and chat.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your files are encrypted and automatically deleted after 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {selectedPageForOps && (
        <PageOperationsDialog
          pageNumber={selectedPageForOps}
          onClose={() => setSelectedPageForOps(null)}
        />
      )}

      <AddPageDialog
        isOpen={showAddPageDialog}
        onClose={() => setShowAddPageDialog(false)}
      />

      {/* Merge PDF Dialog */}
      <MergePDFDialog
        isOpen={showMergeDialog}
        onClose={() => setShowMergeDialog(false)}
        currentPDF={documentState.pdfDoc as File}
      />

      {/* Split PDF Dialog */}
      <SplitPDFDialog
        isOpen={showSplitDialog}
        onClose={() => setShowSplitDialog(false)}
      />

      {/* Watermark Dialog */}
      <WatermarkDialog
        isOpen={showWatermarkDialog}
        onClose={() => setShowWatermarkDialog(false)}
      />

      {/* Security Dialog */}
      <SecurityDialog
        isOpen={showSecurityDialog}
        onClose={() => setShowSecurityDialog(false)}
      />

      {/* Forms Dialog */}
      <FormsDialog
        isOpen={showFormsDialog}
        onClose={() => setShowFormsDialog(false)}
      />

      {/* OCR Dialog */}
      <OCRDialog
        isOpen={showOCRDialog}
        onClose={() => setShowOCRDialog(false)}
      />

      {/* Collaboration Dialog */}
      <CollaborationDialog
        isOpen={showCollaborationDialog}
        onClose={() => setShowCollaborationDialog(false)}
      />

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={showChatSidebar}
        onClose={() => setShowChatSidebar(false)}
      />
    </div>
  );
}
