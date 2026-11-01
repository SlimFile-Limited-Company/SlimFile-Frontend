import { useState, useEffect } from 'react';
import { Key, Copy, Check, Trash2, Lock, Unlock, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccessRequests from '@/components/AccessRequests';
import AdminOnly, { adminHeaders } from '@/components/AdminOnly';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

interface B2BApiKey {
  _id: string;
  apiKey: string;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  isActive: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
  notes: string;
  revokedAt: string | null;
}

export default function B2BApiKeysAdmin() {
  // Access comes from the admin email list on the server
  const [access, setAccess] = useState<'checking' | 'ok' | 'denied'>('checking');

  const [keys, setKeys] = useState<B2BApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerCompany: '',
    notes: ''
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadKeys(); }, []);

  // Load all API keys
  const loadKeys = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/b2b-keys`, { headers: adminHeaders() });

      if (response.status === 401 || response.status === 403) {
        setAccess('denied');
        return;
      }
      setAccess('ok');
      if (!response.ok) {
        throw new Error('Failed to load API keys');
      }

      const data = await response.json();
      setKeys(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate new API key
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/b2b-keys/generate`, {
        method: 'POST',
        headers: {
          ...adminHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }

      const data = await response.json();

      // Add new key to list
      setKeys([data.data, ...keys]);

      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerCompany: '',
        notes: ''
      });
      setShowForm(false);

      // Copy API key to clipboard
      navigator.clipboard.writeText(data.data.apiKey);
      setCopiedKey(data.data.apiKey);
      setTimeout(() => setCopiedKey(null), 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Revoke API key
  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/b2b-keys/${id}/revoke`, {
        method: 'PUT',
        headers: {
          ...adminHeaders()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to revoke API key');
      }

      // Update key in list
      setKeys(keys.map(key =>
        key._id === id ? { ...key, isActive: false, revokedAt: new Date().toISOString() } : key
      ));

    } catch (err: any) {
      setError(err.message);
    }
  };

  // Activate API key
  const handleActivate = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/b2b-keys/${id}/activate`, {
        method: 'PUT',
        headers: {
          ...adminHeaders()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to activate API key');
      }

      // Update key in list
      setKeys(keys.map(key =>
        key._id === id ? { ...key, isActive: true, revokedAt: null } : key
      ));

    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete API key
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this API key? This cannot be undone!')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/b2b-keys/${id}`, {
        method: 'DELETE',
        headers: {
          ...adminHeaders()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      // Remove key from list
      setKeys(keys.filter(key => key._id !== id));

    } catch (err: any) {
      setError(err.message);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (access === 'denied') return <AdminOnly title="B2B API Keys" />;
  if (access === 'checking') {
    return <div className="min-h-screen bg-white pt-12 flex items-center justify-center text-[#6e6e73]">Loading…</div>;
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-white pt-28 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">B2B API Keys Management</h1>
            <p className="text-[#86868b] mt-1">Generate and manage API keys for B2B customers</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => loadKeys()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Generate New Key
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Generate form */}
        {showForm && (
          <div className="bg-[#f5f5f7] rounded-[22px] p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">Generate New API Key</h2>
            <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] focus:ring-2 focus:ring-red-500/30"
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Customer Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] focus:ring-2 focus:ring-red-500/30"
                  placeholder="tech@acme.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.customerCompany}
                  onChange={(e) => setFormData({ ...formData, customerCompany: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] focus:ring-2 focus:ring-red-500/30"
                  placeholder="Acme Inc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] focus:ring-2 focus:ring-red-500/30"
                  placeholder="Annual contract - unlimited usage"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 justify-end">
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={generating}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {generating ? 'Generating...' : 'Generate API Key'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Requests from the Dev Tools page */}
        <AccessRequests
          onCreateKey={r => {
            setFormData({
              customerName: r.name,
              customerEmail: r.email,
              customerCompany: r.company,
              notes: [r.product.toUpperCase(), r.useCase].filter(Boolean).join(' — ').slice(0, 500),
            });
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Keys table */}
        <div className="bg-[#f5f5f7] rounded-[22px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/[0.03]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6e6e73] uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6e6e73] uppercase tracking-wider">API Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6e6e73] uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6e6e73] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6e6e73] uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6e6e73] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#6e6e73]">
                      Loading...
                    </td>
                  </tr>
                ) : keys.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#6e6e73]">
                      No API keys yet. Generate your first one!
                    </td>
                  </tr>
                ) : (
                  keys.map((key) => (
                    <tr key={key._id} className="hover:bg-black/[0.03]">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#1d1d1f]">{key.customerName}</div>
                        <div className="text-sm text-[#6e6e73]">{key.customerEmail}</div>
                        {key.customerCompany && (
                          <div className="text-xs text-[#6e6e73]">{key.customerCompany}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {key.apiKey.substring(0, 20)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(key.apiKey)}
                            className="text-[#6e6e73] hover:text-gray-600"
                          >
                            {copiedKey === key.apiKey ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#1d1d1f]">{(key.usageCount || 0).toLocaleString()} requests</div>
                        <div className="text-xs text-[#6e6e73]">
                          Last: {formatDate(key.lastUsedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {key.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Revoked
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6e6e73]">
                        {formatDate(key.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {key.isActive ? (
                            <button
                              onClick={() => handleRevoke(key._id)}
                              className="text-orange-600 hover:text-orange-700"
                              title="Revoke"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(key._id)}
                              className="text-green-600 hover:text-green-700"
                              title="Activate"
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(key._id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
