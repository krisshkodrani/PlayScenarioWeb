import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStripePayment } from './useStripePayment';
import { useToast } from '@/hooks/use-toast';

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  savings?: string;
  description: string;
  features: string[];
}

export interface PaymentData {
  package: CreditPackage;
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
  email: string;
}

export interface PurchaseDetails {
  credits: number;
  amount: number;
  transactionId: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  credits: number;
  amount: number;
  type: 'purchase' | 'usage';
  status: 'completed' | 'pending' | 'failed';
  paymentMethod?: string;
  description?: string;
  createdAt: string;
}

// Simplified to a single monthly subscription offering
const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'pro',
    credits: 5000,
    price: 4.99,
    description: '5,000 credits recharged every month',
    features: [
      'Monthly credit recharge',
      'All scenario types',
      'Character interactions',
      'Progress tracking',
      'Priority support'
    ]
  }
];

export const useCreditsPurchase = () => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { processStripePayment, verifyPayment, loading: paymentLoading } = useStripePayment();
  const { toast } = useToast();

  // Fetch user's current credit balance
  const fetchBalance = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (profile) {
        setCurrentBalance(profile.credits);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, []);

  // Fetch recent transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactions) {
        const formattedTransactions: Transaction[] = transactions.map(t => ({
          id: t.id,
          credits: t.type === 'credit' ? t.amount : -t.amount,
          amount: t.type === 'credit' ? 0 : 0, // We don't store price in transactions table
          type: t.type === 'credit' ? 'purchase' : 'usage',
          status: 'completed',
          description: t.description || 'Transaction',
          createdAt: t.created_at
        }));
        setRecentTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchBalance(), fetchTransactions()]);
      setLoading(false);
    };

    initializeData();
  }, [fetchBalance, fetchTransactions]);

  // Check for payment success/cancellation in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      verifyPayment(sessionId).then((verified) => {
        if (verified) {
          // Refresh balance and transactions
          fetchBalance();
          fetchTransactions();
          
          // Clear URL params
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    }
  }, [verifyPayment, fetchBalance, fetchTransactions]);

  const selectPackage = useCallback((packageId: string) => {
    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
    setSelectedPackage(pkg || null);
  }, []);

  const processPurchase = useCallback(async (paymentData: PaymentData) => {
    try {
      // Use Stripe payment instead of mock payment
      await processStripePayment(paymentData.package.id);
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  }, [processStripePayment]);

  const resetPurchase = useCallback(() => {
    setPurchaseComplete(false);
    setPurchaseDetails(null);
    setSelectedPackage(null);
  }, []);

  return {
    currentBalance,
    packages: CREDIT_PACKAGES,
    selectedPackage,
    paymentLoading,
    purchaseComplete,
    purchaseDetails,
    recentTransactions,
    loading,
    selectPackage,
    processPurchase,
    resetPurchase,
    refreshBalance: fetchBalance
  };
};
