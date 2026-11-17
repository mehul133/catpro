import React, { useState } from 'react';
import {
  FoodItem,
  FoodCategory,
  DietaryType,
  Ingredient,
  CompanySettings,
  MenuTemplate
} from '../../types/catering';
import {
  Search,
  PlusCircle,
  Sparkles,
  Edit,
  Copy,
  Trash2,
  Utensils,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { DietaryBadge } from '../common/Badge';
import { formatCurrency } from '../../services/calculationEngine';
import { FoodItemFormModal } from './FoodItemFormModal';
import { MenuTemplatesModal } from './MenuTemplatesModal';

interface MenuBuilderViewProps {
  foodItems: FoodItem[];
  categories: FoodCategory[];
  ingredientsList: Ingredient[];
  templates: MenuTemplate[];
  settings: CompanySettings;
  onSaveFoodItem: (item: Partial<FoodItem>) => void;
  onDuplicateFoodItem: (item: FoodItem) => void;
  onDeleteFoodItem: (itemId: string) => void;
  onApplyTemplateToEstimator: (template: MenuTemplate) => void;
}

export const MenuBuilderView: React.FC<MenuBuilderViewProps> = ({
  foodItems,
  categories,
  ingredientsList,
  templates,
  settings,
  onSaveFoodItem,
  onDuplicateFoodItem,
  onDeleteFoodItem,
  onApplyTemplateToEstimator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesDiet = dietaryFilter === 'all' || item.dietaryType === dietaryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesDiet && matchesSearch;
  });

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Menu Builder & Dish Master</h2>
          <p className="text-xs text-slate-500">
            Curate items across 17 catering categories with granular ingredient yields and selling prices
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-slate-300"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Menu Templates</span>
          </button>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Menu Dish</span>
          </button>
        </div>
      </div>

      {/* 17 Category Tabs Pill Slider */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Categories ({foodItems.length})
          </button>
          {categories.map(cat => {
            const count = foodItems.filter(f => f.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Dietary Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dishes by name, cuisine, ingredients..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Dietary Filter Pills */}
        <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto">
          {['all', 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'].map(diet => (
            <button
              key={diet}
              onClick={() => setDietaryFilter(diet)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
                dietaryFilter === diet
                  ? 'bg-brand-50 text-brand-800 border-brand-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {diet === 'all' ? 'All Diets' : diet}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredItems.map(item => {
          const margin = item.sellingPricePerServing > 0
            ? Math.round(((item.sellingPricePerServing - item.costPerPortion) / item.sellingPricePerServing) * 100)
            : 0;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {item.categoryName} • {item.cuisine}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-800 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <DietaryBadge type={item.dietaryType} />
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description || 'Artisanal catering dish prepared with premium spices and authentic techniques.'}
                </p>

                {/* Portions, Waste, Allergens */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-1">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                    Serving: {item.servingSizePerPerson} {item.servingUnit}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                    Wastage: {item.foodWastagePct}%
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                    Yield: {item.recipeYieldPortions} portions
                  </span>
                </div>

                {/* Allergens tags */}
                {item.allergenInfo && item.allergenInfo.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                    <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Allergens: {item.allergenInfo.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Financial Bottom Bar */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Recipe Cost
                  </span>
                  <div className="text-xs font-bold text-slate-800">
                    {formatCurrency(item.costPerPortion, settings.currencySymbol)} <span className="text-[10px] font-normal text-slate-400">/ portion</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Selling Price
                  </span>
                  <div className="text-sm font-extrabold text-brand-700">
                    {formatCurrency(item.sellingPricePerServing, settings.currencySymbol)}
                    <span className="text-[10px] text-emerald-600 font-bold ml-1.5">
                      ({margin}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Recipe</span>
                </button>

                <button
                  onClick={() => onDuplicateFoodItem(item)}
                  className="p-1.5 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Duplicate Dish"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Delete "${item.name}" from library?`)) {
                      onDeleteFoodItem(item.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Dish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Food Items Match Filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or add a new recipe to this category.
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Dish
          </button>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      <FoodItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={onSaveFoodItem}
        categories={categories}
        ingredientsList={ingredientsList}
        initialItem={editingItem}
      />

      {/* Menu Templates Modal */}
      <MenuTemplatesModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={templates}
        foodItems={foodItems}
        onApplyTemplate={onApplyTemplateToEstimator}
      />
    </div>
  );
};
