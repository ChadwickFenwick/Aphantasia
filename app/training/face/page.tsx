import { FaceBuilder } from "@/components/exercises/FaceBuilder";
import { TrainingModuleLayout } from "@/components/TrainingModuleLayout";

export default function FaceStudioPage() {
    return (
        <TrainingModuleLayout
            title="Face Studio"
            subtitle="Binding"
            description="Train feature binding by mentally assembling facial features."
        >
            <div className="h-full w-full">
                <FaceBuilder />
            </div>
        </TrainingModuleLayout>
    );
}
