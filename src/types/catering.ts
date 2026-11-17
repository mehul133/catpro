// Comprehensive Type Definitions for CaterPro Catering & Event Menu Estimator

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export type EventCategory =
  | 'Wedding'
  | 'Engagement'
  | 'Reception'
  | 'Birthday'
  | 'Corporate event'
  | 'Conference'
  | 'Outdoor catering'
  | 'Private party'
  | 'Festival'
  | 'Institutional catering';

export type ServiceStyle =
  | 'Buffet'
  | 'Plated service'
  | 'Live counters'
  | 'Cocktail service'
  | 'Packed meals'
  | 'Food stations';

export type EventStatus =
  | 'Inquiry'
  | 'Quotation Sent'
  | 'Confirmed'
  | 'In Preparation'
  | 'Completed'
  | 'Cancelled';

export type DietaryType = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain';

export type UnitOfMeasure = 'g' | 'kg' | 'ml' | 'l' | 'pcs' | 'portion' | 'bundle' | 'box';

export type PricingStrategy =
  | 'cost_plus'
  | 'target_margin'
  | 'per_plate'
  | 'package'
  | 'custom';

export type UserRole = 'Admin' | 'Catering Manager' | 'Head Chef' | 'Sales Executive' | 'Event Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface CompanySettings {
  name: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  taxNumber: string; // GSTIN / VAT ID
  currency: CurrencyCode;
  currencySymbol: string;
  defaultTaxRate: number; // percentage (e.g. 5% or 18%)
  defaultContingencyRate: number; // percentage (e.g. 5%)
  defaultWastageRate: number; // percentage (e.g. 8%)
  defaultBufferRate: number; // percentage (e.g. 5%)
  defaultPaymentTerms: string;
  termsAndConditions: string[];
}

export interface Client {
  id: string;
  name: string;
  companyName?: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
  totalEventsCount?: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  categories: string[];
  paymentTerms: string;
  rating: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string; // 'Dairy', 'Produce', 'Meat', 'Spices', 'Grocery', 'Oils', 'Beverages', etc.
  purchaseUnit: UnitOfMeasure;
  currentMarketPrice: number; // Price per purchase unit
  lastPurchasePrice: number;
  stockQuantity: number;
  minStockLevel: number;
  supplierId?: string;
  supplierName?: string;
  wastagePct: number; // standard preparation trimming loss %
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number; // Quantity in the given recipe
  unit: UnitOfMeasure;
  costPerUnit: number;
  subtotal: number;
  prepLossPct: number; // trimming/cooking shrinkage loss
}

export interface FoodCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  sortOrder: number;
}

export interface FoodItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  cuisine: string; // 'North Indian', 'South Indian', 'Mughlai', 'Continental', 'Chinese', 'Italian', etc.
  dietaryType: DietaryType;
  description: string;
  servingSizePerPerson: number;
  servingUnit: UnitOfMeasure;
  ingredients: RecipeIngredient[];
  preparationMethod?: string;
  allergenInfo: string[]; // ['Gluten', 'Dairy', 'Nuts', 'Soy', etc.]
  foodWastagePct: number; // specific dish wastage % (e.g., 5-10%)
  recipeYieldPortions: number; // e.g. recipe makes 10 portions
  costPerPortion: number; // calculated recipe cost / portions
  sellingPricePerServing: number;
  isPopular?: boolean;
}

export interface EventMenuItem {
  itemId: string;
  name: string;
  categoryName: string;
  dietaryType: DietaryType;
  cuisine: string;
  servingSize: number;
  servingUnit: UnitOfMeasure;
  consumptionRate: number; // decimal, e.g. 0.85 = 85% expected consumption
  bufferPct: number; // decimal, e.g. 0.05 = 5% buffer
  wastagePct: number; // decimal, e.g. 0.08 = 8% wastage
  requiredQty: number; // Guests * servingSize * consumptionRate
  productionQty: number; // requiredQty * (1 + bufferPct)
  purchaseQty: number; // productionQty * (1 + wastagePct)
  unitCost: number; // Cost per portion
  totalCost: number; // productionQty * unitCost
  sellingPrice: number;
  customNotes?: string;
}

export interface OperationalCostItem {
  id: string;
  category:
    | 'Chef charges'
    | 'Kitchen staff'
    | 'Service staff'
    | 'Event managers'
    | 'Transportation'
    | 'Fuel'
    | 'Equipment rental'
    | 'Buffet setup'
    | 'Decoration'
    | 'Crockery and cutlery'
    | 'Packaging'
    | 'Electricity'
    | 'Water'
    | 'Miscellaneous expenses';
  description: string;
  quantity: number;
  unit: string; // 'staff', 'hours', 'vehicles', 'sets', 'lumpsum'
  unitRate: number;
  totalAmount: number;
}

export interface EventRecord {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  eventDate: string; // YYYY-MM-DD
  eventLocation: string;
  category: EventCategory;
  guestCount: number;
  adultsCount: number;
  childrenCount: number;
  eventDurationHours: number;
  serviceStyle: ServiceStyle;
  foodCounters: number;
  specialDietaryRequirements: string;
  eventNotes: string;
  status: EventStatus;
  menu: EventMenuItem[];
  operationalCosts: OperationalCostItem[];
  pricing: EventPricingSummary;
  actualExpenses?: ActualExpenseRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface EventPricingSummary {
  strategy: PricingStrategy;
  subtotalFoodCost: number;
  subtotalOperationalCost: number;
  subtotalCost: number; // Food + Ops
  contingencyPct: number; // e.g. 5%
  contingencyAmount: number;
  taxRatePct: number; // e.g. 5% or 18%
  taxAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  grandTotalCost: number; // Subtotal + Contingency + Tax
  targetProfitMarginPct: number; // e.g. 25% or 30%
  sellingPrice: number; // Total quotation amount
  grossProfit: number; // sellingPrice - grandTotalCost
  profitMarginPct: number; // (grossProfit / sellingPrice) * 100
  costPerGuest: number; // grandTotalCost / guestCount
  sellingPricePerGuest: number; // sellingPrice / guestCount
  foodCostPct: number; // (subtotalFoodCost / sellingPrice) * 100
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. QT-2026-001
  eventId: string;
  eventName: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  eventDate: string;
  guestCount: number;
  serviceStyle: ServiceStyle;
  version: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Expired';
  validUntil: string;
  pricingSnapshot: EventPricingSummary;
  menuSnapshot: EventMenuItem[];
  operationalSnapshot: OperationalCostItem[];
  termsAndConditions: string[];
  paymentTerms: string;
  authorizedSignatory: string;
  notes?: string;
  createdAt: string;
}

export interface MenuTemplate {
  id: string;
  name: string;
  eventType: EventCategory;
  description: string;
  recommendedGuestsMin: number;
  recommendedGuestsMax: number;
  itemIds: string[];
  estimatedCostPerGuest: number;
}

export interface ProcurementItem {
  ingredientId: string;
  ingredientName: string;
  category: string;
  purchaseUnit: UnitOfMeasure;
  requiredQty: number;
  stockQty: number;
  toPurchaseQty: number;
  unitPrice: number;
  estimatedCost: number;
  supplierName?: string;
}

export interface ActualExpenseRecord {
  id: string;
  category: string;
  description: string;
  estimatedAmount: number;
  actualAmount: number;
  date: string;
  receiptNumber?: string;
}
