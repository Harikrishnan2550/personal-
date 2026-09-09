'use client';

import React from 'react';
import SoundControl from './SoundControl';

interface CinematicContainerProps {
  children: React.ReactNode;
}

export default function CinematicContainer({ children }: CinematicContainerProps) {
  return (
    <div className="relative min-h-[100dvh] w-full bg-[#050507] text-[#f5f5f7] flex justify-center items-center overflow-x-hidden">
      {/* Ambient background glow for desktop viewers */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_40%,rgba(158,27,50,0.12)_0%,rgba(11,8,13,0.8)_60%,#050507_100%)] hidden md:block" />

      {/* Film grain texture */}
      <div className="film-grain" />

      {/* Floating Audio Switch */}
      <SoundControl />

      {/* Main 9:16 Mobile Viewport Frame */}
      <main
        id="cinema-viewport"
        className="relative w-full max-w-[480px] min-h-[100dvh] bg-[#050507] md:border-x md:border-[#f7c5d1]/10 md:shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center justify-start"
      >
        {children}
      </main>
    </div>
  );
}
