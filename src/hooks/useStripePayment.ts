
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StripePaymentHook {
  processStripePayment: (packageId: string) => Promise<void>;
  verifyPayment: (sessionId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useStripePayment = (): StripePaymentHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const processStripePayment = useCallback(async (packageId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Creating Stripe payment session for package:', packageId);

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { packageId }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment session');
      }

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const verifyPayment = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      console.log('Verifying payment session:', sessionId);

      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) {
        throw new Error(error.message || 'Payment verification failed');
      }

      if (data?.success) {
        toast({
          title: "Payment Successful!",
          description: `${data.credits} credits have been added to your account.`,
        });
        return true;
      }

      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
      setError(errorMessage);
      console.error('Payment verification error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    processStripePayment,
    verifyPayment,
    loading,
    error
  };
};
