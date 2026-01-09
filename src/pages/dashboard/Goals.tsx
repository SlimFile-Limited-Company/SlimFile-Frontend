import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Trophy, TrendingUp, Award, Flame, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Fetch goals data
const fetchGoals = async () => {
  const token = localStorage.getItem('jwt');
  const res = await fetch(`${API_BASE_URL}/dashboard/goals`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch goals');
  return res.json();
};

export default function DashboardGoals() {
  const { data: goals, isLoading } = useQuery({
    queryKey: ['dashboard-goals'],
    queryFn: fetchGoals,
    refetchInterval: 60000,
  });

  const monthlyGoal = 100; // Files per month goal
  const spaceGoal = 1024 * 1024 * 1024; // 1GB goal
  const currentFiles = goals?.thisMonth?.files || 0;
  const currentSpace = goals?.thisMonth?.spaceSaved || 0;
  const streak = goals?.streak || 0;

  const filesProgress = Math.min((currentFiles / monthlyGoal) * 100, 100);
  const spaceProgress = Math.min((currentSpace / spaceGoal) * 100, 100);

  // Achievement badges
  const achievements = [
    {
      id: 'first',
      name: 'First Compression',
      description: 'Compress your first file',
      icon: <CheckCircle2 className="w-6 h-6" />,
      unlocked: (goals?.totalFiles || 0) >= 1,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'ten',
      name: 'Getting Started',
      description: 'Compress 10 files',
      icon: <Target className="w-6 h-6" />,
      unlocked: (goals?.totalFiles || 0) >= 10,
      color: 'bg-green-100 text-green-700',
    },
    {
      id: 'hundred',
      name: 'Compression Master',
      description: 'Compress 100 files',
      icon: <Trophy className="w-6 h-6" />,
      unlocked: (goals?.totalFiles || 0) >= 100,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'gb',
      name: 'Space Saver',
      description: 'Save 1GB of space',
      icon: <Award className="w-6 h-6" />,
      unlocked: (goals?.totalSpaceSaved || 0) >= 1024 * 1024 * 1024,
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 'streak7',
      name: 'Week Warrior',
      description: '7 day compression streak',
      icon: <Flame className="w-6 h-6" />,
      unlocked: streak >= 7,
      color: 'bg-orange-100 text-orange-700',
    },
    {
      id: 'streak30',
      name: 'Monthly Champion',
      description: '30 day compression streak',
      icon: <Flame className="w-6 h-6" />,
      unlocked: streak >= 30,
      color: 'bg-red-100 text-red-700',
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Goals & Achievements</h1>
        <p className="text-gray-600 mt-1">
          Track your progress and unlock achievements.
        </p>
      </div>

      {/* Monthly Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              Monthly File Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {currentFiles} / {monthlyGoal} files
                    </span>
                  </div>
                  <Progress value={filesProgress} className="h-3" />
                </div>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {filesProgress.toFixed(0)}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {currentFiles >= monthlyGoal
                      ? '🎉 Goal achieved!'
                      : `${monthlyGoal - currentFiles} more files to reach your goal`}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Space Saving Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatBytes(currentSpace)} / {formatBytes(spaceGoal)}
                    </span>
                  </div>
                  <Progress value={spaceProgress} className="h-3" />
                </div>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {spaceProgress.toFixed(0)}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {currentSpace >= spaceGoal
                      ? '🎉 Goal achieved!'
                      : `${formatBytes(spaceGoal - currentSpace)} more to reach your goal`}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Streak */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Flame className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {streak} Day Streak
                </h3>
                <p className="text-gray-600">
                  {streak === 0
                    ? 'Start your streak by compressing a file today!'
                    : 'Keep it up! Compress files daily to maintain your streak.'}
                </p>
              </div>
            </div>
            {streak > 0 && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                🔥 {streak}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Achievements
            </CardTitle>
            <Badge variant="outline">
              {unlockedCount} / {achievements.length} Unlocked
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? `${achievement.color} border-current`
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {achievement.description}
                    </p>
                    {achievement.unlocked && (
                      <Badge className="mt-2" variant="secondary">
                        Unlocked ✓
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivation */}
      <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <CardContent className="py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Keep Going!</h3>
            <p className="text-white/90 mb-4">
              {currentFiles >= monthlyGoal
                ? "You've crushed this month's goal! Set a new challenge for next month."
                : `You're ${filesProgress.toFixed(0)}% of the way to your monthly goal. Every file counts!`}
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => (window.location.href = '/compress')}
            >
              Compress Files Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
