'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressChart } from "@/components/ui/ProgressChart";
import { useUserStore } from "@/lib/store";
import { NextMilestone } from "@/components/gamification/NextMilestone";
import { Flame, Star, Trophy, Activity, Lock, Unlock, Eye, Ear, Hand } from "lucide-react";
import { ActivityHeatmap } from "@/components/visuals/ActivityHeatmap";
import { NeuralRadar } from "@/components/ui/NeuralRadar";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";
import { cn } from "@/lib/utils";

// Icon Map for Achievements
const IconMap: Record<string, any> = {
    'Clock': <Activity className="w-5 h-5" />,
    'Eye': <Star className="w-5 h-5" />,
    'Brain': <Trophy className="w-5 h-5" />,
    'Star': <Star className="w-5 h-5" />,
    'Zap': <Flame className="w-5 h-5" />
};

export default function ProgressPage() {
    const { level, dailyStreak, neuralProfile, unlockedAchievements, xp } = useUserStore();
    const [mounted, setMounted] = useState(false);
    const [showAllAchievements, setShowAllAchievements] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <DashboardLayout><div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div></DashboardLayout>;
    }

    // Mock history data for now
    // const chartData = vviqScore !== null ? [vviqScore] : [];
    // const chartLabels = vviqScore !== null ? ['Current'] : [];

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                <header>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Neural Profile</h1>
                    <p className="text-muted text-lg">Track the evolution of your mind's eye.</p>
                </header>

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <GlassCard className="flex items-center gap-4 p-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 relative">
                            <Eye className="w-6 h-6" />
                        </div>
                        <div className="relative">
                            <div className="text-2xl font-mono text-white font-bold">{neuralProfile.visual > 0 ? Math.round(neuralProfile.visual) : '-'}</div>
                            <div className="text-xs text-muted uppercase tracking-widest">Visual</div>
                        </div>
                    </GlassCard>

                    <GlassCard className="flex items-center gap-4 p-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 relative">
                            <Ear className="w-6 h-6" />
                        </div>
                        <div className="relative">
                            <div className="text-2xl font-mono text-white font-bold">{neuralProfile.auditory > 0 ? Math.round(neuralProfile.auditory) : '-'}</div>
                            <div className="text-xs text-muted uppercase tracking-widest">Auditory</div>
                        </div>
                    </GlassCard>

                    <GlassCard className="flex items-center gap-4 p-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400 relative">
                            <Hand className="w-6 h-6" />
                        </div>
                        <div className="relative">
                            <div className="text-2xl font-mono text-white font-bold">{neuralProfile.somatic > 0 ? Math.round(neuralProfile.somatic) : '-'}</div>
                            <div className="text-xs text-muted uppercase tracking-widest">Somatic</div>
                        </div>
                    </GlassCard>

                    <GlassCard className="flex items-center gap-4 p-4">
                        <div className="p-3 bg-primary/20 rounded-lg text-primary">
                            <Flame className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-mono text-white font-bold">{dailyStreak}</div>
                            <div className="text-xs text-muted uppercase tracking-widest">Day Streak</div>
                        </div>
                    </GlassCard>
                </div>

                {/* Main Viz Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Col: Heatmap & Radar */}
                    <div className="lg:col-span-2 space-y-6">
                        <ActivityHeatmap />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 self-start">
                                    <span className="text-cyan-400">🧠</span> Neural Profile
                                </h3>
                                <NeuralRadar />
                            </GlassCard>

                            {/* Next Milestone Card */}
                            <NextMilestone />
                        </div>
                    </div>

                    {/* Right Col: Achievements */}
                    <div className="space-y-6">
                        <GlassCard className="p-6 h-full min-h-[500px]">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-yellow-400">🏆</span> Protocols
                            </h3>
                            <div className="space-y-4">
                                {ACHIEVEMENTS.slice(0, showAllAchievements ? undefined : 5).map(achievement => {
                                    const isUnlocked = unlockedAchievements.includes(achievement.id);
                                    return (
                                        <div key={achievement.id} className={cn(
                                            "flex items-start gap-4 p-3 rounded-lg border transition-all",
                                            isUnlocked
                                                ? "bg-white/5 border-white/10"
                                                : "bg-black/20 border-transparent opacity-50 grayscale"
                                        )}>
                                            <div className={cn(
                                                "p-2 rounded-md",
                                                isUnlocked ? "bg-yellow-500/20 text-yellow-400" : "bg-white/5 text-muted"
                                            )}>
                                                {isUnlocked ? IconMap[achievement.icon] || <Trophy className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <h4 className={cn("text-sm font-bold", isUnlocked ? "text-white" : "text-muted")}>
                                                    {achievement.title}
                                                </h4>
                                                <p className="text-xs text-muted mt-1 leading-relaxed">
                                                    {achievement.description}
                                                </p>
                                                {isUnlocked && (
                                                    <div className="mt-2 text-[10px] font-mono text-yellow-500/80 uppercase tracking-wider">
                                                        Protocol Active
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}

                                {ACHIEVEMENTS.length > 5 && (
                                    <button
                                        onClick={() => setShowAllAchievements(!showAllAchievements)}
                                        className="w-full py-2 text-xs text-center text-muted hover:text-white transition-colors border-t border-white/5 mt-4"
                                    >
                                        {showAllAchievements ? "Show Less" : `Show All (${ACHIEVEMENTS.length})`}
                                    </button>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
