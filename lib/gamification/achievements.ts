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
    {
        id: 'chrononaut_4',
        title: 'Eternal One',
        description: 'Maintain a 100-day training streak.',
        icon: 'Clock',
        condition: (stats) => stats.dailyStreak >= 100,
        xpReward: 5000,
        rarity: 'void'
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
    {
        id: 'clarity',
        title: 'Crystal High definition',
        description: 'Reach Level 4: Hyperphantasia.',
        icon: 'Brain',
        condition: (stats) => stats.level >= 4,
        xpReward: 1000,
        rarity: 'legendary'
    },
    {
        id: 'prophantasia',
        title: 'Reality Architect',
        description: 'Reach Level 5: Prophantasia.',
        icon: 'Zap',
        condition: (stats) => stats.level >= 5,
        xpReward: 5000,
        rarity: 'void'
    },

    // Session Milestones (Dedication)
    {
        id: 'initiate',
        title: 'Void Initiate',
        description: 'Complete your first training session.',
        icon: 'Star',
        condition: (stats) => stats.totalSessions >= 1,
        xpReward: 50,
        rarity: 'common'
    },
    {
        id: 'neophyte',
        title: 'Dedicated Student',
        description: 'Complete 10 training sessions.',
        icon: 'Star',
        condition: (stats) => stats.totalSessions >= 10,
        xpReward: 150,
        rarity: 'common'
    },
    {
        id: 'adept',
        title: 'Mind Builder',
        description: 'Complete 50 training sessions.',
        icon: 'Star',
        condition: (stats) => stats.totalSessions >= 50,
        xpReward: 500,
        rarity: 'rare'
    },
    {
        id: 'master',
        title: 'Mental Architect',
        description: 'Complete 100 training sessions.',
        icon: 'Star',
        condition: (stats) => stats.totalSessions >= 100,
        xpReward: 1000,
        rarity: 'legendary'
    },
    {
        id: 'grandmaster',
        title: 'Neuroplasticity God',
        description: 'Complete 500 training sessions.',
        icon: 'Star',
        condition: (stats) => stats.totalSessions >= 500,
        xpReward: 5000,
        rarity: 'void'
    },

    // XP Milestones (Power)
    {
        id: 'spark',
        title: 'First Spark',
        description: 'Earn 1,000 Total XP.',
        icon: 'Zap',
        condition: (stats) => stats.xp >= 1000,
        xpReward: 100,
        rarity: 'common'
    },
    {
        id: 'feedback_loop',
        title: 'Feedback Loop',
        description: 'Earn 5,000 Total XP.',
        icon: 'Zap',
        condition: (stats) => stats.xp >= 5000,
        xpReward: 250,
        rarity: 'common'
    },
    {
        id: 'surge',
        title: 'Neural Surge',
        description: 'Earn 10,000 Total XP.',
        icon: 'Zap',
        condition: (stats) => stats.xp >= 10000,
        xpReward: 500,
        rarity: 'rare'
    },
    {
        id: 'overload',
        title: 'Synaptic Overload',
        description: 'Earn 50,000 Total XP.',
        icon: 'Zap',
        condition: (stats) => stats.xp >= 50000,
        xpReward: 2000,
        rarity: 'legendary'
    },
    {
        id: 'singularity',
        title: 'The Singularity',
        description: 'Earn 100,000 Total XP.',
        icon: 'Zap',
        condition: (stats) => stats.xp >= 100000,
        xpReward: 10000,
        rarity: 'void'
    }
];
