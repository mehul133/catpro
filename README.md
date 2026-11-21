# 🌱 CropCare - Crop Issue Reporting and Advisory Case Management System

CropCare is an agricultural technology platform designed to streamline the lifecycle of reporting, triaging, diagnosing, and resolving crop issues. It brings together farmers, field agriculture officers, agricultural subject-matter experts, and administrators onto a unified case management dashboard.

---

## 👥 Stakeholder Roles & Purpose

1. **🌾 Farmers**
   - Report crop health symptoms, pest infestations, nutrient deficiencies, or weather anomalies.
   - Attach photo evidence, specify affected acreage, and provide GPS/region information.
   - Receive verified, actionable agricultural advisories directly from authorized specialists.

2. **🛡️ Agriculture Officers**
   - Monitor reports in their assigned sub-districts/blocks.
   - Filter duplicates, conduct on-site field visits, and verify preliminary symptoms.
   - Escalate severe or unidentifiable crop threats to specialized research institutes and lab experts.

3. **🔬 Agricultural Experts (Scientists & Agronomists)**
   - Analyze verified case files, disease progression, and soil/laboratory tests.
   - Issue precise chemical, organic, and cultural remedies and spray schedules.
   - Track advisory efficacy and update pest outbreak advisories for local regions.

4. **⚙️ Administrators**
   - Manage user role authorizations and jurisdictional assignments.
   - Supervise case resolution Service Level Agreements (SLAs).
   - View crop health heatmaps, outbreak patterns, and aggregate statistical summaries.

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Agricultural Emerald & Green Theme)
- **Routing**: [React Router](https://reactrouter.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
CropCare/
├── index.html                 # Main HTML entry point
├── package.json               # Project dependencies and npm scripts
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
├── public/                    # Static assets
└── src/
    ├── assets/                # Images, brand icons, and static graphics
    ├── components/            # Reusable UI components
    │   ├── common/            # Shared UI (Navbar, Footer, Button, Card, etc.)
    │   └── layout/            # Layout shells and navigation frames
    ├── pages/                 # Full-page views
    │   └── WelcomePage.tsx    # CropCare system overview & welcome screen
    ├── routes/                # Client-side routing definitions
    │   └── index.tsx          # Application route definitions
    ├── types/                 # Shared TypeScript interfaces & domain types
    │   └── index.ts           # User, Role, Case, and Advisory contracts
    ├── App.tsx                # Top-level React component with router provider
    ├── main.tsx               # DOM root mounting
    └── index.css              # Global styles and Tailwind CSS imports
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### 1. Installation

Install all dependencies:

```bash
npm install
```

### 2. Run the Development Server

Start the local Vite development server:

```bash
npm run dev
```

By default, Vite will start the app at `http://localhost:5173`. Open this URL in your browser to view CropCare!

### 3. Build for Production

To create an optimized production build:

```bash
npm run build
```

---

## 📋 Roadmap & Development Status

Please check [DEVELOPMENT_PROGRESS.md](file:///c:/Users/Nisan/OneDrive/Desktop/CropCare/DEVELOPMENT_PROGRESS.md) for the active milestone breakdown, current progress, and next planned steps.
