import React, { useState, useEffect } from 'react';
import {
  FoodItem,
  FoodCategory,
  DietaryType,
  RecipeIngredient,
  Ingredient,
  UnitOfMeasure
} from '../../types/catering';
import { Modal } from '../common/Modal';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { calculateRecipeCost } from '../../services/calculationEngine';

interface FoodItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<FoodItem>) => void;
  categories: FoodCategory[];
  ingredientsList: Ingredient[];
  initialItem?: FoodItem | null;
}

export const FoodItemFormModal: React.FC<FoodItemFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  ingredientsList,
  initialItem
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [cuisine, setCuisine] = useState('North Indian');
  const [dietaryType, setDietaryType] = useState<DietaryType>('Vegetarian');
  const [description, setDescription] = useState('');
  const [servingSize, setServingSize] = useState<number>(150);
  const [servingUnit, setServingUnit] = useState<UnitOfMeasure>('g');
  const [preparationMethod, setPreparationMethod] = useState('');
  const [allergenString, setAllergenString] = useState('');
  const [foodWastagePct, setFoodWastagePct] = useState<number>(5);
  const [recipeYieldPortions, setRecipeYieldPortions] = useState<number>(10);
  const [sellingPrice, setSellingPrice] = useState<number>(120);

  // Ingredients in recipe
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setCategoryId(initialItem.categoryId);
      setCuisine(initialItem.cuisine);
      setDietaryType(initialItem.dietaryType);
      setDescription(initialItem.description);
      setServingSize(initialItem.servingSizePerPerson);
      setServingUnit(initialItem.servingUnit);
      setPreparationMethod(initialItem.preparationMethod || '');
      setAllergenString((initialItem.allergenInfo || []).join(', '));
      setFoodWastagePct(initialItem.foodWastagePct);
      setRecipeYieldPortions(initialItem.recipeYieldPortions || 10);
      setSellingPrice(initialItem.sellingPricePerServing);
      setRecipeIngredients(initialItem.ingredients || []);
    } else {
      setName('');
      setCategoryId(categories[0]?.id || 'cat-1');
      setCuisine('North Indian');
      setDietaryType('Vegetarian');
      setDescription('');
      setServingSize(150);
      setServingUnit('g');
      setPreparationMethod('');
      setAllergenString('');
      setFoodWastagePct(5);
      setRecipeYieldPortions(10);
      setSellingPrice(100);
      setRecipeIngredients([]);
    }
  }, [initialItem, isOpen, categories]);

  // Handle adding an ingredient row
  const handleAddIngredient = () => {
    if (!ingredientsList.length) return;
    const defaultIng = ingredientsList[0];
    const newRow: RecipeIngredient = {
      ingredientId: defaultIng.id,
      ingredientName: defaultIng.name,
      quantity: 1,
      unit: defaultIng.purchaseUnit,
      costPerUnit: defaultIng.currentMarketPrice,
      subtotal: defaultIng.currentMarketPrice,
      prepLossPct: defaultIng.wastagePct || 0
    };
    setRecipeIngredients([...recipeIngredients, newRow]);
  };

  const handleUpdateIngredient = (index: number, updates: Partial<RecipeIngredient>) => {
    const updated = [...recipeIngredients];
    const item = { ...updated[index], ...updates };

    // If ingredient changed, populate its unit and cost
    if (updates.ingredientId) {
      const match = ingredientsList.find(i => i.id === updates.ingredientId);
      if (match) {
        item.ingredientName = match.name;
        item.unit = match.purchaseUnit;
        item.costPerUnit = match.currentMarketPrice;
        item.prepLossPct = match.wastagePct || 0;
      }
    }

    const lossFactor = item.prepLossPct > 0 ? 1 + item.prepLossPct / 100 : 1;
    item.subtotal = Number((item.quantity * lossFactor * item.costPerUnit).toFixed(2));
    updated[index] = item;
    setRecipeIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    setRecipeIngredients(recipeIngredients.filter((_, idx) => idx !== index));
  };

  // Live recipe cost calculation
  const recipeCost = calculateRecipeCost(recipeIngredients, recipeYieldPortions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter Dish Name');
      return;
    }

    const matchedCategory = categories.find(c => c.id === categoryId);
    const allergens = allergenString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onSave({
      id: initialItem?.id,
      name,
      categoryId,
      categoryName: matchedCategory?.name || 'Main Course',
      cuisine,
      dietaryType,
      description,
      servingSizePerPerson: servingSize,
      servingUnit,
      preparationMethod,
      allergenInfo: allergens,
      foodWastagePct,
      recipeYieldPortions,
      costPerPortion: recipeCost.costPerPortion,
      sellingPricePerServing: sellingPrice,
      ingredients: recipeIngredients
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? 'Edit Catering Dish & Recipe' : 'Add New Dish to Menu Library'}
      subtitle="Define portion size, ingredient composition, culinary prep and selling price"
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Food Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Shahi Paneer Korma"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dietary, Cuisine, Serving Size */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Dietary Type *
            </label>
            <select
              value={dietaryType}
              onChange={e => setDietaryType(e.target.value as DietaryType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Jain">Jain</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cuisine *
            </label>
            <input
              type="text"
              value={cuisine}
              onChange={e => setCuisine(e.target.value)}
              placeholder="e.g. Awadhi, Continental, Pan-Asian"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Serving Size / Pax
            </label>
            <div className="flex gap-1.5">
              <input
                type="number"
                min="1"
                value={servingSize}
                onChange={e => setServingSize(Number(e.target.value))}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <select
                value={servingUnit}
                onChange={e => setServingUnit(e.target.value as UnitOfMeasure)}
                className="w-20 px-2 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="pcs">pcs</option>
                <option value="portion">portion</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Wastage %
            </label>
            <input
              type="number"
              min="0"
              max="30"
              value={foodWastagePct}
              onChange={e => setFoodWastagePct(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Description & Allergens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description (For Client Quotation)
            </label>
            <textarea
              rows={2}
              placeholder="Appetizing culinary description for proposals..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Allergens (Comma-separated)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Dairy, Nuts, Gluten, Soy"
              value={allergenString}
              onChange={e => setAllergenString(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 5: Recipe & Ingredients Costing Builder */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-brand-700" />
                Recipe Costing & Ingredients Breakdown
              </h4>
              <p className="text-[11px] text-slate-500">
                Formula: Ingredient Cost = Quantity × Unit Price; Recipe Cost = Σ Ingredients
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-semibold">Yield:</span>
              <input
                type="number"
                min="1"
                value={recipeYieldPortions}
                onChange={e => setRecipeYieldPortions(Math.max(1, Number(e.target.value)))}
                className="w-16 px-2 py-1 text-xs border border-slate-300 rounded bg-white text-center font-bold"
              />
              <span className="text-xs text-slate-500">Portions</span>

              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center gap-1 bg-brand-700 hover:bg-brand-800 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm ml-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Ingredient
              </button>
            </div>
          </div>

          {/* Ingredient Rows */}
          {recipeIngredients.length > 0 ? (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {recipeIngredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-slate-200 text-xs"
                >
                  <div className="col-span-4">
                    <select
                      value={ing.ingredientId}
                      onChange={e => handleUpdateIngredient(idx, { ingredientId: e.target.value })}
                      className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
                    >
                      {ingredientsList.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.currentMarketPrice}/{item.purchaseUnit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={ing.quantity}
                      onChange={e => handleUpdateIngredient(idx, { quantity: Number(e.target.value) })}
                      placeholder="Qty"
                      className="w-full p-1.5 border border-slate-200 rounded text-center"
                    />
                  </div>

                  <div className="col-span-1 text-center font-semibold text-slate-500">
                    {ing.unit}
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={ing.prepLossPct}
                      onChange={e => handleUpdateIngredient(idx, { prepLossPct: Number(e.target.value) })}
                      placeholder="Loss %"
                      title="Preparation Trimming Loss %"
                      className="w-full p-1.5 border border-slate-200 rounded text-center"
                    />
                  </div>

                  <div className="col-span-2 text-right font-bold text-slate-800">
                    ₹{ing.subtotal.toFixed(2)}
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-white rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
              No ingredients added yet. Click &quot;Add Ingredient&quot; above to calculate accurate batch costs.
            </div>
          )}

          {/* Recipe Financial Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-500">Total Batch Recipe Cost: </span>
              <strong className="text-slate-900 font-bold">₹{recipeCost.totalRecipeCost.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-slate-500">Cost Per Portion ({recipeYieldPortions} Pax): </span>
              <strong className="text-emerald-700 font-extrabold text-sm">
                ₹{recipeCost.costPerPortion.toFixed(2)}
              </strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-bold">Selling Price:</span>
              <input
                type="number"
                min="0"
                value={sellingPrice}
                onChange={e => setSellingPrice(Number(e.target.value))}
                className="w-24 px-2 py-1 text-xs border border-brand-300 rounded-lg bg-white font-bold text-brand-800"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-sm font-semibold shadow"
          >
            Save Food Item
          </button>
        </div>
      </form>
    </Modal>
  );
};
