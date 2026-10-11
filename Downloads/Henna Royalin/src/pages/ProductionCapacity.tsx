import { useState, useEffect } from 'react';
import {
  Factory, Package, Calculator, Sparkles, CheckCircle2, ArrowRight,
  TrendingUp, Clock, DollarSign, Layers, Plus, RefreshCw, AlertCircle, FileText
} from 'lucide-react';
import { db, Product, ProductionBatch, formatDateTime } from '../lib/db';
import { useModal } from '../context/ModalContext';
import ProductionCostingSection from '../components/production/ProductionCostingSection';
import StockConsumptionProfitReport from '../components/production/StockConsumptionProfitReport';

const PRESET_CONES = [
  { name: 'Organic Rajasthani Cone 20gm', size: '20gm', defaultPrice: 100 },
  { name: 'Organic Rajasthani Cone 25gm', size: '25gm', defaultPrice: 120 },
  { name: 'Dark Stain Mehendi Cone 30gm', size: '30gm', defaultPrice: 150 },
  { name: 'Special Bridal Henna Cone', size: 'Bridal', defaultPrice: 200 }
];

interface ProductionProps {
  onNavigate?: (page: string) => void;
}

export default function ProductionCapacity({ onNavigate }: ProductionProps) {
  const { showAlert } = useModal();
  // Batch Ingredients Costs (Clean total calculation)
  const [costs, setCosts] = useState({
    powder: 5000,
    oil: 1000,
    lemon: 500,
    sugar: 300,
    cellophane: 1500,
    labor: 500,
    other: 200
  });

  // Cones & Output
  const [totalCones, setTotalCones] = useState<number>(1500);
  const [selectedPreset, setSelectedPreset] = useState<string>('20gm');
  const [coneName, setConeName] = useState<string>('Organic Rajasthani Cone 20gm');
  const [sellingPrice, setSellingPrice] = useState<number>(100);
  const [notes, setNotes] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'costing' | 'profit' | 'produce'>('costing');

  // UI feedback
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    refreshData();
    const unsub = db.subscribe(refreshData);
    return unsub;
  }, []);

  const refreshData = () => {
    setBatches(db.getProductionBatches());
    setProducts(db.getProducts());
  };

  // Calculations — integer rounded (never decimal points)
  const totalBatchCost = Math.round(Object.values(costs).reduce((sum, v) => sum + (Number(v) || 0), 0));
  const costPerCone = totalCones > 0 ? Math.round(totalBatchCost / totalCones) : 0;
  const totalRevenue = Math.round(totalCones * Math.round(sellingPrice));
  const netProfit = Math.round(totalRevenue - totalBatchCost);
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const handleSelectPreset = (p: typeof PRESET_CONES[0]) => {
    setSelectedPreset(p.size);
    setConeName(p.name);
    setSellingPrice(p.defaultPrice);
  };

  const handleCostChange = (key: keyof typeof costs, value: string) => {
    const num = Math.max(0, parseFloat(value) || 0);
    setCosts(c => ({ ...c, [key]: num }));
  };

  const handleSaveToStock = () => {
    if (totalCones <= 0) {
      showAlert({ type: 'warning', title: 'Invalid Count', message: 'Please enter a valid number of cones produced.' });
      return;
    }

    // Save batch and automatically stock product under that cone name/size
    const batch = db.saveProductionBatch({
      productId: coneName,
      productName: coneName,
      coneType: selectedPreset,
      coneCategory: selectedPreset === 'Bridal' ? 'Bridal Cone' : 'Mehendi Cone',
      actualOutput: totalCones,
      expectedOutput: totalCones,
      totalCost: totalBatchCost,
      costPerCone: costPerCone,
      sellingPrice: sellingPrice,
      projectedProfit: netProfit,
      notes: notes || `Produced ${totalCones}x ${coneName} at ৳${costPerCone}/cone`
    });

    setSavedSuccess(`Successfully saved ${totalCones.toLocaleString()} cones (${coneName}) into Stock at ৳${costPerCone}/cone!`);
    refreshData();
    setTimeout(() => setSavedSuccess(null), 6000);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
              Production & Cone Costing Calculator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#720000]/10 text-[#720000]">
              Direct Auto-Stock
            </span>
          </div>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Calculate ingredient expenses, enter total cones made, get cost per cone, and 1-click add directly to stock inventory.
          </p>
        </div>

        {onNavigate && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('products')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#720000] bg-red-50 hover:bg-red-100 transition border border-red-200"
            >
              <Package size={14} /> View Stock Products
            </button>
          </div>
        )}
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-sm flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900">Stock Updated Successfully!</p>
              <p className="text-xs text-emerald-700 mt-0.5">{savedSuccess}</p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('products')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0"
            >
              Check Stock <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-[#E8E0D4] gap-2 overflow-x-auto pb-1">
        {[
          { id: 'costing', label: 'Cone Costing & Formulas (20g, 25g, 30g)', icon: Calculator },
          { id: 'profit', label: 'Monthly & Daily Profit Breakdown', icon: TrendingUp },
          { id: 'produce', label: 'Batch Production & Direct Stocking', icon: Factory },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#720000] text-white shadow-xs'
                : 'text-[#7A6B5D] bg-white border border-[#E8E0D4] hover:bg-[#FAF8F3]'
            }`}
          >
            <t.icon size={15} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'costing' && <ProductionCostingSection />}

      {activeTab === 'profit' && <StockConsumptionProfitReport />}

      {activeTab === 'produce' && (
        <div className="space-y-6">
          {/* Main 2-Column Calculator Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Ingredients & Cone Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Ingredient Expenses */}
          <div className="bg-white rounded-2xl border border-[#E8E0D4] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-[#E8E0D4] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#720000] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-bold text-sm text-[#24201D]">Ingredient & Material Expenses</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#7A6B5D] block">Total Batch Cost</span>
                <span className="font-bold text-base text-[#720000] tabular-nums">
                  ৳{totalBatchCost.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                  100% Rajasthani Henna Powder (৳)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] font-medium"
                  value={costs.powder}
                  onChange={e => handleCostChange('powder', e.target.value)}
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                  Essential Oils (Eucalyptus/Cajeput/Tea Tree) (৳)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] font-medium"
                  value={costs.oil}
                  onChange={e => handleCostChange('oil', e.target.value)}
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                  Lemon Juice / Black Tea Water (৳)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] font-medium"
                  value={costs.lemon}
                  onChange={e => handleCostChange('lemon', e.target.value)}
                  placeholder="500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                  Sugar & Natural Binding Agents (৳)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] font-medium"
                  value={costs.sugar}
                  onChange={e => handleCostChange('sugar', e.target.value)}
                  placeholder="300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                  Cellophane Cone Paper & Pin Rolls (৳)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] font-medium"
                  value={costs.cellophane}
                  onChange={e => handleCostChange('cellophane', e.target.value)}
                  placeholder="1500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                  Labor & Cone Rolling / Packing (৳)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] font-medium"
                  value={costs.labor}
                  onChange={e => handleCostChange('labor', e.target.value)}
                  placeholder="500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                  Other / Misc Expenses (Tape, Storage, Gas) (৳)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] font-medium"
                  value={costs.other}
                  onChange={e => handleCostChange('other', e.target.value)}
                  placeholder="200"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Cones Produced & Category Selection */}
          <div className="bg-white rounded-2xl border border-[#E8E0D4] p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b border-[#E8E0D4] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#720000] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-bold text-sm text-[#24201D]">Cones Output & Stock Target</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#24201D] block mb-1.5">
                  Select Cone Category Preset:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_CONES.map(p => (
                    <button
                      key={p.size}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedPreset === p.size
                          ? 'border-[#720000] bg-red-50/50 shadow-xs'
                          : 'border-[#E8E0D4] hover:bg-[#FAF8F3]'
                      }`}
                    >
                      <p className={`font-bold text-xs ${selectedPreset === p.size ? 'text-[#720000]' : 'text-[#24201D]'}`}>
                        {p.size}
                      </p>
                      <p className="text-[10px] text-[#7A6B5D] mt-0.5">৳{p.defaultPrice} / cone</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                    Total Cones Made in Batch *
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 text-sm font-bold rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] text-[#720000] bg-[#FAF8F3]"
                    value={totalCones}
                    onChange={e => setTotalCones(Math.max(1, parseInt(e.target.value) || 0))}
                    placeholder="1500"
                  />
                  <p className="text-[10px] text-[#7A6B5D] mt-1">This quantity will be added directly into stock.</p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                    Selling Price per Cone (৳)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 text-sm font-bold rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] text-[#24201D]"
                    value={sellingPrice}
                    onChange={e => setSellingPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                    placeholder="100"
                  />
                  <p className="text-[10px] text-[#7A6B5D] mt-1">Retail selling price to customer</p>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                  Product / Stock Item Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000]"
                  value={coneName}
                  onChange={e => setConeName(e.target.value)}
                  placeholder="e.g. Organic Rajasthani Cone 20gm"
                />
                <p className="text-[10px] text-[#7A6B5D] mt-1">
                  Stored into inventory under this product name.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#24201D] block mb-1">
                  Batch Notes (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000]"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Extra dark eucalyptus blend for wedding orders"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Calculation & Save to Stock Card */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border-2 border-[#720000]/20 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E0D4] pb-3">
              <div className="flex items-center gap-2">
                <Calculator size={18} className="text-[#720000]" />
                <h3 className="font-bold text-sm text-[#24201D]">Batch Cost & Profit Summary</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {profitMargin}% Margin
              </span>
            </div>

            {/* Big Hero KPI: Cost per Cone */}
            <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E0D4] text-center">
              <span className="text-xs font-semibold text-[#7A6B5D] uppercase tracking-wider block">
                Calculated Cost per Cone
              </span>
              <div className="text-3xl font-extrabold text-[#720000] tabular-nums mt-1">
                ৳{Math.round(costPerCone).toLocaleString()}
              </div>
              <p className="text-[11px] text-[#7A6B5D] mt-1">
                Total ৳{totalBatchCost.toLocaleString()} ÷ {totalCones.toLocaleString()} cones
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-[#7A6B5D]">Total Cones to Stock:</span>
                <span className="font-bold text-[#24201D] tabular-nums">{totalCones.toLocaleString()} Cones</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-[#7A6B5D]">Total Production Cost:</span>
                <span className="font-bold text-[#720000] tabular-nums">৳{totalBatchCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-[#7A6B5D]">Selling Price per Cone:</span>
                <span className="font-bold text-[#24201D] tabular-nums">৳{Math.round(sellingPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-[#7A6B5D]">Profit per Cone:</span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  ৳{Math.round(sellingPrice - costPerCone).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-[#7A6B5D]">Projected Revenue:</span>
                <span className="font-bold text-[#24201D] tabular-nums">৳{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-emerald-50 px-3 rounded-xl">
                <span className="font-bold text-emerald-900">Projected Net Profit:</span>
                <span className="font-extrabold text-sm text-emerald-800 tabular-nums">
                  ৳{netProfit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Save to Stock Action Button */}
            <button
              type="button"
              onClick={handleSaveToStock}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #720000 0%, #8B1A1A 100%)',
              }}
            >
              <Package size={17} />
              Confirm Batch & Add to Stock
            </button>

            <p className="text-[11px] text-[#7A6B5D] text-center">
              Automatically updates product stock and records exact date & time stamp.
            </p>
          </div>

          {/* Current Stock Snapshot for this item */}
          <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4 shadow-xs">
            <h4 className="font-bold text-xs text-[#24201D] mb-2 flex items-center gap-1.5">
              <Layers size={13} className="text-[#720000]" />
              Live Stock Status for {coneName}
            </h4>
            {(() => {
              const matched = products.find(p => p.name.toLowerCase().includes(coneName.toLowerCase()) || p.size === selectedPreset);
              return (
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FAF8F3]">
                  <span className="text-[#7A6B5D]">Current In-Stock:</span>
                  <span className={`font-bold text-sm tabular-nums ${matched && matched.stock <= 20 ? 'text-red-600' : 'text-emerald-800'}`}>
                    {matched ? `${matched.stock} units` : 'Not in catalog yet'}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Production Batch History */}
      <div className="bg-white rounded-2xl border border-[#E8E0D4] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-[#E8E0D4] pb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#720000]" />
            <h3 className="font-bold text-sm text-[#24201D]">Production Batch Records</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {batches.length} Batches
            </span>
          </div>
          <button
            onClick={refreshData}
            className="text-xs font-semibold text-[#7A6B5D] hover:text-[#24201D] flex items-center gap-1"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
              <tr>
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Cone Product</th>
                <th className="py-3 px-4">Cones Output</th>
                <th className="py-3 px-4">Cost / Cone</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Projected Profit</th>
                <th className="py-3 px-4">Added Date & Time</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D4]">
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#7A6B5D]">
                    No production batches logged yet. Calculate and confirm a batch above!
                  </td>
                </tr>
              ) : (
                batches.map(b => (
                  <tr key={b.id} className="hover:bg-[#FFFDF5] transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#720000]">
                      {b.batchId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#24201D]">
                      {b.productName}
                      {b.coneType && <span className="ml-1.5 text-[10px] text-[#7A6B5D]">({b.coneType})</span>}
                    </td>
                    <td className="py-3 px-4 font-bold tabular-nums text-emerald-800">
                      +{b.actualOutput.toLocaleString()} cones
                    </td>
                    <td className="py-3 px-4 tabular-nums font-bold text-[#24201D]">
                      ৳{Math.round(b.costPerUnit).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-[#7A6B5D]">
                      ৳{b.totalCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 tabular-nums font-bold text-emerald-700">
                      {b.projectedProfit ? `৳${b.projectedProfit.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-[#7A6B5D]">
                      {b.addedTimeFormatted || b.date}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Added to Stock
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )}
  </div>
);
}
