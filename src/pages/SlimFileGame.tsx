import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  FileImage, 
  FileText, 
  FileVideo, 
  Lock, 
  Check, 
  Zap, 
  Star, 
  RotateCw, 
  Trophy,
  Sparkles,
  Target,
  Heart,
  Frown,
  Smile,
  Laugh,
  Award,
  TrendingUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type FileType = 'image' | 'pdf' | 'ppt' | 'video';

interface PowerUp {
  type: 'row-blast' | 'column-blast' | 'bomb' | 'compression-burst';
  name: string;
  description: string;
  icon: JSX.Element;
  color: string;
  gradient: string;
}

type PowerUpType = PowerUp['type'];

interface LevelConfig {
  targetScore: number;
  moves: number;
  lockedFiles: number;
  speed: number;
  pointsMultiplier: number;
  targetCompressed: number;
}

interface GridCell {
  id: string;
  type: FileType;
  x: number;
  y: number;
  compressed: boolean;
  compressing: boolean;
  size: number;
  originalSize: number;
  points: number;
  isLocked: boolean;
  isMatched: boolean;
  isPowerUp: boolean;
  powerUpType?: PowerUpType;
}

interface GameState {
  grid: (GridCell | null)[][];
  score: number;
  movesLeft: number;
  level: number;
  isGameOver: boolean;
  isLevelComplete: boolean;
  selectedCell: { x: number; y: number } | null;
  comboCount: number;
  totalCompressed: number;
  targetCompressed: number;
  powerUps: { type: PowerUpType; count: number }[];
  compressionProgress: number;
  targetScore: number;
  activePowerUp: PowerUpType | null;
  streak: number;
}

interface FloatingScore {
  id: string;
  x: number;
  y: number;
  score: number;
  color: string;
}

// Game configuration - MADE HARDER
const GRID_SIZE = 8;
const LEVELS: LevelConfig[] = [
  { targetScore: 1500, moves: 20, lockedFiles: 8, speed: 1.0, pointsMultiplier: 1.0, targetCompressed: 12 },
  { targetScore: 3000, moves: 18, lockedFiles: 12, speed: 1.1, pointsMultiplier: 1.1, targetCompressed: 18 },
  { targetScore: 5500, moves: 16, lockedFiles: 16, speed: 1.2, pointsMultiplier: 1.2, targetCompressed: 24 },
  { targetScore: 9000, moves: 15, lockedFiles: 20, speed: 1.3, pointsMultiplier: 1.3, targetCompressed: 30 },
  { targetScore: 14000, moves: 14, lockedFiles: 24, speed: 1.4, pointsMultiplier: 1.4, targetCompressed: 36 },
  { targetScore: 20000, moves: 13, lockedFiles: 28, speed: 1.5, pointsMultiplier: 1.5, targetCompressed: 42 },
  { targetScore: 28000, moves: 12, lockedFiles: 32, speed: 1.6, pointsMultiplier: 1.6, targetCompressed: 48 },
  { targetScore: 38000, moves: 11, lockedFiles: 36, speed: 1.7, pointsMultiplier: 1.7, targetCompressed: 54 },
];

// File type configurations
const FILE_CONFIG = {
  image: { 
    name: 'Image', 
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-600',
    icon: <FileImage className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7" />,
    baseSize: 2000,
    compressedSize: 500,
    blastColor: '#3B82F6',
    gradient: 'from-blue-400 to-blue-600'
  },
  pdf: { 
    name: 'PDF', 
    color: 'bg-gradient-to-br from-red-400 to-red-600',
    borderColor: 'border-red-300',
    textColor: 'text-red-600',
    icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7" />,
    baseSize: 5000,
    compressedSize: 1000,
    blastColor: '#EF4444',
    gradient: 'from-red-400 to-red-600'
  },
  ppt: { 
    name: 'Presentation', 
    color: 'bg-gradient-to-br from-orange-400 to-orange-600',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-600',
    icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7" />,
    baseSize: 10000,
    compressedSize: 2500,
    blastColor: '#F97316',
    gradient: 'from-orange-400 to-orange-600'
  },
  video: { 
    name: 'Video', 
    color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-600',
    icon: <FileVideo className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7" />,
    baseSize: 50000,
    compressedSize: 10000,
    blastColor: '#8B5CF6',
    gradient: 'from-purple-400 to-purple-600'
  },
};

// Points system
const POINTS = {
  MATCH_3: 100,
  MATCH_4: 200,
  MATCH_5: 500,
  COMPRESSION: 50,
  POWER_UP: 150,
  COMBO_MULTIPLIER: 1.2,
  COMPRESS: 10,
  LEVEL_UP: 100,
  STREAK_BONUS: 25,
  
  FILE_POINTS: {
    image: 10,
    pdf: 15,
    ppt: 20,
    video: 25,
    audio: 30
  }
};

// Power-up configurations
const POWER_UPS: PowerUp[] = [
  { 
    type: 'row-blast', 
    name: 'Row Blast', 
    description: 'Clears an entire row',
    icon: <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">→</div>,
    color: 'bg-yellow-100 text-yellow-700',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  { 
    type: 'column-blast', 
    name: 'Column Blast', 
    description: 'Clears an entire column',
    icon: <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">↓</div>,
    color: 'bg-yellow-100 text-yellow-700',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  { 
    type: 'bomb', 
    name: 'Bomb', 
    description: 'Clears a 3x3 area',
    icon: <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-2xl shadow-lg">💣</div>,
    color: 'bg-red-100 text-red-700',
    gradient: 'from-red-500 to-red-700'
  },
  { 
    type: 'compression-burst', 
    name: 'Compression Burst', 
    description: 'Compresses all locked files',
    icon: <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-2xl shadow-lg">⚡</div>,
    color: 'bg-cyan-100 text-cyan-700',
    gradient: 'from-cyan-400 to-cyan-600'
  }
];

export default function SlimFileGame() {
  const { toast } = useToast();
  
  // Sound state
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Audio context for sound effects
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Sound effect functions
  const playSound = useCallback((type: 'select' | 'match' | 'powerup' | 'error' | 'complete' | 'gameover' | 'swap') => {
    if (!audioContextRef.current || !soundEnabled) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    switch (type) {
      case 'select':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
        break;
      
      case 'swap':
        oscillator.frequency.value = 400;
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
        
      case 'match':
        const frequencies = [523.25, 659.25, 783.99];
        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start(ctx.currentTime + i * 0.05);
          osc.stop(ctx.currentTime + 0.3 + i * 0.05);
        });
        return;
        
      case 'powerup':
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
        break;
        
      case 'error':
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
        gainNode.gain.value = 0.15;
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        break;
        
      case 'complete':
        const victoryNotes = [523.25, 659.25, 783.99, 1046.50];
        victoryNotes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3 + i * 0.1);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + 0.3 + i * 0.1);
        });
        return;
        
      case 'gameover':
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;
    }
  }, [soundEnabled]);
  
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    score: 0,
    movesLeft: 0,
    level: 1,
    isGameOver: false,
    isLevelComplete: false,
    selectedCell: null,
    comboCount: 0,
    totalCompressed: 0,
    targetCompressed: 0,
    powerUps: POWER_UPS.map(powerUp => ({ type: powerUp.type, count: 1 })),
    compressionProgress: 0,
    targetScore: 0,
    activePowerUp: null,
    streak: 0,
  });
  
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('slimfileMatch3HighScore') || '0', 10);
    }
    return 0;
  });
  
  const [isPaused, setIsPaused] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [compressionBlasts, setCompressionBlasts] = useState<Array<{x: number, y: number, color: string}>>([]);
  const [showAutoCompress, setShowAutoCompress] = useState(false);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{x: number, y: number} | null>(null);
  const [hasPlayerMoved, setHasPlayerMoved] = useState(false);
  const isDragging = useRef(false);

  // Show floating score
  const showFloatingScore = useCallback((x: number, y: number, score: number, color: string) => {
    const cellSize = window.innerWidth < 640 ? 40 : 56;
    const cellCenter = cellSize / 2;
    
    const floatingScore: FloatingScore = {
      id: `${Date.now()}-${x}-${y}`,
      x: x * cellSize + cellCenter,
      y: y * cellSize + cellCenter,
      score,
      color
    };
    
    setFloatingScores(prev => [...prev, floatingScore]);
    
    setTimeout(() => {
      setFloatingScores(prev => prev.filter(s => s.id !== floatingScore.id));
    }, 1000);
  }, []);

  // Minimal blast effect
  const createCompressionBlast = useCallback((x: number, y: number, color: string) => {
    const blast = { x, y, color };
    setCompressionBlasts(prev => [...prev, blast]);
    
    setTimeout(() => {
      setCompressionBlasts(prev => prev.filter(b => b !== blast));
    }, 300);
  }, []);

  // Minimal power-up effect
  const createPowerUpEffect = useCallback((x: number, y: number) => {
    const blast = { x, y, color: '#FFD700' };
    setCompressionBlasts(prev => [...prev, blast]);
    
    setTimeout(() => {
      setCompressionBlasts(prev => prev.filter(b => b !== blast));
    }, 300);
  }, []);

  // Initialize game
  const initGame = useCallback((levelIndex = 0) => {
    const levelConfig = LEVELS[levelIndex] || LEVELS[LEVELS.length - 1];
    const fileTypes = Object.keys(FILE_CONFIG) as FileType[];
    
    const newGrid: (GridCell | null)[][] = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      const row: (GridCell | null)[] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        const isLocked = Math.random() < (0.2 + levelIndex * 0.05);
        const fileConfig = FILE_CONFIG[fileType];
        
        row.push({
          id: `${x}-${y}-${Math.random()}`,
          type: fileType,
          x,
          y,
          compressed: false,
          compressing: false,
          size: fileConfig.baseSize,
          originalSize: fileConfig.baseSize,
          points: POINTS.FILE_POINTS[fileType] * levelConfig.pointsMultiplier,
          isLocked,
          isMatched: false,
          isPowerUp: false,
        });
      }
      newGrid.push(row);
    }
    
    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      score: 0,
      movesLeft: levelConfig.moves,
      level: levelIndex + 1,
      isGameOver: false,
      isLevelComplete: false,
      totalCompressed: 0,
      targetCompressed: levelConfig.targetCompressed,
      targetScore: levelConfig.targetScore,
      compressionProgress: 0,
      activePowerUp: null,
      streak: 0,
      powerUps: POWER_UPS.map(powerUp => ({ 
        type: powerUp.type, 
        count: Math.max(1, 2 - Math.floor(levelIndex / 2))
      })),
    }));
    setCompressionBlasts([]);
    setHasPlayerMoved(false);
  }, []);

  // Find and remove matches
  const findAndRemoveMatches = useCallback((grid: (GridCell | null)[][]) => {
    const matchedCells: Set<string> = new Set();
    let score = 0;
    let powerUpsEarned = 0;
    
    const gridCopy = grid.map(row => [...row]);
    
    // Check horizontal matches
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE - 2; x++) {
        const cell = gridCopy[y][x];
        if (!cell) continue;
        
        const type = cell.type;
        let matchLength = 1;
        
        while (x + matchLength < GRID_SIZE && gridCopy[y][x + matchLength]?.type === type) {
          matchLength++;
        }
        
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            matchedCells.add(`${x + i}-${y}`);
          }
          
          if (matchLength === 3) score += POINTS.MATCH_3;
          else if (matchLength === 4) {
            score += POINTS.MATCH_4;
            powerUpsEarned++;
          }
          else {
            score += POINTS.MATCH_5;
            powerUpsEarned += 2;
          }
        }
        
        x += matchLength - 1;
      }
    }
    
    // Check vertical matches
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE - 2; y++) {
        const cell = gridCopy[y][x];
        if (!cell) continue;
        
        const type = cell.type;
        let matchLength = 1;
        
        while (y + matchLength < GRID_SIZE && gridCopy[y + matchLength][x]?.type === type) {
          matchLength++;
        }
        
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            matchedCells.add(`${x}-${y + i}`);
          }
          
          if (matchLength === 3) score += POINTS.MATCH_3;
          else if (matchLength === 4) {
            score += POINTS.MATCH_4;
            powerUpsEarned++;
          }
          else {
            score += POINTS.MATCH_5;
            powerUpsEarned += 2;
          }
        }
        
        y += matchLength - 1;
      }
    }
    
    // Remove matched cells and create new ones
    const newGrid = gridCopy.map(row => [...row]);
    const fileTypes = Object.keys(FILE_CONFIG) as FileType[];
    let compressedCount = 0;

    matchedCells.forEach(cellId => {
      const [x, y] = cellId.split('-').map(Number);
      const cell = newGrid[y][x];
      if (cell && !cell.compressed) {
        compressedCount++;
        createCompressionBlast(x, y, FILE_CONFIG[cell.type].blastColor);
        showFloatingScore(x, y, POINTS.COMPRESSION, FILE_CONFIG[cell.type].blastColor);
      }
      const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
      const fileConfig = FILE_CONFIG[fileType];
      newGrid[y][x] = {
        id: `${x}-${y}-${Math.random()}`,
        type: fileType,
        x,
        y,
        compressed: false,
        compressing: false,
        size: fileConfig.baseSize,
        originalSize: fileConfig.baseSize,
        points: POINTS.FILE_POINTS[fileType],
        isLocked: Math.random() < 0.15,
        isMatched: false,
        isPowerUp: false,
      };
    });

    // Award power-ups for large matches
    if (powerUpsEarned > 0) {
      playSound('powerup');
      setGameState(prev => {
        const updatedPowerUps = [...prev.powerUps];
        const randomPowerUp = POWER_UPS[Math.floor(Math.random() * POWER_UPS.length)];
        const powerUpIndex = updatedPowerUps.findIndex(p => p.type === randomPowerUp.type);
        
        if (powerUpIndex !== -1) {
          updatedPowerUps[powerUpIndex].count += powerUpsEarned;
          
          const randomX = Math.floor(Math.random() * GRID_SIZE);
          const randomY = Math.floor(Math.random() * GRID_SIZE);
          createPowerUpEffect(randomX, randomY);
          
          toast({
            title: "Power-Up Earned!",
            description: `You got ${powerUpsEarned} ${randomPowerUp.name}!`,
          });
        }
        
        return { ...prev, powerUps: updatedPowerUps };
      });
    }
    
    return { 
      grid: newGrid, 
      score, 
      matches: matchedCells.size,
      compressedCount 
    };
  }, [createCompressionBlast, createPowerUpEffect, toast, playSound, showFloatingScore]);

  // Check for auto-compression
  const checkAutoCompression = useCallback(async (grid: (GridCell | null)[][]) => {
    let foundMatch = false;
    let newGrid = grid.map(row => [...row]);
    
    let iterationCount = 0;
    const maxIterations = 3; // Reduced
    
    while (iterationCount < maxIterations) {
      const { grid: matchedGrid, score: matchScore, matches, compressedCount } = findAndRemoveMatches(newGrid);
      
      if (matches === 0) break;
      
      foundMatch = true;
      playSound('match');
      
      setGameState(prev => ({
        ...prev,
        grid: matchedGrid,
        score: prev.score + matchScore,
        totalCompressed: prev.totalCompressed + compressedCount,
      }));
      
      setShowAutoCompress(true);
      setTimeout(() => setShowAutoCompress(false), 800);
      
      newGrid = matchedGrid;
      iterationCount++;
      
      if (iterationCount < maxIterations) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return foundMatch;
  }, [findAndRemoveMatches, playSound]);

  // Check for matches on grid changes - only after player has moved
  useEffect(() => {
    if (hasPlayerMoved && gameState.grid.length > 0 && !gameState.isGameOver && !gameState.isLevelComplete) {
      const timer = setTimeout(() => {
        checkAutoCompression(gameState.grid);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.grid, gameState.isGameOver, gameState.isLevelComplete, checkAutoCompression, hasPlayerMoved]);

  // Drag functionality
  const handleDragStart = useCallback((x: number, y: number) => {
    if (isPaused || gameState.isGameOver || gameState.isLevelComplete || gameState.activePowerUp) return;
    
    const cell = gameState.grid[y][x];
    if (!cell || cell.isLocked) return;
    
    isDragging.current = true;
    setDragStart({ x, y });
    setDragCurrent({ x, y });
  }, [gameState, isPaused]);

  const handleDragMove = useCallback((x: number, y: number) => {
    if (!isDragging.current || !dragStart) return;
    
    const cell = gameState.grid[y]?.[x];
    if (!cell || cell.isLocked) return;
    
    setDragCurrent({ x, y });
  }, [dragStart, gameState.grid]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current || !dragStart || !dragCurrent) {
      isDragging.current = false;
      setDragStart(null);
      setDragCurrent(null);
      return;
    }

    const { x: startX, y: startY } = dragStart;
    const { x: endX, y: endY } = dragCurrent;

    const isAdjacent = 
      (Math.abs(startX - endX) === 1 && startY === endY) || 
      (Math.abs(startY - endY) === 1 && startX === endX);

    if (isAdjacent && (startX !== endX || startY !== endY)) {
      playSound('swap');
      
      const newGrid = gameState.grid.map(row => [...row]);
      [newGrid[startY][startX], newGrid[endY][endX]] = [newGrid[endY][endX], newGrid[startY][startX]];
      
      const { grid: matchedGrid, score: matchScore, compressedCount } = findAndRemoveMatches(newGrid);
      
      if (matchScore === 0) {
        playSound('error');
        toast({
          title: "No Match",
          description: "Try to match 3 or more files of the same type!",
          variant: "destructive",
        });
      } else {
        playSound('match');
        setHasPlayerMoved(true); // Enable auto-compression after first move
        const newMovesLeft = gameState.movesLeft - 1;
        const newScore = gameState.score + matchScore;
        const newTotalCompressed = gameState.totalCompressed + compressedCount;
        const isLevelComplete = newScore >= gameState.targetScore && newTotalCompressed >= gameState.targetCompressed;
        const isGameOver = newMovesLeft <= 0 && !isLevelComplete;

        const newStreak = gameState.streak + 1;
        const streakBonus = newStreak >= 3 ? POINTS.STREAK_BONUS * Math.floor(newStreak / 3) : 0;
        
        if (isLevelComplete) {
          playSound('complete');
        }

        setGameState(prev => ({
          ...prev,
          grid: matchedGrid,
          movesLeft: newMovesLeft,
          score: newScore + streakBonus,
          totalCompressed: newTotalCompressed,
          streak: newStreak,
          isLevelComplete,
          isGameOver,
        }));
        
        if (newScore + streakBonus > highScore) {
          setHighScore(newScore + streakBonus);
          localStorage.setItem('slimfileMatch3HighScore', (newScore + streakBonus).toString());
        }
      }
    }

    isDragging.current = false;
    setDragStart(null);
    setDragCurrent(null);
  }, [dragStart, dragCurrent, gameState, findAndRemoveMatches, toast, highScore, playSound]);

  // Activate a power-up
  const activatePowerUp = useCallback((powerUpType: PowerUpType) => {
    playSound('powerup');
    setGameState(prev => {
      const powerUp = prev.powerUps.find(p => p.type === powerUpType);
      if (!powerUp || powerUp.count <= 0) return prev;
      
      return {
        ...prev,
        activePowerUp: powerUpType
      };
    });
    
    toast({
      title: "Power-Up Activated!",
      description: `Click on the grid to use ${POWER_UPS.find(p => p.type === powerUpType)?.name}`,
    });
  }, [toast, playSound]);

  // Apply power-up effect
  const applyPowerUpEffect = useCallback((x: number, y: number) => {
    if (!gameState.activePowerUp) return;

    setHasPlayerMoved(true); // Enable auto-compression after first move
    const powerUpType = gameState.activePowerUp;
    let affectedCells: {x: number, y: number}[] = [];
    let scoreEarned = 0;

    switch (powerUpType) {
      case 'row-blast':
        for (let i = 0; i < GRID_SIZE; i++) {
          affectedCells.push({ x: i, y });
        }
        break;
      case 'column-blast':
        for (let i = 0; i < GRID_SIZE; i++) {
          affectedCells.push({ x, y: i });
        }
        break;
      case 'bomb':
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
              affectedCells.push({ x: nx, y: ny });
            }
          }
        }
        break;
      case 'compression-burst':
        for (let cy = 0; cy < GRID_SIZE; cy++) {
          for (let cx = 0; cx < GRID_SIZE; cx++) {
            const cell = gameState.grid[cy][cx];
            if (cell && cell.isLocked) {
              affectedCells.push({ x: cx, y: cy });
            }
          }
        }
        break;
    }

    const newGrid = gameState.grid.map(row => [...row]);
    affectedCells.forEach(({x, y}) => {
      const cell = newGrid[y][x];
      if (cell) {
        createCompressionBlast(x, y, FILE_CONFIG[cell.type].blastColor);
        scoreEarned += POINTS.POWER_UP;
        
        if (powerUpType === 'compression-burst') {
          newGrid[y][x] = {
            ...cell,
            compressed: true,
            isLocked: false,
            size: FILE_CONFIG[cell.type].compressedSize
          };
        } else {
          const fileTypes = Object.keys(FILE_CONFIG) as FileType[];
          const newFileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
          const fileConfig = FILE_CONFIG[newFileType];
          newGrid[y][x] = {
            id: `${x}-${y}-${Math.random()}`,
            type: newFileType,
            x,
            y,
            compressed: false,
            compressing: false,
            size: fileConfig.baseSize,
            originalSize: fileConfig.baseSize,
            points: POINTS.FILE_POINTS[newFileType],
            isLocked: Math.random() < 0.1,
            isMatched: false,
            isPowerUp: false,
          };
        }
      }
    });

    const newMovesLeft = gameState.movesLeft - 1;
    const newScore = gameState.score + scoreEarned;
    const newTotalCompressed = powerUpType === 'compression-burst' 
      ? gameState.totalCompressed + affectedCells.length 
      : gameState.totalCompressed;

    const isLevelComplete = newScore >= gameState.targetScore && newTotalCompressed >= gameState.targetCompressed;
    const isGameOver = newMovesLeft <= 0 && !isLevelComplete;

    setGameState(prev => {
      const updatedPowerUps = prev.powerUps.map(p => 
        p.type === powerUpType ? { ...p, count: p.count - 1 } : p
      );

      return {
        ...prev,
        grid: newGrid,
        movesLeft: newMovesLeft,
        score: newScore,
        totalCompressed: newTotalCompressed,
        powerUps: updatedPowerUps,
        activePowerUp: null,
        isLevelComplete,
        isGameOver,
      };
    });

    toast({
      title: "Power-Up Used!",
      description: `${POWER_UPS.find(p => p.type === powerUpType)?.name} affected ${affectedCells.length} files!`,
    });
  }, [gameState, createCompressionBlast, toast]);

  // Handle cell click
  const handleCellClick = useCallback((x: number, y: number) => {
    if (isPaused || gameState.isGameOver || gameState.isLevelComplete) return;
    
    if (gameState.activePowerUp) {
      playSound('powerup');
      applyPowerUpEffect(x, y);
      return;
    }
    
    const cell = gameState.grid[y][x];
    if (!cell || cell.isLocked) {
      playSound('error');
      return;
    }
    
    if (!gameState.selectedCell) {
      playSound('select');
      setGameState(prev => ({ ...prev, selectedCell: { x, y } }));
      return;
    }
    
    const { x: selectedX, y: selectedY } = gameState.selectedCell;
    
    if (selectedX === x && selectedY === y) {
      playSound('select');
      setGameState(prev => ({ ...prev, selectedCell: null }));
      return;
    }
    
    const isAdjacent = 
      (Math.abs(selectedX - x) === 1 && selectedY === y) || 
      (Math.abs(selectedY - y) === 1 && selectedX === x);
    
    if (!isAdjacent) {
      playSound('select');
      setGameState(prev => ({ ...prev, selectedCell: { x, y } }));
      return;
    }
    
    playSound('swap');
    const newGrid = gameState.grid.map(row => [...row]);
    [newGrid[selectedY][selectedX], newGrid[y][x]] = [newGrid[y][x], newGrid[selectedY][selectedX]];
    
    const { grid: matchedGrid, score: matchScore, compressedCount } = findAndRemoveMatches(newGrid);
    
    if (matchScore === 0) {
      playSound('error');
      toast({
        title: "No Match",
        description: "Try to match 3 or more files of the same type!",
        variant: "destructive",
      });
      setGameState(prev => ({ ...prev, selectedCell: null }));
      return;
    }
    
    playSound('match');
    setHasPlayerMoved(true); // Enable auto-compression after first move
    const newMovesLeft = gameState.movesLeft - 1;
    const newScore = gameState.score + matchScore;
    const newTotalCompressed = gameState.totalCompressed + compressedCount;
    const isLevelComplete = newScore >= gameState.targetScore && newTotalCompressed >= gameState.targetCompressed;
    const isGameOver = newMovesLeft <= 0 && !isLevelComplete;

    const newStreak = gameState.streak + 1;
    const streakBonus = newStreak >= 3 ? POINTS.STREAK_BONUS * Math.floor(newStreak / 3) : 0;
    
    if (isLevelComplete) {
      playSound('complete');
    } else if (isGameOver) {
      playSound('gameover');
    }

    setGameState(prev => ({
      ...prev,
      grid: matchedGrid,
      selectedCell: null,
      movesLeft: newMovesLeft,
      score: newScore + streakBonus,
      totalCompressed: newTotalCompressed,
      streak: newStreak,
      isLevelComplete,
      isGameOver,
    }));
    
    if (newScore + streakBonus > highScore) {
      setHighScore(newScore + streakBonus);
      localStorage.setItem('slimfileMatch3HighScore', (newScore + streakBonus).toString());
    }
  }, [gameState, isPaused, highScore, toast, findAndRemoveMatches, applyPowerUpEffect, playSound]);

  // Initialize game on component mount
  useEffect(() => {
    initGame(0);
  }, [initGame]);

  // Render game grid
  const renderGrid = () => {
    return (
      <div className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl p-3 sm:p-6 md:p-8 shadow-2xl mx-auto max-w-max border-4 border-white/50">
        {/* Static background */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.2), transparent 70%)',
          }}
        />
        
        {/* Decorative corners */}
        <div className="hidden sm:block absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-purple-400 rounded-tl-3xl"></div>
        <div className="hidden sm:block absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-pink-400 rounded-tr-3xl"></div>
        <div className="hidden sm:block absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-400 rounded-bl-3xl"></div>
        <div className="hidden sm:block absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-orange-400 rounded-br-3xl"></div>

        {/* Auto-compress hint */}
        {showAutoCompress && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full text-base font-bold z-20 shadow-xl border-2 border-white/50 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Auto-Collapse!
            <Sparkles className="w-5 h-5" />
          </div>
        )}

        {/* Active power-up indicator */}
        {gameState.activePowerUp && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white px-6 py-3 rounded-full text-base font-bold z-20 flex items-center gap-3 shadow-xl border-2 border-white/50">
            <Zap className="w-5 h-5" />
            {POWER_UPS.find(p => p.type === gameState.activePowerUp)?.name} Active!
          </div>
        )}

        <div className="relative inline-grid grid-cols-8 gap-1 sm:gap-2 md:gap-2.5">
          {/* Blast Effects */}
          <AnimatePresence>
            {compressionBlasts.map((blast, index) => (
              <motion.div
                key={`blast-${blast.x}-${blast.y}-${index}`}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: blast.x * (window.innerWidth < 640 ? 40 : 56) + (window.innerWidth < 640 ? 12 : 16),
                  top: blast.y * (window.innerWidth < 640 ? 40 : 56) + (window.innerWidth < 640 ? 12 : 16),
                  width: window.innerWidth < 640 ? 24 : 32,
                  height: window.innerWidth < 640 ? 24 : 32,
                  backgroundColor: blast.color,
                  boxShadow: `0 0 15px ${blast.color}`,
                  zIndex: 10,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          {/* Floating Scores */}
          <AnimatePresence>
            {floatingScores.map(score => (
              <motion.div
                key={score.id}
                className="absolute pointer-events-none font-black text-base sm:text-xl z-20"
                style={{
                  left: score.x,
                  top: score.y,
                  color: score.color,
                  textShadow: `0 0 8px ${score.color}`,
                }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -40 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                +{score.score}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Grid Cells - Minimal animation */}
          {gameState.grid.map((row, y) =>
            row.map((cell, x) => {
              const isSelected = gameState.selectedCell?.x === x && gameState.selectedCell?.y === y;
              const isDragTarget = dragCurrent?.x === x && dragCurrent?.y === y && dragStart && 
                (dragStart.x !== x || dragStart.y !== y);
              
              return (
                <div
                  key={cell?.id || `${x}-${y}`}
                  className={`w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 border-2 sm:border-3 rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer transition-transform duration-100 relative ${
                    cell ? FILE_CONFIG[cell.type].color : 'bg-gradient-to-br from-gray-100 to-gray-200'
                  } ${
                    isSelected
                      ? 'ring-[5px] sm:ring-[6px] ring-purple-600 ring-offset-2 sm:ring-offset-3 scale-[1.15] sm:scale-[1.2] z-20'
                      : isDragTarget
                      ? 'ring-[4px] ring-blue-500 ring-offset-2 scale-110 z-10'
                      : 'shadow-lg'
                  } ${
                    cell?.isLocked ? 'opacity-80' : 'hover:scale-105 hover:shadow-2xl active:scale-95'
                  } ${
                    gameState.activePowerUp ? 'cursor-crosshair' : 'cursor-pointer'
                  }`}
                  onClick={() => handleCellClick(x, y)}
                  onMouseDown={() => handleDragStart(x, y)}
                  onMouseEnter={() => handleDragMove(x, y)}
                  onMouseUp={handleDragEnd}
                  onTouchStart={() => handleDragStart(x, y)}
                  onTouchEnd={handleDragEnd}
                  style={{
                    boxShadow: isSelected 
                      ? '0 0 0 4px rgba(147, 51, 234, 0.4), 0 8px 24px rgba(147, 51, 234, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)'
                      : isDragTarget
                      ? '0 0 0 3px rgba(59, 130, 246, 0.4), 0 6px 20px rgba(59, 130, 246, 0.4)'
                      : cell 
                      ? `0 4px 12px ${FILE_CONFIG[cell.type].blastColor}40` 
                      : undefined
                  }}
                >
                  {/* Strong selection glow */}
                  {isSelected && (
                    <>
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-purple-600 opacity-50 pointer-events-none" />
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-4 border-purple-400 pointer-events-none" />
                    </>
                  )}
                  
                  {/* Drag target glow */}
                  {isDragTarget && (
                    <>
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-blue-400 opacity-40 pointer-events-none" />
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-3 border-blue-300 pointer-events-none" />
                    </>
                  )}
                  
                  {cell ? (
                    <div className="relative w-full h-full flex items-center justify-center text-white drop-shadow-lg">
                      {FILE_CONFIG[cell.type].icon}
                      {cell.compressed && (
                        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-br from-green-400 to-green-600 rounded-full p-0.5 sm:p-1 shadow-lg">
                          <Check className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                        </div>
                      )}
                      {cell.isLocked && (
                        <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-gradient-to-br from-red-500 to-red-700 rounded-full p-0.5 sm:p-1 shadow-lg">
                          <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3.5 md:h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 pt-28 pb-4 sm:pb-8 px-2 sm:px-3 lg:px-8 relative overflow-hidden">
      {/* Minimal background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold bg-gradient-to-r from-red-500 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
              SlimFile Match-3
            </h1>
          </div>
          
          <p className="text-sm sm:text-base lg:text-xl text-gray-800 font-semibold px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-md rounded-full inline-flex items-center gap-2 shadow-lg border-2 border-white/50">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Match files to compress them!
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 px-1 sm:px-2">
          {/* Score Card */}
          <Card className="h-full border-3 border-purple-300 bg-gradient-to-br from-purple-50 to-white shadow-xl">
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-bold text-purple-700 flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                Score
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                {gameState.score.toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" />
                Target: {gameState.targetScore.toLocaleString()}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-1 sm:mt-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (gameState.score / gameState.targetScore) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* High Score Card */}
          <Card className="h-full border-3 border-yellow-300 bg-gradient-to-br from-yellow-50 to-white shadow-xl">
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-bold text-yellow-700 flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600"></div>
                High Score
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
                <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                  {highScore.toLocaleString()}
                </span>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-2 flex items-center gap-1">
                <Award className="w-2 h-2 sm:w-3 sm:h-3" />
                Personal Best
              </div>
            </CardContent>
          </Card>
          
          {/* Level Card */}
          <Card className="h-full border-3 border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-xl">
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-bold text-blue-700 flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                Level {gameState.level}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {gameState.movesLeft}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 mt-1">moves left</div>
              {gameState.streak > 0 && (
                <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-bold mt-1 sm:mt-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                  <Zap className="w-2 h-2 sm:w-3 sm:h-3" />
                  {gameState.streak}x Streak!
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Compressed Card */}
          <Card className="h-full border-3 border-green-300 bg-gradient-to-br from-green-50 to-white shadow-xl">
            <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
              <CardTitle className="text-xs sm:text-sm font-bold text-green-700 flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                Compressed
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <Check className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                <span className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  {gameState.totalCompressed}<span className="text-base sm:text-lg font-normal text-gray-500">/</span>{gameState.targetCompressed}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-1 sm:mt-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 sm:h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (gameState.totalCompressed / gameState.targetCompressed) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Grid with side panels */}
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start px-2 sm:px-4 mb-8">
          {/* Left Panel - Power-ups */}
          <div className="w-full lg:w-64">
            <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-3 border-white/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Power-ups
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  {POWER_UPS.map((powerUp) => {
                    const powerUpCount = gameState.powerUps.find(p => p.type === powerUp.type)?.count || 0;
                    const isActive = gameState.activePowerUp === powerUp.type;
                    
                    return (
                      <Button
                        key={powerUp.type}
                        variant="outline"
                        className={`relative flex flex-col items-center justify-center gap-2 h-auto p-4 border-3 w-full rounded-2xl transition-all ${
                          isActive 
                            ? 'ring-4 ring-purple-500 ring-offset-2 bg-gradient-to-br from-purple-100 to-pink-100' 
                            : powerUp.color
                        } ${
                          powerUpCount > 0 
                            ? 'cursor-pointer hover:shadow-xl border-gray-300' 
                            : 'cursor-not-allowed opacity-50 grayscale'
                        }`}
                        onClick={() => powerUpCount > 0 && activatePowerUp(powerUp.type)}
                        disabled={powerUpCount <= 0}
                      >
                        <div className="relative">
                          {powerUp.icon}
                          {powerUpCount > 0 && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
                              {powerUpCount}
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-center">{powerUp.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Game Grid */}
          <div className="flex-shrink-0">
            {renderGrid()}
          </div>

          {/* Right Panel - Controls */}
          <div className="w-full lg:w-64 flex flex-col gap-4">
            <Button 
              onClick={() => initGame(gameState.level - 1)}
              variant="outline"
              size="lg"
              className="w-full text-base bg-white/90 backdrop-blur-md border-3 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-lg font-bold rounded-xl h-16"
            >
              <RotateCw className="h-5 w-5 mr-2" />
              Reset Level
            </Button>
            <Button 
              onClick={() => setShowTutorial(true)}
              size="lg"
              className="w-full text-base bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 shadow-xl font-bold rounded-xl h-16"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              How to Play
            </Button>
            <Button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="outline"
              size="lg"
              className={`w-full text-base backdrop-blur-md border-3 shadow-lg font-bold rounded-xl h-16 transition-all ${
                soundEnabled 
                  ? 'bg-green-50 border-green-300 hover:bg-green-100 text-green-700' 
                  : 'bg-red-50 border-red-300 hover:bg-red-100 text-red-700'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="h-5 w-5 mr-2" />
                  Sound On
                </>
              ) : (
                <>
                  <VolumeX className="h-5 w-5 mr-2" />
                  Sound Off
                </>
              )}
            </Button>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-3 border-purple-200 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-purple-700 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-700 space-y-2">
                <p>• Match 3+ files of the same type</p>
                <p>• Build streaks for bonus points</p>
                <p>• Use power-ups strategically</p>
                <p>• Unlock locked files first</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div>
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-4 border-white/50 rounded-3xl">
                <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-t-3xl p-8">
                  <CardTitle className="text-2xl sm:text-3xl font-black flex items-center gap-3">
                    <Sparkles className="w-8 h-8" />
                    How to Play SlimFile Match-3
                    <Target className="w-8 h-8" />
                  </CardTitle>
                  <CardDescription className="text-white/90 text-base mt-3">
                    Master the art of file compression through matching!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-sm sm:text-base p-6">
                  <div className="space-y-3 bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-purple-800">
                      <Target className="h-6 w-6" />
                      Gameplay Basics
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li><strong>Click or Drag</strong> to swap adjacent files and make matches of 3 or more</li>
                      <li>Matches can be horizontal or vertical</li>
                      <li>Each match compresses files and adds to your score</li>
                      <li>Locked files need to be matched to be compressed</li>
                      <li>Build streaks for massive bonus points! 🔥</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3 bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-yellow-800">
                      <Zap className="h-6 w-6" />
                      Power-Ups Arsenal
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li><strong>Row Blast:</strong> Clear an entire row of files instantly</li>
                      <li><strong>Column Blast:</strong> Clear an entire column of files</li>
                      <li><strong>Bomb:</strong> Clear a 3x3 area around your click</li>
                      <li><strong>Compression Burst:</strong> Compress all locked files at once</li>
                      <li>Earn power-ups by making matches of 4 or more files!</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3 bg-green-50 p-4 rounded-2xl border-2 border-green-200">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-green-800">
                      <Trophy className="h-6 w-6" />
                      Level Progression
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Game gets progressively harder with more locked files</li>
                      <li>Fewer moves available as you advance</li>
                      <li>Higher score AND compression targets</li>
                      <li>Complete all 8 levels to become a SlimFile Master! 🏆</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-gray-50 rounded-b-3xl p-6">
                  <Button 
                    onClick={() => setShowTutorial(false)}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg"
                  >
                    Let's Play! 🚀
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}

        {/* Level Complete Modal */}
        {gameState.isLevelComplete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md text-center bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl border-4 border-green-300 rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-3xl">
                <CardTitle className="text-3xl font-black flex items-center justify-center gap-3">
                  <Sparkles className="h-8 w-8" />
                  Level {gameState.level} Complete!
                  <Trophy className="h-8 w-8" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {gameState.score}
                </div>
                <div className="text-lg font-bold text-gray-700">points earned!</div>
                <div className="flex justify-center gap-6 text-center">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-green-200">
                    <div className="text-3xl font-bold text-green-600">{gameState.totalCompressed}</div>
                    <div className="text-xs text-gray-600 mt-1">Files Compressed</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-yellow-200">
                    <div className="text-3xl font-bold text-yellow-600 flex items-center gap-1">
                      <Zap className="w-6 h-6" />
                      {gameState.streak}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Max Streak</div>
                  </div>
                </div>
                <div className="text-base text-gray-700 font-semibold bg-white/80 p-4 rounded-2xl border-2 border-gray-200">
                  {gameState.level < LEVELS.length 
                    ? '🎮 Ready for the next challenge?' 
                    : '🏆 You conquered all levels! Amazing!'}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center bg-white/50 rounded-b-3xl p-6">
                <Button 
                  onClick={() => gameState.level < LEVELS.length ? initGame(gameState.level) : initGame(0)}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-xl px-10 py-4 rounded-2xl shadow-xl"
                >
                  {gameState.level < LEVELS.length ? 'Next Level 🚀' : 'Play Again 🔄'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState.isGameOver && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md text-center bg-gradient-to-br from-red-50 to-orange-50 shadow-2xl border-4 border-red-300 rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-t-3xl">
                <CardTitle className="text-3xl font-black flex items-center justify-center gap-3">
                  <Frown className="h-8 w-8" />
                  Game Over
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {gameState.score}
                </div>
                <div className="text-base font-bold text-gray-700">
                  Level {gameState.level} • {gameState.totalCompressed} files compressed
                </div>
                <div className="flex items-center justify-center gap-2 text-yellow-700 bg-yellow-100 p-3 rounded-2xl border-2 border-yellow-300">
                  <Zap className="h-5 w-5" />
                  <span className="font-bold">Best Streak: {gameState.streak}x</span>
                </div>
                
                {gameState.score > highScore * 0.7 && (
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-3 border-yellow-300 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center justify-center gap-2 text-orange-800 font-bold">
                      <Smile className="h-6 w-6" />
                      <span>So close! Just {Math.round((1 - gameState.score / gameState.targetScore) * 100)}% away!</span>
                    </div>
                  </div>
                )}
                
                <div className="text-base text-gray-700 font-bold bg-white/80 p-4 rounded-2xl border-2 border-gray-200">
                  💪 Don't give up! You've got this!
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-3 bg-white/50 rounded-b-3xl p-6">
                <Button 
                  onClick={() => initGame(gameState.level - 1)}
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg flex-1"
                >
                  <RotateCw className="h-5 w-5 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => initGame(0)}
                  variant="outline"
                  size="lg"
                  className="border-3 border-gray-300 font-bold text-lg px-8 py-3 rounded-xl flex-1"
                >
                  New Game
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}