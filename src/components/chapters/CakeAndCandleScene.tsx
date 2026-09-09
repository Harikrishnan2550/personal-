'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/audio';
import { BIRTHDAY_CONFIG } from '@/lib/constants';

interface CakeAndCandleSceneProps {
  onComplete: () => void;
}

export default function CakeAndCandleScene({ onComplete }: CakeAndCandleSceneProps) {
  const [flameState, setFlameState] = useState<'burning' | 'shrinking' | 'smoke' | 'darkness'>('burning');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Extinguish sequence trigger
  const extinguishCandle = () => {
    if (flameState !== 'burning') return;
    setHasInteracted(true);
    setFlameState('shrinking');

    // 1. Shrink flame
    setTimeout(() => {
      setFlameState('smoke');
      sound?.playCandleExtinguish();

      // 2. Rising smoke, then pitch darkness
      setTimeout(() => {
        setFlameState('darkness');

        // 3. Cinematic suspense pause in pitch darkness, then reveal hanging lights
        setTimeout(() => {
          onComplete();
        }, 2200);
      }, 1200);
    }, 800);
  };

  // Automated timer in case user just watches the flame
  useEffect(() => {
    const autoTimer = setTimeout(() => {
      if (flameState === 'burning') {
        extinguishCandle();
      }
    }, 8000);

    return () => clearTimeout(autoTimer);
  }, [flameState]);

  return (
    <div
      className={`relative w-full h-[100dvh] flex flex-col items-center justify-between px-6 py-10 select-none overflow-hidden transition-colors duration-1000 ${
        flameState === 'darkness' ? 'bg-black' : 'bg-[#050507]'
      }`}
    >
      {/* Intimate Warm Candle Glow Aura */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-700 ${
          flameState === 'burning'
            ? 'w-[320px] h-[320px] bg-[radial-gradient(circle,rgba(255,200,100,0.18)_0%,rgba(158,27,50,0.08)_50%,transparent_75%)] blur-2xl animate-pulse'
            : flameState === 'shrinking'
            ? 'w-[140px] h-[140px] bg-[radial-gradient(circle,rgba(255,180,60,0.1)_0%,transparent_70%)] blur-xl'
            : 'opacity-0'
        }`}
      />

      {/* Header Prompt */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={flameState === 'darkness' ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center mt-4"
      >
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Chapter IV • The Wish
        </span>
        <h2 className="text-3xl font-serif text-white tracking-wide">
          {BIRTHDAY_CONFIG.cakeTitle}
        </h2>
      </motion.div>

      {/* Centerpiece: Luxury Birthday Cake with Candle */}
      <div
        onClick={extinguishCandle}
        className={`relative z-10 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-700 ${
          flameState === 'darkness' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Candle & Flame Container */}
        <div className="relative flex flex-col items-center mb-[-2px] z-20">
          {/* Flame / Smoke */}
          <div className="relative h-14 w-8 flex items-end justify-center">
            {flameState === 'burning' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative candle-flame-active"
              >
                {/* Outer Flame Glow */}
                <div className="w-5 h-9 rounded-full bg-gradient-to-t from-[#ff7b00] via-[#ffd000] to-[#ffffff] shadow-[0_0_18px_#ffaa00]" />
                {/* Inner Core Flame */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-4 rounded-full bg-gradient-to-t from-[#0099ff] via-[#ffffff] to-[#ffffff] opacity-90" />
              </motion.div>
            )}

            {flameState === 'shrinking' && (
              <motion.div
                animate={{ scale: [1, 0.4, 0.2], y: [0, 2, 4], opacity: [1, 0.7, 0] }}
                transition={{ duration: 0.8 }}
                className="w-3 h-5 rounded-full bg-gradient-to-t from-[#ff5500] to-[#ffe680]"
              />
            )}

            {flameState === 'smoke' && (
              <motion.div
                initial={{ opacity: 0.8, y: 0, scaleX: 0.8 }}
                animate={{ opacity: 0, y: -45, scaleX: 2.5, x: [0, 5, -5, 2] }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="w-2.5 h-8 bg-gradient-to-t from-neutral-400/80 via-neutral-500/40 to-transparent blur-xs rounded-full"
              />
            )}
          </div>

          {/* Candle Wick */}
          <div className="w-[2px] h-2 bg-neutral-900 rounded-t" />

          {/* Golden Candle Body */}
          <div className="w-3.5 h-16 rounded-t-sm bg-gradient-to-r from-[#d4af37] via-[#ffe6b3] to-[#b38f2a] shadow-md border-t border-[#fff]/40">
            {/* Candle Spiral Texture */}
            <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(0,0,0,0.2)_3px,rgba(0,0,0,0.2)_6px)]" />
          </div>
        </div>

        {/* 2-Tier Luxury Cake SVG / CSS */}
        <div className="relative flex flex-col items-center">
          {/* Top Tier */}
          <div className="relative w-36 h-18 rounded-t-xl bg-gradient-to-b from-[#fce4ec] to-[#f8bbd0] border-t border-[#fff]/60 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-end justify-center overflow-hidden">
            {/* Gold Leaf / Pearl Drip Details */}
            <div className="absolute top-0 inset-x-0 h-4 flex justify-between px-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-[#f8bbd0] -mt-1.5 shadow-sm" />
              ))}
            </div>
            <div className="w-full h-2 bg-gradient-to-r from-[#d4af37] via-[#ffe6b3] to-[#d4af37] opacity-80" />
          </div>

          {/* Bottom Tier */}
          <div className="relative w-52 h-24 rounded-t-2xl bg-gradient-to-b from-[#f8bbd0] via-[#f48fb1] to-[#e91e63]/30 border-t border-[#fff]/50 shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-end justify-center overflow-hidden -mt-1">
            {/* Cream Swirls */}
            <div className="absolute top-0 inset-x-0 h-5 flex justify-between px-2">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-[#fce4ec] -mt-2 shadow-sm" />
              ))}
            </div>
            {/* Gold Ribbon Base */}
            <div className="w-full h-3 bg-gradient-to-r from-[#b38f2a] via-[#ffe6b3] to-[#b38f2a] opacity-90 shadow-sm" />
          </div>

          {/* Luxury Cake Stand / Platter */}
          <div className="w-64 h-3 bg-gradient-to-r from-[#e0e0e0] via-[#ffffff] to-[#bdbdbd] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] mt-[-1px]" />
          <div className="w-20 h-4 bg-gradient-to-r from-[#bdbdbd] via-[#e0e0e0] to-[#9e9e9e] rounded-b-md shadow-lg" />
        </div>
      </div>

      {/* Bottom Text / Instruction */}
      <motion.div
        animate={flameState === 'darkness' ? { opacity: 0 } : { opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="z-10 text-center mb-6"
      >
        <p className="text-sm font-sans tracking-widest text-[#f7c5d1]/90 uppercase mb-1">
          {BIRTHDAY_CONFIG.cakeInstruction}
        </p>
        <span className="text-[11px] text-neutral-400 font-sans">
          {flameState === 'burning' ? 'Tap the candle or make a silent wish' : 'Extinguishing...'}
        </span>
      </motion.div>
    </div>
  );
}
