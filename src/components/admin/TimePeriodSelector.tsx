
import React from 'react';
import { Button } from '@/components/ui/button';

interface TimePeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  periods?: Array<{ label: string; value: string }>;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  periods = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' }
  ]
}) => {
  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={selectedPeriod === period.value ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange(period.value)}
          className={
            selectedPeriod === period.value
              ? "bg-cyan-400 text-slate-900 hover:bg-cyan-300"
              : "border-gray-600 text-slate-300 hover:bg-slate-700"
          }
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};

export default TimePeriodSelector;
