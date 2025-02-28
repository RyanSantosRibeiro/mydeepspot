'use client';

import { cn } from '@/utils/cn';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  setEmail: (value: string) => void;
}

const Input = ({ label, error, className,setEmail , ...props }: InputProps) => {
  return (
    <div className="w-full relative mb-5">
      {label && <label className="block text-lg font-medium text-gray-700 mb-1">{label}</label>}
      <input
        onChange={
          (e) => {
            setEmail(e.target.value);
          }
        }
        className={cn(
          "w-full text-gray-700 px-4 py-2 border rounded-lg  focus:outline-none transition",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        {...props}
      />
      {error && <p className="absolute bottom-0 left-0 text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
