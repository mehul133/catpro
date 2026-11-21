import React from 'react';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { Sparkles } from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const RoleSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      {/* Main Role Selection Area */}
      <main className="flex-1">
        {/* Banner Hero */}
        <section className="bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>CropCare Phase 2: Role Switcher & Navigation Frame</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Crop Issue Reporting & Advisory System
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
              Empowering farmers with prompt pest diagnostics, enabling agricultural officers to conduct rapid field triage, and providing researchers a platform to issue certified advisories.
            </p>
          </div>
        </section>

        {/* 4 Role Selection Cards */}
        <section className="-mt-6">
          <RoleSwitcher />
        </section>
      </main>

      <Footer />
    </div>
  );
};
