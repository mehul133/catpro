import React, { useState } from 'react';
import {
  FoodItem,
  Ingredient,
  Supplier,
  CompanySettings
} from '../../types/catering';
import {
  ChefHat,
  Search,
  Calculator,
  Plus,
  Trash2,
  DollarSign,
  TrendingDown,
  Sparkles,
  Save
} from 'lucide-react';
import { DietaryBadge } from '../common/Badge';
import { calculateRecipeCost, formatCurrency } from '../../services/calculationEngine';

interface RecipeCostingViewProps {
  foodItems: FoodItem[];
  ingredients: Ingredient[];
  suppliers: Supplier[];
  settings: CompanySettings;
  onUpdateFoodItem: (item: FoodItem) => void;
  onUpdateIngredientPrice: (ingId: string, newPrice: number) => void;
}

export const RecipeCostingView: React.FC<RecipeCostingViewProps> = ({
  foodItems,
  ingredients,
  suppliers,
  settings,
  onUpdateFoodItem,
  onUpdateIngredientPrice
}) => {
  const [selectedDishId, setSelectedDishId] = useState<string>(foodItems[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const currentDish = foodItems.find(f => f.id === selectedDishId) || foodItems[0];

  // Local editable recipe yield & ingredients
  const [yieldPortions, setYieldPortions] = useState<number>(
    currentDish?.recipeYieldPortions || 10
  );
  const [dishIngredients, setDishIngredients] = useState(
    currentDish?.ingredients || []
  );

  // Sync state when selected dish changes
  React.useEffect(() => {
    if (currentDish) {
      setYieldPortions(currentDish.recipeYieldPortions || 10);
      setDishIngredients(currentDish.ingredients || []);
    }
  }, [currentDish]);

  const costBreakdown = calculateRecipeCost(dishIngredients, yieldPortions);

  const handleIngredientQtyChange = (idx: number, qty: number) => {
    const updated = [...dishIngredients];
    updated[idx] = { ...updated[idx], quantity: qty };
    setDishIngredients(updated);
  };

  const handleIngredientPrepLossChange = (idx: number, loss: number) => {
    const updated = [...dishIngredients];
    updated[idx] = { ...updated[idx], prepLossPct: loss };
    setDishIngredients(updated);
  };

  const handleAddIngredientToRecipe = (ingId: string) => {
    const matched = ingredients.find(i => i.id === ingId);
    if (!matched) return;

    const newRow = {
      ingredientId: matched.id,
      ingredientName: matched.name,
      quantity: 1,
      unit: matched.purchaseUnit,
      costPerUnit: matched.currentMarketPrice,
      subtotal: matched.currentMarketPrice,
      prepLossPct: matched.wastagePct || 0
    };
    setDishIngredients([...dishIngredients, newRow]);
  };

  const handleRemoveIngredient = (idx: number) => {
    setDishIngredients(dishIngredients.filter((_, i) => i !== idx));
  };

  const handleSaveRecipeChanges = () => {
    if (!currentDish) return;
    const updated: FoodItem = {
      ...currentDish,
      recipeYieldPortions: yieldPortions,
      ingredients: costBreakdown.ingredientsWithCost,
      costPerPortion: costBreakdown.costPerPortion
    };
    onUpdateFoodItem(updated);
    alert(`Recipe costing updated for ${currentDish.name}! Cost per portion is now ${formatCurrency(costBreakdown.costPerPortion, settings.currencySymbol)}.`);
  };

  const filteredDishes = foodItems.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Recipe & Ingredient Costing Engine
          </h2>
          <p className="text-xs text-slate-500">
            Section 5: Maintain ingredient yields, prep losses, market prices, and portion unit costs
          </p>
        </div>
        <button
          onClick={handleSaveRecipeChanges}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Recipe Cost</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dish Selector & Search */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredDishes.map(dish => {
              const isSelected = dish.id === currentDish?.id;
              return (
                <button
                  key={dish.id}
                  onClick={() => setSelectedDishId(dish.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-50 border-brand-300 shadow-sm'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900 line-clamp-1">
                      {dish.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {dish.categoryName} • {dish.cuisine}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-bold text-slate-900 block">
                      {formatCurrency(dish.costPerPortion, settings.currencySymbol)}
                    </span>
                    <span className="text-[10px] text-slate-400">/ portion</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Recipe Ingredient Breakdown Table */}
        <div className="lg:col-span-2 space-y-6">
          {currentDish && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
              {/* Dish Overview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {currentDish.categoryName}
                    </span>
                    <DietaryBadge type={currentDish.dietaryType} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {currentDish.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Standard Serving: {currentDish.servingSizePerPerson} {currentDish.servingUnit} per person
                  </p>
                </div>

                {/* Recipe Yield Portions */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Standard Batch Yield
                    </label>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={yieldPortions}
                        onChange={e => setYieldPortions(Math.max(1, Number(e.target.value)))}
                        className="w-16 px-2 py-1 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded text-sm"
                      />
                      <span className="text-xs text-slate-600 font-semibold">Portions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Ingredient Composition & Cost Breakdown
                  </h4>
                  {/* Quick Add Ingredient */}
                  <select
                    onChange={e => {
                      if (e.target.value) {
                        handleAddIngredientToRecipe(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                  >
                    <option value="">+ Add Ingredient...</option>
                    {ingredients.map(ing => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({formatCurrency(ing.currentMarketPrice, settings.currencySymbol)}/{ing.purchaseUnit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 text-[10px] font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Ingredient Name</th>
                        <th className="py-2.5 px-2 text-center">Batch Qty</th>
                        <th className="py-2.5 px-2 text-center">Unit</th>
                        <th className="py-2.5 px-2 text-right">Purchase Price</th>
                        <th className="py-2.5 px-2 text-center">Prep Loss %</th>
                        <th className="py-2.5 px-2 text-right">Effective Subtotal</th>
                        <th className="py-2.5 px-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dishIngredients.map((ing, idx) => {
                        const lossFactor = ing.prepLossPct > 0 ? 1 + ing.prepLossPct / 100 : 1;
                        const effectiveSubtotal = ing.quantity * lossFactor * ing.costPerUnit;

                        return (
                          <tr key={idx} className="hover:bg-slate-50/70">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              {ing.ingredientName}
                            </td>

                            <td className="py-2.5 px-2 text-center">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={ing.quantity}
                                onChange={e =>
                                  handleIngredientQtyChange(idx, Number(e.target.value))
                                }
                                className="w-16 p-1 text-center bg-slate-50 border border-slate-200 rounded font-semibold text-xs"
                              />
                            </td>

                            <td className="py-2.5 px-2 text-center font-bold text-slate-500">
                              {ing.unit}
                            </td>

                            <td className="py-2.5 px-2 text-right text-slate-700">
                              {formatCurrency(ing.costPerUnit, settings.currencySymbol)}
                            </td>

                            <td className="py-2.5 px-2 text-center">
                              <input
                                type="number"
                                min="0"
                                max="30"
                                value={ing.prepLossPct}
                                onChange={e =>
                                  handleIngredientPrepLossChange(idx, Number(e.target.value))
                                }
                                className="w-12 p-1 text-center bg-slate-50 border border-slate-200 rounded font-semibold text-xs"
                              />
                            </td>

                            <td className="py-2.5 px-2 text-right font-bold text-slate-900">
                              {formatCurrency(effectiveSubtotal, settings.currencySymbol)}
                            </td>

                            <td className="py-2.5 px-2 text-center">
                              <button
                                onClick={() => handleRemoveIngredient(idx)}
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
              </div>

              {/* Recipe Cost Metric Banner */}
              <div className="bg-gradient-to-r from-emerald-50 via-brand-50 to-emerald-100 p-5 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Total Recipe Batch Cost ({yieldPortions} Portions)
                  </span>
                  <div className="text-xl font-black text-slate-900">
                    {formatCurrency(costBreakdown.totalRecipeCost, settings.currencySymbol)}
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800">
                    Calculated Cost Per Portion
                  </span>
                  <div className="text-2xl font-black text-brand-900">
                    {formatCurrency(costBreakdown.costPerPortion, settings.currencySymbol)} <span className="text-xs font-normal text-slate-600">/ pax</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
