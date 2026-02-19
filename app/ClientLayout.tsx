'use client';

import React from 'react';
import { AchievementManager } from "@/components/ui/AchievementManager";
import { DiagnosticPrompt } from "@/components/ui/DiagnosticPrompt";
import { UserSync } from "@/components/auth/UserSync";

import { SessionProvider } from "next-auth/react";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <UserSync />
            {children}
            <AchievementManager />
            <DiagnosticPrompt />
        </SessionProvider>
    );
};
