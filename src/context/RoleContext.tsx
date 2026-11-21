import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, User, RoleConfig } from '../types';

export const DEMO_USERS: Record<UserRole, User> = {
  farmer: {
    id: 'usr-fmr-001',
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@kisanmail.in',
    role: 'farmer',
    phone: '+91 98765 43210',
    region: 'Punjab, District Ludhiana (Village Sahnewal)',
    badgeId: 'KISAN-ID: PB-LDH-4089',
    department: 'Kisan Beneficiary Network',
  },
  officer: {
    id: 'usr-off-104',
    name: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@agri.gov.in',
    role: 'officer',
    phone: '+91 94123 78901',
    region: 'Sub-Division Ludhiana East, Block IV',
    badgeId: 'OFFICER-ID: AGRI-OFF-104',
    department: 'Department of Agricultural Extension & Inspection',
  },
  expert: {
    id: 'usr-exp-088',
    name: 'Prof. K. Venkatesh',
    email: 'k.venkatesh@icar.res.in',
    role: 'expert',
    phone: '+91 91234 56789',
    region: 'National Agricultural Research Directorate',
    badgeId: 'SCIENTIST-ID: ICAR-EXP-088',
    department: 'Division of Plant Pathology & Crop Protection',
  },
  admin: {
    id: 'usr-adm-001',
    name: 'Rajesh Verma',
    email: 'admin.cropcare@gov.in',
    role: 'admin',
    phone: '+91 99887 66554',
    region: 'Central Agricultural Information Center',
    badgeId: 'ADMIN-ID: CC-SYS-001',
    department: 'Agricultural Directorate & Information Systems',
  },
};

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  farmer: {
    role: 'farmer',
    title: 'Farmer Portal',
    portalName: 'Kisan Seva & Advisory',
    shortDescription: 'Report crop distress, upload disease photos, and track official treatment advisories.',
    fullDescription: 'Designed for farm owners and agricultural workers to quickly capture crop pestilence, track complaint tickets, and communicate directly with local agricultural officers.',
    badge: 'Farmer / Producer',
    themeColor: 'from-emerald-700 to-green-600',
    defaultPath: '/farmer/dashboard',
    demoUser: DEMO_USERS.farmer,
    iconName: 'Sprout',
  },
  officer: {
    role: 'officer',
    title: 'Agriculture Officer Portal',
    portalName: 'Field Inspection & Triage',
    shortDescription: 'Review local complaints, schedule on-site farm verifications, and triage cases.',
    fullDescription: 'Empowers field agriculture extension officers to monitor incoming village cases, conduct geotagged field inspections, prioritize severe infestations, and escalate to research scientists.',
    badge: 'Field Extension Officer',
    themeColor: 'from-teal-800 to-emerald-700',
    defaultPath: '/officer/dashboard',
    demoUser: DEMO_USERS.officer,
    iconName: 'ShieldCheck',
  },
  expert: {
    role: 'expert',
    title: 'Agricultural Expert Portal',
    portalName: 'Diagnostic & Research Lab',
    shortDescription: 'Analyze escalated symptoms, review lab findings, and prescribe scientific advisories.',
    fullDescription: 'Dedicated to agronomists, entomologists, and plant pathologists to perform symptom analysis, review AI recommendations, and issue binding pest management advisories.',
    badge: 'Agronomist / Scientist',
    themeColor: 'from-green-900 to-emerald-800',
    defaultPath: '/expert/dashboard',
    demoUser: DEMO_USERS.expert,
    iconName: 'Microscope',
  },
  admin: {
    role: 'admin',
    title: 'Administrator Portal',
    portalName: 'Executive Control & Governance',
    shortDescription: 'Govern user roles, manage crop taxonomies, oversee resolution SLAs, and view analytics.',
    fullDescription: 'Provides administrative authorities complete operational control over master data, jurisdictional user provisioning, outbreak alert broadcasts, and performance dashboards.',
    badge: 'System Administrator',
    themeColor: 'from-slate-900 to-emerald-950',
    defaultPath: '/admin/dashboard',
    demoUser: DEMO_USERS.admin,
    iconName: 'ShieldAlert',
  },
};

interface RoleContextType {
  currentRole: UserRole | null;
  currentUser: User | null;
  currentConfig: RoleConfig | null;
  selectRole: (role: UserRole) => void;
  exitToRoleSelection: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = 'cropcare_demo_active_role';

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'farmer' || saved === 'officer' || saved === 'expert' || saved === 'admin')) {
      return saved as UserRole;
    }
    return null;
  });

  useEffect(() => {
    if (currentRole) {
      localStorage.setItem(STORAGE_KEY, currentRole);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentRole]);

  const selectRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const exitToRoleSelection = () => {
    setCurrentRole(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const currentUser = currentRole ? DEMO_USERS[currentRole] : null;
  const currentConfig = currentRole ? ROLE_CONFIGS[currentRole] : null;

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        currentUser,
        currentConfig,
        selectRole,
        exitToRoleSelection,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
