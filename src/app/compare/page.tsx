'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { FitRing } from '@/components/FitRing';
import { VerdictBadge } from '@/components/VerdictBadge';
import { RadarCompare } from '@/components/RadarCompare';
import { StatBar } from '@/components/StatBar';
import {
  GitCompare,
  TrendingUp,
  Download,
  Bookmark,
  CheckCircle,
  X,
  AlertTriangle,
  Award,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import playersData from '@/lib/mock/players.json';
import { findPlayers } from '@/lib/api';

export default function ComparePage() {
  const {
    currentBrief,
    compareList,
    toggleCompare,
    clearCompare,
    addToShortlist,
    isInShortlist,
    removeFromShortlist,
  } = useAppStore();

  // If compareList is empty on mount, initialize with the top 2 candidates
  useEffect(() => {
    if (compareList.length === 0) {
      findPlayers(currentBrief).then((matches) => {
        if (matches.length >= 2) {
          toggleCompare(matches[0]);
          toggleCompare(matches[1]);
        } else if (matches.length === 1) {
          toggleCompare(matches[0]);
        }
      });
    }
  }, [compareList.length, currentBrief, toggleCompare]);

  const primaryCandidate = compareList[0];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <Link
            href="/results"
            className="inline-flex items-center gap-1.5 text-xs text-mut hover:text-pitch mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Scouting Shortlist</span>
          </Link>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-tx uppercase tracking-tight">
            Player Detail &amp; Tactical Comparison
          </h1>
          <p className="text-mut text-sm sm:text-base max-w-2xl mt-1">
            In-depth radar geometry, attribute variances, and squad XI simulation for candidate signings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-panel2 border border-line hover:border-pitch/50 text-tx hover:text-pitch text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-pitch" />
            <span>Export Comparison (PDF)</span>
          </button>
          {compareList.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="px-3.5 py-2.5 rounded-xl bg-panel border border-line hover:border-alert/40 text-mut hover:text-alert text-xs font-semibold transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {compareList.length === 0 ? (
        <div className="bg-panel border border-line rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <GitCompare className="w-12 h-12 text-mut mx-auto" />
          <h3 className="font-display font-extrabold text-2xl text-tx">No Candidates Selected</h3>
          <p className="text-sm text-mut">
            Select 2 or 3 players from the shortlist to view side-by-side tactical breakdown.
          </p>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pitch text-slate-950 font-bold text-sm tracking-wide"
          >
            <span>Browse Matched Players</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Section: Side-by-Side Candidate Cards Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-${Math.min(
              3,
              compareList.length
            )} gap-5`}
          >
            {compareList.map((match, idx) => {
              const isSaved = isInShortlist(match.player.id);
              return (
                <div
                  key={match.player.id}
                  className="relative bg-panel border border-line rounded-3xl p-6 shadow-xl space-y-4 hover:border-pitch/40 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleCompare(match)}
                    className="absolute top-4 right-4 text-mut hover:text-alert p-1 rounded-lg"
                    title="Remove from comparison"
                    aria-label={`Remove ${match.player.name} from comparison`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-4">
                    <FitRing score={match.fitScore} size={80} strokeWidth={7} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-mut">Slot #{idx + 1}</span>
                        <VerdictBadge verdict={match.verdict} size="sm" />
                      </div>
                      <h2 className="font-display font-black text-2xl text-tx truncate">
                        {match.player.name}
                      </h2>
                      <p className="text-xs text-mut truncate">
                        {match.player.primaryRole} · {match.player.club}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-panel2 p-3 rounded-xl border border-line text-center text-xs">
                    <div>
                      <span className="text-mut block text-[10px] uppercase font-bold">Value</span>
                      <strong className="text-tx font-display text-base">
                        £{match.player.marketValue}M
                      </strong>
                    </div>
                    <div>
                      <span className="text-mut block text-[10px] uppercase font-bold">Age</span>
                      <strong className="text-tx font-display text-base">
                        {match.player.age} yrs
                      </strong>
                    </div>
                    <div>
                      <span className="text-mut block text-[10px] uppercase font-bold">Nation</span>
                      <strong className="text-tx font-display text-base">
                        {match.player.nationCode}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isSaved) {
                        removeFromShortlist(match.player.id);
                      } else {
                        addToShortlist(match);
                      }
                    }}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isSaved
                        ? 'bg-pitch/20 text-pitch border-pitch/50'
                        : 'bg-panel2 text-mut border-line hover:text-tx'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-pitch' : ''}`} />
                    <span>{isSaved ? 'Saved in Shortlist' : 'Save to Shortlist'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Middle Section: Detailed Radar & Attributes Breakdown */}
          {primaryCandidate && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Radar Chart & Strengths / Concerns */}
              <div className="lg:col-span-6 bg-panel border border-line rounded-3xl p-6 shadow-xl space-y-6">
                <div className="border-b border-line pb-3">
                  <h3 className="font-display font-extrabold text-2xl text-tx uppercase">
                    Tactical Radar Geometry
                  </h3>
                  <p className="text-xs text-mut">
                    {primaryCandidate.player.name} vs {currentBrief.club} Tactical Target
                  </p>
                </div>

                <RadarCompare
                  attributes={primaryCandidate.attributeFit}
                  playerName={primaryCandidate.player.name}
                  teamName={`${currentBrief.club} Brief`}
                />

                {/* Attribute Comparison Bars */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs uppercase font-bold text-mut tracking-wider block">
                    Dimensional Compatibility
                  </span>
                  {primaryCandidate.attributeFit.map((attr) => (
                    <StatBar
                      key={attr.name}
                      label={attr.name}
                      value={attr.playerValue}
                      benchmark={attr.teamBenchmark}
                      color="#19c37d"
                    />
                  ))}
                </div>

                {/* Strengths & Concerns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-panel2/60 p-4 rounded-2xl border border-line space-y-2">
                    <span className="text-xs font-bold uppercase text-pitch tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Key Strengths
                    </span>
                    <ul className="space-y-1 text-xs text-tx">
                      {primaryCandidate.strengths.map((str, i) => (
                        <li key={i}>• {str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-panel2/60 p-4 rounded-2xl border border-line space-y-2">
                    <span className="text-xs font-bold uppercase text-alert tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Watch / Concerns
                    </span>
                    <ul className="space-y-1 text-xs text-tx">
                      {primaryCandidate.concerns.map((con, i) => (
                        <li key={i}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: "Impact on Team" & XI Simulation Panel */}
              <div className="lg:col-span-6 bg-panel border border-line rounded-3xl p-6 shadow-xl space-y-6">
                <div className="border-b border-line pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-pitch uppercase tracking-wider mb-0.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Machine Learning Simulation</span>
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-tx uppercase">
                    Impact on {currentBrief.club} Starting XI
                  </h3>
                  <p className="text-xs text-mut">
                    Projected squad baseline change with {primaryCandidate.player.name}
                  </p>
                </div>

                {/* Key Delta Impact Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-panel2 p-4 rounded-2xl border border-line text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-mut block">
                      Expected Pts Delta
                    </span>
                    <strong className="font-display font-black text-3xl text-pitch block">
                      {primaryCandidate.xiImpact.expectedPointsDelta > 0 ? '+' : ''}
                      {primaryCandidate.xiImpact.expectedPointsDelta}
                    </strong>
                    <span className="text-[10px] text-mut">League Season</span>
                  </div>

                  <div className="bg-panel2 p-4 rounded-2xl border border-line text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-mut block">
                      Title Odds Impact
                    </span>
                    <strong className="font-display font-black text-3xl text-sky-400 block">
                      {primaryCandidate.xiImpact.titleOddsDelta > 0 ? '+' : ''}
                      {primaryCandidate.xiImpact.titleOddsDelta}%
                    </strong>
                    <span className="text-[10px] text-mut">Championship %</span>
                  </div>

                  <div className="bg-panel2 p-4 rounded-2xl border border-line text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-mut block">
                      Clean Sheets
                    </span>
                    <strong className="font-display font-black text-3xl text-gold block">
                      +{primaryCandidate.xiImpact.cleanSheetsDelta}
                    </strong>
                    <span className="text-[10px] text-mut">Defensive Solid</span>
                  </div>
                </div>

                {/* What he adds to the XI text box */}
                <div className="bg-panel2/80 p-5 rounded-2xl border border-line space-y-2">
                  <h4 className="font-display font-bold text-base text-tx uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pitch" />
                    Tactical Contribution to {currentBrief.formation}
                  </h4>
                  <p className="text-xs sm:text-sm text-tx/90 leading-relaxed">
                    {primaryCandidate.xiImpact.summary}
                  </p>
                </div>

                {/* Formal Recommendation Banner */}
                <div className="p-4 rounded-2xl bg-pitch/10 border border-pitch/30 flex items-start gap-3">
                  <Award className="w-5 h-5 text-pitch flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-display font-bold text-base text-pitch uppercase">
                      Recruitment Recommendation: {primaryCandidate.verdict}
                    </h5>
                    <p className="text-xs text-tx/80 mt-0.5">
                      Based on current system vector weights, {primaryCandidate.player.name} provides{' '}
                      {primaryCandidate.fitScore}% compatibility with minimal adaptation risk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
