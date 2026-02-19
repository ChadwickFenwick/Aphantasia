'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PositionalAudio, PerspectiveCamera, OrbitControls, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { PulseButton } from '@/components/ui/PulseButton';
import { Radar, Volume2, Trophy, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/lib/store';

// --- GAME LOGIC ---

interface EchoProps {
    onWin: () => void;
    onSignal: (strength: number) => void;
}

const EchoScene = ({ onWin, onSignal }: EchoProps) => {
    const { camera } = useThree();
    const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, 0, -5));
    const [scanned, setScanned] = useState(false);
    const audioRef = useRef<THREE.PositionalAudio>(null);
    const [lastScanResult, setLastScanResult] = useState<'hit' | 'miss' | null>(null);

    // Initial Setup
    useEffect(() => {
        randomizeTarget();
        camera.position.set(0, 0, 0.1);

        const ctx = THREE.AudioContext.getContext();
        if (ctx.state === 'suspended') ctx.resume();

        // Audio Chain Init
        setTimeout(() => {
            if (audioRef.current) {
                const buffer = createPingBuffer(ctx, 1200);
                audioRef.current.setBuffer(buffer);
                audioRef.current.setRefDistance(1);
            }
        }, 100);
    }, []);

    const createPingBuffer = (ctx: AudioContext, baseFreq: number) => {
        const buffer = ctx.createBuffer(1, 44100 * 0.2, 44100);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            const t = i / 44100;
            const freq = baseFreq - (t * 2000);
            data[i] = Math.sin(t * freq * Math.PI * 2) * Math.exp(-t * 15);
        }
        return buffer;
    };

    const randomizeTarget = () => {
        const r = 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        setTargetPos(new THREE.Vector3(x, y, z));
        setScanned(false);
        setLastScanResult(null);
    };

    const getAngleToTarget = () => {
        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);
        const targetDir = targetPos.clone().normalize();
        return camDir.angleTo(targetDir); // Radians
    };

    const triggerPing = () => {
        if (audioRef.current) {
            const angle = getAngleToTarget();
            const deg = THREE.MathUtils.radToDeg(angle);
            const ctx = audioRef.current.context;

            // CALCULATE SIGNAL STRENGTH (0 to 1)
            // 0 degrees = 1.0 (Direct hit)
            // 180 degrees = 0.0 (Behind)
            const strength = Math.max(0, 1 - (deg / 180));
            onSignal(strength);

            // AUDIO CUES
            // If behind (>90 deg), muffle the sound (lower frequency content)
            const muffle = deg > 90;
            const baseFreq = muffle ? 600 : 1200;

            const buffer = createPingBuffer(ctx, baseFreq);
            audioRef.current.setBuffer(buffer);

            if (audioRef.current.isPlaying) audioRef.current.stop();
            audioRef.current.play();
        }
    };

    const scan = () => {
        const angle = getAngleToTarget();
        const threshold = THREE.MathUtils.degToRad(20);

        if (angle < threshold) {
            setScanned(true);
            setLastScanResult('hit');
            setTimeout(() => {
                onWin();
                randomizeTarget();
            }, 1000);
        } else {
            setLastScanResult('miss');
            setTimeout(() => setLastScanResult(null), 500);
        }
    };

    // Input Listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') scan();
            if (e.code === 'KeyP') triggerPing();
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0) triggerPing(); // Left Click
            if (e.button === 2) scan(); // Right Click
        };

        const handleContextMenu = (e: MouseEvent) => e.preventDefault();

        window.addEventListener('keydown', handleKeyDown);
        // Bind to window for simplicity, or we could ref the canvas container
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [targetPos]);

    return (
        <group>
            {lastScanResult === 'miss' && (
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshBasicMaterial color="red" wireframe transparent opacity={0.5} />
                </mesh>
            )}

            <mesh position={targetPos} visible={scanned}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#00F2FF" emissive="#00F2FF" emissiveIntensity={2} wireframe />
                <PositionalAudio
                    ref={audioRef}
                    url="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
                    loop={false}
                />
            </mesh>

            {scanned && (
                <Line
                    points={[[0, 0, 0], [targetPos.x, targetPos.y, targetPos.z]]}
                    color="#00F2FF"
                    opacity={0.5}
                    transparent
                    lineWidth={1}
                />
            )}

            {scanned && (
                <mesh>
                    <boxGeometry args={[30, 30, 30]} />
                    <meshBasicMaterial color="#333" wireframe />
                </mesh>
            )}
        </group>
    );
};

export const EchoCanvas = () => {
    const { addXP } = useUserStore();
    const [score, setScore] = useState(0);
    const [audioStarted, setAudioStarted] = useState(false);
    const [signal, setSignal] = useState(0);

    const handleWin = () => {
        setScore(s => s + 1);
        addXP(25);
    };

    const handleSignal = (strength: number) => {
        setSignal(strength);
        // Decay signal UI
        setTimeout(() => setSignal(0), 1000);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-[600px] relative">

            <div className="w-full h-full bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl relative cursor-crosshair">

                {!audioStarted && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                        <PulseButton onClick={() => setAudioStarted(true)} className="px-8 py-4 text-xl">
                            <Play className="w-6 h-6 mr-2" /> Start Audio Engine
                        </PulseButton>
                        <p className="mt-4 text-muted text-sm">Headphones Required for 3D Audio</p>
                    </div>
                )}

                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 0.1]} />
                    <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.5} target={[0, 0, 0]} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <gridHelper args={[100, 50, 0x222222, 0x111111]} position={[0, -10, 0]} />
                    {audioStarted && <EchoScene onWin={handleWin} onSignal={handleSignal} />}
                    <ambientLight intensity={0.2} />
                </Canvas>

                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8">

                    {/* Top Stats */}
                    <div className="flex justify-between w-full max-w-2xl">
                        <div className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/10">
                            <Trophy className="w-4 h-4 text-primary" />
                            <span className="font-mono text-primary">{score}</span>
                        </div>

                        {/* SIGNAL METER */}
                        <div className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/10 w-32">
                            <Radar className={cn("w-4 h-4", signal > 0.8 ? "text-green-500" : "text-muted")} />
                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300 ease-out"
                                    style={{ width: `${signal * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Center Reticle */}
                    <div className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-full flex items-center justify-center transition-all duration-300",
                        signal > 0.8 ? "w-16 h-16 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "w-12 h-12 border-white/20"
                    )}>
                        <div className={cn(
                            "rounded-full transition-all duration-300",
                            signal > 0.8 ? "w-2 h-2 bg-green-500" : "w-1 h-1 bg-white/50"
                        )} />
                    </div>

                    {/* Bottom Controls */}
                    <div className="text-center bg-black/60 p-4 rounded-xl backdrop-blur-md border border-white/5">
                        <p className="text-sm text-white mb-2 font-mono">
                            <span className="text-primary">[L-CLICK]</span> PING &nbsp;|&nbsp; <span className="text-primary">[R-CLICK]</span> SCAN
                        </p>
                        <p className="text-xs text-muted">
                            Signal Strength indicator shows proximity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
