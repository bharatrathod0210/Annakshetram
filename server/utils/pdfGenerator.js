const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const formatCurrency = (amount) => {
  const num = parseFloat(amount || 0).toFixed(2);
  const parts = num.split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `Rs. ${intPart}.${parts[1]}`;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const generateOrderPDF = (order, res) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    info: {
      Title: `Invoice ${order.orderId}`,
      Author: 'Annakshetram',
      Subject: 'Invoice'
    }
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId}.pdf`);

  // Pipe the PDF to the response
  doc.pipe(res);

  const W = 595.28;  // A4 width
  const H = 841.89;  // A4 height
  const M = 40;      // Margin
  const CW = W - M * 2;  // Content width

  // Color Palette - Minimal White Theme
  const C = {
    primary:    '#022363',  // dark gray for headers
    primaryDark: '#022363',
    primaryLight: '#f9fafb',
    accent:     '#16a34a',  // green for highlights only
    white:      '#ffffff',
    textDark:   '#022363',
    textMed:    '#374151',
    textLight:  '#6b7280',
    textFaint:  '#9ca3af',
    border:     '#e5e7eb',
    borderMid:  '#d1d5db',
    rowAlt:     '#f9fafb',
    success:    '#16a34a',
    danger:     '#dc2626',
  };

  // Check if logo exists
  const logoPath = path.join(__dirname, '../uploads/logo.png');
  const hasLogo = fs.existsSync(logoPath);

  let y = 0;

  // ═══════════════════════════════════════════════════════════════
  // HEADER (White background with border)
  // ═══════════════════════════════════════════════════════════════
  const headerH = 100;
  doc.rect(0, 0, W, headerH).fill(C.white);
  doc.rect(0, headerH - 1, W, 1).fill(C.border);

  // Logo
  const logoSize = 60;
  const logoX = M;
  const logoY = Math.floor((headerH - logoSize) / 2);

  if (hasLogo) {
    try {
      doc.image(logoPath, logoX, logoY, {
        width: logoSize,
        height: logoSize,
        fit: [logoSize, logoSize]
      });
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }

  // Business name & taglines
  const bizX = M + logoSize + 16;
  const bizW = W * 0.5 - bizX;

  doc.fontSize(16)
    .fillColor(C.textDark)
    .font('Helvetica-Bold')
    .text('Annakshetram', bizX, logoY + 4, { width: bizW });

  doc.fontSize(7.5)
    .fillColor(C.textLight)
    .font('Helvetica')
    .text('Shuddham Bhojanam', bizX, logoY + 26, { width: bizW })
    .text('Satvikam Jeevanam', bizX, logoY + 37, { width: bizW });

  // INVOICE label (right side)
  const invX = W * 0.6;
  const invW = W - M - invX;

  doc.fontSize(28)
    .fillColor(C.textDark)
    .font('Helvetica-Bold')
    .text('INVOICE', invX, logoY + 2, { width: invW, align: 'right' });

  doc.fontSize(8)
    .fillColor(C.textLight)
    .font('Helvetica')
    .text(`Order ID: ${order.orderId}`, invX, logoY + 38, { width: invW, align: 'right' });

  // Status pill
  const statusMap = {
    pending: { bg: '#f59e0b', label: 'PENDING' },
    confirmed: { bg: '#3b82f6', label: 'CONFIRMED' },
    processing: { bg: '#8b5cf6', label: 'PROCESSING' },
    shipped: { bg: '#6366f1', label: 'SHIPPED' },
    delivered: { bg: '#16a34a', label: 'DELIVERED' },
    cancelled: { bg: '#dc2626', label: 'CANCELLED' },
  };

  const st = statusMap[order.orderStatus] || statusMap.pending;
  const pillW = 70;
  const pillH = 16;
  const pillX = W - M - pillW;
  const pillY = logoY + 56;

  doc.roundedRect(pillX, pillY, pillW, pillH, 8).fill(st.bg);
  doc.fontSize(7)
    .fillColor(C.white)
    .font('Helvetica-Bold')
    .text(st.label, pillX, pillY + 4.5, { width: pillW, align: 'center' });

  y = headerH;

  // ═══════════════════════════════════════════════════════════════
  // META STRIP
  // ═══════════════════════════════════════════════════════════════
  const metaH = 38;
  doc.rect(0, y, W, metaH).fill(C.primaryLight);

  const metaItems = [
    { label: 'Invoice Date', value: formatDate(order.createdAt) },
    { label: 'Payment Status', value: order.paymentStatus.toUpperCase() },
    { label: 'Payment Method', value: order.paymentMethod.toUpperCase() },
    { label: 'Total Items', value: `${order.items.length}` },
  ];

  const mColW = CW / metaItems.length;
  metaItems.forEach((item, i) => {
    const mx = M + i * mColW;
    
    if (i > 0) {
      doc.moveTo(mx, y + 6)
        .lineTo(mx, y + metaH - 6)
        .strokeColor(C.border)
        .lineWidth(0.5)
        .stroke();
    }

    doc.fontSize(6)
      .fillColor(C.textFaint)
      .font('Helvetica')
      .text(item.label.toUpperCase(), mx + 6, y + 7, { width: mColW - 12 });

    doc.fontSize(9)
      .fillColor(C.textDark)
      .font('Helvetica-Bold')
      .text(item.value, mx + 6, y + 18, { width: mColW - 12 });
  });

  y += metaH + 16;

  // ═══════════════════════════════════════════════════════════════
  // BILL TO + PAYMENT SUMMARY
  // ═══════════════════════════════════════════════════════════════
  const boxH = 85;
  const halfW = (CW - 10) / 2;

  // Bill To
  doc.rect(M, y, halfW, boxH)
    .fill(C.white)
    .rect(M, y, halfW, boxH)
    .strokeColor(C.border)
    .lineWidth(0.5)
    .stroke();

  doc.rect(M, y, halfW, 18).fill(C.primary);
  doc.fontSize(7)
    .fillColor(C.white)
    .font('Helvetica-Bold')
    .text('BILL TO', M + 8, y + 5.5);

  doc.fontSize(10)
    .fillColor(C.textDark)
    .font('Helvetica-Bold')
    .text(order.userDetails.name, M + 8, y + 24, { width: halfW - 16 });

  let py = y + 38;
  doc.fontSize(8).fillColor(C.textMed).font('Helvetica');

  if (order.userDetails.phone) {
    doc.text(`Phone: ${order.userDetails.phone}`, M + 8, py, { width: halfW - 16 });
    py += 11;
  }

  if (order.userDetails.email) {
    doc.text(order.userDetails.email, M + 8, py, { width: halfW - 16 });
  }

  // Payment Summary
  const psX = M + halfW + 10;
  doc.rect(psX, y, halfW, boxH)
    .fill(C.white)
    .rect(psX, y, halfW, boxH)
    .strokeColor(C.border)
    .lineWidth(0.5)
    .stroke();

  doc.rect(psX, y, halfW, 18).fill(C.primary);
  doc.fontSize(7)
    .fillColor(C.white)
    .font('Helvetica-Bold')
    .text('PAYMENT SUMMARY', psX + 8, y + 5.5);

  const sumRows = [
    { label: 'Grand Total', value: formatCurrency(order.total), bold: true, color: C.textDark },
    { label: 'Amount Paid', value: formatCurrency(order.paymentStatus === 'completed' ? order.total : 0), bold: false, color: C.success },
    { label: 'Balance Due', value: formatCurrency(order.paymentStatus === 'completed' ? 0 : order.total), bold: true, color: order.paymentStatus === 'completed' ? C.success : C.danger },
  ];

  sumRows.forEach((row, i) => {
    const ry = y + 24 + i * 18;
    
    if (i === sumRows.length - 1) {
      doc.rect(psX + 4, ry - 2, halfW - 8, 16)
        .fill(order.paymentStatus === 'completed' ? '#f0fdf4' : '#fef2f2');
    }

    doc.fontSize(8)
      .fillColor(C.textLight)
      .font('Helvetica')
      .text(row.label, psX + 8, ry, { width: halfW / 2 });

    doc.fontSize(row.bold ? 9 : 8)
      .fillColor(row.color)
      .font(row.bold ? 'Helvetica-Bold' : 'Helvetica')
      .text(row.value, psX + 8, ry, { width: halfW - 16, align: 'right' });
  });

  y += boxH + 16;

  // ═══════════════════════════════════════════════════════════════
  // SHIPPING ADDRESS
  // ═══════════════════════════════════════════════════════════════
  doc.rect(M, y, CW, 70)
    .fill(C.white)
    .rect(M, y, CW, 70)
    .strokeColor(C.border)
    .lineWidth(0.5)
    .stroke();

  doc.rect(M, y, CW, 18).fill(C.primary);
  doc.fontSize(7)
    .fillColor(C.white)
    .font('Helvetica-Bold')
    .text('SHIPPING ADDRESS', M + 8, y + 5.5);

  doc.fontSize(9)
    .fillColor(C.textDark)
    .font('Helvetica-Bold')
    .text(order.shippingAddress.fullName, M + 8, y + 24, { width: CW - 16 });

  let sy = y + 38;
  doc.fontSize(8).fillColor(C.textMed).font('Helvetica');

  doc.text(order.shippingAddress.line1, M + 8, sy, { width: CW - 16 });
  sy += 11;

  if (order.shippingAddress.line2) {
    doc.text(order.shippingAddress.line2, M + 8, sy, { width: CW - 16 });
    sy += 11;
  }

  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`, M + 8, sy, { width: CW - 16 });
  sy += 11;

  doc.text(`Phone: ${order.shippingAddress.phone}`, M + 8, sy, { width: CW - 16 });

  y += 70 + 16;

  // ═══════════════════════════════════════════════════════════════
  // ITEMS TABLE
  // ═══════════════════════════════════════════════════════════════
  const cols = [
    { label: '#', w: 25, align: 'center' },
    { label: 'Item', w: 200, align: 'left' },
    { label: 'Unit', w: 60, align: 'center' },
    { label: 'Qty', w: 40, align: 'center' },
    { label: 'Rate', w: 70, align: 'right' },
    { label: 'Amount', w: 80, align: 'right' },
  ];

  // Scale columns
  const rawTotal = cols.reduce((s, c) => s + c.w, 0);
  const sc = CW / rawTotal;
  cols.forEach(c => { c.w = Math.floor(c.w * sc); });
  
  // Fix rounding
  const colTotal = cols.reduce((s, c) => s + c.w, 0);
  cols[cols.length - 1].w += CW - colTotal;

  // Table header
  const thH = 20;
  doc.rect(M, y, CW, thH).fill(C.primary);

  let cx = M;
  cols.forEach(col => {
    doc.fontSize(7)
      .fillColor(C.white)
      .font('Helvetica-Bold')
      .text(col.label, cx + 4, y + 6.5, { width: col.w - 8, align: col.align });
    cx += col.w;
  });

  y += thH;

  // Item rows
  order.items.forEach((item, idx) => {
    const rowH = 22;
    
    // Check for new page
    if (y + rowH > H - 100) {
      doc.addPage();
      y = 50;
      
      // Redraw header
      doc.rect(M, y, CW, thH).fill(C.primary);
      cx = M;
      cols.forEach(col => {
        doc.fontSize(7)
          .fillColor(C.white)
          .font('Helvetica-Bold')
          .text(col.label, cx + 4, y + 6.5, { width: col.w - 8, align: col.align });
        cx += col.w;
      });
      y += thH;
    }

    doc.rect(M, y, CW, rowH)
      .fill(idx % 2 === 0 ? C.white : C.rowAlt)
      .rect(M, y, CW, rowH)
      .strokeColor(C.border)
      .lineWidth(0.25)
      .stroke();

    const itemPrice = Number(item.price) || 0;
    const itemSubtotal = Number(item.subtotal) || (itemPrice * Number(item.quantity));

    cx = M;
    const cells = [
      { v: String(idx + 1), a: 'center' },
      { v: item.name, a: 'left' },
      { v: item.unit, a: 'center' },
      { v: String(item.quantity), a: 'center' },
      { v: formatCurrency(itemPrice), a: 'right' },
      { v: formatCurrency(itemSubtotal), a: 'right' },
    ];

    cols.forEach((col, ci) => {
      const isLast = ci === cols.length - 1;
      doc.fontSize(8)
        .fillColor(isLast ? C.textDark : C.textMed)
        .font(isLast ? 'Helvetica-Bold' : 'Helvetica')
        .text(cells[ci].v, cx + 4, y + 7, { width: col.w - 8, align: cells[ci].a });
      cx += col.w;
    });

    y += rowH;
  });

  // Table bottom border
  doc.moveTo(M, y)
    .lineTo(M + CW, y)
    .strokeColor(C.borderMid)
    .lineWidth(0.5)
    .stroke();

  // ═══════════════════════════════════════════════════════════════
  // TOTALS BLOCK
  // ═══════════════════════════════════════════════════════════════
  y += 12;
  const totW = 180;
  const totX = M + CW - totW;

  const totRows = [
    { label: 'Subtotal', value: formatCurrency(order.subtotal), hl: false },
    { label: 'Delivery', value: Number(order.deliveryCharge) === 0 ? 'FREE' : formatCurrency(order.deliveryCharge), hl: false },
    ...(Number(order.discount) > 0 ? [{ label: 'Discount', value: `- ${formatCurrency(order.discount)}`, color: C.danger, hl: false }] : []),
    { label: 'Grand Total', value: formatCurrency(order.total), hl: true },
  ];

  totRows.forEach(row => {
    const rh = row.hl ? 22 : 16;
    
    if (row.hl) {
      doc.rect(totX, y, totW, rh).fill(C.accent);
      doc.fontSize(9)
        .fillColor(C.white)
        .font('Helvetica-Bold')
        .text(row.label, totX + 8, y + 6, { width: totW / 2 - 8 })
        .text(row.value, totX + 8, y + 6, { width: totW - 16, align: 'right' });
    } else {
      doc.rect(totX, y, totW, rh)
        .fill(C.white)
        .strokeColor(C.border)
        .lineWidth(0.25)
        .stroke();
      
      doc.fontSize(8)
        .fillColor(row.color || C.textMed)
        .font('Helvetica')
        .text(row.label, totX + 8, y + 4, { width: totW / 2 - 8 })
        .text(row.value, totX + 8, y + 4, { width: totW - 16, align: 'right' });
    }
    
    y += rh;
  });

  // ═══════════════════════════════════════════════════════════════
  // PAYMENT DETAILS
  // ═══════════════════════════════════════════════════════════════
  if (order.razorpayPaymentId) {
    y += 20;
    
    if (y > H - 120) {
      doc.addPage();
      y = 50;
    }

    doc.rect(M, y, CW, 48)
      .fill(C.primaryLight)
      .strokeColor(C.border)
      .lineWidth(0.5)
      .stroke();

    doc.fontSize(9)
      .fillColor(C.primary)
      .font('Helvetica-Bold')
      .text('PAYMENT DETAILS', M + 8, y + 8);

    y += 22;
    doc.fontSize(6)
      .fillColor(C.textFaint)
      .font('Helvetica')
      .text('Transaction ID', M + 8, y)
      .text('Order ID', M + CW / 2, y);

    y += 12;
    doc.fontSize(8)
      .fillColor(C.textDark)
      .font('Helvetica')
      .text(order.razorpayPaymentId, M + 8, y, { width: CW / 2 - 16 })
      .text(order.razorpayOrderId || 'N/A', M + CW / 2, y, { width: CW / 2 - 8 });
  }

  // ═══════════════════════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════════════════════
  const footerY = H - 40;
  doc.rect(0, footerY, W, 40).fill(C.primaryDark);

  doc.fontSize(8)
    .fillColor('#bbf7d0')
    .font('Helvetica')
    .text('Thank you for your order!', M, footerY + 10, { width: CW, align: 'center' });

  doc.fontSize(7)
    .fillColor('#bbf7d0')
    .text('For queries: info@annakshetram.com', M, footerY + 22, { width: CW, align: 'center' });

  // Finalize
  doc.end();
};

module.exports = { generateOrderPDF };
