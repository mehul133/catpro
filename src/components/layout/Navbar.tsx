import React from 'react';
import {
  Menu,
  PlusCircle,
  RotateCcw,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { CurrencyCode, UserRole } from '../../types/catering';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  currency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  userRole: UserRole;
  onChangeRole: (r: UserRole) => void;
  onOpenNewEvent: () => void;
  onResetData: () => void;
  pageTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  currency,
  onChangeCurrency,
  userRole,
  onChangeRole,
  onOpenNewEvent,
  onResetData,
  pageTitle
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {pageTitle}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500">
            Intelligent Catering Estimation & Operations
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
          {(['INR', 'USD', 'EUR', 'AED'] as CurrencyCode[]).map(c => (
            <button
              key={c}
              onClick={() => onChangeCurrency(c)}
              className={`px-2 py-1 rounded font-semibold transition-all ${
                currency === c
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : c === 'EUR' ? '€ EUR' : 'AED'}
            </button>
          ))}
        </div>

        {/* User Role Switcher */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1 text-xs">
          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Role:</span>
          <select
            value={userRole}
            onChange={e => onChangeRole(e.target.value as UserRole)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="Admin">Admin</option>
            <option value="Catering Manager">Catering Manager</option>
            <option value="Head Chef">Head Chef</option>
            <option value="Sales Executive">Sales Executive</option>
          </select>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={onResetData}
          title="Reset to default catering seed data"
          className="hidden lg:flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Reset Demo</span>
        </button>

        {/* Primary Action Button: Create Event */}
        <button
          onClick={onOpenNewEvent}
          className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-brand-900/20 transition-all hover:shadow-lg active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Create Event</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </header>
  );
};
