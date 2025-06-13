
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/navigation/PageHeader';
import CreditPackages from '@/components/credits/CreditPackages';
import PaymentForm from '@/components/credits/PaymentForm';
import PurchaseConfirmation from '@/components/credits/PurchaseConfirmation';
import TransactionHistory from '@/components/credits/TransactionHistory';
import { useCreditsPurchase } from '@/hooks/useCreditsPurchase';
import { Coins } from 'lucide-react';

const CreditsPurchase: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentBalance,
    packages,
    selectedPackage,
    paymentLoading,
    purchaseComplete,
    purchaseDetails,
    recentTransactions,
    selectPackage,
    processPurchase,
    resetPurchase
  } = useCreditsPurchase();

  const handleContinue = () => {
    resetPurchase();
    navigate('/dashboard');
  };

  const customBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Credits', href: undefined },
    { label: 'Purchase', href: undefined }
  ];

  const headerBadge = (
    <div className="flex items-center gap-2 bg-slate-800 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium border border-slate-700">
      <Coins className="w-4 h-4" />
      <span>{currentBalance} credits</span>
    </div>
  );

  const subtitle = currentBalance < 5 
    ? "⚠️ Low balance - Purchase credits to continue creating scenarios"
    : "Choose a package to continue creating scenarios";

  if (purchaseComplete && purchaseDetails) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <PurchaseConfirmation
            purchaseDetails={purchaseDetails}
            newBalance={currentBalance}
            onContinue={handleContinue}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Purchase Credits"
          subtitle={subtitle}
          badge={headerBadge}
          customBreadcrumbs={customBreadcrumbs}
        />

        <div className="space-y-8">
          {/* Main Content Area */}
          <div className="space-y-8">
            <CreditPackages
              packages={packages}
              selectedPackage={selectedPackage?.id || null}
              onSelectPackage={selectPackage}
            />

            {selectedPackage && (
              <PaymentForm
                selectedPackage={selectedPackage}
                onPayment={processPurchase}
                loading={paymentLoading}
              />
            )}
          </div>

          {/* Transaction History - Below main content */}
          <div className="max-w-4xl mx-auto">
            <TransactionHistory transactions={recentTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPurchase;
