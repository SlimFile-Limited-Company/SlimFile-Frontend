import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCw, Trophy, Zap, File, FileImage, FileArchive, FileText, FileVideo, FileAudio, Star, Sparkles, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

type FileType = 'image' | 'pdf' | 'ppt' | 'video';
type PowerUpType = 'super-compress' | 'slow-motion' | 'point-multiplier' | 'time-freeze' | 'auto-compress' | 'shield';

interface LevelConfig {
  level: number;
  speed: number;
  spawnRate: number;
  bossChance: number;
  pointsMultiplier: number;
  filesToNextLevel: number;
  bossHealth: number;
}

interface ComboState {
  count: number;
  multiplier: number;
  lastComboTime: number;
  maxMultiplier: number;
}

interface GameStats {
  totalFilesCompressed: number;
  totalBytesSaved: number;
  maxCombo: number;
  levelsCompleted: number;
  powerUpsCollected: number;
  lastPlayed: string | null;
  consecutiveDays: number;
}

interface MascotMessage {
  text: string;
  type: 'encouragement' | 'combo' | 'levelup' | 'warning' | 'celebration';
}

const LEVELS: LevelConfig[] = [
  { level: 1, speed: 1.0, spawnRate: 2000, bossChance: 0, pointsMultiplier: 1.0, filesToNextLevel: 10, bossHealth: 3 },
  { level: 2, speed: 1.2, spawnRate: 1800, bossChance: 0.1, pointsMultiplier: 1.2, filesToNextLevel: 15, bossHealth: 4 },
  { level: 3, speed: 1.4, spawnRate: 1600, bossChance: 0.15, pointsMultiplier: 1.4, filesToNextLevel: 20, bossHealth: 5 },
  { level: 4, speed: 1.6, spawnRate: 1400, bossChance: 0.2, pointsMultiplier: 1.6, filesToNextLevel: 25, bossHealth: 6 },
  { level: 5, speed: 1.8, spawnRate: 1200, bossChance: 0.25, pointsMultiplier: 2.0, filesToNextLevel: 30, bossHealth: 7 },
];

const COMBO_CONFIG = {
  COMBO_WINDOW: 2000,
  MULTIPLIER_THRESHOLDS: [3, 5, 8, 12],
  MAX_MULTIPLIER: 3,
};

const POWER_UP_CONFIG = {
  SPAWN_CHANCE: 0.15,
  DURATION: 10000,
  TYPES: ['slow-motion', 'point-multiplier', 'auto-compress', 'shield'] as const,
  EFFECTS: {
    'slow-motion': { speedMultiplier: 0.5, color: 'blue' },
    'point-multiplier': { multiplier: 2, color: 'gold' },
    'auto-compress': { autoCompressCount: 3, color: 'green' },
    'shield': { duration: 5000, color: 'purple' },
  },
};

const MASCOT_MESSAGES = {
  encouragement: [
    "You're doing great! 🎉",
    "Keep it up! 💪",
    "Awesome compression! 🌟",
    "You're a natural! 🚀",
    "Looking good! ✨",
    "Nice work! 👏",
  ],
  combo: [
    "Combo Master! 🔥",
    "Unstoppable! ⚡",
    "On fire! 🌟",
    "Amazing streak! 💫",
    "Can't be stopped! 🚀",
  ],
  levelup: [
    "Level Up! You're crushing it! 🎊",
    "New level unlocked! 🏆",
    "Leveling up like a pro! 🌟",
    "You're getting stronger! 💪",
  ],
  warning: [
    "Files piling up! ⚠️",
    "Stay focused! 👀",
    "Speed up! ⏱️",
    "Don't let them through! 🛡️",
  ],
  celebration: [
    "INCREDIBLE! 🎆",
    "LEGENDARY! 👑",
    "MASTER COMPRESSOR! 🏅",
    "ABSOLUTE CHAMPION! 🌟",
  ],
};

interface FileObject {
  id: number;
  type: FileType;
  size: number;
  x: number;
  y: number;
  speed: number;
  compressed: boolean;
  isBoss?: boolean;
  health?: number;
  points: number;
}

interface PowerUp {
  id: number;
  type: PowerUpType;
  x: number;
  y: number;
  active: boolean;
  duration: number;
  endTime?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

const FILE_TYPES: FileType[] = ['image', 'pdf', 'ppt', 'video'];
const FILE_ICONS = {
  image: <FileImage className="w-6 h-6" />,
  pdf: <FileText className="w-6 h-6" />,
  ppt: <FileText className="w-6 h-6" />,
  video: <FileVideo className="w-6 h-6" />,
};

const FILE_COLORS: Record<FileType, string> = {
  image: 'bg-blue-100 text-blue-600 border-blue-300',
  pdf: 'bg-red-100 text-red-600 border-red-300',
  ppt: 'bg-orange-100 text-orange-600 border-orange-300',
  video: 'bg-purple-100 text-purple-600 border-purple-300',
};

const POINTS = {
  COMPRESS: 10,
  COMBO: 5,
  LEVEL_UP: 100,
  BOSS_DEFEAT: 200,
  FILE_POINTS: {
    image: 10,
    pdf: 15,
    ppt: 20,
    video: 25,
  },
};

export default function SlimFileGame() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<PowerUp[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [combo, setCombo] = useState<ComboState>({
    count: 0,
    multiplier: 1,
    lastComboTime: 0,
    maxMultiplier: 1,
  });
  const [filesCompressed, setFilesCompressed] = useState(0);
  const [currentLevelConfig, setCurrentLevelConfig] = useState<LevelConfig>(LEVELS[0]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [pointMultiplier, setPointMultiplier] = useState(1);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [compressionProgress, setCompressionProgress] = useState<Record<number, number>>({});
  const [showComboText, setShowComboText] = useState(false);
  const [comboPosition, setComboPosition] = useState({ x: 0, y: 0 });
  const [showPowerUpNotification, setShowPowerUpNotification] = useState<{
    show: boolean;
    type: PowerUpType | null;
  }>({ show: false, type: null });
  const [maxCombo, setMaxCombo] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [mascotMessage, setMascotMessage] = useState<MascotMessage | null>(null);
  const [streak, setStreak] = useState(0);
  const [perfectCompressStreak, setPerfectCompressStreak] = useState(0);
  
  // Game stats
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    const savedStats = typeof window !== 'undefined' ? localStorage.getItem('slimfileGameStats') : null;
    return savedStats 
      ? JSON.parse(savedStats) 
      : {
          totalFilesCompressed: 0,
          totalBytesSaved: 0,
          maxCombo: 0,
          levelsCompleted: 0,
          powerUpsCollected: 0,
          lastPlayed: null,
          consecutiveDays: 0,
        };
  });
  
  // Refs
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const lastPowerUpTime = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const lastFileTimeRef = useRef<number>(0);
  const gameLoopIdRef = useRef<number>();
  const { toast } = useToast();

  // Show mascot message
  const showMascotMessage = (type: MascotMessage['type']) => {
    const messages = MASCOT_MESSAGES[type];
    const message = messages[Math.floor(Math.random() * messages.length)];
    setMascotMessage({ text: message, type });
    setTimeout(() => setMascotMessage(null), 3000);
  };

  // Load high score
  useEffect(() => {
    const savedHighScore = localStorage.getItem('slimfileGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('slimfileGameHighScore', score.toString());
    }
  }, [score, highScore]);

  // Update level config
  useEffect(() => {
    const newConfig = LEVELS.find(l => l.level === level) || LEVELS[0];
    setCurrentLevelConfig(newConfig);
    
    if (level > 1) {
      setShowLevelUp(true);
      showMascotMessage('levelup');
      setTimeout(() => setShowLevelUp(false), 2000);
      
      setGameStats(prev => {
        const newStats = {
          ...prev,
          levelsCompleted: Math.max(prev.levelsCompleted, level - 1),
        };
        localStorage.setItem('slimfileGameStats', JSON.stringify(newStats));
        return newStats;
      });
    }
  }, [level]);

  // Check for level up
  useEffect(() => {
    if (filesCompressed > 0 && filesCompressed % currentLevelConfig.filesToNextLevel === 0) {
      setLevel(prev => Math.min(prev + 1, LEVELS.length));
    }
  }, [filesCompressed, currentLevelConfig.filesToNextLevel]);

  // Update combo multiplier
  const updateComboMultiplier = (comboCount: number): number => {
    const { MULTIPLIER_THRESHOLDS, MAX_MULTIPLIER } = COMBO_CONFIG;
    for (let i = 0; i < MULTIPLIER_THRESHOLDS.length; i++) {
      if (comboCount < MULTIPLIER_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return MAX_MULTIPLIER;
  };

  // Add to combo
  const addToCombo = (x: number, y: number) => {
    const now = Date.now();
    const timeSinceLastCombo = now - combo.lastComboTime;
    
    let newCount = timeSinceLastCombo < COMBO_CONFIG.COMBO_WINDOW ? combo.count + 1 : 1;
    const newMultiplier = updateComboMultiplier(newCount);
    
    setCombo({
      count: newCount,
      multiplier: newMultiplier,
      lastComboTime: now,
      maxMultiplier: Math.max(combo.maxMultiplier, newMultiplier),
    });
    
    if (newCount > 1) {
      setComboPosition({ x, y });
      setShowComboText(true);
      setTimeout(() => setShowComboText(false), 1000);
    }
    
    if (newCount === 5 || newCount === 10 || newCount === 20) {
      showMascotMessage('combo');
    }
    
    if (newCount > gameStats.maxCombo) {
      setGameStats(prev => ({
        ...prev,
        maxCombo: newCount,
      }));
    }
  };

  // Reset combo
  useEffect(() => {
    if (combo.count === 0) return;
    
    const timer = setTimeout(() => {
      const timeSinceLastCombo = Date.now() - combo.lastComboTime;
      if (timeSinceLastCombo >= COMBO_CONFIG.COMBO_WINDOW) {
        setCombo(prev => ({
          ...prev,
          count: 0,
          multiplier: 1,
        }));
      }
    }, COMBO_CONFIG.COMBO_WINDOW);
    
    return () => clearTimeout(timer);
  }, [combo.count, combo.lastComboTime]);

  // Spawn power-up
  const spawnPowerUp = (x: number, y: number) => {
    if (Math.random() > POWER_UP_CONFIG.SPAWN_CHANCE) return;
    
    const powerUpType = POWER_UP_CONFIG.TYPES[
      Math.floor(Math.random() * POWER_UP_CONFIG.TYPES.length)
    ] as PowerUpType;
    
    const newPowerUp: PowerUp = {
      id: Date.now(),
      type: powerUpType,
      x,
      y,
      active: false,
      duration: POWER_UP_CONFIG.DURATION,
    };
    
    setActivePowerUps(prev => [...prev, newPowerUp]);
  };

  const spawnRandomPowerUp = () => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    
    const powerUpType = POWER_UP_CONFIG.TYPES[
      Math.floor(Math.random() * POWER_UP_CONFIG.TYPES.length)
    ] as PowerUpType;
    
    const newPowerUp: PowerUp = {
      id: Date.now(),
      type: powerUpType,
      x: Math.random() * (gameArea.clientWidth - 40),
      y: -40,
      active: false,
      duration: POWER_UP_CONFIG.DURATION,
    };
    
    setActivePowerUps(prev => [...prev, newPowerUp]);
  };

  // Activate power-up
  const activatePowerUp = (powerUp: PowerUp) => {
    const now = Date.now();
    
    if (now - lastPowerUpTime.current < 2000) return;
    lastPowerUpTime.current = now;
    
    setGameStats(prev => ({
      ...prev,
      powerUpsCollected: prev.powerUpsCollected + 1,
    }));
    
    switch (powerUp.type) {
      case 'slow-motion':
        setGameSpeed(POWER_UP_CONFIG.EFFECTS['slow-motion'].speedMultiplier);
        setTimeout(() => setGameSpeed(1), POWER_UP_CONFIG.DURATION);
        break;
        
      case 'point-multiplier':
        const { multiplier } = POWER_UP_CONFIG.EFFECTS['point-multiplier'];
        setPointMultiplier(multiplier);
        setTimeout(() => setPointMultiplier(1), POWER_UP_CONFIG.DURATION);
        break;
        
      case 'auto-compress':
        const { autoCompressCount } = POWER_UP_CONFIG.EFFECTS['auto-compress'];
        let compressed = 0;
        const autoCompressInterval = setInterval(() => {
          if (compressed >= autoCompressCount) {
            clearInterval(autoCompressInterval);
            return;
          }
          
          setFiles(prevFiles => {
            const uncompressedFiles = prevFiles.filter(f => !f.compressed);
            if (uncompressedFiles.length === 0) return prevFiles;
            
            const fileToCompress = uncompressedFiles[0];
            compressed++;
            return prevFiles.map(f => 
              f.id === fileToCompress.id ? { ...f, compressed: true } : f
            );
          });
        }, 500);
        
        setTimeout(() => clearInterval(autoCompressInterval), POWER_UP_CONFIG.DURATION);
        break;
        
      case 'super-compress':
        setFiles(prev => 
          prev.map(file => {
            if (!file.compressed) {
              createParticles(file.x, file.y, getFileColor(file.type));
              return { ...file, compressed: true, size: Math.floor(file.size * 0.3) };
            }
            return file;
          })
        );
        break;
        
      case 'shield':
        break;
    }
    
    setShowPowerUpNotification({
      type: powerUp.type,
      show: true
    });
    
    setTimeout(() => {
      setShowPowerUpNotification(prev => ({ ...prev, show: false }));
    }, 2000);
    
    setActivePowerUps(prev => prev.filter(p => p.id !== powerUp.id));
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    let lastTime = performance.now();
    let fileSpawnTimer = 0;
    let powerUpSpawnTimer = 0;
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const updatePowerUps = () => {
      setActivePowerUps(prev => {
        const now = Date.now();
        const updated = prev.filter(powerUp => {
          if (powerUp.endTime && powerUp.endTime < now) {
            if (powerUp.type === 'point-multiplier') setPointMultiplier(1);
            if (powerUp.type === 'slow-motion') setGameSpeed(1);
            return false;
          }
          return true;
        });
        return updated;
      });
    };

    const updateParticles = (deltaTime: number) => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.velocity.x * deltaTime * 0.05,
            y: particle.y + particle.velocity.y * deltaTime * 0.05,
            life: particle.life - deltaTime * 0.05,
          }))
          .filter(particle => particle.life > 0)
      );
    };

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      setFiles(prevFiles => {
        const updatedFiles = prevFiles.map(file => {
          if (file.compressed) return file;
          
          const currentSpeed = file.speed * gameSpeed;
          const newY = file.y + currentSpeed;
          
          if (newY > gameArea.clientHeight - 60) {
            if (!file.isBoss) {
              setGameOver(true);
            }
            return file;
          }
          
          return { ...file, y: newY };
        });
        
        return updatedFiles.filter(file => !(file.compressed && file.y < -50));
      });

      fileSpawnTimer += deltaTime;
      powerUpSpawnTimer += deltaTime;
      
      const spawnInterval = Math.max(500, 2000 - (level * 100));
      
      if (fileSpawnTimer > spawnInterval) {
        spawnFile();
        fileSpawnTimer = 0;
      }
      
      if (powerUpSpawnTimer > 10000 && Math.random() < 0.2) {
        spawnRandomPowerUp();
        powerUpSpawnTimer = 0;
      }
      
      updatePowerUps();
      updateParticles(deltaTime);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameOver, isPaused, level, gameSpeed]);

  const createParticles = (x: number, y: number, color: string, count: number = 10, text?: string) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      size: Math.random() * 3 + 1,
      color,
      velocity: {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8
      },
      life: 1,
      maxLife: Math.random() * 2 + 1,
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const compressFile = (file: FileObject) => {
    if (file.compressed || isPaused) return;

    if (file.isBoss && file.health !== undefined) {
      const newHealth = (file.health || 1) - 1;
      
      if (newHealth <= 0) {
        createParticles(file.x, file.y, 'rgba(220, 38, 38, 0.8)', 20);
        
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, compressed: true, size: Math.floor(f.size * 0.3) } 
              : f
          )
        );
        
        addToCombo(file.x, file.y);
        setFilesCompressed(prev => prev + 1);
        setGameStats(prev => ({
          ...prev,
          totalFilesCompressed: prev.totalFilesCompressed + 1,
          totalBytesSaved: prev.totalBytesSaved + file.size,
        }));
        
        const points = POINTS.BOSS_DEFEAT * pointMultiplier;
        addScore(points);
        createParticles(file.x, file.y, '#10B981', 10, `+${points}`);
        showMascotMessage('celebration');
        
        if (Math.random() < POWER_UP_CONFIG.SPAWN_CHANCE) {
          spawnPowerUp(file.x, file.y);
        }
        
      } else {
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, health: newHealth } 
              : f
          )
        );
        
        createParticles(file.x, file.y, '#F59E0B', 5);
      }
      
      return;
    }
    
    setFiles(prevFiles => 
      prevFiles.map(f => 
        f.id === file.id ? { ...f, compressed: true, size: Math.floor(f.size * 0.3) } : f
      )
    );

    createParticles(file.x, file.y, getFileColor(file.type));
    addToCombo(file.x, file.y);
    setFilesCompressed(prev => prev + 1);
    setGameStats(prev => ({
      ...prev,
      totalFilesCompressed: prev.totalFilesCompressed + 1,
      totalBytesSaved: prev.totalBytesSaved + file.size,
    }));

    addScore(POINTS.FILE_POINTS[file.type]);

    if (Math.random() < POWER_UP_CONFIG.SPAWN_CHANCE) {
      spawnPowerUp(file.x, file.y);
    }
    
    if (combo.count > 0 && combo.count % 5 === 0) {
      showMascotMessage('encouragement');
    }
    
    if (combo.count > 3) {
      toast({
        title: `Combo x${combo.count}!`,
        description: `+${POINTS.COMPRESS * combo.multiplier * pointMultiplier * currentLevelConfig.pointsMultiplier} points!`,
        variant: "default",
      });
    }
  };

  const addScore = (basePoints: number) => {
    const points = Math.floor(basePoints * combo.multiplier * pointMultiplier * currentLevelConfig.pointsMultiplier);
    setScore(prev => prev + points);
    
    createParticles(
      window.innerWidth / 2, 
      100, 
      '#10B981', 
      Math.min(10, points / 10),
      `+${points}`
    );
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setFilesCompressed(0);
    setCombo({
      count: 0,
      multiplier: 1,
      lastComboTime: 0,
      maxMultiplier: 1,
    });
    setCurrentLevelConfig(LEVELS[0]);
    setActivePowerUps([]);
    setPointMultiplier(1);
    setGameSpeed(1);
    setFiles([]);
    setParticles([]);
    setCompressionProgress({});
    setStreak(0);
    setPerfectCompressStreak(0);
    lastFileTimeRef.current = performance.now();
    showMascotMessage('encouragement');
  };
  
  const togglePause = () => {
    const newPauseState = !isPaused;
    setIsPaused(newPauseState);
    setShowPauseMenu(newPauseState);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setIsPaused(false);
    setShowPauseMenu(false);
  };

  const getFileColor = (type: FileType) => {
    const colors = {
      'image': '#3B82F6',
      'pdf': '#EF4444',
      'ppt': '#F97316',
      'video': '#8B5CF6'
    };
    return colors[type] || '#6B7280';
  };

  const spawnFile = () => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const isBoss = Math.random() < currentLevelConfig.bossChance;
    const type = FILE_TYPES[Math.floor(Math.random() * FILE_TYPES.length)];
    const size = isBoss 
      ? Math.floor(Math.random() * 100) + 150
      : Math.floor(Math.random() * 50) + 50;
      
    const x = Math.random() * (gameArea.clientWidth - 60);
    const baseSpeed = currentLevelConfig.speed;
    const speed = isBoss ? baseSpeed * 0.7 : baseSpeed;
    
    const newFile: FileObject = {
      id: Date.now() + Math.random(),
      type,
      size,
      x,
      y: -60,
      speed,
      compressed: false,
      isBoss,
      health: isBoss ? currentLevelConfig.bossHealth : undefined,
      points: isBoss ? POINTS.BOSS_DEFEAT : POINTS.FILE_POINTS[type]
    };

    setFiles(prev => [...prev, newFile]);
  };

  const handleFileClick = (file: FileObject) => {
    compressFile(file);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 py-4 px-2 sm:px-4 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-200 to-red-200 rounded-full opacity-20 blur-xl"
        />
      </div>

      {/* Mascot with Messages */}
      <AnimatePresence>
        {mascotMessage && (
          <motion.div
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -20 }}
            className="fixed top-20 sm:top-24 right-4 z-50 flex items-center gap-2 bg-white rounded-full shadow-2xl px-4 py-2 border-2 border-purple-300"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
              }}
              className="text-4xl"
            >
              😊
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-purple-600 text-sm">{mascotMessage.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white px-8 py-4 rounded-full text-4xl font-bold shadow-2xl"
            >
              <Sparkles className="inline mr-2" />
              Level {level}!
              <Sparkles className="inline ml-2" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Menu */}
      {showPauseMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">Game Paused</h2>
            <div className="space-y-4">
              <Button 
                onClick={togglePause}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Resume Game
              </Button>
              <Button 
                onClick={resetGame}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Exit to Menu
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Power-up Notification */}
      <AnimatePresence>
        {showPowerUpNotification.show && showPowerUpNotification.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 sm:top-28 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg rounded-full px-6 py-3 z-50 flex items-center gap-2"
          >
            <span className="font-bold text-white text-sm sm:text-base">
              {showPowerUpNotification.type === 'point-multiplier' && '⭐ 2x Points!'}
              {showPowerUpNotification.type === 'slow-motion' && '🐢 Slow Motion!'}
              {showPowerUpNotification.type === 'super-compress' && '💥 Super Compress!'}
              {showPowerUpNotification.type === 'auto-compress' && '⚡ Auto Compress!'}
              {showPowerUpNotification.type === 'shield' && '🛡️ Shield Active!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-4 sm:mb-8 pt-16 sm:pt-20"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-4">
            SlimFile Hero
          </h1>
          <p className="text-base sm:text-lg text-gray-700 px-4 sm:px-6 py-2 bg-white/50 rounded-full inline-block shadow-sm">Compress files before they hit the ground! 🎯</p>
          
          {/* Active Power-ups */}
          {activePowerUps.filter(p => p.active || p.endTime).length > 0 && (
            <div className="flex justify-center gap-2 sm:gap-3 mt-4 flex-wrap px-2">
              {activePowerUps.filter(p => p.active || p.endTime).map(powerUp => (
                <motion.div
                  key={powerUp.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-md border-2 border-purple-200 flex items-center gap-1"
                >
                  {powerUp.type === 'point-multiplier' && (
                    <span className="text-yellow-600">⭐ 2x Points</span>
                  )}
                  {powerUp.type === 'slow-motion' && (
                    <span className="text-blue-600">🐢 Slow</span>
                  )}
                  {powerUp.type === 'super-compress' && (
                    <span className="text-purple-600">💥 Super</span>
                  )}
                  {powerUp.type === 'auto-compress' && (
                    <span className="text-green-600">⚡ Auto</span>
                  )}
                  {powerUp.endTime && (
                    <div className="w-8 sm:w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                        animate={{
                          width: `${((powerUp.endTime - Date.now()) / 10000) * 100}%`
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6 px-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{score}</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-white to-yellow-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">High Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold flex items-center gap-1 text-yellow-600">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                  {highScore}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{level}</div>
                <Progress 
                  value={(filesCompressed % currentLevelConfig.filesToNextLevel) / currentLevelConfig.filesToNextLevel * 100} 
                  className="h-1 mt-1"
                />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Combo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold flex items-center gap-1 text-pink-600">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                  {combo.count}x
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Game Area */}
        <div 
          ref={gameAreaRef}
          className="relative w-full h-[65vh] sm:h-[70vh] bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 rounded-xl shadow-2xl border-4 border-purple-300 overflow-hidden"
          onClick={(e) => {
            if (!gameStarted && !gameOver) {
              startGame();
            }
          }}
        >
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white z-10 p-4 sm:p-6 text-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="text-6xl sm:text-8xl mb-4"
                >
                  😊
                </motion.div>
                
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                    Ready to Compress?
                  </h2>
                  <p className="text-base sm:text-xl mb-6 text-gray-200">
                    Tap files to compress them! ⚡
                  </p>
                </div>
                
                <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="flex items-start gap-3 mb-3 sm:mb-4">
                    <div className="p-2 bg-yellow-500/20 rounded-full">
                      <Target className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-400" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-yellow-400 text-sm sm:text-base">Quick Start</h4>
                      <p className="text-xs sm:text-sm text-gray-300">Tap files to compress and score!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-full">
                      <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-purple-400 text-sm sm:text-base">High Score</h4>
                      <p className="text-xs sm:text-sm text-gray-300">Your best: {highScore} points</p>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold py-4 sm:py-6 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 mx-auto"
                  onClick={startGame}
                >
                  <Play className="h-5 w-5 sm:h-6 sm:w-6" /> Start Game
                </Button>
                
                <p className="mt-4 text-xs sm:text-sm text-gray-400">
                  Tap anywhere or press the button to begin
                </p>
              </motion.div>
            </div>
          )}
          
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white z-10 p-4 sm:p-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center max-w-md"
              >
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  className="text-5xl sm:text-7xl mb-4"
                >
                  😢
                </motion.div>
                
                <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                  Game Over!
                </h2>
                <div className="text-2xl sm:text-3xl font-bold mb-2">Score: {score}</div>
                <div className="text-lg sm:text-xl mb-2">High Score: {highScore}</div>
                <div className="text-base sm:text-lg mb-6">
                  Level: {level} | Max Combo: {combo.maxMultiplier}x
                </div>
                
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 flex items-center gap-2 w-full sm:w-auto"
                    onClick={startGame}
                  >
                    <RotateCw className="h-5 w-5" /> Play Again
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-white text-purple-600 border-purple-600 hover:bg-purple-50 w-full sm:w-auto"
                    onClick={resetGame}
                  >
                    Main Menu
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Power-ups */}
          <AnimatePresence>
            {activePowerUps
              .filter(powerUp => !powerUp.active && !powerUp.endTime)
              .map(powerUp => (
                <motion.div
                  key={powerUp.id}
                  className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xs shadow-lg cursor-pointer z-10 border-2 border-white"
                  style={{
                    left: powerUp.x,
                    top: powerUp.y,
                  }}
                  initial={{ y: -50, opacity: 0, scale: 0.8 }}
                  animate={{ 
                    y: powerUp.y,
                    opacity: 1,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    scale: {
                      duration: 1,
                      repeat: Infinity,
                    }
                  }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    activatePowerUp(powerUp);
                  }}
                  whileTap={{ scale: 0.8 }}
                >
                  {powerUp.type === 'point-multiplier' && '⭐'}
                  {powerUp.type === 'slow-motion' && '🐢'}
                  {powerUp.type === 'super-compress' && '💥'}
                  {powerUp.type === 'auto-compress' && '⚡'}
                  {powerUp.type === 'shield' && '🛡️'}
                </motion.div>
              ))}
          </AnimatePresence>
          
          {/* Game elements */}
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                className={`absolute w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                  file.compressed 
                    ? 'opacity-50 scale-90' 
                    : 'hover:scale-110 shadow-lg hover:shadow-xl'
                } ${FILE_COLORS[file.type]} ${file.isBoss ? 'border-4 border-red-500' : ''}`}
                style={{
                  left: `${file.x}px`,
                  top: `${file.y}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileClick(file);
                }}
                initial={{ opacity: 0, y: -20, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  y: file.y,
                  scale: file.compressed ? 0.7 : 1,
                  rotate: file.compressed ? 180 : 0
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                whileTap={{ scale: 0.8 }}
              >
                <div className="flex items-center justify-center">
                  {FILE_ICONS[file.type]}
                </div>
                <div className="text-[10px] sm:text-xs font-bold mt-1">
                  {file.size}MB
                </div>
                
                {file.isBoss && file.health && file.health > 0 && (
                  <div className="absolute -top-2 left-0 right-0 flex justify-center gap-0.5 sm:gap-1">
                    {Array.from({ length: file.health }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full border border-white"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Particles */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Game Controls */}
        <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-4 items-center px-2">
          {gameStarted && !gameOver && (
            <>
              <Button 
                variant="outline" 
                onClick={togglePause}
                className="flex items-center gap-2 border-2 border-purple-300 hover:bg-purple-50"
                size="sm"
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setGameOver(true)}
                className="flex items-center gap-2 border-2 border-pink-300 hover:bg-pink-50"
                size="sm"
              >
                <RotateCw className="h-4 w-4" />
                <span className="hidden sm:inline">Restart</span>
              </Button>
            </>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-2 border-2 border-blue-300 hover:bg-blue-50"
            size="sm"
          >
            <File className="h-4 w-4" />
            <span className="hidden sm:inline">How to Play</span>
          </Button>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  How to Play SlimFile Hero 🎮
                </CardTitle>
                <CardDescription>
                  Master the art of file compression!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm sm:text-base">
                <div className="space-y-2">
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Gameplay
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Tap falling files to compress them</li>
                    <li>Build combos for bonus points</li>
                    <li>Collect power-ups for special abilities</li>
                    <li>Watch out for boss files (need multiple taps!)</li>
                    <li>Don't let files reach the bottom!</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Scoring
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span>Image:</span>
                      <span className="font-mono font-bold">+{POINTS.FILE_POINTS.image} pts</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>PDF:</span>
                      <span className="font-mono font-bold">+{POINTS.FILE_POINTS.pdf} pts</span>
                    </div>
                    <div className="flex justify-between p-2 bg-orange-50 rounded">
                      <span>PPT:</span>
                      <span className="font-mono font-bold">+{POINTS.FILE_POINTS.ppt} pts</span>
                    </div>
                    <div className="flex justify-between p-2 bg-purple-50 rounded">
                      <span>Video:</span>
                      <span className="font-mono font-bold">+{POINTS.FILE_POINTS.video} pts</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Power-Ups
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                      <span className="text-xl">⭐</span>
                      <span className="text-sm">2x Points</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <span className="text-xl">🐢</span>
                      <span className="text-sm">Slow Motion</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                      <span className="text-xl">💥</span>
                      <span className="text-sm">Super Compress</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <span className="text-xl">⚡</span>
                      <span className="text-sm">Auto Compress</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => setShowTutorial(false)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Let's Play! 🚀
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}