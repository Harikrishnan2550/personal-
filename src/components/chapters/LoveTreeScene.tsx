'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/audio';
import { BIRTHDAY_CONFIG } from '@/lib/constants';

interface LoveTreeSceneProps {
  onContinue: () => void;
}

interface HeartBalloon {
  id: number;
  x: number; // In 380x480 coordinate space
  y: number;
  size: number;
  gradientId: string;
  rotation: number;
  floatDelay: number;
  floatDuration: number;
  zLayer: number;
}

export default function LoveTreeScene({ onContinue }: LoveTreeSceneProps) {
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [isTreeComplete, setIsTreeComplete] = useState(false);
  const [isRedBalloonFlying, setIsRedBalloonFlying] = useState(false);
  const [isImpacted, setIsImpacted] = useState(false);
  const [screenShake, setScreenShake] = useState(false);

  // Generate 260+ tightly packed glossy 3D heart balloons FULLY COVERING the entire heart shape
  const heartBalloons = useMemo<HeartBalloon[]>(() => {
    const gradientTypes = [
      'balloonGradRose',
      'balloonGradPink',
      'balloonGradGold',
      'balloonGradRuby',
      'balloonGradBlush',
      'balloonGradPeach',
      'balloonGradCrimson',
    ];

    const items: HeartBalloon[] = [];
    const centerX = 190;
    const centerY = 160;
    const scale = 8.8;

    let id = 1;

    // Mathematical test whether (px, py) is strictly inside Heart region
    const isInsideHeart = (nx: number, ny: number) => {
      const x = nx * 1.15;
      const y = -ny * 1.15 + 0.15;
      const a = x * x + y * y - 1;
      return a * a * a - x * x * y * y * y <= 0.05;
    };

    // Dense grid sampling with jitter
    for (let gx = -1.35; gx <= 1.35; gx += 0.11) {
      for (let gy = -1.35; gy <= 1.25; gy += 0.11) {
        const jx = gx + (Math.random() - 0.5) * 0.09;
        const jy = gy + (Math.random() - 0.5) * 0.09;

        if (isInsideHeart(jx, jy)) {
          const px = centerX + jx * 16 * scale * 0.72;
          const py = centerY + jy * 16 * scale * 0.72;

          const grad = gradientTypes[Math.floor(Math.random() * gradientTypes.length)];
          const size = 22 + Math.random() * 16;
          const zLayer = Math.random();

          items.push({
            id: id++,
            x: px,
            y: py,
            size,
            gradientId: grad,
            rotation: (Math.random() - 0.5) * 35,
            floatDelay: Math.random() * 2,
            floatDuration: 3 + Math.random() * 2,
            zLayer,
          });
        }
      }
    }

    items.sort((a, b) => a.zLayer - b.zLayer);
    return items;
  }, []);

  useEffect(() => {
    sound?.playMagicalGrowth();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTreeComplete(true);
        },
      });

      // 1. Organic Tree Trunk Growth Upward
      tl.to('.tree-stem-trunk', {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: 'power2.out',
      })
      // 2. Branch Arteries
      .to(
        '.tree-stem-branch',
        {
          strokeDashoffset: 0,
          duration: 1.0,
          stagger: 0.1,
          ease: 'power1.out',
        },
        '-=0.6'
      )
      // 3. Dense 3D Heart Balloons Bloom and Fill Out
      .to(
        '.heart-balloon-node',
        {
          scale: 1,
          opacity: 1,
          stagger: {
            amount: 1.6,
            from: 'center',
          },
          ease: 'back.out(2.2)',
          duration: 0.7,
        },
        '-=0.4'
      );
    }, treeContainerRef);

    return () => ctx.revert();
  }, []);

  // Launch the red balloon directly at the screen to trigger impact transition
  const launchRedBalloonImpact = () => {
    if (isRedBalloonFlying) return;
    setIsRedBalloonFlying(true);
    sound?.playArrowRelease(); // whoosh sound

    // Impact moment (balloon smashes into screen)
    setTimeout(() => {
      setIsImpacted(true);
      setScreenShake(true);
      sound?.playHeartHit();

      setTimeout(() => {
        setScreenShake(false);
      }, 300);

      // Transition to next page through the burst
      setTimeout(() => {
        onContinue();
      }, 750);
    }, 700);
  };

  return (
    <div
      ref={treeContainerRef}
      className={`relative w-full h-[100dvh] flex flex-col items-center justify-between px-4 py-7 select-none overflow-hidden bg-[#050507] text-[#f5f5f7] transition-transform duration-100 ${
        screenShake ? 'scale-105 translate-y-1 rotate-1' : 'scale-100'
      }`}
    >
      {/* Background Volumetric Romance Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,42,85,0.18)_0%,rgba(20,9,22,0.85)_50%,#050507_100%)] pointer-events-none" />

      {/* Canopy Backlight Aura */}
      <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(255,77,109,0.3)_0%,rgba(255,209,102,0.15)_45%,transparent_75%)] blur-3xl pointer-events-none animate-ambient-glow" />

      {/* Top Editorial Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-20 text-center mt-1"
      >
        <span className="text-[10px] font-sans tracking-[0.4em] text-[#f7c5d1]/60 uppercase block mb-1">
          Chapter III • The Bloom of Love
        </span>
        <h2 className="text-2xl md:text-3xl font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7c5d1] to-[#ffe6b3]">
          The Tree of Love
        </h2>
      </motion.div>

      {/* Main Centerpiece: Tree & Dense Heart Balloons Canopy */}
      <div className="relative w-full max-w-[390px] h-[480px] my-auto flex items-center justify-center z-15">
        {/* SVG Trunk & Gradient Definitions */}
        <svg
          viewBox="0 0 380 480"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10"
        >
          <defs>
            {/* Tree Bark Trunk Gradient */}
            <linearGradient id="treeBarkGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#1a080d" />
              <stop offset="50%" stopColor="#3d141f" />
              <stop offset="85%" stopColor="#7a2638" />
              <stop offset="100%" stopColor="#d48295" />
            </linearGradient>

            {/* Glossy 3D Foil Heart Balloon Gradients */}
            <radialGradient id="balloonGradRose" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ff758f" />
              <stop offset="75%" stopColor="#ff2a55" />
              <stop offset="100%" stopColor="#9e1b32" />
            </radialGradient>

            <radialGradient id="balloonGradPink" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#ff8fa3" />
              <stop offset="70%" stopColor="#ff4d6d" />
              <stop offset="100%" stopColor="#c9184a" />
            </radialGradient>

            <radialGradient id="balloonGradGold" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ffeaa7" />
              <stop offset="70%" stopColor="#ffd166" />
              <stop offset="100%" stopColor="#d48b00" />
            </radialGradient>

            <radialGradient id="balloonGradRuby" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffccd5" />
              <stop offset="30%" stopColor="#c9184a" />
              <stop offset="80%" stopColor="#800f2f" />
              <stop offset="100%" stopColor="#470014" />
            </radialGradient>

            <radialGradient id="balloonGradBlush" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#f7c5d1" />
              <stop offset="80%" stopColor="#e8a598" />
              <stop offset="100%" stopColor="#a35848" />
            </radialGradient>

            <radialGradient id="balloonGradPeach" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ffe3d8" />
              <stop offset="70%" stopColor="#ff9f43" />
              <stop offset="100%" stopColor="#d35400" />
            </radialGradient>

            <radialGradient id="balloonGradCrimson" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#ff1744" />
              <stop offset="70%" stopColor="#d50000" />
              <stop offset="100%" stopColor="#5b0000" />
            </radialGradient>
          </defs>

          {/* Slender Graceful Trunk */}
          <path
            className="tree-stem-trunk"
            d="M 190 480 Q 185 380 180 290 Q 175 220 190 175"
            fill="none"
            stroke="url(#treeBarkGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 330, strokeDashoffset: 330 }}
          />

          {/* Internal Branch Arteries */}
          <path
            className="tree-stem-branch"
            d="M 190 230 Q 150 180 120 135"
            fill="none"
            stroke="url(#treeBarkGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 160, strokeDashoffset: 160 }}
          />
          <path
            className="tree-stem-branch"
            d="M 190 215 Q 230 170 260 130"
            fill="none"
            stroke="url(#treeBarkGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 160, strokeDashoffset: 160 }}
          />
        </svg>

        {/* Dense Canopy: 260+ Overlapping 3D Glossy Heart Balloons */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {heartBalloons.map((b) => {
            const leftPct = (b.x / 380) * 100;
            const topPct = (b.y / 480) * 100;

            return (
              <div
                key={b.id}
                className="heart-balloon-node absolute flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-130 transition-transform duration-200"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: `translate(-50%, -50%) rotate(${b.rotation}deg) scale(0)`,
                  opacity: 0,
                }}
              >
                <svg
                  width={b.size}
                  height={b.size}
                  viewBox="0 0 24 24"
                  className="overflow-visible"
                  style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))' }}
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill={`url(#${b.gradientId})`}
                  />
                  <path
                    d="M 7.5 5 C 6.2 5 5 6.2 5 7.8 C 5 9.2 6.2 11 8 12.5 C 7.2 10.8 6.5 9 6.5 7.8 C 6.5 6.6 7.2 6 8 6 C 8.5 6 9 6.3 9.4 6.8 C 9.1 5.7 8.4 5 7.5 5 Z"
                    fill="#ffffff"
                    opacity="0.65"
                  />
                  <circle cx="6.5" cy="7.2" r="0.8" fill="#ffffff" opacity="0.9" />
                </svg>
              </div>
            );
          })}
        </div>

        {/* The Vivid Red Heart Balloon that flies straight into the screen! */}
        <AnimatePresence>
          {isTreeComplete && (
            <motion.div
              initial={{ scale: 0, y: 0, zIndex: 40 }}
              animate={
                isRedBalloonFlying
                  ? {
                      scale: isImpacted ? [4.5, 9, 0] : [1, 2.5, 4.5],
                      y: [0, 20, 40],
                      opacity: isImpacted ? [1, 1, 0] : 1,
                      filter: isImpacted
                        ? 'drop-shadow(0 0 50px #ff0033)'
                        : 'drop-shadow(0 0 25px #ff1744)',
                    }
                  : {
                      scale: [0.95, 1.15, 0.95],
                      y: [-6, 6, -6],
                      opacity: 1,
                    }
              }
              transition={
                isRedBalloonFlying
                  ? { duration: 0.75, ease: [0.32, 0, 0.67, 0] }
                  : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
              }
              onClick={launchRedBalloonImpact}
              className="absolute top-[34%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer flex flex-col items-center group"
            >
              {/* Pulsing Red Aura */}
              <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(255,23,68,0.8)_0%,rgba(213,0,0,0.4)_50%,transparent_75%)] blur-lg animate-pulse pointer-events-none" />

              {/* Glowing Crimson Red Heart Balloon */}
              <svg
                width="76"
                height="76"
                viewBox="0 0 24 24"
                className="overflow-visible drop-shadow-[0_0_25px_rgba(255,23,68,0.95)] group-hover:scale-110 transition-transform"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="url(#balloonGradCrimson)"
                />
                <path
                  d="M 7.5 5 C 6.2 5 5 6.2 5 7.8 C 5 9.2 6.2 11 8 12.5 C 7.2 10.8 6.5 9 6.5 7.8 C 6.5 6.6 7.2 6 8 6 C 8.5 6 9 6.3 9.4 6.8 C 9.1 5.7 8.4 5 7.5 5 Z"
                  fill="#ffffff"
                  opacity="0.85"
                />
                <circle cx="6.5" cy="7.2" r="1.2" fill="#ffffff" />
              </svg>

              {/* Tap prompt */}
              {!isRedBalloonFlying && (
                <span className="text-[10px] font-sans tracking-widest uppercase text-white bg-[#9e1b32]/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50 mt-2 whitespace-nowrap shadow-lg group-hover:border-white animate-bounce">
                  💥 Tap Red Balloon
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full-Screen Glass Impact Shockwave Ring */}
        {isImpacted && (
          <motion.div
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 4.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-4 border-white pointer-events-none z-50 shadow-[0_0_50px_#ff0055]"
          />
        )}
      </div>

      {/* Full-Screen Red Wipe / Burst Overlay on Screen Smash */}
      <AnimatePresence>
        {isImpacted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-b from-[#ff1744] via-[#9e1b32] to-[#050507] flex items-center justify-center"
          />
        )}
      </AnimatePresence>

      {/* Bottom Editorial Frosted Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="z-20 w-full max-w-sm flex flex-col items-center text-center mb-2"
      >
        <div className="w-full bg-[#120914]/85 backdrop-blur-xl rounded-3xl border border-[#f7c5d1]/25 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.8)] flex flex-col items-center gap-2">
          <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-[#f7c5d1]/70 font-medium">
            it&apos;s officially your day
          </span>

          <h3 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7c5d1] to-[#ffe6b3] tracking-wide font-normal">
            Happy Birthday, {BIRTHDAY_CONFIG.recipientName}
          </h3>

          <p className="text-xs font-serif italic text-neutral-300 tracking-wide mt-0.5 max-w-xs leading-relaxed">
            “Every balloon in this tree holds a piece of my heart for you.”
          </p>

          {/* Trigger Button */}
          <AnimatePresence>
            {isTreeComplete && !isRedBalloonFlying && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={launchRedBalloonImpact}
                className="mt-3 px-8 py-3 rounded-full bg-gradient-to-r from-[#d50000] via-[#ff1744] to-[#ff4d6d] text-white font-serif tracking-widest text-xs uppercase shadow-[0_6px_25px_rgba(213,0,0,0.6)] border border-white/60 flex items-center gap-2 hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Launch Red Balloon ➔</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
