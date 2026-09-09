'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Fingerprint, Sparkles } from 'lucide-react';
import { sound } from '@/lib/audio';

interface HeartbeatResonanceSceneProps {
  onComplete: () => void;
}

export default function HeartbeatResonanceScene({ onComplete }: HeartbeatResonanceSceneProps) {
  const [resonance, setResonance] = useState(0); // 0 to 100%
  const [isScanning, setIsScanning] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startScan = () => {
    if (isUnlocked) return;
    setIsScanning(true);
    sound?.playHeartbeat();

    if (scanTimerRef.current) clearInterval(scanTimerRef.current);

    scanTimerRef.current = setInterval(() => {
      setResonance((prev) => {
        if (prev >= 100) {
          if (scanTimerRef.current) clearInterval(scanTimerRef.current);
          setIsUnlocked(true);
          sound?.playHeartHit();
          setTimeout(() => {
            onComplete();
          }, 1400);
          return 100;
        }

        // Trigger pulse sound at intervals
        if (prev % 20 === 0) {
          sound?.playHeartbeat();
        }

        return prev + 5;
      });
    }, 90);
  };

  const stopScan = () => {
    if (isUnlocked) return;
    setIsScanning(false);
    if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    // Slowly decay if released early
    setResonance((prev) => Math.max(0, prev - 15));
  };

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    };
  }, []);

  return (
    <div
      className="relative w-full h-[100dvh] flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden bg-[#050507]"
      onPointerUp={stopScan}
    >
      {/* Dynamic Red Cardiac Ambient Pulse */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
          isScanning ? 'opacity-35' : 'opacity-10'
        } bg-[radial-gradient(circle_at_center,rgba(255,42,85,0.35)_0%,rgba(158,27,50,0.15)_50%,transparent_80%)] animate-pulse`}
      />

      {/* Chapter Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-20 text-center mt-2"
      >
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Chapter VI • Resonance
        </span>
        <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7c5d1] to-[#ff4d6d]">
          Two Souls, One Rhythm
        </h2>
        <p className="text-xs text-[#f7c5d1]/60 font-sans tracking-wider mt-0.5">
          Place your thumb to sync our heartbeats
        </p>
      </motion.div>

      {/* Centerpiece: Glowing Biometric Heart Scanner */}
      <div className="relative z-20 flex flex-col items-center my-auto">
        <div
          onPointerDown={startScan}
          onPointerUp={stopScan}
          className="relative w-48 h-48 rounded-full flex items-center justify-center cursor-pointer touch-none active:scale-95 transition-transform duration-200"
        >
          {/* Outer Pulsing Shockwave Rings */}
          {isScanning && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-[#ff2a55] pointer-events-none"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0.9 }}
                animate={{ scale: 1.7, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border border-[#f7c5d1] pointer-events-none"
              />
            </>
          )}

          {/* Glowing Radial Background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1f0b18] via-[#120710] to-[#050507] border-2 border-[#f7c5d1]/30 shadow-[0_0_40px_rgba(255,42,85,0.4)] backdrop-blur-md" />

          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="84"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle
              cx="96"
              cy="96"
              r="84"
              fill="none"
              stroke="url(#heartbeatGrad)"
              strokeWidth="5"
              strokeDasharray={2 * Math.PI * 84}
              strokeDashoffset={2 * Math.PI * 84 * (1 - resonance / 100)}
              strokeLinecap="round"
              className="transition-all duration-150"
            />
            <defs>
              <linearGradient id="heartbeatGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff4d6d" />
                <stop offset="50%" stopColor="#f7c5d1" />
                <stop offset="100%" stopColor="#ffe6b3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Fingerprint / Heart Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {isUnlocked ? (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6 }}
              >
                <Heart className="w-16 h-16 text-[#ff2a55] fill-[#ff2a55] drop-shadow-[0_0_20px_#ff2a55]" />
              </motion.div>
            ) : isScanning ? (
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="w-14 h-14 text-[#ff4d6d] fill-[#ff4d6d]/60 drop-shadow-[0_0_15px_#ff4d6d]" />
              </motion.div>
            ) : (
              <Fingerprint className="w-14 h-14 text-[#f7c5d1]/70" />
            )}
          </div>
        </div>

        {/* Scan Instruction & Progress Meter */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif text-white tracking-widest font-medium">
              {resonance}%
            </span>
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-[#f7c5d1]/80">
              {isUnlocked
                ? 'Hearts Aligned ❤️'
                : isScanning
                ? 'Harmonizing...'
                : 'Hold to Sync'}
            </span>
          </div>

          <span className="text-[11px] text-neutral-400 font-sans tracking-wide">
            {isUnlocked
              ? 'Unlocking your birthday letter...'
              : 'Press & hold your thumb firmly on the sensor'}
          </span>
        </div>
      </div>

      <div className="z-20 text-center mb-2">
        <span className="text-[10px] text-neutral-500 font-sans tracking-widest uppercase">
          Chapter VI of VII
        </span>
      </div>
    </div>
  );
}
