-- ============================================================================
-- CATERPRO: INTELLIGENT CATERING ESTIMATION & ERP RELATIONAL DATABASE SCHEMA
-- PostgreSQL / Supabase Compliant DDL Schema
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Catering Manager', 'Head Chef', 'Sales Executive', 'Event Staff')),
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMPANIES & BRANCHES
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    logo_url TEXT,
    phone VARCHAR(50),
    email VARCHAR(150),
    website VARCHAR(150),
    address TEXT,
    tax_number VARCHAR(100), -- GSTIN / VAT registration
    currency VARCHAR(10) DEFAULT 'INR',
    currency_symbol VARCHAR(10) DEFAULT '₹',
    default_tax_rate NUMERIC(5,2) DEFAULT 5.00,
    default_contingency_rate NUMERIC(5,2) DEFAULT 5.00,
    default_wastage_rate NUMERIC(5,2) DEFAULT 8.00,
    default_buffer_rate NUMERIC(5,2) DEFAULT 5.00,
    default_payment_terms TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLIENTS
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    company_name VARCHAR(200),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    billing_address TEXT,
    notes TEXT,
    total_events_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUPPLIERS & VENDORS
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    address TEXT,
    categories_supplied TEXT[], -- Array of strings e.g. ['Produce', 'Dairy']
    payment_terms VARCHAR(100) DEFAULT 'Net 15 days',
    rating NUMERIC(3,2) DEFAULT 4.8,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INGREDIENTS & RAW MATERIAL INVENTORY
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Dairy', 'Produce', 'Meat', 'Grocery', 'Spices', etc.
    purchase_unit VARCHAR(50) NOT NULL CHECK (purchase_unit IN ('kg', 'g', 'l', 'ml', 'pcs', 'portion', 'bundle', 'box')),
    current_market_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    last_purchase_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    stock_quantity NUMERIC(12,3) NOT NULL DEFAULT 0.000,
    min_stock_level NUMERIC(12,3) NOT NULL DEFAULT 0.000,
    preferred_supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    standard_wastage_pct NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FOOD CATEGORIES (17 Standard Categories)
CREATE TABLE IF NOT EXISTS food_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    sort_order INT DEFAULT 0
);

-- 8. FOOD ITEMS & RECIPES
CREATE TABLE IF NOT EXISTS food_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES food_categories(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    dietary_type VARCHAR(50) NOT NULL CHECK (dietary_type IN ('Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain')),
    description TEXT,
    serving_size_per_person NUMERIC(10,2) NOT NULL DEFAULT 100.00,
    serving_unit VARCHAR(50) NOT NULL DEFAULT 'g',
    preparation_method TEXT,
    allergen_info TEXT[], -- Array e.g. ['Dairy', 'Gluten']
    food_wastage_pct NUMERIC(5,2) DEFAULT 5.00,
    recipe_yield_portions INT DEFAULT 10,
    cost_per_portion NUMERIC(12,2) DEFAULT 0.00,
    selling_price_per_serving NUMERIC(12,2) DEFAULT 0.00,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RECIPE INGREDIENTS BREAKDOWN (Bill of Materials)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE RESTRICT,
    quantity NUMERIC(12,3) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    prep_loss_pct NUMERIC(5,2) DEFAULT 0.00,
    cost_per_unit NUMERIC(12,2) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EVENTS
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN (
        'Wedding', 'Engagement', 'Reception', 'Birthday', 'Corporate event',
        'Conference', 'Outdoor catering', 'Private party', 'Festival', 'Institutional catering'
    )),
    event_date DATE NOT NULL,
    event_location TEXT NOT NULL,
    guest_count INT NOT NULL CHECK (guest_count > 0),
    adults_count INT DEFAULT 0,
    children_count INT DEFAULT 0,
    event_duration_hours NUMERIC(4,1) DEFAULT 4.0,
    service_style VARCHAR(100) NOT NULL CHECK (service_style IN (
        'Buffet', 'Plated service', 'Live counters', 'Cocktail service', 'Packed meals', 'Food stations'
    )),
    food_counters INT DEFAULT 2,
    special_dietary_requirements TEXT,
    event_notes TEXT,
    status VARCHAR(50) DEFAULT 'Inquiry' CHECK (status IN (
        'Inquiry', 'Quotation Sent', 'Confirmed', 'In Preparation', 'Completed', 'Cancelled'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EVENT MENUS (Dish allocation & smart quantity per event)
CREATE TABLE IF NOT EXISTS event_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES food_items(id) ON DELETE RESTRICT,
    consumption_rate NUMERIC(5,2) DEFAULT 0.90, -- e.g. 0.90
    buffer_pct NUMERIC(5,2) DEFAULT 0.05,       -- e.g. 0.05
    wastage_pct NUMERIC(5,2) DEFAULT 0.08,      -- e.g. 0.08
    required_qty NUMERIC(12,2) NOT NULL,
    production_qty NUMERIC(12,2) NOT NULL,
    purchase_qty NUMERIC(12,2) NOT NULL,
    unit_cost NUMERIC(12,2) NOT NULL,
    total_cost NUMERIC(12,2) NOT NULL,
    selling_price NUMERIC(12,2) NOT NULL,
    custom_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. EVENT OPERATIONAL EXPENSES
CREATE TABLE IF NOT EXISTS event_operational_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit VARCHAR(50) NOT NULL,
    unit_rate NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. QUOTATIONS (Immutable historical pricing snapshots)
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_number VARCHAR(100) UNIQUE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE RESTRICT,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Approved', 'Rejected', 'Expired')),
    valid_until DATE NOT NULL,
    subtotal_food_cost NUMERIC(12,2) NOT NULL,
    subtotal_ops_cost NUMERIC(12,2) NOT NULL,
    subtotal_base NUMERIC(12,2) NOT NULL,
    contingency_pct NUMERIC(5,2) DEFAULT 5.00,
    contingency_amount NUMERIC(12,2) DEFAULT 0.00,
    tax_rate_pct NUMERIC(5,2) DEFAULT 5.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    grand_total_selling_price NUMERIC(12,2) NOT NULL,
    cost_per_guest NUMERIC(12,2) NOT NULL,
    selling_price_per_guest NUMERIC(12,2) NOT NULL,
    profit_margin_pct NUMERIC(5,2) NOT NULL,
    payment_terms TEXT,
    terms_and_conditions TEXT[],
    authorized_signatory VARCHAR(150),
    -- JSON snapshot of menu and operations frozen at the moment of quote issuance:
    pricing_snapshot JSONB NOT NULL,
    menu_snapshot JSONB NOT NULL,
    operational_snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. EVENT ACTUAL EXPENSES (Post-Event Variance Analysis)
CREATE TABLE IF NOT EXISTS event_actual_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    estimated_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    actual_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    date DATE NOT NULL,
    receipt_number VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_food_items_category ON food_items(category_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
CREATE INDEX IF NOT EXISTS idx_quotations_event ON quotations(event_id);
