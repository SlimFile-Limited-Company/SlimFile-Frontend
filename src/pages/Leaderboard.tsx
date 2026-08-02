import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, FileArchive, HardDrive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LeaderboardEntry {
  rank: number;
  type: 'user' | 'guest';
  userId?: string;
  guestId?: string;
  name: string;
  picture: string | null;
  avgCompressionRatio: number;
  totalFiles: number;
  totalSpaceSaved: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';
      const response = await fetch(`${API_BASE_URL}/leaderboard?limit=100`);

      if (!response.ok) throw new Error('Failed to fetch leaderboard');

      const data: LeaderboardResponse = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      console.error('Leaderboard error:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-700" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 text-gray-700 border-gray-300';
    if (rank === 3) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-white text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-12 px-3 md:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-3">
            Compression Leaderboard
          </h1>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Top compression champions ranked by total space saved
          </p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-4 md:mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
              {/* 2nd Place */}
              <div className="flex flex-col items-center md:pt-8 md:order-1">
                <Card className="w-full border-2 border-gray-300 shadow-lg relative">
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-base md:text-lg shadow-md">
                    2
                  </div>
                  <CardContent className="p-3 md:p-4 text-center pt-5 md:pt-6">
                    <div className="flex justify-center mb-2 md:mb-3">
                      <Medal className="w-6 h-6 md:w-10 md:h-10 text-gray-400" />
                    </div>
                    {leaderboard[1].picture ? (
                      <img
                        src={leaderboard[1].picture}
                        alt={leaderboard[1].name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-1 md:mb-2 border-2 border-gray-300"
                      />
                    ) : (
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-200 mx-auto mb-1 md:mb-2 flex items-center justify-center">
                        <span className="text-xl md:text-2xl font-bold text-gray-500">
                          {leaderboard[1].name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h3 className="font-bold text-gray-900 truncate text-base md:text-base">{leaderboard[1].name}</h3>
                    <p className="text-lg md:text-2xl font-bold text-gray-600 mt-1 md:mt-2">
                      {formatFileSize(leaderboard[1].totalSpaceSaved)}
                    </p>
                    <p className="text-xs md:text-xs text-gray-500 mt-0.5 md:mt-1">
                      {leaderboard[1].totalFiles} files
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center md:order-2">
                <Card className="w-full border-2 border-yellow-400 shadow-2xl relative">
                  <div className="absolute -top-4 md:-top-5 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-lg md:text-xl shadow-lg">
                    1
                  </div>
                  <CardContent className="p-3 md:p-6 text-center pt-6 md:pt-8">
                    <div className="flex justify-center mb-2 md:mb-3">
                      <Trophy className="w-8 h-8 md:w-12 md:h-12 text-yellow-500" />
                    </div>
                    {leaderboard[0].picture ? (
                      <img
                        src={leaderboard[0].picture}
                        alt={leaderboard[0].name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-2 md:mb-3 border-3 md:border-4 border-yellow-400"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-100 mx-auto mb-2 md:mb-3 flex items-center justify-center border-3 md:border-4 border-yellow-400">
                        <span className="text-2xl md:text-3xl font-bold text-yellow-600">
                          {leaderboard[0].name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h3 className="font-bold text-gray-900 text-lg md:text-lg truncate">{leaderboard[0].name}</h3>
                    <p className="text-xl md:text-3xl font-bold text-yellow-600 mt-1 md:mt-2">
                      {formatFileSize(leaderboard[0].totalSpaceSaved)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                      {leaderboard[0].totalFiles} files
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center md:pt-8 md:order-3">
                <Card className="w-full border-2 border-amber-300 shadow-lg relative">
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-base md:text-lg shadow-md">
                    3
                  </div>
                  <CardContent className="p-3 md:p-4 text-center pt-5 md:pt-6">
                    <div className="flex justify-center mb-2 md:mb-3">
                      <Award className="w-6 h-6 md:w-10 md:h-10 text-amber-700" />
                    </div>
                    {leaderboard[2].picture ? (
                      <img
                        src={leaderboard[2].picture}
                        alt={leaderboard[2].name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-1 md:mb-2 border-2 border-amber-300"
                      />
                    ) : (
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-100 mx-auto mb-1 md:mb-2 flex items-center justify-center">
                        <span className="text-xl md:text-2xl font-bold text-amber-700">
                          {leaderboard[2].name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h3 className="font-bold text-gray-900 truncate text-base md:text-base">{leaderboard[2].name}</h3>
                    <p className="text-lg md:text-2xl font-bold text-amber-700 mt-1 md:mt-2">
                      {formatFileSize(leaderboard[2].totalSpaceSaved)}
                    </p>
                    <p className="text-xs md:text-xs text-gray-500 mt-0.5 md:mt-1">
                      {leaderboard[2].totalFiles} files
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard List */}
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <Card
              key={`${entry.type}-${entry.userId || entry.guestId}`}
              className={`border-2 ${getRankBadge(entry.rank)} transition-all hover:shadow-md`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-16 text-center">
                    {entry.rank <= 3 ? (
                      getRankIcon(entry.rank)
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        #{entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {entry.picture ? (
                      <img
                        src={entry.picture}
                        alt={entry.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-500">
                          {entry.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name & Type */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {entry.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {entry.type === 'guest' ? 'Guest User' : 'Registered User'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                        <FileArchive className="w-3 h-3" />
                        <span>Files</span>
                      </div>
                      <p className="font-semibold text-gray-900">{entry.totalFiles}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                        <HardDrive className="w-3 h-3" />
                        <span>Saved</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatFileSize(entry.totalSpaceSaved)}
                      </p>
                    </div>
                  </div>

                  {/* Space Saved */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
                      <HardDrive className="w-5 h-5 text-red-600" />
                      <span className="text-xl font-bold text-red-600">
                        {formatFileSize(entry.totalSpaceSaved)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="md:hidden mt-3 pt-3 border-t border-gray-200 flex justify-around text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Files</p>
                    <p className="font-semibold text-gray-900">{entry.totalFiles}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Space Saved</p>
                    <p className="font-semibold text-gray-900">
                      {formatFileSize(entry.totalSpaceSaved)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No compression data yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
}
