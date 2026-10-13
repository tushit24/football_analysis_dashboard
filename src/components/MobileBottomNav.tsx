'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  SlidersHorizontal,
  Users,
  GitCompare,
  Shield,
  Dices,
  Trophy,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { shortlist } = useAppStore();

  const navLinks = [
    { label: 'Brief', href: '/', icon: SlidersHorizontal },
    { label: 'Shortlist', href: '/results', icon: Users, badge: shortlist.length },
    { label: 'Compare', href: '/compare', icon: GitCompare },
    { label: 'Club', href: '/club', icon: Shield },
    { label: 'Match', href: '/match', icon: Dices },
    { label: 'Season', href: '/season', icon: Trophy },
  ];

  return (
    <nav
      aria-label="Mobile navigation bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#060d1e] to-[#0a1a3a] border-t border-line px-2 py-2 flex items-center justify-around select-none backdrop-blur-lg"
      style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}
    >
      {navLinks.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl transition-all relative ${
              isActive ? 'text-pitch font-bold scale-105' : 'text-mut hover:text-tx'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-2 bg-pitch text-slate-950 font-display font-black text-[9px] w-4 h-4 rounded-full grid place-items-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] font-sans tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
