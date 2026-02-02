import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { usePDFEditor } from '@/contexts/PDFEditorContext';
import StampDialog, { StampType } from './dialogs/StampDialog';
import ShapeDialog, { ShapeType } from './dialogs/ShapeDialog';

interface AnnotationLayerProps {
  pageNumber: number;
  width: number;
  height: number;
}

export default function AnnotationLayer({ pageNumber, width, height }: AnnotationLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const { editState, addAnnotation, updateAnnotation, deleteAnnotation } = usePDFEditor();
  const [isReady, setIsReady] = useState(false);
  const [showStampDialog, setShowStampDialog] = useState(false);
  const [pendingStampPosition, setPendingStampPosition] = useState<{ x: number; y: number } | null>(null);
  const [showShapeDialog, setShowShapeDialog] = useState(false);
  const [selectedShapeType, setSelectedShapeType] = useState<ShapeType>('rectangle');

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;
    setIsReady(true);

    console.log('Fabric.js canvas initialized', { width, height });

    // Cleanup
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [width, height]);

  // Handle tool changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;

    const tool = editState.selectedTool;

    // Reset drawing mode
    canvas.isDrawingMode = false;
    canvas.selection = true;

    switch (tool) {
      case 'select':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;

      case 'draw':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 3;
        canvas.freeDrawingBrush.color = '#ef4444'; // Red
        break;

      case 'text':
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'text';
        break;

      case 'highlight':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 20;
        canvas.freeDrawingBrush.color = 'rgba(255, 255, 0, 0.5)'; // Yellow with transparency
        break;

      case 'shape':
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;

      case 'stamp':
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'pointer';
        break;

      case 'redact':
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;

      default:
        canvas.isDrawingMode = false;
        canvas.selection = true;
    }

    canvas.renderAll();
  }, [editState.selectedTool, isReady]);

  // Handle text tool click
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;

    if (editState.selectedTool === 'text') {
      const handleMouseDown = (e: fabric.IEvent) => {
        if (!e.pointer) return;

        const text = new fabric.IText('Click to edit', {
          left: e.pointer.x,
          top: e.pointer.y,
          fontSize: 16,
          fill: '#000000',
          fontFamily: 'Arial',
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        canvas.renderAll();

        // Add to annotations
        addAnnotation({
          id: `text-${Date.now()}`,
          type: 'text',
          pageNumber,
          data: text.toJSON(),
          timestamp: Date.now(),
        });
      };

      canvas.on('mouse:down', handleMouseDown);

      return () => {
        canvas.off('mouse:down', handleMouseDown);
      };
    }
  }, [editState.selectedTool, isReady, pageNumber, addAnnotation]);

  // Open shape dialog when shape tool is selected
  useEffect(() => {
    if (editState.selectedTool === 'shape' && !showShapeDialog) {
      setShowShapeDialog(true);
    }
  }, [editState.selectedTool]);

  // Handle shape selection
  const handleShapeSelect = (shapeType: ShapeType) => {
    setSelectedShapeType(shapeType);
  };

  // Handle shape tool
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;

    if (editState.selectedTool === 'shape') {
      let isDrawing = false;
      let shape: fabric.Object | null = null;
      let startX = 0;
      let startY = 0;

      const handleMouseDown = (e: fabric.IEvent) => {
        if (!e.pointer) return;
        isDrawing = true;
        startX = e.pointer.x;
        startY = e.pointer.y;

        // Create shape based on selected type
        switch (selectedShapeType) {
          case 'rectangle':
            shape = new fabric.Rect({
              left: startX,
              top: startY,
              width: 0,
              height: 0,
              fill: 'transparent',
              stroke: '#ef4444',
              strokeWidth: 2,
            });
            break;

          case 'circle':
            shape = new fabric.Circle({
              left: startX,
              top: startY,
              radius: 0,
              fill: 'transparent',
              stroke: '#ef4444',
              strokeWidth: 2,
            });
            break;

          case 'line':
            shape = new fabric.Line([startX, startY, startX, startY], {
              stroke: '#ef4444',
              strokeWidth: 2,
            });
            break;

          case 'arrow':
            shape = new fabric.Line([startX, startY, startX, startY], {
              stroke: '#ef4444',
              strokeWidth: 2,
            });
            break;

          default:
            shape = new fabric.Rect({
              left: startX,
              top: startY,
              width: 0,
              height: 0,
              fill: 'transparent',
              stroke: '#ef4444',
              strokeWidth: 2,
            });
        }

        canvas.add(shape);
      };

      const handleMouseMove = (e: fabric.IEvent) => {
        if (!isDrawing || !shape || !e.pointer) return;

        const width = e.pointer.x - startX;
        const height = e.pointer.y - startY;

        switch (selectedShapeType) {
          case 'rectangle':
            (shape as fabric.Rect).set({
              width: Math.abs(width),
              height: Math.abs(height),
              left: width < 0 ? e.pointer.x : startX,
              top: height < 0 ? e.pointer.y : startY,
            });
            break;

          case 'circle':
            const radius = Math.sqrt(width * width + height * height) / 2;
            (shape as fabric.Circle).set({
              radius: Math.abs(radius),
              left: startX,
              top: startY,
            });
            break;

          case 'line':
          case 'arrow':
            (shape as fabric.Line).set({
              x2: e.pointer.x,
              y2: e.pointer.y,
            });
            break;
        }

        canvas.renderAll();
      };

      const handleMouseUp = () => {
        if (shape) {
          // For arrows, add arrow head
          if (selectedShapeType === 'arrow') {
            const line = shape as fabric.Line;
            const angle = Math.atan2(
              (line.y2 || 0) - (line.y1 || 0),
              (line.x2 || 0) - (line.x1 || 0)
            );

            const arrowHead = new fabric.Triangle({
              left: line.x2,
              top: line.y2,
              width: 15,
              height: 15,
              fill: '#ef4444',
              angle: (angle * 180) / Math.PI + 90,
              originX: 'center',
              originY: 'center',
            });

            const arrowGroup = new fabric.Group([line, arrowHead], {
              selectable: true,
            });

            canvas.remove(shape);
            canvas.add(arrowGroup);
            shape = arrowGroup;
          }

          // Add to annotations
          addAnnotation({
            id: `shape-${Date.now()}`,
            type: 'shape',
            pageNumber,
            data: { ...shape.toJSON(), shapeType: selectedShapeType },
            timestamp: Date.now(),
          });
        }
        isDrawing = false;
        shape = null;
      };

      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);

      return () => {
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
      };
    }
  }, [editState.selectedTool, isReady, pageNumber, addAnnotation, selectedShapeType]);

  // Handle stamp selection
  const handleStampSelect = (stamp: StampType) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !pendingStampPosition) return;

    const { x, y } = pendingStampPosition;

    // Calculate stamp dimensions based on text length
    const textWidth = stamp.text.length * 12;
    const stampWidth = Math.max(140, textWidth + 40);

    // Create stamp with text
    const stampText = new fabric.Text(stamp.text, {
      left: x - stampWidth / 2 + 10,
      top: y - 15,
      fontSize: 24,
      fill: stamp.color,
      fontWeight: 'bold',
      fontFamily: 'Arial',
      stroke: stamp.color,
      strokeWidth: 1,
    });

    // Add border around stamp
    const stampRect = new fabric.Rect({
      left: x - stampWidth / 2,
      top: y - 20,
      width: stampWidth,
      height: 40,
      fill: 'transparent',
      stroke: stamp.color,
      strokeWidth: 3,
      rx: 5,
      ry: 5,
    });

    // Group them together
    const stampGroup = new fabric.Group([stampRect, stampText], {
      left: x - stampWidth / 2,
      top: y - 20,
      selectable: true,
    });

    canvas.add(stampGroup);
    canvas.renderAll();

    // Add to annotations
    addAnnotation({
      id: `stamp-${Date.now()}`,
      type: 'stamp',
      pageNumber,
      data: { ...stampGroup.toJSON(), stampType: stamp },
      timestamp: Date.now(),
    });

    setPendingStampPosition(null);
  };

  // Handle stamp tool
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;

    if (editState.selectedTool === 'stamp') {
      const handleMouseDown = (e: fabric.IEvent) => {
        if (!e.pointer) return;

        // Open stamp selection dialog
        setPendingStampPosition({ x: e.pointer.x, y: e.pointer.y });
        setShowStampDialog(true);
      };

      canvas.on('mouse:down', handleMouseDown);

      return () => {
        canvas.off('mouse:down', handleMouseDown);
      };
    }
  }, [editState.selectedTool, isReady]);

  // Handle redaction tool
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;

    if (editState.selectedTool === 'redact') {
      let isDrawing = false;
      let redactBox: fabric.Object | null = null;
      let startX = 0;
      let startY = 0;

      const handleMouseDown = (e: fabric.IEvent) => {
        if (!e.pointer) return;
        isDrawing = true;
        startX = e.pointer.x;
        startY = e.pointer.y;

        // Create black rectangle for redaction
        redactBox = new fabric.Rect({
          left: startX,
          top: startY,
          width: 0,
          height: 0,
          fill: '#000000',
          stroke: '#ef4444',
          strokeWidth: 2,
          opacity: 1,
        });

        canvas.add(redactBox);
      };

      const handleMouseMove = (e: fabric.IEvent) => {
        if (!isDrawing || !redactBox || !e.pointer) return;

        const width = e.pointer.x - startX;
        const height = e.pointer.y - startY;

        redactBox.set({
          width: Math.abs(width),
          height: Math.abs(height),
          left: width < 0 ? e.pointer.x : startX,
          top: height < 0 ? e.pointer.y : startY,
        });

        canvas.renderAll();
      };

      const handleMouseUp = () => {
        if (redactBox) {
          // Add to annotations
          addAnnotation({
            id: `redact-${Date.now()}`,
            type: 'redact',
            pageNumber,
            data: redactBox.toJSON(),
            timestamp: Date.now(),
          });
        }
        isDrawing = false;
        redactBox = null;
      };

      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);

      return () => {
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
      };
    }
  }, [editState.selectedTool, isReady, pageNumber, addAnnotation]);

  // Handle drawing completion
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;

    const handlePathCreated = (e: any) => {
      const path = e.path;
      if (path) {
        // Add to annotations
        addAnnotation({
          id: `draw-${Date.now()}`,
          type: editState.selectedTool === 'highlight' ? 'highlight' : 'draw',
          pageNumber,
          data: path.toJSON(),
          timestamp: Date.now(),
        });
      }
    };

    canvas.on('path:created', handlePathCreated);

    return () => {
      canvas.off('path:created', handlePathCreated);
    };
  }, [isReady, pageNumber, editState.selectedTool, addAnnotation]);

  // Handle object deletion
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isReady) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.renderAll();
          // TODO: Remove from annotations
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReady]);

  return (
    <>
      <div
        className="absolute top-0 left-0 pointer-events-auto"
        style={{ width, height }}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Stamp Selection Dialog */}
      <StampDialog
        isOpen={showStampDialog}
        onClose={() => {
          setShowStampDialog(false);
          setPendingStampPosition(null);
        }}
        onSelectStamp={handleStampSelect}
      />

      {/* Shape Selection Dialog */}
      <ShapeDialog
        isOpen={showShapeDialog}
        onClose={() => setShowShapeDialog(false)}
        onSelectShape={handleShapeSelect}
      />
    </>
  );
}
