'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { RSVPReader } from '@/components/exercises/RSVPReader';

export default function VelocityPage() {
    return (
        <TrainingModuleLayout
            title="Velocity"
            subtitle="Reading"
            description="Overload your inner voice. Read at high speed to force direct conceptual imaging."
        >
            <div className="flex-1 flex flex-col justify-center">
                <RSVPReader />
            </div>
        </TrainingModuleLayout>
    );
}
