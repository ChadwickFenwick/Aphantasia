import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { audio } from '@/lib/audio/AudioEngine';

interface AudioState {
    isEnabled: boolean;
    volume: number;
    mode: 'alpha' | 'gamma' | 'pink' | 'white'; // Alpha (10Hz), Gamma (40Hz), Noise

    toggleAudio: () => void;
    setVolume: (vol: number) => void;
    setMode: (mode: 'alpha' | 'gamma' | 'pink' | 'white') => void;
}

export const useAudioSettings = create<AudioState>()(
    persist(
        (set, get) => ({
            isEnabled: false,
            volume: 0.1,
            mode: 'alpha',

            toggleAudio: () => {
                const { isEnabled, volume, mode } = get();
                const newState = !isEnabled;

                if (newState) {
                    if (mode === 'pink' || mode === 'white') {
                        audio.startNoise(mode, volume);
                    } else {
                        const freq = mode === 'alpha' ? 10 : 40;
                        audio.start(volume, freq);
                    }
                } else {
                    audio.stop();
                }

                set({ isEnabled: newState });
            },

            setVolume: (volume) => {
                audio.setVolume(volume);
                set({ volume });
            },

            setMode: (mode) => {
                const { isEnabled, volume } = get();
                if (isEnabled) {
                    // Restart with new settings
                    if (mode === 'pink' || mode === 'white') {
                        audio.startNoise(mode, volume);
                    } else {
                        const freq = mode === 'alpha' ? 10 : 40;
                        audio.start(volume, freq);
                    }
                }
                set({ mode });
            }
        }),
        {
            name: 'monocle-audio-settings'
        }
    )
);
