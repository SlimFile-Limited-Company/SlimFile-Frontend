import { forwardRef, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
const SALES_EMAIL = 'administration@slim-file.com';

export type AccessProduct = 'api' | 'sdk' | 'cli' | 'atlas' | 'other';

const PRODUCTS: { value: AccessProduct; label: string }[] = [
  { value: 'api', label: 'Compression API' },
  { value: 'sdk', label: 'SDK' },
  { value: 'cli', label: 'CLI' },
  { value: 'atlas', label: 'SlimFile Atlas (offline video)' },
  { value: 'other', label: 'Not sure yet' },
];

const VOLUMES = [
  { value: 'under-1k', label: 'Under 1,000' },
  { value: '1k-10k', label: '1,000 to 10,000' },
  { value: '10k-100k', label: '10,000 to 100,000' },
  { value: 'over-100k', label: 'Over 100,000' },
  { value: 'unsure', label: 'Not sure' },
];

const field = 'w-full h-11 px-4 rounded-xl bg-white border border-[#d2d2d7] text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/15';
const label = 'block text-[13px] font-medium text-[#1d1d1f] mb-1.5';

/**
 * How companies ask for an API key. Requests are saved, emailed to sales,
 * and listed in Internal > B2B API Keys.
 */
const RequestAccessForm = forwardRef<HTMLDivElement, { product: AccessProduct; onProductChange: (p: AccessProduct) => void }>(
  ({ product, onProductChange }, ref) => {
    const [form, setForm] = useState({ name: '', company: '', email: '', country: '', volume: 'unsure', useCase: '', website: '' });
    const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [error, setError] = useState('');
    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(f => ({ ...f, [k]: e.target.value }));
      setError('');
    };

    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name.trim()) return setError('Please enter your name.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Please enter a valid email address.');
      setState('sending');
      try {
        const res = await fetch(`${API_BASE_URL}/api-access-requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, product }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Something went wrong. Please email ${SALES_EMAIL}.`);
        setState('sent');
      } catch (err) {
        setError(err instanceof Error ? err.message : `Something went wrong. Please email ${SALES_EMAIL}.`);
        setState('idle');
      }
    };

    return (
      <div ref={ref} id="request-access" className="scroll-mt-20 max-w-3xl mx-auto rounded-[28px] bg-[#f5f5f7] p-7 sm:p-12">
        {state === 'sent' ? (
          <div className="text-center py-8">
            <span className="mx-auto mb-5 w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <Check className="w-7 h-7 text-red-600" strokeWidth={2.5} />
            </span>
            <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-tight">Request received.</h2>
            <p className="mt-3 text-[17px] text-[#6e6e73] max-w-md mx-auto">
              Thanks, {form.name.trim().split(' ')[0]}. We've sent a confirmation to {form.email.trim()} and will get back to you within two working days.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-tight">Request access.</h2>
            <p className="mt-2 mb-8 text-[17px] text-[#6e6e73]">Tell us a little about your project and we'll send you an API key.</p>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ra-name" className={label}>Your name</label>
                <input id="ra-name" value={form.name} onChange={set('name')} className={field} placeholder="Ama Mensah" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="ra-company" className={label}>Company or organisation</label>
                <input id="ra-company" value={form.company} onChange={set('company')} className={field} placeholder="Acme Bank" autoComplete="organization" />
              </div>
              <div>
                <label htmlFor="ra-email" className={label}>Work email</label>
                <input id="ra-email" type="email" value={form.email} onChange={set('email')} className={field} placeholder="ama@acmebank.com" autoComplete="email" />
              </div>
              <div>
                <label htmlFor="ra-country" className={label}>Country</label>
                <input id="ra-country" value={form.country} onChange={set('country')} className={field} placeholder="Ghana" autoComplete="country-name" />
              </div>
              <div>
                <label htmlFor="ra-product" className={label}>Interested in</label>
                <select id="ra-product" value={product} onChange={e => onProductChange(e.target.value as AccessProduct)} className={field}>
                  {PRODUCTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="ra-volume" className={label}>Files per month</label>
                <select id="ra-volume" value={form.volume} onChange={set('volume')} className={field}>
                  {VOLUMES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ra-use" className={label}>What do you want to build?</label>
                <textarea
                  id="ra-use"
                  value={form.useCase}
                  onChange={set('useCase')}
                  rows={4}
                  className={`${field} h-auto py-3 resize-y`}
                  placeholder="We receive scanned ID documents from customers and need them under 2 MB."
                />
              </div>
              {/* Left empty by people; bots fill it in */}
              <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            </div>

            {error && <p className="mt-4 text-[14px] text-red-600">{error}</p>}

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="submit"
                disabled={state === 'sending'}
                className="h-11 px-7 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white text-[17px] font-medium inline-flex items-center justify-center gap-2"
              >
                {state === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
                Send request
              </button>
              <p className="text-[13px] text-[#6e6e73]">Or email {SALES_EMAIL}. We reply within two working days.</p>
            </div>
          </form>
        )}
      </div>
    );
  }
);
RequestAccessForm.displayName = 'RequestAccessForm';

export default RequestAccessForm;
