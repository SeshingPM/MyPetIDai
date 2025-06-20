
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MessageSquare, Bug, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'other'], {
    required_error: 'Please select a feedback type',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters',
  }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  onSubmitSuccess: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmitSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: 'bug',
      description: '',
    },
  });

  const onSubmit = async (values: FeedbackFormValues) => {
    try {
      // Show loading state
      const loadingToast = toast({
        title: 'Submitting feedback',
        description: 'Please wait...',
      });
      
      // Prepare the feedback data with user info if available
      const feedbackData = {
        ...values,
        userId: user?.id,
        userName: user?.user_metadata?.full_name,
        userEmail: user?.email,
      };
      
      // Send to our edge function
      const { data, error } = await supabase.functions.invoke('send-feedback', {
        body: feedbackData,
      });
      
      if (error) throw new Error(error.message);
      
      // Log the response
      console.log('Feedback submitted successfully:', data);
      
      // Dismiss loading toast
      loadingToast.dismiss?.();
      
      // Show success toast
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback! Our team will review it shortly.',
      });
      
      // Reset form and close dialog
      form.reset();
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'There was a problem submitting your feedback. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bug" className="flex items-center">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4 text-red-500" />
                      <span>Report a bug</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="feature">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                      <span>Suggest a feature</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span>Other feedback</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please describe your feedback in detail..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSubmitSuccess}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedbackForm;
