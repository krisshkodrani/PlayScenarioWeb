
import { useState, useCallback, useMemo } from 'react';

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

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    credits: 25,
    price: 4.99,
    description: 'Perfect for trying a few scenarios',
    features: [
      '~5-8 scenario conversations',
      'All scenario types',
      'Character interactions',
      'Progress tracking'
    ]
  },
  {
    id: 'popular',
    credits: 100,
    price: 14.99,
    originalPrice: 19.99,
    popular: true,
    savings: 'Save 25%',
    description: 'Great for regular use',
    features: [
      '~20-25 scenario conversations',
      'All scenario types',
      'Character interactions',
      'Progress tracking',
      'Priority support'
    ]
  },
  {
    id: 'pro',
    credits: 300,
    price: 39.99,
    originalPrice: 59.99,
    savings: 'Save 33%',
    description: 'Best value for power users',
    features: [
      '~60-75 scenario conversations',
      'All scenario types',
      'Character interactions',
      'Progress tracking',
      'Priority support',
      'Early access to features'
    ]
  },
  {
    id: 'enterprise',
    credits: 1000,
    price: 99.99,
    originalPrice: 199.99,
    savings: 'Save 50%',
    description: 'For teams and heavy users',
    features: [
      '~200+ scenario conversations',
      'All scenario types',
      'Character interactions',
      'Progress tracking',
      'Priority support',
      'Early access to features',
      'Bulk discount pricing'
    ]
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    credits: 100,
    amount: 14.99,
    type: 'purchase',
    status: 'completed',
    paymentMethod: '•••• 4242',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'txn_002',
    credits: -25,
    amount: 0,
    type: 'usage',
    status: 'completed',
    description: 'Scenario conversations',
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: 'txn_003',
    credits: 25,
    amount: 4.99,
    type: 'purchase',
    status: 'completed',
    paymentMethod: '•••• 1234',
    createdAt: '2024-01-12T09:15:00Z'
  }
];

const processMockPayment = async (paymentData: PaymentData): Promise<PurchaseDetails> => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock success response (95% success rate)
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      credits: paymentData.package.credits,
      amount: paymentData.package.price,
      transactionId: `txn_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  } else {
    throw new Error('Payment failed. Please try again.');
  }
};

export const useCreditsPurchase = () => {
  const [currentBalance, setCurrentBalance] = useState(15);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);

  const selectPackage = useCallback((packageId: string) => {
    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
    setSelectedPackage(pkg || null);
  }, []);

  const processPurchase = useCallback(async (paymentData: PaymentData) => {
    try {
      setPaymentLoading(true);
      const details = await processMockPayment(paymentData);
      
      // Update balance
      setCurrentBalance(prev => prev + details.credits);
      setPurchaseDetails(details);
      setPurchaseComplete(true);
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    } finally {
      setPaymentLoading(false);
    }
  }, []);

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
    recentTransactions: mockTransactions,
    selectPackage,
    processPurchase,
    resetPurchase
  };
};
