import { EventRecord, Ingredient } from '../types/catering';

export const ExportService = {
  /**
   * Export array of objects to CSV file
   */
  exportToCsv(filename: string, rows: Record<string, unknown>[]): void {
    if (!rows || !rows.length) return;

    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map(row => {
          return keys
            .map(k => {
              const val = row[k];
              let cellStr = val === null || val === undefined ? '' : String(val);
              cellStr = cellStr.replace(/"/g, '""');
              if (cellStr.search(/("|,|\n)/g) >= 0) {
                cellStr = `"${cellStr}"`;
              }
              return cellStr;
            })
            .join(separator);
        })
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportEventsReport(events: EventRecord[]): void {
    const data = events.map(e => ({
      Event_ID: e.id,
      Event_Name: e.name,
      Client: e.clientName,
      Date: e.eventDate,
      Category: e.category,
      Guests: e.guestCount,
      Service_Style: e.serviceStyle,
      Status: e.status,
      Food_Cost: e.pricing.subtotalFoodCost,
      Operational_Cost: e.pricing.subtotalOperationalCost,
      Grand_Total_Cost: e.pricing.grandTotalCost,
      Quotation_Amount: e.pricing.sellingPrice,
      Gross_Profit: e.pricing.grossProfit,
      Profit_Margin_Pct: e.pricing.profitMarginPct.toFixed(1) + '%',
      Cost_Per_Guest: e.pricing.costPerGuest.toFixed(1),
      Selling_Per_Guest: e.pricing.sellingPricePerGuest.toFixed(1)
    }));
    this.exportToCsv('CaterPro_Events_Costing_Report', data);
  },

  exportInventoryReport(inventory: Ingredient[]): void {
    const data = inventory.map(i => ({
      Item_ID: i.id,
      Ingredient: i.name,
      Category: i.category,
      Unit: i.purchaseUnit,
      Current_Market_Price: i.currentMarketPrice,
      Last_Purchase_Price: i.lastPurchasePrice,
      Stock_Quantity: i.stockQuantity,
      Min_Stock_Level: i.minStockLevel,
      Supplier: i.supplierName || 'N/A',
      Stock_Value: (i.stockQuantity * i.currentMarketPrice).toFixed(2),
      Status: i.stockQuantity <= i.minStockLevel ? 'LOW STOCK' : 'Adequate'
    }));
    this.exportToCsv('CaterPro_Ingredient_Inventory_Report', data);
  }
};
