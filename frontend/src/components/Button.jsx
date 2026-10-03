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
    primary: 'bg-[#faf5ff] hover:bg-[#f3e8ff] text-[#581c87] border border-[#d8b4fe] hover:border-[#c084fc] shadow-2xs active:bg-[#ede9fe] font-bold focus:ring-[#c084fc]',
    secondary: 'bg-white hover:bg-[#faf5ff] text-slate-700 border border-[#eee6f8] hover:border-[#e9d5ff] focus:ring-[#c084fc] shadow-2xs active:bg-[#f3e8ff]',
    success: 'bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] hover:border-[#6ee7b7] font-bold shadow-2xs focus:ring-[#34d399]',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold focus:ring-rose-400 shadow-2xs',
    warning: 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold focus:ring-amber-400 shadow-2xs',
    ghost: 'text-slate-600 hover:bg-[#faf5ff] hover:text-[#581c87] focus:ring-[#c084fc]',
    link: 'text-[#7c3aed] hover:text-[#581c87] hover:underline p-0 focus:ring-0 shadow-none'
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
