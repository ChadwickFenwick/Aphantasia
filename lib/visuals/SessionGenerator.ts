export type ShapeType = 'gabor' | 'sphere' | 'cube' | 'wireframe';

export interface SessionConfig {
    shape: ShapeType;
    color: string;
    duration: number; // in seconds
    description: string;
    params?: {
        angle?: number; // for gabor
    }
}

const COLORS = [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#00FFFF', // Cyan
    '#FF00FF', // Magenta
];

export const generateSession = (level: number): SessionConfig => {
    // Level 1: Aphantasia (Simple Primitives + Gabor Priming)
    if (level === 1) {
        const roll = Math.random();

        // 30% chance of Gabor Patch (Priming)
        if (roll < 0.3) {
            return {
                shape: 'gabor',
                color: '#FFFFFF', // High contrast white
                duration: 30, // Shorter priming
                description: 'Cortical Priming Pattern',
                params: { angle: Math.random() * Math.PI }
            };
        }

        // 70% chance of Simple Shape
        const shape = Math.random() > 0.5 ? 'sphere' : 'cube';
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        return {
            shape,
            color,
            duration: 45,
            description: `High Contrast ${shape === 'sphere' ? 'Sphere' : 'Cube'}`
        };
    }

    // Level 2: Hypophantasia (Dynamic Wireframes)
    if (level === 2) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {
            shape: 'wireframe',
            color,
            duration: 60,
            description: 'Complex 3D Wireframe'
        };
    }

    // Level 3+: Phantasia (Complex/Composite - Placeholder for now w/ randoms)
    // Fallback to random everything for higher levels
    const shapes: ShapeType[] = ['sphere', 'cube', 'wireframe'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    return {
        shape,
        color,
        duration: 60,
        description: 'Advanced Visualization Object'
    };
};
