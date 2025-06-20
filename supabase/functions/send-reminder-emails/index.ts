import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";
import { format, parseISO } from "https://esm.sh/date-fns@2.30.0";
import { corsHeaders, createResponse, createErrorResponse, validateToken } from "../_shared/auth.ts";
import { sendEmail } from "../_shared/postmark.ts";

interface Reminder {
  id: string;
  title: string;
  date: string;
  pet_id: string;
  pet_name: string;
  notes?: string;
  custom_time?: string;
  notification_sent: boolean;
}

interface UserPreference {
  user_id: string;
  email_notifications: boolean;
  reminder_advance_notice: number;
  reminder_time: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}

serve(async (req) => {
  console.log("Processing pending reminder notifications");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Get the authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return createErrorResponse("Authorization header is required", null, 401);
  }
  
  // Extract the token
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Decode the token without verification to check the role
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const decoded = JSON.parse(atob(tokenParts[1]));
      
      // If it's a service role token, allow the request
      if (decoded.role === 'service_role') {
        console.log("Authenticated using service role token");
      } else {
        // For non-service role tokens, validate normally
        const { valid, error } = await validateToken(req);
        if (!valid) {
          return createErrorResponse(error || "Unauthorized", null, 401);
        }
      }
    } else {
      // Not a JWT token, validate normally
      const { valid, error } = await validateToken(req);
      if (!valid) {
        return createErrorResponse(error || "Unauthorized", null, 401);
      }
    }
  } catch (e) {
    console.error("Error validating token:", e);
    return createErrorResponse("Invalid token format", null, 401);
  }
  
  try {
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get current time in UTC
    const now = new Date();
    
    // Get all user preferences with email notifications enabled
    const { data: userPreferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('email_notifications', true);
    
    if (preferencesError) {
      throw new Error(`Error fetching user preferences: ${preferencesError.message}`);
    }
    
    if (!userPreferences || userPreferences.length === 0) {
      console.log("No users with email notifications enabled");
      return createResponse({ message: "No users with email notifications enabled" });
    }
    
    console.log(`Found ${userPreferences.length} users with notifications enabled`);
    
    // Process each user's reminders
    const processedReminders = [];
    
    for (const userPref of userPreferences) {
      // Get user profile to get their full name
      const { data: userProfile, error: userProfileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', userPref.user_id)
        .single();
      
      if (userProfileError) {
        console.error(`Error fetching user profile for user ${userPref.user_id}: ${userProfileError.message}`);
        continue;
      }

      // Get user email from auth.users using our custom function
      const { data: userData, error: userEmailError } = await supabase
        .rpc('get_user_email', { user_id: userPref.user_id });
      
      if (userEmailError || !userData) {
        console.error(`Error fetching user email for user ${userPref.user_id}: ${userEmailError?.message || 'Email not found'}`);
        continue;
      }

      const userEmail = userData;
      
      // Determine notification window - when should we send reminders?
      const hoursBeforeReminder = userPref.reminder_advance_notice || 24;
      const notificationWindowStart = new Date(now);
      const notificationWindowEnd = new Date(now);
      notificationWindowEnd.setHours(notificationWindowEnd.getHours() + 1); // Look 1 hour ahead
      
      // Find reminders that should be sent now (due within the next hour or overdue)
      const { data: reminders, error: remindersError } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userPref.user_id)
        .eq('archived', false)
        .eq('notification_sent', false)
        .lt('date', notificationWindowEnd.toISOString()); // Include all reminders due before the end of the window
      
      if (remindersError) {
        console.error(`Error fetching reminders for user ${userPref.user_id}: ${remindersError.message}`);
        continue;
      }
      
      if (!reminders || reminders.length === 0) {
        console.log(`No pending reminders for user ${userPref.user_id}`);
        continue;
      }
      
      console.log(`Found ${reminders.length} pending reminders for user ${userPref.user_id}`);
      
      // Process each reminder
      for (const reminder of reminders) {
        // Format the reminder date
        const reminderDate = parseISO(reminder.date);
        const formattedDate = format(reminderDate, 'MMM d, yyyy');
        
        // Send email notification
        try {
          // Send email using Postmark
          const emailResult = await sendEmail({
            to: userEmail,
            subject: `Reminder: ${reminder.title}`,
            html: `
              <h2>Reminder: ${reminder.title}</h2>
              <p>Hello ${userProfile.full_name || 'there'},</p>
              <p>This is a reminder for your pet ${reminder.pet_name}:</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              ${reminder.notes ? `<p><strong>Notes:</strong> ${reminder.notes}</p>` : ''}
              <p>You can view and manage all your reminders in the MyPetID app.</p>
            `
          });
          
          if (!emailResult.success) {
            console.error(`Error sending reminder email for ${reminder.id}: ${JSON.stringify(emailResult.error)}`);
            continue;
          }
          
          // Mark the reminder as notified in the database
          const { data, error: updateError } = await supabase
            .from('reminders')
            .update({ notification_sent: true })
            .eq('id', reminder.id)
            .select()
            .single();
          
          if (updateError) {
            console.error(`Error updating reminder ${reminder.id}: ${updateError.message}`);
            continue;
          }
          
          console.log(`Sent reminder email for "${reminder.title}" (${reminder.id}) for date: ${formattedDate}`);
          processedReminders.push({
            id: reminder.id,
            title: reminder.title,
            user_id: userPref.user_id,
            pet_name: reminder.pet_name,
            date: formattedDate
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`Error processing reminder ${reminder.id}: ${errorMessage}`);
        }
      }
    }
    
    return createResponse({ 
      success: true, 
      message: `Processed ${processedReminders.length} reminders`, 
      processed: processedReminders 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing reminder emails: ${errorMessage}`);
    return createErrorResponse(errorMessage, null, 500);
  }
});
