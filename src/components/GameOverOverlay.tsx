import React from 'react';
import { RotateCcw, Trophy, Award, SlidersHorizontal } from 'lucide-react';
import { GameSettings } from '../types/game';

interface GameOverOverlayProps {
  score: number;
  highScore: number;
  applesEaten: number;
  snakeLength: number;
  isNewHighScore: boolean;
  settings: GameSettings;
  onPlayAgain: () => void;
  onOpenSettings: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  score,
  highScore,
  applesEaten,
  snakeLength,
  isNewHighScore,
  settings,
  onPlayAgain,
  onOpenSettings,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-20 animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-5">
        {/* Header Icon & Title */}
        <div className="space-y-1">
          {isNewHighScore ? (
            <div className="inline-flex p-3 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 mb-1">
              <Trophy className="w-8 h-8" />
            </div>
          ) : (
            <div className="inline-flex p-3 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 mb-1">
              <Award className="w-8 h-8" />
            </div>
          )}

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isNewHighScore ? 'New High Score!' : 'Game Over'}
          </h2>
          <p className="text-xs text-slate-400">
            {isNewHighScore
              ? 'Outstanding reflexes! You set a new personal record.'
              : 'Collision detected. Better luck on the next run!'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Final Score</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">{score}</div>
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Best Score</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-200">{highScore}</div>
          </div>
          <div className="text-left pt-2 border-t border-slate-800/60">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Apples Eaten</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-slate-300">{applesEaten}</div>
          </div>
          <div className="text-left pt-2 border-t border-slate-800/60">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Snake Length</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-slate-300">{snakeLength}</div>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>{settings.difficulty.toLowerCase()} mode</span>
          <span>·</span>
          <span>{settings.borderMode === 'CLASSIC_WALLS' ? 'classic walls' : 'portal wrap'}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
            <span className="text-[10px] opacity-75 font-mono ml-1">(Space / Enter)</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors border border-slate-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Game Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
