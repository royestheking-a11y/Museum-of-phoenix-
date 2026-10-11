import React, { useState, useEffect } from 'react';
import {
  Calculator, Edit3, RotateCcw, Check, Sparkles, Plus,
  Layers, Package, AlertCircle, TrendingUp, Save, X, Printer
} from 'lucide-react';
import {
  db,
  ConeRecipe,
  RawIngredientRate,
  PackagingRate,
  DEFAULT_CONE_RECIPES,
  DEFAULT_RAW_INGREDIENT_RATES,
  DEFAULT_PACKAGING_RATES
} from '../../lib/db';
import { useModal } from '../../context/ModalContext';

export default function ProductionCostingSection() {
  const { showAlert } = useModal();
  const [recipes, setRecipes] = useState<ConeRecipe[]>([]);
  const [rawRates, setRawRates] = useState<RawIngredientRate[]>([]);
  const [pkgRates, setPkgRates] = useState<PackagingRate[]>([]);

  // Editing state for Recipes
  const [editingRecipe, setEditingRecipe] = useState<ConeRecipe | null>(null);
  const [editingRatesModal, setEditingRatesModal] = useState<boolean>(false);
  const [editingPkgModal, setEditingPkgModal] = useState<boolean>(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState<boolean>(false);

  // New Recipe Form
  const [newRecipeForm, setNewRecipeForm] = useState({
    label: '15g Cone',
    size: '15gm',
    batchYieldPcs: 240,
    powderG: 4.10,
    oilMl: 1.25,
    sugarG: 1.65,
    lemonMl: 1.25,
    xgG: 0.04,
    wastageBuffer: 1.00,
    recommendedPOSPreset: 14.50
  });

  const refresh = () => {
    setRecipes(db.getConeRecipes());
    setRawRates(db.getRawIngredientRates());
    setPkgRates(db.getPackagingRates());
  };

  useEffect(() => {
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const totalRawBatchCost = rawRates.reduce((sum, r) => sum + (r.batchCost || 0), 0);
  const directPackagingCost = pkgRates.reduce((sum, p) => sum + (p.costPerCone || 0), 0);

  // Save edited recipe
  const handleSaveRecipe = () => {
    if (!editingRecipe) return;
    // Recalculate raw material subtotal based on current ingredient costs
    const rawSubtotal = editingRecipe.ingredients.reduce((s, i) => s + (Number(i.cost) || 0), 0);
    const totalBase = Math.round((rawSubtotal + Number(editingRecipe.packagingCost) + Number(editingRecipe.wastageBuffer)) * 100) / 100;
    const preset = Number(editingRecipe.recommendedPOSPreset) || Math.round(totalBase * 10) / 10;

    db.updateConeRecipe(editingRecipe.id, {
      ...editingRecipe,
      rawMaterialSubtotal: Math.round(rawSubtotal * 100) / 100,
      totalBaseCost: totalBase,
      recommendedPOSPreset: preset,
    });

    setEditingRecipe(null);
    refresh();
    showAlert({
      type: 'success',
      title: 'Recipe Updated',
      message: `Updated formula for ${editingRecipe.label} successfully.`
    });
  };

  // Add custom cone size
  const handleAddCustomRecipe = () => {
    if (!newRecipeForm.label.trim()) return;

    // Rates lookup
    const powderRate = rawRates.find(r => r.name.toLowerCase().includes('powder'))?.costPerBaseUnit || 1.20;
    const oilRate = rawRates.find(r => r.name.toLowerCase().includes('oil'))?.costPerBaseUnit || 4.60;
    const sugarRate = rawRates.find(r => r.name.toLowerCase().includes('sugar'))?.costPerBaseUnit || 0.12;
    const lemonRate = rawRates.find(r => r.name.toLowerCase().includes('lemon'))?.costPerBaseUnit || 0.25;
    const xgRate = rawRates.find(r => r.name.toLowerCase().includes('xanthan'))?.costPerBaseUnit || 1.00;

    const ingredients = [
      { ingredientId: 'raw_powder', name: 'Mehendi Powder', amount: newRecipeForm.powderG, unit: 'gm', cost: Math.round(newRecipeForm.powderG * powderRate * 100) / 100 },
      { ingredientId: 'raw_oil', name: 'Eucalyptus Oil', amount: newRecipeForm.oilMl, unit: 'ml', cost: Math.round(newRecipeForm.oilMl * oilRate * 100) / 100 },
      { ingredientId: 'raw_sugar', name: 'Sugar', amount: newRecipeForm.sugarG, unit: 'gm', cost: Math.round(newRecipeForm.sugarG * sugarRate * 100) / 100 },
      { ingredientId: 'raw_lemon', name: 'Lemon Juice', amount: newRecipeForm.lemonMl, unit: 'ml', cost: Math.round(newRecipeForm.lemonMl * lemonRate * 100) / 100 },
      { ingredientId: 'raw_xg', name: 'Xanthan Gum (XG)', amount: newRecipeForm.xgG, unit: 'gm', cost: Math.round(newRecipeForm.xgG * xgRate * 100) / 100 },
    ];

    const rawSub = Math.round(ingredients.reduce((s, i) => s + i.cost, 0) * 100) / 100;
    const pkgCost = directPackagingCost;
    const baseCost = Math.round((rawSub + pkgCost + newRecipeForm.wastageBuffer) * 100) / 100;

    db.addConeRecipe({
      label: newRecipeForm.label,
      size: newRecipeForm.size,
      batchYieldPcs: Number(newRecipeForm.batchYieldPcs) || 150,
      ingredients,
      rawMaterialSubtotal: rawSub,
      packagingCost: pkgCost,
      wastageBuffer: newRecipeForm.wastageBuffer,
      totalBaseCost: baseCost,
      recommendedPOSPreset: Number(newRecipeForm.recommendedPOSPreset) || baseCost,
    });

    setShowAddRecipeModal(false);
    refresh();
    showAlert({
      type: 'success',
      title: 'Cone Recipe Added',
      message: `Added new ${newRecipeForm.label} to production configuration.`
    });
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (window.confirm('Reset all cone recipes and rates back to confidential master report defaults?')) {
      db.resetConeRecipesToDefault();
      refresh();
      showAlert({
        type: 'success',
        title: 'Formulas Reset',
        message: 'Reset all cone recipes and rates to official report specifications.'
      });
    }
  };

  // 1-click sync presets to products
  const handleSyncPresetsToProducts = () => {
    const products = db.getProducts();
    let updatedCount = 0;
    recipes.forEach(r => {
      products.forEach(p => {
        const pName = p.name.toLowerCase();
        const pSize = (p.size || '').toLowerCase();
        if (pSize.includes(r.size.toLowerCase()) || pName.includes(r.size.toLowerCase())) {
          db.updateProduct(p.id, { costPrice: r.recommendedPOSPreset });
          updatedCount++;
        }
      });
    });

    showAlert({
      type: 'success',
      title: 'POS Presets Synced',
      message: `Updated preset cost prices across ${updatedCount} products in catalog.`
    });
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER BANNER ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E8E0D4] p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#720000]/10 text-[#720000] border border-[#720000]/20">
                Official Production Formula
              </span>
              <span className="text-xs text-[#7A6B5D] font-mono">
                Batch Size: 1 Kg Powder
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#24201D] mt-1">
              HR GLOW & HENNA ROYALIN ART
            </h2>
            <p className="text-xs text-[#7A6B5D] mt-0.5">
              Comprehensive Production Cost & Pricing Breakdown Report · Scope: Raw Materials & Packaging
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddRecipeModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-95"
              style={{ background: '#720000' }}
            >
              <Plus size={14} /> Add Cone Size
            </button>
            <button
              onClick={handleSyncPresetsToProducts}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition border border-emerald-300"
            >
              <Sparkles size={14} className="text-emerald-600" /> Apply Presets to POS
            </button>
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#7A6B5D] bg-[#FAF8F3] hover:bg-[#F2ECE1] transition border border-[#E8E0D4]"
              title="Reset to Master Report Defaults"
            >
              <RotateCcw size={13} /> Defaults
            </button>
          </div>
        </div>
      </div>

      {/* ── 1. RAW INGREDIENTS BATCH COST (1 KG POWDER) ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#E8E0D4] flex items-center justify-between flex-wrap gap-2 bg-[#FAF8F3]/50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#720000]" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#24201D]">
              1. RAW INGREDIENTS BATCH COST (1 KG POWDER)
            </h3>
          </div>
          <button
            onClick={() => setEditingRatesModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#720000] hover:underline"
          >
            <Edit3 size={13} /> Edit Rates & Quantities
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
              <tr>
                <th className="py-3 px-4 sm:px-6">Ingredient Name</th>
                <th className="py-3 px-4">Batch Quantity</th>
                <th className="py-3 px-4">Unit Rate</th>
                <th className="py-3 px-4 sm:px-6 text-right">Batch Cost (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D4]">
              {rawRates.map((ing) => (
                <tr key={ing.id} className="hover:bg-[#FFFDF5] transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#24201D] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    {ing.name}
                  </td>
                  <td className="py-3 px-4 text-[#7A6B5D] tabular-nums">
                    {ing.batchQuantity.toLocaleString()} {ing.unit}
                  </td>
                  <td className="py-3 px-4 text-[#7A6B5D] font-mono">
                    {ing.unitRateDisplay}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right font-bold text-[#24201D] tabular-nums">
                    {ing.batchCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Tk
                  </td>
                </tr>
              ))}
              <tr className="bg-[#FAF8F3] font-bold border-t-2 border-[#E8E0D4]">
                <td colSpan={3} className="py-3.5 px-4 sm:px-6 text-[#24201D] font-serif">
                  Total Raw Material Cost Per Batch
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-right text-[#720000] text-sm tabular-nums">
                  {totalRawBatchCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Tk
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 2. PACKAGING MATERIAL UNIT COST BREAKDOWN ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#E8E0D4] flex items-center justify-between flex-wrap gap-2 bg-[#FAF8F3]/50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#720000]" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#24201D]">
              2. PACKAGING MATERIAL UNIT COST BREAKDOWN
            </h3>
          </div>
          <button
            onClick={() => setEditingPkgModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#720000] hover:underline"
          >
            <Edit3 size={13} /> Edit Packaging Prices
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
              <tr>
                <th className="py-3 px-4 sm:px-6">Packaging Material</th>
                <th className="py-3 px-4">Bulk Quantity & Purchase Price</th>
                <th className="py-3 px-4">Calculation</th>
                <th className="py-3 px-4 sm:px-6 text-right">Cost Per Cone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D4]">
              {pkgRates.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-[#FFFDF5] transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#24201D] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {pkg.name}
                  </td>
                  <td className="py-3 px-4 text-[#7A6B5D]">
                    {pkg.bulkQuantity}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#7A6B5D]">
                    {pkg.purchasePrice.toLocaleString()} ÷ {pkg.bulkPcs.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right font-bold text-[#24201D] tabular-nums">
                    {pkg.costPerCone.toFixed(2)} Tk
                  </td>
                </tr>
              ))}
              <tr className="bg-[#FAF8F3] font-bold border-t-2 border-[#E8E0D4]">
                <td colSpan={3} className="py-3.5 px-4 sm:px-6 text-[#24201D] font-serif">
                  Direct Packaging Cost Per Cone
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-right text-emerald-800 text-sm tabular-nums">
                  {directPackagingCost.toFixed(2)} Tk
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 3. SIZE-WISE PER CONE PRODUCTION BREAKDOWN ─────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#720000]" />
            <h3 className="font-serif font-bold text-base text-[#24201D]">
              3. SIZE-WISE PER CONE PRODUCTION BREAKDOWN
            </h3>
          </div>
          <span className="text-xs text-[#7A6B5D]">
            Editable formulas per cone size variant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border-2 border-[#E8E0D4] p-5 shadow-xs hover:border-[#720000]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-[#E8E0D4] mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-lg font-bold text-[#24201D]">
                        {r.label}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {r.batchYieldPcs} pcs/batch
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6B5D]">
                      Weight: {r.size}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingRecipe({ ...r })}
                    className="p-1.5 rounded-lg text-[#720000] hover:bg-red-50 transition"
                    title="Edit Cone Formula"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>

                {/* Per cone ingredient amounts & costs */}
                <div className="space-y-2 text-xs">
                  {r.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[#24201D]">
                      <span className="text-[#7A6B5D]">
                        {ing.name} ({ing.amount}{ing.unit})
                      </span>
                      <span className="font-bold tabular-nums">
                        {Number(ing.cost).toFixed(2)} Tk
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8E0D4] my-3 pt-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#24201D]">
                    <span>Raw Material Subtotal</span>
                    <span className="text-[#720000] tabular-nums">
                      {Number(r.rawMaterialSubtotal).toFixed(2)} Tk
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#7A6B5D]">
                    <span>Packaging (Cello+Pin+Logo)</span>
                    <span className="tabular-nums">{Number(r.packagingCost).toFixed(2)} Tk</span>
                  </div>
                  <div className="flex items-center justify-between text-[#7A6B5D]">
                    <span>Extra Wastage Buffer</span>
                    <span className="tabular-nums">{Number(r.wastageBuffer).toFixed(2)} Tk</span>
                  </div>
                </div>
              </div>

              {/* Total Base Cost and Recommended Preset */}
              <div className="border-t-2 border-dashed border-[#E8E0D4] pt-3 mt-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#24201D]">
                  <span>Total Base Cost</span>
                  <span className="text-base text-[#24201D] tabular-nums">
                    {Number(r.totalBaseCost).toFixed(2)} Tk
                  </span>
                </div>
                <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-600" /> POS Preset:
                  </span>
                  <span className="font-bold text-sm text-[#720000] tabular-nums font-mono">
                    {Number(r.recommendedPOSPreset).toFixed(2)} Tk
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. RECOMMENDED POS SOFTWARE PRESET ENTRY COSTS ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E8E0D4] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 bg-linear-to-r from-amber-50/80 via-white to-amber-50/40 border-b border-[#E8E0D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">💡</span>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#24201D]">
                Recommended POS Software Preset Entry Costs (Method 1)
              </h3>
              <p className="text-xs text-[#7A6B5D]">
                Exact entry cost to configure in POS terminal and product catalog for real-time order margin calculations
              </p>
            </div>
          </div>
          <button
            onClick={handleSyncPresetsToProducts}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-95 shrink-0"
            style={{ background: '#720000' }}
          >
            Apply to All Products
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Cone Variant</th>
                <th className="py-3.5 px-4">Raw Material Cost</th>
                <th className="py-3.5 px-4">Direct Packaging</th>
                <th className="py-3.5 px-4">Extra Buffer (Tape/Piping/Loss)</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Recommended POS Preset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D4]">
              {recipes.map((r) => (
                <tr key={r.id} className="hover:bg-[#FFFDF5] transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-[#24201D]">
                    {r.label}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#720000] tabular-nums">
                    {Number(r.rawMaterialSubtotal).toFixed(2)} Tk
                  </td>
                  <td className="py-3.5 px-4 text-[#7A6B5D] tabular-nums">
                    {Number(r.packagingCost).toFixed(2)} Tk
                  </td>
                  <td className="py-3.5 px-4 text-[#7A6B5D] tabular-nums">
                    {Number(r.wastageBuffer).toFixed(2)} Tk
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-bold text-base text-[#720000] tabular-nums">
                    <span className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200">
                      {Number(r.recommendedPOSPreset).toFixed(2)} Tk
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EDIT RECIPE MODAL ────────────────────────────────────────── */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#E8E0D4] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#24201D]">
                  Edit Formula: {editingRecipe.label}
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Adjust per-cone ingredient requirements and buffer
                </p>
              </div>
              <button
                onClick={() => setEditingRecipe(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Yield (pcs/batch)</label>
                <input
                  type="number"
                  className="form-input text-xs"
                  value={editingRecipe.batchYieldPcs}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, batchYieldPcs: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Extra Wastage Buffer (Tk)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input text-xs"
                  value={editingRecipe.wastageBuffer}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, wastageBuffer: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="form-label text-xs font-bold text-[#720000]">
                Ingredients Per Cone
              </label>
              {editingRecipe.ingredients.map((ing, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] grid grid-cols-12 gap-2 items-center text-xs">
                  <div className="col-span-5 font-bold text-[#24201D]">
                    {ing.name}
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      step="0.01"
                      className="form-input text-xs py-1"
                      value={ing.amount}
                      onChange={(e) => {
                        const newAmt = Number(e.target.value);
                        const rate = rawRates.find(r => r.name.toLowerCase().includes(ing.name.toLowerCase()))?.costPerBaseUnit || 1;
                        const newCost = Math.round(newAmt * rate * 100) / 100;
                        const newIngredients = [...editingRecipe.ingredients];
                        newIngredients[idx] = { ...ing, amount: newAmt, cost: newCost };
                        setEditingRecipe({ ...editingRecipe, ingredients: newIngredients });
                      }}
                    />
                  </div>
                  <div className="col-span-2 text-[#7A6B5D]">
                    {ing.unit}
                  </div>
                  <div className="col-span-2 text-right font-bold text-[#720000] tabular-nums">
                    {ing.cost} Tk
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Packaging Cost (Tk)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input text-xs"
                  value={editingRecipe.packagingCost}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, packagingCost: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label text-xs font-bold text-amber-900">Recommended POS Preset (Tk)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input text-xs font-bold text-[#720000]"
                  value={editingRecipe.recommendedPOSPreset}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, recommendedPOSPreset: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D4]">
              <button
                onClick={() => setEditingRecipe(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A6B5D] hover:bg-[#F2ECE1]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRecipe}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ background: '#720000' }}
              >
                Save Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD NEW CONE SIZE MODAL ────────────────────────────────────── */}
      {showAddRecipeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#E8E0D4] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#24201D]">
                  Add Custom Cone Variant
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Define per-cone grams, oils, packaging, and preset
                </p>
              </div>
              <button
                onClick={() => setShowAddRecipeModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Cone Name / Label *</label>
                <input
                  className="form-input text-xs"
                  placeholder="e.g. 15g Baby Cone"
                  value={newRecipeForm.label}
                  onChange={(e) => setNewRecipeForm({ ...newRecipeForm, label: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Size Key</label>
                <input
                  className="form-input text-xs"
                  placeholder="e.g. 15gm"
                  value={newRecipeForm.size}
                  onChange={(e) => setNewRecipeForm({ ...newRecipeForm, size: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="form-label text-xs font-bold text-[#720000]">
                Per Cone Ingredient Proportions
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#7A6B5D]">Powder (g)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input text-xs"
                    value={newRecipeForm.powderG}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, powderG: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#7A6B5D]">Eucalyptus Oil (ml)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input text-xs"
                    value={newRecipeForm.oilMl}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, oilMl: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#7A6B5D]">Sugar (g)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input text-xs"
                    value={newRecipeForm.sugarG}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, sugarG: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#7A6B5D]">Lemon Juice (ml)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input text-xs"
                    value={newRecipeForm.lemonMl}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, lemonMl: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#7A6B5D]">Xanthan Gum (g)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input text-xs"
                    value={newRecipeForm.xgG}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, xgG: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#7A6B5D]">Yield (pcs/batch)</label>
                  <input
                    type="number"
                    className="form-input text-xs"
                    value={newRecipeForm.batchYieldPcs}
                    onChange={(e) => setNewRecipeForm({ ...newRecipeForm, batchYieldPcs: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Extra Buffer (Tk)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input text-xs"
                  value={newRecipeForm.wastageBuffer}
                  onChange={(e) => setNewRecipeForm({ ...newRecipeForm, wastageBuffer: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label text-xs font-bold text-amber-900">Recommended POS Preset</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input text-xs font-bold text-[#720000]"
                  value={newRecipeForm.recommendedPOSPreset}
                  onChange={(e) => setNewRecipeForm({ ...newRecipeForm, recommendedPOSPreset: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D4]">
              <button
                onClick={() => setShowAddRecipeModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A6B5D] hover:bg-[#F2ECE1]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomRecipe}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ background: '#720000' }}
              >
                Create Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT 1KG BATCH RATES MODAL ────────────────────────────────────── */}
      {editingRatesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#E8E0D4] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#24201D]">
                  Edit Raw Ingredient Batch Rates (1 Kg Powder)
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Changes will update unit rates and material inventory costs
                </p>
              </div>
              <button
                onClick={() => setEditingRatesModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {rawRates.map((r, idx) => (
                <div key={r.id} className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#24201D]">
                    <span>{r.name}</span>
                    <span className="text-[#720000] tabular-nums">{r.batchCost} Tk</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#7A6B5D]">Cost per base unit ({r.unit})</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input text-xs py-1"
                        value={r.costPerBaseUnit}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const newCost = Math.round(val * r.batchQuantity * 100) / 100;
                          db.updateRawIngredientRate(r.id, {
                            costPerBaseUnit: val,
                            batchCost: newCost
                          });
                          refresh();
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#7A6B5D]">Batch Qty ({r.unit})</label>
                      <input
                        type="number"
                        className="form-input text-xs py-1"
                        value={r.batchQuantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const newCost = Math.round(val * r.costPerBaseUnit * 100) / 100;
                          db.updateRawIngredientRate(r.id, {
                            batchQuantity: val,
                            batchCost: newCost
                          });
                          refresh();
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E8E0D4]">
              <button
                onClick={() => setEditingRatesModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ background: '#720000' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT PACKAGING PRICES MODAL ────────────────────────────────────── */}
      {editingPkgModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#E8E0D4] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#24201D]">
                  Edit Packaging Unit Costs
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Bulk purchase price and pieces per bundle/box
                </p>
              </div>
              <button
                onClick={() => setEditingPkgModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {pkgRates.map((pkg) => (
                <div key={pkg.id} className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#24201D]">
                    <span>{pkg.name}</span>
                    <span className="text-emerald-800 tabular-nums">{pkg.costPerCone.toFixed(2)} Tk / cone</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#7A6B5D]">Bulk Purchase Price (Tk)</label>
                      <input
                        type="number"
                        className="form-input text-xs py-1"
                        value={pkg.purchasePrice}
                        onChange={(e) => {
                          const price = Number(e.target.value);
                          const perCone = pkg.bulkPcs > 0 ? Math.round((price / pkg.bulkPcs) * 100) / 100 : 0;
                          db.updatePackagingRate(pkg.id, {
                            purchasePrice: price,
                            costPerCone: perCone
                          });
                          refresh();
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#7A6B5D]">Bulk Pieces Count</label>
                      <input
                        type="number"
                        className="form-input text-xs py-1"
                        value={pkg.bulkPcs}
                        onChange={(e) => {
                          const pcs = Number(e.target.value);
                          const perCone = pcs > 0 ? Math.round((pkg.purchasePrice / pcs) * 100) / 100 : 0;
                          db.updatePackagingRate(pkg.id, {
                            bulkPcs: pcs,
                            costPerCone: perCone
                          });
                          refresh();
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E8E0D4]">
              <button
                onClick={() => setEditingPkgModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ background: '#720000' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
