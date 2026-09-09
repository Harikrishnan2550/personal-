'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ArrowRight, Wand2 } from 'lucide-react';
import { sound } from '@/lib/audio';

interface MagicScratchCardGameProps {
  onComplete: () => void;
}

export default function MagicScratchCardGame({ onComplete }: MagicScratchCardGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratchedPct, setScratchedPct] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 220);

    // Fill with luxury rose-gold foil texture
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#d4af37');
    grad.addColorStop(0.3, '#f7c5d1');
    grad.addColorStop(0.7, '#e8a598');
    grad.addColorStop(1, '#9e1b32');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Text / Icon on the scratch surface
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to Reveal Secret Wish ✨', width / 2, height / 2 - 8);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '11px sans-serif';
    ctx.fillText('Rub with your finger to wipe away the golden dust', width / 2, height / 2 + 18);

    let isDrawing = false;
    let totalPixels = width * height;

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      sound?.playSparklerSizzle();

      // Check scratched percentage periodically
      if (Math.random() < 0.2) {
        const imgData = ctx.getImageData(0, 0, width, height);
        let transparentPixels = 0;
        for (let i = 3; i < imgData.data.length; i += 16) {
          if (imgData.data[i] === 0) transparentPixels++;
        }
        const pct = Math.round((transparentPixels / (totalPixels / 4)) * 100);
        setScratchedPct(pct);

        if (pct > 45 && !isRevealed) {
          setIsRevealed(true);
          sound?.playHeartHit();
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handlePointerUp = () => {
      isDrawing = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isRevealed]);

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden bg-[#050507]">
      {/* Background Starlight Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,165,152,0.15)_0%,rgba(15,8,18,0.7)_50%,#050507_100%)] pointer-events-none" />

      {/* Header */}
      <div className="z-20 text-center mt-2">
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Romantic Quest III • Golden Dust
        </span>
        <h2 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffe6b3] to-[#f7c5d1]">
          Scratch The Secret Note
        </h2>
        <p className="text-xs text-[#f7c5d1]/60 font-sans tracking-wider mt-0.5">
          Rub your finger across the golden card to reveal the hidden words
        </p>
      </div>

      {/* Scratch Card Container */}
      <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden border border-[#f7c5d1]/30 shadow-[0_15px_45px_rgba(0,0,0,0.8)] backdrop-blur-md my-auto flex items-center justify-center p-6 z-20">
        {/* Hidden Secret Message Underneath */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c0e18] via-[#120810] to-[#050507] p-6 flex flex-col items-center justify-center text-center gap-2">
          <Heart className="w-8 h-8 text-[#ff4d6d] fill-[#ff4d6d] animate-pulse" />
          <h4 className="text-lg font-serif text-white font-medium tracking-wide">
            “You are my favorite miracle.”
          </h4>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed max-w-xs">
            Every second spent beside you turns ordinary days into sweet poetry. Happy Birthday to
            the one who holds my whole heart.
          </p>
        </div>

        {/* Scratchable Canvas Layer */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full cursor-pointer touch-none z-10 transition-opacity duration-700 ${
            isRevealed && scratchedPct > 65 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />
      </div>

      {/* Footer Controls */}
      <div className="z-20 flex flex-col items-center gap-3 mb-4">
        <span className="text-xs font-sans tracking-widest uppercase text-[#ffe6b3]">
          {isRevealed ? 'Secret Note Unveiled ✨' : `Revealed: ${scratchedPct}%`}
        </span>

        <AnimatePresence>
          {isRevealed && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onComplete}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#9e1b32] via-[#ff4d6d] to-[#ffe6b3] text-white font-serif tracking-widest text-sm uppercase shadow-[0_0_25px_rgba(255,77,109,0.7)] flex items-center gap-2 transition-transform active:scale-95"
            >
              <Wand2 className="w-4 h-4 text-white" />
              <span>Release Sky Lanterns</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
