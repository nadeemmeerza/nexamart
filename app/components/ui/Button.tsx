import { ReactNode } from "react";

type Variant = 'default' | 'outline' | 'ghost' | 'secondary';

type Size = 'sm' |'md'|'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?:Size;
  className?: string;
  onClick?: ()=>void;
  disabled?:boolean;
}



const Button = ({ children, variant = 'default', size = 'md', className = '',onClick, ...props }:ButtonProps) => {
  const baseStyle = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    default: 'bg-black text-white hover:bg-gray-800 focus:ring-gray-600',
    outline: 'border-2 border-black text-black hover:bg-gray-50 focus:ring-black',
    ghost: 'text-black hover:bg-gray-100 focus:ring-gray-300',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-400',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button