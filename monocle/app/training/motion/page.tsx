'use client';

import { TrainingModuleLayout } from '@/components/TrainingModuleLayout';
import { RelationalMotion } from "@/components/exercises/RelationalMotion";

export default function MotionPage() {
    return (
        <TrainingModuleLayout
            title="Relational"
            subtitle="Motion"
            description="Train your brain to track objects even when they are hidden from view."
        >
            <div className="max-w-4xl mx-auto w-full">
                <RelationalMotion />
            </div>
        </TrainingModuleLayout>
    );
}
