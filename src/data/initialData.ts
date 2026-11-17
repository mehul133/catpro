import {
  FoodCategory,
  Ingredient,
  FoodItem,
  Supplier,
  Client,
  EventRecord,
  MenuTemplate,
  CompanySettings
} from '../types/catering';

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  name: 'CaterPro Luxury Catering Solutions',
  tagline: 'Artisanal Culinary Experiences & Event Management',
  logoUrl: '',
  phone: '+91 98765 43210',
  email: 'events@caterpro.com',
  website: 'www.caterpro.com',
  address: 'Level 4, Grand Pavilion Towers, MG Road, Bengaluru, Karnataka 560001',
  taxNumber: '29ABCDE1234F1Z5',
  currency: 'INR',
  currencySymbol: '₹',
  defaultTaxRate: 5.0, // 5% GST on catering services
  defaultContingencyRate: 5.0,
  defaultWastageRate: 8.0,
  defaultBufferRate: 5.0,
  defaultPaymentTerms: '50% advance upon contract signing, 40% 7 days prior to event date, 10% on completion.',
  termsAndConditions: [
    'Quotation is valid for 15 days from the date of issuance.',
    'Final guest count confirmation must be submitted at least 5 business days prior to the event.',
    'Any additional guests above the contracted guarantee will be billed at the agreed per-plate rate plus 15% surcharge.',
    'Beverage and bar licensing, if applicable, to be procured by client unless explicitly bundled in operational costs.',
    'Venue access for kitchen setup and live counters required at least 4 hours before service commencement.'
  ]
};

export const INITIAL_FOOD_CATEGORIES: FoodCategory[] = [
  { id: 'cat-1', name: 'Welcome Drinks', description: 'Refreshing welcome coolers, fresh juices & traditional sherbets', iconName: 'GlassWater', sortOrder: 1 },
  { id: 'cat-2', name: 'Mocktails', description: 'Crafted artisanal botanical & citrus mocktails', iconName: 'Wine', sortOrder: 2 },
  { id: 'cat-3', name: 'Soups', description: 'Warm comforting broths, bisques & shorbas', iconName: 'Soup', sortOrder: 3 },
  { id: 'cat-4', name: 'Salads', description: 'Fresh gourmet garden greens, grain salads & dressings', iconName: 'Salad', sortOrder: 4 },
  { id: 'cat-5', name: 'Starters – Vegetarian', description: 'Crisp, grilled & tandoori vegetarian appetizers', iconName: 'Utensils', sortOrder: 5 },
  { id: 'cat-6', name: 'Starters – Non-Vegetarian', description: 'Succulent chicken, mutton, fish & prawn kebabs', iconName: 'Drumstick', sortOrder: 6 },
  { id: 'cat-7', name: 'Main Course – Vegetarian', description: 'Rich paneer, kofta, seasonal vegetables & dal gravies', iconName: 'CookingPot', sortOrder: 7 },
  { id: 'cat-8', name: 'Main Course – Non-Vegetarian', description: 'Traditional & royal curries, butter chicken & rogan josh', iconName: 'Beef', sortOrder: 8 },
  { id: 'cat-9', name: 'Rice & Biryani', description: 'Fragrant dum biryanis, pulaos & jeera rice', iconName: 'Bowl', sortOrder: 9 },
  { id: 'cat-10', name: 'Indian Breads', description: 'Tandoori naans, rotis, parathas & kulchas', iconName: 'Wheat', sortOrder: 10 },
  { id: 'cat-11', name: 'Continental', description: 'Pastas, bakes, gratins & herb-roasted delicacies', iconName: 'Pizza', sortOrder: 11 },
  { id: 'cat-12', name: 'Chinese', description: 'Wok-tossed noodles, fried rice, manchurian & dim sums', iconName: 'Flame', sortOrder: 12 },
  { id: 'cat-13', name: 'Desserts', description: 'Hot royal halwas, gulab jamuns, rasmalai & pastries', iconName: 'Cake', sortOrder: 13 },
  { id: 'cat-14', name: 'Ice Cream', description: 'Artisanal churned kulfis, sundaes & gelato', iconName: 'IceCream', sortOrder: 14 },
  { id: 'cat-15', name: 'Live Counters', description: 'Interactive Chaat, Pasta, Dosa, Shawarma & BBQ stations', iconName: 'Sparkles', sortOrder: 15 },
  { id: 'cat-16', name: 'Snacks', description: 'Finger foods, canapés, sliders & high-tea bites', iconName: 'Sandwich', sortOrder: 16 },
  { id: 'cat-17', name: 'Tea & Coffee', description: 'Filter coffee, masala chai, herbal teas & espresso', iconName: 'Coffee', sortOrder: 17 },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'FreshFields Organic Farms',
    contactPerson: 'Ramesh Patel',
    phone: '+91 98450 11223',
    email: 'orders@freshfields.in',
    address: 'Hosur Road, Bengaluru',
    categories: ['Produce', 'Fruits', 'Herbs'],
    paymentTerms: 'Net 15 days',
    rating: 4.8
  },
  {
    id: 'sup-2',
    name: 'Royal Dairy Cooperative',
    contactPerson: 'Suresh Kumar',
    phone: '+91 98860 33445',
    email: 'sales@royaldairy.in',
    address: 'Whitefield, Bengaluru',
    categories: ['Dairy', 'Paneer', 'Ghee', 'Butter', 'Cream'],
    paymentTerms: 'Weekly settlement',
    rating: 4.9
  },
  {
    id: 'sup-3',
    name: 'Prime Cuts Poultry & Seafood',
    contactPerson: 'Mohammed Farhan',
    phone: '+91 97400 55667',
    email: 'primecuts@meatbazaar.in',
    address: 'Shivajinagar, Bengaluru',
    categories: ['Meat', 'Chicken', 'Mutton', 'Seafood'],
    paymentTerms: 'Cash on delivery / Net 7 days',
    rating: 4.7
  },
  {
    id: 'sup-4',
    name: 'SpiceCraft Wholesale Traders',
    contactPerson: 'Anand Agrawal',
    phone: '+91 94480 77889',
    email: 'wholesale@spicecraft.com',
    address: 'APMC Yard, Yeshwanthpur, Bengaluru',
    categories: ['Spices', 'Grocery', 'Basmati Rice', 'Oils'],
    paymentTerms: 'Net 30 days',
    rating: 4.6
  },
  {
    id: 'sup-5',
    name: 'Gelato & Sweet Treats Emporium',
    contactPerson: 'Meera Sen',
    phone: '+91 99010 22334',
    email: 'meera@sweettreats.co',
    address: 'Koramangala, Bengaluru',
    categories: ['Desserts', 'Ice Cream', 'Bakery'],
    paymentTerms: 'Advance 50%',
    rating: 4.9
  }
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // Dairy
  { id: 'ing-1', name: 'Fresh Paneer (Malai Cottage Cheese)', category: 'Dairy', purchaseUnit: 'kg', currentMarketPrice: 380, lastPurchasePrice: 370, stockQuantity: 45, minStockLevel: 20, supplierId: 'sup-2', supplierName: 'Royal Dairy Cooperative', wastagePct: 3 },
  { id: 'ing-2', name: 'Pure Desi Cow Ghee', category: 'Dairy', purchaseUnit: 'kg', currentMarketPrice: 650, lastPurchasePrice: 620, stockQuantity: 60, minStockLevel: 25, supplierId: 'sup-2', supplierName: 'Royal Dairy Cooperative', wastagePct: 1 },
  { id: 'ing-3', name: 'Fresh Heavy Cream (35%)', category: 'Dairy', purchaseUnit: 'kg', currentMarketPrice: 280, lastPurchasePrice: 270, stockQuantity: 30, minStockLevel: 15, supplierId: 'sup-2', supplierName: 'Royal Dairy Cooperative', wastagePct: 2 },
  { id: 'ing-4', name: 'Full Cream Milk', category: 'Dairy', purchaseUnit: 'l', currentMarketPrice: 68, lastPurchasePrice: 65, stockQuantity: 120, minStockLevel: 50, supplierId: 'sup-2', supplierName: 'Royal Dairy Cooperative', wastagePct: 2 },
  { id: 'ing-5', name: 'Salted Butter', category: 'Dairy', purchaseUnit: 'kg', currentMarketPrice: 520, lastPurchasePrice: 500, stockQuantity: 35, minStockLevel: 15, supplierId: 'sup-2', supplierName: 'Royal Dairy Cooperative', wastagePct: 1 },
  { id: 'ing-6', name: 'Mawa / Khoya', category: 'Dairy', purchaseUnit: 'kg', currentMarketPrice: 340, lastPurchasePrice: 330, stockQuantity: 25, minStockLevel: 10, supplierId: 'sup-2', supplierName: 'Royal Dairy Cooperative', wastagePct: 2 },
  { id: 'ing-7', name: 'Curd / Yogurt', category: 'Dairy', purchaseUnit: 'kg', currentMarketPrice: 75, lastPurchasePrice: 70, stockQuantity: 50, minStockLevel: 20, supplierId: 'sup-2', supplierName: 'Royal Dairy Cooperative', wastagePct: 2 },

  // Meat & Poultry
  { id: 'ing-8', name: 'Boneless Fresh Chicken Thighs/Breast', category: 'Meat', purchaseUnit: 'kg', currentMarketPrice: 290, lastPurchasePrice: 280, stockQuantity: 40, minStockLevel: 20, supplierId: 'sup-3', supplierName: 'Prime Cuts Poultry & Seafood', wastagePct: 5 },
  { id: 'ing-9', name: 'Tender Mutton Curry Cut (Bone-in)', category: 'Meat', purchaseUnit: 'kg', currentMarketPrice: 850, lastPurchasePrice: 820, stockQuantity: 30, minStockLevel: 15, supplierId: 'sup-3', supplierName: 'Prime Cuts Poultry & Seafood', wastagePct: 8 },
  { id: 'ing-10', name: 'Tiger Prawns (Cleaned & Deveined)', category: 'Meat', purchaseUnit: 'kg', currentMarketPrice: 780, lastPurchasePrice: 750, stockQuantity: 15, minStockLevel: 10, supplierId: 'sup-3', supplierName: 'Prime Cuts Poultry & Seafood', wastagePct: 6 },
  { id: 'ing-11', name: 'Fresh Fish Fillet (Basa/Snapper)', category: 'Meat', purchaseUnit: 'kg', currentMarketPrice: 420, lastPurchasePrice: 400, stockQuantity: 20, minStockLevel: 10, supplierId: 'sup-3', supplierName: 'Prime Cuts Poultry & Seafood', wastagePct: 5 },

  // Produce & Vegetables
  { id: 'ing-12', name: 'Red Onions (Graded A)', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 35, lastPurchasePrice: 32, stockQuantity: 250, minStockLevel: 100, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 10 },
  { id: 'ing-13', name: 'Vine Ripe Hybrid Tomatoes', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 30, lastPurchasePrice: 28, stockQuantity: 200, minStockLevel: 80, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 8 },
  { id: 'ing-14', name: 'Peeled Garlic Cloves', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 180, lastPurchasePrice: 170, stockQuantity: 30, minStockLevel: 15, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 4 },
  { id: 'ing-15', name: 'Fresh Ginger Root', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 120, lastPurchasePrice: 110, stockQuantity: 25, minStockLevel: 10, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 8 },
  { id: 'ing-16', name: 'Coriander & Mint Leaves', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 60, lastPurchasePrice: 50, stockQuantity: 20, minStockLevel: 10, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 15 },
  { id: 'ing-17', name: 'Button Mushrooms', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 160, lastPurchasePrice: 150, stockQuantity: 18, minStockLevel: 10, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 10 },
  { id: 'ing-18', name: 'Bell Peppers (Tricolor)', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 110, lastPurchasePrice: 100, stockQuantity: 25, minStockLevel: 12, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 8 },
  { id: 'ing-19', name: 'Green Peas (Shelled Frozen)', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 95, lastPurchasePrice: 90, stockQuantity: 40, minStockLevel: 20, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 2 },
  { id: 'ing-20', name: 'Potatoes (A Grade)', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 28, lastPurchasePrice: 25, stockQuantity: 300, minStockLevel: 100, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 12 },

  // Grains & Pantry
  { id: 'ing-21', name: 'Royal Aged Basmati Rice (XXL)', category: 'Grocery', purchaseUnit: 'kg', currentMarketPrice: 140, lastPurchasePrice: 135, stockQuantity: 350, minStockLevel: 150, supplierId: 'sup-4', supplierName: 'SpiceCraft Wholesale Traders', wastagePct: 2 },
  { id: 'ing-22', name: 'Chakki Fresh Sharbati Atta', category: 'Grocery', purchaseUnit: 'kg', currentMarketPrice: 48, lastPurchasePrice: 45, stockQuantity: 200, minStockLevel: 80, supplierId: 'sup-4', supplierName: 'SpiceCraft Wholesale Traders', wastagePct: 2 },
  { id: 'ing-23', name: 'Refined Maida (All Purpose Flour)', category: 'Grocery', purchaseUnit: 'kg', currentMarketPrice: 42, lastPurchasePrice: 40, stockQuantity: 180, minStockLevel: 60, supplierId: 'sup-4', supplierName: 'SpiceCraft Wholesale Traders', wastagePct: 2 },
  { id: 'ing-24', name: 'Yellow Moong Dal / Toor Dal', category: 'Grocery', purchaseUnit: 'kg', currentMarketPrice: 145, lastPurchasePrice: 140, stockQuantity: 100, minStockLevel: 40, supplierId: 'sup-4', supplierName: 'SpiceCraft Wholesale Traders', wastagePct: 2 },
  { id: 'ing-25', name: 'Black Urad Dal (Makhani)', category: 'Grocery', purchaseUnit: 'kg', currentMarketPrice: 135, lastPurchasePrice: 130, stockQuantity: 80, minStockLevel: 30, supplierId: 'sup-4', supplierName: 'SpiceCraft Wholesale Traders', wastagePct: 2 },
  { id: 'ing-26', name: 'Cold-Pressed Mustard Oil / Sunflower Oil', category: 'Oils', purchaseUnit: 'l', currentMarketPrice: 160, lastPurchasePrice: 155, stockQuantity: 150, minStockLevel: 60, supplierId: 'sup-4', supplierName: 'SpiceCraft Wholesale Traders', wastagePct: 1 },
  { id: 'ing-27', name: 'Kashmir Saffron Strands (A Grade)', category: 'Spices', purchaseUnit: 'g', currentMarketPrice: 280, lastPurchasePrice: 260, stockQuantity: 150, minStockLevel: 50, supplierId: 'sup-4', supplierName: 'SpiceCraft Wholesale Traders', wastagePct: 0 },
  { id: 'ing-28', name: 'Cashew Nuts (Whole W320)', category: 'Grocery', purchaseUnit: 'kg', currentMarketPrice: 720, lastPurchasePrice: 700, stockQuantity: 40, minStockLevel: 15, supplierId: 'sup-4', supplierName: 'SpiceCraft Wholesale Traders', wastagePct: 1 },
  { id: 'ing-29', name: 'Refined Crystal Sugar', category: 'Grocery', purchaseUnit: 'kg', currentMarketPrice: 45, lastPurchasePrice: 42, stockQuantity: 250, minStockLevel: 100, supplierId: 'sup-4', supplierName: 'SpiceCraft Wholesale Traders', wastagePct: 1 },

  // Fruits & Beverage
  { id: 'ing-30', name: 'Fresh Alfonso Mango Pulp (Tinned)', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 220, lastPurchasePrice: 210, stockQuantity: 50, minStockLevel: 20, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 2 },
  { id: 'ing-31', name: 'Lemons / Fresh Limes', category: 'Produce', purchaseUnit: 'kg', currentMarketPrice: 90, lastPurchasePrice: 80, stockQuantity: 25, minStockLevel: 10, supplierId: 'sup-1', supplierName: 'FreshFields Organic Farms', wastagePct: 15 },
  { id: 'ing-32', name: 'Gourmet Ice Cream Base (Vanilla/Pista)', category: 'Dairy', purchaseUnit: 'l', currentMarketPrice: 180, lastPurchasePrice: 170, stockQuantity: 80, minStockLevel: 30, supplierId: 'sup-5', supplierName: 'Gelato & Sweet Treats Emporium', wastagePct: 2 }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  // 1. Welcome Drinks
  {
    id: 'food-1',
    name: 'Royal Kesaria Thandai',
    categoryId: 'cat-1',
    categoryName: 'Welcome Drinks',
    cuisine: 'North Indian',
    dietaryType: 'Vegetarian',
    description: 'Chilled rich milk infused with Kashmiri saffron, crushed almonds, pistachios, fennel and rose petals.',
    servingSizePerPerson: 180,
    servingUnit: 'ml',
    preparationMethod: 'Blended cold with soaked nut paste, saffron essence and served chilled in earthenware glasses.',
    allergenInfo: ['Dairy', 'Nuts'],
    foodWastagePct: 4,
    recipeYieldPortions: 10,
    costPerPortion: 32,
    sellingPricePerServing: 65,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-4', ingredientName: 'Full Cream Milk', quantity: 1.8, unit: 'l', costPerUnit: 68, subtotal: 122.4, prepLossPct: 2 },
      { ingredientId: 'ing-28', ingredientName: 'Cashew Nuts / Almonds', quantity: 0.15, unit: 'kg', costPerUnit: 720, subtotal: 108, prepLossPct: 1 },
      { ingredientId: 'ing-27', ingredientName: 'Kashmir Saffron Strands', quantity: 0.3, unit: 'g', costPerUnit: 280, subtotal: 84, prepLossPct: 0 }
    ]
  },
  {
    id: 'food-2',
    name: 'Fresh Mint & Lychee Spritzer',
    categoryId: 'cat-1',
    categoryName: 'Welcome Drinks',
    cuisine: 'Fusion',
    dietaryType: 'Vegan',
    description: 'Crushed garden mint, premium lychee juice, sparkling water and a hint of black salt.',
    servingSizePerPerson: 200,
    servingUnit: 'ml',
    allergenInfo: [],
    foodWastagePct: 3,
    recipeYieldPortions: 10,
    costPerPortion: 22,
    sellingPricePerServing: 50,
    ingredients: [
      { ingredientId: 'ing-16', ingredientName: 'Coriander & Mint Leaves', quantity: 0.2, unit: 'kg', costPerUnit: 60, subtotal: 12, prepLossPct: 10 },
      { ingredientId: 'ing-31', ingredientName: 'Lemons / Fresh Limes', quantity: 0.3, unit: 'kg', costPerUnit: 90, subtotal: 27, prepLossPct: 15 }
    ]
  },

  // 2. Mocktails
  {
    id: 'food-3',
    name: 'Blue Curacao Citrus Fizz',
    categoryId: 'cat-2',
    categoryName: 'Mocktails',
    cuisine: 'Continental',
    dietaryType: 'Vegan',
    description: 'Electric blue mocktail with fresh lime, orange blossom bitters, and effervescent soda.',
    servingSizePerPerson: 220,
    servingUnit: 'ml',
    allergenInfo: [],
    foodWastagePct: 3,
    recipeYieldPortions: 10,
    costPerPortion: 26,
    sellingPricePerServing: 60,
    ingredients: [
      { ingredientId: 'ing-31', ingredientName: 'Lemons / Fresh Limes', quantity: 0.4, unit: 'kg', costPerUnit: 90, subtotal: 36, prepLossPct: 15 },
      { ingredientId: 'ing-29', ingredientName: 'Refined Crystal Sugar', quantity: 0.3, unit: 'kg', costPerUnit: 45, subtotal: 13.5, prepLossPct: 1 }
    ]
  },

  // 3. Soups
  {
    id: 'food-4',
    name: 'Murgh Badami Shorba',
    categoryId: 'cat-3',
    categoryName: 'Soups',
    cuisine: 'Mughlai',
    dietaryType: 'Non-Vegetarian',
    description: 'Velvety chicken bone broth slow simmered with whole spices, finished with toasted almond cream.',
    servingSizePerPerson: 150,
    servingUnit: 'ml',
    allergenInfo: ['Dairy', 'Nuts'],
    foodWastagePct: 5,
    recipeYieldPortions: 10,
    costPerPortion: 42,
    sellingPricePerServing: 85,
    ingredients: [
      { ingredientId: 'ing-8', ingredientName: 'Boneless Fresh Chicken', quantity: 0.8, unit: 'kg', costPerUnit: 290, subtotal: 232, prepLossPct: 5 },
      { ingredientId: 'ing-3', ingredientName: 'Fresh Heavy Cream', quantity: 0.25, unit: 'kg', costPerUnit: 280, subtotal: 70, prepLossPct: 2 },
      { ingredientId: 'ing-28', ingredientName: 'Almonds / Cashews', quantity: 0.15, unit: 'kg', costPerUnit: 720, subtotal: 108, prepLossPct: 1 }
    ]
  },
  {
    id: 'food-5',
    name: 'Cream of Roasted Wild Mushroom',
    categoryId: 'cat-3',
    categoryName: 'Soups',
    cuisine: 'Continental',
    dietaryType: 'Vegetarian',
    description: 'Earthy button and porcini mushrooms sautéed with fresh thyme, garlic and cream.',
    servingSizePerPerson: 150,
    servingUnit: 'ml',
    allergenInfo: ['Dairy'],
    foodWastagePct: 5,
    recipeYieldPortions: 10,
    costPerPortion: 35,
    sellingPricePerServing: 75,
    ingredients: [
      { ingredientId: 'ing-17', ingredientName: 'Button Mushrooms', quantity: 1.2, unit: 'kg', costPerUnit: 160, subtotal: 192, prepLossPct: 10 },
      { ingredientId: 'ing-3', ingredientName: 'Fresh Heavy Cream', quantity: 0.3, unit: 'kg', costPerUnit: 280, subtotal: 84, prepLossPct: 2 },
      { ingredientId: 'ing-5', ingredientName: 'Salted Butter', quantity: 0.1, unit: 'kg', costPerUnit: 520, subtotal: 52, prepLossPct: 1 }
    ]
  },

  // 4. Salads
  {
    id: 'food-6',
    name: 'Greek Feta & Crisp Garden Salad',
    categoryId: 'cat-4',
    categoryName: 'Salads',
    cuisine: 'Mediterranean',
    dietaryType: 'Vegetarian',
    description: 'Crispy lettuce, English cucumbers, cherry tomatoes, kalamata olives and oregano-crusted feta.',
    servingSizePerPerson: 100,
    servingUnit: 'g',
    allergenInfo: ['Dairy'],
    foodWastagePct: 8,
    recipeYieldPortions: 10,
    costPerPortion: 38,
    sellingPricePerServing: 80,
    ingredients: [
      { ingredientId: 'ing-18', ingredientName: 'Bell Peppers', quantity: 0.8, unit: 'kg', costPerUnit: 110, subtotal: 88, prepLossPct: 8 },
      { ingredientId: 'ing-13', ingredientName: 'Tomatoes', quantity: 0.8, unit: 'kg', costPerUnit: 30, subtotal: 24, prepLossPct: 5 }
    ]
  },

  // 5. Starters - Vegetarian
  {
    id: 'food-7',
    name: 'Paneer Tikka Angara',
    categoryId: 'cat-5',
    categoryName: 'Starters – Vegetarian',
    cuisine: 'North Indian',
    dietaryType: 'Vegetarian',
    description: 'Smoky tandoor-roasted malai paneer cubes marinated in Deggi mirch, yogurt, ajwain and mustard oil.',
    servingSizePerPerson: 120,
    servingUnit: 'g',
    allergenInfo: ['Dairy'],
    foodWastagePct: 6,
    recipeYieldPortions: 10,
    costPerPortion: 58,
    sellingPricePerServing: 130,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-1', ingredientName: 'Fresh Paneer', quantity: 1.2, unit: 'kg', costPerUnit: 380, subtotal: 456, prepLossPct: 3 },
      { ingredientId: 'ing-7', ingredientName: 'Curd / Yogurt', quantity: 0.4, unit: 'kg', costPerUnit: 75, subtotal: 30, prepLossPct: 2 },
      { ingredientId: 'ing-18', ingredientName: 'Bell Peppers', quantity: 0.5, unit: 'kg', costPerUnit: 110, subtotal: 55, prepLossPct: 8 }
    ]
  },
  {
    id: 'food-8',
    name: 'Dahi Ke Sholay (Crispy Yogurt Croquettes)',
    categoryId: 'cat-5',
    categoryName: 'Starters – Vegetarian',
    cuisine: 'North Indian',
    dietaryType: 'Vegetarian',
    description: 'Golden fried bread pockets bursting with hung curd, bell peppers, fresh mint and green chilies.',
    servingSizePerPerson: 100,
    servingUnit: 'g',
    allergenInfo: ['Gluten', 'Dairy'],
    foodWastagePct: 5,
    recipeYieldPortions: 10,
    costPerPortion: 34,
    sellingPricePerServing: 85,
    ingredients: [
      { ingredientId: 'ing-7', ingredientName: 'Curd / Yogurt', quantity: 1.2, unit: 'kg', costPerUnit: 75, subtotal: 90, prepLossPct: 15 },
      { ingredientId: 'ing-1', ingredientName: 'Fresh Paneer', quantity: 0.3, unit: 'kg', costPerUnit: 380, subtotal: 114, prepLossPct: 2 }
    ]
  },

  // 6. Starters - Non-Vegetarian
  {
    id: 'food-9',
    name: 'Bhatti Da Murgh Tandoori',
    categoryId: 'cat-6',
    categoryName: 'Starters – Non-Vegetarian',
    cuisine: 'North Indian',
    dietaryType: 'Non-Vegetarian',
    description: 'Juicy bone-in chicken thighs double-marinated in Kashmiri chilies, freshly ground garam masala and charred.',
    servingSizePerPerson: 150,
    servingUnit: 'g',
    allergenInfo: ['Dairy'],
    foodWastagePct: 6,
    recipeYieldPortions: 10,
    costPerPortion: 65,
    sellingPricePerServing: 150,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-8', ingredientName: 'Boneless / Cut Chicken', quantity: 1.6, unit: 'kg', costPerUnit: 290, subtotal: 464, prepLossPct: 6 },
      { ingredientId: 'ing-7', ingredientName: 'Curd / Yogurt', quantity: 0.4, unit: 'kg', costPerUnit: 75, subtotal: 30, prepLossPct: 2 },
      { ingredientId: 'ing-26', ingredientName: 'Mustard Oil', quantity: 0.15, unit: 'l', costPerUnit: 160, subtotal: 24, prepLossPct: 0 }
    ]
  },
  {
    id: 'food-10',
    name: 'Galouti Kebab on Mini Sheermal',
    categoryId: 'cat-6',
    categoryName: 'Starters – Non-Vegetarian',
    cuisine: 'Awadhi / Mughlai',
    dietaryType: 'Non-Vegetarian',
    description: 'Melt-in-the-mouth Awadhi minced mutton patties flavored with 16 royal spices, served on warm saffron bread.',
    servingSizePerPerson: 110,
    servingUnit: 'g',
    allergenInfo: ['Dairy', 'Gluten', 'Nuts'],
    foodWastagePct: 5,
    recipeYieldPortions: 10,
    costPerPortion: 110,
    sellingPricePerServing: 240,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-9', ingredientName: 'Tender Mutton', quantity: 1.2, unit: 'kg', costPerUnit: 850, subtotal: 1020, prepLossPct: 8 },
      { ingredientId: 'ing-2', ingredientName: 'Desi Ghee', quantity: 0.2, unit: 'kg', costPerUnit: 650, subtotal: 130, prepLossPct: 1 }
    ]
  },

  // 7. Main Course - Vegetarian
  {
    id: 'food-11',
    name: 'Paneer Lababdar',
    categoryId: 'cat-7',
    categoryName: 'Main Course – Vegetarian',
    cuisine: 'North Indian',
    dietaryType: 'Vegetarian',
    description: 'Succulent cottage cheese steeped in a velvety tomato, onion and cashew gravy with grated paneer.',
    servingSizePerPerson: 180,
    servingUnit: 'g',
    allergenInfo: ['Dairy', 'Nuts'],
    foodWastagePct: 6,
    recipeYieldPortions: 10,
    costPerPortion: 62,
    sellingPricePerServing: 140,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-1', ingredientName: 'Fresh Paneer', quantity: 1.1, unit: 'kg', costPerUnit: 380, subtotal: 418, prepLossPct: 3 },
      { ingredientId: 'ing-13', ingredientName: 'Tomatoes', quantity: 1.5, unit: 'kg', costPerUnit: 30, subtotal: 45, prepLossPct: 5 },
      { ingredientId: 'ing-28', ingredientName: 'Cashew Nuts', quantity: 0.15, unit: 'kg', costPerUnit: 720, subtotal: 108, prepLossPct: 1 },
      { ingredientId: 'ing-3', ingredientName: 'Heavy Cream', quantity: 0.2, unit: 'kg', costPerUnit: 280, subtotal: 56, prepLossPct: 1 }
    ]
  },
  {
    id: 'food-12',
    name: 'Dal Makhani Bukhara Style',
    categoryId: 'cat-7',
    categoryName: 'Main Course – Vegetarian',
    cuisine: 'North Indian',
    dietaryType: 'Vegetarian',
    description: 'Black lentils slow cooked overnight on charcoal embers with fresh cream, butter and ripe tomato coulis.',
    servingSizePerPerson: 150,
    servingUnit: 'g',
    allergenInfo: ['Dairy'],
    foodWastagePct: 4,
    recipeYieldPortions: 10,
    costPerPortion: 38,
    sellingPricePerServing: 95,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-25', ingredientName: 'Black Urad Dal', quantity: 0.9, unit: 'kg', costPerUnit: 135, subtotal: 121.5, prepLossPct: 2 },
      { ingredientId: 'ing-5', ingredientName: 'Salted Butter', quantity: 0.3, unit: 'kg', costPerUnit: 520, subtotal: 156, prepLossPct: 1 },
      { ingredientId: 'ing-3', ingredientName: 'Fresh Heavy Cream', quantity: 0.35, unit: 'kg', costPerUnit: 280, subtotal: 98, prepLossPct: 2 }
    ]
  },

  // 8. Main Course - Non-Vegetarian
  {
    id: 'food-13',
    name: 'Old Delhi Butter Chicken',
    categoryId: 'cat-8',
    categoryName: 'Main Course – Non-Vegetarian',
    cuisine: 'North Indian',
    dietaryType: 'Non-Vegetarian',
    description: 'Clay oven charred chicken simmered in an indulgent satin gravy of sun-ripened tomatoes, makhani gravy and kasoori methi.',
    servingSizePerPerson: 180,
    servingUnit: 'g',
    allergenInfo: ['Dairy', 'Nuts'],
    foodWastagePct: 5,
    recipeYieldPortions: 10,
    costPerPortion: 78,
    sellingPricePerServing: 175,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-8', ingredientName: 'Boneless Fresh Chicken', quantity: 1.5, unit: 'kg', costPerUnit: 290, subtotal: 435, prepLossPct: 5 },
      { ingredientId: 'ing-5', ingredientName: 'Salted Butter', quantity: 0.25, unit: 'kg', costPerUnit: 520, subtotal: 130, prepLossPct: 1 },
      { ingredientId: 'ing-3', ingredientName: 'Fresh Heavy Cream', quantity: 0.3, unit: 'kg', costPerUnit: 280, subtotal: 84, prepLossPct: 2 },
      { ingredientId: 'ing-28', ingredientName: 'Cashew Paste', quantity: 0.15, unit: 'kg', costPerUnit: 720, subtotal: 108, prepLossPct: 1 }
    ]
  },
  {
    id: 'food-14',
    name: 'Kashmiri Mutton Rogan Josh',
    categoryId: 'cat-8',
    categoryName: 'Main Course – Non-Vegetarian',
    cuisine: 'Kashmiri',
    dietaryType: 'Non-Vegetarian',
    description: 'Slow-braised tender baby mutton in an aromatic crimson gravy infused with ratanjot, Kashmiri chilies and dried ginger.',
    servingSizePerPerson: 180,
    servingUnit: 'g',
    allergenInfo: ['Dairy'],
    foodWastagePct: 5,
    recipeYieldPortions: 10,
    costPerPortion: 125,
    sellingPricePerServing: 260,
    ingredients: [
      { ingredientId: 'ing-9', ingredientName: 'Tender Mutton', quantity: 1.4, unit: 'kg', costPerUnit: 850, subtotal: 1190, prepLossPct: 8 },
      { ingredientId: 'ing-2', ingredientName: 'Desi Ghee', quantity: 0.2, unit: 'kg', costPerUnit: 650, subtotal: 130, prepLossPct: 1 }
    ]
  },

  // 9. Rice & Biryani
  {
    id: 'food-15',
    name: 'Dum Pukht Hyderabadi Chicken Biryani',
    categoryId: 'cat-9',
    categoryName: 'Rice & Biryani',
    cuisine: 'Hyderabadi',
    dietaryType: 'Non-Vegetarian',
    description: 'Aged basmati rice and marinated chicken cooked on slow steam (dum) with saffron, fried onions, and mint.',
    servingSizePerPerson: 250,
    servingUnit: 'g',
    allergenInfo: ['Dairy'],
    foodWastagePct: 5,
    recipeYieldPortions: 10,
    costPerPortion: 72,
    sellingPricePerServing: 165,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-21', ingredientName: 'Royal Basmati Rice', quantity: 1.2, unit: 'kg', costPerUnit: 140, subtotal: 168, prepLossPct: 2 },
      { ingredientId: 'ing-8', ingredientName: 'Chicken Pieces', quantity: 1.3, unit: 'kg', costPerUnit: 290, subtotal: 377, prepLossPct: 5 },
      { ingredientId: 'ing-2', ingredientName: 'Desi Ghee', quantity: 0.15, unit: 'kg', costPerUnit: 650, subtotal: 97.5, prepLossPct: 0 },
      { ingredientId: 'ing-27', ingredientName: 'Kashmir Saffron', quantity: 0.25, unit: 'g', costPerUnit: 280, subtotal: 70, prepLossPct: 0 }
    ]
  },
  {
    id: 'food-16',
    name: 'Subz Awadhi Dum Biryani',
    categoryId: 'cat-9',
    categoryName: 'Rice & Biryani',
    cuisine: 'Awadhi',
    dietaryType: 'Vegetarian',
    description: 'Fluffy long grain basmati layered with crisp seasonal vegetables, paneer cubes, saffron and kewra water.',
    servingSizePerPerson: 220,
    servingUnit: 'g',
    allergenInfo: ['Dairy'],
    foodWastagePct: 5,
    recipeYieldPortions: 10,
    costPerPortion: 45,
    sellingPricePerServing: 110,
    ingredients: [
      { ingredientId: 'ing-21', ingredientName: 'Royal Basmati Rice', quantity: 1.2, unit: 'kg', costPerUnit: 140, subtotal: 168, prepLossPct: 2 },
      { ingredientId: 'ing-1', ingredientName: 'Paneer Cubes', quantity: 0.4, unit: 'kg', costPerUnit: 380, subtotal: 152, prepLossPct: 2 },
      { ingredientId: 'ing-2', ingredientName: 'Desi Ghee', quantity: 0.12, unit: 'kg', costPerUnit: 650, subtotal: 78, prepLossPct: 0 }
    ]
  },

  // 10. Indian Breads
  {
    id: 'food-17',
    name: 'Assorted Gourmet Bread Basket',
    categoryId: 'cat-10',
    categoryName: 'Indian Breads',
    cuisine: 'North Indian',
    dietaryType: 'Vegetarian',
    description: 'Live clay oven baked Butter Naan, Garlic Naan, Laccha Paratha & Missi Roti brushed with desi ghee.',
    servingSizePerPerson: 2,
    servingUnit: 'pcs',
    allergenInfo: ['Gluten', 'Dairy'],
    foodWastagePct: 6,
    recipeYieldPortions: 10,
    costPerPortion: 20,
    sellingPricePerServing: 45,
    ingredients: [
      { ingredientId: 'ing-23', ingredientName: 'Refined Maida', quantity: 1.0, unit: 'kg', costPerUnit: 42, subtotal: 42, prepLossPct: 2 },
      { ingredientId: 'ing-22', ingredientName: 'Sharbati Atta', quantity: 0.6, unit: 'kg', costPerUnit: 48, subtotal: 28.8, prepLossPct: 2 },
      { ingredientId: 'ing-5', ingredientName: 'Butter / Ghee', quantity: 0.25, unit: 'kg', costPerUnit: 520, subtotal: 130, prepLossPct: 1 }
    ]
  },

  // 11. Continental
  {
    id: 'food-18',
    name: 'Tuscan Sun-Dried Tomato Penne Alfredo',
    categoryId: 'cat-11',
    categoryName: 'Continental',
    cuisine: 'Italian',
    dietaryType: 'Vegetarian',
    description: 'Al dente penne pasta tossed in rich parmesan cream sauce with roasted garlic and Mediterranean basil.',
    servingSizePerPerson: 180,
    servingUnit: 'g',
    allergenInfo: ['Gluten', 'Dairy'],
    foodWastagePct: 5,
    recipeYieldPortions: 10,
    costPerPortion: 48,
    sellingPricePerServing: 110,
    ingredients: [
      { ingredientId: 'ing-3', ingredientName: 'Fresh Heavy Cream', quantity: 0.6, unit: 'kg', costPerUnit: 280, subtotal: 168, prepLossPct: 2 },
      { ingredientId: 'ing-5', ingredientName: 'Butter', quantity: 0.2, unit: 'kg', costPerUnit: 520, subtotal: 104, prepLossPct: 1 }
    ]
  },

  // 12. Chinese
  {
    id: 'food-19',
    name: 'Wok-Tossed Hakka Noodles & Chili Garlic Paneer',
    categoryId: 'cat-12',
    categoryName: 'Chinese',
    cuisine: 'Pan-Asian',
    dietaryType: 'Vegetarian',
    description: 'Springy eggless noodles wok-tossed with shredded scallions, bell peppers, soy, accompanied by chili paneer.',
    servingSizePerPerson: 200,
    servingUnit: 'g',
    allergenInfo: ['Gluten', 'Soy', 'Dairy'],
    foodWastagePct: 5,
    recipeYieldPortions: 10,
    costPerPortion: 42,
    sellingPricePerServing: 95,
    ingredients: [
      { ingredientId: 'ing-1', ingredientName: 'Fresh Paneer', quantity: 0.6, unit: 'kg', costPerUnit: 380, subtotal: 228, prepLossPct: 2 },
      { ingredientId: 'ing-18', ingredientName: 'Bell Peppers', quantity: 0.6, unit: 'kg', costPerUnit: 110, subtotal: 66, prepLossPct: 6 }
    ]
  },

  // 13. Desserts
  {
    id: 'food-20',
    name: 'Royal Kesaria Moong Dal Halwa',
    categoryId: 'cat-13',
    categoryName: 'Desserts',
    cuisine: 'Rajasthani',
    dietaryType: 'Vegetarian',
    description: 'Decadent yellow lentil pudding slow-roasted in pure cow ghee for 3 hours, laced with saffron, mawa & pistachios.',
    servingSizePerPerson: 100,
    servingUnit: 'g',
    allergenInfo: ['Dairy', 'Nuts'],
    foodWastagePct: 3,
    recipeYieldPortions: 10,
    costPerPortion: 46,
    sellingPricePerServing: 95,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-24', ingredientName: 'Yellow Moong Dal', quantity: 0.6, unit: 'kg', costPerUnit: 145, subtotal: 87, prepLossPct: 2 },
      { ingredientId: 'ing-2', ingredientName: 'Pure Desi Ghee', quantity: 0.4, unit: 'kg', costPerUnit: 650, subtotal: 260, prepLossPct: 0 },
      { ingredientId: 'ing-6', ingredientName: 'Mawa / Khoya', quantity: 0.25, unit: 'kg', costPerUnit: 340, subtotal: 85, prepLossPct: 1 },
      { ingredientId: 'ing-27', ingredientName: 'Kashmir Saffron', quantity: 0.1, unit: 'g', costPerUnit: 280, subtotal: 28, prepLossPct: 0 }
    ]
  },
  {
    id: 'food-21',
    name: 'Angoori Rasmalai with Pistachio Rabdi',
    categoryId: 'cat-13',
    categoryName: 'Desserts',
    cuisine: 'Bengali',
    dietaryType: 'Vegetarian',
    description: 'Tender cottage cheese sponge dumplings immersed in thickened saffron-cardamom milk syrup.',
    servingSizePerPerson: 100,
    servingUnit: 'g',
    allergenInfo: ['Dairy', 'Nuts'],
    foodWastagePct: 3,
    recipeYieldPortions: 10,
    costPerPortion: 40,
    sellingPricePerServing: 90,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-4', ingredientName: 'Full Cream Milk', quantity: 2.5, unit: 'l', costPerUnit: 68, subtotal: 170, prepLossPct: 3 },
      { ingredientId: 'ing-28', ingredientName: 'Pistachios & Almonds', quantity: 0.15, unit: 'kg', costPerUnit: 720, subtotal: 108, prepLossPct: 1 },
      { ingredientId: 'ing-29', ingredientName: 'Refined Sugar', quantity: 0.4, unit: 'kg', costPerUnit: 45, subtotal: 18, prepLossPct: 1 }
    ]
  },

  // 14. Ice Cream
  {
    id: 'food-22',
    name: 'Artisanal Malai Kulfi with Falooda & Rose Caviar',
    categoryId: 'cat-14',
    categoryName: 'Ice Cream',
    cuisine: 'Fusion',
    dietaryType: 'Vegetarian',
    description: 'Traditional slow-reduced pot kulfi served on a bed of silky cornstarch noodles and organic rose syrup.',
    servingSizePerPerson: 90,
    servingUnit: 'g',
    allergenInfo: ['Dairy', 'Nuts'],
    foodWastagePct: 2,
    recipeYieldPortions: 10,
    costPerPortion: 35,
    sellingPricePerServing: 80,
    ingredients: [
      { ingredientId: 'ing-32', ingredientName: 'Ice Cream / Kulfi Base', quantity: 1.0, unit: 'l', costPerUnit: 180, subtotal: 180, prepLossPct: 2 },
      { ingredientId: 'ing-28', ingredientName: 'Dry Fruits', quantity: 0.15, unit: 'kg', costPerUnit: 720, subtotal: 108, prepLossPct: 1 }
    ]
  },

  // 15. Live Counters
  {
    id: 'food-23',
    name: 'Live Purani Dilli Chaat Station',
    categoryId: 'cat-15',
    categoryName: 'Live Counters',
    cuisine: 'North Indian',
    dietaryType: 'Vegetarian',
    description: 'Interactive counter serving crispy Golgappas with 5 flavored waters, Aloo Tikki Chhole & Dahi Papdi Chaat.',
    servingSizePerPerson: 180,
    servingUnit: 'g',
    allergenInfo: ['Gluten', 'Dairy'],
    foodWastagePct: 7,
    recipeYieldPortions: 10,
    costPerPortion: 42,
    sellingPricePerServing: 110,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-20', ingredientName: 'Potatoes', quantity: 1.5, unit: 'kg', costPerUnit: 28, subtotal: 42, prepLossPct: 10 },
      { ingredientId: 'ing-7', ingredientName: 'Sweet Curd', quantity: 1.2, unit: 'kg', costPerUnit: 75, subtotal: 90, prepLossPct: 5 }
    ]
  },

  // 16. Snacks
  {
    id: 'food-24',
    name: 'Cocktail Paneer Corn Cigars & Tartlets',
    categoryId: 'cat-16',
    categoryName: 'Snacks',
    cuisine: 'Continental',
    dietaryType: 'Vegetarian',
    description: 'Crispy golden pastry rolls stuffed with creamy spiced paneer and sweet corn, served with sweet chili dip.',
    servingSizePerPerson: 80,
    servingUnit: 'g',
    allergenInfo: ['Gluten', 'Dairy'],
    foodWastagePct: 4,
    recipeYieldPortions: 10,
    costPerPortion: 28,
    sellingPricePerServing: 65,
    ingredients: [
      { ingredientId: 'ing-1', ingredientName: 'Fresh Paneer', quantity: 0.4, unit: 'kg', costPerUnit: 380, subtotal: 152, prepLossPct: 2 },
      { ingredientId: 'ing-23', ingredientName: 'Pastry Sheets / Maida', quantity: 0.5, unit: 'kg', costPerUnit: 42, subtotal: 21, prepLossPct: 2 }
    ]
  },

  // 17. Tea & Coffee
  {
    id: 'food-25',
    name: 'Live South Indian Filter Coffee & Masala Chai Bar',
    categoryId: 'cat-17',
    categoryName: 'Tea & Coffee',
    cuisine: 'South Indian',
    dietaryType: 'Vegetarian',
    description: 'Steaming frothy Chikmagalur peaberry filter coffee and kulhad ginger-cardamom cutting chai.',
    servingSizePerPerson: 120,
    servingUnit: 'ml',
    allergenInfo: ['Dairy'],
    foodWastagePct: 3,
    recipeYieldPortions: 10,
    costPerPortion: 16,
    sellingPricePerServing: 40,
    isPopular: true,
    ingredients: [
      { ingredientId: 'ing-4', ingredientName: 'Full Cream Milk', quantity: 1.5, unit: 'l', costPerUnit: 68, subtotal: 102, prepLossPct: 2 },
      { ingredientId: 'ing-29', ingredientName: 'Sugar', quantity: 0.25, unit: 'kg', costPerUnit: 45, subtotal: 11.25, prepLossPct: 1 }
    ]
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Aditya & Ritu Verma',
    companyName: 'Verma Grand Wedding',
    phone: '+91 98201 99887',
    email: 'aditya.verma@gmail.com',
    address: 'Indiranagar 100ft Road, Bengaluru',
    notes: 'Premium wedding reception, VIP dignitaries attending, strictly royal aesthetics.',
    totalEventsCount: 2,
    createdAt: '2026-01-15'
  },
  {
    id: 'cli-2',
    name: 'Vikram Singhania',
    companyName: 'NexGen Cloud Technologies Ltd',
    phone: '+91 99401 22334',
    email: 'v.singhania@nexgencloud.io',
    address: 'EcoWorld Tech Park, Bellandur, Bengaluru',
    notes: 'Annual Global Leadership Summit, packed schedule, buffet with swift flow.',
    totalEventsCount: 3,
    createdAt: '2026-02-10'
  },
  {
    id: 'cli-3',
    name: 'Pooja Hegde & Family',
    companyName: 'Hegde Residence',
    phone: '+91 97312 44556',
    email: 'pooja.hegde@yahoo.com',
    address: 'Sadashivanagar, Bengaluru',
    notes: '50th Golden Jubilee Birthday Celebrations, live counters preferred.',
    totalEventsCount: 1,
    createdAt: '2026-03-01'
  }
];

export const INITIAL_MENU_TEMPLATES: MenuTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Grand Royal Wedding Feast (14 Course)',
    eventType: 'Wedding',
    description: 'An opulent multi-cuisine royal banquet with live chaat, signature kebabs, rich gravies and artisanal desserts.',
    recommendedGuestsMin: 200,
    recommendedGuestsMax: 2000,
    itemIds: ['food-1', 'food-7', 'food-9', 'food-10', 'food-11', 'food-12', 'food-13', 'food-15', 'food-16', 'food-17', 'food-20', 'food-21', 'food-23', 'food-25'],
    estimatedCostPerGuest: 680
  },
  {
    id: 'tpl-2',
    name: 'Executive Corporate Conference Lunch',
    eventType: 'Corporate event',
    description: 'Crisp, nutritious and professionally curated luncheon tailored for swift executive dining.',
    recommendedGuestsMin: 50,
    recommendedGuestsMax: 800,
    itemIds: ['food-2', 'food-5', 'food-6', 'food-7', 'food-11', 'food-12', 'food-16', 'food-17', 'food-18', 'food-21', 'food-25'],
    estimatedCostPerGuest: 420
  },
  {
    id: 'tpl-3',
    name: 'Fun & Festive Birthday Carnival Buffet',
    eventType: 'Birthday',
    description: 'Youthful crowd-pleasers with live chaat station, paneer tikka, penne alfredo, hakka noodles and kulfi.',
    recommendedGuestsMin: 30,
    recommendedGuestsMax: 300,
    itemIds: ['food-3', 'food-7', 'food-8', 'food-18', 'food-19', 'food-22', 'food-23', 'food-24'],
    estimatedCostPerGuest: 350
  }
];

export const INITIAL_EVENTS: EventRecord[] = [
  {
    id: 'evt-101',
    name: 'Royal Heritage Wedding & Reception',
    clientId: 'cli-1',
    clientName: 'Aditya & Ritu Verma',
    clientPhone: '+91 98201 99887',
    clientEmail: 'aditya.verma@gmail.com',
    eventDate: '2026-12-18',
    eventLocation: 'The Leela Palace Ballroom, Bengaluru',
    category: 'Wedding',
    guestCount: 500,
    adultsCount: 450,
    childrenCount: 50,
    eventDurationHours: 6,
    serviceStyle: 'Buffet',
    foodCounters: 6,
    specialDietaryRequirements: '25 Jain guests, 10 Nut allergies (labeled separate counter).',
    eventNotes: 'Royal welcome drink upon guest entry. Ensure live chaat counter starts at 6:30 PM sharp.',
    status: 'Confirmed',
    menu: [
      {
        itemId: 'food-1',
        name: 'Royal Kesaria Thandai',
        categoryName: 'Welcome Drinks',
        dietaryType: 'Vegetarian',
        cuisine: 'North Indian',
        servingSize: 180,
        servingUnit: 'ml',
        consumptionRate: 0.95,
        bufferPct: 0.05,
        wastagePct: 0.04,
        requiredQty: 85500,
        productionQty: 89775,
        purchaseQty: 93366,
        unitCost: 32,
        totalCost: 15960,
        sellingPrice: 65
      },
      {
        itemId: 'food-7',
        name: 'Paneer Tikka Angara',
        categoryName: 'Starters – Vegetarian',
        dietaryType: 'Vegetarian',
        cuisine: 'North Indian',
        servingSize: 120,
        servingUnit: 'g',
        consumptionRate: 0.90,
        bufferPct: 0.05,
        wastagePct: 0.06,
        requiredQty: 54000,
        productionQty: 56700,
        purchaseQty: 60102,
        unitCost: 58,
        totalCost: 27405,
        sellingPrice: 130
      },
      {
        itemId: 'food-9',
        name: 'Bhatti Da Murgh Tandoori',
        categoryName: 'Starters – Non-Vegetarian',
        dietaryType: 'Non-Vegetarian',
        cuisine: 'North Indian',
        servingSize: 150,
        servingUnit: 'g',
        consumptionRate: 0.75,
        bufferPct: 0.05,
        wastagePct: 0.06,
        requiredQty: 56250,
        productionQty: 59062,
        purchaseQty: 62606,
        unitCost: 65,
        totalCost: 25593,
        sellingPrice: 150
      },
      {
        itemId: 'food-11',
        name: 'Paneer Lababdar',
        categoryName: 'Main Course – Vegetarian',
        dietaryType: 'Vegetarian',
        cuisine: 'North Indian',
        servingSize: 180,
        servingUnit: 'g',
        consumptionRate: 0.85,
        bufferPct: 0.05,
        wastagePct: 0.06,
        requiredQty: 76500,
        productionQty: 80325,
        purchaseQty: 85144,
        unitCost: 62,
        totalCost: 27667,
        sellingPrice: 140
      },
      {
        itemId: 'food-13',
        name: 'Old Delhi Butter Chicken',
        categoryName: 'Main Course – Non-Vegetarian',
        dietaryType: 'Non-Vegetarian',
        cuisine: 'North Indian',
        servingSize: 180,
        servingUnit: 'g',
        consumptionRate: 0.70,
        bufferPct: 0.05,
        wastagePct: 0.05,
        requiredQty: 63000,
        productionQty: 66150,
        purchaseQty: 69457,
        unitCost: 78,
        totalCost: 28665,
        sellingPrice: 175
      },
      {
        itemId: 'food-15',
        name: 'Dum Pukht Hyderabadi Chicken Biryani',
        categoryName: 'Rice & Biryani',
        dietaryType: 'Non-Vegetarian',
        cuisine: 'Hyderabadi',
        servingSize: 250,
        servingUnit: 'g',
        consumptionRate: 0.70,
        bufferPct: 0.05,
        wastagePct: 0.05,
        requiredQty: 87500,
        productionQty: 91875,
        purchaseQty: 96468,
        unitCost: 72,
        totalCost: 26460,
        sellingPrice: 165
      },
      {
        itemId: 'food-17',
        name: 'Assorted Gourmet Bread Basket',
        categoryName: 'Indian Breads',
        dietaryType: 'Vegetarian',
        cuisine: 'North Indian',
        servingSize: 2,
        servingUnit: 'pcs',
        consumptionRate: 0.90,
        bufferPct: 0.05,
        wastagePct: 0.06,
        requiredQty: 900,
        productionQty: 945,
        purchaseQty: 1001,
        unitCost: 20,
        totalCost: 9450,
        sellingPrice: 45
      },
      {
        itemId: 'food-20',
        name: 'Royal Kesaria Moong Dal Halwa',
        categoryName: 'Desserts',
        dietaryType: 'Vegetarian',
        cuisine: 'Rajasthani',
        servingSize: 100,
        servingUnit: 'g',
        consumptionRate: 0.85,
        bufferPct: 0.05,
        wastagePct: 0.03,
        requiredQty: 42500,
        productionQty: 44625,
        purchaseQty: 45963,
        unitCost: 46,
        totalCost: 20527,
        sellingPrice: 95
      }
    ],
    operationalCosts: [
      { id: 'op-1', category: 'Chef charges', description: 'Executive Head Chef & 2 Sous Chefs (Event Day)', quantity: 3, unit: 'staff', unitRate: 8000, totalAmount: 24000 },
      { id: 'op-2', category: 'Kitchen staff', description: 'Prep cooks & tandoor masters', quantity: 8, unit: 'staff', unitRate: 2500, totalAmount: 20000 },
      { id: 'op-3', category: 'Service staff', description: 'Uniformed buffet service captains & stewards', quantity: 18, unit: 'staff', unitRate: 2000, totalAmount: 36000 },
      { id: 'op-4', category: 'Event managers', description: 'Floor catering supervisor & VIP coordinator', quantity: 2, unit: 'staff', unitRate: 5000, totalAmount: 10000 },
      { id: 'op-5', category: 'Transportation', description: 'Refrigerated trucks & logistics to venue', quantity: 2, unit: 'vehicles', unitRate: 6000, totalAmount: 12000 },
      { id: 'op-6', category: 'Equipment rental', description: 'Chafing dishes, live tandoor units, carving stations', quantity: 6, unit: 'sets', unitRate: 4000, totalAmount: 24000 },
      { id: 'op-7', category: 'Crockery and cutlery', description: 'Fine bone china plates, brassware & gold cutlery', quantity: 500, unit: 'sets', unitRate: 40, totalAmount: 20000 },
      { id: 'op-8', category: 'Miscellaneous expenses', description: 'Fuel, dry ice, hygiene kits, disposable aprons', quantity: 1, unit: 'lumpsum', unitRate: 8000, totalAmount: 8000 }
    ],
    pricing: {
      strategy: 'target_margin',
      subtotalFoodCost: 181667,
      subtotalOperationalCost: 154000,
      subtotalCost: 335667,
      contingencyPct: 5,
      contingencyAmount: 16783.35,
      taxRatePct: 5,
      taxAmount: 25175.02,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      grandTotalCost: 352450.35,
      targetProfitMarginPct: 30,
      sellingPrice: 528675.52,
      grossProfit: 151050.15,
      profitMarginPct: 30.0,
      costPerGuest: 704.90,
      sellingPricePerGuest: 1057.35,
      foodCostPct: 36.08
    },
    createdAt: '2026-10-10',
    updatedAt: '2026-11-15'
  },
  {
    id: 'evt-102',
    name: 'NexGen Annual Global Tech Summit Lunch',
    clientId: 'cli-2',
    clientName: 'Vikram Singhania',
    clientPhone: '+91 99401 22334',
    clientEmail: 'v.singhania@nexgencloud.io',
    eventDate: '2026-12-05',
    eventLocation: 'Convention Center, Whitefield, Bengaluru',
    category: 'Corporate event',
    guestCount: 300,
    adultsCount: 300,
    childrenCount: 0,
    eventDurationHours: 4,
    serviceStyle: 'Buffet',
    foodCounters: 4,
    specialDietaryRequirements: '30 Vegan options clearly demarcated, Gluten free pasta station.',
    eventNotes: 'Fast paced corporate luncheon. Two identical buffet lines to avoid queuing.',
    status: 'Quotation Sent',
    menu: [
      {
        itemId: 'food-2',
        name: 'Fresh Mint & Lychee Spritzer',
        categoryName: 'Welcome Drinks',
        dietaryType: 'Vegan',
        cuisine: 'Fusion',
        servingSize: 200,
        servingUnit: 'ml',
        consumptionRate: 0.90,
        bufferPct: 0.05,
        wastagePct: 0.03,
        requiredQty: 54000,
        productionQty: 56700,
        purchaseQty: 58401,
        unitCost: 22,
        totalCost: 6237,
        sellingPrice: 50
      },
      {
        itemId: 'food-7',
        name: 'Paneer Tikka Angara',
        categoryName: 'Starters – Vegetarian',
        dietaryType: 'Vegetarian',
        cuisine: 'North Indian',
        servingSize: 120,
        servingUnit: 'g',
        consumptionRate: 0.90,
        bufferPct: 0.05,
        wastagePct: 0.06,
        requiredQty: 32400,
        productionQty: 34020,
        purchaseQty: 36061,
        unitCost: 58,
        totalCost: 16443,
        sellingPrice: 130
      },
      {
        itemId: 'food-11',
        name: 'Paneer Lababdar',
        categoryName: 'Main Course – Vegetarian',
        dietaryType: 'Vegetarian',
        cuisine: 'North Indian',
        servingSize: 180,
        servingUnit: 'g',
        consumptionRate: 0.80,
        bufferPct: 0.05,
        wastagePct: 0.06,
        requiredQty: 43200,
        productionQty: 45360,
        purchaseQty: 48081,
        unitCost: 62,
        totalCost: 15624,
        sellingPrice: 140
      },
      {
        itemId: 'food-12',
        name: 'Dal Makhani Bukhara Style',
        categoryName: 'Main Course – Vegetarian',
        dietaryType: 'Vegetarian',
        cuisine: 'North Indian',
        servingSize: 150,
        servingUnit: 'g',
        consumptionRate: 0.85,
        bufferPct: 0.05,
        wastagePct: 0.04,
        requiredQty: 38250,
        productionQty: 40162,
        purchaseQty: 41768,
        unitCost: 38,
        totalCost: 10174,
        sellingPrice: 95
      },
      {
        itemId: 'food-18',
        name: 'Tuscan Sun-Dried Tomato Penne Alfredo',
        categoryName: 'Continental',
        dietaryType: 'Vegetarian',
        cuisine: 'Italian',
        servingSize: 180,
        servingUnit: 'g',
        consumptionRate: 0.75,
        bufferPct: 0.05,
        wastagePct: 0.05,
        requiredQty: 40500,
        productionQty: 42525,
        purchaseQty: 44651,
        unitCost: 48,
        totalCost: 11340,
        sellingPrice: 110
      },
      {
        itemId: 'food-21',
        name: 'Angoori Rasmalai with Pistachio Rabdi',
        categoryName: 'Desserts',
        dietaryType: 'Vegetarian',
        cuisine: 'Bengali',
        servingSize: 100,
        servingUnit: 'g',
        consumptionRate: 0.90,
        bufferPct: 0.05,
        wastagePct: 0.03,
        requiredQty: 27000,
        productionQty: 28350,
        purchaseQty: 29200,
        unitCost: 40,
        totalCost: 11340,
        sellingPrice: 90
      }
    ],
    operationalCosts: [
      { id: 'op-1', category: 'Chef charges', description: 'Head Chef & Continental Chef', quantity: 2, unit: 'staff', unitRate: 6000, totalAmount: 12000 },
      { id: 'op-2', category: 'Kitchen staff', description: 'Kitchen prep and dishwashing crew', quantity: 5, unit: 'staff', unitRate: 2000, totalAmount: 10000 },
      { id: 'op-3', category: 'Service staff', description: 'Corporate stewards in business attire', quantity: 12, unit: 'staff', unitRate: 1800, totalAmount: 21600 },
      { id: 'op-4', category: 'Transportation', description: 'Venue logistics & heated hot-boxes', quantity: 1, unit: 'vehicles', unitRate: 5000, totalAmount: 5000 },
      { id: 'op-5', category: 'Equipment rental', description: 'Stainless steel buffet counters & induction warmers', quantity: 4, unit: 'sets', unitRate: 3000, totalAmount: 12000 }
    ],
    pricing: {
      strategy: 'cost_plus',
      subtotalFoodCost: 71158,
      subtotalOperationalCost: 60600,
      subtotalCost: 131758,
      contingencyPct: 5,
      contingencyAmount: 6587.90,
      taxRatePct: 5,
      taxAmount: 9684.21,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      grandTotalCost: 138345.90,
      targetProfitMarginPct: 28,
      sellingPrice: 203368.47,
      grossProfit: 55338.36,
      profitMarginPct: 28.5,
      costPerGuest: 461.15,
      sellingPricePerGuest: 677.90,
      foodCostPct: 36.74
    },
    createdAt: '2026-11-01',
    updatedAt: '2026-11-12'
  }
];
