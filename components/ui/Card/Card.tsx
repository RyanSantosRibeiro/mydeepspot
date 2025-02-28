import { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-[90%] lg:max-w-5xl m-auto my-8 bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="px-6 py-5">
        <h3 className="mb-2 text-2xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
        {children}
      </div>
      {footer && (
        <div className="p-4 border-t border-gray-200 bg-gray-100 text-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}