import { ReactNode } from 'react';

interface CardProps {
  children?: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => (
  <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>{children}</div>
);

export default Card;