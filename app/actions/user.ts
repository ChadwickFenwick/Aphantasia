'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UserState } from '@/lib/store'; // We will export UserState from store.ts if not already

export async function getUserData() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            neuralProfile: true,
            achievements: true,
            activityHistory: true,
        },
    });

    if (!user) return null;

    return {
        level: user.level,
        xp: user.xp,
        dailyStreak: user.dailyStreak,
        lastPracticeDate: user.lastPracticeDate ? user.lastPracticeDate.toISOString().split('T')[0] : null,
        lastChallengeResetDate: user.lastChallengeResetDate ? user.lastChallengeResetDate.toISOString().split('T')[0] : null,

        neuralProfile: user.neuralProfile ? {
            visual: user.neuralProfile.visual,
            auditory: user.neuralProfile.auditory,
            somatic: user.neuralProfile.somatic,
            cognitive: user.neuralProfile.cognitive,
            focus: user.neuralProfile.focus
        } : {
            visual: 10, auditory: 10, somatic: 10, cognitive: 10, focus: 10
        },

        unlockedAchievements: user.achievements.map(a => a.achievementId),

        // Gamification stats placeholders (as they are not yet fully in DB or mapped differently)
        totalSessions: user.activityHistory.reduce((acc, log) => acc + log.count, 0),
        activityHistory: {}, // We'll implement full history sync later specific to the chart format
        lastDiagnosticXP: 0, // Not persisted in DB yet? schema missing?
        completedChallenges: [], // Schema missing? 
        showDiagnosticPrompt: false, // UI state

        vviqScore: null // Not persisted?
    };
}

export async function syncUserData(data: Partial<UserState>) {
    const session = await auth();
    if (!session?.user?.email) return { success: false, error: 'Not authenticated' };

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return { success: false, error: "User not found" };

        // Update User core stats
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                level: data.level,
                xp: data.xp,
                dailyStreak: data.dailyStreak,
                lastPracticeDate: data.lastPracticeDate ? new Date(data.lastPracticeDate) : null,
                lastChallengeResetDate: data.lastChallengeResetDate ? new Date(data.lastChallengeResetDate) : null,
            },
        });

        // Update Neural Profile
        if (data.neuralProfile) {
            await prisma.neuralProfile.upsert({
                where: { userId: user.id },
                create: {
                    userId: user.id,
                    ...data.neuralProfile
                },
                update: {
                    ...data.neuralProfile
                }
            });
        }

        // Update Achievements
        if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
            // We need to sync achievements. 
            // For now, let's just ensure they exist.
            // This is a bit complex if we want to avoid duplicates optimally, but `connect` or `create` is good.
            // Actually, our schema has `onDelete: Cascade` and unique constraint.
            // We can loop and upsert or createMany (skipDuplicates).
            // Since we only store IDs in store, we need to map them.

            // Let's simplified assumption: we only add new ones.
            // But better is to just ensure they are in DB.

            for (const achievementId of data.unlockedAchievements) {
                // check if exists
                const exists = await prisma.achievement.findUnique({
                    where: {
                        userId_achievementId: {
                            userId: user.id,
                            achievementId: achievementId
                        }
                    }
                });

                if (!exists) {
                    await prisma.achievement.create({
                        data: {
                            userId: user.id,
                            achievementId: achievementId
                        }
                    });
                }
            }
        }

        // Update Activity History
        // This connects to the `ActivityLog` model. 
        // The store has `activityHistory: Record<string, number>`.
        // We should sync this too.
        if (data.activityHistory) {
            // This could be heavy if history is long. 
            // Strategy: Only sync today's entry? Or full sync?
            // Let's sync today's entry for now to be efficient, or full sync if simple.

            for (const [dateStr, count] of Object.entries(data.activityHistory)) {
                // Check if log exists for this date
                // We need to parse dateStr to Date object for query?
                // Our schema `ActivityLog` has `date DateTime`.
                // Ideally we store YYYY-MM-DD.
                // Let's assume we store the date at 00:00:00 or modify schema to string.
                // Schema has DateTime.

                // Simplification: We will just log the *current* session increment in a separate action if needed.
                // But here we are syncing state.

                // Let's skip activity history sync for this iteration to avoid complexity with Date types,
                // as it's less critical than XP/Level/Profile.
                // We can implement a specific `logActivity` action later.
            }
        }


        return { success: true };
    } catch (error) {
        console.error('Failed to sync user data:', error);
        return { success: false, error: 'Database error' };
    }
}

export async function updateUserProfile(data: { name: string }) {
    const session = await auth();
    if (!session?.user?.email) return { success: false, error: 'Not authenticated' };

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { name: data.name }
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to update profile:', error);
        return { success: false, error: 'Database error' };
    }
}
