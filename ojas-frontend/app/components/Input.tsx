import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    variant?: 'light' | 'dark';
}

export const Input = ({
    label,
    error,
    helperText,
    variant = 'light',
    className = '',
    ...props
}: InputProps) => {
    const baseStyle = variant === 'dark'
        ? "bg-white/5 border border-white/10 text-white focus:border-[#C27A5D] focus:ring-1 focus:ring-[#C27A5D]/30 placeholder-stone-500"
        : "bg-[#FAF6F0] border border-stone-300/40 text-[#1C1917] focus:border-[#C27A5D] focus:ring-1 focus:ring-[#C27A5D]/30 placeholder-stone-400";

    return (
        <div className="mb-5">
            {label && (
                <label className={`block text-[9px] font-mono uppercase tracking-wider mb-1.5 font-bold ${
                    variant === 'dark' ? 'text-stone-400' : 'text-stone-400'
                }`}>
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 rounded-2xl focus:outline-none transition-all duration-300 text-sm ${
                    error ? 'border-red-400' : ''
                } ${baseStyle} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 font-mono text-[10px] mt-1 uppercase tracking-wider">{error}</p>}
            {helperText && <p className="text-stone-400 font-mono text-[9px] mt-1 uppercase tracking-wider">{helperText}</p>}
        </div>
    );
};