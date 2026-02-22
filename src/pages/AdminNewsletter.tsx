import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2, Send, Save, Trash2, Users, Mail,
  CheckCircle2, FlaskConical, BarChart3, Clock,
  AlertCircle, ChevronRight, Zap, Pencil, X, LayoutTemplate,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

//just adding to trigger deployment
type TemplateKey = 'classic' | 'minimal' | 'dark' | 'bold' | 'warm';

interface Campaign {
  _id: string;
  subject: string;
  heading: string;
  body: string;
  ctaText: string;
  ctaLink: string;
  template: TemplateKey;
  status: 'draft' | 'sent';
  sentAt?: string;
  recipientCount: number;
  createdAt: string;
}

// ─── Visual email template definitions ───────────────────────────────────────
const EMAIL_TEMPLATES: {
  key: TemplateKey;
  label: string;
  desc: string;
  preview: {
    headerBg: string;
    headerText: string;
    bodyBg: string;
    bodyText: string;
    btnBg: string;
    btnText: string;
    footerBg: string;
  };
}[] = [
  {
    key: 'classic',
    label: 'Classic',
    desc: 'Red gradient header, white body',
    preview: {
      headerBg: 'linear-gradient(135deg,#dc2626,#ef4444)',
      headerText: '#ffffff',
      bodyBg: '#ffffff',
      bodyText: '#374151',
      btnBg: '#dc2626',
      btnText: '#ffffff',
      footerBg: '#f9fafb',
    },
  },
  {
    key: 'minimal',
    label: 'Minimal',
    desc: 'Clean white, red border accent',
    preview: {
      headerBg: '#ffffff',
      headerText: '#111827',
      bodyBg: '#ffffff',
      bodyText: '#374151',
      btnBg: '#ffffff',
      btnText: '#dc2626',
      footerBg: '#ffffff',
    },
  },
  {
    key: 'dark',
    label: 'Dark',
    desc: 'Dark mode, red CTA',
    preview: {
      headerBg: '#1e293b',
      headerText: '#f1f5f9',
      bodyBg: '#1e293b',
      bodyText: '#cbd5e1',
      btnBg: '#dc2626',
      btnText: '#ffffff',
      footerBg: '#0f172a',
    },
  },
  {
    key: 'bold',
    label: 'Bold',
    desc: 'Solid red header, large type',
    preview: {
      headerBg: '#dc2626',
      headerText: '#ffffff',
      bodyBg: '#ffffff',
      bodyText: '#374151',
      btnBg: '#111827',
      btnText: '#ffffff',
      footerBg: '#dc2626',
    },
  },
  {
    key: 'warm',
    label: 'Warm',
    desc: 'Warm cream, amber tones',
    preview: {
      headerBg: '#fffbf5',
      headerText: '#92400e',
      bodyBg: '#fffbf5',
      bodyText: '#44403c',
      btnBg: '#b45309',
      btnText: '#ffffff',
      footerBg: '#fef3e2',
    },
  },
];

const EMPTY_FORM = {
  subject: '',
  heading: '',
  body: '',
  ctaText: 'Visit SlimFile',
  ctaLink: 'https://www.slim-file.com',
  template: 'classic' as TemplateKey,
};

const AdminNewsletter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checking, setChecking] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sending, setSending] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'compose' | 'campaigns'>('compose');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  const token = localStorage.getItem('jwt');
  const activeTemplate = EMAIL_TEMPLATES.find(t => t.key === form.template)!;

  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) { navigate('/'); return; }
      try {
        const res = await fetch(`${API}/admin/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { navigate('/'); return; }
        setChecking(false);
        fetchCampaigns();
      } catch {
        navigate('/');
      }
    };
    checkAdmin();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API}/admin/newsletter`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCampaigns(data.campaigns || []);
      setTotalUsers(data.totalUsers || 0);
    } catch {
      // ignore
    }
  };

  const handleEditDraft = (c: Campaign) => {
    setForm({
      subject: c.subject,
      heading: c.heading,
      body: c.body,
      ctaText: c.ctaText,
      ctaLink: c.ctaLink,
      template: c.template || 'classic',
    });
    setEditingId(c._id);
    setShowTemplates(false);
    setActiveTab('compose');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSaveDraft = async () => {
    if (!form.subject || !form.heading || !form.body) {
      toast({ title: 'Missing fields', description: 'Subject, heading and body are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const url = editingId
        ? `${API}/admin/newsletter/${editingId}`
        : `${API}/admin/newsletter`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: editingId ? 'Draft updated!' : 'Draft saved!', description: 'Campaign saved and ready to send.' });
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchCampaigns();
      setActiveTab('campaigns');
    } catch {
      toast({ title: 'Error', description: 'Failed to save draft.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSendNow = async (id: string) => {
    if (!confirm('Send this newsletter to all subscribers now?')) return;
    setSending(id);
    try {
      const res = await fetch(`${API}/admin/newsletter/${id}/send`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: 'Newsletter sent!', description: `Delivered to ${data.sent} subscribers.` });
      fetchCampaigns();
    } catch (err: any) {
      toast({ title: 'Send failed', description: err.message || 'Something went wrong.', variant: 'destructive' });
    } finally {
      setSending(null);
    }
  };

  const handleTestSend = async (id: string) => {
    setTesting(id);
    try {
      const res = await fetch(`${API}/admin/newsletter/${id}/test`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: 'Test email sent!', description: `Check your inbox at ${data.sentTo}` });
    } catch (err: any) {
      toast({ title: 'Test failed', description: err.message || 'Something went wrong.', variant: 'destructive' });
    } finally {
      setTesting(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this draft?')) return;
    setDeleting(id);
    try {
      await fetch(`${API}/admin/newsletter/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
      fetchCampaigns();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  const sentCampaigns = campaigns.filter(c => c.status === 'sent');
  const draftCampaigns = campaigns.filter(c => c.status === 'draft');
  const totalSent = sentCampaigns.reduce((acc, c) => acc + (c.recipientCount || 0), 0);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.gif" alt="SlimFile" className="h-10 w-auto opacity-80" />
          <Loader2 className="w-5 h-5 animate-spin text-red-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      {/* Top bar */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.gif" alt="SlimFile" className="h-7 w-auto" />
            <div className="w-px h-5 bg-gray-700" />
            <span className="text-sm font-semibold text-gray-200 tracking-wide">Admin Console</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-sm text-red-400 font-medium">Newsletter</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System active
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribers</span>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{totalUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">opted-in users</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Emails Sent</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{totalSent.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">across {sentCampaigns.length} campaign{sentCampaigns.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Drafts</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{draftCampaigns.length}</p>
            <p className="text-xs text-gray-500 mt-1">ready to send</p>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-5 gap-6">

          {/* Left: Tabs + content */}
          <div className="col-span-3 space-y-4">

            {/* Tab switcher */}
            <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
              <button
                onClick={() => setActiveTab('compose')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'compose'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {editingId ? 'Edit Draft' : 'Compose'}
              </button>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'campaigns'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Campaigns
                {campaigns.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'campaigns' ? 'bg-white/20' : 'bg-gray-700 text-gray-300'}`}>
                    {campaigns.length}
                  </span>
                )}
              </button>
            </div>

            {/* Compose tab */}
            {activeTab === 'compose' && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-100">
                        {editingId ? 'Edit Draft Campaign' : 'New Campaign'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {editingId ? 'Update and save your draft' : 'Will auto-send on the 1st of every month'}
                      </p>
                    </div>
                  </div>
                  {editingId && (
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel edit
                    </button>
                  )}
                </div>

                {/* Email style picker */}
                <div className="px-6 pt-5 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                      <LayoutTemplate className="w-3.5 h-3.5" /> Email Style
                    </label>
                    <span className="text-xs text-gray-600">{activeTemplate.desc}</span>
                  </div>
                  <div className="flex gap-2">
                    {EMAIL_TEMPLATES.map(t => (
                      <button
                        key={t.key}
                        onClick={() => setForm(f => ({ ...f, template: t.key }))}
                        title={t.desc}
                        className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${
                          form.template === t.key
                            ? 'border-red-500 shadow-lg shadow-red-900/30'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {/* Mini email mockup */}
                        <div style={{ background: t.preview.headerBg }} className="px-2 py-2 text-center">
                          <div
                            className="text-[7px] font-bold leading-tight truncate"
                            style={{ color: t.preview.headerText }}
                          >
                            {t.key === 'minimal'
                              ? <span style={{ borderBottom: '1px solid #dc2626', paddingBottom: 1 }}>SlimFile</span>
                              : 'Heading'}
                          </div>
                        </div>
                        <div style={{ background: t.preview.bodyBg }} className="px-2 py-1.5">
                          <div className="space-y-0.5 mb-1.5">
                            <div style={{ background: t.preview.bodyText + '30' }} className="h-1 rounded-full w-full" />
                            <div style={{ background: t.preview.bodyText + '20' }} className="h-1 rounded-full w-3/4" />
                          </div>
                          <div
                            className="text-center py-0.5 rounded text-[6px] font-bold"
                            style={{
                              background: t.preview.btnBg,
                              color: t.preview.btnText,
                              border: t.key === 'minimal' ? '1px solid #dc2626' : 'none',
                            }}
                          >
                            CTA
                          </div>
                        </div>
                        <div
                          style={{ background: t.preview.footerBg }}
                          className="px-2 py-1 text-center"
                        >
                          <div style={{ background: t.preview.bodyText + '20' }} className="h-0.5 rounded-full w-2/3 mx-auto" />
                        </div>
                        <div
                          className={`text-center py-1 text-[8px] font-semibold ${
                            form.template === t.key ? 'text-red-400 bg-red-500/5' : 'text-gray-500 bg-gray-800/50'
                          }`}
                        >
                          {t.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Subject line</label>
                    <Input
                      placeholder="e.g. SlimFile — March Update"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Email heading</label>
                    <Input
                      placeholder="e.g. Big things are happening at SlimFile"
                      value={form.heading}
                      onChange={e => setForm(f => ({ ...f, heading: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Body</label>
                    <textarea
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none"
                      rows={7}
                      placeholder={"Write your message here...\n\nEach line break becomes a new paragraph."}
                      value={form.body}
                      onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Button text</label>
                      <Input
                        placeholder="Visit SlimFile"
                        value={form.ctaText}
                        onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Button link</label>
                      <Input
                        placeholder="https://www.slim-file.com"
                        value={form.ctaLink}
                        onChange={e => setForm(f => ({ ...f, ctaLink: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-800 flex justify-end">
                  <Button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 shadow-lg shadow-red-900/30"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {editingId ? 'Update Draft' : 'Save Draft'}
                  </Button>
                </div>
              </div>
            )}

            {/* Campaigns tab */}
            {activeTab === 'campaigns' && (
              <div className="space-y-3">
                {campaigns.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No campaigns yet</p>
                    <p className="text-xs text-gray-600 mt-1">Create your first draft to get started.</p>
                    <button
                      onClick={() => setActiveTab('compose')}
                      className="mt-4 text-xs text-red-400 hover:text-red-300 font-medium"
                    >
                      Compose now →
                    </button>
                  </div>
                ) : (
                  campaigns.map(c => (
                    <div key={c._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {c.status === 'sent' ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                                <CheckCircle2 className="w-3 h-3" /> Sent
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                                <AlertCircle className="w-3 h-3" /> Draft
                              </span>
                            )}
                            {c.template && c.template !== 'classic' && (
                              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full capitalize">
                                {c.template}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-gray-100 truncate">{c.subject}</p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{c.heading}</p>
                          {c.status === 'sent' && (
                            <p className="text-xs text-gray-600 mt-2 flex items-center gap-1.5">
                              <Users className="w-3 h-3" />
                              {c.recipientCount} recipients · {new Date(c.sentAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                        {c.status === 'draft' && (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditDraft(c)}
                              className="rounded-lg text-xs px-3 bg-transparent border-gray-700 text-gray-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/5"
                              title="Edit this draft"
                            >
                              <Pencil className="w-3.5 h-3.5 mr-1" />Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTestSend(c._id)}
                              disabled={!!testing || !!sending}
                              className="rounded-lg text-xs px-3 bg-transparent border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5"
                              title="Send test email to yourself"
                            >
                              {testing === c._id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <><FlaskConical className="w-3.5 h-3.5 mr-1" />Test</>}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSendNow(c._id)}
                              disabled={!!sending || !!testing}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs px-4 shadow-md shadow-red-900/30"
                            >
                              {sending === c._id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <><Send className="w-3.5 h-3.5 mr-1" />Send Now</>}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(c._id)}
                              disabled={!!deleting}
                              className="text-gray-600 hover:text-red-400 hover:bg-red-500/5 rounded-lg"
                            >
                              {deleting === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right: Info panel */}
          <div className="col-span-2 space-y-4">

            {/* Email preview — matches selected template */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Preview</p>
                <span className="text-xs text-gray-600 capitalize">{activeTemplate.label} style</span>
              </div>
              <div className="p-4">
                <div className="rounded-xl overflow-hidden border border-gray-700 text-xs shadow-xl">
                  {/* Header */}
                  <div
                    className="px-4 py-3 text-center"
                    style={{ background: activeTemplate.preview.headerBg, borderBottom: form.template === 'minimal' ? '2px solid #dc2626' : 'none' }}
                  >
                    <div className="w-5 h-5 bg-white/20 rounded-md mx-auto mb-1.5 flex items-center justify-center">
                      <Zap className="w-2.5 h-2.5" style={{ color: activeTemplate.preview.headerText }} />
                    </div>
                    <p className="font-bold text-xs leading-tight" style={{ color: activeTemplate.preview.headerText }}>
                      {form.heading || 'Your email heading'}
                    </p>
                  </div>
                  {/* Body */}
                  <div className="px-4 py-3" style={{ background: activeTemplate.preview.bodyBg }}>
                    <p className="text-[10px] mb-1.5" style={{ color: activeTemplate.preview.bodyText + 'aa' }}>Hi [Name],</p>
                    <p className="text-[10px] leading-relaxed line-clamp-3" style={{ color: activeTemplate.preview.bodyText }}>
                      {form.body || 'Your message content will appear here...'}
                    </p>
                    <div className="mt-3 text-center">
                      <span
                        className="inline-block text-[10px] font-semibold px-3 py-1 rounded-full"
                        style={{
                          background: activeTemplate.preview.btnBg,
                          color: activeTemplate.preview.btnText,
                          border: form.template === 'minimal' ? '1.5px solid #dc2626' : 'none',
                          borderRadius: form.template === 'bold' ? '6px' : '50px',
                        }}
                      >
                        {form.ctaText || 'Visit SlimFile'}
                      </span>
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="px-4 py-2 text-center" style={{ background: activeTemplate.preview.footerBg }}>
                    <p className="text-[9px]" style={{ color: activeTemplate.preview.bodyText + '88' }}>
                      SlimFile · Compress. Convert. Collaborate.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Schedule</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-300">Auto-send</p>
                    <p className="text-xs text-gray-500">1st of every month at 8:00 AM GMT</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-300">Batch sending</p>
                    <p className="text-xs text-gray-500">50 emails per batch, 1.5s delay</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-300">Opt-out respected</p>
                    <p className="text-xs text-gray-500">Unsubscribed users are skipped</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick tip */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
              <p className="text-xs font-semibold text-red-400 mb-1.5">Pro tip</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Always use <span className="text-gray-300 font-medium">Send Test</span> first to preview how the email looks in your inbox before sending to all {totalUsers.toLocaleString()} subscribers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;
