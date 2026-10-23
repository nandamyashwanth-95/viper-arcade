import React, { useState } from 'react';
import { X, Trophy, Apple, Award, Flame, Trash2, Check } from 'lucide-react';
import { GameStats } from '../types/game';

interface StatsModalProps {
  stats: GameStats;
  isOpen: boolean;
  onClose: () => void;
  onClearStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  stats,
  isOpen,
  onClose,
  onClearStats,
}) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [isResetDone, setIsResetDone] = useState(false);

  if (!isOpen) return null;

  const handleConfirmReset = () => {
    onClearStats();
    setIsConfirmingReset(false);
    setIsResetDone(true);
    setTimeout(() => {
      setIsResetDone(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-semibold text-white">Player Records & Stats</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>All-Time High</span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
                {stats.highScore}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Apple className="w-3.5 h-3.5 text-red-400" />
                <span>Total Apples</span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-100">
                {stats.totalApples}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Max Snake Length</span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-100">
                {stats.maxSnakeLength}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Award className="w-3.5 h-3.5 text-blue-400" />
                <span>Games Played</span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-100">
                {stats.totalGames}
              </div>
            </div>
          </div>

          {/* Recent Runs List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Recent Runs</div>
            {stats.runs && stats.runs.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {stats.runs.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold font-mono tabular-nums text-emerald-400 text-sm">
                        {run.score}
                      </span>
                      <div className="text-slate-400 text-[11px]">
                        <span>{run.applesEaten} apples</span>
                        <span className="mx-1.5 text-slate-700">·</span>
                        <span>len {run.length}</span>
                        <span className="mx-1.5 text-slate-700">·</span>
                        <span className="capitalize">{run.difficulty.toLowerCase()}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{run.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/30 rounded-lg border border-slate-800/40">
                No runs recorded yet. Start playing to log your journey!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3">
          {isResetDone ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Stats wiped clean</span>
            </div>
          ) : isConfirmingReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400 font-medium">Wipe all stats?</span>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingReset(false)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirmingReset(true)}
              className="text-xs text-red-400/90 hover:text-red-300 flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer border border-transparent hover:border-red-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Stats</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
