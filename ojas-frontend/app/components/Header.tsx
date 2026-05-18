'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '../store/userStore';

export const Header = () => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Prakriti', path: '/prakriti' },
    { name: 'Cycle', path: '/cycle' },
    { name: 'Music', path: '/music' },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <header className="w-full bg-[#FAF7F2]/60 backdrop-blur-md border-b border-stone-200/30 px-8 py-5 md:px-12 md:py-6 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          {/* Left Metadata */}
          <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-stone-400 font-medium">
            REF. 882 / 2026
          </div>

          {/* Center Brand Wordmark */}
          <Link href="/" className="group">
            <span className="font-serif italic text-3xl font-medium tracking-normal text-[#DF8060] transition-colors duration-500 hover:text-stone-900">
              Ojas<sup className="text-[10px] font-sans align-super left-0.5">®</sup>
            </span>
          </Link>

          {/* Right Profile Initials Circle */}
          <div className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-xs font-mono text-stone-600 bg-stone-50/50 shadow-sm cursor-pointer hover:border-[#DF8060] transition-colors duration-300">
            {userInitial}
          </div>
        </div>

        {/* Sub-navigation Menu Row */}
        <div className="flex justify-center items-center gap-6 md:gap-8 pt-3 border-t border-stone-100">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.name} 
                href={link.path}
                className={`text-[9px] md:text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isActive 
                    ? 'text-[#DF8060] font-semibold border-b border-[#DF8060]/50 pb-0.5' 
                    : 'text-stone-500 hover:text-stone-900 pb-0.5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};