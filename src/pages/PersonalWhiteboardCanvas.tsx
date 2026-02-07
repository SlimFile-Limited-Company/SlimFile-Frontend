import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, FabricObject, PencilBrush, Circle, Rect, Line, IText } from 'fabric';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Pencil,
  Square,
  CircleDot,
  Minus,
  Type,
  Eraser,
  MousePointer,
  Trash2,
  Save,
  Download,
  Loader2,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

// Types
interface WhiteboardData {
  _id: string;
  name: string;
  description: string;
  canvasData?: any;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

type DrawingTool = 'select' | 'pen' | 'rectangle' | 'circle' | 'line' | 'text' | 'eraser';

const COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'];

const PersonalWhiteboardCanvas = () => {
  const { whiteboardId } = useParams<{ whiteboardId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [whiteboard, setWhiteboard] = useState<WhiteboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [selectedTool, setSelectedTool] = useState<DrawingTool>('pen');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState([3]);

  // Drawing state
  const isDrawingRef = useRef(false);
  const drawingObjectRef = useRef<FabricObject | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<number>(Date.now());

  const loadWhiteboard = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(
        `${API_BASE_URL}/my-whiteboards/${whiteboardId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to load whiteboard');

      const data = await response.json();
      setWhiteboard(data.whiteboard);

      // Load canvas data
      if (data.whiteboard.canvasData && fabricCanvasRef.current) {
        try {
          const canvasData = typeof data.whiteboard.canvasData === 'string'
            ? JSON.parse(data.whiteboard.canvasData)
            : data.whiteboard.canvasData;
          fabricCanvasRef.current.loadFromJSON(canvasData, () => {
            fabricCanvasRef.current?.renderAll();
          });
        } catch (error) {
          console.error('Error loading canvas data:', error);
        }
      }
    } catch (error) {
      console.error('Error loading whiteboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to load whiteboard',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveWhiteboard = useCallback(async (isAutoSave = false) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    try {
      if (!isAutoSave) setIsSaving(true);

      const canvasData = JSON.stringify(canvas.toJSON());
      const token = localStorage.getItem('jwt');

      const response = await fetch(
        `${API_BASE_URL}/my-whiteboards/${whiteboardId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ canvasData }),
        }
      );

      if (!response.ok) throw new Error('Failed to save whiteboard');

      lastSaveTimeRef.current = Date.now();

      if (!isAutoSave) {
        toast({
          title: 'Saved',
          description: 'Whiteboard saved successfully',
        });
      }
    } catch (error) {
      console.error('Error saving whiteboard:', error);
      if (!isAutoSave) {
        toast({
          title: 'Error',
          description: 'Failed to save whiteboard',
          variant: 'destructive',
        });
      }
    } finally {
      if (!isAutoSave) setIsSaving(false);
    }
  }, [whiteboardId, toast]);

  const exportCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    try {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      });

      const link = document.createElement('a');
      link.download = `${whiteboard?.name || 'whiteboard'}_${Date.now()}.png`;
      link.href = dataURL;
      link.click();

      toast({
        title: 'Exported',
        description: 'Whiteboard exported as PNG',
      });
    } catch (error) {
      console.error('Error exporting canvas:', error);
      toast({
        title: 'Error',
        description: 'Failed to export whiteboard',
        variant: 'destructive',
      });
    }
  };

  const clearCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (!confirm('Are you sure you want to clear the entire canvas?')) return;

    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
    saveWhiteboard(true);

    toast({
      title: 'Cleared',
      description: 'Canvas cleared successfully',
    });
  };

  // Initialize canvas
  useEffect(() => {
    // Wait for loading to complete before initializing canvas
    if (isLoading) return;
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: '#ffffff',
      isDrawingMode: false,
      selection: true,
    });

    fabricCanvasRef.current = canvas;
    setIsCanvasReady(true);

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && canvas) {
        canvas.setWidth(containerRef.current.clientWidth);
        canvas.setHeight(containerRef.current.clientHeight);
        canvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
      setIsCanvasReady(false);
    };
  }, [isLoading]);

  // Load whiteboard data
  useEffect(() => {
    loadWhiteboard();
  }, [whiteboardId]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setInterval(() => {
      if (Date.now() - lastSaveTimeRef.current > 10000) {
        saveWhiteboard(true);
      }
    }, 10000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [saveWhiteboard]);

  // Update tool settings and event handlers when tool changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isCanvasReady) {
      return;
    }

    // Remove old event listeners
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.off('object:modified');
    canvas.off('path:created');

    const handleMouseDown = (event: any) => {
      if (selectedTool === 'select' || selectedTool === 'pen' || selectedTool === 'eraser') return;

      isDrawingRef.current = true;
      const pointer = canvas.getScenePoint(event.e);
      startPointRef.current = { x: pointer.x, y: pointer.y };

      if (selectedTool === 'text') {
        const text = new IText('Type here...', {
          left: pointer.x,
          top: pointer.y,
          fill: selectedColor,
          fontSize: brushSize[0] * 10,
          fontFamily: 'Arial',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        isDrawingRef.current = false;
        canvas.requestRenderAll();
      }
    };

    const handleMouseMove = (event: any) => {
      if (!isDrawingRef.current || !startPointRef.current) return;
      if (selectedTool === 'select' || selectedTool === 'pen' || selectedTool === 'eraser' || selectedTool === 'text') return;

      const pointer = canvas.getScenePoint(event.e);

      // Remove previous preview object
      if (drawingObjectRef.current) {
        canvas.remove(drawingObjectRef.current);
      }

      const startX = startPointRef.current.x;
      const startY = startPointRef.current.y;
      const width = pointer.x - startX;
      const height = pointer.y - startY;

      let obj: FabricObject | null = null;

      switch (selectedTool) {
        case 'rectangle':
          obj = new Rect({
            left: Math.min(startX, pointer.x),
            top: Math.min(startY, pointer.y),
            width: Math.abs(width),
            height: Math.abs(height),
            fill: 'transparent',
            stroke: selectedColor,
            strokeWidth: brushSize[0],
          });
          break;

        case 'circle':
          const radius = Math.sqrt(width * width + height * height) / 2;
          obj = new Circle({
            left: startX,
            top: startY,
            radius: Math.abs(radius),
            fill: 'transparent',
            stroke: selectedColor,
            strokeWidth: brushSize[0],
            originX: 'center',
            originY: 'center',
          });
          break;

        case 'line':
          obj = new Line([startX, startY, pointer.x, pointer.y], {
            stroke: selectedColor,
            strokeWidth: brushSize[0],
          });
          break;
      }

      if (obj) {
        canvas.add(obj);
        drawingObjectRef.current = obj;
        canvas.requestRenderAll();
      }
    };

    const handleMouseUp = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      drawingObjectRef.current = null;
      startPointRef.current = null;
      saveWhiteboard(true);
    };

    const handleObjectModified = () => {
      saveWhiteboard(true);
    };

    const handlePathCreated = () => {
      saveWhiteboard(true);
    };

    // Configure canvas based on selected tool
    if (selectedTool === 'pen') {
      canvas.isDrawingMode = true;
      canvas.selection = false;
      const brush = new PencilBrush(canvas);
      brush.color = selectedColor;
      brush.width = brushSize[0];
      canvas.freeDrawingBrush = brush;
      canvas.defaultCursor = 'crosshair';
    } else if (selectedTool === 'eraser') {
      canvas.isDrawingMode = true;
      canvas.selection = false;
      const brush = new PencilBrush(canvas);
      brush.color = '#ffffff';
      brush.width = brushSize[0] * 3;
      canvas.freeDrawingBrush = brush;
      canvas.defaultCursor = 'crosshair';
    } else if (selectedTool === 'select') {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.defaultCursor = 'default';
    } else {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
    }

    // Add event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('path:created', handlePathCreated);

    canvas.requestRenderAll();

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('path:created', handlePathCreated);
    };
  }, [selectedTool, selectedColor, brushSize, saveWhiteboard, isCanvasReady]);

  const tools: { id: DrawingTool; icon: any; label: string }[] = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: CircleDot, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b shadow-sm flex-shrink-0">
        <div className="px-2 sm:px-4 py-2 sm:py-3">
          {/* Top row - Header and actions */}
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-whiteboards')}
                className="px-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Back</span>
              </Button>
              <div className="hidden md:block">
                <h2 className="font-semibold text-gray-900 text-sm">{whiteboard?.name}</h2>
                <p className="text-xs text-gray-500">{whiteboard?.description || 'Personal whiteboard'}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="outline" size="sm" onClick={clearCanvas} className="px-2 sm:px-3">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Clear</span>
              </Button>

              <Button variant="outline" size="sm" onClick={exportCanvas} className="px-2 sm:px-3">
                <Download className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Export</span>
              </Button>

              <Button
                size="sm"
                onClick={() => saveWhiteboard(false)}
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 px-2 sm:px-3"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Save</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Bottom row - Tools and settings */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            {/* Tools */}
            <div className="flex items-center gap-1 flex-wrap">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    title={tool.label}
                    className={`w-8 h-8 p-0 sm:w-9 sm:h-9 ${selectedTool === tool.id ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-300" />

            {/* Color picker - scrollable on mobile */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded border-2 transition-all flex-shrink-0 ${
                    selectedColor === color ? 'border-purple-600 scale-110 shadow-md' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-300" />

            {/* Brush size */}
            <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[100px]">
              <span className="text-xs text-gray-600 flex-shrink-0">Size:</span>
              <Slider
                value={brushSize}
                onValueChange={setBrushSize}
                min={1}
                max={20}
                step={1}
                className="flex-1 sm:w-16"
              />
              <span className="text-xs text-gray-600 w-6 text-right">{brushSize[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="relative flex-1 w-full bg-white overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default PersonalWhiteboardCanvas;
