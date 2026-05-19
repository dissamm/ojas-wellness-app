import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    variant?: 'light' | 'dark';
}

export const Select = ({
    label,
    error,
    options,
    variant = 'light',
    className = '',
    ...props
}: SelectProps) => {
    const baseStyle = variant === 'dark'
        ? "bg-white/5 border border-white/10 text-white focus:border-[#C27A5D] focus:ring-1 focus:ring-[#C27A5D]/30"
        : "bg-[#FAF6F0] border border-stone-300/40 text-[#1C1917] focus:border-[#C27A5D] focus:ring-1 focus:ring-[#C27A5D]/30";

    return (
        <div className="mb-5">
            {label && (
                <label className={`block text-[9px] font-mono uppercase tracking-wider mb-1.5 font-bold ${
                    variant === 'dark' ? 'text-stone-400' : 'text-stone-400'
                }`}>
                    {label}
                </label>
            )}
            <select
                className={`w-full px-4 py-3 rounded-2xl focus:outline-none transition-all duration-300 text-sm cursor-pointer ${
                    error ? 'border-red-400' : ''
                } ${baseStyle} ${className}`}
                {...props}
            >
                <option value="" className={variant === 'dark' ? 'bg-slate-950 text-white' : ''}>Select an option</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value} className={variant === 'dark' ? 'bg-slate-950 text-white' : ''}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 font-mono text-[10px] mt-1 uppercase tracking-wider">{error}</p>}
        </div>
    );
};