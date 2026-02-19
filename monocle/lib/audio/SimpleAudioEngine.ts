'use client';

class SimpleAudioEngine {
    private ctx: AudioContext | null = null;
    private osc: OscillatorNode | null = null;
    private gain: GainNode | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
    }

    playTone(frequency: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine', duration: number = 0.5) {
        if (!this.ctx) return;

        // Resume if suspended (browser policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}

export const audio = new SimpleAudioEngine();
