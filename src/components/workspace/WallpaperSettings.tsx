import { useState, useRef } from 'react';
import { Palette, Upload, Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ChatSettings, WallpaperPreset } from '@/services/workspaceService';

interface WallpaperSettingsProps {
  workspaceId: string;
  currentSettings: ChatSettings | null;
  presets: WallpaperPreset[];
  onUpdateWallpaper: (type: 'preset' | 'color' | 'custom', value?: string, file?: File) => Promise<void>;
  trigger?: React.ReactNode;
}

// Default presets if not loaded from server
const DEFAULT_PRESETS: WallpaperPreset[] = [
  { id: 'default', name: 'Default', type: 'gradient', value: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' },
  { id: 'gradient-blue', name: 'Ocean Blue', type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient-purple', name: 'Purple Dream', type: 'gradient', value: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' },
  { id: 'gradient-green', name: 'Forest', type: 'gradient', value: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)' },
  { id: 'gradient-sunset', name: 'Sunset', type: 'gradient', value: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
  { id: 'gradient-dark', name: 'Midnight', type: 'gradient', value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
  { id: 'solid-white', name: 'Clean White', type: 'solid', value: '#ffffff' },
  { id: 'solid-cream', name: 'Warm Cream', type: 'solid', value: '#fef7ed' },
  { id: 'solid-slate', name: 'Slate', type: 'solid', value: '#f1f5f9' },
  { id: 'solid-dark', name: 'Dark Mode', type: 'solid', value: '#1e293b' }
];

export function WallpaperSettings({
  currentSettings,
  presets,
  onUpdateWallpaper,
  trigger
}: WallpaperSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availablePresets = presets.length > 0 ? presets : DEFAULT_PRESETS;
  const currentPresetId = currentSettings?.wallpaper?.type === 'preset'
    ? currentSettings.wallpaper.value
    : null;

  const handlePresetSelect = async (presetId: string) => {
    setIsSaving(true);
    try {
      await onUpdateWallpaper('preset', presetId);
    } finally {
      setIsSaving(false);
    }
  };

  const handleColorSelect = async () => {
    setIsSaving(true);
    try {
      await onUpdateWallpaper('color', selectedColor);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      setPreviewFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCustomUpload = async () => {
    if (!previewFile) return;

    setIsSaving(true);
    try {
      await onUpdateWallpaper('custom', undefined, previewFile);
      setPreviewFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const clearPreview = () => {
    setPreviewFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getPresetStyle = (preset: WallpaperPreset) => {
    if (preset.type === 'solid') {
      return { backgroundColor: preset.value };
    }
    return { background: preset.value };
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Palette className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="w-[350px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Chat Wallpaper
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="presets" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="color">Solid Color</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          {/* Presets Tab */}
          <TabsContent value="presets" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {availablePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  disabled={isSaving}
                  className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    currentPresetId === preset.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={getPresetStyle(preset)}
                >
                  {currentPresetId === preset.id && (
                    <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1">
                    <span className="text-white text-xs font-medium">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* Solid Color Tab */}
          <TabsContent value="color" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Select a color</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-16 h-16 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>

            <div
              className="h-32 rounded-lg border"
              style={{ backgroundColor: selectedColor }}
            />

            <Button
              onClick={handleColorSelect}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Apply Color
            </Button>
          </TabsContent>

          {/* Custom Upload Tab */}
          <TabsContent value="custom" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Upload your own image</Label>
              <p className="text-xs text-slate-500">
                Max file size: 5MB. Supported: JPG, PNG, WebP, GIF
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={clearPreview}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors flex flex-col items-center justify-center gap-2"
              >
                <Upload className="h-8 w-8 text-slate-400" />
                <span className="text-sm text-slate-500">
                  Click to select an image
                </span>
              </button>
            )}

            {previewFile && (
              <Button
                onClick={handleCustomUpload}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload & Apply
              </Button>
            )}

            {currentSettings?.wallpaper?.type === 'custom' && currentSettings.wallpaper.value && (
              <div className="space-y-2">
                <Label>Current wallpaper</Label>
                <img
                  src={currentSettings.wallpaper.value}
                  alt="Current wallpaper"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Helper function to get CSS background style from wallpaper settings
 */
export function getWallpaperStyle(
  settings: ChatSettings | null,
  presets: WallpaperPreset[]
): React.CSSProperties {
  if (!settings?.wallpaper) {
    return { background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' };
  }

  const { type, value } = settings.wallpaper;

  if (type === 'preset') {
    const preset = presets.find(p => p.id === value) || DEFAULT_PRESETS.find(p => p.id === value);
    if (preset) {
      return preset.type === 'solid'
        ? { backgroundColor: preset.value }
        : { background: preset.value };
    }
    return { background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' };
  }

  if (type === 'color') {
    return { backgroundColor: value };
  }

  if (type === 'custom' && value) {
    return {
      backgroundImage: `url(${value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }

  return { background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' };
}
