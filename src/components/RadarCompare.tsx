'use client';

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { AttributeFit } from '@/lib/types';

interface RadarCompareProps {
  attributes: AttributeFit[];
  playerName?: string;
  teamName?: string;
  className?: string;
}

export const RadarCompare: React.FC<RadarCompareProps> = ({
  attributes,
  playerName = 'Player',
  teamName = 'Team Strategy',
  className = '',
}) => {
  const chartData = attributes.map((attr) => ({
    subject: attr.name,
    Player: attr.playerValue,
    Benchmark: attr.teamBenchmark,
    fullMark: 100,
  }));

  return (
    <div className={`w-full h-[280px] select-none ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#233559" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#eef3f8', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#8fa1c0', fontSize: 9 }}
            stroke="#233559"
          />
          <Radar
            name={playerName}
            dataKey="Player"
            stroke="#19c37d"
            fill="#19c37d"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Radar
            name={teamName}
            dataKey="Benchmark"
            stroke="#f6c744"
            fill="#f6c744"
            fillOpacity={0.15}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0e1b36',
              borderColor: '#233559',
              borderRadius: '12px',
              color: '#eef3f8',
              fontFamily: 'DM Sans',
              fontSize: '12px',
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '11px',
              fontFamily: 'DM Sans',
              color: '#8fa1c0',
              paddingTop: '8px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
