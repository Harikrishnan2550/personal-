'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Heart, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/audio';

interface StarlightCatcherGameProps {
  onComplete: () => void;
}

interface FallingItem {
  id: number;
  x: number; // percentage 5..90
  y: number; // percentage 0..100
  speed: number;
  type: 'star' | 'rose' | 'heart' | 'gem';
  label: string;
  emoji: string;
  size: number;
  collected: boolean;
}

const WISH_GOALS = [
  'Infinite Love',
  'Warm Hugs',
  'Endless Joy',
  'Sweet Laughter',
  'Gentle Mornings',
  'Starlit Dreams',
  'Forever & Always',
];

export default function StarlightCatcherGame({ onComplete }: StarlightCatcherGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [basketX, setBasketX] = useState(50); // percentage 0..100
  const [score, setScore] = useState(0);
  const targetScore = 7;
  const [collectedWishes, setCollectedWishes] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [items, setItems] = useState<FallingItem[]>([]);

  const isGameOverRef = useRef(false);
  const scoreRef = useRef(0);

  // Spawn and move items
  useEffect(() => {
    let nextId = 1;

    const spawnInterval = setInterval(() => {
      if (isGameOverRef.current) return;

      const types: Array<{ type: FallingItem['type']; emoji: string; label: string }> = [
        { type: 'star', emoji: '⭐', label: WISH_GOALS[scoreRef.current % WISH_GOALS.length] },
        { type: 'heart', emoji: '💖', label: WISH_GOALS[(scoreRef.current + 1) % WISH_GOALS.length] },
        { type: 'rose', emoji: '🌹', label: WISH_GOALS[(scoreRef.current + 2) % WISH_GOALS.length] },
        { type: 'gem', emoji: '💎', label: WISH_GOALS[(scoreRef.current + 3) % WISH_GOALS.length] },
      ];

      const chosen = types[Math.floor(Math.random() * types.length)];

      setItems((prev) => [
        ...prev.slice(-12), // keep max 12 items on screen
        {
          id: nextId++,
          x: 10 + Math.random() * 80,
          y: -10,
          speed: 0.6 + Math.random() * 0.5,
          type: chosen.type,
          emoji: chosen.emoji,
          label: chosen.label,
          size: 24 + Math.random() * 10,
          collected: false,
        },
      ]);
    }, 1200);

    // Physics Animation Loop
    let animationFrameId: number;
    const updatePhysics = () => {
      if (!isGameOverRef.current) {
        setItems((prev) => {
          return prev
            .map((item) => {
              const newY = item.y + item.speed;

              // Check collision with catcher basket (around y = 82%..90% and x near basketX)
              if (
                !item.collected &&
                newY >= 78 &&
                newY <= 88 &&
                Math.abs(item.x - basketX) < 16
              ) {
                // Caught!
                sound?.playFairyChime();
                scoreRef.current += 1;
                const newScore = scoreRef.current;
                setScore(newScore);

                setCollectedWishes((w) => [...w, item.label]);

                if (newScore >= targetScore) {
                  isGameOverRef.current = true;
                  setIsGameOver(true);
                  sound?.playHeartHit();
                }

                return { ...item, y: newY, collected: true };
              }

              return { ...item, y: newY };
            })
            .filter((item) => item.y < 105 && !item.collected);
        });
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [basketX]);

  // Touch / Pointer controls for moving basket
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current || isGameOver) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const rawPct = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, rawPct)));
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      className="relative w-full h-[100dvh] flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden bg-[#050507] touch-none"
    >
      {/* Background Starry Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,105,180,0.18)_0%,rgba(15,8,18,0.7)_50%,#050507_100%)] pointer-events-none" />

      {/* Header & Target Score */}
      <div className="z-20 text-center mt-2 w-full max-w-xs">
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Romantic Quest I • Starlight Rain
        </span>
        <h2 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7c5d1] to-[#ffe6b3]">
          Catch 7 Birthday Wishes
        </h2>

        {/* Progress Pill */}
        <div className="mt-2 flex items-center justify-between px-4 py-1.5 rounded-full bg-[#160b18]/80 border border-[#f7c5d1]/25 backdrop-blur-md">
          <span className="text-[11px] font-sans text-neutral-300">Wishes Collected</span>
          <div className="flex items-center gap-1.5">
            {[...Array(targetScore)].map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i < score
                    ? 'bg-[#ffe6b3] shadow-[0_0_8px_#ffe6b3] scale-110'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Play Area: Falling Stars & Items */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center filter drop-shadow-[0_0_12px_rgba(255,230,179,0.9)]"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
          >
            <span style={{ fontSize: `${item.size}px` }} className="leading-none select-none">
              {item.emoji}
            </span>
            <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-full bg-black/60 text-[#ffe6b3] border border-[#ffe6b3]/30 whitespace-nowrap mt-0.5">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* User Controlled Glowing Heart Basket */}
      <div
        className="absolute bottom-20 z-20 -translate-x-1/2 pointer-events-none transition-all duration-75"
        style={{ left: `${basketX}%` }}
      >
        <div className="relative flex flex-col items-center">
          {/* Basket Glow Halo */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#ff4d6d]/40 via-[#f7c5d1]/50 to-[#ffe6b3]/40 blur-md animate-pulse" />

          {/* Glowing Crystal Catcher Basket */}
          <div className="relative px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9e1b32] via-[#ff4d6d] to-[#ffe6b3] border border-white/60 shadow-[0_0_25px_rgba(255,77,109,0.7)] flex items-center gap-2">
            <Heart className="w-5 h-5 text-white fill-white animate-bounce" />
            <span className="text-xs font-serif text-white font-medium tracking-wider uppercase">
              Catch Wishes
            </span>
          </div>

          {/* Guide Pointer Arrow */}
          <span className="text-[10px] text-neutral-400 font-sans mt-1.5">
            Slide finger left / right to steer
          </span>
        </div>
      </div>

      {/* Completion Modal Overlay */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-md text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9e1b32] via-[#ff4d6d] to-[#ffe6b3] flex items-center justify-center shadow-[0_0_30px_rgba(255,77,109,0.8)] mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-serif text-white tracking-wide">
              All 7 Wishes Captured!
            </h3>
            <p className="text-xs text-[#f7c5d1]/80 font-sans tracking-widest mt-1 max-w-xs">
              Every wish you caught has been locked into the universe for you ✨
            </p>

            {/* List of captured wishes */}
            <div className="flex flex-wrap gap-1.5 justify-center max-w-xs my-5">
              {WISH_GOALS.map((w, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-sans px-2.5 py-1 rounded-full bg-[#1e0e18] border border-[#f7c5d1]/30 text-[#ffe6b3]"
                >
                  ✓ {w}
                </span>
              ))}
            </div>

            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#9e1b32] via-[#ff4d6d] to-[#ffe6b3] text-white font-serif tracking-widest text-sm uppercase shadow-[0_0_25px_rgba(255,77,109,0.7)] flex items-center gap-2 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Next Romantic Quest</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-20 text-center mb-1">
        <span className="text-[10px] text-neutral-500 font-sans tracking-widest uppercase">
          Drag to collect all 7 falling wishes
        </span>
      </div>
    </div>
  );
}
