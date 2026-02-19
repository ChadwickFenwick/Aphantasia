export interface VVIQScenario {
    id: string;
    title: string;
    items: string[];
}

export const vviqData: VVIQScenario[] = [
    {
        id: "relative",
        title: "1. Think of some relative or friend whom you frequently see (but who is not with you at present) and consider carefully the picture that comes before your mind's eye.",
        items: [
            "The exact contour of face, head, shoulders and body.",
            "Characteristic poses of head, attitudes of body, etc.",
            "The precise carriage, length of step, etc., in walking.",
            "The different colours worn in some familiar clothes."
        ]
    },
    {
        id: "sunrise",
        title: "2. Visualize a rising sun. Consider carefully the picture that comes before your mind's eye.",
        items: [
            "The sun is rising above the horizon into a hazy sky.",
            "The sky clears and surrounds the sun with blueness.",
            "The sun is driving clouds away.",
            "The sun is rising into a cloudless sky."
        ]
    },
    {
        id: "shop",
        title: "3. Think of the front of a shop which you often go to. Consider the picture that comes before your mind's eye.",
        items: [
            "The overall appearance of the shop from the opposite side of the road.",
            "A window display including colours, shape and details of individual items for sale.",
            "You are near the entrance. The colour, shape and details of the door.",
            "You enter the shop and go to the counter. The counter assistant serves you. Money changes hands."
        ]
    },
    {
        id: "country",
        title: "4. Finally, think of a country scene which involves trees, mountains and a lake. Consider the picture that comes before your mind's eye.",
        items: [
            "The contours of the landscape.",
            "The colour and shape of the trees.",
            "The colour and shape of the lake.",
            "A strong wind blows on the trees and on the lake causing waves."
        ]
    }
];

export const ratingScale = [
    { value: 1, label: "No image at all, you only 'know' that you are thinking of the object", color: "bg-red-500/20 border-red-500/50" },
    { value: 2, label: "Vague and dim", color: "bg-orange-500/20 border-orange-500/50" },
    { value: 3, label: "Moderately clear and lively", color: "bg-yellow-500/20 border-yellow-500/50" },
    { value: 4, label: "Clear and reasonably vivid", color: "bg-lime-500/20 border-lime-500/50" },
    { value: 5, label: "Perfectly clear and as vivid as real seeing", color: "bg-green-500/20 border-green-500/50" },
];
