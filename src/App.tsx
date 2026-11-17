import React, { useState, useEffect } from 'react';
import {
  EventRecord,
  FoodItem,
  FoodCategory,
  Ingredient,
  Supplier,
  Client,
  Quotation,
  MenuTemplate,
  CompanySettings,
  CurrencyCode,
  UserRole,
  ActualExpenseRecord
} from './types/catering';
import { StorageService } from './services/storageService';
import { calculateEventFinancials, createEventMenuItem } from './services/calculationEngine';

// Layout & Components
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { EventsListView } from './components/events/EventsListView';
import { EventFormModal } from './components/events/EventFormModal';
import { MenuBuilderView } from './components/menu/MenuBuilderView';
import { SmartEstimatorView } from './components/estimator/SmartEstimatorView';
import { RecipeCostingView } from './components/recipes/RecipeCostingView';
import { InventoryView } from './components/inventory/InventoryView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { QuotationsView } from './components/quotations/QuotationsView';
import { ProductionSheetsView } from './components/production/ProductionSheetsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // User & Environment State
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [settings, setSettings] = useState<CompanySettings>(StorageService.getSettings());

  // Master Data State
  const [events, setEvents] = useState<EventRecord[]>(StorageService.getEvents());
  const [foodItems, setFoodItems] = useState<FoodItem[]>(StorageService.getFoodItems());
  const [categories] = useState<FoodCategory[]>(StorageService.getFoodCategories());
  const [ingredients, setIngredients] = useState<Ingredient[]>(StorageService.getIngredients());
  const [suppliers, setSuppliers] = useState<Supplier[]>(StorageService.getSuppliers());
  const [clients, setClients] = useState<Client[]>(StorageService.getClients());
  const [quotations, setQuotations] = useState<Quotation[]>(StorageService.getQuotations());
  const [templates] = useState<MenuTemplate[]>(StorageService.getTemplates());

  // Active Target Context
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);

  // Sync to Storage when state changes
  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    StorageService.saveEvents(events);
  }, [events]);

  useEffect(() => {
    StorageService.saveFoodItems(foodItems);
  }, [foodItems]);

  useEffect(() => {
    StorageService.saveIngredients(ingredients);
  }, [ingredients]);

  useEffect(() => {
    StorageService.saveSuppliers(suppliers);
  }, [suppliers]);

  useEffect(() => {
    StorageService.saveQuotations(quotations);
  }, [quotations]);

  // Currency handler
  const handleChangeCurrency = (curr: CurrencyCode) => {
    const symbolMap: Record<CurrencyCode, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'AED'
    };
    setSettings(prev => ({
      ...prev,
      currency: curr,
      currencySymbol: symbolMap[curr] || '₹'
    }));
  };

  // Event handlers
  const handleSaveEvent = (data: Partial<EventRecord>) => {
    if (data.id) {
      // Update existing
      const updated = events.map(e => (e.id === data.id ? ({ ...e, ...data } as EventRecord) : e));
      setEvents(updated);
    } else {
      // Create new event
      const newId = `evt-${Date.now()}`;
      const defaultMenu = foodItems.slice(0, 6).map(f =>
        createEventMenuItem(f, data.guestCount || 250, {
          consumptionRate: 0.85,
          bufferPct: settings.defaultBufferRate / 100,
          wastagePct: f.foodWastagePct / 100
        })
      );

      const defaultOps = [
        { id: 'op-1', category: 'Chef charges' as const, description: 'Executive Chef & Sous Chefs', quantity: 2, unit: 'staff', unitRate: 6000, totalAmount: 12000 },
        { id: 'op-2', category: 'Kitchen staff' as const, description: 'Prep cooks & cleaners', quantity: 6, unit: 'staff', unitRate: 2000, totalAmount: 12000 },
        { id: 'op-3', category: 'Service staff' as const, description: 'Uniformed buffet captains', quantity: 10, unit: 'staff', unitRate: 1800, totalAmount: 18000 },
        { id: 'op-4', category: 'Transportation' as const, description: 'Refrigerated logistics', quantity: 1, unit: 'vehicles', unitRate: 5000, totalAmount: 5000 }
      ];

      const initialFinancials = calculateEventFinancials({
        guestCount: data.guestCount || 250,
        menuItems: defaultMenu,
        operationalCosts: defaultOps,
        pricingStrategy: 'target_margin',
        contingencyPct: settings.defaultContingencyRate,
        taxRatePct: settings.defaultTaxRate,
        targetProfitMarginPct: 30
      });

      const newEvent: EventRecord = {
        id: newId,
        name: data.name || 'New Catering Event',
        clientId: `cli-${Date.now()}`,
        clientName: data.clientName || 'Valued Client',
        clientPhone: data.clientPhone || '',
        clientEmail: data.clientEmail || '',
        eventDate: data.eventDate || new Date().toISOString().split('T')[0],
        eventLocation: data.eventLocation || 'Banquet Hall',
        category: data.category || 'Wedding',
        guestCount: data.guestCount || 250,
        adultsCount: data.adultsCount || 230,
        childrenCount: data.childrenCount || 20,
        eventDurationHours: data.eventDurationHours || 5,
        serviceStyle: data.serviceStyle || 'Buffet',
        foodCounters: data.foodCounters || 4,
        specialDietaryRequirements: data.specialDietaryRequirements || '',
        eventNotes: data.eventNotes || '',
        status: data.status || 'Inquiry',
        menu: defaultMenu,
        operationalCosts: defaultOps,
        pricing: initialFinancials,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      setEvents([newEvent, ...events]);
      setSelectedEventId(newId);
      // Auto switch to estimator
      setActiveTab('food_costing');
    }
  };

  const handleDuplicateEvent = (event: EventRecord) => {
    const cloneId = `evt-${Date.now()}`;
    const cloned: EventRecord = {
      ...event,
      id: cloneId,
      name: `${event.name} (Copy)`,
      status: 'Inquiry',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setEvents([cloned, ...events]);
    setSelectedEventId(cloneId);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    if (selectedEventId === id) {
      setSelectedEventId(events.find(e => e.id !== id)?.id || '');
    }
  };

  // Food Item Handlers
  const handleSaveFoodItem = (data: Partial<FoodItem>) => {
    if (data.id) {
      setFoodItems(foodItems.map(f => (f.id === data.id ? ({ ...f, ...data } as FoodItem) : f)));
    } else {
      const newFood: FoodItem = {
        id: `food-${Date.now()}`,
        name: data.name || 'New Culinary Dish',
        categoryId: data.categoryId || 'cat-1',
        categoryName: data.categoryName || 'Welcome Drinks',
        cuisine: data.cuisine || 'North Indian',
        dietaryType: data.dietaryType || 'Vegetarian',
        description: data.description || '',
        servingSizePerPerson: data.servingSizePerPerson || 150,
        servingUnit: data.servingUnit || 'g',
        ingredients: data.ingredients || [],
        preparationMethod: data.preparationMethod || '',
        allergenInfo: data.allergenInfo || [],
        foodWastagePct: data.foodWastagePct || 5,
        recipeYieldPortions: data.recipeYieldPortions || 10,
        costPerPortion: data.costPerPortion || 45,
        sellingPricePerServing: data.sellingPricePerServing || 90
      };
      setFoodItems([...foodItems, newFood]);
    }
  };

  const handleDuplicateFoodItem = (dish: FoodItem) => {
    const cloned: FoodItem = {
      ...dish,
      id: `food-${Date.now()}`,
      name: `${dish.name} (Copy)`
    };
    setFoodItems([...foodItems, cloned]);
  };

  const handleDeleteFoodItem = (id: string) => {
    setFoodItems(foodItems.filter(f => f.id !== id));
  };

  // Update whole event from estimator
  const handleSaveEventChangesFromEstimator = (updatedEvent: EventRecord) => {
    setEvents(events.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));

    // Also update or create formal quotation snapshot
    const existingQuoteIdx = quotations.findIndex(q => q.eventId === updatedEvent.id);
    if (existingQuoteIdx >= 0) {
      const updatedQuotes = [...quotations];
      const prev = updatedQuotes[existingQuoteIdx];
      updatedQuotes[existingQuoteIdx] = {
        ...prev,
        version: prev.version + 1,
        pricingSnapshot: updatedEvent.pricing,
        menuSnapshot: updatedEvent.menu,
        operationalSnapshot: updatedEvent.operationalCosts,
        guestCount: updatedEvent.guestCount
      };
      setQuotations(updatedQuotes);
    }
  };

  // Quotation Actions
  const handleCreateQuoteFromEvent = (eventId: string) => {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;

    const newQuote: Quotation = {
      id: `quote-${Date.now()}`,
      quotationNumber: `QT-2026-${(quotations.length + 1).toString().padStart(3, '0')}`,
      eventId: ev.id,
      eventName: ev.name,
      clientId: ev.clientId,
      clientName: ev.clientName,
      clientPhone: ev.clientPhone,
      clientEmail: ev.clientEmail,
      eventDate: ev.eventDate,
      guestCount: ev.guestCount,
      serviceStyle: ev.serviceStyle,
      version: 1,
      status: 'Sent',
      validUntil: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
      pricingSnapshot: ev.pricing,
      menuSnapshot: ev.menu,
      operationalSnapshot: ev.operationalCosts,
      termsAndConditions: settings.termsAndConditions,
      paymentTerms: settings.defaultPaymentTerms,
      authorizedSignatory: 'Director of Banquets & Catering',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setQuotations([newQuote, ...quotations]);
    setActiveTab('quotations');
  };

  const handleDuplicateQuotation = (quote: Quotation) => {
    const cloned: Quotation = {
      ...quote,
      id: `quote-${Date.now()}`,
      quotationNumber: `${quote.quotationNumber}-v${quote.version + 1}`,
      version: quote.version + 1,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuotations([cloned, ...quotations]);
  };

  const handleDeleteQuotation = (id: string) => {
    setQuotations(quotations.filter(q => q.id !== id));
  };

  const handleConvertToConfirmed = (eventId: string) => {
    setEvents(events.map(e => (e.id === eventId ? { ...e, status: 'Confirmed' } : e)));
    setQuotations(
      quotations.map(q => (q.eventId === eventId ? { ...q, status: 'Approved' } : q))
    );
    alert('Event booking successfully confirmed and moved to active kitchen preparation queue!');
  };

  // Template apply
  const handleApplyTemplateToEstimator = (tpl: MenuTemplate) => {
    const activeEv = events.find(e => e.id === selectedEventId) || events[0];
    if (!activeEv) return;

    const selectedDishes = tpl.itemIds
      .map(id => foodItems.find(f => f.id === id))
      .filter(Boolean) as FoodItem[];

    const newMenuItems = selectedDishes.map(d =>
      createEventMenuItem(d, activeEv.guestCount, {
        consumptionRate: 0.90,
        bufferPct: settings.defaultBufferRate / 100,
        wastagePct: d.foodWastagePct / 100
      })
    );

    const updatedFinancials = calculateEventFinancials({
      guestCount: activeEv.guestCount,
      menuItems: newMenuItems,
      operationalCosts: activeEv.operationalCosts,
      pricingStrategy: activeEv.pricing.strategy,
      contingencyPct: activeEv.pricing.contingencyPct,
      taxRatePct: activeEv.pricing.taxRatePct,
      targetProfitMarginPct: activeEv.pricing.targetProfitMarginPct
    });

    const updatedEvent: EventRecord = {
      ...activeEv,
      menu: newMenuItems,
      pricing: updatedFinancials,
      updatedAt: new Date().toISOString()
    };

    handleSaveEventChangesFromEstimator(updatedEvent);
    setActiveTab('food_costing');
  };

  const handleUpdateEventActuals = (eventId: string, actuals: ActualExpenseRecord[]) => {
    setEvents(events.map(e => (e.id === eventId ? { ...e, actualExpenses: actuals } : e)));
  };

  const handleResetData = () => {
    StorageService.resetToDefaults();
    window.location.reload();
  };

  // Page titles
  const tabTitles: Record<NavTab, string> = {
    dashboard: 'Executive Dashboard',
    events: 'Event Management',
    menu_builder: 'Menu Builder & Library',
    food_costing: 'Smart Food Costing & Quantity Estimator',
    recipes: 'Recipe & Ingredient Costing',
    inventory: 'Inventory & Procurement Engine',
    suppliers: 'Supplier & Vendor Directory',
    quotations: 'Quotation & Proposal Studio',
    production_sheets: 'Kitchen & Service Production Sheets',
    reports: 'Financial Reports & Profitability Analytics',
    settings: 'Company Settings & Parameters'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <Navbar
          onToggleMobileSidebar={() => setIsOpenMobile(true)}
          currency={settings.currency}
          onChangeCurrency={handleChangeCurrency}
          userRole={userRole}
          onChangeRole={setUserRole}
          onOpenNewEvent={() => {
            setEditingEvent(null);
            setIsEventModalOpen(true);
          }}
          onResetData={handleResetData}
          pageTitle={tabTitles[activeTab]}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              events={events}
              quotations={quotations}
              foodItems={foodItems}
              settings={settings}
              onSelectEvent={id => {
                setSelectedEventId(id);
                setActiveTab('food_costing');
              }}
              onNavigateTab={tab => setActiveTab(tab as NavTab)}
            />
          )}

          {activeTab === 'events' && (
            <EventsListView
              events={events}
              settings={settings}
              onOpenCreateModal={() => {
                setEditingEvent(null);
                setIsEventModalOpen(true);
              }}
              onEditEvent={ev => {
                setEditingEvent(ev);
                setIsEventModalOpen(true);
              }}
              onDuplicateEvent={handleDuplicateEvent}
              onDeleteEvent={handleDeleteEvent}
              onOpenEstimator={id => {
                setSelectedEventId(id);
                setActiveTab('food_costing');
              }}
              onOpenProductionSheet={id => {
                setSelectedEventId(id);
                setActiveTab('production_sheets');
              }}
              onOpenQuotation={id => {
                setSelectedEventId(id);
                handleCreateQuoteFromEvent(id);
              }}
            />
          )}

          {activeTab === 'menu_builder' && (
            <MenuBuilderView
              foodItems={foodItems}
              categories={categories}
              ingredientsList={ingredients}
              templates={templates}
              settings={settings}
              onSaveFoodItem={handleSaveFoodItem}
              onDuplicateFoodItem={handleDuplicateFoodItem}
              onDeleteFoodItem={handleDeleteFoodItem}
              onApplyTemplateToEstimator={handleApplyTemplateToEstimator}
            />
          )}

          {activeTab === 'food_costing' && (
            <SmartEstimatorView
              events={events}
              selectedEventId={selectedEventId}
              onSelectEventId={setSelectedEventId}
              foodItems={foodItems}
              categories={categories}
              settings={settings}
              onSaveEventChanges={handleSaveEventChangesFromEstimator}
              onOpenQuotationPreview={id => {
                handleCreateQuoteFromEvent(id);
              }}
              onOpenProductionSheet={id => {
                setSelectedEventId(id);
                setActiveTab('production_sheets');
              }}
            />
          )}

          {activeTab === 'recipes' && (
            <RecipeCostingView
              foodItems={foodItems}
              ingredients={ingredients}
              suppliers={suppliers}
              settings={settings}
              onUpdateFoodItem={item => {
                setFoodItems(foodItems.map(f => (f.id === item.id ? item : f)));
              }}
              onUpdateIngredientPrice={(id, price) => {
                setIngredients(
                  ingredients.map(i => (i.id === id ? { ...i, currentMarketPrice: price } : i))
                );
              }}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              ingredients={ingredients}
              suppliers={suppliers}
              events={events}
              foodItems={foodItems}
              settings={settings}
              onUpdateIngredient={ing => {
                setIngredients(ingredients.map(i => (i.id === ing.id ? ing : i)));
              }}
              onAddIngredient={ing => {
                setIngredients([...ingredients, ing]);
              }}
            />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersView
              suppliers={suppliers}
              settings={settings}
              onAddSupplier={sup => setSuppliers([...suppliers, sup])}
              onUpdateSupplier={sup => {
                setSuppliers(suppliers.map(s => (s.id === sup.id ? sup : s)));
              }}
              onDeleteSupplier={id => {
                setSuppliers(suppliers.filter(s => s.id !== id));
              }}
            />
          )}

          {activeTab === 'quotations' && (
            <QuotationsView
              quotations={quotations}
              events={events}
              settings={settings}
              onSaveQuotation={q => {
                setQuotations(quotations.map(x => (x.id === q.id ? q : x)));
              }}
              onDeleteQuotation={handleDeleteQuotation}
              onDuplicateQuotation={handleDuplicateQuotation}
              onConvertToConfirmed={handleConvertToConfirmed}
              onCreateQuoteFromEvent={handleCreateQuoteFromEvent}
            />
          )}

          {activeTab === 'production_sheets' && (
            <ProductionSheetsView
              events={events}
              selectedEventId={selectedEventId}
              onSelectEventId={setSelectedEventId}
              foodItems={foodItems}
              settings={settings}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              events={events}
              quotations={quotations}
              foodItems={foodItems}
              settings={settings}
              onUpdateEventActuals={handleUpdateEventActuals}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={setSettings}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Global Event Form Modal */}
      <EventFormModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        initialEvent={editingEvent}
      />
    </div>
  );
}
export default App;
