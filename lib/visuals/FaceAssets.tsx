import React from 'react';

export interface FaceFeature {
    id: string;
    name: string;
    path: React.ReactNode;
}

export const EYES: FaceFeature[] = [
    {
        id: 'eyes-almond',
        name: 'Almond Eyes',
        path: (
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M40 80C50 70 70 70 80 80C70 90 50 90 40 80Z" />
                <circle cx="60" cy="80" r="5" fill="currentColor" />
                <path d="M120 80C130 70 150 70 160 80C150 90 130 90 120 80Z" />
                <circle cx="140" cy="80" r="5" fill="currentColor" />
            </g>
        )
    },
    {
        id: 'eyes-round',
        name: 'Round Eyes',
        path: (
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="60" cy="80" r="15" />
                <circle cx="60" cy="80" r="5" fill="currentColor" />
                <circle cx="140" cy="80" r="15" />
                <circle cx="140" cy="80" r="5" fill="currentColor" />
            </g>
        )
    },
    {
        id: 'eyes-tired',
        name: 'Tired Eyes',
        path: (
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M45 85 C 55 75, 65 75, 75 85" />
                <path d="M45 90 C 55 95, 65 95, 75 90" />
                <circle cx="60" cy="85" r="3" fill="currentColor" />

                <path d="M125 85 C 135 75, 145 75, 155 85" />
                <path d="M125 90 C 135 95, 145 95, 155 90" />
                <circle cx="140" cy="85" r="3" fill="currentColor" />
            </g>
        )
    }
];

export const NOSES: FaceFeature[] = [
    {
        id: 'nose-button',
        name: 'Button Nose',
        path: (
            <path d="M95 110 Q 100 125, 105 110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )
    },
    {
        id: 'nose-straight',
        name: 'Straight Nose',
        path: (
            <path d="M100 90 L 95 120 L 105 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )
    },
    {
        id: 'nose-wide',
        name: 'Wide Nose',
        path: (
            <path d="M90 120 Q 100 125, 110 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )
    }
];

export const MOUTHS: FaceFeature[] = [
    {
        id: 'mouth-smile',
        name: 'Smile',
        path: (
            <path d="M70 145 Q 100 165, 130 145" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )
    },
    {
        id: 'mouth-frown',
        name: 'Frown',
        path: (
            <path d="M70 155 Q 100 135, 130 155" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )
    },
    {
        id: 'mouth-neutral',
        name: 'Neutral',
        path: (
            <line x1="80" y1="150" x2="120" y2="150" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )
    }
];

export const HEAD_SHAPE = (
    <rect x="25" y="25" width="150" height="175" rx="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20" />
);
