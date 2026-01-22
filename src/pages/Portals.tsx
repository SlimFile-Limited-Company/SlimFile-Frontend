import { useState, useEffect } from "react";
import { FolderUpload } from "@/components/FolderUpload";
import { PortalResult } from "@/components/PortalResult";
import { toast } from "@/hooks/use-toast";
import { Building2, GraduationCap, Folder, Shield, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { io, Socket } from "socket.io-client";

interface University {
  id: string;
  name: string;
  email: string;
  contactPerson?: string;
  totalFilesCompressed: number;
  totalSpaceSaved: number;
  sessionCount: number;
}

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
  const [step, setStep] = useState<'register' | 'upload' | 'result'>('register');
  const [university, setUniversity] = useState<University | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [fileIndex, setFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [stats, setStats] = useState<CompressionStats | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Form state
  const [universityName, setUniversityName] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected for portal updates');
    });

    newSocket.on('portalProgress', (data) => {
      if (data.status === 'processing') {
        setProgress(data.percentComplete);
        setCurrentFile(data.currentFile);
        setFileIndex(data.fileIndex);
        setTotalFiles(data.totalFiles);
      } else if (data.status === 'complete') {
        setProgress(100);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!universityName.trim() || !email.trim()) {
      toast({
        title: "Required Fields",
        description: "Please enter university name and email.",
        variant: "destructive"
      });
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch(`${API_BASE_URL}/portals/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: universityName.trim(),
          email: email.trim(),
          contactPerson: contactPerson.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUniversity(data.university);

      if (data.isReturning) {
        toast({
          title: `Welcome back, ${data.university.name}!`,
          description: `You've compressed ${data.university.totalFilesCompressed} files so far.`,
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "You can now upload folders for compression.",
        });
      }

      setStep('upload');
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleFilesSelect = async (files: File[]) => {
    if (files.length === 0) return;

    setIsCompressing(true);
    setProgress(0);
    setCurrentFile('');
    setFileIndex(0);
    setTotalFiles(files.length);
    setCompressedBlob(null);
    setStats(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    if (university) {
      formData.append('universityId', university.id);
    }

    const sessionId = `session_${Date.now()}`;
    formData.append('sessionId', sessionId);

    try {
      // Simulate initial progress while uploading
      let uploadProgress = 0;
      const progressInterval = setInterval(() => {
        uploadProgress += Math.random() * 5;
        if (uploadProgress < 30) {
          setProgress(Math.floor(uploadProgress));
        }
      }, 200);

      const response = await fetch(`${API_BASE_URL}/portals/compress`, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Compression failed');
      }

      // Get stats from header
      const statsHeader = response.headers.get('X-Compression-Stats');
      if (statsHeader) {
        try {
          const parsedStats = JSON.parse(statsHeader);
          setStats(parsedStats);
        } catch (e) {
          console.error('Failed to parse stats header:', e);
        }
      }

      const blob = await response.blob();
      setCompressedBlob(blob);
      setProgress(100);
      setStep('result');

      toast({
        title: "Compression Complete!",
        description: `${files.length} files have been compressed.`,
      });
    } catch (err: any) {
      toast({
        title: "Compression Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
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
                  <GraduationCap className="w-4 h-4" />
                  University Portal
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-gray-900 mb-2">
                    Compress Entire Folders
                  </span>
                  <span className="block bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                    For Universities
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
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-4 mb-12">
                {[
                  { key: 'register', label: 'Register', icon: Building2 },
                  { key: 'upload', label: 'Upload', icon: Folder },
                  { key: 'result', label: 'Download', icon: CheckCircle2 },
                ].map((s, idx) => (
                  <div key={s.key} className="flex items-center">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      step === s.key
                        ? 'bg-red-600 text-white'
                        : (step === 'upload' && s.key === 'register') || (step === 'result' && s.key !== 'result')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                    }`}>
                      <s.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{s.label}</span>
                    </div>
                    {idx < 2 && (
                      <ArrowRight className="w-4 h-4 text-gray-300 mx-2" />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="relative bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-6 sm:p-8">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-red-500 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-red-500 rounded-br-3xl"></div>

                {step === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="max-w-md mx-auto">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          University Registration
                        </h2>
                        <p className="text-gray-600">
                          Enter your university details to get started
                        </p>
                      </div>

                      <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                          <Label htmlFor="universityName" className="text-gray-700">
                            University Name *
                          </Label>
                          <Input
                            id="universityName"
                            type="text"
                            value={universityName}
                            onChange={(e) => setUniversityName(e.target.value)}
                            placeholder="e.g., Stanford University"
                            className="mt-1"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-gray-700">
                            University Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., admin@university.edu"
                            className="mt-1"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="contactPerson" className="text-gray-700">
                            Contact Person (Optional)
                          </Label>
                          <Input
                            id="contactPerson"
                            type="text"
                            value={contactPerson}
                            onChange={(e) => setContactPerson(e.target.value)}
                            placeholder="e.g., John Smith"
                            className="mt-1"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isRegistering}
                          className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-4 text-lg font-semibold"
                        >
                          {isRegistering ? (
                            <>
                              <motion.div
                                className="h-5 w-5 border-2 border-white border-r-transparent rounded-full mr-2"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Registering...
                            </>
                          ) : (
                            <>
                              Continue to Upload
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {step === 'upload' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {university && (
                      <div className="text-center mb-6">
                        <Card className="inline-block bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
                          <CardContent className="py-3 px-6 flex items-center gap-3">
                            <GraduationCap className="w-5 h-5 text-red-600" />
                            <span className="font-medium text-gray-900">{university.name}</span>
                            {university.totalFilesCompressed > 0 && (
                              <span className="text-sm text-gray-500">
                                | {university.totalFilesCompressed} files compressed | {formatFileSize(university.totalSpaceSaved)} saved
                              </span>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {isCompressing ? (
                      <PortalResult
                        isCompressing={true}
                        progress={progress}
                        currentFile={currentFile}
                        fileIndex={fileIndex}
                        totalFiles={totalFiles}
                        compressedBlob={null}
                        stats={null}
                        onReset={handleReset}
                      />
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
