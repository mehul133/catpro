import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Microscope,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useRole, ROLE_CONFIGS } from '../../context/RoleContext';
import type { UserRole } from '../../types';

export const RoleSwitcher: React.FC = () => {
  const { selectRole } = useRole();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    selectRole(role);
    navigate(ROLE_CONFIGS[role].defaultPath);
  };

  const roleCardData = [
    {
      role: 'farmer' as UserRole,
      title: 'Farmer Portal',
      subtitle: 'Kisan Seva & Advisory',
      description: 'Report crop issues with photos, track complaints, view field inspection updates, and receive expert treatment advisories.',
      icon: Sprout,
      badge: 'Producers & Cultivators',
      iconBg: 'bg-emerald-700 text-white',
      borderHover: 'hover:border-emerald-500 hover:shadow-emerald-900/10',
      buttonBg: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      features: [
        'Photo-based issue reporting',
        'Field-parcel geotagging',
        'Direct treatment advisories',
        'SMS & push notifications',
      ],
    },
    {
      role: 'officer' as UserRole,
      title: 'Agriculture Officer Portal',
      subtitle: 'Field Inspection & Triage',
      description: 'Review local complaints, schedule on-site farm verifications, triage severity, and escalate cases to research scientists.',
      icon: ShieldCheck,
      badge: 'Extension & Verification',
      iconBg: 'bg-teal-700 text-white',
      borderHover: 'hover:border-teal-500 hover:shadow-teal-900/10',
      buttonBg: 'bg-teal-700 hover:bg-teal-800 text-white',
      features: [
        'Jurisdiction case queues',
        'On-site field verification',
        'Preliminary severity triage',
        'Expert advisory forwarding',
      ],
    },
    {
      role: 'expert' as UserRole,
      title: 'Agricultural Expert Portal',
      subtitle: 'Diagnostic & Research Lab',
      description: 'Analyze escalated symptoms, review AI diagnosis models, formulate disease prescriptions, and publish treatment protocols.',
      icon: Microscope,
      badge: 'Research & Pathology',
      iconBg: 'bg-green-800 text-white',
      borderHover: 'hover:border-green-600 hover:shadow-green-900/10',
      buttonBg: 'bg-green-800 hover:bg-green-900 text-white',
      features: [
        'Scientific symptom diagnosis',
        'AI vision detection review',
        'Official prescription builder',
        'Epidemiology outbreak trends',
      ],
    },
    {
      role: 'admin' as UserRole,
      title: 'Administrator Portal',
      subtitle: 'Executive Control & Governance',
      description: 'Govern system users, manage crop taxonomies, oversee case SLAs, track regional resolution metrics, and configure workflows.',
      icon: ShieldAlert,
      badge: 'Directorate Governance',
      iconBg: 'bg-slate-800 text-white',
      borderHover: 'hover:border-slate-500 hover:shadow-slate-900/10',
      buttonBg: 'bg-slate-800 hover:bg-slate-900 text-white',
      features: [
        'User & role management',
        'Crop & category masters',
        'Resolution SLA analytics',
        'State-wide case auditing',
      ],
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-emerald-700" />
          <span>Multi-Stakeholder Architecture</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your Stakeholder Portal
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          CropCare delivers tailored workspaces for each participant in the agricultural advisory lifecycle.
          Select any portal below to enter the role-specific navigation frame.
        </p>
      </div>

      {/* Development-Only Disclaimer Banner */}
      <div className="max-w-4xl mx-auto p-4 rounded-xl bg-amber-50 border border-amber-200/80 shadow-2xs flex items-start gap-3 text-amber-900">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm space-y-1">
          <p className="font-bold">Development Demo Mode Active</p>
          <p className="text-amber-800/90 leading-relaxed">
            This role-selection interface is provided exclusively for prototype inspection and testing without credentials. 
            In the production release, role access is strictly governed through departmental Single Sign-On (SSO) and biometric / OTP identity verification.
          </p>
        </div>
      </div>

      {/* 4 Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleCardData.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.role}
              className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between transition-all duration-200 ${card.borderHover} hover:shadow-lg hover:-translate-y-1 group`}
            >
              <div className="space-y-4">
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    {card.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    {card.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {card.description}
                </p>

                {/* Feature highlights */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {card.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enter Portal Button */}
              <div className="pt-6 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSelectRole(card.role)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-150 cursor-pointer ${card.buttonBg}`}
                >
                  <span>Enter Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
