'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { FitRing } from '@/components/FitRing';
import { StatBar } from '@/components/StatBar';
import { VerdictBadge } from '@/components/VerdictBadge';
import playersData from '@/lib/mock/players.json';
import clubsData from '@/lib/mock/clubs.json';
import { Player } from '@/lib/types';
import {
  ArrowRight,
  Sparkles,
  UserCheck,
  SlidersHorizontal,
} from 'lucide-react';

const ATT_NAMES = ['Pressing', 'Passing', 'Defensive work', 'Progression', 'Aerial'];

export default function TransferSuitabilityPage() {
  const router = useRouter();
  const { currentBrief, updateBrief } = useAppStore();
  const players = playersData as unknown as Player[];
  const clubs = clubsData as Record<string, any>;
  const managers = Array.from(new Set(Object.values(clubs).map((c) => c.manager)));

  const [selectedPlayerName, setSelectedPlayerName] = useState('Bruno Guimarães');
  const [selectedManager, setSelectedManager] = useState('Mikel Arteta');

  const player = players.find((p) => p.name === selectedPlayerName) || players[0];

  // Tactical style vector for manager
  const managerClub = Object.values(clubs).find((c) => c.manager === selectedManager);
  const managerStyle = managerClub?.styleVector || [80, 85, 78, 80, 60];

  // Calculate similarity
  const diffSq = player.styleVector.reduce(
    (acc, val, idx) => acc + Math.pow(val - managerStyle[idx], 2),
    0
  );
  const dist = Math.sqrt(diffSq / 5);
  const score = Math.max(30, Math.min(98, Math.round(100 - dist * 2.2)));

  const verdict =
    score >= 90 ? 'PERFECT FIT' : score >= 80 ? 'STRONG FIT' : score >= 65 ? 'GOOD FIT' : 'RISKY';

  const handleOpenBrief = () => {
    updateBrief({
      targetRole: player.position,
    });
    router.push('/');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2 text-xs font-sans text-pitch font-bold uppercase tracking-wider mb-1">
          <UserCheck className="w-4 h-4" />
          <span>Quick Compatibility Check</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-tx uppercase tracking-tight">
          Transfer Suitability
        </h1>
        <p className="text-mut text-sm sm:text-base max-w-2xl mt-1">
          Evaluate how any specific target player fits an individual manager&apos;s playing style, or launch
          the full multi-constraint Team Strategy Brief.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player & Manager Selectors */}
        <div className="lg:col-span-5 bg-panel border border-line rounded-3xl p-6 shadow-xl space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs text-mut font-semibold">Select Player</label>
            <select
              value={selectedPlayerName}
              onChange={(e) => setSelectedPlayerName(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-xl px-3 py-2.5 text-xs text-tx font-bold focus:border-pitch outline-none"
            >
              {players.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.position} · {p.club})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-mut font-semibold">Select Manager</label>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-xl px-3 py-2.5 text-xs text-tx font-bold focus:border-pitch outline-none"
            >
              {managers.map((mgr) => (
                <option key={mgr} value={mgr}>
                  {mgr}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenBrief}
              className="w-full py-3 px-4 rounded-xl bg-pitch hover:bg-pitch-light text-slate-950 font-display font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-pitch-glow"
            >
              <span>Build Full Strategy Brief for {player.position}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Suitability Assessment Card */}
        <div className="lg:col-span-7 bg-panel border border-line rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-5 border-b border-line pb-4">
            <FitRing score={score} size={96} strokeWidth={8} />

            <div className="space-y-1">
              <VerdictBadge verdict={verdict} size="md" />
              <h2 className="font-display font-extrabold text-3xl text-tx">{player.name}</h2>
              <p className="text-xs text-mut">
                {player.primaryRole} · {player.club} (£{player.marketValue}M)
              </p>
            </div>
          </div>

          {/* Tactical Fit with Manager */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-tx uppercase">
              Tactical Fit with {selectedManager}
            </h3>

            <div className="space-y-3">
              {ATT_NAMES.map((name, idx) => (
                <StatBar
                  key={name}
                  label={name}
                  value={player.styleVector[idx]}
                  benchmark={managerStyle[idx]}
                  color="#19c37d"
                />
              ))}
            </div>

            <div className="bg-panel2 p-4 rounded-2xl border border-line text-xs text-tx space-y-1">
              <span className="font-bold text-pitch block uppercase tracking-wider text-[11px]">
                Scouting Insight:
              </span>
              <p className="text-mut">
                Player excels in {player.keyStrengths[0].toLowerCase()}, aligning with{' '}
                {selectedManager}&apos;s system requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
