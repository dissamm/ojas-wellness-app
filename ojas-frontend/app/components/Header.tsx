'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '../store/userStore';

export const Header = () => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const logout = useUserStore((state) => state.logout);
  const loadProfileFromToken = useUserStore((state) => state.loadProfileFromToken);

  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Read theme on mount
    const root = document.documentElement;
    const isDarkTheme = root.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    setIsDark(isDarkTheme);
    if (isDarkTheme) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // Fetch profile on Header mount if authenticated
    if (isAuthenticated) {
      loadProfileFromToken();
    }
  }, [isAuthenticated, loadProfileFromToken]);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const links = isMounted && isAuthenticated
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Rituals', path: '/rituals' },
        { name: 'Prakriti', path: '/prakriti' },
        { name: 'Cycle', path: '/cycle' },
        { name: 'Music', path: '/music' },
      ].filter(link => !(link.name === 'Cycle' && user?.gender === 'male'))
    : isMounted
    ? [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
      ]
    : [];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <header className="w-full backdrop-blur-md px-6 py-4 md:px-12 md:py-5 border-b border-[#1C1917]/5 dark:border-stone-800/80 bg-[#F4EFEA]/80 dark:bg-[#12100E]/80 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Metadata (Sleek and Monospaced) */}
        <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] font-medium text-stone-400 dark:text-stone-500 select-none">
          REF. 882 / 2026
        </div>

        {/* Center Brand Wordmark (Luxurious Serif) */}
        <Link href="/" className="group flex items-center">
          <span className="font-cormorant italic text-3xl font-medium tracking-normal text-[#C27A5D] group-hover:text-[#1C1917] dark:group-hover:text-white transition-colors duration-500">
            Ojas<sup className="text-[9px] font-sans align-super left-0.5">®</sup>
          </span>
        </Link>

        {/* Right Navigation & Profile (Unified Flex) */}
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden sm:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className={`text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 pb-0.5 border-b ${
                    isActive 
                      ? 'text-[#C27A5D] font-bold border-[#C27A5D]/60' 
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs border border-stone-300/80 dark:border-stone-800 text-stone-600 dark:text-stone-450 bg-white/40 dark:bg-stone-900/40 hover:border-[#C27A5D] dark:hover:border-[#C27A5D] hover:text-[#C27A5D] dark:hover:text-[#C27A5D] transition-colors duration-300 cursor-pointer select-none"
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Profile Initials / Log In Action */}
          {isMounted && isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono border border-stone-300/80 dark:border-stone-800 text-stone-600 dark:text-stone-450 bg-white/40 dark:bg-stone-900/40 shadow-[0_1px_3px_rgba(28,25,22,0.02)] select-none">
                {userInitial}
              </div>
              <button
                onClick={() => logout()}
                className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 hover:text-[#C27A5D] dark:text-stone-450 dark:hover:text-[#C27A5D] transition-colors duration-300 cursor-pointer select-none"
              >
                Logout
              </button>
            </div>
          ) : isMounted ? (
            <Link 
              href="/login"
              className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-550 dark:text-stone-400 hover:text-[#C27A5D] dark:hover:text-[#C27A5D] transition-colors duration-300"
            >
              Sign In
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
};