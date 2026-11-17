import React, { useState } from 'react';
import {
  EventRecord,
  FoodItem,
  Quotation,
  CompanySettings,
  ActualExpenseRecord
} from '../../types/catering';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  PieChart,
  Plus,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import { formatCurrency } from '../../services/calculationEngine';
import { ExportService } from '../../services/exportService';

interface ReportsViewProps {
  events: EventRecord[];
  quotations: Quotation[];
  foodItems: FoodItem[];
  settings: CompanySettings;
  onUpdateEventActuals: (eventId: string, actuals: ActualExpenseRecord[]) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  events,
  quotations,
  foodItems,
  settings,
  onUpdateEventActuals
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');

  // Actual vs Estimated Expense logger state for selected event
  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const [actualExpenses, setActualExpenses] = useState<ActualExpenseRecord[]>(
    currentEvent?.actualExpenses || [
      { id: 'exp-1', category: 'Raw Material Food', description: 'Fresh vegetables, dairy & meat market bills', estimatedAmount: currentEvent?.pricing.subtotalFoodCost || 0, actualAmount: (currentEvent?.pricing.subtotalFoodCost || 0) * 0.96, date: '2026-11-15' },
      { id: 'exp-2', category: 'Operational Staff', description: 'Chefs & service crew wages', estimatedAmount: currentEvent?.pricing.subtotalOperationalCost || 0, actualAmount: (currentEvent?.pricing.subtotalOperationalCost || 0) * 1.02, date: '2026-11-15' }
    ]
  );

  const [newExpCategory, setNewExpCategory] = useState('Raw Material Food');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpEstimated, setNewExpEstimated] = useState<number>(10000);
  const [newExpActual, setNewExpActual] = useState<number>(9500);

  // Sync actuals when switching event
  React.useEffect(() => {
    if (currentEvent) {
      if (currentEvent.actualExpenses && currentEvent.actualExpenses.length > 0) {
        setActualExpenses(currentEvent.actualExpenses);
      } else {
        setActualExpenses([
          { id: 'exp-1', category: 'Raw Material Food', description: 'Raw materials & groceries bills', estimatedAmount: currentEvent.pricing.subtotalFoodCost, actualAmount: currentEvent.pricing.subtotalFoodCost * 0.97, date: currentEvent.eventDate },
          { id: 'exp-2', category: 'Operational Staff', description: 'Chef and service staff payout', estimatedAmount: currentEvent.pricing.subtotalOperationalCost, actualAmount: currentEvent.pricing.subtotalOperationalCost * 1.01, date: currentEvent.eventDate }
        ]);
      }
    }
  }, [currentEvent]);

  // Aggregate metrics
  const totalRevenue = events.reduce((acc, e) => acc + e.pricing.sellingPrice, 0);
  const totalCost = events.reduce((acc, e) => acc + e.pricing.grandTotalCost, 0);
  const totalProfit = events.reduce((acc, e) => acc + e.pricing.grossProfit, 0);
  const totalGuests = events.reduce((acc, e) => acc + e.guestCount, 0);
  const avgCostPerGuest = totalGuests > 0 ? totalCost / totalGuests : 0;
  const avgSellingPerGuest = totalGuests > 0 ? totalRevenue / totalGuests : 0;

  const totalQuotesCount = quotations.length;
  const approvedQuotesCount = quotations.filter(q => q.status === 'Approved').length;
  const conversionRate = totalQuotesCount > 0 ? (approvedQuotesCount / totalQuotesCount) * 100 : 0;

  // Actual vs estimated totals for current event
  const totalEstAmount = actualExpenses.reduce((acc, x) => acc + x.estimatedAmount, 0);
  const totalActAmount = actualExpenses.reduce((acc, x) => acc + x.actualAmount, 0);
  const varianceAmount = totalActAmount - totalEstAmount;
  const variancePct = totalEstAmount > 0 ? (varianceAmount / totalEstAmount) * 100 : 0;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDesc.trim()) return;

    const newRecord: ActualExpenseRecord = {
      id: `exp-${Date.now()}`,
      category: newExpCategory,
      description: newExpDesc.trim(),
      estimatedAmount: newExpEstimated,
      actualAmount: newExpActual,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [...actualExpenses, newRecord];
    setActualExpenses(updated);
    if (currentEvent) {
      onUpdateEventActuals(currentEvent.id, updated);
    }
    setNewExpDesc('');
  };

  const handleRemoveExpense = (id: string) => {
    const updated = actualExpenses.filter(x => x.id !== id);
    setActualExpenses(updated);
    if (currentEvent) {
      onUpdateEventActuals(currentEvent.id, updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Financial Reports & Post-Event Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Section 12: Event-wise costing, quotation conversion rate, profit margins, and estimated vs. actual expenditure
          </p>
        </div>

        <button
          onClick={() => ExportService.exportEventsReport(events)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel / CSV</span>
        </button>
      </div>

      {/* High Level KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Pipeline Revenue
          </span>
          <div className="text-2xl font-black text-slate-900">
            {formatCurrency(totalRevenue, settings.currencySymbol)}
          </div>
          <span className="text-[11px] text-slate-500">
            Avg {formatCurrency(avgSellingPerGuest, settings.currencySymbol)} / guest
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Estimated Profit
          </span>
          <div className="text-2xl font-black text-emerald-600">
            {formatCurrency(totalProfit, settings.currencySymbol)}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">
            {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}% Gross Margin
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Avg Cost Per Guest
          </span>
          <div className="text-2xl font-black text-slate-800">
            {formatCurrency(avgCostPerGuest, settings.currencySymbol)}
          </div>
          <span className="text-[11px] text-slate-500">
            Total {totalGuests.toLocaleString()} Guests Served
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Proposal Conversion Rate
          </span>
          <div className="text-2xl font-black text-brand-700">
            {conversionRate.toFixed(0)}%
          </div>
          <span className="text-[11px] text-slate-500">
            {approvedQuotesCount} of {totalQuotesCount} Quotations Confirmed
          </span>
        </div>
      </div>

      {/* Section 12: Estimated Versus Actual Expenditure Audit */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                Post-Event Audit
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Estimated vs. Actual Expenditure Tracker
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare forecasted catering budget against real purchase receipts to protect your bottom line
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700">Event:</label>
            <select
              value={currentEvent?.id}
              onChange={e => setSelectedEventId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.eventDate})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Variance Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold">Total Estimated Budget:</span>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              {formatCurrency(totalEstAmount, settings.currencySymbol)}
            </div>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold">Total Actual Expenditure:</span>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              {formatCurrency(totalActAmount, settings.currencySymbol)}
            </div>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold">Budget Variance:</span>
            <div className={`text-base font-extrabold mt-0.5 ${varianceAmount <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {varianceAmount <= 0 ? '-' : '+'}{formatCurrency(Math.abs(varianceAmount), settings.currencySymbol)} ({variancePct.toFixed(1)}%)
              <span className="text-[10px] font-medium text-slate-500 ml-1">
                {varianceAmount <= 0 ? '(Under Budget)' : '(Over Budget)'}
              </span>
            </div>
          </div>
        </div>

        {/* Actual Expenses Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-700 text-[10px] font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Expense Category</th>
                <th className="py-2.5 px-4">Description / Receipt Ref</th>
                <th className="py-2.5 px-3 text-right">Estimated Amount</th>
                <th className="py-2.5 px-3 text-right">Actual Incurred</th>
                <th className="py-2.5 px-3 text-right">Variance</th>
                <th className="py-2.5 px-3 text-center">Date</th>
                <th className="py-2.5 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {actualExpenses.map(item => {
                const diff = item.actualAmount - item.estimatedAmount;
                const isUnder = diff <= 0;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.category}</td>
                    <td className="py-2.5 px-4 text-slate-600">{item.description}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">
                      {formatCurrency(item.estimatedAmount, settings.currencySymbol)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {formatCurrency(item.actualAmount, settings.currencySymbol)}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${isUnder ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isUnder ? '-' : '+'}{formatCurrency(Math.abs(diff), settings.currencySymbol)}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-500">{item.date}</td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => handleRemoveExpense(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add Actual Expense Form */}
        <form onSubmit={handleAddExpense} className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end text-xs">
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
              Category
            </label>
            <select
              value={newExpCategory}
              onChange={e => setNewExpCategory(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white"
            >
              <option value="Raw Material Food">Raw Material Food</option>
              <option value="Operational Staff">Operational Staff</option>
              <option value="Transportation & Fuel">Transportation & Fuel</option>
              <option value="Equipment Rental">Equipment Rental</option>
              <option value="Decoration & Floral">Decoration & Floral</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
              Description / Vendor Bill #
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Extra 50kg dairy bill #492"
              value={newExpDesc}
              onChange={e => setNewExpDesc(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
              Estimated
            </label>
            <input
              type="number"
              min="0"
              value={newExpEstimated}
              onChange={e => setNewExpEstimated(Number(e.target.value))}
              className="w-full p-2 border rounded-lg bg-white font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
              Actual Paid
            </label>
            <input
              type="number"
              min="0"
              value={newExpActual}
              onChange={e => setNewExpActual(Number(e.target.value))}
              className="w-full p-2 border rounded-lg bg-white font-bold"
            />
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              className="w-full py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* Event-wise Costing Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          All Events Profitability & Margin Summary
        </h3>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-700 text-[10px] font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Event Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-2 text-center">Pax</th>
                <th className="py-2.5 px-3 text-right">Food Cost</th>
                <th className="py-2.5 px-3 text-right">Ops Cost</th>
                <th className="py-2.5 px-3 text-right">Total Cost</th>
                <th className="py-2.5 px-3 text-right">Quotation</th>
                <th className="py-2.5 px-3 text-right">Gross Profit</th>
                <th className="py-2.5 px-2 text-center">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map(ev => {
                const p = ev.pricing;
                return (
                  <tr key={ev.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {ev.name}
                      <span className="text-[10px] text-slate-400 block font-normal">{ev.eventDate}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{ev.category}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-800">{ev.guestCount}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(p.subtotalFoodCost, settings.currencySymbol)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(p.subtotalOperationalCost, settings.currencySymbol)}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-800">{formatCurrency(p.grandTotalCost, settings.currencySymbol)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-brand-800">{formatCurrency(p.sellingPrice, settings.currencySymbol)}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-emerald-600">{formatCurrency(p.grossProfit, settings.currencySymbol)}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-900">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        {p.profitMarginPct.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
