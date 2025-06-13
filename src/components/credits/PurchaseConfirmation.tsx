
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Coins, Receipt, ArrowRight } from 'lucide-react';
import { PurchaseDetails } from '@/hooks/useCreditsPurchase';

interface PurchaseConfirmationProps {
  purchaseDetails: PurchaseDetails;
  newBalance: number;
  onContinue: () => void;
}

const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({
  purchaseDetails,
  newBalance,
  onContinue
}) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <CardTitle className="text-3xl text-white mb-2">Purchase Successful!</CardTitle>
          <p className="text-slate-400">Your credits have been added to your account</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* New Balance Display */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-lg p-6 text-center border border-cyan-400/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-6 h-6 text-cyan-400" />
              <span className="text-lg text-slate-300">New Balance</span>
            </div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">
              {newBalance.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">
              +{purchaseDetails.credits.toLocaleString()} credits added
            </div>
          </div>

          {/* Purchase Details */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-white font-mono text-sm">{purchaseDetails.transactionId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Credits Purchased:</span>
                <span className="text-cyan-400 font-semibold">
                  {purchaseDetails.credits.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Amount Charged:</span>
                <span className="text-white font-semibold">${purchaseDetails.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-white">{formatDate(purchaseDetails.timestamp)}</span>
              </div>
            </div>
          </div>

          {/* Email Confirmation Notice */}
          <div className="bg-violet-500/10 border border-violet-400/20 rounded-lg p-4">
            <p className="text-violet-300 text-sm text-center">
              📧 A confirmation email has been sent to your account
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onContinue}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium h-12"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Continue to Dashboard
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 h-12"
              onClick={() => window.print()}
            >
              <Receipt className="w-5 h-5 mr-2" />
              Print Receipt
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="text-center pt-4">
            <p className="text-slate-400 text-sm mb-3">Ready to start creating?</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
              >
                Create New Scenario
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-violet-400 hover:text-violet-300 hover:bg-violet-400/10"
              >
                Browse Scenarios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseConfirmation;
