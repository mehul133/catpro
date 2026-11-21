import React, { useState, useEffect } from 'react';
import {
  EventRecord,
  EventCategory,
  ServiceStyle,
  EventStatus
} from '../../types/catering';
import { Modal } from '../common/Modal';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Partial<EventRecord>) => void;
  initialEvent?: EventRecord | null;
}

const EVENT_CATEGORIES: EventCategory[] = [
  'Wedding',
  'Engagement',
  'Reception',
  'Birthday',
  'Corporate event',
  'Conference',
  'Outdoor catering',
  'Private party',
  'Festival',
  'Institutional catering'
];

const SERVICE_STYLES: ServiceStyle[] = [
  'Buffet',
  'Plated service',
  'Live counters',
  'Cocktail service',
  'Packed meals',
  'Food stations'
];

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEvent
}) => {
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [category, setCategory] = useState<EventCategory>('Wedding');
  const [guestCount, setGuestCount] = useState<number>(300);
  const [adultsCount, setAdultsCount] = useState<number>(270);
  const [childrenCount, setChildrenCount] = useState<number>(30);
  const [durationHours, setDurationHours] = useState<number>(5);
  const [serviceStyle, setServiceStyle] = useState<ServiceStyle>('Buffet');
  const [foodCounters, setFoodCounters] = useState<number>(4);
  const [specialDietaryRequirements, setSpecialDietaryRequirements] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [status, setStatus] = useState<EventStatus>('Inquiry');

  useEffect(() => {
    if (initialEvent) {
      setName(initialEvent.name);
      setClientName(initialEvent.clientName);
      setClientPhone(initialEvent.clientPhone);
      setClientEmail(initialEvent.clientEmail);
      setEventDate(initialEvent.eventDate);
      setEventLocation(initialEvent.eventLocation);
      setCategory(initialEvent.category);
      setGuestCount(initialEvent.guestCount);
      setAdultsCount(initialEvent.adultsCount);
      setChildrenCount(initialEvent.childrenCount);
      setDurationHours(initialEvent.eventDurationHours);
      setServiceStyle(initialEvent.serviceStyle);
      setFoodCounters(initialEvent.foodCounters);
      setSpecialDietaryRequirements(initialEvent.specialDietaryRequirements);
      setEventNotes(initialEvent.eventNotes);
      setStatus(initialEvent.status);
    } else {
      setName('');
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setEventDate(new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]);
      setEventLocation('');
      setCategory('Wedding');
      setGuestCount(250);
      setAdultsCount(230);
      setChildrenCount(20);
      setDurationHours(5);
      setServiceStyle('Buffet');
      setFoodCounters(4);
      setSpecialDietaryRequirements('');
      setEventNotes('');
      setStatus('Inquiry');
    }
  }, [initialEvent, isOpen]);

  const handleTotalGuestsChange = (total: number) => {
    const val = Math.max(1, total);
    setGuestCount(val);
    const adults = Math.round(val * 0.9);
    setAdultsCount(adults);
    setChildrenCount(val - adults);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientName.trim()) {
      alert('Please provide Event Name and Client Name');
      return;
    }

    onSave({
      id: initialEvent?.id,
      name,
      clientName,
      clientPhone,
      clientEmail,
      eventDate,
      eventLocation,
      category,
      guestCount,
      adultsCount,
      childrenCount,
      eventDurationHours: durationHours,
      serviceStyle,
      foodCounters,
      specialDietaryRequirements,
      eventNotes,
      status
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialEvent ? 'Edit Catering Event' : 'Create New Catering Event'}
      subtitle="Configure event particulars, guest counts, service styling and logistics"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Event & Client Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sharma Grand Wedding Reception"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Category *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as EventCategory)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {EVENT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Client Details Group */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Client Contact Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                placeholder="Mr. Rajesh Sharma"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="client@gmail.com"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Date, Location, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Date *
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Location / Venue *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grand Ballroom, Taj West End, Bengaluru"
              value={eventLocation}
              onChange={e => setEventLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Guest Counts breakdown */}
        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Guest Attendance & Breakdown
            </h4>
            <span className="text-xs font-bold text-brand-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
              Total: {guestCount} Guests
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Guaranteed Pax *
              </label>
              <input
                type="number"
                min="1"
                required
                value={guestCount}
                onChange={e => handleTotalGuestsChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adults
              </label>
              <input
                type="number"
                min="0"
                value={adultsCount}
                onChange={e => setAdultsCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Children
              </label>
              <input
                type="number"
                min="0"
                value={childrenCount}
                onChange={e => setChildrenCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Service Styling & Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Style *
            </label>
            <select
              value={serviceStyle}
              onChange={e => setServiceStyle(e.target.value as ServiceStyle)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {SERVICE_STYLES.map(style => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Number of Food Counters
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={foodCounters}
              onChange={e => setFoodCounters(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Duration (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={durationHours}
              onChange={e => setDurationHours(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Dietary & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Special Dietary Requirements
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 20 Jain guests (no onion/garlic), 5 Gluten-free guests"
              value={specialDietaryRequirements}
              onChange={e => setSpecialDietaryRequirements(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Operational Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Setup starts at 2 PM, VIP welcome drink on arrival"
              value={eventNotes}
              onChange={e => setEventNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Event Status
          </label>
          <div className="flex flex-wrap gap-2">
            {(['Inquiry', 'Quotation Sent', 'Confirmed', 'In Preparation', 'Completed', 'Cancelled'] as EventStatus[]).map(s => (
              <button
                type="button"
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  status === s
                    ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-sm font-semibold shadow transition-colors"
          >
            {initialEvent ? 'Update Event Details' : 'Save & Build Menu'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
