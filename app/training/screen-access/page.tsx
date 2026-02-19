'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { FlashCanvas } from '@/components/exercises/FlashCanvas';

export default function ScreenAccessPage() {
    return (
        <TrainingModuleLayout
            title="Screen"
            subtitle="Access"
            description="Train Prophantasia by retaining flash imagery."
        >
            <div className="flex-1 flex flex-col justify-start">
                <FlashCanvas />
            </div>
        </TrainingModuleLayout>
    );
}
