import React from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Pause,
  Play,
  SlidersHorizontal,
  Trophy,
  HelpCircle,
  BarChart2,
} from 'lucide-react';
import { GameState, GameSettings, FoodItem } from '../types/game';

interface GameHUDProps {
  score: number;
  highScore: number;
  applesEaten: number;
  snakeLength: number;
  gameState: GameState;
  settings: GameSettings;
  foods: FoodItem[];
  onTogglePause: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  highScore,
  applesEaten,
  snakeLength,
  gameState,
  settings,
  foods,
  onTogglePause,
  onRestart,
  onToggleSound,
  onOpenSettings,
  onOpenStats,
  onOpenHelp,
}) => {
  const activeGoldenFood = foods.find((f) => f.type === 'GOLDEN' && f.expiresAt && f.expiresAt > Date.now());

  return (
    <div className="w-full max-w-[620px] mx-auto space-y-3">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-2 px-1">
        {/* Left Side: Score & High Score */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Score</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 leading-tight">
              {score}
            </div>
          </div>

          <div className="h-8 w-[1px] bg-slate-800" />

          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Best</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-200 leading-tight">
              {highScore}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          {gameState === 'PLAYING' || gameState === 'PAUSED' ? (
            <button
              onClick={onTogglePause}
              title={gameState === 'PAUSED' ? 'Resume (Space)' : 'Pause (Space)'}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700/60"
            >
              {gameState === 'PAUSED' ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            </button>
          ) : null}

          <button
            onClick={onRestart}
            title="Restart Game (R)"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700/60"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700/60"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={onOpenStats}
            title="Player Stats"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700/60"
          >
            <BarChart2 className="w-4 h-4 text-slate-300" />
          </button>

          <button
            onClick={onOpenSettings}
            title="Game Settings"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700/60"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-300" />
          </button>

          <button
            onClick={onOpenHelp}
            title="How to Play"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700/60"
          >
            <HelpCircle className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Sub HUD: Metadata indicators */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2 py-1.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span>Apples:</span>
            <span className="text-slate-200 font-mono tabular-nums font-medium">{applesEaten}</span>
          </div>
          <span className="text-slate-700">·</span>
          <div>
            <span>Length:</span>
            <span className="text-slate-200 font-mono tabular-nums font-medium ml-1">{snakeLength}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>{settings.difficulty.toLowerCase()}</span>
          <span className="text-slate-700">·</span>
          <span>{settings.borderMode === 'CLASSIC_WALLS' ? 'Classic Walls' : 'Portal Wrap'}</span>
        </div>
      </div>

      {/* Golden Fruit Active Alert Banner */}
      {activeGoldenFood && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">★ GOLDEN FRUIT ACTIVE</span>
            <span>+50 Bonus Points</span>
          </div>
          <span className="font-mono tabular-nums text-amber-200">Hurry!</span>
        </div>
      )}
    </div>
  );
};
