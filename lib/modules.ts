import { Zap, Eye, Navigation, Sliders, Brain, Palette, RefreshCw, Box } from "lucide-react";
import React from 'react';

// Simplified icon reference as component names for serialization if needed, 
// but for static list, direct components are fine.

export interface ModuleData {
    id: string;
    title: string;
    level: string;
    iconName: string; // Identifier for icon lookup if needed
    desc: string;
    tags: string[];
    href: string;
    color: string;
}

export const MODULES: ModuleData[] = [
    // --- LEVEL 1: FUNDAMENTALS ---
    {
        id: 'afterimage',
        title: 'Afterimage Burn',
        level: 'Level 1',
        iconName: 'Zap',
        desc: 'High-intensity retinal printing to stimulate visual retention.',
        tags: ['2 Mins', 'High Contrast'],
        href: '/training/afterimage',
        color: 'pink'
    },
    {
        id: 'pareidolia',
        title: 'Pareidolia',
        level: 'Level 1',
        iconName: 'Question',
        desc: 'Train top-down processing by finding shapes in noise.',
        tags: ['Projection', 'Pattern Recog.'],
        href: '/training/pareidolia',
        color: 'rose'
    },
    {
        id: 'echo',
        title: 'Echo-Location',
        level: 'Level 1',
        iconName: 'Radar',
        desc: 'Train spatial mapping via 3D audio cues.',
        tags: ['Audio-Spatial', 'Blind'],
        href: '/training/echo',
        color: 'cyan'
    },
    {
        id: 'velocity',
        title: 'Velocity Reading',
        level: 'Level 1',
        iconName: 'Zap',
        desc: 'High-speed text streaming to bypass subvocalization.',
        tags: ['Conceptual', 'Speed'],
        href: '/training/velocity',
        color: 'red'
    },

    // --- LEVEL 2: CONSTRUCTION ---
    {
        id: 'tuner',
        title: 'Sensory Tuner',
        level: 'Level 2',
        iconName: 'Palette',
        desc: 'Train raw sensory discrimination details.',
        tags: ['Color', 'Curve'],
        href: '/training/tuner',
        color: 'cyan'
    },
    {
        id: 'synesthesia',
        title: 'Synesthesia Tuner',
        level: 'Level 2',
        iconName: 'Zap',
        desc: 'Train audio-visual cross-wiring.',
        tags: ['Cross-Modal', 'Binding'],
        href: '/training/synesthesia',
        color: 'yellow'
    },
    {
        id: 'drawing',
        title: 'Blind Drawing',
        level: 'Level 2',
        iconName: 'Pencil',
        desc: 'Trace a shape from memory after it disappears.',
        tags: ['Motor', 'Memory'],
        href: '/training/drawing',
        color: 'sky'
    },
    {
        id: 'surface',
        title: 'Surface Scanner',
        level: 'Level 2',
        iconName: 'MousePointer2',
        desc: 'Trace invisible shapes using audio-tactile feedback.',
        tags: ['Audio-Tactile', 'Shape'],
        href: '/training/material',
        color: 'orange'
    },
    {
        id: 'face',
        title: 'Face Studio',
        level: 'Level 2',
        iconName: 'Brain',
        desc: 'Train feature binding by mentally assembling facial features.',
        tags: ['Binding', 'Detail'],
        href: '/training/face',
        color: 'pink'
    },
    {
        id: 'abacus',
        title: 'Mental Abacus',
        level: 'Level 2',
        iconName: 'Calculator',
        desc: 'Train symbolic visualization by manipulating mental dice.',
        tags: ['Symbolic', 'Math'],
        href: '/training/abacus',
        color: 'indigo'
    },
    {
        id: 'rotation',
        title: 'Mental Rotation',
        level: 'Level 2+',
        iconName: 'Box',
        desc: "Train your mind's eye to manipulate objects in 3D space.",
        tags: ['Logic', 'Working Memory'],
        href: '/training/rotation',
        color: 'blue'
    },

    // --- LEVEL 3: SIMULATION ---
    {
        id: 'sensory-bridging',
        title: 'Sensory Bridging',
        level: 'Level 3',
        iconName: 'Navigation',
        desc: 'Spatial navigation and tactile association.',
        tags: ['5 Mins', 'Audio Guided'],
        href: '/training/sensory',
        color: 'indigo'
    },
    {
        id: 'screen-access',
        title: 'Screen Access',
        level: 'Level 3',
        iconName: 'Flash',
        desc: 'Flash priming to train image retention.',
        tags: ['Prophantasia', 'Retention'],
        href: '/training/screen-access',
        color: 'emerald'
    },
    {
        id: 'motion',
        title: 'Relational Motion',
        level: 'Level 3',
        iconName: 'Eye',
        desc: 'Object permanence and occlusion tracking training.',
        tags: ['Dynamic', 'Prediction'],
        href: '/training/motion',
        color: 'green'
    },

    // --- LEVEL 4: PROJECTION ---
    {
        id: 'projection',
        title: 'Prophantasic Projection',
        level: 'Level 4',
        iconName: 'Sliders',
        desc: 'Augmented Reality training for open-eye visualization.',
        tags: ['Camera Req.', 'Advanced'],
        href: '/training/projection',
        color: 'teal'
    },
    {
        id: 'memory',
        title: 'Episodic Recall',
        level: 'Level 4',
        iconName: 'Brain',
        desc: 'Reconstruct a scene from memory.',
        tags: ['Binding', 'Detail'],
        href: '/training/memory',
        color: 'amber'
    },
];

export const getDailyModules = (dateSeed: string) => {
    // Simple PRNG based on date string (YYYY-MM-DD)
    let hash = 0;
    for (let i = 0; i < dateSeed.length; i++) {
        hash = ((hash << 5) - hash) + dateSeed.charCodeAt(i);
        hash |= 0;
    }

    // Seeded random
    const random = () => {
        var t = hash += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    // Pick 3 unique indices
    const indices = new Set<number>();
    while (indices.size < 3) {
        indices.add(Math.floor(random() * MODULES.length));
    }

    return Array.from(indices).map(i => MODULES[i]);
};
