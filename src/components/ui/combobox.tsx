import React, { useState } from 'react';
import { Combobox as HeadlessCombobox } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  error = false
}: ComboboxProps) {
  const [query, setQuery] = useState('');
  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <HeadlessCombobox value={value} onChange={onChange} disabled={disabled}>
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
            displayValue={(value: string) => selectedOption?.label || ''}
            placeholder={placeholder}
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
          {filteredOptions.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-muted-foreground">
              No results found.
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
  );
}

export default Combobox;
