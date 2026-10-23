import React from 'react';
import { Play, Shield, Zap, Sparkles } from 'lucide-react';
import { GameDifficulty, BorderMode, GameSettings } from '../types/game';

interface TitleOverlayProps {
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onStartGame: () => void;
}

export const TitleOverlay: React.FC<TitleOverlayProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-start md:items-center justify-center p-2 md:p-4 z-20 animate-fade-in overflow-hidden">
      <div className="w-full max-w-md max-h-full overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl space-y-4 md:space-y-5 text-center">
        {/* Title branding */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Classic Arcade Experience</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Viper Arcade
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Guide the serpent, collect apples, dodge obstacles, and master lightning-fast reflexes.
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-2 text-left bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            Select Difficulty
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {(['EASY', 'MEDIUM', 'HARD', 'DYNAMIC'] as GameDifficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => onUpdateSettings({ difficulty: diff })}
                className={`py-2 px-1 text-xs font-medium rounded-lg transition-all cursor-pointer capitalize text-center ${
                  settings.difficulty === diff
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {diff.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>
              {settings.difficulty === 'EASY' && 'Relaxed pace — ideal for beginners.'}
              {settings.difficulty === 'MEDIUM' && 'Classic balanced arcade speed.'}
              {settings.difficulty === 'HARD' && 'High-speed challenge for seasoned players (+50% score).'}
              {settings.difficulty === 'DYNAMIC' && 'Speed ramps up dynamically with each apple!'}
            </span>
          </div>
        </div>

        {/* Wall Mode Quick Toggle */}
        <div className="flex items-center justify-between text-left bg-slate-950/60 px-3.5 py-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-xs font-medium text-slate-200">Arena Wall Collision</div>
              <div className="text-[10px] text-slate-400">
                {settings.borderMode === 'CLASSIC_WALLS' ? 'Hitting borders triggers Game Over' : 'Snake wraps through edges'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg">
            {(['CLASSIC_WALLS', 'PORTAL_WRAP'] as BorderMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onUpdateSettings({ borderMode: mode })}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  settings.borderMode === mode
                    ? 'bg-slate-700 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'CLASSIC_WALLS' ? 'Walls' : 'Portal'}
              </button>
            ))}
          </div>
        </div>

        {/* Start Game CTA */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onStartGame}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Game</span>
            <span className="text-[11px] opacity-75 font-mono ml-1">(Space / Enter)</span>
          </button>

          <p className="text-[11px] text-slate-500">
            Use <span className="text-slate-400 font-mono">Arrow Keys</span> or <span className="text-slate-400 font-mono">WASD</span> to steer
          </p>
        </div>
      </div>
    </div>
  );
};
