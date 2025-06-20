
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { DOCUMENT_CATEGORIES } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCustomCategories } from '@/hooks/useCustomCategories';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const { categories, addCategory } = useCustomCategories();
  
  // Combine default and custom categories, removing "All Categories" and duplicates
  const allCategories = [...DOCUMENT_CATEGORIES.slice(1)]; // Skip "All Categories"
  
  // Add custom categories excluding duplicates
  categories.forEach(category => {
    if (!allCategories.includes(category)) {
      allCategories.push(category);
    }
  });

  const handleAddCategory = () => {
    if (newCategory.trim() && !allCategories.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      onChange(newCategory.trim());
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Select 
        value={value} 
        onValueChange={onChange} 
        disabled={disabled}
      >
        <SelectTrigger id="category" className="flex-1">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {allCategories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
          {/* Custom category feature temporarily disabled
          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground flex items-center px-2 py-1.5"
              >
                <Plus size={16} className="mr-2" />
                Add Custom Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Custom Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-category">Category Name</Label>
                  <Input 
                    id="new-category" 
                    placeholder="Enter category name" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newCategory.trim()) {
                        handleAddCategory();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={handleAddCategory} 
                  disabled={!newCategory.trim() || allCategories.includes(newCategory.trim())}
                  className="w-full"
                >
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          */}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
