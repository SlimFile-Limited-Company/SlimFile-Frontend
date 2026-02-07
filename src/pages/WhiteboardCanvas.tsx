import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, FabricObject, PencilBrush, Circle, Rect, Line, IText, FabricImage } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { getSocket } from '@/services/socketService';
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
  Users,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

// Types
interface WhiteboardData {
  _id: string;
  name: string;
  description: string;
  canvasData?: string;
  workspace: string;
  createdBy: {
    _id: string;
    name: string;
  };
  lastModifiedBy?: {
    _id: string;
    name: string;
  };
  activeUsers: ActiveUser[];
  createdAt: string;
  updatedAt: string;
}

interface ActiveUser {
  userId: string;
  userName: string;
  color: string;
  cursor?: { x: number; y: number };
}

interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  userName: string;
  color: string;
}

type DrawingTool = 'select' | 'pen' | 'rectangle' | 'circle' | 'line' | 'text' | 'eraser';

const COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'];
const USER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'];

const WhiteboardCanvas = () => {
  const { workspaceId, whiteboardId } = useParams<{ workspaceId: string; whiteboardId: string }>();
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
  const [activeCursors, setActiveCursors] = useState<Map<string, CursorPosition>>(new Map());
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [userColor, setUserColor] = useState<string>('');

  // Drawing state
  const isDrawingRef = useRef(false);
  const drawingObjectRef = useRef<FabricObject | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<number>(Date.now());

  // Initialize canvas
  useEffect(() => {
    // Wait for loading to complete before initializing canvas
    if (isLoading) return;
    if (!canvasRef.current || !containerRef.current) return;

    console.log('Initializing workspace canvas...');
    const canvas = new Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: window.innerHeight - 120,
      backgroundColor: '#ffffff',
      isDrawingMode: false,
      selection: true,
    });

    fabricCanvasRef.current = canvas;
    console.log('Workspace canvas initialized:', fabricCanvasRef.current);
    setIsCanvasReady(true);

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && canvas) {
        canvas.setWidth(containerRef.current.clientWidth);
        canvas.setHeight(window.innerHeight - 120);
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
  }, [whiteboardId, workspaceId]);

  // Setup Socket.io
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !whiteboardId) return;

    // Join whiteboard room
    socket.emit('whiteboard:join', { whiteboardId, workspaceId });

    // Listen for canvas updates
    socket.on('whiteboard:canvas-updated', handleCanvasUpdated);
    socket.on('whiteboard:object-added', handleRemoteObjectAdded);
    socket.on('whiteboard:object-modified', handleRemoteObjectModified);
    socket.on('whiteboard:cursor-moved', handleRemoteCursorMove);

    return () => {
      socket.off('whiteboard:canvas-updated', handleCanvasUpdated);
      socket.off('whiteboard:object-added', handleRemoteObjectAdded);
      socket.off('whiteboard:object-modified', handleRemoteObjectModified);
      socket.off('whiteboard:cursor-moved', handleRemoteCursorMove);
      socket.emit('whiteboard:leave', { whiteboardId });
    };
  }, [whiteboardId, workspaceId]);

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
    console.log('Workspace tool settings useEffect:', { canvas: !!canvas, isCanvasReady, selectedTool });
    if (!canvas || !isCanvasReady) {
      console.log('Workspace canvas not ready, skipping');
      return;
    }
    console.log('Setting up workspace event handlers for:', selectedTool);

    // Remove old event listeners
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.off('object:modified');
    canvas.off('object:added');
    canvas.off('path:created');

    const handleMouseDown = (event: any) => {
      if (selectedTool === 'select' || selectedTool === 'pen' || selectedTool === 'eraser') return;

      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

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
        emitObjectAdded(text);
        canvas.requestRenderAll();
      }
    };

    const handleMouseMove = (event: any) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const pointer = canvas.getScenePoint(event.e);

      // Emit cursor position
      const socket = getSocket();
      if (socket && currentUserId) {
        socket.emit('whiteboard:cursor-move', {
          whiteboardId,
          userId: currentUserId,
          x: pointer.x,
          y: pointer.y,
        });
      }

      if (!isDrawingRef.current || !startPointRef.current) return;
      if (selectedTool === 'select' || selectedTool === 'pen' || selectedTool === 'eraser' || selectedTool === 'text') return;

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

      if (drawingObjectRef.current) {
        emitObjectAdded(drawingObjectRef.current);
        drawingObjectRef.current = null;
      }

      startPointRef.current = null;
      saveWhiteboard(true);
    };

    const handleObjectModified = (event: any) => {
      const obj = event.target;
      if (obj) {
        emitObjectModified(obj);
        saveWhiteboard(true);
      }
    };

    const handleObjectAdded = (event: any) => {
      // Auto-save when object is added
      if (event.target) {
        saveWhiteboard(true);
      }
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
    canvas.on('object:added', handleObjectAdded);
    canvas.on('path:created', handlePathCreated);

    canvas.requestRenderAll();

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('path:created', handlePathCreated);
    };
  }, [selectedTool, selectedColor, brushSize, currentUserId, whiteboardId, saveWhiteboard, isCanvasReady]);

  // Get current user info
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId || payload.id || '');
        const randomColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
        setUserColor(randomColor);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  const loadWhiteboard = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(
        `${API_BASE_URL}/workspaces/${workspaceId}/whiteboards/${whiteboardId}`,
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
          const canvasData = JSON.parse(data.whiteboard.canvasData);
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
        `${API_BASE_URL}/workspaces/${workspaceId}/whiteboards/${whiteboardId}`,
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
  }, [workspaceId, whiteboardId, toast]);

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


  const emitObjectAdded = (obj: FabricObject) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('whiteboard:object-added', {
        whiteboardId,
        object: obj.toJSON(),
      });
    }
  };

  const emitObjectModified = (obj: FabricObject) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('whiteboard:object-modified', {
        whiteboardId,
        object: obj.toJSON(),
      });
    }
  };

  const handleCanvasUpdated = (data: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !data.canvasData) return;

    try {
      canvas.loadFromJSON(data.canvasData, () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.error('Error updating canvas:', error);
    }
  };

  const handleRemoteObjectAdded = (data: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !data.object) return;

    // Add object to canvas without triggering events
    canvas.add(data.object);
    canvas.renderAll();
  };

  const handleRemoteObjectModified = (data: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !data.object) return;

    // Find and update the object
    const objects = canvas.getObjects();
    const targetObj = objects.find((obj: any) => obj.id === data.object.id);

    if (targetObj) {
      targetObj.set(data.object);
      canvas.renderAll();
    }
  };

  const handleRemoteCursorMove = (data: CursorPosition) => {
    if (data.userId === currentUserId) return;

    setActiveCursors((prev) => {
      const newCursors = new Map(prev);
      newCursors.set(data.userId, data);
      return newCursors;
    });

    // Remove cursor after 2 seconds of inactivity
    setTimeout(() => {
      setActiveCursors((prev) => {
        const newCursors = new Map(prev);
        newCursors.delete(data.userId);
        return newCursors;
      });
    }, 2000);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Toolbar */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/workspaces/${workspaceId}/whiteboards`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="hidden md:block">
                <h2 className="font-semibold text-gray-900">{whiteboard?.name}</h2>
                <p className="text-xs text-gray-500">{whiteboard?.description || 'No description'}</p>
              </div>
            </div>

            {/* Tools */}
            <div className="flex items-center gap-2 flex-wrap">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    title={tool.label}
                    className={selectedTool === tool.id ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}

              <div className="w-px h-8 bg-gray-300 mx-2" />

              {/* Color picker */}
              <div className="flex items-center gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-7 h-7 rounded border-2 transition-all ${
                      selectedColor === color ? 'border-purple-600 scale-110 shadow-md' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>

              <div className="w-px h-8 bg-gray-300 mx-2" />

              {/* Brush size */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <span className="text-xs text-gray-600">Size:</span>
                <Slider
                  value={brushSize}
                  onValueChange={setBrushSize}
                  min={1}
                  max={20}
                  step={1}
                  className="w-20"
                />
                <span className="text-xs text-gray-600 w-6">{brushSize[0]}</span>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2">
              {whiteboard && whiteboard.activeUsers.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    {whiteboard.activeUsers.length}
                  </span>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>

              <Button variant="outline" size="sm" onClick={exportCanvas}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button size="sm" onClick={() => saveWhiteboard(false)} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="relative w-full" style={{ height: 'calc(100vh - 120px)' }}>
        <canvas ref={canvasRef} />

        {/* Remote cursors */}
        {Array.from(activeCursors.values()).map((cursor) => (
          <div
            key={cursor.userId}
            className="absolute pointer-events-none transition-all duration-100"
            style={{
              left: `${cursor.x}px`,
              top: `${cursor.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="w-3 h-3 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: cursor.color }}
            />
            <div
              className="mt-1 px-2 py-1 rounded text-xs text-white font-medium whitespace-nowrap shadow-lg"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.userName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhiteboardCanvas;
