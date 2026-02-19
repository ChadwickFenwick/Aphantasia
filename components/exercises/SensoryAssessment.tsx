'use client';

import React, { useState, useEffect } from 'react';
import { assessmentData, ratingScale, SensoryModality } from '@/lib/assessmentData';
import { useUserStore } from '@/lib/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { PulseButton } from '@/components/ui/PulseButton';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Brain, CheckCircle, Ear, Eye, Hand, Sparkles } from 'lucide-react';

interface SensoryAssessmentProps {
    modality: SensoryModality;
    onComplete?: () => void;
}

export const SensoryAssessment: React.FC<SensoryAssessmentProps> = ({ modality, onComplete }) => {
    const router = useRouter();
    const setNeuralProfile = useUserStore((state) => state.setNeuralProfile);
    const neuralProfile = useUserStore((state) => state.neuralProfile);

    // Filter scenarios for this modality
    const scenarios = assessmentData.filter(s => s.modality === modality);

    const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
    const [currentItemIdx, setCurrentItemIdx] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    if (scenarios.length === 0) {
        return <div className="text-white">No scenarios found for this modality.</div>;
    }

    const currentScenario = scenarios[currentScenarioIdx];
    const currentItem = currentScenario.items[currentItemIdx];

    // Flattened index for progress bar
    const totalItems = scenarios.reduce((acc, s) => acc + s.items.length, 0);
    const currentProgress = answers.length;

    const getIcon = () => {
        switch (modality) {
            case 'visual': return <Eye className="w-5 h-5" />;
            case 'auditory': return <Ear className="w-5 h-5" />;
            case 'somatic': return <Hand className="w-5 h-5" />;
            default: return <Brain className="w-5 h-5" />;
        }
    };

    const getModalityName = () => {
        return modality.charAt(0).toUpperCase() + modality.slice(1);
    };

    const handleNext = () => {
        if (selectedRating === null) return;

        const newAnswers = [...answers, selectedRating];
        setAnswers(newAnswers);
        setSelectedRating(null);

        // Check if scenario is finished
        if (currentItemIdx < currentScenario.items.length - 1) {
            setCurrentItemIdx(currentItemIdx + 1);
        } else {
            // Check if all scenarios are finished
            if (currentScenarioIdx < scenarios.length - 1) {
                setCurrentScenarioIdx(currentScenarioIdx + 1);
                setCurrentItemIdx(0);
            } else {
                // Finish
                finishAssessment(newAnswers);
            }
        }
    };

    const finishAssessment = (finalAnswers: number[]) => {
        // Calculate Score (Average * 20 to get 0-100 scale? Or just raw sum?)
        // VVIQ is usually sum (16-80).
        // Let's normalize it to 0-100 for our "Neural Profile" stats.

        const sum = finalAnswers.reduce((a, b) => a + b, 0);
        const maxScore = totalItems * 5;
        const normalizedScore = Math.round((sum / maxScore) * 100);

        setNeuralProfile({ [modality]: normalizedScore });
        setIsComplete(true);
        if (onComplete) onComplete();
    };

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center animate-in fade-in zoom-in duration-300">
                <GlassCard className="max-w-md w-full border-primary/20 bg-primary/5">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="w-16 h-16 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">{getModalityName()} Complete</h2>
                    <p className="text-muted mb-6">Your neural profile has been updated.</p>

                    <div className="text-5xl font-mono text-primary mb-2">
                        {neuralProfile[modality]} <span className="text-lg text-muted-foreground">/ 100</span>
                    </div>

                    <div className="flex flex-col gap-3 w-full mt-8">
                        <PulseButton onClick={() => router.push('/progress')} className="w-full">
                            VIEW FULL PROFILE
                        </PulseButton>

                        <button
                            onClick={() => {
                                setIsComplete(false);
                                setCurrentScenarioIdx(0);
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
                    <span className="flex items-center gap-2">
                        {getIcon()}
                        {getModalityName()} Assessment
                    </span>
                    <span>{Math.round((currentProgress / totalItems) * 100)}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(currentProgress / totalItems) * 100}%` }}
                    />
                </div>
            </div>

            <GlassCard className="min-h-[450px] flex flex-col relative overflow-hidden">
                {/* Scenario Header */}
                <div className="mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-3 mb-2 text-secondary">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest uppercase">Scenario {currentScenarioIdx + 1} of {scenarios.length}</span>
                    </div>
                    <h2 className="text-xl font-medium text-white/90 leading-relaxed">
                        {currentScenario.title}
                    </h2>
                    <p className="text-sm text-muted mt-2 italic">
                        "{currentScenario.instruction}"
                    </p>
                </div>

                {/* Question Item */}
                <div className="flex-1 flex flex-col justify-center items-center text-center mb-10">
                    <p className="text-xs text-muted mb-4 uppercase tracking-widest">Rate the vividness/clarity of:</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
                        "{currentItem}"
                    </h3>

                    {/* Rating Scale */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 w-full">
                        {ratingScale.map((rating) => (
                            <button
                                key={rating.value}
                                onClick={() => setSelectedRating(rating.value)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200",
                                    "hover:bg-white/5 group relative overflow-hidden",
                                    selectedRating === rating.value
                                        ? rating.color
                                        : "border-white/5 bg-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <span className={cn(
                                    "text-xl font-bold mb-1",
                                    selectedRating === rating.value ? "text-white" : "text-muted group-hover:text-white"
                                )}>
                                    {rating.value}
                                </span>
                                <span className="text-[9px] leading-tight text-muted uppercase tracking-wide">
                                    {rating.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div className="text-xs text-muted">
                        Item {currentItemIdx + 1} / {currentScenario.items.length}
                    </div>
                    <PulseButton
                        onClick={handleNext}
                        disabled={selectedRating === null}
                        className={cn(
                            "px-10 transition-all",
                            selectedRating === null ? "opacity-50 cursor-not-allowed shadow-none" : "hover:scale-105"
                        )}
                    >
                        {currentProgress === totalItems - 1 ? 'FINISH' : 'NEXT'}
                    </PulseButton>
                </div>
            </GlassCard>
        </div>
    );
};
