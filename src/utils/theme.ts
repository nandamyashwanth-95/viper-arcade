import { SnakeSkin } from '../types/game';

export interface SkinPalette {
  name: string;
  head: string;
  bodyStart: string;
  bodyEnd: string;
  eye: string;
  pupil: string;
  glow: string;
  accent: string;
}

export const SNAKE_SKINS: Record<SnakeSkin, SkinPalette> = {
  EMERALD: {
    name: 'Emerald Viper',
    head: '#10b981',
    bodyStart: '#059669',
    bodyEnd: '#047857',
    eye: '#ffffff',
    pupil: '#022c22',
    glow: 'rgba(16, 185, 129, 0.4)',
    accent: '#34d399',
  },
  CYBER_VIOLET: {
    name: 'Cyber Violet',
    head: '#a855f7',
    bodyStart: '#9333ea',
    bodyEnd: '#7e22ce',
    eye: '#ffffff',
    pupil: '#2e1065',
    glow: 'rgba(168, 85, 247, 0.4)',
    accent: '#c084fc',
  },
  SOLAR_AMBER: {
    name: 'Solar Amber',
    head: '#f59e0b',
    bodyStart: '#d97706',
    bodyEnd: '#b45309',
    eye: '#ffffff',
    pupil: '#451a03',
    glow: 'rgba(245, 158, 11, 0.4)',
    accent: '#fbbf24',
  },
  RETRO_MATRIX: {
    name: 'Retro Phosphor',
    head: '#22c55e',
    bodyStart: '#16a34a',
    bodyEnd: '#15803d',
    eye: '#dcfce7',
    pupil: '#052e16',
    glow: 'rgba(34, 197, 94, 0.4)',
    accent: '#4ade80',
  },
};
