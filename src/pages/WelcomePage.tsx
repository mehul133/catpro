import React from 'react';
import {
  Sprout,
  ShieldAlert,
  Microscope,
  Settings,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative background blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs sm:text-sm font-medium shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Phase 1 Initial Setup Successfully Verified</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Welcome to <span className="text-emerald-400 underline decoration-emerald-500/40 decoration-wavy">CropCare</span>
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed">
            A collaborative <strong className="text-white font-semibold">Crop Issue Reporting & Advisory Case Management System</strong> uniting 
            Farmers, Agriculture Officers, Agricultural Experts, and Administrators to protect crops and boost yields.
          </p>

          {/* Quick status pill list */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-800/50 border border-emerald-700/40 text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Vite + React (TypeScript)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-800/50 border border-emerald-700/40 text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tailwind CSS Configured
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-800/50 border border-emerald-700/40 text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> React Router Ready
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-800/50 border border-emerald-700/40 text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Lucide Icons Integrated
            </span>
          </div>
        </div>
      </section>

      {/* Stakeholders & Core Capabilities */}
      <section id="stakeholders" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-emerald-950/5 border border-emerald-100 p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-xs uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-3">
              <Layers className="w-3.5 h-3.5" /> Stakeholder Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Designed for the Whole Agricultural Ecosystem
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Every participant plays an essential role in early detection, prompt triage, scientific diagnosis, and advisory delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Farmer Card */}
            <div className="rounded-xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 to-white p-6 hover:shadow-md hover:border-emerald-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">1. Farmers</h3>
              <p className="text-xs font-medium text-emerald-700 mb-3 uppercase tracking-wide">Report & Track</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Easily log crop issues, upload pest/disease photographs, specify affected acreages, and receive expert treatment advisories directly.
              </p>
            </div>

            {/* Field Officer Card */}
            <div className="rounded-xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 to-white p-6 hover:shadow-md hover:border-emerald-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">2. Agri Officers</h3>
              <p className="text-xs font-medium text-teal-700 mb-3 uppercase tracking-wide">Triage & Field Visits</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Review submitted crop cases in their jurisdiction, schedule field verifications, filter duplicates, and escalate complex symptoms.
              </p>
            </div>

            {/* Expert Card */}
            <div className="rounded-xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 to-white p-6 hover:shadow-md hover:border-emerald-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-green-700 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">3. Agri Experts</h3>
              <p className="text-xs font-medium text-green-700 mb-3 uppercase tracking-wide">Diagnose & Advise</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Analyze symptoms and lab test findings to issue formal agricultural advisories, pest control plans, and preventive care regimens.
              </p>
            </div>

            {/* Admin Card */}
            <div className="rounded-xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 to-white p-6 hover:shadow-md hover:border-emerald-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">4. Administrators</h3>
              <p className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wide">Governance & Metrics</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Oversee system users, manage regional zones, track resolution turnaround times, and analyze crop health trends across territories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps & Ready Checklist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-emerald-800 to-green-900 rounded-2xl text-white p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              <FileCheck2 className="w-4 h-4" /> Initial Milestone Complete
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Baseline Ready for Feature Development
            </h3>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              The project structure, theme, routing, and dependencies are now in place. We are ready to proceed with the next step whenever you approve!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-xl shadow-md transition-all text-sm">
              <span>Ready for Your Approval</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
