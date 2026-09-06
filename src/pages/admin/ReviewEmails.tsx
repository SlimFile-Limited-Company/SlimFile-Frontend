import { useEffect, useState } from 'react';
import { Mail, Send, Loader2, CheckCircle2, XCircle, Filter, History, X } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Authentication</h1>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Authenticate
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const operationTypes = ['compress', 'convert', 'forge', 'lock', 'ocr', 'summarize'];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 h-full p-6 flex flex-col overflow-y-auto">
          <div className="mb-8">
<h1 className="text-2xl font-bold text-gray-900 mb-2">SlimFile Mail</h1>
            <p className="text-sm text-gray-600">Send emails to reviewers</p>
          </div>

          {/* Stats */}
          <div className="mb-8 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
            <div className="text-3xl font-bold text-red-600 mb-1">{reviews.length}</div>
            <div className="text-sm text-gray-700">Total Reviews</div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation Type
              </label>
              <select
                value={filterOperation}
                onChange={(e) => setFilterOperation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Selection Info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-900 mb-1">
              {selectedReviews.size} Selected
            </div>
            <div className="text-xs text-gray-600">
              Click reviews to select
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 h-full flex">
          <div className="container mx-auto px-6 py-8 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Email Composer */}
              <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 h-fit">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-red-600" />
                  <h2 className="text-xl font-bold text-gray-900">Compose Email</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Email subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      placeholder="Your message here..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: The reviewer's name will be automatically included
                    </p>
                  </div>

                  <Button
                    onClick={() => sendEmail(false)}
                    disabled={sending || selectedReviews.size === 0 || !emailSubject || !emailMessage}
                    className="w-full"
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
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Send Results:</h3>
                      <div className="space-y-2">
                        {sendResults.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {result.success ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={result.success ? 'text-green-700' : 'text-red-700'}>
                              {result.email}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Reviews with Emails ({reviews.length})
                  </h2>
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    {selectedReviews.size === reviews.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No reviews with emails found
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    {reviews.map((review) => {
                      const emailHistory = emailHistoryMap[review._id] || [];
                      const emailCount = emailHistory.length;

                      return (
                        <div
                          key={review._id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedReviews.has(review._id)
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleReview(review._id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <input
                                  type="checkbox"
                                  checked={selectedReviews.has(review._id)}
                                  onChange={() => toggleReview(review._id)}
                                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="font-semibold text-gray-900">{review.name}</span>
                                <span className="text-sm text-gray-500">{review.email}</span>

                                {/* Email History Badge */}
                                {emailCount > 0 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      viewEmailHistory(review._id);
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                                  >
                                    <Mail className="w-3 h-3" />
                                    Emailed {emailCount}x
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {review.operationType} • {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sendEmail(true, review._id);
                                }}
                                disabled={sending || !emailSubject || !emailMessage}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Email History</h2>
              </div>
              <button
                onClick={() => setViewingHistory(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
              {emailHistoryMap[viewingHistory]?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No emails sent to this reviewer yet
                </div>
              ) : (
                <div className="space-y-4">
                  {emailHistoryMap[viewingHistory]?.map((history, idx) => (
                    <div key={history._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{history.subject}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(history.sentAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{history.message}</p>
                      <div className="mt-2 flex items-center gap-1">
                        {history.success ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-700">Sent successfully</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs text-red-700">Failed to send</span>
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
