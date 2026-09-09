'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Bubble {
  id: number;
  x: number; // 5% to 95%
  size: number;
  speed: number;
  delay: number;
  opacity: number;
  drift: number;
  colorGrad: string;
}

export default function FloatingBubbles() {
  // 28 glowing floating romantic glass bubbles distributed evenly across the entire screen
  const bubbles = useMemo<Bubble[]>(() => {
    const cols = 14;
    const items: Bubble[] = [];

    const bubbleColors = [
      'from-[#ffe6b3]/80 via-[#ff8fa3]/60 to-[#ffffff]/90',
      'from-[#ff4d6d]/70 via-[#f7c5d1]/50 to-[#ffffff]/90',
      'from-[#ffd166]/80 via-[#ffeaa7]/60 to-[#ffffff]/95',
      'from-[#ff758f]/75 via-[#fce4ec]/55 to-[#ffffff]/90',
    ];

    for (let c = 0; c < cols; c++) {
      for (let row = 0; row < 2; row++) {
        const baseX = (c / (cols - 1)) * 90 + 5; // 5% to 95%
        const jitterX = (Math.random() - 0.5) * 4;
        const size = 6 + Math.random() * 8; // 6px to 14px plump glowing bubbles
        const speed = 8 + Math.random() * 5; // 8s to 13s smooth float
        const delay = (c * 0.5 + row * 4 + Math.random() * 2) % 10;
        const opacity = 0.35 + Math.random() * 0.35;
        const drift = (Math.random() - 0.5) * 16;
        const grad = bubbleColors[(c + row) % bubbleColors.length];

        items.push({
          id: c * 2 + row,
          x: Math.max(4, Math.min(96, baseX + jitterX)),
          size,
          speed,
          delay,
          opacity,
          drift,
          colorGrad: grad,
        });
      }
    }

    return items;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{ y: '105vh', opacity: 0, x: `${b.x}%` }}
          animate={{
            y: '-10vh',
            opacity: [0, b.opacity, b.opacity, 0],
            x: [`${b.x}%`, `${b.x + b.drift}%`, `${b.x}%`],
          }}
          transition={{
            duration: b.speed,
            repeat: Infinity,
            delay: b.delay,
            ease: 'linear',
          }}
          className="absolute rounded-full"
          style={{ width: `${b.size}px`, height: `${b.size}px` }}
        >
          {/* Glowing Romantic Glass Bubble Sphere */}
          <div
            className={`w-full h-full rounded-full bg-gradient-to-tr ${b.colorGrad} shadow-[0_0_12px_rgba(255,200,150,0.6)] border border-white/40 relative flex items-center justify-center`}
          >
            {/* Specular curved highlight */}
            <div className="absolute top-0.5 left-1 w-1.5 h-1.5 rounded-full bg-white/90 blur-[0.5px]" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
