import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Save, Trash2, Users, Mail, CheckCircle2, FlaskConical } from 'lucide-react';

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

  const [form, setForm] = useState({
    subject: '',
    heading: '',
    body: '',
    ctaText: 'Visit SlimFile',
    ctaLink: 'https://www.slim-file.com',
  });

  const token = localStorage.getItem('jwt');

  // Check admin access on mount
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

  const handleSaveDraft = async () => {
    if (!form.subject || !form.heading || !form.body) {
      toast({ title: 'Missing fields', description: 'Subject, heading and body are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/admin/newsletter`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Draft saved', description: 'Campaign saved. Ready to send when you are.' });
      setForm({ subject: '', heading: '', body: '', ctaText: 'Visit SlimFile', ctaLink: 'https://www.slim-file.com' });
      fetchCampaigns();
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
      fetchCampaigns();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
            <p className="text-sm text-gray-500 mt-0.5">Auto-sends on the 1st of every month</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-red-600" />
            <span><strong className="text-gray-900">{totalUsers}</strong> subscribers</span>
          </div>
        </div>

        {/* Compose form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-600" /> Compose Campaign
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject line</label>
              <Input
                placeholder="e.g. SlimFile — March Update"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email heading</label>
              <Input
                placeholder="e.g. Big things are happening at SlimFile 🚀"
                value={form.heading}
                onChange={e => setForm(f => ({ ...f, heading: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Body</label>
              <textarea
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={6}
                placeholder={"Write your message here...\n\nEach line break becomes a new paragraph."}
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Button text</label>
                <Input
                  placeholder="Visit SlimFile"
                  value={form.ctaText}
                  onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Button link</label>
                <Input
                  placeholder="https://www.slim-file.com"
                  value={form.ctaLink}
                  onChange={e => setForm(f => ({ ...f, ctaLink: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <Button
              onClick={handleSaveDraft}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
          </div>
        </div>

        {/* Campaign history */}
        <h2 className="text-base font-semibold text-gray-900 mb-4">Campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No campaigns yet.</p>
        ) : (
          <div className="space-y-3">
            {campaigns.map(c => (
              <div key={c._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {c.status === 'sent' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.heading}</p>
                    {c.status === 'sent' && (
                      <p className="text-xs text-gray-400 mt-1">
                        Sent {new Date(c.sentAt!).toLocaleDateString()} · {c.recipientCount} recipients
                      </p>
                    )}
                  </div>
                  {c.status === 'draft' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestSend(c._id)}
                        disabled={!!testing || !!sending}
                        className="rounded-full text-xs px-3 border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300"
                        title="Send test email to yourself"
                      >
                        {testing === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><FlaskConical className="w-3.5 h-3.5 mr-1" />Test</>}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSendNow(c._id)}
                        disabled={!!sending || !!testing}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full text-xs px-4"
                      >
                        {sending === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-1" />Send Now</>}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(c._id)}
                        disabled={!!deleting}
                        className="text-gray-400 hover:text-red-600 rounded-full"
                      >
                        {deleting === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletter;
