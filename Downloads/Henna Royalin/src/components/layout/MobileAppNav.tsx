import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Factory,
  ShoppingBag,
  Store,
  LayoutGrid,
  Search,
  X,
  Sparkles,
  Laptop,
  LogOut,
  ChevronRight,
  Check,
  ShieldCheck,
} from "lucide-react";
import { navGroups } from "./Sidebar";
import logo from "../../imports/Henna_Royalin.png";
import { getCanonicalPath } from "../../lib/routes";

interface MobileAppNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onOpenPOS?: () => void;
  onLogout?: () => void;
}

export default function MobileAppNav({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  onOpen,
  onOpenPOS,
  onLogout,
}: MobileAppNavProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");

  // Filter items based on search query and category chip
  const filteredGroups = useMemo(() => {
    return navGroups
      .map((group) => {
        if (selectedGroup !== "All" && group.group !== selectedGroup) {
          return null;
        }

        const filteredItems = group.items.filter((item) => {
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (
            item.label.toLowerCase().includes(q) ||
            item.page.toLowerCase().includes(q) ||
            (item.description && item.description.toLowerCase().includes(q)) ||
            group.group.toLowerCase().includes(q)
          );
        });

        if (filteredItems.length === 0) return null;

        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter(Boolean) as typeof navGroups;
  }, [searchQuery, selectedGroup]);

  // Total pages count
  const totalPages = useMemo(() => {
    return navGroups.reduce((acc, g) => acc + g.items.length, 0);
  }, []);

  const handleSelectPage = (page: string) => {
    onNavigate(page);
    onClose();
  };

  // Group colors for category badges
  const groupColors: Record<string, { bg: string; text: string; border: string }> = {
    Workflow: { bg: "#FAF3E6", text: "#720000", border: "#D9A900" },
    Overview: { bg: "#FAF3E6", text: "#720000", border: "#D9A900" },
    "Orders & Sales": { bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5" },
    "Manufacturing & Stock": { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
    Fulfillment: { bg: "#FAF5FF", text: "#6B21A8", border: "#E9D5FF" },
    Finance: { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
    Intelligence: { bg: "#F8FAFC", text: "#334155", border: "#CBD5E1" },
    Administration: { bg: "#F5F3FF", text: "#5B21B6", border: "#DDD6FE" },
  };

  return (
    <>
      {/* ── 1. BOTTOM NAVIGATION DOCK (Native Mobile App Bar) ────────────────────────── */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E8E0D4] shadow-[0_-4px_25px_rgba(36,32,29,0.08)]"
        style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-1 relative">
          {/* 1. Dashboard */}
          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                e.preventDefault();
                handleSelectPage("dashboard");
              }
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all active:scale-95 cursor-pointer no-underline"
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                currentPage === "dashboard"
                  ? "bg-[#720000]/10 text-[#720000]"
                  : "text-[#7A6B5D] hover:text-[#24201D]"
              }`}
            >
              <LayoutDashboard size={20} />
            </div>
            <span
              className={`text-[11px] font-sans mt-0.5 tracking-tight transition-colors ${
                currentPage === "dashboard"
                  ? "font-bold text-[#720000]"
                  : "font-medium text-[#7A6B5D]"
              }`}
            >
              Home
            </span>
            {currentPage === "dashboard" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A900] mt-0.5" />
            )}
          </a>

          {/* 2. Orders */}
          <a
            href={getCanonicalPath("orders")}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                e.preventDefault();
                handleSelectPage("orders");
              }
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all active:scale-95 cursor-pointer no-underline"
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                currentPage === "orders"
                  ? "bg-[#720000]/10 text-[#720000]"
                  : "text-[#7A6B5D] hover:text-[#24201D]"
              }`}
            >
              <ShoppingBag size={20} />
            </div>
            <span
              className={`text-[11px] font-sans mt-0.5 tracking-tight transition-colors ${
                currentPage === "orders"
                  ? "font-bold text-[#720000]"
                  : "font-medium text-[#7A6B5D]"
              }`}
            >
              Orders
            </span>
            {currentPage === "orders" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A900] mt-0.5" />
            )}
          </a>

          {/* 3. Studio POS Floating Center Action */}
          {onOpenPOS && (
            <div className="flex flex-col items-center justify-center flex-1 -mt-4">
              <button
                type="button"
                onClick={onOpenPOS}
                title="Studio POS (Point of Sale)"
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform cursor-pointer border-2 border-[#D9A900]"
                style={{
                  background: "linear-gradient(135deg, #720000 0%, #8B0000 100%)",
                  boxShadow: "0 4px 14px rgba(114,0,0,0.35)",
                }}
              >
                <Store size={20} className="text-[#F8E29B]" />
              </button>
              <span className="text-[10px] font-bold text-[#720000] font-sans mt-1 tracking-wider uppercase">
                POS
              </span>
            </div>
          )}

          {/* 4. Production Suite */}
          <a
            href={getCanonicalPath("production")}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                e.preventDefault();
                handleSelectPage("production");
              }
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all active:scale-95 cursor-pointer no-underline"
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                currentPage === "production" || currentPage === "inventory"
                  ? "bg-[#720000]/10 text-[#720000]"
                  : "text-[#7A6B5D] hover:text-[#24201D]"
              }`}
            >
              <Factory size={20} />
            </div>
            <span
              className={`text-[11px] font-sans mt-0.5 tracking-tight transition-colors ${
                currentPage === "production" || currentPage === "inventory"
                  ? "font-bold text-[#720000]"
                  : "font-medium text-[#7A6B5D]"
              }`}
            >
              Costing
            </span>
            {(currentPage === "production" || currentPage === "inventory") && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A900] mt-0.5" />
            )}
          </a>

          {/* 5. All Pages / App Launcher */}
          <button
            type="button"
            onClick={isOpen ? onClose : onOpen}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all active:scale-95 cursor-pointer"
          >
            <div
              className={`p-1.5 rounded-xl transition-all relative ${
                isOpen
                  ? "bg-[#720000] text-white"
                  : "text-[#7A6B5D] hover:text-[#24201D]"
              }`}
            >
              <LayoutGrid size={20} />
              <span className="absolute -top-1 -right-1 bg-[#D9A900] text-[#24201D] text-[9px] font-bold px-1 rounded-full leading-tight">
                {totalPages}
              </span>
            </div>
            <span
              className={`text-[11px] font-sans mt-0.5 tracking-tight transition-colors ${
                isOpen
                  ? "font-bold text-[#720000]"
                  : "font-medium text-[#7A6B5D]"
              }`}
            >
              Menu
            </span>
            {isOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A900] mt-0.5" />
            )}
          </button>
        </div>
      </nav>

      {/* ── 2. ALL PAGES MOBILE APP LAUNCHER & DRAWER ──────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-[#24201D]/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
          />

          {/* Full-Height / Bottom-Sheet Modal */}
          <div
            className="relative z-10 flex flex-col w-full h-full max-h-[92vh] mt-auto bg-[#FAF8F3] rounded-t-3xl shadow-2xl border-t border-[#E8E0D4] overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
          >
            {/* Sheet Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-[#C4B8B0]/60" />
            </div>

            {/* Header: Brand & Profile */}
            <div className="px-5 pt-2 pb-4 bg-white border-b border-[#E8E0D4]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={logo}
                    alt="Henna Royalin"
                    loading="eager"
                    decoding="async"
                    className="w-9 h-9 rounded-lg object-cover border border-[#E8E0D4] shadow-xs"
                  />
                  <div>
                    <h2 className="font-serif font-bold text-base text-[#720000] leading-none">
                      Henna Royalin
                    </h2>
                    <p className="text-[10px] font-sans font-bold text-[#D9A900] uppercase tracking-wider mt-0.5">
                      Business Suite · Mobile
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A6B5D] hover:text-[#24201D] bg-[#FAF8F3] border border-[#E8E0D4] cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Identity Banner */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F3] border border-[#E8E0D4]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#720000] text-white font-bold text-xs flex items-center justify-center border-2 border-[#D9A900]">
                    SJ
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#24201D] font-sans flex items-center gap-1.5">
                      <span>Sumaiya Jabin</span>
                      <span className="text-[10px] font-semibold text-[#D9A900] bg-[#FFFDF0] px-1.5 py-0.5 rounded-md border border-[#D9A900]/30">
                        Owner
                      </span>
                    </div>
                    <div className="text-[10px] text-[#7A6B5D] flex items-center gap-1 mt-0.5 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Local-First Hybrid Storage</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Filter & Search Bar */}
            <div className="p-4 bg-white/80 border-b border-[#E8E0D4] space-y-2.5">
              {/* Search input */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C8E84]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search all ${totalPages} pages (Orders, Inventory, Delivery...)`}
                  className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] focus:outline-none focus:border-[#720000] focus:bg-white text-[#24201D] placeholder-[#9C8E84] font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9C8E84] hover:text-[#24201D] p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Pills (Horizontal Scroll) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedGroup("All")}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                    selectedGroup === "All"
                      ? "bg-[#720000] text-white shadow-xs"
                      : "bg-[#FAF8F3] text-[#7A6B5D] border border-[#E8E0D4] hover:text-[#24201D]"
                  }`}
                >
                  All ({totalPages})
                </button>
                {navGroups.map((g) => (
                  <button
                    key={g.group}
                    type="button"
                    onClick={() => setSelectedGroup(g.group)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                      selectedGroup === g.group
                        ? "bg-[#720000] text-white shadow-xs"
                        : "bg-[#FAF8F3] text-[#7A6B5D] border border-[#E8E0D4] hover:text-[#24201D]"
                    }`}
                  >
                    {g.group} ({g.items.length})
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Pages Catalog */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-12 text-[#7A6B5D]">
                  <p className="font-serif text-lg font-bold text-[#24201D]">No pages found</p>
                  <p className="text-xs mt-1">Try a different keyword or select "All".</p>
                </div>
              ) : (
                filteredGroups.map((group) => {
                  const colors = groupColors[group.group] || {
                    bg: "#FAF8F3",
                    text: "#720000",
                    border: "#E8E0D4",
                  };

                  return (
                    <div key={group.group} className="space-y-2">
                      {/* Section Title */}
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                              borderColor: colors.border,
                            }}
                          >
                            {group.group}
                          </span>
                          <span className="text-[11px] font-medium text-[#7A6B5D]">
                            {group.items.length} {group.items.length === 1 ? "page" : "pages"}
                          </span>
                        </div>
                      </div>

                      {/* Pages List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.items.map((item) => {
                          const isActive = currentPage === item.page;
                          const Icon = item.icon;
                          const path = getCanonicalPath(item.page);

                          return (
                            <a
                              key={item.page}
                              href={path}
                              onClick={(e) => {
                                if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                                  e.preventDefault();
                                  handleSelectPage(item.page);
                                }
                              }}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.98] no-underline ${
                                isActive
                                  ? "bg-white border-[#D9A900] shadow-sm ring-1 ring-[#D9A900]/40"
                                  : "bg-white border-[#E8E0D4] hover:border-[#D9A900]/50 hover:bg-[#FFFDF8]"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    isActive
                                      ? "bg-[#720000] text-white"
                                      : "bg-[#FAF8F3] text-[#720000] border border-[#E8E0D4]"
                                  }`}
                                >
                                  <Icon size={18} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-sm font-sans tracking-tight truncate ${
                                        isActive
                                          ? "font-bold text-[#720000]"
                                          : "font-semibold text-[#24201D]"
                                      }`}
                                    >
                                      {item.label}
                                    </span>
                                    {isActive && (
                                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#D9A900] bg-[#FFFDF0] px-1.5 py-0.2 rounded-full border border-[#D9A900]/30 shrink-0">
                                        <Check size={9} />
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-[11px] text-[#7A6B5D] truncate font-sans mt-0.5">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <ChevronRight
                                size={16}
                                className={`shrink-0 ml-2 ${
                                  isActive ? "text-[#720000]" : "text-[#C4B8B0]"
                                }`}
                              />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions: POS & Sign Out */}
            <div className="p-4 bg-white border-t border-[#E8E0D4] space-y-2.5">
              {onOpenPOS && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPOS();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer active:scale-[0.98] transition-all"
                  style={{
                    background: "linear-gradient(135deg, #720000 0%, #8B0000 100%)",
                    border: "1px solid #D9A900",
                  }}
                >
                  <Store size={15} className="text-[#F8E29B]" />
                  <span>Studio POS</span>
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50/50 hover:bg-rose-50 border border-rose-200/80 cursor-pointer active:scale-[0.98] transition-colors"
                >
                  <LogOut size={14} />
                  <span>Sign Out of Business Suite</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
