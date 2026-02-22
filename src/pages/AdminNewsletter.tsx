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

interface Campaign {
  _id: string;
  subject: string;
  heading: string;
  body: string;
  ctaText: string;
  ctaLink: string;
  status: 'draft' | 'sent';
  sentAt?: string;
  recipientCount: number;
  createdAt: string;
}

const TEMPLATES = [
  {
    label: 'Monthly Update',
    subject: 'SlimFile — Monthly Update 📦',
    heading: 'Here\'s what\'s new at SlimFile',
    body: `Hi there,

We've been busy this month making SlimFile faster, smarter, and more powerful for you.

Here's a quick recap of what's new:
- Improved PDF compression speed by 30%
- New team workspace features for better collaboration
- Whiteboard now supports sticky notes and shapes
- Bug fixes and performance improvements across the platform

Thank you for being part of the SlimFile community. We build this for you!`,
    ctaText: 'See What\'s New',
    ctaLink: 'https://www.slim-file.com',
  },
  {
    label: 'New Feature Launch',
    subject: '🚀 Exciting new features just dropped on SlimFile',
    heading: 'We just launched something big',
    body: `Hi there,

We're thrilled to announce the launch of new features that will change how you work with files.

What's new:
- Real-time collaboration on whiteboards and documents
- OCR text extraction from scanned PDFs and images
- Video meetings directly inside your workspace
- Advanced PDF tools: merge, split, and password-protect

These features are available right now — no extra setup needed. Just log in and start exploring.`,
    ctaText: 'Try It Now',
    ctaLink: 'https://www.slim-file.com/get-started',
  },
  {
    label: 'Tips & Tricks',
    subject: '💡 5 SlimFile tips to save you hours every week',
    heading: 'Work smarter with SlimFile',
    body: `Hi there,

Here are 5 quick tips to get the most out of SlimFile:

1. Batch compress multiple images at once using our Image Compressor
2. Use OCR to extract text from scanned documents — no typing needed
3. Merge PDFs from your workspace in seconds using the PDF Merger
4. Start a whiteboard session with your team for brainstorming
5. Password-protect sensitive PDFs before sharing them externally

These features are all free to use. Try them out today!`,
    ctaText: 'Explore Features',
    ctaLink: 'https://www.slim-file.com/get-started',
  },
  {
    label: 'Re-engagement',
    subject: 'We miss you — here\'s what you\'ve been missing 👋',
    heading: 'Come back and see what\'s changed',
    body: `Hi there,

We noticed you haven't logged in to SlimFile in a while, and we wanted to reach out.

A lot has changed since your last visit:
- New collaboration tools for teams
- Faster compression with better quality
- Whiteboards, document editors, and video meetings
- A completely revamped dashboard

SlimFile is now more than just a file compressor — it's your all-in-one file workspace. Come back and see for yourself.`,
    ctaText: 'Log Back In',
    ctaLink: 'https://www.slim-file.com/login',
  },
  {
    label: 'Feature Spotlight',
    subject: '🔍 Spotlight: Extract text from any image or PDF instantly',
    heading: 'Meet SlimFile\'s OCR Tool',
    body: `Hi there,

This month we're shining a spotlight on one of our most powerful (and underused) tools: OCR Text Extraction.

With SlimFile OCR, you can:
- Extract text from scanned PDFs, photos, and screenshots
- Copy or download the extracted text instantly
- Works with handwritten notes, receipts, contracts, and more
- Completely free to use

Whether you're digitizing paper documents or pulling data from images, SlimFile OCR handles it in seconds.`,
    ctaText: 'Try OCR Now',
    ctaLink: 'https://www.slim-file.com/ocr',
  },
];

const EMPTY_FORM = {
  subject: '',
  heading: '',
  body: '',
  ctaText: 'Visit SlimFile',
  ctaLink: 'https://www.slim-file.com',
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
    });
    setEditingId(c._id);
    setShowTemplates(false);
    setActiveTab('compose');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const applyTemplate = (t: typeof TEMPLATES[number]) => {
    setForm({
      subject: t.subject,
      heading: t.heading,
      body: t.body,
      ctaText: t.ctaText,
      ctaLink: t.ctaLink,
    });
    setShowTemplates(false);
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
      const method = editingId ? 'PUT' : 'POST';

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
                  <div className="flex items-center gap-2">
                    {editingId && (
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel edit
                      </button>
                    )}
                    {!editingId && (
                      <button
                        onClick={() => setShowTemplates(v => !v)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                          showTemplates
                            ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                        }`}
                      >
                        <LayoutTemplate className="w-3.5 h-3.5" /> Templates
                      </button>
                    )}
                  </div>
                </div>

                {/* Templates picker */}
                {showTemplates && !editingId && (
                  <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/40">
                    <p className="text-xs font-medium text-gray-400 mb-3">Choose a template to get started</p>
                    <div className="grid grid-cols-1 gap-2">
                      {TEMPLATES.map(t => (
                        <button
                          key={t.label}
                          onClick={() => applyTemplate(t)}
                          className="flex items-center justify-between text-left px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-750 hover:border-red-500/30 border border-gray-700 transition-all group"
                        >
                          <div>
                            <p className="text-xs font-semibold text-gray-200 group-hover:text-red-300 transition-colors">{t.label}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5 truncate max-w-xs">{t.subject}</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-red-400 shrink-0 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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

            {/* Email preview card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Preview</p>
              </div>
              <div className="p-4">
                {/* Mini email mockup */}
                <div className="rounded-xl overflow-hidden border border-gray-700 text-xs shadow-xl">
                  <div className="bg-gradient-to-br from-red-700 to-red-500 px-4 py-3 text-center">
                    <div className="w-6 h-6 bg-white/20 rounded-md mx-auto mb-1.5 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-white font-bold text-xs leading-tight">
                      {form.heading || 'Your email heading'}
                    </p>
                  </div>
                  <div className="bg-white px-4 py-3">
                    <p className="text-gray-500 text-[10px] mb-1.5">Hi [Name],</p>
                    <p className="text-gray-700 text-[10px] leading-relaxed line-clamp-3">
                      {form.body || 'Your message content will appear here...'}
                    </p>
                    <div className="mt-3 text-center">
                      <span className="inline-block bg-red-600 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                        {form.ctaText || 'Visit SlimFile'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 text-center border-t border-gray-100">
                    <p className="text-[9px] text-gray-400">SlimFile · Compress. Convert. Collaborate.</p>
                    <p className="text-[9px] text-gray-300 mt-0.5">Unsubscribe</p>
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
