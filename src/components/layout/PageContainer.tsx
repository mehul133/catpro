import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200',
  actions,
  children,
}) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Breadcrumbs bar */}
      <div className="space-y-3">
        <Breadcrumbs />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1 border-b border-slate-200/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
              {badge && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-sm ${badgeColor}`}
                >
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-600 font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Main page content */}
      <div className="relative">{children}</div>
    </div>
  );
};
