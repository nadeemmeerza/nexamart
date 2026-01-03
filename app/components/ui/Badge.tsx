import { ReactNode } from "react";

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'pink';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge = ({ children, variant = 'default', className = '' }:BadgeProps) => {
  const variants = {
    default: 'bg-black text-white',
    secondary: 'bg-gray-200 text-black',
    success: 'bg-green-100/30 text-green-800',
    warning: 'bg-amber-500 text-black',
    pink: 'bg-pink-800 text-white'
  };
  return <span className={`absolute -top-1 left-0 rounded-sm flex justify-center items-center  ${variants[variant]} ${className}`}>{children}</span>;
};

export default Badge