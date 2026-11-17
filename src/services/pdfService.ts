import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Quotation, EventRecord, CompanySettings } from '../types/catering';
import { formatCurrency } from './calculationEngine';

export const PdfService = {
  /**
   * Section 10: Generate Professional Catering Quotation PDF
   */
  generateQuotationPdf(quotation: Quotation, settings: CompanySettings): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [22, 101, 52]; // #166534 Dark Emerald Green
    const secondaryColor = [30, 41, 59]; // Slate 800
    const goldColor = [197, 148, 65];   // Gold

    // Header Banner
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 32, 'F');

    // Company Name & Tagline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(settings.name, 14, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(220, 252, 231);
    doc.text(settings.tagline, 14, 22);
    doc.text(`${settings.phone} | ${settings.email} | ${settings.website}`, 14, 27);

    // Document Title Box (Right aligned)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('EVENT PROPOSAL', 196, 16, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(246, 241, 222);
    doc.text(`Ref: ${quotation.quotationNumber} (v${quotation.version})`, 196, 23, { align: 'right' });

    // Client & Event Details Grid
    let y = 42;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('CLIENT & EVENT INFORMATION', 14, y);

    // Decorative line
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.8);
    doc.line(14, y + 2, 196, y + 2);

    y += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Left Column: Client Details
    doc.text(`Client Name: ${quotation.clientName}`, 14, y);
    doc.text(`Contact: ${quotation.clientPhone}`, 14, y + 5);
    doc.text(`Email: ${quotation.clientEmail}`, 14, y + 10);
    doc.text(`Proposal Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, 14, y + 15);

    // Right Column: Event Details
    doc.text(`Event: ${quotation.eventName}`, 110, y);
    doc.text(`Event Date: ${quotation.eventDate}`, 110, y + 5);
    doc.text(`Service Style: ${quotation.serviceStyle}`, 110, y + 10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Guaranteed Guests: ${quotation.guestCount} Pax`, 110, y + 15);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'normal');

    // Curated Menu Section
    y += 24;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CURATED EVENT MENU', 14, y);
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.line(14, y + 2, 196, y + 2);

    // Prepare table data for Menu
    const menuTableBody = quotation.menuSnapshot.map((item, idx) => [
      idx + 1,
      item.categoryName,
      `${item.name}\n${item.dietaryType} • ${item.cuisine}`,
      `${item.servingSize} ${item.servingUnit}`,
      `${Math.round(item.consumptionRate * 100)}%`,
      formatCurrency(item.sellingPrice, settings.currencySymbol)
    ]);

    autoTable(doc, {
      startY: y + 5,
      head: [['#', 'Category', 'Dish Name & Cuisine', 'Portion Size', 'Consumption', 'Unit Rate']],
      body: menuTableBody,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor as [number, number, number],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 2.5
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 35 },
        2: { cellWidth: 75 },
        3: { cellWidth: 25 },
        4: { cellWidth: 22 },
        5: { cellWidth: 25, halign: 'right' }
      }
    });

    // Financial Summary & Commercials
    // @ts-expect-error autoTable adds lastAutoTable to jsPDF instance
    let finalY = doc.lastAutoTable.finalY + 8;

    // Check if we need a new page
    if (finalY > 220) {
      doc.addPage();
      finalY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('COMMERCIAL ESTIMATE & CHARGES', 14, finalY);
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.line(14, finalY + 2, 196, finalY + 2);

    finalY += 6;
    const p = quotation.pricingSnapshot;

    const financialRows = [
      ['Total Food Menu Cost', formatCurrency(p.subtotalFoodCost, settings.currencySymbol)],
      ['Operational & Manpower Services', formatCurrency(p.subtotalOperationalCost, settings.currencySymbol)],
      ['Subtotal Base Charges', formatCurrency(p.subtotalCost, settings.currencySymbol)],
      [`Contingency Buffer (${p.contingencyPct}%)`, formatCurrency(p.contingencyAmount, settings.currencySymbol)],
      p.discountAmount > 0 ? [`Special Discount (${p.discountValue}%)`, `-${formatCurrency(p.discountAmount, settings.currencySymbol)}`] : null,
      [`Taxes & GST (${p.taxRatePct}%)`, formatCurrency(p.taxAmount, settings.currencySymbol)],
      ['TOTAL QUOTATION AMOUNT (INCL. TAXES)', formatCurrency(p.sellingPrice, settings.currencySymbol)],
      ['ESTIMATED COST PER GUEST', `${formatCurrency(p.sellingPricePerGuest, settings.currencySymbol)} / person`]
    ].filter(Boolean) as string[][];

    autoTable(doc, {
      startY: finalY,
      body: financialRows,
      theme: 'plain',
      styles: {
        fontSize: 9,
        cellPadding: 2
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 130 },
        1: { halign: 'right', cellWidth: 50 }
      },
      didParseCell: (data) => {
        if (data.row.index === financialRows.length - 2 || data.row.index === financialRows.length - 1) {
          data.cell.styles.fillColor = [240, 253, 244]; // Light green tint
          data.cell.styles.textColor = primaryColor as [number, number, number];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    // Terms, Payment & Signature
    // @ts-expect-error autoTable adds lastAutoTable to jsPDF instance
    let termsY = doc.lastAutoTable.finalY + 8;
    if (termsY > 230) {
      doc.addPage();
      termsY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Payment Terms:', 14, termsY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(quotation.paymentTerms || settings.defaultPaymentTerms, 14, termsY + 4, { maxWidth: 180 });

    termsY += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Terms & Conditions:', 14, termsY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    let termOffset = termsY + 4;
    (quotation.termsAndConditions || settings.termsAndConditions).slice(0, 4).forEach((term) => {
      doc.text(`• ${term}`, 14, termOffset, { maxWidth: 180 });
      termOffset += 3.5;
    });

    // Signatures block
    const sigY = termOffset + 12;
    if (sigY < 275) {
      doc.setDrawColor(200, 200, 200);
      doc.line(14, sigY, 70, sigY);
      doc.line(140, sigY, 196, sigY);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Client Acceptance Signature', 14, sigY + 4);
      doc.text('Authorized Signatory (CaterPro)', 140, sigY + 4);
      doc.setFont('helvetica', 'normal');
      doc.text(`Valid Until: ${quotation.validUntil}`, 14, sigY + 8);
      doc.text(quotation.authorizedSignatory, 140, sigY + 8);
    }

    // Save PDF
    doc.save(`${quotation.quotationNumber}_${quotation.clientName.replace(/\s+/g, '_')}.pdf`);
  },

  /**
   * Section 11: Generate Kitchen Production Sheet PDF
   */
  generateProductionSheetPdf(event: EventRecord, settings: CompanySettings): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const navyColor = [15, 23, 42];
    const brandColor = [22, 101, 52];

    // Header Banner
    doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.rect(0, 0, 210, 28, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('KITCHEN & SERVICE PRODUCTION SHEET', 14, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(`CaterPro Operations • Event: ${event.name}`, 14, 21);

    // Event & Service Overview
    let y = 35;
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Date: ${event.eventDate} | Venue: ${event.eventLocation} | Service: ${event.serviceStyle}`, 14, y);
    doc.text(`Total Guests: ${event.guestCount} (Adults: ${event.adultsCount}, Children: ${event.childrenCount}) | Counters: ${event.foodCounters}`, 14, y + 5);

    // Special Dietary banner
    if (event.specialDietaryRequirements) {
      doc.setFillColor(254, 243, 199);
      doc.rect(14, y + 8, 182, 10, 'F');
      doc.setTextColor(180, 83, 9);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text(`ALERT - SPECIAL DIETARY REQUIREMENTS: ${event.specialDietaryRequirements}`, 18, y + 14);
      y += 14;
    }

    y += 10;
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DISH PRODUCTION SCHEDULE & QUANTITIES', 14, y);

    const dishRows = event.menu.map((m, idx) => [
      idx + 1,
      m.name,
      m.categoryName,
      `${m.servingSize} ${m.servingUnit}`,
      `${m.requiredQty.toLocaleString()} ${m.servingUnit}`,
      `${m.productionQty.toLocaleString()} ${m.servingUnit}`,
      `${m.purchaseQty.toLocaleString()} ${m.servingUnit}`,
      `${(m.wastagePct * 100).toFixed(0)}%`
    ]);

    autoTable(doc, {
      startY: y + 3,
      head: [['#', 'Dish Name', 'Category', 'Serving', 'Net Req', 'Prod Qty (+Buf)', 'Procure (+Waste)', 'Waste %']],
      body: dishRows,
      theme: 'grid',
      headStyles: {
        fillColor: brandColor as [number, number, number],
        textColor: 255,
        fontSize: 8.5
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      }
    });

    // Kitchen Schedule & Staff Allocation
    // @ts-expect-error autoTable adds lastAutoTable to jsPDF instance
    let nextY = doc.lastAutoTable.finalY + 8;
    if (nextY > 220) {
      doc.addPage();
      nextY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text('KITCHEN PREPARATION SCHEDULE & TIMELINE', 14, nextY);

    const scheduleRows = [
      ['T - 24 Hours', 'Raw Material Inspection & Marination', 'Cold storage check, spice weighing, meat trimming, soaking dals & rice'],
      ['T - 6 Hours', 'Base Gravies & Deep Frying', 'Makhani gravy, onion-tomato masala, boiling potatoes, stock simmering'],
      ['T - 2 Hours', 'Tandoor & Live Prep', 'Charcoal tandoor lighting, dough resting, salad tossing, chaat station arrangement'],
      ['T - 30 Mins', 'Counter Setup & Temperature Audit', 'Chafing dish heating, warm food loading, garnish addition, hygiene inspection']
    ];

    autoTable(doc, {
      startY: nextY + 3,
      head: [['Timeline', 'Kitchen Milestone', 'Key Actions & Checkpoints']],
      body: scheduleRows,
      theme: 'striped',
      headStyles: {
        fillColor: navyColor as [number, number, number],
        fontSize: 8.5
      },
      styles: { fontSize: 8, cellPadding: 2 }
    });

    doc.save(`Production_Sheet_${event.name.replace(/\s+/g, '_')}_${event.eventDate}.pdf`);
  }
};
