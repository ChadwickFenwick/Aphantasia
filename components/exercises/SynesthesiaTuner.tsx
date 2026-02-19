'use client';

import React, { useState, useEffect, useRef } from 'react';
import { audio } from '@/lib/audio/SimpleAudioEngine';
import { PulseButton as Button } from '@/components/ui/PulseButton';
import { SessionSummary } from '@/components/ui/SessionSummary';
import { useUserStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Volume2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ColorNote = {
    note: string;
    freq: number;
    colorArg: string; // Tailwind class component
    colorHex: string; // For CSS vars
    name: string;
};

const MAPPING: ColorNote[] = [
    { note: 'C4', freq: 261.63, colorArg: 'bg-red-500', colorHex: '#ef4444', name: 'Red' },
    { note: 'D4', freq: 293.66, colorArg: 'bg-orange-500', colorHex: '#f97316', name: 'Orange' },
    { note: 'E4', freq: 329.63, colorArg: 'bg-yellow-500', colorHex: '#eab308', name: 'Yellow' },
    { note: 'F4', freq: 349.23, colorArg: 'bg-green-500', colorHex: '#22c55e', name: 'Green' },
    { note: 'G4', freq: 392.00, colorArg: 'bg-blue-500', colorHex: '#3b82f6', name: 'Blue' },
    { note: 'A4', freq: 440.00, colorArg: 'bg-indigo-500', colorHex: '#6366f1', name: 'Indigo' },
    { note: 'B4', freq: 493.88, colorArg: 'bg-purple-500', colorHex: '#a855f7', name: 'Purple' },
    { note: 'C5', freq: 523.25, colorArg: 'bg-pink-500', colorHex: '#ec4899', name: 'Pink' },
];

type Phase = 'training' | 'testing' | 'result';

export const SynesthesiaTuner = () => {
    const { addXP } = useUserStore();
    const [phase, setPhase] = useState<Phase>('training'); // 'training' = Learning Mode, 'testing' = Active Test
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [target, setTarget] = useState<ColorNote | null>(null);
    const [isVisualVisible, setIsVisualVisible] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

    // Filter mappings based on difficulty
    const activeMappings = React.useMemo(() => {
        switch (difficulty) {
            case 'easy': return MAPPING.slice(0, 4);   // 4 Notes
            case 'medium': return MAPPING.slice(0, 6); // 6 Notes
            case 'hard': return MAPPING;             // 8 Notes
            default: return MAPPING.slice(0, 4);
        }
    }, [difficulty]);

    const MAX_ROUNDS = 10;

    // Start Testing Phase
    const startTest = () => {
        setPhase('testing');
        setRound(1);
        setScore(0);
        startRound();
    };

    const startRound = () => {
        // Use activeMappings instead of full MAPPING
        const t = activeMappings[Math.floor(Math.random() * activeMappings.length)];
        setTarget(t);
        setIsVisualVisible(false);
        setFeedback(null);

        // Auto-play cue after a short delay
        setTimeout(() => {
            playCue(t, false); // Audio only for test
        }, 500);
    };

    const playCue = (noteTarget: ColorNote | null = target, showVisual: boolean = true) => {
        if (!noteTarget) return;

        // Audio
        audio.playTone(noteTarget.freq, 'sine', 1);

        // Visual
        if (showVisual) {
            setIsVisualVisible(true);
            setTimeout(() => setIsVisualVisible(false), 1000);
        }
    };

    // Unused in 'testing' auto-play, used for Replay button
    const handleReplay = () => {
        if (target) playCue(target, false);
    };

    const handleLearnClick = (note: ColorNote) => {
        // In training mode, clicking a color plays its sound and shows visual
        setTarget(note);
        setIsVisualVisible(true);
        audio.playTone(note.freq, 'sine', 1);
        setTimeout(() => setIsVisualVisible(false), 500);
    };

    const handleGuess = (guess: ColorNote) => {
        if (phase !== 'testing' || !target) return;

        if (guess.note === target.note) {
            setScore(prev => prev + 1);
            setFeedback('correct');
            addXP(15);
            audio.playTone(880, 'sine', 0.1); // High ping
        } else {
            setFeedback('wrong');
            audio.playTone(110, 'sawtooth', 0.3); // Low buzz
        }

        // Reveal the color briefly
        setIsVisualVisible(true);

        setTimeout(() => {
            if (round < MAX_ROUNDS) {
                setRound(prev => prev + 1);
                startRound();
            } else {
                setPhase('result');
            }
        }, 1500);
    };

    if (phase === 'result') {
        return <SessionSummary title="Synesthesia Tuner Complete" xpEarned={score * 15} accuracy={(score / MAX_ROUNDS) * 100} onRestart={() => window.location.reload()} />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto space-y-8 relative">
            {phase === 'testing' && (
                <div className="absolute top-0 left-0 p-4 font-mono text-sm text-cyan-400">
                    Round {round} / {MAX_ROUNDS}
                </div>
            )}

            {/* Instruction & Difficulty */}
            <div className="text-center space-y-4 w-full">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold">
                        {phase === 'training' ? " sensory Calibration" : "Blind Test"}
                    </h2>
                    <p className="text-muted">
                        {phase === 'training'
                            ? "Explore the tones. Select difficulty before testing."
                            : "Listen to the tone and select the matching color."}
                    </p>
                </div>

                {phase === 'training' && (
                    <div className="flex items-center justify-center gap-2 p-1 bg-white/5 rounded-lg w-fit mx-auto border border-white/10">
                        {(['easy', 'medium', 'hard'] as const).map(d => (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm uppercase tracking-wider transition-all",
                                    difficulty === d ? "bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-400/20" : "text-muted hover:text-white hover:bg-white/5"
                                )}
                            >
                                {d} ({d === 'easy' ? 4 : d === 'medium' ? 6 : 8})
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Central Stimulus */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                <button
                    onClick={phase === 'testing' ? handleReplay : undefined}
                    className={cn(
                        "w-32 h-32 rounded-full border border-white/10 flex items-center justify-center group overflow-hidden transition-all",
                        phase === 'testing' ? "bg-white/5 hover:bg-white/10 hover:scale-105 cursor-pointer" : "bg-black cursor-default"
                    )}
                >
                    <Volume2 className={cn("w-12 h-12 text-white/50 transition-colors", phase === 'testing' && "group-hover:text-white")} />

                    {/* Visual Flash Overlay */}
                    <AnimatePresence>
                        {isVisualVisible && target && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={cn("absolute inset-0 rounded-full", target.colorArg)} // Added rounded-full here
                            />
                        )}
                    </AnimatePresence>

                    {/* Feedback Overlay */}
                    <AnimatePresence>
                        {feedback === 'correct' && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-green-500 flex items-center justify-center rounded-full">
                                <Zap className="w-12 h-12 text-white fill-white" />
                            </motion.div>
                        )}
                        {feedback === 'wrong' && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-500/80 flex items-center justify-center rounded-full">
                                <span className="text-4xl">❌</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </button>
            </div>

            {phase === 'training' ? (
                <Button onClick={startTest} className="px-12 py-6 text-xl">
                    Start Test ({difficulty.toUpperCase()})
                </Button>
            ) : (
                <div className="h-12 flex items-center justify-center text-muted text-sm uppercase tracking-widest animate-pulse">
                    Listening...
                </div>
            )}

            {/* Color Grid */}
            <div className={cn(
                "grid gap-4 w-full transition-all duration-500 max-w-4xl px-4",
                difficulty === 'hard' ? "grid-cols-4" : "grid-cols-2 md:grid-cols-4"
            )}>
                {activeMappings.map((m) => (
                    <button
                        key={m.note}
                        onClick={() => phase === 'training' ? handleLearnClick(m) : handleGuess(m)}
                        className={cn(
                            "h-24 rounded-xl border-2 border-transparent transition-all hover:scale-105 flex flex-col items-center justify-center gap-2",
                            m.colorArg,
                            "opacity-80 hover:opacity-100 hover:border-white focus:outline-none focus:ring-2 ring-white"
                        )}
                    >
                        <span className="font-bold text-black/50 uppercase tracking-widest">{m.name}</span>
                        {phase === 'training' && <span className="text-xs text-black/40 font-mono">{m.note}</span>}
                    </button>
                ))}
            </div>

        </div>
    );
};
