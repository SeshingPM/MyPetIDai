
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UseCustomCategoriesReturn {
  categories: string[];
  isLoading: boolean;
  addCategory: (category: string) => Promise<void>;
  removeCategory: (category: string) => Promise<void>;
}

export const useCustomCategories = (): UseCustomCategoriesReturn => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories from Supabase or localStorage
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        // First try to get from Supabase if user is logged in
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData.user) {
          // User is logged in, try to get categories from their profile
          const { data } = await supabase
            .from('profiles')
            .select('custom_categories')
            .eq('id', userData.user.id)
            .single();
            
          if (data && data.custom_categories) {
            setCategories(data.custom_categories);
          } else {
            // If no categories in profile, fall back to localStorage
            const storedCategories = localStorage.getItem('customDocumentCategories');
            if (storedCategories) {
              const parsedCategories = JSON.parse(storedCategories);
              setCategories(parsedCategories);
              
              // Save categories to profile for next time
              await saveToSupabase(userData.user.id, parsedCategories);
            }
          }
        } else {
          // User not logged in, use localStorage
          const storedCategories = localStorage.getItem('customDocumentCategories');
          if (storedCategories) {
            setCategories(JSON.parse(storedCategories));
          }
        }
      } catch (error) {
        console.error('Error loading custom categories:', error);
        // Fallback to localStorage in case of error
        const storedCategories = localStorage.getItem('customDocumentCategories');
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        }
        toast.error('Failed to load custom categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Helper function to save categories to Supabase
  const saveToSupabase = async (userId: string, categories: string[]) => {
    try {
      await supabase
        .from('profiles')
        .update({ custom_categories: categories })
        .eq('id', userId);
      return true;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      return false;
    }
  };

  // Save categories to localStorage and user preferences if logged in
  const saveCategories = async (newCategories: string[]) => {
    // Always save to localStorage as fallback
    localStorage.setItem('customDocumentCategories', JSON.stringify(newCategories));
    
    try {
      // Try to save to user profile if logged in
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await saveToSupabase(userData.user.id, newCategories);
      }
    } catch (error) {
      console.error('Error saving custom categories:', error);
      // No need to notify user as categories are saved to localStorage as fallback
    }
  };

  // Add a new category
  const addCategory = async (category: string) => {
    if (!category.trim()) return;
    
    if (!categories.includes(category)) {
      const newCategories = [...categories, category];
      setCategories(newCategories);
      await saveCategories(newCategories);
      toast.success(`Added category "${category}"`);
    }
  };

  // Remove a category
  const removeCategory = async (category: string) => {
    const newCategories = categories.filter(c => c !== category);
    setCategories(newCategories);
    await saveCategories(newCategories);
    toast.success(`Removed category "${category}"`);
  };

  return {
    categories,
    isLoading,
    addCategory,
    removeCategory,
  };
};
