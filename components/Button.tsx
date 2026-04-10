import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg focus:ring-indigo-500",
    secondary: "bg-slate-800 hover:bg-slate-900 text-white shadow-sm focus:ring-slate-500",
    outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-400"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
};