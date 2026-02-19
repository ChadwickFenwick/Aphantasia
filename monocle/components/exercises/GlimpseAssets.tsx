import React from 'react';

// complex assets for "The Glimpse"
// These are high-contrast, multi-part SVGs designed to leave a strong afterimage.

export type GlimpseAssetType = 'face' | 'house' | 'tree' | 'robot';

export const GLIMPSE_ASSETS: { id: GlimpseAssetType; color: string; component: React.FC<{ className?: string; color?: string }> }[] = [
    {
        id: 'face',
        color: '#F59E0B', // Amber
        component: ({ className, color }) => (
            <svg viewBox="0 0 100 100" className={className} style={{ fill: 'none', stroke: color, strokeWidth: '2' }}>
                {/* Head */}
                <circle cx="50" cy="50" r="40" fill="currentColor" fillOpacity="0.1" />
                {/* Eyes - High Contrast */}
                <circle cx="35" cy="40" r="5" fill="currentColor" />
                <circle cx="65" cy="40" r="5" fill="currentColor" />
                {/* Nose */}
                <path d="M 50,45 L 45,60 L 55,60 Z" fill="currentColor" />
                {/* Mouth */}
                <path d="M 30,70 Q 50,85 70,70" stroke="currentColor" strokeWidth="3" fill="none" />
                {/* Hair */}
                <path d="M 15,40 Q 50,0 85,40" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
        )
    },
    {
        id: 'house',
        color: '#EF4444', // Red
        component: ({ className, color }) => (
            <svg viewBox="0 0 100 100" className={className} style={{ fill: 'none', stroke: color, strokeWidth: '2' }}>
                {/* Body */}
                <rect x="20" y="40" width="60" height="50" fill="currentColor" fillOpacity="0.1" />
                {/* Roof */}
                <path d="M 10,40 L 50,10 L 90,40 Z" fill="currentColor" />
                {/* Door */}
                <rect x="42" y="65" width="16" height="25" fill="currentColor" />
                {/* Window */}
                <rect x="28" y="50" width="12" height="12" fill="white" fillOpacity="0.2" stroke="currentColor" />
                <rect x="60" y="50" width="12" height="12" fill="white" fillOpacity="0.2" stroke="currentColor" />
            </svg>
        )
    },
    {
        id: 'robot',
        color: '#06B6D4', // Cyan
        component: ({ className, color }) => (
            <svg viewBox="0 0 100 100" className={className} style={{ fill: 'none', stroke: color, strokeWidth: '2' }}>
                {/* Head */}
                <rect x="30" y="10" width="40" height="30" rx="5" fill="currentColor" fillOpacity="0.1" />
                {/* Eyes */}
                <rect x="35" y="20" width="10" height="5" fill="currentColor" />
                <rect x="55" y="20" width="10" height="5" fill="currentColor" />
                {/* Body */}
                <rect x="25" y="45" width="50" height="40" rx="2" fill="currentColor" fillOpacity="0.1" />
                {/* Arm Left */}
                <line x1="25" y1="50" x2="10" y2="70" stroke="currentColor" strokeWidth="4" />
                {/* Arm Right */}
                <line x1="75" y1="50" x2="90" y2="70" stroke="currentColor" strokeWidth="4" />
                {/* Antenna */}
                <line x1="50" y1="10" x2="50" y2="0" stroke="currentColor" />
                <circle cx="50" cy="0" r="2" fill="currentColor" />
            </svg>
        )
    },
    {
        id: 'tree',
        color: '#22C55E', // Green
        component: ({ className, color }) => (
            <svg viewBox="0 0 100 100" className={className} style={{ fill: 'none', stroke: color, strokeWidth: '2' }}>
                {/* Trunk */}
                <rect x="45" y="60" width="10" height="30" fill="#A16207" stroke="none" />
                {/* Leaves */}
                <circle cx="50" cy="40" r="25" fill="currentColor" />
                <circle cx="35" cy="50" r="15" fill="currentColor" />
                <circle cx="65" cy="50" r="15" fill="currentColor" />
                <circle cx="50" cy="25" r="15" fill="currentColor" />
            </svg>
        )
    }
];
