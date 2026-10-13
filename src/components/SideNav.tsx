'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ClubCrest } from './ClubCrest';
import {
  SlidersHorizontal,
  Users,
  GitCompare,
  Shield,
  Dices,
  Trophy,
  Bookmark,
  RefreshCw,
} from 'lucide-react';

export const SideNav: React.FC = () => {
  const pathname = usePathname();
  const { selectedClub, shortlist, compareList } = useAppStore();

  const navLinks = [
    {
      label: 'Strategy Brief',
      href: '/',
      icon: SlidersHorizontal,
      badge: null,
    },
    {
      label: 'Scouting Shortlist',
      href: '/results',
      icon: Users,
      badge: shortlist.length > 0 ? shortlist.length : null,
    },
    {
      label: 'Player Compare',
      href: '/compare',
      icon: GitCompare,
      badge: compareList.length > 0 ? `${compareList.length}/3` : null,
    },
    {
      label: 'Club Dashboard',
      href: '/club',
      icon: Shield,
      badge: null,
    },
    {
      label: 'Match Predictor',
      href: '/match',
      icon: Dices,
      badge: null,
    },
    {
      label: 'Season Predictor',
      href: '/season',
      icon: Trophy,
      badge: null,
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-gradient-to-b from-[#0a1a3a] to-[#060d1e] border-r border-line p-5 flex-col gap-5 sticky top-0 h-screen text-tx z-30 select-none">
      {/* Brand Header */}
      <div className="px-2 pt-1 pb-2">
        <Link href="/" className="group block">
          <div className="font-display font-black text-2xl tracking-wide uppercase text-white leading-none">
            PREMIER
            <br />
            PREDICTOR
          </div>
          <span className="block text-[11px] font-sans font-medium text-mut tracking-tight mt-1.5 group-hover:text-pitch transition-colors">
            Manager Decision Support System
          </span>
        </Link>
      </div>

      {/* Active Club Chip */}
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-panel2/80 border border-line">
        <ClubCrest name={selectedClub} size={34} />
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase font-bold text-mut block tracking-wider leading-none">
            Active Club
          </span>
          <span className="font-bold text-sm text-tx truncate block mt-0.5">
            {selectedClub}
          </span>
        </div>
        <Link
          href="/club"
          className="text-mut hover:text-pitch p-1 rounded-lg transition-colors"
          title="Change active club"
          aria-label="Change club"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1.5 flex-1 mt-1">
        <span className="text-[10px] uppercase font-semibold text-mut/80 tracking-wider px-3 mb-1">
          Tactical Suite
        </span>

        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl font-sans text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-pitch text-slate-950 font-bold shadow-pitch-glow'
                  : 'text-mut hover:text-tx hover:bg-panel2/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-slate-950' : ''}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-[10px] font-display font-extrabold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-panel2 text-pitch border border-line'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Pill */}
      <div className="pt-3 border-t border-line/60 text-[11px] text-mut space-y-1 px-2">
        <div className="flex items-center gap-1.5 text-xs text-tx font-semibold">
          <span className="w-2 h-2 rounded-full bg-pitch animate-pulse" />
          <span>Demo Data Engine</span>
        </div>
        <p className="text-[10px] text-mut leading-tight">
          Premier League 2017–24 data. Connect ML backend via{' '}
          <code className="text-pitch">NEXT_PUBLIC_API_BASE_URL</code>.
        </p>
      </div>
    </aside>
  );
};
