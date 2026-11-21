import React from 'react';
import { DietaryType, EventStatus } from '../../types/catering';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gold';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  size = 'sm'
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gold: 'bg-amber-100 text-amber-800 border-amber-300'
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export const DietaryBadge: React.FC<{ type: DietaryType }> = ({ type }) => {
  switch (type) {
    case 'Vegetarian':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          Veg
        </span>
      );
    case 'Non-Vegetarian':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300">
          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
          Non-Veg
        </span>
      );
    case 'Vegan':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-300">
          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
          Vegan
        </span>
      );
    case 'Jain':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          Jain
        </span>
      );
  }
};

export const EventStatusBadge: React.FC<{ status: EventStatus }> = ({ status }) => {
  switch (status) {
    case 'Confirmed':
      return <Badge variant="success">Confirmed</Badge>;
    case 'Quotation Sent':
      return <Badge variant="info">Quotation Sent</Badge>;
    case 'Inquiry':
      return <Badge variant="warning">Inquiry</Badge>;
    case 'In Preparation':
      return <Badge variant="purple">In Preparation</Badge>;
    case 'Completed':
      return <Badge variant="default">Completed</Badge>;
    case 'Cancelled':
      return <Badge variant="danger">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
