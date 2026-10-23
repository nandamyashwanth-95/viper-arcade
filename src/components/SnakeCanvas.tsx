import React, { useRef, useEffect } from 'react';
import { Coordinate, Direction, FoodItem, Particle, GameSettings } from '../types/game';
import { SNAKE_SKINS } from '../utils/theme';

interface SnakeCanvasProps {
  snake: Coordinate[];
  direction: Direction;
  foods: FoodItem[];
  particles: Particle[];
  settings: GameSettings;
  screenShakeActive: boolean;
}

export const SnakeCanvas: React.FC<SnakeCanvasProps> = ({
  snake,
  direction,
  foods,
  particles,
  settings,
  screenShakeActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const tongueTimerRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Screen shake translation
      if (screenShakeActive) {
        const shakeX = (Math.random() - 0.5) * 8;
        const shakeY = (Math.random() - 0.5) * 8;
        ctx.translate(shakeX, shakeY);
      }

      const width = displayWidth;
      const height = displayHeight;
      const gridSize = settings.gridSize;
      const cellSize = width / gridSize;

      // 1. Background Arena
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Grid Lines or Dots
      if (settings.showGridLines) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= gridSize; i++) {
          const pos = i * cellSize;
          ctx.moveTo(pos, 0);
          ctx.lineTo(pos, height);
          ctx.moveTo(0, pos);
          ctx.lineTo(width, pos);
        }
        ctx.stroke();

        // Subtle micro crosshairs at intersections
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        for (let x = 0; x <= gridSize; x += 4) {
          for (let y = 0; y <= gridSize; y += 4) {
            ctx.fillRect(x * cellSize - 1, y * cellSize - 1, 2, 2);
          }
        }
      }

      // 3. Render Food Items
      const now = Date.now();
      foods.forEach((food) => {
        const fx = food.x * cellSize + cellSize / 2;
        const fy = food.y * cellSize + cellSize / 2;
        const radius = (cellSize * 0.42);

        if (food.type === 'CLASSIC') {
          // Classic Red Apple
          // Ambient soft glow
          ctx.save();
          ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
          ctx.shadowBlur = 12;

          // Apple Body Gradient
          const appleGrad = ctx.createRadialGradient(
            fx - radius * 0.3,
            fy - radius * 0.3,
            radius * 0.1,
            fx,
            fy,
            radius
          );
          appleGrad.addColorStop(0, '#f87171');
          appleGrad.addColorStop(0.5, '#ef4444');
          appleGrad.addColorStop(1, '#b91c1c');

          ctx.fillStyle = appleGrad;
          ctx.beginPath();
          ctx.arc(fx, fy + radius * 0.1, radius * 0.85, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Apple stem
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = Math.max(2, cellSize * 0.08);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(fx, fy - radius * 0.6);
          ctx.quadraticCurveTo(fx + radius * 0.3, fy - radius * 1.1, fx + radius * 0.5, fy - radius * 0.9);
          ctx.stroke();

          // Tiny green leaf
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.ellipse(fx + radius * 0.35, fy - radius * 0.85, radius * 0.3, radius * 0.15, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();

          // Specular highlight shine
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(fx - radius * 0.35, fy - radius * 0.2, radius * 0.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (food.type === 'GOLDEN') {
          // Golden Star Fruit
          const pulse = (Math.sin(now / 150) + 1) * 0.5;
          const starRadius = radius * (1 + pulse * 0.15);

          ctx.save();
          ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
          ctx.shadowBlur = 18 + pulse * 8;

          // Radial gold glow
          const goldGrad = ctx.createRadialGradient(
            fx - starRadius * 0.2,
            fy - starRadius * 0.2,
            starRadius * 0.1,
            fx,
            fy,
            starRadius
          );
          goldGrad.addColorStop(0, '#fef08a');
          goldGrad.addColorStop(0.5, '#f59e0b');
          goldGrad.addColorStop(1, '#b45309');

          ctx.fillStyle = goldGrad;

          // Draw 5-pointed star
          const spikes = 5;
          const outerRadius = starRadius;
          const innerRadius = starRadius * 0.48;
          let rot = (Math.PI / 2) * 3 + now * 0.0015;
          const step = Math.PI / spikes;

          ctx.beginPath();
          ctx.moveTo(fx, fy - outerRadius);
          for (let i = 0; i < spikes; i++) {
            let x = fx + Math.cos(rot) * outerRadius;
            let y = fy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = fx + Math.cos(rot) * innerRadius;
            y = fy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.lineTo(fx, fy - outerRadius);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Expiration countdown ring if expiresAt exists
          if (food.expiresAt && food.duration) {
            const timeLeft = Math.max(0, food.expiresAt - now);
            const fraction = timeLeft / food.duration;

            ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(fx, fy, radius * 1.35, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * fraction);
            ctx.stroke();
          }
        }
      });

      // 4. Render Snake
      const skinPalette = SNAKE_SKINS[settings.skin] || SNAKE_SKINS.EMERALD;

      if (snake.length > 0) {
        // Render body segments from tail to neck
        for (let i = snake.length - 1; i >= 1; i--) {
          const seg = snake[i];
          const segX = seg.x * cellSize + cellSize / 2;
          const segY = seg.y * cellSize + cellSize / 2;

          // Interpolate color from head to tail
          const t = i / Math.max(snake.length, 1);
          // Scale size slightly towards tail for organic taper
          const segRadius = cellSize * (0.44 - t * 0.08);

          ctx.save();
          // Connect to next segment smoothly
          const prevSeg = snake[i - 1];
          const px = prevSeg.x * cellSize + cellSize / 2;
          const py = prevSeg.y * cellSize + cellSize / 2;

          // Check for portal wrap discontinuity
          const dx = Math.abs(seg.x - prevSeg.x);
          const dy = Math.abs(seg.y - prevSeg.y);
          const isWrapped = dx > 1 || dy > 1;

          if (!isWrapped) {
            ctx.strokeStyle = t < 0.5 ? skinPalette.bodyStart : skinPalette.bodyEnd;
            ctx.lineWidth = segRadius * 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(segX, segY);
            ctx.lineTo(px, py);
            ctx.stroke();
          }

          // Segment circle with subtle shine
          ctx.fillStyle = t < 0.5 ? skinPalette.bodyStart : skinPalette.bodyEnd;
          ctx.beginPath();
          ctx.arc(segX, segY, segRadius, 0, Math.PI * 2);
          ctx.fill();

          // Subtle center spine highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.beginPath();
          ctx.arc(segX, segY, segRadius * 0.45, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // Render Snake Head
        const head = snake[0];
        const hx = head.x * cellSize + cellSize / 2;
        const hy = head.y * cellSize + cellSize / 2;
        const headRadius = cellSize * 0.46;

        ctx.save();
        ctx.shadowColor = skinPalette.glow;
        ctx.shadowBlur = 12;

        ctx.fillStyle = skinPalette.head;
        ctx.beginPath();
        ctx.arc(hx, hy, headRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Animated Snake Tongue flicking periodically
        tongueTimerRef.current = (tongueTimerRef.current + 1) % 90;
        const isFlicking = tongueTimerRef.current > 75;

        if (isFlicking) {
          ctx.save();
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = Math.max(1.5, cellSize * 0.08);
          ctx.lineCap = 'round';

          let tx = hx;
          let ty = hy;
          let fork1X = hx;
          let fork1Y = hy;
          let fork2X = hx;
          let fork2Y = hy;
          const reach = headRadius * 1.5;
          const fork = headRadius * 0.35;

          if (direction === 'RIGHT') {
            tx = hx + reach;
            fork1X = tx + fork;
            fork1Y = ty - fork;
            fork2X = tx + fork;
            fork2Y = ty + fork;
          } else if (direction === 'LEFT') {
            tx = hx - reach;
            fork1X = tx - fork;
            fork1Y = ty - fork;
            fork2X = tx - fork;
            fork2Y = ty + fork;
          } else if (direction === 'UP') {
            ty = hy - reach;
            fork1X = tx - fork;
            fork1Y = ty - fork;
            fork2X = tx + fork;
            fork2Y = ty - fork;
          } else if (direction === 'DOWN') {
            ty = hy + reach;
            fork1X = tx - fork;
            fork1Y = ty + fork;
            fork2X = tx + fork;
            fork2Y = ty + fork;
          }

          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(tx, ty);
          ctx.moveTo(tx, ty);
          ctx.lineTo(fork1X, fork1Y);
          ctx.moveTo(tx, ty);
          ctx.lineTo(fork2X, fork2Y);
          ctx.stroke();
          ctx.restore();
        }

        // Eyes & Pupils looking in the direction of motion
        let eyeOffset1X = 0;
        let eyeOffset1Y = 0;
        let eyeOffset2X = 0;
        let eyeOffset2Y = 0;
        let pupilShiftX = 0;
        let pupilShiftY = 0;

        const eyeDistance = headRadius * 0.52;
        const forwardOffset = headRadius * 0.32;
        const eyeRadius = headRadius * 0.28;
        const pupilRadius = eyeRadius * 0.55;

        if (direction === 'RIGHT') {
          eyeOffset1X = forwardOffset;
          eyeOffset1Y = -eyeDistance;
          eyeOffset2X = forwardOffset;
          eyeOffset2Y = eyeDistance;
          pupilShiftX = eyeRadius * 0.35;
        } else if (direction === 'LEFT') {
          eyeOffset1X = -forwardOffset;
          eyeOffset1Y = -eyeDistance;
          eyeOffset2X = -forwardOffset;
          eyeOffset2Y = eyeDistance;
          pupilShiftX = -eyeRadius * 0.35;
        } else if (direction === 'UP') {
          eyeOffset1X = -eyeDistance;
          eyeOffset1Y = -forwardOffset;
          eyeOffset2X = eyeDistance;
          eyeOffset2Y = -forwardOffset;
          pupilShiftY = -eyeRadius * 0.35;
        } else if (direction === 'DOWN') {
          eyeOffset1X = -eyeDistance;
          eyeOffset1Y = forwardOffset;
          eyeOffset2X = eyeDistance;
          eyeOffset2Y = forwardOffset;
          pupilShiftY = eyeRadius * 0.35;
        }

        // Draw Left Eye
        ctx.fillStyle = skinPalette.eye;
        ctx.beginPath();
        ctx.arc(hx + eyeOffset1X, hy + eyeOffset1Y, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw Left Pupil
        ctx.fillStyle = skinPalette.pupil;
        ctx.beginPath();
        ctx.arc(hx + eyeOffset1X + pupilShiftX, hy + eyeOffset1Y + pupilShiftY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();

        // Left Eye highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(hx + eyeOffset1X + pupilShiftX - 1, hy + eyeOffset1Y + pupilShiftY - 1, pupilRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Draw Right Eye
        ctx.fillStyle = skinPalette.eye;
        ctx.beginPath();
        ctx.arc(hx + eyeOffset2X, hy + eyeOffset2Y, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw Right Pupil
        ctx.fillStyle = skinPalette.pupil;
        ctx.beginPath();
        ctx.arc(hx + eyeOffset2X + pupilShiftX, hy + eyeOffset2Y + pupilShiftY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();

        // Right Eye highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(hx + eyeOffset2X + pupilShiftX - 1, hy + eyeOffset2Y + pupilShiftY - 1, pupilRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Render Floating Particles
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x * cellSize, p.y * cellSize, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 6. Border Framing
      if (settings.borderMode === 'CLASSIC_WALLS') {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);
      } else {
        // Portal wrap: pulsing cyan/violet subtle perimeter dashes
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(1, 1, width - 2, height - 2);
        ctx.setLineDash([]);
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [snake, direction, foods, particles, settings, screenShakeActive]);

  return (
    <div className="relative w-full aspect-square max-w-[620px] mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-default select-none touch-none"
      />
    </div>
  );
};
