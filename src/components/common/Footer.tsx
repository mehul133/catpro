import React from 'react';
import { Sprout, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100/80 py-10 mt-auto border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-300">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">CropCare Management System</p>
              <p className="text-xs text-emerald-300/70">Connecting Farmers, Field Officers & Agricultural Specialists</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400/80">
            <span>Built with precision for modern agriculture</span>
            <span className="inline-block w-1 h-1 rounded-full bg-emerald-600"></span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400" /> for farmers
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-emerald-900/60 text-center text-xs text-emerald-400/60">
          &copy; {new Date().getFullYear()} CropCare. Initial Phase Setup Completed.
        </div>
      </div>
    </footer>
  );
};
