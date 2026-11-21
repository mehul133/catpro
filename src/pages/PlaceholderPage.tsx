import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Layers,
  FileCheck2,
  Calendar,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useRole } from '../context/RoleContext';
import { ROLE_NAVIGATION_MAP } from '../config/navigation';

export const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const { currentRole, currentUser, currentConfig } = useRole();

  if (!currentRole || !currentConfig) {
    return null;
  }

  const navItems = ROLE_NAVIGATION_MAP[currentRole] || [];
  const currentItem = navItems.find((item) => item.path === location.pathname) || {
    id: 'unknown',
    label: 'Module Workspace',
    path: location.pathname,
    description: 'Specialized workspace view for this stakeholder portal.',
    icon: Layers,
  };

  const Icon = currentItem.icon;

  // Determine which phase this belongs to
  let phaseInfo = 'Phase 3: Farmer Crop Issue Reporting Module';
  if (currentRole === 'officer') {
    phaseInfo = 'Phase 4: Agriculture Officer Triage & Field Verification';
  } else if (currentRole === 'expert') {
    phaseInfo = 'Phase 5: Agricultural Expert Advisory Management';
  } else if (currentRole === 'admin') {
    phaseInfo = 'Phase 6: Administrator Governance & Analytics';
  }

  return (
    <PageContainer
      title={currentItem.label}
      subtitle={currentItem.description}
      badge={`${currentConfig.title} Module`}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to={currentConfig.defaultPath}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-2xs transition-colors"
          >
            <span>Switch Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Route Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-800/20">
                <Icon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900">{currentItem.label}</h2>
                  <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {currentItem.path}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">{currentItem.description}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Navigation Frame Active
              </span>
              <span className="text-[11px] text-slate-400">Phase 2 Verification Target</span>
            </div>
          </div>

          {/* Planned Roadmap Notice */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Upcoming Module Implementation
                </p>
                <p className="text-xs text-slate-600">
                  Full business workflows and data forms will be implemented in: <strong className="text-emerald-800">{phaseInfo}</strong>.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Next Phase Ready</span>
            </div>
          </div>
        </div>

        {/* Demo Stakeholder Context Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Demo User
            </span>
            <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
            <span className="inline-block text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
              {currentUser?.badgeId}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Jurisdiction / Office
            </span>
            <p className="text-sm font-bold text-slate-900">{currentUser?.region}</p>
            <p className="text-xs text-slate-500">{currentUser?.department}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Network Status: Online</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Module Verification
            </span>
            <div className="space-y-1.5 pt-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Route correctly wired</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sidebar menu active state verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Responsive mobile drawer ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
