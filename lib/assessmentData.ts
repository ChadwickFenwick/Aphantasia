export type SensoryModality = 'visual' | 'auditory' | 'somatic' | 'cognitive' | 'focus';

export interface AssessmentScenario {
    id: string;
    modality: SensoryModality;
    title: string;
    instruction: string;
    items: string[];
}

export const assessmentData: AssessmentScenario[] = [
    // --- VISUAL (VVIQ - Marks, 1973) ---
    {
        id: "visual_relative",
        modality: "visual",
        title: "Visual: Familiar Face",
        instruction: "Think of some relative or friend whom you frequently see (but who is not with you at present) and consider carefully the picture that comes before your mind's eye.",
        items: [
            "The exact contour of face, head, shoulders and body.",
            "Characteristic poses of head, attitudes of body, etc.",
            "The precise carriage, length of step, etc., in walking.",
            "The different colours worn in some familiar clothes."
        ]
    },
    {
        id: "visual_sunrise",
        modality: "visual",
        title: "Visual: Rising Sun",
        instruction: "Visualize a rising sun. Consider carefully the picture that comes before your mind's eye.",
        items: [
            "The sun is rising above the horizon into a hazy sky.",
            "The sky clears and surrounds the sun with blueness.",
            "The sun is driving clouds away.",
            "The sun is rising into a cloudless sky."
        ]
    },
    // --- AUDITORY (Adapted from BAIS - Bucknell Auditory Imagery Scale) ---
    {
        id: "auditory_music",
        modality: "auditory",
        title: "Auditory: Musical Instruments",
        instruction: "Think of the following sounds and consider carefully the clarity of the auditory image.",
        items: [
            "The sound of a clarinet playing.",
            "The sound of a choir singing.",
            "The sound of an electric guitar solo.",
            "The beginning of your favorite song."
        ]
    },
    {
        id: "auditory_voice",
        modality: "auditory",
        title: "Auditory: Voices",
        instruction: "Imagine hearing the following voices.",
        items: [
            "The voice of a gentle teacher giving a lecture.",
            "The voice of a friend calling your name from a distance.",
            "A crowd cheering at a sports event.",
            "A small child crying."
        ]
    },
    // --- SOMATIC / TACTILE (Adapted from QMI - Questionnaire upon Mental Imagery) ---
    {
        id: "somatic_touch",
        modality: "somatic",
        title: "Somatic: Tactile Sensation",
        instruction: "Imagine physically feeling the following sensations.",
        items: [
            "Touching grainy sand.",
            "The prick of a pin.",
            "The warmth of a hot bath.",
            "The texture of a wool blanket."
        ]
    },
    {
        id: "somatic_kinesthetic",
        modality: "somatic",
        title: "Somatic: Movement (Kinesthetic)",
        instruction: "Imagine the physical sensation of movement.",
        items: [
            "Running upstairs.",
            "Jumping across a ditch.",
            "Drawing a circle on paper with your finger.",
            "Reaching up to a high shelf."
        ]
    }
];

export const ratingScale = [
    { value: 1, label: "No image/sensation at all, you only 'know' you are thinking of it", color: "bg-red-500/20 border-red-500/50" },
    { value: 2, label: "Vague and dim", color: "bg-orange-500/20 border-orange-500/50" },
    { value: 3, label: "Moderately clear", color: "bg-yellow-500/20 border-yellow-500/50" },
    { value: 4, label: "Clear and reasonably vivid", color: "bg-lime-500/20 border-lime-500/50" },
    { value: 5, label: "Perfectly clear and vivid as real reality", color: "bg-green-500/20 border-green-500/50" },
];
