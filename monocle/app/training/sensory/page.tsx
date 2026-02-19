'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { SensoryBridging } from "@/components/exercises/SensoryBridging";

export default function SensoryPage() {
    return (
        <TrainingModuleLayout
            title="Sensory"
            subtitle="Bridging"
            description="Use your environment to trigger visualization. Describe your spatial journey out loud to bridge the gap between concept and image."
        >
            <div className="max-w-4xl mx-auto w-full">
                <SensoryBridging />
            </div>
        </TrainingModuleLayout>
    );
}
