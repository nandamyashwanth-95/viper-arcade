import React from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { GameSettings, GameDifficulty, BorderMode, SnakeSkin } from '../types/game';
import { SNAKE_SKINS } from '../utils/theme';

interface SettingsModalProps {
  settings: GameSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Game Settings</h3>
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
          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">Game Difficulty</label>
            <div className="grid grid-cols-4 gap-2">
              {(['EASY', 'MEDIUM', 'HARD', 'DYNAMIC'] as GameDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => onUpdateSettings({ difficulty: diff })}
                  className={`py-2 px-2 text-xs font-medium rounded-lg capitalize border transition-all cursor-pointer ${
                    settings.difficulty === diff
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Border Mode */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">Arena Border Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'CLASSIC_WALLS' as BorderMode, label: 'Classic Walls', desc: 'Hitting wall ends game' },
                { id: 'PORTAL_WRAP' as BorderMode, label: 'Portal Wrap', desc: 'Pass through edges' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onUpdateSettings({ borderMode: mode.id })}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    settings.borderMode === mode.id
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-200">{mode.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Snake Skin */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">Snake Visual Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SNAKE_SKINS) as SnakeSkin[]).map((skinKey) => {
                const palette = SNAKE_SKINS[skinKey];
                const isSelected = settings.skin === skinKey;
                return (
                  <button
                    key={skinKey}
                    onClick={() => onUpdateSettings({ skin: skinKey })}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500'
                        : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center -space-x-1">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-900 inline-block shadow-sm"
                          style={{ backgroundColor: palette.head }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-900 inline-block shadow-sm"
                          style={{ backgroundColor: palette.bodyStart }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-200">{palette.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Size */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">Arena Grid Dimensions</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { size: 16, label: 'Compact (16×16)' },
                { size: 20, label: 'Standard (20×20)' },
                { size: 24, label: 'Expansive (24×24)' },
              ].map((g) => (
                <button
                  key={g.size}
                  onClick={() => onUpdateSettings({ gridSize: g.size })}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    settings.gridSize === g.size
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-200">Synthesized Sound FX</div>
                <div className="text-[10px] text-slate-400">Audio beeps for apple munch & collisions</div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-200">Screen Shake on Impact</div>
                <div className="text-[10px] text-slate-400">Camera rumble effect when collision occurs</div>
              </div>
              <input
                type="checkbox"
                checked={settings.screenShake}
                onChange={(e) => onUpdateSettings({ screenShake: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-200">Display Grid Coordinate Lines</div>
                <div className="text-[10px] text-slate-400">Show subtle grid lines on the playfield</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showGridLines}
                onChange={(e) => onUpdateSettings({ showGridLines: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
