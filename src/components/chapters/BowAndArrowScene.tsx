'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/lib/audio';
import { BIRTHDAY_CONFIG } from '@/lib/constants';

interface BowAndArrowSceneProps {
  onArrowHit: () => void;
}

export default function BowAndArrowScene({ onArrowHit }: BowAndArrowSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isShot, setIsShot] = useState(false);
  const [isImpacted, setIsImpacted] = useState(false);
  const [screenShake, setScreenShake] = useState(false);

  // Bow dimensions & anchor points
  const bowWidth = 240;
  const bowHeight = 220;
  const bowCenter = { x: 120, y: 110 };
  const topTip = { x: 30, y: 30 };
  const bottomTip = { x: 210, y: 30 };

  // Max draw distance
  const maxDrag = 140;

  // Pointer start position
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Handle Drag Start
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isShot) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    sound?.playBowDraw(0.1);
  };

  // Handle Dragging
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current || isShot) return;
    e.preventDefault();

    const deltaY = e.clientY - dragStartRef.current.y;
    const deltaX = (e.clientX - dragStartRef.current.x) * 0.4; // slight horizontal resistance

    // Only allow pulling downwards/backwards
    const clampedY = Math.max(0, Math.min(maxDrag, deltaY));
    const clampedX = Math.max(-40, Math.min(40, deltaX));

    setDragOffset({ x: clampedX, y: clampedY });

    const tension = clampedY / maxDrag;
    if (Math.random() < 0.25) {
      sound?.playBowDraw(tension);
    }
  };

  // Handle Release / Shoot
  const handleRelease = useCallback(() => {
    if (!isDragging || isShot) return;
    setIsDragging(false);

    const pullDistance = Math.hypot(dragOffset.x, dragOffset.y);

    if (pullDistance > 35) {
      // Valid shot!
      setIsShot(true);
      sound?.playArrowRelease();
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);

      // Hit the heart after flight duration
      setTimeout(() => {
        setIsImpacted(true);
        sound?.playHeartHit();
        setTimeout(() => {
          onArrowHit();
        }, 350);
      }, 320);
    } else {
      // Snap back if not pulled enough
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isDragging, isShot, dragOffset, onArrowHit]);

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    handleRelease();
  };

  // Calculate string nock pull point
  const nockPoint = {
    x: bowCenter.x + dragOffset.x * 0.7,
    y: bowCenter.y + dragOffset.y,
  };

  const tensionPercent = Math.min(100, Math.round((dragOffset.y / maxDrag) * 100));

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[100dvh] flex flex-col items-center justify-between px-6 py-10 select-none overflow-hidden touch-none transition-transform duration-100 ${
        screenShake ? 'scale-105 translate-y-1' : 'scale-100'
      }`}
    >
      {/* Top Section: Header Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="z-10 text-center mt-6"
      >
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/60 uppercase block mb-1">
          Chapter I • The Wish
        </span>
        <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fff] via-[#f7c5d1] to-[#e8a598]">
          One Little Wish...
        </h1>
      </motion.div>

      {/* Target: Glowing Floating Heart */}
      <div className="relative z-10 flex flex-col items-center my-auto">
        <motion.div
          animate={
            isImpacted
              ? { scale: [1, 1.4, 0], opacity: [1, 1, 0], filter: 'drop-shadow(0 0 40px #ff2a55)' }
              : { y: [-6, 6, -6], scale: [1, 1.04, 1] }
          }
          transition={
            isImpacted
              ? { duration: 0.35 }
              : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative flex items-center justify-center cursor-pointer"
        >
          {/* Heart Ambient Glow Aura */}
          <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-[#9e1b32]/40 via-[#f7c5d1]/30 to-transparent blur-xl animate-ambient-glow" />

          {/* SVG Heart */}
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-all duration-300 ${
              isImpacted ? 'scale-125' : 'drop-shadow-[0_0_20px_rgba(247,197,209,0.8)]'
            }`}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="url(#heartGradient)"
            />
            <defs>
              <linearGradient id="heartGradient" x1="2" y1="3" x2="22" y2="21.35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff4d6d" />
                <stop offset="0.5" stopColor="#c9184a" />
                <stop offset="1" stopColor="#590d22" />
              </linearGradient>
            </defs>
          </svg>

          {/* Impact Shockwave Ring */}
          {isImpacted && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute w-20 h-20 rounded-full border-2 border-[#fff] pointer-events-none"
            />
          )}
        </motion.div>
      </div>

      {/* Interactive Bow & Arrow Area */}
      <div
        className="relative z-20 w-full flex flex-col items-center justify-center mb-6 touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handleRelease}
      >
        <div className="relative w-[260px] h-[220px] flex items-center justify-center">
          {/* Tension Power Glow Ring */}
          {isDragging && (
            <motion.div
              style={{ opacity: tensionPercent / 100 }}
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(247,197,209,0.18)_0%,transparent_70%)] pointer-events-none animate-pulse"
            />
          )}

          {/* SVG Bow & String */}
          <svg
            width={bowWidth}
            height={bowHeight}
            viewBox={`0 0 ${bowWidth} ${bowHeight}`}
            className="overflow-visible pointer-events-none"
          >
            <defs>
              {/* Bow Wood/Gold Gradient */}
              <linearGradient id="bowWood" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="30%" stopColor="#8b5a2b" />
                <stop offset="70%" stopColor="#5c3a21" />
                <stop offset="100%" stopColor="#e5c158" />
              </linearGradient>
              <linearGradient id="stringGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#f7c5d1" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>

            {/* Realistic Curved Bow Stave (Arch) */}
            <path
              d={`M ${topTip.x} ${topTip.y} Q ${bowCenter.x} ${bowCenter.y - 40} ${bottomTip.x} ${bottomTip.y}`}
              fill="none"
              stroke="url(#bowWood)"
              strokeWidth="7"
              strokeLinecap="round"
              className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            />

            {/* Bow Tip Accents */}
            <circle cx={topTip.x} cy={topTip.y} r="5" fill="#f7c5d1" />
            <circle cx={bottomTip.x} cy={bottomTip.y} r="5" fill="#f7c5d1" />

            {/* Bow Grip Wrap */}
            <path
              d={`M ${bowCenter.x - 12} ${bowCenter.y - 40} Q ${bowCenter.x} ${bowCenter.y - 38} ${bowCenter.x + 12} ${bowCenter.y - 40}`}
              fill="none"
              stroke="#e8a598"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Dynamic Flexible Bow String (2 segments attached to nock point) */}
            <path
              d={`M ${topTip.x} ${topTip.y} L ${nockPoint.x} ${nockPoint.y} L ${bottomTip.x} ${bottomTip.y}`}
              fill="none"
              stroke="url(#stringGlow)"
              strokeWidth={isDragging ? '2.5' : '1.8'}
              strokeLinecap="round"
              className="drop-shadow-[0_0_6px_rgba(247,197,209,0.9)]"
            />
          </svg>

          {/* Draggable / Flying Arrow */}
          <motion.div
            style={{
              position: 'absolute',
              transformOrigin: 'top center',
            }}
            animate={
              isShot
                ? {
                    y: -420,
                    scaleY: 1.4,
                    opacity: [1, 1, 0],
                    filter: 'drop-shadow(0 0 16px #f7c5d1)',
                  }
                : {
                    x: dragOffset.x * 0.7,
                    y: dragOffset.y * 0.85,
                    rotate: dragOffset.x * 0.2,
                  }
            }
            transition={
              isShot
                ? { duration: 0.32, ease: [0.12, 0, 0.39, 0] }
                : { type: 'spring', damping: 15, stiffness: 220 }
            }
            className={`cursor-grab active:cursor-grabbing pointer-events-auto ${
              isDragging ? 'scale-105' : ''
            }`}
          >
            {/* Arrow SVG */}
            <svg width="32" height="150" viewBox="0 0 32 150" fill="none">
              <defs>
                <linearGradient id="arrowShaft" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="50%" stopColor="#f5f5f7" />
                  <stop offset="100%" stopColor="#b38f2a" />
                </linearGradient>
                <linearGradient id="featherGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f7c5d1" />
                  <stop offset="100%" stopColor="#9e1b32" />
                </linearGradient>
              </defs>

              {/* Arrowhead (Broadhead Tip) */}
              <polygon points="16,0 8,24 16,18 24,24" fill="#ffffff" filter="drop-shadow(0 0 8px #f7c5d1)" />
              <polygon points="16,4 12,20 16,16 20,20" fill="#e8a598" />

              {/* Arrow Shaft */}
              <rect x="14.5" y="18" width="3" height="110" rx="1.5" fill="url(#arrowShaft)" />

              {/* Feather Fletchings */}
              <path d="M 14.5 105 Q 6 115 8 135 L 14.5 125 Z" fill="url(#featherGrad)" />
              <path d="M 17.5 105 Q 26 115 24 135 L 17.5 125 Z" fill="url(#featherGrad)" />

              {/* Nock Notch */}
              <rect x="14" y="128" width="4" height="6" rx="1" fill="#d4af37" />
            </svg>
          </motion.div>
        </div>

        {/* Drag Instruction Cue */}
        <motion.div
          animate={isDragging ? { opacity: 0.3 } : { opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 flex flex-col items-center gap-1.5 pointer-events-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f7c5d1]" />
            <span className="text-[12px] font-sans tracking-widest text-[#f7c5d1]/80 uppercase">
              {isDragging ? `Tension ${tensionPercent}%` : BIRTHDAY_CONFIG.bowSubtitle}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f7c5d1]" />
          </div>
          <span className="text-[11px] text-neutral-400 font-sans">
            {isDragging ? 'Release to shoot' : 'Touch and drag arrow backwards'}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
