'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PulseButton } from '@/components/ui/PulseButton';
import { RefreshCw, Zap, Eye, Settings2, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- DATA ---
const SHAPES = [
    { id: 'red-circle', color: '#ef4444', shape: 'circle' },
    { id: 'blue-square', color: '#3b82f6', shape: 'square' },
    { id: 'green-triangle', color: '#22c55e', shape: 'triangle' },
    { id: 'yellow-star', color: '#eab308', shape: 'star' },
    { id: 'cyan-diamond', color: '#06b6d4', shape: 'diamond' },
    { id: 'magenta-ring', color: '#d946ef', shape: 'ring' },
];

import { GLIMPSE_ASSETS, GlimpseAssetType } from './GlimpseAssets';

export const FlashCanvas = () => {
    // Original State
    const [phase, setPhase] = useState<'idle' | 'flash' | 'retain'>('idle');
    const [currentShape, setCurrentShape] = useState(SHAPES[0]);
    const [currentAsset, setCurrentAsset] = useState(GLIMPSE_ASSETS[0]);
    const [mode, setMode] = useState<'shape' | 'image'>('shape');

    const [duration, setDuration] = useState(250); // ms
    const [showWall, setShowWall] = useState(true); // Simulate wall texture?

    // New State for Continuous Mode
    const [isContinuous, setIsContinuous] = useState(false);
    const [interval, setInterval] = useState(5000); // 5s default
    const [isRunning, setIsRunning] = useState(false);

    // Fullscreen State
    const [isFullscreen, setIsFullscreen] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);

    const timeoutRef = useRef<NodeJS.Timeout>(null);
    const intervalRef = useRef<NodeJS.Timeout>(null);

    // Refs for Loop State to avoid stale closures
    const isRunningRef = useRef(isRunning);
    const isContinuousRef = useRef(isContinuous);
    const intervalValRef = useRef(interval);

    useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
    useEffect(() => { isContinuousRef.current = isContinuous; }, [isContinuous]);
    useEffect(() => { intervalValRef.current = interval; }, [interval]);

    // Handle Fullscreen Change
    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    const toggleFullscreen = () => {
        if (!viewportRef.current) return;
        if (!document.fullscreenElement) {
            viewportRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const triggerFlash = () => {
        // 1. Pick random content based on mode
        if (mode === 'shape') {
            const next = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            setCurrentShape(next);
        } else {
            const next = GLIMPSE_ASSETS[Math.floor(Math.random() * GLIMPSE_ASSETS.length)];
            setCurrentAsset(next);
        }

        // 2. Start Flash
        setPhase('flash');

        // 3. Schedule End of Flash
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setPhase('retain');

            // 4. Schedule Next Flash if Continuous
            if (isContinuousRef.current && isRunningRef.current) {
                if (intervalRef.current) clearTimeout(intervalRef.current);
                intervalRef.current = setTimeout(() => {
                    // Only trigger if still running
                    if (isRunningRef.current) {
                        triggerFlash();
                    }
                }, intervalValRef.current);
            }
        }, duration);
    };

    const handleStart = () => {
        // Explicitly set running state
        setIsRunning(true);
        // Force ref update immediately for this sync execution (optional, but safe)
        isRunningRef.current = true;

        triggerFlash();
    };

    const handleStop = () => {
        setIsRunning(false);
        isRunningRef.current = false; // Stop immediately
        setPhase('idle');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearTimeout(intervalRef.current);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, []);

    // ... renderShape ...
    const renderShape = () => {
        // Hande Image Mode
        if (mode === 'image') {
            const Component = currentAsset.component;
            const sizeClass = isFullscreen ? "w-96 h-96" : "w-64 h-64";
            return <Component className={sizeClass} color={currentAsset.color} />;
        }

        const style = { backgroundColor: currentShape.color };
        // Scale up in fullscreen
        const sizeClass = isFullscreen ? "w-96 h-96" : "w-48 h-48";

        switch (currentShape.shape) {
            case 'circle': return <div className={`${sizeClass} rounded-full`} style={style} />;
            case 'square': return <div className={sizeClass} style={style} />;
            case 'triangle': return <div className="w-0 h-0 border-l-[100px] border-l-transparent border-r-[100px] border-r-transparent border-b-[170px]" style={{ borderBottomColor: currentShape.color, transform: isFullscreen ? 'scale(2)' : 'scale(1)' }} />;
            case 'diamond': return <div className={`${isFullscreen ? 'w-64 h-64' : 'w-32 h-32'} rotate-45`} style={style} />;
            case 'ring': return <div className={`${sizeClass} rounded-full border-[20px]`} style={{ borderColor: currentShape.color }} />;
            case 'star': return (
                <svg viewBox="0 0 100 100" className={sizeClass} style={{ fill: currentShape.color }}>
                    <path d="M 50,10 L 61,35 L 88,38 L 68,56 L 74,83 L 50,70 L 26,83 L 32,56 L 12,38 L 39,35 Z" />
                </svg>
            );
            default: return null;
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto h-full">
            {/* VIEWPORT */}
            <div
                ref={viewportRef}
                className={cn(
                    "relative w-full bg-black overflow-hidden border border-white/10 shadow-2xl transition-all duration-500",
                    isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen border-0" : "aspect-video rounded-xl"
                )}
            >
                {/* Fullscreen Toggle */}
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>

                {/* 1. IDLE STATE */}
                {phase === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted text-lg animate-pulse">
                            {isContinuous ? "Continuous Mode Ready..." : "Ready..."}
                        </p>
                    </div>
                )}

                {/* 2. FLASH STATE */}
                {phase === 'flash' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        {renderShape()}
                    </div>
                )}

                {/* 3. RETAIN STATE (WALL MODE) */}
                {phase === 'retain' && (
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center transition-all duration-75",
                        showWall ? "bg-[#e5e5e5]" : "bg-black" // Wall color (light grey) or Void
                    )}>
                        {showWall && (
                            // Subtle texture for "Wall"
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")' }}></div>
                        )}
                        {/* Center marker to help fixation? Optional. */}
                        <div className="w-1 h-1 bg-black/10 rounded-full" />

                        {isContinuous && isRunning && (
                            <div className="absolute bottom-4 right-4">
                                <span className="text-xs font-mono text-black/50 animate-pulse">NEXT FLASH SOON...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* CONTROLS */}
            <div className="mt-8 flex flex-col gap-4 items-center w-full">

                {/* Main Action */}
                {!isRunning ? (
                    <PulseButton onClick={handleStart} className="px-12 py-6 text-xl bg-primary text-black hover:bg-white tracking-widest">
                        <Zap className="w-6 h-6 mr-2" /> {isContinuous ? "START LOOP" : "FLASH"}
                    </PulseButton>
                ) : (
                    <PulseButton onClick={handleStop} className="px-12 py-6 text-xl bg-red-500/20 hover:bg-red-500/30 text-red-500 tracking-widest animate-pulse border-red-500/50 border">
                        <RefreshCw className="w-6 h-6 mr-2" /> STOP LOOP
                    </PulseButton>
                )}

                {/* Reset Button (Only if not running and not idle) */}
                {!isRunning && phase !== 'idle' && (
                    <button onClick={() => setPhase('idle')} className="text-xs text-muted hover:text-white uppercase tracking-widest">
                        Reset
                    </button>
                )}

                {/* Settings */}
                <div className="flex flex-col gap-4 mt-4 p-4 bg-white/5 rounded-lg border border-white/5 w-full">

                    {/* Content Mode Toggle (IMage vs Shape) */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Eye className="w-4 h-4 text-muted" />
                            <span className="text-sm text-muted uppercase tracking-wider">Stimulus:</span>
                        </div>
                        <div className="flex bg-black/40 rounded-lg p-1">
                            <button
                                onClick={() => setMode('shape')}
                                className={cn("px-3 py-1 text-xs rounded-md transition-all", mode === 'shape' ? "bg-primary text-black" : "text-muted hover:text-white")}
                            >
                                Shapes
                            </button>
                            <button
                                onClick={() => setMode('image')}
                                className={cn("px-3 py-1 text-xs rounded-md transition-all", mode === 'image' ? "bg-secondary text-white" : "text-muted hover:text-white")}
                            >
                                Images (+3)
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/5" />

                    {/* Loop Mode Toggles */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Settings2 className="w-4 h-4 text-muted" />
                            <span className="text-sm text-muted uppercase tracking-wider">Loop:</span>
                        </div>

                        <div className="flex bg-black/40 rounded-lg p-1">
                            <button
                                onClick={() => setIsContinuous(false)}
                                className={cn("px-3 py-1 text-xs rounded-md transition-all", !isContinuous ? "bg-white/10 text-white" : "text-muted hover:text-white")}
                            >
                                Single
                            </button>
                            <button
                                onClick={() => setIsContinuous(true)}
                                className={cn("px-3 py-1 text-xs rounded-md transition-all", isContinuous ? "bg-primary text-black" : "text-muted hover:text-white")}
                            >
                                Continuous
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/5" />

                    {/* Duration Settings */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted uppercase tracking-wider">Flash Duration:</span>
                        <div className="flex gap-1">
                            {[100, 250, 500].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={cn(
                                        "px-2 py-1 text-xs rounded border transition-colors font-mono",
                                        duration === d ? "bg-primary text-black border-primary" : "bg-transparent border-white/20 text-muted hover:text-white"
                                    )}
                                >
                                    {d}ms
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interval Slider (Visible only in Continuous) */}
                    {isContinuous && (
                        <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                            <span className="text-sm text-muted uppercase tracking-wider">Interval:</span>
                            <div className="flex items-center gap-4 w-1/2">
                                <input
                                    type="range"
                                    min="2000"
                                    max="10000"
                                    step="500"
                                    value={interval}
                                    onChange={(e) => setInterval(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <span className="text-xs font-mono text-white w-12 text-right">{(interval / 1000).toFixed(1)}s</span>
                            </div>
                        </div>
                    )}

                    <div className="w-full h-px bg-white/5" />

                    {/* Wall Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted uppercase tracking-wider">Wall Mode:</span>
                        <button
                            onClick={() => setShowWall(!showWall)}
                            className={cn(
                                "w-10 h-5 rounded-full relative transition-colors",
                                showWall ? "bg-secondary" : "bg-white/10"
                            )}
                        >
                            <div className={cn(
                                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                showWall ? "left-6" : "left-1"
                            )} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center max-w-lg">
                <p className="text-sm text-muted">
                    <b>Rule:</b> Look at the shape. When it vanishes, <b>don't close your eyes</b>.
                    Stare at the "Wall" (or a real wall) and try to drag the image with you.
                    <br /><span className="text-xs opacity-50">"Access the Screen"</span>
                </p>
            </div>
        </div>
    );
};
