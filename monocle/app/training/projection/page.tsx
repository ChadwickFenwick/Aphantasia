'use client';

import React, { useState } from 'react';
import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { ARCanvas, ShapeType } from "@/components/exercises/ARCanvas";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sliders, Box, Triangle, Star } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function ProjectionPage() {
    const [opacity, setOpacity] = useState(1);
    const [shape, setShape] = useState<ShapeType>('star');

    return (
        <TrainingModuleLayout
            title="Prophantasic"
            subtitle="Projection"
            description="Project the shape onto your reality. Fade it out, but keep it in your mind."
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center w-full">

                <div className="w-full flex justify-end mb-4">
                    <div className="text-right">
                        <span className="text-xs uppercase tracking-widest text-muted block mb-1">Target Opacity</span>
                        <span className="text-2xl font-mono text-primary">{Math.round(opacity * 100)}%</span>
                    </div>
                </div>

                {/* AR Canvas */}
                <div className="w-full mb-8">
                    <ARCanvas opacity={opacity} shape={shape} />
                </div>

                <div className="w-full max-w-lg space-y-4">
                    {/* Shape Selector */}
                    <div className="flex justify-center gap-4">
                        {[
                            { id: 'star', icon: Star, label: 'Star' },
                            { id: 'cube', icon: Box, label: 'Cube' },
                            { id: 'pyramid', icon: Triangle, label: 'Pyramid' }
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setShape(s.id as ShapeType)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all w-24",
                                    shape === s.id
                                        ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                                        : "bg-white/5 border-white/5 text-muted hover:bg-white/10 hover:text-white top"
                                )}
                            >
                                <s.icon className={cn("w-6 h-6", shape === s.id && "fill-current")} />
                                <span className="text-[10px] uppercase font-bold tracking-wider">{s.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Opacity Control */}
                    <GlassCard className="w-full p-8 flex items-center gap-6">
                        <Sliders className="w-6 h-6 text-primary flex-shrink-0" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={opacity}
                            onChange={(e) => setOpacity(parseFloat(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                        />
                    </GlassCard>
                </div>

                <p className="mt-8 text-center text-muted text-sm max-w-md">
                    INSTRUCTION: Stare at the glowing star. Slowly lower the opacity.
                    When it reaches 0%, try to still "see" the star floating in the room.
                </p>

            </div>
        </TrainingModuleLayout>
    );
}
