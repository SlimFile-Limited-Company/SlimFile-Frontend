import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Video, Plus, LogIn } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';

export default function Meet() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Generate random meeting code
  const generateMeetingCode = () => {
    const segments = Array.from({ length: 3 }, () =>
      Math.random().toString(36).substring(2, 6)
    );
    return segments.join('-');
  };

  const handleNewMeeting = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const meetingCode = generateMeetingCode();
    navigate(`/meet/${meetingCode}`);
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();

    if (!joinCode.trim()) {
      return;
    }

    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setIsJoining(true);
    // Navigate to meeting room
    const code = joinCode.trim().toLowerCase().replace(/\s+/g, '-');
    navigate(`/meet/${code}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl">
              <Video className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            SlimFile Meet
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Secure, high-quality video calls for everyone. Connect with your team instantly.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* New Meeting Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 ml-3">
                New Meeting
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Start an instant meeting and invite participants with a link.
            </p>
            <Button
              onClick={handleNewMeeting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start New Meeting
            </Button>
          </div>

          {/* Join Meeting Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <LogIn className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 ml-3">
                Join Meeting
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Enter a meeting code or link to join an existing meeting.
            </p>
            <form onSubmit={handleJoinMeeting}>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter meeting code (e.g., abc-def-ghi)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                disabled={!joinCode.trim() || isJoining}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-6 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="w-5 h-5 mr-2" />
                {isJoining ? 'Joining...' : 'Join Meeting'}
              </Button>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Features
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">HD Video & Audio</h4>
              <p className="text-sm text-gray-600">
                Crystal clear video and audio quality for smooth communication
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Screen Sharing</h4>
              <p className="text-sm text-gray-600">
                Share your screen or specific applications with participants
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure & Private</h4>
              <p className="text-sm text-gray-600">
                End-to-end encrypted meetings for your privacy and security
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Multi-Participant</h4>
              <p className="text-sm text-gray-600">
                Host meetings with multiple participants simultaneously
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Noise Cancellation</h4>
              <p className="text-sm text-gray-600">
                Advanced audio filtering for clear conversations
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">No Time Limit</h4>
              <p className="text-sm text-gray-600">
                Unlimited meeting duration for all users
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {!isAuthenticated() && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Sign in to start hosting and joining meetings
            </p>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg rounded-xl"
            >
              Sign In to Get Started
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
