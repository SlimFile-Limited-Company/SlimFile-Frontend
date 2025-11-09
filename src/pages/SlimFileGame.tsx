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
  Laugh
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type FileType = 'image' | 'pdf' | 'ppt' | 'video';

interface PowerUp {
  type: 'row-blast' | 'column-blast' | 'bomb' | 'compression-burst';
  name: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

type PowerUpType = PowerUp['type'];

interface LevelConfig {
  targetScore: number;
  moves: number;
  lockedFiles: number;
  speed: number;
  pointsMultiplier: number;
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

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  life: number;
  velocity: { x: number; y: number };
}

interface Encouragement {
  id: string;
  message: string;
  emoji: string;
  type: 'success' | 'warning' | 'celebration';
}

// Game configuration
const GRID_SIZE = 8;
const LEVELS: LevelConfig[] = [
  { targetScore: 1000, moves: 25, lockedFiles: 5, speed: 1.0, pointsMultiplier: 1.0 },
  { targetScore: 2500, moves: 22, lockedFiles: 8, speed: 1.1, pointsMultiplier: 1.1 },
  { targetScore: 5000, moves: 20, lockedFiles: 12, speed: 1.2, pointsMultiplier: 1.2 },
  { targetScore: 8000, moves: 18, lockedFiles: 15, speed: 1.3, pointsMultiplier: 1.3 },
  { targetScore: 12000, moves: 16, lockedFiles: 18, speed: 1.4, pointsMultiplier: 1.4 },
  { targetScore: 17000, moves: 15, lockedFiles: 22, speed: 1.5, pointsMultiplier: 1.5 },
  { targetScore: 23000, moves: 14, lockedFiles: 26, speed: 1.6, pointsMultiplier: 1.6 },
  { targetScore: 30000, moves: 13, lockedFiles: 30, speed: 1.7, pointsMultiplier: 1.7 },
];

// File type configurations
const FILE_CONFIG = {
  image: { 
    name: 'Image', 
    color: 'bg-blue-100 text-blue-600 border-blue-300',
    icon: <FileImage className="w-4 h-4 sm:w-6 sm:h-6" />,
    baseSize: 2000,
    compressedSize: 500,
    blastColor: '#3B82F6'
  },
  pdf: { 
    name: 'PDF', 
    color: 'bg-red-100 text-red-600 border-red-300',
    icon: <FileText className="w-4 h-4 sm:w-6 sm:h-6" />,
    baseSize: 5000,
    compressedSize: 1000,
    blastColor: '#EF4444'
  },
  ppt: { 
    name: 'Presentation', 
    color: 'bg-orange-100 text-orange-600 border-orange-300',
    icon: <FileText className="w-4 h-4 sm:w-6 sm:h-6" />,
    baseSize: 10000,
    compressedSize: 2500,
    blastColor: '#F97316'
  },
  video: { 
    name: 'Video', 
    color: 'bg-purple-100 text-purple-600 border-purple-300',
    icon: <FileVideo className="w-4 h-4 sm:w-6 sm:h-6" />,
    baseSize: 50000,
    compressedSize: 10000,
    blastColor: '#8B5CF6'
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
    icon: <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-sm sm:text-base">→</div>,
    color: 'bg-yellow-100 text-yellow-600'
  },
  { 
    type: 'column-blast', 
    name: 'Column Blast', 
    description: 'Clears an entire column',
    icon: <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-sm sm:text-base">↓</div>,
    color: 'bg-yellow-100 text-yellow-600'
  },
  { 
    type: 'bomb', 
    name: 'Bomb', 
    description: 'Clears a 3x3 area',
    icon: <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm sm:text-base">💣</div>,
    color: 'bg-red-100 text-red-600'
  },
  { 
    type: 'compression-burst', 
    name: 'Compression Burst', 
    description: 'Compresses all locked files',
    icon: <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm sm:text-base">⚡</div>,
    color: 'bg-blue-100 text-blue-600'
  }
];

// Encouraging messages
const ENCOURAGEMENTS: Omit<Encouragement, 'id'>[] = [
  { message: "Awesome! 🚀", emoji: "🚀", type: 'success' },
  { message: "Great job! 👍", emoji: "👍", type: 'success' },
  { message: "You're a star! ⭐", emoji: "⭐", type: 'success' },
  { message: "Fantastic! 🌟", emoji: "🌟", type: 'success' },
  { message: "Incredible! 😎", emoji: "😎", type: 'success' },
  { message: "Power move! 💪", emoji: "💪", type: 'success' },
  { message: "Unstoppable! 🏆", emoji: "🏆", type: 'celebration' },
  { message: "Legendary! 🏅", emoji: "🏅", type: 'celebration' },
  { message: "Master compressor! 🎯", emoji: "🎯", type: 'celebration' },
  { message: "File crushing genius! 🤯", emoji: "🤯", type: 'celebration' },
];


export default function SlimFileGame() {
  const { toast } = useToast();
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
  const [particles, setParticles] = useState<Particle[]>([]);
  const [compressionBlasts, setCompressionBlasts] = useState<Array<{x: number, y: number, color: string}>>([]);
  const [showAutoCompress, setShowAutoCompress] = useState(false);
  const [encouragements, setEncouragements] = useState<Encouragement[]>([]);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{x: number, y: number} | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Show encouraging message
  const showEncouragement = useCallback((type: 'success' | 'celebration' = 'success') => {
    const filtered = ENCOURAGEMENTS.filter(e => e.type === type);
    const randomEncouragement = filtered[Math.floor(Math.random() * filtered.length)];
    
    const encouragement: Encouragement = {
      ...randomEncouragement,
      id: Date.now().toString()
    };
    
    setEncouragements(prev => [...prev, encouragement]);
    
    setTimeout(() => {
      setEncouragements(prev => prev.filter(e => e.id !== encouragement.id));
    }, 3000);
  }, []);

  // Simple blast effect
  const createCompressionBlast = useCallback((x: number, y: number, color: string) => {
    const blast = { x, y, color };
    setCompressionBlasts(prev => [...prev, blast]);
    
    setTimeout(() => {
      setCompressionBlasts(prev => prev.filter(b => b !== blast));
    }, 400);
  }, []);

  // Simple power-up effect
  const createPowerUpEffect = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: `${Date.now()}-powerup-${i}`,
      x: x * 60 + 30,
      y: y * 60 + 30,
      color: '#FFD700',
      size: Math.random() * 4 + 2,
      life: 1,
      velocity: {
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6
      }
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Update particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({ 
          ...p, 
          life: p.life - 0.03,
          x: p.x + p.velocity.x * 0.3,
          y: p.y + p.velocity.y * 0.3
        }))
        .filter(p => p.life > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Check for auto-compression opportunities
  const checkAutoCompression = useCallback((grid: (GridCell | null)[][]) => {
    let autoCompressed = false;
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE - 2; x++) {
        const cell = grid[y][x];
        if (!cell || cell.compressed) continue;
        
        const type = cell.type;
        let matchLength = 1;
        
        while (x + matchLength < GRID_SIZE && grid[y][x + matchLength]?.type === type) {
          matchLength++;
        }
        
        if (matchLength >= 3) {
          autoCompressed = true;
          setShowAutoCompress(true);
          setTimeout(() => setShowAutoCompress(false), 1000);
          break;
        }
      }
      if (autoCompressed) break;
    }
    
    if (!autoCompressed) {
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE - 2; y++) {
          const cell = grid[y][x];
          if (!cell || cell.compressed) continue;
          
          const type = cell.type;
          let matchLength = 1;
          
          while (y + matchLength < GRID_SIZE && grid[y + matchLength][x]?.type === type) {
            matchLength++;
          }
          
          if (matchLength >= 3) {
            autoCompressed = true;
            setShowAutoCompress(true);
            setTimeout(() => setShowAutoCompress(false), 1000);
            break;
          }
        }
        if (autoCompressed) break;
      }
    }
    
    return autoCompressed;
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
        const isLocked = Math.random() < (0.15 + levelIndex * 0.05);
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
      targetCompressed: levelConfig.lockedFiles,
      targetScore: levelConfig.targetScore,
      compressionProgress: 0,
      activePowerUp: null,
      streak: 0,
      powerUps: POWER_UPS.map(powerUp => ({ 
        type: powerUp.type, 
        count: Math.max(1, 3 - levelIndex)
      })),
    }));
    setParticles([]);
    setCompressionBlasts([]);
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
        isLocked: Math.random() < 0.1,
        isMatched: false,
        isPowerUp: false,
      };
    });

    // Award power-ups for large matches
    if (powerUpsEarned > 0) {
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
            description: `You got ${powerUpsEarned} ${randomPowerUp.name} power-up${powerUpsEarned > 1 ? 's' : ''}!`,
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
  }, [createCompressionBlast, createPowerUpEffect, toast]);

  // Improved drag functionality
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

    // Check if cells are adjacent
    const isAdjacent = 
      (Math.abs(startX - endX) === 1 && startY === endY) || 
      (Math.abs(startY - endY) === 1 && startX === endX);

    if (isAdjacent && (startX !== endX || startY !== endY)) {
      // Perform swap
      const newGrid = gameState.grid.map(row => [...row]);
      [newGrid[startY][startX], newGrid[endY][endX]] = [newGrid[endY][endX], newGrid[startY][startX]];
      
      const { grid: matchedGrid, score: matchScore, compressedCount } = findAndRemoveMatches(newGrid);
      
      if (matchScore === 0) {
        // No match, swap back
        toast({
          title: "No Match",
          description: "Try to match 3 or more files of the same type!",
          variant: "destructive",
        });
      } else {
        // Valid move
        const newMovesLeft = gameState.movesLeft - 1;
        const newScore = gameState.score + matchScore;
        const newTotalCompressed = gameState.totalCompressed + compressedCount;
        const levelConfig = LEVELS[gameState.level - 1] || LEVELS[0];
        const isLevelComplete = newScore >= gameState.targetScore && newTotalCompressed >= gameState.targetCompressed;
        const isGameOver = newMovesLeft <= 0 && !isLevelComplete;

        // Update streak
        const newStreak = gameState.streak + 1;
        const streakBonus = newStreak >= 3 ? POINTS.STREAK_BONUS * Math.floor(newStreak / 3) : 0;

        if (newStreak >= 3) {
          showEncouragement('celebration');
        } else if (matchScore >= POINTS.MATCH_4) {
          showEncouragement('success');
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

        setTimeout(() => {
          checkAutoCompression(matchedGrid);
        }, 500);
      }
    }

    isDragging.current = false;
    setDragStart(null);
    setDragCurrent(null);
  }, [dragStart, dragCurrent, gameState, findAndRemoveMatches, toast, highScore, checkAutoCompression, showEncouragement]);

  // Activate a power-up
  const activatePowerUp = useCallback((powerUpType: PowerUpType) => {
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
  }, [toast]);

  // Apply power-up effect
  const applyPowerUpEffect = useCallback((x: number, y: number) => {
    if (!gameState.activePowerUp) return;

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
      applyPowerUpEffect(x, y);
      return;
    }
    
    const cell = gameState.grid[y][x];
    if (!cell || cell.isLocked) return;
    
    if (!gameState.selectedCell) {
      setGameState(prev => ({ ...prev, selectedCell: { x, y } }));
      return;
    }
    
    const { x: selectedX, y: selectedY } = gameState.selectedCell;
    
    if (selectedX === x && selectedY === y) {
      setGameState(prev => ({ ...prev, selectedCell: null }));
      return;
    }
    
    const isAdjacent = 
      (Math.abs(selectedX - x) === 1 && selectedY === y) || 
      (Math.abs(selectedY - y) === 1 && selectedX === x);
    
    if (!isAdjacent) {
      setGameState(prev => ({ ...prev, selectedCell: { x, y } }));
      return;
    }
    
    const newGrid = gameState.grid.map(row => [...row]);
    [newGrid[selectedY][selectedX], newGrid[y][x]] = [newGrid[y][x], newGrid[selectedY][selectedX]];
    
    const { grid: matchedGrid, score: matchScore, compressedCount } = findAndRemoveMatches(newGrid);
    
    if (matchScore === 0) {
      toast({
        title: "No Match",
        description: "Try to match 3 or more files of the same type!",
        variant: "destructive",
      });
      setGameState(prev => ({ ...prev, selectedCell: null }));
      return;
    }
    
    const newMovesLeft = gameState.movesLeft - 1;
    const newScore = gameState.score + matchScore;
    const newTotalCompressed = gameState.totalCompressed + compressedCount;
    const levelConfig = LEVELS[gameState.level - 1] || LEVELS[0];
    const isLevelComplete = newScore >= gameState.targetScore && newTotalCompressed >= gameState.targetCompressed;
    const isGameOver = newMovesLeft <= 0 && !isLevelComplete;

    const newStreak = gameState.streak + 1;
    const streakBonus = newStreak >= 3 ? POINTS.STREAK_BONUS * Math.floor(newStreak / 3) : 0;

    if (newStreak >= 3) {
      showEncouragement('celebration');
    } else if (matchScore >= POINTS.MATCH_4) {
      showEncouragement('success');
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

    setTimeout(() => {
      checkAutoCompression(matchedGrid);
    }, 500);
  }, [gameState, isPaused, highScore, toast, findAndRemoveMatches, applyPowerUpEffect, checkAutoCompression, showEncouragement]);

  // Initialize game on component mount
  useEffect(() => {
    initGame(0);
  }, [initGame]);

  // Render game grid
  const renderGrid = () => {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl mb-6 mx-auto max-w-max relative border border-white/20">
        {/* Encouragement Messages */}
        <AnimatePresence>
          {encouragements.map((encouragement) => (
            <motion.div
              key={encouragement.id}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full text-sm font-bold z-20 flex items-center gap-2 shadow-lg border-2 border-white/30"
            >
              <span className="text-lg">{encouragement.emoji}</span>
              {encouragement.message}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Auto-compress hint */}
        <AnimatePresence>
          {showAutoCompress && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold z-20 shadow-lg border border-white/20"
            >
              🎯 Match Available!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active power-up indicator */}
        <AnimatePresence>
          {gameState.activePowerUp && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold z-20 flex items-center gap-2 shadow-lg border border-white/20"
            >
              <Zap className="w-4 h-4" />
              {POWER_UPS.find(p => p.type === gameState.activePowerUp)?.name} Active!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative inline-grid grid-cols-8 gap-1.5 sm:gap-2">
          {/* Simple Blast Effects */}
          <AnimatePresence>
            {compressionBlasts.map((blast, index) => (
              <motion.div
                key={`blast-${blast.x}-${blast.y}-${index}`}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: blast.x * 48 + 12,
                  top: blast.y * 48 + 12,
                  width: 24,
                  height: 24,
                  backgroundColor: blast.color,
                  zIndex: 5,
                }}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          {/* Minimal Particles */}
          <AnimatePresence>
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  opacity: particle.life,
                }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  x: particle.x + particle.velocity.x,
                  y: particle.y + particle.velocity.y,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </AnimatePresence>

          {/* Grid Cells */}
          {gameState.grid.map((row, y) =>
            row.map((cell, x) => (
              <motion.div
                key={cell?.id || `${x}-${y}`}
                className={`w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  cell ? FILE_CONFIG[cell.type].color : 'bg-gray-200/50'
                } ${
                  gameState.selectedCell?.x === x && gameState.selectedCell?.y === y
                    ? 'ring-2 ring-purple-500 ring-offset-2 transform scale-105 shadow-lg'
                    : ''
                } ${
                  cell?.isLocked ? 'opacity-70 grayscale-30' : 'hover:scale-105 hover:shadow-md'
                } ${
                  cell?.compressing ? 'animate-pulse' : ''
                } ${
                  gameState.activePowerUp ? 'cursor-crosshair' : ''
                } shadow-sm hover:shadow-lg transition-shadow`}
                onClick={() => handleCellClick(x, y)}
                onMouseDown={() => handleDragStart(x, y)}
                onMouseEnter={() => handleDragMove(x, y)}
                onMouseUp={handleDragEnd}
                whileHover={{ scale: cell?.isLocked ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cell ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {FILE_CONFIG[cell.type].icon}
                    {cell.compressed && (
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 absolute -top-1 -right-1 text-green-600 bg-white rounded-full p-0.5" />
                    )}
                    {cell.isLocked && (
                      <Lock className="w-2 h-2 sm:w-3 sm:h-3 absolute -bottom-1 -right-1 text-red-600" />
                    )}
                    {cell.compressing && (
                      <motion.div
                        className="absolute inset-0 bg-blue-500 rounded-xl opacity-20"
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>
                ) : null}
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 pt-20 pb-4 px-2 sm:px-4 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/3 w-48 h-48 bg-pink-200 rounded-full blur-3xl opacity-40"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex justify-center items-center mb-4 px-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              SlimFile Match-3
            </h1>
          </div>
          
          <p className="text-sm sm:text-lg text-gray-700 px-2 bg-white/50 backdrop-blur-sm rounded-full py-2 inline-block">Match files to compress them and complete levels! 🎯</p>
        </motion.div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 px-2">
          {/* Score Card */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="h-full border-2 border-purple-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
                  Score
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="text-xl sm:text-2xl font-bold text-purple-700">{gameState.score.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Target: {gameState.targetScore.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* High Score Card */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="h-full border-2 border-yellow-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                  High Score
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  <span className="text-xl sm:text-2xl font-bold text-yellow-700">{highScore.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Level Card */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="h-full border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                  Level {gameState.level}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="text-xl sm:text-2xl font-bold text-blue-700">{gameState.movesLeft} moves</div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span>Streak:</span>
                  <span className="ml-1 font-semibold text-blue-600">{gameState.streak}x</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Compressed Card */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="h-full border-2 border-green-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                  Compressed
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="text-xl sm:text-2xl font-bold text-green-700">
                    {gameState.totalCompressed}<span className="text-sm font-normal text-gray-500">/</span>{gameState.targetCompressed}
                  </span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (gameState.totalCompressed / gameState.targetCompressed) * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Difficulty Indicator */}
        {gameState.level > 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-2 bg-orange-100/80 backdrop-blur-sm text-orange-700 px-4 py-2 rounded-full text-sm font-medium border border-orange-200/50">
              <Zap className="w-4 h-4" />
              Level {gameState.level} Difficulty 
              <div className="flex gap-1">
                {Array.from({ length: gameState.level }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-orange-500 text-orange-500" />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Grid - Centered */}
        <div className="flex justify-center px-2 sm:px-4">
          <div className="w-full max-w-md sm:max-w-xl">
            {renderGrid()}
          </div>
        </div>

        {/* Power-ups */}
        <Card className="mb-6 mx-2 bg-white/80 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base font-medium">Power-ups</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              {POWER_UPS.map((powerUp) => {
                const powerUpCount = gameState.powerUps.find(p => p.type === powerUp.type)?.count || 0;
                const isActive = gameState.activePowerUp === powerUp.type;
                
                return (
                  <motion.div
                    key={powerUp.type}
                    whileHover={{ scale: powerUpCount > 0 ? 1.05 : 1 }}
                    whileTap={{ scale: powerUpCount > 0 ? 0.95 : 1 }}
                  >
                    <Button
                      variant="outline"
                      className={`flex flex-col items-center gap-1 sm:gap-2 h-auto p-2 sm:p-3 ${powerUp.color} border-2 w-full ${
                        isActive ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                      } ${powerUpCount > 0 ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-50'} transition-all`}
                      onClick={() => powerUpCount > 0 && activatePowerUp(powerUp.type)}
                      disabled={powerUpCount <= 0}
                    >
                      {powerUp.icon}
                      <span className="text-xs font-medium">{powerUp.name}</span>
                      <span className="text-xs">({powerUpCount})</span>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Game Controls */}
        <div className="flex justify-center gap-2 sm:gap-4 px-2 mb-8">
          <Button 
            onClick={() => initGame(gameState.level - 1)}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm bg-white/80 backdrop-blur-sm border-white/50"
          >
            <RotateCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Reset Level
          </Button>
          <Button 
            onClick={() => setShowTutorial(true)}
            size="sm"
            className="text-xs sm:text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            How to Play
          </Button>
        </div>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-white/50">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    How to Play SlimFile Match-3 🎮
                  </CardTitle>
                  <CardDescription>
                    Master the art of file compression through matching!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm sm:text-base">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Gameplay
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Click or Drag</strong> to swap adjacent files and make matches of 3 or more</li>
                      <li>Matches can be horizontal or vertical</li>
                      <li>Each match compresses files and adds to your score</li>
                      <li>Locked files need to be matched to be compressed</li>
                      <li>Build streaks for bonus points! 🔥</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Power-Ups
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Row Blast:</strong> Clear an entire row of files</li>
                      <li><strong>Column Blast:</strong> Clear an entire column of files</li>
                      <li><strong>Bomb:</strong> Clear a 3x3 area around your click</li>
                      <li><strong>Compression Burst:</strong> Compress all locked files instantly</li>
                      <li>Earn power-ups by making matches of 4 or more files</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      Difficulty
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Game gets harder each level with more locked files</li>
                      <li>Fewer moves available as you progress</li>
                      <li>Higher score targets to challenge you</li>
                      <li>Complete all 8 levels to become a SlimFile Master! 🏆</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={() => setShowTutorial(false)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Let's Play! 🚀
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Level Complete Modal */}
        {gameState.isLevelComplete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Card className="w-full max-w-md text-center bg-white/95 backdrop-blur-sm border-white/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-600 flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Level {gameState.level} Complete! 🎉
                    <Sparkles className="h-6 w-6" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-purple-600">{gameState.score} points</div>
                  <div className="text-lg">You compressed {gameState.totalCompressed} files!</div>
                  <div className="text-lg flex items-center justify-center gap-2 text-yellow-600">
                    <Zap className="h-5 w-5" />
                    Max Streak: {gameState.streak}
                  </div>
                  <div className="text-sm text-gray-600">
                    {gameState.level < LEVELS.length ? 'Ready for the next challenge?' : 'You completed all levels!'}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    onClick={() => gameState.level < LEVELS.length ? initGame(gameState.level) : initGame(0)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    size="lg"
                  >
                    {gameState.level < LEVELS.length ? 'Next Level' : 'Play Again'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState.isGameOver && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Card className="w-full max-w-md text-center bg-white/95 backdrop-blur-sm border-white/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-red-600 flex items-center justify-center gap-2">
                    <Frown className="h-6 w-6" />
                    Game Over
                    <Frown className="h-6 w-6" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-purple-600">{gameState.score} points</div>
                  <div className="text-lg">Level {gameState.level} • {gameState.totalCompressed} files compressed</div>
                  <div className="text-lg flex items-center justify-center gap-2 text-yellow-600">
                    <Zap className="h-5 w-5" />
                    Best Streak: {gameState.streak}
                  </div>
                  <div className="text-sm text-gray-600">Don't give up! Try again! 💪</div>
                  
                  {gameState.score > highScore * 0.7 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-yellow-100 border border-yellow-300 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-center gap-2 text-yellow-700">
                        <Laugh className="h-5 w-5" />
                        <span className="font-bold">So close! You were {Math.round((1 - gameState.score / gameState.targetScore) * 100)}% from completing the level!</span>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                  <Button 
                    onClick={() => initGame(gameState.level - 1)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1"
                    size="lg"
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => initGame(0)}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    New Game
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}