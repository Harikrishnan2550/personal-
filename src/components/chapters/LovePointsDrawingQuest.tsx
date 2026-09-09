'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ArrowRight, Lock, Key } from 'lucide-react';
import { sound } from '@/lib/audio';

interface LovePointsDrawingQuestProps {
  onComplete: () => void;
}

interface PointNode {
  id: number;
  x: number; // in 340x440 viewBox
  y: number;
  label: string;
}

const LOVE_POINTS: PointNode[] = [
  { id: 1, x: 170, y: 350, label: 'Soul' }, // Bottom tip of heart
  { id: 2, x: 80, y: 260, label: 'Trust' }, // Left lower
  { id: 3, x: 60, y: 160, label: 'Devotion' }, // Left lobe outer
  { id: 4, x: 120, y: 100, label: 'Passion' }, // Left lobe peak
  { id: 5, x: 170, y: 160, label: 'Forever' }, // Center cleft
  { id: 6, x: 220, y: 100, label: 'Magic' }, // Right lobe peak
  { id: 7, x: 280, y: 160, label: 'Harmony' }, // Right lobe outer
  { id: 8, x: 260, y: 260, label: 'Destiny' }, // Right lower
];

export default function LovePointsDrawingQuest({ onComplete }: LovePointsDrawingQuestProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [connectedIds, setConnectedIds] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Handle Touch/Pointer interaction
  const handlePointerDown = (pointId: number, e: React.PointerEvent) => {
    if (isCompleted) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (connectedIds.length === 0 && pointId === 1) {
      // Start from point 1
      setConnectedIds([1]);
      sound?.playFairyChime();
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (connectedIds.length === 0 || isCompleted || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lastPoint = LOVE_POINTS.find((p) => p.id === connectedIds[connectedIds.length - 1]);
    if (lastPoint) {
      setCurrentLine({
        x1: lastPoint.x,
        y1: lastPoint.y,
        x2: x,
        y2: y,
      });
    }

    // Check proximity to next expected point
    const nextExpectedId = connectedIds.length + 1;
    if (nextExpectedId <= LOVE_POINTS.length) {
      const nextPoint = LOVE_POINTS.find((p) => p.id === nextExpectedId);
      if (nextPoint) {
        const dist = Math.hypot(nextPoint.x - x, nextPoint.y - y);
        if (dist < 36) {
          // Connected next point!
          sound?.playFairyChime();
          const nextArr = [...connectedIds, nextExpectedId];
          setConnectedIds(nextArr);

          if (nextArr.length === LOVE_POINTS.length) {
            // All points connected! Complete heart seal
            setCurrentLine(null);
            setIsCompleted(true);
            sound?.playHeartHit();
          }
        }
      }
    }
  };

  const handlePointerUp = () => {
    setCurrentLine(null);
  };

  const resetDrawing = () => {
    setConnectedIds([]);
    setCurrentLine(null);
    setIsCompleted(false);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-[100dvh] flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden bg-[#050507] touch-none"
    >
      {/* Background Glowing Nebula */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,85,0.15)_0%,rgba(15,8,18,0.7)_50%,#050507_100%)] pointer-events-none" />

      {/* Header */}
      <div className="z-20 text-center mt-2">
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Romantic Quest IV • The Sacred Geometry
        </span>
        <h2 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7c5d1] to-[#ffe6b3]">
          Connect The 8 Love Points
        </h2>
        <p className="text-xs text-[#f7c5d1]/60 font-sans tracking-wider mt-0.5">
          Trace points 1 to 8 in continuous sequence to forge the Heart Lock
        </p>
      </div>

      {/* Love Points Drawing Canvas (340x440) */}
      <div className="relative w-[340px] h-[440px] my-auto flex items-center justify-center z-20">
        <svg viewBox="0 0 340 440" className="w-full h-full overflow-visible pointer-events-none">
          <defs>
            <linearGradient id="neonLaserGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="50%" stopColor="#ffe6b3" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <filter id="neonLaserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Established Connected Laser Lines */}
          {connectedIds.map((id, index) => {
            if (index === 0) return null;
            const pPrev = LOVE_POINTS.find((p) => p.id === connectedIds[index - 1])!;
            const pCurr = LOVE_POINTS.find((p) => p.id === id)!;

            return (
              <motion.line
                key={`laser-${index}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                x1={pPrev.x}
                y1={pPrev.y}
                x2={pCurr.x}
                y2={pCurr.y}
                stroke="url(#neonLaserGrad)"
                strokeWidth="3.5"
                filter="url(#neonLaserGlow)"
              />
            );
          })}

          {/* Final closure line (Point 8 back to Point 1) when completed */}
          {isCompleted && (
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              x1={LOVE_POINTS[7].x}
              y1={LOVE_POINTS[7].y}
              x2={LOVE_POINTS[0].x}
              y2={LOVE_POINTS[0].y}
              stroke="url(#neonLaserGrad)"
              strokeWidth="3.5"
              filter="url(#neonLaserGlow)"
            />
          )}

          {/* Active dragging dynamic cursor line */}
          {currentLine && (
            <line
              x1={currentLine.x1}
              y1={currentLine.y1}
              x2={currentLine.x2}
              y2={currentLine.y2}
              stroke="#ffe6b3"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              className="opacity-75"
            />
          )}
        </svg>

        {/* 8 Glowing Love Point Nodes */}
        {LOVE_POINTS.map((pt) => {
          const isConnected = connectedIds.includes(pt.id);
          const isNext = connectedIds.length + 1 === pt.id;

          return (
            <div
              key={pt.id}
              onPointerDown={(e) => handlePointerDown(pt.id, e)}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer pointer-events-auto z-30"
              style={{ left: pt.x, top: pt.y }}
            >
              {/* Point Button */}
              <motion.div
                animate={
                  isNext
                    ? { scale: [1, 1.35, 1], boxShadow: '0 0 25px #ffe6b3' }
                    : isConnected
                    ? { scale: 1.15 }
                    : { scale: 1 }
                }
                transition={{ duration: 1.2, repeat: isNext ? Infinity : 0 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-semibold border transition-all duration-300 ${
                  isConnected
                    ? 'bg-gradient-to-r from-[#ff4d6d] to-[#ffe6b3] text-[#9e1b32] border-white shadow-[0_0_20px_#ff4d6d]'
                    : isNext
                    ? 'bg-[#ffe6b3] text-black border-white shadow-[0_0_15px_#ffe6b3]'
                    : 'bg-black/70 text-white/60 border-white/20'
                }`}
              >
                {pt.id}
              </motion.div>

              {/* Point Label */}
              <span
                className={`text-[9px] font-sans tracking-widest uppercase mt-1 px-1.5 py-0.5 rounded-full transition-colors ${
                  isConnected ? 'text-[#ffe6b3] font-medium' : 'text-neutral-500'
                }`}
              >
                {pt.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="z-20 flex flex-col items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          {LOVE_POINTS.map((p) => (
            <div
              key={p.id}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                connectedIds.includes(p.id) ? 'bg-[#ffe6b3] shadow-[0_0_8px_#ffe6b3]' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <span className="text-[11px] text-neutral-400 font-sans">
          {isCompleted
            ? 'The Sacred Heart Lock is forged ❤️'
            : connectedIds.length === 0
            ? 'Touch Point 1 to begin drawing'
            : `Connected: ${connectedIds.length}/${LOVE_POINTS.length} points`}
        </span>

        <AnimatePresence>
          {isCompleted && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onComplete}
              className="mt-1 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#9e1b32] via-[#ff4d6d] to-[#ffe6b3] text-white font-serif tracking-widest text-sm uppercase shadow-[0_0_25px_rgba(255,77,109,0.7)] flex items-center gap-2"
            >
              <Key className="w-4 h-4 text-white" />
              <span>Unlock Sky Lanterns</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        {!isCompleted && connectedIds.length > 0 && (
          <button
            onClick={resetDrawing}
            className="text-[10px] text-neutral-500 hover:text-neutral-300 font-sans tracking-widest uppercase mt-0.5"
          >
            Reset points
          </button>
        )}
      </div>
    </div>
  );
}
