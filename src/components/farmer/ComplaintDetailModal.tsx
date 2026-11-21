import React from 'react';
import {
  X,
  MapPin,
  Tractor,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  FileText,
  Printer,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Tag,
  Layers
} from 'lucide-react';
import type { Complaint } from '../../types';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ complaint, onClose }) => {
  if (!complaint) return null;

  const getSeverityBadge = (severity: Complaint['severity']) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-200">Critical Priority</span>;
      case 'high':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-800 border border-orange-200">High Severity</span>;
      case 'medium':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">Medium Severity</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">Low Observation</span>;
    }
  };

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'advisory_issued':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Advisory Issued</span>;
      case 'investigating':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Field Inspection</span>;
      case 'under_review':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Under Officer Review</span>;
      case 'resolved':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Case Resolved</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Complaint Submitted</span>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-black text-slate-900 tracking-tight">
                  Case File: {complaint.trackingId}
                </span>
                {!complaint.isDemo ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-600 text-white uppercase tracking-wider">
                    New Submission
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-200 text-slate-700 uppercase tracking-wider">
                    Demo Case
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Submitted on {new Date(complaint.submissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Print case dossier"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / Dossier</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Status & Severity Bar */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Current Status:</span>
              {getStatusBadge(complaint.status)}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Assessment:</span>
              {getSeverityBadge(complaint.severity)}
            </div>
          </div>

          {/* Lifecycle Stepper Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Advisory Case Lifecycle Progression</span>
            </h3>

            <div className="relative">
              {/* Stepper list */}
              <div className="space-y-4">
                {complaint.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                        event.completed
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-50'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {event.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={`text-xs font-bold ${event.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                          {event.title}
                        </p>
                        <span className="text-[11px] text-slate-400 font-medium shrink-0">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{event.description}</p>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1 inline-block">
                        Actor: {event.actor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expert Advisory Certificate (If Issued) */}
          {complaint.advisory && (
            <div className="rounded-xl border-2 border-emerald-500/60 bg-gradient-to-br from-emerald-50/70 via-white to-green-50/50 p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-emerald-200/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow">
                    <Stethoscope className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                      Official Agricultural Advisory
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">
                      {complaint.advisory.diagnosis}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {complaint.advisory.advisoryId}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Issued: {new Date(complaint.advisory.issuedAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>

              {/* Causative pathogen */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-700">Pathogen / Causative Agent: </span>
                <span className="italic text-emerald-900 font-semibold">{complaint.advisory.causativeAgent}</span>
              </div>

              {/* Chemical Control Table */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Recommended Treatment Formulation:
                </p>
                <div className="overflow-x-auto rounded-lg border border-emerald-200 bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-emerald-100/70 text-emerald-900 font-semibold border-b border-emerald-200">
                      <tr>
                        <th className="p-2.5">Pesticide / Fungicide</th>
                        <th className="p-2.5">Prescribed Dosage</th>
                        <th className="p-2.5">Application Method</th>
                        <th className="p-2.5">Waiting Period</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100">
                      {complaint.advisory.chemicalControl.map((item, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/40">
                          <td className="p-2.5 font-bold text-slate-900">{item.pesticideName}</td>
                          <td className="p-2.5 text-emerald-800 font-medium">{item.dosage}</td>
                          <td className="p-2.5 text-slate-600">{item.applicationMethod}</td>
                          <td className="p-2.5 text-slate-600">{item.waitingPeriodDays} Days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Organic & Preventive Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-800 mb-1">Organic Alternatives:</p>
                  <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                    {complaint.advisory.organicRemedy.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-800 mb-1">Preventive Measures:</p>
                  <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                    {complaint.advisory.preventiveGuidelines.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Specialist Signature */}
              <div className="flex items-center justify-between pt-2 border-t border-emerald-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>
                    Certified by: <strong>{complaint.advisory.expertName}</strong> ({complaint.advisory.expertDesignation})
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{complaint.advisory.expertInstitute}</span>
              </div>
            </div>
          )}

          {/* Grid: Farm & Crop Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Farmer & Farm Parcel */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Farmer & Location Details</span>
              </h4>
              <div className="text-xs space-y-1 text-slate-700">
                <p><strong>Name:</strong> {complaint.farmerName}</p>
                <p><strong>Kisan ID:</strong> {complaint.kisanId}</p>
                <p><strong>Contact:</strong> {complaint.phone}</p>
                <p><strong>Farm Parcel:</strong> {complaint.farmParcelName} ({complaint.totalLandArea})</p>
                <p className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Village {complaint.village}, {complaint.subDistrict}, {complaint.district}, {complaint.state}</span>
                </p>
              </div>
            </div>

            {/* Crop & Agronomy */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Tractor className="w-3.5 h-3.5 text-emerald-700" />
                <span>Crop & Cultivation Parameters</span>
              </h4>
              <div className="text-xs space-y-1 text-slate-700">
                <p><strong>Crop & Variety:</strong> {complaint.crop} ({complaint.variety})</p>
                <p><strong>Sowing Date:</strong> {complaint.sowingDate}</p>
                <p><strong>Growth Stage:</strong> {complaint.cropStage}</p>
                <p><strong>Irrigation Source:</strong> {complaint.irrigationSource}</p>
                <p><strong>Soil Classification:</strong> {complaint.soilType}</p>
              </div>
            </div>
          </div>

          {/* Issue Symptoms & Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Reported Symptoms & Diagnostics</span>
            </h4>

            <div className="flex flex-wrap gap-1.5">
              {complaint.symptoms.map((symptom, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1"
                >
                  <Tag className="w-3 h-3 text-amber-700" />
                  {symptom}
                </span>
              ))}
            </div>

            <div className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
              <p><strong>Affected Land Area:</strong> {complaint.affectedArea}</p>
              <p><strong>First Observed:</strong> {complaint.firstObservedDate}</p>
              <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong>Cultivator Observation:</strong> {complaint.description}
              </p>
              {complaint.pastTreatments && (
                <p className="text-slate-600">
                  <strong>Prior Treatments Applied:</strong> {complaint.pastTreatments}
                </p>
              )}
            </div>
          </div>

          {/* Attached Crop Photos */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Uploaded Crop Evidence Photos ({complaint.photos.length})
            </h4>

            {complaint.photos.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No photographic evidence attached to this ticket.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {complaint.photos.map((photo) => (
                  <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video sm:aspect-square">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[10px] text-white truncate font-medium">{photo.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Case ID: <span className="font-mono font-bold text-slate-700">{complaint.trackingId}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
