'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/lib/store';
import { ACHIEVEMENTS } from '@/lib/gamification/achievements';
import { Trophy, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';

export const AchievementManager = () => {
    const { checkAchievements } = useUserStore();
    const [queue, setQueue] = useState<string[]>([]);
    const [current, setCurrent] = useState<string | null>(null);

    // Periodic Check (e.g., every 5 seconds or on mount)
    // In a real app, we'd trigger this on specific actions.
    useEffect(() => {
        const interval = setInterval(() => {
            const unlocked = checkAchievements();
            if (unlocked.length > 0) {
                setQueue(prev => [...prev, ...unlocked]);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [checkAchievements]);

    // Queue Processor
    useEffect(() => {
        if (!current && queue.length > 0) {
            const next = queue[0];
            setCurrent(next);
            setQueue(prev => prev.slice(1));

            // Auto dismiss
            setTimeout(() => {
                setCurrent(null);
            }, 5000);
        }
    }, [queue, current]);

    if (!current) return null;

    const achievement = ACHIEVEMENTS.find(a => a.id === current);
    if (!achievement) return null;

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right fade-in duration-500">
            <GlassCard className="p-4 border-l-4 border-l-secondary flex items-start gap-4 min-w-[300px] shadow-2xl bg-black/90">
                <div className="p-2 bg-secondary/20 rounded-lg animate-pulse">
                    <Trophy className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                    <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">
                        Protocol Unlocked
                    </h4>
                    <h3 className="font-bold text-white text-lg leading-none mb-1">
                        {achievement.title}
                    </h3>
                    <p className="text-sm text-muted">
                        {achievement.description}
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};
