
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/dashboard';
import { Coins, Plus } from 'lucide-react';

interface CreditStatusCardProps {
  balance: number;
  recentTransactions: Transaction[];
  lowCreditThreshold?: number;
  onPurchaseCredits: () => void;
}

const CreditStatusCard: React.FC<CreditStatusCardProps> = ({
  balance,
  recentTransactions,
  lowCreditThreshold = 10,
  onPurchaseCredits
}) => {
  const isLowCredit = balance <= lowCreditThreshold;
  
  const formatTransaction = (transaction: Transaction) => {
    const isPositive = transaction.amount > 0;
    return {
      ...transaction,
      isPositive,
      displayChange: `${isPositive ? '+' : ''}${transaction.amount}`
    };
  };

  return (
    <Card className="bg-slate-800 border-slate-700 h-[224px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          Credit Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="text-center mb-6">
          <div className={`text-4xl font-bold mb-2 ${isLowCredit ? 'text-amber-400' : 'text-emerald-400'}`}>
            {balance}
          </div>
          <p className="text-slate-400 text-sm">Credits remaining</p>
        </div>

        <Button 
          onClick={onPurchaseCredits}
          className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-900 mb-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Purchase Credits
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreditStatusCard;
