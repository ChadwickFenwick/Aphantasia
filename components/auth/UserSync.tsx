'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/lib/store';
import { getUserData, syncUserData } from '@/app/actions/user';

export function UserSync() {
    const { data: session } = useSession();
    const { hydrateFromDb, ...state } = useUserStore();

    // Fetch data on load
    useEffect(() => {
        if (session?.user) {
            getUserData().then((data) => {
                if (data) {
                    hydrateFromDb(data);
                }
            });
        }
    }, [session, hydrateFromDb]);

    // Sync data on changes (debounced?)
    // For now, let's just sync on important changes or use a simple effect with debounce.
    // Or we rely on explicit sync calls in store (which needs async support in store/actions).
    // The simplest "auto-save" is an effect here.

    useEffect(() => {
        if (!session?.user) return;

        const timer = setTimeout(() => {
            syncUserData({
                level: state.level,
                xp: state.xp,
                dailyStreak: state.dailyStreak,
                lastPracticeDate: state.lastPracticeDate,
                lastChallengeResetDate: state.lastChallengeResetDate,
                neuralProfile: state.neuralProfile,
                unlockedAchievements: state.unlockedAchievements,
                // activityHistory: state.activityHistory
            });
        }, 2000); // Debounce 2s

        return () => clearTimeout(timer);
    }, [
        session,
        state.level,
        state.xp,
        state.dailyStreak,
        state.lastPracticeDate,
        state.lastChallengeResetDate,
        state.neuralProfile,
        state.unlockedAchievements
    ]);

    return null;
}
