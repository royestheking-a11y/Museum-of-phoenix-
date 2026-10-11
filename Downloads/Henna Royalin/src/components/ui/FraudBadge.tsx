import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Shield } from 'lucide-react';
import CustomerFraudModal from './CustomerFraudModal';

interface FraudBadgeProps {
  phone: string;
  customerName?: string;
  compact?: boolean;
}

export default function FraudBadge({ phone, customerName, compact = false }: FraudBadgeProps) {
  const [showModal, setShowModal] = useState(false);

  if (!phone || phone.length < 8) return null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        title="Check Steadfast Courier Fraud History & Delivery Rate"
        className={`inline-flex items-center gap-1 font-semibold transition-all cursor-pointer rounded-md ${
          compact
            ? 'p-1 text-slate-500 hover:text-[#720000] hover:bg-slate-100'
            : 'px-2 py-0.5 text-[10px] bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 border border-slate-200'
        }`}
      >
        <Shield size={compact ? 12 : 11} className="text-[#720000]" />
        {!compact && <span>Fraud Shield</span>}
      </button>

      {showModal && (
        <CustomerFraudModal
          initialPhone={phone}
          customerName={customerName}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
