import { useState, useEffect } from 'react';
import {
  Package, Plus, Search, X, AlertTriangle, Edit2, ToggleLeft, ToggleRight,
  Clock, LayoutGrid, Table, ArrowRight, Sparkles, CheckCircle2, Tag, Trash2
} from 'lucide-react';
import { db, Product } from '../lib/db';
import { useModal } from '../context/ModalContext';

interface ProductFormProps {
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  existing?: Product;
}

function ProductForm({ onClose, onSave, onDelete, existing }: ProductFormProps) {
  const { showAlert } = useModal();
  const [form, setForm] = useState({
    name: existing?.name || '',
    sku: existing?.sku || '',
    category: existing?.category || 'Mehendi Cone',
    size: existing?.size || '',
    sellingPrice: existing?.sellingPrice || 0,
    costPrice: existing?.costPrice || 0,
    stock: existing?.stock || 0,
    lowStockLevel: existing?.lowStockLevel || 20,
    supplier: existing?.supplier || 'Henna Royalin In-house',
    status: existing?.status || ('active' as 'active' | 'inactive')
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const margin = form.sellingPrice > 0 ? Math.round(((form.sellingPrice - form.costPrice) / form.sellingPrice) * 100) : 0;

  const handleSave = () => {
    if (!form.name || !form.sku) { showAlert({ type: 'warning', title: 'Required Fields', message: 'Name and SKU are required.' }); return; }
    if (existing) {
      db.updateProduct(existing.id, form);
    } else {
      db.addProduct(form as Omit<Product, 'id' | 'createdAt'>);
    }
    onSave();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Product Name *</label>
          <input
            className="form-input text-xs"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Organic Rajasthani Cone 20gm"
          />
        </div>
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">SKU *</label>
          <input
            className="form-input text-xs font-mono"
            value={form.sku}
            onChange={e => set('sku', e.target.value)}
            placeholder="MC-20"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Category</label>
          <select
            className="form-input text-xs"
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {[
              'Mehendi Cone',
              'Bridal Cone',
              'Fast Stain Cone',
              'Nail Tint',
              'Hair Mehendi',
              'Gift Set',
              'Accessories',
              'Organic Products',
              'Other'
            ].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Size / Variant</label>
          <input
            className="form-input text-xs"
            value={form.size}
            onChange={e => set('size', e.target.value)}
            placeholder="20gm, 25gm, 30gm, Special Bridal..."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Selling Price (৳)</label>
          <input
            type="number"
            className="form-input text-xs"
            value={form.sellingPrice}
            onChange={e => set('sellingPrice', +e.target.value)}
          />
        </div>
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Cost Price (৳)</label>
          <input
            type="number"
            className="form-input text-xs"
            value={form.costPrice}
            onChange={e => set('costPrice', +e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Initial Stock Quantity</label>
          <input
            type="number"
            className="form-input text-xs"
            value={form.stock}
            onChange={e => set('stock', +e.target.value)}
          />
        </div>
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Low Stock Alert Threshold</label>
          <input
            type="number"
            className="form-input text-xs"
            value={form.lowStockLevel}
            onChange={e => set('lowStockLevel', +e.target.value)}
          />
          <p className="text-[10px] text-[#7A6B5D] mt-0.5">Alert triggers at or below this count (default 20)</p>
        </div>
      </div>
      <div>
        <label className="form-label text-xs font-bold text-[#24201D]">Supplier / Maker</label>
        <input
          className="form-input text-xs"
          value={form.supplier}
          onChange={e => set('supplier', e.target.value)}
          placeholder="Henna Royalin In-house"
        />
      </div>
      <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] flex items-center justify-between text-xs">
        <span className="text-[#7A6B5D]">Projected Profit Margin:</span>
        <span className="font-bold text-[#166534] bg-emerald-100 px-2 py-0.5 rounded-full">{margin}%</span>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E8E0D4]/60">
        {existing && onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="px-3.5 py-2 text-xs font-bold rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={13} /> Delete Product
          </button>
        ) : <div />}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E8E0D4] hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-[#720000] hover:bg-[#5a0000] cursor-pointer"
          >
            {existing ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProductsProps {
  onNavigate?: (page: string) => void;
}

export default function Products({ onNavigate }: ProductsProps) {
  const { showAlert, showConfirm } = useModal();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = await showConfirm({
      title: `Delete "${product.name}"?`,
      message: `Are you sure you want to permanently delete this product (SKU: ${product.sku}) from your stock catalog? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'warning'
    });
    if (!confirmed) return;

    db.deleteProduct(product.id);
    refresh();
    showAlert({
      type: 'success',
      title: 'Product Deleted',
      message: `"${product.name}" (${product.sku}) has been permanently deleted from stock catalog.`
    });
  };

  useEffect(() => {
    // Ensure core products exist on mount
    db.restoreCoreProducts();
    setProducts(db.getProducts());
    const unsub = db.subscribe(() => setProducts(db.getProducts()));
    return unsub;
  }, []);

  const refresh = () => setProducts(db.getProducts());

  const handleRestoreCoreCones = () => {
    db.restoreCoreProducts();
    refresh();
    showAlert({
      type: 'success',
      title: 'Products Restored',
      message: 'Standard 20gm, 25gm, and 30gm Organic Rajasthani Henna Cones have been successfully restored to your catalog and synced to Cloud Storage.'
    });
  };

  const has20gm = products.some(p => (p.size && p.size.toLowerCase().includes('20')) || p.name.toLowerCase().includes('20gm'));
  const has25gm = products.some(p => (p.size && p.size.toLowerCase().includes('25')) || p.name.toLowerCase().includes('25gm'));
  const has30gm = products.some(p => (p.size && p.size.toLowerCase().includes('30')) || p.name.toLowerCase().includes('30gm'));
  const isMissingCore = !has20gm || !has25gm || !has30gm;

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalValue = products.reduce((s, p) => s + (p.stock * p.costPrice), 0);
  const totalStockUnits = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= (p.lowStockLevel || 20)).length;

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#24201D]">All Stock Products</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#720000]/10 text-[#720000]">
              {products.length} Items
            </span>
          </div>
          <p className="text-xs text-[#7A6B5D] mt-0.5">
            Complete inventory catalog of all henna cones, variants, live stock balances, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Switcher */}
          <div className="flex items-center bg-[#FAF8F3] border border-[#E8E0D4] rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-white text-[#720000] shadow-xs' : 'text-[#7A6B5D] hover:text-[#24201D]'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-white text-[#720000] shadow-xs' : 'text-[#7A6B5D] hover:text-[#24201D]'
              }`}
              title="Table View"
            >
              <Table size={15} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('production')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#720000] bg-red-50 border border-red-200 hover:bg-red-100 transition"
            >
              <Sparkles size={14} /> Calculate & Produce
            </button>
          )}

          <button
            onClick={handleRestoreCoreCones}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#720000] bg-[#FAF8F3] border border-[#E8E0D4] hover:bg-[#F5EFEB] transition cursor-pointer"
            title="Restore 20gm, 25gm, and 30gm Cones"
          >
            <Sparkles size={14} /> Restore 20g/25g/30g Cones
          </button>

          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#720000] hover:bg-[#5a0000] shadow-xs transition"
          >
            <Plus size={15} /> Add New Product
          </button>
        </div>
      </div>

      {/* Missing Core Cones Notice Banner */}
      {isMissingCore && (
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D4] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#720000]/10 text-[#720000] flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#24201D]">
                Standard Henna Cones Missing from Catalog
              </p>
              <p className="text-[11px] text-[#7A6B5D] mt-0.5">
                {!has20gm && '• 20gm Cone '} {!has25gm && '• 25gm Cone '} {!has30gm && '• 30gm Cone '} are missing. Click Restore to recover them immediately.
              </p>
            </div>
          </div>
          <button
            onClick={handleRestoreCoreCones}
            className="px-3.5 py-1.5 bg-[#720000] hover:bg-[#5a0000] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition shadow-xs cursor-pointer"
          >
            <Sparkles size={13} /> Restore 20g, 25g & 30g Cones
          </button>
        </div>
      )}

      {/* Prominent Low Stock Alert if any product <= 20 (Requirement: alert at <= 20) */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-red-900">
                Low Stock Alert ({lowStockCount} {lowStockCount === 1 ? 'Product' : 'Products'} at or below 20 cones!)
              </p>
              <p className="text-[11px] text-red-700 mt-0.5">
                The safety threshold is 20 units. Run a production batch to replenish live finished stock.
              </p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('production')}
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition"
            >
              Produce Cones <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Products in Catalog', value: products.length, sub: 'Active SKUs', color: '#720000' },
          { label: 'Total In-Stock Cones', value: totalStockUnits.toLocaleString(), sub: 'Ready for delivery', color: '#166534' },
          { label: 'Low Stock Alert (≤20)', value: lowStockCount, sub: lowStockCount > 0 ? 'Action required' : 'Stock healthy', color: lowStockCount > 0 ? '#DC2626' : '#166534' },
          { label: 'Total Stock Valuation', value: `৳${totalValue.toLocaleString()}`, sub: 'Cost-basis valuation', color: '#1E40AF' }
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 bg-white border border-[#E8E0D4] shadow-xs">
            <p className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-bold text-[#24201D] mt-1">{s.label}</p>
            <p className="text-[10px] text-[#7A6B5D]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6B5D] pointer-events-none" />
          <input
            className="w-full pl-10! pr-4 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] bg-white"
            style={{ paddingLeft: '2.6rem' }}
            placeholder="Search stock product by name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] w-full sm:w-auto overflow-x-auto">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize whitespace-nowrap ${
                catFilter === c
                  ? 'bg-[#720000] text-white shadow-xs'
                  : 'text-[#7A6B5D] hover:text-[#24201D]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: PRODUCT CARDS / GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#7A6B5D] bg-white rounded-2xl border border-[#E8E0D4] p-6">
              <Package size={36} className="mx-auto mb-2 text-gray-300" />
              <p className="font-semibold text-sm text-[#24201D]">No products found in catalog</p>
              <p className="text-xs text-gray-400 mt-0.5 mb-4">Restore standard 20gm, 25gm, and 30gm henna cones with 1 click.</p>
              <button
                onClick={handleRestoreCoreCones}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#720000] hover:bg-[#5a0000] shadow-xs transition cursor-pointer"
              >
                <Sparkles size={14} /> Restore 20gm, 25gm & 30gm Cones
              </button>
            </div>
          ) : (
            filtered.map(p => {
              const margin = p.sellingPrice > 0 ? Math.round(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100) : 0;
              const isLowStock = p.stock <= (p.lowStockLevel || 20);
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl p-4 bg-white border transition-all hover:shadow-md flex flex-col justify-between ${
                    isLowStock ? 'border-red-300 bg-red-50/10' : 'border-[#E8E0D4]'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#FAF8F3] border border-[#E8E0D4] text-[#720000]">
                          {p.sku}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8E0D4]/40 text-[#7A6B5D]">
                          {p.category}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          db.updateProduct(p.id, { status: p.status === 'active' ? 'inactive' : 'active' });
                          refresh();
                        }}
                        title={p.status === 'active' ? 'Active Product' : 'Inactive'}
                      >
                        {p.status === 'active' ? (
                          <ToggleRight size={22} className="text-emerald-700" />
                        ) : (
                          <ToggleLeft size={22} className="text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Title & Variant */}
                    <h3 className="font-bold text-sm text-[#24201D] leading-tight">{p.name}</h3>
                    {p.size && (
                      <p className="text-xs text-[#7A6B5D] flex items-center gap-1 mt-0.5">
                        <Tag size={11} /> {p.size}
                      </p>
                    )}

                    {/* Stock Status Badge */}
                    <div className="mt-3 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] flex items-center justify-between">
                      <span className="text-xs text-[#7A6B5D]">Stock Quantity:</span>
                      <div className="flex items-center gap-1.5">
                        {isLowStock && <AlertTriangle size={13} className="text-red-600 animate-pulse" />}
                        <span className={`tabular-nums font-bold text-base ${isLowStock ? 'text-red-600' : 'text-emerald-800'}`}>
                          {p.stock} units
                        </span>
                      </div>
                    </div>
                    {isLowStock && (
                      <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-red-100 text-red-800 text-[11px] font-bold flex items-center gap-1">
                        <AlertTriangle size={12} /> Critical Low Stock (≤20 cones)
                      </div>
                    )}

                    {/* Pricing Grid */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-[#7A6B5D] block">Selling Price</span>
                        <span className="font-bold text-sm text-[#24201D] tabular-nums">৳{(p.sellingPrice ?? 0).toLocaleString()}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-[#7A6B5D] block">Cost Price</span>
                        <span className="font-medium text-xs text-[#7A6B5D] tabular-nums">৳{(p.costPrice ?? 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-[#7A6B5D]">Gross Margin:</span>
                      <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {margin}%
                      </span>
                    </div>

                    {/* Date Stamp */}
                    <div className="mt-3 pt-2.5 border-t border-[#E8E0D4] flex items-center gap-1.5 text-[10px] text-[#7A6B5D]">
                      <Clock size={11} className="text-[#720000] shrink-0" />
                      <span>Added: {p.addedTimeFormatted || '16 Sep 2026, 10:00 AM'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="flex-1 text-xs font-bold py-1.5 rounded-xl text-[#720000] bg-red-50 hover:bg-red-100 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 size={12} /> Edit Details
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p)}
                      className="p-1.5 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition flex items-center justify-center cursor-pointer"
                      title="Delete Product from Catalog"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: PRODUCT TABLE */}
      {viewMode === 'table' && (
        <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E0D4] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
                <tr>
                  <th className="py-3 px-4">Product / Cone</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Cost Price</th>
                  <th className="py-3 px-4">Margin</th>
                  <th className="py-3 px-4">Live Stock</th>
                  <th className="py-3 px-4">Added Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D4]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-[#7A6B5D] text-sm">
                      <p className="mb-2 font-semibold text-[#24201D]">No products found in catalog.</p>
                      <p className="text-xs text-gray-400 mb-4">Restore standard 20gm, 25gm, and 30gm henna cones with 1 click.</p>
                      <button
                        onClick={handleRestoreCoreCones}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#720000] hover:bg-[#5a0000] shadow-xs transition cursor-pointer"
                      >
                        <Sparkles size={13} /> Restore 20gm, 25gm & 30gm Cones
                      </button>
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => {
                    const margin = p.sellingPrice > 0 ? Math.round(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100) : 0;
                    const isLowStock = p.stock <= (p.lowStockLevel || 20);
                    return (
                      <tr key={p.id} className={`hover:bg-[#FFFDF5] transition ${isLowStock ? 'bg-red-50/30' : ''}`}>
                        <td className="py-3 px-4">
                          <p className="font-bold text-xs text-[#24201D]">{p.name}</p>
                          {p.size && <p className="text-[10px] text-[#7A6B5D]">{p.size}</p>}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-bold text-[#720000]">{p.sku}</span>
                        </td>
                        <td className="py-3 px-4 text-[#7A6B5D]">{p.category}</td>
                        <td className="py-3 px-4 tabular-nums font-bold text-[#24201D]">৳{(p.sellingPrice ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-4 tabular-nums text-[#7A6B5D]">৳{(p.costPrice ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {margin}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {isLowStock && <AlertTriangle size={13} className="text-red-600 animate-pulse" />}
                            <span className={`tabular-nums font-bold text-sm ${isLowStock ? 'text-red-600' : 'text-emerald-800'}`}>
                              {p.stock}
                            </span>
                          </div>
                          {isLowStock && <p className="text-[10px] text-red-600 font-semibold">Low (≤20)</p>}
                        </td>
                        <td className="py-3 px-4 text-[#7A6B5D]">
                          <div className="flex items-center gap-1">
                            <Clock size={11} className="text-[#720000]" />
                            <span>{p.addedTimeFormatted || '—'}</span>
                          </div>
                        </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            db.updateProduct(p.id, { status: p.status === 'active' ? 'inactive' : 'active' });
                            refresh();
                          }}
                          className="flex items-center gap-1"
                        >
                          {p.status === 'active' ? (
                            <ToggleRight size={20} className="text-emerald-700" />
                          ) : (
                            <ToggleLeft size={20} className="text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditing(p)}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg text-[#720000] bg-red-50 border border-[#E8E0D4] hover:bg-red-100 transition inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 size={11} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="text-xs font-bold p-1 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 transition inline-flex items-center cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {(showNew || editing) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(36,32,29,0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#E8E0D4]">
              <h2 className="font-serif text-lg font-bold text-[#24201D]">
                {editing ? 'Edit Product Details' : 'Add New Product to Stock'}
              </h2>
              <button
                onClick={() => {
                  setShowNew(false);
                  setEditing(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <ProductForm
                existing={editing || undefined}
                onClose={() => {
                  setShowNew(false);
                  setEditing(null);
                }}
                onSave={() => {
                  setShowNew(false);
                  setEditing(null);
                  refresh();
                }}
                onDelete={() => {
                  if (editing) {
                    const prod = editing;
                    setEditing(null);
                    handleDeleteProduct(prod);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
