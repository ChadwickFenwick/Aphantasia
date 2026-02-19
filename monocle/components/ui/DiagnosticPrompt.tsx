'use client';

import React from 'react';
import { useUserStore } from '@/lib/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { PulseButton } from '@/components/ui/PulseButton';
import { Zap, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const DiagnosticPrompt = () => {
    const { showDiagnosticPrompt, dismissDiagnosticPrompt } = useUserStore();
    const router = useRouter();

    if (!showDiagnosticPrompt) return null;

    const handleConfirm = () => {
        dismissDiagnosticPrompt();
        router.push('/diagnostic');
    };

    return (
        <div className="fixed bottom-8 left-8 z-50 animate-in slide-in-from-left fade-in duration-500 max-w-sm">
            <GlassCard className="p-0 overflow-hidden border-2 border-primary/50 shadow-[0_0_50px_rgba(0,242,255,0.2)]">
                <div className="bg-primary/20 p-3 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                        <Zap className="w-4 h-4 fill-primary" />
                        System Calibration Required
                    </div>
                    <button
                        onClick={dismissDiagnosticPrompt}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                        Neural Pathways Expanded
                    </h3>
                    <p className="text-muted text-sm mb-4 leading-relaxed">
                        You have accumulated significant training data. It is recommended to re-assess your visualization baseline.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={dismissDiagnosticPrompt}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Later
                        </button>
                        <PulseButton
                            onClick={handleConfirm}
                            className="flex-1 py-3 text-xs w-auto px-4"
                        >
                            Recalibrate <ArrowRight className="w-3 h-3 ml-1" />
                        </PulseButton>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
