import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Document, DOCUMENT_CATEGORIES } from '@/utils/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { usePets } from '@/contexts/pets';

// Schema for document form validation
const documentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  petId: z.string().optional(),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;

interface EditDocumentFormProps {
  document: Document;
  onSubmit: (data: DocumentFormValues & { id: string }) => void;
  onCancel?: () => void;
}

const EditDocumentForm: React.FC<EditDocumentFormProps> = ({ 
  document, 
  onSubmit, 
  onCancel 
}) => {
  console.log('[EditDocumentForm] Rendering with document:', document);
  console.log('[EditDocumentForm] Document properties:', {
    id: document?.id,
    name: document?.name,
    category: document?.category,
    petId: document?.petId
  });
  
  const { pets } = usePets();
  console.log('[EditDocumentForm] Pets from context:', pets.length ? `${pets.length} pets` : 'No pets');
  
  console.log('[EditDocumentForm] Setting up form with document data');
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: document.name,
      category: document.category,
      petId: document.petId || 'none',
    },
  });
  
  console.log('[EditDocumentForm] Form initialized successfully');

  const handleSubmit = (data: DocumentFormValues) => {
    onSubmit({
      ...data,
      id: document.id
    });
  };

  // Filter out special categories that should not be selected directly
  const editableCategories = DOCUMENT_CATEGORIES.filter(
    cat => cat !== 'All Categories' && cat !== 'Favorites'
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Document name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter document name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category selection field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {editableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pet selection field */}
        <FormField
          control={form.control}
          name="petId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Associated Pet (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pet (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form actions */}
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            Update Document
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditDocumentForm;

// Log that the module was loaded
console.log('[EditDocumentForm] Module loaded successfully');
