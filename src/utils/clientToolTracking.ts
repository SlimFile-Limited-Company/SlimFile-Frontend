/**
 * Client-side tool usage reporting.
 *
 * OCR (Tesseract.js) and the QR generator (canvas/SVG) both run entirely in the
 * browser, so there is no processing request for the backend to hook. These two
 * report for themselves instead.
 *
 * Fire-and-forget by design: never awaited on the render path, never throws, so
 * a failed analytics call cannot break or slow down the tool.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type ClientTool = 'ocr' | 'qr';
type ClientToolEvent = 'visit' | 'complete';

export function reportClientTool(
  operation: ClientTool,
  event: ClientToolEvent,
  extra?: { detail?: string; pages?: number; characters?: number }
): void {
  try {
    // sendBeacon survives page unload, which is exactly when a 'visit' fires
    // if we ever attach one to an unload handler. Falls back to fetch.
    const body = JSON.stringify({ operation, event, ...(extra || {}) });
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(
        `${API_BASE_URL}/usage/client-tool`,
        new Blob([body], { type: 'application/json' })
      );
      return;
    }
    void fetch(`${API_BASE_URL}/usage/client-tool`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics must never surface an error to the user.
  }
}
