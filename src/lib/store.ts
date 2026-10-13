import { create } from 'zustand';
import { TeamBrief, PlayerMatch, FormationType, DefensiveBlock } from './types';
import clubsData from './mock/clubs.json';

interface AppState {
  selectedClub: string;
  setSelectedClub: (club: string) => void;

  currentBrief: TeamBrief;
  updateBrief: (partial: Partial<TeamBrief>) => void;
  updateStyle: (stylePartial: Partial<TeamBrief['style']>) => void;
  updateConstraints: (constraintsPartial: Partial<TeamBrief['constraints']>) => void;
  prefillBriefFromClub: (clubName: string) => void;

  shortlist: PlayerMatch[];
  addToShortlist: (player: PlayerMatch) => void;
  removeFromShortlist: (playerId: string) => void;
  isInShortlist: (playerId: string) => boolean;

  compareList: PlayerMatch[];
  toggleCompare: (player: PlayerMatch) => void;
  removeFromCompare: (playerId: string) => void;
  clearCompare: () => void;
  isInCompare: (playerId: string) => boolean;

  selectedPlayerDetail: PlayerMatch | null;
  setSelectedPlayerDetail: (player: PlayerMatch | null) => void;
}

const defaultBrief: TeamBrief = {
  club: 'Arsenal',
  formation: '4-3-3',
  targetRole: 'DM',
  style: {
    pressing: 85,
    block: 'high',
    buildUp: 90,
    tempo: 82,
    width: 75,
    possessionBias: 70,
  },
  needs: ['Press resistance', 'Progressive passing', 'Aerial duels'],
  constraints: {
    budget: 65,
    maxAge: 26,
    minLeagueExperience: 2,
    workPermitHomegrown: false,
  },
};

export const useAppStore = create<AppState>((set, get) => ({
  selectedClub: 'Arsenal',
  setSelectedClub: (club: string) => {
    set({ selectedClub: club });
    // Also auto-update brief club
    set((state) => ({
      currentBrief: {
        ...state.currentBrief,
        club,
      },
    }));
  },

  currentBrief: defaultBrief,
  updateBrief: (partial) =>
    set((state) => ({
      currentBrief: { ...state.currentBrief, ...partial },
    })),
  updateStyle: (stylePartial) =>
    set((state) => ({
      currentBrief: {
        ...state.currentBrief,
        style: { ...state.currentBrief.style, ...stylePartial },
      },
    })),
  updateConstraints: (constraintsPartial) =>
    set((state) => ({
      currentBrief: {
        ...state.currentBrief,
        constraints: { ...state.currentBrief.constraints, ...constraintsPartial },
      },
    })),
  prefillBriefFromClub: (clubName: string) => {
    const clubs = clubsData as Record<string, any>;
    const club = clubs[clubName];
    if (!club) return;

    set((state) => ({
      selectedClub: clubName,
      currentBrief: {
        ...state.currentBrief,
        club: clubName,
        formation: (club.formation as FormationType) || '4-3-3',
        style: {
          pressing: club.styleVector[0] || 80,
          buildUp: club.styleVector[1] || 85,
          block: (club.styleVector[2] > 80 ? 'high' : 'mid') as DefensiveBlock,
          tempo: club.styleVector[3] || 78,
          width: 75,
          possessionBias: Math.min(85, Math.max(50, club.styleVector[1])),
        },
      },
    }));
  },

  shortlist: [],
  addToShortlist: (player) =>
    set((state) => {
      if (state.shortlist.some((p) => p.player.id === player.player.id)) return state;
      return { shortlist: [...state.shortlist, player] };
    }),
  removeFromShortlist: (playerId) =>
    set((state) => ({
      shortlist: state.shortlist.filter((p) => p.player.id !== playerId),
    })),
  isInShortlist: (playerId) => get().shortlist.some((p) => p.player.id === playerId),

  compareList: [],
  toggleCompare: (player) =>
    set((state) => {
      const exists = state.compareList.some((p) => p.player.id === player.player.id);
      if (exists) {
        return {
          compareList: state.compareList.filter((p) => p.player.id !== player.player.id),
        };
      }
      if (state.compareList.length >= 3) {
        // Replace oldest or keep max 3
        return { compareList: [...state.compareList.slice(1), player] };
      }
      return { compareList: [...state.compareList, player] };
    }),
  removeFromCompare: (playerId) =>
    set((state) => ({
      compareList: state.compareList.filter((p) => p.player.id !== playerId),
    })),
  clearCompare: () => set({ compareList: [] }),
  isInCompare: (playerId) => get().compareList.some((p) => p.player.id === playerId),

  selectedPlayerDetail: null,
  setSelectedPlayerDetail: (player) => set({ selectedPlayerDetail: player }),
}));
