import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, Search, X, CheckCircle2,
  Phone, User, Package, RotateCcw, AlertOctagon, RefreshCw, ExternalLink
} from 'lucide-react';
import { checkCustomerFraud, CustomerRiskAssessment } from '../../lib/steadfast';

interface CustomerFraudModalProps {
  initialPhone?: string;
  customerName?: string;
  onClose: () => void;
}

export default function CustomerFraudModal({
  initialPhone = '',
  customerName,
  onClose
}: CustomerFraudModalProps) {
  const [phoneInput, setPhoneInput] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CustomerRiskAssessment | null>(null);

  const runAudit = async (targetPhone: string) => {
    if (!targetPhone.trim()) return;
    setLoading(true);
    try {
      const res = await checkCustomerFraud(targetPhone.trim());
      setResult(res);
    } catch {
      // Handled in checkCustomerFraud
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPhone) {
      runAudit(initialPhone);
    }
  }, [initialPhone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] w-full max-w-xl overflow-hidden border border-[#E8E0D4] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#720000] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#D9A900]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base leading-tight">Steadfast Fake Customer Shield</h2>
              <p className="text-[11px] text-white/80 mt-0.5">National Courier Fraud & Return History Detector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Search Bar */}
          <div>
            <label className="block text-xs font-bold text-[#24201D] mb-1.5">
              Enter Customer Phone Number to Audit:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6B5D]" />
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runAudit(phoneInput)}
                  placeholder="e.g. 01711000000 or 018..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E8E0D4] text-sm font-mono focus:outline-none focus:border-[#720000] focus:ring-1 focus:ring-[#720000]"
                />
              </div>
              <button
                onClick={() => runAudit(phoneInput)}
                disabled={loading || !phoneInput.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#720000] hover:bg-[#590000] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                Audit
              </button>
            </div>
            {customerName && (
              <p className="text-[11px] text-[#7A6B5D] mt-1.5 flex items-center gap-1">
                <User size={12} /> Checking for customer: <strong className="text-[#24201D]">{customerName}</strong>
              </p>
            )}
          </div>

          {/* Result Card */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full border-3 border-[#720000]/20 border-t-[#720000] animate-spin mb-3" />
              <p className="text-xs font-bold text-[#24201D]">Querying Steadfast National Fraud Database...</p>
              <p className="text-[11px] text-[#7A6B5D] mt-1">Analyzing delivery rates, returns, and merchant fraud reports</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              
              {/* Risk Alert Header */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                  result.riskLevel === 'high_risk'
                    ? 'bg-red-50 border-red-200 text-red-950'
                    : result.riskLevel === 'caution'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {result.riskLevel === 'high_risk' ? (
                    <AlertOctagon size={24} className="text-red-600" />
                  ) : result.riskLevel === 'caution' ? (
                    <AlertTriangle size={24} className="text-amber-600" />
                  ) : (
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                        result.riskLevel === 'high_risk'
                          ? 'bg-red-200 text-red-900'
                          : result.riskLevel === 'caution'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {result.badgeText}
                    </span>
                    <span className="text-[11px] font-mono text-[#7A6B5D]">Phone: {result.phone}</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">{result.summary}</p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] text-center">
                  <p className="text-[10px] uppercase font-bold text-[#7A6B5D] mb-0.5">Delivery Rate</p>
                  <p className="text-lg font-black text-emerald-800 tabular-nums">
                    {result.deliveryRatio !== null ? `${result.deliveryRatio}%` : 'New'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] text-center">
                  <p className="text-[10px] uppercase font-bold text-[#7A6B5D] mb-0.5">Return Rate</p>
                  <p className={`text-lg font-black tabular-nums ${(result.returnRatio || 0) > 30 ? 'text-red-600' : 'text-[#24201D]'}`}>
                    {result.returnRatio !== null ? `${result.returnRatio}%` : '0%'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] text-center">
                  <p className="text-[10px] uppercase font-bold text-[#7A6B5D] mb-0.5">Fraud Reports</p>
                  <p className={`text-lg font-black tabular-nums ${result.totalReports > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {result.totalReports}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] text-center">
                  <p className="text-[10px] uppercase font-bold text-[#7A6B5D] mb-0.5">Activity Band</p>
                  <p className="text-lg font-black text-[#24201D] capitalize">
                    {result.volumeBand || 'New'}
                  </p>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#720000] mb-1">
                  Dispatch Recommendation for Henna Royalin:
                </p>
                <p className="text-xs text-[#24201D] leading-relaxed font-medium">
                  {result.advice}
                </p>
              </div>

            </div>
          ) : null}

          {/* Informational Footer */}
          <div className="text-[11px] text-[#7A6B5D] bg-[#F5F0E8]/50 p-3 rounded-xl flex items-center justify-between gap-2">
            <span>Powered by Steadfast Courier National Fraud Prevention API</span>
            <span className="font-semibold text-emerald-800">Live API Verified</span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF8F3] border-t border-[#E8E0D4] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl border border-[#E8E0D4] text-[#7A6B5D] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
