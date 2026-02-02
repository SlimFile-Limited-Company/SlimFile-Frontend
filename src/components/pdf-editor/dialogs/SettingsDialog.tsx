import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Settings as SettingsIcon, Monitor, Moon, Sun } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditorSettings {
  theme: 'light' | 'dark' | 'auto';
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // in seconds
  showGridLines: boolean;
  snapToGrid: boolean;
  defaultZoom: number;
  smoothScrolling: boolean;
  showPageNumbers: boolean;
  showRulers: boolean;
  highlightLinks: boolean;
  enableSpellCheck: boolean;
  maxUndoHistory: number;
}

const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'light',
  autoSaveEnabled: true,
  autoSaveInterval: 30,
  showGridLines: false,
  snapToGrid: false,
  defaultZoom: 100,
  smoothScrolling: true,
  showPageNumbers: true,
  showRulers: false,
  highlightLinks: true,
  enableSpellCheck: true,
  maxUndoHistory: 50,
};

export default function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<'general' | 'editor' | 'performance'>('general');

  if (!isOpen) return null;

  const handleSave = () => {
    // TODO: Save settings to localStorage or backend
    localStorage.setItem('pdf-editor-settings', JSON.stringify(settings));
    onClose();
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const updateSetting = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600">Customize your PDF editing experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'general', label: 'General' },
            { id: 'editor', label: 'Editor' },
            { id: 'performance', label: 'Performance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-red-600 border-red-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'auto', label: 'Auto', icon: Monitor },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting('theme', option.value as any)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      settings.theme === option.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <option.icon className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Auto-Save
                  </label>
                  <p className="text-xs text-gray-500">
                    Automatically save your work
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSaveEnabled}
                  onChange={(e) => updateSetting('autoSaveEnabled', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
              </div>

              {settings.autoSaveEnabled && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1">
                    Save interval (seconds): {settings.autoSaveInterval}
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={10}
                    value={settings.autoSaveInterval}
                    onChange={(e) =>
                      updateSetting('autoSaveInterval', parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Zoom Level
              </label>
              <select
                value={settings.defaultZoom}
                onChange={(e) => updateSetting('defaultZoom', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
                <option value={125}>125%</option>
                <option value={150}>150%</option>
                <option value={200}>200%</option>
              </select>
            </div>
          </div>
        )}

        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <div className="space-y-4">
            {[
              {
                key: 'showGridLines',
                label: 'Show Grid Lines',
                description: 'Display grid overlay for alignment',
              },
              {
                key: 'snapToGrid',
                label: 'Snap to Grid',
                description: 'Align objects to grid automatically',
              },
              {
                key: 'showPageNumbers',
                label: 'Show Page Numbers',
                description: 'Display page numbers on thumbnails',
              },
              {
                key: 'showRulers',
                label: 'Show Rulers',
                description: 'Display rulers around the canvas',
              },
              {
                key: 'highlightLinks',
                label: 'Highlight Links',
                description: 'Highlight clickable links in the PDF',
              },
              {
                key: 'enableSpellCheck',
                label: 'Enable Spell Check',
                description: 'Check spelling in text annotations',
              },
              {
                key: 'smoothScrolling',
                label: 'Smooth Scrolling',
                description: 'Enable smooth page transitions',
              },
            ].map((option) => (
              <div key={option.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings[option.key as keyof EditorSettings] as boolean}
                  onChange={(e) =>
                    updateSetting(option.key as any, e.target.checked)
                  }
                  className="w-4 h-4 text-red-600 rounded"
                />
              </div>
            ))}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Undo History Limit
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={10}
                  value={settings.maxUndoHistory}
                  onChange={(e) =>
                    updateSetting('maxUndoHistory', parseInt(e.target.value))
                  }
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-700 min-w-[3ch]">
                  {settings.maxUndoHistory}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Higher values use more memory
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-900">
                <strong>Performance Tips:</strong>
              </p>
              <ul className="text-sm text-yellow-900 mt-2 space-y-1 ml-4">
                <li>• Close unused PDFs to free up memory</li>
                <li>• Reduce undo history for large documents</li>
                <li>• Disable smooth scrolling on slower devices</li>
                <li>• Use lower zoom levels for better performance</li>
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
