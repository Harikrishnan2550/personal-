'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/audio';

interface StarConstellationSceneProps {
  onComplete: () => void;
}

interface StarNode {
  id: number;
  x: number;
  y: number;
  label: string;
  connected: boolean;
}

export default function StarConstellationScene({ onComplete }: StarConstellationSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [connectedCount, setConnectedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Constellation Stars (Heart Shape in 360x420 bounds)
  const [stars, setStars] = useState<StarNode[]>([
    { id: 1, x: 180, y: 320, label: 'Destiny', connected: false }, // bottom tip
    { id: 2, x: 90, y: 220, label: 'Laughter', connected: false },  // left mid
    { id: 3, x: 120, y: 130, label: 'Moments', connected: false },  // left top
    { id: 4, x: 180, y: 170, label: 'Forever', connected: false },  // center cleft
    { id: 5, x: 240, y: 130, label: 'Magic', connected: false },    // right top
    { id: 6, x: 270, y: 220, label: 'Cherish', connected: false },  // right mid
  ]);

  // Particle trail system for finger sparkler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    const colors = ['#ffe6b3', '#ffffff', '#ff4d6d', '#f7c5d1', '#ffd700'];

    let isPointerDown = false;

    const addSparkles = (x: number, y: number) => {
      sound?.playSparklerSizzle();
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.5 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: 25 + Math.random() * 20,
        });
      }

      // Check proximity to stars
      setStars((prev) => {
        let changed = false;
        const updated = prev.map((s) => {
          const dist = Math.hypot(s.x - x, s.y - y);
          if (dist < 38 && !s.connected) {
            changed = true;
            sound?.playFairyChime();
            return { ...s, connected: true };
          }
          return s;
        });

        if (changed) {
          const count = updated.filter((s) => s.connected).length;
          setConnectedCount(count);
          if (count === updated.length) {
            sound?.playHeartHit();
            setIsCompleted(true);
          }
        }
        return updated;
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addSparkles(x, y);
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', (e) => {
      isPointerDown = true;
      handlePointerMove(e);
    });

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw active particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.size *= 0.96;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife || p.size < 0.2) {
          particles.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden bg-[#050507]">
      {/* Ambient background universe glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(158,27,50,0.12)_0%,rgba(15,8,18,0.7)_50%,#050507_100%)] pointer-events-none" />

      {/* Chapter Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-20 text-center mt-2"
      >
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Chapter V • Constellation of Us
        </span>
        <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7c5d1] to-[#ffe6b3]">
          Connect Our Stars
        </h2>
        <p className="text-xs text-[#f7c5d1]/60 font-sans tracking-wider mt-0.5">
          Drag your finger to trace the sparkler path
        </p>
      </motion.div>

      {/* Interactive Constellation Canvas Area */}
      <div className="relative w-full max-w-[360px] h-[440px] flex items-center justify-center my-auto z-20">
        {/* SVG Lines between connected stars */}
        <svg viewBox="0 0 360 440" className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="constellationLine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffe6b3" />
              <stop offset="50%" stopColor="#f7c5d1" />
              <stop offset="100%" stopColor="#ff4d6d" />
            </linearGradient>
          </defs>

          {/* Connected heart outline */}
          {stars.map((s, idx) => {
            const nextStar = stars[(idx + 1) % stars.length];
            const isLineActive = s.connected && nextStar.connected;
            if (!isLineActive) return null;

            return (
              <motion.line
                key={`line-${idx}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                x1={s.x}
                y1={s.y}
                x2={nextStar.x}
                y2={nextStar.y}
                stroke="url(#constellationLine)"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                filter="drop-shadow(0 0 8px rgba(255,230,179,0.9))"
              />
            );
          })}
        </svg>

        {/* Sparkler Touch Particles Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
        />

        {/* Constellation Star Nodes */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center"
            style={{ left: star.x, top: star.y }}
          >
            <motion.div
              animate={
                star.connected
                  ? { scale: [1, 1.35, 1.1], rotate: [0, 90, 180] }
                  : { scale: [0.9, 1.1, 0.9] }
              }
              transition={{ duration: star.connected ? 0.6 : 2.5, repeat: star.connected ? 0 : Infinity }}
              className={`p-2 rounded-full transition-all duration-500 ${
                star.connected
                  ? 'bg-[#ffe6b3] text-[#9e1b32] shadow-[0_0_20px_#ffe6b3]'
                  : 'bg-white/10 text-white/50 border border-white/20'
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
            </motion.div>
            <span
              className={`text-[9px] font-sans tracking-widest uppercase mt-1 transition-colors duration-300 ${
                star.connected ? 'text-[#ffe6b3] font-medium' : 'text-neutral-500'
              }`}
            >
              {star.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress & Next Button */}
      <div className="z-20 flex flex-col items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          {stars.map((s) => (
            <div
              key={s.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                s.connected ? 'bg-[#ffe6b3] shadow-[0_0_8px_#ffe6b3] scale-125' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <AnimatePresence>
          {isCompleted && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={onComplete}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#9e1b32] via-[#ff4d6d] to-[#ffe6b3] text-white font-serif tracking-widest text-sm uppercase shadow-[0_0_25px_rgba(255,77,109,0.6)] flex items-center gap-2 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Enter The Celebration</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        <span className="text-[11px] text-neutral-400 font-sans">
          {isCompleted
            ? 'The stars have aligned perfectly ✨'
            : `Touch and light all ${stars.length} stars (${connectedCount}/${stars.length})`}
        </span>
      </div>
    </div>
  );
}
