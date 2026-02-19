'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { DrawingCanvas } from '@/components/exercises/DrawingCanvas';

export default function DrawingPage() {
    return (
        <TrainingModuleLayout
            title="Blind"
            subtitle="Drawing"
            description="Trace a shape from memory after it disappears."
        >
            <div className="flex-1 flex flex-col h-full rounded-xl overflow-hidden relative">
                <DrawingCanvas />
            </div>
        </TrainingModuleLayout>
    );
}
