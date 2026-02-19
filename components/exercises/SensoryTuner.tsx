'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PulseButton } from '@/components/ui/PulseButton';
import { RefreshCw, CheckCircle, XCircle, Activity, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- UTILS ---
const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

// --- TYPES ---
// --- 3D COMPONENTS ---
import { Canvas } from '@react-three/fiber';
import { Sphere, Environment, ContactShadows } from '@react-three/drei';

const MaterialSphere = ({ roughness, metalness }: { roughness: number, metalness: number }) => {
    return (
        <Canvas camera={{ position: [0, 0, 2.5] }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            <Sphere args={[1, 64, 64]}>
                <meshStandardMaterial
                    color="#00F2FF" // Fixed color to focus on material
                    roughness={roughness}
                    metalness={metalness}
                    envMapIntensity={1}
                />
            </Sphere>

            <Environment preset="warehouse" /> {/* Good reflections */}
            <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        </Canvas>
    );
};

// --- TYPES ---
type GameMode = 'color' | 'curve' | 'material';

// --- MAIN COMPONENT ---
import { SessionSummary } from "@/components/ui/SessionSummary";
import { Box } from 'lucide-react';

export const SensoryTuner = () => {
    const [mode, setMode] = useState<GameMode>('color');
    const [phase, setPhase] = useState<'study' | 'match' | 'result' | 'summary'>('study');
    const [target, setTarget] = useState<any>(null); // For material: {r, m}
    const [options, setOptions] = useState<any[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState(1);

    // Session State
    const [round, setRound] = useState(1);
    const TOTAL_ROUNDS = 10;

    // Helper to generate color options
    const generateColors = () => {
        // Random Base Color
        const h = Math.floor(Math.random() * 360);
        const s = 60 + Math.floor(Math.random() * 20); // 60-80%
        const l = 40 + Math.floor(Math.random() * 20); // 40-60%

        const cssTarget = hslToHex(h, s, l);

        // Variance decreases as difficulty increases
        const variance = Math.max(5, 35 - (difficulty * 6));

        const opts = [cssTarget];
        while (opts.length < 3) {
            const offset = (Math.random() * variance * 2) - variance;
            if (Math.abs(offset) < 2) continue;

            const newH = (h + offset + 360) % 360;
            const newHex = hslToHex(newH, s, l);

            if (!opts.includes(newHex)) opts.push(newHex);
        }

        return { target: cssTarget, options: opts.sort(() => Math.random() - 0.5) };
    };

    // Helper to generate curve options
    const generateCurves = () => {
        const baseCy = Math.random() * 80 + 10;
        const variance = Math.max(5, 30 - (difficulty * 5));

        const opts = [baseCy];
        while (opts.length < 3) {
            const offset = (Math.random() * variance * 2) - variance;
            if (Math.abs(offset) < 2) continue;

            const newCy = Math.max(0, Math.min(100, baseCy + offset));
            if (!opts.includes(newCy)) opts.push(newCy);
        }

        return {
            target: baseCy,
            options: opts.sort(() => Math.random() - 0.5)
        };
    };

    // Helper to generate Material options
    const generateMaterials = () => {
        // We vary Roughness primarily, maybe Metalness as secondary or fixed
        const baseRoughness = Math.random();
        const baseMetalness = Math.random() > 0.5 ? 1 : 0; // Distinct metal vs plastic usually

        const targetMat = { r: baseRoughness, m: baseMetalness };

        const variance = Math.max(0.05, 0.3 - (difficulty * 0.05)); // 0.3 down to 0.05

        const opts = [targetMat];
        while (opts.length < 3) {
            const offset = (Math.random() * variance * 2) - variance;
            if (Math.abs(offset) < 0.02) continue;

            let newR = baseRoughness + offset;
            newR = Math.max(0, Math.min(1, newR));

            // Ensure uniqueness
            if (!opts.some(o => Math.abs(o.r - newR) < 0.01)) {
                opts.push({ r: newR, m: baseMetalness });
            }
        }

        return {
            target: targetMat,
            options: opts.sort(() => Math.random() - 0.5)
        };
    };

    const newGame = (newMode: GameMode = mode) => {
        let gen;
        if (newMode === 'color') gen = generateColors();
        else if (newMode === 'curve') gen = generateCurves();
        else gen = generateMaterials();

        setTarget(gen.target);
        setOptions(gen.options);
        setPhase('study');
        setSelected(null);

        // Auto-advance from Study to Match
        setTimeout(() => {
            setPhase('match');
        }, 2000); // 2s study time
    };

    useEffect(() => {
        newGame();
    }, []);

    const handleSelect = (idx: number, opt: any) => {
        if (phase !== 'match') return;
        setSelected(idx);

        // Comparison depending on mode
        let isCorrect = false;
        if (mode === 'material') {
            isCorrect = Math.abs(opt.r - target.r) < 0.001; // Float adjust
        } else {
            isCorrect = opt === target;
        }

        if (isCorrect) setScore(s => s + 1);
        setPhase('result');
    };

    const handleNext = () => {
        if (round < TOTAL_ROUNDS) {
            setRound(r => r + 1);
            newGame();
        } else {
            setPhase('summary');
        }
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        newGame();
    };

    if (phase === 'summary') {
        const accuracy = Math.round((score / TOTAL_ROUNDS) * 100);
        return (
            <SessionSummary
                title="Sensory Tuning"
                score={score}
                totalQuestions={TOTAL_ROUNDS}
                accuracy={accuracy}
                xpEarned={score * 15}
                skillsTrained={['visual', 'focus']}
                onRestart={handleRestart}
            />
        );
    }

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-full">
            {/* HUD */}
            <div className="flex justify-between w-full mb-8 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex gap-4">
                    <button
                        onClick={() => { setMode('color'); newGame('color'); }}
                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", mode === 'color' ? "bg-primary text-black" : "text-muted hover:text-white")}
                    >
                        <Palette className="w-4 h-4" /> Colors
                    </button>
                    <button
                        onClick={() => { setMode('curve'); newGame('curve'); }}
                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", mode === 'curve' ? "bg-primary text-black" : "text-muted hover:text-white")}
                    >
                        <Activity className="w-4 h-4" /> Curves
                    </button>
                    <button
                        onClick={() => { setMode('material'); newGame('material'); }}
                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", mode === 'material' ? "bg-primary text-black" : "text-muted hover:text-white")}
                    >
                        <Box className="w-4 h-4" /> Materials
                    </button>
                </div>
                <div className="text-right">
                    <div className="text-sm font-mono text-muted">Round {round} / {TOTAL_ROUNDS}</div>
                    <div className="text-xl font-mono text-white">Score: {score}</div>
                </div>
            </div>

            {/* GAME AREA */}
            <div className="w-full h-[400px] flex items-center justify-center relative">

                {/* STUDY PHASE */}
                {phase === 'study' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        {mode === 'color' && (
                            <div className="w-48 h-48 rounded-full shadow-2xl" style={{ backgroundColor: target }} />
                        )}
                        {mode === 'curve' && (
                            <div className="w-64 h-64 bg-white/5 rounded-xl border border-white/10 p-4">
                                <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[2px]">
                                    <path d={`M 10,50 Q 50,${target} 90,50`} />
                                </svg>
                            </div>
                        )}
                        {mode === 'material' && (
                            <div className="w-64 h-64">
                                <MaterialSphere roughness={target.r} metalness={target.m} />
                            </div>
                        )}
                        <p className="text-center mt-4 text-muted animate-pulse">Study the {mode}...</p>
                    </div>
                )}

                {/* MATCH / RESULT PHASE */}
                {(phase === 'match' || phase === 'result') && (
                    <div className="flex gap-8 animate-in slide-in-from-bottom-4 duration-300">
                        {options.map((opt: any, idx: number) => {
                            const isSelected = selected === idx;

                            // Check Correctness
                            let isCorrect = false;
                            if (mode === 'material') {
                                isCorrect = Math.abs(opt.r - target.r) < 0.001;
                            } else {
                                isCorrect = opt === target;
                            }

                            // Result styling
                            let ringColor = 'ring-transparent';
                            if (phase === 'result') {
                                if (isCorrect) ringColor = 'ring-green-500';
                                else if (isSelected && !isCorrect) ringColor = 'ring-red-500';
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(idx, opt)}
                                    disabled={phase === 'result'}
                                    className={cn(
                                        "relative group transition-all duration-200 hover:scale-105 ring-4 rounded-xl overflow-hidden",
                                        ringColor
                                    )}
                                >
                                    {mode === 'color' && (
                                        <div className="w-32 h-32 rounded-xl shadow-lg" style={{ backgroundColor: opt }} />
                                    )}
                                    {mode === 'curve' && (
                                        <div className="w-32 h-32 bg-white/5 rounded-xl border border-white/10 p-2">
                                            <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[2px]">
                                                <path d={`M 10,50 Q 50,${opt} 90,50`} />
                                            </svg>
                                        </div>
                                    )}
                                    {mode === 'material' && (
                                        <div className="w-32 h-32 bg-black/20">
                                            <MaterialSphere roughness={opt.r} metalness={opt.m} />
                                        </div>
                                    )}

                                    {/* Result Icon */}
                                    {phase === 'result' && isCorrect && (
                                        <div className="absolute -top-3 -right-3 bg-black rounded-full z-10"><CheckCircle className="w-6 h-6 text-green-500 fill-current" /></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CONTROLS */}
            <div className="mt-8">
                {phase === 'result' && (
                    <PulseButton onClick={handleNext} className="px-8 bg-white/10 hover:bg-white/20 text-white">
                        {round < TOTAL_ROUNDS ? (
                            <><RefreshCw className="w-4 h-4 mr-2" /> NEXT ROUND</>
                        ) : (
                            <><CheckCircle className="w-4 h-4 mr-2" /> FINISH SESSION</>
                        )}
                    </PulseButton>
                )}
            </div>

            <div className="mt-4 text-center max-w-lg">
                <p className="text-sm text-muted">
                    Don't use words like "Blue" or "Curved up". Use your <span className="text-secondary">Sensory Memory</span>.
                    Feel the raw visual input.
                </p>
            </div>
        </div>
    );
};
