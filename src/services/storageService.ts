import {
  EventRecord,
  FoodItem,
  FoodCategory,
  Ingredient,
  Supplier,
  Client,
  Quotation,
  MenuTemplate,
  CompanySettings
} from '../types/catering';
import {
  INITIAL_COMPANY_SETTINGS,
  INITIAL_FOOD_CATEGORIES,
  INITIAL_FOOD_ITEMS,
  INITIAL_INGREDIENTS,
  INITIAL_SUPPLIERS,
  INITIAL_CLIENTS,
  INITIAL_EVENTS,
  INITIAL_MENU_TEMPLATES
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'caterpro_settings_v1',
  EVENTS: 'caterpro_events_v1',
  FOOD_ITEMS: 'caterpro_food_items_v1',
  FOOD_CATEGORIES: 'caterpro_categories_v1',
  INGREDIENTS: 'caterpro_ingredients_v1',
  SUPPLIERS: 'caterpro_suppliers_v1',
  CLIENTS: 'caterpro_clients_v1',
  QUOTATIONS: 'caterpro_quotations_v1',
  TEMPLATES: 'caterpro_templates_v1',
};

export const StorageService = {
  getSettings(): CompanySettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_COMPANY_SETTINGS));
      return INITIAL_COMPANY_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COMPANY_SETTINGS;
    }
  },

  saveSettings(settings: CompanySettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getEvents(): EventRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EVENTS;
    }
  },

  saveEvents(events: EventRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  getFoodCategories(): FoodCategory[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FOOD_CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FOOD_CATEGORIES, JSON.stringify(INITIAL_FOOD_CATEGORIES));
      return INITIAL_FOOD_CATEGORIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FOOD_CATEGORIES;
    }
  },

  getFoodItems(): FoodItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(INITIAL_FOOD_ITEMS));
      return INITIAL_FOOD_ITEMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FOOD_ITEMS;
    }
  },

  saveFoodItems(items: FoodItem[]): void {
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(items));
  },

  getIngredients(): Ingredient[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(INITIAL_INGREDIENTS));
      return INITIAL_INGREDIENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_INGREDIENTS;
    }
  },

  saveIngredients(ingredients: Ingredient[]): void {
    localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
  },

  getSuppliers(): Supplier[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
      return INITIAL_SUPPLIERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUPPLIERS;
    }
  },

  saveSuppliers(suppliers: Supplier[]): void {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  },

  getClients(): Client[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CLIENTS;
    }
  },

  saveClients(clients: Client[]): void {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },

  getQuotations(): Quotation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    if (!raw) {
      // Generate default quotation from the initial events
      const events = this.getEvents();
      const settings = this.getSettings();
      const defaultQuotes: Quotation[] = events.map((evt, idx) => ({
        id: `quote-${evt.id}`,
        quotationNumber: `QT-2026-${(idx + 1).toString().padStart(3, '0')}`,
        eventId: evt.id,
        eventName: evt.name,
        clientId: evt.clientId,
        clientName: evt.clientName,
        clientPhone: evt.clientPhone,
        clientEmail: evt.clientEmail,
        eventDate: evt.eventDate,
        guestCount: evt.guestCount,
        serviceStyle: evt.serviceStyle,
        version: 1,
        status: evt.status === 'Confirmed' ? 'Approved' : 'Sent',
        validUntil: '2026-12-31',
        pricingSnapshot: evt.pricing,
        menuSnapshot: evt.menu,
        operationalSnapshot: evt.operationalCosts,
        termsAndConditions: settings.termsAndConditions,
        paymentTerms: settings.defaultPaymentTerms,
        authorizedSignatory: 'Director of Banquets & Catering',
        createdAt: evt.createdAt
      }));
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(defaultQuotes));
      return defaultQuotes;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveQuotations(quotations: Quotation[]): void {
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  },

  getTemplates(): MenuTemplate[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_MENU_TEMPLATES));
      return INITIAL_MENU_TEMPLATES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MENU_TEMPLATES;
    }
  },

  resetToDefaults(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
