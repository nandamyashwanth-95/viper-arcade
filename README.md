# Snake Game (Viper Arcade)

A high-performance, polished retro-arcade Snake game built with React 19, TypeScript, Tailwind CSS, and HTML5 Canvas.

## Features

- **Responsive Controls**: Smooth steering with Arrow Keys, WASD, and buffered input queues to avoid dropped turns or self-collisions.
- **Mobile Directional Pad**: On-screen touch D-Pad powered by Pointer Events for zero touch-latency steering on phones and tablets.
- **Collision Detection**: Pixel-accurate self-intersection checks, fatal wall borders in Classic mode, and wrap-around in Portal mode.
- **Dynamic Food & Scoring**: Classic apples (+10 pts) and bonus Golden Star Fruits (+50 pts) with active countdown rings and sparkle particles.
- **Synthesized Audio**: Web Audio API retro chimes for bites, bonuses, pauses, and collision crunches (no external audio files needed).
- **Persistent Records**: High score, total apples, and historical run tracking saved in `localStorage`.
- **Customizable Themes**: Multiple snake skins (Emerald Viper, Cyber Violet, Solar Amber, Retro Phosphor) and arena sizes.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm` (comes bundled with Node.js)

### 1. Installation

Extract the ZIP archive and navigate to the project directory in your terminal:

```bash
cd sky-jumper-game
npm install
```

### 2. Run the Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```
(or the port shown in your terminal, typically `http://localhost:5173` or `http://localhost:3000`).

### 3. Build for Production

To create an optimized production build:

```bash
npm run build
```

The compiled assets will be created in the `dist/` directory.

### 4. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```text
├── index.html              # HTML entry point with fonts & metadata
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── src/
│   ├── App.tsx             # Main application component & layout
│   ├── main.tsx            # React application entry point
│   ├── index.css           # Tailwind CSS imports & custom typography
│   ├── types/
│   │   └── game.ts         # TypeScript models, enums & interfaces
│   ├── hooks/
│   │   └── useSnakeGame.ts # Game loop, collision detection & state machine
│   ├── utils/
│   │   ├── sound.ts        # Synthesized Web Audio API sound effects
│   │   └── theme.ts        # Color palettes and snake skin definitions
│   └── components/
│       ├── Navbar.tsx           # Top navigation bar
│       ├── SnakeCanvas.tsx      # Retina HTML5 Canvas game renderer
│       ├── GameHUD.tsx          # Real-time score, timer & quick actions
│       ├── MobileControls.tsx   # Touch-enabled virtual directional pad
│       ├── TitleOverlay.tsx     # Start screen & difficulty selector
│       ├── PauseOverlay.tsx     # Pause screen
│       ├── GameOverOverlay.tsx  # Game over & record announcement card
│       ├── SettingsModal.tsx    # Skins, grid size & audio settings
│       ├── StatsModal.tsx       # Local stats & run history
│       └── HowToPlayModal.tsx   # Controls & scoring rules guide
└── public/                 # Static assets
```
