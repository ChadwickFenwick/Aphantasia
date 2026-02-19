import { LucideIcon, Zap, Target, Clock, Flame, Brain, Eye, Activity, Star } from 'lucide-react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // We'll map string names to icons in the UI to keep store serializable
    condition: (stats: UserStats) => boolean;
    xpReward: number;
    rarity: 'common' | 'rare' | 'legendary' | 'void';
}

export interface UserStats {
    level: number;
    dailyStreak: number;
    xp: number;
    totalSessions: number; // We need to track this
    perfectScores: number; // We need to track this
    totalTimeTyped: number; // For Sensory? Or just generic "time trained"
}

export const ACHIEVEMENTS: Achievement[] = [
    // Streak Achievements
    {
        id: 'chrononaut_1',
        title: 'Chrononaut I',
        description: 'Maintain a 3-day training streak.',
        icon: 'Clock',
        condition: (stats) => stats.dailyStreak >= 3,
        xpReward: 100,
        rarity: 'common'
    },
    {
        id: 'chrononaut_2',
        title: 'Chrononaut II',
        description: 'Maintain a 7-day training streak.',
        icon: 'Clock',
        condition: (stats) => stats.dailyStreak >= 7,
        xpReward: 300,
        rarity: 'rare'
    },
    {
        id: 'chrononaut_3',
        title: 'Time Lord',
        description: 'Maintain a 30-day training streak.',
        icon: 'Clock',
        condition: (stats) => stats.dailyStreak >= 30,
        xpReward: 1000,
        rarity: 'legendary'
    },

    // Level Achievements
    {
        id: 'awakening',
        title: 'The Awakening',
        description: 'Reach Level 2: Hypophantasia.',
        icon: 'Eye',
        condition: (stats) => stats.level >= 2,
        xpReward: 200,
        rarity: 'common'
    },
    {
        id: 'lucidity',
        title: 'Lucidity',
        description: 'Reach Level 3: Phantasia.',
        icon: 'Brain',
        condition: (stats) => stats.level >= 3,
        xpReward: 500,
        rarity: 'rare'
    },

    // Skill Achievements (Requires us to track specific stats better, starting simple)
    {
        id: 'initiate',
        title: 'Void Initiate',
        description: 'Complete your first Daily Challenge set.',
        icon: 'Star',
        condition: (stats) => stats.totalSessions >= 1, // We need to increment this
        xpReward: 50,
        rarity: 'common'
    }
];
