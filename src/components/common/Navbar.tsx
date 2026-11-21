import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, HelpCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-700 bg-clip-text text-transparent">
                CropCare
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs uppercase tracking-wider font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Agri-Advisory
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-emerald-800 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Project Setup Phase</span>
            </div>
            <a
              href="#stakeholders"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Roles & Modules</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
