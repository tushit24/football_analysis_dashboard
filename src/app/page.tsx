'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { FormationBoard } from '@/components/FormationBoard';
import { StyleSliders } from '@/components/StyleSliders';
import { ClubCrest } from '@/components/ClubCrest';
import clubsData from '@/lib/mock/clubs.json';
import {
  Sparkles,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Award,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const WEAK_AREAS_OPTIONS = [
  'Press resistance',
  'Aerial duels',
  'Progressive passing',
  'Defensive ground duels',
  'Counter-press recovery',
  'Box threat & finishing',
];

export default function StrategyBriefPage() {
  const router = useRouter();
  const {
    selectedClub,
    currentBrief,
    updateBrief,
    updateStyle,
    updateConstraints,
    prefillBriefFromClub,
  } = useAppStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const clubInfo = (clubsData as Record<string, any>)[selectedClub] || (clubsData as any)['Arsenal'];

  const toggleNeed = (need: string) => {
    const exists = currentBrief.needs.includes(need);
    if (exists) {
      updateBrief({ needs: currentBrief.needs.filter((n) => n !== need) });
    } else {
      updateBrief({ needs: [...currentBrief.needs, need] });
    }
  };

  const handleFindPlayers = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      router.push('/results');
    }, 300);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-sans text-pitch uppercase tracking-wider font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Decision Support Suite</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-tx uppercase tracking-tight">
            Team Strategy Brief
          </h1>
          <p className="text-mut text-sm sm:text-base max-w-2xl mt-1">
            Define your tactical profile and recruitment criteria. Our ML compatibility model will
            return a ranked shortlist of players with exact fit verdicts.
          </p>
        </div>

        {/* Quick action to pre-fill from club */}
        <button
          type="button"
          onClick={() => prefillBriefFromClub(selectedClub)}
          className="self-start md:self-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-panel border border-line hover:border-pitch/50 text-tx hover:text-pitch transition-all font-sans text-xs font-semibold shadow-sm"
          title={`Load ${selectedClub}'s current tactics`}
        >
          <ClubCrest name={selectedClub} size={24} />
          <span>Pre-fill from {selectedClub} ({clubInfo.formation})</span>
        </button>
      </div>

      {/* Main 2-Column Tactics Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tactics Board & Match Shape (Pitch) */}
        <div className="lg:col-span-5 bg-panel border border-line rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-tx uppercase">
                Tactics Board
              </h2>
              <p className="text-xs text-mut">Formation shape & target recruitment slot</p>
            </div>
            <span className="text-[11px] font-bold text-pitch bg-pitch/10 px-2.5 py-1 rounded-full border border-pitch/20">
              Target: {currentBrief.targetRole}
            </span>
          </div>

          <FormationBoard
            formation={currentBrief.formation}
            targetRole={currentBrief.targetRole}
            clubColor={clubInfo.color}
            onFormationChange={(fmt) => updateBrief({ formation: fmt })}
            onRoleSelect={(role) => updateBrief({ targetRole: role })}
          />
        </div>

        {/* Right Column: Style Sliders, Needs, and Constraints */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tactical Style Sliders Card */}
          <div className="bg-panel border border-line rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="border-b border-line pb-3">
              <h2 className="font-display font-extrabold text-2xl text-tx uppercase">
                Tactical Style Parameters
              </h2>
              <p className="text-xs text-mut">
                Dictate the manager&apos;s playing philosophy for vector similarity matching
              </p>
            </div>

            <StyleSliders
              style={currentBrief.style}
              onChange={(updated) => updateStyle(updated)}
            />
          </div>

          {/* Squad Needs & Weak Areas Card */}
          <div className="bg-panel border border-line rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="border-b border-line pb-3">
              <h2 className="font-display font-extrabold text-2xl text-tx uppercase">
                Squad Needs &amp; Tactical Priorities
              </h2>
              <p className="text-xs text-mut">Select specific weaknesses to prioritize in candidates</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {WEAK_AREAS_OPTIONS.map((area) => {
                const isSelected = currentBrief.needs.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleNeed(area)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans font-semibold transition-all border ${
                      isSelected
                        ? 'bg-pitch/20 text-pitch border-pitch shadow-pitch-glow'
                        : 'bg-panel2 text-mut border-line hover:text-tx hover:border-tx/30'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{area}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recruitment Constraints Card */}
          <div className="bg-panel border border-line rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="border-b border-line pb-3">
              <h2 className="font-display font-extrabold text-2xl text-tx uppercase">
                Recruitment Constraints
              </h2>
              <p className="text-xs text-mut">Filters &amp; penalty thresholds for candidates</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Budget slider */}
              <div className="space-y-1.5 bg-panel2 p-3.5 rounded-2xl border border-line">
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-tx font-medium flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-pitch" /> Max Transfer Budget
                  </span>
                  <span className="font-display font-bold text-base text-pitch">
                    £{currentBrief.constraints.budget}M
                  </span>
                </div>
                <input
                  type="range"
                  min={25}
                  max={120}
                  step={5}
                  value={currentBrief.constraints.budget}
                  onChange={(e) => updateConstraints({ budget: Number(e.target.value) })}
                  className="w-full accent-pitch bg-panel h-2 rounded-lg cursor-pointer"
                  aria-label="Max Transfer Budget"
                />
              </div>

              {/* Max Age */}
              <div className="space-y-1.5 bg-panel2 p-3.5 rounded-2xl border border-line">
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-tx font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold" /> Max Player Age
                  </span>
                  <span className="font-display font-bold text-base text-tx">
                    {currentBrief.constraints.maxAge} yrs
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={33}
                  value={currentBrief.constraints.maxAge}
                  onChange={(e) => updateConstraints({ maxAge: Number(e.target.value) })}
                  className="w-full accent-pitch bg-panel h-2 rounded-lg cursor-pointer"
                  aria-label="Max Player Age"
                />
              </div>

              {/* Min Experience */}
              <div className="space-y-1.5 bg-panel2 p-3.5 rounded-2xl border border-line">
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-tx font-medium flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-sky-400" /> Min League Experience
                  </span>
                  <span className="font-display font-bold text-base text-tx">
                    {currentBrief.constraints.minLeagueExperience} Seasons
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={currentBrief.constraints.minLeagueExperience}
                  onChange={(e) =>
                    updateConstraints({ minLeagueExperience: Number(e.target.value) })
                  }
                  className="w-full accent-pitch bg-panel h-2 rounded-lg cursor-pointer"
                  aria-label="Min League Experience"
                />
              </div>

              {/* Homegrown status toggle */}
              <div className="flex items-center justify-between bg-panel2 p-3.5 rounded-2xl border border-line">
                <div>
                  <span className="text-xs font-sans font-medium text-tx block">
                    Require Homegrown (HG)
                  </span>
                  <span className="text-[10px] text-mut block">Premier League quota slot</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateConstraints({
                      workPermitHomegrown: !currentBrief.constraints.workPermitHomegrown,
                    })
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    currentBrief.constraints.workPermitHomegrown ? 'bg-pitch' : 'bg-line'
                  }`}
                  aria-label="Toggle homegrown requirement"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      currentBrief.constraints.workPermitHomegrown ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFindPlayers}
              className="w-full py-4 px-6 rounded-2xl bg-pitch hover:bg-pitch-light text-slate-950 font-display font-black text-xl tracking-wider uppercase flex items-center justify-center gap-3 shadow-pitch-glow transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Simulating Tactical Matches...' : 'Find Compatible Players (Scout Shortlist)'}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-center text-xs text-mut mt-2">
              Runs cosine vector similarity and penalizes constraint violations across 25+ players.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
