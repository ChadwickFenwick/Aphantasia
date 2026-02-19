import { MentalAbacus } from "@/components/exercises/MentalAbacus";
import { TrainingModuleLayout } from "@/components/TrainingModuleLayout";

export default function AbacusPage() {
    return (
        <TrainingModuleLayout
            title="Mental Abacus"
            subtitle="Numeracy"
            description="Train symbolic visualization by manipulating mental dice."
        >
            <div className="h-full w-full">
                <MentalAbacus />
            </div>
        </TrainingModuleLayout>
    );
}
