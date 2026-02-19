'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PulseButton } from '@/components/ui/PulseButton';
import { RefreshCw, Play, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';
import { calculateAccuracy } from '@/lib/visuals/DrawingLogic';

// --- SHAPES DATA ---
// Simple SVG path data for shapes
const SHAPES = [
    { id: 'circle', name: 'Circle', path: 'M 50, 10 a 40,40 0 1,0 1,0 z', viewBox: '0 0 100 100' },
    { id: 'square', name: 'Square', path: 'M 10,10 H 90 V 90 H 10 Z', viewBox: '0 0 100 100' },
    { id: 'triangle', name: 'Triangle', path: 'M 50,10 L 90,90 H 10 Z', viewBox: '0 0 100 100' },
    { id: 'star', name: 'Star', path: 'M 50,10 L 61,35 L 88,38 L 68,56 L 74,83 L 50,70 L 26,83 L 32,56 L 12,38 L 39,35 Z', viewBox: '0 0 100 100' }
];

import { SessionSummary } from "@/components/ui/SessionSummary";

// --- MAIN COMPONENT ---
export const DrawingCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [path, setPath] = useState<{ x: number; y: number }[]>([]);
    const [currentShape, setCurrentShape] = useState(SHAPES[0]);
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);

    // phases: 'observe', 'draw', 'result', 'summary'
    const [phase, setPhase] = useState<'observe' | 'draw' | 'result' | 'summary'>('observe');
    const [timeLeft, setTimeLeft] = useState(5);
    const [score, setScore] = useState(0);

    // Session State
    const [startTime] = useState(Date.now());
    const [shapesCompleted, setShapesCompleted] = useState(0);

    const { width, height } = useWindowSize(); // Optional hook for responsiveness

    // Timer for Observe Phase
    useEffect(() => {
        if (phase === 'observe') {
            if (timeLeft > 0) {
                const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setPhase('draw');
                setTimeLeft(0);
            }
        }
    }, [phase, timeLeft]);

    // Handle Resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
    }, [width, height]);


    const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (phase !== 'draw') return;
        setIsDrawing(true);
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPath([{ x, y }]);
    };

    const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing || phase !== 'draw') return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPath((prev) => [...prev, { x, y }]);

        // Draw on canvas immediately
        const ctx = canvasRef.current!.getContext('2d');
        if (ctx) {
            ctx.strokeStyle = '#00F2FF'; // Primary color
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const endDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
    };

    const reset = () => {
        setPath([]);
        const nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        setCurrentShape(nextShape);

        // Randomize
        setRotation(Math.floor(Math.random() * 360));
        setScale(0.5 + Math.random() * 0.4); // 0.5x to 0.9x (Safe range to prevent clipping)

        setPhase('observe');
        setTimeLeft(5);
        setScore(0);

        // Clear Canvas
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.beginPath(); // Reset paths
        }
    };

    const calculateScore = () => {
        if (!canvasRef.current) return;

        // Calculate real accuracy
        // We need to pass the current drawing state and target
        const accuracy = calculateAccuracy(
            canvasRef.current,
            currentShape.path,
            rotation,
            scale,
            currentShape.viewBox
        );

        setScore(accuracy);
        setPhase('result');
        setShapesCompleted(c => c + 1);
    };

    const handleFinishSession = () => {
        setPhase('summary');
    };

    if (phase === 'summary') {
        const durationMs = Date.now() - startTime;
        const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
        const xp = durationMinutes * 10 + (shapesCompleted * 5); // 10 XP/min + 5 XP/shape

        const durationStr = `${Math.floor(durationMs / 60000)}m ${Math.floor((durationMs % 60000) / 1000)}s`;

        return (
            <SessionSummary
                title="Blind Drawing"
                xpEarned={xp}
                duration={durationStr}
                score={shapesCompleted} // Re-purposing score as count
                totalQuestions={shapesCompleted} // Hide "out of" by making them equal? Or just custom Text?
                skillsTrained={['visual', 'somatic']}
                onRestart={() => window.location.reload()} // Easy restart
            />
        );
    }

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto h-full">
            {/* INSTRUCTIONS / HUD */}
            <div className="mb-4 text-center">
                {phase === 'observe' && <p className="text-secondary font-bold text-xl animate-pulse">Memorize the shape... {timeLeft}s</p>}
                {phase === 'draw' && <p className="text-primary font-bold text-xl">Trace it from memory!</p>}
                {phase === 'result' && <p className="text-white font-bold text-xl">Accuracy: {score}%</p>}
            </div>

            {/* CANVAS CONTAINER */}
            <div className="relative w-full aspect-square bg-white/5 rounded-xl overflow-hidden border border-white/10 touch-none">

                {/* GHOST SHAPE (Target) */}
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center p-12 pointer-events-none transition-opacity duration-500",
                        phase === 'draw' ? "opacity-0" : "opacity-50" // Hide during draw, show during observe/result
                    )}
                >
                    {/* We use an SVG here that scales to the container */}
                    <svg
                        viewBox={currentShape.viewBox}
                        className="w-full h-full stroke-secondary fill-none stroke-[2px] opacity-100 drop-shadow-[0_0_10px_rgba(112,0,255,0.8)] transition-all duration-500"
                        style={{
                            transform: `rotate(${rotation}deg) scale(${scale})`
                        }}
                    >
                        <path d={currentShape.path} />
                    </svg>
                </div>

                {/* USER DRAWING CANVAS */}
                <canvas
                    ref={canvasRef}
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={endDrawing}
                    onPointerLeave={endDrawing}
                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                    style={{ opacity: phase === 'observe' ? 0.1 : 1 }} // Dim existing drawing during observe? No, clear it.
                />

            </div>

            {/* CONTROLS */}
            <div className="mt-8 flex gap-4">
                {phase === 'draw' && (
                    <PulseButton onClick={calculateScore} className="px-8 bg-primary text-black hover:bg-white">
                        <Eye className="w-4 h-4 mr-2" /> REVEAL
                    </PulseButton>
                )}
                {phase === 'result' && (
                    <>
                        <PulseButton onClick={reset} className="px-8 flex gap-2">
                            <RefreshCw className="w-4 h-4" /> NEXT SHAPE
                        </PulseButton>
                        <button onClick={handleFinishSession} className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-muted hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                            Finish Session
                        </button>
                    </>
                )}
                {phase === 'observe' && (
                    <div className="text-sm text-muted animate-pulse">Wait for the screen to go dark...</div>
                )}
            </div>
        </div>
    );
};
