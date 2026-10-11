import { useState, useRef, useEffect } from "react";
import { Bell, HelpCircle, Search, ChevronRight, X, Menu, Sparkles, ShoppingBag, Store, Laptop, Cloud } from "lucide-react";
import { db } from "../../lib/db";
import HelpModal from "../ui/HelpModal";

interface TopBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onMobileMenuToggle?: () => void;
  onOpenPOS?: () => void;
  onLogout?: () => void;
}

interface SearchResult {
  type: "order" | "customer" | "product";
  id: string;
  label: string;
  sub: string;
  page: string;
}

const PAGE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  pos: "POS Terminal",
  order: "Order",
  orders: "Order",
  customers: "Customers",
  product: "Product",
  products: "Product",
  stock: "Stock",
  production: "Production",
  "production-capacity": "Production",
  inventory: "Inventory",
  payment: "Payment",
  payments: "Payment",
  employees: "Employee & Salary",
  payroll: "Employee & Salary",
  staff: "Staff & Access",
  roles: "Staff & Access",
  "users-roles": "Staff & Access",
  report: "Report",
  reports: "Report",
  analytics: "Analytics",
  steadfast: "Steadfast",
  settings: "Settings",
};

const SECTION_GROUPS: Record<string, string> = {
  dashboard: "Workflow",
  pos: "Workflow",
  order: "Workflow",
  orders: "Workflow",
  customers: "Workflow",
  product: "Workflow",
  products: "Workflow",
  stock: "Workflow",
  production: "Workflow",
  "production-capacity": "Workflow",
  inventory: "Workflow",
  payment: "Workflow",
  payments: "Workflow",
  employees: "Workflow",
  payroll: "Workflow",
  staff: "Workflow",
  roles: "Workflow",
  "users-roles": "Workflow",
  report: "Workflow",
  reports: "Workflow",
  analytics: "Workflow",
  steadfast: "Workflow",
  settings: "Workflow",
};

const TYPE_COLORS: Record<string, string> = {
  order: "#720000",
  booking: "#D9A900",
  customer: "#2563EB",
  product: "#16A34A",
};

const TYPE_LABELS: Record<string, string> = {
  order: "Order",
  booking: "Booking",
  customer: "Customer",
  product: "Product",
};

export default function TopBar({ currentPage, onNavigate, onMobileMenuToggle, onOpenPOS, onLogout }: TopBarProps) {
  const [cloudStatus, setCloudStatus] = useState(db.getCloudStatus());
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [hoveredResult, setHoveredResult] = useState<string | null>(null);
  const [hoveredUserItem, setHoveredUserItem] = useState<string | null>(null);

  useEffect(() => {
    const unsub = db.subscribeCloudStatus((status) => {
      setCloudStatus(status);
    });
    return unsub;
  }, []);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const pageLabel = PAGE_LABELS[currentPage] ?? currentPage;
  const groupLabel = SECTION_GROUPS[currentPage];

  // Dynamic live search across local database (Blueprint Sec 62)
  const filteredResults: SearchResult[] = searchValue.trim()
    ? (db.searchGlobal(searchValue) as SearchResult[])
    : [];

  const [notificationsList, setNotificationsList] = useState(db.getNotifications());
  const unreadNotificationsCount = notificationsList.filter((n: any) => !n.read).length;

  useEffect(() => {
    return db.subscribe(() => {
      setNotificationsList(db.getNotifications());
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = searchFocused && filteredResults.length > 0;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E8E0D4",
        height: 60,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 12,
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        className="md:hidden"
        onClick={onMobileMenuToggle}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, border: "1px solid #E8E0D4", background: "transparent", cursor: "pointer", color: "#720000", flexShrink: 0 }}
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb / Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        {groupLabel && groupLabel !== pageLabel && (
          <>
            <span
              className="hidden md:inline"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                color: "#9C8E84",
                fontWeight: 500,
              }}
            >
              {groupLabel}
            </span>
            <ChevronRight size={14} color="#C4B8B0" className="hidden md:inline" />
          </>
        )}
        <span
          className="truncate"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#720000",
            letterSpacing: "0.01em",
            maxWidth: 160,
          }}
        >
          {pageLabel}
        </span>
      </div>

      {/* Search — hidden on mobile */}
      <div
        ref={searchRef}
        className="hidden sm:block"
        style={{ flex: 1, maxWidth: 440, position: "relative" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: searchFocused ? "#FFFFFF" : "#FAF8F3",
            border: searchFocused ? "1.5px solid #720000" : "1.5px solid #E8E0D4",
            borderRadius: 10,
            padding: "0 12px",
            height: 38,
            gap: 8,
            transition: "border-color 0.15s ease, background-color 0.15s ease",
          }}
        >
          <Search
            size={15}
            style={{ color: searchFocused ? "#720000" : "#9C8E84", flexShrink: 0 }}
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search orders, customers, products..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "'Manrope', sans-serif",
              fontSize: 13,
              color: "#24201D",
              flex: 1,
              minWidth: 0,
            }}
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                color: "#9C8E84",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search dropdown */}
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              backgroundColor: "#FFFFFF",
              border: "1.5px solid #E8E0D4",
              borderRadius: 12,
              boxShadow:
                "0 8px 24px rgba(114,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "8px 14px 6px",
                fontFamily: "'Manrope', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#D9A900",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Quick Results
            </div>
            {filteredResults.map((result) => {
              const isHovered = hoveredResult === result.id;
              return (
                <div
                  key={result.id}
                  onClick={() => {
                    onNavigate(result.page);
                    setSearchFocused(false);
                    setSearchValue("");
                  }}
                  onMouseEnter={() => setHoveredResult(result.id)}
                  onMouseLeave={() => setHoveredResult(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 14px",
                    cursor: "pointer",
                    backgroundColor: isHovered ? "#FAF8F3" : "transparent",
                    transition: "background-color 0.1s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      color: TYPE_COLORS[result.type] ?? "#720000",
                      backgroundColor:
                        `${TYPE_COLORS[result.type] ?? "#720000"}14`,
                      borderRadius: 4,
                      padding: "2px 6px",
                      flexShrink: 0,
                    }}
                  >
                    {TYPE_LABELS[result.type]}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#24201D",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {result.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: 11,
                        color: "#9C8E84",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {result.sub}
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              style={{
                borderTop: "1px solid #E8E0D4",
                padding: "8px 14px",
                fontFamily: "'Manrope', sans-serif",
                fontSize: 12,
                color: "#720000",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                  "#FAF8F3")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                  "transparent")
              }
            >
              View all results &rarr;
            </div>
          </div>
        )}
      </div>

      {/* Right actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginLeft: "auto",
          flexShrink: 0,
        }}
      >
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen(true)}
          className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-[#E8E0D4] text-[#720000] bg-[#FAF8F3] active:scale-95"
          title="Search"
        >
          <Search size={15} />
        </button>

        {/* Studio Walk-in POS Button (Hybrid System) */}
        {onOpenPOS && (
          <button
            onClick={onOpenPOS}
            title="Open Studio Walk-in POS"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #720000 0%, #8B1A1A 100%)",
              color: "#FFFFFF",
              border: "1px solid #D9A900",
              boxShadow: "0 2px 6px rgba(114,0,0,0.15)",
            }}
          >
            <Store size={14} style={{ color: "#D9A900" }} />
            <span className="hidden xs:inline">Studio POS</span>
            <span className="xs:hidden">POS</span>
          </button>
        )}

        {/* Cloud Storage Status */}
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          style={{
            background: cloudStatus.status === 'error' ? '#FEE2E2' : cloudStatus.status === 'syncing' ? '#FEF3C7' : '#DCFCE7',
            color: cloudStatus.status === 'error' ? '#991B1B' : cloudStatus.status === 'syncing' ? '#92400E' : '#166534',
            border: `1px solid ${cloudStatus.status === 'error' ? '#FCA5A5' : cloudStatus.status === 'syncing' ? '#FDE68A' : '#BBF7D0'}`
          }}
          title={cloudStatus.status === 'connected' ? 'Cloud Storage: Connected' : cloudStatus.status === 'syncing' ? 'Cloud Storage: Syncing' : 'Cloud Storage: Offline'}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              cloudStatus.status === 'error'
                ? 'bg-red-500'
                : cloudStatus.status === 'syncing'
                ? 'bg-amber-500 animate-spin'
                : 'bg-green-500 animate-pulse'
            }`}
          />
          <Cloud size={12} className="opacity-80" />
          <span className="font-semibold">
            {cloudStatus.status === 'syncing'
              ? 'Syncing...'
              : cloudStatus.status === 'error'
              ? 'Offline'
              : 'Cloud Storage'}
          </span>
        </button>

        {/* Notification bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowNotifications((v) => !v);
              setShowUserMenu(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: 10,
              border: "none",
              backgroundColor: showNotifications ? "#FAF8F3" : "transparent",
              cursor: "pointer",
              position: "relative",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!showNotifications)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#FAF8F3";
            }}
            onMouseLeave={(e) => {
              if (!showNotifications)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
            }}
          >
            <Bell size={18} color="#6B5E52" />
            {unreadNotificationsCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#DC2626",
                  color: "#FFFFFF",
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: "'Manrope', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #FFFFFF",
                }}
              >
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 300,
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #E8E0D4",
                borderRadius: 12,
                boxShadow:
                  "0 8px 24px rgba(114,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
                zIndex: 50,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #E8E0D4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#24201D",
                  }}
                >
                  Notifications
                </span>
                {notificationsList.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      onClick={() => {
                        db.markAllNotificationsRead();
                      }}
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: 11,
                        color: "#720000",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Mark all read
                    </span>
                    <span style={{ color: "#E8E0D4" }}>·</span>
                    <span
                      onClick={() => {
                        db.clearAllNotifications();
                      }}
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: 11,
                        color: "#DC2626",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Clear all
                    </span>
                  </div>
                )}
              </div>
              {notificationsList.length === 0 ? (
                <div
                  style={{
                    padding: "32px 16px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#FAF8F3",
                      border: "1px solid #E8E0D4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 8px auto",
                      color: "#A3907C",
                    }}
                  >
                    <Bell size={18} />
                  </div>
                  <p
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#24201D",
                    }}
                  >
                    No notifications
                  </p>
                  <p
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 11,
                      color: "#7A6B5D",
                      marginTop: 2,
                    }}
                  >
                    All caught up! Real alerts will show when orders or stock change.
                  </p>
                </div>
              ) : (
                notificationsList.map((n: any, i: number) => (
                  <div
                    key={n.id || i}
                    style={{
                      padding: "10px 16px",
                      borderBottom:
                        i < notificationsList.length - 1
                          ? "1px solid #F0EBE4"
                          : "none",
                      backgroundColor: !n.read ? "#FFF9F0" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                        "#FAF8F3")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                        !n.read ? "#FFF9F0" : "transparent")
                    }
                  >
                    <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 0 }}>
                      {!n.read && (
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            backgroundColor: "#720000",
                            marginTop: 5,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "'Manrope', sans-serif",
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: "#24201D",
                          }}
                        >
                          {n.title}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Manrope', sans-serif",
                            fontSize: 11.5,
                            color: "#6B5E52",
                            marginTop: 2,
                          }}
                        >
                          {n.description || n.sub}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Manrope', sans-serif",
                            fontSize: 10.5,
                            color: "#9C8E84",
                            marginTop: 2,
                          }}
                        >
                          {n.time || "Recently"}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        db.deleteNotification(n.id);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 3,
                        cursor: "pointer",
                        color: "#A3907C",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                      title="Dismiss notification"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))
              )}
              <div
                onClick={() => setShowNotifications(false)}
                style={{
                  padding: "10px 16px",
                  textAlign: "center",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 12,
                  color: "#720000",
                  fontWeight: 600,
                  cursor: "pointer",
                  borderTop: "1px solid #E8E0D4",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                    "#FAF8F3")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                    "transparent")
                }
              >
                Close
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button
          type="button"
          onClick={() => {
            setShowHelpModal(true);
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "none",
            backgroundColor: showHelpModal ? "#FAF8F3" : "transparent",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#FAF8F3")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              showHelpModal ? "#FAF8F3" : "transparent")
          }
          title="Help & Operations Guide"
          aria-label="Help & Operations Guide"
        >
          <HelpCircle size={18} color="#6B5E52" />
        </button>

        {/* User avatar + menu */}
        <div ref={userMenuRef} style={{ position: "relative", marginLeft: 4 }}>
          <button
            onClick={() => {
              setShowUserMenu((v) => !v);
              setShowNotifications(false);
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#720000",
              color: "#FFFFFF",
              border: "2px solid #E8E0D4",
              cursor: "pointer",
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              boxShadow: showUserMenu ? "0 0 0 3px rgba(114,0,0,0.15)" : "none",
            }}
            title="Account"
          >
            SJ
          </button>

          {/* User dropdown */}
          {showUserMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 200,
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #E8E0D4",
                borderRadius: 12,
                boxShadow:
                  "0 8px 24px rgba(114,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
                zIndex: 50,
                overflow: "hidden",
              }}
            >
              {/* User info */}
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #E8E0D4",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "#720000",
                    color: "#FFFFFF",
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  SJ
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#24201D",
                    }}
                  >
                    Sumaiya Jabin
                  </div>
                  <div
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 11,
                      color: "#D9A900",
                      fontWeight: 600,
                    }}
                  >
                    Owner
                  </div>
                </div>
              </div>

              {/* Menu items */}
              {[
                { label: "Settings", page: "settings" },
              ].map((item) => {
                const isHov = hoveredUserItem === item.label;
                return (
                  <div
                    key={item.label}
                    onClick={() => {
                      onNavigate(item.page);
                      setShowUserMenu(false);
                    }}
                    onMouseEnter={() => setHoveredUserItem(item.label)}
                    onMouseLeave={() => setHoveredUserItem(null)}
                    style={{
                      padding: "10px 16px",
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      color: isHov ? "#720000" : "#24201D",
                      backgroundColor: isHov ? "#FAF8F3" : "transparent",
                      cursor: "pointer",
                      transition:
                        "color 0.1s ease, background-color 0.1s ease",
                    }}
                  >
                    {item.label}
                  </div>
                );
              })}

              <div style={{ borderTop: "1px solid #E8E0D4" }}>
                <div
                  onMouseEnter={() => setHoveredUserItem("signout")}
                  onMouseLeave={() => setHoveredUserItem(null)}
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout?.();
                  }}
                  style={{
                    padding: "10px 16px",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color:
                      hoveredUserItem === "signout" ? "#991B1B" : "#DC2626",
                    backgroundColor:
                      hoveredUserItem === "signout" ? "#FEF2F2" : "transparent",
                    cursor: "pointer",
                    transition:
                      "color 0.1s ease, background-color 0.1s ease",
                  }}
                >
                  Sign Out
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Modal Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 sm:hidden flex flex-col bg-[#FAF8F3]/95 backdrop-blur-md animate-in fade-in duration-200">
          <div className="p-4 bg-white border-b border-[#E8E0D4] flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C8E84] pointer-events-none" />
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search orders, customers, bookings..."
                style={{ paddingLeft: '2.5rem' }}
                className="w-full pl-10! pr-8 py-2 text-sm rounded-xl bg-[#FAF8F3] border border-[#720000] focus:outline-none text-[#24201D] font-sans"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9C8E84]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="px-3 py-2 text-xs font-bold text-[#720000] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-[11px] font-bold text-[#D9A900] uppercase tracking-wider px-1 mb-2">
              Search Results
            </div>
            {filteredResults.map((result) => (
              <div
                key={result.id}
                onClick={() => {
                  onNavigate(result.page);
                  setMobileSearchOpen(false);
                  setSearchValue("");
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E8E0D4] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: TYPE_COLORS[result.type] ?? "#720000",
                    backgroundColor: `${TYPE_COLORS[result.type] ?? "#720000"}14`,
                    borderRadius: 6,
                    padding: "3px 8px",
                  }}
                >
                  {TYPE_LABELS[result.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#24201D] truncate">
                    {result.label}
                  </p>
                  <p className="text-xs text-[#7A6B5D] truncate">
                    {result.sub}
                  </p>
                </div>
                <ChevronRight size={15} className="text-[#C4B8B0] shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Help & Operations Guide Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        onNavigate={onNavigate}
      />
    </header>
  );
}
