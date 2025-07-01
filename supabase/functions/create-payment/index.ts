
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
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    // Parse request body
    const { packageId } = await req.json();
    
    if (!packageId) {
      throw new Error("Package ID is required");
    }

    // Define credit packages
    const packages: Record<string, { credits: number; price: number; name: string }> = {
      'starter': { credits: 25, price: 4.99, name: 'Starter Package' },
      'popular': { credits: 100, price: 14.99, name: 'Popular Package' },
      'pro': { credits: 300, price: 39.99, name: 'Pro Package' },
      'enterprise': { credits: 1000, price: 99.99, name: 'Enterprise Package' }
    };

    const selectedPackage = packages[packageId];
    if (!selectedPackage) {
      throw new Error("Invalid package ID");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: selectedPackage.name },
            unit_amount: Math.round(selectedPackage.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/credits-purchase?success=true`,
      cancel_url: `${req.headers.get("origin")}/credits-purchase?canceled=true`,
      metadata: {
        user_id: user.id,
        package_id: packageId,
        credits_amount: selectedPackage.credits.toString(),
      },
    });

    // Create Supabase service client to bypass RLS
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Record the payment session in our database
    const { error: insertError } = await supabaseService.from("stripe_payments").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      package_id: packageId,
      credits_amount: selectedPackage.credits,
      price_amount: Math.round(selectedPackage.price * 100),
      status: "pending",
    });

    if (insertError) {
      console.error("Error recording payment session:", insertError);
      throw new Error("Failed to record payment session");
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
