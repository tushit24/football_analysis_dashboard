import {
  TeamBrief,
  PlayerMatch,
  MatchPredictionRequest,
  MatchPredictionResponse,
  SeasonSimulationRequest,
  SeasonSimulationResponse,
  Player,
  VerdictType,
  ClubInfo,
} from './types';
import clubsData from './mock/clubs.json';
import playersData from './mock/players.json';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || null;

const ATTRIBUTE_NAMES = ['Pressing', 'Passing', 'Defensive work', 'Progression', 'Aerial'];

/**
 * Helper to call backend or fallback to null
 */
async function postAPI<T>(endpoint: string, body: unknown): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn(`Backend returned status ${res.status} for ${endpoint}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`Failed to connect to backend at ${API_BASE}${endpoint}:`, err);
    return null;
  }
}

/**
 * Computes tactical match between team brief and player mock database
 */
export async function findPlayers(brief: TeamBrief): Promise<PlayerMatch[]> {
  const backendResult = await postAPI<PlayerMatch[]>('/players/match', brief);
  if (backendResult) return backendResult;

  // Mock matching logic:
  // Convert brief tactical sliders to a 5-dimension target style vector
  // [Pressing, Passing, Defensive work, Progression, Aerial]
  const targetPressing = brief.style.pressing;
  const targetPassing = brief.style.buildUp; // 0 (direct) to 100 (short/possession)
  const targetDefense = brief.style.block === 'high' ? 82 : brief.style.block === 'mid' ? 75 : 88;
  const targetProgression = Math.round((brief.style.tempo + brief.style.width) / 2);
  const targetAerial = brief.needs.some((n) => n.toLowerCase().includes('aerial')) ? 80 : 65;

  const targetVector = [targetPressing, targetPassing, targetDefense, targetProgression, targetAerial];

  const matches: PlayerMatch[] = (playersData as unknown as Player[]).map((player) => {
    // 1. Vector euclidean similarity
    const pVec = player.styleVector;
    const diffSq = pVec.reduce((acc, val, idx) => acc + Math.pow(val - targetVector[idx], 2), 0);
    const distance = Math.sqrt(diffSq / 5);
    let baseScore = Math.round(100 - distance * 2.1);

    // 2. Penalty evaluation
    let penalty = 0;
    const penaltyReasons: string[] = [];

    // Position priority bonus / filter check
    const isTargetPos = player.position.toLowerCase() === brief.targetRole.toLowerCase();
    if (!isTargetPos && brief.targetRole !== 'ALL') {
      penalty += 15;
      penaltyReasons.push(`Secondary position (${player.position})`);
    }

    // Budget constraint penalty
    if (brief.constraints.budget && player.marketValue > brief.constraints.budget) {
      const overBudget = player.marketValue - brief.constraints.budget;
      penalty += Math.round(overBudget * 1.2);
      penaltyReasons.push(`Exceeds budget by £${overBudget}M`);
    }

    // Age constraint penalty
    if (brief.constraints.maxAge && player.age > brief.constraints.maxAge) {
      const overAge = player.age - brief.constraints.maxAge;
      penalty += overAge * 4;
      penaltyReasons.push(`Exceeds max age (+${overAge} yrs)`);
    }

    // League experience penalty
    if (
      brief.constraints.minLeagueExperience &&
      player.experienceYears < brief.constraints.minLeagueExperience
    ) {
      penalty += 8;
      penaltyReasons.push(`Limited top-tier experience`);
    }

    // Homegrown penalty
    if (brief.constraints.workPermitHomegrown && !player.isHomegrown) {
      penalty += 10;
      penaltyReasons.push(`Non-homegrown registration slot`);
    }

    const finalFitScore = Math.max(30, Math.min(98, baseScore - penalty));

    // 3. Verdict threshold classification
    let verdict: VerdictType = 'GOOD FIT';
    if (finalFitScore >= 90) {
      verdict = 'PERFECT FIT';
    } else if (finalFitScore >= 80) {
      verdict = 'STRONG FIT';
    } else if (finalFitScore >= 65) {
      verdict = 'GOOD FIT';
    } else {
      verdict = 'RISKY';
    }

    // 4. Attribute fit breakdown
    const attributeFit = ATTRIBUTE_NAMES.map((name, idx) => ({
      name,
      playerValue: pVec[idx],
      teamBenchmark: targetVector[idx],
      diff: pVec[idx] - targetVector[idx],
    }));

    // 5. Impact on team simulation
    const pointsDelta =
      finalFitScore >= 90
        ? +((finalFitScore - 80) * 0.35).toFixed(1)
        : finalFitScore >= 80
        ? +((finalFitScore - 75) * 0.22).toFixed(1)
        : finalFitScore >= 65
        ? +((finalFitScore - 65) * 0.08).toFixed(1)
        : -2.1;

    const titleOddsDelta = +(pointsDelta * 1.8).toFixed(1);
    const cleanSheetsDelta = +(pVec[2] >= 85 ? 2.4 : 1.1).toFixed(1);

    const xiImpact = {
      roleReplaced: `${brief.targetRole} (${brief.club} XI)`,
      expectedPointsDelta: pointsDelta,
      titleOddsDelta,
      cleanSheetsDelta,
      summary:
        finalFitScore >= 90
          ? `Immediate tactical transformation in build-up and press resistance.`
          : finalFitScore >= 80
          ? `Reliable tactical fit with marginal adaptations required in transitions.`
          : finalFitScore >= 65
          ? `Decent squad depth option; requires system coaching to fulfill demands.`
          : `High variance profile; substantial tactical risk under current manager brief.`,
    };

    return {
      player,
      fitScore: finalFitScore,
      verdict,
      strengths: player.keyStrengths,
      concerns: player.mainConcerns,
      attributeFit,
      xiImpact,
      penaltyApplied: penaltyReasons.length > 0 ? penaltyReasons.join(', ') : undefined,
    };
  });

  // Sort descending by fitScore
  return matches.sort((a, b) => b.fitScore - a.fitScore);
}

/**
 * Predicts outcome between two teams and their managers
 */
export async function predictMatch(req: MatchPredictionRequest): Promise<MatchPredictionResponse> {
  const backendResult = await postAPI<MatchPredictionResponse>('/predict/match', req);
  if (backendResult) return backendResult;

  const clubs = clubsData as unknown as Record<string, ClubInfo>;
  const home = clubs[req.homeTeam] || clubs['Arsenal'];
  const away = clubs[req.awayTeam] || clubs['Chelsea'];

  // Illustrative model: rating gap + home advantage + manager style delta
  const ratingDelta = (home.strength + 4 - away.strength) / 9;
  const rawProbHome = 1 / (1 + Math.exp(-ratingDelta));
  const drawBase = 0.3 * Math.exp(-Math.pow(ratingDelta, 2) / 5);

  const homeWinPct = Math.round(rawProbHome * (1 - drawBase) * 100);
  const drawPct = Math.round(drawBase * 100);
  const awayWinPct = 100 - homeWinPct - drawPct;

  // Feature driver factors
  const styleHome = home.styleVector;
  const styleAway = away.styleVector;

  const strengthGap = (home.strength - away.strength) / 20;
  const homeAdvantage = 0.35;
  const pressingVsPressRes = (styleHome[0] - styleAway[1] + 8) / 40;
  const tacticalGap = (styleHome[3] - styleAway[3]) / 25;

  const drivers = [
    {
      name: 'Squad Strength gap',
      value: strengthGap,
      favours: strengthGap >= 0 ? req.homeTeam : req.awayTeam,
    },
    {
      name: 'Home Stadium advantage',
      value: homeAdvantage,
      favours: req.homeTeam,
    },
    {
      name: 'Pressing vs press resistance',
      value: pressingVsPressRes,
      favours: pressingVsPressRes >= 0 ? req.homeTeam : req.awayTeam,
    },
    {
      name: 'Tactical pace & style gap',
      value: tacticalGap,
      favours: tacticalGap >= 0 ? req.homeTeam : req.awayTeam,
    },
  ];

  return {
    home_win: Math.max(5, Math.min(90, homeWinPct)),
    draw: Math.max(5, Math.min(40, drawPct)),
    away_win: Math.max(5, Math.min(90, awayWinPct)),
    drivers,
    homeRating: home.strength,
    awayRating: away.strength,
  };
}

/**
 * Simulates a full 38-game season (800 Monte Carlo runs)
 */
export async function predictSeason(
  req: SeasonSimulationRequest
): Promise<SeasonSimulationResponse> {
  const backendResult = await postAPI<SeasonSimulationResponse>('/predict/season', req);
  if (backendResult) return backendResult;

  const clubs = clubsData as unknown as Record<string, ClubInfo>;
  const clubNames = Object.keys(clubs);
  const N = clubNames.length;
  const SIMULATIONS = 800;

  const pointsAcc = Array(N).fill(0);
  const titleAcc = Array(N).fill(0);
  const top4Acc = Array(N).fill(0);
  const relAcc = Array(N).fill(0);

  // Precompute match probability matrix
  const matchProbs = clubNames.map((hName) =>
    clubNames.map((aName) => {
      if (hName === aName) return null;
      const hStr = clubs[hName].strength;
      const aStr = clubs[aName].strength;
      const d = (hStr + 4 - aStr) / 9;
      const p = 1 / (1 + Math.exp(-d));
      const dr = 0.3 * Math.exp(-Math.pow(d, 2) / 5);
      return { pHome: p * (1 - dr), pDraw: dr };
    })
  );

  for (let s = 0; s < SIMULATIONS; s++) {
    const runPoints = Array(N).fill(0);

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const prob = matchProbs[i][j];
        if (!prob) continue;

        const rand = Math.random();
        if (rand < prob.pHome) {
          runPoints[i] += 3;
        } else if (rand < prob.pHome + prob.pDraw) {
          runPoints[i] += 1;
          runPoints[j] += 1;
        } else {
          runPoints[j] += 3;
        }
      }
    }

    runPoints.forEach((pts, idx) => (pointsAcc[idx] += pts));

    // Sort order for this simulation
    const sortedRun = runPoints
      .map((pts, idx) => [pts + Math.random() * 0.1, idx])
      .sort((a, b) => b[0] - a[0]);

    titleAcc[sortedRun[0][1]] += 1;
    sortedRun.slice(0, 4).forEach((item) => (top4Acc[item[1]] += 1));
    sortedRun.slice(-3).forEach((item) => (relAcc[item[1]] += 1));
  }

  const tableRows = clubNames
    .map((name, idx) => {
      const info = clubs[name];
      return {
        rank: 0,
        club: name,
        code: info.code,
        color: info.color,
        points: Math.round(pointsAcc[idx] / SIMULATIONS),
        titleOdds: +((titleAcc[idx] / SIMULATIONS) * 100).toFixed(0),
        top4Odds: +((top4Acc[idx] / SIMULATIONS) * 100).toFixed(0),
        relegationOdds: +((relAcc[idx] / SIMULATIONS) * 100).toFixed(0),
      };
    })
    .sort((a, b) => b.points - a.points);

  tableRows.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  const focusIdx = tableRows.findIndex((r) => r.club === req.focusClub);
  const focusRow = tableRows[focusIdx] || tableRows[0];

  return {
    focusClub: req.focusClub,
    projectedRank: focusRow.rank,
    projectedPoints: focusRow.points,
    titleOdds: focusRow.titleOdds,
    top4Odds: focusRow.top4Odds,
    relegationOdds: focusRow.relegationOdds,
    standings: tableRows,
  };
}
