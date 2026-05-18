import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = ({
    label,
    error,
    options,
    className = '',
    ...props
}: SelectProps) => {
    return (
        <div className="mb-5">
            {label && (
                <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1.5 font-bold">
                    {label}
                </label>
            )}
            <select
                className={`w-full px-4 py-3 bg-[#FAF7F2]/50 border rounded-2xl focus:outline-none focus:border-[#DF8060] focus:ring-1 focus:ring-[#DF8060]/30 transition-all duration-300 text-sm text-[#1C1917] ${
                    error ? 'border-red-400' : 'border-stone-300/60'
                } ${className}`}
                {...props}
            >
                <option value="">Select an option</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 font-mono text-[10px] mt-1 uppercase tracking-wider">{error}</p>}
        </div>
    );
};