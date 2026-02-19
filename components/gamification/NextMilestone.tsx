'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useUserStore } from '@/lib/store';
import { ACHIEVEMENTS } from '@/lib/gamification/achievements';
import { Target, Zap, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PulseButton } from '@/components/ui/PulseButton';
import { useRouter } from 'next/navigation';

export const NextMilestone = () => {
    const { xp, level, unlockedAchievements, dailyStreak } = useUserStore();
    const router = useRouter();

    // XP Logic: Assume 1000 XP per level for now (or a curve)
    // Level 1 -> 2: 1000 XP
    // Level 2 -> 3: 2000 XP (cumulative? or per level?) 
    // Let's keep it simple: Level * 1000 is the threshold for the NEXT level.
    // e.g. Lvl 1 needs 1000 total XP to be Lvl 2.
    // Lvl 2 needs 3000 total XP (1000 + 2000) to be Lvl 3? 
    // Let's stick to a simple linear 1000xp per level for the UI visualization for now.

    const xpPerLevel = 1000;
    const progressInCurrentLevel = xp % xpPerLevel;
    const xpToNextLevel = xpPerLevel - progressInCurrentLevel;
    const progressPercent = (progressInCurrentLevel / xpPerLevel) * 100;

    // Find next locked achievement
    const nextAchievement = ACHIEVEMENTS.find(a => !unlockedAchievements.includes(a.id));

    return (
        <GlassCard className="h-full flex flex-col p-6 relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <Target className="w-5 h-5 text-primary" />
                Next Milestone
            </h3>

            <div className="space-y-8 flex-1 relative z-10">
                {/* Level Progress */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm text-muted uppercase tracking-wider">Level {level + 1} Progress</span>
                        <span className="text-xs font-mono text-primary">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted mt-2 text-right">
                        {xpToNextLevel} XP to Level {level + 1}
                    </p>
                </div>

                {/* Next Achievement Target */}
                {nextAchievement ? (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-3 text-secondary">
                            <Lock className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Target Protocol</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <h4 className="font-bold text-white">{nextAchievement.title}</h4>
                        </div>
                        <p className="text-xs text-muted mt-1 leading-relaxed">
                            {nextAchievement.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                +{nextAchievement.xpReward} XP
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted">
                        <p>All protocols mastered.</p>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 relative z-10">
                <PulseButton onClick={() => router.push('/training')} className="w-full text-sm py-3">
                    CONTINUE TRAINING <ChevronRight className="w-4 h-4 ml-1" />
                </PulseButton>
            </div>
        </GlassCard>
    );
};
