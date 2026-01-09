import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileArchive,
  HardDrive,
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Format bytes to human readable
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Fetch stats
const fetchStats = async () => {
  const token = localStorage.getItem('jwt');
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

// Fetch recent activity
const fetchRecent = async () => {
  const token = localStorage.getItem('jwt');
  const res = await fetch(`${API_BASE_URL}/dashboard/recent`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch recent activity');
  return res.json();
};

export default function DashboardOverview() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchStats
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ['dashboard-recent'],
    queryFn: fetchRecent
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your compression overview.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/compress">
          <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600">
            Compress Files
          </Button>
        </Link>
        <Link to="/convert">
          <Button variant="outline" className="w-full">
            Convert Files
          </Button>
        </Link>
        <Link to="/dashboard/history">
          <Button variant="outline" className="w-full">
            View History
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Files Compressed
            </CardTitle>
            <FileArchive className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.totalFiles?.toLocaleString() || 0}
                </div>
                {stats?.percentageChange?.files !== undefined && stats.percentageChange.files !== 0 && (
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className={stats.percentageChange.files >= 0 ? "text-green-600" : "text-red-600"}>
                      {stats.percentageChange.files >= 0 ? '+' : ''}
                      {stats.percentageChange.files}%
                    </span>
                    <span>from last month</span>
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Space Saved
            </CardTitle>
            <HardDrive className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">
                  {formatBytes(stats?.totalSpaceSaved || 0)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Across all compressions
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Month
            </CardTitle>
            <Calendar className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.filesThisMonth?.toLocaleString() || 0}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Files compressed
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Link to="/dashboard/history">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-3 py-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : !recent || recent.length === 0 ? (
            <div className="text-center py-12">
              <FileArchive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                No activity yet. Start compressing files to see your history!
              </p>
              <Link to="/compress">
                <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600">
                  Compress Your First File
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recent.map((item: any) => (
                <div key={item._id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <FileArchive className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{item.filename}</p>
                      <p className="text-sm text-gray-500">
                        Saved {formatBytes(item.spaceSaved)} ({item.compressionRatio}% reduction)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0 ml-4">
                    <Clock className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
