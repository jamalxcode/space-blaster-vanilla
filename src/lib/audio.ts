// Audio manager for Space Invaders sound effects using Web Audio API

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private ufoOscillator: OscillatorNode | null = null;

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.3) {
    if (!this.audioContext || !this.masterGain || this.isMuted) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.value = volume;
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Player shoot sound - sharp "pew"
  playPlayerShoot() {
    if (!this.audioContext || !this.masterGain || this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.value = 0.2;
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Invader step sound
  playInvaderStep(pitch: number = 1) {
    this.playTone(100 * pitch, 0.1, 'square', 0.15);
  }

  // Invader hit/destroyed sound
  playInvaderHit() {
    if (!this.audioContext || !this.masterGain || this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.15);
    
    gainNode.gain.value = 0.25;
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Player hit sound
  playPlayerHit() {
    if (!this.audioContext || !this.masterGain || this.isMuted) return;
    
    // Create explosion sound with noise
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(150 - i * 30, 0.2, 'sawtooth', 0.3);
      }, i * 50);
    }
  }

  // UFO loop sound
  startUfoSound() {
    if (!this.audioContext || !this.masterGain || this.isMuted || this.ufoOscillator) return;
    
    this.ufoOscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    this.ufoOscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    this.ufoOscillator.type = 'sine';
    this.ufoOscillator.frequency.value = 200;
    gainNode.gain.value = 0.1;
    
    // Warble effect
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.value = 6;
    lfoGain.gain.value = 50;
    
    lfo.connect(lfoGain);
    lfoGain.connect(this.ufoOscillator.frequency);
    
    this.ufoOscillator.start();
    lfo.start();
  }

  stopUfoSound() {
    if (this.ufoOscillator) {
      this.ufoOscillator.stop();
      this.ufoOscillator = null;
    }
  }

  // UFO hit sound
  playUfoHit() {
    if (!this.audioContext || !this.masterGain || this.isMuted) return;
    
    this.stopUfoSound();
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.value = 0.3;
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // Game over sound
  playGameOver() {
    if (!this.audioContext || !this.masterGain || this.isMuted) return;
    
    const notes = [440, 392, 349, 330, 294];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'sine', 0.2);
      }, i * 200);
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopUfoSound();
    }
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }
}
