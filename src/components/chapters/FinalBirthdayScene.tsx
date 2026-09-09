'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RotateCcw, Heart, Sparkles } from 'lucide-react';
import { sound } from '@/lib/audio';
import { BIRTHDAY_CONFIG } from '@/lib/constants';

interface FinalBirthdaySceneProps {
  onRestart: () => void;
}

export default function FinalBirthdayScene({ onRestart }: FinalBirthdaySceneProps) {
  const [step, setStep] = useState(0); // 0: Letter/Envelope, 1: Unfolded Full Message
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    sound?.playFairyChime();
  }, []);

  const triggerConfetti = () => {
    sound?.playHeartHit();
    setIsRevealed(true);
    setStep(1);

    // Rose gold & blush romantic confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f7c5d1', '#e8a598', '#ff4d6d', '#ffe6b3', '#ffffff'],
      disableForReducedMotion: true,
    });
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-between px-6 py-12 select-none overflow-hidden bg-[#050507] text-[#f5f5f7]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(247,197,209,0.14)_0%,rgba(158,27,50,0.08)_45%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* Floating Starlight Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#ffe6b3] opacity-30 animate-pulse"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 17) % 100}%`,
              left: `${(i * 29) % 100}%`,
              animationDuration: `${3 + (i % 3)}s`,
              animationDelay: `${(i % 4) * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center mt-2"
      >
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase">
          Chapter VI • Forever
        </span>
      </motion.div>

      {/* Main Card / Letter Experience */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center my-auto">
        {!isRevealed ? (
          // Sealed Letter Envelope Prompt
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
            onClick={triggerConfetti}
            className="group relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#1c0e18] via-[#120810] to-[#050507] border border-[#f7c5d1]/30 p-6 flex flex-col items-center justify-center cursor-pointer shadow-[0_15px_45px_rgba(0,0,0,0.8)] backdrop-blur-md hover:border-[#f7c5d1]/70 transition-all duration-300 active:scale-95"
          >
            {/* Wax Seal */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9e1b32] via-[#c9184a] to-[#ff4d6d] flex items-center justify-center shadow-[0_0_25px_rgba(201,24,74,0.6)] group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-white fill-white/80" />
            </div>

            <h3 className="text-xl font-serif text-white tracking-wide mt-4">
              Open Your Birthday Letter
            </h3>
            <span className="text-xs font-sans text-[#f7c5d1]/70 tracking-widest uppercase mt-1">
              Tap to unveil the secret message
            </span>
          </motion.div>
        ) : (
          // Unfolded Letter Content
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="w-full bg-[#120914]/90 border border-[#f7c5d1]/25 p-7 rounded-3xl backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-center flex flex-col items-center gap-6"
          >
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-xs font-sans tracking-[0.25em] text-[#f7c5d1]/70 uppercase block mb-1">
                {BIRTHDAY_CONFIG.finalMessage.heading}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7c5d1] to-[#ffe6b3] font-normal tracking-wide">
                {BIRTHDAY_CONFIG.recipientName}
              </h2>
            </motion.div>

            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#f7c5d1]/40 to-transparent" />

            {/* Wish */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-base font-serif text-neutral-200 leading-relaxed italic"
            >
              {BIRTHDAY_CONFIG.finalMessage.wish}
            </motion.p>

            {/* Whisper & Promise */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="flex flex-col gap-2 py-2"
            >
              <p className="text-xs font-sans tracking-widest text-[#f7c5d1]/80 uppercase">
                {BIRTHDAY_CONFIG.finalMessage.whisper}
              </p>
              <p className="text-lg font-serif text-white font-medium">
                {BIRTHDAY_CONFIG.finalMessage.promise}
              </p>
            </motion.div>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="pt-2 flex flex-col items-center gap-1"
            >
              <span className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d6d] via-[#f7c5d1] to-[#ffe6b3]">
                {BIRTHDAY_CONFIG.finalMessage.signature}
              </span>
              <p className="text-[11px] font-sans text-neutral-400 mt-2 max-w-xs leading-relaxed">
                {BIRTHDAY_CONFIG.finalMessage.postscript}
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Bottom Controls: Replay Experience */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="z-10 flex flex-col items-center gap-2 mb-2"
      >
        <button
          onClick={onRestart}
          className="group flex items-center gap-2 px-5 py-2 rounded-full bg-[#160b18]/80 border border-[#f7c5d1]/20 text-neutral-300 hover:text-white hover:border-[#f7c5d1]/50 text-xs font-sans tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#f7c5d1] group-hover:-rotate-90 transition-transform duration-500" />
          <span>Replay Story</span>
        </button>
      </motion.div>
    </div>
  );
}
