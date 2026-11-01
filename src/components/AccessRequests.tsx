import { useEffect, useState } from 'react';
import { Loader2, Mail } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

type Status = 'new' | 'contacted' | 'approved' | 'declined';

export interface AccessRequest {
  _id: string;
  name: string;
  company: string;
  email: string;
  country: string;
  product: 'api' | 'sdk' | 'cli' | 'atlas' | 'other';
  volume: string;
  useCase: string;
  status: Status;
  createdAt: string;
}

const PRODUCT: Record<AccessRequest['product'], string> = { api: 'API', sdk: 'SDK', cli: 'CLI', atlas: 'Atlas', other: 'Not sure' };
const VOLUME: Record<string, string> = { 'under-1k': '< 1,000 / mo', '1k-10k': '1k–10k / mo', '10k-100k': '10k–100k / mo', 'over-100k': '> 100k / mo', unsure: 'Volume not sure' };
const STATUS_STYLE: Record<Status, string> = {
  new: 'bg-red-600 text-white',
  contacted: 'bg-[#e8e8ed] text-[#1d1d1f]',
  approved: 'bg-[#1d1d1f] text-white',
  declined: 'bg-white text-[#6e6e73] border border-[#d2d2d7]',
};

/**
 * API access requests from the Dev Tools page. "Create key" fills in the
 * key form above with the requester's details.
 */
export default function AccessRequests({ adminPassword, onCreateKey }: {
  adminPassword: string;
  onCreateKey: (r: AccessRequest) => void;
}) {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'open' | 'all'>('open');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api-access-requests`, { headers: { 'X-Admin-Password': adminPassword } });
      if (res.ok) setRequests((await res.json()).requests || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (adminPassword) load(); }, [adminPassword]);

  const setStatus = async (r: AccessRequest, status: Status) => {
    setRequests(rs => rs.map(x => (x._id === r._id ? { ...x, status } : x)));
    await fetch(`${API_BASE_URL}/api-access-requests/${r._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': adminPassword },
      body: JSON.stringify({ status }),
    }).catch(() => load());
  };

  const shown = requests.filter(r => filter === 'all' || r.status === 'new' || r.status === 'contacted');
  const newCount = requests.filter(r => r.status === 'new').length;

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f]">
          Access requests {newCount > 0 && <span className="ml-1 align-middle text-[13px] font-semibold px-2 py-0.5 rounded-full bg-red-600 text-white">{newCount} new</span>}
        </h2>
        <div className="inline-flex rounded-full bg-[#f5f5f7] p-1 text-[13px]">
          {(['open', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 h-8 rounded-full ${filter === f ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] font-medium text-[#1d1d1f]' : 'text-[#6e6e73]'}`}>
              {f === 'open' ? 'Open' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center text-[#6e6e73]"><Loader2 className="w-5 h-5 animate-spin" /></div>
      ) : shown.length === 0 ? (
        <p className="rounded-[22px] bg-[#f5f5f7] p-6 text-[15px] text-[#6e6e73]">
          {filter === 'open' ? 'No open requests. New ones from the Dev Tools page appear here.' : 'No requests yet.'}
        </p>
      ) : (
        <div className="grid gap-3">
          {shown.map(r => (
            <article key={r._id} className="rounded-[22px] bg-[#f5f5f7] p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[17px] font-semibold text-[#1d1d1f]">
                    {r.company || r.name}
                    <span className={`ml-2 align-middle text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </p>
                  <p className="text-[13px] text-[#6e6e73]">
                    {r.name} · <a href={`mailto:${r.email}`} className="text-red-600 hover:underline">{r.email}</a>
                    {r.country && ` · ${r.country}`} · {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <p className="text-[13px] text-[#1d1d1f] shrink-0">
                  <span className="font-medium">{PRODUCT[r.product]}</span> · {VOLUME[r.volume] || r.volume}
                </p>
              </div>
              {r.useCase && <p className="mt-3 text-[15px] leading-relaxed text-[#1d1d1f]/85 whitespace-pre-line">{r.useCase}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:${r.email}?subject=${encodeURIComponent('Your SlimFile API access')}`}
                  onClick={() => r.status === 'new' && setStatus(r, 'contacted')}
                  className="h-8 px-3 rounded-full bg-white hover:bg-[#e8e8ed] text-[13px] inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> Reply
                </a>
                <button onClick={() => { onCreateKey(r); setStatus(r, 'approved'); }} className="h-8 px-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-[13px]">
                  Create key
                </button>
                {r.status !== 'contacted' && <button onClick={() => setStatus(r, 'contacted')} className="h-8 px-3 rounded-full bg-white hover:bg-[#e8e8ed] text-[13px]">Mark contacted</button>}
                {r.status !== 'declined' && <button onClick={() => setStatus(r, 'declined')} className="h-8 px-3 rounded-full bg-white hover:bg-[#e8e8ed] text-[13px] text-[#6e6e73]">Decline</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
