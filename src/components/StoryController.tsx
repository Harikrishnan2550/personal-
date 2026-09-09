'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BowAndArrowScene from './chapters/BowAndArrowScene';
import BalloonExplosionScene from './chapters/BalloonExplosionScene';
import LoveTreeScene from './chapters/LoveTreeScene';
import StarlightCatcherGame from './chapters/StarlightCatcherGame';
import LoveMazeGame from './chapters/LoveMazeGame';
import MagicScratchCardGame from './chapters/MagicScratchCardGame';
import LovePointsDrawingQuest from './chapters/LovePointsDrawingQuest';
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
  | 'catchStars'
  | 'loveMaze'
  | 'scratchCard'
  | 'lovePoints'
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
            <LoveTreeScene onContinue={() => goToChapter('catchStars')} />
          </motion.div>
        )}

        {/* 4. Mini-Game Quest 1: Starlight Wish Catcher */}
        {currentChapter === 'catchStars' && (
          <motion.div
            key="catchStars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <StarlightCatcherGame onComplete={() => goToChapter('loveMaze')} />
          </motion.div>
        )}

        {/* 5. Mini-Game Quest 2: Stardust Love Path Labyrinth */}
        {currentChapter === 'loveMaze' && (
          <motion.div
            key="loveMaze"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <LoveMazeGame onComplete={() => goToChapter('scratchCard')} />
          </motion.div>
        )}

        {/* 6. Mini-Game Quest 3: Magic Golden Rose Dust Scratch-to-Reveal */}
        {currentChapter === 'scratchCard' && (
          <motion.div
            key="scratchCard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <MagicScratchCardGame onComplete={() => goToChapter('lovePoints')} />
          </motion.div>
        )}

        {/* 7. Mini-Game Quest 4: Connect The 8 Love Points Drawing */}
        {currentChapter === 'lovePoints' && (
          <motion.div
            key="lovePoints"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <LovePointsDrawingQuest onComplete={() => goToChapter('lantern')} />
          </motion.div>
        )}

        {/* 8. The Floating Sky Lanterns of Wishes */}
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

        {/* 9. Star Constellation & Finger Sparklers */}
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

        {/* 10. Birthday Cake & Candle Extinguish */}
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

        {/* 11. Hanging Fairy Lights & Polaroid Memories */}
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

        {/* 12. Biometric Heartbeat Resonance Lock */}
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

        {/* 13. Final Unfolded Letter & Confetti Celebration */}
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
