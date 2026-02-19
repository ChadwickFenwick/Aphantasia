export type DieFace = 1 | 2 | 3 | 4 | 5 | 6;

// Standard Right-Handed Die
// Opposition: 1-6, 2-5, 3-4
export interface DieState {
    top: DieFace;
    front: DieFace;
    right: DieFace;
}

export const OPPOSITE: Record<DieFace, DieFace> = {
    1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1
};

// If we know Top and Front, we can derive Right
// 1 Top, 2 Front -> 3 Right
// 1 Top, 3 Front -> 5 Right
// ... it's hard to map all 24 states manually, but let's try a transition approach.

export const rollForward = (current: DieState): DieState => {
    // Top moves to Front
    // Front moves to Bottom (Opposite Top)
    // Right stays Right
    // Back (Opposite Front) moves to Top

    // Wait. Rolling Forward (away from viewer)
    // Top -> Front
    // Front -> Bottom
    // Bottom -> Back
    // Back -> Top

    // Actually, physically:
    // If I push the top face away from me:
    // Top becomes Back.
    // Front becomes Top.
    // Bottom becomes Front.
    // Back becomes Bottom.

    // Let's define "Roll Forward" as "Top moves to Front" (Rotation around X axis +90deg if Y is up and Z is front)
    // Visually: The face that was on Top is now on the Front face.

    const newFront = current.top;
    const newTop = OPPOSITE[current.front]; // The old Back becomes Top

    return {
        top: newTop,
        front: newFront,
        right: current.right
    };
};

export const rollBackward = (current: DieState): DieState => {
    // Top moves to Back
    // Front moves to Top
    const newTop = current.front;
    const newFront = OPPOSITE[current.top]; // Old Bottom becomes Front

    return {
        top: newTop,
        front: newFront,
        right: current.right
    };
};

export const rollRight = (current: DieState): DieState => {
    // Roll to the Right (Z-axis)
    // Top moves to Right
    // Right moves to Bottom
    // Bottom moves to Left
    // Left moves to Top

    const newRight = OPPOSITE[current.top]; // Top becomes Right side? No.
    // If I roll the die to the right:
    // The Top face becomes the Right face.
    // The Left Face becomes the Top Face.

    // So newRight = oldTop? No.
    // newRight_face = oldTop_face
    // newTop_face = oldLeft_face (Opposite Right)

    const newRightVal = current.top;
    const newTop = OPPOSITE[current.right];

    return {
        top: newTop,
        front: current.front, // Front doesn't change on a sideways roll
        right: newRightVal
    };
};

export const rollLeft = (current: DieState): DieState => {
    // Roll to the Left
    // Top moves to Left
    // Right moves to Top

    const newTop = current.right;
    const newRight = OPPOSITE[current.top]; // Top becomes Left (which is Opposite new Right? No.)
    // If Top becomes Left...
    // The Right face becomes Top? Yes.

    return {
        top: newTop,
        front: current.front,
        right: newRight
    };
};

/*
    Wait. I need to ensure consistency.
    If Top=1, Front=2, Right=3.
    Roll Right:
    Top becomes Left (4).
    Front stays 2.
    Right becomes Top (1).
    So New Top=1? NO.
    
    Start: T=1, F=2, R=3.
    Roll Right (Top moves to Right):
    New Top = Old Left (4).
    New Front = 2.
    New Right = Old Top (1).
    State: T=4, F=2, R=1.
    
    Verify T=4, F=2.
    Opposite T=3 (Bottom). Opposite F=5 (Back).
    Is Right 1?
    If 4 is Top, 2 is Front.
    Standard Die: 
    1,2,3 are counter-clockwise around the corner?
    Let's just trust the transitions.
    
    rollRight implementation above:
    newRightVal = current.top (1) -> Correct.
    newTop = OPPOSITE[current.right] (Opposite 3 = 4) -> Correct.
    
    It seems correct.
*/

export const spinRight = (current: DieState): DieState => {
    // Yaw Rotation (Clockwise looking from Top)
    // Top stays Top.
    // Front moves to Right? No.
    // Front moves to Left.
    // Right moves to Front.

    // Spin Right (face turns right):
    // Front -> Right
    // Right -> Back
    // Back -> Left
    // Left -> Front

    const newFront = OPPOSITE[current.right]; // Left becomes front? No.
    // If I spin the die to the right...
    // The face that was Front is now Right.
    // newRight = current.front.
    // newFront = OPPOSITE[current.right] (Old Left).

    // Wait. "Spin Right" usually means "Turn Right".
    // If I turn right, I see what was on the Right.
    // So New Front = Old Right.
    // New Right = Old Back.

    const newFrontVal = current.right;
    const newRight = OPPOSITE[current.front];

    return {
        top: current.top,
        front: newFrontVal,
        right: newRight
    };
};

export const spinLeft = (current: DieState): DieState => {
    // Turn Left (Look at Left face)
    // New Front = Old Left.
    // New Right = Old Front.

    const newFront = OPPOSITE[current.right];
    const newRight = current.front;

    return {
        top: current.top,
        front: newFront,
        right: newRight
    };
};
