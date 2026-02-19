import React from 'react';
import { cn } from '@/lib/utils'; // Assuming standard cn utility is available or I should create it

interface PulseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PulseButton: React.FC<PulseButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "bg-primary shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:shadow-[0_0_30px_rgba(0,242,255,0.6)]",
        "transition-all duration-300 rounded-full px-8 py-3 font-bold text-black",
        "flex items-center justify-center", // Ensure icon and text are aligned
        "animate-pulse-glow", // Using the custom animation defined in globals.css/tailwind
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
