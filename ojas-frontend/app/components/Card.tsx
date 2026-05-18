import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
    return (
        <div 
            className={`group relative bg-white/40 backdrop-blur-md rounded-3xl border border-stone-200/50 shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(28,25,22,0.05)] transition-all duration-700 overflow-hidden ${className}`}
            {...props}
        >
            {/* Ambient warm light glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#DF8060]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10 p-7 md:p-8">
                {children}
            </div>
        </div>
    );
};