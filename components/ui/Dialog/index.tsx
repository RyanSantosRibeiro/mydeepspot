import { cn } from "@/utils/cn";
import React, { ReactNode } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Dialog = ({ isOpen, onClose, children }: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div id="modaPremium" className="animate-fade-up opacity-0 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 m-0" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[50vw] relative overflow-hidden"  onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="text-4xl absolute top-4 left-4 text-gray-500 hover:text-gray-700 font-extrabold">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export const DialogContent = ({ children, className }: DialogContentProps) => {
  return <div className={cn("", className)}>{children}</div>;
};

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

export const DialogHeader = ({ children, className }: DialogHeaderProps) => {
  return <div className={cn("text-xl font-semibold", className)}>{children}</div>;
};

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export const DialogTitle = ({ children, className }: DialogTitleProps) => {
  return <h2 className={cn("text-lg font-bold", className)}>{children}</h2>;
};
