import { useState } from "react";
import {
  LayoutDashboard, ShoppingBag, Users, Package,
  Boxes, Factory, Truck, ClipboardList,
  CreditCard, BarChart2, Settings, ChevronLeft, X, FileBarChart, Key, Store, LogOut, type LucideIcon,
} from "lucide-react";
import logo from "../../imports/Henna_Royalin.png";
import { getCanonicalPath } from "../../lib/routes";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onLogout?: () => void;
}

export interface NavItem {
  label: string;
  page: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    group: "Workflow",
    items: [
      { label: "Dashboard", page: "dashboard", icon: LayoutDashboard, description: "Connected KPIs & low stock alerts" },
      { label: "POS Terminal", page: "pos", icon: Store, description: "Full-page product sales & courier checkout" },
      { label: "Order", page: "orders", icon: ShoppingBag, description: "Customer orders & courier dispatch" },
      { label: "Customers", page: "customers", icon: Users, description: "Auto-collected leads from all orders" },
      { label: "Product", page: "products", icon: Package, description: "All stock products & catalog" },
      { label: "Stock", page: "stock", icon: Boxes, description: "Live stock levels & inventory balance" },
      { label: "Production", page: "production", icon: Factory, description: "Cone formulas (20g/25g/30g), costing & profit" },
      { label: "Inventory", page: "inventory", icon: ClipboardList, description: "Raw materials, stock in & consumption logs" },
      { label: "Payment", page: "payments", icon: CreditCard, description: "COD vs digital payment ledger" },
      { label: "Employee & Salary", page: "employees", icon: Users, description: "Staff payroll, deductions & salary vouchers" },
      { label: "Staff & Access", page: "staff", icon: Key, description: "Staff credentials & role permissions" },
      { label: "Report", page: "reports", icon: FileBarChart, description: "Production & sales batch reports" },
      { label: "Analytics", page: "analytics", icon: BarChart2, description: "Profit/loss & time-filtered metrics" },
      { label: "Steadfast", page: "steadfast", icon: Truck, description: "Courier tracking, failed alerts & restock" },
      { label: "Settings", page: "settings", icon: Settings, description: "Steadfast API & store preferences" },
    ]
  }
];

/* ── Logout Confirmation Modal ── */
function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.15s ease",
      }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: "28px 28px 22px",
          width: 320,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "slideUp 0.2s ease",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "rgba(114,0,0,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 4,
        }}>
          <LogOut size={22} style={{ color: "#720000" }} />
        </div>

        {/* Title */}
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#24201D", textAlign: "center" }}>
          Log Out?
        </div>

        {/* Message */}
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#7A6B5D", textAlign: "center", lineHeight: 1.6, marginBottom: 4 }}>
          Are you sure you want to log out of<br />
          <strong style={{ color: "#24201D" }}>Henna Royalin Business Suite</strong>?
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, width: "100%", marginTop: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              border: "1.5px solid #E8E0D4",
              background: "#FAF8F3",
              fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 13.5, color: "#6B5E52",
              cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#F0EBE3")}
            onMouseLeave={e => (e.currentTarget.style.background = "#FAF8F3")}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              border: "none",
              background: "#720000",
              fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 13.5, color: "#FFFFFF",
              cursor: "pointer", transition: "background 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#5a0000")}
            onMouseLeave={e => (e.currentTarget.style.background = "#720000")}
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggle, isMobile, onLogout }: SidebarProps) {
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);
  const [hoveredToggle, setHoveredToggle] = useState(false);
  const [hoveredLogout, setHoveredLogout] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const effectiveCollapsed = isMobile ? false : collapsed;
  const width = effectiveCollapsed ? 64 : 240;

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout?.();
  };

  return (
    <>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      <aside
        style={{
          width,
          minWidth: width,
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E8E0D4",
          transition: "width 0.25s ease, min-width 0.25s ease",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "hidden",
          userSelect: "none",
        }}
      >
        {/* Logo + brand */}
        <div style={{
          padding: effectiveCollapsed ? "20px 0" : "20px 16px",
          borderBottom: "1px solid #E8E0D4",
          display: "flex",
          alignItems: "center",
          justifyContent: effectiveCollapsed ? "center" : "space-between",
          gap: 10,
          minHeight: 80,
          overflow: "hidden",
        }}>
          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                e.preventDefault();
                onNavigate("dashboard");
              }
            }}
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", cursor: "pointer" }}
          >
            <img src={logo} alt="Henna Royalin" loading="eager" decoding="async" style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
            {!effectiveCollapsed && (
              <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: "#720000", letterSpacing: "0.01em", lineHeight: 1.2 }}>
                  Henna Royalin
                </div>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 10, color: "#D9A900", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>
                  Business Suite
                </div>
              </div>
            )}
          </a>
          {isMobile && (
            <button onClick={onToggle} style={{ padding: 6, borderRadius: 8, border: "1px solid #E8E0D4", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", color: "#7A6B5D" }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Scrollable nav */}
        <div className="sidebar-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "12px 0" }}>
          {navGroups.map((group) => (
            <div key={group.group} style={{ marginBottom: 4 }}>
              {!effectiveCollapsed ? (
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 10, color: "#D9A900", letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px 4px" }}>
                  {group.group}
                </div>
              ) : (
                <div style={{ height: 1, backgroundColor: "#E8E0D4", margin: "8px 12px", opacity: 0.6 }} />
              )}

              {group.items.map((item) => {
                const isActive = currentPage === item.page;
                const isHovered = hoveredPage === item.page;
                const Icon = item.icon;
                const path = getCanonicalPath(item.page);
                return (
                  <a
                    key={item.page}
                    href={path}
                    title={effectiveCollapsed ? item.label : undefined}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                        e.preventDefault();
                        onNavigate(item.page);
                      }
                    }}
                    onMouseEnter={() => setHoveredPage(item.page)}
                    onMouseLeave={() => setHoveredPage(null)}
                    style={{
                      textDecoration: "none",
                      display: "flex", alignItems: "center", gap: 10,
                      padding: effectiveCollapsed ? "9px 0" : "9px 16px",
                      margin: "1px 8px", borderRadius: 8, cursor: "pointer",
                      justifyContent: effectiveCollapsed ? "center" : "flex-start",
                      backgroundColor: isActive ? "#720000" : isHovered ? "rgba(114,0,0,0.06)" : "transparent",
                      borderLeft: isActive && !effectiveCollapsed ? "3px solid #D9A900" : "3px solid transparent",
                      transition: "background-color 0.15s ease, border-color 0.15s ease",
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? "#FFFFFF" : isHovered ? "#720000" : "#6B5E52", flexShrink: 0, transition: "color 0.15s ease" }} />
                    {!effectiveCollapsed && (
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: isActive ? 600 : 500, fontSize: 13.5, color: isActive ? "#FFFFFF" : isHovered ? "#720000" : "#24201D", whiteSpace: "nowrap", overflow: "hidden", transition: "color 0.15s ease" }}>
                        {item.label}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer: Logout + Collapse toggle — single unified row */}
        <div style={{
          borderTop: "1px solid #E8E0D4",
          padding: effectiveCollapsed ? "10px 8px" : "8px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: effectiveCollapsed ? "center" : "space-between",
          gap: 6,
          flexDirection: effectiveCollapsed ? "column" : "row",
        }}>
          {/* Logout button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            onMouseEnter={() => setHoveredLogout(true)}
            onMouseLeave={() => setHoveredLogout(false)}
            title={effectiveCollapsed ? "Log Out" : undefined}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: effectiveCollapsed ? "center" : "flex-start",
              gap: 7,
              flex: effectiveCollapsed ? undefined : 1,
              padding: effectiveCollapsed ? "8px" : "8px 10px",
              borderRadius: 8, border: "none",
              backgroundColor: hoveredLogout ? "rgba(114,0,0,0.08)" : "transparent",
              cursor: "pointer", transition: "background-color 0.15s ease",
            }}
          >
            <LogOut
              size={16}
              style={{ color: hoveredLogout ? "#720000" : "#9B8B7E", flexShrink: 0, transition: "color 0.15s" }}
            />
            {!effectiveCollapsed && (
              <span style={{
                fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 13,
                color: hoveredLogout ? "#720000" : "#7A6B5D", transition: "color 0.15s",
              }}>
                Log Out
              </span>
            )}
          </button>

          {/* Collapse toggle — desktop only */}
          {!isMobile && (
            <button
              onClick={onToggle}
              onMouseEnter={() => setHoveredToggle(true)}
              onMouseLeave={() => setHoveredToggle(false)}
              title={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, flexShrink: 0,
                borderRadius: 8, border: "1px solid #E8E0D4",
                backgroundColor: hoveredToggle ? "rgba(114,0,0,0.06)" : "#FAFAFA",
                cursor: "pointer", transition: "background-color 0.15s ease", color: "#6B5E52",
              }}
            >
              <ChevronLeft
                size={15}
                style={{ transform: effectiveCollapsed ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}
              />
            </button>
          )}
        </div>

        <style>{`
          .sidebar-scroll::-webkit-scrollbar { width: 4px; }
          .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
          .sidebar-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
          .sidebar-scroll:hover::-webkit-scrollbar-thumb { background: #E8E0D4; }
          .sidebar-scroll { scrollbar-width: none; }
          .sidebar-scroll:hover { scrollbar-width: thin; scrollbar-color: #E8E0D4 transparent; }
        `}</style>
      </aside>
    </>
  );
}
