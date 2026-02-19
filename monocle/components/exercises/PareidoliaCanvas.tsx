'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PulseButton } from '@/components/ui/PulseButton';
import { RefreshCw, Lightbulb, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- SHADER CODE ---
const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform float uScale;
uniform float uSeed;
const float PI = 3.14159265359;

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    // Slow down time
    float time = uTime * 0.2;
    
    // Create multi-octave noise (FBM-like)
    vec2 uv = vUv * uScale;
    
    // Offset by seed to randomize
    float n = snoise(uv + vec2(time * 0.1 + uSeed, uSeed * 10.0));
    n += 0.5 * snoise(uv * 2.0 - vec2(0.0, time * 0.15 + uSeed));
    n += 0.25 * snoise(uv * 4.0 + vec2(time * 0.2, time * 0.2));
    
    // Normalize to 0.0 - 1.0 roughly
    float intensity = n * 0.5 + 0.5;
    
    // Contrast adjustment
    intensity = pow(intensity, 1.2);

    // Color gradient: Dark Void (#050505) to Dim Gray (#333) with hints of Primary (#00F2FF)
    vec3 color1 = vec3(0.02, 0.02, 0.02); // Void
    vec3 color2 = vec3(0.2, 0.2, 0.2); // Cloud
    vec3 color3 = vec3(0.0, 0.95, 1.0); // Cyan tint (Primary)
    
    vec3 finalColor = mix(color1, color2, intensity);
    
    // Add subtle primary tint in high intensity areas
    finalColor += color3 * (pow(intensity, 4.0) * 0.1);

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const NoisePlane = ({ scale, seed }: { scale: number, seed: number }) => {
    const mesh = useRef<THREE.Mesh>(null);
    const material = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uScale: { value: scale },
            uSeed: { value: seed },
        }),
        [scale, seed]
    );

    useFrame((state) => {
        if (material.current) {
            material.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={mesh} position={[0, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <shaderMaterial
                ref={material}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

const PROMPTS = [
    "A Lion's Face",
    "A Flying Bird",
    "A Tree with Roots",
    "An Old Man's Profile",
    "A Geometric Triangle",
    "A Running Horse",
    "A Human Eye",
    "A Mountain Peak",
    "A River Flowing",
    "A Cloud Castle"
];

import { SessionSummary } from "@/components/ui/SessionSummary";

import { useAudioSettings } from '@/hooks/useAudioSettings';
import { Volume2, VolumeX } from 'lucide-react';

// ... (existing shader code remains the same)

export const PareidoliaCanvas = () => {
    const [prompt, setPrompt] = useState("");
    const [scale, setScale] = useState(3.0);
    const [seed, setSeed] = useState(0);
    const [mode, setMode] = useState<'cloud' | 'ganzfeld'>('cloud');
    const [ganzfeldColor, setGanzfeldColor] = useState('#ff00ff'); // Magenta default
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Audio
    const { isEnabled, toggleAudio, setMode: setAudioMode, mode: audioMode } = useAudioSettings();

    // Session State
    const [isComplete, setIsComplete] = useState(false);
    const [startTime] = useState(Date.now());
    const [promptsSeen, setPromptsSeen] = useState(0);

    const newPrompt = () => {
        const random = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
        setPrompt(random);
        // Randomly adjust scale to change the "texture" of the clouds
        setScale(2.0 + Math.random() * 3.0);
        setSeed(Math.random() * 100.0);
        setPromptsSeen(c => c + 1);
    };

    useEffect(() => {
        newPrompt();
    }, []);

    // Switch audio mode when visual mode changes
    useEffect(() => {
        if (mode === 'ganzfeld') {
            setAudioMode('pink'); // Default to pink noise for Ganzfeld
            if (!isEnabled) toggleAudio(); // Auto-start audio for immersion (optional, maybe too intrusive? Let's user decide)
            // actually, let's NOT auto-start, but set the mode so if they click enable it works.
        } else {
            setAudioMode('alpha'); // Back to relaxation
        }
    }, [mode]);

    const handleFinish = () => {
        setIsComplete(true);
        if (isEnabled) toggleAudio(); // Turn off audio when done
    };

    if (isComplete) {
        // ... (existing completion logic)
        const durationMs = Date.now() - startTime;
        const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
        const xp = durationMinutes * 5 + (promptsSeen * 2);
        const durationStr = `${Math.floor(durationMs / 60000)}m ${Math.floor((durationMs % 60000) / 1000)}s`;

        return (
            <SessionSummary
                title="Pareidolia Training"
                xpEarned={xp}
                duration={durationStr}
                skillsTrained={['visual', 'cognitive']}
                onRestart={() => window.location.reload()}
            />
        );
    }

    return (
        <div className={cn(
            "w-full h-full relative flex flex-col items-center justify-center transition-all duration-500",
            isFullscreen ? "fixed inset-0 z-50 bg-black" : ""
        )}>
            {/* HUD */}
            <div className={cn(
                "absolute top-4 left-0 right-0 flex flex-col items-center z-20 pointer-events-none transition-opacity duration-500",
                isFullscreen && "opacity-0 hover:opacity-100" // Hide HUD in fullscreen unless hovered
            )}>
                <div className="bg-black/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex flex-col items-center">
                    <span className="text-xs text-muted font-mono uppercase tracking-widest mb-1">
                        {mode === 'cloud' ? "Find this hidden shape" : "Project this object"}
                    </span>
                    <span className="text-xl font-bold text-white text-shadow-glow">{prompt}</span>
                </div>
            </div>

            {/* Canvas */}
            <div className={cn(
                "w-full max-w-4xl rounded-2xl overflow-hidden border border-white/5 relative transition-colors duration-1000",
                isFullscreen ? "w-full h-full max-w-none rounded-none border-none" : "h-[500px]"
            )}
                style={{ backgroundColor: mode === 'ganzfeld' ? ganzfeldColor : 'black' }}
            >
                {mode === 'cloud' ? (
                    <Canvas camera={{ position: [0, 0, 2] }}>
                        <NoisePlane key={seed} scale={scale} seed={seed} />
                    </Canvas>
                ) : (
                    // Ganzfeld Visuals: Just uniform color with controls overlay
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay" />
                        {/* Optional: Subtle static could be added here via CSS noise image */}
                    </div>
                )}

                {/* Fullscreen Toggle Button */}
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="absolute top-4 right-4 z-30 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-muted hover:text-white transition-all hover:scale-110 opacity-50 hover:opacity-100"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
            </div>

            {/* Controls - Hidden in Fullscreen */}
            {!isFullscreen && (
                <div className="mt-6 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex gap-4">
                        <PulseButton onClick={newPrompt} className="flex gap-2 px-6">
                            <RefreshCw className="w-4 h-4" /> New Prompt
                        </PulseButton>
                        <button onClick={handleFinish} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-muted hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                            Finish Session
                        </button>
                    </div>

                    {/* Settings Panel */}
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">

                        {/* Mode Switch */}
                        <div className="flex bg-black/40 rounded-lg p-1">
                            <button onClick={() => setMode('cloud')} className={cn("px-3 py-1 text-xs rounded-md transition-all", mode === 'cloud' ? "bg-primary text-black" : "text-muted hover:text-white")}>
                                Cloud
                            </button>
                            <button onClick={() => setMode('ganzfeld')} className={cn("px-3 py-1 text-xs rounded-md transition-all", mode === 'ganzfeld' ? "bg-secondary text-white" : "text-muted hover:text-white")}>
                                Ganzfeld
                            </button>
                        </div>

                        <div className="w-px h-8 bg-white/10" />

                        {/* Audio Controls */}
                        <button onClick={toggleAudio} className={cn("p-2 rounded-full transition-colors", isEnabled ? "bg-primary text-black" : "bg-white/10 text-muted")}>
                            {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>

                        {isEnabled && mode === 'ganzfeld' && (
                            <select
                                value={audioMode}
                                onChange={(e) => setAudioMode(e.target.value as any)}
                                className="bg-black/40 border-none text-xs rounded px-2 py-1 text-white focus:ring-0"
                            >
                                <option value="pink">Pink Noise</option>
                                <option value="white">White Noise</option>
                            </select>
                        )}

                        {/* Color Picker for Ganzfeld */}
                        {mode === 'ganzfeld' && (
                            <div className="flex gap-1">
                                {['#ff00ff', '#ff7f00', '#00ff00', '#00ffff'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setGanzfeldColor(c)}
                                        className={cn("w-4 h-4 rounded-full border border-white/20", ganzfeldColor === c && "ring-2 ring-white")}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!isFullscreen && (
                <div className="mt-4 text-center max-w-lg">
                    <p className="text-sm text-muted">
                        {mode === 'cloud'
                            ? <span>Relax your focus. Look <i>through</i> the noise. Project the image.</span>
                            : <span><b>Ganzfeld Effect:</b> Stare at the color. Listen to the noise. Hallucinations may appear. Project the image.</span>
                        }
                    </p>
                </div>
            )}
        </div>
    );
};
