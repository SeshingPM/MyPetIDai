import React, { useState } from 'react';
import { Combobox as HeadlessCombobox } from '@headlessui/react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface ComboboxOption {
  label: string;
  value: string;
}

interface MultiComboboxProps {
  options: ComboboxOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export function MultiCombobox({
  options,
  values,
  onChange,
  placeholder = "Select options",
  disabled = false,
  className,
  error = false
}: MultiComboboxProps) {
  const [query, setQuery] = useState('');
  const selectedOptions = options.filter(option => values.includes(option.value));
  
  const filteredOptions =
    query === ''
      ? options.filter(option => !values.includes(option.value))
      : options.filter((option) => {
          return (
            option.label.toLowerCase().includes(query.toLowerCase()) && 
            !values.includes(option.value)
          );
        });

  const handleSelect = (value: string) => {
    onChange([...values, value]);
    setQuery('');
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(values.filter(value => value !== valueToRemove));
  };

  return (
    <div className="space-y-2">
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map((option) => (
            <Badge key={option.value} variant="secondary" className="pl-2 pr-1 flex items-center gap-1">
              {option.label}
              <button
                type="button"
                className="rounded-full hover:bg-muted p-0.5"
                onClick={() => handleRemove(option.value)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      <HeadlessCombobox value="" onChange={handleSelect} disabled={disabled}>
        <div className="relative">
          <div className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2",
            "text-sm ring-offset-background focus-within:outline-none focus-within:ring-2",
            "focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-within:ring-red-500",
            className
          )}>
            <HeadlessCombobox.Input
              className="w-full border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={selectedOptions.length > 0 ? "Add more..." : placeholder}
              autoComplete="off"
            />
            <HeadlessCombobox.Button className="flex items-center">
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </HeadlessCombobox.Button>
          </div>
          <HeadlessCombobox.Options className={cn(
            "absolute z-50 max-h-60 w-full overflow-auto rounded-md bg-background p-1 shadow-md",
            "ring-1 ring-black/5 focus:outline-none mt-1"
          )}>
            {filteredOptions.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-muted-foreground">
                {query !== '' ? 'No results found.' : 'No more options available.'}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <HeadlessCombobox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    cn(
                      "relative cursor-default select-none py-2 px-3 text-sm rounded-sm",
                      active ? "bg-primary/10 text-primary" : "text-foreground"
                    )
                  }
                >
                  {({ selected, active }) => (
                    <div className="flex items-center justify-between">
                      <span className={cn("block truncate", selected && "font-medium")}>
                        {option.label}
                      </span>
                      {selected && (
                        <Check className="h-4 w-4 ml-2 text-primary" />
                      )}
                    </div>
                  )}
                </HeadlessCombobox.Option>
              ))
            )}
          </HeadlessCombobox.Options>
        </div>
      </HeadlessCombobox>
    </div>
  );
}

export default MultiCombobox;
