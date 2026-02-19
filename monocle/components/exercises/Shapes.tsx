'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const GlowingSphere = ({ color = "#ff0000" }: { color?: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            //   meshRef.current.rotation.x += delta * 0.2;
            //   meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2}
                toneMapped={false}
            />
        </mesh>
    );
};

export const BrightCube = ({ color = "#0000ff" }: { color?: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.5}
            />
        </mesh>
    );
};

// Level 0: Priming - Gabor Patch (Sine wave grating)
// We use a shader material for this to generate the stripes
const GaborMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#ffffff') },
        uFrequency: { value: 10.0 },
        uAngle: { value: 0.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uFrequency;
      uniform float uAngle;
      varying vec2 vUv;

      void main() {
        // Rotate UV
        float c = cos(uAngle);
        float s = sin(uAngle);
        mat2 rot = mat2(c, -s, s, c);
        vec2 uv = rot * (vUv - 0.5) + 0.5;

        // Generate Sine Grating
        float intensity = 0.5 + 0.5 * sin(uv.x * uFrequency * 6.28 + uTime);
        
        // Gaussian window (circular softness)
        vec2 center = vUv - 0.5;
        float dist = length(center);
        float window = exp(-dist * dist * 8.0);

        gl_FragColor = vec4(uColor * intensity, window);
      }
    `
};

export const GaborPatch = ({ color = "#ffffff", angle = 0 }: { color?: string, angle?: number }) => {
    const shaderRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (shaderRef.current) {
            // Slow drift
            shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <mesh>
            <planeGeometry args={[4, 4]} />
            <shaderMaterial
                ref={shaderRef}
                args={[GaborMaterial]}
                uniforms-uColor-value={new THREE.Color(color)}
                uniforms-uAngle-value={angle}
                transparent={true}
            />
        </mesh>
    );
};

// Level 2: Dynamic Wireframe
export const DynamicWireframe = ({ color = "#00ff00" }: { color?: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.4;
            meshRef.current.rotation.y += delta * 0.6;
        }
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[2, 1]} />
            <meshBasicMaterial
                color={color}
                wireframe={true}
                transparent={true}
                opacity={0.8}
            />
        </mesh>
    );
};
