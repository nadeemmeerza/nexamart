// app/components/ui/EmptyState.tsx
import { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="mb-6 text-gray-300">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 max-w-md mb-8">
        {description}
      </p>
      
      {action && (
        <div className="flex items-center justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;