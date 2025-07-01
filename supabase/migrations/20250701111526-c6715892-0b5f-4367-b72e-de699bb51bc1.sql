
-- Create table to track Stripe payment sessions
CREATE TABLE public.stripe_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  package_id TEXT NOT NULL,
  credits_amount INTEGER NOT NULL,
  price_amount INTEGER NOT NULL, -- in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on stripe_payments
ALTER TABLE public.stripe_payments ENABLE ROW LEVEL SECURITY;

-- Users can only see their own payment records
CREATE POLICY "Users can view own payments" ON public.stripe_payments
  FOR SELECT USING (user_id = auth.uid());

-- Users can create their own payment records
CREATE POLICY "Users can create own payments" ON public.stripe_payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own payment records
CREATE POLICY "Users can update own payments" ON public.stripe_payments
  FOR UPDATE USING (user_id = auth.uid());

-- Add index for better query performance
CREATE INDEX idx_stripe_payments_user_id ON public.stripe_payments(user_id);
CREATE INDEX idx_stripe_payments_session_id ON public.stripe_payments(stripe_session_id);
CREATE INDEX idx_stripe_payments_status ON public.stripe_payments(status);
