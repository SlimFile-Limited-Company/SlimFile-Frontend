import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileArchive, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Fetch timeline data
const fetchTimeline = async (year: number, month: number) => {
  const token = localStorage.getItem('jwt');
  const res = await fetch(
    `${API_BASE_URL}/dashboard/timeline?year=${year}&month=${month + 1}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error('Failed to fetch timeline');
  return res.json();
};

export default function DashboardTimeline() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: timeline, isLoading } = useQuery({
    queryKey: ['dashboard-timeline', year, month],
    queryFn: () => fetchTimeline(year, month),
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayActivity = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return timeline?.days?.[dateStr] || { count: 0, files: [] };
  };

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-green-200';
    if (count <= 5) return 'bg-green-400';
    if (count <= 10) return 'bg-green-600';
    return 'bg-green-800';
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const selectedDayActivity = selectedDay ? getDayActivity(selectedDay) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Timeline</h1>
        <p className="text-gray-600 mt-1">
          Your compression activity calendar with daily breakdown.
        </p>
      </div>

      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              {monthNames[month]} {year}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-600 py-2"
                  >
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const activity = getDayActivity(day);
                  const isToday =
                    new Date().toDateString() === new Date(year, month, day).toDateString();

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                        getHeatmapColor(activity.count)
                      } ${
                        isToday ? 'border-red-600 ring-2 ring-red-200' : 'border-transparent'
                      } ${selectedDay === day ? 'ring-2 ring-blue-500' : ''}`}
                      title={`${day} ${monthNames[month]}: ${activity.count} files`}
                    >
                      <div className="text-sm font-medium text-gray-900">{day}</div>
                      {activity.count > 0 && (
                        <div className="text-xs font-semibold text-gray-700">
                          {activity.count}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t">
                <span className="text-sm text-gray-600">Less</span>
                {[0, 1, 3, 6, 11].map((count, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded ${getHeatmapColor(count)}`}
                    title={`${count}+ compressions`}
                  ></div>
                ))}
                <span className="text-sm text-gray-600">More</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      {selectedDay && selectedDayActivity && selectedDayActivity.count > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {monthNames[month]} {selectedDay}, {year} - {selectedDayActivity.count} Files
              Compressed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDayActivity.files.map((file: any) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <FileArchive className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{file.filename}</p>
                      <p className="text-sm text-gray-500">
                        {formatBytes(file.originalSize)} → {formatBytes(file.compressedSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      -{file.compressionRatio}%
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-3xl font-bold text-gray-900">
                {timeline?.summary?.totalFiles || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Files</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-3xl font-bold text-gray-900">
                {formatBytes(timeline?.summary?.totalSpaceSaved || 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Space Saved</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-3xl font-bold text-gray-900">
                {timeline?.summary?.activeDays || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Active Days</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-3xl font-bold text-gray-900">
                {timeline?.summary?.avgCompressionRatio || 0}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Avg Reduction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
