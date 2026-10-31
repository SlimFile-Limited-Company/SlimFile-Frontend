export type TransferStage = 'queued' | 'uploading' | 'processing' | 'downloading' | 'done' | 'error';

export interface TransferProgress {
  stage: TransferStage;
  /** Bytes sent while uploading, or received while downloading. */
  loaded: number;
  /** Total bytes for the current transfer, 0 when the server does not say. */
  total: number;
  /** Bytes per second for the current transfer. */
  speed: number;
  /** When the current stage began (ms since epoch). */
  stageStartedAt: number;
}

export const queuedProgress = (): TransferProgress => ({
  stage: 'queued', loaded: 0, total: 0, speed: 0, stageStartedAt: Date.now(),
});

export interface UploadResult {
  ok: boolean;
  status: number;
  blob: Blob;
  getHeader: (name: string) => string | null;
}

/**
 * POST a form and report real progress for the three parts of the request:
 * the upload, the server's processing time, and the download of the result.
 *
 * fetch() cannot report upload progress, which is why the tools used to fake
 * a progress bar. XMLHttpRequest exposes both directions.
 */
export function uploadWithProgress(
  url: string,
  body: FormData,
  headers: Record<string, string>,
  onProgress: (p: TransferProgress) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.responseType = 'blob';
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

    let stage: TransferStage = 'uploading';
    let stageStartedAt = Date.now();
    let lastLoaded = 0;
    let lastTime = stageStartedAt;
    let speed = 0;

    const enter = (next: TransferStage) => {
      stage = next;
      stageStartedAt = Date.now();
      lastLoaded = 0;
      lastTime = stageStartedAt;
      speed = 0;
    };

    // Smooth the speed over recent events so the ETA does not jump around.
    const track = (loaded: number) => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      if (dt >= 0.25) {
        const instant = (loaded - lastLoaded) / dt;
        speed = speed ? speed * 0.7 + instant * 0.3 : instant;
        lastLoaded = loaded;
        lastTime = now;
      }
    };

    onProgress({ stage, loaded: 0, total: 0, speed: 0, stageStartedAt });

    xhr.upload.onprogress = e => {
      track(e.loaded);
      onProgress({ stage: 'uploading', loaded: e.loaded, total: e.lengthComputable ? e.total : 0, speed, stageStartedAt });
    };

    // Upload finished: the server is now working on the file.
    xhr.upload.onload = () => {
      enter('processing');
      onProgress({ stage, loaded: 0, total: 0, speed: 0, stageStartedAt });
    };

    xhr.onprogress = e => {
      if (stage !== 'downloading') enter('downloading');
      track(e.loaded);
      onProgress({ stage, loaded: e.loaded, total: e.lengthComputable ? e.total : 0, speed, stageStartedAt });
    };

    xhr.onload = () => resolve({
      ok: xhr.status >= 200 && xhr.status < 300,
      status: xhr.status,
      blob: xhr.response as Blob,
      getHeader: name => xhr.getResponseHeader(name),
    });
    xhr.onerror = () => reject(new Error('Network error. Check your connection and try again.'));
    xhr.ontimeout = () => reject(new Error('The request timed out. Please try again.'));

    xhr.send(body);
  });
}
