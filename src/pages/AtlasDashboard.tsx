import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface DayCount { day: string; count: number }
interface Retention { days: number; eligible: number; returned: number; rate: number | null }
interface AtlasConfig { platform?: 'ios' | 'android'; minVersion: string; latestVersion: string; storeUrl: string; message: string; updatedAt: string | null }
interface AtlasStats {
  users: { total: number; today: number; week: number; month: number };
  activePerDay: DayCount[];
  newPerDay: DayCount[];
  videos: {
    total: number; last30: number; inputBytes: number; outputBytes: number; savedBytes: number;
    avgReductionPct: number | null; avgDurationSec: number | null; codecs: { hevc: number; h264: number };
  };
  actions: { opens: number; savedToPhotos: number; originalsDeleted: number; shared: number };
  versions: { version: string; platform?: 'ios' | 'android'; count: number }[];
  retention: Retention[];
  config: AtlasConfig;
  configs?: { ios: AtlasConfig; android: AtlasConfig };
  failures?: {
    total30: number;
    byPhone: { maker: string | null; model: string | null; osVersion: string | null; errorCode: string | null; count: number; users: number; lastAt: string }[];
    recent: { at: string; deviceMaker: string | null; deviceModel: string | null; osVersion: string | null; errorCode: string | null; errorDetail: string | null; appVersion: string; inputWidth: number | null; inputHeight: number | null; inputCodec: string | null }[];
  };
  generatedAt: string;
}

const formatBytes = (b: number) => {
  if (!b) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(u.length - 1, Math.floor(Math.log(b) / Math.log(1000)));
  return `${parseFloat((b / 1000 ** i).toFixed(1))} ${u[i]}`;
};

const lastDays = (n: number) =>
  Array.from({ length: n }, (_, i) => new Date(Date.now() - (n - 1 - i) * 86400000).toISOString().slice(0, 10));

const shortDate = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** One series per day for the last 30 days: thin red bars, a tooltip on hover. */
function DailyBars({ title, note, data, unit }: { title: string; note: string; data: DayCount[]; unit: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const days = lastDays(30);
  const values = days.map(d => data.find(r => r.day === d)?.count || 0);
  const peak = Math.max(1, ...values);
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <section className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
      <div className="flex items-baseline justify-between mb-6 gap-4">
        <div>
          <h2 className="text-[21px] font-semibold tracking-tight">{title}</h2>
          <p className="text-[13px] text-[#6e6e73]">{note}</p>
        </div>
        <span className="text-[13px] text-[#6e6e73] whitespace-nowrap">last 30 days</span>
      </div>
      {total === 0 ? (
        <p className="h-36 flex items-center justify-center text-[15px] text-[#6e6e73]">No data yet.</p>
      ) : (
        <div className="relative">
          <div className="flex items-end gap-[2px] h-36" onMouseLeave={() => setHover(null)}>
            {values.map((n, i) => (
              <div
                key={days[i]}
                className="flex-1 h-full flex items-end cursor-default"
                onMouseEnter={() => setHover(i)}
                aria-label={`${shortDate(days[i])}: ${n} ${unit}`}
              >
                <div
                  className={`w-full rounded-t-[4px] transition-opacity ${hover !== null && hover !== i ? 'opacity-40' : ''}`}
                  style={{ height: `${n ? Math.max(4, (n / peak) * 100) : 1}%`, background: n ? '#dc2626' : 'rgba(0,0,0,0.08)' }}
                />
              </div>
            ))}
          </div>
          {hover !== null && (
            <div
              className="pointer-events-none absolute -top-2 -translate-y-full -translate-x-1/2 rounded-xl bg-white px-3 py-2 text-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] whitespace-nowrap"
              style={{ left: `${((hover + 0.5) / 30) * 100}%` }}
            >
              <span className="text-[#6e6e73]">{shortDate(days[hover])}</span>
              <span className="ml-2 font-semibold text-[#1d1d1f]">{values[hover]} {unit}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between text-[11px] text-[#6e6e73]">
            <span>{shortDate(days[0])}</span>
            <span>Today</span>
          </div>
        </div>
      )}
    </section>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[22px] bg-[#f5f5f7] p-6">
      <p className="text-[13px] font-semibold text-[#6e6e73]">{label}</p>
      <p className="mt-2 text-[40px] leading-none font-semibold tracking-tight tabular-nums">{value}</p>
      {sub && <p className="mt-2 text-[13px] text-[#6e6e73]">{sub}</p>}
    </div>
  );
}

/** Android phones where compression failed (after the app's own retries). Anonymous. */
function AndroidFailures({ f }: { f: NonNullable<AtlasStats['failures']> }) {
  const code = (c: string | null) => (c || 'UNKNOWN').replace(/^ERROR_CODE_/, '');
  const phone = (maker: string | null, model: string | null) => [maker, model].filter(Boolean).join(' ') || 'Unknown phone';
  return (
    <section className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <div>
          <h2 className="text-[21px] font-semibold tracking-tight">Android problems</h2>
          <p className="text-[13px] text-[#6e6e73]">Videos that failed even after Atlas retried with simpler settings. Phone and error only, never the video.</p>
        </div>
        <span className="text-[13px] text-[#6e6e73] whitespace-nowrap tabular-nums">{f.total30} in 30 days</span>
      </div>
      {f.total30 === 0 ? (
        <p className="py-6 text-center text-[15px] text-[#6e6e73]">No failures reported.</p>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] min-w-[560px]">
              <thead><tr className="text-[11px] uppercase tracking-[0.06em] text-[#6e6e73]">
                <th className="py-2 pr-4 font-semibold">Phone</th><th className="py-2 pr-4 font-semibold">Android</th>
                <th className="py-2 pr-4 font-semibold">Error</th><th className="py-2 pr-4 font-semibold text-right">Failures</th>
                <th className="py-2 font-semibold text-right">Users</th>
              </tr></thead>
              <tbody>
                {f.byPhone.map((r, i) => (
                  <tr key={i} className="border-t border-black/[0.06]">
                    <td className="py-2 pr-4 font-medium">{phone(r.maker, r.model)}</td>
                    <td className="py-2 pr-4 tabular-nums">{r.osVersion || '—'}</td>
                    <td className="py-2 pr-4 font-mono text-[12px] text-red-600">{code(r.errorCode)}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{r.count}</td>
                    <td className="py-2 text-right tabular-nums">{r.users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6e6e73] mb-2">Latest</p>
            <ul className="space-y-2">
              {f.recent.map((r, i) => (
                <li key={i} className="rounded-2xl bg-white p-3 text-[12px]">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-medium">{phone(r.deviceMaker, r.deviceModel)} · Android {r.osVersion || '?'} · app {r.appVersion || '?'}</span>
                    <span className="text-[#6e6e73]">{new Date(r.at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-[#6e6e73] break-all">
                    {r.inputWidth && r.inputHeight ? `${r.inputWidth}×${r.inputHeight} ${r.inputCodec || ''} · ` : ''}{r.errorDetail || code(r.errorCode)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

/** Update rules: phones below the minimum version are asked to update before they can continue. */
function UpdateRules({ configs, onSaved }: { configs: { ios: AtlasConfig; android: AtlasConfig }; onSaved: (platform: 'ios' | 'android', c: AtlasConfig) => void }) {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const config = configs[platform];
  const [form, setForm] = useState(config);
  useEffect(() => { setForm(configs[platform]); setState('idle'); }, [platform]); // eslint-disable-line react-hooks/exhaustive-deps
  const store = platform === 'ios' ? 'App Store' : 'Play Store';
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');
  const changed = JSON.stringify(form) !== JSON.stringify(config);
  const forcing = form.minVersion !== '1.0.0';

  const save = async () => {
    setState('saving');
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/atlas/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        body: JSON.stringify({ ...form, platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save');
      onSaved(platform, data);
      setForm(data);
      setState('saved');
      setTimeout(() => setState('idle'), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save');
      setState('error');
    }
  };

  const field = 'mt-1.5 w-full rounded-xl bg-white px-3.5 py-2.5 text-[15px] border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-red-600/30';

  return (
    <section className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[21px] font-semibold tracking-tight">Updates</h2>
        <div className="inline-flex rounded-full bg-black/[0.06] p-1" role="tablist" aria-label="Platform">
          {(['ios', 'android'] as const).map(p => (
            <button
              key={p}
              role="tab"
              aria-selected={platform === p}
              onClick={() => setPlatform(p)}
              className={`h-8 px-4 rounded-full text-[13px] font-medium transition-colors ${platform === p ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#6e6e73]'}`}
            >
              {p === 'ios' ? 'iPhone' : 'Android'}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-[15px] text-[#6e6e73] max-w-2xl">
        Rules for <strong className="text-[#1d1d1f]">{platform === 'ios' ? 'iPhone' : 'Android'}</strong> only. When someone opens
        Atlas on a version below the minimum, they see an “Update to continue” screen with a button to the {store}. Raise the
        minimum only after the new version is live on the {store}.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-semibold text-[#6e6e73]">
          Minimum version (must update below this)
          <input className={field} value={form.minVersion} onChange={e => setForm({ ...form, minVersion: e.target.value.trim() })} placeholder="1.0.1" />
        </label>
        <label className="text-[13px] font-semibold text-[#6e6e73]">
          Latest version on the {store}
          <input className={field} value={form.latestVersion} onChange={e => setForm({ ...form, latestVersion: e.target.value.trim() })} placeholder="1.0.1" />
        </label>
        <label className="text-[13px] font-semibold text-[#6e6e73] sm:col-span-2">
          Message on the update screen
          <input className={field} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} maxLength={300} />
        </label>
        <label className="text-[13px] font-semibold text-[#6e6e73] sm:col-span-2">
          {store} link
          <input className={field} value={form.storeUrl} onChange={e => setForm({ ...form, storeUrl: e.target.value.trim() })} />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          disabled={!changed || state === 'saving'}
          className="h-11 px-6 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-[15px] font-medium inline-flex items-center gap-2"
        >
          {state === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
          {state === 'saved' ? 'Saved' : 'Save'}
        </button>
        <span className="text-[13px] text-[#6e6e73]">
          {forcing ? `${platform === 'ios' ? 'iPhones' : 'Android phones'} below ${form.minVersion} must update.` : `Nobody on ${platform === 'ios' ? 'iPhone' : 'Android'} is forced to update.`}
          {config.updatedAt && ` Last changed ${new Date(config.updatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}.`}
        </span>
        {state === 'error' && <span className="text-[13px] text-red-600">{error}</span>}
      </div>
    </section>
  );
}

/**
 * SlimFile Atlas numbers. Atlas has no accounts: each install sends anonymous
 * events with a random ID, so a person on two phones counts twice and offline
 * days arrive when the phone is next online.
 */
export default function AtlasDashboard() {
  const [stats, setStats] = useState<AtlasStats | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    const load = () =>
      fetch(`${API_BASE_URL}/atlas/stats`, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, cache: 'no-store' })
        .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data: AtlasStats) => { setStats(data); setState('ready'); })
        .catch(() => setState(s => (s === 'ready' ? s : 'failed')));
    load();
    const t = setInterval(load, 120000);
    return () => clearInterval(t);
  }, []);

  const versionTotal = useMemo(() => stats?.versions.reduce((n, v) => n + v.count, 0) || 0, [stats]);

  if (state !== 'ready' || !stats) {
    return (
      <div className="min-h-screen bg-white pt-12 flex items-center justify-center text-[#6e6e73]">
        {state === 'failed' ? <p className="text-[17px]">Couldn't load Atlas numbers. Are you signed in as an admin?</p> : <Loader2 className="w-5 h-5 animate-spin" />}
      </div>
    );
  }

  const { users, videos, actions } = stats;
  const codecTotal = videos.codecs.hevc + videos.codecs.h264;

  return (
    <div className="min-h-screen bg-white pt-12 text-[#1d1d1f]">
      <section className="px-4 sm:px-6 pt-16 sm:pt-20 pb-10 text-center">
        <p className="text-[17px] font-semibold text-red-600 mb-3">SlimFile Atlas</p>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05]">Atlas.</h1>
        <p className="mt-5 text-xl sm:text-2xl text-[#6e6e73] max-w-2xl mx-auto leading-snug">
          Who uses the video compressor, and how much space it saves. Anonymous: no accounts, no names.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 space-y-10">
        {/* Users */}
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Tile label="Users" value={users.total.toLocaleString()} sub="installs that opened Atlas" />
          <Tile label="Active today" value={users.today.toLocaleString()} />
          <Tile label="Active this week" value={users.week.toLocaleString()} sub="last 7 days" />
          <Tile label="Active this month" value={users.month.toLocaleString()} sub="last 30 days" />
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <DailyBars title="Active users" note="Phones that opened Atlas each day" data={stats.activePerDay} unit="users" />
          <DailyBars title="New users" note="First time Atlas was opened on a phone" data={stats.newPerDay} unit="new" />
        </div>

        {/* Videos */}
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Tile label="Videos compressed" value={videos.total.toLocaleString()} sub={`${videos.last30.toLocaleString()} in the last 30 days`} />
          <Tile label="Space saved" value={formatBytes(videos.savedBytes)} sub={`${formatBytes(videos.inputBytes)} → ${formatBytes(videos.outputBytes)}`} />
          <Tile label="Smaller on average" value={videos.avgReductionPct === null ? '—' : `${videos.avgReductionPct}%`} />
          <Tile label="Average time" value={videos.avgDurationSec === null ? '—' : `${videos.avgDurationSec}s`} sub="per video" />
        </section>

        {/* Behaviour */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
            <h2 className="text-[21px] font-semibold tracking-tight">Come back</h2>
            <p className="text-[13px] text-[#6e6e73]">Users who used Atlas again at least this long after their first day</p>
            <dl className="mt-5 space-y-3">
              {stats.retention.map(r => (
                <div key={r.days} className="flex items-baseline justify-between">
                  <dt className="text-[15px]">{r.days === 1 ? 'Next day' : `After ${r.days} days`}</dt>
                  <dd className="text-[15px] tabular-nums">
                    <span className="font-semibold">{r.rate === null ? '—' : `${r.rate}%`}</span>
                    <span className="ml-2 text-[12px] text-[#6e6e73]">{r.eligible ? `${r.returned} of ${r.eligible}` : 'not enough data'}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
            <h2 className="text-[21px] font-semibold tracking-tight">What people do</h2>
            <dl className="mt-5 space-y-3">
              {[
                ['App opened', actions.opens],
                ['Saved to Photos', actions.savedToPhotos],
                ['Originals deleted', actions.originalsDeleted],
                ['Shared', actions.shared],
                ['Smaller (HEVC)', videos.codecs.hevc],
                ['Compatible (H.264)', videos.codecs.h264],
              ].map(([k, v]) => (
                <div key={k as string} className="flex items-baseline justify-between">
                  <dt className="text-[15px]">{k}</dt>
                  <dd className="text-[15px] font-semibold tabular-nums">
                    {(v as number).toLocaleString()}
                    {(k === 'Smaller (HEVC)' || k === 'Compatible (H.264)') && codecTotal > 0 && (
                      <span className="ml-2 text-[12px] font-normal text-[#6e6e73]">{Math.round(((v as number) / codecTotal) * 100)}%</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
            <h2 className="text-[21px] font-semibold tracking-tight">App versions</h2>
            <p className="text-[13px] text-[#6e6e73]">Version each phone last reported</p>
            {stats.versions.length === 0 ? (
              <p className="mt-5 text-[15px] text-[#6e6e73]">No data yet.</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {stats.versions.map(v => (
                  <li key={`${v.platform ?? 'ios'}-${v.version || 'unknown'}`}>
                    <div className="flex items-baseline justify-between text-[15px]">
                      <span>{v.platform === 'android' ? 'Android' : 'iPhone'} {v.version || 'Unknown'}</span>
                      <span className="tabular-nums"><span className="font-semibold">{v.count}</span>
                        <span className="ml-2 text-[12px] text-[#6e6e73]">{Math.round((v.count / versionTotal) * 100)}%</span></span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-red-600" style={{ width: `${(v.count / versionTotal) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {stats.failures && <AndroidFailures f={stats.failures} />}

        <UpdateRules
          configs={stats.configs ?? { ios: stats.config, android: { ...stats.config, platform: 'android', storeUrl: '' } }}
          onSaved={(p, c) => setStats(s => (s ? { ...s, ...(p === 'ios' ? { config: c } : {}), configs: { ...(s.configs ?? { ios: s.config, android: c }), [p]: c } } : s))}
        />

        <p className="text-[12px] text-[#6e6e73] text-center">
          Each install is counted with a random ID kept on the phone. Someone with two phones counts twice, and days spent
          offline show up once the phone is back online. Updated {new Date(stats.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}.
        </p>
      </div>
    </div>
  );
}
