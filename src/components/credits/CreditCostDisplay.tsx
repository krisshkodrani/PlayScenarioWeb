
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Users, Clock, Coins } from 'lucide-react';
import { ScenarioCostCalculation } from '@/hooks/useScenarioCosts';

interface CreditCostDisplayProps {
  costCalculation: ScenarioCostCalculation;
  userCredits: number;
  className?: string;
}

const CreditCostDisplay: React.FC<CreditCostDisplayProps> = ({
  costCalculation,
  userCredits,
  className = ""
}) => {
  const { totalCost, costBreakdown } = costCalculation;
  const hasEnoughCredits = userCredits >= totalCost;

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <span className="font-medium text-white">Credit Cost</span>
        </div>

        <div className="space-y-3">
          {/* Cost Breakdown */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400">Turns:</span>
              <span className="text-white font-medium">{costBreakdown.totalTurns}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400">Characters:</span>
              <span className="text-white font-medium">{costBreakdown.characters}</span>
            </div>
          </div>

          {/* Formula Display */}
          <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Calculation:</div>
            <div className="text-sm text-white font-mono">
              {costBreakdown.totalTurns} turns × {costBreakdown.characters} characters = {totalCost} credits
            </div>
          </div>

          {/* Total Cost */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            <span className="text-slate-300">Total Cost:</span>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className={`font-bold text-lg ${
                hasEnoughCredits ? 'text-amber-400' : 'text-red-400'
              }`}>
                {totalCost}
              </span>
            </div>
          </div>

          {/* Credit Balance Status */}
          <div className="text-xs text-center">
            <span className="text-slate-400">Your balance: </span>
            <span className={`font-medium ${
              hasEnoughCredits ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {userCredits} credits
            </span>
            {!hasEnoughCredits && (
              <div className="text-red-400 mt-1">
                Insufficient credits (need {totalCost - userCredits} more)
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditCostDisplay;
