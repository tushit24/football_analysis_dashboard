'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ClubCrest } from '@/components/ClubCrest';
import { Pitch } from '@/components/Pitch';
import clubsData from '@/lib/mock/clubs.json';
import { ClubInfo } from '@/lib/types';
import {
  Shield,
  MapPin,
  User,
  Activity,
  Layers,
  ArrowRight,
  Search,
} from 'lucide-react';

export default function ClubDashboardPage() {
  const router = useRouter();
  const { selectedClub, setSelectedClub, prefillBriefFromClub, updateBrief, currentBrief } =
    useAppStore();
  const clubs = clubsData as unknown as Record<string, ClubInfo>;
  const clubNames = Object.keys(clubs);

  const [searchQuery, setSearchQuery] = useState('');
  const currentClub = clubs[selectedClub] || clubs['Arsenal'];

  const [selectedRole, setSelectedRole] = useState<string>(currentBrief.targetRole || 'ST');
  const [selectedPlayer, setSelectedPlayer] = useState<string>(
    currentClub.lineup[currentClub.lineup.length - 1] || 'Striker'
  );

  const filteredClubs = clubNames.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClub = (clubName: string) => {
    setSelectedClub(clubName);
  };

  const handlePreFillBrief = () => {
    prefillBriefFromClub(selectedClub);
    router.push('/');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Club Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-panel border border-line rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-pitch" />
          <span className="font-display font-extrabold text-lg text-tx uppercase tracking-wide">
            Switch Club:
          </span>
        </div>

        <div className="flex flex-1 max-w-md items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-mut absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 20 Premier League clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-xl pl-9 pr-3 py-2 text-xs text-tx placeholder:text-mut focus:border-pitch outline-none"
            />
          </div>

          <select
            value={selectedClub}
            onChange={(e) => handleSelectClub(e.target.value)}
            className="bg-panel2 border border-line rounded-xl px-3 py-2 text-xs text-tx font-bold focus:border-pitch outline-none"
            aria-label="Select active club"
          >
            {clubNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-panel border border-line rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between relative z-10">
          <div className="flex items-center gap-5">
            <ClubCrest name={selectedClub} size={84} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold text-mut tracking-wider">
                  Club Overview · 2023–24 Demo
                </span>
                <span className="w-2 h-2 rounded-full bg-pitch" />
              </div>
              <h1 className="font-display font-black text-4xl sm:text-6xl text-tx uppercase tracking-tight">
                {currentClub.name}
              </h1>
            </div>
          </div>

          {/* Meta Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto text-xs font-sans">
            <div className="bg-panel2/80 p-3 rounded-2xl border border-line">
              <span className="text-mut flex items-center gap-1 text-[11px]">
                <User className="w-3 h-3 text-pitch" /> Manager
              </span>
              <strong className="text-tx font-display text-base block mt-0.5 truncate">
                {currentClub.manager}
              </strong>
            </div>

            <div className="bg-panel2/80 p-3 rounded-2xl border border-line">
              <span className="text-mut flex items-center gap-1 text-[11px]">
                <MapPin className="w-3 h-3 text-gold" /> Stadium Ground
              </span>
              <strong className="text-tx font-display text-base block mt-0.5 truncate">
                {currentClub.stadium}
              </strong>
            </div>

            <div className="bg-panel2/80 p-3 rounded-2xl border border-line">
              <span className="text-mut flex items-center gap-1 text-[11px]">
                <Layers className="w-3 h-3 text-sky-400" /> Formation
              </span>
              <strong className="text-tx font-display text-base block mt-0.5">
                {currentClub.formation}
              </strong>
            </div>

            <div className="bg-panel2/80 p-3 rounded-2xl border border-line">
              <span className="text-mut flex items-center gap-1 text-[11px]">
                <Activity className="w-3 h-3 text-emerald-400" /> Squad Strength
              </span>
              <strong className="text-pitch font-display text-base block mt-0.5">
                {currentClub.strength} / 100
              </strong>
            </div>
          </div>
        </div>

        {/* Action Button to Pre-fill Brief */}
        <div className="mt-6 pt-5 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-mut">
            Use {currentClub.name}&apos;s tactical profile as the baseline for the recruitment engine.
          </p>
          <button
            type="button"
            onClick={handlePreFillBrief}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-pitch hover:bg-pitch-light text-slate-950 font-display font-extrabold text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-pitch-glow transition-all"
          >
            <span>Pre-fill Strategy Brief from {currentClub.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Pitch & Squad Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Predicted Starting XI */}
        <div className="lg:col-span-6 bg-panel border border-line rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-line pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-tx uppercase">
                Predicted Starting XI
              </h2>
              <p className="text-xs text-mut">Tactical matchday shape &amp; position nodes</p>
            </div>
            <span className="text-[11px] font-bold text-tx bg-panel2 px-2.5 py-1 rounded-full border border-line">
              {currentClub.formation}
            </span>
          </div>

          <Pitch
            formation={currentClub.formation}
            players={currentClub.lineup}
            clubColor={currentClub.color}
            targetRole={selectedRole}
            onSelectRole={(role, name) => {
              setSelectedRole(role);
              if (name) setSelectedPlayer(name);
            }}
          />

          {/* Interactive Selected Node Card */}
          <div className="bg-panel2/90 p-4 rounded-2xl border border-pitch/40 space-y-3 transition-all animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-mut tracking-wider block">
                  Selected Matchday Role
                </span>
                <h4 className="font-display font-extrabold text-2xl text-tx tracking-tight">
                  {selectedPlayer} <span className="text-pitch">({selectedRole})</span>
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pitch/20 text-pitch border border-pitch/40 font-display font-bold text-xs uppercase tracking-wider">
                Node Selected
              </span>
            </div>

            <p className="text-xs text-mut">
              Click any node on the pitch to inspect that positional role and set it as your target
              recruitment requirement.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  updateBrief({ targetRole: selectedRole });
                  router.push('/');
                }}
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-pitch hover:bg-pitch-light text-slate-950 font-display font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-pitch-glow"
              >
                <span>Target {selectedRole} in Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  updateBrief({ targetRole: selectedRole });
                  router.push('/results');
                }}
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-panel hover:bg-panel2 text-tx hover:text-pitch border border-line hover:border-pitch/40 font-display font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all"
              >
                <span>View Shortlist for {selectedRole}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Key Squad Players Table */}
        <div className="lg:col-span-6 bg-panel border border-line rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-line pb-3">
            <h2 className="font-display font-extrabold text-2xl text-tx uppercase">
              Key Squad Players
            </h2>
            <p className="text-xs text-mut">Star performers and positional anchors</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-line bg-panel2/40">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-line bg-panel2 text-mut font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Pos</th>
                  <th className="py-3 px-4">Nation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {currentClub.squad && currentClub.squad.length > 0 ? (
                  currentClub.squad.map((player, idx) => (
                    <tr key={idx} className="hover:bg-panel2/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-tx text-sm">{player.name}</td>
                      <td className="py-3 px-4 font-display font-bold text-pitch text-sm">
                        {player.pos}
                      </td>
                      <td className="py-3 px-4 text-mut font-display font-semibold">
                        {player.nation}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-mut">
                      Squad data will arrive with the backend.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
