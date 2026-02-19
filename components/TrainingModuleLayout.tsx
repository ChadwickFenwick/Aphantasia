'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TrainingModuleLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string; // For the content wrapper
    description: string;
}

export const TrainingModuleLayout = ({
    title,
    subtitle,
    children,
    className,
    description
}: TrainingModuleLayoutProps) => {
    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto h-full flex flex-col min-h-[calc(100vh-100px)]">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 animate-in slide-in-from-left-4 duration-500">
                    <Link
                        href="/training"
                        className="p-3 hover:bg-white/10 rounded-full transition-all text-muted hover:text-white group border border-transparent hover:border-white/10"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-light text-white tracking-wider">
                            {title} {subtitle && <span className="text-secondary font-bold">{subtitle}</span>}
                        </h1>
                        <p className="text-muted mt-1 text-sm md:text-base max-w-2xl">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className={cn("flex-1 flex flex-col relative animate-in fade-in duration-700 delay-150", className)}>
                    {children}
                </div>
            </div>
        </DashboardLayout>
    );
};
