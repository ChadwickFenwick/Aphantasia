'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, RoundedBox } from '@react-three/drei';
import { Die } from './Die';
import { PulseButton as Button } from '@/components/ui/PulseButton';
import { SessionSummary } from '@/components/ui/SessionSummary';
import { MessageSquare, ArrowRight, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, RotateCw } from 'lucide-react';
import { useUserStore } from '@/lib/store';
import { DieState, rollForward, rollBackward, rollRight, rollLeft, spinRight, spinLeft } from '@/lib/visuals/DiceLogic';
import * as THREE from 'three';

type Phase = 'observe' | 'darkness' | 'input' | 'result' | 'summary';

export const MentalAbacus = () => {
    const { addXP } = useUserStore();
    const [phase, setPhase] = useState<Phase>('observe');
    const [startState, setStartState] = useState<DieState>({ top: 1, front: 2, right: 3 });
    const [currentState, setCurrentState] = useState<DieState>({ top: 1, front: 2, right: 3 }); // The "Real" state (hidden)
    const [command, setCommand] = useState<{ text: string; description: string; icon: React.ReactNode; func: (s: DieState) => DieState } | null>(null);
    const [targetFace, setTargetFace] = useState<'top' | 'front' | 'right'>('top');
    const [userAnswer, setUserAnswer] = useState<number | null>(null);

    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const MAX_ROUNDS = 5;

    const COMMANDS = [
        { text: "Roll FORWARD", description: "Top moves to Front", icon: <ArrowUp className="w-16 h-16" />, func: rollForward },
        { text: "Roll BACKWARD", description: "Top moves to Back", icon: <ArrowDown className="w-16 h-16" />, func: rollBackward },
        { text: "Roll RIGHT", description: "Top moves to Right", icon: <ArrowRight className="w-16 h-16" />, func: rollRight },
        { text: "Roll LEFT", description: "Top moves to Left", icon: <ArrowLeft className="w-16 h-16" />, func: rollLeft },
        { text: "Spin RIGHT", description: "Rotate Clockwise", icon: <RotateCw className="w-16 h-16" />, func: spinRight },
        { text: "Spin LEFT", description: "Rotate Counter-Clockwise", icon: <RotateCcw className="w-16 h-16" />, func: spinLeft },
    ];

    const startRound = () => {
        // 1. Generate Random Start State
        const s: DieState = { top: 1, front: 2, right: 3 };
        let randomState = s;
        for (let i = 0; i < 3; i++) {
            const r = Math.random();
            if (r > 0.5) randomState = spinRight(randomState);
            else randomState = rollForward(randomState);
        }

        setStartState(randomState);
        setCurrentState(randomState);
        setPhase('observe');
        setUserAnswer(null);

        // Pre-calculate puzzle for the next phase
        const cmd = COMMANDS[Math.floor(Math.random() * COMMANDS.length)];
        const result = cmd.func(randomState);
        const targets: ('top' | 'front' | 'right')[] = ['top', 'front', 'right'];
        const target = targets[Math.floor(Math.random() * targets.length)];

        // Store them in state/refs or just update state now?
        // If we update `command` now, it doesn't show yet because phase is 'observe'.
        setCommand(cmd);
        setCurrentState(result); // This is the *Answer* state. 
        // Wait! visual Die uses `startState`. Answer check uses `currentState`.
        // If I update `currentState` now, answer logic is ready.
        // But the Visual Die uses `startState` prop. So this is safe.

        setTargetFace(target);
    };

    useEffect(() => {
        startRound();
    }, []);

    const handleReady = () => {
        setPhase('darkness');
    };

    const submitAnswer = (val: number) => {
        const correctVal = currentState[targetFace];

        if (val === correctVal) {
            setScore(prev => prev + 1);
            addXP(25);
        }

        if (round < MAX_ROUNDS) {
            setRound(prev => prev + 1);
            startRound();
        } else {
            setPhase('summary');
        }
    };

    if (phase === 'summary') {
        return <SessionSummary title="Phantom Dice Complete" xpEarned={score * 25} accuracy={(score / MAX_ROUNDS) * 100} onRestart={() => window.location.reload()} />;
    }

    return (
        <div className="w-full flex flex-col items-center relative min-h-[600px] h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="absolute top-4 left-0 right-0 text-center z-10 pointer-events-none">
                <h2 className="text-xl font-bold text-cyan-400">Round {round} / {MAX_ROUNDS}</h2>
                {phase === 'observe' && <p className="text-white animate-pulse">Memorize the orientation...</p>}
            </div>

            {/* 3D Scene Container (Top Section) */}
            <div className="w-full flex-1 bg-black/50 border border-white/10 rounded-xl overflow-hidden relative min-h-[400px]">
                {/* Curtain / Challenge Overlay */}
                {phase === 'darkness' && (
                    <div className="absolute inset-0 bg-black z-20 flex flex-col items-center justify-center p-8 text-center">
                        <div className="space-y-6 flex flex-col items-center">

                            <div className="space-y-4 flex flex-col items-center">
                                <p className="text-gray-400 text-lg tracking-widest uppercase font-mono">Mental Action</p>

                                <div className="p-6 bg-white/5 rounded-full border border-white/10 text-cyan-400">
                                    {command?.icon}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-4xl font-black text-white">{command?.text ?? "Loading..."}</h3>
                                    <p className="text-lg text-muted">{command?.description}</p>
                                </div>
                            </div>

                            <div className="w-24 h-1 bg-white/20 rounded-full mx-auto" />

                            <p className="text-3xl text-cyan-400 font-bold animate-pulse">
                                What is on {targetFace.toUpperCase()}?
                            </p>
                        </div>
                    </div>
                )}

                {/* The Die (Only visible in 'observe') */}
                {phase === 'observe' && (
                    <Canvas camera={{ position: [2, 2, 2], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <Environment preset="city" />

                        {/* We need to rotate the 3D model to match the Logical State */}
                        {/* If logical TOP is 1, we set rotation to 0,0,0 (assuming 1 is default up) */}
                        {/* Actually, the Die logic in Die.tsx takes a 'value'. But here we have orientation. */}
                        {/* To strictly match, we might need to update Die.tsx or just map state to rotation props. */}
                        {/* For MVP: Let's assume the user just sees the Die as it is rendered, and we use the LOGIC to calculate the answer. */}
                        {/* So we need to render the die visually consistent with 'startState'. */}

                        {/* Die.tsx takes a single 'value'. That's not enough for orientation. */}
                        {/* We needs a Die that accepts top/front props or rotation. */}
                        {/* Let's ignore Die.tsx 'value' prop for physics and just use standard Mesh rotation. */}

                        <DieMesh state={startState} />

                        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
                    </Canvas>
                )}
            </div>

            {/* Bottom Interaction Area (Fixed Height or Auto) */}
            <div className="h-auto min-h-[160px] flex flex-col items-center justify-center p-4 text-center w-full z-30 shrink-0">
                {phase === 'observe' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-white">Top: {startState.top}</p>
                            <p className="text-xl text-muted">Front: {startState.front}</p>
                        </div>
                        <Button onClick={handleReady} className="px-12 py-6 text-xl bg-white text-black hover:bg-white/90">
                            I'M READY
                        </Button>
                    </div>
                )}

                {phase === 'darkness' && (
                    <div className="grid grid-cols-6 gap-3 w-full max-w-2xl px-4">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <button
                                key={num}
                                onClick={() => submitAnswer(num)}
                                className="aspect-square rounded-xl bg-white/10 hover:bg-cyan-400 hover:text-black border border-white/20 text-3xl font-bold transition-all flex items-center justify-center active:scale-95"
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

// Internal Helper Component to render the Die based on State
const DieMesh = ({ state }: { state: DieState }) => {
    // We need to rotate the mesh so that 'state.top' is pointing Y+ and 'state.front' is pointing Z+
    // This is complex to calculate Euler angles for.
    // Easier: Just create the geometry with the textures/dots in the right places?
    // OR: Use a pre-defined map of Rotations for limited permutations.

    // Alternative: Just render the dots dynamically based on the state!
    // 1 is Top (Y+), 6 is Bottom (Y-)
    // 2 is Front (Z+), 5 is Back (Z-)
    // 3 is Right (X+), 4 is Left (X-) 
    // Wait, in my Logic, I track what is logically "Top".
    // So if state.top is 3... I put 3 pips on the Y+ face.
    // If state.front is 5... I put 5 pips on the Z+ face.

    return (
        <group>
            <RoundedBox args={[2, 2, 2]} radius={0.3} smoothness={4}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </RoundedBox>

            {/* Top Face (Y+) */}
            <Face value={state.top} position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]} />
            {/* Front Face (Z+) */}
            <Face value={state.front} position={[0, 0, 1.01]} rotation={[0, 0, 0]} />
            {/* Right Face (X+) */}
            <Face value={state.right} position={[1.01, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

            {/* IMPLIED FACES (Standard Opposites) */}
            {/* Bottom Face (Y-) = Opposite Top */}
            <Face value={getOpposite(state.top)} position={[0, -1.01, 0]} rotation={[Math.PI / 2, 0, 0]} />
            {/* Back Face (Z-) = Opposite Front */}
            <Face value={getOpposite(state.front)} position={[0, 0, -1.01]} rotation={[0, Math.PI, 0]} />
            {/* Left Face (X-) = Opposite Right */}
            <Face value={getOpposite(state.right)} position={[-1.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        </group>
    );
}

const getOpposite = (n: number) => (7 - n) as (1 | 2 | 3 | 4 | 5 | 6);

const Face = ({ value, position, rotation }: any) => {
    // Render Pips for 'value'
    // Reuse logic from Die.tsx but dynamic
    return (
        <group position={position} rotation={rotation}>
            {getPips(value).map((pos, i) => (
                <mesh key={i} position={pos}>
                    <circleGeometry args={[0.2, 32]} />
                    <meshBasicMaterial color="#00F2FF" />
                </mesh>
            ))}
        </group>
    );
};

const getPips = (val: number): [number, number, number][] => {
    switch (val) {
        case 1: return [[0, 0, 0]];
        case 2: return [[-0.5, 0.5, 0], [0.5, -0.5, 0]];
        case 3: return [[-0.5, 0.5, 0], [0, 0, 0], [0.5, -0.5, 0]];
        case 4: return [[-0.5, 0.5, 0], [0.5, 0.5, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]];
        case 5: return [[-0.5, 0.5, 0], [0.5, 0.5, 0], [0, 0, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]];
        case 6: return [[-0.5, 0.5, 0], [0.5, 0.5, 0], [-0.5, 0, 0], [0.5, 0, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]];
        default: return [];
    }
}
