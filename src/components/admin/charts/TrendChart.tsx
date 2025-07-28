
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface TrendChartProps {
  data: Array<{ [key: string]: any }>;
  dataKeys: string[];
  colors: string[];
  height?: number;
  xAxisKey?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  dataKeys,
  colors,
  height = 300,
  xAxisKey = 'date'
}) => {
  const chartConfig = dataKeys.reduce((config, key, index) => {
    config[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: colors[index] || '#8884d8'
    };
    return config;
  }, {} as any);

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-700" />
          <XAxis 
            dataKey={xAxisKey} 
            className="text-slate-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis className="text-slate-400" tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index] || '#8884d8'}
              strokeWidth={2}
              dot={{ fill: colors[index] || '#8884d8', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: colors[index] || '#8884d8' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TrendChart;
