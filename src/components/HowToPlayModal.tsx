import React from 'react';
import { X, HelpCircle, Keyboard, Apple, Sparkles, ShieldAlert } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">How to Play Viper</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs text-slate-300">
          {/* Controls */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Keyboard className="w-4 h-4 text-emerald-400" />
              <span>Keyboard & Touch Controls</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-400">Steer Up:</span>
                <span className="ml-1.5 font-mono text-emerald-400 font-semibold">↑ / W</span>
              </div>
              <div>
                <span className="text-slate-400">Steer Down:</span>
                <span className="ml-1.5 font-mono text-emerald-400 font-semibold">↓ / S</span>
              </div>
              <div>
                <span className="text-slate-400">Steer Left:</span>
                <span className="ml-1.5 font-mono text-emerald-400 font-semibold">← / A</span>
              </div>
              <div>
                <span className="text-slate-400">Steer Right:</span>
                <span className="ml-1.5 font-mono text-emerald-400 font-semibold">→ / D</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Pause / Resume:</span>
                  <span className="ml-1.5 font-mono text-amber-400 font-semibold">Space / Esc</span>
                </div>
                <div>
                  <span className="text-slate-400">Restart:</span>
                  <span className="ml-1.5 font-mono text-amber-400 font-semibold">R</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              * On mobile devices, use the intuitive directional touch pad below the board.
            </p>
          </div>

          {/* Food items */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Apple className="w-4 h-4 text-red-400" />
              <span>Food & Points</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-100">Classic Apple (+10 Pts)</div>
                  <div className="text-[11px] text-slate-400">
                    Grows the snake by one segment and advances your score.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-300">Golden Star Fruit (+50 Pts)</div>
                  <div className="text-[11px] text-slate-400">
                    Rare bonus item that spawns every 5 apples. Lasts 8 seconds before vanishing!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collision Detection */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Collision Rules</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
              <div>
                <strong className="text-slate-200">Self-Collision:</strong> Running into your own body triggers immediate Game Over.
              </div>
              <div>
                <strong className="text-slate-200">Classic Walls:</strong> Hitting any perimeter boundary ends your run.
              </div>
              <div>
                <strong className="text-slate-200">Portal Mode:</strong> Pass smoothly through one wall edge to emerge on the opposing side!
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
