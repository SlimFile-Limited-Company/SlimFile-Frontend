import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Square, Circle, ArrowRight, Minus, X } from 'lucide-react';

interface ShapeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShape: (shape: ShapeType) => void;
}

export type ShapeType = 'rectangle' | 'circle' | 'line' | 'arrow';

const SHAPES = [
  { name: 'Rectangle', value: 'rectangle' as ShapeType, icon: Square },
  { name: 'Circle', value: 'circle' as ShapeType, icon: Circle },
  { name: 'Line', value: 'line' as ShapeType, icon: Minus },
  { name: 'Arrow', value: 'arrow' as ShapeType, icon: ArrowRight },
];

export default function ShapeDialog({ isOpen, onClose, onSelectShape }: ShapeDialogProps) {
  if (!isOpen) return null;

  const handleSelectShape = (shape: ShapeType) => {
    onSelectShape(shape);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Select Shape</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shape Options */}
        <div className="grid grid-cols-2 gap-3">
          {SHAPES.map((shape) => {
            const Icon = shape.icon;
            return (
              <button
                key={shape.value}
                onClick={() => handleSelectShape(shape.value)}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6 text-gray-600 group-hover:text-red-600 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                    {shape.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            Click and drag on the canvas to draw the selected shape.
          </p>
        </div>
      </div>
    </div>
  );
}
