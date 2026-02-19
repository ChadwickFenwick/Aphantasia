'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { RotationPuzzle } from '@/components/exercises/RotationPuzzle';

export default function RotationPage() {
    return (
        <TrainingModuleLayout
            title="Mental"
            subtitle="Rotation"
            description="Train your mind's eye to manipulate objects in 3D space."
        >
            <div className="flex-1 flex flex-col justify-center items-center">
                <RotationPuzzle />
            </div>
        </TrainingModuleLayout>
    );
}
