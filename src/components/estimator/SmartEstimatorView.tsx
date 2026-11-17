import React, { useState, useEffect } from 'react';
import {
  EventRecord,
  FoodItem,
  FoodCategory,
  EventMenuItem,
  OperationalCostItem,
  PricingStrategy,
  CompanySettings
} from '../../types/catering';
import {
  Calculator,
  Plus,
  Trash2,
  Sparkles,
  Save,
  FileText,
  ClipboardList,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Percent,
  DollarSign
} from 'lucide-react';
import { DietaryBadge } from '../common/Badge';
import {
  calculateItemQuantities,
  calculateEventFinancials,
  createEventMenuItem,
  formatCurrency,
  UnitConverter
} from '../../services/calculationEngine';

interface SmartEstimatorViewProps {
  events: EventRecord[];
  selectedEventId: string | null;
  onSelectEventId: (id: string) => void;
  foodItems: FoodItem[];
  categories: FoodCategory[];
  settings: CompanySettings;
  onSaveEventChanges: (updatedEvent: EventRecord) => void;
  onOpenQuotationPreview: (eventId: string) => void;
  onOpenProductionSheet: (eventId: string) => void;
}

const DEFAULT_OPERATIONAL_CATEGORIES = [
  'Chef charges',
  'Kitchen staff',
  'Service staff',
  'Event managers',
  'Transportation',
  'Fuel',
  'Equipment rental',
  'Buffet setup',
  'Decoration',
  'Crockery and cutlery',
  'Packaging',
  'Electricity',
  'Water',
  'Miscellaneous expenses'
] as const;

export const SmartEstimatorView: React.FC<SmartEstimatorViewProps> = ({
  events,
  selectedEventId,
  onSelectEventId,
  foodItems,
  categories,
  settings,
  onSaveEventChanges,
  onOpenQuotationPreview,
  onOpenProductionSheet
}) => {
  // Currently active event
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  // Local working state for the active event
  const [guests, setGuests] = useState<number>(activeEvent?.guestCount || 300);
  const [menuItems, setMenuItems] = useState<EventMenuItem[]>(activeEvent?.menu || []);
  const [operationalCosts, setOperationalCosts] = useState<OperationalCostItem[]>(
    activeEvent?.operationalCosts || []
  );

  // Pricing controls
  const [pricingStrategy, setPricingStrategy] = useState<PricingStrategy>(
    activeEvent?.pricing?.strategy || 'target_margin'
  );
  const [targetMarginPct, setTargetMarginPct] = useState<number>(
    activeEvent?.pricing?.targetProfitMarginPct || 30
  );
  const [costPlusMarkupPct, setCostPlusMarkupPct] = useState<number>(40);
  const [perPlateRate, setPerPlateRate] = useState<number>(
    activeEvent?.pricing?.sellingPricePerGuest || 750
  );
  const [packagePrice, setPackagePrice] = useState<number>(250000);
  const [customPrice, setCustomPrice] = useState<number>(activeEvent?.pricing?.sellingPrice || 300000);

  const [contingencyPct, setContingencyPct] = useState<number>(
    activeEvent?.pricing?.contingencyPct ?? settings.defaultContingencyRate
  );
  const [taxRatePct, setTaxRatePct] = useState<number>(
    activeEvent?.pricing?.taxRatePct ?? settings.defaultTaxRate
  );
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);

  // Dish selector modal or inline adder
  const [selectedDishToAdd, setSelectedDishToAdd] = useState<string>('');

  // When active event changes, sync state
  useEffect(() => {
    if (activeEvent) {
      setGuests(activeEvent.guestCount);
      setMenuItems(activeEvent.menu || []);
      setOperationalCosts(activeEvent.operationalCosts || []);
      setPricingStrategy(activeEvent.pricing?.strategy || 'target_margin');
      setTargetMarginPct(activeEvent.pricing?.targetProfitMarginPct || 30);
      setContingencyPct(activeEvent.pricing?.contingencyPct ?? settings.defaultContingencyRate);
      setTaxRatePct(activeEvent.pricing?.taxRatePct ?? settings.defaultTaxRate);
    }
  }, [activeEvent, settings]);

  // Recalculate menu items when guest count changes
  const handleGuestCountChange = (newGuests: number) => {
    const val = Math.max(1, newGuests);
    setGuests(val);

    const updatedMenu = menuItems.map(item => {
      const calc = calculateItemQuantities(
        val,
        item.servingSize,
        item.consumptionRate,
        item.bufferPct,
        item.wastagePct,
        item.unitCost
      );
      return {
        ...item,
        requiredQty: calc.requiredQty,
        productionQty: calc.productionQty,
        purchaseQty: calc.purchaseQty,
        totalCost: calc.totalCost
      };
    });
    setMenuItems(updatedMenu);
  };

  // Update a single menu item's parameters
  const handleUpdateMenuItem = (index: number, updates: Partial<EventMenuItem>) => {
    const updated = [...menuItems];
    const current = { ...updated[index], ...updates };

    const calc = calculateItemQuantities(
      guests,
      current.servingSize,
      current.consumptionRate,
      current.bufferPct,
      current.wastagePct,
      current.unitCost
    );

    current.requiredQty = calc.requiredQty;
    current.productionQty = calc.productionQty;
    current.purchaseQty = calc.purchaseQty;
    current.totalCost = calc.totalCost;

    updated[index] = current;
    setMenuItems(updated);
  };

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, idx) => idx !== index));
  };

  const handleAddDish = () => {
    if (!selectedDishToAdd) return;
    const food = foodItems.find(f => f.id === selectedDishToAdd);
    if (!food) return;

    const newItem = createEventMenuItem(food, guests, {
      consumptionRate: 0.90,
      bufferPct: settings.defaultBufferRate / 100,
      wastagePct: food.foodWastagePct / 100
    });

    setMenuItems([...menuItems, newItem]);
    setSelectedDishToAdd('');
  };

  // Operational cost management
  const handleAddOperationalCost = () => {
    const newOp: OperationalCostItem = {
      id: `op-${Date.now()}`,
      category: 'Service staff',
      description: 'Uniformed catering stewards',
      quantity: 5,
      unit: 'staff',
      unitRate: 2000,
      totalAmount: 10000
    };
    setOperationalCosts([...operationalCosts, newOp]);
  };

  const handleUpdateOperationalCost = (index: number, updates: Partial<OperationalCostItem>) => {
    const updated = [...operationalCosts];
    const item = { ...updated[index], ...updates };
    item.totalAmount = item.quantity * item.unitRate;
    updated[index] = item;
    setOperationalCosts(updated);
  };

  const handleRemoveOperationalCost = (index: number) => {
    setOperationalCosts(operationalCosts.filter((_, idx) => idx !== index));
  };

  // Live financial calculation
  const financials = calculateEventFinancials({
    guestCount: guests,
    menuItems,
    operationalCosts,
    pricingStrategy,
    contingencyPct,
    taxRatePct,
    targetProfitMarginPct: targetMarginPct,
    costPlusMarkupPct,
    perPlateRate,
    packagePrice,
    customSellingPrice: customPrice,
    discountType,
    discountValue
  });

  const handleSaveToEvent = () => {
    if (!activeEvent) return;

    const updatedEvent: EventRecord = {
      ...activeEvent,
      guestCount: guests,
      menu: menuItems,
      operationalCosts,
      pricing: financials,
      updatedAt: new Date().toISOString()
    };

    onSaveEventChanges(updatedEvent);
    alert('Event estimation successfully saved with updated financial snapshots!');
  };

  if (!activeEvent) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-sm text-slate-500">Please create an event first to run estimation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Header & Target Select */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              Interactive Estimator
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-600 font-semibold">{activeEvent.category}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {activeEvent.name}
          </h2>
          <p className="text-xs text-slate-500">
            Client: <strong className="text-slate-700">{activeEvent.clientName}</strong> • Venue: {activeEvent.eventLocation} • Date: {activeEvent.eventDate}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Switch Event Dropdown */}
          <select
            value={activeEvent.id}
            onChange={e => onSelectEventId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.name} ({ev.guestCount} Pax)
              </option>
            ))}
          </select>

          <button
            onClick={handleSaveToEvent}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Estimate</span>
          </button>
        </div>
      </div>

      {/* Guest Count Slider & Real-time KPI Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Guest Count Slider */}
          <div className="md:col-span-2 space-y-2 border-r border-slate-800 pr-0 md:pr-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Guaranteed Guest Attendance
              </span>
              <span className="text-xl font-black text-brand-400 font-mono">
                {guests} Pax
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              step="10"
              value={guests}
              onChange={e => handleGuestCountChange(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Intimate (20)</span>
              <span>Mid-Size (300)</span>
              <span>Grand Banquet (1000+)</span>
            </div>
          </div>

          {/* KPI: Quotation Total */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Selling Price / Guest
            </span>
            <div className="text-2xl font-black text-brand-400">
              {formatCurrency(financials.sellingPricePerGuest, settings.currencySymbol)}
            </div>
            <span className="text-[11px] text-slate-400">
              Cost: {formatCurrency(financials.costPerGuest, settings.currencySymbol)}
            </span>
          </div>

          {/* KPI: Total Proposal Amount */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Quotation (Incl. Tax)
            </span>
            <div className="text-2xl font-black text-white">
              {formatCurrency(financials.sellingPrice, settings.currencySymbol)}
            </div>
            <span className="text-[11px] text-emerald-400 font-bold">
              +{formatCurrency(financials.grossProfit, settings.currencySymbol)} Profit ({financials.profitMarginPct.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Work Area: Section 4 Menu Calculator + Section 6 Operational Costs */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Smart Food Quantity Calculator Table */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-brand-700" />
                  Section 4: Smart Food Quantity Calculator
                </h3>
                <p className="text-xs text-slate-500">
                  Required Qty = Guests × Size × Rate | Production = Req × (1+Buffer) | Purchase = Prod × (1+Waste)
                </p>
              </div>

              {/* Add dish dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedDishToAdd}
                  onChange={e => setSelectedDishToAdd(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg max-w-[200px]"
                >
                  <option value="">+ Add Dish to Menu...</option>
                  {foodItems
                    .filter(f => !menuItems.some(m => m.itemId === f.id))
                    .map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.categoryName})
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleAddDish}
                  disabled={!selectedDishToAdd}
                  className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Dish / Category</th>
                    <th className="py-2.5 px-2 text-center">Portion</th>
                    <th className="py-2.5 px-2 text-center">Consump %</th>
                    <th className="py-2.5 px-2 text-center">Buffer %</th>
                    <th className="py-2.5 px-2 text-center">Waste %</th>
                    <th className="py-2.5 px-2 text-right">Production Qty</th>
                    <th className="py-2.5 px-2 text-right">Purchase Qty</th>
                    <th className="py-2.5 px-2 text-right">Cost</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {menuItems.map((item, idx) => {
                    const optimalProd = UnitConverter.formatWithOptimalUnit(
                      item.productionQty,
                      item.servingUnit
                    );
                    const optimalPurch = UnitConverter.formatWithOptimalUnit(
                      item.purchaseQty,
                      item.servingUnit
                    );

                    return (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {item.categoryName} • {item.dietaryType}
                          </div>
                        </td>

                        <td className="py-2.5 px-2 text-center font-medium text-slate-700">
                          {item.servingSize} {item.servingUnit}
                        </td>

                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="10"
                            max="100"
                            step="5"
                            value={Math.round(item.consumptionRate * 100)}
                            onChange={e =>
                              handleUpdateMenuItem(idx, {
                                consumptionRate: Number(e.target.value) / 100
                              })
                            }
                            className="w-14 p-1 text-center bg-slate-50 border border-slate-200 rounded font-semibold text-xs"
                          />
                        </td>

                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="25"
                            step="1"
                            value={Math.round(item.bufferPct * 100)}
                            onChange={e =>
                              handleUpdateMenuItem(idx, {
                                bufferPct: Number(e.target.value) / 100
                              })
                            }
                            className="w-12 p-1 text-center bg-slate-50 border border-slate-200 rounded font-semibold text-xs"
                          />
                        </td>

                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="25"
                            step="1"
                            value={Math.round(item.wastagePct * 100)}
                            onChange={e =>
                              handleUpdateMenuItem(idx, {
                                wastagePct: Number(e.target.value) / 100
                              })
                            }
                            className="w-12 p-1 text-center bg-slate-50 border border-slate-200 rounded font-semibold text-xs"
                          />
                        </td>

                        {/* Production Qty */}
                        <td className="py-2.5 px-2 text-right font-bold text-slate-900">
                          {optimalProd.displayQty} {optimalProd.displayUnit}
                        </td>

                        {/* Purchase Qty */}
                        <td className="py-2.5 px-2 text-right font-bold text-brand-700">
                          {optimalPurch.displayQty} {optimalPurch.displayUnit}
                        </td>

                        {/* Cost */}
                        <td className="py-2.5 px-2 text-right font-bold text-slate-900">
                          {formatCurrency(item.totalCost, settings.currencySymbol)}
                        </td>

                        <td className="py-2.5 px-2 text-center">
                          <button
                            onClick={() => handleRemoveMenuItem(idx)}
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

            {/* Food Subtotal Bar */}
            <div className="flex justify-between items-center p-3 bg-brand-50/60 rounded-xl border border-brand-200 text-xs">
              <span className="font-bold text-brand-900">Total Food Production Cost:</span>
              <span className="font-extrabold text-sm text-brand-950 font-mono">
                {formatCurrency(financials.subtotalFoodCost, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Section 6B: Operational & Manpower Expenses */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Section 6B: Manpower & Operational Expenses
                </h3>
                <p className="text-xs text-slate-500">
                  Chefs, kitchen crew, service stewards, logistics, equipment rental, fuel & utilities
                </p>
              </div>
              <button
                onClick={handleAddOperationalCost}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Operational Cost
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {operationalCosts.map((op, idx) => (
                <div
                  key={op.id}
                  className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  <div className="col-span-3">
                    <select
                      value={op.category}
                      onChange={e =>
                        handleUpdateOperationalCost(idx, {
                          category: e.target.value as OperationalCostItem['category']
                        })
                      }
                      className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white font-semibold"
                    >
                      {DEFAULT_OPERATIONAL_CATEGORIES.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="Description"
                      value={op.description}
                      onChange={e =>
                        handleUpdateOperationalCost(idx, { description: e.target.value })
                      }
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                    />
                  </div>

                  <div className="col-span-1">
                    <input
                      type="number"
                      min="1"
                      value={op.quantity}
                      onChange={e =>
                        handleUpdateOperationalCost(idx, { quantity: Number(e.target.value) })
                      }
                      placeholder="Qty"
                      className="w-full p-1.5 border border-slate-200 rounded text-center bg-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      value={op.unitRate}
                      onChange={e =>
                        handleUpdateOperationalCost(idx, { unitRate: Number(e.target.value) })
                      }
                      placeholder="Rate"
                      className="w-full p-1.5 border border-slate-200 rounded text-right bg-white"
                    />
                  </div>

                  <div className="col-span-1 text-right font-bold text-slate-900">
                    ₹{op.totalAmount}
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => handleRemoveOperationalCost(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Ops Subtotal Bar */}
            <div className="flex justify-between items-center p-3 bg-slate-100 rounded-xl text-xs">
              <span className="font-bold text-slate-700">Total Operational Cost:</span>
              <span className="font-extrabold text-sm text-slate-900 font-mono">
                {formatCurrency(financials.subtotalOperationalCost, settings.currencySymbol)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Section 7 Advanced Pricing Engine & Commercials */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-6 space-y-5">
            <div>
              <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                Commercial Engine
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Section 7: Advanced Pricing Engine
              </h3>
              <p className="text-xs text-slate-500">
                Configure profit strategies, tax contingencies and quotation discounts
              </p>
            </div>

            {/* Pricing Strategy Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pricing Strategy
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'target_margin', label: 'Target Margin' },
                  { id: 'cost_plus', label: 'Cost-Plus Markup' },
                  { id: 'per_plate', label: 'Per-Plate Fixed' },
                  { id: 'package', label: 'Package Lump' }
                ].map(strat => (
                  <button
                    key={strat.id}
                    onClick={() => setPricingStrategy(strat.id as PricingStrategy)}
                    className={`py-2 px-3 rounded-xl font-semibold border transition-all text-center ${
                      pricingStrategy === strat.id
                        ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {strat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Strategy Input Controls */}
            {pricingStrategy === 'target_margin' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Target Profit Margin:</span>
                  <span className="text-brand-700 font-bold">{targetMarginPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={targetMarginPct}
                  onChange={e => setTargetMarginPct(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <p className="text-[10px] text-slate-400">
                  Formula: Selling Price = Total Estimated Cost / (1 - Margin%)
                </p>
              </div>
            )}

            {pricingStrategy === 'cost_plus' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Cost-Plus Markup:</span>
                  <span className="text-brand-700 font-bold">{costPlusMarkupPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={costPlusMarkupPct}
                  onChange={e => setCostPlusMarkupPct(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>
            )}

            {pricingStrategy === 'per_plate' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Per Plate Charge / Guest:
                </label>
                <input
                  type="number"
                  value={perPlateRate}
                  onChange={e => setPerPlateRate(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm font-bold bg-white"
                />
              </div>
            )}

            {/* Contingency, Taxes, Discounts */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Contingency Buffer:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={contingencyPct}
                    onChange={e => setContingencyPct(Number(e.target.value))}
                    className="w-14 p-1 text-center border border-slate-200 rounded font-semibold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Applicable Tax (GST):</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="28"
                    step="0.5"
                    value={taxRatePct}
                    onChange={e => setTaxRatePct(Number(e.target.value))}
                    className="w-14 p-1 text-center border border-slate-200 rounded font-semibold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Special Discount:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-16 p-1 text-center border border-slate-200 rounded font-semibold"
                  />
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="p-1 border border-slate-200 rounded text-xs bg-white"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">{settings.currencySymbol}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Summary breakdown table */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Food Cost:</span>
                <span>{formatCurrency(financials.subtotalFoodCost, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Operational Cost:</span>
                <span>{formatCurrency(financials.subtotalOperationalCost, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Base:</span>
                <span>{formatCurrency(financials.subtotalCost, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Contingency ({financials.contingencyPct}%):</span>
                <span>+{formatCurrency(financials.contingencyAmount, settings.currencySymbol)}</span>
              </div>
              {financials.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(financials.discountAmount, settings.currencySymbol)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Taxes & GST ({financials.taxRatePct}%):</span>
                <span>+{formatCurrency(financials.taxAmount, settings.currencySymbol)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                <span>GRAND TOTAL QUOTATION:</span>
                <span className="text-brand-800">
                  {formatCurrency(financials.sellingPrice, settings.currencySymbol)}
                </span>
              </div>

              <div className="flex justify-between font-bold text-xs text-emerald-700 pt-1">
                <span>Gross Profit Margin:</span>
                <span>
                  {formatCurrency(financials.grossProfit, settings.currencySymbol)} ({financials.profitMarginPct.toFixed(1)}%)
                </span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Food Cost %:</span>
                <span>{financials.foodCostPct.toFixed(1)}% of Revenue</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleSaveToEvent}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow-md transition-colors text-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Calculation to Event</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenQuotationPreview(activeEvent.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Preview Quote</span>
                </button>

                <button
                  onClick={() => onOpenProductionSheet(activeEvent.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs border border-slate-300 transition-colors"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Kitchen Sheet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
