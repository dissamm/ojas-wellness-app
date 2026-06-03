import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
    type,
    ...props
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const baseStyle = variant === 'dark'
        ? "bg-white/5 border border-white/10 text-white focus:border-secondary focus:ring-1 focus:ring-secondary/30 placeholder-stone-500"
        : "bg-on-primary border border-stone-300/40 text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/30 placeholder-stone-400";

    return (
        <div className="mb-5">
            {label && (
                <label className={`block text-[9px] font-mono uppercase tracking-wider mb-1.5 font-bold ${
                    variant === 'dark' ? 'text-stone-400' : 'text-stone-400'
                }`}>
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={inputType}
                    className={`w-full px-4 py-3 rounded-2xl focus:outline-none transition-all duration-300 text-sm ${
                        isPassword ? 'pr-12' : ''
                    } ${
                        error ? 'border-red-400' : ''
                    } ${baseStyle} ${className}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-secondary dark:hover:text-secondary transition-colors focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff size={16} className="stroke-[1.5]" />
                        ) : (
                            <Eye size={16} className="stroke-[1.5]" />
                        )}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 font-mono text-[10px] mt-1 uppercase tracking-wider">{error}</p>}
            {helperText && <p className="text-stone-400 font-mono text-[9px] mt-1 uppercase tracking-wider">{helperText}</p>}
        </div>
    );
};