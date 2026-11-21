import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  ChevronDown,
  RotateCcw,
  Shield,
  MapPin,
  Building2,
  Check,
  Sparkles
} from 'lucide-react';
import { useRole, ROLE_CONFIGS } from '../../context/RoleContext';
import type { UserRole } from '../../types';

export const UserProfileDropdown: React.FC = () => {
  const { currentRole, currentUser, currentConfig, selectRole, exitToRoleSelection } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser || !currentConfig) {
    return null;
  }

  const handleRoleSwitch = (newRole: UserRole) => {
    selectRole(newRole);
    setIsOpen(false);
    navigate(ROLE_CONFIGS[newRole].defaultPath);
  };

  const handleExit = () => {
    exitToRoleSelection();
    setIsOpen(false);
    navigate('/');
  };

  // Get initials
  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
        aria-label="User profile and role menu"
        aria-expanded={isOpen}
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-100 font-bold flex items-center justify-center text-xs shadow-sm ring-1 ring-emerald-700/20">
          {initials}
        </div>

        {/* User Info (hidden on small screens) */}
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
            {currentUser.name}
          </span>
          <span className="text-[10px] font-medium text-emerald-700 truncate max-w-[130px]">
            {currentConfig.badge}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header Profile summary */}
          <div className="p-4 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-white">{currentUser.name}</p>
                <p className="text-xs text-emerald-200/90 truncate">{currentUser.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-800/80 border border-emerald-600/40 text-[10px] font-medium text-emerald-100">
                  <Shield className="w-3 h-3 text-emerald-300" />
                  <span>{currentConfig.title}</span>
                </div>
              </div>
            </div>

            {/* Sub-details */}
            <div className="mt-3 pt-2.5 border-t border-emerald-800/60 text-[11px] space-y-1 text-emerald-200/80">
              {currentUser.badgeId && (
                <div className="flex items-center gap-1.5 truncate">
                  <User className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{currentUser.badgeId}</span>
                </div>
              )}
              {currentUser.region && (
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{currentUser.region}</span>
                </div>
              )}
              {currentUser.department && (
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{currentUser.department}</span>
                </div>
              )}
            </div>
          </div>

          {/* Role switching submenu / options */}
          <div className="p-2 border-b border-slate-100">
            <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Demo Role Quick-Switch
            </div>

            <div className="grid grid-cols-2 gap-1.5 mt-1">
              {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((roleKey) => {
                const conf = ROLE_CONFIGS[roleKey];
                const isActive = currentRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => handleRoleSwitch(roleKey)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{conf.title.replace(' Portal', '')}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-2 bg-slate-50 space-y-1">
            <button
              type="button"
              onClick={handleExit}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-left cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
              <span>Back to Role Selection Portal</span>
            </button>
          </div>

          {/* Footer Notice */}
          <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1 justify-center">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Development Mode Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
