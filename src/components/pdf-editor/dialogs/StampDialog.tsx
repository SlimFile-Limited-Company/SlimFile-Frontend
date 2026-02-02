import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Stamp, X } from 'lucide-react';

interface StampDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStamp: (stamp: StampType) => void;
}

export interface StampType {
  text: string;
  color: string;
  type: 'approved' | 'rejected' | 'confidential' | 'draft' | 'urgent' | 'reviewed' | 'final' | 'custom';
}

const PREDEFINED_STAMPS: StampType[] = [
  { text: 'APPROVED', color: '#10b981', type: 'approved' },
  { text: 'REJECTED', color: '#ef4444', type: 'rejected' },
  { text: 'CONFIDENTIAL', color: '#8b5cf6', type: 'confidential' },
  { text: 'DRAFT', color: '#f59e0b', type: 'draft' },
  { text: 'URGENT', color: '#ef4444', type: 'urgent' },
  { text: 'REVIEWED', color: '#3b82f6', type: 'reviewed' },
  { text: 'FINAL', color: '#059669', type: 'final' },
];

export default function StampDialog({ isOpen, onClose, onSelectStamp }: StampDialogProps) {
  const [customText, setCustomText] = useState('');
  const [customColor, setCustomColor] = useState('#6b7280');

  if (!isOpen) return null;

  const handleSelectStamp = (stamp: StampType) => {
    onSelectStamp(stamp);
    onClose();
  };

  const handleCustomStamp = () => {
    if (customText.trim()) {
      onSelectStamp({
        text: customText.toUpperCase(),
        color: customColor,
        type: 'custom',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Stamp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Select Stamp</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Predefined Stamps */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Predefined Stamps
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PREDEFINED_STAMPS.map((stamp) => (
              <button
                key={stamp.type}
                onClick={() => handleSelectStamp(stamp)}
                className="p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-center">
                  <div
                    className="px-6 py-3 border-3 rounded"
                    style={{
                      borderColor: stamp.color,
                      color: stamp.color,
                      borderWidth: '3px',
                      borderStyle: 'solid',
                    }}
                  >
                    <span className="text-lg font-bold">{stamp.text}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Stamp */}
        <div className="mb-6 pt-6 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Custom Stamp
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Text</label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter custom text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Color</label>
              <div className="flex gap-2">
                {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#6b7280'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setCustomColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      customColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {customText && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-xs text-gray-600 mb-2">Preview</label>
            <div className="flex items-center justify-center">
              <div
                className="px-6 py-3 border-3 rounded inline-block"
                style={{
                  borderColor: customColor,
                  color: customColor,
                  borderWidth: '3px',
                  borderStyle: 'solid',
                }}
              >
                <span className="text-lg font-bold">{customText.toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          {customText && (
            <Button
              onClick={handleCustomStamp}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Stamp className="w-4 h-4 mr-2" />
              Apply Custom Stamp
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
