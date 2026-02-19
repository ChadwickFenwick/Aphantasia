'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { SensoryTuner } from '@/components/exercises/SensoryTuner';

export default function TunerPage() {
    return (
        <TrainingModuleLayout
            title="Sensory"
            subtitle="Tuner"
            description="Train raw sensory discrimination. Bypass analogue labels."
        >
            <div className="flex-1 flex flex-col justify-start">
                <SensoryTuner />
            </div>
        </TrainingModuleLayout>
    );
}
