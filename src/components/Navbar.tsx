import React from 'react';
import { Play } from 'lucide-react';

interface NavbarProps {
  onNewGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewGame,
  onOpenHowToPlay,
  onOpenStats,
  onOpenSettings,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="text-lg font-bold tracking-tight text-white font-display">
            Viper Arcade
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-300">
          <button
            onClick={onNewGame}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Arena
          </button>
          <button
            onClick={onOpenHowToPlay}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            How to Play
          </button>
          <button
            onClick={onOpenStats}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            High Scores
          </button>
          <button
            onClick={onOpenSettings}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Settings
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          <button
            onClick={onNewGame}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>New Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
