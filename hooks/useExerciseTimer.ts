import { useState, useEffect, useRef } from 'react';

type Phase = 'idle' | 'burn' | 'dissolve' | 'dark' | 'complete';

interface UseExerciseTimerProps {
    burnDuration?: number; // seconds
    darkDuration?: number; // seconds
    onComplete?: () => void;
}

export const useExerciseTimer = ({
    burnDuration = 30,
    darkDuration = 10,
    onComplete
}: UseExerciseTimerProps) => {
    const [phase, setPhase] = useState<Phase>('idle');
    const [timeLeft, setTimeLeft] = useState(burnDuration);
    const [opacity, setOpacity] = useState(1);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startExercise = () => {
        setPhase('burn');
        setTimeLeft(burnDuration);
        setOpacity(1);
    };

    const triggerDissolve = () => {
        setPhase('dissolve');

        // Animate opacity from 1 to 0 over 1.5s
        const startTime = Date.now();
        const duration = 1500;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setOpacity(1 - progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setPhase('dark');
                setTimeLeft(darkDuration);
            }
        };

        requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (phase === 'burn' || phase === 'dark') {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (phase === 'burn') {
                            if (timerRef.current) clearInterval(timerRef.current);
                            // Auto-trigger dissolve when time runs out
                            // We need to call triggerDissolve() here, but we can't call it directly inside the setState callback easily
                            // unless we extract it or use an effect. 
                            // Better approach: Set time to 0, then use an effect to watchtimeLeft/phase.
                            return 0;
                        }
                        if (phase === 'dark') {
                            if (timerRef.current) clearInterval(timerRef.current);
                            setPhase('complete');
                            if (onComplete) onComplete();
                            return 0;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [phase, darkDuration, onComplete]);

    // Auto-trigger dissolve when burn time ends
    useEffect(() => {
        if (phase === 'burn' && timeLeft === 0) {
            triggerDissolve();
        }
    }, [phase, timeLeft]);

    return {
        phase,
        timeLeft,
        opacity,
        startExercise,
        triggerDissolve
    };
};
