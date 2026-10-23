import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction } from '../types/game';

interface MobileControlsProps {
  onDirection: (direction: Direction) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onDirection }) => {
  const handlePress = (e: React.PointerEvent<HTMLButtonElement>, dir: Direction) => {
    e.preventDefault();
    onDirection(dir);
  };

  return (
    <div className="w-full max-w-[280px] mx-auto pt-1 select-none md:hidden animate-fade-in">
      <div className="grid grid-cols-3 gap-2">
        {/* Row 1: Empty - Up - Empty */}
        <div />
        <button
          type="button"
          onPointerDown={(e) => handlePress(e, 'UP')}
          className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-850 active:bg-emerald-600 border border-slate-800 active:border-emerald-500 text-slate-200 active:text-white flex items-center justify-center transition-all shadow-lg active:scale-95 touch-manipulation cursor-pointer"
          aria-label="Steer Up"
        >
          <ArrowUp className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div />

        {/* Row 2: Left - Center Hub - Right */}
        <button
          type="button"
          onPointerDown={(e) => handlePress(e, 'LEFT')}
          className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-850 active:bg-emerald-600 border border-slate-800 active:border-emerald-500 text-slate-200 active:text-white flex items-center justify-center transition-all shadow-lg active:scale-95 touch-manipulation cursor-pointer"
          aria-label="Steer Left"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700/80" />
        </div>
        <button
          type="button"
          onPointerDown={(e) => handlePress(e, 'RIGHT')}
          className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-850 active:bg-emerald-600 border border-slate-800 active:border-emerald-500 text-slate-200 active:text-white flex items-center justify-center transition-all shadow-lg active:scale-95 touch-manipulation cursor-pointer"
          aria-label="Steer Right"
        >
          <ArrowRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Row 3: Empty - Down - Empty */}
        <div />
        <button
          type="button"
          onPointerDown={(e) => handlePress(e, 'DOWN')}
          className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-850 active:bg-emerald-600 border border-slate-800 active:border-emerald-500 text-slate-200 active:text-white flex items-center justify-center transition-all shadow-lg active:scale-95 touch-manipulation cursor-pointer"
          aria-label="Steer Down"
        >
          <ArrowDown className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div />
      </div>
    </div>
  );
};
