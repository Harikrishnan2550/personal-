'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BowAndArrowScene from './chapters/BowAndArrowScene';
import BalloonExplosionScene from './chapters/BalloonExplosionScene';
import LoveTreeScene from './chapters/LoveTreeScene';
import SkyLanternScene from './chapters/SkyLanternScene';
import StarConstellationScene from './chapters/StarConstellationScene';
import CakeAndCandleScene from './chapters/CakeAndCandleScene';
import HangingLightsAndMemories from './chapters/HangingLightsAndMemories';
import HeartbeatResonanceScene from './chapters/HeartbeatResonanceScene';
import FinalBirthdayScene from './chapters/FinalBirthdayScene';

export type Chapter =
  | 'bow'
  | 'balloons'
  | 'tree'
  | 'lantern'
  | 'constellation'
  | 'cake'
  | 'memories'
  | 'heartbeat'
  | 'final';

export default function StoryController() {
  const [currentChapter, setCurrentChapter] = useState<Chapter>('bow');

  const goToChapter = (chapter: Chapter) => {
    setCurrentChapter(chapter);
  };

  const restartStory = () => {
    setCurrentChapter('bow');
  };

  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden bg-[#050507]">
      <AnimatePresence mode="wait">
        {/* 1. Bow & Arrow */}
        {currentChapter === 'bow' && (
          <motion.div
            key="bow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <BowAndArrowScene onArrowHit={() => goToChapter('balloons')} />
          </motion.div>
        )}

        {/* 2. 3D Balloons Explosion & Fog */}
        {currentChapter === 'balloons' && (
          <motion.div
            key="balloons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <BalloonExplosionScene onComplete={() => goToChapter('tree')} />
          </motion.div>
        )}

        {/* 3. The Tree of Love with Love Emojis Canopy */}
        {currentChapter === 'tree' && (
          <motion.div
            key="tree"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <LoveTreeScene onContinue={() => goToChapter('lantern')} />
          </motion.div>
        )}

        {/* 4. The Floating Sky Lanterns of Wishes */}
        {currentChapter === 'lantern' && (
          <motion.div
            key="lantern"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <SkyLanternScene onComplete={() => goToChapter('constellation')} />
          </motion.div>
        )}

        {/* 5. Star Constellation & Finger Sparklers */}
        {currentChapter === 'constellation' && (
          <motion.div
            key="constellation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <StarConstellationScene onComplete={() => goToChapter('cake')} />
          </motion.div>
        )}

        {/* 6. Birthday Cake & Candle Extinguish */}
        {currentChapter === 'cake' && (
          <motion.div
            key="cake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <CakeAndCandleScene onComplete={() => goToChapter('memories')} />
          </motion.div>
        )}

        {/* 7. Hanging Fairy Lights & Polaroid Memories */}
        {currentChapter === 'memories' && (
          <motion.div
            key="memories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <HangingLightsAndMemories onContinue={() => goToChapter('heartbeat')} />
          </motion.div>
        )}

        {/* 8. Biometric Heartbeat Resonance Lock */}
        {currentChapter === 'heartbeat' && (
          <motion.div
            key="heartbeat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <HeartbeatResonanceScene onComplete={() => goToChapter('final')} />
          </motion.div>
        )}

        {/* 9. Final Unfolded Letter & Confetti Celebration */}
        {currentChapter === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <FinalBirthdayScene onRestart={restartStory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
