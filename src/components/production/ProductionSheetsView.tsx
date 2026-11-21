import React, { useState } from 'react';
import {
  EventRecord,
  FoodItem,
  CompanySettings
} from '../../types/catering';
import {
  ClipboardList,
  Printer,
  Download,
  Clock,
  Users,
  UtensilsCrossed,
  ShieldAlert,
  Flame,
  CheckSquare
} from 'lucide-react';
import { PdfService } from '../../services/pdfService';
import { UnitConverter } from '../../services/calculationEngine';

interface ProductionSheetsViewProps {
  events: EventRecord[];
  selectedEventId: string | null;
  onSelectEventId: (id: string) => void;
  foodItems: FoodItem[];
  settings: CompanySettings;
}

export const ProductionSheetsView: React.FC<ProductionSheetsViewProps> = ({
  events,
  selectedEventId,
  onSelectEventId,
  foodItems,
  settings
}) => {
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (!activeEvent) return;
    PdfService.generateProductionSheetPdf(activeEvent, settings);
  };

  if (!activeEvent) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-sm text-slate-500">No events found to generate production sheet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Kitchen & Service Production Sheets
          </h2>
          <p className="text-xs text-slate-500">
            Section 11: Dish-wise batch yields, prep milestones, equipment allocation & counter layout for kitchen staff
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Event Picker */}
          <select
            value={activeEvent.id}
            onChange={e => onSelectEventId(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.name} ({ev.eventDate})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Kitchen Sheet</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-semibold shadow transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Event Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              Kitchen Operational Directive
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              {activeEvent.name}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Venue: <strong className="text-slate-800">{activeEvent.eventLocation}</strong> • Date: <strong className="text-slate-800">{activeEvent.eventDate}</strong> • Duration: {activeEvent.eventDurationHours} Hours
            </p>
          </div>

          <div className="sm:text-right space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Production Count
            </span>
            <div className="text-2xl font-black text-slate-900">
              {activeEvent.guestCount} Pax
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {activeEvent.adultsCount} Adults • {activeEvent.childrenCount} Children • {activeEvent.foodCounters} Buffet Counters
            </div>
          </div>
        </div>

        {/* Special Dietary Requirements Alert Banner */}
        {activeEvent.specialDietaryRequirements ? (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                CRITICAL KITCHEN NOTICE: Special Dietary Allocations
              </h4>
              <p className="text-xs text-amber-800 font-medium mt-0.5">
                {activeEvent.specialDietaryRequirements}
              </p>
            </div>
          </div>
        ) : null}

        {/* Dish-Wise Production Quantities Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-brand-700" />
              1. Dish-Wise Kitchen Production & Batch Schedule
            </h3>
            <span className="text-xs text-slate-500">
              Includes {activeEvent.pricing.contingencyPct}% safety margin buffer
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 text-[10px] font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-4">Dish Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Portion / Pax</th>
                  <th className="py-2.5 px-3 text-right">Net Consumption</th>
                  <th className="py-2.5 px-3 text-right font-black text-slate-900">
                    Production Target (+Buffer)
                  </th>
                  <th className="py-2.5 px-3 text-right">Raw Procurement (+Waste)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeEvent.menu.map((m, idx) => {
                  const optimalProd = UnitConverter.formatWithOptimalUnit(
                    m.productionQty,
                    m.servingUnit
                  );
                  const optimalPurch = UnitConverter.formatWithOptimalUnit(
                    m.purchaseQty,
                    m.servingUnit
                  );

                  return (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        {m.name}
                        <span className="text-[10px] font-normal text-slate-500 block">
                          {m.dietaryType} • {m.cuisine}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{m.categoryName}</td>
                      <td className="py-2.5 px-3 text-center font-medium">
                        {m.servingSize} {m.servingUnit}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {m.requiredQty.toLocaleString()} {m.servingUnit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-brand-900 bg-brand-50/30">
                        {optimalProd.displayQty} {optimalProd.displayUnit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-700">
                        {optimalPurch.displayQty} {optimalPurch.displayUnit}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                          <CheckSquare className="w-3 h-3" /> Scheduled
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kitchen Timeline Schedule */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-700" />
            2. Kitchen Production Milestone Schedule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">T - 24 Hours</span>
              <h4 className="font-bold text-slate-900">Mise En Place & Marination</h4>
              <p className="text-[11px] text-slate-500">
                Vegetable trimming, spice grinding, chicken/paneer marination in cold store.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">T - 6 Hours</span>
              <h4 className="font-bold text-slate-900">Base Gravies & Cooking</h4>
              <p className="text-[11px] text-slate-500">
                Slow simmering of makhani and onion gravies, boiling lentils, biryani prep.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">T - 2 Hours</span>
              <h4 className="font-bold text-slate-900">Live Counters & Tandoor</h4>
              <p className="text-[11px] text-slate-500">
                Firing clay tandoors, setting up live chaat counters and welcome beverage station.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">T - 30 Mins</span>
              <h4 className="font-bold text-slate-900">Buffet Warmers & Quality Audit</h4>
              <p className="text-[11px] text-slate-500">
                Loading food into chafing dishes, temperature verification (&gt;65°C), garnishes.
              </p>
            </div>
          </div>
        </div>

        {/* Staff Allocation & Counter Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Staff Allocation */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-700" />
              3. Service & Kitchen Staff Allocation
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              {activeEvent.operationalCosts
                .filter(op => op.unit === 'staff')
                .map((staff, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-0">
                    <div>
                      <span className="font-bold text-slate-900">{staff.category}</span>
                      <p className="text-[11px] text-slate-500">{staff.description}</p>
                    </div>
                    <span className="font-bold text-brand-800 bg-white px-2.5 py-1 rounded border border-slate-200">
                      {staff.quantity} Staff Assigned
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Equipment & Buffet Counters Layout */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-brand-700" />
              4. Buffet Counter & Equipment Checklist
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Total Food Counters:</span>
                <strong className="text-slate-900">{activeEvent.foodCounters} Independent Stations</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Chafing Warmers:</span>
                <strong className="text-slate-900">{activeEvent.menu.length * 2} Chafing Units</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Dinner Plates & Cutlery Sets:</span>
                <strong className="text-slate-900">{Math.round(activeEvent.guestCount * 1.25)} Complete Sets</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Serving Tongs & Ladles:</span>
                <strong className="text-slate-900">30 Heavy Gauge Stainless Units</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Signoff */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-slate-400">Head Chef Operational Approval:</span>
            <div className="border-b border-slate-400 w-48 mt-8"></div>
            <span className="font-bold text-slate-800 mt-1 block">Executive Sous Chef</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Banquets & Operations Manager:</span>
            <div className="border-b border-slate-400 w-48 mt-8 ml-auto"></div>
            <span className="font-bold text-slate-800 mt-1 block">Floor Event Supervisor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
