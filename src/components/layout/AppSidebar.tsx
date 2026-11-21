import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  RotateCcw,
  X,
  ChevronRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { ROLE_NAVIGATION_MAP } from '../../config/navigation';

interface AppSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentRole, currentConfig, exitToRoleSelection } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentRole || !currentConfig) {
    return null;
  }

  const navItems = ROLE_NAVIGATION_MAP[currentRole] || [];

  const handleBackToRoles = () => {
    exitToRoleSelection();
    onCloseMobile();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Portal Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-green-600 flex items-center justify-center text-white shadow-sm shadow-emerald-800/30">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                CropCare
              </span>
              <span className="block text-[10px] font-semibold text-emerald-700 uppercase tracking-widest -mt-0.5">
                Agri-Advisory
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Banner */}
        <div className="p-3.5 mx-3 mt-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 truncate">
                Active Portal
              </p>
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentConfig.title}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-800/80 mt-1.5 leading-snug truncate">
            {currentConfig.portalName}
          </p>
        </div>

        {/* Navigation Section Title */}
        <div className="px-5 pt-4 pb-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Portal Navigation ({navItems.length} Modules)
          </p>
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-900/20 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-200' : 'text-slate-400 group-hover:text-emerald-700'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700'
                          : item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer: Back to Role Selection */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
          {/* Dev Demo Notice */}
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium text-slate-500 bg-white rounded-md border border-slate-200/80">
            <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">Phase 2 Demo Frame Active</span>
          </div>

          <button
            type="button"
            onClick={handleBackToRoles}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 shadow-2xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Back to Role Selection</span>
          </button>
        </div>
      </aside>
    </>
  );
};
