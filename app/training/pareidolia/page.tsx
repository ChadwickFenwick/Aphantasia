'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { PareidoliaCanvas } from '@/components/exercises/PareidoliaCanvas';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PareidoliaPage() {
    return (
        <TrainingModuleLayout
            title="Pareidolia"
            subtitle="Drift"
            description="Find shapes in the chaos. Train your top-down processing."
        >
            <div className="flex-1 rounded-xl overflow-hidden relative">
                <PareidoliaCanvas />
            </div>
        </TrainingModuleLayout>
    );
}
