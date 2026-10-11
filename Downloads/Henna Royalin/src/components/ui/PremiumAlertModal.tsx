import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, CheckCircle2, AlertTriangle, AlertCircle, Info,
  Truck, Copy, Check, Printer, X, ShoppingBag, MapPin,
  Phone, User, ArrowRight, ShieldCheck, CornerDownLeft
} from 'lucide-react';

export interface OrderSuccessData {
  orderId: string;
  trackingCode?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  total: number;
  deliveryCharge?: number;
  deliveryStatus?: string;
  steadfastStatus?: string;
  paymentMethod?: string;
  itemCount?: number;
}

export interface PremiumAlertProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'warning' | 'error' | 'info' | 'order_success';
  title: string;
  message?: string;
  orderData?: OrderSuccessData | null;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onSecondaryAction?: () => void;
  onPrintAction?: () => void;
  isConfirm?: boolean;
  onConfirm?: () => void;
  isPrompt?: boolean;
  defaultValue?: string;
  promptPlaceholder?: string;
  quickOptions?: string[];
  onConfirmPrompt?: (value: string) => void;
}

export default function PremiumAlertModal({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  orderData,
  primaryButtonText = 'Done / Continue',
  secondaryButtonText,
  onSecondaryAction,
  onPrintAction,
  isConfirm = false,
  onConfirm,
  isPrompt = false,
  defaultValue = '',
  promptPlaceholder = 'Type your response here...',
  quickOptions,
  onConfirmPrompt,
}: PremiumAlertProps) {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [promptInput, setPromptInput] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCopiedTracking(false);
      setPromptInput(defaultValue || '');
      if (isPrompt) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen, defaultValue, isPrompt]);

  if (!isOpen) return null;

  const handleCopyTracking = () => {
    if (!orderData?.trackingCode) return;
    navigator.clipboard.writeText(orderData.trackingCode);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  const handlePrimaryClick = () => {
    if (isPrompt) {
      if (onConfirmPrompt) {
        onConfirmPrompt(promptInput.trim());
      } else {
        onClose();
      }
      return;
    }

    if (isConfirm) {
      if (onConfirm) {
        onConfirm();
      } else {
        onClose();
      }
      return;
    }

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isPrompt) {
      e.preventDefault();
      handlePrimaryClick();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const isOrderSuccess = type === 'order_success' || Boolean(orderData);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8E0D4] animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Luxury Branded Header */}
        <div
          className="p-5 text-white flex items-center justify-between relative overflow-hidden"
          style={{
            background: type === 'error'
              ? 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)'
              : type === 'warning'
              ? 'linear-gradient(135deg, #B45309 0%, #92400E 100%)'
              : 'linear-gradient(135deg, #720000 0%, #8B1A1A 100%)',
            borderBottom: '2px solid #D9A900'
          }}
        >
          {/* Gold ambient glow background */}
          <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-[#D9A900]/20 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-[#D9A900] flex items-center justify-center shadow-inner shrink-0">
              {type === 'error' ? (
                <AlertCircle size={24} className="text-red-300" />
              ) : type === 'warning' ? (
                <AlertTriangle size={24} className="text-amber-300" />
              ) : isOrderSuccess ? (
                <Sparkles size={24} className="text-[#F8E29B] animate-pulse" />
              ) : (
                <CheckCircle2 size={24} className="text-emerald-300" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F8E29B] block">
                HENNA ROYALIN LUXURY STUDIO
              </span>
              <h3 className="font-serif text-lg font-bold text-white leading-tight">
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer relative z-10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs font-sans text-[#24201D]">
          {/* General explanatory text */}
          {message && (
            <p className="text-xs text-[#524438] leading-relaxed whitespace-pre-line font-medium">
              {message}
            </p>
          )}

          {/* Order Success details card */}
          {orderData && (
            <div className="space-y-3">
              {/* Reference & Tracking Banner */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-[#720000]" />
                    <span className="text-xs font-bold text-[#24201D]">Order Reference:</span>
                  </div>
                  <span className="font-mono font-extrabold text-[#720000] text-sm bg-red-100/70 px-2.5 py-0.5 rounded-lg border border-red-200">
                    {orderData.orderId}
                  </span>
                </div>

                {/* Steadfast Tracking Code Card */}
                {orderData.trackingCode && (
                  <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Truck size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-blue-900 block tracking-wider">
                          Steadfast Tracking Code
                        </span>
                        <span className="font-mono font-bold text-sm text-blue-950">
                          {orderData.trackingCode}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyTracking}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer ${
                        copiedTracking
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-blue-900 hover:bg-blue-100 border border-blue-300'
                      }`}
                    >
                      {copiedTracking ? (
                        <>
                          <Check size={12} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Customer & Address Details Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8E0D4] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#F0EBE3]">
                  <span className="text-[#7A6B5D] flex items-center gap-1.5">
                    <User size={13} className="text-[#720000]" /> Customer Name:
                  </span>
                  <span className="font-bold text-[#24201D] text-right">
                    {orderData.customerName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#F0EBE3]">
                  <span className="text-[#7A6B5D] flex items-center gap-1.5">
                    <Phone size={13} className="text-[#720000]" /> Phone Number:
                  </span>
                  <span className="font-mono font-bold text-[#24201D] text-right">
                    {orderData.customerPhone}
                  </span>
                </div>

                {orderData.deliveryAddress && (
                  <div className="flex items-start justify-between text-xs pb-1.5 border-b border-[#F0EBE3] gap-2">
                    <span className="text-[#7A6B5D] flex items-center gap-1.5 shrink-0">
                      <MapPin size={13} className="text-[#720000]" /> Delivery Address:
                    </span>
                    <span className="font-medium text-[#24201D] text-right line-clamp-2">
                      {orderData.deliveryAddress}
                    </span>
                  </div>
                )}

                {/* Total Payable / COD */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#7A6B5D] block">
                      Total COD Amount to Collect
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck size={12} /> Stock Deducted & Recorded
                    </span>
                  </div>
                  <span className="font-serif text-2xl font-extrabold text-[#720000] tabular-nums">
                    ৳{orderData.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Prompt Mode: Interactive Input with Quick chips */}
          {isPrompt && (
            <div className="space-y-3 pt-1">
              {quickOptions && quickOptions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6B5D] block">
                    Quick Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPromptInput(opt)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                          promptInput === opt
                            ? 'bg-[#720000] text-white border-[#720000]'
                            : 'bg-[#FAF8F3] text-[#524438] border-[#E8E0D4] hover:bg-[#F3EFEA]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={promptPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E0D4] bg-[#FAF8F3] text-xs text-[#24201D] placeholder:text-[#9E8E7E] focus:outline-none focus:border-[#720000] focus:ring-2 focus:ring-[#D9A900]/40 transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#A89A8C] flex items-center gap-0.5">
                  <span>Enter</span>
                  <CornerDownLeft size={10} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-[#FAF8F3] border-t border-[#E8E0D4] flex items-center justify-end gap-2.5">
          {(secondaryButtonText || isConfirm || isPrompt || onSecondaryAction) && (
            <button
              type="button"
              onClick={onSecondaryAction || onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E8E0D4] text-xs font-bold text-[#7A6B5D] hover:bg-white transition cursor-pointer"
            >
              {secondaryButtonText || 'Cancel'}
            </button>
          )}

          {onPrintAction && (
            <button
              type="button"
              onClick={onPrintAction}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-[#24201D] hover:bg-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrimaryClick}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            style={{
              background: type === 'error'
                ? 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)'
                : 'linear-gradient(135deg, #720000 0%, #8B1A1A 100%)',
              border: '1px solid #D9A900'
            }}
          >
            <span>{primaryButtonText}</span>
            <ArrowRight size={14} className="text-[#F8E29B]" />
          </button>
        </div>
      </div>
    </div>
  );
}
