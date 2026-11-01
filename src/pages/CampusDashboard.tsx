import { useEffect, useMemo, useState } from 'react';
import { Loader2, MapPin, Wifi, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface CampusStats {
  id: string;
  short: string;
  name: string;
  country: string;
  ambassadors: string[];
  wifiDetection: boolean;
  people: number;
  accounts: number;
  active30: number;
  new7: number;
  new30: number;
  files: number;
  files30: number;
  visits: number;
  visits30: number;
  visitors: number;
  slimdocx: { opens: number; people: number };
  whiteboards: { opens: number; people: number };
  byMethod: { gps: number; wifi: number; email: number };
  schoolEmailAccounts: number;
}

interface DailyRow { day: string; campusId: string; count: number }

type SortKey = 'people' | 'visits30' | 'active30' | 'new30' | 'files';
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'people', label: 'People' },
  { key: 'visits30', label: 'Visits' },
  { key: 'active30', label: 'Active' },
  { key: 'new30', label: 'New' },
  { key: 'files', label: 'Files' },
];

const lastDays = (n: number) =>
  Array.from({ length: n }, (_, i) => new Date(Date.now() - (n - 1 - i) * 86400000).toISOString().slice(0, 10));

/**
 * Ambassador campuses: who uses SlimFile at each one. People are counted by
 * GPS (campus and nearby hostels), campus Wi-Fi, or a school email.
 */
export default function CampusDashboard() {
  const [campuses, setCampuses] = useState<CampusStats[]>([]);
  const [daily, setDaily] = useState<DailyRow[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [sort, setSort] = useState<SortKey>('people');

  useEffect(() => {
    fetch(`${API_BASE_URL}/campus/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      cache: 'no-store',
    })
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => {
        setCampuses(data.campuses || []);
        setDaily(data.daily || []);
        setState('ready');
      })
      .catch(() => setState('failed'));
  }, []);

  const sorted = useMemo(() => [...campuses].sort((a, b) => b[sort] - a[sort]), [campuses, sort]);
  const totals = useMemo(() => campuses.reduce(
    (t, c) => ({
      people: t.people + c.people,
      visits30: t.visits30 + c.visits30,
      new7: t.new7 + c.new7,
      files: t.files + c.files,
      docs: t.docs + c.slimdocx.opens,
      boards: t.boards + c.whiteboards.opens,
    }),
    { people: 0, visits30: 0, new7: 0, files: 0, docs: 0, boards: 0 }
  ), [campuses]);

  // Visitors per day across all campuses
  const days = lastDays(30);
  const perDay = days.map(d => daily.filter(r => r.day === d).reduce((n, r) => n + r.count, 0));
  const peak = Math.max(1, ...perDay);

  // Ambassadors, each credited with their campus's numbers
  const ambassadors = useMemo(() => sorted.flatMap(c =>
    c.ambassadors.map(name => ({
      name, campus: c.short, shared: c.ambassadors.length > 1,
      people: c.people, visits30: c.visits30, files: c.files, tools: c.slimdocx.opens + c.whiteboards.opens,
    }))
  ), [sorted]);

  if (state !== 'ready') {
    return (
      <div className="min-h-screen bg-white pt-12 flex items-center justify-center text-[#6e6e73]">
        {state === 'failed' ? <p className="text-[17px]">Couldn't load campus numbers. Are you signed in as an admin?</p> : <Loader2 className="w-5 h-5 animate-spin" />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-12 text-[#1d1d1f]">
      {/* Hero */}
      <section className="px-4 sm:px-6 pt-16 sm:pt-20 pb-10 text-center">
        <p className="text-[17px] font-semibold text-red-600 mb-3">Ambassadors</p>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05]">Campuses.</h1>
        <p className="mt-5 text-xl sm:text-2xl text-[#6e6e73] max-w-2xl mx-auto leading-snug">
          Who uses SlimFile on each ambassador's campus and the hostels around it.
        </p>
      </section>

      {/* Totals */}
      <section className="px-4 sm:px-6 pb-10">
        <div className="max-w-6xl mx-auto grid gap-4 grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Visits to slim-file.com, 30 days', value: totals.visits30 },
            { label: 'People on campuses', value: totals.people },
            { label: 'New this week', value: totals.new7 },
            { label: 'Files processed', value: totals.files },
            { label: 'SlimDocx documents opened', value: totals.docs },
            { label: 'Whiteboards opened', value: totals.boards },
          ].map(t => (
            <div key={t.label} className="rounded-[22px] bg-[#f5f5f7] p-6">
              <p className="text-[13px] font-semibold text-[#6e6e73]">{t.label}</p>
              <p className="mt-2 text-[40px] leading-none font-semibold tracking-tight">{t.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Last 30 days */}
      <section className="px-4 sm:px-6 pb-14">
        <div className="max-w-6xl mx-auto rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-[21px] font-semibold tracking-tight">People on campuses, last 30 days</h2>
            <span className="text-[13px] text-[#6e6e73]">per day</span>
          </div>
          <div className="flex items-end gap-1 h-36">
            {perDay.map((n, i) => (
              <div key={days[i]} className="flex-1 h-full flex items-end" title={`${days[i]}: ${n}`}>
                <div className="w-full rounded-t-[4px] bg-red-600/85" style={{ height: `${Math.max(n ? 4 : 1, (n / peak) * 100)}%`, opacity: n ? 1 : 0.15 }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-[#6e6e73]">
            <span>{new Date(days[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            <span>Today</span>
          </div>
        </div>
      </section>

      {/* Campuses */}
      <section className="px-4 sm:px-6 pb-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-tight">By campus.</h2>
            <div className="inline-flex self-start rounded-full bg-[#f5f5f7] p-1">
              {SORTS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`relative px-4 h-8 rounded-full text-[13px] ${sort === s.key ? 'text-[#1d1d1f] font-medium' : 'text-[#6e6e73] hover:text-[#1d1d1f]'}`}
                >
                  {sort === s.key && <motion.span layoutId="campus-sort" className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />}
                  <span className="relative">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((c, i) => (
              <article key={c.id} className="rounded-[22px] bg-[#f5f5f7] p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] text-[#6e6e73]">#{i + 1} · {c.country}</p>
                    <h3 className="text-[24px] font-semibold tracking-tight leading-tight">{c.short}</h3>
                    <p className="text-[13px] text-[#6e6e73] truncate">{c.name}</p>
                  </div>
                  <p className="text-right shrink-0">
                    <span className="block text-[32px] leading-none font-semibold tracking-tight">{c.people.toLocaleString()}</span>
                    <span className="text-[12px] text-[#6e6e73]">people</span>
                  </p>
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                  {[
                    { k: 'Visits 30d', v: c.visits30 },
                    { k: 'Active 30d', v: c.active30 },
                    { k: 'New 30d', v: c.new30 },
                    { k: 'Files', v: c.files },
                    { k: 'SlimDocx', v: c.slimdocx.opens },
                    { k: 'Whiteboards', v: c.whiteboards.opens },
                  ].map(m => (
                    <div key={m.k} className="rounded-2xl bg-white py-3">
                      <dd className="text-[19px] font-semibold">{m.v.toLocaleString()}</dd>
                      <dt className="text-[11px] text-[#6e6e73]">{m.k}</dt>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#6e6e73]">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> GPS {c.byMethod.gps}</span>
                  {c.wifiDetection && <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Wi-Fi {c.byMethod.wifi}</span>}
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> School email {c.schoolEmailAccounts}</span>
                </div>

                <p className="mt-4 pt-4 border-t border-black/[0.06] text-[13px]">
                  <span className="text-[#6e6e73]">{c.ambassadors.length > 1 ? 'Ambassadors' : 'Ambassador'}: </span>
                  {c.ambassadors.join(' & ')}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ambassadors */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-tight mb-2">Ambassadors.</h2>
          <p className="text-[15px] text-[#6e6e73] mb-6">Each ambassador gets their campus's numbers. Ambassadors on the same campus share them.</p>
          <div className="rounded-[22px] bg-[#f5f5f7] overflow-x-auto">
            <table className="w-full min-w-[620px] text-[15px]">
              <thead>
                <tr className="text-left text-[12px] text-[#6e6e73]">
                  <th className="font-medium px-5 pt-4 pb-2">Ambassador</th>
                  <th className="font-medium px-3 pt-4 pb-2">Campus</th>
                  <th className="font-medium px-3 pt-4 pb-2 text-right">People</th>
                  <th className="font-medium px-3 pt-4 pb-2 text-right">Visits 30d</th>
                  <th className="font-medium px-3 pt-4 pb-2 text-right">Files</th>
                  <th className="font-medium px-5 pt-4 pb-2 text-right">SlimDocx & Boards</th>
                </tr>
              </thead>
              <tbody>
                {ambassadors.map(a => (
                  <tr key={`${a.campus}-${a.name}`} className="border-t border-black/[0.06]">
                    <td className="px-5 py-3 font-medium">{a.name}</td>
                    <td className="px-3 py-3 text-[#6e6e73]">{a.campus}{a.shared && ' (shared)'}</td>
                    <td className="px-3 py-3 text-right">{a.people.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right">{a.visits30.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right">{a.files.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">{a.tools.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
