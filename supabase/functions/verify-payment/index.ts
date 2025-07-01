
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client using the anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Parse request body
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Payment not completed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create Supabase service client to bypass RLS
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the payment record
    const { data: paymentData, error: paymentError } = await supabaseService
      .from("stripe_payments")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (paymentError || !paymentData) {
      throw new Error("Payment record not found");
    }

    // Only process if payment is still pending
    if (paymentData.status === 'pending') {
      // Update payment status
      const { error: updateError } = await supabaseService
        .from("stripe_payments")
        .update({ 
          status: "completed", 
          completed_at: new Date().toISOString() 
        })
        .eq("id", paymentData.id);

      if (updateError) {
        throw new Error("Failed to update payment status");
      }

      // Add credits to user profile using the existing function
      const { error: creditsError } = await supabaseService.rpc('add_credits', {
        user_id: user.id,
        amount: paymentData.credits_amount,
        description: `Credit purchase - ${paymentData.package_id} package`
      });

      if (creditsError) {
        console.error("Error adding credits:", creditsError);
        throw new Error("Failed to add credits to user account");
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      credits: paymentData.credits_amount,
      message: "Payment verified and credits added successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
