import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500 shadow-sm shadow-brand-500/20 active:bg-brand-800',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-brand-500 shadow-sm active:bg-slate-100',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm shadow-emerald-500/20 active:bg-emerald-800',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm shadow-rose-500/20 active:bg-rose-800',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500 shadow-sm active:bg-amber-700',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400 active:bg-slate-200',
    link: 'text-brand-600 hover:text-brand-700 hover:underline p-0 focus:ring-0 shadow-none'
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1.5 gap-1.5',
    sm: 'text-xs px-3 py-2 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2.5 gap-2 font-medium',
    lg: 'text-base px-5 py-3 gap-2.5 font-semibold'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current" />
      ) : null}
      {children}
    </button>
  );
};
