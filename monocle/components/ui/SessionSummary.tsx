'use client';

import React, { useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PulseButton } from '@/components/ui/PulseButton';
import { useUserStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { CheckCircle, Trophy, Activity, ArrowRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionSummaryProps {
    title: string;
    score?: number; // Raw score (e.g., 8/10)
    totalQuestions?: number;
    accuracy?: number; // Percentage 0-100
    xpEarned: number;
    duration?: string; // e.g. "5m 30s"
    skillsTrained?: ('visual' | 'auditory' | 'somatic' | 'cognitive' | 'focus')[];
    onRestart?: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
    title,
    score,
    totalQuestions,
    accuracy,
    xpEarned,
    duration,
    skillsTrained = [],
    onRestart
}) => {
    const router = useRouter();
    const { addXP, incrementSessionCount, updateNeuralProfile } = useUserStore();

    useEffect(() => {
        // Award rewards on mount
        addXP(xpEarned);
        incrementSessionCount();

        if (skillsTrained.length > 0) {
            // Award skill points based on XP
            // e.g. 100 XP = 5 skill points
            const skillPoints = Math.max(1, Math.round(xpEarned / 20));
            updateNeuralProfile(skillsTrained, skillPoints);
        }
    }, []); // Run once

    return (
        <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
            <GlassCard className="w-full p-8 border-primary/20 bg-primary/5">
                {/* Header */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-primary/10">
                        <Trophy className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">
                        Session Complete
                    </h2>
                    <p className="text-muted text-lg">{title}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                        <span className="text-xs text-muted uppercase tracking-widest mb-1">XP Earned</span>
                        <span className="text-3xl font-mono font-bold text-secondary">+{xpEarned}</span>
                    </div>

                    {accuracy !== undefined && (
                        <div className="bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                            <span className="text-xs text-muted uppercase tracking-widest mb-1">Accuracy</span>
                            <span className={cn(
                                "text-3xl font-mono font-bold",
                                accuracy >= 80 ? "text-green-400" : accuracy >= 50 ? "text-yellow-400" : "text-red-400"
                            )}>{accuracy}%</span>
                        </div>
                    )}

                    {score !== undefined && totalQuestions !== undefined && (
                        <div className="bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                            <span className="text-xs text-muted uppercase tracking-widest mb-1">Score</span>
                            <span className="text-3xl font-mono font-bold text-white">{score} / {totalQuestions}</span>
                        </div>
                    )}

                    {duration && (
                        <div className="bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                            <span className="text-xs text-muted uppercase tracking-widest mb-1">Duration</span>
                            <span className="text-xl font-mono font-bold text-white">{duration}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => router.push('/training')}
                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" /> Return to Hub
                    </button>

                    {onRestart && (
                        <PulseButton onClick={onRestart} className="flex-1">
                            Again <ArrowRight className="w-4 h-4 ml-2" />
                        </PulseButton>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};
