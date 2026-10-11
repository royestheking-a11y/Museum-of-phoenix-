import React, { useState } from 'react';
import {
  HelpCircle, X, BookOpen, Truck, Package, ShoppingBag,
  ShieldCheck, Calculator, Phone, Mail, ExternalLink,
  ChevronRight, Sparkles, CheckCircle2, AlertTriangle, Layers, Store
} from 'lucide-react';
import hennaLogo from '../../imports/Henna_Royalin.png';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export default function HelpModal({ isOpen, onClose, onNavigate }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'guides' | 'workflows' | 'support'>('guides');

  if (!isOpen) return null;

  const quickGuides = [
    {
      icon: ShoppingBag,
      title: "Orders & Invoice System",
      category: "Sales & Delivery",
      description: "Create customer orders manually or via AI paste. Click the invoice icon or view modal to generate official Henna Royalin invoices with instant Print & Download options.",
      page: "orders",
      tips: [
        "Use 'AI Smart Order' to paste WhatsApp/Facebook customer messages for instant autofill.",
        "Click the Invoice icon in the table to view, print, or download customer invoices.",
        "Dispatched orders automatically display Steadfast tracking barcodes and delivery status."
      ]
    },
    {
      icon: Truck,
      title: "Steadfast Courier & Fraud Shield",
      category: "Logistics",
      description: "Direct real-time integration with Steadfast API (portal.packzy.com) for 1-click dispatch, live tracking, and national courier fraud detection.",
      page: "steadfast",
      tips: [
        "Click 'Send to Steadfast' on any confirmed order to create a consignment instantly.",
        "The Fraud Shield checks Steadfast's national delivery history to catch fake buyers.",
        "Live COD wallet balance refreshes directly from Steadfast's production servers."
      ]
    },
    {
      icon: Package,
      title: "Stock & Inventory Management",
      category: "Inventory",
      description: "Track live finished cone inventory (Tab 1) and raw materials like henna powder & essential oils (Tab 2) with real-time low-stock alerts (≤ 20 cones).",
      page: "stock",
      tips: [
        "Cones with stock ≤ 20 automatically trigger Low Stock badges.",
        "Add cone varieties with exact sizes (e.g. 20g, 25g, 30g) and SKU identifiers.",
        "Raw materials deplete automatically when new production batches are confirmed."
      ]
    },
    {
      icon: Calculator,
      title: "Batch Production & Costing",
      category: "Production",
      description: "Plan and produce organic henna cone batches. Automatically calculates per-cone unit cost, gross margins, and transfers finished cones directly to Stock.",
      page: "production",
      tips: [
        "Input raw ingredient proportions (henna powder, eucalyptus oil, sugar, tea water).",
        "The system calculates exact cost per unit to recommend selling prices.",
        "Click 'Complete Batch' to store cones directly in inventory with a timestamp."
      ]
    },
    {
      icon: Store,
      title: "Studio POS Terminal",
      category: "Point of Sale",
      description: "Rapid counter checkout for walk-in studio clients with barcode/product catalog selection, automated stock deduction, and thermal invoice printing.",
      page: "pos",
      tips: [
        "Add products to cart with 1 click; stock availability is verified in real time.",
        "Supports Cash, bKash, Nagad, and Card split payments.",
        "Prints clean customer thermal receipts upon checkout completion."
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-[#E8E0D4] overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF8F3] border-b border-[#E8E0D4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#720000] text-[#D9A900] flex items-center justify-center shadow-xs">
              <HelpCircle size={20} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#24201D]">
                Henna Royalin Help & User Guide
              </h2>
              <p className="text-xs text-[#7A6B5D]">
                Comprehensive operations guide, workflows, and developer support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-xl hover:bg-[#E8E0D4]/50 text-[#7A6B5D] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 bg-[#FAF8F3] border-b border-[#E8E0D4] flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('guides')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'guides'
                ? 'border-[#720000] text-[#720000]'
                : 'border-transparent text-[#7A6B5D] hover:text-[#24201D]'
            }`}
          >
            Operational Modules
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workflows')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'workflows'
                ? 'border-[#720000] text-[#720000]'
                : 'border-transparent text-[#7A6B5D] hover:text-[#24201D]'
            }`}
          >
            Step-by-Step Workflows
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'support'
                ? 'border-[#720000] text-[#720000]'
                : 'border-transparent text-[#7A6B5D] hover:text-[#24201D]'
            }`}
          >
            Support & Contacts
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-4">
          {/* TAB 1: GUIDES */}
          {activeTab === 'guides' && (
            <div className="space-y-3.5">
              {quickGuides.map((guide, idx) => {
                const IconComponent = guide.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E8E0D4] bg-white hover:border-[#720000]/30 transition-all shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] border border-[#E8E0D4] flex items-center justify-center text-[#720000] shrink-0">
                          <IconComponent size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3907C] block">
                            {guide.category}
                          </span>
                          <h3 className="font-bold text-sm text-[#24201D]">
                            {guide.title}
                          </h3>
                        </div>
                      </div>

                      {onNavigate && guide.page && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigate(guide.page);
                          }}
                          className="text-xs font-bold text-[#720000] hover:underline flex items-center gap-0.5 shrink-0"
                        >
                          <span>Open</span>
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-[#5C4E42] leading-relaxed">
                      {guide.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-[#FAF8F3] border border-[#E8E0D4]/70 space-y-1">
                      {guide.tips.map((tip, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-1.5 text-[11px] text-[#7A6B5D]">
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: WORKFLOWS */}
          {activeTab === 'workflows' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-[#E8E0D4] bg-[#FAF8F3] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#720000] block">
                  Workflow 1: Order to Delivery Cycle
                </span>
                <h4 className="font-bold text-sm text-[#24201D]">How customer orders move from checkout to Steadfast delivery</h4>
                <ol className="space-y-2 text-[#5C4E42] list-decimal list-inside leading-relaxed pt-1">
                  <li><strong>Create Order</strong>: In Orders or POS, enter customer details or paste social message in AI Order modal.</li>
                  <li><strong>Confirm Order</strong>: Click Confirm to auto-deduct cone stock from live inventory.</li>
                  <li><strong>Send to Steadfast</strong>: Click "Send to Steadfast" to automatically register with Steadfast API and receive an instant tracking barcode.</li>
                  <li><strong>Print Invoice</strong>: Open the order invoice, click "Print Invoice" or "Download" for customer parcel insertion.</li>
                  <li><strong>Courier Settlement</strong>: Live status updates to "In Transit" → "Delivered" and COD is credited to your Steadfast ledger.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl border border-[#E8E0D4] bg-[#FAF8F3] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#720000] block">
                  Workflow 2: Production to Inventory Restocking
                </span>
                <h4 className="font-bold text-sm text-[#24201D]">Producing cones and auto-updating stock</h4>
                <ol className="space-y-2 text-[#5C4E42] list-decimal list-inside leading-relaxed pt-1">
                  <li><strong>Formulate Batch</strong>: In Production, select raw materials (Henna powder, essential oils, cellophane cones).</li>
                  <li><strong>Calculate Output</strong>: Enter expected output cones (e.g. 150 cones of 25g).</li>
                  <li><strong>Save & Produce</strong>: Confirming the batch deducts raw ingredients and adds the 150 finished cones directly to Stock with an exact timestamp.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: SUPPORT & CONTACTS */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-[#E8E0D4] bg-white space-y-3">
                <h4 className="font-bold text-sm text-[#24201D]">Studio & Operations Support</h4>
                <p className="text-xs text-[#7A6B5D]">
                  Need technical assistance or system customizations? Reach out through the official studio channels below:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#E8E0D4] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#720000]/10 flex items-center justify-center text-[#720000]">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#A3907C] uppercase font-bold">Studio Hotline</p>
                      <p className="text-xs font-bold text-[#24201D]">+880 1712-345678</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#E8E0D4] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#720000]/10 flex items-center justify-center text-[#720000]">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#A3907C] uppercase font-bold">Technical Email</p>
                      <p className="text-xs font-bold text-[#24201D]">support@hennaroyalin.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-blue-800">
                  <Truck size={14} /> Steadfast Courier Merchant Helpline
                </p>
                <p>Hotline: <strong>09678-045045</strong> (9 AM – 10 PM daily)</p>
                <p>Steadfast Portal: <a href="https://portal.steadfast.com.bd" target="_blank" rel="noreferrer" className="underline font-semibold">portal.steadfast.com.bd</a></p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF8F3] border-t border-[#E8E0D4] flex items-center justify-between shrink-0">
          <p className="text-[11px] text-[#7A6B5D]">
            Henna Royalin Business Suite · Version 2.0 (Active & Cloud Synced)
          </p>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#720000] hover:bg-[#580000] rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
