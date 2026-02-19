import { SynesthesiaTuner } from "@/components/exercises/SynesthesiaTuner";
import { TrainingModuleLayout } from "@/components/TrainingModuleLayout";

export default function TunerPage() {
    return (
        <TrainingModuleLayout
            title="Synesthesia Tuner"
            subtitle="Cross-Wiring"
            description="Train audio-visual associations to trigger the visual cortex."
        >
            <div className="h-full w-full">
                <SynesthesiaTuner />
            </div>
        </TrainingModuleLayout>
    );
}
