import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MoreHorizontal, Pencil, Copy, Trash2, Loader2, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface Whiteboard {
  _id: string;
  name: string;
  description: string;
  thumbnail?: string | null;
  createdAt: string;
  updatedAt: string;
}

type SortKey = 'recent' | 'name';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
  'Content-Type': 'application/json',
});

/** "Edited just now", "Edited 3 hours ago", "Edited 12 Mar". */
const editedLabel = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'Edited just now';
  if (diff < 3600) return `Edited ${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `Edited ${h} hour${h > 1 ? 's' : ''} ago`;
  }
  if (diff < 7 * 86400) {
    const d = Math.floor(diff / 86400);
    return `Edited ${d} day${d > 1 ? 's' : ''} ago`;
  }
  return `Edited ${new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`;
};

const PersonalWhiteboards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [boards, setBoards] = useState<Whiteboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('recent');
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<Whiteboard | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/my-whiteboards`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Failed to fetch whiteboards');
        const data = await res.json();
        setBoards(data.whiteboards || []);
      } catch (err) {
        console.error('Error fetching whiteboards:', err);
        toast({ title: 'Error', description: 'Failed to load whiteboards', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Close the "..." menu on any outside click or Escape.
  useEffect(() => {
    if (!menuFor) return;
    const close = () => setMenuFor(null);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('click', close);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('click', close); window.removeEventListener('keydown', onKey); };
  }, [menuFor]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? boards.filter(b => b.name.toLowerCase().includes(q)) : boards;
    return [...list].sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [boards, query, sort]);

  const createBoard = async () => {
    setIsCreating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/my-whiteboards`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name: `Whiteboard ${boards.length + 1}`, description: '' }),
      });
      if (!res.ok) throw new Error('Failed to create whiteboard');
      const data = await res.json();
      navigate(`/my-whiteboards/${data.whiteboard._id}`);
    } catch (err) {
      console.error('Error creating whiteboard:', err);
      toast({ title: 'Error', description: 'Failed to create whiteboard', variant: 'destructive' });
      setIsCreating(false);
    }
  };

  const duplicateBoard = async (board: Whiteboard) => {
    try {
      const res = await fetch(`${API_BASE_URL}/my-whiteboards/${board._id}/duplicate`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Failed to duplicate whiteboard');
      const data = await res.json();
      setBoards(prev => [data.whiteboard, ...prev]);
      toast({ title: 'Duplicated', description: `"${board.name}" was copied.` });
    } catch (err) {
      console.error('Error duplicating whiteboard:', err);
      toast({ title: 'Error', description: 'Failed to duplicate whiteboard', variant: 'destructive' });
    }
  };

  const startRename = (board: Whiteboard) => {
    setRenaming(board._id);
    setRenameValue(board.name);
  };

  const saveRename = async (board: Whiteboard) => {
    const next = renameValue.trim();
    setRenaming(null);
    if (!next || next === board.name) return;
    setBoards(prev => prev.map(b => (b._id === board._id ? { ...b, name: next } : b)));
    try {
      const res = await fetch(`${API_BASE_URL}/my-whiteboards/${board._id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ name: next }),
      });
      if (!res.ok) throw new Error('Failed to rename whiteboard');
    } catch (err) {
      console.error('Error renaming whiteboard:', err);
      setBoards(prev => prev.map(b => (b._id === board._id ? { ...b, name: board.name } : b)));
      toast({ title: 'Error', description: 'Failed to rename whiteboard', variant: 'destructive' });
    }
  };

  const deleteBoard = async (board: Whiteboard) => {
    setConfirmDelete(null);
    const previous = boards;
    setBoards(prev => prev.filter(b => b._id !== board._id));
    try {
      const res = await fetch(`${API_BASE_URL}/my-whiteboards/${board._id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete whiteboard');
    } catch (err) {
      console.error('Error deleting whiteboard:', err);
      setBoards(previous);
      toast({ title: 'Error', description: 'Failed to delete whiteboard', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 sm:pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-red-600 text-sm font-semibold mb-3">
              <PenTool className="w-3.5 h-3.5" /> SlimFile Whiteboards
            </div>
            <h1 className="text-4xl sm:text-[56px] sm:leading-[1.07] font-semibold tracking-tight text-[#1d1d1f]">
              Your whiteboards.
            </h1>
            <p className="mt-3 text-[#6e6e73] text-lg sm:text-[21px] leading-snug max-w-xl">
              Sketch, plan and brainstorm on an endless canvas. Everything saves as you draw.
            </p>
          </div>
          <Button onClick={createBoard} disabled={isCreating} className="h-11 px-6 text-[15px] self-start sm:self-auto">
            {isCreating ? <Loader2 className="animate-spin" /> : <Plus />}
            New whiteboard
          </Button>
        </div>

        {/* Search and sort */}
        {!isLoading && boards.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e6e73]" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search whiteboards"
                className="w-full h-10 pl-10 pr-4 rounded-full bg-[#f5f5f7] text-[15px] text-[#1d1d1f] placeholder:text-[#6e6e73] focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <div className="inline-flex items-center gap-0.5 p-1 rounded-full bg-[#e8e8ed] self-start">
              {(['recent', 'name'] as SortKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={`relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors ${
                    sort === key ? 'text-[#1d1d1f]' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  {sort === key && (
                    <motion.span
                      layoutId="boards-sort-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative">{key === 'recent' ? 'Recent' : 'Name'}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/3] rounded-[22px] bg-[#f5f5f7] animate-pulse" />
                <div className="mt-3 h-4 w-2/3 rounded-full bg-[#f5f5f7] animate-pulse" />
                <div className="mt-2 h-3 w-1/3 rounded-full bg-[#f5f5f7] animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && boards.length === 0 && (
          <div className="relative overflow-hidden rounded-[28px] bg-[#f5f5f7] px-6 py-20 text-center">
            <div
              aria-hidden
              className="absolute inset-0 opacity-70"
              style={{ backgroundImage: 'radial-gradient(#d2d2d7 1px, transparent 1px)', backgroundSize: '22px 22px' }}
            />
            <div className="relative">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                <PenTool className="w-7 h-7 text-red-600" strokeWidth={1.75} />
              </div>
              <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">No whiteboards yet</h2>
              <p className="mt-2 text-[15px] text-[#6e6e73] max-w-md mx-auto">
                Start a board to sketch ideas, map out a project or plan your next assignment.
              </p>
              <Button onClick={createBoard} disabled={isCreating} className="mt-8 h-11 px-6 text-[15px]">
                {isCreating ? <Loader2 className="animate-spin" /> : <Plus />}
                Create your first whiteboard
              </Button>
            </div>
          </div>
        )}

        {/* No search results */}
        {!isLoading && boards.length > 0 && visible.length === 0 && (
          <p className="py-20 text-center text-[15px] text-[#6e6e73]">No whiteboards match "{query}".</p>
        )}

        {/* Boards */}
        {!isLoading && visible.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {!query && (
              <button
                onClick={createBoard}
                disabled={isCreating}
                className="group text-left"
              >
                <div className="aspect-[4/3] rounded-[22px] border-2 border-dashed border-[#d2d2d7] flex flex-col items-center justify-center gap-3 transition-colors duration-200 group-hover:border-red-400 group-hover:bg-red-50/40">
                  <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center transition-colors group-hover:bg-white">
                    {isCreating ? <Loader2 className="w-5 h-5 text-red-600 animate-spin" /> : <Plus className="w-5 h-5 text-red-600" />}
                  </div>
                  <span className="text-[15px] font-medium text-[#1d1d1f]">New whiteboard</span>
                </div>
              </button>
            )}

            <AnimatePresence>
              {visible.map(board => (
                <motion.div
                  key={board._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="group relative"
                >
                  <button
                    onClick={() => navigate(`/my-whiteboards/${board._id}`)}
                    className="block w-full text-left"
                  >
                    <div className="aspect-[4/3] rounded-[22px] bg-[#f5f5f7] overflow-hidden flex items-center justify-center transition-all duration-300 ease-out group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group-hover:scale-[1.015]">
                      {board.thumbnail ? (
                        <img
                          src={board.thumbnail}
                          alt=""
                          className="w-full h-full object-contain bg-white"
                        />
                      ) : (
                        <PenTool className="w-10 h-10 text-[#d2d2d7]" strokeWidth={1.5} />
                      )}
                    </div>
                  </button>

                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {renaming === board._id ? (
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={e => setRenameValue(e.target.value)}
                          onBlur={() => saveRename(board)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveRename(board);
                            if (e.key === 'Escape') setRenaming(null);
                          }}
                          className="w-full text-[17px] font-semibold text-[#1d1d1f] bg-white border border-[#d2d2d7] rounded-lg px-2 py-0.5 focus:outline-none focus:border-red-500"
                        />
                      ) : (
                        <p className="text-[17px] font-semibold tracking-tight text-[#1d1d1f] truncate">{board.name}</p>
                      )}
                      <p className="text-[13px] text-[#6e6e73] mt-0.5">{editedLabel(board.updatedAt)}</p>
                    </div>

                    <div className="relative shrink-0">
                      <button
                        aria-label={`Options for ${board.name}`}
                        onClick={e => { e.stopPropagation(); setMenuFor(menuFor === board._id ? null : board._id); }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#6e6e73] hover:bg-black/[0.05] hover:text-[#1d1d1f] transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {menuFor === board._id && (
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            onClick={e => e.stopPropagation()}
                            className="absolute right-0 top-9 z-20 w-44 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl border border-black/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-1.5"
                          >
                            {[
                              { label: 'Rename', icon: Pencil, run: () => startRename(board) },
                              { label: 'Duplicate', icon: Copy, run: () => duplicateBoard(board) },
                            ].map(item => (
                              <button
                                key={item.label}
                                onClick={() => { setMenuFor(null); item.run(); }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-[#1d1d1f] hover:bg-black/[0.05]"
                              >
                                <item.icon className="w-4 h-4 text-[#6e6e73]" />
                                {item.label}
                              </button>
                            ))}
                            <div className="my-1 h-px bg-black/[0.06]" />
                            <button
                              onClick={() => { setMenuFor(null); setConfirmDelete(board); }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-[28px] bg-white p-7 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)]"
            >
              <h3 className="text-[21px] font-semibold tracking-tight text-[#1d1d1f]">Delete “{confirmDelete.name}”?</h3>
              <p className="mt-2 text-[15px] text-[#6e6e73]">This whiteboard will be removed permanently. You can't undo this.</p>
              <div className="mt-6 flex flex-col gap-2">
                <Button onClick={() => deleteBoard(confirmDelete)} className="h-11 text-[15px] w-full">
                  Delete
                </Button>
                <Button variant="secondary" onClick={() => setConfirmDelete(null)} className="h-11 text-[15px] w-full">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalWhiteboards;
