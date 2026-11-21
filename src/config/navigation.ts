import {
  LayoutDashboard,
  Tractor,
  AlertCircle,
  FileText,
  Compass,
  Bell,
  UserCheck,
  CheckSquare,
  ShieldCheck,
  Search,
  MapPin,
  Users,
  Send,
  BarChart3,
  ClipboardList,
  Sparkles,
  Stethoscope,
  Bug,
  BookOpen,
  History,
  FolderTree,
  ListTree,
  Layers,
  TrendingUp,
  Settings,
  type LucideIcon
} from 'lucide-react';
import type { UserRole } from '../types';

export interface NavMenuDefinition {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  description: string;
}

// 2. Farmer Navigation (7 items)
export const FARMER_NAVIGATION: NavMenuDefinition[] = [
  {
    id: 'farmer-dashboard',
    label: 'Dashboard',
    path: '/farmer/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of crop status, recent reports, and weather alerts',
  },
  {
    id: 'farmer-my-farm',
    label: 'My Farm',
    path: '/farmer/my-farm',
    icon: Tractor,
    description: 'Manage farm parcels, registered crops, and soil details',
  },
  {
    id: 'farmer-report-issue',
    label: 'Report Crop Issue',
    path: '/farmer/report-issue',
    icon: AlertCircle,
    badge: 'Quick',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Submit photos, symptoms, and location for immediate diagnosis',
  },
  {
    id: 'farmer-my-complaints',
    label: 'My Complaints',
    path: '/farmer/my-complaints',
    icon: FileText,
    badge: '3 Active',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Track ongoing tickets, field inspections, and officer updates',
  },
  {
    id: 'farmer-track-advisory',
    label: 'Track Advisory',
    path: '/farmer/track-advisory',
    icon: Compass,
    description: 'View prescribed pesticide schedules and recovery guidelines',
  },
  {
    id: 'farmer-notifications',
    label: 'Notifications',
    path: '/farmer/notifications',
    icon: Bell,
    badge: '2 New',
    badgeColor: 'bg-rose-100 text-rose-700',
    description: 'Direct alerts from block agriculture officers and scientists',
  },
  {
    id: 'farmer-profile',
    label: 'My Profile',
    path: '/farmer/profile',
    icon: UserCheck,
    description: 'Farmer Kisan ID, contact details, and bank DBT details',
  },
];

// 3. Agriculture Officer Navigation (8 items)
export const OFFICER_NAVIGATION: NavMenuDefinition[] = [
  {
    id: 'officer-dashboard',
    label: 'Dashboard',
    path: '/officer/dashboard',
    icon: LayoutDashboard,
    description: 'Jurisdictional summary, high-priority pest alerts, and daily tasks',
  },
  {
    id: 'officer-assigned-cases',
    label: 'Assigned Cases',
    path: '/officer/assigned-cases',
    icon: CheckSquare,
    badge: '5 Pending',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Crop distress cases allotted to your extension block',
  },
  {
    id: 'officer-authorized-cases',
    label: 'All Authorized Cases',
    path: '/officer/authorized-cases',
    icon: ShieldCheck,
    description: 'Complete block-level case repository and jurisdiction history',
  },
  {
    id: 'officer-case-investigation',
    label: 'Case Investigation',
    path: '/officer/case-investigation',
    icon: Search,
    description: 'Detailed symptom verification, photo evaluation, and note taking',
  },
  {
    id: 'officer-field-visits',
    label: 'Field Visits',
    path: '/officer/field-visits',
    icon: MapPin,
    badge: '2 Today',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Schedule, log, and geotag on-farm physical inspections',
  },
  {
    id: 'officer-farmers',
    label: 'Farmer Management',
    path: '/officer/farmers',
    icon: Users,
    description: 'Directory of registered cultivators in sub-division Ludhiana East',
  },
  {
    id: 'officer-advisory-requests',
    label: 'Advisory Requests',
    path: '/officer/advisory-requests',
    icon: Send,
    description: 'Forward verified cases to research scientists and ICAR experts',
  },
  {
    id: 'officer-reports',
    label: 'Reports',
    path: '/officer/reports',
    icon: BarChart3,
    description: 'Weekly block damage assessments and pest occurrence trends',
  },
];

// 4. Agricultural Expert Navigation (8 items)
export const EXPERT_NAVIGATION: NavMenuDefinition[] = [
  {
    id: 'expert-dashboard',
    label: 'Dashboard',
    path: '/expert/dashboard',
    icon: LayoutDashboard,
    description: 'Escalated cases, lab requests queue, and scientific notices',
  },
  {
    id: 'expert-pending-reviews',
    label: 'Pending Reviews',
    path: '/expert/pending-reviews',
    icon: ClipboardList,
    badge: '4 Urgent',
    badgeColor: 'bg-rose-100 text-rose-700',
    description: 'High-severity crop cases awaiting expert pathologist opinion',
  },
  {
    id: 'expert-ai-diagnosis',
    label: 'AI Diagnosis Review',
    path: '/expert/ai-diagnosis',
    icon: Sparkles,
    badge: 'AI Beta',
    badgeColor: 'bg-purple-100 text-purple-700',
    description: 'Verify computer vision disease detections and model confidence',
  },
  {
    id: 'expert-advisory',
    label: 'Expert Advisory',
    path: '/expert/expert-advisory',
    icon: Stethoscope,
    description: 'Draft and sign authoritative treatment and spray protocols',
  },
  {
    id: 'expert-disease-management',
    label: 'Disease Management',
    path: '/expert/disease-management',
    icon: BookOpen,
    description: 'Fungal, bacterial, and viral pathogen master management',
  },
  {
    id: 'expert-pest-management',
    label: 'Pest Management',
    path: '/expert/pest-management',
    icon: Bug,
    description: 'Entomological life cycles, threshold limits, and biological controls',
  },
  {
    id: 'expert-advisory-history',
    label: 'Advisory History',
    path: '/expert/advisory-history',
    icon: History,
    description: 'Archived diagnoses, treatments, and post-application efficacy logs',
  },
  {
    id: 'expert-reports',
    label: 'Reports',
    path: '/expert/reports',
    icon: BarChart3,
    description: 'Regional epidemiology bulletins and seasonal outbreak projections',
  },
];

// 5. Administrator Navigation (11 items)
export const ADMIN_NAVIGATION: NavMenuDefinition[] = [
  {
    id: 'admin-dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'System health, aggregate case volumes, and regional response times',
  },
  {
    id: 'admin-users',
    label: 'User Management',
    path: '/admin/users',
    icon: Users,
    description: 'Provision credentials, assign roles, and audit login access',
  },
  {
    id: 'admin-farmers',
    label: 'Farmer Management',
    path: '/admin/farmers',
    icon: Tractor,
    description: 'State-wide kisan registry, land records linkage, and SMS services',
  },
  {
    id: 'admin-officers',
    label: 'Officer Management',
    path: '/admin/officers',
    icon: ShieldCheck,
    description: 'Field officer jurisdiction allocations and beat assignment maps',
  },
  {
    id: 'admin-experts',
    label: 'Expert Management',
    path: '/admin/experts',
    icon: Stethoscope,
    description: 'Agricultural research institute & specialist panel credentials',
  },
  {
    id: 'admin-crop-master',
    label: 'Crop Master',
    path: '/admin/crop-master',
    icon: FolderTree,
    description: 'National crop varieties, sowing cycles, and agro-climatic zones',
  },
  {
    id: 'admin-issue-categories',
    label: 'Issue Categories',
    path: '/admin/issue-categories',
    icon: ListTree,
    description: 'Standardized taxonomy for pests, fungal blights, and soil issues',
  },
  {
    id: 'admin-all-cases',
    label: 'All Cases',
    path: '/admin/all-cases',
    icon: Layers,
    badge: '1,280 Total',
    badgeColor: 'bg-slate-100 text-slate-700',
    description: 'Centralized repository of all reported cases across the state',
  },
  {
    id: 'admin-analytics',
    label: 'Analytics',
    path: '/admin/analytics',
    icon: TrendingUp,
    description: 'Resolution SLA compliance, heatmap clusters, and yield loss metrics',
  },
  {
    id: 'admin-reports',
    label: 'Reports',
    path: '/admin/reports',
    icon: BarChart3,
    description: 'Export official departmental dossiers, audit logs, and MIS tables',
  },
  {
    id: 'admin-settings',
    label: 'System Settings',
    path: '/admin/settings',
    icon: Settings,
    description: 'Global notification gateways, API connections, and system backups',
  },
];

export const ROLE_NAVIGATION_MAP: Record<UserRole, NavMenuDefinition[]> = {
  farmer: FARMER_NAVIGATION,
  officer: OFFICER_NAVIGATION,
  expert: EXPERT_NAVIGATION,
  admin: ADMIN_NAVIGATION,
};
