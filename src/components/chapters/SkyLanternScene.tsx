'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame } from 'lucide-react';
import { sound } from '@/lib/audio';

interface SkyLanternSceneProps {
  onComplete: () => void;
}

export default function SkyLanternScene({ onComplete }: SkyLanternSceneProps) {
  const [warmth, setWarmth] = useState(0); // 0 to 100%
  const [isHolding, setIsHolding] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [dragY, setDragY] = useState(0);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Background floating lanterns array for festival of lights
  const backgroundLanterns = useMemo(() => {
    return [...Array(45)].map((_, i) => ({
      id: i,
      x: (i * 17) % 95 + 2.5,
      startY: 110 + (i * 9) % 40,
      scale: 0.25 + (i % 5) * 0.15,
      opacity: 0.35 + (i % 4) * 0.18,
      speed: 12 + (i % 6) * 3,
      delay: (i % 10) * 0.4,
      driftX: ((i % 3) - 1) * 30,
    }));
  }, []);

  // Handle Press & Hold to warm up lantern flame
  const handlePointerDown = () => {
    if (isReleased) return;
    setIsHolding(true);
    sound?.playLanternIgnite();

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    holdIntervalRef.current = setInterval(() => {
      setWarmth((prev) => {
        if (prev >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          return 100;
        }
        return prev + 4;
      });
    }, 60);
  };

  const handlePointerUp = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  };

  // Handle Swipe Upward Release
  const handleReleaseLantern = () => {
    if (warmth < 75 || isReleased) return;
    setIsReleased(true);
    sound?.playLanternRelease();

    setTimeout(() => {
      onComplete();
    }, 4500);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  return (
    <div
      className="relative w-full h-[100dvh] flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden bg-[#050507]"
      onPointerUp={handlePointerUp}
    >
      {/* Background Starry Night Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(158,27,50,0.15)_0%,rgba(20,10,25,0.6)_40%,#050507_100%)] pointer-events-none" />

      {/* Chapter Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-20 text-center mt-2"
      >
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Chapter IV • The Lantern of Wishes
        </span>
        <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffe6b3] to-[#f7c5d1]">
          Ignite & Release
        </h2>
      </motion.div>

      {/* Background Ascending Lanterns (Appears after release) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {isReleased &&
          backgroundLanterns.map((l) => (
            <motion.div
              key={l.id}
              initial={{ y: `${l.startY}vh`, x: `${l.x}%`, opacity: 0 }}
              animate={{
                y: '-20vh',
                x: `${l.x + l.driftX}%`,
                opacity: [0, l.opacity, l.opacity, 0],
              }}
              transition={{
                duration: l.speed,
                delay: l.delay,
                ease: 'easeOut',
              }}
              className="absolute flex flex-col items-center"
              style={{ transform: `scale(${l.scale})` }}
            >
              {/* Mini Lantern Body */}
              <div className="w-8 h-11 rounded-t-md bg-gradient-to-b from-[#ffd79e] to-[#ff8c42] shadow-[0_0_15px_rgba(255,165,0,0.8)] opacity-90 relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white blur-[1px]" />
              </div>
            </motion.div>
          ))}
      </div>

      {/* Main Interactive Sky Lantern */}
      <div className="relative z-20 flex flex-col items-center my-auto">
        <motion.div
          animate={
            isReleased
              ? {
                  y: -700,
                  scale: 0.25,
                  opacity: [1, 1, 0.8, 0],
                  rotate: 6,
                }
              : {
                  y: isHolding ? [0, -4, 0] : [0, -8, 0],
                  scale: isHolding ? 1.05 : 1,
                }
          }
          transition={
            isReleased
              ? { duration: 4.2, ease: [0.25, 0.1, 0.25, 1] }
              : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
          }
          className="relative flex flex-col items-center cursor-pointer"
        >
          {/* Flame Halo Glow */}
          <div
            className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(255,170,50,0.45)_0%,rgba(255,90,50,0.15)_50%,transparent_75%)] blur-2xl pointer-events-none transition-opacity duration-300"
            style={{ opacity: Math.max(0.2, warmth / 100) }}
          />

          {/* Paper Lantern Body */}
          <div className="relative w-44 h-60 rounded-t-3xl rounded-b-xl bg-gradient-to-b from-[#fff3db] via-[#ffd08a] to-[#ff8533] border border-[#fff]/40 shadow-[0_0_40px_rgba(255,140,0,0.6)] flex flex-col items-center justify-between p-4 overflow-hidden">
            {/* Paper ribs / creases */}
            <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(0deg,transparent,transparent_18px,rgba(0,0,0,0.15)_18px,rgba(0,0,0,0.15)_20px)]" />

            {/* Romantic Calligraphy on Lantern */}
            <div className="z-10 text-center mt-6">
              <span className="text-xl font-serif text-[#662200]/80 tracking-widest block">
                Make A Wish
              </span>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#883300]/60 mt-1 block">
                Together Forever
              </span>
            </div>

            {/* Inner Golden Fire Flame */}
            <div className="relative z-10 flex flex-col items-center mb-2">
              <motion.div
                animate={{
                  scale: 0.6 + (warmth / 100) * 0.8,
                  opacity: 0.4 + (warmth / 100) * 0.6,
                }}
                className="relative"
              >
                {/* Flame Core */}
                <div className="w-8 h-14 rounded-full bg-gradient-to-t from-[#ff4400] via-[#ffbb00] to-[#ffffff] blur-[1px] shadow-[0_0_25px_#ff9900]" />
              </motion.div>

              {/* Wooden cross-frame at base */}
              <div className="w-24 h-1 bg-[#5c2e0b] rounded-full mt-1 shadow-sm" />
            </div>
          </div>
        </motion.div>

        {/* Progress / Interaction Controls */}
        {!isReleased && (
          <div className="mt-8 flex flex-col items-center gap-3">
            {warmth < 100 ? (
              <button
                onPointerDown={handlePointerDown}
                className={`relative px-8 py-3.5 rounded-full border text-white font-serif tracking-widest text-sm uppercase transition-all duration-300 active:scale-95 flex items-center gap-2.5 shadow-lg ${
                  isHolding
                    ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7c5d1] border-white shadow-[0_0_25px_rgba(255,107,53,0.6)] scale-105'
                    : 'bg-[#160b18]/90 border-[#f7c5d1]/30 hover:border-[#f7c5d1]'
                }`}
              >
                <Flame className={`w-4 h-4 ${isHolding ? 'text-white animate-bounce' : 'text-[#ff9900]'}`} />
                <span>{isHolding ? `Warming... ${warmth}%` : 'Hold to Light Lantern'}</span>
              </button>
            ) : (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReleaseLantern}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff8533] via-[#ff3366] to-[#9e1b32] text-white font-serif tracking-widest text-sm uppercase shadow-[0_0_30px_rgba(255,100,50,0.7)] border border-white/60 animate-pulse flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Swipe / Tap to Release</span>
              </motion.button>
            )}

            <span className="text-[11px] text-neutral-400 font-sans tracking-wide">
              {warmth < 100
                ? 'Press & hold to ignite the inner flame'
                : 'Your wish is ready to soar into the stars ✨'}
            </span>
          </div>
        )}
      </div>

      <div className="z-20 text-center mb-2">
        <span className="text-[10px] text-neutral-500 font-sans tracking-widest uppercase">
          Chapter IV of VII
        </span>
      </div>
    </div>
  );
}
