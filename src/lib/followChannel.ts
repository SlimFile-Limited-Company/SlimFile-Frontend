/**
 * Invites people to follow the SlimFile WhatsApp channel right after they
 * download a file, which is the one moment they are sure to be looking.
 *
 * Rules, so it never nags:
 *  - only from someone's second download
 *  - closing it hides it for 30 days; following hides it for good
 *  - at most once a week otherwise
 */
export const CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb9T1jmLCoWwJbdQCm1G';
export const DOWNLOADED_EVENT = 'slimfile:downloaded';

const COUNT_KEY = 'sf_download_count';
const FOLLOWED_KEY = 'sf_channel_followed';
const HIDE_UNTIL_KEY = 'sf_channel_hide_until';
const DAY = 86400000;

const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

/** Call whenever a finished file is downloaded. */
export function markDownloaded() {
  store.set(COUNT_KEY, String(Number(store.get(COUNT_KEY) || 0) + 1));
  window.dispatchEvent(new Event(DOWNLOADED_EVENT));
}

export function shouldInvite() {
  if (store.get(FOLLOWED_KEY)) return false;
  if (Number(store.get(COUNT_KEY) || 0) < 2) return false;
  return Date.now() >= Number(store.get(HIDE_UNTIL_KEY) || 0);
}

/** Shown: don't show again for a week, even if ignored. */
export function noteShown() {
  store.set(HIDE_UNTIL_KEY, String(Date.now() + 7 * DAY));
  track('whatsapp_channel_shown');
}

export function noteFollowed() {
  store.set(FOLLOWED_KEY, '1');
  track('whatsapp_channel_follow');
}

export function noteDismissed() {
  store.set(HIDE_UNTIL_KEY, String(Date.now() + 30 * DAY));
  track('whatsapp_channel_dismiss');
}

// Google Analytics events, so you can see views, follows and closes.
function track(event: string) {
  try {
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', event);
  } catch { /* analytics blocked */ }
}
