import {
  EventMenuItem,
  FoodItem,
  Ingredient,
  OperationalCostItem,
  PricingStrategy,
  EventPricingSummary,
  RecipeIngredient,
  UnitOfMeasure,
  ProcurementItem
} from '../types/catering';

/**
 * Standard unit normalization for calculation consistency
 * Grams to Kg, Ml to Liters
 */
export const UnitConverter = {
  toBaseUnit(quantity: number, unit: UnitOfMeasure): { value: number; baseUnit: string } {
    switch (unit) {
      case 'g':
        return { value: quantity / 1000, baseUnit: 'kg' };
      case 'ml':
        return { value: quantity / 1000, baseUnit: 'l' };
      default:
        return { value: quantity, baseUnit: unit };
    }
  },

  formatWithOptimalUnit(quantity: number, unit: UnitOfMeasure): { displayQty: number; displayUnit: UnitOfMeasure } {
    if (unit === 'g' && quantity >= 1000) {
      return { displayQty: Number((quantity / 1000).toFixed(2)), displayUnit: 'kg' };
    }
    if (unit === 'kg' && quantity < 1) {
      return { displayQty: Math.round(quantity * 1000), displayUnit: 'g' };
    }
    if (unit === 'ml' && quantity >= 1000) {
      return { displayQty: Number((quantity / 1000).toFixed(2)), displayUnit: 'l' };
    }
    if (unit === 'l' && quantity < 1) {
      return { displayQty: Math.round(quantity * 1000), displayUnit: 'ml' };
    }
    return { displayQty: Number(quantity.toFixed(2)), displayUnit: unit };
  }
};

/**
 * Calculate recipe cost breakdown
 */
export function calculateRecipeCost(
  ingredients: RecipeIngredient[],
  yieldPortions: number
): { totalRecipeCost: number; costPerPortion: number; ingredientsWithCost: RecipeIngredient[] } {
  const portions = Math.max(1, yieldPortions || 1);
  let totalRecipeCost = 0;

  const ingredientsWithCost = ingredients.map(ing => {
    // Prep loss factor: if prepLossPct is 10%, we need extra to yield the required quantity
    const lossFactor = ing.prepLossPct > 0 ? 1 + (ing.prepLossPct / 100) : 1;
    const effectiveQty = ing.quantity * lossFactor;
    const subtotal = effectiveQty * (ing.costPerUnit || 0);
    totalRecipeCost += subtotal;

    return {
      ...ing,
      subtotal: Number(subtotal.toFixed(2))
    };
  });

  const costPerPortion = totalRecipeCost / portions;

  return {
    totalRecipeCost: Number(totalRecipeCost.toFixed(2)),
    costPerPortion: Number(costPerPortion.toFixed(2)),
    ingredientsWithCost
  };
}

/**
 * Section 4: Smart Food Quantity Calculator Logic
 * Required Quantity = Guest Count × Serving Size × Consumption Rate
 * Production Quantity = Required Quantity × (1 + Buffer Percentage)
 * Purchase Quantity = Production Quantity × (1 + Wastage Percentage)
 */
export function calculateItemQuantities(
  guestCount: number,
  servingSize: number,
  consumptionRate: number = 1.0, // e.g. 0.85
  bufferPct: number = 0.05,       // e.g. 0.05
  wastagePct: number = 0.08,      // e.g. 0.08
  unitCost: number = 0
): {
  requiredQty: number;
  productionQty: number;
  purchaseQty: number;
  totalCost: number;
} {
  const guests = Math.max(0, guestCount || 0);
  const size = Math.max(0, servingSize || 0);
  const consumption = Math.max(0, consumptionRate);
  const buffer = Math.max(0, bufferPct);
  const wastage = Math.max(0, wastagePct);

  // 1. Required Quantity
  const requiredQty = guests * size * consumption;

  // 2. Production Quantity = Required Quantity * (1 + Buffer)
  const productionQty = requiredQty * (1 + buffer);

  // 3. Purchase Quantity = Production Quantity * (1 + Wastage)
  const purchaseQty = productionQty * (1 + wastage);

  // 4. Total Cost = Production portion count * unit cost
  // If unit is in grams or ml, portion count is guests * consumption * (1 + buffer)
  const totalCost = (guests * consumption * (1 + buffer)) * unitCost;

  return {
    requiredQty: Number(requiredQty.toFixed(2)),
    productionQty: Number(productionQty.toFixed(2)),
    purchaseQty: Number(purchaseQty.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2))
  };
}

/**
 * Create or recalculate an EventMenuItem from a FoodItem and Event parameters
 */
export function createEventMenuItem(
  foodItem: FoodItem,
  guestCount: number,
  overrides?: {
    consumptionRate?: number;
    bufferPct?: number;
    wastagePct?: number;
    sellingPrice?: number;
  }
): EventMenuItem {
  const consumptionRate = overrides?.consumptionRate ?? 0.90; // 90% typical consumption
  const bufferPct = overrides?.bufferPct ?? 0.05; // 5% buffer
  const wastagePct = overrides?.wastagePct ?? (foodItem.foodWastagePct / 100);

  const calc = calculateItemQuantities(
    guestCount,
    foodItem.servingSizePerPerson,
    consumptionRate,
    bufferPct,
    wastagePct,
    foodItem.costPerPortion
  );

  return {
    itemId: foodItem.id,
    name: foodItem.name,
    categoryName: foodItem.categoryName,
    dietaryType: foodItem.dietaryType,
    cuisine: foodItem.cuisine,
    servingSize: foodItem.servingSizePerPerson,
    servingUnit: foodItem.servingUnit,
    consumptionRate,
    bufferPct,
    wastagePct,
    requiredQty: calc.requiredQty,
    productionQty: calc.productionQty,
    purchaseQty: calc.purchaseQty,
    unitCost: foodItem.costPerPortion,
    totalCost: calc.totalCost,
    sellingPrice: overrides?.sellingPrice ?? foodItem.sellingPricePerServing
  };
}

/**
 * Section 6 & 7: Event Cost Estimation & Advanced Pricing Engine
 */
export function calculateEventFinancials(params: {
  guestCount: number;
  menuItems: EventMenuItem[];
  operationalCosts: OperationalCostItem[];
  pricingStrategy: PricingStrategy;
  contingencyPct: number; // e.g. 5%
  taxRatePct: number;     // e.g. 5% or 18%
  targetProfitMarginPct: number; // e.g. 30%
  costPlusMarkupPct?: number;   // e.g. 40%
  perPlateRate?: number;        // e.g. 450 per guest
  packagePrice?: number;        // e.g. fixed package 150000
  customSellingPrice?: number;  // manual quote override
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
}): EventPricingSummary {
  const guests = Math.max(1, params.guestCount || 1);

  // A. Total Food Cost = Sum of all menu item production costs
  const subtotalFoodCost = params.menuItems.reduce((acc, item) => acc + (item.totalCost || 0), 0);

  // B. Total Operational Cost = Sum of all operational expenses
  const subtotalOperationalCost = params.operationalCosts.reduce((acc, op) => acc + (op.totalAmount || 0), 0);

  // C. Subtotal = Food Cost + Operational Cost
  const subtotalCost = subtotalFoodCost + subtotalOperationalCost;

  // D. Contingency = Subtotal * Contingency Percentage
  const contingencyPct = Math.max(0, params.contingencyPct || 0);
  const contingencyAmount = subtotalCost * (contingencyPct / 100);

  // Calculate base cost before tax & discounts
  const baseTotalCost = subtotalCost + contingencyAmount;

  // E. Determine Selling Price according to pricing strategy
  let targetSellingPrice = 0;
  const targetMargin = Math.min(95, Math.max(0, params.targetProfitMarginPct || 30));

  switch (params.pricingStrategy) {
    case 'target_margin':
      // Formula: Selling Price = Total Cost / (1 - Target Margin)
      // When margin is 30%, selling price = cost / 0.70
      targetSellingPrice = baseTotalCost / (1 - targetMargin / 100);
      break;

    case 'cost_plus': {
      // Formula: Selling Price = Total Cost * (1 + Markup %)
      const markup = params.costPlusMarkupPct ?? 40;
      targetSellingPrice = baseTotalCost * (1 + markup / 100);
      break;
    }

    case 'per_plate': {
      // Formula: Selling Price = Per Plate Rate * Guest Count
      const rate = params.perPlateRate ?? (baseTotalCost / guests * 1.35);
      targetSellingPrice = rate * guests;
      break;
    }

    case 'package':
      targetSellingPrice = params.packagePrice ?? baseTotalCost * 1.35;
      break;

    case 'custom':
      targetSellingPrice = params.customSellingPrice ?? baseTotalCost * 1.30;
      break;

    default:
      targetSellingPrice = baseTotalCost / (1 - targetMargin / 100);
  }

  // F. Discounts
  const discountType = params.discountType || 'percentage';
  const discountVal = Math.max(0, params.discountValue || 0);
  let discountAmount = 0;

  if (discountType === 'percentage') {
    discountAmount = targetSellingPrice * (discountVal / 100);
  } else {
    discountAmount = Math.min(targetSellingPrice, discountVal);
  }

  const discountedSellingPrice = Math.max(0, targetSellingPrice - discountAmount);

  // G. Taxes: Tax = Taxable Amount * Tax Rate
  const taxRatePct = Math.max(0, params.taxRatePct || 0);
  const taxAmount = (discountedSellingPrice) * (taxRatePct / 100);

  // Final selling price to client includes tax
  const finalSellingPrice = discountedSellingPrice + taxAmount;

  // Grand total estimated cost to the caterer (operational + food + contingency)
  const grandTotalCost = baseTotalCost;

  // Expected Gross Profit (pre-tax revenue minus base costs)
  const grossProfit = discountedSellingPrice - grandTotalCost;

  // Profit Margin Percentage = (Gross Profit / Discounted Selling Price) * 100
  const profitMarginPct = discountedSellingPrice > 0
    ? (grossProfit / discountedSellingPrice) * 100
    : 0;

  // Cost per guest & Selling price per guest
  const costPerGuest = grandTotalCost / guests;
  const sellingPricePerGuest = finalSellingPrice / guests;

  // Food Cost Percentage = (Total Food Cost / Discounted Selling Price) * 100
  const foodCostPct = discountedSellingPrice > 0
    ? (subtotalFoodCost / discountedSellingPrice) * 100
    : 0;

  return {
    strategy: params.pricingStrategy,
    subtotalFoodCost: Number(subtotalFoodCost.toFixed(2)),
    subtotalOperationalCost: Number(subtotalOperationalCost.toFixed(2)),
    subtotalCost: Number(subtotalCost.toFixed(2)),
    contingencyPct,
    contingencyAmount: Number(contingencyAmount.toFixed(2)),
    taxRatePct,
    taxAmount: Number(taxAmount.toFixed(2)),
    discountType,
    discountValue: discountVal,
    discountAmount: Number(discountAmount.toFixed(2)),
    grandTotalCost: Number(grandTotalCost.toFixed(2)),
    targetProfitMarginPct: targetMargin,
    sellingPrice: Number(finalSellingPrice.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    profitMarginPct: Number(profitMarginPct.toFixed(2)),
    costPerGuest: Number(costPerGuest.toFixed(2)),
    sellingPricePerGuest: Number(sellingPricePerGuest.toFixed(2)),
    foodCostPct: Number(foodCostPct.toFixed(2))
  };
}

/**
 * Section 8: Auto-generate Procurement List from Event Menu & Inventory
 */
export function generateProcurementList(
  menuItems: EventMenuItem[],
  allFoodItems: FoodItem[],
  inventoryList: Ingredient[]
): ProcurementItem[] {
  const ingredientMap: Record<string, { requiredQty: number; unit: UnitOfMeasure }> = {};

  // Loop through all items selected in event menu
  menuItems.forEach(menuItem => {
    const originalFood = allFoodItems.find(f => f.id === menuItem.itemId);
    if (!originalFood) return;

    // Portions to produce
    const portions = menuItem.productionQty > 0
      ? (menuItem.servingSize > 0 ? menuItem.productionQty / menuItem.servingSize : 1)
      : 1;

    const baseRecipeYield = Math.max(1, originalFood.recipeYieldPortions || 1);
    const scalingFactor = portions / baseRecipeYield;

    originalFood.ingredients.forEach(ri => {
      const needed = ri.quantity * scalingFactor * (1 + (ri.prepLossPct / 100));
      if (!ingredientMap[ri.ingredientId]) {
        ingredientMap[ri.ingredientId] = { requiredQty: 0, unit: ri.unit };
      }
      ingredientMap[ri.ingredientId].requiredQty += needed;
    });
  });

  // Compare with current inventory
  const procurementList: ProcurementItem[] = [];

  Object.entries(ingredientMap).forEach(([ingId, data]) => {
    const stockItem = inventoryList.find(i => i.id === ingId);
    const name = stockItem ? stockItem.name : 'Unknown Ingredient';
    const category = stockItem ? stockItem.category : 'General';
    const unit = stockItem ? stockItem.purchaseUnit : data.unit;
    const unitPrice = stockItem ? stockItem.currentMarketPrice : 0;
    const stockQty = stockItem ? stockItem.stockQuantity : 0;
    const requiredQty = Number(data.requiredQty.toFixed(2));

    // To purchase = max(0, required - stock)
    const toPurchaseQty = Number(Math.max(0, requiredQty - stockQty).toFixed(2));
    const estimatedCost = Number((toPurchaseQty * unitPrice).toFixed(2));

    procurementList.push({
      ingredientId: ingId,
      ingredientName: name,
      category,
      purchaseUnit: unit,
      requiredQty,
      stockQty,
      toPurchaseQty,
      unitPrice,
      estimatedCost,
      supplierName: stockItem?.supplierName
    });
  });

  return procurementList.sort((a, b) => b.estimatedCost - a.estimatedCost);
}

/**
 * Format currency helper
 */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  if (isNaN(amount) || amount === null || amount === undefined) return `${symbol}0.00`;
  return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
