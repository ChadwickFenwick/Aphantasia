'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Camera, CameraOff } from 'lucide-react';

export type ShapeType = 'star' | 'circle' | 'cube' | 'pyramid';

interface ARCanvasProps {
    opacity: number; // 0 to 1
    shape?: ShapeType;
}

export const ARCanvas: React.FC<ARCanvasProps> = ({ opacity, shape = 'star' }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setHasPermission(true);
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Camera permission denied from browser.");
                setHasPermission(false);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    if (error) {
        return (
            <GlassCard className="h-[500px] flex flex-col items-center justify-center text-center p-8 border-red-500/20 bg-red-500/5">
                <CameraOff className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-red-500 mb-2">Camera Access Denied</h3>
                <p className="text-muted">{error}</p>
            </GlassCard>
        );
    }

    // Shape Render Logic
    const renderShape = () => {
        const strokeColor = "#00F2FF";
        const filter = "url(#glow)";
        const commonProps = {
            fill: "none",
            stroke: strokeColor,
            strokeWidth: "2",
            filter: filter
        };

        switch (shape) {
            case 'cube':
                return (
                    <g>
                        {/* Front Face */}
                        <rect x="30" y="30" width="40" height="40" {...commonProps} />
                        {/* Back Face */}
                        <rect x="40" y="20" width="40" height="40" {...commonProps} opacity="0.5" />
                        {/* Connecting Lines */}
                        <line x1="30" y1="30" x2="40" y2="20" {...commonProps} />
                        <line x1="70" y1="30" x2="80" y2="20" {...commonProps} />
                        <line x1="30" y1="70" x2="40" y2="60" {...commonProps} />
                        <line x1="70" y1="70" x2="80" y2="60" {...commonProps} />
                    </g>
                );
            case 'pyramid':
                return (
                    <g>
                        {/* Base */}
                        <polygon points="30 70, 70 70, 85 60, 45 60" {...commonProps} opacity="0.5" />
                        {/* Sides */}
                        <polygon points="30 70, 70 70, 50 20" {...commonProps} />
                        <line x1="50" y1="20" x2="85" y2="60" {...commonProps} />
                        <line x1="70" y1="70" x2="85" y2="60" {...commonProps} />
                    </g>
                );
            case 'star':
            default:
                return (
                    <>
                        <polygon
                            points="50 15, 61 35, 85 39, 68 56, 72 80, 50 69, 28 80, 32 56, 15 39, 39 35"
                            {...commonProps}
                        />
                        <circle cx="50" cy="50" r="2" fill={strokeColor} />
                    </>
                );
        }
    };

    return (
        <div className="relative w-full h-[500px] rounded-3xl overflow-hidden border border-white/5 bg-black">
            {/* Webcam Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />

            {/* Overlay Shape */}
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
                style={{ opacity: opacity }}
            >
                {/* SVG Container */}
                <svg width="200" height="200" viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(0,242,255,0.8)]">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {renderShape()}
                </svg>
            </div>

            {/* Guides */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[200px] h-[200px] border border-white/10 rounded-full" />
            </div>
        </div>
    );
};
