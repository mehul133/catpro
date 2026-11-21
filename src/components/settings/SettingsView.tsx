import React, { useState } from 'react';
import { CompanySettings, CurrencyCode } from '../../types/catering';
import { Settings, Save, RotateCcw, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetData
}) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [newTerm, setNewTerm] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof CompanySettings, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleAddTerm = () => {
    if (!newTerm.trim()) return;
    setFormData(prev => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, newTerm.trim()]
    }));
    setNewTerm('');
  };

  const handleRemoveTerm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      termsAndConditions: prev.termsAndConditions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Company Profile & Estimator Settings
          </h2>
          <p className="text-xs text-slate-500">
            Configure business identity, default taxation rates, operational buffers, and quotation terms
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-1.5 px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings successfully updated across the platform!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Identity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
            1. Company Profile & Quotation Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Tagline / Motto</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => handleChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Official Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Website URL</label>
              <input
                type="text"
                value={formData.website}
                onChange={e => handleChange('website', e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">GSTIN / Tax ID</label>
              <input
                type="text"
                value={formData.taxNumber}
                onChange={e => handleChange('taxNumber', e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Registered Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Financial & Operational Defaults */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
            2. Financial Defaults & Operational Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Currency Code</label>
              <select
                value={formData.currency}
                onChange={e => {
                  const c = e.target.value as CurrencyCode;
                  const sym = c === 'INR' ? '₹' : c === 'USD' ? '$' : c === 'EUR' ? '€' : 'AED';
                  handleChange('currency', c);
                  handleChange('currencySymbol', sym);
                }}
                className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (AED)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Default Tax Rate (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={formData.defaultTaxRate}
                onChange={e => handleChange('defaultTaxRate', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Contingency Buffer (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                value={formData.defaultContingencyRate}
                onChange={e => handleChange('defaultContingencyRate', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Default Wastage (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                value={formData.defaultWastageRate}
                onChange={e => handleChange('defaultWastageRate', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* Quotation Terms & Conditions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
            3. Standard Terms & Conditions for Quotations
          </h3>

          <div className="text-xs space-y-2">
            <label className="block font-bold text-slate-700 uppercase">Default Payment Terms</label>
            <textarea
              rows={2}
              value={formData.defaultPaymentTerms}
              onChange={e => handleChange('defaultPaymentTerms', e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="space-y-2 text-xs pt-2">
            <label className="block font-bold text-slate-700 uppercase">
              General Contract Clauses ({formData.termsAndConditions.length} Clauses)
            </label>

            <div className="space-y-2">
              {formData.termsAndConditions.map((term, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold shrink-0">{idx + 1}.</span>
                  <span className="flex-1 text-slate-700">{term}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add a new quotation clause or condition..."
                value={newTerm}
                onChange={e => setNewTerm(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTerm();
                  }
                }}
                className="flex-1 px-3 py-2 border rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddTerm}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs transition-colors"
              >
                Add Clause
              </button>
            </div>
          </div>
        </div>

        {/* Reset Demo Data Danger Zone */}
        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Reset Application Demo State
            </h4>
            <p className="text-xs text-rose-700 mt-0.5">
              Restores initial 50+ dishes, realistic ingredients, sample wedding events, and quotations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all demo data back to factory defaults? Any new custom entries will be restored to initial seed.')) {
                onResetData();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </form>
    </div>
  );
};
