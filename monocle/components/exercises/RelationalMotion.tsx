'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text } from '@react-three/drei';
import { GlassCard } from '@/components/ui/GlassCard';
import { PulseButton } from '@/components/ui/PulseButton';
import { generateScenario, MotionScenario } from '@/lib/visuals/MotionLogic';
import { Eye, Play, Crosshair, RefreshCw, CheckCircle } from 'lucide-react';
import * as THREE from 'three';
import { SessionSummary } from "@/components/ui/SessionSummary";

// --- SCENE COMPONENTS ---

const MovingBall = React.forwardRef<THREE.Mesh, {
    scenario: MotionScenario,
    isPlaying: boolean,
    onOccluded: (hidden: boolean) => void,
    onComplete: () => void
}>(({ scenario, isPlaying, onOccluded, onComplete }, ref) => {
    // Internal ref fallback
    const internalRef = useRef<THREE.Mesh>(null);
    const meshRef = (ref as React.RefObject<THREE.Mesh>) || internalRef;

    const startX = scenario.direction === 'left-to-right' ? -6 : 6;
    const endDirection = scenario.direction === 'left-to-right' ? 1 : -1;

    useFrame((state, delta) => {
        if (!isPlaying || !meshRef.current) return;

        // Linear Motion
        const newX = meshRef.current.position.x + (scenario.speed * delta * endDirection);
        meshRef.current.position.set(newX, 0, 0);

        // Check for occlusion
        const halfOcc = scenario.occluderWidth / 2;
        const isHidden = (newX > -halfOcc) && (newX < halfOcc);
        onOccluded(isHidden);

        // Check bounds
        if (Math.abs(newX) > 8) {
            onComplete();
        }
    });

    // Reset logic
    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.position.set(startX, 0, 0);
        }
    }, [scenario]);

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial
                color="#00F2FF"
                emissive="#00F2FF"
                emissiveIntensity={0.5}
                toneMapped={false}
            />
        </mesh>
    );
});
MovingBall.displayName = "MovingBall";

const Occluder = ({ width, isRevealed }: { width: number, isRevealed: boolean }) => {
    return (
        <mesh position={[0, 0, 0.5]}>
            <boxGeometry args={[width, 2, 0.1]} />
            <meshStandardMaterial
                color="#121212"
                metalness={0.1}
                roughness={0.9}
                transparent={true}
                opacity={isRevealed ? 0.1 : 1.0}
            />
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(width, 2, 0.1)]} />
                <lineBasicMaterial color="#333" />
            </lineSegments>
        </mesh>
    );
};

// --- CLICKABLE PLANE ---
const InteractivePlane = ({ onGuess }: { onGuess: (x: number) => void }) => {
    return (
        <mesh
            position={[0, 0, 0.1]}
            onClick={(e) => {
                e.stopPropagation();
                onGuess(e.point.x);
            }}
            visible={false} // Invisible but clickable
        >
            <planeGeometry args={[10, 5]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    );
};

// --- SCORING HELPERS ---
const getScoreComment = (diff: number) => {
    if (diff < 0.3) return "Spot On! 🎯";
    if (diff < 0.8) return "Very Close. 👏";
    if (diff < 1.5) return "Good Area. 👍";
    return "Missed it. 😅";
}

// --- MAIN WRAPPER ---
export const RelationalMotion = () => {
    const [scenario, setScenario] = useState<MotionScenario | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isOccluded, setIsOccluded] = useState(false);

    // Guessing
    const [guessedX, setGuessedX] = useState<number | null>(null);
    const [actualX, setActualX] = useState<number | null>(null);
    const [scoreMode, setScoreMode] = useState<{ diff: number, score: number } | null>(null);

    const ballRef = useRef<THREE.Mesh>(null);

    // Session
    const [round, setRound] = useState(1);
    const [sessionScore, setSessionScore] = useState(0);
    const TOTAL_ROUNDS = 5;

    const [phase, setPhase] = useState<'init' | 'moving' | 'guessing' | 'result' | 'summary'>('init');

    useEffect(() => { newScenario(); }, []);

    const newScenario = () => {
        setScenario(generateScenario(round));
        setPhase('init');
        setIsPlaying(false);
        setIsOccluded(false);
        setGuessedX(null);
        setActualX(null);
        setScoreMode(null);
    };

    const handleStart = () => {
        setPhase('moving');
        setIsPlaying(true);
        setGuessedX(null);
        setActualX(null);
        setScoreMode(null);

        if (!scenario) return;

        // Linear calculation
        const width = scenario.occluderWidth;
        const delay = (6 / scenario.speed) * 1000 + (Math.random() * 1000);

        setTimeout(() => {
            setIsPlaying(false);
            setPhase('guessing');
        }, delay);
    };

    const handleGuess = (x: number) => {
        setGuessedX(x);

        if (ballRef.current) {
            const trueX = ballRef.current.position.x;
            setActualX(trueX);

            const diff = Math.abs(trueX - x);
            const accuracy = Math.max(0, 100 - (diff * 20));

            setScoreMode({
                diff: diff,
                score: Math.round(accuracy)
            });
            setSessionScore(s => s + accuracy);
        }
        setPhase('result');
    };

    const handleNext = () => {
        if (round < TOTAL_ROUNDS) {
            setRound(r => r + 1);
            newScenario();
        } else {
            setPhase('summary');
        }
    };

    const handleRestart = () => {
        setRound(1);
        setSessionScore(0);
        newScenario();
    };

    if (phase === 'summary') {
        const accuracy = Math.round(sessionScore / TOTAL_ROUNDS);
        return (
            <SessionSummary
                title="Relational Motion"
                accuracy={accuracy}
                totalQuestions={TOTAL_ROUNDS}
                xpEarned={Math.round(sessionScore / 5)}
                skillsTrained={['visual', 'cognitive', 'focus']}
                onRestart={handleRestart}
            />
        );
    }

    if (!scenario) return null;

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            {/* HUD */}
            <div className="w-full flex justify-between items-center mb-8 px-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Object Permanence</h2>
                    <p className="text-sm text-muted">
                        {phase === 'init' && "Press Play to start the ball."}
                        {phase === 'moving' && "Track the ball..."}
                        {phase === 'guessing' && "CLICK where the ball is hidden."}
                        {phase === 'result' && scoreMode ? `${getScoreComment(scoreMode.diff)}` : "Did you track it?"}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-mono text-muted">Round {round} / {TOTAL_ROUNDS}</div>
                    <div className="text-sm font-mono text-white">Avg: {Math.round(sessionScore / round)}%</div>
                </div>
            </div>

            <GlassCard className="w-full h-[400px] mb-8 relative flex items-center justify-center overflow-hidden">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />

                    <MovingBall
                        ref={ballRef}
                        scenario={scenario}
                        isPlaying={isPlaying}
                        onOccluded={setIsOccluded}
                        onComplete={() => { }}
                    />

                    <Occluder width={scenario.occluderWidth} isRevealed={phase === 'result'} />

                    {/* Interaction Plane */}
                    {phase === 'guessing' && (
                        <InteractivePlane onGuess={handleGuess} />
                    )}

                    {/* Visual Feedback */}
                    {phase === 'result' && guessedX !== null && (
                        <>
                            {/* Guessed Location Ghost */}
                            <mesh position={[guessedX, 0, 0]}>
                                <sphereGeometry args={[0.4, 32, 32]} />
                                <meshStandardMaterial color="#FF0000" wireframe transparent opacity={0.5} />
                            </mesh>
                            {/* Connect line */}
                            {actualX !== null && (
                                <line>
                                    <bufferGeometry attach="geometry" onUpdate={geo => {
                                        geo.setFromPoints([
                                            new THREE.Vector3(guessedX, 0, 0),
                                            new THREE.Vector3(actualX, 0, 0)
                                        ])
                                    }} />
                                    <lineBasicMaterial attach="material" color="white" opacity={0.5} transparent />
                                </line>
                            )}
                        </>
                    )}
                </Canvas>

                {phase === 'guessing' && (
                    <div className="absolute inset-x-0 top-10 flex justify-center pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <span className="text-white font-bold animate-pulse">Click the hidden ball</span>
                        </div>
                    </div>
                )}
            </GlassCard>

            {phase === 'init' && (
                <PulseButton onClick={handleStart} className="px-8 flex gap-2">
                    <Play className="w-4 h-4" /> START MOTION
                </PulseButton>
            )}

            {phase === 'result' && (
                <PulseButton onClick={handleNext} className="px-8 flex gap-2">
                    {round < TOTAL_ROUNDS ? (
                        <><RefreshCw className="w-4 h-4" /> NEXT ROUND</>
                    ) : (
                        <><CheckCircle className="w-4 h-4" /> FINISH SESSION</>
                    )}
                </PulseButton>
            )}
        </div>
    );
};
