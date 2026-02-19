'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PulseButton } from '@/components/ui/PulseButton';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { Mic, MicOff, Navigation, CheckCircle, Ear, Play, ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store';
import { SessionSummary } from "@/components/ui/SessionSummary";

const PROMPTS = [
    {
        title: "The Front Door",
        description: "Stand at your front door. Describe the texture of the handle, the color of the paint, and the sound of the latch opening."
    },
    {
        title: "Kitchen Navigation",
        description: "Walk to your kitchen. Describe the path. How many steps? What flooring change do you feel under your feet?"
    },
    {
        title: "The Fridge",
        description: "Open your fridge. Describe the cold air hitting your face. What is the first color you see? What smells do you notice?"
    },
    {
        title: "Forest Walk",
        description: "Imagine stepping onto a dirt path. Smell the pine needles. Hear the crunch of dry leaves underfoot. Look up—can you see the sunlight filtering through the canopy?"
    },
    {
        title: "Beach Day",
        description: "You are standing on warm sand. Feel the heat on your skin. Listen to the rhythmic crash of the waves. Pick up a shell—what is its texture? smooth? rough?"
    }
];

export const SensoryBridging = () => {
    const router = useRouter();
    const { isListening, transcript, startListening, stopListening, error, isSupported } = useSpeechToText();
    const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
    const [complete, setComplete] = useState(false);
    // const setLevel = useUserStore((state) => state.setLevel); // Unused for now

    const currentPrompt = PROMPTS[currentPromptIdx];

    const handleNext = () => {
        stopListening();
        if (currentPromptIdx < PROMPTS.length - 1) {
            setCurrentPromptIdx(prev => prev + 1);
        } else {
            setComplete(true);
        }
    };

    if (!isSupported) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
                <GlassCard className="max-w-md w-full border-red-500/20 bg-red-500/5 p-8">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Browser Not Supported</h2>
                    <p className="text-muted">Your browser does not support the Web Speech API required for this exercise.</p>
                    <p className="text-muted text-sm mt-4">Please use Chrome, Edge, or Safari.</p>
                </GlassCard>
            </div>
        );
    }

    if (complete) {
        return (
            <SessionSummary
                title="Sensory Bridging"
                xpEarned={150}
                duration="5m 00s"
                skillsTrained={['auditory', 'somatic', 'visual']}
                onRestart={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 max-w-2xl mx-auto">
            <div className="mb-12 relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-secondary blur-3xl opacity-20 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <Ear className="w-24 h-24 text-white mx-auto relative z-10" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4">
                {currentPrompt.title}
            </h2>

            <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-8 delay-150">
                <p className="text-xl text-primary font-medium">"{currentPrompt.description}"</p>
                <p className="text-muted text-sm max-w-md mx-auto">
                    Close your eyes. Focus on the physical sensation.
                    Then, try to recreate it mentally without the stimulus.
                </p>
            </div>

            {!isListening ? (
                <PulseButton onClick={startListening} className="px-8 py-4 text-lg">
                    <Play className="w-6 h-6 mr-3" /> BEGIN PROMPT
                </PulseButton>
            ) : (
                <div className="space-y-6 animate-in zoom-in duration-300 w-full max-w-md">
                    <div className="flex items-center justify-center gap-3 text-secondary animate-pulse">
                        <span className="w-3 h-3 bg-secondary rounded-full" />
                        <span className="font-mono text-sm uppercase tracking-widest">Active Observation</span>
                    </div>

                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 font-mono text-sm text-white/80 overflow-y-auto max-h-[150px] whitespace-pre-wrap min-h-[100px] text-left">
                        {transcript || <span className="text-muted/30 italic">Describe what you experience out loud...</span>}
                    </div>
                    {error && <p className="text-xs text-red-400">Error: {error}</p>}

                    <PulseButton onClick={handleNext} className="bg-white/10 hover:bg-white/20 text-white px-8 w-full">
                        {currentPromptIdx < PROMPTS.length - 1 ? (
                            <>NEXT TARGET <ArrowRight className="w-4 h-4 ml-2" /></>
                        ) : (
                            <>FINISH SESSION <CheckCircle className="w-4 h-4 ml-2" /></>
                        )}
                    </PulseButton>
                </div>
            )}

            {/* Progress Dots */}
            <div className="fixed bottom-8 flex gap-2">
                {PROMPTS.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            i === currentPromptIdx ? "bg-primary scale-125" :
                                i < currentPromptIdx ? "bg-white/50" : "bg-white/10"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};
