export type Coordinate = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type GameDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'DYNAMIC';

export type BorderMode = 'CLASSIC_WALLS' | 'PORTAL_WRAP';

export type SnakeSkin = 'EMERALD' | 'CYBER_VIOLET' | 'SOLAR_AMBER' | 'RETRO_MATRIX';

export type FoodType = 'CLASSIC' | 'GOLDEN' | 'SPEED_BOOST';

export interface FoodItem {
  id: string;
  x: number;
  y: number;
  type: FoodType;
  points: number;
  expiresAt?: number; // timestamp in ms
  duration?: number;  // total duration in ms
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

export interface ScoreRun {
  id: string;
  score: number;
  applesEaten: number;
  length: number;
  difficulty: GameDifficulty;
  borderMode: BorderMode;
  date: string;
}

export interface GameSettings {
  difficulty: GameDifficulty;
  borderMode: BorderMode;
  gridSize: number;
  skin: SnakeSkin;
  soundEnabled: boolean;
  screenShake: boolean;
  showGridLines: boolean;
}

export interface GameStats {
  highScore: number;
  totalGames: number;
  totalApples: number;
  maxSnakeLength: number;
  runs: ScoreRun[];
}
