import { useState, useCallback } from 'react';

export interface UndoRedoAction {
  type: 'add' | 'update' | 'delete';
  target: 'annotation' | 'page';
  data: any;
  previousData?: any;
  undo: () => void;
  redo: () => void;
}

export function useUndoRedo(maxStackSize: number = 50) {
  const [undoStack, setUndoStack] = useState<UndoRedoAction[]>([]);
  const [redoStack, setRedoStack] = useState<UndoRedoAction[]>([]);

  const pushAction = useCallback((action: UndoRedoAction) => {
    setUndoStack((prev) => {
      const newStack = [...prev, action];
      // Limit stack size
      if (newStack.length > maxStackSize) {
        newStack.shift();
      }
      return newStack;
    });
    // Clear redo stack when new action is added
    setRedoStack([]);
  }, [maxStackSize]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const action = undoStack[undoStack.length - 1];
    action.undo();

    // Move action to redo stack
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, action]);
  }, [undoStack]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const action = redoStack[redoStack.length - 1];
    action.redo();

    // Move action back to undo stack
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, action]);
  }, [redoStack]);

  const clear = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  return {
    pushAction,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    undoStack,
    redoStack,
  };
}
