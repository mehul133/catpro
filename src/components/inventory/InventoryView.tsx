import React, { useState } from 'react';
import {
  Ingredient,
  Supplier,
  EventRecord,
  FoodItem,
  CompanySettings,
  ProcurementItem
} from '../../types/catering';
import {
  Boxes,
  Search,
  PlusCircle,
  AlertTriangle,
  ShoppingCart,
  Download,
  Filter,
  ArrowRight,
  TrendingUp,
  Truck
} from 'lucide-react';
import {
  generateProcurementList,
  formatCurrency
} from '../../services/calculationEngine';
import { ExportService } from '../../services/exportService';

interface InventoryViewProps {
  ingredients: Ingredient[];
  suppliers: Supplier[];
  events: EventRecord[];
  foodItems: FoodItem[];
  settings: CompanySettings;
  onUpdateIngredient: (ingredient: Ingredient) => void;
  onAddIngredient: (ingredient: Ingredient) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  ingredients,
  suppliers,
  events,
  foodItems,
  settings,
  onUpdateIngredient,
  onAddIngredient
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'procurement'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');

  // Add / Edit modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIngName, setNewIngName] = useState('');
  const [newIngCategory, setNewIngCategory] = useState('Produce');
  const [newIngUnit, setNewIngUnit] = useState<Ingredient['purchaseUnit']>('kg');
  const [newIngPrice, setNewIngPrice] = useState<number>(100);
  const [newIngStock, setNewIngStock] = useState<number>(50);
  const [newIngMinStock, setNewIngMinStock] = useState<number>(20);
  const [newIngSupplierId, setNewIngSupplierId] = useState(suppliers[0]?.id || '');

  const categories = ['All', 'Dairy', 'Produce', 'Meat', 'Grocery', 'Spices', 'Oils', 'Beverages'];

  const filteredIngredients = ingredients.filter(i => {
    const matchesSearch =
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.supplierName && i.supplierName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = ingredients.filter(i => i.stockQuantity <= i.minStockLevel).length;

  // Selected event for procurement generation
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];
  const procurementList: ProcurementItem[] = activeEvent
    ? generateProcurementList(activeEvent.menu, foodItems, ingredients)
    : [];

  const totalProcurementCost = procurementList.reduce((acc, p) => acc + p.estimatedCost, 0);

  const handleStockUpdate = (ing: Ingredient, newStock: number) => {
    onUpdateIngredient({
      ...ing,
      stockQuantity: Math.max(0, newStock)
    });
  };

  const handlePriceUpdate = (ing: Ingredient, newPrice: number) => {
    onUpdateIngredient({
      ...ing,
      lastPurchasePrice: ing.currentMarketPrice,
      currentMarketPrice: Math.max(0, newPrice)
    });
  };

  const handleCreateIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngName.trim()) return;

    const sup = suppliers.find(s => s.id === newIngSupplierId);
    const newIngredient: Ingredient = {
      id: `ing-${Date.now()}`,
      name: newIngName.trim(),
      category: newIngCategory,
      purchaseUnit: newIngUnit,
      currentMarketPrice: newIngPrice,
      lastPurchasePrice: newIngPrice,
      stockQuantity: newIngStock,
      minStockLevel: newIngMinStock,
      supplierId: newIngSupplierId,
      supplierName: sup?.name,
      wastagePct: 3
    };

    onAddIngredient(newIngredient);
    setIsAddModalOpen(false);
    setNewIngName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Inventory & Smart Procurement Engine
          </h2>
          <p className="text-xs text-slate-500">
            Section 8: Track raw material stock, market pricing, and auto-generate event procurement slips
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => ExportService.exportInventoryReport(ingredients)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'inventory'
              ? 'border-brand-700 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Ingredient Inventory Master ({ingredients.length})</span>
          {lowStockCount > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {lowStockCount} Low Stock
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('procurement')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'procurement'
              ? 'border-brand-700 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Auto-Generated Procurement List</span>
        </button>
      </div>

      {activeTab === 'inventory' ? (
        /* Inventory Table View */
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search raw materials, suppliers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
                    categoryFilter === c
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 text-[10px] font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Ingredient Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-center">Unit</th>
                    <th className="py-3 px-3 text-center">Stock Qty</th>
                    <th className="py-3 px-3 text-center">Min Level</th>
                    <th className="py-3 px-3 text-right">Current Market Price</th>
                    <th className="py-3 px-3 text-right">Stock Valuation</th>
                    <th className="py-3 px-4">Preferred Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIngredients.map(ing => {
                    const isLow = ing.stockQuantity <= ing.minStockLevel;
                    const valuation = ing.stockQuantity * ing.currentMarketPrice;

                    return (
                      <tr key={ing.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            {isLow && (
                              <span title="Stock below threshold">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              </span>
                            )}
                            <span>{ing.name}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {ing.category}
                        </td>

                        <td className="py-3 px-3 text-center font-bold text-slate-500">
                          {ing.purchaseUnit}
                        </td>

                        {/* Editable Stock */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={ing.stockQuantity}
                            onChange={e => handleStockUpdate(ing, Number(e.target.value))}
                            className={`w-20 p-1 text-center border rounded font-bold text-xs ${
                              isLow
                                ? 'bg-amber-50 border-amber-300 text-amber-900'
                                : 'bg-slate-50 border-slate-200 text-slate-900'
                            }`}
                          />
                        </td>

                        <td className="py-3 px-3 text-center font-semibold text-slate-400">
                          {ing.minStockLevel} {ing.purchaseUnit}
                        </td>

                        {/* Editable Market Price */}
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            <span className="text-slate-400 font-medium">{settings.currencySymbol}</span>
                            <input
                              type="number"
                              min="0"
                              value={ing.currentMarketPrice}
                              onChange={e => handlePriceUpdate(ing, Number(e.target.value))}
                              className="w-20 p-1 text-right bg-slate-50 border border-slate-200 rounded font-bold text-xs text-slate-900"
                            />
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                          {formatCurrency(valuation, settings.currencySymbol)}
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {ing.supplierName || 'Wholesale Market'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Section 8: Auto-Generated Procurement List View */
        <div className="space-y-6">
          {/* Event Picker Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                Live Menu Requirement Generator
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Event-Driven Ingredient Procurement Plan
              </h3>
              <p className="text-xs text-slate-500">
                Calculates precise quantity required minus on-hand inventory for confirmed event menus
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Select Event:</label>
              <select
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} ({ev.guestCount} Pax - {ev.eventDate})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Procurement Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Ingredients Needed
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {procurementList.length} Items
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Items Requiring Purchase
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {procurementList.filter(p => p.toPurchaseQty > 0).length} Items
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Est. Purchase Outlay
              </span>
              <div className="text-2xl font-black text-brand-700 mt-1">
                {formatCurrency(totalProcurementCost, settings.currencySymbol)}
              </div>
            </div>
          </div>

          {/* Procurement Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 text-[10px] font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Ingredient Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-center">Unit</th>
                    <th className="py-3 px-3 text-right">Menu Required Qty</th>
                    <th className="py-3 px-3 text-right">Available In-Stock</th>
                    <th className="py-3 px-3 text-right font-extrabold text-amber-700">
                      Quantity to Purchase
                    </th>
                    <th className="py-3 px-3 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Estimated Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {procurementList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.ingredientName}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{item.category}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-400">
                        {item.purchaseUnit}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-700">
                        {item.requiredQty} {item.purchaseUnit}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-slate-500">
                        {item.stockQty} {item.purchaseUnit}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-amber-700">
                        {item.toPurchaseQty > 0 ? (
                          <span className="bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-amber-900">
                            {item.toPurchaseQty} {item.purchaseUnit}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">Stock In Hand</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-700">
                        {formatCurrency(item.unitPrice, settings.currencySymbol)}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                        {formatCurrency(item.estimatedCost, settings.currencySymbol)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Raw Material / Ingredient</h3>
            <form onSubmit={handleCreateIngredient} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ingredient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Walnuts"
                  value={newIngName}
                  onChange={e => setNewIngName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newIngCategory}
                    onChange={e => setNewIngCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat">Meat</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Spices">Spices</option>
                    <option value="Oils">Oils</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Unit</label>
                  <select
                    value={newIngUnit}
                    onChange={e => setNewIngUnit(e.target.value as Ingredient['purchaseUnit'])}
                    className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">l</option>
                    <option value="ml">ml</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Market Price</label>
                  <input
                    type="number"
                    min="0"
                    value={newIngPrice}
                    onChange={e => setNewIngPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newIngStock}
                    onChange={e => setNewIngStock(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-semibold"
                >
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
