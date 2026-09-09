'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface BalloonExplosionSceneProps {
  onComplete: () => void;
}

export default function BalloonExplosionScene({ onComplete }: BalloonExplosionSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fogOpacity, setFogOpacity] = useState(0);
  const [scenePhase, setScenePhase] = useState<'exploding' | 'foggy' | 'dissolving'>('exploding');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050507);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 30;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffd1dc, 2.0);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x9e1b32, 1.5);
    dirLight2.position.set(-10, -10, 10);
    scene.add(dirLight2);

    // 4. Instanced Mesh for 700 Balloons (Ultra 60FPS mobile performance)
    const balloonCount = 700;
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    // Slightly elongate sphere vertically for balloon shape
    geometry.scale(1, 1.25, 1);

    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.25,
      metalness: 0.15,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, balloonCount);

    // Palette: soft pink, rose, red, blush, white, burgundy
    const colorPalette = [
      new THREE.Color('#f7c5d1'), // blush
      new THREE.Color('#ff8fa3'), // soft rose
      new THREE.Color('#ff4d6d'), // vivid pink
      new THREE.Color('#c9184a'), // deep rose
      new THREE.Color('#9e1b32'), // crimson
      new THREE.Color('#590d22'), // burgundy
      new THREE.Color('#ffffff'), // pearl white
      new THREE.Color('#ffe6b3'), // champagne gold
    ];

    // Physics data for each balloon instance
    interface BalloonPhysics {
      pos: THREE.Vector3;
      vel: THREE.Vector3;
      rot: THREE.Euler;
      rotSpeed: THREE.Vector3;
      scale: number;
      driftSpeed: number;
      driftAngle: number;
    }

    const physics: BalloonPhysics[] = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < balloonCount; i++) {
      // Assign color
      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      instancedMesh.setColorAt(i, col);

      // Spherical explosion velocity from center
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const speed = 0.35 + Math.random() * 0.95;

      const vx = Math.sin(theta) * Math.cos(phi) * speed * (width < 600 ? 0.85 : 1.2);
      const vy = Math.cos(theta) * speed * 1.1 + (Math.random() * 0.4); // upward bias
      const vz = Math.sin(theta) * Math.sin(phi) * speed * 1.5;

      physics.push({
        pos: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 0),
        vel: new THREE.Vector3(vx, vy, vz),
        rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05, 0),
        scale: 0.35 + Math.random() * 0.55,
        driftSpeed: 0.02 + Math.random() * 0.04,
        driftAngle: Math.random() * Math.PI * 2,
      });

      dummy.position.set(0, 0, 0);
      dummy.scale.set(0.01, 0.01, 0.01);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
    scene.add(instancedMesh);

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Camera slow pull back for dramatic scale
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 20, delta * 0.8);

      for (let i = 0; i < balloonCount; i++) {
        const p = physics[i];

        // Decelerate explosion, transition to upward buoyancy drift
        p.vel.x *= 0.985;
        p.vel.z *= 0.985;
        p.vel.y = THREE.MathUtils.lerp(p.vel.y, 0.22 + p.driftSpeed, delta * 2);

        // Drift wobble
        p.driftAngle += delta * 2;
        p.pos.x += p.vel.x + Math.sin(p.driftAngle) * 0.03;
        p.pos.y += p.vel.y;
        p.pos.z += p.vel.z;

        p.rot.x += p.rotSpeed.x;
        p.rot.y += p.rotSpeed.y;

        dummy.position.copy(p.pos);
        dummy.rotation.copy(p.rot);

        // Scale up quickly upon spawn
        const currentScale = Math.min(p.scale, elapsed * 2.5 * p.scale);
        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // 6. Timed Fog & Transition Sequence (Chapter 3)
    const fogTimer = setTimeout(() => {
      setScenePhase('foggy');
      setFogOpacity(1);
    }, 2800);

    const completeTimer = setTimeout(() => {
      setScenePhase('dissolving');
      setTimeout(() => {
        onComplete();
      }, 900);
    }, 4500);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isRunning = false;
      clearTimeout(fogTimer);
      clearTimeout(completeTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [onComplete]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden select-none bg-[#050507]">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Chapter Title Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-10 left-0 right-0 z-10 text-center pointer-events-none"
      >
        <span className="text-[11px] font-sans tracking-[0.35em] text-[#f7c5d1]/70 uppercase block mb-1">
          Chapter II • The Burst
        </span>
        <h2 className="text-2xl font-serif text-white/90 drop-shadow-[0_0_12px_rgba(247,197,209,0.5)]">
          A Thousand Dreams
        </h2>
      </motion.div>

      {/* Volumetric Dreamlike Fog Layer (Chapter 3) */}
      <div
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000 ease-in-out backdrop-blur-[12px] bg-gradient-to-b from-[#1a0b1c]/80 via-[#2d1222]/90 to-[#050507]"
        style={{
          opacity: fogOpacity,
          backdropFilter: `blur(${fogOpacity * 16}px)`,
        }}
      >
        {/* Swirling Fog Textures */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_center,rgba(247,197,209,0.35)_0%,rgba(158,27,50,0.2)_50%,transparent_80%)] animate-ambient-glow" />
        
        {scenePhase === 'foggy' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <p className="text-xl md:text-2xl font-serif italic text-[#f7c5d1]/90 tracking-wide max-w-xs">
              “Every balloon holds a piece of my heart for you...”
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
