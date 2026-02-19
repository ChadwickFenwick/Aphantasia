'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseButton } from "@/components/ui/PulseButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { User, LogOut, LogIn, Mail, Edit2, Check, X } from "lucide-react";
import { updateUserProfile } from "@/app/actions/user";

export function SettingsProfile() {
    const { data: session, status, update } = useSession();

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

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(session.user.name || "");

    const handleSaveName = async () => {
        if (!newName.trim()) return;

        // Optimistic update
        const originalName = session?.user?.name;

        try {
            await updateUserProfile({ name: newName });
            await update({ name: newName }); // Update session
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update name", error);
            // Revert on error if needed, though session update might handle it
        }
    };

    return (
        <GlassCard className="border-primary/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                            {session.user.name?.[0] || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1 flex-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white font-bold text-lg w-full md:w-auto focus:outline-none focus:border-primary"
                                    autoFocus
                                />
                                <div className="flex gap-1">
                                    <button onClick={handleSaveName} className="p-1 hover:bg-green-500/20 text-green-400 rounded">
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-red-500/20 text-red-400 rounded">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 group">
                                {session.user.name}
                                <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 hover:bg-white/10 p-1 rounded transition-all text-muted hover:text-white">
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20">
                                    PRO
                                </span>
                            </h3>
                        )}
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
