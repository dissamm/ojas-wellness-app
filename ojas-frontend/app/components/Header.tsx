'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '../store/userStore';
import { useTranslation, translations } from '../store/languageStore';
import { ProfileDrawer } from './ProfileDrawer';

export const Header = () => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const logout = useUserStore((state) => state.logout);
  const loadProfileFromToken = useUserStore((state) => state.loadProfileFromToken);

  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
    const root = document.documentElement;
    const isDarkTheme = root.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    setIsDark(isDarkTheme);
    if (isDarkTheme) root.classList.add('dark');
    else root.classList.remove('dark');
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadProfileFromToken();
  }, [isAuthenticated, loadProfileFromToken]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  };

  const links: { name: string; path: string; key: keyof typeof translations['en'] }[] = isMounted && isAuthenticated
    ? [
        { name: 'Dashboard', path: '/dashboard', key: 'dashboard' as const },
        { name: 'Rituals',   path: '/rituals',   key: 'rituals'   as const },
        { name: 'Prakriti',  path: '/prakriti',  key: 'prakriti'  as const },
        { name: 'Cycle',     path: '/cycle',     key: 'cycle'     as const },
        { name: 'Music',     path: '/music',     key: 'music'     as const },
        { name: 'Aahar',     path: '/aahar',     key: 'aahar'     as const },
      ].filter(link => !(link.key === 'cycle' && user?.gender === 'male'))
    : isMounted
    ? [
        { name: 'Login',    path: '/login',    key: 'login'    as const },
        { name: 'Register', path: '/register', key: 'register' as const },
      ]
    : [];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <>
      <header className="w-full backdrop-blur-md px-6 py-4 md:px-12 md:py-5 border-b border-white/10 bg-[#120d22] sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Metadata (Sleek and Monospaced) */}
        <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] font-medium text-[#f7f3f8]/40 select-none">
          REF. 882 / 2026
        </div>

        {/* Center Brand */}
        <Link href="/" className="group flex items-center">
          <span className="font-cormorant italic text-3xl font-medium tracking-normal text-[#c06080] group-hover:text-[#f7f3f8] transition-colors duration-500">
            Ojas<sup className="text-[9px] font-sans align-super left-0.5">®</sup>
          </span>
        </Link>

        {/* Right: Nav + Controls */}
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden sm:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.key}
                  href={link.path}
                  className={`text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 pb-0.5 border-b ${
                    isActive 
                      ? 'text-[#c06080] font-bold border-[#c06080]/60' 
                      : 'text-[#f7f3f8]/70 hover:text-[#f7f3f8] border-transparent'
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-xs border border-white/15 text-[#f7f3f8] bg-white/5 hover:border-[#c06080] hover:text-[#c06080] transition-colors duration-300 cursor-pointer select-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs border border-white/15 text-[#f7f3f8] bg-white/5 hover:border-[#c06080] hover:text-[#c06080] transition-colors duration-300 cursor-pointer select-none"
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Profile Initials / Log In Action */}
          {isMounted && isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-mono border border-white/15 text-[#f7f3f8] bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.2)] select-none cursor-pointer hover:border-[#c06080] transition-all duration-300"
                aria-label="Open profile settings"
              >
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
              </button>
              <button
                onClick={() => logout()}
                className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#f7f3f8]/70 hover:text-[#c06080] transition-colors duration-300 cursor-pointer select-none"
              >
                {t('logout')}
              </button>
            </div>
          ) : isMounted ? (
            <Link
              href="/login"
              className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#f7f3f8]/70 hover:text-[#c06080] transition-colors duration-300"
            >
              {t('signIn')}
            </Link>
          ) : null}
        </div>
      </div>


      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden w-full border-t border-white/10 bg-[#120d22] px-6 py-4 flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.key}
                href={link.path}
                className={`text-[10px] font-mono uppercase tracking-[0.2em] py-3 border-b border-white/5 transition-colors duration-300 ${
                  isActive
                    ? 'text-[#c06080] font-bold'
                    : 'text-[#f7f3f8]/70 hover:text-[#f7f3f8]'
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}

          {/* Mobile logout row */}
          {isMounted && isAuthenticated && (
            <button
              onClick={() => { logout(); setIsMenuOpen(false); }}
              className="text-left text-[10px] font-mono uppercase tracking-[0.2em] py-3 text-[#f7f3f8]/50 hover:text-[#c06080] transition-colors duration-300 cursor-pointer"
            >
              {t('logout')}
            </button>
          )}
        </div>
      )}
      </header>

      {/* Profile Sidebar Panel */}
      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};