import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  AlertTriangle,
  Package,
  Factory,
  Receipt,
  Boxes,
  Truck,
  Store,
} from "lucide-react";
import { db } from "../lib/db";
import {
  Badge,
  getOrderStatusBadge,
  getPaymentStatusBadge,
  getDeliveryStatusBadge,
} from "../components/ui/Badge";

interface DashboardProps {
  onNavigate: (page: string) => void;
  onOpenPOS?: () => void;
}

// ─── Chart data ──────────────────────────────────────────────────────────────
const allChartData = [
  { month: "Jan", revenue: 62000, expense: 28000, profit: 34000 },
  { month: "Feb", revenue: 58000, expense: 25000, profit: 33000 },
  { month: "Mar", revenue: 71000, expense: 30000, profit: 41000 },
  { month: "Apr", revenue: 65000, expense: 27000, profit: 38000 },
  { month: "May", revenue: 82000, expense: 35000, profit: 47000 },
  { month: "Jun", revenue: 94000, expense: 38000, profit: 56000 },
  { month: "Jul", revenue: 88000, expense: 36000, profit: 52000 },
  { month: "Aug", revenue: 76000, expense: 31000, profit: 45000 },
  { month: "Sep", revenue: 78500, expense: 32200, profit: 46300 },
];

type ChartFilter = "Today" | "7 Days" | "30 Days" | "3 Months" | "This Year";
const chartFilters: ChartFilter[] = ["Today", "7 Days", "30 Days", "3 Months", "This Year"];

const productCategoryData = [
  { name: "Organic Henna Cones", value: 52, color: "#720000" },
  { name: "Henna Oil & Powders", value: 24, color: "#D9A900" },
  { name: "Bridal & Party Cones", value: 16, color: "#166534" },
  { name: "Packaging & Rolls", value: 8, color: "#7A6B5D" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(amount: number) {
  return "৳" + Math.round(amount || 0).toLocaleString("en-IN");
}

function fmtChartValue(value: number) {
  if (value >= 1000) return "৳" + (value / 1000).toFixed(0) + "k";
  return "৳" + value;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function formatBatchDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface KPICardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  trendText: string;
}

function KPICard({ icon, iconBg, label, value, trend, trendText }: KPICardProps) {
  return (
    <div
      className="card-hover"
      style={{
        background: "#fff",
        border: "1px solid #E8E0D4",
        borderRadius: 12,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 1px 4px rgba(36,32,29,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: 12,
            fontWeight: 600,
            color: trend === "up" ? "#166534" : trend === "down" ? "#991B1B" : "#7A6B5D",
            background: trend === "up" ? "#DCFCE7" : trend === "down" ? "#FEE2E2" : "#F5F0E8",
            borderRadius: 100,
            padding: "3px 9px",
          }}
        >
          {trend === "up" ? (
            <ArrowUpRight size={13} />
          ) : trend === "down" ? (
            <ArrowDownRight size={13} />
          ) : null}
          {trendText}
        </span>
      </div>
      <div>
        <div
          className="tabular-nums"
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#24201D",
            lineHeight: 1.1,
            fontFamily: "'Manrope', sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "#7A6B5D",
            marginTop: 4,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

interface MetricBandProps {
  label: string;
  value: string;
  borderColor: string;
  textColor: string;
  sub?: string;
}

function MetricBand({ label, value, borderColor, textColor, sub }: MetricBandProps) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        border: "1px solid #E8E0D4",
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: 12,
        padding: "18px 22px",
        boxShadow: "0 1px 4px rgba(36,32,29,0.05)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#7A6B5D",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        className="tabular-nums"
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: textColor,
          fontFamily: "'Manrope', sans-serif",
          letterSpacing: "-0.3px",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "#7A6B5D", marginTop: 3 }}>{sub}</div>
      )}
    </div>
  );
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E0D4",
        borderRadius: 10,
        padding: "10px 16px",
        boxShadow: "0 4px 16px rgba(36,32,29,0.1)",
        fontFamily: "'Manrope', sans-serif",
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6, color: "#24201D" }}>{label}</div>
      {payload.map((entry: any) => (
        <div
          key={entry.name}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: entry.color,
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span style={{ color: "#7A6B5D", textTransform: "capitalize" }}>{entry.name}:</span>
          <span style={{ fontWeight: 600, color: "#24201D" }}>{fmt(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Custom PieChart legend ───────────────────────────────────────────────────
function PieLegend({ data }: { data: typeof productCategoryData }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((entry) => (
        <div
          key={entry.name}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: entry.color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, color: "#24201D", fontWeight: 500 }}>{entry.name}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#24201D" }}>{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Dashboard({ onNavigate, onOpenPOS }: DashboardProps) {
  const [chartFilter, setChartFilter] = useState<ChartFilter>("This Year");
  const [refreshKey, setRefreshKey] = useState(0);

  // Subscribe to reactive database changes
  React.useEffect(() => {
    return db.subscribe(() => {
      setRefreshKey(k => k + 1);
    });
  }, []);

  const stats = useMemo(() => db.getStats(), [refreshKey]);
  const analytics = useMemo(() => db.getAnalytics('this_month'), [refreshKey]);
  const orders = useMemo(() => db.getOrders().slice(0, 6), [refreshKey]);
  const batches = useMemo(() => db.getProductionBatches().slice(0, 4), [refreshKey]);
  const lowStockProducts = useMemo(
    () => db.getProducts().filter((p) => p.stock <= (p.lowStockLevel || 20)),
    [refreshKey]
  );
  const chartData = useMemo(() => {
    const trends = analytics.monthlyTrends || [];
    switch (chartFilter) {
      case "Today":
        return [{ month: "Today", revenue: stats.todayRevenue, expense: 0, profit: stats.todayRevenue }];
      case "7 Days":
        return trends.slice(-3);
      case "30 Days":
        return trends.slice(-4);
      case "3 Months":
        return trends.slice(-3);
      case "This Year":
      default:
        return trends;
    }
  }, [chartFilter, analytics.monthlyTrends, stats.todayRevenue]);

  const quickActions = [
    { label: "AI Order (Paste)", icon: <Sparkles size={14} className="text-[#D9A900]" />, page: "orders" },
    { label: "POS Terminal", icon: <Store size={14} />, page: "pos" },
    { label: "Batch Costing", icon: <Plus size={14} />, page: "production-capacity" },
    { label: "Stock & Inventory", icon: <Package size={14} />, page: "inventory" },
    { label: "New Order", icon: <Plus size={14} />, page: "orders" },
    { label: "Steadfast Courier", icon: <Truck size={14} />, page: "steadfast" },
    { label: "Payments Ledger", icon: <ShoppingBag size={14} />, page: "payments" },
    { label: "Analytics & P/L", icon: <TrendingUp size={14} />, page: "reports" },
  ];

  return (
    <div
      className="dash-container"
      style={{
        background: "#FAF8F3",
        minHeight: "100vh",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* ── 1. Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <h1
              className="font-serif"
              style={{ fontSize: 26, fontWeight: 700, color: "#24201D", margin: 0 }}
            >
              Good morning, Sumaiya
            </h1>
            <Sparkles size={22} color="#D9A900" fill="#D9A900" />
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#7A6B5D",
              fontWeight: 500,
              marginBottom: 2,
            }}
          >
            Connected Production, Inventory & Steadfast Logistics Hub
          </div>
        </div>

        {/* ── 2. Quick Actions ──────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                if (action.page) {
                  onNavigate(action.page);
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 100,
                border: "1.5px solid #E8E0D4",
                background: "#fff",
                color: "#720000",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#720000";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#720000";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                (e.currentTarget as HTMLButtonElement).style.color = "#720000";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8E0D4";
              }}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Prominent Low Stock Warning Banner if any item has <= 20 stock ─── */}
      {lowStockProducts.length > 0 && (
        <div
          style={{
            background: "#FEF2F2",
            border: "2px solid #FCA5A5",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            boxShadow: "0 2px 8px rgba(185,28,28,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#DC2626",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>
                Low Stock Alert ({lowStockProducts.length} items at or below 20 cones threshold!)
              </div>
              <div style={{ fontSize: 12.5, color: "#B91C1C", marginTop: 2 }}>
                {lowStockProducts.map(p => `${p.name}: ${p.stock} cones remaining`).join(" • ")}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onNavigate("production-capacity")}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "#720000",
                color: "#fff",
                border: "none",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Produce New Batch
            </button>
            <button
              onClick={() => onNavigate("inventory")}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                background: "#fff",
                color: "#991B1B",
                border: "1px solid #FCA5A5",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View Inventory Stock
            </button>
          </div>
        </div>
      )}

      {/* ── 3. KPI Cards (4-column) ───────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 16,
        }}
        className="kpi-grid"
      >
        <KPICard
          icon={<Factory size={20} color="#720000" />}
          iconBg="rgba(114,0,0,0.10)"
          label="Total Cones Produced"
          value={`${analytics.totalProducedCones.toLocaleString()} Cones`}
          trend="up"
          trendText={`${batches.length} batches saved`}
        />
        <KPICard
          icon={<ShoppingBag size={20} color="#92400E" />}
          iconBg="rgba(217,169,0,0.12)"
          label="Total Orders"
          value={String(analytics.totalOrdersCount)}
          trend="up"
          trendText={`${analytics.completedOrdersCount} delivered`}
        />
        <KPICard
          icon={<TrendingUp size={20} color="#166534" />}
          iconBg="rgba(22,101,52,0.10)"
          label="Total Earned (Revenue)"
          value={fmt(analytics.totalRevenue)}
          trend="up"
          trendText="Active sales"
        />
        <KPICard
          icon={<Truck size={20} color="#0369A1" />}
          iconBg="rgba(3,105,161,0.10)"
          label="Steadfast Courier"
          value={`${analytics.inTransitOrdersCount} In Transit`}
          trend="neutral"
          trendText={analytics.failedOrdersCount > 0 ? `${analytics.failedOrdersCount} failed alert!` : "Dispatched"}
        />
      </div>

      {/* ── 4. Second KPI row (3 wider cards) ────────────────────────────── */}
      <div className="metric-row" style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <MetricBand
          label="Total Revenue"
          value={fmt(analytics.totalRevenue)}
          borderColor="#166534"
          textColor="#166534"
          sub="September 2026 sales"
        />
        <MetricBand
          label="Total Costs & Expenses"
          value={fmt(analytics.productionCost + analytics.deliveryCost)}
          borderColor="#991B1B"
          textColor="#991B1B"
          sub="Materials & courier shipping"
        />
        <MetricBand
          label="Net Profit"
          value={fmt(analytics.netProfit)}
          borderColor="#D9A900"
          textColor="#D9A900"
          sub={`Margin ${analytics.profitMargin}%`}
        />
      </div>

      {/* ── 5. Revenue vs Expense Chart ──────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E8E0D4",
          borderRadius: 12,
          padding: "22px 24px",
          marginBottom: 20,
          boxShadow: "0 1px 4px rgba(36,32,29,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <h2
            className="font-serif"
            style={{ fontSize: 17, fontWeight: 600, color: "#24201D", margin: 0 }}
          >
            Revenue vs Expense
          </h2>
          <div style={{ display: "flex", gap: 4, background: "#FAF8F3", borderRadius: 8, padding: 3 }}>
            {chartFilters.map((f) => (
              <button
                key={f}
                onClick={() => setChartFilter(f)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: chartFilter === f ? "#720000" : "transparent",
                  color: chartFilter === f ? "#fff" : "#7A6B5D",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Manrope', sans-serif",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Chart legend */}
        <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
          {[
            { color: "#720000", label: "Revenue" },
            { color: "#D9A900", label: "Expense" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 12,
                  height: 3,
                  borderRadius: 2,
                  background: item.color,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 12, color: "#7A6B5D", fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#720000" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#720000" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D9A900" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#D9A900" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#7A6B5D", fontFamily: "Manrope" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#7A6B5D", fontFamily: "Manrope" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={fmtChartValue}
              width={50}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#720000"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              dot={{ fill: "#720000", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#D9A900"
              strokeWidth={2}
              fill="url(#colorExpense)"
              dot={{ fill: "#D9A900", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── 6. Two-column: Recent Orders + Production Batches ─────────────── */}
      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 20 }}>
        {/* Recent Orders */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E8E0D4",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(36,32,29,0.05)",
          }}
        >
          <div
            style={{
              padding: "18px 20px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #E8E0D4",
            }}
          >
            <h2
              className="font-serif"
              style={{ fontSize: 16, fontWeight: 600, color: "#24201D", margin: 0 }}
            >
              Recent Orders
            </h2>
            <button
              onClick={() => onNavigate("orders")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                color: "#720000",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                padding: 0,
              }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "36px 16px",
                        color: "#7A6B5D",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      No orders placed yet. Create an order via POS Terminal or New Order button.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                  const orderBadge = getOrderStatusBadge(order.orderStatus);
                  const payBadge = getPaymentStatusBadge(order.paymentStatus);
                  const deliveryBadge = getDeliveryStatusBadge(order.deliveryStatus);
                  return (
                    <tr
                      key={order.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => onNavigate("orders")}
                    >
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 12.5,
                            color: "#720000",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {order.orderId}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#24201D" }}>
                          {order.customerName}
                        </div>
                        <div style={{ fontSize: 11.5, color: "#7A6B5D" }}>
                          {order.source}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12.5, color: "#24201D" }}>
                          {order.items.map((i) => i.productName).join(", ")}
                        </span>
                      </td>
                      <td>
                        <span
                          className="tabular-nums"
                          style={{ fontWeight: 700, fontSize: 13, color: "#24201D" }}
                        >
                          {fmt(order.total)}
                        </span>
                      </td>
                      <td>
                        <Badge variant={payBadge.variant} label={payBadge.label} />
                      </td>
                      <td>
                        <Badge variant={deliveryBadge.variant} label={deliveryBadge.label} />
                      </td>
                      <td>
                        <Badge variant={orderBadge.variant} label={orderBadge.label} />
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("orders");
                          }}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#720000",
                            background: "rgba(114,0,0,0.06)",
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontFamily: "'Manrope', sans-serif",
                            whiteSpace: "nowrap",
                          }}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            </table>
          </div>
        </div>

        {/* Production Batches & Costing Suite */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E8E0D4",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(36,32,29,0.05)",
          }}
        >
          <div
            style={{
              padding: "18px 20px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #E8E0D4",
            }}
          >
            <div>
              <h2
                className="font-serif"
                style={{ fontSize: 16, fontWeight: 600, color: "#24201D", margin: 0 }}
              >
                Production & Costing Batches
              </h2>
              <p style={{ fontSize: 11, color: "#7A6B5D", margin: "2px 0 0" }}>
                1kg powder = 150 cones · ৳6 avg cost/cone
              </p>
            </div>
            <button
              onClick={() => onNavigate("production-capacity")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                color: "#720000",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                padding: 0,
              }}
            >
              Costing Suite <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ padding: "6px 0" }}>
            {batches.length === 0 ? (
              <div style={{ padding: "30px 20px", textAlign: "center", color: "#7A6B5D" }}>
                <p style={{ fontSize: 13 }}>No active production batches logged.</p>
                <button
                  onClick={() => onNavigate("production-capacity")}
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#720000",
                    background: "#FAF3E6",
                    border: "1px solid #D9A900",
                    padding: "6px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Create First Batch
                </button>
              </div>
            ) : (
              batches.map((batch, idx) => {
                const statusVariant =
                  batch.status === "completed"
                    ? "success"
                    : batch.status === "in_progress"
                    ? "warning"
                    : "muted";
                const statusLabel =
                  batch.status === "completed"
                    ? "Completed"
                    : batch.status === "in_progress"
                    ? "Mixing / Filling"
                    : "Planned";

                return (
                  <div
                    key={batch.id}
                    style={{
                      padding: "14px 20px",
                      borderBottom:
                        idx < batches.length - 1 ? "1px solid #F0EBE3" : "none",
                      cursor: "pointer",
                      transition: "background 0.12s",
                    }}
                    onClick={() => onNavigate("production-capacity")}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.background = "#FAF8F3")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.background = "transparent")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#fff",
                            background: "#720000",
                            borderRadius: 100,
                            padding: "2px 9px",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {batch.batchId}
                        </span>
                        <Badge variant={statusVariant} label={statusLabel} dot={false} />
                      </div>
                      <span
                        className="tabular-nums"
                        style={{ fontSize: 13, fontWeight: 700, color: "#166534", flexShrink: 0 }}
                      >
                        ৳{batch.costPerUnit || 6} / cone
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: 13.5, color: "#24201D", marginBottom: 2 }}>
                      {batch.productName || "Organic Henna Cones"}
                    </div>
                    <div style={{ fontSize: 12, color: "#7A6B5D", marginBottom: 4 }}>
                      Batch Date: {formatBatchDate(batch.date)}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#24201D", fontWeight: 600 }}>
                        Output: {(batch.actualOutput || batch.expectedOutput || 1500).toLocaleString()} cones
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#720000",
                          background: "rgba(114,0,0,0.06)",
                          borderRadius: 100,
                          padding: "2px 8px",
                          flexShrink: 0,
                        }}
                      >
                        Total Cost: {fmt(batch.totalCost || 9000)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── 7. Bottom row: Low Stock + Service Breakdown ──────────────────── */}
      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        {/* Low Stock Alert */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E8E0D4",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(36,32,29,0.05)",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #E8E0D4",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AlertTriangle size={16} color="#92400E" />
            <h2
              className="font-serif"
              style={{ fontSize: 16, fontWeight: 600, color: "#24201D", margin: 0 }}
            >
              Low Stock Alert
            </h2>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                fontWeight: 700,
                color: "#991B1B",
                background: "#FEE2E2",
                borderRadius: 100,
                padding: "2px 9px",
              }}
            >
              {lowStockProducts.length} items
            </span>
          </div>

          <div style={{ padding: "8px 0" }}>
            {lowStockProducts.length === 0 ? (
              <div
                style={{
                  padding: "24px 20px",
                  textAlign: "center",
                  color: "#7A6B5D",
                  fontSize: 13,
                }}
              >
                All products are well-stocked.
              </div>
            ) : (
              lowStockProducts.map((product, idx) => {
                const pct = Math.min(
                  100,
                  Math.round((product.stock / product.lowStockLevel) * 100)
                );
                const isCritical = product.stock < product.lowStockLevel * 0.5;
                const barColor = isCritical ? "#991B1B" : "#92400E";
                const barBg = isCritical ? "#FEE2E2" : "#FEF3C7";

                return (
                  <div
                    key={product.id}
                    style={{
                      padding: "13px 20px",
                      borderBottom:
                        idx < lowStockProducts.length - 1 ? "1px solid #F0EBE3" : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: "#FAF8F3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: "1px solid #E8E0D4",
                      }}
                    >
                      <Package size={15} color="#7A6B5D" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#24201D",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 220,
                          }}
                        >
                          {product.name}
                        </span>
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: barColor,
                            flexShrink: 0,
                          }}
                        >
                          {product.stock} / {product.lowStockLevel}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div
                        style={{
                          height: 5,
                          borderRadius: 100,
                          background: barBg,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: barColor,
                            borderRadius: 100,
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 11, color: "#7A6B5D", marginTop: 3 }}>
                        {isCritical ? "Critical — reorder now" : "Below minimum level"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Service Breakdown Donut */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E8E0D4",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(36,32,29,0.05)",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #E8E0D4",
            }}
          >
            <h2
              className="font-serif"
              style={{ fontSize: 16, fontWeight: 600, color: "#24201D", margin: 0 }}
            >
              Product & Category Sales
            </h2>
            <div style={{ fontSize: 12, color: "#7A6B5D", marginTop: 2 }}>
              Cones, Oils & Packs distribution
            </div>
          </div>

          <div
            style={{
              padding: "16px 24px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={productCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, ""]}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E8E0D4",
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "Manrope",
                    boxShadow: "0 4px 16px rgba(36,32,29,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ width: "100%" }}>
              <PieLegend data={productCategoryData} />
            </div>

            <div
              style={{
                width: "100%",
                paddingTop: 12,
                borderTop: "1px solid #F0EBE3",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: "#7A6B5D" }}>Total batch production</span>
              <span
                className="tabular-nums"
                style={{ fontSize: 15, fontWeight: 700, color: "#720000" }}
              >
                1,500 Cones/mo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive grid styles via injected style tag */}
      <style>{`
        .dash-container { padding: 28px 28px 40px; }
        @media (max-width: 1100px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .split-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .dash-container { padding: 12px 12px 40px; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .metric-row { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
