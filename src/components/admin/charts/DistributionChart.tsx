
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface DistributionChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
  showLegend?: boolean;
  innerRadius?: number;
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  data,
  height = 300,
  showLegend = true,
  innerRadius = 0
}) => {
  const colors = ['#22D3EE', '#8B5CF6', '#FACC15', '#10B981', '#EF4444', '#F59E0B'];
  
  const chartConfig = data.reduce((config, item, index) => {
    config[item.name] = {
      label: item.name,
      color: item.color || colors[index % colors.length]
    };
    return config;
  }, {} as any);

  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length]
  }));

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          {showLegend && (
            <Legend 
              wrapperStyle={{ color: '#CBD5E1' }}
              iconType="circle"
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default DistributionChart;
