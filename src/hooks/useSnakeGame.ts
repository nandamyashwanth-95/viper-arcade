import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Coordinate,
  Direction,
  GameState,
  GameDifficulty,
  FoodItem,
  Particle,
  GameSettings,
  GameStats,
  ScoreRun,
} from '../types/game';
import { soundManager } from '../utils/sound';

const STATS_STORAGE_KEY = 'viper_snake_stats_v1';
const SETTINGS_STORAGE_KEY = 'viper_snake_settings_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'MEDIUM',
  borderMode: 'CLASSIC_WALLS',
  gridSize: 20,
  skin: 'EMERALD',
  soundEnabled: true,
  screenShake: true,
  showGridLines: true,
};

const DEFAULT_STATS: GameStats = {
  highScore: 0,
  totalGames: 0,
  totalApples: 0,
  maxSnakeLength: 3,
  runs: [],
};

const DIFFICULTY_SPEEDS: Record<GameDifficulty, number> = {
  EASY: 140,
  MEDIUM: 105,
  HARD: 75,
  DYNAMIC: 125,
};

export function useSnakeGame() {
  // Load saved settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Load saved stats
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  // Game state
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [score, setScore] = useState<number>(0);
  const [applesEaten, setApplesEaten] = useState<number>(0);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [screenShakeActive, setScreenShakeActive] = useState<boolean>(false);

  // Snake body: Index 0 is HEAD, last index is TAIL
  const [snake, setSnake] = useState<Coordinate[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);

  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Refs for loop authoritativeness
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionQueue = useRef<Direction[]>([]);
  const snakeRef = useRef<Coordinate[]>(snake);
  const foodsRef = useRef<FoodItem[]>([]);
  const gameStateRef = useRef<GameState>(gameState);
  const settingsRef = useRef<GameSettings>(settings);
  const applesEatenRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const lastGoldenSpawnRef = useRef<number>(0);
  const particleIdCounter = useRef<number>(0);

  // Synchronize refs with states
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodsRef.current = foods;
  }, [foods]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    settingsRef.current = settings;
    soundManager.setMuted(!settings.soundEnabled);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage unavailable fallback
    }
  }, [settings]);

  useEffect(() => {
    applesEatenRef.current = applesEaten;
  }, [applesEaten]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Generate random empty coordinate
  const getRandomFreeCoordinate = useCallback((occupiedCoords: Coordinate[], gridSize: number): Coordinate => {
    const occupiedSet = new Set(occupiedCoords.map((c) => `${c.x},${c.y}`));
    const freeCells: Coordinate[] = [];

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (!occupiedSet.has(`${x},${y}`)) {
          freeCells.push({ x, y });
        }
      }
    }

    if (freeCells.length === 0) {
      return { x: 0, y: 0 };
    }

    const randomIndex = Math.floor(Math.random() * freeCells.length);
    return freeCells[randomIndex];
  }, []);

  // Spawn classic food
  const spawnClassicFood = useCallback(
    (currentSnake: Coordinate[], existingFoods: FoodItem[], gridSize: number): FoodItem => {
      const occupied = [...currentSnake, ...existingFoods.map((f) => ({ x: f.x, y: f.y }))];
      const coord = getRandomFreeCoordinate(occupied, gridSize);
      return {
        id: `food-classic-${Date.now()}-${Math.random()}`,
        x: coord.x,
        y: coord.y,
        type: 'CLASSIC',
        points: 10,
      };
    },
    [getRandomFreeCoordinate]
  );

  // Spawn golden bonus food
  const spawnGoldenFood = useCallback(
    (currentSnake: Coordinate[], existingFoods: FoodItem[], gridSize: number): FoodItem => {
      const occupied = [...currentSnake, ...existingFoods.map((f) => ({ x: f.x, y: f.y }))];
      const coord = getRandomFreeCoordinate(occupied, gridSize);
      const duration = 8000; // 8 seconds
      return {
        id: `food-golden-${Date.now()}-${Math.random()}`,
        x: coord.x,
        y: coord.y,
        type: 'GOLDEN',
        points: 50,
        expiresAt: Date.now() + duration,
        duration,
      };
    },
    [getRandomFreeCoordinate]
  );

  // Spawn visual particles
  const addParticles = useCallback((x: number, y: number, color: string, count: number = 12) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.2 + Math.random() * 2.5;
      newParticles.push({
        id: particleIdCounter.current++,
        x: x + 0.5,
        y: y + 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 1.0,
        maxLife: 1.0,
        size: 3 + Math.random() * 3,
      });
    }
    setParticles((prev) => [...prev.slice(-40), ...newParticles]);
  }, []);

  // Start / Reset Game
  const startNewGame = useCallback(() => {
    const mid = Math.floor(settings.gridSize / 2);
    const initialSnake: Coordinate[] = [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ];

    setSnake(initialSnake);
    snakeRef.current = initialSnake;

    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    nextDirectionQueue.current = [];

    setScore(0);
    scoreRef.current = 0;

    setApplesEaten(0);
    applesEatenRef.current = 0;
    lastGoldenSpawnRef.current = 0;

    setIsNewHighScore(false);
    setScreenShakeActive(false);

    // Initial classic food
    const initialFood = spawnClassicFood(initialSnake, [], settings.gridSize);
    setFoods([initialFood]);
    foodsRef.current = [initialFood];
    setParticles([]);

    setGameState('PLAYING');
    gameStateRef.current = 'PLAYING';
  }, [settings.gridSize, spawnClassicFood]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
      gameStateRef.current = 'PAUSED';
      soundManager.playPause();
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
      gameStateRef.current = 'PLAYING';
      soundManager.playResume();
    }
  }, [gameState]);

  // Handle Game Over
  const handleGameOver = useCallback(() => {
    setGameState('GAME_OVER');
    gameStateRef.current = 'GAME_OVER';

    if (settingsRef.current.screenShake) {
      setScreenShakeActive(true);
      setTimeout(() => setScreenShakeActive(false), 350);
    }

    soundManager.playCollision();

    // Explosion particles at snake head
    const head = snakeRef.current[0];
    if (head) {
      addParticles(head.x, head.y, '#ef4444', 24);
    }

    const currentScore = scoreRef.current;
    const currentLength = snakeRef.current.length;
    const currentApples = applesEatenRef.current;

    // Check high score
    setStats((prevStats) => {
      const isRecord = currentScore > prevStats.highScore;
      if (isRecord) {
        setIsNewHighScore(true);
      }

      const newRun: ScoreRun = {
        id: `run-${Date.now()}`,
        score: currentScore,
        applesEaten: currentApples,
        length: currentLength,
        difficulty: settingsRef.current.difficulty,
        borderMode: settingsRef.current.borderMode,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };

      const updatedRuns = [newRun, ...(prevStats.runs || [])].slice(0, 10);

      const nextStats: GameStats = {
        highScore: Math.max(prevStats.highScore, currentScore),
        totalGames: prevStats.totalGames + 1,
        totalApples: prevStats.totalApples + currentApples,
        maxSnakeLength: Math.max(prevStats.maxSnakeLength, currentLength),
        runs: updatedRuns,
      };

      try {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(nextStats));
      } catch {
        // Storage fail fallback
      }

      return nextStats;
    });
  }, [addParticles]);

  // Direction changer with validation against 180° turns
  const requestDirection = useCallback((newDir: Direction) => {
    if (gameStateRef.current !== 'PLAYING') return;

    const queue = nextDirectionQueue.current;
    // Base comparison against either the last queued direction or the current active direction
    const lastDir = queue.length > 0 ? queue[queue.length - 1] : directionRef.current;

    const isOpposite =
      (newDir === 'UP' && lastDir === 'DOWN') ||
      (newDir === 'DOWN' && lastDir === 'UP') ||
      (newDir === 'LEFT' && lastDir === 'RIGHT') ||
      (newDir === 'RIGHT' && lastDir === 'LEFT');

    if (!isOpposite && newDir !== lastDir && queue.length < 2) {
      queue.push(newDir);
    }
  }, []);

  // Compute current step interval
  const getCurrentStepInterval = useCallback((): number => {
    const diff = settings.difficulty;
    const base = DIFFICULTY_SPEEDS[diff];
    if (diff === 'DYNAMIC') {
      // Speeds up dynamically as apples are eaten
      const reduction = Math.min(75, Math.floor(applesEaten / 3) * 3);
      return Math.max(50, base - reduction);
    }
    return base;
  }, [settings.difficulty, applesEaten]);

  // Main game tick
  const stepGame = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING') return;

    // Process input buffer
    if (nextDirectionQueue.current.length > 0) {
      const nextDir = nextDirectionQueue.current.shift()!;
      directionRef.current = nextDir;
      setDirection(nextDir);
    }

    const currentSnake = snakeRef.current;
    const head = currentSnake[0];
    const currentDir = directionRef.current;
    const gridSize = settingsRef.current.gridSize;
    const borderMode = settingsRef.current.borderMode;

    let newX = head.x;
    let newY = head.y;

    switch (currentDir) {
      case 'UP':
        newY -= 1;
        break;
      case 'DOWN':
        newY += 1;
        break;
      case 'LEFT':
        newX -= 1;
        break;
      case 'RIGHT':
        newX += 1;
        break;
    }

    // Wall collision handling
    if (borderMode === 'CLASSIC_WALLS') {
      if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
        handleGameOver();
        return;
      }
    } else {
      // PORTAL_WRAP
      newX = (newX + gridSize) % gridSize;
      newY = (newY + gridSize) % gridSize;
    }

    const newHead: Coordinate = { x: newX, y: newY };

    // Self-collision detection
    // Note: If snake length is >= 4, the tail will move forward unless food is eaten.
    // However, colliding with any internal body segment is fatal.
    const willHitBody = currentSnake.some((seg, idx) => {
      // Exclude tail if it will pop off on this step, UNLESS it's where food is (grow)
      if (idx === currentSnake.length - 1) {
        return false;
      }
      return seg.x === newHead.x && seg.y === newHead.y;
    });

    if (willHitBody) {
      handleGameOver();
      return;
    }

    // Check food consumption
    const currentFoods = foodsRef.current;
    const eatenIndex = currentFoods.findIndex((f) => f.x === newHead.x && f.y === newHead.y);

    const now = Date.now();
    // Filter out expired foods
    let remainingFoods = currentFoods.filter((f) => !f.expiresAt || f.expiresAt > now);

    if (eatenIndex !== -1) {
      const eatenFood = currentFoods[eatenIndex];
      remainingFoods = remainingFoods.filter((f) => f.id !== eatenFood.id);

      // Score multiplier based on difficulty
      let multiplier = 1;
      if (settingsRef.current.difficulty === 'HARD') multiplier = 1.5;
      if (settingsRef.current.difficulty === 'DYNAMIC') multiplier = 1.25;

      const earned = Math.round(eatenFood.points * multiplier);
      const newScore = scoreRef.current + earned;
      setScore(newScore);
      scoreRef.current = newScore;

      const newApplesEaten = applesEatenRef.current + 1;
      setApplesEaten(newApplesEaten);
      applesEatenRef.current = newApplesEaten;

      // Sound and visual feedback
      if (eatenFood.type === 'GOLDEN') {
        soundManager.playEatGolden();
        addParticles(newHead.x, newHead.y, '#fbbf24', 20);
      } else {
        soundManager.playEatClassic();
        addParticles(newHead.x, newHead.y, '#10b981', 14);
      }

      // Grow snake: new head added without popping tail
      const newSnake = [newHead, ...currentSnake];
      setSnake(newSnake);
      snakeRef.current = newSnake;

      // Check if classic food needs to respawn
      const hasClassic = remainingFoods.some((f) => f.type === 'CLASSIC');
      if (!hasClassic) {
        const nextClassic = spawnClassicFood(newSnake, remainingFoods, gridSize);
        remainingFoods.push(nextClassic);
      }

      // Check golden fruit trigger (every 5 apples eaten)
      if (newApplesEaten > 0 && newApplesEaten % 5 === 0 && newApplesEaten !== lastGoldenSpawnRef.current) {
        lastGoldenSpawnRef.current = newApplesEaten;
        const golden = spawnGoldenFood(newSnake, remainingFoods, gridSize);
        remainingFoods.push(golden);
      }

      setFoods(remainingFoods);
      foodsRef.current = remainingFoods;
    } else {
      // Normal step: add head, remove tail
      const newSnake = [newHead, ...currentSnake.slice(0, -1)];
      setSnake(newSnake);
      snakeRef.current = newSnake;

      // Ensure at least one classic food is always present
      const hasClassic = remainingFoods.some((f) => f.type === 'CLASSIC');
      if (!hasClassic) {
        const nextClassic = spawnClassicFood(newSnake, remainingFoods, gridSize);
        remainingFoods.push(nextClassic);
      }

      setFoods(remainingFoods);
      foodsRef.current = remainingFoods;
    }
  }, [addParticles, handleGameOver, spawnClassicFood, spawnGoldenFood]);

  // Main game tick timer
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = getCurrentStepInterval();
    const timer = setInterval(() => {
      stepGame();
    }, interval);

    return () => clearInterval(timer);
  }, [gameState, getCurrentStepInterval, stepGame]);

  // Particle physics animation frame loop
  useEffect(() => {
    if (particles.length === 0) return;

    let animId: number;
    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.04,
            y: p.y + p.vy * 0.04,
            life: p.life - 0.04,
            size: Math.max(0.5, p.size * 0.96),
          }))
          .filter((p) => p.life > 0)
      );
      animId = requestAnimationFrame(updateParticles);
    };

    animId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animId);
  }, [particles.length]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // Handle pause or start with space
      if (key === ' ' || key === 'Spacebar') {
        e.preventDefault();
        if (gameStateRef.current === 'TITLE_MENU' || gameStateRef.current === 'GAME_OVER') {
          startNewGame();
        } else if (gameStateRef.current === 'PLAYING' || gameStateRef.current === 'PAUSED') {
          togglePause();
        }
        return;
      }

      // Restart key
      if (key.toLowerCase() === 'r') {
        if (gameStateRef.current === 'GAME_OVER' || gameStateRef.current === 'PLAYING' || gameStateRef.current === 'PAUSED') {
          e.preventDefault();
          startNewGame();
          return;
        }
      }

      // Escape key to pause
      if (key === 'Escape') {
        e.preventDefault();
        if (gameStateRef.current === 'PLAYING' || gameStateRef.current === 'PAUSED') {
          togglePause();
        }
        return;
      }

      // Direction keys
      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          requestDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          requestDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          requestDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          requestDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [requestDirection, startNewGame, togglePause]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const clearStats = useCallback(() => {
    const freshStats: GameStats = {
      highScore: 0,
      totalGames: 0,
      totalApples: 0,
      maxSnakeLength: 3,
      runs: [],
    };
    setStats(freshStats);
    setIsNewHighScore(false);
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(freshStats));
    } catch {
      // Ignore
    }
  }, []);

  return {
    gameState,
    setGameState,
    snake,
    direction,
    foods,
    particles,
    score,
    applesEaten,
    isNewHighScore,
    screenShakeActive,
    settings,
    updateSettings,
    stats,
    clearStats,
    startNewGame,
    togglePause,
    requestDirection,
    stepInterval: getCurrentStepInterval(),
  };
}
