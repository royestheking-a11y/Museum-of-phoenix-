import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, X, CheckCircle2, AlertCircle, Truck, Phone,
  User, MapPin, ShoppingBag, Plus, Minus, Trash2, ArrowRight,
  Copy, ShieldCheck, RefreshCw, Check
} from 'lucide-react';
import { db, Product, Order } from '../../lib/db';
import { parseAIOrderText, ParsedAIOrder } from '../../lib/aiOrderParser';
import { useModal } from '../../context/ModalContext';

interface AIOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newOrder: Order) => void;
}

export default function AIOrderModal({ isOpen, onClose, onSuccess }: AIOrderModalProps) {
  const { showAlert } = useModal();
  const products = useMemo(() => db.getProducts().filter(p => p.status === 'active'), []);

  // Raw text input from WhatsApp/FB/SMS
  const [rawText, setRawText] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Editable Form Fields (filled by AI parser)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cityZone, setCityZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [deliveryCharge, setDeliveryCharge] = useState(70);
  const [selectedItems, setSelectedItems] = useState<Array<{ product: Product; qty: number }>>([]);
  const [sendToSteadfast, setSendToSteadfast] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (COD)');
  const [orderNotes, setOrderNotes] = useState('');
  const [discount, setDiscount] = useState(0);

  // Demos
  const demoSamples = [
    {
      title: 'WhatsApp Message',
      text: `Name: Nusrat Jahan\nPhone: 01712345678\nAddress: House 14, Road 5, Block B, Dhanmondi, Dhaka\nNeed 5 pcs 25gm cone and 2 pcs bridal cone cash on delivery urgent`
    },
    {
      title: 'Facebook Order',
      text: `Customer: Amina Sultana\n01819234567\nFlat 4A, Road 2, Sector 11, Uttara, Dhaka\n20gm 10 ta cones please`
    },
    {
      title: 'Bengali Text',
      text: `নাম: ফারহানা হক\nফোন: ০১৯১১২২৩৩৪৪\nঠিকানা: বাসা ১২, রোড ৭, চকবাজার, চট্টগ্রাম\n২৫ গ্রাম কোন ৫ টা পাঠাবেন`
    }
  ];

  // Run parser on text change
  useEffect(() => {
    if (!rawText.trim()) return;

    const parsed = parseAIOrderText(rawText, products);
    if (parsed.customerName) setCustomerName(parsed.customerName);
    if (parsed.phone) setCustomerPhone(parsed.phone);
    if (parsed.address) setDeliveryAddress(parsed.address);
    if (parsed.cityZone === 'outside_dhaka') {
      setCityZone('outside_dhaka');
      setDeliveryCharge(130);
    } else {
      setCityZone('inside_dhaka');
      setDeliveryCharge(70);
    }
    if (parsed.notes) setOrderNotes(parsed.notes);

    // If detected products found and currently no items, auto-fill detected products
    if (parsed.detectedProducts.length > 0 && selectedItems.length === 0) {
      setSelectedItems(parsed.detectedProducts);
    }
  }, [rawText, products]);

  // If no items selected yet, default to first product (e.g. 25gm cone x 5)
  useEffect(() => {
    if (isOpen && selectedItems.length === 0 && products.length > 0) {
      const defaultProd = products.find(p => p.name.includes('25gm')) || products[0];
      if (defaultProd) {
        setSelectedItems([{ product: defaultProd, qty: 5 }]);
      }
    }
  }, [isOpen, products, selectedItems.length]);

  if (!isOpen) return null;

  const handleCityZoneChange = (zone: 'inside_dhaka' | 'outside_dhaka') => {
    setCityZone(zone);
    setDeliveryCharge(zone === 'inside_dhaka' ? 70 : 130);
  };

  const addItem = (product: Product) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateItemQty = (productId: string, delta: number) => {
    setSelectedItems(prev =>
      prev
        .map(i => i.product.id === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
        .filter(i => i.qty > 0)
    );
  };

  const removeItem = (productId: string) => {
    setSelectedItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const itemsTotal = selectedItems.reduce((sum, i) => sum + (i.product.sellingPrice * i.qty), 0);
  const finalTotal = Math.max(0, itemsTotal + deliveryCharge - discount);

  const handleConfirmOrder = () => {
    if (!customerName.trim()) {
      showAlert({
        type: 'warning',
        title: 'Customer Name Required',
        message: 'Please provide or verify the recipient customer name before confirming.'
      });
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 11) {
      showAlert({
        type: 'warning',
        title: 'Valid Phone Required',
        message: 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678).'
      });
      return;
    }
    if (!deliveryAddress.trim()) {
      showAlert({
        type: 'warning',
        title: 'Delivery Address Required',
        message: 'Please enter the delivery address for courier dispatch.'
      });
      return;
    }
    if (selectedItems.length === 0) {
      showAlert({
        type: 'warning',
        title: 'Products Required',
        message: 'Please select at least one mehendi cone or product to generate this order.'
      });
      return;
    }

    const newOrder = db.addPOSSale({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      city: cityZone === 'inside_dhaka' ? 'Dhaka' : 'Outside Dhaka',
      deliveryCharge,
      sendToSteadfast,
      items: selectedItems.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        qty: i.qty,
        price: i.product.sellingPrice,
        cost: i.product.costPrice || 6
      })),
      discount,
      paymentMethod,
      notes: orderNotes ? `[AI-Order] ${orderNotes}` : '[AI-Order] Smart auto-filled'
    });

    onSuccess?.(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8E0D4] flex flex-col">
        {/* Header with Sparkles Gradient */}
        <div
          className="p-5 text-white flex items-center justify-between sticky top-0 z-10"
          style={{
            background: 'linear-gradient(135deg, #720000 0%, #8B1A1A 100%)',
            borderBottom: '2px solid #D9A900'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#D9A900] flex items-center justify-center shadow-inner">
              <Sparkles size={22} className="text-[#F8E29B] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold tracking-wide">
                  AI Smart Order Autofill
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D9A900] text-[#720000] uppercase tracking-wider">
                  Fast Dispatch
                </span>
              </div>
              <p className="text-xs text-[#F5E6D3]">
                Paste messy WhatsApp or Facebook messages — Name, Phone & Address are auto-detected instantly!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* 1. Smart Paste Input Box */}
          <div className="rounded-2xl bg-[#FAF8F3] border-2 border-dashed border-[#D9A900] p-4 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#720000] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#D9A900]" />
                <span>Paste Customer Message / Order Details Here:</span>
              </label>
              {rawText && (
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  className="text-[11px] text-gray-500 hover:text-red-700 underline font-medium cursor-pointer"
                >
                  Clear text
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw text here... e.g.:&#10;Name: Nusrat Jahan&#10;Phone: 01712345678&#10;Address: Flat 4B, House 12, Road 7, Dhanmondi, Dhaka&#10;Need 5 pcs 25gm cones"
              className="w-full p-3 rounded-xl border border-[#E8E0D4] bg-white text-xs font-sans text-[#24201D] focus:outline-none focus:ring-2 focus:ring-[#720000] focus:border-transparent placeholder:text-gray-400 shadow-2xs"
            />

            {/* Quick Demo Test Buttons */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="text-[11px] font-bold text-[#7A6B5D]">Try Sample:</span>
              {demoSamples.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRawText(d.text)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-[#E8E0D4] hover:border-[#720000] hover:text-[#720000] text-gray-700 transition cursor-pointer shadow-2xs"
                >
                  {d.title}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Detected & Editable Customer Details */}
          <div className="rounded-2xl bg-white border border-[#E8E0D4] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D4] pb-2.5">
              <h3 className="font-serif text-sm font-bold text-[#24201D] flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-700" />
                <span>Verified Customer & Delivery Recipient Details</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 size={13} /> Auto-Filled by AI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Customer Name */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A6B5D] flex items-center gap-1 mb-1">
                  <User size={12} />
                  <span>Client Full Name</span>
                  {customerName && <CheckCircle2 size={12} className="text-emerald-600" />}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Nusrat Jahan"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E0D4] text-xs font-semibold text-[#24201D] focus:ring-1 focus:ring-[#720000]"
                />
              </div>

              {/* Customer Phone */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A6B5D] flex items-center gap-1 mb-1">
                  <Phone size={12} />
                  <span>Phone Number (11-Digit Mobile)</span>
                  {customerPhone.length === 11 && <CheckCircle2 size={12} className="text-emerald-600" />}
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E0D4] text-xs font-semibold font-mono text-[#24201D] focus:ring-1 focus:ring-[#720000]"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A6B5D] flex items-center gap-1 mb-1">
                <MapPin size={12} />
                <span>Full Delivery Address (House / Road / Area / District)</span>
                {deliveryAddress.length > 8 && <CheckCircle2 size={12} className="text-emerald-600" />}
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Flat 4B, House 12, Road 7, Dhanmondi, Dhaka"
                className="w-full px-3 py-2 rounded-xl border border-[#E8E0D4] text-xs font-semibold text-[#24201D] focus:ring-1 focus:ring-[#720000]"
              />
            </div>

            {/* City Zone & Delivery Charge Selector */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] font-bold uppercase text-[#7A6B5D]">Delivery Zone:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCityZoneChange('inside_dhaka')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cityZone === 'inside_dhaka'
                      ? 'bg-[#720000] text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Inside Dhaka (৳70)
                </button>
                <button
                  type="button"
                  onClick={() => handleCityZoneChange('outside_dhaka')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cityZone === 'outside_dhaka'
                      ? 'bg-[#720000] text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Outside Dhaka (৳130)
                </button>
              </div>
            </div>
          </div>

          {/* 3. Product Selection & Quantities */}
          <div className="rounded-2xl bg-white border border-[#E8E0D4] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D4] pb-2.5">
              <h3 className="font-serif text-sm font-bold text-[#24201D] flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#720000]" />
                <span>Select Products / Cones for this Order</span>
              </h3>
              <span className="text-xs font-bold text-[#720000]">
                Subtotal: ৳{itemsTotal.toLocaleString()}
              </span>
            </div>

            {/* Quick 1-Click Cone Addition Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[#7A6B5D]">Quick Add:</span>
              {products.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addItem(p)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold border border-[#E8E0D4] bg-[#FAF8F3] hover:bg-[#720000] hover:text-white hover:border-[#720000] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Plus size={12} />
                  <span>{p.name.replace('Henna Cone', 'Cone')} (৳{p.sellingPrice})</span>
                </button>
              ))}
            </div>

            {/* Selected Items Table */}
            <div className="divide-y divide-[#E8E0D4] border border-[#E8E0D4] rounded-xl overflow-hidden">
              {selectedItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400">
                  No products added yet. Click one of the quick add buttons above.
                </div>
              ) : (
                selectedItems.map((item) => (
                  <div key={item.product.id} className="p-3 flex items-center justify-between bg-white hover:bg-[#FFFDF5]">
                    <div>
                      <p className="text-xs font-bold text-[#24201D]">{item.product.name}</p>
                      <p className="text-[11px] text-[#7A6B5D]">৳{item.product.sellingPrice} each</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Qty controls */}
                      <div className="flex items-center border border-[#E8E0D4] rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateItemQty(item.product.id, -1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-[#24201D] tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItemQty(item.product.id, 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="w-16 text-right text-xs font-bold text-emerald-800 tabular-nums">
                        ৳{(item.product.sellingPrice * item.qty).toLocaleString()}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Steadfast Courier Toggle */}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-blue-700" />
                <div>
                  <p className="text-xs font-bold text-blue-950">
                    Dispatch to Steadfast Courier Immediately
                  </p>
                  <p className="text-[11px] text-blue-700">
                    Auto-creates Steadfast Tracking Code and registers Cash on Delivery (COD)
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={sendToSteadfast}
                onChange={(e) => setSendToSteadfast(e.target.checked)}
                className="w-4 h-4 accent-[#720000] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer with Total & Confirm Button */}
        <div className="p-4 sm:p-5 bg-[#FAF8F3] border-t border-[#E8E0D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky bottom-0 z-10">
          <div className="text-xs">
            <span className="text-[#7A6B5D]">Items Total: <strong>৳{itemsTotal.toLocaleString()}</strong> + Delivery: <strong>৳{deliveryCharge}</strong></span>
            <div className="text-base font-bold text-[#720000]">
              Total COD Amount: ৳{finalTotal.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E8E0D4] text-xs font-bold text-[#7A6B5D] hover:bg-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmOrder}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #720000 0%, #8B1A1A 100%)',
                border: '1px solid #D9A900'
              }}
            >
              <Sparkles size={15} className="text-[#F8E29B]" />
              <span>Confirm & Dispatch AI Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
