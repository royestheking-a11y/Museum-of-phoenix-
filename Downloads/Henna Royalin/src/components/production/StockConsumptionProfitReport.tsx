import React, { useState, useEffect } from 'react';
import {
  Calendar, TrendingUp, TrendingDown, DollarSign, Layers,
  Boxes, Package, Printer, Download, Sparkles, AlertTriangle,
  CheckCircle2, ArrowRight, FileText, ChevronDown, RefreshCw
} from 'lucide-react';
import { db, formatDateTime } from '../../lib/db';

export default function StockConsumptionProfitReport() {
  const [period, setPeriod] = useState<string>('this_month');
  const [customMonth, setCustomMonth] = useState<string>('2026-10');
  const [data, setData] = useState(() => db.getStockConsumptionAndProfit('this_month'));
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const refresh = () => {
    const selected = period === 'custom_month' ? customMonth : period;
    setData(db.getStockConsumptionAndProfit(selected));
  };

  useEffect(() => {
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, [period, customMonth]);

  const handlePrint = () => {
    window.print();
  };

  const periodDisplay = () => {
    if (period === 'today') return 'Today (' + new Date().toLocaleDateString('en-GB') + ')';
    if (period === 'yesterday') return 'Yesterday';
    if (period === 'this_month') return 'October 2026 (Current Month)';
    if (period === 'last_month') return 'September 2026 (Last Month)';
    if (period === 'custom_month') return customMonth;
    return period;
  };

  return (
    <div className="space-y-6">
      {/* ── TOP CONTROLS & TIMEFRAME SELECTOR ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E8E0D4] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[#24201D]">
              Stock Consumption & Profit Breakdown
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Reconciled
            </span>
          </div>
          <p className="text-xs text-[#7A6B5D] mt-0.5">
            Total Product Sell minus Total Stock / Ingredient Used = Net Profit & Month-End Left Stock Balance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick period buttons */}
          <div className="flex rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] p-1 gap-1 text-xs">
            {[
              { id: 'today', label: 'Today' },
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
              { id: 'custom_month', label: 'Month Picker' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  period === p.id
                    ? 'bg-[#720000] text-white shadow-xs'
                    : 'text-[#7A6B5D] hover:text-[#24201D]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {period === 'custom_month' && (
            <input
              type="month"
              className="form-input text-xs py-1.5 px-3 rounded-xl border-[#E8E0D4]"
              value={customMonth}
              onChange={(e) => setCustomMonth(e.target.value)}
            />
          )}

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#720000] bg-red-50 hover:bg-red-100 transition border border-red-200"
          >
            <Printer size={14} /> Print Report
          </button>
        </div>
      </div>

      {/* ── KPI HIGHLIGHT CARDS ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Card 1: Total Product Sell */}
        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6B5D] text-xs mb-2">
            <span className="font-semibold">Total Product Sell</span>
            <DollarSign size={16} className="text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#24201D] tabular-nums">
            ৳{data.totalProductSales.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#7A6B5D] mt-1">
            {data.ordersCount} orders ({data.totalConesSold} cones)
          </p>
        </div>

        {/* Card 2: Stock / Ingredients Used */}
        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6B5D] text-xs mb-2">
            <span className="font-semibold">Raw Stock Used</span>
            <Layers size={16} className="text-[#720000]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#720000] tabular-nums">
            ৳{data.totalIngredientsCostUsed.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#7A6B5D] mt-1">
            Direct materials consumed
          </p>
        </div>

        {/* Card 3: Wastage Buffer */}
        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6B5D] text-xs mb-2">
            <span className="font-semibold">Wastage / Buffer</span>
            <Boxes size={16} className="text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-900 tabular-nums">
            ৳{data.extraWastageBuffer.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#7A6B5D] mt-1">
            ৳1.00 per cone loss reserve
          </p>
        </div>

        {/* Card 4: Net Stock Profit */}
        <div className="bg-white rounded-2xl border-2 border-emerald-300 p-4 shadow-xs bg-linear-to-br from-white to-emerald-50/50">
          <div className="flex items-center justify-between text-emerald-800 text-xs mb-2">
            <span className="font-bold">Net Stock Profit</span>
            <TrendingUp size={16} className="text-emerald-700" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-900 tabular-nums">
            ৳{data.grossProfit.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {data.profitMargin}% Margin
            </span>
            <span className="text-[10px] text-[#7A6B5D]">Sales - Stock Use</span>
          </div>
        </div>

        {/* Card 5: Left Stock Valuation */}
        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#7A6B5D] text-xs mb-2">
            <span className="font-semibold">Left Stock Value</span>
            <Package size={16} className="text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#24201D] tabular-nums">
            ৳{data.totalLeftStockValuation.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#7A6B5D] mt-1">
            Remaining raw inventory asset
          </p>
        </div>
      </div>

      {/* ── CONE SALES & MATERIAL CONSUMPTION GRID ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Cones Sold Summary */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E0D4] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E0D4] pb-3">
            <div>
              <h4 className="font-serif font-bold text-base text-[#24201D]">
                Cones Sold in Period
              </h4>
              <p className="text-xs text-[#7A6B5D]">
                Breakdown by cone size variant
              </p>
            </div>
            <span className="font-bold text-sm text-[#720000]">
              {data.totalConesSold} pcs total
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: '20 Gram Cones', count: data.coneBreakdown.count20g, color: 'bg-emerald-500' },
              { label: '25 Gram Cones', count: data.coneBreakdown.count25g, color: 'bg-blue-500' },
              { label: '30 Gram Cones', count: data.coneBreakdown.count30g, color: 'bg-amber-500' },
              { label: 'Other Products / Varieties', count: data.coneBreakdown.otherCount, color: 'bg-purple-500' },
            ].map((cone, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${cone.color}`} />
                  <span className="text-xs font-bold text-[#24201D]">{cone.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#24201D] tabular-nums">
                    {cone.count} pcs
                  </span>
                  {data.totalConesSold > 0 && (
                    <span className="text-[10px] text-[#7A6B5D] ml-1.5">
                      ({Math.round((cone.count / data.totalConesSold) * 100)}%)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Formula Summary Box */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-600" /> Profit Math Formula:
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed font-mono">
              Net Profit = Total Product Sell (৳{data.totalProductSales.toLocaleString()}) - Total Stock Used (৳{data.totalStockCostUsed.toLocaleString()}) = ৳{data.grossProfit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): Raw Materials Consumed Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-[#E8E0D4] flex items-center justify-between bg-[#FAF8F3]/50">
            <div>
              <h4 className="font-serif font-bold text-base text-[#24201D]">
                Raw Ingredients & Packaging Consumed
              </h4>
              <p className="text-xs text-[#7A6B5D]">
                Exact quantities & costs deducted for completed orders
              </p>
            </div>
            <span className="font-bold text-xs text-[#720000] tabular-nums">
              Total Cost: ৳{data.totalIngredientsCostUsed.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
                <tr>
                  <th className="py-2.5 px-4">Material Name</th>
                  <th className="py-2.5 px-4">Consumed Qty</th>
                  <th className="py-2.5 px-4">Unit Rate</th>
                  <th className="py-2.5 px-4 text-right">Cost (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D4]">
                {data.materialUsageList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#7A6B5D]">
                      No ingredient consumption recorded in this period.
                    </td>
                  </tr>
                ) : (
                  data.materialUsageList.map((m, idx) => (
                    <tr key={idx} className="hover:bg-[#FFFDF5] transition-colors">
                      <td className="py-2.5 px-4 font-bold text-[#24201D]">
                        {m.materialName}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-[#720000] tabular-nums">
                        {m.consumedQty.toLocaleString()} {m.unit}
                      </td>
                      <td className="py-2.5 px-4 text-[#7A6B5D] font-mono">
                        ৳{m.unitCost.toFixed(2)} / {m.unit}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-[#24201D] tabular-nums">
                        ৳{m.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
                <tr className="bg-[#FAF8F3] font-bold border-t-2 border-[#E8E0D4]">
                  <td colSpan={3} className="py-3 px-4 text-[#24201D]">
                    Total Direct Materials Cost Consumed
                  </td>
                  <td className="py-3 px-4 text-right text-[#720000] text-sm tabular-nums">
                    ৳{data.totalIngredientsCostUsed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── 3. STOCK AUDIT & MONTH-END LEFT STOCK RECONCILIATION ──────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E8E0D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F3]/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#24201D]">
                Month-End Stock Audit & Left Stock Available
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#720000]/10 text-[#720000]">
                Period: {periodDisplay()}
              </span>
            </div>
            <p className="text-xs text-[#7A6B5D] mt-0.5">
              Full stock audit: Opening Stock + Added Restock - Consumed Orders = Left Stock Available
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#7A6B5D]">Remaining Stock Asset Value:</span>
            <div className="text-lg font-bold text-emerald-900 tabular-nums">
              ৳{data.totalLeftStockValuation.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-225">
            <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
              <tr>
                <th className="py-3 px-4">Material / Packaging</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Opening Stock</th>
                <th className="py-3 px-4">Added / Restocked</th>
                <th className="py-3 px-4">Used in Orders</th>
                <th className="py-3 px-4">Left Stock Available</th>
                <th className="py-3 px-4">Unit Rate</th>
                <th className="py-3 px-4">Left Stock Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D4]">
              {data.stockReconciliation.map((item) => (
                <tr key={item.id} className="hover:bg-[#FFFDF5] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#24201D]">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-[#7A6B5D]">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-[#7A6B5D] tabular-nums">
                    {item.openingStock.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-emerald-700 font-bold tabular-nums">
                    +{item.addedStock.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-red-700 font-bold tabular-nums">
                    -{item.consumedStock.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#24201D] text-sm tabular-nums">
                    <span className={`px-2 py-0.5 rounded-md ${item.status === 'low' ? 'bg-red-100 text-red-800' : 'bg-emerald-50 text-emerald-900'}`}>
                      {item.actualLeftStock.toLocaleString()} {item.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#7A6B5D]">
                    ৳{item.unitCost.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-800 tabular-nums">
                    ৳{item.leftStockValue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {item.status === 'low' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 size={12} /> Healthy
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PRINTABLE FINANCIAL REPORT MODAL ─────────────────────────────── */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8E0D4] flex flex-col">
            {/* Modal Controls Bar */}
            <div className="no-print p-4 bg-[#FAF8F3] border-b border-[#E8E0D4] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#720000]" />
                <span className="font-bold text-sm text-[#24201D]">
                  Confidential Production Cost & Profit Report Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#720000] text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-95"
                >
                  <Printer size={14} /> Print Document
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 text-xs font-bold text-[#7A6B5D] hover:bg-gray-100 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Print Document Shell — Replicating Image Document */}
            <div className="p-8 sm:p-12 space-y-6 text-[#24201D] bg-white print:p-0">
              {/* Report Header */}
              <div className="border-b-2 border-[#720000] pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#720000] tracking-wide">
                      HR GLOW & HENNA ROYALIN ART
                    </h1>
                    <p className="text-sm font-semibold text-[#4A3E31] mt-0.5">
                      Comprehensive Production Cost & Pricing Breakdown Report
                    </p>
                  </div>
                  <div className="text-right text-xs text-[#7A6B5D]">
                    <p className="font-bold">Batch Size: 1 Kg Powder</p>
                    <p>Scope: Raw Materials & Packaging</p>
                    <p className="text-[11px] text-gray-500 mt-1">Period: {periodDisplay()}</p>
                  </div>
                </div>
              </div>

              {/* Section 1: Raw Ingredients */}
              <div className="space-y-2">
                <h2 className="font-serif font-bold text-sm text-[#720000] uppercase tracking-wide">
                  1. Raw Ingredients Batch Cost (1 Kg Powder)
                </h2>
                <table className="w-full text-xs border border-[#E8E0D4]">
                  <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold border-b border-[#E8E0D4]">
                    <tr>
                      <th className="py-2 px-3 text-left">Ingredient Name</th>
                      <th className="py-2 px-3 text-left">Batch Quantity</th>
                      <th className="py-2 px-3 text-left">Unit Rate</th>
                      <th className="py-2 px-3 text-right">Batch Cost (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D4]">
                    {db.getRawIngredientRates().map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 px-3 font-semibold">{r.name}</td>
                        <td className="py-2 px-3">{r.batchQuantity} {r.unit}</td>
                        <td className="py-2 px-3 font-mono">{r.unitRateDisplay}</td>
                        <td className="py-2 px-3 text-right font-bold">{r.batchCost.toFixed(2)} Tk</td>
                      </tr>
                    ))}
                    <tr className="bg-[#FAF8F3] font-bold">
                      <td colSpan={3} className="py-2 px-3">Total Raw Material Cost Per Batch</td>
                      <td className="py-2 px-3 text-right text-[#720000]">
                        {db.getRawIngredientRates().reduce((s, r) => s + r.batchCost, 0).toFixed(2)} Tk
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 2: Packaging */}
              <div className="space-y-2">
                <h2 className="font-serif font-bold text-sm text-[#720000] uppercase tracking-wide">
                  2. Packaging Material Unit Cost Breakdown
                </h2>
                <table className="w-full text-xs border border-[#E8E0D4]">
                  <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold border-b border-[#E8E0D4]">
                    <tr>
                      <th className="py-2 px-3 text-left">Packaging Material</th>
                      <th className="py-2 px-3 text-left">Bulk Quantity & Purchase Price</th>
                      <th className="py-2 px-3 text-left">Calculation</th>
                      <th className="py-2 px-3 text-right">Cost Per Cone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D4]">
                    {db.getPackagingRates().map((p) => (
                      <tr key={p.id}>
                        <td className="py-2 px-3 font-semibold">{p.name}</td>
                        <td className="py-2 px-3">{p.bulkQuantity}</td>
                        <td className="py-2 px-3 font-mono">{p.purchasePrice} ÷ {p.bulkPcs}</td>
                        <td className="py-2 px-3 text-right font-bold">{p.costPerCone.toFixed(2)} Tk</td>
                      </tr>
                    ))}
                    <tr className="bg-[#FAF8F3] font-bold">
                      <td colSpan={3} className="py-2 px-3">Direct Packaging Cost Per Cone</td>
                      <td className="py-2 px-3 text-right text-emerald-800">
                        {db.getPackagingRates().reduce((s, p) => s + p.costPerCone, 0).toFixed(2)} Tk
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 3: Recommended POS Software Preset Entry Costs */}
              <div className="space-y-2">
                <h2 className="font-serif font-bold text-sm text-[#720000] uppercase tracking-wide">
                  3. Recommended POS Software Preset Entry Costs
                </h2>
                <table className="w-full text-xs border border-[#E8E0D4]">
                  <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold border-b border-[#E8E0D4]">
                    <tr>
                      <th className="py-2 px-3 text-left">Cone Variant</th>
                      <th className="py-2 px-3 text-left">Raw Material Cost</th>
                      <th className="py-2 px-3 text-left">Direct Packaging</th>
                      <th className="py-2 px-3 text-left">Extra Buffer (Tape/Piping/Loss)</th>
                      <th className="py-2 px-3 text-right">Recommended POS Preset</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D4]">
                    {db.getConeRecipes().map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 px-3 font-bold">{r.label}</td>
                        <td className="py-2 px-3">{r.rawMaterialSubtotal.toFixed(2)} Tk</td>
                        <td className="py-2 px-3">{r.packagingCost.toFixed(2)} Tk</td>
                        <td className="py-2 px-3">{r.wastageBuffer.toFixed(2)} Tk</td>
                        <td className="py-2 px-3 text-right font-bold text-[#720000]">{r.recommendedPOSPreset.toFixed(2)} Tk</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Section 4: Period Actual Financial Results */}
              <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-3">
                <h3 className="font-serif font-bold text-sm text-[#24201D] border-b border-[#E8E0D4] pb-2">
                  Financial Performance Statement ({periodDisplay()})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#7A6B5D]">Total Product Sales:</span>
                    <p className="font-bold text-base text-[#24201D]">৳{data.totalProductSales.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[#7A6B5D]">Total Stock Used (COGS):</span>
                    <p className="font-bold text-base text-[#720000]">৳{data.totalStockCostUsed.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[#7A6B5D]">Net Stock Profit:</span>
                    <p className="font-bold text-base text-emerald-800">৳{data.grossProfit.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[#7A6B5D]">Gross Margin:</span>
                    <p className="font-bold text-base text-emerald-800">{data.profitMargin}%</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-[#E8E0D4] flex items-center justify-between text-[11px] text-[#7A6B5D]">
                <span>HR Glow & Henna Royalin Art — Confidential Financial Report</span>
                <span>Generated: {formatDateTime(new Date())}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
