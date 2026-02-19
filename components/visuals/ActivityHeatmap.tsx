'use client';

import React, { useMemo } from 'react';
import { useUserStore } from '@/lib/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const ActivityHeatmap = () => {
    const { activityHistory } = useUserStore();

    // Generate last 365 days (or fewer for mobile)
    const dates = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 90; i++) { // Show last 90 days for now
            const d = new Date();
            d.setDate(today.getDate() - (89 - i));
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    }, []);

    const getIntensityClass = (count: number) => {
        if (count === 0) return 'bg-white/5';
        if (count <= 2) return 'bg-cyan-900/40 border-cyan-800/50';
        if (count <= 4) return 'bg-cyan-700/50 border-cyan-600/50';
        if (count <= 6) return 'bg-cyan-500/60 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
        return 'bg-cyan-400 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]';
    };

    // Safety check
    const history = activityHistory || {};

    return (
        <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-cyan-400">❖</span> Neural Activity
            </h3>

            <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                <TooltipProvider>
                    {dates.map(date => {
                        const count = history[date] || 0;
                        return (
                            <Tooltip key={date}>
                                <TooltipTrigger>
                                    <div
                                        className={cn(
                                            "w-3 h-3 md:w-4 md:h-4 rounded-sm border border-transparent transition-all duration-300 hover:scale-125",
                                            getIntensityClass(count)
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-black/90 border-white/10 text-xs">
                                    <p className="font-mono text-cyan-400">{date}</p>
                                    <p className="text-white">{count} sessions</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted">
                <span>Dormant</span>
                <div className="w-3 h-3 bg-white/5 rounded-sm" />
                <div className="w-3 h-3 bg-cyan-900/40 rounded-sm" />
                <div className="w-3 h-3 bg-cyan-500/60 rounded-sm" />
                <div className="w-3 h-3 bg-cyan-400 rounded-sm" />
                <span>Active</span>
            </div>
        </GlassCard>
    );
};
