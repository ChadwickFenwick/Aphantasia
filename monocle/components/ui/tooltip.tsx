'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {React.Children.map(children, child => {
                // @ts-ignore
                return React.cloneElement(child, { open });
            })}
        </div>
    );
};

const TooltipTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div {...props}>{children}</div>;
};

const TooltipContent = ({ children, className, open }: { children: React.ReactNode, className?: string, open?: boolean }) => {
    if (!open) return null;

    return (
        <div className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-md bg-black border border-white/10 text-xs text-white z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-200",
            className
        )}>
            {children}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
        </div>
    );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
