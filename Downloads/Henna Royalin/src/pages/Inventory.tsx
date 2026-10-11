import { useState, useEffect } from 'react';
import {
  Boxes, Plus, X, AlertTriangle, TrendingUp, Factory, Clock,
  Package, CheckCircle, ArrowRight, ShieldAlert
} from 'lucide-react';
import { db, Product, InventoryItem, ProductionBatch, formatDateTime } from '../lib/db';
import { useModal } from '../context/ModalContext';
import RawMaterialsInventorySection from '../components/inventory/RawMaterialsInventorySection';

function StockBar({ current, low }: { current: number; low: number }) {
  const pct = Math.min((current / Math.max(low * 2.5, 40)) * 100, 100);
  const isCritical = current <= 20;
  const isLow = current <= low;
  return (
    <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: '#E8E0D4' }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${pct}%`,
          background: isCritical ? '#EF4444' : isLow ? '#F59E0B' : '#166534',
        }}
      />
    </div>
  );
}

interface NewProductFormProps {
  onClose: () => void;
  onSave: () => void;
}

function NewProductForm({ onClose, onSave }: NewProductFormProps) {
  const { showAlert } = useModal();
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Organic Henna Cone',
    size: '20gm',
    sellingPrice: 100,
    costPrice: 6.5,
    stock: 50,
    lowStockLevel: 20,
    supplier: 'Henna Royalin In-house',
    status: 'active' as const,
  });

  const categories = [
    'Organic Henna Cone',
    'Bridal Cone',
    'Fast Stain Cone',
    'Nail Henna Cone',
    'Special Dark Cone',
    'Hair Mehendi',
    'Packaging & Raw Material',
  ];

  const handleSave = () => {
    if (!form.name.trim()) { showAlert({ type: 'warning', title: 'Name Required', message: 'Please provide a product/cone name.' }); return; }
    const now = new Date();
    db.addProduct({
      name: form.name.trim(),
      sku: form.sku.trim() || `MC-${Date.now().toString().slice(-4)}`,
      category: form.category,
      size: form.size,
      sellingPrice: Number(form.sellingPrice) || 0,
      costPrice: Number(form.costPrice) || 0,
      stock: Number(form.stock) || 0,
      lowStockLevel: Number(form.lowStockLevel) || 20,
      supplier: form.supplier,
      status: 'active',
      addedAt: now.toISOString(),
      addedTimeFormatted: formatDateTime(now),
    });
    onSave();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Cone / Product Name *</label>
        <input
          className="form-input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Organic Herbal Mehendi Cone"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Category *</label>
          <select
            className="form-input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Size / Weight</label>
          <select
            className="form-input"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
          >
            {['15gm', '20gm', '25gm', '30gm', '35gm', '50gm', '100gm'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Cost Price (৳) per Cone</label>
          <input
            type="number"
            className="form-input"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="form-label">Selling Price (৳) per Cone</label>
          <input
            type="number"
            className="form-input"
            value={form.sellingPrice}
            onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Initial Stock</label>
          <input
            type="number"
            className="form-input"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="form-label">Low Stock Alert Level</label>
          <input
            type="number"
            className="form-input"
            value={form.lowStockLevel}
            onChange={(e) => setForm({ ...form, lowStockLevel: Number(e.target.value) })}
          />
          <span className="text-[11px] text-[#7A6B5D]">Alert triggers when stock reaches ≤ 20</span>
        </div>
      </div>
      <div>
        <label className="form-label">Supplier / Brand Source</label>
        <input
          className="form-input"
          value={form.supplier}
          onChange={(e) => setForm({ ...form, supplier: e.target.value })}
        />
      </div>
      <div className="flex gap-3 justify-end pt-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl"
          style={{ border: '1.5px solid #E8E0D4', color: '#7A6B5D' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white shadow-md hover:opacity-95"
          style={{ background: '#720000' }}
        >
          Add to Inventory
        </button>
      </div>
    </div>
  );
}

interface InventoryProps {
  onNavigate?: (page: string) => void;
  defaultTab?: 'cones' | 'materials' | 'batches';
}

export default function Inventory({ onNavigate, defaultTab = 'cones' }: InventoryProps) {
  const [products, setProducts] = useState<Product[]>(db.getProducts());
  const [rawMaterials, setRawMaterials] = useState<InventoryItem[]>(db.getInventory());
  const [batches, setBatches] = useState<ProductionBatch[]>(db.getProductionBatches());
  const [tab, setTab] = useState<'cones' | 'materials' | 'batches'>(defaultTab);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const refreshData = () => {
    setProducts(db.getProducts());
    setRawMaterials(db.getInventory());
    setBatches(db.getProductionBatches());
  };

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    refreshData();
    const unsubscribe = db.subscribe(refreshData);
    return () => unsubscribe();
  }, []);

  // Filter low stock cones (threshold <= 20)
  const lowStockCones = products.filter((p) => p.stock <= (p.lowStockLevel || 20));
  const totalStockCount = products.reduce((s, p) => s + p.stock, 0);
  const totalStockValue = products.reduce((s, p) => s + p.stock * p.sellingPrice, 0);
  const totalProductionCostValue = products.reduce((s, p) => s + p.stock * p.costPrice, 0);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category === categoryFilter;
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: '#24201D' }}>
              Stock & Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Connected
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: '#7A6B5D' }}>
            Real-time cone inventory, production batch storage timestamps, and automated ≤ 20 stock alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate('production-capacity')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-red-50"
              style={{ border: '1.5px solid #720000', color: '#720000' }}
            >
              <Factory size={16} />
              Calculate & Produce
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-95"
            style={{ background: '#720000' }}
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* PROMINENT LOW STOCK ALERT BANNER (CRITICAL REQUIREMENT: ALERT AT <= 20) */}
      {lowStockCones.length > 0 && (
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border shadow-sm"
          style={{ background: '#FEF2F2', borderColor: '#FCA5A5' }}
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-700 shrink-0 mt-0.5">
              <ShieldAlert size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-900 text-base font-serif">
                  Low Stock Warning (≤ 20 Cones Remaining)
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                  {lowStockCones.length} {lowStockCones.length === 1 ? 'Product' : 'Products'} Critical
                </span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                The following cone types are running below the 20-unit safety threshold:{' '}
                <span className="font-semibold">
                  {lowStockCones.map((c) => `${c.name} (${c.stock} left)`).join(' • ')}
                </span>
              </p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('production-capacity')}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-red-700 hover:bg-red-800 transition-colors flex items-center gap-1.5 shrink-0"
            >
              Start Production Batch <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Cones in Stock',
            value: `${totalStockCount.toLocaleString()} pcs`,
            sub: `${products.length} cone varieties`,
            icon: Boxes,
            color: '#720000',
            bg: '#FDF2F2',
          },
          {
            label: 'Low Stock Alert (≤ 20)',
            value: lowStockCones.length,
            sub: lowStockCones.length > 0 ? 'Requires restocking!' : 'All stock healthy',
            icon: AlertTriangle,
            color: lowStockCones.length > 0 ? '#DC2626' : '#166534',
            bg: lowStockCones.length > 0 ? '#FEF2F2' : '#F0FDF4',
          },
          {
            label: 'Total Retail Value',
            value: `৳${totalStockValue.toLocaleString()}`,
            sub: `Production Cost: ৳${totalProductionCostValue.toLocaleString()}`,
            icon: TrendingUp,
            color: '#166534',
            bg: '#F0FDF4',
          },
          {
            label: 'Total Batches Produced',
            value: batches.length,
            sub: 'Finished & added to stock',
            icon: Factory,
            color: '#4338CA',
            bg: '#EEF2FF',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 sm:p-5 bg-white border border-[#E8E0D4] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: s.bg, color: s.color }}
              >
                <s.icon size={20} />
              </div>
              <span className="text-[11px] font-semibold text-[#7A6B5D] px-2 py-0.5 rounded-full bg-[#FAF8F3]">
                Live
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums" style={{ color: '#24201D' }}>
              {s.value}
            </p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#7A6B5D' }}>
              {s.label}
            </p>
            <p className="text-[11px] text-[#A3907C] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E8E0D4] pb-4">
        <div className="flex gap-1.5 p-1 rounded-xl bg-[#F5F0E8] border border-[#E8E0D4]">
          {[
            { key: 'cones', label: `Finished Cones (${products.length})` },
            { key: 'materials', label: `Raw Materials (${rawMaterials.length})` },
            { key: 'batches', label: `Batches History (${batches.length})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize"
              style={{
                background: tab === t.key ? '#720000' : 'transparent',
                color: tab === t.key ? '#FFFFFF' : '#7A6B5D',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'cones' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#7A6B5D]">Category:</span>
            <select
              className="form-input text-xs py-1.5 px-3 rounded-lg border-[#E8E0D4]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: FINISHED CONES & PRODUCTS IN STOCK */}
      {tab === 'cones' && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E0D4] shadow-sm">
            <div className="overflow-x-auto">
              <table className="data-table w-full min-w-265">
                <thead>
                  <tr>
                    <th className="min-w-55">Cone / Variety</th>
                    <th className="min-w-35">Category</th>
                    <th className="min-w-32.5">Live Stock</th>
                    <th className="min-w-42.5">Added Date & Time</th>
                    <th className="min-w-25">Cost Price</th>
                    <th className="min-w-27.5">Selling Price</th>
                    <th className="min-w-27.5">Stock Value</th>
                    <th className="min-w-32.5">Status Alert</th>
                    <th className="min-w-25 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-[#7A6B5D] text-sm">
                        No finished cones or products in inventory. Click <strong>"Add Cone Variety"</strong> above or produce batches in Production.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((cone) => {
                    const isLow = cone.stock <= (cone.lowStockLevel || 20);
                    const formattedAddedTime =
                      cone.addedTimeFormatted || formatDateTime(cone.addedAt || cone.createdAt);

                    return (
                      <tr
                        key={cone.id}
                        className={isLow ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-[#FAF8F3]'}
                      >
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                background: isLow ? '#FEE2E2' : '#F5F0E8',
                                color: isLow ? '#DC2626' : '#720000',
                              }}
                            >
                              <Package size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-[#24201D] whitespace-nowrap">
                                {cone.name}
                              </p>
                              <p className="text-[11px] text-[#A3907C] whitespace-nowrap">
                                SKU: <span className="font-medium text-[#5C4E42]">{cone.sku}</span> • Weight: <span className="font-semibold text-[#720000]">{cone.size || '20gm'}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-semibold border whitespace-nowrap inline-flex items-center"
                            style={{
                              background: '#FAF8F3',
                              color: '#720000',
                              borderColor: '#E8E0D4',
                            }}
                          >
                            {cone.category}
                          </span>
                        </td>
                        <td>
                          <div className="space-y-1">
                            <span
                              className={`text-base font-extrabold tabular-nums ${
                                isLow ? 'text-red-700' : 'text-[#24201D]'
                              }`}
                            >
                              {cone.stock} pcs
                            </span>
                            <StockBar current={cone.stock} low={cone.lowStockLevel || 20} />
                          </div>
                        </td>
                        <td>
                          {/* CRITICAL REQUIREMENT: Exact Date & Time Added */}
                          <div className="flex items-center gap-1.5 text-xs text-[#524B45]">
                            <Clock size={13} className="text-[#A3907C] shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                              {formattedAddedTime}
                            </span>
                          </div>
                        </td>
                        <td className="tabular-nums text-sm text-[#7A6B5D]">
                          ৳{Math.round(cone.costPrice ?? 0).toLocaleString()}
                        </td>
                        <td className="tabular-nums font-bold text-sm text-[#24201D]">
                          ৳{(cone.sellingPrice ?? 0).toLocaleString()}
                        </td>
                        <td className="tabular-nums font-bold text-sm text-emerald-800">
                          ৳{((cone.stock ?? 0) * (cone.sellingPrice ?? 0)).toLocaleString()}
                        </td>
                        <td>
                          {/* Low Stock Alert <= 20 Badge */}
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                              <AlertTriangle size={12} /> Low Stock (≤ 20)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle size={12} /> In Stock
                            </span>
                          )}
                        </td>
                        <td className="text-right">
                          {onNavigate && (
                            <button
                              onClick={() => onNavigate('production-capacity')}
                              className="text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors hover:bg-white"
                              style={{
                                borderColor: isLow ? '#DC2626' : '#E8E0D4',
                                color: isLow ? '#DC2626' : '#720000',
                              }}
                            >
                              {isLow ? '+ Restock' : 'Produce'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RAW MATERIALS & PACKAGING INVENTORY */}
      {tab === 'materials' && (
        <RawMaterialsInventorySection />
      )}

      {/* TAB 3: PRODUCTION BATCH HISTORY & STORED STOCKS */}
      {tab === 'batches' && (
        <div className="space-y-4">
          {batches.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E8E0D4]">
              <Factory size={36} className="mx-auto text-[#A3907C] mb-2" />
              <p className="text-sm font-semibold text-[#24201D]">No production batches yet</p>
              <p className="text-xs text-[#7A6B5D] mt-1">
                Go to Production to calculate costs and produce your first batch of cones!
              </p>
            </div>
          ) : (
            batches.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl p-5 bg-white border border-[#E8E0D4] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#720000] px-2 py-0.5 rounded bg-red-50 border border-red-100">
                        {b.batchId}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#FAF8F3] border border-[#E8E0D4] text-[#720000]">
                        {b.coneCategory || 'Organic Henna Cone'}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#24201D] mt-1">
                      {b.productName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Stored in Stock
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[#7A6B5D] mt-1.5 justify-end">
                      <Clock size={12} />
                      <span>{b.addedTimeFormatted || formatDateTime(b.addedAt || b.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4]">
                  <div>
                    <p className="text-[11px] text-[#7A6B5D]">Output Cones</p>
                    <p className="text-base font-bold text-[#24201D] tabular-nums">
                      {b.actualOutput || b.expectedOutput} cones
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7A6B5D]">Total Batch Cost</p>
                    <p className="text-base font-bold text-[#720000] tabular-nums">
                      ৳{b.totalCost.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7A6B5D]">Cost per Cone</p>
                    <p className="text-base font-bold text-emerald-700 tabular-nums">
                      ৳{Math.round(b.costPerUnit).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7A6B5D]">Selling Price / Unit</p>
                    <p className="text-base font-bold text-[#24201D] tabular-nums">
                      ৳{b.sellingPrice ? Math.round(b.sellingPrice).toLocaleString() : '100'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(36,32,29,0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
            style={{ border: '1.5px solid #E8E0D4' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between border-b"
              style={{ borderColor: '#E8E0D4' }}
            >
              <h2 className="font-serif text-lg font-bold text-[#24201D]">
                Add New Product / Cone
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-[#7A6B5D]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <NewProductForm
                onClose={() => setShowAddModal(false)}
                onSave={() => {
                  setShowAddModal(false);
                  refreshData();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
