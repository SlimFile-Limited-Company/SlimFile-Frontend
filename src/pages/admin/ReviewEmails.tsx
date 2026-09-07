import { useEffect, useState } from 'react';
import { Mail, Send, Loader2, CheckCircle2, XCircle, Filter, History, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  operationType: string;
  createdAt: string;
  isApproved: boolean;
}

interface EmailHistory {
  _id: string;
  subject: string;
  message: string;
  sentAt: string;
  success: boolean;
}

export default function ReviewEmails() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResults, setSendResults] = useState<any[]>([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filterRating, setFilterRating] = useState('');
  const [filterOperation, setFilterOperation] = useState('');
  const [emailHistoryMap, setEmailHistoryMap] = useState<Record<string, EmailHistory[]>>({});
  const [viewingHistory, setViewingHistory] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin-password');
    if (savedPassword) {
      setAdminPassword(savedPassword);
      setIsAuthenticated(true);
      fetchReviews(savedPassword);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && adminPassword) {
      fetchReviews(adminPassword);
    }
  }, [filterRating, filterOperation]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('admin-password', adminPassword);
    setIsAuthenticated(true);
    fetchReviews(adminPassword);
  };

  const fetchReviews = async (password: string) => {
    try {
      setLoading(true);

      // Build query string with filters
      const params = new URLSearchParams({
        hasEmail: 'true',
        limit: '200'
      });

      if (filterRating) params.append('rating', filterRating);
      if (filterOperation) params.append('operationType', filterOperation);

      const response = await fetch(`${API_BASE_URL}/internal/reviews?${params}`, {
        headers: {
          'X-Admin-Password': password,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);

      // Fetch email history for all reviews
      fetchAllEmailHistory(password, data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to load reviews. Check your admin password.');
      setIsAuthenticated(false);
      sessionStorage.removeItem('admin-password');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEmailHistory = async (password: string, reviewsList: Review[]) => {
    const historyMap: Record<string, EmailHistory[]> = {};

    await Promise.all(
      reviewsList.map(async (review) => {
        try {
          const response = await fetch(`${API_BASE_URL}/internal/reviews/${review._id}/email-history`, {
            headers: { 'X-Admin-Password': password },
          });

          if (response.ok) {
            const data = await response.json();
            historyMap[review._id] = data.history || [];
          }
        } catch (error) {
          console.error(`Failed to fetch history for ${review._id}`, error);
        }
      })
    );

    setEmailHistoryMap(historyMap);
  };

  const viewEmailHistory = async (reviewId: string) => {
    setViewingHistory(reviewId);
  };

  const toggleReview = (id: string) => {
    const newSelected = new Set(selectedReviews);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedReviews(newSelected);
  };

  const selectAll = () => {
    if (selectedReviews.size === reviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(reviews.map(r => r._id)));
    }
  };

  const sendEmail = async (single: boolean, reviewId?: string) => {
    if (!emailSubject || !emailMessage) {
      alert('Please enter both subject and message');
      return;
    }

    if (!single && selectedReviews.size === 0) {
      alert('Please select at least one review');
      return;
    }

    setSending(true);
    setSendResults([]);

    try {
      if (single && reviewId) {
        // Send to single reviewer
        const response = await fetch(`${API_BASE_URL}/internal/reviews/${reviewId}/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Password': adminPassword,
          },
          body: JSON.stringify({
            subject: emailSubject,
            message: emailMessage,
          }),
        });

        const result = await response.json();
        if (result.success) {
          alert('Email sent successfully!');
        } else {
          alert(`Failed to send email: ${result.error}`);
        }
      } else {
        // Send bulk email
        const reviewIds = Array.from(selectedReviews);
        const response = await fetch(`${API_BASE_URL}/internal/reviews/send-bulk-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Password': adminPassword,
          },
          body: JSON.stringify({
            reviewIds,
            subject: emailSubject,
            message: emailMessage,
          }),
        });

        const result = await response.json();
        setSendResults(result.results || []);

        if (result.success) {
          alert(result.message);
          setSelectedReviews(new Set());
          setEmailSubject('');
          setEmailMessage('');
        }
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Check console for details.');
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto bg-black rounded-2xl shadow-2xl p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Admin Authentication</h1>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-white placeholder-white/50"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full !bg-white !text-black hover:!bg-white/90 !shadow-none hover:!shadow-none !transform-none">
                Authenticate
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const operationTypes = ['compress', 'convert', 'forge', 'lock', 'ocr', 'summarize'];

  // Generate email preview HTML
  const generatePreviewHTML = () => {
    const name = selectedReviews.size > 0
      ? reviews.find(r => r._id === Array.from(selectedReviews)[0])?.name || 'Reviewer'
      : 'Reviewer';

    const message = emailMessage || 'Your message will appear here...';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Preview</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f5f5f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;background-color:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 24px;text-align:center;border-bottom:1px solid #f0f0f0;">
              <img src="https://www.slim-file.com/logo.gif" alt="SlimFile" style="height:50px;width:auto;">
              <h1 style="margin:20px 0 0;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.5px;">${emailSubject || 'Email Subject'}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
                Hi <strong style="color:#111827;">${name}</strong>,
              </p>
              <div style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message}</div>
              <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">
                Thank you for being part of the SlimFile community!
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#f9fafb;border-radius:0 0 16px 16px;border-top:1px solid #f0f0f0;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">
                Get SlimFile on Google Play:
                <a href="https://play.google.com/store/apps/details?id=com.slimfile.app" style="color:#E81313;font-weight:600;text-decoration:none;">Download Now</a>
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                SlimFile &nbsp;·&nbsp; Compress. Convert. Collaborate
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  };

  return (
    <div className="min-h-screen md:h-screen bg-black overflow-hidden">
      {/* Mobile hamburger button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col md:flex-row h-full">
        {/* Sidebar */}
        <div className={`
          w-72 bg-white/5 p-4 md:p-6 flex flex-col overflow-y-auto
          fixed md:relative h-full z-40
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">SlimFile Mail</h1>
            <p className="text-sm text-white">Send emails to reviewers</p>
          </div>

          {/* Stats */}
          <div className="mb-8 p-4 bg-white/10 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">{reviews.length}</div>
            <div className="text-sm text-white">Total Reviews</div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-white" />
              <h3 className="font-semibold text-white">Filters</h3>
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Rating
              </label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 text-white rounded-lg text-sm focus:ring-2 focus:ring-white"
              >
                <option value="">All Ratings</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                <option value="3">⭐⭐⭐ 3 Stars</option>
                <option value="2">⭐⭐ 2 Stars</option>
                <option value="1">⭐ 1 Star</option>
              </select>
            </div>

            {/* Operation Type Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Operation Type
              </label>
              <select
                value={filterOperation}
                onChange={(e) => setFilterOperation(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 text-white rounded-lg text-sm focus:ring-2 focus:ring-white"
              >
                <option value="">All Operations</option>
                {operationTypes.map((op) => (
                  <option key={op} value={op}>
                    {op.charAt(0).toUpperCase() + op.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(filterRating || filterOperation) && (
              <button
                onClick={() => {
                  setFilterRating('');
                  setFilterOperation('');
                }}
                className="text-sm text-white hover:text-white/80 font-medium underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Selection Info */}
          <div className="p-4 bg-white/10 rounded-lg">
            <div className="text-sm font-medium text-white mb-1">
              {selectedReviews.size} Selected
            </div>
            <div className="text-xs text-white">
              Click reviews to select
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Email Composer */}
              <div className="lg:col-span-1 bg-black rounded-xl md:rounded-2xl p-4 md:p-6 h-fit">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Compose Email</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-white placeholder-white/50"
                      placeholder="Email subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Message
                    </label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-white resize-none placeholder-white/50"
                      placeholder="Your message here..."
                    />
                    <p className="text-xs text-white mt-1">
                      Tip: The reviewer's name will be automatically included
                    </p>
                  </div>

                  <Button
                    onClick={() => sendEmail(false)}
                    disabled={sending || selectedReviews.size === 0 || !emailSubject || !emailMessage}
                    className="w-full !bg-white !text-black hover:!bg-white/90 !shadow-none hover:!shadow-none !transform-none"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send to {selectedReviews.size} Selected
                      </>
                    )}
                  </Button>

                  {sendResults.length > 0 && (
                    <div className="mt-4 p-4 bg-white/10 rounded-lg">
                      <h3 className="text-sm font-semibold text-white mb-2">Send Results:</h3>
                      <div className="space-y-2">
                        {sendResults.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {result.success ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : (
                              <XCircle className="w-4 h-4 text-white" />
                            )}
                            <span className="text-white">
                              {result.email}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Email Preview */}
                  {(emailSubject || emailMessage) && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-white mb-2">Email Preview</h3>
                      <div className="bg-white rounded-lg overflow-hidden" style={{ height: '400px' }}>
                        <iframe
                          srcDoc={generatePreviewHTML()}
                          style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            backgroundColor: 'white'
                          }}
                          title="Email Preview"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 bg-black rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    Reviews with Emails ({reviews.length})
                  </h2>
                  <Button variant="outline" size="sm" onClick={selectAll} className="!border-white !bg-black !text-white hover:!bg-white hover:!text-black !shadow-none">
                    {selectedReviews.size === reviews.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 text-white">
                    No reviews with emails found
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4 overflow-y-auto max-h-[calc(100vh-16rem)] pr-1 md:pr-2">
                    {reviews.map((review) => {
                      const emailHistory = emailHistoryMap[review._id] || [];
                      const emailCount = emailHistory.length;

                      return (
                        <div
                          key={review._id}
                          className={`p-3 md:p-4 rounded-lg cursor-pointer transition-all ${
                            selectedReviews.has(review._id)
                              ? 'bg-white/20'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                          onClick={() => toggleReview(review._id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedReviews.has(review._id)}
                                    onChange={() => toggleReview(review._id)}
                                    className="w-4 h-4 text-white rounded focus:ring-white bg-white/10"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <span className="font-semibold text-white text-sm md:text-base">{review.name}</span>
                                </div>
                                <div className="flex items-center gap-2 ml-6 md:ml-0">
                                  <span className="text-xs md:text-sm text-white truncate">{review.email}</span>

                                  {/* Email History Badge */}
                                  {emailCount > 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        viewEmailHistory(review._id);
                                      }}
                                      className="flex items-center gap-1 px-2 py-1 bg-white text-black rounded-full text-xs font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
                                    >
                                      <Mail className="w-3 h-3" />
                                      Emailed {emailCount}x
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={i < review.rating ? 'text-yellow-400' : 'text-white/30'}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-white">
                                  {review.operationType} • {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs md:text-sm text-white mb-2">{review.comment}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sendEmail(true, review._id);
                                }}
                                disabled={sending || !emailSubject || !emailMessage}
                                className="!border-white !bg-black !text-white hover:!bg-white hover:!text-black !shadow-none text-xs md:text-sm w-full md:w-auto"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Send to this reviewer
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email History Modal */}
      {viewingHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">Email History</h2>
              </div>
              <button
                onClick={() => setViewingHistory(null)}
                className="p-2 hover:bg-white hover:text-black rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
              {emailHistoryMap[viewingHistory]?.length === 0 ? (
                <div className="text-center py-12 text-white">
                  No emails sent to this reviewer yet
                </div>
              ) : (
                <div className="space-y-4">
                  {emailHistoryMap[viewingHistory]?.map((history, idx) => (
                    <div key={history._id} className="p-4 bg-white/10 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">{history.subject}</span>
                        <span className="text-xs text-white">
                          {new Date(history.sentAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-white whitespace-pre-wrap">{history.message}</p>
                      <div className="mt-2 flex items-center gap-1">
                        {history.success ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span className="text-xs text-white">Sent successfully</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-white" />
                            <span className="text-xs text-white">Failed to send</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
