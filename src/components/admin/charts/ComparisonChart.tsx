
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ComparisonChartProps {
  data: Array<{ [key: string]: any }>;
  dataKeys: string[];
  colors: string[];
  height?: number;
  xAxisKey?: string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({
  data,
  dataKeys,
  colors,
  height = 300,
  xAxisKey = 'name'
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
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-700" />
          <XAxis 
            dataKey={xAxisKey} 
            className="text-slate-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis className="text-slate-400" tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index] || '#8884d8'}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ComparisonChart;
