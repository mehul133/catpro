import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { ROLE_NAVIGATION_MAP } from '../../config/navigation';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { currentRole, currentConfig } = useRole();

  if (!currentRole || !currentConfig) {
    return null;
  }

  const currentNavItems = ROLE_NAVIGATION_MAP[currentRole] || [];
  const currentItem = currentNavItems.find((item) => item.path === location.pathname);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500 font-medium">
      <Link
        to="/"
        className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors py-1"
        title="Role Selection Portal"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span className="hidden sm:inline">Portal Hub</span>
      </Link>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1.5 shrink-0" />

      <Link
        to={currentConfig.defaultPath}
        className="hover:text-emerald-700 transition-colors py-1 truncate max-w-[120px] sm:max-w-none text-slate-600"
      >
        {currentConfig.title}
      </Link>

      {currentItem && currentItem.path !== currentConfig.defaultPath && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1.5 shrink-0" />
          <span className="text-emerald-800 font-semibold truncate max-w-[150px] sm:max-w-none" aria-current="page">
            {currentItem.label}
          </span>
        </>
      )}
    </nav>
  );
};
