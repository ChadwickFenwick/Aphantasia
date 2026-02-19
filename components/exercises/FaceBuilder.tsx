'use client';

import React, { useState, useEffect } from 'react';
import { EYES, NOSES, MOUTHS, HEAD_SHAPE, FaceFeature } from '@/lib/visuals/FaceAssets';
import { PulseButton as Button } from '@/components/ui/PulseButton';
import { useUserStore } from '@/lib/store';
import { SessionSummary } from '@/components/ui/SessionSummary';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

type Phase = 'intro' | 'flash-eyes' | 'flash-nose' | 'flash-mouth' | 'assemble' | 'verification' | 'result';

export const FaceBuilder = () => {
    const { addXP } = useUserStore();
    const [mode, setMode] = useState<'bind' | 'chain'>('bind');
    const [phase, setPhase] = useState<Phase>('intro');

    const [targetFeatures, setTargetFeatures] = useState<{ eyes: FaceFeature; nose: FaceFeature; mouth: FaceFeature } | null>(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [timeLeft, setTimeLeft] = useState(0);
    const [choices, setChoices] = useState<{ eyes: FaceFeature; nose: FaceFeature; mouth: FaceFeature }[]>([]);

    const MAX_ROUNDS = 5;

    const startRound = () => {
        // 1. Pick Random Target
        const tEyes = EYES[Math.floor(Math.random() * EYES.length)];
        const tNose = NOSES[Math.floor(Math.random() * NOSES.length)];
        const tMouth = MOUTHS[Math.floor(Math.random() * MOUTHS.length)];
        setTargetFeatures({ eyes: tEyes, nose: tNose, mouth: tMouth });

        setPhase('flash-eyes');
    };

    // Timer Logic for Flashing
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (phase === 'flash-eyes' || phase === 'flash-nose' || phase === 'flash-mouth') {
            setTimeLeft(3); // 3 seconds per feature
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Next Phase
                        if (phase === 'flash-eyes') setPhase('flash-nose');
                        else if (phase === 'flash-nose') setPhase('flash-mouth');
                        else if (phase === 'flash-mouth') setPhase('assemble');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [phase]);

    // Assemble / Verification Logic
    useEffect(() => {
        if (phase === 'assemble') {
            // Wait 5 seconds for user to visualize/hold
            const timer = setTimeout(() => {
                generateChoices();
                setPhase('verification');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    const generateChoices = () => {
        setTargetFeatures(current => {
            if (!current) return null;

            // Correct Option
            const correct = { ...current };

            // Distractor 1 (Different Eyes)
            const d1Options = EYES.filter(e => e.id !== current.eyes.id);
            const d1Eyes = d1Options[Math.floor(Math.random() * d1Options.length)] || EYES[0];
            const d1 = {
                eyes: d1Eyes,
                nose: current.nose,
                mouth: current.mouth
            };

            // Distractor 2 (Different Mouth)
            const d2Options = MOUTHS.filter(m => m.id !== current.mouth.id);
            const d2Mouth = d2Options[Math.floor(Math.random() * d2Options.length)] || MOUTHS[0];
            const d2 = {
                eyes: current.eyes,
                nose: current.nose,
                mouth: d2Mouth
            };

            // Shuffle
            const all = [correct, d1, d2].sort(() => Math.random() - 0.5);
            setChoices(all);

            return current;
        });
    };

    const handleChoice = (choice: { eyes: FaceFeature; nose: FaceFeature; mouth: FaceFeature }) => {
        if (!targetFeatures) return;

        const isCorrect =
            choice.eyes.id === targetFeatures.eyes.id &&
            choice.nose.id === targetFeatures.nose.id &&
            choice.mouth.id === targetFeatures.mouth.id;

        if (isCorrect) {
            setScore(prev => prev + 1);
            addXP(25);
        }

        if (round < MAX_ROUNDS) {
            setRound(prev => prev + 1);
            startRound();
        } else {
            setPhase('result');
        }
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setPhase('intro');
    };

    if (phase === 'intro') {
        return (
            <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center space-y-8">
                <div className="p-8 bg-surface border border-white/10 rounded-full">
                    <Eye className="w-12 h-12 text-primary animate-pulse" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold mb-2">Face Studio</h2>
                    <p className="text-muted text-lg mb-4">
                        {mode === 'bind'
                            ? "Train your ability to bind separate features into a single image."
                            : "Train your ability to visually construct an image piece by piece."}
                    </p>

                    {/* Mode Toggle */}
                    <div className="flex bg-white/5 rounded-lg p-1 w-fit mx-auto border border-white/10">
                        <button
                            onClick={() => setMode('bind')}
                            className={cn("px-4 py-2 text-sm rounded-md transition-all", mode === 'bind' ? "bg-primary text-black font-bold" : "text-muted hover:text-white")}
                        >
                            Binding
                        </button>
                        <button
                            onClick={() => setMode('chain')}
                            className={cn("px-4 py-2 text-sm rounded-md transition-all", mode === 'chain' ? "bg-secondary text-white font-bold" : "text-muted hover:text-white")}
                        >
                            Chaining
                        </button>
                    </div>
                </div>
                <Button onClick={startRound} className="px-8 py-4 text-lg">Start Session</Button>
            </div>
        );
    }

    if (phase === 'result') {
        return <SessionSummary title="Face Studio Complete" xpEarned={score * 25} accuracy={(score / MAX_ROUNDS) * 100} onRestart={handleRestart} />;
    }

    // Logic for visibility
    const showEyes = (phase === 'flash-eyes') || (mode === 'chain' && (phase === 'flash-nose' || phase === 'flash-mouth'));
    const showNose = (phase === 'flash-nose') || (mode === 'chain' && (phase === 'flash-mouth'));
    const showMouth = (phase === 'flash-mouth');

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto relative">

            {/* Progress */}
            <div className="absolute top-0 left-0 p-4 font-mono text-sm text-muted">
                Round {round} / {MAX_ROUNDS} • {mode === 'chain' ? "CHAINING" : "BINDING"}
            </div>

            {/* Main Canvas */}
            <div className="relative w-80 h-96 border border-white/10 bg-black/50 rounded-3xl flex items-center justify-center overflow-hidden">

                {/* Intro / Waiting - Show Empty Head */}
                <svg
                    viewBox="0 0 200 200"
                    className="absolute inset-0 w-full h-full text-white animate-in fade-in duration-500"
                >
                    {HEAD_SHAPE}
                </svg>

                {/* Flashing Features */}
                {showEyes && targetFeatures && (
                    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full text-primary animate-in zoom-in-90 fade-in duration-300">
                        {targetFeatures.eyes.path}
                    </svg>
                )}
                {showNose && targetFeatures && (
                    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full text-primary animate-in zoom-in-90 fade-in duration-300">
                        {targetFeatures.nose.path}
                    </svg>
                )}
                {showMouth && targetFeatures && (
                    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full text-primary animate-in zoom-in-90 fade-in duration-300">
                        {targetFeatures.mouth.path}
                    </svg>
                )}

                {/* Assemble Phase - Prompt */}
                {phase === 'assemble' && (
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 animate-in fade-in duration-300"
                    >
                        <p className="font-bold text-xl text-primary animate-pulse text-center px-4">
                            {mode === 'bind' ? "ASSEMBLE THE FACE" : "HOLD THE FULL IMAGE"}
                        </p>
                    </div>
                )}
            </div>

            {/* Verification Choices */}
            {phase === 'verification' && (
                <div className="mt-8 grid grid-cols-3 gap-4 w-full animate-in slide-in-from-bottom-5 fade-in duration-500">
                    {choices.map((choice, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleChoice(choice)}
                            className="relative aspect-square border border-white/10 bg-surface hover:bg-white/5 rounded-xl transition-all hover:scale-105 group"
                        >
                            <svg viewBox="0 0 200 200" className="w-full h-full p-4 text-muted group-hover:text-white transition-colors">
                                {HEAD_SHAPE}
                                {choice.eyes.path}
                                {choice.nose.path}
                                {choice.mouth.path}
                            </svg>
                        </button>
                    ))}
                </div>
            )}

            {/* Instruction Text */}
            <div className="mt-8 text-center h-12">
                {phase.startsWith('flash') && <p className="text-xl font-bold">Memorize: {phase.split('-')[1].toUpperCase()}</p>}
                {phase === 'verification' && <p className="text-xl font-bold text-primary">Identify the correct face</p>}
            </div>
        </div>
    );
};
