import { useState } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { SnakeCanvas } from './components/SnakeCanvas';
import { GameHUD } from './components/GameHUD';
import { GameOverOverlay } from './components/GameOverOverlay';
import { PauseOverlay } from './components/PauseOverlay';
import { TitleOverlay } from './components/TitleOverlay';
import { MobileControls } from './components/MobileControls';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { Navbar } from './components/Navbar';
import { Keyboard, Shield, Zap, Sparkles } from 'lucide-react';

export default function App() {
  const {
    gameState,
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
  } = useSnakeGame();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 3-Zone Top Bar */}
      <Navbar
        onNewGame={startNewGame}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Game Arena Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col items-center justify-center gap-5">
        {/* Heads Up Display */}
        <GameHUD
          score={score}
          highScore={stats.highScore}
          applesEaten={applesEaten}
          snakeLength={snake.length}
          gameState={gameState}
          settings={settings}
          foods={foods}
          onTogglePause={togglePause}
          onRestart={startNewGame}
          onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenHelp={() => setIsHowToPlayOpen(true)}
        />

        {/* The Game Canvas & In-Game Overlays */}
        <div className="relative w-full max-w-[620px] mx-auto">
          <SnakeCanvas
            snake={snake}
            direction={direction}
            foods={foods}
            particles={particles}
            settings={settings}
            screenShakeActive={screenShakeActive}
          />

          {/* Overlays */}
          {gameState === 'TITLE_MENU' && (
            <TitleOverlay
              settings={settings}
              onUpdateSettings={updateSettings}
              onStartGame={startNewGame}
            />
          )}

          {gameState === 'PAUSED' && (
            <PauseOverlay
              onResume={togglePause}
              onRestart={startNewGame}
            />
          )}

          {gameState === 'GAME_OVER' && (
            <GameOverOverlay
              score={score}
              highScore={stats.highScore}
              applesEaten={applesEaten}
              snakeLength={snake.length}
              isNewHighScore={isNewHighScore}
              settings={settings}
              onPlayAgain={startNewGame}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}
        </div>

        {/* Touchpad for mobile/tablets - displayed after user starts the game */}
        {gameState !== 'TITLE_MENU' && (
          <MobileControls onDirection={requestDirection} />
        )}

        {/* Information & Feature Summary (Anti-Slop Clean Typography) */}
        <div className="w-full max-w-[620px] mx-auto pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Responsive Steering</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Buffered input queue allows rapid directional changes with zero dropped keystrokes.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Collision Engine</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Pixel-precise self-intersection checks and configurable portal wrap mechanics.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Bonus Star Fruits</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Timed golden fruits appear every 5 apples, rewarding quick path planning with +50 points.
              </p>
            </div>
          </div>

          {/* Clean footer line */}
          <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <span>Arrow Keys / WASD to move</span>
            <span aria-hidden="true">·</span>
            <span>Space to pause</span>
            <span aria-hidden="true">·</span>
            <span>R to restart</span>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={updateSettings}
      />

      <StatsModal
        stats={stats}
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        onClearStats={clearStats}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
