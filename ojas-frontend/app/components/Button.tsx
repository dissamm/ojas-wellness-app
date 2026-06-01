import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}: ButtonProps) => {
    const baseClasses = 'font-mono uppercase tracking-[0.2em] rounded-full transition-all duration-300 active:scale-[0.98] font-bold text-center inline-flex items-center justify-center cursor-pointer';

    const variants = {
        primary: 'bg-[#1C1917] text-[#F4EFEA] hover:bg-[#c06080] shadow-sm',
        secondary: 'bg-stone-200/50 border border-stone-300/40 text-stone-600 hover:text-stone-900 hover:bg-stone-200/80',
        outline: 'border border-[#c06080]/50 text-[#c06080] hover:bg-[#c06080] hover:text-white',
    };

    const sizes = {
        sm: 'px-4 py-2 text-[9px] tracking-wider',
        md: 'px-6 py-3 text-[10px] tracking-widest',
        lg: 'px-8 py-4 text-xs tracking-[0.25em]',
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};