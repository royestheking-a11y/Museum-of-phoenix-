import React, { useState } from 'react';
import { Printer, Download, X, Copy, Check, FileText, Truck, ShieldCheck, MapPin, Phone, Calendar, Clock } from 'lucide-react';
import hennaLogo from '../../imports/Henna_Royalin.png';
import { formatDateTime, type Order } from '../../lib/db';

interface OrderInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderInvoiceModal({ order, onClose }: OrderInvoiceModalProps) {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTracking = () => {
    if (order.steadfastTrackingCode) {
      navigator.clipboard.writeText(order.steadfastTrackingCode);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    try {
      const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice #${order.orderId} - Henna Royalin</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: #FAF8F3; padding: 40px 20px; color: #24201D; }
    .invoice-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 48px; border-radius: 16px; border: 1px solid #E8E0D4; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #720000; padding-bottom: 24px; margin-bottom: 28px; }
    .logo-section h1 { font-size: 24px; color: #720000; letter-spacing: 0.5px; font-weight: 800; }
    .logo-section p { font-size: 12px; color: #7A6B5D; margin-top: 4px; }
    .meta-section { text-align: right; }
    .meta-section .badge { display: inline-block; background: #720000; color: #fff; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 12px; margin-bottom: 8px; text-transform: uppercase; }
    .meta-section h2 { font-size: 20px; font-weight: 800; color: #24201D; }
    .meta-section p { font-size: 12px; color: #7A6B5D; margin-top: 4px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    .info-card { background: #FAF8F3; padding: 16px 20px; border-radius: 12px; border: 1px solid #E8E0D4; font-size: 13px; }
    .info-card h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #720000; margin-bottom: 8px; font-weight: 700; }
    .info-card p { margin-bottom: 4px; }
    .courier-banner { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 14px 18px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; }
    .courier-banner p { font-size: 12px; color: #1E40AF; }
    .courier-banner strong { font-family: monospace; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 13px; }
    th { background: #FAF8F3; border-top: 1px solid #E8E0D4; border-bottom: 1px solid #E8E0D4; padding: 12px 14px; text-align: left; font-size: 11px; text-transform: uppercase; color: #7A6B5D; }
    td { padding: 14px; border-bottom: 1px solid #E8E0D4; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .totals { width: 340px; margin-left: auto; margin-bottom: 36px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #7A6B5D; }
    .totals-grand { display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #720000; margin-top: 8px; font-size: 18px; font-weight: 800; color: #720000; }
    .footer { border-top: 1px solid #E8E0D4; padding-top: 20px; text-align: center; font-size: 11px; color: #7A6B5D; line-height: 1.6; }
    .stamp { margin-top: 20px; display: inline-block; padding: 6px 16px; border: 2px dashed #720000; color: #720000; font-weight: 800; border-radius: 8px; font-size: 11px; text-transform: uppercase; }
    @media print {
      body { background: #fff; padding: 0; }
      .invoice-container { box-shadow: none; border: none; padding: 0; max-width: 100%; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="logo-section">
        <h1>HENNA ROYALIN</h1>
        <p>100% Organic Rajasthani Bridal Henna & Cones</p>
        <p>Studio & Production Lab · Dhaka, Bangladesh</p>
        <p>Phone: +880 1712-345678 · Web: hennaroyalin.com</p>
      </div>
      <div class="meta-section">
        <span class="badge">${order.paymentStatus === 'paid' ? 'PAID INVOICE' : 'CASH ON DELIVERY'}</span>
        <h2>#${order.orderId}</h2>
        <p>Date: ${formatDateTime(order.createdAt)}</p>
        <p>Status: ${order.orderStatus.toUpperCase()}</p>
      </div>
    </div>

    ${order.steadfastTrackingCode ? `
    <div class="courier-banner">
      <div>
        <p style="font-weight: 700; text-transform: uppercase; font-size: 10px; color: #1E40AF;">Steadfast Courier Consignment</p>
        <p style="margin-top: 2px;">Tracking: <strong>${order.steadfastTrackingCode}</strong> ${order.steadfastConsignmentId ? `· Consignment ID: <strong>${order.steadfastConsignmentId}</strong>` : ''}</p>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 11px; background: #DBEAFE; color: #1E40AF; padding: 4px 10px; border-radius: 6px; font-weight: bold; text-transform: capitalize;">
          ${order.steadfastStatus || 'In Transit'}
        </span>
      </div>
    </div>
    ` : ''}

    <div class="info-grid">
      <div class="info-card">
        <h3>Customer & Delivery Address</h3>
        <p style="font-weight: bold; font-size: 14px; color: #24201D;">${order.customerName}</p>
        <p>Phone: <strong>${order.customerPhone}</strong></p>
        <p>Address: ${order.deliveryAddress || order.city || 'Dhaka'}</p>
        <p>City: ${order.city || 'Dhaka, Bangladesh'}</p>
      </div>
      <div class="info-card">
        <h3>Payment & Dispatch Terms</h3>
        <p>Payment Mode: <strong>${order.paymentMethod || 'Cash on Delivery'}</strong></p>
        <p>Payment Status: <strong style="color: ${order.paymentStatus === 'paid' ? '#047857' : '#B45309'}; text-transform: uppercase;">${order.paymentStatus}</strong></p>
        <p>Delivery Source: <strong>${order.source || 'Online Store'}</strong></p>
        <p>Restocked: <strong>${order.restocked ? 'Yes' : 'No'}</strong></p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 40px;">#</th>
          <th>Product / Description</th>
          <th class="text-center" style="width: 70px;">Qty</th>
          <th class="text-right" style="width: 110px;">Unit Price</th>
          <th class="text-right" style="width: 120px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item, index) => `
          <tr>
            <td style="color: #7A6B5D;">${index + 1}</td>
            <td style="font-weight: 600; color: #24201D;">${item.productName}</td>
            <td class="text-center" style="font-weight: bold;">${item.quantity}</td>
            <td class="text-right">৳${Math.round(item.price).toLocaleString()}</td>
            <td class="text-right" style="font-weight: bold;">৳${item.total.toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Items Subtotal:</span>
        <span style="font-weight: 600;">৳${order.subtotal.toLocaleString()}</span>
      </div>
      <div class="totals-row">
        <span>Delivery Charge:</span>
        <span style="font-weight: 600;">৳${order.deliveryCharge.toLocaleString()}</span>
      </div>
      ${order.discount > 0 ? `
      <div class="totals-row" style="color: #DC2626;">
        <span>Special Discount:</span>
        <span style="font-weight: 600;">-৳${order.discount.toLocaleString()}</span>
      </div>
      ` : ''}
      <div class="totals-grand">
        <span>${order.paymentStatus === 'paid' ? 'Paid Amount:' : 'COD Amount to Collect:'}</span>
        <span>৳${order.total.toLocaleString()}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for choosing Henna Royalin! Keep fresh organic henna cones frozen until 30 minutes before application.</p>
      <p style="margin-top: 4px;">For customer support or queries, reach us at support@hennaroyalin.com or WhatsApp 01712-345678.</p>
      <div class="stamp">Verified Henna Royalin Official Invoice</div>
    </div>
  </div>
  <script>
    window.onload = function() {
      // automatically ready for printing or viewing
    };
  </script>
</body>
</html>`;

      const blob = new Blob([invoiceHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Henna_Royalin_Invoice_${order.orderId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Invoice download error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-[#E8E0D4] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="px-6 py-3.5 bg-[#FAF8F3] border-b border-[#E8E0D4] flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#720000]/10 flex items-center justify-center text-[#720000]">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#24201D]">
                Customer Invoice & Cash Memo
              </h3>
              <p className="text-[11px] text-[#7A6B5D]">
                Invoice #{order.orderId} · {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#720000] hover:bg-[#580000] transition-colors shadow-xs"
              title="Print official invoice or save as PDF"
            >
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#720000] bg-white border border-[#E8E0D4] hover:bg-[#F5F0E8] transition-colors shadow-xs"
              title="Download standalone HTML invoice"
            >
              <Download size={14} />
              <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-xl hover:bg-[#E8E0D4]/50 text-[#7A6B5D] transition-colors ml-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="overflow-y-auto p-6 sm:p-10 bg-white">
          <div
            id="printable-order-invoice"
            className="printable-document space-y-6 text-[#24201D] bg-white"
          >
            {/* Header branding */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#720000] pb-6">
              <div className="flex items-center gap-3.5">
                <img
                  src={hennaLogo}
                  alt="Henna Royalin"
                  className="h-14 w-14 object-contain shrink-0"
                />
                <div>
                  <h1 className="font-serif font-black text-xl text-[#720000] tracking-wide">
                    HENNA ROYALIN
                  </h1>
                  <p className="text-xs font-medium text-[#7A6B5D]">
                    100% Organic Rajasthani Bridal Henna & Cones
                  </p>
                  <p className="text-[11px] text-[#A3907C]">
                    Studio & Production Lab · Dhaka, Bangladesh
                  </p>
                  <p className="text-[11px] text-[#A3907C]">
                    WhatsApp: +880 1712-345678 · Web: hennaroyalin.com
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-[#720000] text-white'
                  }`}
                >
                  {order.paymentStatus === 'paid' ? 'PAID INVOICE' : 'CASH ON DELIVERY (COD)'}
                </span>
                <p className="font-mono font-black text-lg text-[#24201D]">
                  #{order.orderId}
                </p>
                <p className="text-xs text-[#7A6B5D]">
                  Date: {formatDateTime(order.createdAt)}
                </p>
                <p className="text-xs text-[#7A6B5D]">
                  Status: <span className="font-bold text-[#720000] uppercase">{order.orderStatus}</span>
                </p>
              </div>
            </div>

            {/* Steadfast Courier Tracking Barcode Badge (if dispatched) */}
            {order.steadfastTrackingCode && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                    <Truck size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">
                      Steadfast Courier Delivery
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-extrabold text-sm text-[#720000]">
                        {order.steadfastTrackingCode}
                      </span>
                      <button
                        onClick={handleCopyTracking}
                        type="button"
                        className="text-blue-600 hover:text-blue-800 p-0.5 rounded no-print"
                        title="Copy tracking code"
                      >
                        {copiedTracking ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs">
                  {order.steadfastConsignmentId && (
                    <p className="text-blue-900">
                      Consignment ID: <span className="font-mono font-bold">{order.steadfastConsignmentId}</span>
                    </p>
                  )}
                  <p className="text-blue-700 capitalize font-medium">
                    Courier Status: <span className="font-bold">{order.steadfastStatus || 'In Transit'}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Customer & Billing Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-1 text-xs">
                <p className="font-bold text-[#720000] uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} /> Billed & Shipped To
                </p>
                <p className="font-extrabold text-sm text-[#24201D] pt-0.5">
                  {order.customerName}
                </p>
                <p className="text-[#5C4E42] flex items-center gap-1">
                  <Phone size={11} className="text-[#A3907C]" />
                  <span>{order.customerPhone}</span>
                </p>
                <p className="text-[#5C4E42] leading-relaxed">
                  Address: {order.deliveryAddress || order.city || 'Banani, Dhaka'}
                </p>
                <p className="text-[#7A6B5D] font-medium">
                  City: {order.city || 'Dhaka, Bangladesh'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-1 text-xs">
                <p className="font-bold text-[#720000] uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Order & Payment Info
                </p>
                <p className="text-[#5C4E42] pt-0.5">
                  Payment Method: <span className="font-bold text-[#24201D]">{order.paymentMethod || 'Cash on Delivery'}</span>
                </p>
                <p className="text-[#5C4E42]">
                  Payment Status: <span className={`font-bold capitalize ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>{order.paymentStatus}</span>
                </p>
                <p className="text-[#5C4E42]">
                  Order Channel: <span className="font-medium">{order.source || 'Direct Store / Online'}</span>
                </p>
                {order.notes && (
                  <p className="text-[#7A6B5D] italic">
                    Note: {order.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <p className="font-bold text-xs text-[#720000] uppercase tracking-wider mb-2">
                Order Items Summary
              </p>
              <div className="rounded-xl border border-[#E8E0D4] overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold border-b border-[#E8E0D4]">
                    <tr>
                      <th className="py-2.5 px-3 text-left w-10">#</th>
                      <th className="py-2.5 px-3 text-left">Product / Variety</th>
                      <th className="py-2.5 px-3 text-center w-20">Qty</th>
                      <th className="py-2.5 px-3 text-right w-24">Unit Price</th>
                      <th className="py-2.5 px-3 text-right w-28">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D4]">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF8F3]/50">
                        <td className="py-2.5 px-3 text-[#A3907C] font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-[#24201D]">
                          {item.productName}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#24201D]">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-[#5C4E42]">
                          ৳{Math.round(item.price).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-bold text-[#24201D]">
                          ৳{item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
              <div className="text-xs text-[#7A6B5D] max-w-sm space-y-1">
                <p className="font-bold text-[#24201D]">Preservation & Stain Care Instructions:</p>
                <p>• Store unused henna cones in the freezer (-18°C) to keep active pigment fresh.</p>
                <p>• Thaw at room temperature 30 mins before application. Do not microwave.</p>
                <p>• Allow henna paste to dry for 4-6 hours for maximum dark mahogany stain.</p>
              </div>

              <div className="w-full sm:w-72 p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-2 text-xs">
                <div className="flex justify-between text-[#7A6B5D]">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-[#24201D]">৳{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7A6B5D]">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-[#24201D]">৳{order.deliveryCharge.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-red-600 font-medium">
                    <span>Discount:</span>
                    <span>-৳{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t-2 border-[#720000] pt-2 flex justify-between items-center text-sm font-black text-[#720000]">
                  <span>{order.paymentStatus === 'paid' ? 'Total Paid:' : 'COD Amount:'}</span>
                  <span className="text-base tabular-nums">৳{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Official Signature and Stamp */}
            <div className="border-t border-[#E8E0D4] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#7A6B5D]">
              <div className="text-center sm:text-left">
                <p className="font-serif font-bold text-[#720000] text-sm">Thank You for Supporting Henna Royalin!</p>
                <p className="text-[11px] text-[#A3907C]">This is an electronically generated valid tax invoice & delivery slip.</p>
              </div>

              <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-[#E8E0D4] pt-3 sm:pt-0 sm:pl-6">
                <div className="inline-block border-2 border-dashed border-[#720000] text-[#720000] font-black text-[10px] uppercase px-3 py-1 rounded-md tracking-wider">
                  Verified Official Dispatch
                </div>
                <p className="text-[10px] text-[#A3907C] mt-1">Authorized Henna Royalin Desk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden on Print) */}
        <div className="px-6 py-3 bg-[#FAF8F3] border-t border-[#E8E0D4] flex items-center justify-between no-print shrink-0">
          <span className="text-xs text-[#7A6B5D]">
            Official Printable Document · Fits standard A4 & Letter sizes
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              type="button"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-[#E8E0D4] bg-white text-[#720000] hover:bg-[#F5F0E8] transition-colors flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>{isDownloading ? 'Downloading...' : 'Download Invoice'}</span>
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-1.5 text-xs font-bold rounded-xl text-white bg-[#720000] hover:bg-[#580000] transition-colors flex items-center gap-1.5"
            >
              <Printer size={13} />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
