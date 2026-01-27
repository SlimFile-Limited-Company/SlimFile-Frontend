import { useState, useRef, useEffect } from "react";
import { Download, CheckCircle, RotateCcw, FileText, Archive, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { playSuccessSound } from "@/utils/sound";

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

interface PortalResultProps {
  isCompressing: boolean;
  progress: number;
  currentFile: string;
  fileIndex: number;
  totalFiles: number;
  statusMessage?: string;
  compressedBlob: Blob | null;
  stats: CompressionStats | null;
  onReset: () => void;
}

export const PortalResult = ({
  isCompressing,
  progress,
  currentFile,
  fileIndex,
  totalFiles,
  statusMessage,
  compressedBlob,
  stats,
  onReset,
}: PortalResultProps) => {
  console.log('📦 [PORTAL RESULT] Component received props:', {
    isCompressing,
    progress,
    currentFile,
    fileIndex,
    totalFiles,
    statusMessage,
    statusMessageLength: statusMessage?.length,
    hasStatusMessage: !!statusMessage
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Play sound and trigger confetti when compression is complete
  useEffect(() => {
    if (!isCompressing && stats && !hasPlayedSound) {
      playSuccessSound();
      setHasPlayedSound(true);
      triggerConfetti();
    }
  }, [isCompressing, stats, hasPlayedSound]);

  // Confetti animation
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces: Array<{
      x: number;
      y: number;
      rotation: number;
      rotationSpeed: number;
      speed: number;
      color: string;
      width: number;
      height: number;
      velocityX: number;
      velocityY: number;
    }> = [];

    const colors = ['#ef4444', '#f97316', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    const confettiCount = 200;

    for (let i = 0; i < confettiCount; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        speed: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() * 10 + 5,
        height: Math.random() * 10 + 5,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: Math.random() * 3 + 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.forEach((piece, index) => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        ctx.restore();

        piece.y += piece.velocityY;
        piece.x += piece.velocityX;
        piece.rotation += piece.rotationSpeed;
        piece.velocityY += 0.1;

        if (piece.y > canvas.height) {
          confettiPieces.splice(index, 1);
        }
      });

      if (confettiPieces.length > 0) {
        requestAnimationFrame(animate);
      } else {
        canvas.style.display = 'none';
      }
    };

    canvas.style.display = 'block';
    animate();
  };

  const handleDownload = () => {
    if (!compressedBlob) return;

    setIsDownloading(true);
    try {
      const url = URL.createObjectURL(compressedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slimfile_compressed_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setHasPlayedSound(false);
    onReset();
  };

  // Compressing state
  if (isCompressing) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Card className="bg-white shadow-xl border border-gray-100">
          <CardContent className="p-8">
            <div className="text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Archive className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Compressing Your Files
              </h3>
              <p className="text-gray-600 mb-6">
                Processing file {fileIndex} of {totalFiles}
              </p>

              <div className="mb-4">
                <Progress value={progress} className="h-3" />
              </div>

              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>{progress}% complete</span>
                <span>{totalFiles - fileIndex} files remaining</span>
              </div>

              {/* Show detailed status message if available */}
              {console.log('📦 [PORTAL RESULT] Evaluating statusMessage:', statusMessage, 'Truthy?', !!statusMessage)}
              {statusMessage && (
                <>
                  {console.log('📦 [PORTAL RESULT] ✅ RENDERING STATUS MESSAGE BANNER:', statusMessage)}
                  <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
                    <p className="text-sm text-blue-900 font-medium text-center">
                      {statusMessage}
                    </p>
                  </div>
                </>
              )}

              {console.log('📦 [PORTAL RESULT] Evaluating currentFile fallback. currentFile:', currentFile, 'statusMessage:', statusMessage, 'Will show?', currentFile && !statusMessage)}
              {currentFile && !statusMessage && (
                <>
                  {console.log('📦 [PORTAL RESULT] ⚠️ RENDERING CURRENT FILE FALLBACK (no statusMessage):', currentFile)}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-700 truncate max-w-md">
                        {currentFile}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completed state - show if we have stats OR blob
  if (stats || compressedBlob) {
    // Use stats if available, otherwise create default stats
    const displayStats = stats || {
      totalFiles: totalFiles,
      compressedFiles: totalFiles,
      skippedFiles: 0,
      failedFiles: 0,
      originalSize: 0,
      compressedSize: compressedBlob?.size || 0,
      spaceSaved: 0,
      compressionRatio: 0
    };

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Confetti Canvas */}
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
          style={{ display: 'none' }}
        />

        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Compression Complete!
              </h2>
              <p className="text-gray-600">
                Your files have been compressed and packaged into a ZIP file
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{displayStats.totalFiles}</p>
              <p className="text-sm text-gray-500">Files Processed</p>
              <div className="mt-2 text-xs text-gray-400">
                {displayStats.compressedFiles} compressed, {displayStats.skippedFiles} passed through
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{displayStats.compressionRatio}%</p>
              <p className="text-sm text-gray-500">Size Reduction</p>
              <div className="mt-2 text-xs text-gray-400">
                {formatFileSize(displayStats.originalSize)} → {formatFileSize(displayStats.compressedSize)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Archive className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{formatFileSize(displayStats.spaceSaved)}</p>
              <p className="text-sm text-gray-500">Space Saved</p>
              <div className="mt-2 text-xs text-gray-400">
                ZIP size: {formatFileSize(compressedBlob?.size || displayStats.compressedSize)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Size Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Size Comparison
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Original Size</div>
                  <div className="h-8 bg-gray-200 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-400 rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                      {formatFileSize(displayStats.originalSize)}
                    </div>
                  </div>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Compressed Size</div>
                  <div className="h-8 bg-gray-200 rounded-lg relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg transition-all duration-1000"
                      style={{ width: `${100 - displayStats.compressionRatio}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                      {formatFileSize(displayStats.compressedSize)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {compressedBlob ? (
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-6 text-lg font-semibold"
            >
              {isDownloading ? (
                <>
                  <motion.div
                    className="h-5 w-5 border-2 border-white border-r-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Compressed ZIP
                </>
              )}
            </Button>
          ) : (
            <Card className="flex-1 bg-green-50 border border-green-200">
              <CardContent className="p-4 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">Download started automatically</span>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleReset}
            variant="outline"
            className={`${compressedBlob ? 'flex-1' : 'w-full'} border-gray-300 text-gray-700 hover:bg-gray-50 py-6 text-lg`}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Compress Another Folder
          </Button>
        </motion.div>
      </div>
    );
  }

  return null;
};
