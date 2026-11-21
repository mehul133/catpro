import React from 'react';
import { Quotation, CompanySettings } from '../../types/catering';
import { Modal } from '../common/Modal';
import { Download, Printer, CheckCircle, Share2, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../services/calculationEngine';
import { PdfService } from '../../services/pdfService';

interface QuotationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation: Quotation | null;
  settings: CompanySettings;
  onConvertToConfirmed?: (eventId: string) => void;
}

export const QuotationPreviewModal: React.FC<QuotationPreviewModalProps> = ({
  isOpen,
  onClose,
  quotation,
  settings,
  onConvertToConfirmed
}) => {
  if (!quotation) return null;

  const p = quotation.pricingSnapshot;

  const handleDownloadPdf = () => {
    PdfService.generateQuotationPdf(quotation, settings);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${quotation.clientName}! Here is the catering proposal for "${quotation.eventName}" on ${quotation.eventDate} for ${quotation.guestCount} guests.\nTotal Estimate: ${formatCurrency(p.sellingPrice, settings.currencySymbol)} (${formatCurrency(p.sellingPricePerGuest, settings.currencySymbol)} / pax).\nValid until: ${quotation.validUntil}.\nRegards, ${settings.name}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Quotation Preview • ${quotation.quotationNumber}`}
      subtitle={`Proposal for ${quotation.eventName} (${quotation.guestCount} Pax)`}
      maxWidth="5xl"
    >
      <div className="space-y-6">
        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Status:</span>
            <span className="bg-brand-100 text-brand-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-brand-300">
              {quotation.status} (v{quotation.version})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Share</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-semibold shadow transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            {onConvertToConfirmed && quotation.status !== 'Approved' && (
              <button
                onClick={() => {
                  onConvertToConfirmed(quotation.eventId);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow transition-colors ml-1"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Confirm Event Booking</span>
              </button>
            )}
          </div>
        </div>

        {/* Printable Document Sheet Preview */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-xl p-8 sm:p-12 space-y-8 font-sans max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center font-bold text-lg">
                  C
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {settings.name}
                </h1>
              </div>
              <p className="text-xs text-brand-700 font-semibold uppercase tracking-wider">
                {settings.tagline}
              </p>
              <p className="text-xs text-slate-500 max-w-md pt-1">
                {settings.address} • Phone: {settings.phone} • Email: {settings.email} • GSTIN: {settings.taxNumber}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 shrink-0">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                OFFICIAL QUOTATION
              </span>
              <div className="text-lg font-mono font-black text-slate-900">
                {quotation.quotationNumber}
              </div>
              <div className="text-xs text-slate-500">
                Date: {new Date(quotation.createdAt).toLocaleDateString()}
              </div>
              <div className="text-xs font-semibold text-rose-600">
                Valid Until: {quotation.validUntil}
              </div>
            </div>
          </div>

          {/* Client & Event Info Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 text-xs">
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Client Particulars
              </h4>
              <div className="text-sm font-bold text-slate-900">{quotation.clientName}</div>
              <div className="text-slate-600">Contact: {quotation.clientPhone}</div>
              <div className="text-slate-600">Email: {quotation.clientEmail}</div>
            </div>

            <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-6">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Event Particulars
              </h4>
              <div className="text-sm font-bold text-slate-900">{quotation.eventName}</div>
              <div className="text-slate-600">Date: {quotation.eventDate}</div>
              <div className="text-slate-600">Service: {quotation.serviceStyle}</div>
              <div className="text-slate-900 font-bold">
                Guaranteed Guest Attendance: {quotation.guestCount} Pax
              </div>
            </div>
          </div>

          {/* Curated Menu Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Curated Banquet Menu & Descriptions
              </h3>
              <span className="text-xs text-slate-500">
                {quotation.menuSnapshot.length} Selected Specialties
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {quotation.menuSnapshot.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-start justify-between gap-4 hover:bg-slate-50/50">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                        {item.categoryName}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.cuisine}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] max-w-xl">
                      Standard serving: {item.servingSize} {item.servingUnit} per person • Expected consumption: {Math.round(item.consumptionRate * 100)}%
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-slate-900 text-xs">
                      {formatCurrency(item.sellingPrice, settings.currencySymbol)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/ portion</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commercial & Financial Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              Financial Estimate & Commercial Charges
            </h3>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Food Menu Subtotal:</span>
                <span className="font-semibold">{formatCurrency(p.subtotalFoodCost, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Operations, Chefs & Manpower Services:</span>
                <span className="font-semibold">{formatCurrency(p.subtotalOperationalCost, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Base Service Charges:</span>
                <span className="font-semibold">{formatCurrency(p.subtotalCost, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Contingency Buffer ({p.contingencyPct}%):</span>
                <span className="font-semibold">+{formatCurrency(p.contingencyAmount, settings.currencySymbol)}</span>
              </div>
              {p.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Special Promotion Discount:</span>
                  <span className="font-bold">-{formatCurrency(p.discountAmount, settings.currencySymbol)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Applicable Taxes & GST ({p.taxRatePct}%):</span>
                <span className="font-semibold">+{formatCurrency(p.taxAmount, settings.currencySymbol)}</span>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-center text-slate-900">
                <div>
                  <span className="text-sm font-black uppercase tracking-wider">
                    Total Quotation Amount
                  </span>
                  <p className="text-[11px] text-slate-500">All inclusive catering fee</p>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black text-brand-800">
                    {formatCurrency(p.sellingPrice, settings.currencySymbol)}
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {formatCurrency(p.sellingPricePerGuest, settings.currencySymbol)} / guest
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms & Terms & Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-1.5">
              <h4 className="font-bold uppercase tracking-wider text-slate-700">
                Payment Schedule & Terms
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {quotation.paymentTerms || settings.defaultPaymentTerms}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold uppercase tracking-wider text-slate-700">
                Terms & Conditions
              </h4>
              <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-1">
                {(quotation.termsAndConditions || settings.termsAndConditions).slice(0, 4).map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signature Block */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-6">
              <p className="text-slate-500">Accepted and Agreed by Client:</p>
              <div className="border-b border-slate-400 w-48"></div>
              <div>
                <div className="font-bold text-slate-900">{quotation.clientName}</div>
                <div className="text-slate-400 text-[10px]">Date: ____________________</div>
              </div>
            </div>

            <div className="space-y-6 text-right">
              <p className="text-slate-500">For {settings.name}:</p>
              <div className="border-b border-slate-400 w-48 ml-auto"></div>
              <div>
                <div className="font-bold text-slate-900">{quotation.authorizedSignatory}</div>
                <div className="text-slate-400 text-[10px]">Director of Catering Operations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
