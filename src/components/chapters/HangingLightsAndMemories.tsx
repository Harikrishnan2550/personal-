'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { sound } from '@/lib/audio';
import { BIRTHDAY_CONFIG } from '@/lib/constants';

interface HangingLightsAndMemoriesProps {
  onContinue: () => void;
}

export default function HangingLightsAndMemories({ onContinue }: HangingLightsAndMemoriesProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  useEffect(() => {
    sound?.playFairyChime();
    sound?.startAmbientPad();
  }, []);

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-start px-4 pt-4 pb-16 select-none bg-[#050507] text-[#f5f5f7] overflow-y-auto">
      {/* Chapter 8: Hanging Fairy / LED Light Strings */}
      <div className="sticky top-0 w-full z-30 pointer-events-none mb-4">
        <svg
          viewBox="0 0 400 110"
          className="w-full h-24 overflow-visible drop-shadow-[0_0_15px_rgba(255,230,179,0.7)]"
        >
          <defs>
            <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#ffe6b3" />
              <stop offset="80%" stopColor="#f7c5d1" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Wire String 1 */}
          <path
            d="M -10 15 Q 100 50 200 20 Q 300 55 410 15"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.2"
          />

          {/* Wire String 2 */}
          <path
            d="M -10 35 Q 90 75 190 40 Q 290 80 410 35"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />

          {/* Hanging Bulbs String 1 */}
          {[
            { x: 45, y: 36, delay: 0.1, len: 14 },
            { x: 105, y: 49, delay: 0.5, len: 22 },
            { x: 160, y: 35, delay: 0.8, len: 16 },
            { x: 235, y: 34, delay: 0.3, len: 18 },
            { x: 295, y: 53, delay: 0.9, len: 24 },
            { x: 355, y: 33, delay: 0.4, len: 15 },
          ].map((bulb, i) => (
            <g key={`b1-${i}`} className="fairy-sway" style={{ animationDelay: `${bulb.delay}s` }}>
              {/* Drop wire */}
              <line
                x1={bulb.x}
                y1={bulb.y}
                x2={bulb.x}
                y2={bulb.y + bulb.len}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
              {/* Bulb Socket */}
              <rect x={bulb.x - 2} y={bulb.y + bulb.len - 3} width="4" height="3" fill="#888" rx="0.5" />
              {/* Bulb Halo Glow */}
              <circle
                cx={bulb.x}
                cy={bulb.y + bulb.len + 3}
                r="10"
                fill="url(#bulbGlow)"
                className="animate-pulse"
                style={{ animationDuration: `${2 + (i % 3)}s` }}
              />
              {/* Bulb Core */}
              <circle cx={bulb.x} cy={bulb.y + bulb.len + 3} r="3.5" fill="#fff" />
            </g>
          ))}

          {/* Hanging Bulbs String 2 */}
          {[
            { x: 20, y: 42, delay: 0.7, len: 12 },
            { x: 75, y: 68, delay: 0.2, len: 18 },
            { x: 135, y: 62, delay: 1.1, len: 15 },
            { x: 265, y: 72, delay: 0.6, len: 20 },
            { x: 330, y: 58, delay: 1.3, len: 14 },
            { x: 385, y: 40, delay: 0.4, len: 12 },
          ].map((bulb, i) => (
            <g key={`b2-${i}`} className="fairy-sway" style={{ animationDelay: `${bulb.delay}s` }}>
              <line
                x1={bulb.x}
                y1={bulb.y}
                x2={bulb.x}
                y2={bulb.y + bulb.len}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.8"
              />
              <circle
                cx={bulb.x}
                cy={bulb.y + bulb.len + 2.5}
                r="8"
                fill="url(#bulbGlow)"
                className="animate-pulse"
                style={{ animationDuration: `${2.5 + (i % 2)}s` }}
              />
              <circle cx={bulb.x} cy={bulb.y + bulb.len + 2.5} r="2.8" fill="#ffe6b3" />
            </g>
          ))}
        </svg>
      </div>

      {/* Chapter 8 / 9 Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center mb-8"
      >
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Chapter V • The Gallery of Us
        </span>
        <h2 className="text-3xl font-serif text-white tracking-wide">
          Memories Suspended in Time
        </h2>
        <p className="text-xs text-[#f7c5d1]/60 font-sans tracking-widest mt-1">
          Every picture holds a quiet promise
        </p>
      </motion.div>

      {/* Interspersed Memories & Love Quotes Stream */}
      <div className="w-full max-w-sm flex flex-col gap-12 z-20">
        {BIRTHDAY_CONFIG.memories.map((mem, idx) => {
          const matchingQuote = BIRTHDAY_CONFIG.quotes[idx];

          return (
            <div key={mem.id} className="flex flex-col items-center gap-8 w-full">
              {/* Polaroid Memory Card */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: mem.rotation * 1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: mem.rotation }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                whileHover={{ scale: 1.03, rotate: 0 }}
                onClick={() => {
                  sound?.playFairyChime();
                  setActivePhotoIdx(activePhotoIdx === idx ? null : idx);
                }}
                className="relative group w-full bg-[#140e16]/90 p-3.5 pb-5 rounded-2xl border border-[#f7c5d1]/20 shadow-[0_12px_35px_rgba(0,0,0,0.7)] backdrop-blur-md cursor-pointer transition-all duration-300 hover:border-[#f7c5d1]/60 hover:shadow-[0_15px_40px_rgba(247,197,209,0.2)]"
              >
                {/* Vintage Tape / Clip Graphic on Top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-[#ffe6b3]/30 backdrop-blur-xs border border-[#ffe6b3]/40 rounded-xs shadow-xs -rotate-2" />

                {/* Photo Image Container */}
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900 shadow-inner">
                  <Image
                    src={mem.image}
                    alt={mem.title}
                    fill
                    sizes="(max-width: 480px) 100vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={idx === 0}
                  />

                  {/* Soft Warm Film Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-40 transition-opacity" />

                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="text-[11px] font-sans tracking-wider px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white/90 border border-white/10 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#f7c5d1]" />
                      {mem.location}
                    </span>
                    <span className="text-[11px] font-sans text-neutral-300 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#ffe6b3]" />
                      {mem.date}
                    </span>
                  </div>
                </div>

                {/* Polaroid Bottom Caption Area */}
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-serif text-white font-medium">{mem.title}</h3>
                    <Heart className="w-4 h-4 text-[#ff4d6d] fill-[#ff4d6d]/40 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs font-sans text-neutral-300 mt-1 leading-relaxed">
                    {mem.caption}
                  </p>
                </div>
              </motion.div>

              {/* Interspersed Romantic Quote */}
              {matchingQuote && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 1 }}
                  className="w-full text-center py-6 px-4 border-y border-[#f7c5d1]/10 my-2"
                >
                  <p className="text-xl md:text-2xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7c5d1] to-[#ffe6b3] leading-relaxed">
                    {matchingQuote.text}
                  </p>
                  {matchingQuote.subtext && (
                    <span className="text-xs font-sans tracking-[0.2em] text-[#f7c5d1]/60 uppercase block mt-2">
                      {matchingQuote.subtext}
                    </span>
                  )}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Button to proceed to Final Chapter */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-14 z-20 flex flex-col items-center gap-2"
      >
        <button
          onClick={onContinue}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#9e1b32] via-[#672233] to-[#2d1222] border border-[#f7c5d1]/40 text-white font-serif tracking-widest text-base uppercase shadow-[0_6px_25px_rgba(158,27,50,0.4)] hover:shadow-[0_8px_35px_rgba(247,197,209,0.4)] hover:border-[#f7c5d1] transition-all duration-300 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[#ffe6b3]" />
          <span>The Final Birthday Wish</span>
          <ArrowRight className="w-4 h-4 text-[#f7c5d1] group-hover:translate-x-1 transition-transform" />
        </button>
        <span className="text-[11px] text-neutral-400 font-sans tracking-wide">
          A personal message from the heart
        </span>
      </motion.div>
    </div>
  );
}
