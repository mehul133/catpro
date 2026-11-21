import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { useRole } from '../../context/RoleContext';
import type { UserRole } from '../../types';

export const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentRole, selectRole } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  // If user navigated directly into a role path (e.g. /farmer/my-farm) without setting role in state, auto-detect it
  useEffect(() => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    const rolePrefix = parts[0] as UserRole;

    if (rolePrefix && ['farmer', 'officer', 'expert', 'admin'].includes(rolePrefix)) {
      if (currentRole !== rolePrefix) {
        selectRole(rolePrefix);
      }
    } else if (!currentRole) {
      // No role selected and not in a role route, redirect to role selection
      navigate('/', { replace: true });
    }
  }, [location.pathname, currentRole, selectRole, navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Sidebar Navigation */}
      <AppSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <AppHeader onOpenMobileSidebar={() => setMobileOpen(true)} />

        {/* Dynamic Nested Route Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
