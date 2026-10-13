'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { CLUB_THEME_COLORS } from '@/lib/theme';

export const ThemeListener: React.FC = () => {
  const selectedClub = useAppStore((state) => state.selectedClub);

  useEffect(() => {
    const clubColor = CLUB_THEME_COLORS[selectedClub] || '#e4202c';
    document.documentElement.style.setProperty('--club', clubColor);
  }, [selectedClub]);

  return null;
};
