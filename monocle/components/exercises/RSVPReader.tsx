'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PulseButton } from '@/components/ui/PulseButton';
import { Play, Pause, RotateCcw, Zap, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/lib/store';

// --- CONTENT ---
type StoryLength = 'Short' | 'Medium' | 'Long';

const STORY_LIBRARY: Record<StoryLength, { title: string, text: string }[]> = {
    Short: [
        {
            title: "The Red Sphere",
            text: "Imagine a perfect red sphere floating in the center of a white room. The surface is smooth, polished, reflecting the stark light from above. It begins to rotate, slowly at first, then faster. As it spins, it glows with an inner heat, turning from crimson to bright orange, then blinding white. Suddenly, it shatters into a million tiny shards, each one suspended in the air, frozen in time."
        },
        {
            title: "Forest Rain",
            text: "The forest is alive with the sound of rain. Heavy droplets drum against the broad green leaves of the canopy. The smell of wet earth and pine fills the air. You walk along a muddy path, the cool air touching your skin. A deer steps out from the ferns, its eyes wide and dark. It watches you for a moment, ears twitching, before turning and vanishing silently into the mist."
        },
        {
            title: "Neon City",
            text: "Rain slicks the black asphalt of the cyberpunk street. Neon signs in pink and blue reflect off the puddles, distorting into abstract ribbons of light. Steam rises from a street vendor's cart, carrying the scent of spicy noodles. A hovercar zooms past overhead, its turbine whine echoing between the skyscrapers. You look up, and the hologram of a giant koi fish swims through the smog."
        }
    ],
    Medium: [
        {
            title: "The Clockmaker's Workshop",
            text: "You step into the dusty workshop, the air filled with the rhythmic ticking of a thousand clocks. Sunlight streams through the grime-streaked windows, illuminating dancing dust motes. On the workbench lies a mechanical bird, its brass gears exposed. You reach out and wind the key on its back. With a whir of tiny springs, the bird snaps to life. It flutters its metallic wings, the feathers crafted from thin sheets of copper. It opens its beak and lets out a clear, bell-like chirp that cuts through the ticking. As you watch, the bird hops onto your finger, its tiny claws gripping your skin. You can feel the vibration of the clockwork heart beating inside its chest, a rapid, mechanical pulse that mimics life."
        },
        {
            title: "Cosmic Voyage",
            text: "You are drifting through the silence of deep space. Stars streak past you like lines of light in a hyperdrive tunnel. Ahead, a massive nebula unfurls like a flower of purple and gold gas, illuminated by the birth of new suns. You fly closer, feeling the hum of cosmic energy vibrating in your bones. Lightning arcs across the clouds of dust, jagged bolts of pure white plasma. In the center, a black hole spins, its accretion disk swirling with violent, beautiful colors—swirls of orange fire and electric blue. You are pulled towards the event horizon, feeling your body stretching, warping, spacetime bending around you until everything fades to a singular, infinite point of black."
        }
    ],
    Long: [
        {
            title: "The Underwater Temple",
            text: "You submerge into the crystal clear turquoise water. The sunlight pierces the surface in shimmering shafts, illuminating the white sandy bottom below. Schools of tropical fish, vibrant in yellow and electric blue, dart around coral reefs that teem with life. As you swim deeper, the water turns a darker indigo. Looming out of the gloom is an ancient temple, overgrown with seaweed and barnacles. Huge stone columns, carved with the faces of forgotten sea gods, support a crumbling roof. You swim between the pillars, entering the main hall. Inside, it is surprisingly bright, lit by bioluminescent moss that clings to the walls. In the center of the hall stands a statue of a mermaid, carved from a single block of jade. Her eyes are set with pearls that seem to glow. You reach out to touch the smooth stone, and as you do, a deep, resonant hum fills the water, vibrating through your entire body. The statue's eyes flash, and for a moment, you see a vision of the city as it was thousands of years ago, bustling with life, before the ocean reclaimed it."
        },
        {
            title: "The Dragon's Peak",
            text: "The climb has been arduous, your breath frosting in the thin mountain air. You pull yourself up the final ledge and stand upon the summit of Dragon's Peak. The world spreads out below you like a map—green valleys, winding silver rivers, and distant snow-capped mountains. But your attention is drawn to the cave entrance before you. Smoke drifts lazily from the darkness, smelling of sulfur and old wood. A low growl vibrates the ground beneath your boots. Slowly, a massive head emerges. Scales the color of obsidian glitter in the sun. Eyes like pools of molten gold fix upon you. The dragon exhales, a puff of gray smoke wisping around its nostrils. It does not attack; it merely watches, ancient and weary. You notice a scar running down its flank, a jagged line of paler scales. It shifts its weight, the sound of scales sliding over stone like the rasp of a thousand swords. It spreads its wings, casting a shadow that covers the entire peak, and let's out a roar that shakes the very heavens."
        }
    ]
};

export const RSVPReader = () => {
    const { addXP } = useUserStore();

    // State
    const [wpm, setWpm] = useState(400);
    const [length, setLength] = useState<StoryLength>('Short');
    const [isPlaying, setIsPlaying] = useState(false);

    // Select story based on length
    const [storyIndex, setStoryIndex] = useState(0);

    // Derived current story
    const currentLibrary = STORY_LIBRARY[length];
    // Ensure index is valid when switching lengths
    const validIndex = storyIndex % currentLibrary.length;
    const currentStory = currentLibrary[validIndex];

    const [wordIndex, setWordIndex] = useState(0);
    const [finished, setFinished] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout>(null);
    const words = currentStory.text.split(" ");
    const currentWord = words[wordIndex] || "";

    // Timer Logic
    useEffect(() => {
        if (isPlaying && !finished) {
            const delay = 60000 / wpm;
            timeoutRef.current = setTimeout(() => {
                if (wordIndex < words.length - 1) {
                    setWordIndex(i => i + 1);
                } else {
                    handleFinish();
                }
            }, delay);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isPlaying, wordIndex, wpm, finished, words.length]); // Added words.length to dependencies

    const handleFinish = () => {
        setIsPlaying(false);
        setFinished(true);
        addXP(length === 'Short' ? 30 : length === 'Medium' ? 50 : 100);
    };

    const reset = () => {
        setIsPlaying(false);
        setWordIndex(0);
        setFinished(false);
    };

    const togglePlay = () => {
        if (finished) reset();
        setIsPlaying(!isPlaying);
    };

    const changeStory = () => {
        reset();
        setStoryIndex((prev) => (prev + 1) % currentLibrary.length);
    };

    const changeLength = (newLength: StoryLength) => {
        setLength(newLength);
        reset();
        setStoryIndex(0);
    };

    // Calculate progress
    const progress = (wordIndex / words.length) * 100;

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-[600px]">

            {/* READER DISPLAY */}
            <div className="relative w-full flex-1 bg-black rounded-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center overflow-hidden">

                {/* Background Grid/Effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* The Word */}
                <div className="relative z-10 text-center max-w-2xl px-4">
                    {!finished ? (
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight">
                            {wordIndex === 0 && !isPlaying ? "READY?" : currentWord}
                        </h1>
                    ) : (
                        <div className="flex flex-col items-center animate-in zoom-in duration-300">
                            <h1 className="text-4xl font-bold text-primary mb-2">COMPLETE</h1>
                            <p className="text-muted">Take a moment to visualize the scene you just read.</p>
                        </div>
                    )}

                    {/* Focal Point */}
                    <div className="w-full h-px bg-red-500/50 absolute top-1/2 left-0 -translate-y-1/2 -z-10" />
                    <div className="h-full w-px bg-red-500/50 absolute top-0 left-1/2 -translate-x-1/2 -z-10" />
                </div>

                {/* Progress Bar (Bottom) */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-white/5">
                    <div
                        className="h-full bg-primary transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="absolute top-4 left-4 flex gap-4">
                    <span className="text-xs font-mono text-muted uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
                        {length}
                    </span>
                    <span className="text-xs font-mono text-white uppercase tracking-widest">
                        {currentStory.title}
                    </span>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="w-full mt-8 p-6 bg-white/5 border border-white/5 rounded-xl flex flex-col md:flex-row gap-8 items-center justify-between">

                {/* WPM Control */}
                <div className="flex flex-col gap-2 w-full md:w-1/3">
                    <div className="flex justify-between">
                        <span className="text-xs text-muted uppercase tracking-widest">Speed</span>
                        <span className="text-xs font-mono text-white">{wpm} WPM</span>
                    </div>
                    <input
                        type="range"
                        min="200" max="1000" step="50"
                        value={wpm}
                        onChange={(e) => setWpm(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    {/* Length Checkbox/Toggle */}
                    <div className="flex gap-2 mt-2">
                        {(['Short', 'Medium', 'Long'] as StoryLength[]).map(l => (
                            <button
                                key={l}
                                onClick={() => changeLength(l)}
                                className={cn(
                                    "px-2 py-1 text-[10px] uppercase font-mono rounded border transition-colors",
                                    length === l ? "bg-white text-black border-white" : "bg-black text-muted border-white/10 hover:border-white/30"
                                )}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Buttons */}
                <div className="flex items-center gap-4">
                    <button onClick={changeStory} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-muted hover:text-white transition-colors" title="Next Story">
                        <BookOpen className="w-6 h-6" />
                    </button>

                    <PulseButton onClick={togglePlay} className="w-20 h-20 rounded-full flex items-center justify-center bg-white text-black hover:bg-white/90">
                        {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : finished ? <RotateCcw className="w-8 h-8" /> : <Play className="w-8 h-8 fill-black" />}
                    </PulseButton>
                </div>

                {/* Info */}
                <div className="w-full md:w-1/3 text-right">
                    <p className="text-xs text-muted mb-1">FORCE VISUALIZATION</p>
                    <div className="flex items-center justify-end gap-2 text-yellow-500">
                        <Zap className="w-4 h-4" />
                        <span className="font-bold">High Intensity</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
