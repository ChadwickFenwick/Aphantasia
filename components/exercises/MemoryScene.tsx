'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, Float, OrbitControls } from '@react-three/drei';
import { PulseButton } from '@/components/ui/PulseButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { RefreshCw, Play, CheckCircle, XCircle } from 'lucide-react';
import { generateMemoryScenario, MemoryScenario, SceneObject } from '@/lib/visuals/MemoryLogic';
import { cn } from '@/lib/utils';
import * as THREE from 'three';

// --- GEOMETRY HELPER ---
const Geometry = ({ object }: { object: SceneObject }) => {
    // Map string color to hex
    const colorMap: Record<string, string> = {
        red: '#ef4444',
        blue: '#3b82f6',
        green: '#22c55e',
        yellow: '#eab308',
        purple: '#a855f7',
        orange: '#f97316'
    };

    const color = colorMap[object.color];
    const pos = object.position;

    switch (object.type) {
        case 'cube':
            return <mesh position={pos}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={color} /></mesh>;
        case 'sphere':
            return <mesh position={pos}><sphereGeometry args={[0.6, 32, 32]} /><meshStandardMaterial color={color} /></mesh>;
        case 'cylinder':
            return <mesh position={pos}><cylinderGeometry args={[0.5, 0.5, 1, 32]} /><meshStandardMaterial color={color} /></mesh>;
        case 'cone':
            return <mesh position={pos}><coneGeometry args={[0.6, 1.2, 32]} /><meshStandardMaterial color={color} /></mesh>;
        default:
            return null;
    }
};

// --- MAIN COMPONENT ---
import { SessionSummary } from "@/components/ui/SessionSummary";

export const MemoryScene = () => {
    const [scenario, setScenario] = useState<MemoryScenario | null>(null);
    const [phase, setPhase] = useState<'observe' | 'recall' | 'result' | 'summary'>('observe');
    const [timeLeft, setTimeLeft] = useState(10);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState(1);

    // Session State
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const TOTAL_ROUNDS = 5;

    // Timer Logic
    useEffect(() => {
        if (phase === 'observe') {
            if (timeLeft > 0) {
                const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setPhase('recall');
            }
        }
    }, [phase, timeLeft]);

    // Unified function to start a round
    const startRound = () => {
        console.log('Starting Round:', round, 'Difficulty:', difficulty);

        // Ensure difficulty is at least 1
        const safeDiff = Math.max(1, difficulty);

        // Use current difficulty state
        setScenario(generateMemoryScenario(safeDiff));
        setPhase('observe');
        setTimeLeft(10);
        setSelectedOption(null);
    };

    const handleOptionSelect = (option: string) => {
        if (phase === 'result' || !scenario) return;

        setSelectedOption(option);
        setPhase('result');

        if (option === scenario.question.correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (round < TOTAL_ROUNDS) {
            setRound(r => r + 1);
            // newScenario will use the *next* round value if we rely on state, 
            // but setRound is async. 
            // Better to pass round + 1 to newScenario or useEffect?
            // Actually, let's trigger newScenario via useEffect on round change? 
            // Or just calculate it here.

            // Issue: newScenario uses 'round' state which is stale here.
            // Let's refactor newScenario to accept round/difficulty or just wait for render.
            // But we call newScenario() directly. 
        } else {
            setPhase('summary');
        }
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
    };

    // Effect: Trigger round start whenever round changes
    useEffect(() => {
        startRound();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [round]);

    if (phase === 'summary') {
        const accuracy = Math.round((score / TOTAL_ROUNDS) * 100);
        return (
            <SessionSummary
                title="Memory Detail"
                score={score}
                totalQuestions={TOTAL_ROUNDS}
                accuracy={accuracy}
                xpEarned={score * 20} // 20 XP per correct answer
                skillsTrained={['visual', 'focus']}
                onRestart={handleRestart}
            />
        );
    }

    if (!scenario) return null;

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-full">
            {/* HUD */}
            <div className="w-full flex justify-between items-center mb-4 px-4">
                <div className="text-sm font-mono text-muted">Round {round} / {TOTAL_ROUNDS}</div>

                {/* Difficulty Controls */}
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
                    <span className="text-xs text-muted uppercase px-2">Difficulty</span>
                    <button
                        onClick={() => setDifficulty(d => Math.max(1, d - 1))}
                        className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-50"
                        disabled={difficulty <= 1}
                    >
                        -
                    </button>
                    <span className="text-sm font-mono font-bold w-4 text-center">{difficulty}</span>
                    <button
                        onClick={() => setDifficulty(d => Math.min(10, d + 1))}
                        className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-50"
                        disabled={difficulty >= 10}
                    >
                        +
                    </button>
                </div>

                <div className="text-sm font-mono text-white">Score: {score}</div>
            </div>

            {/* CANVAS / SCENE */}
            <div className="w-full h-[400px] mb-8 relative flex items-center justify-center">
                {/* 3D Scene - Visible only during Observe Phase */}
                {phase === 'observe' ? (
                    <div className="w-full h-full bg-black/20 rounded-xl overflow-hidden border border-white/10">
                        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                                <group>
                                    {scenario.objects.map(obj => (
                                        <Geometry key={obj.id} object={obj} />
                                    ))}
                                </group>
                            </Float>
                            {/* Orbit controls allowed for inspection */}
                            <OrbitControls enableZoom={false} autoRotate={false} />
                        </Canvas>

                        {/* Timer Overlay */}
                        <div className="absolute top-4 right-4 z-10 font-mono text-xl text-white font-black bg-black/50 px-3 py-1 rounded">
                            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </div>

                        {/* Rotation Hint */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest pointer-events-none animate-pulse">
                            <RefreshCw className="w-3 h-3" />
                            Drag to Rotate
                        </div>
                    </div>
                ) : (
                    // RECALL PHASE UI
                    <GlassCard className="w-full h-full flex flex-col items-center justify-center p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-8">{scenario.question.text}</h3>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                {scenario.question.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option)}
                                        disabled={phase === 'result'}
                                        className={cn(
                                            "p-4 rounded-xl border transition-all text-lg font-bold capitalize",
                                            phase === 'result' && option === scenario.question.correctAnswer
                                                ? "bg-green-500/20 border-green-500 text-green-400" // Correct
                                                : phase === 'result' && option === selectedOption && option !== scenario.question.correctAnswer
                                                    ? "bg-red-500/20 border-red-500 text-red-400" // Wrong choice
                                                    : selectedOption === option
                                                        ? "bg-secondary/20 border-secondary text-white" // Selected
                                                        : "bg-white/5 border-white/10 text-muted hover:bg-white/10 hover:text-white" // Default
                                        )}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                )}
            </div>

            {/* CONTROLS */}
            <div className="mt-4">
                {phase === 'result' && (
                    <PulseButton onClick={handleNext} className="flex gap-2 px-8">
                        {round < TOTAL_ROUNDS ? (
                            <><RefreshCw className="w-4 h-4" /> NEXT ROUND</>
                        ) : (
                            <><CheckCircle className="w-4 h-4" /> FINISH SESSION</>
                        )}
                    </PulseButton>
                )}
                {phase === 'observe' && (
                    <p className="text-muted animate-pulse">Study the scene. Memorize shapes and colors.</p>
                )}
            </div>
        </div>
    );
};
