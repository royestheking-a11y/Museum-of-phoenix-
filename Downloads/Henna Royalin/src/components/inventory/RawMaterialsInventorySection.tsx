import React, { useState, useEffect } from 'react';
import {
  Boxes, Plus, Minus, X, AlertTriangle, TrendingUp, Clock,
  Package, CheckCircle, ArrowRight, ShieldAlert, History,
  Layers, RefreshCw, FileText, Search, Sparkles, Filter
} from 'lucide-react';
import {
  db,
  InventoryItem,
  RawMaterialStockLog,
  formatDateTime
} from '../../lib/db';
import { useModal } from '../../context/ModalContext';

export default function RawMaterialsInventorySection() {
  const { showAlert } = useModal();
  const [materials, setMaterials] = useState<InventoryItem[]>([]);
  const [logs, setLogs] = useState<RawMaterialStockLog[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subTab, setSubTab] = useState<'inventory' | 'logs'>('inventory');

  // Modals state
  const [showRestockModal, setShowRestockModal] = useState<boolean>(false);
  const [selectedMaterialForRestock, setSelectedMaterialForRestock] = useState<InventoryItem | null>(null);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState<boolean>(false);
  const [showQuickAdjustModal, setShowQuickAdjustModal] = useState<InventoryItem | null>(null);

  // Restock Form
  const [restockForm, setRestockForm] = useState({
    materialId: '',
    quantity: 1,
    unitMultiplier: '1', // 1 for gm/ml/pcs, 1000 for kg/L
    unitName: 'gm',
    costPerUnit: 0,
    totalCost: 0,
    supplier: '',
    notes: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  // Add Material Form
  const [newMaterialForm, setNewMaterialForm] = useState({
    name: '',
    category: 'Raw Ingredient',
    unit: 'gm',
    initialStock: 1000,
    costPerUnit: 1.20,
    lowStockLevel: 200,
    supplier: ''
  });

  // Quick adjust form
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustNotes, setAdjustNotes] = useState<string>('Manual inventory balance');

  const refresh = () => {
    setMaterials(db.getInventory());
    setLogs(db.getRawMaterialLogs());
  };

  useEffect(() => {
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const openRestockModal = (item?: InventoryItem) => {
    const target = item || materials[0];
    if (!target) return;
    setSelectedMaterialForRestock(target);
    const isWeight = target.unit === 'gm' || target.unit === 'kg';
    const isVolume = target.unit === 'ml' || target.unit === 'L';
    setRestockForm({
      materialId: target.id,
      quantity: isWeight ? 1 : isVolume ? 1 : 100,
      unitMultiplier: isWeight || isVolume ? '1000' : '1',
      unitName: isWeight ? 'kg' : isVolume ? 'L' : target.unit,
      costPerUnit: target.costPerUnit,
      totalCost: (isWeight || isVolume ? 1000 : 100) * target.costPerUnit,
      supplier: target.supplier || '',
      notes: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    setShowRestockModal(true);
  };

  const handleExecuteRestock = () => {
    if (!selectedMaterialForRestock) return;
    const qty = Number(restockForm.quantity) || 0;
    const mult = Number(restockForm.unitMultiplier) || 1;
    const totalBaseQty = Math.round(qty * mult * 100) / 100;

    if (totalBaseQty <= 0) {
      showAlert({ type: 'warning', title: 'Invalid Quantity', message: 'Please enter a valid stock amount.' });
      return;
    }

    db.adjustRawMaterialStock(selectedMaterialForRestock.id, totalBaseQty, {
      type: 'purchase_in',
      unitCost: Number(restockForm.costPerUnit) || selectedMaterialForRestock.costPerUnit,
      referenceId: `PO-${Date.now().toString().slice(-4)}`,
      notes: restockForm.notes || `Purchased +${qty} ${restockForm.unitName} (${totalBaseQty} ${selectedMaterialForRestock.unit}) from ${restockForm.supplier || selectedMaterialForRestock.supplier || 'Vendor'}`
    });

    setShowRestockModal(false);
    refresh();
    showAlert({
      type: 'success',
      title: 'Stock Added Successfully',
      message: `Added +${totalBaseQty} ${selectedMaterialForRestock.unit} to ${selectedMaterialForRestock.name} inventory.`
    });
  };

  const handleAddNewMaterial = () => {
    if (!newMaterialForm.name.trim()) {
      showAlert({ type: 'warning', title: 'Name Required', message: 'Please provide material name.' });
      return;
    }

    const created = db.addInventoryItem({
      name: newMaterialForm.name.trim(),
      category: newMaterialForm.category,
      type: 'raw_material',
      unit: newMaterialForm.unit,
      currentStock: Number(newMaterialForm.initialStock) || 0,
      lowStockLevel: Number(newMaterialForm.lowStockLevel) || 10,
      costPerUnit: Number(newMaterialForm.costPerUnit) || 0,
      supplier: newMaterialForm.supplier,
      addedAt: new Date().toISOString(),
      addedTimeFormatted: formatDateTime(new Date())
    });

    // Record initial log if stock > 0
    if (newMaterialForm.initialStock > 0) {
      db.addRawMaterialLog({
        materialId: created.id,
        materialName: created.name,
        type: 'purchase_in',
        quantityChange: Number(newMaterialForm.initialStock),
        unit: created.unit,
        previousStock: 0,
        remainingStock: Number(newMaterialForm.initialStock),
        unitCost: created.costPerUnit,
        totalCost: Number(newMaterialForm.initialStock) * created.costPerUnit,
        referenceId: 'INITIAL_STOCK',
        notes: 'Initial inventory stock balance'
      });
    }

    setShowAddMaterialModal(false);
    refresh();
    showAlert({
      type: 'success',
      title: 'Material Created',
      message: `${created.name} added to raw materials inventory.`
    });
  };

  const handleQuickAdjust = (isAdd: boolean) => {
    if (!showQuickAdjustModal) return;
    const delta = isAdd ? Math.abs(adjustAmount) : -Math.abs(adjustAmount);

    db.adjustRawMaterialStock(showQuickAdjustModal.id, delta, {
      type: 'manual_adjust',
      notes: adjustNotes || `Manual adjustment of ${delta} ${showQuickAdjustModal.unit}`
    });

    setShowQuickAdjustModal(null);
    refresh();
    showAlert({
      type: 'success',
      title: 'Stock Adjusted',
      message: `Updated ${showQuickAdjustModal.name} stock balance by ${delta > 0 ? '+' : ''}${delta} ${showQuickAdjustModal.unit}.`
    });
  };

  const filteredMaterials = materials.filter(m => {
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || (m.supplier && m.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const rawIngredientsVal = materials.filter(m => m.category === 'Raw Ingredient').reduce((s, m) => s + (m.currentStock * m.costPerUnit), 0);
  const packagingVal = materials.filter(m => m.category === 'Packaging Material').reduce((s, m) => s + (m.currentStock * m.costPerUnit), 0);
  const totalRawStockVal = materials.reduce((s, m) => s + (m.currentStock * m.costPerUnit), 0);

  return (
    <div className="space-y-6">
      {/* ── SUB-HEADER WITH CONTROLS ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E0D4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#24201D]">
              Raw Materials & Packaging Inventory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#720000]/10 text-[#720000]">
              Automated Deduction
            </span>
          </div>
          <p className="text-xs text-[#7A6B5D] mt-0.5">
            Real-time material stock, timestamped purchase entries, order consumption deduction & transaction ledger
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => openRestockModal()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-95"
            style={{ background: '#720000' }}
          >
            <Plus size={15} /> + Restock / Stock In
          </button>
          <button
            onClick={() => setShowAddMaterialModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#720000] bg-red-50 hover:bg-red-100 transition border border-red-200"
          >
            <Layers size={14} /> + Add Material
          </button>
        </div>
      </div>

      {/* ── VALUATION SUMMARY STATS ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6B5D] text-xs mb-1">
            <span className="font-semibold">Total Raw Materials Stock Value</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#24201D] tabular-nums">
            ৳{Math.round(totalRawStockVal).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#7A6B5D] mt-0.5">
            {materials.length} active inventory items
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6B5D] text-xs mb-1">
            <span className="font-semibold">Raw Ingredients Asset Value</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-900 tabular-nums">
            ৳{Math.round(rawIngredientsVal).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#7A6B5D] mt-0.5">
            Powder, eucalyptus oil, sugar, lemon, XG
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6B5D] text-xs mb-1">
            <span className="font-semibold">Packaging Materials Value</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-900 tabular-nums">
            ৳{Math.round(packagingVal).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#7A6B5D] mt-0.5">
            Cello sheets, pins, logo sticker rolls
          </p>
        </div>
      </div>

      {/* ── SUB-TABS: INVENTORY LIST vs TRANSACTION LOGS ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E0D4] pb-3">
        <div className="flex rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] p-1 gap-1 text-xs">
          <button
            onClick={() => setSubTab('inventory')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition ${
              subTab === 'inventory'
                ? 'bg-[#720000] text-white shadow-xs'
                : 'text-[#7A6B5D] hover:text-[#24201D]'
            }`}
          >
            <Boxes size={14} /> Material Inventory ({materials.length})
          </button>
          <button
            onClick={() => setSubTab('logs')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition ${
              subTab === 'logs'
                ? 'bg-[#720000] text-white shadow-xs'
                : 'text-[#7A6B5D] hover:text-[#24201D]'
            }`}
          >
            <History size={14} /> Stock Transaction Logs ({logs.length})
          </button>
        </div>

        {subTab === 'inventory' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search material or supplier..."
                className="form-input text-xs pl-8 pr-3 py-1.5 rounded-xl border-[#E8E0D4]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="form-input text-xs py-1.5 px-3 rounded-xl border-[#E8E0D4]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Raw Ingredient">Raw Ingredients</option>
              <option value="Packaging Material">Packaging Materials</option>
            </select>
          </div>
        )}
      </div>

      {/* ── SUBTAB 1: LIVE INVENTORY TABLE ─────────────────────────────── */}
      {subTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-240">
              <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
                <tr>
                  <th className="py-3 px-4">Material / Ingredient</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Live Available Stock</th>
                  <th className="py-3 px-4">Added Date & Time</th>
                  <th className="py-3 px-4">Unit Rate</th>
                  <th className="py-3 px-4">Total Stock Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D4]">
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-[#7A6B5D]">
                      No raw materials found. Click "+ Restock / Stock In" above.
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((item) => {
                    const isLow = item.currentStock <= item.lowStockLevel;
                    return (
                      <tr key={item.id} className="hover:bg-[#FFFDF5] transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-sm text-[#24201D]">{item.name}</p>
                          {item.supplier && (
                            <p className="text-[11px] text-[#A3907C] mt-0.5">{item.supplier}</p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.category === 'Packaging Material'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold tabular-nums text-sm ${
                            isLow ? 'text-red-700' : 'text-[#24201D]'
                          }`}>
                            {item.currentStock.toLocaleString()} {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#7A6B5D] font-mono text-[11px]">
                          {item.addedTimeFormatted || (item.addedAt ? formatDateTime(item.addedAt) : '01 Oct 2026, 09:00 AM')}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#24201D]">
                          ৳{item.costPerUnit.toFixed(2)} / {item.unit}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-800 tabular-nums">
                          ৳{Math.round(item.currentStock * item.costPerUnit).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                              <AlertTriangle size={11} /> Low Stock (≤{item.lowStockLevel})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                              <CheckCircle size={11} /> Adequate
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setShowQuickAdjustModal(item);
                                setAdjustAmount(item.unit === 'gm' || item.unit === 'ml' ? 500 : 100);
                              }}
                              className="px-2 py-1 rounded-lg text-xs font-bold text-[#7A6B5D] hover:bg-gray-100 border border-[#E8E0D4]"
                              title="Quick +/- Adjust"
                            >
                              +/-
                            </button>
                            <button
                              onClick={() => openRestockModal(item)}
                              className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#720000] hover:opacity-95"
                            >
                              + Restock
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

      {/* ── SUBTAB 2: MATERIAL TRANSACTION LOGS ────────────────────────── */}
      {subTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-[#E8E0D4] flex items-center justify-between bg-[#FAF8F3]/50">
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#24201D]">
                Raw Material Audit & Consumption Ledger
              </h3>
              <p className="text-xs text-[#7A6B5D]">
                Every purchase-in, order deduction, batch consumption, and manual change logged with exact date and time
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {logs.length} Entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-225">
              <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Material Name</th>
                  <th className="py-3 px-4">Transaction Type</th>
                  <th className="py-3 px-4">Stock Change</th>
                  <th className="py-3 px-4">Remaining Balance</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D4]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#7A6B5D]">
                      No transaction history yet. Transactions are automatically created when you restock or when orders are placed.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isPositive = log.quantityChange > 0;
                    return (
                      <tr key={log.id} className="hover:bg-[#FFFDF5] transition-colors">
                        <td className="py-3 px-4 font-mono text-[#7A6B5D] text-[11px] whitespace-nowrap">
                          {log.dateTimeFormatted || formatDateTime(log.timestamp)}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#24201D]">
                          {log.materialName}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.type === 'purchase_in' || log.type === 'restock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.type === 'order_deduction'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {log.type === 'purchase_in' ? 'Stock In / Purchase' : log.type === 'order_deduction' ? 'Order Deducted' : log.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold tabular-nums">
                          <span className={isPositive ? 'text-emerald-700' : 'text-red-700'}>
                            {isPositive ? '+' : ''}{log.quantityChange} {log.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#24201D] tabular-nums">
                          {log.remainingStock} {log.unit}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#720000] font-bold">
                          {log.referenceId || '—'}
                        </td>
                        <td className="py-3 px-4 text-[#7A6B5D] max-w-xs truncate" title={log.notes}>
                          {log.notes || '—'}
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

      {/* ── RESTOCK / STOCK IN MODAL ─────────────────────────────────────── */}
      {showRestockModal && selectedMaterialForRestock && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#E8E0D4] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#24201D]">
                  Restock / Purchase Stock In
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Add materials with exact date, time, and purchase rate
                </p>
              </div>
              <button
                onClick={() => setShowRestockModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="form-label text-xs font-bold text-[#24201D]">Selected Material *</label>
              <select
                className="form-input text-xs"
                value={selectedMaterialForRestock.id}
                onChange={(e) => {
                  const item = materials.find(m => m.id === e.target.value);
                  if (item) {
                    setSelectedMaterialForRestock(item);
                    const isWeight = item.unit === 'gm' || item.unit === 'kg';
                    const isVol = item.unit === 'ml' || item.unit === 'L';
                    setRestockForm(f => ({
                      ...f,
                      materialId: item.id,
                      costPerUnit: item.costPerUnit,
                      supplier: item.supplier || '',
                      unitMultiplier: isWeight || isVol ? '1000' : '1',
                      unitName: isWeight ? 'kg' : isVol ? 'L' : item.unit
                    }));
                  }
                }}
              >
                {materials.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Current: {m.currentStock} {m.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Quantity to Add *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input text-xs"
                  value={restockForm.quantity}
                  onChange={(e) => setRestockForm({ ...restockForm, quantity: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Unit Scale</label>
                <select
                  className="form-input text-xs"
                  value={restockForm.unitMultiplier}
                  onChange={(e) => {
                    const mult = e.target.value;
                    let uName = selectedMaterialForRestock.unit;
                    if (mult === '1000') {
                      uName = selectedMaterialForRestock.unit === 'gm' ? 'kg' : 'L';
                    }
                    setRestockForm({ ...restockForm, unitMultiplier: mult, unitName: uName });
                  }}
                >
                  {(selectedMaterialForRestock.unit === 'gm' || selectedMaterialForRestock.unit === 'kg') && (
                    <>
                      <option value="1000">Kilograms (kg) [1 kg = 1,000 gm]</option>
                      <option value="1">Grams (gm)</option>
                    </>
                  )}
                  {(selectedMaterialForRestock.unit === 'ml' || selectedMaterialForRestock.unit === 'L') && (
                    <>
                      <option value="1000">Liters (L) [1 L = 1,000 ml]</option>
                      <option value="1">Milliliters (ml)</option>
                    </>
                  )}
                  {selectedMaterialForRestock.unit === 'pcs' && (
                    <>
                      <option value="1">Pieces (pcs)</option>
                      <option value="600">Bundles (600 pcs)</option>
                      <option value="1800">Boxes (1,800 pcs)</option>
                      <option value="20000">Rolls (20,000 pcs)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
              <span className="font-bold">Total Adding to Stock:</span>{' '}
              <span className="font-mono font-bold text-[#720000]">
                +{Math.round((Number(restockForm.quantity) || 0) * (Number(restockForm.unitMultiplier) || 1) * 100) / 100} {selectedMaterialForRestock.unit}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Cost / Rate (Tk per {selectedMaterialForRestock.unit})</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input text-xs"
                  value={restockForm.costPerUnit}
                  onChange={(e) => setRestockForm({ ...restockForm, costPerUnit: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Supplier / Vendor</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="e.g. Sojat Supplier"
                  value={restockForm.supplier}
                  onChange={(e) => setRestockForm({ ...restockForm, supplier: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="form-label text-xs">Invoice / Purchase Notes</label>
              <input
                type="text"
                className="form-input text-xs"
                placeholder="e.g. Batch #492 purchase order"
                value={restockForm.notes}
                onChange={(e) => setRestockForm({ ...restockForm, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D4]">
              <button
                onClick={() => setShowRestockModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A6B5D] hover:bg-[#F2ECE1]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRestock}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ background: '#720000' }}
              >
                Confirm & Stock In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD NEW RAW MATERIAL MODAL ────────────────────────────────────── */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#E8E0D4] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#24201D]">
                  Add New Material / Item
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Create new ingredient or packaging material in inventory
                </p>
              </div>
              <button
                onClick={() => setShowAddMaterialModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="form-label text-xs">Material Name *</label>
              <input
                type="text"
                className="form-input text-xs"
                placeholder="e.g. Tea Tree Essential Oil"
                value={newMaterialForm.name}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Category</label>
                <select
                  className="form-input text-xs"
                  value={newMaterialForm.category}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, category: e.target.value })}
                >
                  <option value="Raw Ingredient">Raw Ingredient</option>
                  <option value="Packaging Material">Packaging Material</option>
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Unit</label>
                <select
                  className="form-input text-xs"
                  value={newMaterialForm.unit}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, unit: e.target.value })}
                >
                  <option value="gm">Grams (gm)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="L">Liters (L)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Initial Stock</label>
                <input
                  type="number"
                  className="form-input text-xs"
                  value={newMaterialForm.initialStock}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, initialStock: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Cost per Unit (Tk)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input text-xs"
                  value={newMaterialForm.costPerUnit}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, costPerUnit: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Low Stock Alert Level</label>
                <input
                  type="number"
                  className="form-input text-xs"
                  value={newMaterialForm.lowStockLevel}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, lowStockLevel: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Supplier</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="e.g. Essential Oils Inc"
                  value={newMaterialForm.supplier}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, supplier: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D4]">
              <button
                onClick={() => setShowAddMaterialModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A6B5D] hover:bg-[#F2ECE1]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewMaterial}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ background: '#720000' }}
              >
                Create Material
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── QUICK +/- ADJUST MODAL ───────────────────────────────────────── */}
      {showQuickAdjustModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#E8E0D4] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#24201D]">
                  Quick Stock Adjustment
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  {showQuickAdjustModal.name} (Current: {showQuickAdjustModal.currentStock} {showQuickAdjustModal.unit})
                </p>
              </div>
              <button
                onClick={() => setShowQuickAdjustModal(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="form-label text-xs">Adjustment Amount ({showQuickAdjustModal.unit})</label>
              <input
                type="number"
                step="0.1"
                className="form-input text-xs"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="form-label text-xs">Reason / Note</label>
              <input
                type="text"
                className="form-input text-xs"
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleQuickAdjust(false)}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <Minus size={14} /> Deduct (-{adjustAmount})
              </button>
              <button
                onClick={() => handleQuickAdjust(true)}
                className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Add (+{adjustAmount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
