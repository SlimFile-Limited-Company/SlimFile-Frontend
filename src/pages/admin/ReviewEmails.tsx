import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mail, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin-password');
    if (savedPassword) {
      setAdminPassword(savedPassword);
      setIsAuthenticated(true);
      fetchReviews(savedPassword);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('admin-password', adminPassword);
    setIsAuthenticated(true);
    fetchReviews(adminPassword);
  };

  const fetchReviews = async (password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/internal/reviews?hasEmail=true&limit=200`, {
        headers: {
          'X-Admin-Password': password,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to load reviews. Check your admin password.');
      setIsAuthenticated(false);
      sessionStorage.removeItem('admin-password');
    } finally {
      setLoading(false);
    }
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
        <Header />
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Review Email Manager</h1>
          <p className="text-gray-600">Send emails to reviewers who left their email address</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Composer */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24">
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
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
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
              <div className="space-y-4">
                {reviews.map((review) => (
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
