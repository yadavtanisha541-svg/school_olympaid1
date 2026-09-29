import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'brand',
  trend = null
}) => {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
  };

  const iconBg = colorMap[color] || colorMap.brand;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1.5">{value}</h4>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              {trend && (
                <span className={`font-semibold ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {trend > 0 ? `+${trend}%` : `${trend}%`}
                </span>
              )}
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${iconBg} shadow-inner`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
