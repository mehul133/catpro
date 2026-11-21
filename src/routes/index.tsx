import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RoleSelectionPage } from '../pages/RoleSelectionPage';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ReportCropIssuePage } from '../pages/farmer/ReportCropIssuePage';
import { MyComplaintsPage } from '../pages/farmer/MyComplaintsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Role Selection Landing */}
      <Route path="/" element={<RoleSelectionPage />} />
      <Route path="/select-role" element={<RoleSelectionPage />} />

      {/* 2. Farmer Portal Routes */}
      <Route path="/farmer" element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PlaceholderPage />} />
        <Route path="my-farm" element={<PlaceholderPage />} />
        {/* Phase 3 Live Implementations */}
        <Route path="report-issue" element={<ReportCropIssuePage />} />
        <Route path="my-complaints" element={<MyComplaintsPage />} />
        <Route path="track-advisory" element={<MyComplaintsPage />} />
        <Route path="notifications" element={<PlaceholderPage />} />
        <Route path="profile" element={<PlaceholderPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* 3. Agriculture Officer Portal Routes */}
      <Route path="/officer" element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PlaceholderPage />} />
        <Route path="assigned-cases" element={<PlaceholderPage />} />
        <Route path="authorized-cases" element={<PlaceholderPage />} />
        <Route path="case-investigation" element={<PlaceholderPage />} />
        <Route path="field-visits" element={<PlaceholderPage />} />
        <Route path="farmers" element={<PlaceholderPage />} />
        <Route path="advisory-requests" element={<PlaceholderPage />} />
        <Route path="reports" element={<PlaceholderPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* 4. Agricultural Expert Portal Routes */}
      <Route path="/expert" element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PlaceholderPage />} />
        <Route path="pending-reviews" element={<PlaceholderPage />} />
        <Route path="ai-diagnosis" element={<PlaceholderPage />} />
        <Route path="expert-advisory" element={<PlaceholderPage />} />
        <Route path="disease-management" element={<PlaceholderPage />} />
        <Route path="pest-management" element={<PlaceholderPage />} />
        <Route path="advisory-history" element={<PlaceholderPage />} />
        <Route path="reports" element={<PlaceholderPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* 5. Administrator Portal Routes */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PlaceholderPage />} />
        <Route path="users" element={<PlaceholderPage />} />
        <Route path="farmers" element={<PlaceholderPage />} />
        <Route path="officers" element={<PlaceholderPage />} />
        <Route path="experts" element={<PlaceholderPage />} />
        <Route path="crop-master" element={<PlaceholderPage />} />
        <Route path="issue-categories" element={<PlaceholderPage />} />
        <Route path="all-cases" element={<PlaceholderPage />} />
        <Route path="analytics" element={<PlaceholderPage />} />
        <Route path="reports" element={<PlaceholderPage />} />
        <Route path="settings" element={<PlaceholderPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Global Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
