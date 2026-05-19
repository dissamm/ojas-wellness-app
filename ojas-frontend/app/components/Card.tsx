import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'light' | 'dark';
}

export const Card = ({ children, className = '', variant = 'light', ...props }: CardProps) => {
    const baseStyle = variant === 'dark'
        ? "bg-[#1C1917] border border-[#1C1917] shadow-xl text-[#F4EFEA] hover:bg-stone-900 dark:bg-stone-950/80 dark:border-stone-800"
        : "bg-white/50 border border-stone-300/40 shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(28,25,22,0.05)] text-[#1C1917] dark:bg-stone-900/60 dark:border-stone-800/80 dark:text-[#FAF6F0]";

    return (
        <div 
            className={`group relative rounded-3xl transition-all duration-700 overflow-hidden ${baseStyle} ${className}`}
            {...props}
        >
            {/* Ambient warm light glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-[#C27A5D]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
            <div className="relative z-10 p-7 md:p-8">
                {children}
            </div>
        </div>
    );
};