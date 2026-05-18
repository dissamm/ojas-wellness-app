import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}: InputProps) => {
    return (
        <div className="mb-5">
            {label && (
                <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1.5 font-bold">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 bg-[#FAF7F2]/50 border rounded-2xl focus:outline-none focus:border-[#DF8060] focus:ring-1 focus:ring-[#DF8060]/30 transition-all duration-300 text-sm text-[#1C1917] placeholder-stone-400 ${
                    error ? 'border-red-400' : 'border-stone-300/60'
                } ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 font-mono text-[10px] mt-1 uppercase tracking-wider">{error}</p>}
            {helperText && <p className="text-stone-400 font-mono text-[9px] mt-1 uppercase tracking-wider">{helperText}</p>}
        </div>
    );
};