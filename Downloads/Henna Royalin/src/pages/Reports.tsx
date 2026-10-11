import { useState, useEffect, useRef } from 'react';
import {
  FileBarChart, TrendingUp, TrendingDown, ShoppingBag,
  Users, Package, Download, Factory, AlertTriangle, CheckCircle2,
  DollarSign, Boxes, Calendar, Truck, ShieldCheck, Printer, X,
  ChevronDown, Sparkles, Layers, ArrowUpRight, Percent, Award
} from 'lucide-react';
import { db } from '../lib/db';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

function fmt(n: number) {
  return '৳' + Math.round(n || 0).toLocaleString('en-IN');
}

export default function Reports({ defaultTab = 'overview' }: { defaultTab?: 'overview' | 'pl' | 'economics' | 'logistics' | 'production' } = {}) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this_month');
  const [activeTab, setActiveTab] = useState<'overview' | 'pl' | 'economics' | 'logistics' | 'production'>(defaultTab);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [analytics, setAnalytics] = useState(() => db.getAnalytics('this_month'));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Reactive DB subscription
  useEffect(() => {
    setAnalytics(db.getAnalytics(selectedPeriod));
    return db.subscribe(() => {
      setAnalytics(db.getAnalytics(selectedPeriod));
    });
  }, [selectedPeriod]);

  // Click outside to close month dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMonthDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrintPDF = () => {
    window.print();
  };

  const pieColors = ['#720000', '#D9A900', '#059669', '#2563EB', '#9333EA'];

  const categoryChartData = (analytics.categoryBreakdown || []).map((c, i) => ({
    name: c.category,
    value: c.sold,
    revenue: c.revenue,
    color: pieColors[i % pieColors.length]
  }));

  // Expense breakdown distribution
  const expenseData = [
    { name: 'Raw Materials & Batch COGS', value: analytics.orderCost || 12300, color: '#720000' },
    { name: 'Staff Salaries & Wages', value: analytics.totalSalariesPaid || 39000, color: '#D9A900' },
    { name: 'Steadfast Courier Delivery', value: analytics.deliveryCost || 5600, color: '#059669' },
    { name: 'Packaging & Cone Accessories', value: 4500, color: '#2563EB' },
  ];
  const totalExpensesSum = expenseData.reduce((acc, curr) => acc + curr.value, 0);

  // Derive active month display label
  const activeMonthDisplay = analytics.selectedMonthName || 'September 2026';
  const docReportId = `HRL-FIN-${(analytics.period && analytics.period.startsWith('2026-')) ? analytics.period.replace('-', '') : '202609'}`;

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* ── TOP HEADER WITH TITLE & MONTH CONTROLS ─────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E0D4] shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
            style={{ background: 'linear-gradient(135deg, #720000 0%, #8B1A1A 100%)', border: '1px solid #D9A900' }}
          >
            <FileBarChart size={24} className="text-[#F8E29B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#24201D]">
                Analytics & Profit Hub
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Sparkles size={12} className="text-amber-500" /> Live Synced
              </span>
            </div>
            <p className="text-xs text-[#7A6B5D] mt-0.5">
              Production unit economics, cone pricing, courier delivery reconciliation & monthly profit reports
            </p>
          </div>
        </div>

        {/* Action Controls: Month Dropdown + Golden PDF Download Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Monthly Dropdown Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E8E0D4] bg-[#FAF8F3] hover:bg-white text-[#24201D] text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Calendar size={15} className="text-[#720000]" />
              <span>{activeMonthDisplay}</span>
              <ChevronDown size={14} className="text-[#7A6B5D]" />
            </button>

            {monthDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E8E0D4] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7A6B5D] border-b border-[#F0EBE3]">
                  Select Month / Statement Period
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {(analytics.availableMonths || []).map((m: any) => (
                    <button
                      key={m.key}
                      onClick={() => {
                        setSelectedPeriod(m.key);
                        setMonthDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition cursor-pointer ${
                        selectedPeriod === m.key
                          ? 'bg-[#720000]/10 text-[#720000] font-bold'
                          : 'text-[#24201D] hover:bg-[#FAF8F3]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Calendar size={13} className={selectedPeriod === m.key ? 'text-[#720000]' : 'text-gray-400'} />
                        {m.label}
                      </span>
                      {m.current && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Current
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-[#F0EBE3] my-1" />
                  <button
                    onClick={() => {
                      setSelectedPeriod('this_year');
                      setMonthDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition cursor-pointer ${
                      selectedPeriod === 'this_year' ? 'bg-[#720000]/10 text-[#720000] font-bold' : 'text-[#24201D] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <span>Full Year 2026 Summary</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPeriod('all');
                      setMonthDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition cursor-pointer ${
                      selectedPeriod === 'all' ? 'bg-[#720000]/10 text-[#720000] font-bold' : 'text-[#24201D] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <span>All Time Lifetime Records</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Preset Filter Buttons */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-[#FAF8F3] rounded-xl border border-[#E8E0D4]">
            {[
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
              { id: 'this_year', label: 'Year 2026' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedPeriod === p.id
                    ? 'bg-[#720000] text-white shadow-2xs'
                    : 'text-[#7A6B5D] hover:text-[#24201D]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* LUXURY PDF STATEMENT DOWNLOAD BUTTON */}
          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-[#24201D] shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer border"
            style={{
              background: 'linear-gradient(135deg, #F8E29B 0%, #D9A900 100%)',
              borderColor: '#B8860B',
              boxShadow: '0 3px 10px rgba(217,169,0,0.3)',
            }}
            title="Download or Print Official Monthly Statement PDF"
          >
            <Download size={16} className="text-[#720000]" />
            <span className="font-extrabold text-[#5A0000]">
              Download {activeMonthDisplay.split(' ')[0]} PDF Report
            </span>
          </button>
        </div>
      </div>

      {/* ── 2. EXECUTIVE FINANCIAL KPI CARDS (6 CARDS) ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Orders & Success Rate */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E0D4] border-l-4 border-l-amber-600 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#7A6B5D] mb-1">
            <span>Orders</span>
            <ShoppingBag size={15} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-[#24201D] tabular-nums">{analytics.totalOrders}</p>
          <div className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 size={12} />
            <span>{analytics.totalOrders === 0 ? '0% Success' : `${analytics.deliverySuccessRate}% Success`}</span>
          </div>
        </div>

        {/* 2. Cones Produced */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E0D4] border-l-4 border-l-indigo-600 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#7A6B5D] mb-1">
            <span>Cones Made</span>
            <Factory size={15} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-950 tabular-nums">
            {analytics.totalProducedCones.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#7A6B5D] mt-1">{analytics.totalProducedCones > 0 ? 'Recorded batches' : 'No batches recorded'}</p>
        </div>

        {/* 3. Gross Revenue Turnover */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E0D4] border-l-4 border-l-emerald-600 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#7A6B5D] mb-1">
            <span>Gross Turnover</span>
            <TrendingUp size={15} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-900 tabular-nums">
            {fmt(analytics.totalRevenue)}
          </p>
          <p className="text-[11px] text-[#7A6B5D] mt-1">
            Products: {fmt(analytics.grossProductRevenue)}
          </p>
        </div>

        {/* 4. Direct COGS & Production Costs */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E0D4] border-l-4 border-l-red-600 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#7A6B5D] mb-1">
            <span>Material COGS</span>
            <Boxes size={15} className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700 tabular-nums">
            {fmt(analytics.orderCost)}
          </p>
          <p className="text-[11px] text-[#7A6B5D] mt-1">Powders, Oils & Pins</p>
        </div>

        {/* 5. Staff Salaries & Payroll */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E0D4] border-l-4 border-l-purple-600 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#7A6B5D] mb-1">
            <span>Staff Payroll</span>
            <Users size={15} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-950 tabular-nums">
            {fmt(analytics.totalSalariesPaid)}
          </p>
          <p className="text-[11px] text-[#7A6B5D] mt-1">Artisans & Staff Wages</p>
        </div>

        {/* 6. Net Operating Profit */}
        <div className="p-4 rounded-xl border border-[#E8E0D4] border-l-4 border-l-emerald-600 shadow-xs bg-emerald-50/30">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#7A6B5D] mb-1">
            <span>Net Profit</span>
            <DollarSign size={15} className="text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-emerald-800 tabular-nums">
            {fmt(analytics.netProfit)}
          </p>
          <p className="text-[11px] font-bold text-emerald-700 mt-1">
            Margin: {analytics.profitMargin}%
          </p>
        </div>
      </div>

      {/* ── 3. LOW STOCK NOTIFICATION (≤20) ────────────────────────────────────────────── */}
      {analytics.lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-xs flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                Low Stock Threshold Alert: {analytics.lowStockCount} product variants are at or below 20 cones!
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Total finished cones currently in stock across studio: <strong>{analytics.totalInStock} units</strong>. Schedule new cone batches in the Production Suite.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold">
            Threshold: ≤20 Cones
          </span>
        </div>
      )}

      {/* ── 4. NAVIGATION TABS ──────────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 p-1 bg-white rounded-xl border border-[#E8E0D4] w-fit overflow-x-auto shadow-xs">
        {[
          { id: 'overview', label: 'Financial Overview & Charts' },
          { id: 'pl', label: 'Monthly Profit & Loss Statement' },
          { id: 'economics', label: 'Cone Unit Economics' },
          { id: 'logistics', label: 'Steadfast Courier Reconciliation' },
          { id: 'production', label: 'Manufactured Batches' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#720000] text-white shadow-2xs'
                : 'text-[#7A6B5D] hover:text-[#24201D] hover:bg-[#FAF8F3]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 5. TAB 1: FINANCIAL OVERVIEW & CHARTS ────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Area Chart: 2026 Monthly Trend */}
          <div className="rounded-2xl bg-white p-5 sm:p-6 border border-[#E8E0D4] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#24201D]">
                  2026 Monthly Revenue vs Operating Costs vs Net Profit
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Annual progression of gross customer collections, production & operating expenses, and net profit
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-[#720000]">
                  <span className="w-3 h-3 rounded-full bg-[#720000]" /> Revenue
                </span>
                <span className="flex items-center gap-1.5 text-[#D9A900]">
                  <span className="w-3 h-3 rounded-full bg-[#D9A900]" /> Costs
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Net Profit
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={analytics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7A6B5D', fontFamily: 'Manrope' }} />
                <YAxis tickFormatter={v => `৳${v / 1000}K`} tick={{ fontSize: 11, fill: '#7A6B5D', fontFamily: 'Manrope' }} />
                <Tooltip
                  formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, '']}
                  contentStyle={{ fontFamily: 'Manrope', borderRadius: 8, border: '1px solid #E8E0D4', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#720000" fill="#72000018" strokeWidth={2.5} name="Revenue" />
                <Area type="monotone" dataKey="expense" stroke="#D9A900" fill="#D9A90018" strokeWidth={2} name="Operating Costs" />
                <Area type="monotone" dataKey="profit" stroke="#10B981" fill="#10B98118" strokeWidth={2} name="Net Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Two-Column Grid: Category Sales & Expense Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Category Sales Breakdown */}
            <div className="rounded-2xl bg-white p-5 border border-[#E8E0D4] shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#24201D] mb-3">
                {activeMonthDisplay} Cone Category Sales Volume
              </h3>
              <div className="space-y-3.5">
                {(analytics.categoryBreakdown || []).length === 0 ? (
                  <p className="py-8 text-center text-xs text-[#7A6B5D]">No cone category sales recorded for this period.</p>
                ) : (
                  (analytics.categoryBreakdown || []).map((cat: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#24201D]">{cat.category}</span>
                        <span className="font-bold text-[#720000]">
                          {fmt(cat.revenue)} · <span className="text-gray-500 font-normal">{cat.sold} units</span>
                        </span>
                      </div>
                      <div className="w-full bg-[#FAF8F3] h-2.5 rounded-full overflow-hidden border border-[#E8E0D4]">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(15, (cat.sold / 250) * 100))}%`,
                            backgroundColor: pieColors[idx % pieColors.length],
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Operating Expense Distribution */}
            <div className="rounded-2xl bg-white p-5 border border-[#E8E0D4] shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#24201D] mb-3">
                {activeMonthDisplay} Operating Expense Allocation
              </h3>
              <div className="space-y-3">
                {expenseData.length === 0 || totalExpensesSum === 0 ? (
                  <p className="py-8 text-center text-xs text-[#7A6B5D]">No operational expenses recorded for this period.</p>
                ) : (
                  expenseData.map((exp, idx) => {
                    const pct = totalExpensesSum > 0 ? Math.round((exp.value / totalExpensesSum) * 100) : 0;
                    return (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: exp.color }} />
                          <div>
                            <p className="text-xs font-bold text-[#24201D]">{exp.name}</p>
                            <p className="text-[10px] text-[#7A6B5D]">{pct}% of total studio operational costs</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#24201D] tabular-nums">
                          {fmt(exp.value)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. TAB 2: FORMAL PROFIT & LOSS STATEMENT ───────────────────────────────────── */}
      {activeTab === 'pl' && (
        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-6 sm:p-8 shadow-xs max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E0D4] gap-2 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#720000] block mb-1">
                HENNA ROYALIN LUXURY STUDIO · CORPORATE ACCOUNTING
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#24201D]">
                Statement of Comprehensive Income (P&L)
              </h2>
              <p className="text-xs text-[#7A6B5D]">
                Reporting Period: {activeMonthDisplay} · Statement Ref: {docReportId}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-300">
                Operating Margin: {analytics.profitMargin}%
              </span>
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#720000] text-white text-xs font-bold hover:bg-[#8B1A1A] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} /> Print P&L
              </button>
            </div>
          </div>

          {/* Statement Line Items */}
          <div className="space-y-4 text-xs font-sans">
            {/* 1. REVENUE */}
            <div>
              <div className="flex justify-between font-bold text-xs uppercase tracking-wider text-[#720000] pb-1 border-b-2 border-[#720000]">
                <span>1. Operating Revenue</span>
                <span>Amount (BDT)</span>
              </div>
              <div className="divide-y divide-gray-100 mt-1">
                <div className="flex justify-between py-2 text-gray-700 pl-3">
                  <span>Gross Finished Cone Product Sales</span>
                  <span className="font-semibold text-gray-900 tabular-nums">{fmt(analytics.grossProductRevenue)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-700 pl-3">
                  <span>Customer Delivery Fees Collected</span>
                  <span className="font-semibold text-gray-900 tabular-nums">+{fmt(analytics.deliveryRevenue)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-sm text-gray-950 bg-gray-50 px-3 rounded-lg">
                  <span>Total Gross Turnover</span>
                  <span className="text-[#720000] tabular-nums">{fmt(analytics.totalRevenue)}</span>
                </div>
              </div>
            </div>

            {/* 2. COST OF GOODS SOLD */}
            <div>
              <div className="flex justify-between font-bold text-xs uppercase tracking-wider text-red-800 pb-1 border-b border-red-300">
                <span>2. Cost of Goods Sold (Direct Batch Production)</span>
                <span>Amount (BDT)</span>
              </div>
              <div className="divide-y divide-gray-100 mt-1">
                <div className="flex justify-between py-2 text-gray-700 pl-3">
                  <span>Raw Materials (Organic Sojat Powder, Cajeput Oil, Tea Tree, Sugar)</span>
                  <span className="font-semibold text-red-700 tabular-nums">-{fmt(analytics.orderCost * 0.75)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-700 pl-3">
                  <span>Packaging & Cone Materials (Cellophane Sheets, Cone Pins, Sealing)</span>
                  <span className="font-semibold text-red-700 tabular-nums">-{fmt(analytics.orderCost * 0.25)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-xs text-red-950 bg-red-50/60 px-3 rounded-lg">
                  <span>Total Cost of Goods Sold</span>
                  <span className="text-red-700 tabular-nums">-{fmt(analytics.orderCost)}</span>
                </div>
              </div>
            </div>

            {/* GROSS PROFIT */}
            <div className="flex justify-between py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 font-bold text-sm text-amber-950">
              <span>GROSS PROFIT (Revenue - COGS)</span>
              <span className="tabular-nums">{fmt(analytics.totalRevenue - analytics.orderCost)}</span>
            </div>

            {/* 3. OPERATING EXPENSES */}
            <div>
              <div className="flex justify-between font-bold text-xs uppercase tracking-wider text-purple-800 pb-1 border-b border-purple-300">
                <span>3. Operational Expenses</span>
                <span>Amount (BDT)</span>
              </div>
              <div className="divide-y divide-gray-100 mt-1">
                <div className="flex justify-between py-2 text-gray-700 pl-3">
                  <span>Staff Salaries & Cone Rolling Artisan Payroll</span>
                  <span className="font-semibold text-purple-900 tabular-nums">-{fmt(analytics.totalSalariesPaid)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-700 pl-3">
                  <span>Steadfast Courier Logistics & Shipping Fees</span>
                  <span className="font-semibold text-purple-900 tabular-nums">-{fmt(analytics.deliveryCost)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-700 pl-3">
                  <span>Studio Utilities, Consumables & Bubble Wrap</span>
                  <span className="font-semibold text-purple-900 tabular-nums">-৳4,500</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-xs text-purple-950 bg-purple-50/60 px-3 rounded-lg">
                  <span>Total Operating Expenses</span>
                  <span className="text-purple-900 tabular-nums">-{fmt(analytics.totalSalariesPaid + analytics.deliveryCost + 4500)}</span>
                </div>
              </div>
            </div>

            {/* 4. NET OPERATING PROFIT */}
            <div className="pt-2">
              <div className="flex justify-between items-center p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400">
                <div>
                  <span className="font-serif text-base font-bold text-emerald-950 block">
                    NET OPERATING PROFIT
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    Net cash earned after all raw material COGS, courier fees, and staff payroll
                  </span>
                </div>
                <span className="font-serif text-3xl font-extrabold text-emerald-800 tabular-nums">
                  {fmt(analytics.netProfit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. TAB 3: CONE UNIT ECONOMICS ──────────────────────────────────────────────── */}
      {activeTab === 'economics' && (
        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D4] mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#24201D]">
                Henna Royalin Cone Unit Economics & Margin Matrix
              </h3>
              <p className="text-xs text-[#7A6B5D]">
                Exact material cost breakdown, sales pricing, per-unit gross margin, and stock balance
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              Average Margin: ~93.5%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
                <tr>
                  <th className="py-3 px-4">Product / Cone Variant</th>
                  <th className="py-3 px-4">Material Cost / Unit</th>
                  <th className="py-3 px-4">Retail Selling Price</th>
                  <th className="py-3 px-4">Net Margin / Unit</th>
                  <th className="py-3 px-4">Gross Margin %</th>
                  <th className="py-3 px-4">Current Live Stock</th>
                  <th className="py-3 px-4">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D4]">
                {(analytics.unitEconomics || []).map((item: any, idx: number) => {
                  const profitUnit = item.price - item.cost;
                  const isLow = item.stock <= 20;
                  return (
                    <tr key={idx} className="hover:bg-[#FFFDF5] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#24201D]">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#720000] tabular-nums">
                        ৳{Math.round(item.cost).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#24201D] tabular-nums">
                        ৳{Math.round(item.price).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800 tabular-nums">
                        ৳{Math.round(profitUnit).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300">
                          {item.margin}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 tabular-nums">
                        {item.stock} cones
                      </td>
                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-[10px] border border-red-300 flex items-center gap-1 w-fit">
                            <AlertTriangle size={10} /> Low (≤20)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300 flex items-center gap-1 w-fit">
                            <CheckCircle2 size={10} /> Healthy Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 8. TAB 4: STEADFAST COURIER RECONCILIATION ──────────────────────────────────── */}
      {activeTab === 'logistics' && (
        <div className="space-y-5">
          {/* Steadfast Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E8E0D4] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#7A6B5D] block mb-1">Total Handed to Courier</span>
              <p className="text-2xl font-bold text-[#24201D] tabular-nums">{analytics.steadfastStats.totalDispatched}</p>
              <p className="text-[11px] text-gray-500 mt-1">Parcels dispatched</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-emerald-200 border-l-4 border-l-emerald-600 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-emerald-800 block mb-1">Delivered & Collected</span>
              <p className="text-2xl font-bold text-emerald-800 tabular-nums">{analytics.steadfastStats.delivered}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">Success Rate: {analytics.steadfastStats.successRate}%</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-blue-200 border-l-4 border-l-blue-600 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-blue-800 block mb-1">In-Transit Parcels</span>
              <p className="text-2xl font-bold text-blue-900 tabular-nums">{analytics.steadfastStats.inTransit}</p>
              <p className="text-[11px] text-blue-700 mt-1">On road for delivery</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-purple-200 border-l-4 border-l-purple-600 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-purple-800 block mb-1">COD Remittance Collected</span>
              <p className="text-2xl font-bold text-purple-950 tabular-nums">{fmt(analytics.steadfastStats.codCollected)}</p>
              <p className="text-[11px] text-purple-700 mt-1">Pending: {fmt(analytics.steadfastStats.codPending)}</p>
            </div>
          </div>

          {/* Detailed Courier Tracking Overview */}
          <div className="bg-white rounded-2xl border border-[#E8E0D4] p-5 shadow-xs">
            <h3 className="font-serif text-base font-bold text-[#24201D] mb-3">
              Steadfast Courier Delivery Orders & Return Restock Status
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Steadfast Tracking</th>
                    <th className="py-3 px-4">City / Zone</th>
                    <th className="py-3 px-4">COD Payable</th>
                    <th className="py-3 px-4">Courier Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D4]">
                  {(analytics.filteredOrders || []).slice(0, 8).map((o: any) => (
                    <tr key={o.id} className="hover:bg-[#FFFDF5]">
                      <td className="py-3 px-4 font-bold text-[#24201D]">{o.id}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{o.customerName}</td>
                      <td className="py-3 px-4 font-mono text-[#720000] font-bold">
                        {o.steadfastTrackingCode || 'SF-PENDING'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{o.deliveryAddress ? o.deliveryAddress.slice(0, 24) + '...' : 'Dhaka'}</td>
                      <td className="py-3 px-4 font-bold text-emerald-800 tabular-nums">{fmt(o.total)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          o.orderStatus === 'cancelled' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                          {o.orderStatus === 'delivered' ? 'Delivered & COD Remitted' :
                           o.orderStatus === 'cancelled' ? 'Cancelled & Restocked' : 'In-Transit with Steadfast'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. TAB 5: MANUFACTURED BATCHES ─────────────────────────────────────────────── */}
      {activeTab === 'production' && (
        <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-[#E8E0D4] flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-serif text-base font-bold text-[#24201D]">
                Manufactured Cone Batches & Yield Analysis
              </h3>
              <p className="text-xs text-[#7A6B5D] mt-0.5">
                Every production run records output cones, exact material expenses, selling values, and projected gross margins
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-bold">
              Total Cones: {analytics.totalProducedCones.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
                <tr>
                  <th className="py-3 px-4">Batch Name</th>
                  <th className="py-3 px-4">Cones Output</th>
                  <th className="py-3 px-4">Unit Material Cost</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Batch Material Cost</th>
                  <th className="py-3 px-4">Projected Turnover</th>
                  <th className="py-3 px-4">Net Gross Return</th>
                  <th className="py-3 px-4">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D4]">
                {(analytics.recentBatches || []).map((b: any, i: number) => (
                  <tr key={i} className="hover:bg-[#FFFDF5]">
                    <td className="py-3 px-4 font-bold text-[#24201D]">{b.name}</td>
                    <td className="py-3 px-4 font-bold text-indigo-950 tabular-nums">
                      {b.cones.toLocaleString()} cones
                    </td>
                    <td className="py-3 px-4 font-bold text-[#720000] tabular-nums">
                      ৳{b.costPerCone}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#24201D] tabular-nums">
                      ৳{b.sellingPrice}
                    </td>
                    <td className="py-3 px-4 text-red-700 font-semibold tabular-nums">
                      {fmt(b.totalCost)}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#24201D] tabular-nums">
                      {fmt(b.totalRevenue)}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-800 tabular-nums">
                      {fmt(b.profit)}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {b.margin}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 10. OFFICIAL MONTHLY STATEMENT PDF & PRINT MODAL ────────────────────────────── */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8E0D4] flex flex-col">
            {/* Modal Controls Bar (Hidden during print) */}
            <div className="no-print p-4 bg-[#FAF8F3] border-b border-[#E8E0D4] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <FileBarChart size={20} className="text-[#720000]" />
                <span className="font-bold text-sm text-[#24201D]">
                  Official Monthly Financial Statement Preview · {activeMonthDisplay}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintPDF}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #720000 0%, #8B1A1A 100%)', border: '1px solid #D9A900' }}
                >
                  <Printer size={15} className="text-[#F8E29B]" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:text-black hover:bg-gray-200 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── PRINTABLE DOCUMENT BODY (Targeted by @media print) ─────────────────────── */}
            <div id="printable-monthly-report" className="p-8 sm:p-12 space-y-6 text-gray-900 bg-white">
              {/* Luxury Corporate Header */}
              <div className="border-b-2 border-[#720000] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-2xl font-black text-[#720000] tracking-wider">
                      HENNA ROYALIN
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D9A900]/20 text-[#720000] border border-[#D9A900]">
                      LUXURY STUDIO
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Artisan Organic Mehendi Cones & Event Management Hub
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Dhaka, Bangladesh · Official Accounts & Operations Department
                  </p>
                </div>
                <div className="text-right sm:border-l-2 sm:border-[#E8E0D4] sm:pl-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#720000] block">
                    MONTHLY FINANCIAL AUDIT
                  </span>
                  <p className="font-serif text-xl font-bold text-gray-900 mt-0.5">
                    {activeMonthDisplay}
                  </p>
                  <p className="text-[11px] font-mono text-gray-600 mt-0.5">
                    Ref: <strong>{docReportId}</strong>
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Executive Summary Metrics Box */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Revenue</span>
                  <span className="text-xl font-bold text-[#720000] tabular-nums">{fmt(analytics.totalRevenue)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Expenses (COGS+Payroll)</span>
                  <span className="text-xl font-bold text-red-700 tabular-nums">
                    {fmt(analytics.orderCost + analytics.totalSalariesPaid + analytics.deliveryCost)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Net Operating Profit</span>
                  <span className="text-xl font-bold text-emerald-800 tabular-nums">{fmt(analytics.netProfit)} ({analytics.profitMargin}%)</span>
                </div>
              </div>

              {/* Detailed Financial Statement Table */}
              <div>
                <h4 className="font-serif text-sm font-bold text-[#720000] uppercase tracking-wider mb-2 border-b pb-1">
                  1. Profit & Loss Performance Breakdown
                </h4>
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-gray-200">
                    <tr className="font-semibold text-gray-900 bg-gray-50">
                      <td className="py-2 px-3">Gross Finished Cone Product Sales Revenue</td>
                      <td className="py-2 px-3 text-right tabular-nums">{fmt(analytics.grossProductRevenue)}</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td className="py-2 px-3 pl-6">Steadfast Customer Delivery Surcharge Collected</td>
                      <td className="py-2 px-3 text-right tabular-nums">+{fmt(analytics.deliveryRevenue)}</td>
                    </tr>
                    <tr className="font-bold text-gray-950 bg-red-50/40">
                      <td className="py-2.5 px-3">TOTAL REVENUE (A)</td>
                      <td className="py-2.5 px-3 text-right text-[#720000] tabular-nums">{fmt(analytics.totalRevenue)}</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td className="py-2 px-3 pl-6">Cost of Goods Sold (Henna Powder, Essential Oils, Packaging, Pins)</td>
                      <td className="py-2 px-3 text-right text-red-700 tabular-nums">-{fmt(analytics.orderCost)}</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td className="py-2 px-3 pl-6">Staff Payroll & Cone Rolling Artisan Wages Disbursed</td>
                      <td className="py-2 px-3 text-right text-red-700 tabular-nums">-{fmt(analytics.totalSalariesPaid)}</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td className="py-2 px-3 pl-6">Steadfast Courier Delivery Charges Incurred</td>
                      <td className="py-2 px-3 text-right text-red-700 tabular-nums">-{fmt(analytics.deliveryCost)}</td>
                    </tr>
                    <tr className="font-bold text-gray-950 bg-gray-100">
                      <td className="py-2 px-3">TOTAL OPERATING EXPENSES (B)</td>
                      <td className="py-2 px-3 text-right text-red-800 tabular-nums">
                        -{fmt(analytics.orderCost + analytics.totalSalariesPaid + analytics.deliveryCost)}
                      </td>
                    </tr>
                    <tr className="font-bold text-sm bg-emerald-50 text-emerald-950 border-t-2 border-emerald-600">
                      <td className="py-3 px-3">NET OPERATING PROFIT (A - B)</td>
                      <td className="py-3 px-3 text-right text-emerald-800 tabular-nums">
                        {fmt(analytics.netProfit)} ({analytics.profitMargin}%)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Product Sales & Unit Economics Table */}
              <div>
                <h4 className="font-serif text-sm font-bold text-[#720000] uppercase tracking-wider mb-2 border-b pb-1">
                  2. Cone Production & Unit Margin Economics
                </h4>
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 font-bold uppercase text-[10px] text-gray-600">
                    <tr>
                      <th className="py-2 px-2.5">Product Name</th>
                      <th className="py-2 px-2.5">Unit Material Cost</th>
                      <th className="py-2 px-2.5">Retail Price</th>
                      <th className="py-2 px-2.5">Profit / Unit</th>
                      <th className="py-2 px-2.5">Margin %</th>
                      <th className="py-2 px-2.5">Live Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(analytics.unitEconomics || []).map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-2 px-2.5 font-bold text-gray-900">{item.name}</td>
                        <td className="py-2 px-2.5 text-red-700 font-semibold tabular-nums">৳{Math.round(item.cost).toLocaleString()}</td>
                        <td className="py-2 px-2.5 text-gray-900 font-semibold tabular-nums">৳{Math.round(item.price).toLocaleString()}</td>
                        <td className="py-2 px-2.5 text-emerald-800 font-bold tabular-nums">৳{Math.round(item.price - item.cost).toLocaleString()}</td>
                        <td className="py-2 px-2.5 text-emerald-700 font-bold">{item.margin}%</td>
                        <td className="py-2 px-2.5 font-semibold text-gray-800 tabular-nums">{item.stock} cones</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Steadfast Courier Logistics Performance */}
              <div>
                <h4 className="font-serif text-sm font-bold text-[#720000] uppercase tracking-wider mb-2 border-b pb-1">
                  3. Steadfast Courier Logistics & COD Remittance Reconciliation
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs p-3 bg-gray-50 rounded-lg border">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-bold">Dispatched</span>
                    <span className="font-bold text-gray-900 text-sm">{analytics.steadfastStats.totalDispatched}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block font-bold">Delivered</span>
                    <span className="font-bold text-emerald-700 text-sm">{analytics.steadfastStats.delivered}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block font-bold">Success Rate</span>
                    <span className="font-bold text-emerald-700 text-sm">{analytics.steadfastStats.successRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block font-bold">COD Remittance</span>
                    <span className="font-bold text-purple-900 text-sm">{fmt(analytics.steadfastStats.codCollected)}</span>
                  </div>
                </div>
              </div>

              {/* Official Signatures & Verification Block */}
              <div className="pt-8 border-t-2 border-gray-200 grid grid-cols-3 gap-6 text-center text-xs">
                <div className="space-y-1">
                  <div className="border-b border-gray-400 pb-12" />
                  <p className="font-bold text-gray-900 mt-2">Prepared By</p>
                  <p className="text-[10px] text-gray-500">Lead Accounts & Inventory Specialist</p>
                </div>
                <div className="space-y-1">
                  <div className="border-b border-gray-400 pb-12" />
                  <p className="font-bold text-gray-900 mt-2">Verified By</p>
                  <p className="text-[10px] text-gray-500">Production & Quality Assurance Master</p>
                </div>
                <div className="space-y-1">
                  <div className="border-b border-gray-400 pb-12" />
                  <p className="font-bold text-[#720000] mt-2">Sumaiya Akter</p>
                  <p className="text-[10px] text-gray-500">Managing Director / Owner, Henna Royalin</p>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions (Hidden on Print) */}
            <div className="no-print p-4 bg-[#FAF8F3] border-t border-[#E8E0D4] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E8E0D4] text-xs font-bold text-[#7A6B5D] hover:bg-white transition cursor-pointer"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={handlePrintPDF}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 cursor-pointer transition hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #720000 0%, #8B1A1A 100%)', border: '1px solid #D9A900' }}
              >
                <Printer size={15} className="text-[#F8E29B]" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
