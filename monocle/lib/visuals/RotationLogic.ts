
// Basic Tetris shapes + Extended
export type ShapeType = 'L-Block' | 'T-Block' | 'Line' | 'S-Block' | 'Z-Block' | 'J-Block' | 'Cube';
export type Rotation = 0 | 90 | 180 | 270;
export type Axis = 'x' | 'y' | 'z';

export interface PuzzleState {
    shape: ShapeType;
    axis: Axis;
    initialRotation: number; // The base rotation of the question shape
    targetRotation: Rotation; // Relative to initialRotation
    options: {
        id: string;
        rotation: [number, number, number]; // Euler angles
        isCorrect: boolean;
    }[];
}

const getRandomShape = (): ShapeType => {
    // Expanded shape set for variety
    const shapes: ShapeType[] = ['L-Block', 'T-Block', 'Line', 'S-Block', 'Z-Block', 'J-Block'];
    return shapes[Math.floor(Math.random() * shapes.length)];
};

const getRandomAxis = (): Axis => {
    return 'y';
};

export const generatePuzzle = (level: number): PuzzleState => {
    const shape = getRandomShape();
    const axis = getRandomAxis();

    // Randomize the STARTING orientation (0, 90, 180, 270)
    // This prevents the "always same way" issue.
    const initialRotations = [0, 90, 180, 270];
    const initialRotation = initialRotations[Math.floor(Math.random() * initialRotations.length)];

    // Random target rotation delta relative to start
    const rotations: Rotation[] = [90, 180, 270];
    const targetRotation = rotations[Math.floor(Math.random() * rotations.length)];

    // Calculate the absolute correct rotation
    let correctRotAbs = initialRotation + targetRotation;
    if (correctRotAbs >= 360) correctRotAbs -= 360;

    // Generate 3 options (1 correct, 2 distractors)
    const options = [];

    // Correct Option
    options.push({
        id: 'correct',
        rotation: axis === 'y' ? [0, d2r(correctRotAbs), 0] : [d2r(correctRotAbs), 0, 0],
        isCorrect: true
    });

    // Distractor 1 (Different rotation)
    let distractorRot1 = correctRotAbs + 90;
    if (distractorRot1 >= 360) distractorRot1 -= 360;
    options.push({
        id: 'distractor-1',
        rotation: axis === 'y' ? [0, d2r(distractorRot1), 0] : [d2r(distractorRot1), 0, 0],
        isCorrect: false
    });

    // Distractor 2 (Another wrong one)
    let distractorRot2 = correctRotAbs + 180;
    if (distractorRot2 >= 360) distractorRot2 -= 360;
    options.push({
        id: 'distractor-2',
        rotation: axis === 'y' ? [0, d2r(distractorRot2), 0] : [d2r(distractorRot2), 0, 0],
        isCorrect: false
    });

    return {
        shape,
        axis,
        initialRotation,
        targetRotation,
        options: shuffle(options) as any
    };
};

function d2r(degrees: number) {
    return degrees * (Math.PI / 180);
}

function shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
