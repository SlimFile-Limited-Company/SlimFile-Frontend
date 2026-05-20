import { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import { Video, Plus, Link2, Shield, Users, Monitor } from 'lucide-react';

export default function Meet() {
  useSEO({
    title: 'SlimFile Meet — Free Video Meetings for Teams',
    description: 'Start or join a video meeting instantly with SlimFile Meet. No downloads required — collaborate with your team in real time.',
  });
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

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
    if (!joinCode.trim()) return;
    setIsJoining(true);
    const code = joinCode.trim().toLowerCase().replace(/\s+/g, '-');
    navigate(`/meet/${code}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="pt-32 pb-16 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Video className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-medium text-primary tracking-wide uppercase">SlimFile Meet</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-light text-gray-900 mb-4 tracking-tight">
          Video calls for <span className="font-medium">everyone</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Connect instantly. No downloads required.
        </p>
      </div>

      {/* Main Actions */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 gap-4 mb-16">

          {/* New Meeting */}
          <button
            onClick={handleNewMeeting}
            className="group flex flex-col items-start gap-4 bg-primary hover:bg-primary/90 text-white rounded-3xl p-8 text-left transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <div className="bg-white/20 rounded-2xl p-3">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-semibold mb-1">New meeting</div>
              <div className="text-white/70 text-sm">Start an instant meeting and share the link</div>
            </div>
          </button>

          {/* Join Meeting */}
          <div className="flex flex-col gap-4 bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <div className="bg-gray-200/70 rounded-2xl p-3 w-fit">
              <Link2 className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Join a meeting</div>
              <div className="text-gray-500 text-sm mb-5">Enter a code to join an existing meeting</div>
            </div>
            <form onSubmit={handleJoinMeeting} className="mt-auto">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter code (e.g., abc-def-ghi)"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mb-3"
              />
              <button
                type="submit"
                disabled={!joinCode.trim() || isJoining}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-2xl transition-colors duration-150"
              >
                {isJoining ? 'Joining...' : 'Join'}
              </button>
            </form>
          </div>
        </div>

        {/* Trust strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Multi-participant</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span>Screen sharing</span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>HD video</span>
          </div>
        </div>
      </div>
    </div>
  );
}
