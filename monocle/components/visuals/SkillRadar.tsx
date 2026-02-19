'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useUserStore } from '@/lib/store';

// We'll use a simple CSS/SVG implementation for the radar chart to avoid heavy charting libraries
export const SkillRadar = () => {
    // In a real app, these would come from store stats
    const stats = {
        visualization: 70, // VVIQ based?
        rotation: 40,      // Rotation puzzle scores
        recall: 20,        // Memory scene scores
        sensory: 50        // Sensory bridging
    };

    // Calculate polygon points (normalized 0-100)
    // 0deg: Visualization (Top)
    // 90deg: Rotation (Right)
    // 180deg: Recall (Bottom)
    // 270deg: Sensory (Left)

    // Scale 0-100 to radius 0-80 (SVG 200x200 center 100,100)
    const getPoint = (value: number, angle: number) => {
        const r = (value / 100) * 80;
        const x = 100 + r * Math.sin(angle * Math.PI / 180);
        const y = 100 - r * Math.cos(angle * Math.PI / 180);
        return `${x},${y}`;
    };

    const points = [
        getPoint(stats.visualization, 0),
        getPoint(stats.rotation, 90),
        getPoint(stats.recall, 180),
        getPoint(stats.sensory, 270)
    ].join(' ');

    return (
        <GlassCard className="p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-4 self-start flex items-center gap-2">
                <span className="text-secondary">✦</span> Skill Matrix
            </h3>

            <div className="relative w-48 h-48 md:w-64 md:h-64 my-4">
                {/* Background Grid */}
                <svg className="w-full h-full text-white/10" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="4 4" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeDasharray="4 4" />
                    <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" />
                    <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" />

                    {/* The Data Shape */}
                    <polygon
                        points={points}
                        fill="rgba(112, 0, 255, 0.3)"
                        stroke="#7000FF"
                        strokeWidth="2"
                        className="drop-shadow-[0_0_10px_rgba(112,0,255,0.5)] animate-in zoom-in duration-1000"
                    />

                    {/* Labels */}
                    <text x="100" y="15" textAnchor="middle" fill="#fff" fontSize="10" className="opacity-70">VISUALIZATION</text>
                    <text x="190" y="105" textAnchor="middle" fill="#fff" fontSize="10" className="opacity-70">ROTATION</text>
                    <text x="100" y="195" textAnchor="middle" fill="#fff" fontSize="10" className="opacity-70">RECALL</text>
                    <text x="10" y="105" textAnchor="middle" fill="#fff" fontSize="10" className="opacity-70">SENSORY</text>
                </svg>
            </div>

            <p className="text-xs text-muted text-center max-w-[200px]">
                Data currently simulated. Complete modules to calibrate your matrix.
            </p>
        </GlassCard>
    );
};
