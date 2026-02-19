'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { MemoryScene } from '@/components/exercises/MemoryScene';

export default function MemoryPage() {
    return (
        <TrainingModuleLayout
            title="Episodic"
            subtitle="Recall"
            description="Train feature binding and spatial memory."
        >
            <div className="flex-1 flex flex-col justify-start">
                <MemoryScene />
            </div>
        </TrainingModuleLayout>
    );
}
