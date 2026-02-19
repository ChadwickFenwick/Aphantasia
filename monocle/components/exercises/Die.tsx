'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

interface DieProps {
    value: number;
    position: [number, number, number];
    isRolling?: boolean;
}

export const Die = ({ value, position, isRolling = false }: DieProps) => {
    const meshRef = useRef<THREE.Group>(null);
    const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

    // Dice Face Rotations to show correct value up
    // Default: 1 is UP (Y+)
    // 2: X-90
    // 3: Z+90
    // 4: Z-90
    // 5: X+90
    // 6: X+180
    const faceRotations: Record<number, [number, number, number]> = {
        1: [0, 0, 0],
        2: [-Math.PI / 2, 0, 0],
        3: [0, 0, Math.PI / 2],
        4: [0, 0, -Math.PI / 2],
        5: [Math.PI / 2, 0, 0],
        6: [Math.PI, 0, 0]
    };

    useFrame((state, delta) => {
        if (meshRef.current) {
            if (isRolling) {
                // Random spin
                meshRef.current.rotation.x += delta * 15;
                meshRef.current.rotation.y += delta * 12;
                meshRef.current.rotation.z += delta * 10;
            } else {
                // Smooth lerp to target rotation
                const target = faceRotations[value] || [0, 0, 0];
                meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, target[0], delta * 10);
                meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, target[1], delta * 10);
                meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, target[2], delta * 10);
            }
        }
    });

    return (
        <group ref={meshRef} position={position}>
            <RoundedBox args={[2, 2, 2]} radius={0.3} smoothness={4}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </RoundedBox>

            {/* Pips / Numbers */}
            {/* 1 (Top) */}
            <Dot position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]} />

            {/* 6 (Bottom) */}
            <group position={[0, -1.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <Dot position={[-0.5, 0, -0.5]} /> <Dot position={[0.5, 0, -0.5]} />
                <Dot position={[-0.5, 0, 0]} />    <Dot position={[0.5, 0, 0]} />
                <Dot position={[-0.5, 0, 0.5]} />  <Dot position={[0.5, 0, 0.5]} />
            </group>

            {/* 2 (Front) */}
            <group position={[0, 0, 1.01]} rotation={[0, 0, 0]}>
                <Dot position={[-0.5, 0.5, 0]} /> <Dot position={[0.5, -0.5, 0]} />
            </group>

            {/* 5 (Back) */}
            <group position={[0, 0, -1.01]} rotation={[0, Math.PI, 0]}>
                <Dot position={[-0.5, 0.5, 0]} /> <Dot position={[0.5, -0.5, 0]} />
                <Dot position={[0.5, 0.5, 0]} /> <Dot position={[-0.5, -0.5, 0]} />
                <Dot position={[0, 0, 0]} />
            </group>

            {/* 3 (Right) */}
            <group position={[1.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <Dot position={[-0.5, 0.5, 0]} /> <Dot position={[0, 0, 0]} /> <Dot position={[0.5, -0.5, 0]} />
            </group>

            {/* 4 (Left) */}
            <group position={[-1.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <Dot position={[-0.5, 0.5, 0]} /> <Dot position={[0.5, 0.5, 0]} />
                <Dot position={[-0.5, -0.5, 0]} /> <Dot position={[0.5, -0.5, 0]} />
            </group>
        </group>
    );
};

const Dot = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => (
    <mesh position={position} rotation={rotation as any}>
        <circleGeometry args={[0.2, 32]} />
        <meshBasicMaterial color="#00F2FF" toneMapped={false} />
    </mesh>
);
