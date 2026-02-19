'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SensoryAssessment } from "@/components/exercises/SensoryAssessment";
import { SensoryModality } from "@/lib/assessmentData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eye, Ear, Hand, Brain, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DiagnosticPage() {
    const [selectedModality, setSelectedModality] = useState<SensoryModality | null>(null);

    const modalities: { id: SensoryModality; title: string; icon: any; desc: string; color: string }[] = [
        {
            id: 'visual',
            title: 'Visual',
            icon: Eye,
            desc: 'Test your "Mind\'s Eye" (VVIQ)',
            color: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
        },
        {
            id: 'auditory',
            title: 'Auditory',
            icon: Ear,
            desc: 'Test your "Mind\'s Ear"',
            color: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
        },
        {
            id: 'somatic',
            title: 'Somatic',
            icon: Hand,
            desc: 'Test Touch & Body awareness',
            color: 'text-orange-400 bg-orange-400/10 border-orange-400/20'
        },
        // Placeholder for Cognitive/Focus later if needed
    ];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-4">Neural Diagnostic</h1>
                    <p className="text-muted text-lg max-w-2xl mx-auto">
                        Map your phantasia profile across different sensory modalities.
                    </p>
                </header>

                {!selectedModality ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {modalities.map((mod) => (
                            <button
                                key={mod.id}
                                onClick={() => setSelectedModality(mod.id)}
                                className="group relative"
                            >
                                <GlassCard className="h-full hover:bg-white/5 transition-all duration-300 border-white/10 hover:border-white/20 text-left">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", mod.color)}>
                                        <mod.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                        {mod.title}
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted" />
                                    </h3>
                                    <p className="text-sm text-muted">{mod.desc}</p>
                                </GlassCard>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <button
                            onClick={() => setSelectedModality(null)}
                            className="text-xs uppercase tracking-widest text-muted hover:text-white mb-6 flex items-center gap-2"
                        >
                            ← Back to Menu
                        </button>
                        <SensoryAssessment modality={selectedModality} />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
