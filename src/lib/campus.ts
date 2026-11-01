/**
 * Credits visits and finished files to ambassador campuses.
 *
 * The browser's location is used only when the visitor has allowed it, and it
 * is sent once to pick the campus; the server keeps the campus, never the
 * location. Without location, the server can still recognise campus Wi-Fi.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

const VISITOR_KEY = 'sf_visitor_id';
const ASKED_KEY = 'sf_campus_asked';
const VISIT_KEY = 'sf_campus_visit_day';
const CAMPUS_KEY = 'sf_campus';
const REMEMBER_DAYS = 30;
export const ASK_EVENT = 'slimfile:ask-campus';

const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

const visitorId = () => {
  let id = store.get(VISITOR_KEY);
  if (!id) {
    id = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^\w-]/g, '');
    store.set(VISITOR_KEY, id);
  }
  return id;
};

const locationAllowed = async () => {
  if (!('geolocation' in navigator) || !navigator.permissions) return false;
  try {
    return (await navigator.permissions.query({ name: 'geolocation' })).state === 'granted';
  } catch {
    return false;
  }
};

// Never shows a prompt: only reads the location when it is already allowed.
const currentPosition = (): Promise<{ lat: number; lng: number } | null> =>
  new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve(null),
      { maximumAge: 30 * 60 * 1000, timeout: 8000 }
    );
  });

export interface CampusResult { id: string; short: string; name: string }

type Kind = 'visit' | 'file' | 'slimdocx' | 'whiteboard';

// The campus GPS last placed this browser on, kept for 30 days.
const rememberedCampus = () => {
  try {
    const saved = JSON.parse(store.get(CAMPUS_KEY) || 'null');
    return saved && Date.now() - saved.at < REMEMBER_DAYS * 86400000 ? (saved.id as string) : undefined;
  } catch {
    return undefined;
  }
};

const send = async (kind: Kind, coords: { lat: number; lng: number } | null) => {
  const token = store.get('jwt');
  const res = await fetch(`${API_BASE_URL}/campus/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ visitorId: visitorId(), kind, ...(coords || {}), campusHint: rememberedCampus() }),
  });
  if (!res.ok) return null;
  const { campus, method } = await res.json();
  if (campus && method === 'gps') store.set(CAMPUS_KEY, JSON.stringify({ id: campus.id, at: Date.now() }));
  return campus as CampusResult | null;
};

export async function trackCampus(kind: Kind): Promise<CampusResult | null> {
  try {
    const coords = (await locationAllowed()) ? await currentPosition() : null;
    return await send(kind, coords);
  } catch {
    return null;
  }
}

/** Once a day per browser. */
export function trackCampusVisit() {
  const day = new Date().toISOString().slice(0, 10);
  if (store.get(VISIT_KEY) === day) return;
  store.set(VISIT_KEY, day);
  trackCampus('visit');
}

/** Opened a SlimDocx document or a whiteboard. */
export function trackCampusUse(kind: 'slimdocx' | 'whiteboard') {
  trackCampus(kind);
}

/** After a finished file: count it, and ask once about location. */
export async function trackCampusFile() {
  await trackCampus('file');
  if (store.get(ASKED_KEY) || !('geolocation' in navigator)) return;
  try {
    if (navigator.permissions && (await navigator.permissions.query({ name: 'geolocation' })).state !== 'prompt') return;
  } catch { /* ask anyway */ }
  window.dispatchEvent(new Event(ASK_EVENT));
}

/** The visitor tapped Allow: shows the browser's own prompt, then credits the campus. */
export function shareLocationForCampus(): Promise<CampusResult | null | 'denied'> {
  store.set(ASKED_KEY, '1');
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      p => send('visit', { lat: p.coords.latitude, lng: p.coords.longitude }).then(resolve, () => resolve(null)),
      () => resolve('denied'),
      { timeout: 15000 }
    );
  });
}

export function declineCampusPrompt() {
  store.set(ASKED_KEY, '1');
}
