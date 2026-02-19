'use client';

import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseButton } from "@/components/ui/PulseButton";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { DailyChallenges } from "@/components/DailyChallenges";
import { MonocleAvatar } from "@/components/visuals/MonocleAvatar";
import { useEffect, useState } from "react";
import { Flame, Star, Zap } from "lucide-react";
import { useSession } from "next-auth/react";

const LEVEL_NAMES: Record<number, string> = {
  1: 'Aphantasia',
  2: 'Hypophantasia',
  3: 'Phantasia',
  4: 'Hyperphantasia',
  5: 'Prophantasia'
};

const LEVEL_EXERCISES: Record<number, { name: string; path: string }> = {
  1: { name: 'Afterimage Retention', path: '/training/afterimage' },
  2: { name: 'Sensory Bridging', path: '/training/sensory' },
  3: { name: 'Prophantasic Projection', path: '/training/projection' },
  4: { name: 'Prophantasic Projection', path: '/training/projection' }, // Fallback
  5: { name: 'Prophantasic Projection', path: '/training/projection' }, // Fallback
};

export default function Home() {
  const { data: session } = useSession();
  const { level, dailyStreak } = useUserStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <DashboardLayout><div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div></DashboardLayout>;
  }

  const currentLevelName = LEVEL_NAMES[level] || 'Unknown';
  const recommendedExercise = LEVEL_EXERCISES[level] || LEVEL_EXERCISES[1];

  const handleQuickStart = () => {
    router.push(recommendedExercise.path);
  };

  return (
    <DashboardLayout>
      <div className="space-y-12">

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[400px]">
          <div className="space-y-6 order-2 lg:order-1 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-widest">
              <Zap className="w-3 h-3" /> System Online
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-tight">
              {session?.user ? (
                <>
                  Welcome Back, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                    {session.user.name?.split(' ')[0] || "Initiate"}.
                  </span>
                </>
              ) : (
                <>
                  Welcome to <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                    Monocle.
                  </span>
                </>
              )}
            </h1>
            <p className="text-muted text-xl max-w-lg leading-relaxed">
              Your neuroplasticity training continues. The Monocle is evolving with your progress.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <PulseButton onClick={handleQuickStart} className="px-8 text-lg">
                INITIATE SEQUENCE
              </PulseButton>
              <GlassCard className="px-6 py-3 flex flex-col justify-center items-start border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-default">
                <span className="text-xs text-muted uppercase tracking-wider">Recommended Protocol</span>
                <span className="font-bold text-white">{recommendedExercise.name}</span>
              </GlassCard>
            </div>
          </div>

          {/* AVATAR */}
          <div className="order-1 lg:order-2 h-[400px] w-full relative animate-in zoom-in duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-purple-500/10 to-transparent blur-3xl opacity-30 rounded-full" />
            <MonocleAvatar />
          </div>
        </div>

        {/* STATS & CHALLENGES GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Challenges (Span 2) */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-secondary rounded-sm" />
              Daily Protocols
            </h2>
            <DailyChallenges />
          </div>

          {/* Quick Stats (Span 1) */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-sm" />
              Status
            </h2>

            <GlassCard className="p-6 flex items-center gap-4">
              <div className="p-4 bg-primary/20 rounded-xl text-primary">
                <Flame className="w-8 h-8" />
              </div>
              <div>
                <div className="text-4xl font-mono text-white font-bold">{dailyStreak}</div>
                <div className="text-xs text-muted uppercase tracking-widest">Day Streak</div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex items-center gap-4">
              <div className="p-4 bg-purple-500/20 rounded-xl text-purple-400">
                <Star className="w-8 h-8" />
              </div>
              <div>
                <div className="text-md text-white font-bold">{currentLevelName}</div>
                <div className="text-xs text-muted uppercase tracking-widest">Level {level}</div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
