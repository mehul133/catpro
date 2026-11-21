import React, { useState } from 'react';
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Utensils,
  PlusCircle,
  Copy,
  Trash2,
  Edit,
  Calculator,
  ClipboardList,
  FileText
} from 'lucide-react';
import { EventRecord, EventCategory, EventStatus, CompanySettings } from '../../types/catering';
import { EventStatusBadge } from '../common/Badge';
import { formatCurrency } from '../../services/calculationEngine';

interface EventsListViewProps {
  events: EventRecord[];
  settings: CompanySettings;
  onOpenCreateModal: () => void;
  onEditEvent: (event: EventRecord) => void;
  onDuplicateEvent: (event: EventRecord) => void;
  onDeleteEvent: (eventId: string) => void;
  onOpenEstimator: (eventId: string) => void;
  onOpenProductionSheet: (eventId: string) => void;
  onOpenQuotation: (eventId: string) => void;
}

export const EventsListView: React.FC<EventsListViewProps> = ({
  events,
  settings,
  onOpenCreateModal,
  onEditEvent,
  onDuplicateEvent,
  onDeleteEvent,
  onOpenEstimator,
  onOpenProductionSheet,
  onOpenQuotation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredEvents = events.filter(e => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.eventLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Event Management</h2>
          <p className="text-xs text-slate-500">
            Create, estimate and manage high-volume catering bookings and client proposals
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-brand-900/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Catering Event</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by event, client name, or venue..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Categories</option>
            <option value="Wedding">Wedding</option>
            <option value="Engagement">Engagement</option>
            <option value="Reception">Reception</option>
            <option value="Birthday">Birthday</option>
            <option value="Corporate event">Corporate event</option>
            <option value="Conference">Conference</option>
            <option value="Outdoor catering">Outdoor catering</option>
            <option value="Private party">Private party</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Statuses</option>
            <option value="Inquiry">Inquiry</option>
            <option value="Quotation Sent">Quotation Sent</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Preparation">In Preparation</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredEvents.map(event => {
          const sellingTotal = event.pricing?.sellingPrice || 0;
          const grossProfit = event.pricing?.grossProfit || 0;
          const margin = event.pricing?.profitMarginPct || 0;
          const menuCount = event.menu?.length || 0;

          return (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Top */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {event.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-800 transition-colors line-clamp-1">
                      {event.name}
                    </h3>
                  </div>
                  <EventStatusBadge status={event.status} />
                </div>

                {/* Event Metadata Grid */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">Client:</span>
                    <span className="text-slate-600 truncate">{event.clientName}</span>
                    {event.clientPhone && (
                      <span className="text-slate-400">({event.clientPhone})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{event.eventDate} ({event.eventDurationHours} hrs)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.eventLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800">{event.guestCount} Guests</span>
                    <span className="text-slate-400">({event.adultsCount} Adults, {event.childrenCount} Kids)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{event.serviceStyle} • {event.foodCounters} Counters • {menuCount} Dishes</span>
                  </div>
                </div>

                {/* Dietary Alert tag */}
                {event.specialDietaryRequirements && (
                  <div className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 p-2 rounded-lg leading-snug">
                    <strong className="font-semibold">Dietary: </strong>
                    {event.specialDietaryRequirements}
                  </div>
                )}
              </div>

              {/* Card Financial Bar */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Total Proposal
                  </span>
                  <div className="text-sm font-extrabold text-slate-900">
                    {formatCurrency(sellingTotal, settings.currencySymbol)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Gross Profit
                  </span>
                  <div className="text-sm font-bold text-emerald-600">
                    {formatCurrency(grossProfit, settings.currencySymbol)}
                    <span className="text-[10px] text-emerald-700 ml-1">({margin.toFixed(0)}%)</span>
                  </div>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                <button
                  onClick={() => onOpenEstimator(event.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-brand-50 hover:bg-brand-100 text-brand-800 font-semibold rounded-lg border border-brand-200 transition-colors"
                  title="Configure food quantities, costs & profit"
                >
                  <Calculator className="w-3.5 h-3.5 text-brand-700" />
                  <span>Cost Estimator</span>
                </button>

                <button
                  onClick={() => onOpenQuotation(event.id)}
                  className="p-1.5 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="View / Download PDF Quotation"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenProductionSheet(event.id)}
                  className="p-1.5 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Kitchen Production Sheet"
                >
                  <ClipboardList className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEditEvent(event)}
                  className="p-1.5 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Event Particulars"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDuplicateEvent(event)}
                  className="p-1.5 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Duplicate Event"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete event "${event.name}"?`)) {
                      onDeleteEvent(event.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Catering Events Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new catering event to get started.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create Event
          </button>
        </div>
      )}
    </div>
  );
};
