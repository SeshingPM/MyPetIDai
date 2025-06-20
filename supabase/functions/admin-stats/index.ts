// Import required Deno libraries
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body if present
    let period = "7d";
    try {
      if (req.method === "POST") {
        const body = await req.json();
        period = body?.period || "7d";
      }
    } catch (error) {
      console.log("No body or invalid JSON");
    }

    // Create a Supabase client with the auth header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get Supabase URL from environment
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    // Verify we're using the correct database in production
    if (
      supabaseUrl.includes("yyqodsrvslheazteialw") &&
      Deno.env.get("ENVIRONMENT") === "production"
    ) {
      console.error(
        "CRITICAL ERROR: Edge function using test database in production environment"
      );
      return new Response(
        JSON.stringify({
          error: "Configuration Error",
          message:
            "Edge function is configured to use test database in production",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a Supabase client with the auth token
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    // Determine the interval based on period
    let interval;
    switch (period) {
      case "30d":
        interval = "30 days";
        break;
      case "90d":
        interval = "90 days";
        break;
      case "all":
        interval = "100 years"; // A very large interval to get all data
        break;
      case "7d":
      default:
        interval = "7 days";
        break;
    }

    // Call the RPC function to get admin stats with the period
    const { data: statsData, error: statsError } =
      await supabase.rpc("get_admin_stats");

    if (statsError) {
      console.error("Error fetching admin stats:", statsError);
      return new Response(JSON.stringify({ error: statsError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get recent users for chart data
    const { data: recentUsers, error: recentUsersError } = await supabase
      .from("user_registration_status")
      .select("created_at")
      .order("created_at", { ascending: true })
      .gte(
        "created_at",
        new Date(Date.now() - 86400000 * parseInt(interval)).toISOString()
      );

    // Fetch recent activity data
    const { data: recentActivities, error: activitiesError } = await supabase
      .from("user_registration_status")
      .select("user_id, registration_status, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(10);

    // Fetch user emails for the activities
    let activities = [];
    if (recentActivities && recentActivities.length > 0) {
      // Get user emails for each activity
      for (const activity of recentActivities) {
        const { data: userData } = await supabase.rpc("get_user_by_email", {
          p_email: activity.user_id,
        });

        activities.push({
          type:
            activity.registration_status === "completed"
              ? "Registration"
              : "Signup",
          user: userData?.[0]?.email || activity.user_id,
          timestamp: new Date(activity.updated_at).toLocaleString(),
          details:
            activity.registration_status === "completed"
              ? "Completed registration"
              : "Started registration process",
        });
      }
    }

    // Process user registration data into chart format
    let chartData = [];
    if (recentUsers && !recentUsersError) {
      // Group by day
      const usersByDay = recentUsers.reduce((acc, { created_at }) => {
        const date = new Date(created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Convert to array format for chart
      chartData = Object.entries(usersByDay).map(([date, count]) => ({
        name: date,
        users: count,
        pets: Math.floor(count * 0.8), // Estimate pets as 80% of users for now
      }));
    }

    // Return the combined data
    return new Response(
      JSON.stringify({
        ...statsData,
        chart_data: chartData,
        recent_activities: activities,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in admin-stats function:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
