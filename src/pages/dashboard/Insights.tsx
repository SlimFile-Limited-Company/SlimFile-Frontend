import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Lightbulb,
  TrendingUp,
  Clock,
  FileType,
  Calendar,
  BarChart3,
  Download,
} from 'lucide-react';
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

// Fetch insights data
const fetchInsights = async () => {
  const token = localStorage.getItem('jwt');
  const res = await fetch(`${API_BASE_URL}/dashboard/insights`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch insights');
  return res.json();
};

export default function DashboardInsights() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ['dashboard-insights'],
    queryFn: fetchInsights,
    refetchInterval: 60000,
  });

  const downloadReport = () => {
    // Generate a simple text report
    const report = `
SlimFile Compression Report
Generated: ${new Date().toLocaleDateString()}

=== Summary ===
Total Files Compressed: ${insights?.totalFiles || 0}
Total Space Saved: ${formatBytes(insights?.totalSpaceSaved || 0)}
Average Compression Ratio: ${insights?.avgCompressionRatio || 0}%

=== Top File Types ===
${insights?.topFileTypes?.map((ft: any, i: number) => `${i + 1}. ${ft.type}: ${ft.count} files`).join('\n') || 'No data'}

=== Monthly Trend ===
This Month: ${insights?.thisMonth?.files || 0} files
Last Month: ${insights?.lastMonth?.files || 0} files
Change: ${insights?.monthlyChange >= 0 ? '+' : ''}${insights?.monthlyChange || 0}%

=== Insights ===
${insights?.insights?.map((i: any) => `• ${i.message}`).join('\n') || 'No insights available'}

---
Generated with SlimFile - https://www.slim-file.com
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slimfile-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insights & Reports</h1>
          <p className="text-gray-600 mt-1">
            Smart insights about your compression patterns and recommendations.
          </p>
        </div>
        <Button onClick={downloadReport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="py-6">
                  <div className="animate-pulse flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            {/* Most Compressed File Type */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileType className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Most Compressed Type</h3>
                    <p className="text-sm text-gray-600">
                      {insights?.topFileTypes?.[0]
                        ? `You compress ${insights.topFileTypes[0].type} files the most (${insights.topFileTypes[0].count} files, ${insights.topFileTypes[0].percentage}%)`
                        : 'Start compressing files to see insights'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Peak Activity Time */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Peak Activity</h3>
                    <p className="text-sm text-gray-600">
                      {insights?.peakDay
                        ? `You're most active on ${insights.peakDay}s`
                        : 'Compress more files to identify patterns'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      Monthly Trend
                      {insights?.monthlyChange > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          +{insights.monthlyChange}%
                        </Badge>
                      )}
                      {insights?.monthlyChange < 0 && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          {insights.monthlyChange}%
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {insights?.monthlyChange > 0
                        ? `You're compressing ${insights.monthlyChange}% more files this month`
                        : insights?.monthlyChange < 0
                        ? `Compression activity decreased by ${Math.abs(insights.monthlyChange)}% this month`
                        : 'Your activity is consistent month-over-month'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Compression */}
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Average Compression</h3>
                    <p className="text-sm text-gray-600">
                      {insights?.avgCompressionRatio
                        ? `You achieve an average ${insights.avgCompressionRatio}% size reduction`
                        : 'Compress files to see your average compression ratio'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Smart Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {insights?.recommendations?.map((rec: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.message}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Compress more files to receive personalized recommendations!
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            Usage Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-gray-900">
                    {insights?.thisWeek?.files || 0}
                  </div>
                  <div className="text-sm text-gray-600">This Week</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-gray-900">
                    {insights?.thisMonth?.files || 0}
                  </div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-gray-900">
                    {insights?.avgFilesPerDay || 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg Files/Day</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatBytes(insights?.avgSpaceSavedPerFile || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Saved/File</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">File Type Distribution</h4>
                <div className="space-y-2">
                  {insights?.topFileTypes?.slice(0, 5).map((ft: any) => (
                    <div key={ft.type} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-gray-600 truncate">{ft.type}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{ width: `${ft.percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-sm text-gray-900 text-right">
                        {ft.percentage}%
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No file type data available yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
