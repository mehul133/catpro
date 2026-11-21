import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  Utensils,
  FileSpreadsheet,
  ArrowUpRight,
  Sparkles,
  PieChart as PieIcon,
  ChevronRight
} from 'lucide-react';
import { EventRecord, Quotation, FoodItem, CompanySettings } from '../../types/catering';
import { StatCard } from '../common/StatCard';
import { EventStatusBadge } from '../common/Badge';
import { formatCurrency } from '../../services/calculationEngine';

interface DashboardViewProps {
  events: EventRecord[];
  quotations: Quotation[];
  foodItems: FoodItem[];
  settings: CompanySettings;
  onSelectEvent: (eventId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  quotations,
  foodItems,
  settings,
  onSelectEvent,
  onNavigateTab
}) => {
  // Profit Simulator State
  const [simGuests, setSimGuests] = useState<number>(350);
  const [simCostPerGuest, setSimCostPerGuest] = useState<number>(380);
  const [simMargin, setSimMargin] = useState<number>(30);
  const [simBuffer, setSimBuffer] = useState<number>(5);

  // Financial KPIs
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'Confirmed' || e.status === 'In Preparation').length;
  const completedEvents = events.filter(e => e.status === 'Completed').length;
  const pendingQuotes = quotations.filter(q => q.status === 'Sent' || q.status === 'Draft').length;

  const totalRevenue = events.reduce((acc, e) => acc + (e.pricing?.sellingPrice || 0), 0);
  const totalProfit = events.reduce((acc, e) => acc + (e.pricing?.grossProfit || 0), 0);
  const totalGuests = events.reduce((acc, e) => acc + e.guestCount, 0);
  const avgCostPerGuest = totalGuests > 0
    ? events.reduce((acc, e) => acc + (e.pricing?.grandTotalCost || 0), 0) / totalGuests
    : 0;

  // Simulator calculation
  const simBaseCost = simGuests * simCostPerGuest;
  const simSellingPrice = simBaseCost / (1 - simMargin / 100);
  const simGrossProfit = simSellingPrice - simBaseCost;
  const simSellingPerGuest = simSellingPrice / simGuests;

  const popularItems = foodItems.filter(f => f.isPopular).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-3 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CaterPro Business Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Event Catering & Revenue Dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Manage your high-volume wedding banquets, corporate luncheons, live food stations, and precision recipe costing from a single command center.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('food_costing')}
              className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-brand-950/50 flex items-center gap-1.5"
            >
              Open Smart Estimator
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('quotations')}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all"
            >
              View Active Proposals
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={totalEvents}
          subtitle={`${upcomingEvents} Active / Upcoming`}
          trend={{ value: '14%', isPositive: true }}
          icon={CalendarDays}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Pipeline Revenue"
          value={formatCurrency(totalRevenue, settings.currencySymbol)}
          subtitle="All confirmed & quoted events"
          trend={{ value: '22%', isPositive: true }}
          icon={DollarSign}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Estimated Gross Profit"
          value={formatCurrency(totalProfit, settings.currencySymbol)}
          subtitle={`Avg ${totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}% margin`}
          trend={{ value: '18%', isPositive: true }}
          icon={TrendingUp}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Avg Cost Per Guest"
          value={formatCurrency(avgCostPerGuest, settings.currencySymbol)}
          subtitle="Food + Manpower base cost"
          icon={Users}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Interactive Profit Simulator & Event Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Events & Popular Menu Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Events Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upcoming Catering Events</h3>
                <p className="text-xs text-slate-500">Events scheduled for production & delivery</p>
              </div>
              <button
                onClick={() => onNavigateTab('events')}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                View All Events <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              {events.map(event => (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event.id)}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors text-sm">
                        {event.name}
                      </h4>
                      <EventStatusBadge status={event.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>👤 {event.clientName}</span>
                      <span>📅 {event.eventDate}</span>
                      <span>👥 {event.guestCount} Guests</span>
                      <span>🍽️ {event.serviceStyle}</span>
                    </div>
                  </div>

                  <div className="text-right pl-4">
                    <div className="font-bold text-slate-900 text-sm">
                      {formatCurrency(event.pricing.sellingPrice, settings.currencySymbol)}
                    </div>
                    <div className="text-xs text-emerald-600 font-semibold">
                      +{formatCurrency(event.pricing.grossProfit, settings.currencySymbol)} profit
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Menu Items */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Top Popular Menu Dishes</h3>
                <p className="text-xs text-slate-500">High-demand dishes with strongest profitability</p>
              </div>
              <button
                onClick={() => onNavigateTab('menu_builder')}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                Full Menu Library →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularItems.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.categoryName} • {item.cuisine}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px]">
                      <span className="text-slate-600">Portion Cost: <strong className="text-slate-900">{formatCurrency(item.costPerPortion, settings.currencySymbol)}</strong></span>
                      <span className="text-slate-400">|</span>
                      <span className="text-brand-700 font-semibold">Selling: {formatCurrency(item.sellingPricePerServing, settings.currencySymbol)}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded-full">
                    {Math.round(((item.sellingPricePerServing - item.costPerPortion) / item.sellingPricePerServing) * 100)}% Margin
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Profit Simulator */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Profit Simulator</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">
              Real-time Margin & Price Calculator
            </h3>

            <div className="space-y-4">
              {/* Guests Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Guest Count:</span>
                  <span className="font-bold text-brand-400">{simGuests} Pax</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="1500"
                  step="25"
                  value={simGuests}
                  onChange={e => setSimGuests(Number(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>

              {/* Cost per guest Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Estimated Cost / Guest:</span>
                  <span className="font-bold text-brand-400">{formatCurrency(simCostPerGuest, settings.currencySymbol)}</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="1500"
                  step="10"
                  value={simCostPerGuest}
                  onChange={e => setSimCostPerGuest(Number(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>

              {/* Target Margin Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Target Profit Margin:</span>
                  <span className="font-bold text-brand-400">{simMargin}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="1"
                  value={simMargin}
                  onChange={e => setSimMargin(Number(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>

              {/* Buffer Percentage */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Production Buffer:</span>
                  <span className="font-bold text-slate-400">{simBuffer}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={simBuffer}
                  onChange={e => setSimBuffer(Number(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer"
                />
              </div>

              {/* Simulation Result Box */}
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Base Estimated Cost:</span>
                  <span className="font-medium">{formatCurrency(simBaseCost, settings.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Selling Price Per Guest:</span>
                  <span className="font-bold text-brand-400">{formatCurrency(simSellingPerGuest, settings.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Total Quotation Amount:</span>
                  <span className="font-bold text-white text-sm">{formatCurrency(simSellingPrice, settings.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-400 pt-2 border-t border-slate-800/80">
                  <span>Expected Gross Profit:</span>
                  <span>{formatCurrency(simGrossProfit, settings.currencySymbol)}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('food_costing')}
                className="w-full mt-2 py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-brand-950/60"
              >
                Apply to New Estimation
              </button>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Operational Health
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Pending Quotations:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {pendingQuotes} pending
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Standard Catering Tax:</span>
                <span className="font-bold text-slate-800">{settings.defaultTaxRate}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Default Buffer:</span>
                <span className="font-bold text-slate-800">{settings.defaultBufferRate}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Default Wastage Rate:</span>
                <span className="font-bold text-slate-800">{settings.defaultWastageRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
