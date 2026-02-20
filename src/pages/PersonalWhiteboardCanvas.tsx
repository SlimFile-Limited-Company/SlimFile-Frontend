import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, FabricObject, PencilBrush, Circle, Rect, Line, IText, Polygon, Polyline } from 'fabric';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
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
  Undo2,
  Redo2,
  Triangle,
  Star,
  ArrowRight,
  Diamond,
  Pen,
  Copy,
  ClipboardPaste,
  Check,
  X,
  Pipette,
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

type DrawingTool = 'select' | 'pen' | 'rectangle' | 'circle' | 'line' | 'text' | 'eraser' | 'triangle' | 'star' | 'arrow' | 'diamond' | 'highlighter';

const COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#8B4513', '#808080'];

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
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fillColor, setFillColor] = useState('transparent');
  const [showFillPicker, setShowFillPicker] = useState(false);

  // Pending canvas data (fetched before canvas is ready)
  const pendingCanvasDataRef = useRef<any>(null);

  // Drawing state
  const isDrawingRef = useRef(false);
  const drawingObjectRef = useRef<FabricObject | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<number>(Date.now());

  // Undo/Redo state
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const isUndoRedoActionRef = useRef(false);

  // Clipboard
  const clipboardRef = useRef<FabricObject | null>(null);

  const saveStateForUndo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isUndoRedoActionRef.current) return;
    const json = JSON.stringify(canvas.toJSON());
    undoStackRef.current.push(json);
    if (undoStackRef.current.length > 50) {
      undoStackRef.current.shift();
    }
    // Only clear redo stack when a new action is performed, not when just changing tools
    setCanUndo(true);
  }, []);

  const handleUndo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || undoStackRef.current.length === 0) return;

    isUndoRedoActionRef.current = true;
    const currentState = JSON.stringify(canvas.toJSON());
    redoStackRef.current.push(currentState);

    const previousState = undoStackRef.current.pop()!;
    canvas.loadFromJSON(JSON.parse(previousState), () => {
      canvas.renderAll();
      isUndoRedoActionRef.current = false;
      setCanUndo(undoStackRef.current.length > 0);
      setCanRedo(true);
    });
  }, []);

  const handleRedo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || redoStackRef.current.length === 0) return;

    isUndoRedoActionRef.current = true;
    const currentState = JSON.stringify(canvas.toJSON());
    undoStackRef.current.push(currentState);

    const nextState = redoStackRef.current.pop()!;
    canvas.loadFromJSON(JSON.parse(nextState), () => {
      canvas.renderAll();
      isUndoRedoActionRef.current = false;
      setCanUndo(true);
      setCanRedo(redoStackRef.current.length > 0);
    });
  }, []);

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
      setEditName(data.whiteboard.name);

      // Store canvas data — will be loaded once the canvas is initialized
      if (data.whiteboard.canvasData) {
        try {
          pendingCanvasDataRef.current = typeof data.whiteboard.canvasData === 'string'
            ? JSON.parse(data.whiteboard.canvasData)
            : data.whiteboard.canvasData;
        } catch (error) {
          console.error('Error parsing canvas data:', error);
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

  const saveWhiteboardName = async () => {
    if (!editName.trim() || editName === whiteboard?.name) {
      setIsEditingName(false);
      setEditName(whiteboard?.name || '');
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(
        `${API_BASE_URL}/my-whiteboards/${whiteboardId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: editName.trim() }),
        }
      );

      if (!response.ok) throw new Error('Failed to rename whiteboard');

      setWhiteboard(prev => prev ? { ...prev, name: editName.trim() } : null);
      setIsEditingName(false);
      toast({ title: 'Renamed', description: 'Whiteboard renamed successfully' });
    } catch (error) {
      console.error('Error renaming whiteboard:', error);
      toast({ title: 'Error', description: 'Failed to rename whiteboard', variant: 'destructive' });
      setEditName(whiteboard?.name || '');
      setIsEditingName(false);
    }
  };

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

    saveStateForUndo();
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
    saveWhiteboard(true);

    toast({
      title: 'Cleared',
      description: 'Canvas cleared successfully',
    });
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;

    saveStateForUndo();
    activeObjects.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    saveWhiteboard(true);
    // Clear redo stack after performing an action
    redoStackRef.current = [];
    setCanRedo(false);
  };

  const copySelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const active = canvas.getActiveObject();
    if (!active) return;

    active.clone().then((cloned: any) => {
      clipboardRef.current = cloned;
      toast({ title: 'Copied', description: 'Object copied to clipboard' });
    });
  };

  const pasteFromClipboard = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !clipboardRef.current) return;

    saveStateForUndo();
    clipboardRef.current.clone().then((cloned: any) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
      saveWhiteboard(true);
      // Clear redo stack after performing an action
      redoStackRef.current = [];
      setCanRedo(false);
    });
  };

  // Initialize canvas
  useEffect(() => {
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

    // Load any canvas data that was fetched before the canvas was ready
    if (pendingCanvasDataRef.current) {
      canvas.loadFromJSON(pendingCanvasDataRef.current, () => {
        canvas.renderAll();
      });
      pendingCanvasDataRef.current = null;
    }

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditingName) return;

      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y = Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
      // Delete/Backspace = delete selected (only if not editing text)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedTool === 'select') {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active && !(active instanceof IText && (active as IText).isEditing)) {
          e.preventDefault();
          deleteSelected();
        }
      }
      // Ctrl/Cmd + C = Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        copySelected();
      }
      // Ctrl/Cmd + V = Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        pasteFromClipboard();
      }
      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveWhiteboard(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedTool, isEditingName, saveWhiteboard]);

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
    canvas.off('object:added');

    const handleMouseDown = (event: any) => {
      if (selectedTool === 'select') return;

      // For pen/highlighter: save state before free drawing starts
      if (selectedTool === 'pen' || selectedTool === 'highlighter') {
        saveStateForUndo();
        redoStackRef.current = [];
        setCanRedo(false);
        return;
      }

      // Eraser: click on objects to remove them
      if (selectedTool === 'eraser') {
        const target = canvas.findTarget(event.e);
        if (target) {
          saveStateForUndo();
          canvas.remove(target);
          canvas.requestRenderAll();
          saveWhiteboard(true);
          // Clear redo stack after performing an action
          redoStackRef.current = [];
          setCanRedo(false);
        }
        return;
      }

      isDrawingRef.current = true;
      const pointer = canvas.getScenePoint(event.e);
      startPointRef.current = { x: pointer.x, y: pointer.y };

      if (selectedTool === 'text') {
        saveStateForUndo();
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
        // Clear redo stack after performing an action
        redoStackRef.current = [];
        setCanRedo(false);
      } else {
        // For shapes: save state before drawing starts
        saveStateForUndo();
        redoStackRef.current = [];
        setCanRedo(false);
      }
    };

    const handleMouseMove = (event: any) => {
      // Eraser hover cursor
      if (selectedTool === 'eraser') {
        const target = canvas.findTarget(event.e);
        canvas.defaultCursor = target ? 'not-allowed' : 'crosshair';
        return;
      }

      if (!isDrawingRef.current || !startPointRef.current) return;
      if (selectedTool === 'select' || selectedTool === 'pen' || selectedTool === 'highlighter' || selectedTool === 'text') return;

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
            fill: fillColor,
            stroke: selectedColor,
            strokeWidth: brushSize[0],
          });
          break;

        case 'circle': {
          const radius = Math.sqrt(width * width + height * height) / 2;
          obj = new Circle({
            left: startX,
            top: startY,
            radius: Math.abs(radius),
            fill: fillColor,
            stroke: selectedColor,
            strokeWidth: brushSize[0],
            originX: 'center',
            originY: 'center',
          });
          break;
        }

        case 'line':
          obj = new Line([startX, startY, pointer.x, pointer.y], {
            stroke: selectedColor,
            strokeWidth: brushSize[0],
          });
          break;

        case 'triangle': {
          const triWidth = Math.abs(width);
          const triHeight = Math.abs(height);
          const triLeft = Math.min(startX, pointer.x);
          const triTop = Math.min(startY, pointer.y);
          obj = new Polygon(
            [
              { x: triLeft + triWidth / 2, y: triTop },
              { x: triLeft + triWidth, y: triTop + triHeight },
              { x: triLeft, y: triTop + triHeight },
            ],
            {
              fill: fillColor,
              stroke: selectedColor,
              strokeWidth: brushSize[0],
            }
          );
          break;
        }

        case 'diamond': {
          const dw = Math.abs(width);
          const dh = Math.abs(height);
          const dl = Math.min(startX, pointer.x);
          const dt = Math.min(startY, pointer.y);
          obj = new Polygon(
            [
              { x: dl + dw / 2, y: dt },
              { x: dl + dw, y: dt + dh / 2 },
              { x: dl + dw / 2, y: dt + dh },
              { x: dl, y: dt + dh / 2 },
            ],
            {
              fill: fillColor,
              stroke: selectedColor,
              strokeWidth: brushSize[0],
            }
          );
          break;
        }

        case 'star': {
          const cx = (startX + pointer.x) / 2;
          const cy = (startY + pointer.y) / 2;
          const outerR = Math.max(Math.abs(width), Math.abs(height)) / 2;
          const innerR = outerR * 0.4;
          const points: { x: number; y: number }[] = [];
          for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (Math.PI / 5) * i - Math.PI / 2;
            points.push({
              x: cx + r * Math.cos(angle),
              y: cy + r * Math.sin(angle),
            });
          }
          obj = new Polygon(points, {
            fill: fillColor,
            stroke: selectedColor,
            strokeWidth: brushSize[0],
          });
          break;
        }

        case 'arrow': {
          const arrowHeadSize = Math.max(10, brushSize[0] * 4);
          const angle = Math.atan2(pointer.y - startY, pointer.x - startX);
          const headX = pointer.x;
          const headY = pointer.y;

          const line1 = new Line([startX, startY, pointer.x, pointer.y], {
            stroke: selectedColor,
            strokeWidth: brushSize[0],
          });

          const arrowHead = new Polygon(
            [
              { x: headX, y: headY },
              {
                x: headX - arrowHeadSize * Math.cos(angle - Math.PI / 6),
                y: headY - arrowHeadSize * Math.sin(angle - Math.PI / 6),
              },
              {
                x: headX - arrowHeadSize * Math.cos(angle + Math.PI / 6),
                y: headY - arrowHeadSize * Math.sin(angle + Math.PI / 6),
              },
            ],
            {
              fill: selectedColor,
              stroke: selectedColor,
              strokeWidth: 1,
            }
          );

          // Use line as preview, add arrowhead on mouseup
          obj = line1;
          break;
        }
      }

      if (obj) {
        canvas.add(obj);
        drawingObjectRef.current = obj;
        canvas.requestRenderAll();
      }
    };

    const handleMouseUp = (event: any) => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;

      // For arrow tool, add the arrowhead on completion
      if (selectedTool === 'arrow' && startPointRef.current && drawingObjectRef.current) {
        const pointer = canvas.getScenePoint(event.e);
        const arrowHeadSize = Math.max(10, brushSize[0] * 4);
        const angle = Math.atan2(pointer.y - startPointRef.current.y, pointer.x - startPointRef.current.x);

        const arrowHead = new Polygon(
          [
            { x: pointer.x, y: pointer.y },
            {
              x: pointer.x - arrowHeadSize * Math.cos(angle - Math.PI / 6),
              y: pointer.y - arrowHeadSize * Math.sin(angle - Math.PI / 6),
            },
            {
              x: pointer.x - arrowHeadSize * Math.cos(angle + Math.PI / 6),
              y: pointer.y - arrowHeadSize * Math.sin(angle + Math.PI / 6),
            },
          ],
          {
            fill: selectedColor,
            stroke: selectedColor,
            strokeWidth: 1,
          }
        );
        canvas.add(arrowHead);
      }

      drawingObjectRef.current = null;
      startPointRef.current = null;
      saveWhiteboard(true);
    };

    const handleObjectModified = () => {
      saveStateForUndo();
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
    } else if (selectedTool === 'highlighter') {
      canvas.isDrawingMode = true;
      canvas.selection = false;
      const brush = new PencilBrush(canvas);
      brush.color = selectedColor + '60'; // semi-transparent
      brush.width = brushSize[0] * 4;
      canvas.freeDrawingBrush = brush;
      canvas.defaultCursor = 'crosshair';
    } else if (selectedTool === 'eraser') {
      canvas.isDrawingMode = false;
      canvas.selection = false;
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
  }, [selectedTool, selectedColor, brushSize, fillColor, saveWhiteboard, saveStateForUndo, isCanvasReady]);

  const tools: { id: DrawingTool; icon: any; label: string }[] = [
    { id: 'select', icon: MousePointer, label: 'Select (V)' },
    { id: 'pen', icon: Pencil, label: 'Pen (P)' },
    { id: 'highlighter', icon: Pen, label: 'Highlighter' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: CircleDot, label: 'Circle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
    { id: 'diamond', icon: Diamond, label: 'Diamond' },
    { id: 'star', icon: Star, label: 'Star' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'text', icon: Type, label: 'Text (T)' },
    { id: 'eraser', icon: Eraser, label: 'Eraser (E)' },
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
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-whiteboards')}
                className="px-2 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Back</span>
              </Button>

              {/* Editable Name */}
              <div className="hidden md:flex items-center gap-1 min-w-0 flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveWhiteboardName();
                        if (e.key === 'Escape') {
                          setIsEditingName(false);
                          setEditName(whiteboard?.name || '');
                        }
                      }}
                      className="h-7 text-sm font-semibold w-48"
                      autoFocus
                    />
                    <Button variant="ghost" size="sm" onClick={saveWhiteboardName} className="h-7 w-7 p-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setIsEditingName(false); setEditName(whiteboard?.name || ''); }} className="h-7 w-7 p-0">
                      <X className="w-3 h-3 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-left hover:bg-gray-100 rounded px-2 py-1 transition-colors min-w-0"
                    title="Click to rename"
                  >
                    <h2 className="font-semibold text-gray-900 text-sm truncate">{whiteboard?.name}</h2>
                    <p className="text-xs text-gray-500 truncate">{whiteboard?.description || 'Click to rename'}</p>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Undo/Redo */}
              <Button variant="outline" size="sm" onClick={handleUndo} disabled={!canUndo} className="px-2" title="Undo (Ctrl+Z)">
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRedo} disabled={!canRedo} className="px-2" title="Redo (Ctrl+Y)">
                <Redo2 className="w-4 h-4" />
              </Button>

              <div className="hidden sm:block w-px h-6 bg-gray-300" />

              {/* Copy/Paste */}
              <Button variant="outline" size="sm" onClick={copySelected} className="px-2" title="Copy (Ctrl+C)">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={pasteFromClipboard} className="px-2" title="Paste (Ctrl+V)">
                <ClipboardPaste className="w-4 h-4" />
              </Button>

              <div className="hidden sm:block w-px h-6 bg-gray-300" />

              <Button variant="outline" size="sm" onClick={deleteSelected} className="px-2" title="Delete selected">
                <Trash2 className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={clearCanvas} className="px-2 sm:px-3">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="hidden sm:inline ml-2">Clear All</span>
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

            {/* Stroke Color picker */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded border-2 transition-all flex-shrink-0 ${
                    selectedColor === color ? 'border-purple-600 scale-110 shadow-md' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  title={`Stroke: ${color}`}
                />
              ))}
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-300" />

            {/* Fill color toggle */}
            <div className="relative flex items-center gap-1">
              <span className="text-xs text-gray-600 flex-shrink-0">Fill:</span>
              <button
                onClick={() => setShowFillPicker(!showFillPicker)}
                className="w-7 h-7 rounded border-2 border-gray-300 flex items-center justify-center"
                style={{ backgroundColor: fillColor === 'transparent' ? '#ffffff' : fillColor }}
                title="Fill color"
              >
                {fillColor === 'transparent' && <X className="w-3 h-3 text-red-400" />}
              </button>
              {showFillPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-50 flex flex-wrap gap-1 w-48">
                  <button
                    className={`w-7 h-7 rounded border-2 flex items-center justify-center ${fillColor === 'transparent' ? 'border-purple-600' : 'border-gray-300'}`}
                    onClick={() => { setFillColor('transparent'); setShowFillPicker(false); }}
                    title="No fill"
                  >
                    <X className="w-3 h-3 text-red-400" />
                  </button>
                  {COLORS.map((color) => (
                    <button
                      key={`fill-${color}`}
                      className={`w-7 h-7 rounded border-2 flex-shrink-0 ${fillColor === color ? 'border-purple-600 scale-110' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => { setFillColor(color); setShowFillPicker(false); }}
                    />
                  ))}
                </div>
              )}
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
