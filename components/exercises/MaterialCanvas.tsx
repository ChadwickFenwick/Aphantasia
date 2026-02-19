'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrthographicCamera, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { PulseButton } from '@/components/ui/PulseButton';
import { MousePointer2, Volume2, HelpCircle, Eye, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/lib/store';

// --- SHAPES ---
const SHAPES = [
    { id: 'circle', label: 'Circle' },
    { id: 'square', label: 'Square' },
    { id: 'triangle', label: 'Triangle' },
    { id: 'diamond', label: 'Diamond' },
];

const InvisibleScene = ({
    targetShape,
    onHoverChange
}: {
    targetShape: string,
    onHoverChange: (isHovering: boolean, speed: number) => void
}) => {
    const { mouse, viewport } = useThree();
    const meshRef = useRef<THREE.Mesh>(null);
    const lastPos = useRef(new THREE.Vector2());
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        // Calculate speed of mouse movement
        const currentPos = mouse.clone();
        const dist = currentPos.distanceTo(lastPos.current);
        const speed = dist / delta; // Units per second
        lastPos.current.copy(currentPos);

        onHoverChange(hovered, speed);
    });

    // Geometry Switcher
    const Geometry = useMemo(() => {
        switch (targetShape) {
            case 'circle': return <circleGeometry args={[2, 64]} />;
            case 'square': return <planeGeometry args={[3.5, 3.5]} />;
            case 'triangle': return <circleGeometry args={[2.5, 3]} />; // Triangle is just low res circle
            case 'diamond': return <circleGeometry args={[2.5, 4]} />;
            default: return <planeGeometry args={[3, 3]} />;
        }
    }, [targetShape]);

    return (
        <mesh
            ref={meshRef}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            visible={false} // The Core Mechanic: It's invisible!
        >
            {Geometry}
            <meshBasicMaterial color="white" />
        </mesh>
    );
};

export const MaterialCanvas = () => { // Keeping component name to avoid file churn, but logic is Surface Scanner
    const { addXP } = useUserStore();

    // Game State
    const [isPlaying, setIsPlaying] = useState(false);
    const [targetShape, setTargetShape] = useState('circle');
    const [revealed, setRevealed] = useState(false);
    const [score, setScore] = useState(0);

    // Audio Refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const filterNodeRef = useRef<BiquadFilterNode | null>(null);

    useEffect(() => {
        // Cleanup off
        return () => {
            stopAudio();
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        // Create White Noise Buffer
        const bufferSize = ctx.sampleRate * 2; // 2 seconds
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        // Nodes
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        const gain = ctx.createGain();
        gain.gain.value = 0;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();

        noiseNodeRef.current = noise;
        filterNodeRef.current = filter;
        gainNodeRef.current = gain;
    };

    const stopAudio = () => {
        if (noiseNodeRef.current) {
            try { noiseNodeRef.current.stop(); } catch (e) { }
            noiseNodeRef.current = null;
        }
    };

    const startGame = () => {
        if (!audioCtxRef.current) initAudio();
        // Pick new shape
        const next = SHAPES[Math.floor(Math.random() * SHAPES.length)].id;
        setTargetShape(next);
        setRevealed(false);
        setIsPlaying(true);
    };

    const handleHoverChange = (isHovering: boolean, speed: number) => {
        if (!gainNodeRef.current || !filterNodeRef.current || revealed) return;

        // Physics of "Rubbing"
        // Volume = Base presence (if hovering)
        // Pitch/Filter = Speed (faster = brighter sound)

        if (isHovering) {
            // Smooth ramp up
            gainNodeRef.current.gain.setTargetAtTime(0.3, audioCtxRef.current!.currentTime, 0.05); // Base volume

            // Map speed (0 to ~10?) to Filter Freq (100Hz to 5000Hz)
            const cutoff = Math.min(5000, 100 + (speed * 1000));
            filterNodeRef.current.frequency.setTargetAtTime(cutoff, audioCtxRef.current!.currentTime, 0.1);
        } else {
            // Silence
            gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current!.currentTime, 0.05);
        }
    };

    const handleGuess = (shapeId: string) => {
        setRevealed(true);
        // Stop sound layer
        if (gainNodeRef.current && audioCtxRef.current) {
            gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
        }

        if (shapeId === targetShape) {
            setScore(s => s + 1);
            addXP(30);
        }
    };

    return (
        <div className="flex gap-8 w-full max-w-6xl mx-auto h-[600px]">

            {/* VIEWPORT */}
            <div className="flex-1 bg-black rounded-xl border border-white/10 shadow-2xl relative overflow-hidden group">

                {!isPlaying ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50">
                        <PulseButton onClick={startGame} className="px-8 py-4 text-xl">
                            <MousePointer2 className="w-6 h-6 mr-2" /> Start Surface Scannner
                        </PulseButton>
                        <p className="mt-4 text-muted text-sm">Headphones + Mouse Required</p>
                    </div>
                ) : (
                    <>
                        <Canvas>
                            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />

                            <InvisibleScene
                                targetShape={targetShape}
                                onHoverChange={handleHoverChange}
                            />

                            {/* Reveal Layer */}
                            {revealed && (
                                <mesh visible={true}>
                                    {targetShape === 'circle' && <circleGeometry args={[2, 64]} />}
                                    {targetShape === 'square' && <planeGeometry args={[3.5, 3.5]} />}
                                    {targetShape === 'triangle' && <circleGeometry args={[2.5, 3]} />}
                                    {targetShape === 'diamond' && <circleGeometry args={[2.5, 4]} />}
                                    <meshBasicMaterial color="#00F2FF" wireframe />
                                </mesh>
                            )}
                        </Canvas>

                        {/* Custom Cursor (Visual Feedback of position, but not shape) */}
                        <div
                            className="bg-white/50 w-2 h-2 rounded-full absolute pointer-events-none mix-blend-difference"
                            style={{
                                left: 0, top: 0,
                                transform: 'translate(-50%, -50%)',
                                // We'd need to track mouse DOM position here relative to container for a custom cursor div
                                // actually, easier to just let system cursor be visible or use css cursor: crosshair
                            }}
                        />
                    </>
                )}

                {/* Status HUD */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono text-primary uppercase">Audio Feedback Active</span>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="w-64 flex flex-col gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" /> Identify Shape
                    </h3>
                    <p className="text-xs text-muted mb-4">
                        Rub your cursor over the void. The sound changes when you touch the object. Trace the edges.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        {SHAPES.map(s => (
                            <button
                                key={s.id}
                                onClick={() => handleGuess(s.id)}
                                disabled={!isPlaying || revealed}
                                className={cn(
                                    "p-3 rounded-lg border text-sm font-mono transition-all",
                                    revealed && s.id === targetShape ? "bg-green-500/20 border-green-500 text-green-500" :
                                        revealed && s.id !== targetShape ? "bg-white/5 border-white/5 text-muted opacity-50" :
                                            "bg-black hover:bg-white/10 border-white/10 text-white hover:border-white/30"
                                )}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {revealed && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            <span className="font-bold text-white">Round Complete</span>
                        </div>
                        <PulseButton onClick={startGame} className="w-full">
                            Next Shape
                        </PulseButton>
                    </div>
                )}
            </div>

        </div>
    );
};
