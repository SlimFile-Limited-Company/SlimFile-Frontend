import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Excalidraw, MainMenu, WelcomeScreen, exportToBlob, hashElementsVersion, MIME_TYPES } from '@excalidraw/excalidraw';
import type { AppState, BinaryFiles, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types';
import '@excalidraw/excalidraw/index.css';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

// MongoDB caps a document at 16 MB. Stop well short of it so a board full of
// pasted images fails with a clear message instead of a server error.
const MAX_BOARD_BYTES = 12 * 1024 * 1024;
const SAVE_DELAY_MS = 1200;

type SaveState = 'saved' | 'saving' | 'unsaved' | 'error';
type Elements = Parameters<NonNullable<React.ComponentProps<typeof Excalidraw>['onChange']>>[0];

/**
 * What we store in Whiteboard.canvasData. Boards drawn with the old Fabric.js
 * editor have no `format` field; they open as an empty board and their data
 * is only replaced if the user draws and saves.
 */
interface StoredBoard {
  format: 'excalidraw';
  elements: Elements;
  appState: { viewBackgroundColor?: string };
  files: BinaryFiles;
}

const parseStored = (raw: unknown): { board: StoredBoard | null; legacy: boolean } => {
  let data = raw;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { return { board: null, legacy: false }; }
  }
  if (data && typeof data === 'object' && (data as StoredBoard).format === 'excalidraw') {
    return { board: data as StoredBoard, legacy: false };
  }
  const objects = (data as { objects?: unknown[] } | null)?.objects;
  return { board: null, legacy: Array.isArray(objects) && objects.length > 0 };
};

/** Changes whenever an element is added, edited or removed, or the background changes. */
const sceneHash = (elements: Elements, background: string) =>
  `${hashElementsVersion(elements)}:${background}`;

const blobToDataURL = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const PersonalWhiteboardCanvas = () => {
  const { whiteboardId } = useParams<{ whiteboardId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [initialData, setInitialData] = useState<ExcalidrawInitialDataState | null>(null);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [legacy, setLegacy] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('saved');

  const lastSavedHash = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestScene = useRef<{ elements: Elements; appState: AppState; files: BinaryFiles } | null>(null);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  });

  // Load the board once.
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/my-whiteboards/${whiteboardId}`, { headers: authHeaders(), cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load whiteboard');
        const { whiteboard } = await res.json();
        setName(whiteboard.name);
        setEditName(whiteboard.name);

        const { board, legacy } = parseStored(whiteboard.canvasData);
        setLegacy(legacy);
        setInitialData({
          elements: board?.elements ?? [],
          appState: { viewBackgroundColor: board?.appState?.viewBackgroundColor ?? '#ffffff' },
          files: board?.files ?? {},
          scrollToContent: true,
        });
        // Same fingerprint handleChange computes, so simply opening a board
        // never triggers a save (which would overwrite an old-format board).
        lastSavedHash.current = sceneHash(board?.elements ?? [], board?.appState?.viewBackgroundColor ?? '#ffffff');
      } catch (err) {
        console.error('Error loading whiteboard:', err);
        toast({ title: 'Error', description: 'Failed to load whiteboard', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [whiteboardId]);

  const save = useCallback(async () => {
    const scene = latestScene.current;
    if (!scene) return;

    const elements = scene.elements.filter(el => !el.isDeleted);
    // Keep only images still on the board so removed pictures do not bloat it.
    const usedFileIds = new Set(elements.map(el => (el as { fileId?: string }).fileId).filter(Boolean));
    const files = Object.fromEntries(Object.entries(scene.files).filter(([id]) => usedFileIds.has(id))) as BinaryFiles;

    const canvasData: StoredBoard = {
      format: 'excalidraw',
      elements,
      appState: { viewBackgroundColor: scene.appState.viewBackgroundColor },
      files,
    };

    const body = JSON.stringify({ canvasData });
    if (body.length > MAX_BOARD_BYTES) {
      setSaveState('error');
      toast({
        title: 'Board too large to save',
        description: 'Remove or shrink some images, then it will save again.',
        variant: 'destructive',
      });
      return;
    }

    setSaveState('saving');
    try {
      let thumbnail: string | undefined;
      if (elements.length) {
        const blob = await exportToBlob({
          elements,
          files,
          appState: { ...scene.appState, exportBackground: true },
          mimeType: MIME_TYPES.jpg,
          quality: 0.7,
          getDimensions: (w: number, h: number) => {
            const scale = Math.min(1, 480 / Math.max(w, h));
            return { width: w * scale, height: h * scale, scale };
          },
        });
        thumbnail = await blobToDataURL(blob);
      }

      const res = await fetch(`${API_BASE_URL}/my-whiteboards/${whiteboardId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ canvasData, thumbnail: thumbnail ?? null }),
      });
      if (!res.ok) throw new Error('Failed to save whiteboard');

      setLegacy(false);
      setSaveState('saved');
    } catch (err) {
      console.error('Error saving whiteboard:', err);
      setSaveState('error');
    }
  }, [whiteboardId, toast]);

  // Excalidraw calls onChange on every pointer move, so only schedule a save
  // when the drawing or background actually changed.
  const handleChange = useCallback((elements: Elements, appState: AppState, files: BinaryFiles) => {
    latestScene.current = { elements, appState, files };
    const hash = sceneHash(elements, appState.viewBackgroundColor);
    if (hash === lastSavedHash.current) return;
    lastSavedHash.current = hash;

    setSaveState('unsaved');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(save, SAVE_DELAY_MS);
  }, [save]);

  // Save anything pending when leaving the page.
  useEffect(() => () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      save();
    }
  }, [save]);

  const saveName = async () => {
    const next = editName.trim();
    setIsEditingName(false);
    if (!next || next === name) { setEditName(name); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/my-whiteboards/${whiteboardId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ name: next }),
      });
      if (!res.ok) throw new Error('Failed to rename whiteboard');
      setName(next);
    } catch {
      setEditName(name);
      toast({ title: 'Error', description: 'Failed to rename whiteboard', variant: 'destructive' });
    }
  };

  const statusText = {
    saved: 'Saved',
    saving: 'Saving…',
    unsaved: 'Editing',
    error: 'Not saved',
  }[saveState];

  return (
    <div className="fixed inset-x-0 top-12 bottom-0 z-30 flex flex-col bg-white">
      {/* Board bar, styled like the site header */}
      <div className="h-12 shrink-0 flex items-center gap-3 px-3 sm:px-4 border-b border-black/[0.06] bg-[#fbfbfd]/80 backdrop-blur-xl">
        <button
          onClick={() => navigate('/my-whiteboards')}
          className="flex items-center gap-0.5 text-[13px] text-red-600 hover:text-red-700 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Whiteboards
        </button>

        <div className="flex-1 min-w-0 flex justify-center">
          {isEditingName ? (
            <input
              autoFocus
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={saveName}
              onKeyDown={e => {
                if (e.key === 'Enter') saveName();
                if (e.key === 'Escape') { setEditName(name); setIsEditingName(false); }
              }}
              className="w-full max-w-xs text-center text-[13px] font-semibold text-[#1d1d1f] bg-white border border-[#d2d2d7] rounded-lg px-2 py-1 focus:outline-none focus:border-red-500"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              title="Rename"
              className="truncate text-[13px] font-semibold text-[#1d1d1f] hover:text-red-600"
            >
              {name || 'Untitled Board'}
            </button>
          )}
        </div>

        <span className={`text-xs shrink-0 w-[4.5rem] text-right ${saveState === 'error' ? 'text-red-600' : 'text-[#6e6e73]'}`}>
          {statusText}
        </span>
      </div>

      {legacy && (
        <div className="shrink-0 px-4 py-2 text-xs text-center text-[#6e6e73] bg-[#f5f5f7] border-b border-black/[0.06]">
          This board was made with the old whiteboard and can't be shown here. Drawing on it will replace the old version.
        </div>
      )}

      <div className="sf-board flex-1 min-h-0">
        {isLoading || !initialData ? (
          <div className="h-full flex items-center justify-center text-[#6e6e73]">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : (
          <Excalidraw
            initialData={initialData}
            onChange={handleChange}
            name={name}
            UIOptions={{ canvasActions: { loadScene: false, saveToActiveFile: false, export: false } }}
          >
            {/* SlimFile's own menu and welcome screen replace Excalidraw's,
                which link to Excalidraw's site, socials and paid plan. */}
            <MainMenu>
              <MainMenu.DefaultItems.SaveAsImage />
              <MainMenu.DefaultItems.SearchMenu />
              <MainMenu.DefaultItems.ClearCanvas />
              <MainMenu.Separator />
              <MainMenu.DefaultItems.ToggleTheme />
              <MainMenu.DefaultItems.ChangeCanvasBackground />
            </MainMenu>
            <WelcomeScreen>
              <WelcomeScreen.Center>
                <WelcomeScreen.Center.Heading>
                  Start drawing. Your board saves automatically.
                </WelcomeScreen.Center.Heading>
              </WelcomeScreen.Center>
              <WelcomeScreen.Hints.ToolbarHint />
              <WelcomeScreen.Hints.MenuHint />
            </WelcomeScreen>
          </Excalidraw>
        )}
      </div>
    </div>
  );
};

export default PersonalWhiteboardCanvas;
