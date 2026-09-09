'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Sparkles, Heart } from 'lucide-react';
import { sound } from '@/lib/audio';
import { BIRTHDAY_CONFIG } from '@/lib/constants';

interface LoveTreeSceneProps {
  onContinue: () => void;
}

interface GlossyHeart {
  id: number;
  x: number; // in 360x480 coordinate space
  y: number;
  size: number;
  colorGrad: string;
  rotation: number;
  delay: number;
}

export default function LoveTreeScene({ onContinue }: LoveTreeSceneProps) {
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [isTreeComplete, setIsTreeComplete] = useState(false);

  // Generate 130+ glossy hearts filling the exact giant Heart Canopy contour
  const glossyHearts = useMemo<GlossyHeart[]>(() => {
    const colorGradients = [
      'from-[#ff4d6d] via-[#ff758f] to-[#ffccd5]', // Vivid rose pink
      'from-[#ff6b81] via-[#ff8fa3] to-[#fff0f3]', // Bubblegum pink
      'from-[#ffd166] via-[#ffeaa7] to-[#ffffff]', // Golden yellow
      'from-[#ff9f43] via-[#ffc048] to-[#fff3cd]', // Warm peach
      'from-[#e84393] via-[#fd79a8] to-[#fce4ec]', // Deep magenta pink
      'from-[#ff7675] via-[#fab1a0] to-[#ffeaa7]', // Coral blush
      'from-[#ff4757] via-[#ff6b81] to-[#ffffff]', // Strawberry rose
    ];

    const items: GlossyHeart[] = [];
    const centerX = 180;
    const centerY = 165;
    const scale = 8.5; // Heart scale multiplier

    let count = 0;

    // Distribute points uniformly inside mathematical heart region
    // Boundary: x = 16 sin^3(t), y = -(13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t))
    for (let i = 0; i < 140; i++) {
      const t = Math.random() * Math.PI * 2;
      // r = sqrt(random) gives uniform area density
      const r = Math.sqrt(Math.random()) * 0.95;

      const hx = 16 * Math.pow(Math.sin(t), 3) * r;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r;

      const px = centerX + hx * scale;
      const py = centerY + hy * scale;

      const grad = colorGradients[Math.floor(Math.random() * colorGradients.length)];
      const size = 16 + Math.random() * 14;

      items.push({
        id: count++,
        x: px,
        y: py,
        size,
        colorGrad: grad,
        rotation: (Math.random() - 0.5) * 35,
        delay: 1.2 + Math.random() * 1.5,
      });
    }

    return items;
  }, []);

  // Drifting mini heart petals
  const driftingPetals = useMemo(() => {
    return [...Array(18)].map((_, i) => ({
      id: i,
      x: (i * 19) % 95 + 2.5,
      size: 10 + (i % 4) * 4,
      duration: 6 + (i % 5) * 2,
      delay: (i % 6) * 0.7,
      color: ['#ff4d6d', '#ffd166', '#ff8fa3', '#ff6b81', '#fce4ec'][i % 5],
    }));
  }, []);

  useEffect(() => {
    sound?.playMagicalGrowth();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTreeComplete(true);
        },
      });

      // 1. Tall Slender Stem / Trunk Growth Upward
      tl.to('.heart-tree-stem', {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: 'power2.out',
      })
      // 2. Crown Branch Forks
      .to(
        '.heart-crown-branch',
        {
          strokeDashoffset: 0,
          duration: 1.0,
          stagger: 0.1,
          ease: 'power1.out',
        },
        '-=0.6'
      )
      // 3. Dense Glossy Heart Canopy Bloom
      .to(
        '.glossy-heart-leaf',
        {
          scale: 1,
          opacity: 1,
          stagger: {
            amount: 1.8,
            from: 'center',
          },
          ease: 'back.out(2.4)',
          duration: 0.65,
        },
        '-=0.4'
      );
    }, treeContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={treeContainerRef}
      className="relative w-full h-[100dvh] flex flex-col items-center justify-between px-4 py-6 select-none overflow-hidden bg-gradient-to-b from-[#ffeedb] via-[#ffe3ec] to-[#fce4ec] text-[#331118]"
    >
      {/* Radiant Sunburst Beams from Behind the Heart Canopy */}
      <div className="absolute top-[34%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-50">
        <div className="w-full h-full rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(255,255,255,0.75)_0deg,rgba(255,255,255,0.75)_12deg,transparent_12deg,transparent_24deg)] animate-spin" style={{ animationDuration: '45s' }} />
      </div>

      {/* Ambient Warm Golden Glow Halo */}
      <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,209,102,0.5)_40%,transparent_75%)] blur-2xl pointer-events-none" />

      {/* Floating Mini Heart Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {driftingPetals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={{ y: -20, opacity: 0, x: `${petal.x}%` }}
            animate={{
              y: ['0vh', '100vh'],
              opacity: [0, 0.75, 0.75, 0],
              x: [`${petal.x}%`, `${petal.x + (petal.id % 2 === 0 ? 6 : -6)}%`],
              rotate: [0, 180],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              delay: petal.delay,
              ease: 'linear',
            }}
            className="absolute"
          >
            <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill={petal.color}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Top Header Controls / Subtle Tag */}
      <div className="z-20 w-full flex justify-between items-center px-2 mt-2">
        <span className="text-[11px] font-sans tracking-[0.25em] text-[#9e1b32]/80 uppercase font-semibold">
          Chapter III • The Love Tree
        </span>
        <span className="text-[11px] font-sans text-[#9e1b32]/70 bg-white/50 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/60">
          ✨ Special Edition
        </span>
      </div>

      {/* Main Centerpiece: Slender Tree Trunk & Giant Heart-Shaped Canopy (360x480) */}
      <div className="relative w-full max-w-[380px] h-[480px] my-auto flex items-center justify-center z-15">
        {/* SVG Slender Tall Stem & Crown Branches */}
        <svg
          viewBox="0 0 360 480"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <linearGradient id="treeBarkColor" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#2e140d" />
              <stop offset="60%" stopColor="#4a1f14" />
              <stop offset="100%" stopColor="#66291a" />
            </linearGradient>
          </defs>

          {/* Slender Tall Trunk Growing Upward */}
          <path
            className="heart-tree-stem"
            d="M 180 480 Q 170 380 165 300 Q 160 250 170 190"
            fill="none"
            stroke="url(#treeBarkColor)"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ strokeDasharray: 320, strokeDashoffset: 320 }}
          />

          {/* Crown Branch Forks into the Heart Canopy */}
          <path
            className="heart-crown-branch"
            d="M 170 190 Q 150 160 135 140"
            fill="none"
            stroke="url(#treeBarkColor)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 80, strokeDashoffset: 80 }}
          />
          <path
            className="heart-crown-branch"
            d="M 170 190 Q 195 160 215 135"
            fill="none"
            stroke="url(#treeBarkColor)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 80, strokeDashoffset: 80 }}
          />
          <path
            className="heart-crown-branch"
            d="M 170 190 Q 170 150 170 125"
            fill="none"
            stroke="url(#treeBarkColor)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ strokeDasharray: 70, strokeDashoffset: 70 }}
          />
        </svg>

        {/* Dense 3D Glossy Hearts Filling The Giant Heart Silhouette */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {glossyHearts.map((h) => {
            const leftPct = (h.x / 360) * 100;
            const topPct = (h.y / 480) * 100;

            return (
              <div
                key={h.id}
                className="glossy-heart-leaf absolute flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-135 transition-transform duration-200"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: `translate(-50%, -50%) rotate(${h.rotation}deg) scale(0)`,
                  opacity: 0,
                }}
              >
                {/* 3D Glossy Plump Heart */}
                <div
                  className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${h.colorGrad} shadow-[0_4px_10px_rgba(255,77,109,0.35)] border border-white/60`}
                  style={{ width: `${h.size}px`, height: `${h.size}px` }}
                >
                  <svg
                    width={h.size * 0.75}
                    height={h.size * 0.75}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white drop-shadow-xs"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {/* Glossy specular shine reflection */}
                  <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Translucent Glass Text Overlay (Matching Reference Image) */}
      <div className="z-20 w-full max-w-sm flex flex-col items-center text-center mb-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-full bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 p-5 shadow-[0_10px_30px_rgba(255,182,193,0.35)] flex flex-col items-center gap-1"
        >
          <span className="text-xs font-sans italic text-[#9e1b32]/80 tracking-wide">
            it&apos;s officially your day
          </span>

          <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c9184a] via-[#ff4d6d] to-[#9e1b32] drop-shadow-sm tracking-wide mt-0.5">
            Happy Birthday, {BIRTHDAY_CONFIG.recipientName}
          </h1>

          <span className="text-xs font-sans text-[#7a2233] tracking-wide mt-0.5">
            and just like that, celebrating your magic ✨
          </span>

          {/* Continue Action Button */}
          <AnimatePresence>
            {isTreeComplete && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContinue}
                className="mt-3.5 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#c9184a] via-[#ff4d6d] to-[#ffd166] text-white font-serif tracking-widest text-xs uppercase shadow-[0_4px_18px_rgba(201,24,74,0.4)] border border-white/60 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Tap to continue</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
