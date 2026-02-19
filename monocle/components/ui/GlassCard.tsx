import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
