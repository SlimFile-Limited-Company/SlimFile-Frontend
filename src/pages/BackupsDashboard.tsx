import { Fragment, useEffect, useState } from 'react';
import { ChevronDown, ExternalLink, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

type Health = 'ok' | 'failed' | 'late' | 'unknown';
interface Db { name: string; kind: string; bytes: number }
interface Folder { path: string; bytes: number }
interface LibraryFile {
  name: string; id: string; sizeBytes: number; modifiedAt: string; day: string;
  kept: ('daily' | 'weekly' | 'monthly')[]; removeOn: string; driveUrl: string | null;
  run: { id: string; durationSec: number; fileCount: number; databases: Db[]; folders: Folder[]; startedAt: string } | null;
}
interface Run {
  id: string; date: string; status: 'ok' | 'failed'; failedStep: string; startedAt: string; finishedAt: string;
  durationSec: number; sizeBytes: number; fileCount: number; fileName: string;
}
interface Status {
  health: Health;
  schedule: { cron: string; timeZone: string; label: string; nextRunAt: string };
  latest: (Run & { log: string; host: string; databases: Db[] }) | null;
  lastOkAt: string | null;
  library: LibraryFile[];
  otherFiles: { name: string; id: string; sizeBytes: number }[];
  libraryBytes: number;
  drive: { checkedAt: string; folder: string; stale: boolean; quota: { totalBytes: number; usedBytes: number; freeBytes: number } } | null;
  runs: Run[];
  generatedAt: string;
}

const MONO = 'font-mono tabular-nums';

const bytes = (b: number) => {
  if (!b) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(u.length - 1, Math.floor(Math.log(b) / Math.log(1024)));
  return `${parseFloat((b / 1024 ** i).toFixed(i >= 3 ? 2 : 1))} ${u[i]}`;
};
const dur = (s: number) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`);
const ago = (iso: string | null) => {
  if (!iso) return '—';
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 48 ? `${h} h ago` : `${Math.round(h / 24)} days ago`;
};
const until = (iso: string) => {
  const m = Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 60000));
  return m < 60 ? `in ${m} min` : `in ${Math.floor(m / 60)} h ${m % 60} min`;
};
const stamp = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const dayLabel = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

const HEALTH: Record<Health, { label: string; dot: string; note: string }> = {
  ok: { label: 'Healthy', dot: 'bg-[#34c759]', note: 'Last backup worked' },
  failed: { label: 'Failed', dot: 'bg-red-600', note: 'Last backup failed' },
  late: { label: 'Late', dot: 'bg-[#ff9f0a]', note: 'No backup in over 26 hours' },
  unknown: { label: 'No data', dot: 'bg-[#8e8e93]', note: 'No backup reported yet' },
};

function Dot({ className }: { className: string }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className={`absolute inset-0 rounded-full ${className} opacity-40 animate-ping`} />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${className}`} />
    </span>
  );
}

function Stat({ label, children, sub }: { label: string; children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="rounded-[22px] bg-[#f5f5f7] p-5 sm:p-6 min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">{label}</p>
      <div className="mt-2 text-[26px] sm:text-[30px] leading-tight font-semibold tracking-tight truncate">{children}</div>
      {sub && <p className={`mt-1.5 text-[12px] text-[#6e6e73] ${MONO} truncate`}>{sub}</p>}
    </div>
  );
}

const KEPT_STYLE: Record<string, string> = {
  daily: 'bg-black/[0.06] text-[#1d1d1f]',
  weekly: 'bg-[#1d1d1f] text-white',
  monthly: 'bg-red-600 text-white',
};

/** What's inside one backup: databases and the main folders, as thin bars. */
function Contents({ f }: { f: LibraryFile }) {
  if (!f.run) {
    return <p className="text-[13px] text-[#6e6e73]">No details for this file (it was made before the Backups page existed).</p>;
  }
  const dbMax = Math.max(1, ...f.run.databases.map(d => d.bytes));
  const fMax = Math.max(1, ...f.run.folders.map(d => d.bytes));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73] mb-3">Databases · {f.run.databases.length}</p>
        <ul className="space-y-2">
          {f.run.databases.map(d => (
            <li key={d.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
              <span className={`text-[12px] ${MONO} truncate`}>
                <span className="text-[#6e6e73]">{d.kind}</span> {d.name}
              </span>
              <span className={`text-[12px] ${MONO} text-right`}>{bytes(d.bytes)}</span>
              <div className="col-span-2 h-1 rounded-full bg-black/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-[#1d1d1f]" style={{ width: `${Math.max(2, (d.bytes / dbMax) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73] mb-3">Folders (before compression)</p>
        <ul className="space-y-2">
          {f.run.folders.map(d => (
            <li key={d.path} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
              <span className={`text-[12px] ${MONO} truncate`}>{d.path}</span>
              <span className={`text-[12px] ${MONO} text-right`}>{bytes(d.bytes)}</span>
              <div className="col-span-2 h-1 rounded-full bg-black/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-red-600" style={{ width: `${Math.max(2, (d.bytes / fMax) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <dl className={`mt-5 grid grid-cols-3 gap-3 text-[12px] ${MONO}`}>
          <div><dt className="text-[#6e6e73]">files</dt><dd className="font-semibold">{f.run.fileCount.toLocaleString()}</dd></div>
          <div><dt className="text-[#6e6e73]">took</dt><dd className="font-semibold">{dur(f.run.durationSec)}</dd></div>
          <div><dt className="text-[#6e6e73]">started</dt><dd className="font-semibold">{stamp(f.run.startedAt)}</dd></div>
        </dl>
      </div>
    </div>
  );
}

/** Backup size per run, oldest → newest. Failed runs show as a red stub. */
function SizeHistory({ runs }: { runs: Run[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const list = [...runs].reverse().slice(-45);
  const peak = Math.max(1, ...list.map(r => r.sizeBytes));
  if (!list.length) return null;
  return (
    <section className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[21px] font-semibold tracking-tight">Size over time</h2>
          <p className="text-[13px] text-[#6e6e73]">Encrypted backup size per run. A sudden jump means something new is taking space.</p>
        </div>
        <span className={`text-[12px] text-[#6e6e73] ${MONO} whitespace-nowrap`}>last {list.length} runs</span>
      </div>
      <div className="relative">
        <div className="flex items-end gap-[3px] h-32" onMouseLeave={() => setHover(null)}>
          {list.map((r, i) => (
            <div key={r.id} className="flex-1 h-full flex items-end max-w-[28px]" onMouseEnter={() => setHover(i)}>
              <div
                className={`w-full rounded-t-[4px] transition-opacity ${hover !== null && hover !== i ? 'opacity-40' : ''} ${r.status === 'ok' ? 'bg-[#1d1d1f]' : 'bg-red-600'}`}
                style={{ height: r.status === 'ok' ? `${Math.max(4, (r.sizeBytes / peak) * 100)}%` : '6%' }}
              />
            </div>
          ))}
        </div>
        {hover !== null && (
          <div
            className={`pointer-events-none absolute -top-2 -translate-y-full -translate-x-1/2 rounded-xl bg-white px-3 py-2 text-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] whitespace-nowrap ${MONO}`}
            style={{ left: `${Math.min(90, Math.max(10, ((hover + 0.5) / list.length) * 100))}%` }}
          >
            <span className="text-[#6e6e73]">{list[hover].date}</span>
            <span className="ml-2 font-semibold">{list[hover].status === 'ok' ? bytes(list[hover].sizeBytes) : 'failed'}</span>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Server backups (Contabo → Google Drive). The server backs itself up every
 * night and reports here; the Drive folder is re-checked every hour. This page
 * only shows what's there. Restoring is done by hand (RESTORE.md).
 */
export default function BackupsDashboard() {
  const [s, setS] = useState<Status | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [open, setOpen] = useState<string | null>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    const load = () =>
      fetch(`${API_BASE_URL}/backups/status`, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, cache: 'no-store' })
        .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data: Status) => { setS(data); setState('ready'); })
        .catch(() => setState(x => (x === 'ready' ? x : 'failed')));
    load();
    const t = setInterval(load, 60000);
    const c = setInterval(() => tick(n => n + 1), 30000); // keep "x min ago" fresh
    return () => { clearInterval(t); clearInterval(c); };
  }, []);

  if (state !== 'ready' || !s) {
    return (
      <div className="min-h-screen bg-white pt-12 flex items-center justify-center text-[#6e6e73]">
        {state === 'failed' ? <p className="text-[17px]">Couldn't load backups. Are you signed in as an admin?</p> : <Loader2 className="w-5 h-5 animate-spin" />}
      </div>
    );
  }

  const h = HEALTH[s.health];
  const q = s.drive?.quota;
  const okRuns = s.runs.filter(r => r.status === 'ok').length;

  return (
    <div className="min-h-screen bg-white pt-12 text-[#1d1d1f]">
      <section className="px-4 sm:px-6 pt-16 sm:pt-20 pb-10 text-center">
        <p className="text-[17px] font-semibold text-red-600 mb-3">Internal</p>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05]">Backups.</h1>
        <p className="mt-5 text-xl sm:text-2xl text-[#6e6e73] max-w-2xl mx-auto leading-snug">
          The whole server, every night, encrypted, in Google Drive.
        </p>
        <p className={`mt-4 text-[12px] text-[#6e6e73] ${MONO}`}>
          contabo:{s.latest?.host || 'server'} → gdrive:/{s.drive?.folder || 'SlimFile Server Backups'} · AES-256 · {s.schedule.cron} {s.schedule.timeZone}
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 space-y-10">
        {/* Status */}
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Stat label="Status" sub={h.note}>
            <span className="inline-flex items-center gap-3"><Dot className={h.dot} />{h.label}</span>
          </Stat>
          <Stat label="Last backup" sub={s.latest ? `${stamp(s.latest.finishedAt)} · ${dur(s.latest.durationSec)}` : undefined}>
            {ago(s.latest?.finishedAt ?? null)}
          </Stat>
          <Stat label="Next backup" sub={stamp(s.schedule.nextRunAt)}>{until(s.schedule.nextRunAt)}</Stat>
          <Stat
            label="In Google Drive"
            sub={q && q.totalBytes ? `${bytes(q.usedBytes)} of ${bytes(q.totalBytes)} used` : undefined}
          >
            <span className={MONO}>{s.library.length}</span> <span className="text-[17px] font-medium text-[#6e6e73]">files · {bytes(s.libraryBytes)}</span>
          </Stat>
        </section>

        {s.latest?.status === 'failed' && (
          <div className="rounded-[22px] border border-red-600/30 bg-red-50 p-5 text-[14px]">
            <p className="font-semibold text-red-700">Last night's backup failed at: {s.latest.failedStep || 'unknown step'}</p>
            <p className="mt-1 text-red-700/80">The older backups below are still safe. See the log at the bottom of this page.</p>
          </div>
        )}

        {/* Library */}
        <section className="rounded-[28px] bg-[#f5f5f7] p-2 sm:p-3">
          <div className="flex items-baseline justify-between gap-4 px-4 sm:px-5 pt-4 pb-3">
            <div>
              <h2 className="text-[21px] font-semibold tracking-tight">Backup library</h2>
              <p className="text-[13px] text-[#6e6e73]">Kept: 7 nights, Sundays for 4 weeks, the 1st of each month for 6 months. Click a row to see what's inside.</p>
            </div>
            <span className={`text-[12px] text-[#6e6e73] ${MONO} whitespace-nowrap hidden sm:block`}>
              {s.drive ? `checked ${ago(s.drive.checkedAt)}` : 'not checked yet'}
            </span>
          </div>

          {s.library.length === 0 ? (
            <p className="px-5 py-10 text-center text-[15px] text-[#6e6e73]">No backups in Drive yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-1 min-w-[720px]">
                <thead>
                  <tr className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">
                    <th className="px-4 py-2 font-semibold">Date</th>
                    <th className="px-4 py-2 font-semibold">File</th>
                    <th className="px-4 py-2 font-semibold text-right">Size</th>
                    <th className="px-4 py-2 font-semibold">Kept as</th>
                    <th className="px-4 py-2 font-semibold">Removed on</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {s.library.map((f, i) => {
                    const isOpen = open === f.name;
                    return (
                      <Fragment key={f.name}>
                        <tr
                          onClick={() => setOpen(isOpen ? null : f.name)}
                          className="bg-white cursor-pointer hover:bg-white/70 transition-colors"
                        >
                          <td className="px-4 py-3 rounded-l-2xl">
                            <div className="flex items-center gap-2.5">
                              <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-[#34c759]' : 'bg-black/20'}`} />
                              <span className="text-[14px] font-medium whitespace-nowrap">{dayLabel(f.day)}</span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-[12px] ${MONO} text-[#6e6e73] whitespace-nowrap`}>{f.name}</td>
                          <td className={`px-4 py-3 text-[13px] ${MONO} text-right whitespace-nowrap`}>{bytes(f.sizeBytes)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              {f.kept.map(k => (
                                <span key={k} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${KEPT_STYLE[k]}`}>{k}</span>
                              ))}
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-[12px] ${MONO} text-[#6e6e73] whitespace-nowrap`}>{f.removeOn}</td>
                          <td className="px-4 py-3 rounded-r-2xl">
                            <div className="flex items-center justify-end gap-3">
                              {f.driveUrl && (
                                <a
                                  href={f.driveUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-[12px] font-medium text-red-600 hover:underline whitespace-nowrap"
                                >
                                  Drive <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <ChevronDown className={`w-4 h-4 text-[#6e6e73] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr>
                            <td colSpan={6} className="px-4 sm:px-6 py-5 bg-white rounded-2xl">
                              <Contents f={f} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {s.otherFiles.length > 0 && (
            <p className={`px-5 pb-3 pt-2 text-[12px] text-[#6e6e73] ${MONO}`}>
              also in the folder: {s.otherFiles.map(f => f.name).join(', ')}
            </p>
          )}
        </section>

        <SizeHistory runs={s.runs} />

        {/* Run history */}
        <section className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <div>
              <h2 className="text-[21px] font-semibold tracking-tight">Run history</h2>
              <p className="text-[13px] text-[#6e6e73]">Every run, including failed ones.</p>
            </div>
            <span className={`text-[12px] text-[#6e6e73] ${MONO} whitespace-nowrap`}>{okRuns}/{s.runs.length} ok</span>
          </div>
          {s.runs.length === 0 ? (
            <p className="py-6 text-center text-[15px] text-[#6e6e73]">No runs reported yet. The first one appears after tonight's backup.</p>
          ) : (
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className={`w-full text-left text-[12px] ${MONO} min-w-[560px]`}>
                <thead className="sticky top-0 bg-[#f5f5f7]">
                  <tr className="text-[#6e6e73]">
                    <th className="py-2 pr-4 font-normal">started</th>
                    <th className="py-2 pr-4 font-normal">status</th>
                    <th className="py-2 pr-4 font-normal text-right">took</th>
                    <th className="py-2 pr-4 font-normal text-right">size</th>
                    <th className="py-2 pr-4 font-normal text-right">files</th>
                    <th className="py-2 font-normal">note</th>
                  </tr>
                </thead>
                <tbody>
                  {s.runs.map(r => (
                    <tr key={r.id} className="border-t border-black/[0.06]">
                      <td className="py-2 pr-4 whitespace-nowrap">{stamp(r.startedAt)}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${r.status === 'ok' ? 'bg-[#34c759]' : 'bg-red-600'}`} />
                          {r.status === 'ok' ? 'ok' : 'failed'}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right">{dur(r.durationSec)}</td>
                      <td className="py-2 pr-4 text-right">{r.status === 'ok' ? bytes(r.sizeBytes) : '—'}</td>
                      <td className="py-2 pr-4 text-right">{r.fileCount ? r.fileCount.toLocaleString() : '—'}</td>
                      <td className="py-2 text-[#6e6e73] truncate max-w-[260px]">{r.status === 'failed' ? r.failedStep : r.fileName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Log */}
        {s.latest?.log && (
          <section>
            <div className="flex items-baseline justify-between gap-4 mb-3 px-1">
              <h2 className="text-[21px] font-semibold tracking-tight">Last run log</h2>
              <span className={`text-[12px] text-[#6e6e73] ${MONO}`}>/var/log/slimfile-backup.log</span>
            </div>
            <pre className={`rounded-[22px] bg-[#1d1d1f] text-[#f5f5f7] p-5 sm:p-6 text-[12px] leading-relaxed ${MONO} overflow-x-auto max-h-[380px] overflow-y-auto`}>
              {s.latest.log.split('\n').map((line, i) => (
                <div key={i} className={/FAILED|error/i.test(line) ? 'text-red-400' : /OK|===/.test(line) ? 'text-[#30d158]' : ''}>
                  {line || ' '}
                </div>
              ))}
            </pre>
          </section>
        )}

        <p className="text-[12px] text-[#6e6e73] text-center max-w-2xl mx-auto leading-relaxed">
          This page only shows the backups. They run on their own every night. Restoring is done by hand on the server,
          following RESTORE.md in the same Drive folder. The password is in the "SlimFile Backup Password" folder.
          Updated {new Date(s.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}.
        </p>
      </div>
    </div>
  );
}
