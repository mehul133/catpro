import React, { useState } from 'react';
import {
  Quotation,
  EventRecord,
  CompanySettings
} from '../../types/catering';
import {
  FileText,
  Search,
  Download,
  Eye,
  Copy,
  CheckCircle,
  Trash2,
  PlusCircle,
  Calendar,
  Share2
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../services/calculationEngine';
import { QuotationPreviewModal } from './QuotationPreviewModal';
import { PdfService } from '../../services/pdfService';

interface QuotationsViewProps {
  quotations: Quotation[];
  events: EventRecord[];
  settings: CompanySettings;
  onSaveQuotation: (quote: Quotation) => void;
  onDeleteQuotation: (id: string) => void;
  onDuplicateQuotation: (quote: Quotation) => void;
  onConvertToConfirmed: (eventId: string) => void;
  onCreateQuoteFromEvent: (eventId: string) => void;
}

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  quotations,
  events,
  settings,
  onSaveQuotation,
  onDeleteQuotation,
  onDuplicateQuotation,
  onConvertToConfirmed,
  onCreateQuoteFromEvent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const filteredQuotes = quotations.filter(q => {
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadPdf = (quote: Quotation) => {
    PdfService.generateQuotationPdf(quote, settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Quotation & Proposal Studio
          </h2>
          <p className="text-xs text-slate-500">
            Section 10: Generate, download and share high-end catering proposals with frozen pricing snapshots
          </p>
        </div>

        <button
          onClick={() => setIsPickerOpen(true)}
          className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quotations by ref, client, or event..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['All', 'Sent', 'Approved', 'Draft', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quotations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredQuotes.map(quote => {
          const p = quote.pricingSnapshot;
          return (
            <div
              key={quote.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {quote.quotationNumber} (v{quote.version})
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
                      {quote.eventName}
                    </h3>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      quote.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : quote.status === 'Sent'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Client:</span>
                    <strong className="text-slate-800">{quote.clientName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Event Date:</span>
                    <span>{quote.eventDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Guest Count:</span>
                    <span className="font-semibold text-slate-800">{quote.guestCount} Pax</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Menu Items:</span>
                    <span>{quote.menuSnapshot.length} Dishes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Valid Until:</span>
                    <span className="text-rose-600 font-semibold">{quote.validUntil}</span>
                  </div>
                </div>
              </div>

              {/* Financial Bottom */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Per Guest Rate
                  </span>
                  <div className="text-xs font-bold text-slate-800">
                    {formatCurrency(p.sellingPricePerGuest, settings.currencySymbol)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Total Quotation
                  </span>
                  <div className="text-base font-extrabold text-brand-800">
                    {formatCurrency(p.sellingPrice, settings.currencySymbol)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                <button
                  onClick={() => setPreviewQuote(quote)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-brand-50 hover:bg-brand-100 text-brand-800 font-semibold rounded-lg border border-brand-200 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-700" />
                  <span>View Proposal</span>
                </button>

                <button
                  onClick={() => handleDownloadPdf(quote)}
                  className="p-1.5 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Download PDF Quotation"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDuplicateQuotation(quote)}
                  className="p-1.5 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Duplicate Quotation as New Version"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {quote.status !== 'Approved' && (
                  <button
                    onClick={() => onConvertToConfirmed(quote.eventId)}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Convert Quotation into Confirmed Booking"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm(`Delete quotation ${quote.quotationNumber}?`)) {
                      onDeleteQuotation(quote.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Quotation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Select Event Modal for New Quotation */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Generate New Quotation from Event
            </h3>
            <p className="text-xs text-slate-500">
              Select which catering event you want to freeze into a formal client quotation.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {events.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => {
                    onCreateQuoteFromEvent(ev.id);
                    setIsPickerOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-slate-900 font-bold block">{ev.name}</strong>
                    <span className="text-slate-500">{ev.clientName} • {ev.guestCount} Guests</span>
                  </div>
                  <span className="font-extrabold text-brand-700">
                    {formatCurrency(ev.pricing.sellingPrice, settings.currencySymbol)}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPickerOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Preview Modal */}
      <QuotationPreviewModal
        isOpen={Boolean(previewQuote)}
        onClose={() => setPreviewQuote(null)}
        quotation={previewQuote}
        settings={settings}
        onConvertToConfirmed={onConvertToConfirmed}
      />
    </div>
  );
};
