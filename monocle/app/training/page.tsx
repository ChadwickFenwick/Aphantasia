'use client';

import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { MODULES, ModuleData } from "@/lib/modules";

// Icon Mapper
import { Zap, Eye, Navigation, Sliders, Brain, Palette, RefreshCw, Box, Calculator, Radar, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

const IconMap: Record<string, any> = {
    'Zap': <Zap className="w-6 h-6" />,
    'Question': <span className="text-2xl font-bold">❓</span>,
    'Palette': <Palette className="w-6 h-6" />,
    'Pencil': <span className="text-2xl font-bold">✍️</span>,
    'Box': <Box className="w-6 h-6" />,
    'Navigation': <Navigation className="w-6 h-6" />,
    'Flash': <span className="text-2xl font-bold">⚡</span>,
    'Eye': <Eye className="w-6 h-6" />,
    'Sliders': <Sliders className="w-6 h-6" />,
    'Brain': <Brain className="w-6 h-6" />,
    'Calculator': <Calculator className="w-6 h-6" />,
    'Radar': <Radar className="w-6 h-6" />,
    'MousePointer2': <MousePointer2 className="w-6 h-6" />,
};

const ColorMap: Record<string, string> = {
    pink: 'bg-pink-500/20 text-pink-500 border-l-pink-500 group-hover:text-pink-500',
    rose: 'bg-rose-500/20 text-rose-500 border-l-rose-500 group-hover:text-rose-500',
    cyan: 'bg-cyan-500/20 text-cyan-500 border-l-cyan-500 group-hover:text-cyan-500',
    sky: 'bg-sky-500/20 text-sky-500 border-l-sky-500 group-hover:text-sky-500',
    blue: 'bg-blue-500/20 text-blue-500 border-l-blue-500 group-hover:text-blue-500',
    indigo: 'bg-indigo-500/20 text-indigo-500 border-l-indigo-500 group-hover:text-indigo-500',
    emerald: 'bg-emerald-500/20 text-emerald-500 border-l-emerald-500 group-hover:text-emerald-500',
    green: 'bg-green-500/20 text-green-500 border-l-green-500 group-hover:text-green-500',
    teal: 'bg-teal-500/20 text-teal-500 border-l-teal-500 group-hover:text-teal-500',
    amber: 'bg-amber-500/20 text-amber-500 border-l-amber-500 group-hover:text-amber-500',
    yellow: 'bg-yellow-500/20 text-yellow-500 border-l-yellow-500 group-hover:text-yellow-500',
    orange: 'bg-orange-500/20 text-orange-500 border-l-orange-500 group-hover:text-orange-500',
    red: 'bg-red-500/20 text-red-500 border-l-red-500 group-hover:text-red-500',
};

const BadgeMap: Record<string, string> = {
    pink: 'text-pink-500 border-pink-500/20',
    rose: 'text-rose-500 border-rose-500/20',
    cyan: 'text-cyan-500 border-cyan-500/20',
    sky: 'text-sky-500 border-sky-500/20',
    blue: 'text-blue-500 border-blue-500/20',
    indigo: 'text-indigo-500 border-indigo-500/20',
    emerald: 'text-emerald-500 border-emerald-500/20',
    green: 'text-green-500 border-green-500/20',
    teal: 'text-teal-500 border-teal-500/20',
    amber: 'text-amber-500 border-amber-500/20',
    yellow: 'text-yellow-500 border-yellow-500/20',
    orange: 'text-orange-500 border-orange-500/20',
    red: 'text-red-500 border-red-500/20',
};

import { useUserStore } from "@/lib/store";
import { Lock } from "lucide-react";

// Helper to filter modules by level category
const getModulesByLevel = (minLvl: number, maxLvl: number) => {
    return MODULES.filter(m => {
        const lvl = parseInt(m.level.replace(/\D/g, ''));
        return lvl >= minLvl && lvl <= maxLvl;
    });
};

const ModuleGrid = ({ modules, userLevel }: { modules: ModuleData[], userLevel: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
            const reqLevel = parseInt(mod.level.replace(/\D/g, ''));
            const isLocked = userLevel < reqLevel;
            const badgeClass = BadgeMap[mod.color] || BadgeMap.pink;

            return (
                <Link key={mod.id} href={mod.href} className={cn("group", isLocked && "pointer-events-none opacity-50")}>
                    <GlassCard className={cn("h-full hover:bg-white/10 transition-all border-l-4", `border-l-${mod.color}-500`)}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-lg transition-colors", `bg-${mod.color}-500/20 text-${mod.color}-500`)}>
                                {IconMap[mod.iconName]}
                            </div>
                            {isLocked ? (
                                <span className="text-xs font-mono text-muted uppercase tracking-widest border border-white/10 px-2 py-1 rounded flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> {mod.level.toUpperCase()}
                                </span>
                            ) : (
                                <span className={cn("text-xs font-mono uppercase tracking-widest border px-2 py-1 rounded", badgeClass)}>
                                    {mod.level}
                                </span>
                            )}
                        </div>
                        <h3 className={cn("text-xl font-bold text-white mb-2 transition-colors", `group-hover:text-${mod.color}-500`)}>
                            {mod.title}
                        </h3>
                        <p className="text-muted text-sm mb-4 line-clamp-2">{mod.desc}</p>
                        <div className="flex flex-wrap gap-2 text-[10px] text-muted uppercase tracking-wide">
                            {mod.tags.map(t => <span key={t} className="bg-white/5 px-2 py-0.5 rounded-full">• {t}</span>)}
                        </div>
                    </GlassCard>
                </Link>
            );
        })}
    </div>
);

export default function TrainingPage() {
    const { level } = useUserStore();

    const lvl1 = getModulesByLevel(1, 1);
    const lvl2 = getModulesByLevel(2, 2);
    const lvl3 = getModulesByLevel(3, 3);
    const lvl4 = getModulesByLevel(4, 5);

    return (
        <DashboardLayout>
            <header className="mb-12">
                <h1 className="text-4xl font-black text-white tracking-tighter mb-4">Training Modules</h1>
                <p className="text-muted text-lg">Select a protocol to begin your session.</p>
            </header>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-pink-500" />
                    Level 1: Fundamentals
                    <span className="text-xs font-normal text-muted ml-auto">Sensory Priming • Input Stability</span>
                </h2>
                <ModuleGrid modules={lvl1} userLevel={level} />
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2 flex items-center gap-3">
                    <Box className="w-6 h-6 text-cyan-500" />
                    Level 2: Construction
                    <span className="text-xs font-normal text-muted ml-auto">Binding • Manipulation • Structure</span>
                </h2>
                <ModuleGrid modules={lvl2} userLevel={level} />
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2 flex items-center gap-3">
                    <Navigation className="w-6 h-6 text-emerald-500" />
                    Level 3: Simulation
                    <span className="text-xs font-normal text-muted ml-auto">Dynamics • Navigation • Retention</span>
                </h2>
                <ModuleGrid modules={lvl3} userLevel={level} />
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2 flex items-center gap-3">
                    <Brain className="w-6 h-6 text-amber-500" />
                    Level 4: Projection
                    <span className="text-xs font-normal text-muted ml-auto">Open-Eye • Scene Reconstruction</span>
                </h2>
                <ModuleGrid modules={lvl4} userLevel={level} />
            </section>

        </DashboardLayout>
    );
}
