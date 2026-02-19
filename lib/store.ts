import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACHIEVEMENTS, UserStats } from '@/lib/gamification/achievements';

interface UserState {
    level: number;
    vviqScore: number | null;
    dailyStreak: number;
    lastPracticeDate: string | null;
    lastChallengeResetDate: string | null;
    xp: number;

    // Gamification Stats
    unlockedAchievements: string[];
    totalSessions: number;
    activityHistory: Record<string, number>; // Date ISO string -> intensity
    lastDiagnosticXP: number;
    showDiagnosticPrompt: boolean;

    // Actions
    setVviqScore: (score: number | null) => void;
    incrementStreak: () => void;
    checkDailyReset: () => void;
    addXP: (amount: number) => void;
    reset: () => void;
    setLevel: (level: number) => void;
    incrementSessionCount: () => void;
    checkAchievements: () => string[]; // Returns newly unlocked achievement IDs
    dismissDiagnosticPrompt: () => void;

    // Neural Profile
    neuralProfile: {
        visual: number;    // Visualization clarity/stability
        auditory: number;  // Sound reproduction
        somatic: number;   // Tactile/Body feel
        cognitive: number; // Mental rotation/manipulation
        focus: number;     // Attention span/Consistency
    };
    updateNeuralProfile: (skills: ('visual' | 'auditory' | 'somatic' | 'cognitive' | 'focus')[], amount: number) => void;

    // Daily Challenge
    completedChallenges: string[];
    completeChallenge: (id: string) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            level: 1, // 1: Aphantasia, 2: Hypophantasia, 3: Phantasia, 4: Hyperphantasia, 5: Prophantasia
            vviqScore: null,
            dailyStreak: 0,
            lastPracticeDate: null,
            lastChallengeResetDate: null,
            completedChallenges: [],
            xp: 0,
            unlockedAchievements: [],
            totalSessions: 0,
            activityHistory: {},
            lastDiagnosticXP: 0,
            showDiagnosticPrompt: false,

            neuralProfile: {
                visual: 10,
                auditory: 10,
                somatic: 10,
                cognitive: 10,
                focus: 10
            },

            updateNeuralProfile: (skills, amount) => set((state) => {
                const newProfile = { ...state.neuralProfile };
                skills.forEach(skill => {
                    // Cap at 100 per skill? Or infinite? Let's cap at 100 for the chart for now.
                    newProfile[skill] = Math.min(100, newProfile[skill] + amount);
                });
                return { neuralProfile: newProfile };
            }),

            setVviqScore: (score) => set((state) => ({
                vviqScore: score,
                // When they complete diagnostic, reset the tracker
                lastDiagnosticXP: state.xp,
                showDiagnosticPrompt: false
            })),

            checkDailyReset: () => {
                const today = new Date().toISOString().split('T')[0];
                const { lastChallengeResetDate } = get();

                if (lastChallengeResetDate !== today) {
                    set({
                        completedChallenges: [],
                        lastChallengeResetDate: today
                    });
                }
            },

            incrementStreak: () => {
                const today = new Date().toISOString().split('T')[0];
                const { lastPracticeDate, dailyStreak } = get();

                if (lastPracticeDate !== today) {
                    set({
                        dailyStreak: dailyStreak + 1,
                        lastPracticeDate: today
                    });
                }
            },

            completeChallenge: (id) => {
                const { completedChallenges } = get();
                if (!completedChallenges.includes(id)) {
                    set({ completedChallenges: [...completedChallenges, id] });
                }
            },

            addXP: (amount) => {
                const { xp, lastDiagnosticXP, showDiagnosticPrompt } = get();
                const newXP = xp + amount;

                // Prompt every 1000 XP
                let shouldPrompt = showDiagnosticPrompt;
                if (!showDiagnosticPrompt && (newXP - lastDiagnosticXP) >= 1000) {
                    shouldPrompt = true;
                }

                set({ xp: newXP, showDiagnosticPrompt: shouldPrompt });
            },

            dismissDiagnosticPrompt: () => set({ showDiagnosticPrompt: false }),

            incrementSessionCount: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                const currentCount = state.activityHistory[today] || 0;

                return {
                    totalSessions: state.totalSessions + 1,
                    activityHistory: {
                        ...state.activityHistory,
                        [today]: currentCount + 1
                    }
                };
            }),

            checkAchievements: () => {
                const state = get();
                const stats: UserStats = {
                    level: state.level,
                    dailyStreak: state.dailyStreak,
                    xp: state.xp,
                    totalSessions: state.totalSessions,
                    perfectScores: 0, // Placeholder for now
                    totalTimeTyped: 0 // Placeholder
                };

                const newUnlocked: string[] = [];
                const updatedAchievements = [...state.unlockedAchievements];

                ACHIEVEMENTS.forEach(achievement => {
                    if (!updatedAchievements.includes(achievement.id)) {
                        if (achievement.condition(stats)) {
                            updatedAchievements.push(achievement.id);
                            newUnlocked.push(achievement.id);
                            // Add XP Reward immediately
                            get().addXP(achievement.xpReward);
                        }
                    }
                });

                if (newUnlocked.length > 0) {
                    set({ unlockedAchievements: updatedAchievements });
                }

                return newUnlocked;
            },

            setLevel: (level) => set({ level }),

            reset: () => set({
                level: 1,
                vviqScore: null,
                dailyStreak: 0,
                lastPracticeDate: null,
                lastChallengeResetDate: null,
                completedChallenges: [],
                xp: 0,
                lastDiagnosticXP: 0,
                showDiagnosticPrompt: false
            }),
        }),
        {
            name: 'monocle-storage',
        }
    )
);
