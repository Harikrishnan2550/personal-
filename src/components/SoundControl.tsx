'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '@/lib/audio';

export default function SoundControl() {
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Initial sound state check
    if (sound) {
      setIsMuted(sound.getMuted());
    }
  }, []);

  const toggleSound = () => {
    setHasInteracted(true);
    if (!sound) return;
    const nextState = !isMuted;
    sound.setMuted(nextState);
    setIsMuted(nextState);
    if (!nextState) {
      sound.playFairyChime();
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 pointer-events-auto">
      <button
        onClick={toggleSound}
        className="relative group flex items-center gap-2.5 px-3 py-2 rounded-full bg-[#0d0812]/80 backdrop-blur-md border border-[#f7c5d1]/20 text-[#f5f5f7] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#f7c5d1]/50 hover:bg-[#160b18]/90 active:scale-95"
        aria-label={isMuted ? 'Unmute cinematic sound' : 'Mute cinematic sound'}
      >
        <span className="relative flex h-2 w-2">
          {!isMuted && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f7c5d1] opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 transition-colors duration-300 ${
              isMuted ? 'bg-neutral-600' : 'bg-[#f7c5d1]'
            }`}
          />
        </span>

        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-[#f7c5d1] group-hover:text-white transition-colors" />
        )}

        <span className="text-[11px] font-sans tracking-wider uppercase text-neutral-300 group-hover:text-white font-medium pr-0.5">
          {isMuted ? 'Muted' : 'Sound'}
        </span>
      </button>

    </div>
  );
}
