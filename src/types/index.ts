// Core Types for CropCare System
import React from 'react';

export type UserRole = 'farmer' | 'officer' | 'expert' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  region?: string;
  badgeId?: string;
  department?: string;
  avatarUrl?: string;
}

export type IssueStatus = 'submitted' | 'under_review' | 'investigating' | 'advisory_issued' | 'resolved';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type IssueCategory = 'disease' | 'pest' | 'nutrient_deficiency' | 'other';

export interface CropPhoto {
  id: string;
  name: string;
  url: string; // Base64 data URL or preset sample image URL
  size: string;
  uploadedAt: string;
}

export interface TimelineEvent {
  step: number;
  status: IssueStatus;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  completed: boolean;
}

export interface ExpertAdvisoryDetails {
  advisoryId: string;
  diagnosis: string;
  causativeAgent: string;
  expertName: string;
  expertDesignation: string;
  expertInstitute: string;
  issuedAt: string;
  immediateActions: string[];
  chemicalControl: {
    pesticideName: string;
    dosage: string;
    applicationMethod: string;
    waitingPeriodDays: number;
  }[];
  organicRemedy: string[];
  preventiveGuidelines: string[];
}

export interface Complaint {
  id: string;
  trackingId: string; // e.g. CC-2026-8921
  isDemo: boolean;
  submissionDate: string;
  status: IssueStatus;
  severity: SeverityLevel;

  // Step 1: Farmer & Farm Details
  farmerId: string;
  farmerName: string;
  kisanId: string;
  phone: string;
  state: string;
  district: string;
  subDistrict: string;
  village: string;
  farmParcelName: string;
  totalLandArea: string;

  // Step 2: Crop Details
  crop: string;
  variety: string;
  sowingDate: string;
  cropStage: string;
  irrigationSource: string;
  soilType: string;

  // Step 3: Problem Details
  issueType: IssueCategory;
  symptoms: string[];
  affectedArea: string;
  firstObservedDate: string;
  description: string;
  pastTreatments?: string;

  // Step 4: Photos
  photos: CropPhoto[];

  // Processing & Advisory metadata
  assignedOfficer?: {
    name: string;
    designation: string;
    contact: string;
    assignedDate: string;
  };
  fieldInspectionDate?: string;
  fieldNotes?: string;
  advisory?: ExpertAdvisoryDetails;
  timeline: TimelineEvent[];
}

export interface CropIssue {
  id: string;
  ticketNumber: string;
  cropName: string;
  affectedArea: string;
  issueType: 'pest' | 'disease' | 'weather' | 'soil' | 'unknown';
  severity: SeverityLevel;
  status: IssueStatus;
  farmerId: string;
  farmerName: string;
  location: string;
  description: string;
  createdAt: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  description?: string;
}

export interface RoleConfig {
  role: UserRole;
  title: string;
  portalName: string;
  shortDescription: string;
  fullDescription: string;
  badge: string;
  themeColor: string;
  defaultPath: string;
  demoUser: User;
  iconName: string;
}
