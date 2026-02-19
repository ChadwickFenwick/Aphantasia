'use client';

import React from 'react';
import { useUserStore } from '@/lib/store';
import { GlassCard } from '@/components/ui/GlassCard';

export const NeuralRadar = () => {
    const { neuralProfile } = useUserStore();

    // Config
    const size = 300;
    const center = size / 2;
    const radius = 100;
    const skills = ['visual', 'auditory', 'somatic', 'cognitive', 'focus'] as const;

    // Calculate points
    const points = skills.map((skill, i) => {
        const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
        const value = neuralProfile[skill] || 0;
        const r = (value / 100) * radius; // Normalize 0-100 to radius
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    // Calculate background polygons (webs)
    const webs = [0.2, 0.4, 0.6, 0.8, 1.0].map(scale => {
        return skills.map((_, i) => {
            const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
            const r = radius * scale;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    });

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} className="overflow-visible">
                {/* Background Webs */}
                {webs.map((points, i) => (
                    <polygon
                        key={i}
                        points={points}
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axes */}
                {skills.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={x}
                            y2={y}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <polygon
                    points={points}
                    fill="rgba(6, 182, 212, 0.2)" // Cyan with opacity
                    stroke="#06b6d4"
                    strokeWidth="2"
                    className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                />

                {/* Data Points */}
                {skills.map((skill, i) => {
                    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                    const value = neuralProfile[skill] || 0;
                    const r = (value / 100) * radius;
                    const x = center + r * Math.cos(angle);
                    const y = center + r * Math.sin(angle);
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#06b6d4"
                            className="drop-shadow-[0_0_5px_#06b6d4]"
                        />
                    );
                })}

                {/* Labels */}
                {skills.map((skill, i) => {
                    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                    const labelRadius = radius + 25;
                    const x = center + labelRadius * Math.cos(angle);
                    const y = center + labelRadius * Math.sin(angle);
                    return (
                        <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-muted text-xs font-mono uppercase tracking-widest"
                            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                        >
                            {skill}
                        </text>
                    );
                })}
            </svg>

            {/* Legend / Stats Text */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs font-mono text-muted">
                {skills.map(skill => (
                    <div key={skill} className="flex justify-between w-24">
                        <span className="uppercase">{skill}</span>
                        <span className="text-white">{Math.round(neuralProfile[skill])}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
