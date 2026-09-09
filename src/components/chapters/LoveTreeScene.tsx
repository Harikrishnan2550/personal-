'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ChevronDown, Sparkles, Heart } from 'lucide-react';
import { sound } from '@/lib/audio';

interface LoveTreeSceneProps {
  onContinue: () => void;
}

interface LoveLeaf {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'emoji-red' | 'emoji-sparkle' | 'emoji-pink' | 'emoji-double' | 'emoji-rose' | 'svg-heart';
  emoji: string;
  color: string;
  rotation: number;
  delay: number;
  driftX: number;
}

export default function LoveTreeScene({ onContinue }: LoveTreeSceneProps) {
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [isTreeComplete, setIsTreeComplete] = useState(false);

  // Generate 85+ lush love leaves / emojis covering the full tree canopy like foliage
  const loveLeaves = useMemo<LoveLeaf[]>(() => {
    const emojis = ['💖', '❤️', '💕', '💗', '🌸', '🌹', '💓', '✨', '🥰', '💘'];
    const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#c9184a', '#9e1b32', '#f7c5d1', '#ffe6b3'];
    
    // Centers of branch clusters (canopy distribution)
    const clusterCenters = [
      { x: 200, y: 110, spreadX: 90, spreadY: 60, count: 24 }, // Top crown
      { x: 130, y: 170, spreadX: 70, spreadY: 60, count: 20 }, // Left main canopy
      { x: 270, y: 160, spreadX: 70, spreadY: 60, count: 20 }, // Right main canopy
      { x: 80, y: 220, spreadX: 50, spreadY: 50, count: 12 },  // Far left lower branch
      { x: 320, y: 210, spreadX: 50, spreadY: 50, count: 12 }, // Far right lower branch
      { x: 200, y: 220, spreadX: 60, spreadY: 40, count: 12 }, // Center fork
    ];

    let items: LoveLeaf[] = [];
    let idCounter = 1;

    clusterCenters.forEach((cluster) => {
      for (let i = 0; i < cluster.count; i++) {
        // Gaussian-like scatter around cluster centers
        const u = Math.random() + Math.random() - 1;
        const v = Math.random() + Math.random() - 1;
        const px = cluster.x + u * cluster.spreadX;
        const py = cluster.y + v * cluster.spreadY;

        const emojiChoice = emojis[Math.floor(Math.random() * emojis.length)];
        const colorChoice = colors[Math.floor(Math.random() * colors.length)];

        items.push({
          id: idCounter++,
          x: px,
          y: py,
          size: 14 + Math.random() * 16, // sizes 14px to 30px
          type: Math.random() > 0.3 ? 'emoji-red' : 'svg-heart',
          emoji: emojiChoice,
          color: colorChoice,
          rotation: (Math.random() - 0.5) * 45,
          delay: 1.5 + Math.random() * 2.2, // bloom after branch growth
          driftX: (Math.random() - 0.5) * 12,
        });
      }
    });

    return items;
  }, []);

  // Falling drifting heart petals
  const fallingPetals = useMemo(() => {
    return [...Array(14)].map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80, // %
      size: 10 + Math.random() * 14,
      emoji: ['💖', '💕', '🌸', '❤️', '✨'][i % 5],
      duration: 6 + Math.random() * 5,
      delay: Math.random() * 4,
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

      // 1. Trunk Growth
      tl.to('.tree-trunk', {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: 'power2.out',
      })
      // 2. Primary Branches
      .to(
        '.tree-branch-primary',
        {
          strokeDashoffset: 0,
          duration: 1.6,
          stagger: 0.12,
          ease: 'power1.out',
        },
        '-=0.9'
      )
      // 3. Secondary Branches
      .to(
        '.tree-branch-secondary',
        {
          strokeDashoffset: 0,
          duration: 1.4,
          stagger: 0.08,
          ease: 'power1.out',
        },
        '-=0.7'
      )
      // 4. Lush Love Leaves Bloom
      .to(
        '.love-leaf-node',
        {
          scale: 1,
          opacity: 1,
          stagger: {
            amount: 2.0,
            from: 'random',
          },
          ease: 'back.out(2.5)',
          duration: 0.7,
        },
        '-=0.5'
      );
    }, treeContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={treeContainerRef}
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden bg-[#050507]"
    >
      {/* Background Ambient Romantic Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(247,197,209,0.22)_0%,rgba(158,27,50,0.12)_50%,transparent_75%)] blur-3xl pointer-events-none animate-ambient-glow" />

      {/* Floating / Falling Love Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {fallingPetals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={{ y: -30, opacity: 0, x: `${petal.x}%` }}
            animate={{
              y: ['0vh', '100vh'],
              opacity: [0, 0.8, 0.8, 0],
              x: [`${petal.x}%`, `${petal.x + (petal.id % 2 === 0 ? 8 : -8)}%`],
              rotate: [0, 360],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              delay: petal.delay,
              ease: 'linear',
            }}
            className="absolute text-sm select-none filter drop-shadow-[0_0_8px_rgba(247,197,209,0.8)]"
            style={{ fontSize: `${petal.size}px` }}
          >
            {petal.emoji}
          </motion.div>
        ))}
      </div>

      {/* Chapter Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-20 text-center mt-2"
      >
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Chapter III • The Bloom of Love
        </span>
        <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7c5d1] to-[#ffe6b3]">
          The Tree of Love
        </h2>
        <p className="text-xs text-[#f7c5d1]/60 font-sans tracking-wider mt-0.5">
          Every leaf is a heartbeat for you
        </p>
      </motion.div>

      {/* SVG Tree & Love Emoji Canopy Container */}
      <div className="relative w-full max-w-[420px] h-[500px] flex items-center justify-center my-auto z-15">
        {/* SVG Wood Tree Trunk & Branches */}
        <svg
          viewBox="0 0 400 480"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <linearGradient id="treeBarkGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#220c15" />
              <stop offset="40%" stopColor="#4a1523" />
              <stop offset="80%" stopColor="#8c2e44" />
              <stop offset="100%" stopColor="#d48295" />
            </linearGradient>
            <linearGradient id="branchGlowGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#5c1c2b" />
              <stop offset="60%" stopColor="#c9184a" />
              <stop offset="100%" stopColor="#f7c5d1" />
            </linearGradient>
          </defs>

          {/* Root and Trunk */}
          <path
            className="tree-trunk"
            d="M 200 470 Q 200 370 200 300 Q 195 240 200 180"
            fill="none"
            stroke="url(#treeBarkGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            style={{ strokeDasharray: 330, strokeDashoffset: 330 }}
          />

          {/* Root flare */}
          <path
            className="tree-trunk"
            d="M 200 440 Q 170 460 150 475"
            fill="none"
            stroke="url(#treeBarkGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ strokeDasharray: 80, strokeDashoffset: 80 }}
          />
          <path
            className="tree-trunk"
            d="M 200 440 Q 230 460 250 475"
            fill="none"
            stroke="url(#treeBarkGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ strokeDasharray: 80, strokeDashoffset: 80 }}
          />

          {/* Primary Main Left Branch */}
          <path
            className="tree-branch-primary"
            d="M 200 320 Q 150 280 110 230 Q 80 180 60 150"
            fill="none"
            stroke="url(#branchGlowGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            style={{ strokeDasharray: 260, strokeDashoffset: 260 }}
          />

          {/* Primary Main Right Branch */}
          <path
            className="tree-branch-primary"
            d="M 200 300 Q 255 260 295 210 Q 330 170 350 140"
            fill="none"
            stroke="url(#branchGlowGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            style={{ strokeDasharray: 260, strokeDashoffset: 260 }}
          />

          {/* Canopy Spreading Branches */}
          <path
            className="tree-branch-secondary"
            d="M 200 220 Q 150 160 130 110 Q 120 80 110 50"
            fill="none"
            stroke="url(#branchGlowGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 220, strokeDashoffset: 220 }}
          />
          <path
            className="tree-branch-secondary"
            d="M 200 200 Q 250 150 270 100 Q 280 70 290 45"
            fill="none"
            stroke="url(#branchGlowGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 220, strokeDashoffset: 220 }}
          />
          <path
            className="tree-branch-secondary"
            d="M 200 180 Q 200 120 200 60"
            fill="none"
            stroke="url(#branchGlowGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ strokeDasharray: 150, strokeDashoffset: 150 }}
          />

          {/* Mid & Side Twigs */}
          <path
            className="tree-branch-secondary"
            d="M 110 230 Q 90 260 70 280"
            fill="none"
            stroke="url(#branchGlowGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
          />
          <path
            className="tree-branch-secondary"
            d="M 295 210 Q 325 240 345 260"
            fill="none"
            stroke="url(#branchGlowGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
          />
          <path
            className="tree-branch-secondary"
            d="M 160 180 Q 180 140 190 100"
            fill="none"
            stroke="url(#branchGlowGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ strokeDasharray: 110, strokeDashoffset: 110 }}
          />
          <path
            className="tree-branch-secondary"
            d="M 240 170 Q 220 130 210 90"
            fill="none"
            stroke="url(#branchGlowGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ strokeDasharray: 110, strokeDashoffset: 110 }}
          />
        </svg>

        {/* Dense Foliage of Glowing Love Emojis & Hearts (Leaves of the Tree) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {loveLeaves.map((leaf) => {
            // Coordinate mapping (viewBox 0 0 400 480 to percentage)
            const leftPct = (leaf.x / 400) * 100;
            const topPct = (leaf.y / 480) * 100;

            return (
              <div
                key={leaf.id}
                className="love-leaf-node absolute flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-135 transition-transform duration-300"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: `translate(-50%, -50%) rotate(${leaf.rotation}deg) scale(0)`,
                  opacity: 0,
                }}
              >
                {leaf.type === 'svg-heart' ? (
                  <svg
                    width={leaf.size}
                    height={leaf.size}
                    viewBox="0 0 24 24"
                    fill={leaf.color}
                    className="drop-shadow-[0_0_8px_rgba(255,77,109,0.8)] filter"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <span
                    className="select-none filter drop-shadow-[0_0_10px_rgba(255,105,180,0.85)] leading-none"
                    style={{ fontSize: `${leaf.size}px` }}
                  >
                    {leaf.emoji}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action / Progression Button */}
      <AnimatePresence>
        {isTreeComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="z-20 flex flex-col items-center gap-2 mb-2"
          >
            <button
              onClick={onContinue}
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#9e1b32] via-[#672233] to-[#2d1222] border border-[#f7c5d1]/50 text-[#f5f5f7] shadow-[0_6px_30px_rgba(247,197,209,0.35)] hover:border-[#f7c5d1] hover:shadow-[0_6px_35px_rgba(247,197,209,0.5)] transition-all duration-300 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#ffe6b3] animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-serif tracking-widest text-sm uppercase text-white font-medium">
                Step Into The Celebration
              </span>
              <ChevronDown className="w-4 h-4 text-[#f7c5d1] group-hover:translate-y-0.5 transition-transform" />
            </button>
            <span className="text-[11px] text-neutral-400 font-sans tracking-wide">
              Tap to unveil the birthday cake
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
