'use client';

import React, { useState } from 'react';
import { vviqData, ratingScale } from '@/lib/vviqData';
import { useUserStore } from '@/lib/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { PulseButton } from '@/components/ui/PulseButton';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Eye, Brain, CheckCircle } from 'lucide-react';

export const VVIQAssessment = () => {
    const router = useRouter();
    const setVviqScore = useUserStore((state) => state.setVviqScore);
    const setLevel = useUserStore((state) => state.setLevel);
    const vviqScore = useUserStore((state) => state.vviqScore);
    const level = useUserStore((state) => state.level);

    const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
    const [currentItemIdx, setCurrentItemIdx] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);

    const currentGroup = vviqData[currentGroupIdx];
    const currentItem = currentGroup.items[currentItemIdx];

    // Flattened index for progress bar
    const totalItems = vviqData.reduce((acc, group) => acc + group.items.length, 0);
    const currentProgress = answers.length;

    const handleNext = () => {
        if (selectedRating === null) return;

        const newAnswers = [...answers, selectedRating];
        setAnswers(newAnswers);
        setSelectedRating(null);

        // Check if group is finished
        if (currentItemIdx < currentGroup.items.length - 1) {
            setCurrentItemIdx(currentItemIdx + 1);
        } else {
            // Check if all groups are finished
            if (currentGroupIdx < vviqData.length - 1) {
                setCurrentGroupIdx(currentGroupIdx + 1);
                setCurrentItemIdx(0);
            } else {
                // Finish
                finishAssessment(newAnswers);
            }
        }
    };

    const finishAssessment = (finalAnswers: number[]) => {
        const totalScore = finalAnswers.reduce((a, b) => a + b, 0);
        setVviqScore(totalScore);

        // Determine level based on score (16 - 80)
        // 16-32: Aphantasia (Level 1)
        // 33-48: Hypophantasia (Level 2)
        // 49-64: Phantasia (Level 3)
        // 65-80: Hyperphantasia (Level 4)
        let newLevel = 1;
        if (totalScore >= 33) newLevel = 2;
        if (totalScore >= 49) newLevel = 3;
        if (totalScore >= 65) newLevel = 4;

        setLevel(newLevel);
    };

    if (vviqScore !== null) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
                <GlassCard className="max-w-md w-full border-primary/20 bg-primary/5">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="w-16 h-16 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">Assessment Complete</h2>
                    <p className="text-muted mb-6">Your baseline has been established.</p>

                    <div className="text-5xl font-mono text-primary mb-2">
                        {vviqScore} <span className="text-lg text-muted-foreground">/ 80</span>
                    </div>

                    <p className="text-sm uppercase tracking-widest text-secondary mb-8">
                        Level {level} Detected
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                        <PulseButton onClick={() => router.push('/')} className="w-full">
                            GOTO DASHBOARD
                        </PulseButton>

                        <button
                            onClick={() => {
                                setVviqScore(null);
                                setCurrentGroupIdx(0);
                                setCurrentItemIdx(0);
                                setAnswers([]);
                                setSelectedRating(null);
                            }}
                            className="text-xs text-muted hover:text-white uppercase tracking-widest py-2 transition-colors"
                        >
                            Retake Assessment
                        </button>
                    </div>
                </GlassCard>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs uppercase tracking-widest text-muted mb-2">
                    <span>Progress</span>
                    <span>{Math.round((currentProgress / totalItems) * 100)}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(currentProgress / totalItems) * 100}%` }}
                    />
                </div>
            </div>

            <GlassCard className="min-h-[400px] flex flex-col relative overflow-hidden">
                {/* Scenario Header */}
                <div className="mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-3 mb-2 text-secondary">
                        <Brain className="w-5 h-5" />
                        <span className="text-xs font-bold tracking-widest uppercase">Scenario {currentGroupIdx + 1} of {vviqData.length}</span>
                    </div>
                    <h2 className="text-xl font-medium text-white/90 leading-relaxed">
                        {currentGroup.title}
                    </h2>
                </div>

                {/* Question Item */}
                <div className="flex-1 flex flex-col justify-center items-center text-center mb-10">
                    <p className="text-sm text-muted mb-4 uppercase tracking-widest">Visualize this detail:</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        "{currentItem}"
                    </h3>

                    {/* Rating Scale */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 w-full">
                        {ratingScale.map((rating) => (
                            <button
                                key={rating.value}
                                onClick={() => setSelectedRating(rating.value)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200",
                                    "hover:bg-white/5 group",
                                    selectedRating === rating.value
                                        ? rating.color
                                        : "border-white/5 bg-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <span className={cn(
                                    "text-xl font-bold mb-2",
                                    selectedRating === rating.value ? "text-white" : "text-muted group-hover:text-white"
                                )}>
                                    {rating.value}
                                </span>
                                <span className="text-[10px] leading-tight text-muted uppercase tracking-wide">
                                    {rating.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-end pt-6 border-t border-white/5">
                    <PulseButton
                        onClick={handleNext}
                        disabled={selectedRating === null}
                        className={cn(
                            "px-10",
                            selectedRating === null && "opacity-50 cursor-not-allowed shadow-none"
                        )}
                    >
                        {currentProgress === totalItems - 1 ? 'FINISH' : 'NEXT'}
                    </PulseButton>
                </div>
            </GlassCard>
        </div>
    );
};
