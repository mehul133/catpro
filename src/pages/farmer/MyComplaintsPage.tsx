import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import {
  FileText,
  Search,
  Plus,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  Sprout
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { ComplaintDetailModal } from '../../components/farmer/ComplaintDetailModal';
import { complaintService } from '../../services/complaintService';
import type { Complaint } from '../../types';

export const MyComplaintsPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialFilter = location.pathname.includes('track-advisory')
    ? 'advisory'
    : searchParams.get('tab') || 'all';

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>(initialFilter);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Load complaints from localStorage
  const loadComplaints = () => {
    const list = complaintService.getComplaints();
    setComplaints(list);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // Sync with URL query parameter (e.g. from Track Advisory shortcut)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['all', 'active', 'advisory', 'resolved'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Delete complaint
  const handleDelete = (id: string, trackingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove complaint ticket ${trackingId}?`)) {
      complaintService.deleteComplaint(id);
      loadComplaints();
    }
  };

  // Reset to demo data
  const handleResetDemoData = () => {
    if (window.confirm('Reset complaints to original demo cases? Any custom reports you created will be removed.')) {
      complaintService.resetToDemoData();
      loadComplaints();
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    // Tab filter
    if (activeTab === 'active' && !['submitted', 'under_review', 'investigating'].includes(c.status)) {
      return false;
    }
    if (activeTab === 'advisory' && c.status !== 'advisory_issued') {
      return false;
    }
    if (activeTab === 'resolved' && c.status !== 'resolved') {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTracking = c.trackingId.toLowerCase().includes(q);
      const matchCrop = c.crop.toLowerCase().includes(q) || c.variety.toLowerCase().includes(q);
      const matchIssue = c.issueType.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchSymptoms = c.symptoms.some((s) => s.toLowerCase().includes(q));
      return matchTracking || matchCrop || matchIssue || matchDesc || matchSymptoms;
    }

    return true;
  });

  // Calculate statistics
  const totalCount = complaints.length;
  const activeCount = complaints.filter((c) =>
    ['submitted', 'under_review', 'investigating'].includes(c.status)
  ).length;
  const advisoryCount = complaints.filter((c) => c.status === 'advisory_issued').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
  const userSubmittedCount = complaints.filter((c) => !c.isDemo).length;

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'advisory_issued':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Advisory Issued</span>
          </span>
        );
      case 'investigating':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Field Inspection</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Officer Review</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-teal-100 text-teal-800 border border-teal-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Case Resolved</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Submitted</span>
          </span>
        );
    }
  };

  const getSeverityBadge = (sev: Complaint['severity']) => {
    switch (sev) {
      case 'critical':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-100 text-rose-800 uppercase">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-100 text-orange-800 uppercase">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 uppercase">Medium</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 uppercase">Low</span>;
    }
  };

  return (
    <PageContainer
      title="My Complaints & Track Advisory"
      subtitle="Track your reported crop issues, field inspection timelines, and expert chemical prescriptions."
      badge="Kisan Case Management"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors cursor-pointer"
            title="Reset to default demo data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo Cases</span>
          </button>

          <Link
            to="/farmer/report-issue"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report New Issue</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Cases */}
          <div
            onClick={() => setActiveTab('all')}
            className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
              activeTab === 'all'
                ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                : 'border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Complaints
              </span>
              <FileText className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{totalCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {userSubmittedCount} submitted by you
            </p>
          </div>

          {/* Active Review / Inspection */}
          <div
            onClick={() => setActiveTab('active')}
            className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
              activeTab === 'active'
                ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Under Investigation
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-800 mt-2">{activeCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Pending officer triage</p>
          </div>

          {/* Advisories Issued */}
          <div
            onClick={() => setActiveTab('advisory')}
            className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
              activeTab === 'advisory'
                ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                : 'border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Advisory Issued
              </span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-800 mt-2">{advisoryCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Ready for spray action</p>
          </div>

          {/* Resolved */}
          <div
            onClick={() => setActiveTab('resolved')}
            className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
              activeTab === 'resolved'
                ? 'border-teal-600 shadow-md ring-2 ring-teal-600/20'
                : 'border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Cases Resolved
              </span>
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-black text-teal-800 mt-2">{resolvedCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Crop recovery confirmed</p>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Cases', count: totalCount },
              { id: 'active', label: 'In-Progress', count: activeCount },
              { id: 'advisory', label: 'Advisories Issued', count: advisoryCount },
              { id: 'resolved', label: 'Resolved', count: resolvedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, crop, or pest..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Complaints List / Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredComplaints.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Complaints Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No tickets match your filter or search criteria. Try modifying your query or report a new crop issue.
              </p>
              <div className="pt-2">
                <Link
                  to="/farmer/report-issue"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Report Crop Issue Now</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Tracking ID & Source</th>
                    <th className="p-4">Crop & Variety</th>
                    <th className="p-4">Problem Category</th>
                    <th className="p-4">Assessed Severity</th>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedComplaint(item)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Tracking ID */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 text-xs group-hover:text-emerald-800 transition-colors">
                            {item.trackingId}
                          </span>
                          {!item.isDemo ? (
                            <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-emerald-600 text-white">
                              New
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-100 text-slate-500">
                              Demo
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-[140px] mt-0.5">
                          {item.farmParcelName}
                        </p>
                      </td>

                      {/* Crop */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <Sprout className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{item.crop}</p>
                            <p className="text-[11px] text-slate-500">{item.variety}</p>
                          </div>
                        </div>
                      </td>

                      {/* Issue */}
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 capitalize">
                          {item.issueType.replace('_', ' ')}
                        </span>
                        <p className="text-[11px] text-slate-500 truncate max-w-[160px] mt-0.5">
                          {item.symptoms[0] || item.description}
                        </p>
                      </td>

                      {/* Severity */}
                      <td className="p-4">
                        {getSeverityBadge(item.severity)}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-600 text-[11px]">
                        {new Date(item.submissionDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComplaint(item);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          {!item.isDemo && (
                            <button
                              type="button"
                              onClick={(e) => handleDelete(item.id, item.trackingId, e)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete complaint"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Detail & Advisory Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </PageContainer>
  );
};
