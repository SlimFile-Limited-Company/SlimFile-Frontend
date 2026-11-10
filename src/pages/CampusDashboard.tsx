import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, MapPin, Wifi, Mail, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import io from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface Area { lat: number; lng: number; radiusKm: number }

interface CampusStats {
  id: string;
  short: string;
  name: string;
  country: string;
  ambassadors: string[];
  areas?: Area[];
  wifiDetection: boolean;
  people: number;
  accounts: number;
  active30: number;
  new7: number;
  new30: number;
  files: number;
  files30: number;
  today: number;
  visits: number;
  visits30: number;
  visitors: number;
  slimdocx: { opens: number; people: number };
  whiteboards: { opens: number; people: number };
  byMethod: { gps: number; wifi: number; email: number; remembered?: number };
  schoolEmailAccounts: number;
}

interface DailyRow { day: string; campusId: string; count: number }

interface FeedItem {
  id: string;
  campusId: string;
  short: string;
  kind: 'visit' | 'file' | 'slimdocx' | 'whiteboard';
  method: 'gps' | 'wifi' | 'email' | 'remembered';
  newPerson?: boolean;
  signedIn: boolean;
  at: string;
}

const KIND_TEXT: Record<FeedItem['kind'], string> = {
  visit: 'visited slim-file.com',
  file: 'finished a file',
  slimdocx: 'opened a SlimDocx document',
  whiteboard: 'opened a whiteboard',
};
const METHOD_TEXT: Record<FeedItem['method'], string> = { gps: 'GPS', wifi: 'campus Wi-Fi', email: 'school email', remembered: 'GPS earlier' };

const timeAgo = (iso: string, now: number) => {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 10) return 'just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// A live event moves that campus's numbers straight away.
const applyEvent = (c: CampusStats, e: FeedItem): CampusStats => ({
  ...c,
  today: c.today + 1,
  people: c.people + (e.newPerson ? 1 : 0),
  new7: c.new7 + (e.newPerson ? 1 : 0),
  new30: c.new30 + (e.newPerson ? 1 : 0),
  visits: c.visits + (e.kind === 'visit' ? 1 : 0),
  files: c.files + (e.kind === 'file' ? 1 : 0),
  slimdocx: { ...c.slimdocx, opens: c.slimdocx.opens + (e.kind === 'slimdocx' ? 1 : 0) },
  whiteboards: { ...c.whiteboards, opens: c.whiteboards.opens + (e.kind === 'whiteboard' ? 1 : 0) },
});

type SortKey = 'people' | 'today' | 'visits' | 'files';
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'people', label: 'People' },
  { key: 'today', label: 'Today' },
  { key: 'visits', label: 'Visits' },
  { key: 'files', label: 'Files' },
];

// Quick jumps; "Ghana" is where most campuses are, so the map opens there.
const REGIONS = ['Ghana', 'Mauritius', 'USA', 'All'] as const;
type Region = typeof REGIONS[number];

const lastDays = (n: number) =>
  Array.from({ length: n }, (_, i) => new Date(Date.now() - (n - 1 - i) * 86400000).toISOString().slice(0, 10));

const areaBounds = (areas: Area[]) =>
  L.latLngBounds(areas.flatMap(a => {
    const b = L.latLng(a.lat, a.lng).toBounds(a.radiusKm * 2000);
    return [b.getSouthWest(), b.getNorthEast()];
  }));

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, ch => `&#${ch.charCodeAt(0)};`);

const pinHtml = (c: CampusStats, selected: boolean) => `
  <div class="campus-pin${selected ? ' is-selected' : ''}">
    <span class="campus-pin-name">${escapeHtml(c.short)}</span>
    <span class="campus-pin-count">${c.people.toLocaleString()}</span>
  </div>`;

const MAP_CSS = `
.campus-map .leaflet-container { font-family: inherit; background: #f2f2f0; }
.campus-map .leaflet-tile-pane { filter: saturate(.7) brightness(1.04); }
.campus-map .leaflet-control-attribution { font-size: 10px; background: rgba(255,255,255,.7); border-radius: 8px 0 0 0; }
.campus-pin { position: relative; transform: translate(-50%, -100%); display: inline-flex; align-items: center; gap: 6px;
  white-space: nowrap; padding: 5px 6px 5px 10px; border-radius: 999px; background: #fff; color: #1d1d1f;
  font-size: 12px; font-weight: 600; box-shadow: 0 2px 10px rgba(0,0,0,.18); cursor: pointer; transition: transform .2s; }
.campus-pin::after { content: ''; position: absolute; left: 50%; bottom: -5px; width: 10px; height: 10px; background: inherit;
  transform: translateX(-50%) rotate(45deg); border-radius: 2px; }
.campus-pin:hover { transform: translate(-50%, -100%) scale(1.06); }
.campus-pin-count { position: relative; z-index: 1; min-width: 20px; padding: 1px 7px; border-radius: 999px; background: #dc2626; color: #fff; text-align: center; }
.campus-pin.is-selected { background: #1d1d1f; color: #fff; }
.campus-pin.is-live { animation: campus-live 1.6s ease-out; }
@keyframes campus-live { 0% { box-shadow: 0 0 0 0 rgba(48,209,88,.7), 0 2px 10px rgba(0,0,0,.18); }
  100% { box-shadow: 0 0 0 22px rgba(48,209,88,0), 0 2px 10px rgba(0,0,0,.18); } }
`;

/**
 * Ambassador campuses on a map: each campus area (the campus and the hostels
 * around it) drawn where it is, with who uses SlimFile there. People are
 * counted by GPS inside those areas, campus Wi-Fi, or a school email.
 */
export default function CampusDashboard() {
  const [campuses, setCampuses] = useState<CampusStats[]>([]);
  const [daily, setDaily] = useState<DailyRow[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [sort, setSort] = useState<SortKey>('people');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [live, setLive] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>('Ghana');
  const [panelOpen, setPanelOpen] = useState(true);

  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layers = useRef<Record<string, { pin: L.Marker; circles: L.Circle[] }>>({});
  const framed = useRef(false);

  // Full numbers on load, then again every two minutes to keep "active" and
  // per-day counts exact; live events fill the gaps in between.
  useEffect(() => {
    const load = () =>
      fetch(`${API_BASE_URL}/campus/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        cache: 'no-store',
      })
        .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
        .then(data => {
          setCampuses(data.campuses || []);
          setDaily(data.daily || []);
          setFeed(data.feed || []);
          setState('ready');
        })
        .catch(() => setState(s => (s === 'ready' ? s : 'failed')));
    load();
    const timer = setInterval(load, 120000);
    return () => clearInterval(timer);
  }, []);

  // Live events as they happen
  useEffect(() => {
    const socket = io(API_BASE_URL.replace(/\/api\/?$/, ''));
    const join = () => socket.emit('joinCampusFeed', localStorage.getItem('jwt'));
    socket.on('connect', join);
    socket.on('campusFeedJoined', () => setLive(true));
    socket.on('disconnect', () => setLive(false));
    socket.on('campusEvent', (e: FeedItem) => {
      setFeed(f => (f.some(x => x.id === e.id) ? f : [e, ...f].slice(0, 30)));
      setCampuses(cs => cs.map(c => (c.id === e.campusId ? applyEvent(c, e) : c)));
      const day = new Date(e.at).toISOString().slice(0, 10);
      if (e.kind === 'visit') {
        setDaily(d => {
          const row = d.find(r => r.day === day && r.campusId === e.campusId);
          return row ? d.map(r => (r === row ? { ...r, count: r.count + 1 } : r)) : [...d, { day, campusId: e.campusId, count: 1 }];
        });
      }
      // Pulse the campus on the map
      const el = layers.current[e.campusId]?.pin.getElement()?.querySelector('.campus-pin');
      if (el) {
        el.classList.remove('is-live');
        void (el as HTMLElement).offsetWidth;
        el.classList.add('is-live');
      }
    });
    return () => { socket.disconnect(); };
  }, []);

  // Keeps "2m ago" fresh
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  // The map itself, created once the page is ready
  useEffect(() => {
    if (state !== 'ready' || !mapEl.current || map.current) return;
    const m = L.map(mapEl.current, { zoomControl: false, worldCopyJump: true, minZoom: 2 });
    // OpenStreetMap's own tiles: free with attribution, fine for an admin page's traffic.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(m);
    m.setView([7.9, -1.0], 7);
    map.current = m;
    return () => { m.remove(); map.current = null; layers.current = {}; framed.current = false; };
  }, [state]);

  // Campus areas and pins, kept in step with the numbers
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    for (const c of campuses) {
      const areas = c.areas || [];
      if (!areas.length) continue;
      const existing = layers.current[c.id];
      const selected = c.id === selectedId;
      const icon = L.divIcon({ className: '', html: pinHtml(c, selected), iconSize: [0, 0] });
      if (existing) {
        existing.pin.setIcon(icon);
        existing.pin.setZIndexOffset(selected ? 1000 : 0);
        existing.circles.forEach(circle => circle.setStyle({ fillOpacity: selected ? 0.1 : 0.08, weight: selected ? 2 : 1.25 }));
        continue;
      }
      const circles = areas.map(a =>
        L.circle([a.lat, a.lng], {
          radius: a.radiusKm * 1000,
          color: '#dc2626',
          weight: 1.25,
          fillColor: '#dc2626',
          fillOpacity: 0.08,
        }).addTo(m).on('click', () => setSelectedId(c.id))
      );
      const pin = L.marker([areas[0].lat, areas[0].lng], { icon, riseOnHover: true })
        .addTo(m)
        .on('click', () => setSelectedId(c.id));
      layers.current[c.id] = { pin, circles };
    }
  }, [campuses, selectedId, state]);

  // Move the map: to the chosen campus, or to a region
  useEffect(() => {
    const m = map.current;
    if (!m || !campuses.length) return;
    const pad = window.innerWidth >= 768 && panelOpen
      ? { paddingTopLeft: [420, 40] as L.PointTuple, paddingBottomRight: [40, 40] as L.PointTuple }
      : { padding: [40, 40] as L.PointTuple };
    const selected = campuses.find(c => c.id === selectedId);
    if (selected?.areas?.length) {
      m.flyToBounds(areaBounds(selected.areas), { ...pad, maxZoom: 14, duration: 0.9 });
      return;
    }
    if (!region) return;
    const inRegion = campuses.filter(c => region === 'All' || c.country === region).flatMap(c => c.areas || []);
    if (!inRegion.length) return;
    const bounds = areaBounds(inRegion);
    if (framed.current) m.flyToBounds(bounds, { ...pad, maxZoom: 13, duration: 0.9 });
    else m.fitBounds(bounds, { ...pad, maxZoom: 13 });
    framed.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, region, campuses.length]);

  const sorted = useMemo(() => [...campuses].sort((a, b) => b[sort] - a[sort]), [campuses, sort]);
  const totals = useMemo(() => campuses.reduce(
    (t, c) => ({
      people: t.people + c.people,
      today: t.today + c.today,
      visits: t.visits + c.visits,
      files: t.files + c.files,
      docs: t.docs + c.slimdocx.opens,
      boards: t.boards + c.whiteboards.opens,
    }),
    { people: 0, today: 0, visits: 0, files: 0, docs: 0, boards: 0 }
  ), [campuses]);

  const selected = campuses.find(c => c.id === selectedId) || null;
  const rank = selected ? sorted.findIndex(c => c.id === selected.id) + 1 : 0;

  // Visitors per day, for everyone or the chosen campus
  const days = lastDays(30);
  const perDay = days.map(d => daily.filter(r => r.day === d && (!selected || r.campusId === selected.id)).reduce((n, r) => n + r.count, 0));
  const peak = Math.max(1, ...perDay);
  const visibleFeed = selected ? feed.filter(e => e.campusId === selected.id) : feed;

  const pickRegion = (r: Region) => { setSelectedId(null); setRegion(r); };
  const back = () => { setSelectedId(null); setRegion(region ?? 'Ghana'); };

  if (state !== 'ready') {
    return (
      <div className="min-h-screen bg-white pt-12 flex items-center justify-center text-[#6e6e73]">
        {state === 'failed' ? <p className="text-[17px]">Couldn't load campus numbers. Are you signed in as an admin?</p> : <Loader2 className="w-5 h-5 animate-spin" />}
      </div>
    );
  }

  return (
    <div className="campus-map fixed inset-x-0 top-12 bottom-0 bg-[#f2f2f0] text-[#1d1d1f]">
      <style>{MAP_CSS}</style>
      <div ref={mapEl} className="absolute inset-0 z-0" />

      {/* Region jumps */}
      <div className="absolute z-[500] top-3 right-3 md:top-4 md:right-4 flex rounded-full bg-white/90 backdrop-blur-xl p-1 shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
        {REGIONS.map(r => (
          <button
            key={r}
            onClick={() => pickRegion(r)}
            className={`px-3 h-8 rounded-full text-[13px] transition-colors ${!selected && region === r ? 'bg-[#1d1d1f] text-white font-medium' : 'text-[#424245] hover:text-[#1d1d1f]'}`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Zoom */}
      <div className="absolute z-[500] right-3 md:right-4 bottom-[calc(45dvh+12px)] md:bottom-8 flex flex-col rounded-2xl bg-white/90 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.12)] overflow-hidden">
        <button aria-label="Zoom in" onClick={() => map.current?.zoomIn()} className="w-10 h-10 flex items-center justify-center hover:bg-black/[0.04]"><Plus className="w-4 h-4" /></button>
        <span className="h-px bg-black/[0.08]" />
        <button aria-label="Zoom out" onClick={() => map.current?.zoomOut()} className="w-10 h-10 flex items-center justify-center hover:bg-black/[0.04]"><Minus className="w-4 h-4" /></button>
      </div>

      {/* Show the panel again on desktop */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="hidden md:flex absolute z-[500] top-4 left-4 items-center gap-1 h-10 px-4 rounded-full bg-white/90 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.12)] text-[14px] font-medium"
        >
          Campuses <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Side panel (bottom sheet on phones) */}
      <aside
        className={`absolute z-[600] inset-x-0 bottom-0 h-[45dvh] rounded-t-[22px] md:inset-auto md:top-4 md:left-4 md:bottom-4 md:h-auto md:w-[380px] md:rounded-[22px]
          bg-white/[0.92] backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.16)] flex flex-col overflow-hidden ${panelOpen ? '' : 'md:hidden'}`}
      >
        <div className="md:hidden mx-auto mt-2 h-1 w-9 rounded-full bg-black/15" />
        <header className="flex items-center justify-between gap-3 px-5 pt-3 md:pt-5 pb-3">
          {selected ? (
            <button onClick={back} className="flex items-center gap-0.5 -ml-1 text-[15px] text-red-600 font-medium">
              <ChevronLeft className="w-4 h-4" /> All campuses
            </button>
          ) : (
            <h1 className="text-[22px] font-semibold tracking-tight">Campuses</h1>
          )}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[12px] text-[#6e6e73]">
              <span className={`relative flex w-2 h-2 ${live ? '' : 'opacity-40'}`}>
                {live && <span className="absolute inset-0 rounded-full bg-[#30d158] animate-ping opacity-60" />}
                <span className={`relative w-2 h-2 rounded-full ${live ? 'bg-[#30d158]' : 'bg-[#6e6e73]'}`} />
              </span>
              {live ? 'Live' : 'Connecting…'}
            </span>
            <button onClick={() => setPanelOpen(false)} aria-label="Hide panel" className="hidden md:flex w-7 h-7 items-center justify-center rounded-full bg-black/[0.05] hover:bg-black/[0.08]">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {selected ? (
            <>
              {/* One campus */}
              <p className="text-[13px] text-[#6e6e73]">#{rank} by {SORTS.find(s => s.key === sort)!.label.toLowerCase()} · {selected.country}</p>
              <h2 className="text-[28px] font-semibold tracking-tight leading-tight">{selected.short}</h2>
              <p className="text-[14px] text-[#6e6e73]">{selected.name}</p>

              <div className="mt-4 flex items-end justify-between rounded-[18px] bg-[#f5f5f7] p-4">
                <div>
                  <p className="text-[12px] font-semibold text-[#6e6e73]">People</p>
                  <p className="text-[36px] leading-none font-semibold tracking-tight mt-1">{selected.people.toLocaleString()}</p>
                </div>
                <p className="text-right text-[12px] text-[#6e6e73]">+{selected.new7} this week<br />{selected.accounts} with accounts</p>
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  { k: 'Visits', v: selected.visits },
                  { k: 'Today', v: selected.today },
                  { k: 'Active 30d', v: selected.active30 },
                  { k: 'Files', v: selected.files },
                  { k: 'SlimDocx', v: selected.slimdocx.opens },
                  { k: 'Whiteboards', v: selected.whiteboards.opens },
                ].map(m => (
                  <div key={m.k} className="rounded-2xl bg-[#f5f5f7] py-3">
                    <dd className="text-[18px] font-semibold">{m.v.toLocaleString()}</dd>
                    <dt className="text-[11px] text-[#6e6e73]">{m.k}</dt>
                  </div>
                ))}
              </dl>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#6e6e73]">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> GPS {selected.byMethod.gps}</span>
                {selected.wifiDetection && <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Wi-Fi {selected.byMethod.wifi}</span>}
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> School email {selected.schoolEmailAccounts}</span>
              </div>

              <p className="mt-4 pt-4 border-t border-black/[0.06] text-[14px]">
                <span className="text-[#6e6e73]">{selected.ambassadors.length > 1 ? 'Ambassadors' : 'Ambassador'}: </span>
                {selected.ambassadors.join(' & ')}
              </p>
              <p className="mt-1 text-[12px] text-[#6e6e73]">
                {(selected.areas || []).length > 1 ? `${selected.areas!.length} areas` : 'Area'} on the map: {(selected.areas || []).map(a => `${a.radiusKm} km`).join(' and ')} around campus, hostels included.
              </p>
            </>
          ) : (
            <>
              {/* Everyone */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Visits', value: totals.visits },
                  { label: 'People', value: totals.people },
                  { label: 'Today', value: totals.today },
                  { label: 'Files', value: totals.files },
                  { label: 'SlimDocx', value: totals.docs },
                  { label: 'Boards', value: totals.boards },
                ].map(t => (
                  <div key={t.label} className="rounded-2xl bg-[#f5f5f7] px-3 py-2.5">
                    <p className="text-[11px] font-semibold text-[#6e6e73]">{t.label}</p>
                    <p className="text-[20px] leading-tight font-semibold tracking-tight">{t.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-2">
                <h2 className="text-[15px] font-semibold">By campus</h2>
                <div className="inline-flex rounded-full bg-[#f5f5f7] p-0.5">
                  {SORTS.map(s => (
                    <button
                      key={s.key}
                      onClick={() => setSort(s.key)}
                      className={`relative px-2.5 h-7 rounded-full text-[12px] ${sort === s.key ? 'text-[#1d1d1f] font-medium' : 'text-[#6e6e73] hover:text-[#1d1d1f]'}`}
                    >
                      {sort === s.key && <motion.span layoutId="campus-sort" className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />}
                      <span className="relative">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <ul className="mt-2 -mx-2">
                {sorted.map((c, i) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelectedId(c.id)}
                      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left hover:bg-black/[0.04]"
                    >
                      <span className="w-5 text-[12px] text-[#6e6e73] text-right shrink-0">{i + 1}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-medium truncate">{c.short}</span>
                        <span className="block text-[12px] text-[#6e6e73] truncate">{c.name} · {c.country}</span>
                      </span>
                      <span className="text-[15px] font-semibold tabular-nums">{c[sort].toLocaleString()}</span>
                      <ChevronRight className="w-4 h-4 text-[#c7c7cc] shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Visitors per day */}
          <section className="mt-5">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="text-[15px] font-semibold">Visitors per day</h2>
              <span className="text-[11px] text-[#6e6e73]">last 30 days</span>
            </div>
            <div className="flex items-end gap-[3px] h-16">
              {perDay.map((n, i) => (
                <div key={days[i]} className="flex-1 h-full flex items-end" title={`${days[i]}: ${n}`}>
                  <div className="w-full rounded-t-[3px] bg-red-600/85" style={{ height: `${Math.max(n ? 6 : 2, (n / peak) * 100)}%`, opacity: n ? 1 : 0.15 }} />
                </div>
              ))}
            </div>
          </section>

          {/* Live activity */}
          <section className="mt-5">
            <h2 className="text-[15px] font-semibold mb-1">Live activity</h2>
            {visibleFeed.length === 0 ? (
              <p className="py-4 text-[13px] text-[#6e6e73]">Nothing yet. Activity shows up here the moment it happens.</p>
            ) : (
              <ul className="-mx-2">
                <AnimatePresence initial={false}>
                  {visibleFeed.slice(0, 15).map(e => (
                    <motion.li
                      key={e.id}
                      layout
                      initial={{ opacity: 0, y: -8, backgroundColor: 'rgba(48,209,88,0.12)' }}
                      animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                      transition={{ duration: 0.4, backgroundColor: { duration: 2 } }}
                      className="px-2 py-2 rounded-xl border-b border-black/[0.04] last:border-0"
                    >
                      <button onClick={() => setSelectedId(e.campusId)} className="w-full flex items-center gap-2 text-left">
                        <span className="w-14 shrink-0 text-[12px] font-semibold truncate">{e.short}</span>
                        <span className="flex-1 min-w-0 text-[13px] truncate">
                          {e.newPerson ? 'A new person ' : 'Someone '}{KIND_TEXT[e.kind]}
                          <span className="text-[#6e6e73]"> · {METHOD_TEXT[e.method] ?? e.method}{e.signedIn ? ' · signed in' : ''}</span>
                        </span>
                        <span className="shrink-0 text-[11px] text-[#6e6e73]">{timeAgo(e.at, now)}</span>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}
