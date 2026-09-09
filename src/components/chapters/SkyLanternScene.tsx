'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Send } from 'lucide-react';
import { sound } from '@/lib/audio';

interface SkyLanternSceneProps {
  onComplete: () => void;
}

export default function SkyLanternScene({ onComplete }: SkyLanternSceneProps) {
  const [warmth, setWarmth] = useState(0); // 0 to 100%
  const [isHolding, setIsHolding] = useState(false);
  const [isReleased, setIsReleased] = useState(false);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Background floating lanterns array for festival of lights
  const backgroundLanterns = useMemo(() => {
    return [...Array(36)].map((_, i) => ({
      id: i,
      x: 5 + (i * 13) % 90,
      scale: 0.3 + (i % 4) * 0.15,
      opacity: 0.4 + (i % 3) * 0.2,
      speed: 8 + (i % 5) * 2,
      delay: (i % 8) * 0.3,
      driftX: ((i % 3) - 1) * 20,
    }));
  }, []);

  // Handle Press & Hold to warm up lantern flame
  const startIgnition = (e: React.PointerEvent) => {
    if (isReleased) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsHolding(true);
    sound?.playLanternIgnite();

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    holdIntervalRef.current = setInterval(() => {
      setWarmth((prev) => {
        if (prev >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          return 100;
        }
        return prev + 5;
      });
    }, 70);
  };

  const stopIgnition = (e: React.PointerEvent) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setIsHolding(false);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  };

  // Handle Release
  const handleReleaseLantern = () => {
    if (warmth < 80 || isReleased) return;
    setIsReleased(true);
    sound?.playLanternRelease();

    setTimeout(() => {
      onComplete();
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden bg-[#050507]">
      {/* Background Starry Twilight Night Sky */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(255,140,0,0.15)_0%,rgba(35,12,25,0.7)_50%,#050507_100%)] pointer-events-none" />

      {/* Floating Stars in Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#ffe6b3] opacity-30 animate-pulse"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 17) % 95}%`,
              left: `${(i * 31) % 95}%`,
              animationDuration: `${2.5 + (i % 3)}s`,
            }}
          />
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
          Romantic Quest V • The Sky Lantern
        </span>
        <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffe6b3] to-[#f7c5d1]">
          Ignite & Release Your Wish
        </h2>
      </motion.div>

      {/* Background Floating Mini Lanterns (Ascend only upon release) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {isReleased &&
          backgroundLanterns.map((l) => (
            <motion.div
              key={l.id}
              initial={{ y: '105vh', x: `${l.x}%`, opacity: 0 }}
              animate={{
                y: '-25vh',
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
              <div className="w-8 h-12 rounded-t-md bg-gradient-to-b from-[#ffd79e] to-[#ff8c42] shadow-[0_0_15px_rgba(255,165,0,0.8)] opacity-90 relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white blur-[1px]" />
              </div>
            </motion.div>
          ))}
      </div>

      {/* Centered Main Interactive Sky Lantern */}
      <div className="relative z-20 flex flex-col items-center my-auto">
        <motion.div
          animate={
            isReleased
              ? {
                  y: -650,
                  scale: 0.2,
                  opacity: [1, 1, 0.6, 0],
                  rotate: 8,
                }
              : {
                  y: isHolding ? [-2, 2, -2] : [-6, 6, -6],
                  scale: isHolding ? 1.04 : 1,
                }
          }
          transition={
            isReleased
              ? { duration: 3.8, ease: [0.25, 0.1, 0.25, 1] }
              : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
          }
          className="relative flex flex-col items-center"
        >
          {/* Flame Halo Warm Glow */}
          <div
            className="absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(255,170,50,0.5)_0%,rgba(255,90,50,0.2)_50%,transparent_75%)] blur-2xl pointer-events-none transition-opacity duration-300"
            style={{ opacity: Math.max(0.3, warmth / 100) }}
          />

          {/* Paper Lantern Body */}
          <div className="relative w-40 h-56 rounded-t-3xl rounded-b-xl bg-gradient-to-b from-[#fff3db] via-[#ffd08a] to-[#ff8533] border border-[#fff]/50 shadow-[0_0_45px_rgba(255,140,0,0.65)] flex flex-col items-center justify-between p-4 overflow-hidden">
            {/* Paper texture ribs */}
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_16px,rgba(0,0,0,0.2)_16px,rgba(0,0,0,0.2)_18px)]" />

            {/* Inscription on Lantern */}
            <div className="z-10 text-center mt-5">
              <span className="text-lg font-serif text-[#5c2400] font-bold tracking-widest block">
                Make A Wish
              </span>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#883300]/80 font-medium mt-0.5 block">
                Together Forever
              </span>
            </div>

            {/* Inner Fire Flame */}
            <div className="relative z-10 flex flex-col items-center mb-1">
              <motion.div
                animate={{
                  scale: 0.7 + (warmth / 100) * 0.7,
                  opacity: 0.5 + (warmth / 100) * 0.5,
                }}
                className="relative"
              >
                <div className="w-7 h-12 rounded-full bg-gradient-to-t from-[#ff4400] via-[#ffbb00] to-[#ffffff] blur-[1px] shadow-[0_0_25px_#ff9900]" />
              </motion.div>
              {/* Wooden cross bar */}
              <div className="w-20 h-1.5 bg-[#4a2205] rounded-full mt-1" />
            </div>
          </div>
        </motion.div>

        {/* User Interaction Controls */}
        {!isReleased && (
          <div className="mt-7 flex flex-col items-center gap-3">
            {warmth < 100 ? (
              <button
                onPointerDown={startIgnition}
                onPointerUp={stopIgnition}
                onPointerCancel={stopIgnition}
                className={`px-8 py-3.5 rounded-full border text-white font-serif tracking-widest text-sm uppercase transition-all duration-200 active:scale-95 flex items-center gap-2.5 shadow-xl ${
                  isHolding
                    ? 'bg-gradient-to-r from-[#ff6b35] via-[#ff4d6d] to-[#ffd166] border-white shadow-[0_0_30px_rgba(255,107,53,0.8)] scale-105'
                    : 'bg-[#1a0c16]/90 border-[#f7c5d1]/40 hover:border-[#f7c5d1]'
                }`}
              >
                <Flame className={`w-4 h-4 ${isHolding ? 'text-white animate-bounce' : 'text-[#ff9900]'}`} />
                <span>{isHolding ? `Charging Flame: ${warmth}%` : 'Hold to Light Lantern'}</span>
              </button>
            ) : (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReleaseLantern}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff8533] via-[#ff3366] to-[#9e1b32] text-white font-serif tracking-widest text-sm uppercase shadow-[0_0_35px_rgba(255,100,50,0.8)] border border-white animate-pulse flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Release Lantern Into Sky</span>
              </motion.button>
            )}

            <span className="text-xs text-neutral-300 font-sans tracking-wide">
              {warmth < 100
                ? 'Press & hold the button until flame reaches 100%'
                : 'Lantern is fully illuminated! Tap to release ✨'}
            </span>
          </div>
        )}
      </div>

      <div className="z-20 text-center mb-2">
        <span className="text-[10px] text-neutral-500 font-sans tracking-widest uppercase">
          Chapter V of IX
        </span>
      </div>
    </div>
  );
}
