
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useReferralCodeValidation } from './useReferralCodeValidation';

const codeSchema = z.object({
  code: z.string()
    .min(3, 'Code must be at least 3 characters long')
    .max(20, 'Code must be less than 20 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, hyphens, and underscores are allowed')
});

interface ReferralCodeFormProps {
  onSubmit: (code: string) => Promise<boolean>;
  isSaving: boolean;
}

const ReferralCodeForm: React.FC<ReferralCodeFormProps> = ({ onSubmit, isSaving }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: ''
    }
  });

  const watchedCode = watch('code');
  const { isChecking, codeExists, setCodeExists, checkCodeAvailability } = useReferralCodeValidation();

  const handleFormSubmit = async (data: { code: string }) => {
    await onSubmit(data.code);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="code">Create Your Referral Code</Label>
        <div className="flex mt-1.5">
          <Input 
            id="code"
            {...register('code')}
            placeholder="yourcode"
            onBlur={() => watchedCode && checkCodeAvailability(watchedCode)}
            onChange={() => setCodeExists(false)}
            className="rounded-r-none"
          />
          <Button 
            type="submit" 
            disabled={isSaving || isChecking || codeExists || !watchedCode}
            className="rounded-l-none"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create
          </Button>
        </div>
        {errors.code && (
          <p className="text-sm text-destructive mt-1">{errors.code.message}</p>
        )}
        {codeExists && !errors.code && (
          <p className="text-sm text-destructive mt-1">This code is already taken</p>
        )}
        {isChecking && (
          <p className="text-sm text-muted-foreground mt-1">Checking availability...</p>
        )}
        {!isChecking && watchedCode && !codeExists && !errors.code && (
          <p className="text-sm text-green-600 mt-1">This code is available</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          Create a unique code that others can use to sign up through your referral
        </p>
      </div>
    </form>
  );
};

export default ReferralCodeForm;
