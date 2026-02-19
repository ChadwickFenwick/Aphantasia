'use client';

import React from 'react';
import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { ExerciseCanvas } from "@/components/exercises/ExerciseCanvas";
import { GlowingSphere, BrightCube, GaborPatch, DynamicWireframe } from "@/components/exercises/Shapes";
import { useExerciseTimer } from "@/hooks/useExerciseTimer";
import { PulseButton } from "@/components/ui/PulseButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eye, EyeOff, RotateCcw, Trophy, Circle, Square, Box, Waves } from "lucide-react";
import { useUserStore } from "@/lib/store";
import { generateSession, SessionConfig } from "@/lib/visuals/SessionGenerator";
import { useEffect, useState } from "react";

export default function AfterimagePage() {
    const { level, addXP } = useUserStore();
    const [session, setSession] = useState<SessionConfig | null>(null);

    const { phase, timeLeft, opacity, startExercise, triggerDissolve } = useExerciseTimer({
        burnDuration: session?.duration || 30,
        darkDuration: 15,
        onComplete: () => addXP(50) // Reward 50 XP per session
    });

    // Generate session on mount or level change
    useEffect(() => {
        setSession(generateSession(level));
    }, [level]);

    // Regenerate on restart
    const handleRestart = () => {
        setSession(generateSession(level));
        startExercise();
    };

    // Shape Override
    const selectShape = (shape: 'sphere' | 'cube' | 'gabor' | 'wireframe') => {
        if (!session) return;
        setSession({
            ...session,
            shape: shape,
            description: `Manual Override: ${shape.charAt(0).toUpperCase() + shape.slice(1)}`
        });
    }

    if (!session) return null;

    return (
        <TrainingModuleLayout
            title="Afterimage"
            subtitle="Burn"
            description="High-intensity retinal printing. Stare at the center, then hold the negative."
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center w-full">

                {/* Status */}
                <div className="w-full mb-8 flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-sm text-muted uppercase tracking-widest flex items-center gap-2">
                        <span className="text-primary font-bold">Lvl {level} Protocol:</span> {session.description}
                    </p>
                    <div className="text-4xl font-mono text-primary tabular-nums">
                        00:{timeLeft.toString().padStart(2, '0')}
                    </div>
                </div>

                {/* Shape Selector (Only visible in Idle) */}
                {phase === 'idle' && (
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => selectShape('sphere')}
                            className={`p-3 rounded-lg border transition-all ${session.shape === 'sphere' ? 'bg-primary text-black border-primary' : 'bg-white/5 text-muted border-white/10 hover:border-white/30'}`}
                            title="Sphere"
                        >
                            <Circle className="w-5 h-5 fill-current" />
                        </button>
                        <button
                            onClick={() => selectShape('cube')}
                            className={`p-3 rounded-lg border transition-all ${session.shape === 'cube' ? 'bg-primary text-black border-primary' : 'bg-white/5 text-muted border-white/10 hover:border-white/30'}`}
                            title="Cube"
                        >
                            <Square className="w-5 h-5 fill-current" />
                        </button>
                        <button
                            onClick={() => selectShape('wireframe')}
                            className={`p-3 rounded-lg border transition-all ${session.shape === 'wireframe' ? 'bg-primary text-black border-primary' : 'bg-white/5 text-muted border-white/10 hover:border-white/30'}`}
                            title="Wireframe"
                        >
                            <Box className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => selectShape('gabor')}
                            className={`p-3 rounded-lg border transition-all ${session.shape === 'gabor' ? 'bg-primary text-black border-primary' : 'bg-white/5 text-muted border-white/10 hover:border-white/30'}`}
                            title="Gabor Patch"
                        >
                            <Waves className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* The Viewport */}
                <div className="w-full relative mb-12 min-h-[500px] flex items-center justify-center">
                    <ExerciseCanvas opacity={opacity}>
                        {session.shape === 'sphere' && <GlowingSphere color={session.color} />}
                        {session.shape === 'cube' && <BrightCube color={session.color} />}
                        {session.shape === 'gabor' && <GaborPatch color={session.color} angle={session.params?.angle} />}
                        {session.shape === 'wireframe' && <DynamicWireframe color={session.color} />}
                    </ExerciseCanvas>

                    {/* Dark Phase Helper Text */}
                    {phase === 'dark' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-muted/20 text-4xl font-black uppercase tracking-widest animate-pulse">

                            </p>
                        </div>
                    )}

                    {phase === 'complete' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-primary/50 text-center animate-in zoom-in duration-300">
                                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">Session Complete</h3>
                                <p className="text-muted mb-4">+50 Neuro-Plasticity XP</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    {phase === 'idle' && (
                        <PulseButton onClick={startExercise}>
                            START EXERCISE
                        </PulseButton>
                    )}

                    {phase === 'burn' && (
                        <PulseButton onClick={triggerDissolve} className="bg-red-500 hover:shadow-[0_0_30px_rgba(255,0,0,0.6)]">
                            <EyeOff className="w-5 h-5 mr-2" />
                            DISSOLVE IMAGE
                        </PulseButton>
                    )}

                    {(phase === 'dark' || phase === 'dissolve') && (
                        <GlassCard className="px-8 py-3 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-muted" />
                            <span className="text-sm text-muted uppercase tracking-widest">Focusing...</span>
                        </GlassCard>
                    )}

                    {phase === 'complete' && (
                        <PulseButton onClick={handleRestart} className="bg-secondary pointer-events-auto">
                            <RotateCcw className="w-5 h-5 mr-2" />
                            NEW SESSION
                        </PulseButton>
                    )}
                </div>
            </div>
        </TrainingModuleLayout>
    );
}
