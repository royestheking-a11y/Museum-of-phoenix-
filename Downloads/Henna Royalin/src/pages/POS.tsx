import React, { useState, useEffect, useMemo } from 'react';
import {
  Store, ShoppingBag, Plus, Minus, Trash2, Search, Truck, CheckCircle2,
  Printer, X, CreditCard, Sparkles, User, MapPin, Phone, AlertTriangle,
  ArrowRight, ShieldCheck, Tag, RefreshCw, FileText
} from 'lucide-react';
import { db, Product, Customer, Order, formatDateTime } from '../lib/db';
import hennaLogo from '../imports/Henna_Royalin.png';
import AIOrderModal from '../components/ui/AIOrderModal';
import { parseAIOrderText } from '../lib/aiOrderParser';
import { useModal } from '../context/ModalContext';

interface POSProps {
  onNavigate?: (page: string) => void;
}

export default function POS({ onNavigate }: POSProps) {
  const { showAlert } = useModal();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentStaff] = useState(db.getCurrentStaff());

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Cart & Order State
  const [cart, setCart] = useState<Array<{ product: Product; qty: number }>>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cityZone, setCityZone] = useState<'inside_dhaka' | 'outside_dhaka' | 'pickup'>('inside_dhaka');
  const [sendToSteadfast, setSendToSteadfast] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (COD)');
  const [discount, setDiscount] = useState<number>(0);
  const [orderNotes, setOrderNotes] = useState('');

  // AI Order States
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isInlineAIPasteOpen, setIsInlineAIPasteOpen] = useState(false);
  const [inlineRawText, setInlineRawText] = useState('');
  const [aiDetectedToast, setAiDetectedToast] = useState<string | null>(null);

  // Post-checkout Receipt Modal
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleInlineAIPaste = (text: string) => {
    setInlineRawText(text);
    if (!text.trim()) return;
    const parsed = parseAIOrderText(text, products);
    if (parsed.customerName) setCustomerName(parsed.customerName);
    if (parsed.phone) setCustomerPhone(parsed.phone);
    if (parsed.address) setDeliveryAddress(parsed.address);
    if (parsed.cityZone) setCityZone(parsed.cityZone);
    if (parsed.notes) setOrderNotes(parsed.notes);

    if (parsed.detectedProducts.length > 0) {
      setCart(prev => {
        let next = [...prev];
        for (const dp of parsed.detectedProducts) {
          const exist = next.find(i => i.product.id === dp.product.id);
          if (exist) {
            next = next.map(i => i.product.id === dp.product.id ? { ...i, qty: dp.qty } : i);
          } else {
            next.push({ product: dp.product, qty: dp.qty });
          }
        }
        return next;
      });
    }
    setAiDetectedToast(`Auto-filled: ${parsed.customerName || 'Client'} · ${parsed.city || (parsed.cityZone === 'outside_dhaka' ? 'Outside Dhaka' : 'Dhaka')} (${parsed.cityZone === 'outside_dhaka' ? '৳130' : '৳70'})`);
  };

  useEffect(() => {
    refreshData();
    const unsub = db.subscribe(refreshData);
    return unsub;
  }, []);

  const refreshData = () => {
    setProducts(db.getProducts().filter(p => p.status === 'active'));
    setCustomers(db.getCustomers());
  };

  // Delivery charge calculation
  const deliveryCharge = useMemo(() => {
    if (cityZone === 'inside_dhaka') return 70;
    if (cityZone === 'outside_dhaka') return 130;
    return 0; // pickup
  }, [cityZone]);

  // Adjust Steadfast default if pickup
  const handleCityZoneChange = (zone: 'inside_dhaka' | 'outside_dhaka' | 'pickup') => {
    setCityZone(zone);
    if (zone === 'pickup') {
      setSendToSteadfast(false);
      setPaymentMethod('Cash');
    } else {
      setSendToSteadfast(true);
      setPaymentMethod('Cash on Delivery (COD)');
    }
  };

  // Quick Customer Autofill
  const handleSelectExistingCustomer = (phoneOrName: string) => {
    const found = customers.find(c => c.phone === phoneOrName || c.name.toLowerCase() === phoneOrName.toLowerCase());
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      if (found.address) setDeliveryAddress(found.address);
      if (found.city && found.city.toLowerCase().includes('dhaka')) {
        setCityZone('inside_dhaka');
      } else if (found.city) {
        setCityZone('outside_dhaka');
      }
    }
  };

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showAlert({
        type: 'warning',
        title: 'Product Out of Stock',
        message: `"${product.name}" currently has 0 units available in live inventory.`
      });
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          showAlert({
            type: 'warning',
            title: 'Stock Limit Reached',
            message: `Cannot add more than live stock balance (${product.stock} units available).`
          });
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const nextQty = item.qty + delta;
            if (nextQty > item.product.stock) {
              showAlert({
                type: 'warning',
                title: 'Stock Limit Reached',
                message: `Only ${item.product.stock} units available in live stock.`
              });
              return item;
            }
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as Array<{ product: Product; qty: number }>
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setOrderNotes('');
  };

  // Calculations — integer rounded (never decimal points)
  const itemsSubtotal = Math.round(cart.reduce((sum, item) => sum + item.product.sellingPrice * item.qty, 0));
  const grandTotal = Math.round(Math.max(0, itemsSubtotal + deliveryCharge - (discount || 0)));

  // Checkout submission
  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showAlert({
        type: 'warning',
        title: 'Empty Cart',
        message: 'Your cart is empty. Please add at least one product before proceeding.'
      });
      return;
    }
    if (sendToSteadfast && (!customerName || !customerPhone || !deliveryAddress)) {
      showAlert({
        type: 'warning',
        title: 'Courier Details Required',
        message: 'For Steadfast Courier automated delivery, Client Name, Phone Number, and Delivery Address are required.'
      });
      return;
    }

    const order = db.addPOSSale({
      customerName: customerName || 'Walk-in Client',
      customerPhone: customerPhone || '01700-000000',
      deliveryAddress: deliveryAddress || (cityZone === 'pickup' ? 'Studio Counter Pickup' : 'Dhaka'),
      city: cityZone === 'inside_dhaka' ? 'Dhaka' : cityZone === 'outside_dhaka' ? 'Outside Dhaka' : 'Studio Pickup',
      deliveryCharge: Math.round(deliveryCharge),
      sendToSteadfast,
      items: cart.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        qty: i.qty,
        price: Math.round(i.product.sellingPrice),
        cost: Math.round(i.product.costPrice || 0)
      })),
      discount: Math.round(discount || 0),
      paymentMethod,
      notes: orderNotes
    });

    setCompletedOrder(order);
    clearCart();
    refreshData();
  };

  // Categories list
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtered products
  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.size || '').toLowerCase().includes(q);
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-2 sm:p-5 max-w-[1600px] mx-auto space-y-4">
      {/* Top POS Header Bar */}
      <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#720000] text-white flex items-center justify-center font-bold shadow-xs">
            <Store size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#24201D]">
                Henna Royalin POS Terminal
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#720000]/10 text-[#720000] uppercase tracking-wider">
                Full-Page Studio
              </span>
            </div>
            <p className="text-xs text-[#7A6B5D]">
              Cashier / Staff: <strong className="text-[#24201D]">{currentStaff.name} ({currentStaff.role})</strong> · Direct Steadfast Courier Dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #720000 0%, #8B1A1A 100%)',
              border: '1px solid #D9A900',
              boxShadow: '0 2px 8px rgba(114,0,0,0.2)'
            }}
          >
            <Sparkles size={14} className="text-[#F8E29B] animate-pulse" />
            <span>AI Order (Paste)</span>
          </button>
          {onNavigate && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('orders')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#720000] bg-red-50 hover:bg-red-100 border border-red-200 transition"
              >
                <ShoppingBag size={13} /> View Orders
              </button>
              <button
                type="button"
                onClick={() => onNavigate('steadfast')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
              >
                <Truck size={13} /> Steadfast Hub
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Split Layout: Catalog on Left (7 cols), Order Form & Cart on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: PRODUCT CATALOG */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Tabs */}
          <div className="bg-white rounded-2xl border border-[#E8E0D4] p-3.5 shadow-xs space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6B5D] pointer-events-none" />
              <input
                type="text"
                placeholder="Search henna cones, bridal cones, gift sets, sizes (20gm, 25gm, 30gm)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.6rem' }}
                className="w-full pl-10! pr-4 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] bg-[#FAF8F3]"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap capitalize ${
                    categoryFilter === cat
                      ? 'bg-[#720000] text-white shadow-xs'
                      : 'bg-[#FAF8F3] text-[#7A6B5D] hover:text-[#24201D] border border-[#E8E0D4]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-[#7A6B5D] bg-white rounded-2xl border border-[#E8E0D4]">
                <ShoppingBag size={36} className="mx-auto mb-2 text-gray-300" />
                <p className="font-semibold text-sm">No products found</p>
                <p className="text-xs text-gray-400 mt-0.5">Add cone products in Inventory or produce batches in Production to start selling.</p>
              </div>
            ) : (
              filteredProducts.map(p => {
                const isLowStock = p.stock <= (p.lowStockLevel || 20);
                const isOutOfStock = p.stock <= 0;
                const inCart = cart.find(item => item.product.id === p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addToCart(p)}
                    className={`p-3.5 rounded-2xl bg-white border transition-all cursor-pointer select-none flex flex-col justify-between hover:shadow-md ${
                      inCart
                        ? 'border-[#720000] ring-1 ring-[#720000] bg-red-50/10'
                        : isOutOfStock
                        ? 'opacity-50 border-gray-200 cursor-not-allowed'
                        : 'border-[#E8E0D4] hover:border-[#720000]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-mono text-[10px] font-bold text-[#720000] bg-[#FAF8F3] px-1.5 py-0.5 rounded border border-[#E8E0D4]">
                          {p.sku}
                        </span>
                        {p.size && (
                          <span className="text-[10px] font-bold text-[#7A6B5D] bg-gray-100 px-1.5 py-0.5 rounded">
                            {p.size}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-xs text-[#24201D] leading-snug line-clamp-2 mt-1">
                        {p.name}
                      </h3>

                      {/* Stock indicator badge */}
                      <div className="mt-2 flex items-center gap-1 text-[11px]">
                        {isLowStock && !isOutOfStock && (
                          <AlertTriangle size={12} className="text-red-600 shrink-0" />
                        )}
                        <span
                          className={`font-bold tabular-nums ${
                            isOutOfStock
                              ? 'text-gray-400'
                              : isLowStock
                              ? 'text-red-600'
                              : 'text-emerald-800'
                          }`}
                        >
                          {isOutOfStock ? 'Out of stock' : `${p.stock} in stock`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#E8E0D4] flex items-center justify-between">
                      <span className="font-bold text-sm text-[#24201D] tabular-nums">
                        ৳{p.sellingPrice.toLocaleString()}
                      </span>
                      {inCart ? (
                        <span className="px-2 py-0.5 bg-[#720000] text-white text-[11px] font-bold rounded-lg shadow-2xs">
                          {inCart.qty} in cart
                        </span>
                      ) : (
                        <span className="w-6 h-6 rounded-lg bg-[#FAF8F3] border border-[#E8E0D4] text-[#720000] flex items-center justify-center font-bold hover:bg-[#720000] hover:text-white transition">
                          +
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER DETAILS, CART & STEADFAST DISPATCH */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleCompleteOrder} className="bg-white rounded-2xl border border-[#E8E0D4] shadow-sm overflow-hidden">
            {/* Form Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E0D4] bg-[#FAF8F3]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#720000] flex items-center justify-center">
                  <ShoppingBag size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-sm text-[#24201D] leading-tight">Order & Client Details</h2>
                  <p className="text-[10px] text-[#9B8B7E] font-medium">Fill in recipient & review cart</p>
                </div>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition"
                >
                  <Trash2 size={11} /> Clear Cart
                </button>
              )}
            </div>
            <div className="p-5 space-y-4">

            {/* ── Section 1: Recipient Info ── */}
            <div className="rounded-xl border border-[#E8E0D4] overflow-hidden">
              {/* Section header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAF8F3] border-b border-[#E8E0D4]">
                <span className="text-[11px] font-bold text-[#24201D] flex items-center gap-1.5 uppercase tracking-wide">
                  <User size={12} className="text-[#720000]" /> Recipient Information
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInlineAIPasteOpen(!isInlineAIPasteOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#720000] bg-white border border-[#D9A900] hover:bg-amber-50 transition cursor-pointer shadow-sm"
                  >
                    <Sparkles size={10} className="text-[#D9A900]" />
                    AI Autofill
                  </button>
                  <select
                    onChange={e => handleSelectExistingCustomer(e.target.value)}
                    className="text-[10px] rounded-lg border border-[#E8E0D4] bg-white px-2 py-1 text-[#7A6B5D] focus:outline-none focus:border-[#720000]"
                  >
                    <option value="">Saved Customers</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.phone}>{c.name} ({c.phone})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 space-y-3 bg-white">
                {/* Inline AI Quick-Paste Drawer */}
                {isInlineAIPasteOpen && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={10} className="text-amber-500" />
                        Paste WhatsApp / Facebook message
                      </span>
                      {aiDetectedToast && (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                          ✓ {aiDetectedToast}
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={inlineRawText}
                      onChange={(e) => handleInlineAIPaste(e.target.value)}
                      placeholder="Paste order message here — Name, Phone & Address fill automatically!"
                      className="w-full p-2.5 text-[11px] rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Try sample:</span>
                      <button type="button" onClick={() => handleInlineAIPaste('Name: Nusrat Jahan\nPhone: 01712345678\nAddress: House 14, Road 5, Dhanmondi, Dhaka\n5 pcs 25gm cone')} className="px-2 py-0.5 rounded-full text-[9px] bg-white border border-gray-200 text-gray-600 hover:border-amber-300 cursor-pointer transition">
                        WhatsApp
                      </button>
                      <button type="button" onClick={() => handleInlineAIPaste('Amina Sultana\n01819234567\nSector 11, Uttara, Dhaka\n10 ta 20gm cone')} className="px-2 py-0.5 rounded-full text-[9px] bg-white border border-gray-200 text-gray-600 hover:border-amber-300 cursor-pointer transition">
                        Facebook
                      </button>
                      <button type="button" onClick={() => handleInlineAIPaste('Farhana Akter\n01712998877\nZindabazar, Sylhet Sadar\n4 pcs 25gm cone')} className="px-2 py-0.5 rounded-full text-[9px] bg-white border border-gray-200 text-gray-600 hover:border-amber-300 cursor-pointer transition">
                        District / Outside Dhaka
                      </button>
                    </div>
                  </div>
                )}

                {/* Name & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-[#9B8B7E] uppercase tracking-wide block mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required={sendToSteadfast}
                      placeholder="e.g. Fatima Rahman"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8E0D4] bg-[#FAF8F3] focus:bg-white focus:outline-none focus:border-[#720000] transition font-medium text-[#24201D]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#9B8B7E] uppercase tracking-wide block mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required={sendToSteadfast}
                      placeholder="01711-XXXXXX"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8E0D4] bg-[#FAF8F3] focus:bg-white focus:outline-none focus:border-[#720000] transition font-medium text-[#24201D]"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-[10px] font-semibold text-[#9B8B7E] uppercase tracking-wide block mb-1">Delivery Address *</label>
                  <textarea
                    rows={2}
                    required={sendToSteadfast}
                    placeholder="Full road, house, area, and landmark for courier..."
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8E0D4] bg-[#FAF8F3] focus:bg-white focus:outline-none focus:border-[#720000] transition resize-none font-medium text-[#24201D]"
                  />
                </div>

                {/* Delivery Zone */}
                <div>
                  <label className="text-[10px] font-semibold text-[#9B8B7E] uppercase tracking-wide block mb-1.5">Delivery Zone</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { key: 'inside_dhaka', label: 'Dhaka', sub: '৳70' },
                      { key: 'outside_dhaka', label: 'Outside', sub: '৳130' },
                      { key: 'pickup', label: 'Pickup', sub: '৳0' },
                    ] as const).map(zone => (
                      <button
                        key={zone.key}
                        type="button"
                        onClick={() => handleCityZoneChange(zone.key)}
                        className={`py-2 px-1 rounded-lg text-center transition border-2 ${
                          cityZone === zone.key
                            ? 'bg-[#720000] text-white border-[#720000] shadow-sm'
                            : 'bg-white text-[#7A6B5D] border-[#E8E0D4] hover:border-[#720000]/40'
                        }`}
                      >
                        <p className="text-[11px] font-bold leading-tight">{zone.label}</p>
                        <p className={`text-[10px] font-semibold ${cityZone === zone.key ? 'text-red-200' : 'text-[#9B8B7E]'}`}>{zone.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Steadfast Checkbox */}
                {cityZone !== 'pickup' && (
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 cursor-pointer select-none hover:bg-blue-50/80 transition">
                    <input
                      type="checkbox"
                      checked={sendToSteadfast}
                      onChange={e => setSendToSteadfast(e.target.checked)}
                      className="mt-0.5 rounded text-[#720000] focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-[11px] text-blue-900 flex items-center gap-1.5">
                        <Truck size={11} /> Auto-Dispatch to Steadfast Courier
                      </p>
                      <p className="text-[10px] text-blue-600 mt-0.5">
                        Assigns Consignment ID & Tracking Code automatically.
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* ── Section 2: Cart Items ── */}
            <div className="rounded-xl border border-[#E8E0D4] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAF8F3] border-b border-[#E8E0D4]">
                <span className="text-[11px] font-bold text-[#24201D] uppercase tracking-wide">
                  Selected Items · {cart.reduce((s, i) => s + i.qty, 0)} pcs
                </span>
                <span className="text-[11px] font-semibold text-[#720000]">৳{itemsSubtotal.toLocaleString()}</span>
              </div>

              <div className="max-h-44 overflow-y-auto bg-white">
                {cart.length === 0 ? (
                  <div className="p-6 text-center text-[#9B8B7E] text-xs">
                    <ShoppingBag size={24} className="mx-auto mb-2 opacity-30" />
                    Cart is empty. Click a product from the left to add.
                  </div>
                ) : (
                  <div className="divide-y divide-[#F0EBE3]">
                  {cart.map(item => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between px-4 py-2.5 text-xs hover:bg-[#FAF8F3] transition"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-[#24201D] truncate">{item.product.name}</p>
                        <p className="text-[10px] text-[#9B8B7E]">
                          ৳{item.product.sellingPrice} each{item.product.size ? ` · ${item.product.size}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Qty controller */}
                        <div className="flex items-center border border-[#E8E0D4] rounded-lg overflow-hidden bg-[#FAF8F3]">
                          <button type="button" onClick={() => updateCartQty(item.product.id, -1)} className="px-2 py-1 hover:bg-[#E8E0D4] transition">
                            <Minus size={10} className="text-[#6B5E52]" />
                          </button>
                          <span className="px-2.5 font-bold tabular-nums text-xs text-[#24201D]">{item.qty}</span>
                          <button type="button" onClick={() => updateCartQty(item.product.id, 1)} className="px-2 py-1 hover:bg-[#E8E0D4] transition">
                            <Plus size={10} className="text-[#6B5E52]" />
                          </button>
                        </div>

                        <span className="font-bold text-[#24201D] tabular-nums w-14 text-right">
                          ৳{(item.product.sellingPrice * item.qty).toLocaleString()}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-[#C4B8AE] hover:text-red-500 rounded transition"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Section 3: Payment & Discount ── */}
            <div className="rounded-xl border border-[#E8E0D4] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#FAF8F3] border-b border-[#E8E0D4]">
                <span className="text-[11px] font-bold text-[#24201D] uppercase tracking-wide">Payment & Discount</span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 bg-white">
                <div>
                  <label className="text-[10px] font-semibold text-[#9B8B7E] uppercase tracking-wide block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8E0D4] bg-[#FAF8F3] focus:bg-white focus:outline-none focus:border-[#720000] font-semibold text-[#24201D] transition"
                  >
                    <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Cash">Studio Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#9B8B7E] uppercase tracking-wide block mb-1">Discount (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={discount || ''}
                    placeholder="0"
                    onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8E0D4] bg-[#FAF8F3] focus:bg-white focus:outline-none focus:border-[#720000] text-[#24201D] transition"
                  />
                </div>
              </div>
            </div>

            {/* ── Section 4: Order Summary ── */}
            <div className="rounded-xl border border-[#E8E0D4] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#FAF8F3] border-b border-[#E8E0D4]">
                <span className="text-[11px] font-bold text-[#24201D] uppercase tracking-wide">Order Summary</span>
              </div>
              <div className="p-4 bg-white space-y-2 text-xs">
                <div className="flex justify-between text-[#7A6B5D]">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#24201D] tabular-nums">৳{itemsSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7A6B5D]">
                  <span>Delivery ({cityZone === 'inside_dhaka' ? 'Inside Dhaka' : cityZone === 'outside_dhaka' ? 'Outside Dhaka' : 'Studio Pickup'})</span>
                  <span className="font-semibold text-[#24201D] tabular-nums">৳{deliveryCharge.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Discount</span>
                    <span className="tabular-nums">−৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 mt-1 border-t-2 border-[#E8E0D4]">
                  <div>
                    <p className="font-extrabold text-sm text-[#24201D]">
                      {sendToSteadfast ? 'COD Collection' : 'Grand Total'}
                    </p>
                    <p className="text-[10px] text-[#9B8B7E]">Inc. delivery charge</p>
                  </div>
                  <span className="font-extrabold text-2xl text-[#720000] tabular-nums">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* ── CTA Button ── */}
            <button
              type="submit"
              disabled={cart.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 ${
                cart.length === 0
                  ? 'opacity-40 cursor-not-allowed bg-gray-300'
                  : 'bg-[#720000] hover:bg-[#5a0000] shadow-lg hover:shadow-xl active:scale-[0.99] cursor-pointer'
              }`}
            >
              {sendToSteadfast ? (
                <><Truck size={16} /> Confirm & Dispatch to Steadfast · ৳{grandTotal.toLocaleString()}</>
              ) : (
                <><CheckCircle2 size={16} /> Complete POS Sale · ৳{grandTotal.toLocaleString()}</>
              )}
            </button>
          </div>
          </form>
        </div>
      </div>

      {/* SUCCESS RECEIPT / INVOICE MODAL */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E8E0D4] overflow-hidden">
            <div className="px-6 py-3 bg-[#FAF8F3] flex items-center justify-between border-b border-[#E8E0D4] print:hidden">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 size={16} /> Order Created & Stock Deducted!
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#720000] hover:bg-[#5a0000]"
                >
                  <Printer size={13} /> Print Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setCompletedOrder(null)}
                  className="p-1 rounded-lg hover:bg-gray-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Receipt Content */}
            <div className="p-6 space-y-4 text-xs text-[#24201D] bg-white">
              <div className="text-center border-b border-[#E8E0D4] pb-4">
                <img src={hennaLogo} alt="Henna Royalin" className="h-10 mx-auto object-contain mb-1" />
                <h2 className="font-serif font-bold text-base text-[#720000]">Henna Royalin Official Invoice</h2>
                <p className="text-[10px] text-[#7A6B5D]">100% Organic Rajasthani Henna Cones · Dhaka, Bangladesh</p>
                <p className="text-[10px] text-[#7A6B5D] font-mono mt-0.5">Invoice #{completedOrder.orderId} · {formatDateTime(completedOrder.createdAt)}</p>
              </div>

              {/* Steadfast Courier Tracking Barcode Badge */}
              {completedOrder.steadfastTrackingCode && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">
                    Steadfast Courier Consignment
                  </span>
                  <p className="font-mono font-extrabold text-sm text-[#720000]">
                    {completedOrder.steadfastTrackingCode}
                  </p>
                  <p className="text-[10px] text-blue-700 mt-0.5">
                    Consignment ID: {completedOrder.steadfastConsignmentId} · Status: In Transit
                  </p>
                </div>
              )}

              {/* Customer & Delivery Information */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] text-[11px]">
                <div>
                  <span className="text-[#7A6B5D] block text-[10px] uppercase font-bold">Client Name</span>
                  <p className="font-bold text-[#24201D]">{completedOrder.customerName}</p>
                  <p className="text-[#7A6B5D]">{completedOrder.customerPhone}</p>
                </div>
                <div>
                  <span className="text-[#7A6B5D] block text-[10px] uppercase font-bold">Delivery Address</span>
                  <p className="font-medium text-[#24201D] line-clamp-2">{completedOrder.deliveryAddress}</p>
                  <p className="text-[#7A6B5D]">{completedOrder.city}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-[#E8E0D4] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold border-b border-[#E8E0D4]">
                    <tr>
                      <th className="py-2 px-3">Item</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Price</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D4]">
                    {completedOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-semibold">{it.productName}</td>
                        <td className="py-2 px-3 text-center font-bold">{it.quantity}</td>
                        <td className="py-2 px-3 text-right tabular-nums">৳{it.price}</td>
                        <td className="py-2 px-3 text-right tabular-nums font-bold">৳{it.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#FAF8F3] border-t border-[#E8E0D4]">
                    <tr>
                      <td colSpan={3} className="py-1 px-3 text-right text-[#7A6B5D]">Delivery Fee:</td>
                      <td className="py-1 px-3 text-right font-semibold">৳{completedOrder.deliveryCharge}</td>
                    </tr>
                    {completedOrder.discount > 0 && (
                      <tr>
                        <td colSpan={3} className="py-1 px-3 text-right text-red-600">Discount:</td>
                        <td className="py-1 px-3 text-right font-semibold text-red-600">-৳{completedOrder.discount}</td>
                      </tr>
                    )}
                    <tr className="border-t border-[#720000] font-bold">
                      <td colSpan={3} className="py-2 px-3 text-right text-sm text-[#720000]">
                        {completedOrder.steadfastTrackingCode ? 'COD Amount to Collect:' : 'Grand Total:'}
                      </td>
                      <td className="py-2 px-3 text-right text-sm text-[#720000] tabular-nums font-extrabold">
                        ৳{completedOrder.total.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-center pt-2 text-[10px] text-[#7A6B5D]">
                <p>Thank you for choosing Henna Royalin! Keep henna paste stored in a cool place.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E0D4] print:hidden">
                <button
                  type="button"
                  onClick={() => setCompletedOrder(null)}
                  className="w-full py-2 bg-[#720000] text-white rounded-xl font-bold text-xs"
                >
                  Start Next Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Order Modal */}
      {isAIModalOpen && (
        <AIOrderModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onSuccess={(newOrder) => {
            setCompletedOrder(newOrder);
          }}
        />
      )}
    </div>
  );
}
