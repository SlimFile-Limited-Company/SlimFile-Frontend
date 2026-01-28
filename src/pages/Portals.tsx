import { useState, useEffect } from "react";
import { FolderUpload } from "@/components/FolderUpload";
import { PortalResult } from "@/components/PortalResult";
import { toast } from "@/hooks/use-toast";
import { Folder, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { isAuthenticated } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface CompressionStats {
  totalFiles: number;
  compressedFiles: number;
  skippedFiles: number;
  failedFiles: number;
  originalSize: number;
  compressedSize: number;
  spaceSaved: number;
  compressionRatio: number;
}

const Portals = () => {
  const [step, setStep] = useState<'upload' | 'result'>('upload');
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [fileIndex, setFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [stats, setStats] = useState<CompressionStats | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please login to use folder compression.",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [navigate]);

  // Get auth headers for API calls
  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('jwt');
    if (!token) return {};
    return { 'Authorization': `Bearer ${token}` };
  };

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = API_BASE_URL.replace('/api', '');
    console.log('🔌 [SOCKET INIT] Initializing socket connection to:', socketUrl);

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ [SOCKET] Connected successfully! Socket ID:', newSocket.id);
      console.log('✅ [SOCKET] Transport:', newSocket.io.engine.transport.name);
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('⚠️ [SOCKET] Disconnected. Reason:', reason);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ [SOCKET] Connection error:', error.message);
    });

    // Debug: Log ALL events received
    newSocket.onAny((eventName, ...args) => {
      console.log('🔊 [SOCKET] Received event:', eventName, 'with data:', args);
    });

    newSocket.on('portalProgress', (data) => {
      console.log('🔵 [GLOBAL SOCKET] Portal progress update received:', data);
      console.log('🔵 [GLOBAL SOCKET] Message content:', data.message);
      console.log('🔵 [GLOBAL SOCKET] Status:', data.status);

      // Handle all status types: 'compressing', 'compressed', 'skipped', 'failed', 'complete'
      if (data.status === 'complete') {
        console.log('🔵 [GLOBAL SOCKET] Setting complete status');
        setProgress(100);
        setStatusMessage('Compression complete!');
      } else {
        // Update progress for all non-complete statuses
        console.log('🔵 [GLOBAL SOCKET] Updating progress state with:', {
          progress: data.percentComplete,
          currentFile: data.currentFile,
          fileIndex: data.fileIndex,
          totalFiles: data.totalFiles,
          statusMessage: data.message
        });
        setProgress(data.percentComplete || 0);
        setCurrentFile(data.currentFile || '');
        setFileIndex(data.fileIndex || 0);
        setTotalFiles(data.totalFiles || 0);
        setStatusMessage(data.message || '');
        console.log('🔵 [GLOBAL SOCKET] State updates called');
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleFilesSelect = async (files: File[]) => {
    if (files.length === 0) return;

    setIsCompressing(true);
    setProgress(0);
    setCurrentFile('');
    setFileIndex(0);
    setTotalFiles(files.length);
    setStatusMessage('');
    setCompressedBlob(null);
    setStats(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const sessionId = `session_${Date.now()}`;
    formData.append('sessionId', sessionId);

    // Calculate total size for upload status
    const totalUploadSize = files.reduce((acc, file) => acc + file.size, 0);
    const totalUploadMB = (totalUploadSize / (1024 * 1024)).toFixed(1);

    // Set initial status message about upload
    setStatusMessage(`Uploading ${files.length} files (${totalUploadMB} MB) to server...`);

    // Simulate smooth progress if socket isn't working
    let simulatedProgress = 0;
    let socketActive = false;

    const progressInterval = setInterval(() => {
      if (!socketActive) {
        console.log('⚪ [SIMULATED] Running simulated progress (socketActive = false)');
        // Smooth progress simulation: start slow, accelerate, then slow down near end
        const increment = simulatedProgress < 20 ? 0.5 :
                         simulatedProgress < 70 ? 1.5 :
                         simulatedProgress < 95 ? 0.5 : 0.1;

        simulatedProgress = Math.min(95, simulatedProgress + increment);
        console.log('⚪ [SIMULATED] Setting progress to:', Math.floor(simulatedProgress));
        setProgress(Math.floor(simulatedProgress));

        // Estimate current file based on progress
        const estimatedFileIndex = Math.floor((simulatedProgress / 100) * files.length);
        setFileIndex(estimatedFileIndex);
        if (files[estimatedFileIndex]) {
          setCurrentFile(files[estimatedFileIndex].name);
          console.log('⚪ [SIMULATED] Setting currentFile to:', files[estimatedFileIndex].name);
        }
      } else {
        console.log('🟢 [SIMULATED] Skipping simulated progress (socketActive = true)');
      }
    }, 100);

    // Listen for socket progress updates
    const handleSocketProgress = (data: any) => {
      console.log('🟠 [PER-UPLOAD SOCKET] Received message:', data);
      console.log('🟠 [PER-UPLOAD SOCKET] Session ID match?', data.sessionId, '===', sessionId, data.sessionId === sessionId);

      if (data.sessionId === sessionId) {
        console.log('🟢 [PER-UPLOAD SOCKET] Session ID matched! Setting socketActive = true');
        socketActive = true;
        console.log('🟢 [PER-UPLOAD SOCKET] socketActive is now:', socketActive);
        console.log('🟢 [PER-UPLOAD SOCKET] Message:', data.message);
        console.log('🟢 [PER-UPLOAD SOCKET] Status:', data.status);

        // Handle all status types from backend
        if (data.status === 'complete') {
          console.log('🟢 [PER-UPLOAD SOCKET] Setting complete status');
          setProgress(100);
          setStatusMessage('Compression complete!');
        } else {
          // Handle: 'compressing', 'compressed', 'skipped', 'failed'
          console.log('🟢 [PER-UPLOAD SOCKET] Updating state with:', {
            progress: data.percentComplete,
            currentFile: data.currentFile,
            fileIndex: data.fileIndex,
            totalFiles: data.totalFiles,
            statusMessage: data.message
          });
          setProgress(data.percentComplete || 0);
          setCurrentFile(data.currentFile || '');
          setFileIndex(data.fileIndex || 0);
          setTotalFiles(data.totalFiles || 0);
          setStatusMessage(data.message || '');
          console.log('🟢 [PER-UPLOAD SOCKET] State updates called, statusMessage set to:', data.message);
        }
      } else {
        console.log('🔴 [PER-UPLOAD SOCKET] Session ID did NOT match, ignoring this message');
      }
    };

    if (socket) {
      socket.on('portalProgress', handleSocketProgress);
    }

    try {
      console.log('📤 [UPLOAD] Starting upload to backend...');
      console.log('📤 [UPLOAD] API URL:', `${API_BASE_URL}/portals/compress`);
      console.log('📤 [UPLOAD] File count:', files.length);
      console.log('📤 [UPLOAD] Session ID:', sessionId);

      // Calculate total upload size for diagnostics
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      console.log('📤 [UPLOAD] Total upload size:', totalSizeMB, 'MB');

      const uploadStartTime = Date.now();

      // Add timeout to prevent indefinite hanging
      // Timeout: 10 minutes for upload + processing (600,000ms)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error('⏰ [UPLOAD] Request timeout after 10 minutes');
        controller.abort();
      }, 10 * 60 * 1000);

      // Add warning if upload takes too long
      const warningTimeoutId = setTimeout(() => {
        console.warn('⚠️ [UPLOAD] Upload is taking longer than 2 minutes...');
        setStatusMessage(`Upload is taking longer than expected... Large folders may take several minutes. (${totalUploadMB} MB uploading)`);
      }, 2 * 60 * 1000); // 2 minutes

      console.log('📤 [UPLOAD] Sending request with 10-minute timeout...');

      const response = await fetch(`${API_BASE_URL}/portals/compress`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);

      const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);
      console.log(`📤 [UPLOAD] Request completed in ${uploadDuration}s`);
      console.log('📤 [UPLOAD] Response status:', response.status, response.statusText);

      // Update status - upload complete, now processing response
      setStatusMessage(`Upload complete! Processing compressed files...`);

      clearInterval(progressInterval);

      if (!response.ok) {
        console.error('❌ [UPLOAD] Request failed with status:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [UPLOAD] Error details:', errorData);
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      console.log('✅ [UPLOAD] Request successful, processing response...');

      // Get stats from response header
      const statsHeader = response.headers.get('X-Compression-Stats');
      if (statsHeader) {
        try {
          const parsedStats = JSON.parse(statsHeader);
          setStats(parsedStats);
        } catch (e) {
          console.error('Failed to parse stats header:', e);
        }
      }

      // Get blob directly (same pattern as normal compression)
      const blob = await response.blob();
      setCompressedBlob(blob);
      setProgress(100);
      setStep('result');

      toast({
        title: "Compression Complete!",
        description: `${files.length} files have been compressed.`,
      });
    } catch (err: any) {
      console.error('💥 [UPLOAD] Fatal error occurred:', err);
      console.error('💥 [UPLOAD] Error name:', err.name);
      console.error('💥 [UPLOAD] Error message:', err.message);
      console.error('💥 [UPLOAD] Full error:', err);

      let errorTitle = "Compression Failed";
      let errorDescription = err.message || 'Unknown error occurred';

      // Handle specific error types
      if (err.name === 'AbortError') {
        console.error('⏰ [UPLOAD] Request was aborted due to timeout');
        errorTitle = "Request Timeout";
        errorDescription = `Upload took longer than 10 minutes. This usually happens with very large folders. Try compressing fewer files at once or check your internet connection.`;
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        console.error('🌐 [UPLOAD] Network error detected');
        errorTitle = "Network Error";
        errorDescription = "Unable to reach the server. Please check your internet connection and try again.";
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      if (socket) {
        socket.off('portalProgress', handleSocketProgress);
      }
      setIsCompressing(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setProgress(0);
    setCurrentFile('');
    setFileIndex(0);
    setTotalFiles(0);
    setCompressedBlob(null);
    setStats(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30">
      <main className="relative pt-20 z-10">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
                  <Folder className="w-4 h-4" />
                  Folder Compression
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-gray-900 mb-2">
                    Compress Entire Folders
                  </span>
                  <span className="block bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                    Unlimited Files
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mt-6">
                  Upload entire folders with unlimited files. SlimFile will compress everything and package it into a downloadable ZIP.
                </p>
              </motion.div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
                {[
                  { icon: Folder, title: "Unlimited Files", description: "No limit on file count", gradient: "from-blue-400 to-blue-600" },
                  { icon: Zap, title: "Batch Processing", description: "Compress everything at once", gradient: "from-yellow-400 to-orange-500" },
                  { icon: Shield, title: "Secure & Private", description: "Files deleted after processing", gradient: "from-green-400 to-green-600" },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              {/* Step Content */}
              <div className="relative bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-6 sm:p-8">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-red-500 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-red-500 rounded-br-3xl"></div>

                {step === 'upload' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {isCompressing ? (
                      <>
                        {console.log('🎨 [RENDER] Rendering PortalResult with props:', {
                          isCompressing: true,
                          progress,
                          currentFile,
                          fileIndex,
                          totalFiles,
                          statusMessage,
                          statusMessageLength: statusMessage?.length
                        })}
                        <PortalResult
                          isCompressing={true}
                          progress={progress}
                          currentFile={currentFile}
                          fileIndex={fileIndex}
                          totalFiles={totalFiles}
                          statusMessage={statusMessage}
                          compressedBlob={null}
                          stats={null}
                          onReset={handleReset}
                        />
                      </>
                    ) : (
                      <FolderUpload
                        onFilesSelect={handleFilesSelect}
                        isProcessing={isCompressing}
                      />
                    )}
                  </motion.div>
                )}

                {step === 'result' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <PortalResult
                      isCompressing={false}
                      progress={100}
                      currentFile=""
                      fileIndex={totalFiles}
                      totalFiles={totalFiles}
                      statusMessage=""
                      compressedBlob={compressedBlob}
                      stats={stats}
                      onReset={handleReset}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Supported Formats Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Supported File Types
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { type: 'PDF', color: 'bg-red-100 text-red-700' },
                  { type: 'DOCX', color: 'bg-blue-100 text-blue-700' },
                  { type: 'PPTX', color: 'bg-orange-100 text-orange-700' },
                  { type: 'XLSX', color: 'bg-green-100 text-green-700' },
                  { type: 'JPG/JPEG', color: 'bg-purple-100 text-purple-700' },
                  { type: 'PNG', color: 'bg-pink-100 text-pink-700' },
                  { type: 'WEBP', color: 'bg-indigo-100 text-indigo-700' },
                  { type: 'Others*', color: 'bg-gray-100 text-gray-700' },
                ].map((format) => (
                  <div
                    key={format.type}
                    className={`${format.color} rounded-xl p-4 text-center font-medium`}
                  >
                    {format.type}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                * Unsupported file types will be included in the ZIP without compression
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Portals;
