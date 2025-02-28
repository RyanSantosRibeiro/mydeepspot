'use client';

import { cn } from '@/utils/cn';
import { useState } from 'react';

interface SelectProps {
  label?: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const Select = ({ label, options, value, onChange, placeholder, error }: SelectProps) => {
  const [selected, setSelected] = useState(value || '');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(event.target.value);
    onChange?.(event.target.value);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        value={selected}
        onChange={handleChange}
        className={cn(
          "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition",
          error ? "border-red-500" : "border-gray-300"
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} label={option.label} />
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

interface SelectItemProps {
  value: string;
  label: string;
}

const SelectItem = ({ value, label }: SelectItemProps) => {
  return <option value={value}>{label}</option>;
};

export { Select, SelectItem };
