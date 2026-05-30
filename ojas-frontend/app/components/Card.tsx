import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'light' | 'dark';
}

export const Card = ({ children, className = '', variant = 'light', ...props }: CardProps) => {
    const baseStyle = variant === 'dark'
        ? "bg-[#120d22] border border-white/5 shadow-xl text-[#f7f3f8] hover:bg-[#1a0a2e]/90"
        : "bg-white border border-stone-200/60 shadow-[0_4px_20px_-4px_rgba(26,10,46,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(26,10,46,0.08)] text-[#1a0a2e]";

    return (
        <div 
            className={`group relative rounded-3xl transition-all duration-700 overflow-hidden ${baseStyle} ${className}`}
            {...props}
        >
            {/* Ambient rose light glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-[#c06080]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
            <div className="relative z-10 p-7 md:p-8">
                {children}
            </div>
        </div>
    );
};