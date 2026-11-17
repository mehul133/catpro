# CaterPro – Intelligent Catering & Event Menu Estimator

> Enterprise-grade SaaS catering estimation and event management platform built for high-volume caterers, luxury wedding banquets, corporate dining, and outdoor event operations.

---

## 🌟 Executive Summary & Key Highlights

CaterPro solves the most critical pain points in commercial catering:
1. **Under-costed food quotes & margin erosion** – Fixed by granular recipe yields, trimming losses, and ingredient-level costing.
2. **Buffet food shortages or extreme wastage** – Fixed by the Smart Quantity Calculator applying consumption rates, production buffers, and purchase wastage.
3. **Hidden labor & operational drain** – Fixed by comprehensive operational cost itemization (executive chefs, stewards, refrigeration trucks, chafing rental, fuel).
4. **Unprofessional client proposals** – Fixed by one-click high-res PDF catering proposals with client branding, categorized menus, and transparent financials.
5. **Kitchen miscommunication** – Fixed by automated, printable Kitchen Production Sheets with prep milestones, batch sizing, counter allocations, and dietary alert banners.
6. **Post-event profit leakage** – Fixed by the Estimated vs. Actual Expenditure Audit tracker.

---

## 🏗️ Architecture & Technical Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React icons
- **State & Calculation Engine**: Custom decimal-precision engine with unit normalization (`g`, `kg`, `ml`, `l`, `pcs`, `portions`)
- **PDF Generation**: `jsPDF` & `jspdf-autotable` with branded multi-page layouts
- **Data Persistence**: Structured relational data architecture with full local persistence, exportable CSV/Excel, and PostgreSQL/Supabase schema
- **Design System**: Premium SaaS aesthetic with warm neutral ivory, slate-900 typography, emerald green (#166534) accents, and gold (#c59441) highlights

---

## 📊 Modules & Workflow Coverage

| Module | Features & Capabilities |
| :--- | :--- |
| **1. Executive Dashboard** | Total events, pipeline revenue, estimated profit, avg cost/guest, interactive margin simulator, popular dishes. |
| **2. Event Management** | 15+ event fields, 10 event categories (Wedding, Corporate, Birthday, etc.), 6 service styles (Buffet, Plated, Live Stations, etc.), guest breakdown (Adults/Kids), food counters, dietary restrictions. |
| **3. Menu Builder** | 17 food categories, 50+ pre-seeded authentic dishes, dietary badges (Veg, Non-Veg, Vegan, Jain), allergen tags, curated wedding/corporate templates. |
| **4. Smart Food Quantity Calculator** | $\text{Required Qty} = \text{Guests} \times \text{Portion} \times \text{Rate}$; $\text{Production} = \text{Req} \times (1 + \text{Buffer})$; $\text{Purchase} = \text{Prod} \times (1 + \text{Waste})$. |
| **5. Recipe & Ingredient Costing** | Ingredient bills of materials, preparation loss factor, batch yields, cost per portion, and supplier market prices. |
| **6. Event Cost Estimation** | Raw food costs, operational manpower (chefs, stewards, managers), transport, equipment rental, fuel, contingency buffer, and configurable taxes. |
| **7. Advanced Pricing Engine** | 5 Pricing strategies: Target Profit Margin, Cost-Plus Markup, Per-Plate Fixed, Package Lump Sum, Custom Quote. |
| **8. Inventory & Procurement** | Raw ingredient inventory, minimum threshold tracking, low-stock warnings, and **1-click auto-generation of procurement lists** from selected event menus. |
| **9. Quotation Generator** | Professional branded PDF proposals, version control, WhatsApp share link, payment terms, terms & conditions, and convert-to-confirmed booking. |
| **10. Production Sheets** | Printable kitchen schedules, T-24h to T-30m prep milestones, staff allocations, equipment checklists, and allergy warning banners. |
| **11. Reports & Analytics** | Event profitability comparison, quotation conversion rate, post-event Estimated vs. Actual expenditure logger, and CSV export. |
| **12. Settings** | Company profile, GSTIN/Tax ID, multi-currency switcher (₹ INR, $ USD, € EUR, AED), standard contingency/tax defaults. |

---

## 🚀 Quickstart & Setup Instructions

### 1. Prerequisites
- **Node.js**: v20+ or v22+
- **npm**: v10+

### 2. Installation
```powershell
# Navigate to the workspace
cd C:\CaterPro

# Install dependencies (already completed in workspace)
npm install

# Launch Vite development server
npm run dev
```

### 3. Production Build
```powershell
npm run build
npm run preview
```

---

## 🗄️ Database Architecture & Migrations

The database is designed with full relational integrity. You can find the complete PostgreSQL DDL schema at:
[`database/schema.sql`](file:///C:/CaterPro/database/schema.sql)

### Entities Implemented:
- `users`: Role-based access (Admin, Catering Manager, Head Chef, Sales Executive, Staff)
- `companies`: Multi-branch catering business profile, taxation, and default terms
- `clients`: Customer CRM with event histories
- `suppliers`: Food purveyors, category tags, and payment terms
- `ingredients`: Raw materials, purchase units, current market prices, and stock levels
- `food_categories`: 17 standard catering divisions
- `food_items` & `recipe_ingredients`: Bill of materials with prep loss factors and batch yields
- `events`: Full event particulars, service styles, counters, and guest counts
- `event_menus`: Event-specific portion allocations and quantity multipliers
- `event_operational_expenses`: Granular manpower and logistics line items
- `quotations`: **Frozen historical pricing snapshots** ensuring future ingredient price changes never alter issued client proposals
- `event_actual_expenses`: Post-event audit for budget variance tracking

To execute against Supabase or PostgreSQL:
```bash
psql -h <host> -U <user> -d <database> -f database/schema.sql
```

---

## 🔐 Environment Variables (`.env.example`)

```ini
# Application Configuration
VITE_APP_NAME="CaterPro"
VITE_DEFAULT_CURRENCY="INR"
VITE_DEFAULT_TAX_RATE="5.0"

# Optional Supabase Connection (for cloud sync)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

---

## 🧪 Local Test Credentials & Demo Data

The platform comes preloaded with authentic Indian and international catering data:
- **Default Role**: Admin (can be switched instantly via the top Navbar to `Catering Manager`, `Head Chef`, or `Sales Executive`)
- **Preloaded Events**:
  - *Royal Heritage Wedding & Reception* (500 Pax, Buffet, 6 Counters)
  - *NexGen Annual Global Tech Summit Lunch* (300 Pax, Corporate Buffet, 4 Counters)
- **Preloaded Dishes**: 25+ rich recipes across Welcome Drinks, Tandoori Starters, Biryanis, Dal Makhani, Butter Chicken, Desserts, and Live Chaat
- **Reset Button**: Found in the top navigation bar or Settings tab to restore demo data at any time.

---

## 📜 Compliance & Verification

All financial formulas have been validated against the specification:
- $\text{Required Quantity} = \text{Guest Count} \times \text{Serving Size} \times \text{Consumption Rate}$
- $\text{Production Quantity} = \text{Required Quantity} \times (1 + \text{Buffer Percentage})$
- $\text{Purchase Quantity} = \text{Production Quantity} \times (1 + \text{Wastage Percentage})$
- $\text{Cost Per Portion} = \frac{\sum(\text{Ingredient Qty} \times (1 + \text{Prep Loss}) \times \text{Unit Cost})}{\text{Batch Yield Portions}}$
- $\text{Selling Price} = \frac{\text{Total Cost}}{1 - \text{Target Margin \%}}$ (Target Margin Strategy)
- $\text{Profit Margin \%} = \frac{\text{Selling Price} - \text{Total Cost}}{\text{Selling Price}} \times 100$
- Taxes, contingencies, and discounts are fully configurable and never hardcoded.
