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
  const currentStep = useUserStore((state) => state.currentStep);
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

  type NavItem = { name: string; path: string; key: keyof typeof translations['en'] };
  type NavGroup = { groupKey: keyof typeof translations['en']; items: NavItem[] };

  const authNav: (NavItem | NavGroup)[] = [
    { name: 'Dashboard', path: '/dashboard', key: 'dashboard' },
    {
      groupKey: 'wellness',
      items: [
        { name: 'Rituals', path: '/rituals', key: 'rituals' },
        { name: 'Aahar', path: '/aahar', key: 'aahar' },
        { name: 'Sleep', path: '/sleep', key: 'sleep' },
      ]
    },
    {
      groupKey: 'insights',
      items: ([
        { name: 'Prakriti', path: '/prakriti', key: 'prakriti' },
        { name: 'Jyotish', path: '/jyotish', key: 'jyotish' },
        { name: 'Cycle', path: '/cycle', key: 'cycle' },
        { name: 'Music', path: '/music', key: 'music' },
      ] as NavItem[]).filter(link => !(link.key === 'cycle' && user?.gender === 'male'))
    }
  ];

  const unauthNav: NavItem[] = [
    { name: 'Login', path: '/login', key: 'login' },
    { name: 'Register', path: '/register', key: 'register' },
  ];

  const navStructure = isMounted && isAuthenticated ? authNav : (isMounted ? unauthNav : []);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';
  const isOnboardingFlow = pathname === '/' && currentStep !== 'name';

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-forest-ink/80 backdrop-blur-md px-margin-mobile md:px-margin-desktop py-4 border-b border-white/10 transition-colors duration-300">
      <div className="max-w-container-max mx-auto flex items-center justify-between">
        {/* Left Metadata */}
        <div className="font-label-caps text-label-caps text-surface-cream/50 hidden md:block tracking-widest">
          OJAS WELLNESS
        </div>

        {/* Center Brand */}
        <Link href="/" className="group flex items-center">
          <span className="font-display-lg text-[24px] md:text-[32px] text-surface-cream group-hover:text-resonant-pink transition-colors duration-500">
            OJAS
          </span>
        </Link>

        {/* Right: Nav + Controls */}
        <div className="flex items-center gap-stack-md">
          {!isOnboardingFlow && (
            <nav className="hidden md:flex items-center gap-stack-md">
              {navStructure.map((navItem, i) => {
                if ('groupKey' in navItem) {
                  return (
                    <div key={navItem.groupKey} className="relative group">
                      <button className="font-label-caps text-label-caps text-surface-cream/70 hover:text-resonant-pink transition-colors py-2 flex items-center gap-1 tracking-widest uppercase">
                        {t(navItem.groupKey as any)}
                        <span className="material-symbols-outlined text-[16px] transition-transform group-hover:rotate-180">expand_more</span>
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-48 bg-forest-ink/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 overflow-hidden">
                        {navItem.items.map(item => {
                          const isActive = pathname.startsWith(item.path);
                          return (
                            <Link 
                              key={item.path} 
                              href={item.path}
                              className={`block px-stack-md py-stack-sm font-label-caps text-label-caps uppercase tracking-widest transition-colors ${
                                isActive 
                                  ? 'bg-resonant-pink/10 text-resonant-pink border-l-2 border-resonant-pink' 
                                  : 'text-surface-cream/70 hover:bg-white/5 hover:text-surface-cream border-l-2 border-transparent'
                              }`}
                            >
                              {t(item.key as any)}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else {
                  const isActive = pathname === navItem.path;
                  return (
                    <Link 
                      key={navItem.path} 
                      href={navItem.path}
                      className={`font-label-caps text-label-caps py-2 transition-all tracking-widest uppercase ${
                        isActive 
                          ? 'text-resonant-pink border-b-2 border-resonant-pink' 
                          : 'text-surface-cream/70 hover:text-resonant-pink border-b-2 border-transparent'
                      }`}
                    >
                      {t(navItem.key as any)}
                    </Link>
                  );
                }
              })}
            </nav>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode} 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-resonant-pink/30 hover:bg-white/10 transition-all shadow-sm group"
            aria-label="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* User Profile / Login */}
          {!isOnboardingFlow && (
            isAuthenticated ? (
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="w-10 h-10 rounded-full bg-resonant-pink text-forest-ink font-label-caps text-label-caps flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm border border-resonant-pink/30 shadow-[0_0_10px_rgba(254,181,202,0.4)]"
              >
                {userInitial}
              </button>
            ) : (
              <Link 
                href="/login" 
                className="hidden md:flex font-label-caps text-label-caps px-4 py-2 bg-resonant-pink text-forest-ink rounded-full hover:bg-surface-cream transition-colors uppercase tracking-widest shadow-[0_0_10px_rgba(254,181,202,0.4)]"
              >
                Log In
              </Link>
            )
          )}
          
          {/* Mobile Menu Toggle */}
          {!isOnboardingFlow && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-surface-cream/80 hover:text-resonant-pink transition-colors"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && !isOnboardingFlow && (
        <div className="md:hidden w-full border-t border-white/10 bg-forest-ink mt-4 px-margin-mobile py-4 flex flex-col gap-2">
          {navStructure.map((item, idx) => {
            if ('groupKey' in item) {
              return (
                <div key={item.groupKey} className="flex flex-col">
                  <div className="font-label-caps text-label-caps py-2 text-surface-cream/50 opacity-60 mt-2">
                    {t(item.groupKey)}
                  </div>
                  <div className="flex flex-col pl-4 border-l border-white/10 ml-2">
                    {item.items.map((subItem) => {
                      const isActive = pathname === subItem.path;
                      return (
                        <Link
                          key={subItem.key}
                          href={subItem.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`font-label-caps text-label-caps py-2 border-b border-white/10 transition-colors duration-300 uppercase tracking-widest ${
                            isActive
                              ? 'text-resonant-pink font-bold'
                              : 'text-surface-cream/80 hover:text-resonant-pink'
                          }`}
                        >
                          {t(subItem.key)}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.key}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`font-label-caps text-label-caps py-2 border-b border-white/10 transition-colors duration-300 uppercase tracking-widest ${
                  isActive
                    ? 'text-resonant-pink font-bold'
                    : 'text-surface-cream/80 hover:text-resonant-pink'
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}

          <button
            onClick={toggleDarkMode}
            className="text-left font-label-caps text-label-caps py-2 text-surface-cream/80 hover:text-resonant-pink transition-colors duration-300 tracking-widest uppercase"
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