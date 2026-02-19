export type SceneObjectType = 'cube' | 'sphere' | 'cylinder' | 'cone';
export type SceneColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface SceneObject {
    id: number;
    type: SceneObjectType;
    color: SceneColor;
    position: [number, number, number]; // x, y, z
}

export interface QuizQuestion {
    text: string;
    options: string[];
    correctAnswer: string;
}

export interface MemoryScenario {
    objects: SceneObject[];
    question: QuizQuestion;
}

const COLORS: SceneColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const TYPES: SceneObjectType[] = ['cube', 'sphere', 'cylinder', 'cone'];

// Helper to get random item
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateMemoryScenario = (difficulty: number): MemoryScenario => {
    // Determine number of objects based on difficulty (1 = 3 objects, 2 = 4 objects, etc.)
    const numObjects = 3 + difficulty;
    const objects: SceneObject[] = [];

    // Expanded bounds for higher difficulty
    const bounds = {
        x: 3.5, // -3.5 to 3.5
        y: 2,   // -2 to 2
        z: 1.5  // -1.5 to 1.5
    };

    const minDistance = 1.3; // Minimum distance between centers

    // 1. Generate Objects
    for (let i = 0; i < numObjects; i++) {
        let position: [number, number, number] = [0, 0, 0];
        let valid = false;
        let attempts = 0;

        while (!valid && attempts < 50) {
            position = [
                (Math.random() * bounds.x * 2) - bounds.x,
                (Math.random() * bounds.y * 2) - bounds.y,
                (Math.random() * bounds.z * 2) - bounds.z
            ];

            valid = true;
            // Check collision with existing
            for (const obj of objects) {
                const dx = position[0] - obj.position[0];
                const dy = position[1] - obj.position[1];
                const dz = position[2] - obj.position[2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < minDistance) {
                    valid = false;
                    break;
                }
            }
            attempts++;
        }

        objects.push({
            id: i,
            type: randomChoice(TYPES),
            color: randomChoice(COLORS),
            position: position
        });
    }

    // 2. Generate Question
    // Questions can be: "What color was the [shape]?", "Where was the [color] object?", "How many [shape]s were there?"
    // Let's stick to "What color was the [shape]?" for MVP, ensuring the shape is unique or we specify "The [shape] on the left/right".
    // To be safe, let's target a specific object and ask about its properties.

    const target = randomChoice(objects);

    // Check if target type is unique? If not, question might be ambiguous.
    // Let's try to ask "What shape was the [Color] object?" (if color is unique)
    // Or "What color was the [Shape] object?" (if shape is unique)

    const sameTypeObjects = objects.filter(o => o.type === target.type);
    const sameColorObjects = objects.filter(o => o.color === target.color);

    let question: QuizQuestion;

    if (sameTypeObjects.length === 1) {
        // Unique shape
        question = {
            text: `What color was the ${target.type}?`,
            correctAnswer: target.color,
            options: generateOptions(target.color, COLORS)
        };
    } else if (sameColorObjects.length === 1) {
        // Unique color
        question = {
            text: `What shape was the ${target.color} object?`,
            correctAnswer: target.type,
            options: generateOptions(target.type, TYPES)
        };
    } else {
        // Fallback: Ask about location relative to center? Or just regenerate?
        // Let's just ask "What color was the ${target.type} at position X?" (Too hard).
        // Let's just pick another target or regenerate.
        // Simple fix: Force a "Count" question.
        const count = sameTypeObjects.length;
        question = {
            text: `How many ${target.type}s were there?`,
            correctAnswer: count.toString(),
            options: generateNumericOptions(count)
        };
    }

    return { objects, question };
};

const generateOptions = (correct: string, pool: string[]): string[] => {
    // Filter out correct answer from pool
    const wrongs = pool.filter(item => item !== correct);
    // Shuffle wrongs
    wrongs.sort(() => Math.random() - 0.5);
    // Take up to 3
    const selectedWrongs = wrongs.slice(0, 3);

    // Combine and shuffle
    return [correct, ...selectedWrongs].sort(() => Math.random() - 0.5);
};

const generateNumericOptions = (correct: number): string[] => {
    // We need 3 wrong numbers.
    // Try to stay near 'correct' but ensure uniqueness.
    const uniqueOptions = new Set<string>();
    uniqueOptions.add(correct.toString());

    let range = 1;
    let attempts = 0;

    while (uniqueOptions.size < 4 && attempts < 100) {
        // Expand range if we are stuck
        if (attempts > 20) range = 2;
        if (attempts > 50) range = 5;

        // Generate a candidate
        const offset = Math.floor(Math.random() * (range * 2 + 1)) - range; // -range to +range
        // Avoid 0 offset specifically to save iterations, though Set handles it
        if (offset === 0 && uniqueOptions.size < 4) {
            // force a drift if we are stuck on correct
            // just continue
        }

        const candidate = Math.max(1, correct + offset);
        uniqueOptions.add(candidate.toString());
        attempts++;
    }

    // Fallback if we still don't have enough (e.g. correct=1, we need 2,3,4)
    if (uniqueOptions.size < 4) {
        let i = 1;
        while (uniqueOptions.size < 4) {
            uniqueOptions.add((correct + i).toString());
            uniqueOptions.add(Math.max(1, correct - i).toString());
            i++;
        }
    }

    return Array.from(uniqueOptions).sort(() => Math.random() - 0.5);
};
