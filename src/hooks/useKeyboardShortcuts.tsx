import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: () => void;
  description?: string;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow certain shortcuts even in input fields (like Ctrl+Z, Ctrl+Y)
        const allowedInInputs = shortcuts.filter(
          (s) =>
            (s.ctrl || s.meta) &&
            ['z', 'y', 'a', 'c', 'v', 'x'].includes(s.key.toLowerCase())
        );

        const matchingShortcut = allowedInInputs.find(
          (shortcut) =>
            event.key.toLowerCase() === shortcut.key.toLowerCase() &&
            (!shortcut.ctrl || event.ctrlKey) &&
            (!shortcut.shift || event.shiftKey) &&
            (!shortcut.alt || event.altKey) &&
            (!shortcut.meta || event.metaKey)
        );

        if (!matchingShortcut) return;

        if (matchingShortcut.preventDefault) {
          event.preventDefault();
        }
        matchingShortcut.callback();
        return;
      }

      // Check for matching shortcut
      const matchingShortcut = shortcuts.find(
        (shortcut) =>
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (!shortcut.ctrl || event.ctrlKey) &&
          (!shortcut.shift || event.shiftKey) &&
          (!shortcut.alt || event.altKey) &&
          (!shortcut.meta || event.metaKey)
      );

      if (matchingShortcut) {
        if (matchingShortcut.preventDefault !== false) {
          event.preventDefault();
        }
        matchingShortcut.callback();
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

// Helper function to get human-readable shortcut text
export function getShortcutText(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.meta) parts.push('Cmd');

  parts.push(shortcut.key.toUpperCase());

  return parts.join('+');
}

// Predefined keyboard shortcuts for PDF Editor
export const PDF_EDITOR_SHORTCUTS = {
  // Navigation
  NEXT_PAGE: { key: 'ArrowRight', description: 'Next page' },
  PREV_PAGE: { key: 'ArrowLeft', description: 'Previous page' },
  FIRST_PAGE: { key: 'Home', description: 'First page' },
  LAST_PAGE: { key: 'End', description: 'Last page' },

  // Zoom
  ZOOM_IN: { key: '+', ctrl: true, description: 'Zoom in' },
  ZOOM_OUT: { key: '-', ctrl: true, description: 'Zoom out' },
  ZOOM_FIT: { key: '0', ctrl: true, description: 'Fit to width' },

  // Editing
  UNDO: { key: 'z', ctrl: true, description: 'Undo' },
  REDO: { key: 'y', ctrl: true, description: 'Redo' },
  SELECT_ALL: { key: 'a', ctrl: true, description: 'Select all' },
  COPY: { key: 'c', ctrl: true, description: 'Copy' },
  PASTE: { key: 'v', ctrl: true, description: 'Paste' },
  CUT: { key: 'x', ctrl: true, description: 'Cut' },
  DELETE: { key: 'Delete', description: 'Delete' },

  // Tools
  SELECT_TOOL: { key: 's', description: 'Select tool' },
  TEXT_TOOL: { key: 't', description: 'Text tool' },
  DRAW_TOOL: { key: 'd', description: 'Draw tool' },
  HIGHLIGHT_TOOL: { key: 'h', description: 'Highlight tool' },
  SHAPE_TOOL: { key: 'r', description: 'Shape tool' },
  STAMP_TOOL: { key: 'p', description: 'Stamp tool' },
  REDACT_TOOL: { key: 'x', description: 'Redact tool' },

  // View
  FULLSCREEN: { key: 'f', ctrl: true, description: 'Toggle fullscreen' },
  TOGGLE_SIDEBAR: { key: 'b', ctrl: true, description: 'Toggle sidebar' },

  // File
  SAVE: { key: 's', ctrl: true, description: 'Save' },
  PRINT: { key: 'p', ctrl: true, description: 'Print' },
  CLOSE: { key: 'w', ctrl: true, description: 'Close' },

  // Other
  ESCAPE: { key: 'Escape', description: 'Cancel/Deselect' },
  HELP: { key: '?', shift: true, description: 'Show help' },
};
