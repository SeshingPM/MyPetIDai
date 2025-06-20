
import { supabase } from '@/integrations/supabase/client';
import { Photo } from '../types/photos';
import { toast } from 'sonner';

export const fetchPhotos = async (petId: string): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('pet_id', petId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
    
    // Map to Photo interface
    return data.map(photo => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption || undefined,
      createdAt: photo.created_at
    }));
  } catch (error) {
    console.error('Error fetching pet photos:', error);
    throw error;
  }
};

export const deletePhoto = async (photoId: string): Promise<void> => {
  // First get the photo URL to delete from storage
  const { data: photoData } = await supabase
    .from('photos')
    .select('url')
    .eq('id', photoId)
    .single();
    
  if (photoData) {
    // Get the storage path from the URL
    const url = new URL(photoData.url);
    const storagePath = url.pathname.split('/').slice(3).join('/');
    
    // Delete from storage
    if (storagePath) {
      await supabase.storage
        .from('pet-photos')
        .remove([storagePath]);
    }
  }
  
  // Delete from database
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId);
    
  if (error) throw error;
};
