// Web Audio API procedural soundscape generator
// Zero external assets required — 100% reliable, zero latency, customizable

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private isAmbientPlaying: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(muted ? 0 : 0.08, this.ctx.currentTime, 0.2);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Chapter 1: Bow string tension sound (modulated by drag 0..1)
  public playBowDraw(tension: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      const baseFreq = 80 + tension * 120;
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200 + tension * 400, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.01 + tension * 0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Ignore audio failure
    }
  }

  // Chapter 1: Arrow release snap & whoosh
  public playArrowRelease() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // 1. String snap
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(320, this.ctx.currentTime);
      snapOsc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
      snapGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      snapGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snapOsc.start();
      snapOsc.stop(this.ctx.currentTime + 0.08);

      // 2. Whoosh white noise
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
      noiseFilter.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.2);
      noiseFilter.Q.value = 3;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.08);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start();
      noise.stop(this.ctx.currentTime + 0.35);
    } catch {
      // Ignore
    }
  }

  // Chapter 2: Impact & Crystalline Heart Burst
  public playHeartHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.frequency.setValueAtTime(140, this.ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.8);
      subGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start();
      subOsc.stop(this.ctx.currentTime + 0.8);

      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      freqs.forEach((f, idx) => {
        const bellOsc = this.ctx!.createOscillator();
        const bellGain = this.ctx!.createGain();
        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(f, this.ctx!.currentTime + idx * 0.04);
        bellGain.gain.setValueAtTime(0, this.ctx!.currentTime);
        bellGain.gain.setValueAtTime(0.08, this.ctx!.currentTime + idx * 0.04);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.04 + 1.2);

        bellOsc.connect(bellGain);
        bellGain.connect(this.ctx!.destination);
        bellOsc.start(this.ctx!.currentTime + idx * 0.04);
        bellOsc.stop(this.ctx!.currentTime + idx * 0.04 + 1.2);
      });
    } catch {
      // Ignore
    }
  }

  // Chapter 4: Magical Tree Growth Harp Arpeggio
  public playMagicalGrowth() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [329.63, 392.0, 493.88, 587.33, 659.25, 783.99, 987.77, 1174.66];
      notes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0, this.ctx!.currentTime);
        gain.gain.setValueAtTime(0.05, this.ctx!.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + i * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + i * 0.08);
        osc.stop(this.ctx!.currentTime + i * 0.08 + 0.9);
      });
    } catch {
      // Ignore
    }
  }

  // Chapter: Sky Lantern Igniting warm fire
  public playLanternIgnite() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(360, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch {}
  }

  // Chapter: Sky Lantern Release Celestial Chime
  public playLanternRelease() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const freqs = [440, 554.37, 659.25, 880, 1108.73];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.06, this.ctx!.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.1 + 1.5);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.1);
        osc.stop(this.ctx!.currentTime + idx * 0.1 + 1.5);
      });
    } catch {}
  }

  // Sparkler sizzling sound for star drawing
  public playSparklerSizzle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.06;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3500, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
      noise.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  // Heartbeat thump (Lub-Dub)
  public playHeartbeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // Lub
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.12);
      gain1.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start();
      osc1.stop(this.ctx.currentTime + 0.12);

      // Dub
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.frequency.setValueAtTime(75, this.ctx.currentTime + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.32);
      gain2.gain.setValueAtTime(0.28, this.ctx.currentTime + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.32);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(this.ctx.currentTime + 0.18);
      osc2.stop(this.ctx.currentTime + 0.32);
    } catch {}
  }

  // Chapter 7: Candle blow puff and suspense drop
  public playCandleExtinguish() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
      noise.stop(this.ctx.currentTime + 0.6);
    } catch {
      // Ignore
    }
  }

  // Chapter 8: Fairy Lights Chime
  public playFairyChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const freqs = [880, 1108.73, 1318.51, 1760];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.04, this.ctx!.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.06 + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.06);
        osc.stop(this.ctx!.currentTime + idx * 0.06 + 0.8);
      });
    } catch {
      // Ignore
    }
  }

  // Ambient Romantic Soundscape (Lush Dream Pads)
  public startAmbientPad() {
    if (this.isAmbientPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.06, this.ctx.currentTime + 3);
      this.ambientGain.connect(this.ctx.destination);

      const freqs = [185.0, 220.0, 277.18, 329.63, 440.0, 554.37];
      this.ambientOscillators = freqs.map((f, i) => {
        const osc = this.ctx!.createOscillator();
        const filter = this.ctx!.createBiquadFilter();
        const gain = this.ctx!.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, this.ctx!.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600 + i * 50, this.ctx!.currentTime);

        gain.gain.setValueAtTime(0.15 / freqs.length, this.ctx!.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ambientGain!);
        osc.start();
        return osc;
      });

      this.isAmbientPlaying = true;
    } catch {
      // Ignore
    }
  }

  public stopAmbientPad() {
    if (!this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;
    try {
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);
      setTimeout(() => {
        this.ambientOscillators.forEach((osc) => {
          try {
            osc.stop();
          } catch {}
        });
        this.ambientOscillators = [];
        this.isAmbientPlaying = false;
      }, 1500);
    } catch {
      // Ignore
    }
  }
}

export const sound = typeof window !== 'undefined' ? new SoundEngine() : (null as unknown as SoundEngine);
