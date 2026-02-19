'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Stars, Sparkles, MeshTransmissionMaterial, Edges, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useUserStore } from '@/lib/store';

// --- Components ---

// Level 1: The Blueprint (Vintage Sci-Fi Wireframe)
const WireframeCore = () => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.005;
            ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <mesh ref={ref}>
            <dodecahedronGeometry args={[1.5, 0]} />
            <meshBasicMaterial color="#000000" transparent opacity={0} />
            <Edges scale={1.0} threshold={15} color="#06b6d4" />
        </mesh>
    );
};

// Level 2: The Structure (Reinforced Nodes)
const StructuralNodes = () => {
    // Places spheres at vertices of a dodecahedron (approximated conceptually or using a known layout)
    // For simplicity, we'll add a secondary geometric cage that looks "structural"
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.005;
            ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[1.5, 0]} />
            <meshBasicMaterial color="#000000" transparent opacity={0} wireframe />
            <Edges scale={1.0} threshold={15} color="#475569" renderOrder={-1} />
            {/* Emissive visual accents at nodes */}
            <points>
                <icosahedronGeometry args={[1.5, 0]} />
                <pointsMaterial size={0.15} color="#60a5fa" />
            </points>
        </mesh>
    );
};

// Level 3: The Power Source (Inner Engine)
const PowerCore = () => {
    return (
        <mesh>
            <octahedronGeometry args={[0.8, 0]} />
            <MeshDistortMaterial
                color="#7000FF"
                emissive="#7000FF"
                emissiveIntensity={2}
                speed={5}
                distort={0.3}
                radius={1}
            />
        </mesh>
    );
};

// Level 4: The Lens (Glass Shell)
const GlassShell = () => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y -= 0.01; // Counter-rotate
        }
    });
    return (
        <mesh ref={ref}>
            <dodecahedronGeometry args={[1.6, 0]} />
            <MeshTransmissionMaterial
                backside
                samples={4}
                resolution={512}
                thickness={0.5}
                roughness={0.1}
                transmission={0.95}
                ior={1.2}
                chromaticAberration={0.1}
                anisotropy={0.1}
                color="#ccfbf1"
            />
        </mesh>
    );
};

// Level 5: The Interface (Holographic Data)
const HoloInterface = () => {
    const ring1 = useRef<THREE.Mesh>(null);
    const ring2 = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ring1.current) {
            ring1.current.rotation.z += 0.01;
            ring1.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
        }
        if (ring2.current) {
            ring2.current.rotation.z -= 0.015;
            ring2.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <group>
            {/* Data Ring 1 */}
            <mesh ref={ring1}>
                <torusGeometry args={[2.2, 0.02, 16, 100]} />
                <meshBasicMaterial color="#00F2FF" transparent opacity={0.6} />
            </mesh>
            {/* Data Ring 2 */}
            <mesh ref={ring2} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.01, 16, 100]} />
                <meshBasicMaterial color="#7000FF" transparent opacity={0.4} />
            </mesh>
            {/* Floating Data Particles */}
            <Sparkles count={60} scale={5} size={3} speed={0.4} opacity={0.5} color="#00F2FF" />
        </group>
    );
};

export const MonocleAvatar = () => {
    const { level } = useUserStore();
    const effectiveLevel = level || 1;

    return (
        <div className="w-full h-full min-h-[300px] relative">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                <pointLight position={[-10, -5, -5]} intensity={1} color="#7000FF" />

                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                    <group>
                        {/* Additive Layers */}

                        {/* Lvl 1: The Blueprint */}
                        {effectiveLevel >= 1 && <WireframeCore />}

                        {/* Lvl 2: The Frame */}
                        {effectiveLevel >= 2 && <StructuralNodes />}

                        {/* Lvl 3: The Core */}
                        {effectiveLevel >= 3 && <PowerCore />}

                        {/* Lvl 4: The Shell */}
                        {effectiveLevel >= 4 && <GlassShell />}

                        {/* Lvl 5: The Interface */}
                        {effectiveLevel >= 5 && <HoloInterface />}
                    </group>
                </Float>

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};
