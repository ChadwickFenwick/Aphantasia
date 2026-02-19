'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { MaterialCanvas } from '@/components/exercises/MaterialCanvas';

export default function MaterialPage() {
    return (
        <TrainingModuleLayout
            title="Surface"
            subtitle="Scanner"
            description="Use auditory feedback to feel invisible shapes. Trace the edges with your cursor."
        >
            <div className="flex-1 flex flex-col justify-center">
                <MaterialCanvas />
            </div>
        </TrainingModuleLayout>
    );
}
