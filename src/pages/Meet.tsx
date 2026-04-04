import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Video, Plus, LogIn } from 'lucide-react';

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
    const meetingCode = generateMeetingCode();
    navigate(`/meet/${meetingCode}`);
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();

    if (!joinCode.trim()) {
      return;
    }

    setIsJoining(true);
    // Navigate to meeting room
    const code = joinCode.trim().toLowerCase().replace(/\s+/g, '-');
    navigate(`/meet/${code}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl shadow-lg">
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
        <div className="grid md:grid-cols-2 gap-8 mb-12">
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

      </div>
    </div>
  );
}
