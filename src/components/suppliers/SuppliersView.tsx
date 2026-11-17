import React, { useState } from 'react';
import { Supplier, CompanySettings } from '../../types/catering';
import { Truck, PlusCircle, Phone, Mail, MapPin, Star, Building2, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';

interface SuppliersViewProps {
  suppliers: Supplier[];
  settings: CompanySettings;
  onAddSupplier: (supplier: Supplier) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  settings,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [categoriesString, setCategoriesString] = useState('Dairy, Produce');
  const [paymentTerms, setPaymentTerms] = useState('Net 15 days');
  const [rating, setRating] = useState<number>(4.8);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      categories: categoriesString.split(',').map(s => s.trim()).filter(Boolean),
      paymentTerms,
      rating
    };

    onAddSupplier(newSup);
    setIsModalOpen(false);
    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Supplier Directory & Vendors</h2>
          <p className="text-xs text-slate-500">
            Manage raw ingredient purveyors, wholesale farm vendors and specialized rental contractors
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {suppliers.map(sup => (
          <div
            key={sup.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{sup.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Attn: {sup.contactPerson}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {sup.rating}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`tel:${sup.phone}`} className="hover:text-brand-700 font-medium">{sup.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${sup.email}`} className="hover:text-brand-700 truncate">{sup.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{sup.address}</span>
                </div>
              </div>

              {/* Categories Supplied */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Supplied Categories:
                </span>
                <div className="flex flex-wrap gap-1">
                  {sup.categories.map((c, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Terms: <strong className="text-slate-800">{sup.paymentTerms}</strong></span>
              <button
                onClick={() => {
                  if (confirm(`Remove supplier "${sup.name}"?`)) {
                    onDeleteSupplier(sup.id);
                  }
                }}
                className="text-slate-400 hover:text-rose-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Vendor / Supplier"
        subtitle="Register vendor contacts and agreed settlement terms"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSupplier} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Supplier Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Metro Foodservice Wholesale"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="Ramesh Kumar"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98450 11223"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="orders@vendor.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Terms</label>
              <input
                type="text"
                placeholder="Net 15 days"
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Categories Supplied (Comma-separated)</label>
            <input
              type="text"
              placeholder="Produce, Dairy, Spices, Meat"
              value={categoriesString}
              onChange={e => setCategoriesString(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address</label>
            <input
              type="text"
              placeholder="APMC Yard, Yeshwanthpur, Bengaluru"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-semibold"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
