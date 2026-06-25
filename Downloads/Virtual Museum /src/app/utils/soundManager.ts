class SoundManager {
  private enabled = false;
  private audioCtx: AudioContext | null = null;

  public setGlobalSoundEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private getAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playGateOpen() {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getAudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.6;
      masterGain.connect(ctx.destination);

      // Low rumble
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 3);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 3);

      const rumbleGain = ctx.createGain();
      rumbleGain.gain.setValueAtTime(0, ctx.currentTime);
      rumbleGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.5);
      rumbleGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);

      osc.connect(filter);
      filter.connect(rumbleGain);
      rumbleGain.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + 3.5);

      // Dust / Creak noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, ctx.currentTime);
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      noise.start();

    } catch (e) {
      console.error('Audio play failed', e);
    }
  }

  public playChime() {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getAudioContext();
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.5);
      
      osc.connect(gainNode);
      osc.start();
      osc.stop(ctx.currentTime + 1.6);
    } catch (e) {
      console.error('Audio play failed', e);
    }
  }
}

export const soundManager = new SoundManager();
