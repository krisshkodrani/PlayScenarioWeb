
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { Transaction } from '@/hooks/useCreditsPurchase';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTransactionIcon = (type: string, credits: number) => {
    if (type === 'purchase' || credits > 0) {
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No transactions yet</p>
            <p className="text-slate-500 text-sm">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type, transaction.credits)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {transaction.type === 'purchase' ? 'Credit Purchase' : transaction.description}
                      </span>
                      <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{formatDate(transaction.createdAt)}</span>
                      {transaction.paymentMethod && (
                        <>
                          <span>•</span>
                          <span>{transaction.paymentMethod}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.credits > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {transaction.credits > 0 ? '+' : ''}{transaction.credits.toLocaleString()}
                  </div>
                  {transaction.amount > 0 && (
                    <div className="text-xs text-slate-400">
                      ${transaction.amount.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
