'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseButton } from "@/components/ui/PulseButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, LogIn, Mail } from "lucide-react";

export function SettingsProfile() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <GlassCard className="animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/10" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/3 bg-white/10 rounded" />
                        <div className="h-3 w-1/2 bg-white/5 rounded" />
                    </div>
                </div>
            </GlassCard>
        );
    }

    if (!session?.user) {
        return (
            <GlassCard className="border-primary/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Sign In</h3>
                            <p className="text-sm text-muted">Sync your progress across devices.</p>
                        </div>
                    </div>
                    <PulseButton
                        onClick={() => signIn()}
                        className="bg-primary text-black hover:bg-primary/90"
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        Connect Account
                    </PulseButton>
                </div>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="border-primary/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                            {session.user.name?.[0] || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {session.user.name}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20">
                                PRO
                            </span>
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted">
                            <Mail className="w-3 h-3" />
                            {session.user.email}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <PulseButton
                        onClick={() => signOut()}
                        className="flex-1 md:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </PulseButton>
                </div>
            </div>

            {/* Sync Status - You could add last sync time here if available in store/props */}
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-muted">
                <span>Account Status: Active</span>
                <span className="text-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Cloud Sync Enabled
                </span>
            </div>
        </GlassCard>
    );
}
