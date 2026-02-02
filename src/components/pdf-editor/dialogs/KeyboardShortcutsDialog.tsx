import { Button } from '@/components/ui/button';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutSection {
  title: string;
  shortcuts: Array<{
    keys: string;
    description: string;
  }>;
}

const SHORTCUT_SECTIONS: ShortcutSection[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: '←/→', description: 'Previous/Next page' },
      { keys: 'Home', description: 'First page' },
      { keys: 'End', description: 'Last page' },
      { keys: 'Ctrl + B', description: 'Toggle sidebar' },
      { keys: 'Ctrl + F', description: 'Toggle fullscreen' },
    ],
  },
  {
    title: 'Zoom & View',
    shortcuts: [
      { keys: 'Ctrl + +', description: 'Zoom in' },
      { keys: 'Ctrl + -', description: 'Zoom out' },
      { keys: 'Ctrl + 0', description: 'Fit to width' },
    ],
  },
  {
    title: 'Editing',
    shortcuts: [
      { keys: 'Ctrl + Z', description: 'Undo' },
      { keys: 'Ctrl + Y', description: 'Redo' },
      { keys: 'Delete', description: 'Delete selected' },
      { keys: 'Ctrl + A', description: 'Select all' },
      { keys: 'Ctrl + C', description: 'Copy' },
      { keys: 'Ctrl + V', description: 'Paste' },
      { keys: 'Ctrl + X', description: 'Cut' },
    ],
  },
  {
    title: 'Tools',
    shortcuts: [
      { keys: 'S', description: 'Select tool' },
      { keys: 'T', description: 'Text tool' },
      { keys: 'D', description: 'Draw tool' },
      { keys: 'H', description: 'Highlight tool' },
      { keys: 'R', description: 'Shape tool' },
      { keys: 'P', description: 'Stamp tool' },
      { keys: 'X', description: 'Redact tool' },
      { keys: 'Escape', description: 'Cancel/Deselect' },
    ],
  },
  {
    title: 'File',
    shortcuts: [
      { keys: 'Ctrl + S', description: 'Save' },
      { keys: 'Ctrl + P', description: 'Print' },
      { keys: 'Ctrl + W', description: 'Close document' },
    ],
  },
  {
    title: 'Help',
    shortcuts: [
      { keys: '?', description: 'Show this help' },
    ],
  },
];

export default function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Keyboard Shortcuts</h3>
              <p className="text-sm text-gray-600">Master SlimFile PDF Editor like a pro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {SHORTCUT_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                {section.title}
              </h4>
              <div className="space-y-2">
                {section.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded shadow-sm">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Pro Tip:</strong> Press <kbd className="px-1 py-0.5 text-xs font-semibold text-blue-800 bg-white border border-blue-300 rounded">?</kbd> anytime to open this help dialog.
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <Button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
}
