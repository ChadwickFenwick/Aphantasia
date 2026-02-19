'use client';

import React from 'react';
import { AchievementManager } from "@/components/ui/AchievementManager";
import { DiagnosticPrompt } from "@/components/ui/DiagnosticPrompt";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <AchievementManager />
            <DiagnosticPrompt />
        </>
    );
};
