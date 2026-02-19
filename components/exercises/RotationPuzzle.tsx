'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, Float, OrbitControls, Edges } from '@react-three/drei';
import { GlassCard } from '@/components/ui/GlassCard';
import { PulseButton } from '@/components/ui/PulseButton';
import { RotateCw, RotateCcw, BoxSelect, RefreshCw, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SessionSummary } from "@/components/ui/SessionSummary";

// --- PUZZLE SHAPE COMPONENT ---
const PuzzleShape = ({ type, rotation, color, isTarget }: { type: 'cube' | 'tetra' | 'octa', rotation: [number, number, number], color: string, isTarget?: boolean }) => {
    return (
        <group rotation={rotation}>
            <Center>
                {/* Visual Marker for Orientation (Front Face) */}
                <mesh position={[0, 0, 0.6]} scale={[0.2, 0.2, 0.2]}>
                    <sphereGeometry />
                    <meshBasicMaterial color="#ef4444" />
                </mesh>

                {type === 'cube' && (
                    <group>
                        {/* L-Shape-ish thing for asymmetry */}
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                        <mesh position={[1, 0, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                        <mesh position={[0, 1, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                        <mesh position={[0, 0, 1]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                    </group>
                )}
                {type === 'tetra' && (
                    <group>
                        {/* T-Shape */}
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                        <mesh position={[1, 0, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                        <mesh position={[-1, 0, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                        <mesh position={[0, -1, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                    </group>
                )}
                {type === 'octa' && ( // Not really octa, but just another shape
                    <group>
                        {/* Z-Shape */}
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                        <mesh position={[1, 0, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                        <mesh position={[0, 1, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                        <mesh position={[-1, 1, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                            <Edges color="white" threshold={15} />
                        </mesh>
                    </group>
                )}
            </Center>
        </group>
    );
};

export const RotationPuzzle = () => {
    // Game State
    const [targetRotation, setTargetRotation] = useState<[number, number, number]>([0, 0, 0]);
    const [userRotation, setUserRotation] = useState<[number, number, number]>([0, 0, 0]);
    const [phase, setPhase] = useState<'memorize' | 'solve' | 'result' | 'summary'>('memorize');
    const [shapeType, setShapeType] = useState<'cube' | 'tetra' | 'octa'>('cube');
    const [score, setScore] = useState<{ accuracy: number, points: number } | null>(null);

    // Session State
    const [round, setRound] = useState(1);
    const [sessionScore, setSessionScore] = useState(0);
    const TOTAL_ROUNDS = 5;

    // Timer
    const [timeLeft, setTimeLeft] = useState(5);

    // Interaction State
    const [isDragging, setIsDragging] = useState(false);
    const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        newRound();
    }, []);

    // Timer Logic
    useEffect(() => {
        if (phase === 'memorize') {
            if (timeLeft > 0) {
                const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setPhase('solve');
                setUserRotation([0, 0, 0]);
            }
        }
    }, [phase, timeLeft]);

    const newRound = () => {
        const snap = Math.PI / 2;
        const x = Math.round(Math.random() * 4) * snap;
        const y = Math.round(Math.random() * 4) * snap;
        const z = 0;

        setTargetRotation([x, y, z]);
        setUserRotation([0, 0, 0]);

        const shapeTypes: ('cube' | 'tetra' | 'octa')[] = ['cube', 'tetra', 'octa'];
        setShapeType(shapeTypes[Math.floor(Math.random() * shapeTypes.length)]);

        setPhase('memorize');
        setTimeLeft(5);
        setScore(null);
    };

    const handleSubmit = () => {
        const norm = (rad: number) => {
            let r = rad % (Math.PI * 2);
            if (r < 0) r += Math.PI * 2;
            return r;
        };

        const diffX = Math.abs(norm(targetRotation[0]) - norm(userRotation[0]));
        const diffY = Math.abs(norm(targetRotation[1]) - norm(userRotation[1]));

        const margin = 0.3;
        const isMatchX = diffX < margin || Math.abs(diffX - Math.PI * 2) < margin;
        const isMatchY = diffY < margin || Math.abs(diffY - Math.PI * 2) < margin;

        const isCorrect = isMatchX && isMatchY;
        const points = isCorrect ? 100 : Math.max(0, 100 - Math.round((diffX + diffY) * 50));

        setScore({
            accuracy: points,
            points: points
        });

        setSessionScore(s => s + points);
        setPhase('result');
    };

    const handleRotate = (axis: 'x' | 'y', dir: 1 | -1) => {
        if (phase !== 'solve') return;

        setUserRotation(prev => {
            const next = [...prev] as [number, number, number];
            if (axis === 'x') next[0] += dir * (Math.PI / 2);
            if (axis === 'y') next[1] += dir * (Math.PI / 2);
            return next;
        });
    };

    // --- MOUSE DRAG LOGIC ---
    const handlePointerDown = (e: React.PointerEvent) => {
        if (phase !== 'solve') return;
        setIsDragging(true);
        setLastPointerPos({ x: e.clientX, y: e.clientY });
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    // Sensitivity for drag-to-rotate
    const SENSITIVITY = 0.01;

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || phase !== 'solve') return;

        const dx = e.clientX - lastPointerPos.x;
        const dy = e.clientY - lastPointerPos.y;

        setUserRotation(prev => [
            prev[0] + dy * SENSITIVITY, // Y movement -> X rotation
            prev[1] + dx * SENSITIVITY, // X movement -> Y rotation
            prev[2]
        ]);

        setLastPointerPos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);

        // SNAP LOGIC
        setUserRotation(prev => {
            const snap = Math.PI / 2;
            return [
                Math.round(prev[0] / snap) * snap,
                Math.round(prev[1] / snap) * snap,
                prev[2]
            ];
        });
    };


    const handleNext = () => {
        if (round < TOTAL_ROUNDS) {
            setRound(r => r + 1);
            newRound();
        } else {
            setPhase('summary');
        }
    };

    const handleRestart = () => {
        setRound(1);
        setSessionScore(0);
        newRound();
    };

    if (phase === 'summary') {
        const avgAccuracy = Math.round(sessionScore / TOTAL_ROUNDS);
        return (
            <SessionSummary
                title="Mental Rotation"
                accuracy={avgAccuracy}
                totalQuestions={TOTAL_ROUNDS}
                xpEarned={Math.round(sessionScore / 5)}
                skillsTrained={['cognitive', 'visual']}
                onRestart={handleRestart}
            />
        );
    }

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-full">
            {/* HUD */}
            <div className="flex justify-between w-full mb-8 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-white">Mental Rotation</h2>
                    <p className="text-sm text-muted">
                        {phase === 'memorize' && "Memorize the orientation!"}
                        {phase === 'solve' && "Drag to rotate the shape to match."}
                        {phase === 'result' && score && `Accuracy: ${score.accuracy}%`}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-mono text-muted">Round {round} / {TOTAL_ROUNDS}</div>
                    <div className="text-xl font-mono text-white">Score: {sessionScore}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
                {/* TARGET VIEW (Hidden during solve) */}
                <GlassCard className="h-[300px] flex items-center justify-center relative overflow-hidden">
                    {phase === 'memorize' || phase === 'result' ? (
                        <>
                            <div className="absolute top-2 left-2 text-xs font-bold text-secondary uppercase tracking-widest">
                                Target
                            </div>
                            <Canvas camera={{ position: [0, 0, 4] }}>
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} />
                                {/* Float ENABLED only during Memorize, DISABLED during Result for static comparison? 
                                    Actually user said 'camera tad off'. If Float moves it, it IS off compared to static.
                                    Let's disable float for high accuracy tasks, or keep it very subtle.
                                    Better: Disable Float. Static target is less confusing for V1.
                                */}
                                {/* <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}> */}
                                <PuzzleShape
                                    type={shapeType}
                                    rotation={targetRotation}
                                    color="#06b6d4" // Cyan
                                    isTarget
                                />
                                {/* </Float> */}
                            </Canvas>
                            {phase === 'memorize' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-6xl font-black text-white/20 animate-pulse">
                                        {timeLeft}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted">
                            <BoxSelect className="w-12 h-12 opacity-20" />
                        </div>
                    )}
                </GlassCard>

                {/* USER VIEW (Interactive) */}
                <GlassCard
                    className={cn(
                        "h-[300px] flex items-center justify-center relative overflow-hidden transition-colors border",
                        isDragging ? "border-primary bg-white/10" : "border-white/10"
                    )}
                    // Pointer Events for Dragging
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    style={{ touchAction: 'none' }} // Prevent scrolling on mobile
                >
                    <div className="absolute top-2 left-2 text-xs font-bold text-primary uppercase tracking-widest">
                        Your Rotation
                    </div>
                    {phase === 'solve' && !isDragging && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white/20 animate-pulse">
                            <RefreshCw className="w-8 h-8 mx-auto mb-2" />
                            <span className="text-xs uppercase tracking-widest font-bold">Drag to Rotate</span>
                        </div>
                    )}

                    <Canvas camera={{ position: [0, 0, 4] }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <PuzzleShape
                            type={shapeType}
                            rotation={userRotation}
                            color="#fff"
                        />
                        {/* Remove OrbitControls - we handle rotation manually */}
                    </Canvas>

                    {/* ROTATION CONTROLS OVERLAY - Optional / Backup */}
                    {phase === 'solve' && (
                        <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-none opacity-50">
                            <span className="text-[10px] text-muted">SNAP ON RELEASE</span>
                        </div>
                    )}
                </GlassCard>
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-4">
                {phase === 'solve' && (
                    <PulseButton onClick={handleSubmit} className="px-12">
                        SUBMIT MATCH
                    </PulseButton>
                )}
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
        </div>
    );
};
