'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Brain, TrendingUp, Settings, Activity, Volume2, Power, Menu, X, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useAudioSettings } from '@/hooks/useAudioSettings';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/lib/store';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Diagnostic', href: '/diagnostic', icon: Brain },
    { name: 'Training', href: '/training', icon: Activity },
    { name: 'Progress', href: '/progress', icon: TrendingUp },
    { name: 'Library', href: '/library', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
];

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
    const { isEnabled, mode, volume, toggleAudio, setVolume, setMode } = useAudioSettings();
    const { dailyStreak } = useUserStore();
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter text-primary">MONOCLE</h1>
                    <p className="text-xs text-muted uppercase tracking-widest mt-1">Visualization Trainer</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="md:hidden text-muted hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-white/5 text-muted hover:text-primary"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                            <span className="font-medium tracking-wide">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-white/5 space-y-4">
                {/* Audio Control Panel - Only visible when enabled */}
                {isEnabled && (
                    <div className="px-4 py-3 bg-white/5 rounded-xl border border-primary/20 animate-in slide-in-from-bottom-5 fade-in duration-500">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Volume2 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Biofeedback</span>
                            </div>
                            <button onClick={toggleAudio} className="text-muted hover:text-white transition-colors">
                                <Power className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex gap-1 mb-3">
                            <button
                                onClick={() => setMode('alpha')}
                                className={cn(
                                    "flex-1 py-1 rounded text-[10px] font-bold uppercase tracking-wide border transition-all",
                                    mode === 'alpha' ? "bg-primary/20 border-primary text-primary" : "bg-black/20 border-transparent text-muted hover:bg-white/5"
                                )}
                            >
                                Alpha
                            </button>
                            <button
                                onClick={() => setMode('gamma')}
                                className={cn(
                                    "flex-1 py-1 rounded text-[10px] font-bold uppercase tracking-wide border transition-all",
                                    mode === 'gamma' ? "bg-accent-1/20 border-accent-1 text-accent-1" : "bg-black/20 border-transparent text-muted hover:bg-white/5"
                                )}
                            >
                                Gamma
                            </button>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="0.5"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                )}

                <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-muted mb-2 uppercase tracking-wide">Daily Streak</p>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-white">{dailyStreak}</span>
                        <span className="text-xs text-muted mb-1">days</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-surface/50 backdrop-blur-md hidden md:flex flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-background/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-40">
                <h1 className="text-xl font-black tracking-tighter text-primary">MONOCLE</h1>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-muted hover:text-white transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <aside className="relative w-[80%] max-w-sm h-full bg-surface shadow-2xl border-r border-white/10 animate-in slide-in-from-left duration-300">
                        <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0">
                <div className="max-w-7xl mx-auto p-4 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
};
