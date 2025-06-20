import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { OnboardingState } from '@/types/onboarding';
import { toast } from 'sonner';

// Type for the Edge Function response
interface OnboardingResponse {
  success: boolean;
  user_id?: string;
  pet_id?: string;
  pet_identifier?: string;
  error?: string;
}

/**
 * Handles file upload for pet photo and returns the URL
 * @param photoFile File object to upload
 * @param userId User ID to associate with the upload
 * @returns URL of the uploaded file or null if upload failed
 */
async function uploadPetPhoto(photoFile: File, userId: string): Promise<string | null> {
  try {
    if (!photoFile) return null;
    
    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${userId}/pets/${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('pet-photos')
      .upload(fileName, photoFile, {
        cacheControl: '3600',
        upsert: false,
      });
      
    if (error) {
      console.error('Error uploading pet photo:', error);
      toast.error('Failed to upload pet photo');
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from('pet-photos')
      .getPublicUrl(data.path);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in photo upload:', error);
    return null;
  }
}

/**
 * Submits all onboarding data to the Edge Function
 */
export async function submitOnboardingData(
  onboardingData: OnboardingState,
  photoFile?: File
): Promise<OnboardingResponse> {
  try {
    // Show processing state
    toast.info("Creating your account and generating unique Pet ID...");
    
    // Upload photo if provided - using a temporary file path since we don't have user ID yet
    // The edge function will associate it with the correct user
    let photoUrl = null;
    
    if (photoFile) {
      try {
        // Generate a random prefix for the file to avoid collisions
        const tempPrefix = `temp_${Math.random().toString(36).substring(2, 15)}`;
        photoUrl = await uploadPetPhoto(photoFile, tempPrefix);
      } catch (error) {
        console.error('Error uploading photo:', error);
        // Continue even if photo upload fails
      }
    }
    
    // Create payload with expected structure for the Edge Function
    const payload = {
      petInfo: {
        name: onboardingData.petInfo.name,
        type: onboardingData.petInfo.type,
        breed: onboardingData.petInfo.breed,
        gender: onboardingData.petInfo.gender,
        // Use snake_case to match DB and Edge Function schema
        birth_or_adoption_date: onboardingData.petInfo.birth_or_adoption_date
          ? format(new Date(onboardingData.petInfo.birth_or_adoption_date), 'yyyy-MM-dd')
          : '',
        photoFileUrl: photoUrl || '',
      },
      ownerInfo: {
        firstName: onboardingData.ownerInfo.firstName,
        lastName: onboardingData.ownerInfo.lastName,
        fullName: `${onboardingData.ownerInfo.firstName} ${onboardingData.ownerInfo.lastName}`,
        zipCode: onboardingData.ownerInfo.zipCode,
        phone: onboardingData.ownerInfo.phone || '',
        smsOptIn: onboardingData.ownerInfo.smsOptIn
      },
      petLifestyle: {
        food: onboardingData.petLifestyle.food,
        treats: onboardingData.petLifestyle.treats,
        allergies: onboardingData.petLifestyle.allergies || [],
        insurance: onboardingData.petLifestyle.insurance || '',
        // Keep medications as string arrays - don't transform to objects
        medications: Array.isArray(onboardingData.petLifestyle.medications) 
          ? onboardingData.petLifestyle.medications.filter(med => typeof med === 'string')
          : [],
        supplements: Array.isArray(onboardingData.petLifestyle.supplements) 
          ? onboardingData.petLifestyle.supplements 
          : []
      },
      accountInfo: {
        email: onboardingData.accountInfo.email,
        password: onboardingData.accountInfo.password
      }
    };
    
    // Enhanced logging for debugging email issue
    console.log('EMAIL DEBUG: accountInfo in onboardingData:', JSON.stringify({
      email: onboardingData.accountInfo?.email || 'MISSING!',
      password_length: onboardingData.accountInfo?.password ? onboardingData.accountInfo.password.length : 0
    }));
    
    // Log the complete payload structure for debugging (redact password)
    console.log('Submitting onboarding payload:', {
      ...payload,
      accountInfo: { 
        ...payload.accountInfo, 
        password: '[REDACTED]', 
        email_exists: !!payload.accountInfo.email,
        email_length: payload.accountInfo.email?.length || 0
      },
      petLifestyle: { ...payload.petLifestyle, medications: '[ARRAY]', supplements: '[ARRAY]' }
    });
    
    // 4. Call the Edge Function
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create_onboarding_data`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(payload)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process onboarding data');
    }
    
    const result: OnboardingResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Unknown error during onboarding');
    }
    
    // 5. Return the result
    return result;
    
  } catch (error) {
    console.error('Error in onboarding submission:', error);
    toast.error(error instanceof Error ? error.message : 'Error during onboarding');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
