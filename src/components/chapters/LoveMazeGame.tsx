'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ArrowRight, Flag } from 'lucide-react';
import { sound } from '@/lib/audio';

interface LoveMazeGameProps {
  onComplete: () => void;
}

interface Milestone {
  id: number;
  x: number;
  y: number;
  label: string;
  unlocked: boolean;
}

export default function LoveMazeGame({ onComplete }: LoveMazeGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [orbPos, setOrbPos] = useState({ x: 50, y: 390 }); // starting bottom left
  const [isDragging, setIsDragging] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, x: 120, y: 320, label: 'The First Spark', unlocked: false },
    { id: 2, x: 260, y: 260, label: 'Midnight Laughs', unlocked: false },
    { id: 3, x: 100, y: 180, label: 'Unspoken Bond', unlocked: false },
    { id: 4, x: 200, y: 90, label: 'Home in Your Heart', unlocked: false },
  ]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isFinished) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    sound?.playSparklerSizzle();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current || isFinished) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Constrain within bounds
    const clampedX = Math.max(30, Math.min(rect.width - 30, x));
    const clampedY = Math.max(50, Math.min(rect.height - 50, y));

    setOrbPos({ x: clampedX, y: clampedY });

    if (Math.random() < 0.2) {
      sound?.playSparklerSizzle();
    }

    // Check collision with milestones
    setMilestones((prev) => {
      let changed = false;
      const updated = prev.map((m) => {
        const dist = Math.hypot(m.x - clampedX, m.y - clampedY);
        if (dist < 32 && !m.unlocked) {
          changed = true;
          sound?.playFairyChime();
          return { ...m, unlocked: true };
        }
        return m;
      });

      // Check if target destination reached and milestones unlocked
      const finalMilestone = updated[updated.length - 1];
      const distToGoal = Math.hypot(finalMilestone.x - clampedX, finalMilestone.y - clampedY);

      if (distToGoal < 30 && updated.filter((m) => m.unlocked).length >= 3) {
        if (!isFinished) {
          setIsFinished(true);
          sound?.playHeartHit();
        }
      }

      return updated;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const unlockedCount = milestones.filter((m) => m.unlocked).length;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-[100dvh] flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden bg-[#050507] touch-none"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,77,109,0.12)_0%,rgba(15,8,18,0.7)_50%,#050507_100%)] pointer-events-none" />

      {/* Header */}
      <div className="z-20 text-center mt-2">
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Romantic Quest II • The Labyrinth of Us
        </span>
        <h2 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7c5d1] to-[#ffe6b3]">
          Guide The Orb of Love
        </h2>
        <p className="text-xs text-[#f7c5d1]/60 font-sans tracking-wider mt-0.5">
          Drag the glowing heart through each romantic milestone
        </p>
      </div>

      {/* Labyrinth SVG Road / Path */}
      <div className="relative w-[340px] h-[460px] my-auto flex items-center justify-center z-10">
        <svg viewBox="0 0 340 460" className="w-full h-full overflow-visible pointer-events-none">
          <defs>
            <linearGradient id="mazeTrack" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#9e1b32" />
              <stop offset="50%" stopColor="#ff4d6d" />
              <stop offset="100%" stopColor="#ffe6b3" />
            </linearGradient>
            <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Glowing Labyrinth Trail Path */}
          <path
            d="M 50 390 C 80 370 90 340 120 320 C 180 290 220 310 260 260 C 290 210 180 220 100 180 C 40 140 120 120 200 90"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M 50 390 C 80 370 90 340 120 320 C 180 290 220 310 260 260 C 290 210 180 220 100 180 C 40 140 120 120 200 90"
            fill="none"
            stroke="url(#mazeTrack)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#roadGlow)"
          />
        </svg>

        {/* Milestones along the path */}
        {milestones.map((m, idx) => (
          <div
            key={m.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: m.x, top: m.y }}
          >
            <motion.div
              animate={
                m.unlocked
                  ? { scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }
                  : { scale: [0.95, 1.05, 0.95] }
              }
              transition={{ duration: 2, repeat: Infinity }}
              className={`p-2 rounded-full transition-all duration-300 ${
                m.unlocked
                  ? 'bg-gradient-to-r from-[#ff4d6d] to-[#ffe6b3] text-[#9e1b32] shadow-[0_0_20px_#ff4d6d]'
                  : 'bg-black/60 border border-[#f7c5d1]/30 text-white/50'
              }`}
            >
              {idx === milestones.length - 1 ? (
                <Heart className="w-5 h-5 fill-current text-white animate-pulse" />
              ) : (
                <Sparkles className="w-4 h-4 text-current" />
              )}
            </motion.div>
            <span
              className={`text-[9px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 whitespace-nowrap backdrop-blur-xs transition-colors ${
                m.unlocked
                  ? 'bg-[#ffe6b3]/90 text-black font-semibold'
                  : 'bg-black/60 text-neutral-400 border border-white/10'
              }`}
            >
              {m.label}
            </span>
          </div>
        ))}

        {/* Draggable Glowing Player Orb ("You") */}
        <div
          onPointerDown={handlePointerDown}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing pointer-events-auto"
          style={{ left: orbPos.x, top: orbPos.y }}
        >
          <div className="relative flex items-center justify-center">
            {/* Outer Stardust Aura */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#ffe6b3] via-[#ff4d6d] to-[#ffffff] blur-sm animate-pulse opacity-90" />

            {/* Glowing Orb */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffffff] via-[#ffe6b3] to-[#ff4d6d] shadow-[0_0_20px_#ffffff] flex items-center justify-center border-2 border-white">
              <Heart className="w-5 h-5 text-[#9e1b32] fill-[#9e1b32]" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Progression Modal */}
      <div className="z-20 flex flex-col items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          {milestones.map((m) => (
            <div
              key={m.id}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                m.unlocked ? 'bg-[#ffe6b3] shadow-[0_0_8px_#ffe6b3]' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] text-neutral-400 font-sans">
          {isFinished
            ? 'Destiny reached ❤️'
            : `Milestones reached: ${unlockedCount}/${milestones.length}`}
        </span>

        <AnimatePresence>
          {isFinished && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onComplete}
              className="mt-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#9e1b32] via-[#ff4d6d] to-[#ffe6b3] text-white font-serif tracking-widest text-sm uppercase shadow-[0_0_25px_rgba(255,77,109,0.7)] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Next Romantic Quest</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
