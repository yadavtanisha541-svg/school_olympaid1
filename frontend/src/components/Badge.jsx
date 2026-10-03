import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    cyan: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    hard: 'bg-rose-50 text-rose-700 border-rose-200',
    free_trial: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    practice: 'bg-purple-50 text-purple-700 border-purple-200',
    mock: 'bg-purple-50 text-purple-700 border-purple-200',
    paid: 'bg-amber-50 text-amber-800 border-amber-300',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-slate-100 text-slate-600 border-slate-200',
    archived: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const styleClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${styleClass} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
};
