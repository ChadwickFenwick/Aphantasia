import { DashboardLayout } from "@/components/DashboardLayout";
import { VVIQAssessment } from "@/components/exercises/VVIQAssessment";

export default function DiagnosticPage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-4">VVIQ Diagnostic</h1>
                    <p className="text-muted text-lg max-w-2xl mx-auto">
                        The Vividness of Visual Imagery Questionnaire (VVIQ) is the scientific standard for measuring phantasia.
                        Please answer as honestly as possible.
                    </p>
                </header>

                <VVIQAssessment />
            </div>
        </DashboardLayout>
    );
}
