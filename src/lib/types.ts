export type FormationType = '4-3-3' | '4-2-3-1' | '3-5-2' | '4-4-2';

export type DefensiveBlock = 'low' | 'mid' | 'high';

export type VerdictType = 'PERFECT FIT' | 'STRONG FIT' | 'GOOD FIT' | 'RISKY';

export interface TacticalStyle {
  pressing: number; // 0 - 100
  block: DefensiveBlock;
  buildUp: number; // 0 (direct) to 100 (short)
  tempo: number; // 0 - 100
  width: number; // 0 - 100
  possessionBias: number; // 0 (counter/transition) to 100 (possession)
}

export interface RecruitmentConstraints {
  budget: number; // in £ Millions (e.g. 65)
  maxAge: number; // in years (e.g. 26)
  minLeagueExperience: number; // in seasons (e.g. 2)
  workPermitHomegrown: boolean;
}

export interface TeamBrief {
  club: string;
  formation: FormationType;
  targetRole: string; // e.g. 'DM', 'RW', 'ST', 'CB'
  style: TacticalStyle;
  needs: string[]; // e.g. ['Press resistance', 'Aerial duels', 'Progressive passing']
  constraints: RecruitmentConstraints;
}

export interface AttributeFit {
  name: string; // 'Pressing' | 'Passing' | 'Defensive work' | 'Progression' | 'Aerial'
  playerValue: number;
  teamBenchmark: number;
  diff: number;
}

export interface XIImpact {
  roleReplaced: string;
  expectedPointsDelta: number; // e.g. +4.2
  titleOddsDelta: number; // e.g. +8.5
  cleanSheetsDelta: number; // e.g. +2.1
  summary: string;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  position: string;
  primaryRole: string;
  club: string;
  league: string;
  nationality: string;
  nationCode: string;
  marketValue: number; // in £ Millions
  styleVector: [number, number, number, number, number]; // [Pressing, Passing, Defensive work, Progression, Aerial]
  keyStrengths: string[];
  mainConcerns: string[];
  avatarUrl?: string;
  experienceYears: number;
  isHomegrown: boolean;
}

export interface PlayerMatch {
  player: Player;
  fitScore: number; // 0 - 100
  verdict: VerdictType;
  strengths: string[];
  concerns: string[];
  attributeFit: AttributeFit[];
  xiImpact: XIImpact;
  penaltyApplied?: string;
}

export interface MatchPredictionRequest {
  homeTeam: string;
  awayTeam: string;
  homeManager: string;
  awayManager: string;
}

export interface TacticalDriver {
  name: string;
  value: number; // positive favours home, negative favours away
  favours: string;
}

export interface MatchPredictionResponse {
  home_win: number; // percentage e.g. 62
  draw: number; // percentage e.g. 21
  away_win: number; // percentage e.g. 17
  drivers: TacticalDriver[];
  homeRating: number;
  awayRating: number;
}

export interface StandingsRow {
  rank: number;
  club: string;
  code: string;
  color: string;
  points: number;
  titleOdds: number;
  top4Odds: number;
  relegationOdds: number;
}

export interface SeasonSimulationRequest {
  focusClub: string;
  manager: string;
}

export interface SeasonSimulationResponse {
  focusClub: string;
  projectedRank: number;
  projectedPoints: number;
  titleOdds: number;
  top4Odds: number;
  relegationOdds: number;
  standings: StandingsRow[];
}

export interface ClubInfo {
  name: string;
  code: string;
  strength: number; // 0 - 100
  color: string;
  manager: string;
  stadium: string;
  formation: FormationType;
  lineup: string[];
  styleVector: [number, number, number, number, number];
  squad: {
    name: string;
    pos: string;
    nation: string;
  }[];
}
