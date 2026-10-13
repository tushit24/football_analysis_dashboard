'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { findPlayers } from '@/lib/api';
import { PlayerMatch } from '@/lib/types';
import { PlayerCard } from '@/components/PlayerCard';
import {
  Download,
  GitCompare,
  SlidersHorizontal,
  Bookmark,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const {
    currentBrief,
    updateBrief,
    updateConstraints,
    shortlist,
    addToShortlist,
    removeFromShortlist,
    isInShortlist,
    compareList,
    toggleCompare,
    isInCompare,
    setSelectedPlayerDetail,
  } = useAppStore();

  const [matches, setMatches] = useState<PlayerMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    findPlayers(currentBrief)
      .then((res) => {
        if (isMounted) {
          setMatches(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to find players:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentBrief]);

  const filteredMatches = matches.filter((m) => {
    if (filterRole === 'ALL') return true;
    return m.player.position.toUpperCase() === filterRole.toUpperCase();
  });

  const handleExportPDF = () => {
    window.print();
  };

  const handleViewDetail = (match: PlayerMatch) => {
    setSelectedPlayerDetail(match);
    // If not in compare, add it and navigate to compare
    if (!isInCompare(match.player.id) && compareList.length < 3) {
      toggleCompare(match);
    }
    router.push('/compare');
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Top Header & Export Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans text-pitch font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-pitch" />
            <span>ML Compatibility Engine</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-tx uppercase tracking-tight">
            Scouting Shortlist
          </h1>
          <p className="text-mut text-sm sm:text-base max-w-2xl mt-1">
            Ranked by tactical compatibility with your{' '}
            <strong className="text-tx">{currentBrief.club}</strong> {currentBrief.formation} (
            {currentBrief.targetRole} role) brief.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Re-tune brief button */}
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-panel border border-line text-mut hover:text-tx text-xs font-semibold transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Adjust Brief</span>
          </Link>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-panel2 border border-line hover:border-pitch/50 text-tx hover:text-pitch text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-pitch" />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Filter and Brief Criteria Summary Bar (Interactive Controls) */}
      <div className="bg-panel border border-line rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Interactive Brief Criteria Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-mut font-semibold uppercase tracking-wider mr-1">
            Brief Criteria:
          </span>

          {/* Interactive Target Slot Selector */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="Target Role Slot"
              value={currentBrief.targetRole}
              onChange={(e) => {
                updateBrief({ targetRole: e.target.value });
                setFilterRole('ALL');
              }}
              className="px-3 py-1.5 bg-panel2 text-pitch border border-pitch/40 rounded-xl text-xs font-display font-extrabold tracking-wide hover:border-pitch cursor-pointer outline-none transition-all shadow-sm focus:ring-1 focus:ring-pitch"
            >
              <option value="DM">Slot: DM (Defensive Mid)</option>
              <option value="CM">Slot: CM (Central Mid)</option>
              <option value="RW">Slot: RW (Right Winger)</option>
              <option value="LW">Slot: LW (Left Winger)</option>
              <option value="ST">Slot: ST (Striker)</option>
              <option value="CB">Slot: CB (Center-Back)</option>
              <option value="RB">Slot: RB (Right-Back)</option>
              <option value="LB">Slot: LB (Left-Back)</option>
              <option value="ALL">Slot: All Positions</option>
            </select>
          </div>

          {/* Interactive Max Budget Selector */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="Max Budget"
              value={currentBrief.constraints.budget}
              onChange={(e) => updateConstraints({ budget: Number(e.target.value) })}
              className="px-3 py-1.5 bg-panel2 text-tx border border-line rounded-xl text-xs font-semibold hover:border-pitch/50 cursor-pointer outline-none transition-all shadow-sm focus:ring-1 focus:ring-pitch"
            >
              <option value={40}>Budget: ≤ £40M</option>
              <option value={50}>Budget: ≤ £50M</option>
              <option value={60}>Budget: ≤ £60M</option>
              <option value={65}>Budget: ≤ £65M</option>
              <option value={80}>Budget: ≤ £80M</option>
              <option value={100}>Budget: ≤ £100M</option>
              <option value={120}>Budget: Any (£120M+)</option>
            </select>
          </div>

          {/* Interactive Max Age Selector */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="Max Age"
              value={currentBrief.constraints.maxAge}
              onChange={(e) => updateConstraints({ maxAge: Number(e.target.value) })}
              className="px-3 py-1.5 bg-panel2 text-tx border border-line rounded-xl text-xs font-semibold hover:border-pitch/50 cursor-pointer outline-none transition-all shadow-sm focus:ring-1 focus:ring-pitch"
            >
              <option value={21}>Age: ≤ 21 yrs (U21)</option>
              <option value={23}>Age: ≤ 23 yrs (U23)</option>
              <option value={25}>Age: ≤ 25 yrs</option>
              <option value={26}>Age: ≤ 26 yrs</option>
              <option value={28}>Age: ≤ 28 yrs</option>
              <option value={32}>Age: Any (≤ 32 yrs)</option>
            </select>
          </div>

          {/* Interactive Min Experience Selector */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="Minimum Experience"
              value={currentBrief.constraints.minLeagueExperience}
              onChange={(e) =>
                updateConstraints({ minLeagueExperience: Number(e.target.value) })
              }
              className="px-3 py-1.5 bg-panel2 text-tx border border-line rounded-xl text-xs font-semibold hover:border-pitch/50 cursor-pointer outline-none transition-all shadow-sm focus:ring-1 focus:ring-pitch"
            >
              <option value={1}>Min Exp: 1 Season</option>
              <option value={2}>Min Exp: 2 Seasons</option>
              <option value={3}>Min Exp: 3+ Seasons</option>
              <option value={5}>Min Exp: 5+ Seasons</option>
            </select>
          </div>

          {/* Interactive Homegrown Toggle Button */}
          <button
            type="button"
            onClick={() =>
              updateConstraints({
                workPermitHomegrown: !currentBrief.constraints.workPermitHomegrown,
              })
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              currentBrief.constraints.workPermitHomegrown
                ? 'bg-gold/20 text-gold border-gold/50 shadow-sm'
                : 'bg-panel2 text-mut border-line hover:text-tx hover:border-tx/30'
            }`}
            title="Click to toggle Homegrown (HG) quota rule"
          >
            <span>
              HG:{' '}
              {currentBrief.constraints.workPermitHomegrown ? 'Required (ON)' : 'Optional (OFF)'}
            </span>
          </button>
        </div>

        {/* Position Filter Selector */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <span className="text-xs text-mut font-semibold whitespace-nowrap">Filter Roster:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-panel2 border border-line rounded-xl px-3 py-1.5 text-xs text-tx font-bold focus:border-pitch outline-none cursor-pointer"
            aria-label="Filter candidates by position"
          >
            <option value="ALL">All Positions ({matches.length})</option>
            <option value="DM">DM - Defensive Midfield</option>
            <option value="CM">CM - Central Midfield</option>
            <option value="RW">RW - Right Winger</option>
            <option value="LW">LW - Left Winger</option>
            <option value="ST">ST - Striker</option>
            <option value="CB">CB - Center-Back</option>
            <option value="RB">RB - Right-Back</option>
            <option value="LB">LB - Left-Back</option>
          </select>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-panel border border-line rounded-2xl p-5 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="w-16 h-4 bg-panel2 rounded" />
                <div className="w-20 h-6 bg-panel2 rounded-full" />
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-panel2 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="w-3/4 h-5 bg-panel2 rounded" />
                  <div className="w-1/2 h-3 bg-panel2 rounded" />
                  <div className="w-1/3 h-4 bg-panel2 rounded" />
                </div>
              </div>
              <div className="w-full h-8 bg-panel2 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMatches.length === 0 && (
        <div className="bg-panel border border-line rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-gold mx-auto" />
          <h3 className="font-display font-extrabold text-2xl text-tx">No Candidates Match</h3>
          <p className="text-sm text-mut">
            Try adjusting your recruitment budget, max age constraint, or changing the position
            filter.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pitch text-slate-950 font-bold text-sm tracking-wide"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Modify Brief Parameters</span>
          </Link>
        </div>
      )}

      {/* Match Cards Grid */}
      {!loading && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match, idx) => (
            <PlayerCard
              key={match.player.id}
              match={match}
              rank={idx + 1}
              isSelectedForCompare={isInCompare(match.player.id)}
              isSavedInShortlist={isInShortlist(match.player.id)}
              onToggleCompare={() => toggleCompare(match)}
              onToggleShortlist={() => {
                if (isInShortlist(match.player.id)) {
                  removeFromShortlist(match.player.id);
                } else {
                  addToShortlist(match);
                }
              }}
              onViewDetails={() => handleViewDetail(match)}
            />
          ))}
        </div>
      )}

      {/* Floating Compare Action Drawer / Banner */}
      {compareList.length > 0 && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 left-6 max-w-2xl mx-auto z-40 bg-panel/95 backdrop-blur-xl border border-pitch/60 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pitch/20 grid place-items-center text-pitch border border-pitch/40">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-tx block leading-tight">
                {compareList.length} of 3 Candidates Selected
              </span>
              <span className="text-xs text-mut">
                {compareList.map((p) => p.player.name).join(', ')}
              </span>
            </div>
          </div>

          <Link
            href="/compare"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pitch text-slate-950 font-display font-extrabold text-sm uppercase tracking-wider hover:bg-pitch-light transition-all shadow-pitch-glow"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
