'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface ProgressChartProps {
    data: number[]; // Array of VVIQ scores
    labels: string[]; // Array of dates/labels
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, labels }) => {
    if (!data.length) {
        return (
            <GlassCard className="h-[300px] flex items-center justify-center text-muted">
                No data available yet. Complete a diagnostic.
            </GlassCard>
        );
    }

    const maxScore = 80; // VVIQ max score

    return (
        <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">Visualization Clarity History</h3>

            <div className="h-[200px] flex items-end gap-4">
                {data.map((score, idx) => {
                    const heightPercent = (score / maxScore) * 100;
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-white/5 rounded-t-lg relative h-full overflow-hidden flex items-end">
                                <div
                                    className={cn(
                                        "w-full transition-all duration-1000 ease-out",
                                        score < 30 ? "bg-red-500" : score < 50 ? "bg-yellow-500" : "bg-green-500"
                                    )}
                                    style={{ height: `${heightPercent}%` }}
                                />
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-mono text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {score}
                                </div>
                            </div>
                            <span className="text-[10px] text-muted uppercase tracking-wider truncate w-full text-center">
                                {labels[idx]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
};
