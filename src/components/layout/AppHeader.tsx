import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, ArrowLeftRight, Shield } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { NotificationDropdown } from './NotificationDropdown';
import { UserProfileDropdown } from './UserProfileDropdown';

interface AppHeaderProps {
  onOpenMobileSidebar: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenMobileSidebar }) => {
  const { currentConfig } = useRole();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs px-4 sm:px-6 lg:px-8">
      <div className="h-full flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Department of Agriculture & Farmers' Welfare
              </span>
              <span className="hidden md:inline-block w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="hidden md:inline-block text-xs font-medium text-slate-500">
                Crop Issue & Advisory System
              </span>
            </div>
            {currentConfig && (
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {currentConfig.portalName}
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Role Quick Badge, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher shortcut */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl transition-all shadow-2xs"
            title="Switch demo stakeholder role"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-700" />
            <span>Switch Role</span>
          </Link>

          {/* Development Status Badge */}
          <span className="hidden xl:inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            Dev Mode: Demo Auth
          </span>

          {/* Role Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Profile & Session Dropdown */}
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};
