export interface MotionScenario {
    id: string;
    speed: number; // Units per second
    direction: 'left-to-right' | 'right-to-left';
    occluderWidth: number;
    totalDistance: number; // Total path length
}

export const generateScenario = (level: number): MotionScenario => {
    // Level 1: Slow, short occlusion
    // Level 2: Fast, long occlusion
    // Level 3: Variable speed?

    const isLeftToRight = Math.random() > 0.5;
    const baseSpeed = 2 + (level * 0.5); // 2.5 to 4.5 units/sec

    return {
        id: Math.random().toString(36).substring(7),
        speed: baseSpeed,
        direction: isLeftToRight ? 'left-to-right' : 'right-to-left',
        occluderWidth: 4 + (level * 1), // Increases with level
        totalDistance: 12
    };
};
