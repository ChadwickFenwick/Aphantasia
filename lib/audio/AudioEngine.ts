class AudioEngine {
    private context: AudioContext | null = null;
    private leftOsc: OscillatorNode | null = null;
    private rightOsc: OscillatorNode | null = null;
    private leftGain: GainNode | null = null;
    private rightGain: GainNode | null = null;
    private masterGain: GainNode | null = null;
    private merger: ChannelMergerNode | null = null;

    private isPlaying: boolean = false;
    private baseFreq: number = 200; // Base frequency
    private beatFreq: number = 10;  // 10Hz Alpha wave by default

    private noiseNode: AudioBufferSourceNode | null = null;
    private noiseGain: GainNode | null = null;
    private currentMode: 'binaural' | 'noise' = 'binaural';

    constructor() {
        // AudioContext must be initialized after user interaction usually
    }

    private init() {
        if (!this.context) {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            this.context = new AudioContextClass();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);

            // Channel Merger for Binaural
            this.merger = this.context.createChannelMerger(2);
            this.merger.connect(this.masterGain);
        }
    }

    public start(volume: number = 0.1, beatFrequency: number = 10) {
        this.stop(); // Stop any existing sound
        this.init();
        this.currentMode = 'binaural';

        if (!this.context || !this.masterGain || !this.merger) return;

        // Resume context if suspended
        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        this.beatFreq = beatFrequency;
        this.masterGain.gain.setValueAtTime(volume, this.context.currentTime);

        // Left Ear (Base Frequency)
        this.leftOsc = this.context.createOscillator();
        this.leftOsc.type = 'sine';
        this.leftOsc.frequency.setValueAtTime(this.baseFreq, this.context.currentTime);

        this.leftGain = this.context.createGain();
        this.leftGain.gain.value = 1;

        // Connect Left: Osc -> Gain -> Merger(0)
        this.leftOsc.connect(this.leftGain);
        this.leftGain.connect(this.merger, 0, 0);

        // Right Ear (Base + Beat Frequency)
        this.rightOsc = this.context.createOscillator();
        this.rightOsc.type = 'sine';
        this.rightOsc.frequency.setValueAtTime(this.baseFreq + this.beatFreq, this.context.currentTime);

        this.rightGain = this.context.createGain();
        this.rightGain.gain.value = 1;

        // Connect Right: Osc -> Gain -> Merger(1)
        this.rightOsc.connect(this.rightGain);
        this.rightGain.connect(this.merger, 0, 1);

        this.leftOsc.start();
        this.rightOsc.start();
        this.isPlaying = true;
    }

    public startNoise(type: 'white' | 'pink', volume: number = 0.1) {
        this.stop();
        this.init();
        this.currentMode = 'noise';

        if (!this.context || !this.masterGain) return;
        if (this.context.state === 'suspended') this.context.resume();

        this.masterGain.gain.setValueAtTime(volume, this.context.currentTime);

        const bufferSize = 2 * this.context.sampleRate; // 2 seconds buffer
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const output = buffer.getChannelData(0);

        if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        } else {
            // Pink Noise (Paul Kellett's refined method)
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11;
                b6 = white * 0.115926;
            }
        }

        this.noiseNode = this.context.createBufferSource();
        this.noiseNode.buffer = buffer;
        this.noiseNode.loop = true;
        this.noiseNode.connect(this.masterGain);
        this.noiseNode.start();
        this.isPlaying = true;
    }

    public stop() {
        if (this.leftOsc) {
            try { this.leftOsc.stop(); } catch (e) { }
            this.leftOsc.disconnect();
            this.leftOsc = null;
        }
        if (this.rightOsc) {
            try { this.rightOsc.stop(); } catch (e) { }
            this.rightOsc.disconnect();
            this.rightOsc = null;
        }
        if (this.noiseNode) {
            try { this.noiseNode.stop(); } catch (e) { }
            this.noiseNode.disconnect();
            this.noiseNode = null;
        }
        this.isPlaying = false;
    }

    public setVolume(volume: number) {
        if (this.masterGain && this.context) {
            this.masterGain.gain.setTargetAtTime(volume, this.context.currentTime, 0.1);
        }
    }
}

// Singleton instance
export const audio = new AudioEngine();
