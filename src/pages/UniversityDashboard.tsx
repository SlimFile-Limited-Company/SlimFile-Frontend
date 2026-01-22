import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Folder, TrendingDown, Package, Calendar, LogOut, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { getUniversityAuthHeaders, universityLogout, getUniversityData } from "@/lib/universityAuth";

interface DashboardData {
  id: string;
  name: string;
  email: string;
  contactPerson?: string;
  totalFilesCompressed: number;
  totalSpaceSaved: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  sessionCount: number;
  lastActive: string;
  compressionHistory: Array<{
    date: string;
    fileCount: number;
    originalSize: number;
    compressedSize: number;
    spaceSaved: number;
    compressionRatio: number;
  }>;
}

const UniversityDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/portals/dashboard`, {
        headers: getUniversityAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please login again.",
            variant: "destructive"
          });
          universityLogout();
          return;
        }
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    universityLogout();
  };

  const handleCompressFiles = () => {
    navigate('/portals');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center">
        <motion.div
          className="h-16 w-16 border-4 border-red-600 border-r-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <p className="text-gray-600">Failed to load dashboard data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallCompressionRatio = dashboardData.totalOriginalSize > 0
    ? Math.round(((dashboardData.totalOriginalSize - dashboardData.totalCompressedSize) / dashboardData.totalOriginalSize) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{dashboardData.name}</h1>
                <p className="text-sm text-gray-600">{dashboardData.email}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-3"
          >
            <Button
              onClick={handleCompressFiles}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Compress Files
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.totalFilesCompressed}</p>
                <p className="text-sm text-gray-600">Files Compressed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{formatFileSize(dashboardData.totalSpaceSaved)}</p>
                <p className="text-sm text-gray-600">Space Saved</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.sessionCount}</p>
                <p className="text-sm text-gray-600">Compression Sessions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white border-2 border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{overallCompressionRatio}%</p>
                <p className="text-sm text-gray-600">Avg. Compression</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Compression History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-white border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Compression History</h2>
              </div>

              {dashboardData.compressionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No compression sessions yet</p>
                  <Button
                    onClick={handleCompressFiles}
                    className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Start Compressing
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Files</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Original Size</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Compressed Size</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Saved</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.compressionHistory.map((session, idx) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {formatDate(session.date)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {session.fileCount}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {formatFileSize(session.originalSize)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {formatFileSize(session.compressedSize)}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-green-600">
                            {formatFileSize(session.spaceSaved)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              {session.compressionRatio}%
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default UniversityDashboard;
