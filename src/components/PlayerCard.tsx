'use client';

import React from 'react';
import { PlayerMatch } from '@/lib/types';
import { FitRing } from './FitRing';
import { VerdictBadge } from './VerdictBadge';
import { Bookmark, CheckSquare, Square, ChevronRight } from 'lucide-react';

interface PlayerCardProps {
  match: PlayerMatch;
  rank?: number;
  isSelectedForCompare: boolean;
  isSavedInShortlist: boolean;
  onToggleCompare: () => void;
  onToggleShortlist: () => void;
  onViewDetails: () => void;
  className?: string;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  match,
  rank,
  isSelectedForCompare,
  isSavedInShortlist,
  onToggleCompare,
  onToggleShortlist,
  onViewDetails,
  className = '',
}) => {
  const { player, fitScore, verdict, strengths, penaltyApplied } = match;

  return (
    <div
      className={`relative bg-panel border rounded-2xl p-5 transition-all duration-300 hover:border-pitch/50 hover:shadow-glow flex flex-col justify-between gap-4 ${
        isSelectedForCompare ? 'border-pitch ring-1 ring-pitch/60' : 'border-line'
      } ${className}`}
    >
      {/* Top Header: Rank, Verdict, and Quick Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {rank !== undefined && (
            <span className="font-display font-extrabold text-lg text-mut/80 w-6">
              #{rank}
            </span>
          )}
          <VerdictBadge verdict={verdict} size="sm" />
        </div>

        {/* Shortlist bookmark & Compare checkbox */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist();
            }}
            className={`p-2 rounded-xl border transition-all ${
              isSavedInShortlist
                ? 'bg-pitch/20 text-pitch border-pitch/50'
                : 'bg-panel2 text-mut border-line hover:text-tx hover:border-tx/30'
            }`}
            title={isSavedInShortlist ? 'Saved in Shortlist' : 'Add to Shortlist'}
            aria-label="Toggle shortlist bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isSavedInShortlist ? 'fill-pitch' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isSelectedForCompare
                ? 'bg-pitch/20 text-pitch border-pitch/60'
                : 'bg-panel2 text-mut border-line hover:text-tx'
            }`}
            title="Select player to compare"
            aria-label="Select player for comparison"
          >
            {isSelectedForCompare ? (
              <CheckSquare className="w-3.5 h-3.5 text-pitch" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            <span>Compare</span>
          </button>
        </div>
      </div>

      {/* Center Body: FitRing & Player Details */}
      <div className="flex items-center gap-4">
        <FitRing score={fitScore} size={88} strokeWidth={8} />

        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="font-display font-extrabold text-2xl text-tx tracking-tight truncate">
            {player.name}
          </h3>
          <p className="text-xs text-mut font-medium truncate">
            {player.primaryRole} · {player.club}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-tx font-bold bg-panel2 px-2 py-0.5 rounded-md border border-line">
              £{player.marketValue}M
            </span>
            <span className="text-mut">{player.age} yrs</span>
            <span className="text-mut">· {player.nationality}</span>
            {player.isHomegrown && (
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                HG
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Constraints Penalty alert if applied */}
      {penaltyApplied && (
        <div className="text-[11px] text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          ⚠️ Note: {penaltyApplied}
        </div>
      )}

      {/* Key Strengths tags */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-sans text-mut uppercase tracking-wider font-semibold">
          Key Strengths
        </span>
        <div className="flex flex-wrap gap-1.5">
          {strengths.slice(0, 2).map((str, idx) => (
            <span
              key={idx}
              className="text-[11px] font-sans text-tx bg-panel2/80 px-2.5 py-1 rounded-lg border border-line/60"
            >
              • {str}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action footer */}
      <button
        type="button"
        onClick={onViewDetails}
        className="w-full mt-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-panel2 hover:bg-panel2/80 text-tx hover:text-pitch border border-line hover:border-pitch/40 font-display font-bold text-sm tracking-wide transition-all"
      >
        <span>Full Scouting Breakdown</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
