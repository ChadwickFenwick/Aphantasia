'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { EchoCanvas } from '@/components/exercises/EchoCanvas';

export default function EchoPage() {
    return (
        <TrainingModuleLayout
            title="Echo"
            subtitle="Location"
            description="Build a spatial mental map using 3D auditory cues. Headphones required."
        >
            <div className="flex-1 flex flex-col justify-center">
                <EchoCanvas />
            </div>
        </TrainingModuleLayout>
    );
}
