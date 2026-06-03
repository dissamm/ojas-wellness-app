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
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md px-margin-mobile md:px-margin-desktop py-4 border-b border-outline-variant transition-colors duration-300">
      <div className="max-w-container-max mx-auto flex items-center justify-between">
        {/* Left Metadata */}
        <div className="font-label-caps text-label-caps text-secondary/70 hidden md:block">
          OJAS WELLNESS
        </div>

        {/* Center Brand */}
        <Link href="/" className="group flex items-center">
          <span className="font-display-lg text-[24px] md:text-[32px] text-primary group-hover:text-secondary transition-colors duration-500">
            OJAS
          </span>
        </Link>

        {/* Right: Nav + Controls */}
        <div className="flex items-center gap-stack-md">
          <nav className="hidden sm:flex items-center gap-gutter font-label-caps text-label-caps">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.key}
                  href={link.path}
                  className={`transition-colors duration-300 pb-1 border-b ${
                    isActive 
                      ? 'text-primary font-bold border-primary' 
                      : 'text-secondary border-transparent hover:text-primary hover:border-primary/30'
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
            className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-secondary hover:border-secondary transition-colors duration-300 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="hidden md:flex w-8 h-8 rounded-full items-center justify-center border border-outline-variant text-secondary hover:border-secondary transition-colors duration-300 cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Profile Initials / Log In Action */}
          {isMounted && isAuthenticated ? (
            <div className="flex items-center gap-stack-sm">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-label-caps text-label-caps font-bold border border-outline-variant text-secondary bg-surface-container hover:border-secondary transition-all duration-300 cursor-pointer"
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
                className="font-label-caps text-label-caps text-secondary/70 hover:text-primary transition-colors duration-300 cursor-pointer hidden md:block"
              >
                {t('logout')}
              </button>
            </div>
          ) : isMounted ? (
            <Link
              href="/login"
              className="font-label-caps text-label-caps text-primary border border-primary/30 rounded-full px-4 py-2 transition-colors hover:bg-primary/5"
            >
              {t('signIn')}
            </Link>
          ) : null}
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden w-full border-t border-outline-variant bg-background mt-4 px-margin-mobile py-4 flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.key}
                href={link.path}
                className={`font-label-caps text-label-caps py-2 border-b border-outline-variant/30 transition-colors duration-300 ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}

          <button
            onClick={toggleDarkMode}
            className="text-left font-label-caps text-label-caps py-2 text-secondary hover:text-primary transition-colors duration-300"
          >
            {isDark ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
          </button>

          {/* Mobile logout row */}
          {isMounted && isAuthenticated && (
            <button
              onClick={() => { logout(); setIsMenuOpen(false); }}
              className="text-left font-label-caps text-label-caps py-2 text-secondary hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              {t('logout')}
            </button>
          )}
        </div>
      )}
      </header>
      
      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-[73px]"></div>

      {/* Profile Sidebar Panel */}
      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};