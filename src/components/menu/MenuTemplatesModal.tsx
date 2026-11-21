import React from 'react';
import { MenuTemplate, FoodItem, EventRecord } from '../../types/catering';
import { Modal } from '../common/Modal';
import { Sparkles, Utensils, CheckCircle } from 'lucide-react';
import { createEventMenuItem, formatCurrency } from '../../services/calculationEngine';

interface MenuTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: MenuTemplate[];
  foodItems: FoodItem[];
  currentEvent?: EventRecord | null;
  onApplyTemplate: (template: MenuTemplate) => void;
}

export const MenuTemplatesModal: React.FC<MenuTemplatesModalProps> = ({
  isOpen,
  onClose,
  templates,
  foodItems,
  currentEvent,
  onApplyTemplate
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Curated Event Menu Templates"
      subtitle="Select proven, high-profit menu configurations tailored for specific event formats"
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {templates.map(tpl => {
          const matchedDishes = tpl.itemIds
            .map(id => foodItems.find(f => f.id === id))
            .filter(Boolean) as FoodItem[];

          return (
            <div
              key={tpl.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                      {tpl.eventType}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{tpl.name}</h4>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    Est. ₹{tpl.estimatedCostPerGuest} <span className="text-xs font-normal text-slate-500">/ guest</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Dishes preview */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-brand-700" />
                    Included Dishes ({matchedDishes.length} Items):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedDishes.map(d => (
                      <span
                        key={d.id}
                        className="text-xs bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded shadow-2xs"
                      >
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Recommended: {tpl.recommendedGuestsMin} – {tpl.recommendedGuestsMax} Pax
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onApplyTemplate(tpl);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl shadow transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Apply This Template</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
