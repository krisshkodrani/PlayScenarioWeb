
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Transaction } from '@/types/dashboard';
import { Coins, TrendingUp, AlertTriangle, Plus } from 'lucide-react';

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
    const isPositive = transaction.credits_change > 0;
    return {
      ...transaction,
      isPositive,
      displayChange: `${isPositive ? '+' : ''}${transaction.credits_change}`
    };
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          Credit Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className={`text-4xl font-bold mb-2 ${isLowCredit ? 'text-amber-400' : 'text-emerald-400'}`}>
            {balance}
          </div>
          <p className="text-slate-400 text-sm">Credits remaining</p>
        </div>

        {isLowCredit && (
          <Alert className="border-amber-400 bg-amber-500/10 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-300 text-sm">
              You have {balance} credits remaining. Consider purchasing more to continue playing.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={onPurchaseCredits}
          className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-900 mb-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Purchase Credits
        </Button>

        {recentTransactions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Recent Transactions</h4>
            <div className="space-y-2">
              {recentTransactions.slice(0, 3).map((transaction) => {
                const formatted = formatTransaction(transaction);
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-2 rounded bg-slate-700/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate">{transaction.reason}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${
                      formatted.isPositive ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {formatted.displayChange}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditStatusCard;
