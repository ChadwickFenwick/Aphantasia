'use client';

import React, { useEffect, useMemo } from 'react';
import { useUserStore } from '@/lib/store';
import { getDailyModules, MODULES } from '@/lib/modules';
import { GlassCard } from '@/components/ui/GlassCard';
import { CheckCircle, ArrowRight, Zap, Eye, Navigation, Sliders, Brain, Palette, RefreshCw, Box } from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PulseButton } from '@/components/ui/PulseButton';

// Icon Map again (should probably centralize completely but file separation is okay)
const IconMap: Record<string, any> = {
    'Zap': <Zap className="w-5 h-5" />,
    'Question': <span className="text-xl font-bold">?</span>,
    'Palette': <Palette className="w-5 h-5" />,
    'Pencil': <span className="text-xl font-bold">✍️</span>,
    'Box': <Box className="w-5 h-5" />,
    'Navigation': <Navigation className="w-5 h-5" />,
    'Flash': <span className="text-xl font-bold">⚡</span>,
    'Eye': <Eye className="w-5 h-5" />,
    'Sliders': <Sliders className="w-5 h-5" />,
    'Brain': <Brain className="w-5 h-5" />,
};

export const DailyChallenges = () => {
    const { completedChallenges, completeChallenge, incrementStreak, checkDailyReset, incrementSessionCount } = useUserStore();

    // Check reset on mount
    useEffect(() => {
        checkDailyReset();
    }, [checkDailyReset]);

    // Get today's challenges (Client-side date ensure sync)
    // In a real app we'd use server time, but this is fine for a habit tracker.
    const today = new Date().toISOString().split('T')[0];
    const dailyModules = useMemo(() => getDailyModules(today), [today]);

    // Calculate progress
    const progress = (completedChallenges.length / 3) * 100;
    const isComplete = completedChallenges.length >= 3;

    // Handle Click
    const handleModuleClick = (id: string) => {
        if (!completedChallenges.includes(id)) {
            completeChallenge(id);
            incrementSessionCount();

            // If this was the last one (currently 2 completed, this makes 3)
            if (completedChallenges.length === 2) {
                incrementStreak();
            }
        }
    };

    return (
        <GlassCard className="max-w-4xl w-full mx-auto relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-secondary">✦</span> Daily Challenges
                    </h2>
                    <p className="text-muted text-sm">Task complete 3 modules to keep your streak.</p>
                </div>
                <div className="text-right">
                    <span className="text-xl font-mono text-white">{completedChallenges.length}/3</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-white/10 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-secondary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dailyModules.map((mod) => {
                    const isDone = completedChallenges.includes(mod.id);

                    return (
                        <Link
                            key={mod.id}
                            href={mod.href}
                            onClick={() => handleModuleClick(mod.id)}
                            className={cn(
                                "group relative p-4 rounded-xl border transition-all duration-300",
                                isDone
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    isDone ? "text-green-500 bg-green-500/20" : "text-muted bg-white/5 group-hover:text-white"
                                )}>
                                    {IconMap[mod.iconName]}
                                </div>
                                {isDone && <CheckCircle className="w-5 h-5 text-green-500" />}
                            </div>

                            <h3 className={cn("font-bold mb-1", isDone ? "text-green-400" : "text-white")}>{mod.title}</h3>
                            <p className="text-xs text-muted leading-relaxed line-clamp-2">{mod.desc}</p>

                            {!isDone && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-sm">
                                    <span className="flex items-center text-xs font-bold uppercase tracking-widest text-white">
                                        Start <ArrowRight className="w-4 h-4 ml-1" />
                                    </span>
                                </div>
                            )}
                        </Link>
                    )
                })}
            </div>

            {isComplete && (
                <div className="absolute inset-0 z-10 bg-black/80 flex items-center justify-center backdrop-blur-md animate-in fade-in">
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                        <h3 className="text-3xl font-black text-white">Daily Goal Met!</h3>
                        <p className="text-muted mb-6">Streak extended. Come back tomorrow.</p>

                    </div>
                </div>
            )}
        </GlassCard>
    );
};
