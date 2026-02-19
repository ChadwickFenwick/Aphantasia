'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { cn } from '@/lib/utils';

interface ExerciseCanvasProps {
    children: React.ReactNode;
    opacity?: number;
    className?: string;
}

export const ExerciseCanvas: React.FC<ExerciseCanvasProps> = ({
    children,
    opacity = 1,
    className
}) => {
    return (
        <div className={cn("relative w-full h-[500px] rounded-3xl overflow-hidden border border-white/5 bg-black", className)}>
            <Canvas
                style={{ opacity: opacity }}
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
            >
                <color attach="background" args={['#000']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                {children}

                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>

            {/* Overlay UI or Grids could go here */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </div>
    );
};
