"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightChartProps {
  data: WeightEntry[];
}

export function WeightChart({ data }: WeightChartProps) {
  const chartData = data.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    peso: entry.weight,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          domain={['dataMin - 2', 'dataMax + 2']}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '2px solid #a855f7',
            borderRadius: '12px',
            padding: '8px 12px'
          }}
          labelStyle={{ color: '#6b7280', fontWeight: 'bold' }}
        />
        <Line 
          type="monotone" 
          dataKey="peso" 
          stroke="url(#colorGradient)" 
          strokeWidth={3}
          dot={{ fill: '#a855f7', r: 5 }}
          activeDot={{ r: 7 }}
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  );
}
