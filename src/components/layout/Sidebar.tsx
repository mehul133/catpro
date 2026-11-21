import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  Calculator,
  ChefHat,
  Boxes,
  Truck,
  FileSpreadsheet,
  ClipboardList,
  BarChart3,
  Settings,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'events'
  | 'menu_builder'
  | 'food_costing'
  | 'recipes'
  | 'inventory'
  | 'suppliers'
  | 'quotations'
  | 'production_sheets'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'events' as NavTab, label: 'Events', icon: CalendarDays, badge: 'Live' },
    { id: 'menu_builder' as NavTab, label: 'Menu Builder', icon: UtensilsCrossed, badge: null },
    { id: 'food_costing' as NavTab, label: 'Food Costing', icon: Calculator, badge: 'Estimator' },
    { id: 'recipes' as NavTab, label: 'Recipes', icon: ChefHat, badge: null },
    { id: 'inventory' as NavTab, label: 'Inventory', icon: Boxes, badge: null },
    { id: 'suppliers' as NavTab, label: 'Suppliers', icon: Truck, badge: null },
    { id: 'quotations' as NavTab, label: 'Quotations', icon: FileSpreadsheet, badge: 'PDF' },
    { id: 'production_sheets' as NavTab, label: 'Production Sheets', icon: ClipboardList, badge: null },
    { id: 'reports' as NavTab, label: 'Reports', icon: BarChart3, badge: null },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings, badge: null }
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-900/30 font-bold text-xl tracking-wider">
            C
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-lg tracking-tight">CaterPro</span>
              <span className="bg-brand-500/20 text-brand-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-brand-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart Catering Estimator</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Main Management
          </div>
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-700 text-white shadow-md shadow-brand-900/40 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-brand-400 border border-brand-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="px-3 pt-4 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Operations & Financials
          </div>
          {navItems.slice(5).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-700 text-white shadow-md shadow-brand-900/40 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-brand-400 border border-brand-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Estimator Card */}
        <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/60">
          <div className="flex items-center gap-2 mb-2 text-brand-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Estimator</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Calculate instant food quantities & profit margins for any guest count.
          </p>
          <button
            onClick={() => handleNavClick('food_costing')}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow transition-colors"
          >
            Launch Estimator
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>CaterPro Enterprise</span>
          <span className="text-emerald-500 font-mono text-[11px]">● Online</span>
        </div>
      </aside>
    </>
  );
};
