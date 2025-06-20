import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.22.4";

// Types
type SupabaseClient = ReturnType<typeof createClient>;

// Define validation schemas
const PetInfoSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  type: z.string().min(1, "Pet type is required"),
  breed: z.string().min(1, "Breed is required"),
  gender: z.string().min(1, "Gender is required"),
  birth_or_adoption_date: z.string().min(1, "Date is required"), // Changed to snake_case to match DB
  photoFileUrl: z.string().default(""), // Allow empty string
});

const OwnerInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  fullName: z.string().min(1, "Full name is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  phone: z.string().default(""), // Allow empty string
  smsOptIn: z.boolean().default(false),
});

// Allow both string and object for medications
const MedicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.string().optional().nullable(),
  dosage: z.string().optional().nullable(),
  frequency: z.string().optional().nullable(),
});

const PetLifestyleSchema = z.object({
  food: z.array(z.string()).default([]), // Changed from string to array
  treats: z.array(z.string()).default([]), // Changed from string to array
  allergies: z.array(z.string()).default([]), // Changed from string to array
  medications: z.array(z.string()).default([]), // Changed from object array to string array
  supplements: z.array(z.string()).default([]), // Keep as is
  insurance: z.string().default(""), // Keep as is
});

const AccountInfoSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Combine schemas
const OnboardingPayloadSchema = z.object({
  petInfo: PetInfoSchema,
  ownerInfo: OwnerInfoSchema,
  petLifestyle: PetLifestyleSchema,
  accountInfo: AccountInfoSchema
});

// Error handling
class OnboardingError extends Error {
  statusCode: number;
  context: Record<string, any>;
  
  constructor(message: string, statusCode = 400, context = {}) {
    super(message);
    this.name = "OnboardingError";
    this.statusCode = statusCode;
    this.context = context;
  }
}

// Logger to ensure all errors are properly captured in Supabase logs
const logger = {
  info: (message: string, data?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      data
    }));
  },
  error: (message: string, error?: any, context?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error instanceof OnboardingError ? { statusCode: error.statusCode, context: error.context } : {})
      } : error,
      context
    }));
  },
  warn: (message: string, data?: any) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      data
    }));
  }
}

// Generate unique Pet ID - fallback if DB function isn't called or fails
async function generateUniquePetId(supabase: SupabaseClient): Promise<string> {
  const MAX_ATTEMPTS = 10;
  let attempts = 0;
  let isUnique = false;
  let petId = "";
  
  while (!isUnique && attempts < MAX_ATTEMPTS) {
    // Generate a pet ID (6 digits)
    petId = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Check if it already exists
    const { data, error } = await supabase
      .from('pets')
      .select('id')
      .eq('pet_identifier', petId)
      .single();
    
    isUnique = !data && !error;
    attempts++;
  }
  
  if (!isUnique) {
    throw new OnboardingError('Could not generate a unique pet ID after multiple attempts', 500);
  }
  
  return petId;
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request
    const payload = await req.json();
    const { petInfo, ownerInfo, petLifestyle, accountInfo } = payload;

    // Enhanced logging for debugging email issue
    console.log("Received onboarding data for processing...");
    console.log("DEBUG - Full request body:", JSON.stringify({
      petInfo: { ...petInfo },
      ownerInfo: { ...ownerInfo },
      petLifestyle: { ...petLifestyle },
      accountInfo: { 
        email_exists: !!accountInfo?.email, 
        email_length: accountInfo?.email?.length || 0,
        password_exists: !!accountInfo?.password,
        password_length: accountInfo?.password?.length || 0
      }
    }));

    // Log received payload (without sensitive data)
    logger.info('Received onboarding payload', { 
      petInfo: { ...petInfo, password: undefined },
      ownerInfo: { ...ownerInfo },
      petLifestyle: { ...petLifestyle },
      // Exclude accountInfo with password
    });
    
    // Validate payload
    const validationResult = OnboardingPayloadSchema.safeParse(payload);
    
    if (!validationResult.success) {
      logger.error('Payload validation failed', validationResult.error);
      throw new OnboardingError(`Validation failed: ${validationResult.error.message}`, 400, {
        zodErrors: validationResult.error.errors
      });
    }
    
    logger.info('Payload validation successful');
    
    // Use validated data (with different variable names to avoid redeclaration)
    const { 
      petInfo: validatedPetInfo, 
      ownerInfo: validatedOwnerInfo, 
      petLifestyle: validatedPetLifestyle, 
      accountInfo: validatedAccountInfo 
    } = validationResult.data;

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      logger.error('Missing required environment variables', { 
        hasUrl: !!supabaseUrl,
        hasServiceRoleKey: !!supabaseServiceRoleKey
      });
      throw new Error('Missing Supabase environment variables');
    }

    logger.info('Initializing Supabase admin client', { url: supabaseUrl });

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Create user account with Supabase Auth
    logger.info('Creating user account');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validatedAccountInfo.email,
      password: validatedAccountInfo.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: validatedOwnerInfo.fullName,
      }
    });

    if (authError || !authData.user) {
      logger.error('Failed to create user account', authError, { email: validatedAccountInfo.email });
      throw new OnboardingError(`Failed to create user account: ${authError?.message || 'Unknown error'}`, 500, {
        authErrorCode: authError?.code,
        email: validatedAccountInfo.email
      });
    }
    
    logger.info('User account created successfully', { userId: authData.user.id });

    const userId = authData.user.id;

    // We'll use RPC to call the database functions
    logger.info('Creating pet profile via RPC', { userId });
    
    const rpcParams = {
      p_user_id: userId,
      p_pet_name: validatedPetInfo.name,
      p_pet_type: validatedPetInfo.type,
      p_pet_breed: validatedPetInfo.breed,
      p_pet_gender: validatedPetInfo.gender,
      p_birth_or_adoption_date: validatedPetInfo.birth_or_adoption_date,
      p_photo_url: validatedPetInfo.photoFileUrl || null,
      p_owner_full_name: validatedOwnerInfo.fullName,
      p_owner_zip_code: validatedOwnerInfo.zipCode,
      p_owner_phone: validatedOwnerInfo.phone || null,
      p_owner_sms_opt_in: validatedOwnerInfo.smsOptIn,
      p_food: JSON.stringify(validatedPetLifestyle.food), // Convert array to JSON string
      p_treats: JSON.stringify(validatedPetLifestyle.treats), // Convert array to JSON string
      p_allergies: JSON.stringify(validatedPetLifestyle.allergies), // Convert array to JSON string
      p_insurance: validatedPetLifestyle.insurance || null,
      p_medications: JSON.stringify(validatedPetLifestyle.medications),
      p_supplements: JSON.stringify(validatedPetLifestyle.supplements)
    };
    
    logger.info('RPC parameters prepared', { ...rpcParams, medications: '[redacted]', supplements: '[redacted]' });
    
    const { data: petData, error: petError } = await supabaseAdmin.rpc(
      'create_complete_pet_profile', 
      rpcParams
    );

    if (petError || !petData) {
      logger.error('Failed to create pet profile via RPC', petError, { userId, petName: petInfo.name });
      
      // Clean up: delete the user if pet creation failed
      logger.warn('Cleaning up - deleting user account after failed pet profile creation', { userId });
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (deleteError) {
        logger.error('Failed to clean up user account after pet profile creation error', deleteError);
      }
      
      throw new OnboardingError(`Failed to create pet profile: ${petError?.message || 'Unknown error'}`, 500, {
        rpcError: petError,
        petInfo: { name: petInfo.name, type: petInfo.type, breed: petInfo.breed }
      });
    }
    
    logger.info('Pet profile created successfully via RPC', { 
      petData: JSON.stringify(petData),
      petDataType: typeof petData,
      hasPetId: !!petData?.pet_id
    });

    // Check if we got a valid pet_id back
    if (!petData?.pet_id) {
      logger.error('Missing pet_id in RPC response', { petData: JSON.stringify(petData) });
      throw new OnboardingError('Missing pet_id in database function response', 500, { petData });
    }

    // Get the generated Pet ID
    logger.info('Fetching generated pet identifier', { petId: petData.pet_id });
    
    const { data: petRecord, error: fetchError } = await supabaseAdmin
      .from('pets')
      .select('pet_identifier')
      .eq('id', petData.pet_id)
      .single();

    if (fetchError || !petRecord) {
      logger.error('Failed to fetch pet identifier', fetchError, { petId: petData.pet_id });
      throw new OnboardingError(`Failed to fetch pet identifier: ${fetchError?.message || 'Unknown error'}`, 500, {
        petId: petData.pet_id
      });
    }
    
    logger.info('Retrieved pet identifier successfully', { petIdentifier: petRecord.pet_identifier });

    // Success response
    logger.info('Onboarding process completed successfully', { 
      userId, 
      petId: petData.pet_id,
      petIdentifier: petRecord.pet_identifier 
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        pet_id: petData.pet_id,
        pet_identifier: petRecord.pet_identifier
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    // Log the complete error details
    logger.error('Onboarding process failed', error, {
      errorType: error instanceof OnboardingError ? 'OnboardingError' : 'UnknownError',
      timestamp: new Date().toISOString(),
      context: error instanceof OnboardingError ? error.context : undefined
    });
    
    // Determine the status code
    const statusCode = error instanceof OnboardingError ? error.statusCode : 500;
    
    // Include more detailed error information in the response
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      errorType: error instanceof Error ? error.name : 'UnknownError',
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2) // Generate a unique error ID for tracking
    };
    
    // Log the error response being sent
    logger.info('Sending error response', errorResponse);
    
    // Error response
    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode
      }
    );
  }
});
