import { useState } from 'react';
import { Store, Plus, Minus, Trash2, CheckCircle2, Receipt, X, Sparkles, User, ShoppingBag, CreditCard, Printer } from 'lucide-react';
import { db, Product, Service } from '../../lib/db';

interface StudioPOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function StudioPOSModal({ isOpen, onClose, onSuccess }: StudioPOSModalProps) {
  const products = db.getProducts().filter(p => p.status === 'active');
  const services = db.getServices().filter(s => s.status === 'active');
  const customers = db.getCustomers();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [cartItems, setCartItems] = useState<Array<{ product: Product; qty: number }>>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [receiptData, setReceiptData] = useState<any>(null);

  if (!isOpen) return null;

  const selectedService = services.find(s => s.id === selectedServiceId);

  const addProductToCart = (p: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === p.id);
      if (existing) {
        return prev.map(item => item.product.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product: p, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean) as Array<{ product: Product; qty: number }>);
  };

  const removeCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const itemsSubtotal = cartItems.reduce((s, i) => s + (i.product.sellingPrice * i.qty), 0);
  const servicePrice = selectedService?.price || 0;
  const subtotal = itemsSubtotal + servicePrice;
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = () => {
    if (cartItems.length === 0 && !selectedService) {
      alert('Please add at least one product or select a service');
      return;
    }

    const order = db.addPOSSale({
      customerName: customerName || 'Walk-in Client',
      customerPhone: customerPhone || '01700-000000',
      items: cartItems.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        qty: i.qty,
        price: i.product.sellingPrice,
        cost: i.product.costPrice
      })),
      serviceId: selectedService?.id,
      serviceName: selectedService?.name,
      servicePrice,
      discount,
      paymentMethod
    });

    setReceiptData({
      orderId: order.orderId,
      customerName: customerName || 'Walk-in Client',
      customerPhone: customerPhone || 'Walk-in',
      date: new Date().toLocaleDateString('en-BD', { dateStyle: 'medium', timeStyle: 'short' } as any),
      items: cartItems,
      service: selectedService,
      subtotal,
      discount,
      total,
      paymentMethod
    });

    if (onSuccess) onSuccess();
  };

  const resetPOS = () => {
    setCustomerName('');
    setCustomerPhone('');
    setSelectedServiceId('');
    setCartItems([]);
    setDiscount(0);
    setReceiptData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" style={{ background: 'rgba(36,32,29,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#E8E0D4]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E0D4] flex items-center justify-between bg-linear-to-r from-[#5A0000] to-[#720000] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-[#D9A900]/40">
              <Store size={20} className="text-[#D9A900]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">Studio Walk-in POS</h2>
              <p className="text-[11px] text-[#D9A900] tracking-wide uppercase">Hybrid Checkout (Products + Services)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        {receiptData ? (
          /* Receipt Screen */
          <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 mb-3 animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#24201D]">Sale Completed Successfully!</h3>
            <p className="text-xs text-[#7A6B5D] mb-6">Payment received and inventory updated.</p>

            {/* Printable Receipt Card */}
            <div className="w-full max-w-sm bg-[#FAF8F3] rounded-2xl p-5 border border-[#E8E0D4] shadow-sm text-left">
              <div className="text-center pb-3 border-b border-dashed border-[#C4B8B0]">
                <h4 className="font-serif font-bold text-lg text-[#720000]">Henna Royalin</h4>
                <p className="text-[11px] text-[#7A6B5D]">Dhaka & Narayanganj · Since 2019</p>
                <span className="inline-block mt-1 font-mono text-xs font-bold text-[#24201D] bg-white px-2 py-0.5 rounded border border-[#E8E0D4]">
                  {receiptData.orderId}
                </span>
              </div>

              <div className="py-3 text-xs space-y-1 text-[#7A6B5D] border-b border-dashed border-[#C4B8B0]">
                <div className="flex justify-between"><span>Customer:</span><span className="font-semibold text-[#24201D]">{receiptData.customerName}</span></div>
                <div className="flex justify-between"><span>Phone:</span><span className="text-[#24201D]">{receiptData.customerPhone}</span></div>
                <div className="flex justify-between"><span>Date:</span><span className="text-[#24201D]">{receiptData.date}</span></div>
                <div className="flex justify-between"><span>Method:</span><span className="font-bold text-[#166534]">{receiptData.paymentMethod}</span></div>
              </div>

              {/* Items */}
              <div className="py-3 text-xs space-y-1.5 border-b border-dashed border-[#C4B8B0]">
                {receiptData.items.map((i: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.product.name} × {i.qty}</span>
                    <span className="font-semibold text-[#24201D]">৳{(i.product.sellingPrice * i.qty).toLocaleString()}</span>
                  </div>
                ))}
                {receiptData.service && (
                  <div className="flex justify-between text-[#720000]">
                    <span className="font-semibold flex items-center gap-1"><Sparkles size={11} className="text-[#D9A900]" /> {receiptData.service.name}</span>
                    <span className="font-bold">৳{receiptData.service.price.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="pt-3 text-xs space-y-1">
                <div className="flex justify-between text-[#7A6B5D]"><span>Subtotal</span><span>৳{receiptData.subtotal.toLocaleString()}</span></div>
                {receiptData.discount > 0 && (
                  <div className="flex justify-between text-red-600"><span>Discount</span><span>-৳{receiptData.discount.toLocaleString()}</span></div>
                )}
                <div className="flex justify-between text-sm font-bold pt-1 border-t border-[#E8E0D4] text-[#720000]">
                  <span>Total Paid</span>
                  <span className="text-base">৳{receiptData.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 text-center text-[10px] text-[#9C8E84] border-t border-dashed border-[#C4B8B0]">
                Thank you for choosing Henna Royalin!
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[#720000] text-[#720000] flex items-center gap-2 hover:bg-[#FAF8F3]"
              >
                <Printer size={15} /> Print Receipt
              </button>
              <button
                onClick={resetPOS}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#720000] hover:bg-[#5A0000]"
              >
                New Walk-in Sale
              </button>
            </div>
          </div>
        ) : (
          /* POS Work Area */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Catalog Panel (Left) */}
            <div className="flex-1 p-5 overflow-y-auto border-r border-[#E8E0D4] space-y-5">
              {/* Client Info Quick Fill */}
              <div className="bg-[#FAF8F3] p-3.5 rounded-xl border border-[#E8E0D4]">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-[#720000]" />
                  <span className="text-xs font-bold text-[#24201D] uppercase">Client Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Customer Name (optional)"
                    className="form-input text-xs py-2 bg-white"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="Phone: 017XX-XXXXXX"
                    className="form-input text-xs py-2 bg-white"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#720000] flex items-center gap-1.5">
                    <Sparkles size={14} /> On-the-spot Service
                  </h3>
                  {selectedService && (
                    <button onClick={() => setSelectedServiceId('')} className="text-[11px] text-red-600 underline">Clear service</button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {services.map(s => {
                    const isSelected = selectedServiceId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedServiceId(isSelected ? '' : s.id)}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-[#720000] text-white border-[#720000] shadow-sm'
                            : 'bg-white text-[#24201D] border-[#E8E0D4] hover:bg-[#FAF8F3]'
                        }`}
                      >
                        <p className="font-bold text-xs truncate">{s.name}</p>
                        <p className={`text-[11px] font-semibold mt-1 ${isSelected ? 'text-[#D9A900]' : 'text-[#720000]'}`}>
                          ৳{s.price.toLocaleString()}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Catalog */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#720000] flex items-center gap-1.5 mb-2">
                  <ShoppingBag size={14} /> Retail Products (Cones & Tints)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {products.map(p => (
                    <button
                      key={p.id}
                      onClick={() => addProductToCart(p)}
                      className="p-3 rounded-xl bg-white border border-[#E8E0D4] text-left hover:border-[#720000] hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FAF8F3] text-[#7A6B5D] border border-[#E8E0D4]">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-[#166534] font-bold">In stock: {p.stock}</span>
                      </div>
                      <p className="font-bold text-xs mt-1.5 text-[#24201D] group-hover:text-[#720000] transition-colors">{p.name}</p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F0EBE3]">
                        <span className="text-xs font-extrabold text-[#720000]">৳{p.sellingPrice}</span>
                        <span className="w-5 h-5 rounded-full bg-[#720000]/10 text-[#720000] flex items-center justify-center text-xs font-bold group-hover:bg-[#720000] group-hover:text-white transition-colors">
                          +
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart & Payment Panel (Right) */}
            <div className="w-full md:w-80 p-5 bg-[#FAF8F3] flex flex-col justify-between overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#24201D] mb-3 flex items-center justify-between">
                  <span>Current Cart</span>
                  <span className="text-[11px] font-normal text-[#7A6B5D]">{cartItems.length} product(s)</span>
                </h3>

                {/* Cart list */}
                <div className="space-y-2 mb-4 max-h-56 overflow-y-auto">
                  {selectedService && (
                    <div className="p-2.5 rounded-xl bg-white border border-[#D9A900] flex items-center justify-between shadow-xs">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-bold text-[#720000] truncate flex items-center gap-1">
                          <Sparkles size={11} className="text-[#D9A900] shrink-0" />
                          <span>{selectedService.name}</span>
                        </p>
                        <p className="text-[10px] text-[#7A6B5D]">Service Appointment</p>
                      </div>
                      <span className="text-xs font-bold text-[#24201D]">৳{selectedService.price}</span>
                    </div>
                  )}

                  {cartItems.map(item => (
                    <div key={item.product.id} className="p-2.5 rounded-xl bg-white border border-[#E8E0D4] flex items-center justify-between shadow-xs">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-bold text-[#24201D] truncate">{item.product.name}</p>
                        <p className="text-[10px] text-[#7A6B5D]">৳{item.product.sellingPrice} each</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQty(item.product.id, -1)} className="p-1 rounded bg-[#FAF8F3] text-[#7A6B5D] hover:bg-gray-200">
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, 1)} className="p-1 rounded bg-[#FAF8F3] text-[#7A6B5D] hover:bg-gray-200">
                          <Plus size={11} />
                        </button>
                        <button onClick={() => removeCartItem(item.product.id)} className="p-1 text-red-500 hover:text-red-700 ml-1">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {cartItems.length === 0 && !selectedService && (
                    <div className="text-center py-8 text-xs text-[#B8A99A]">
                      Select a service or add products from the left to checkout.
                    </div>
                  )}
                </div>

                {/* Calculation */}
                <div className="space-y-2 pt-3 border-t border-[#E8E0D4]">
                  <div className="flex justify-between text-xs text-[#7A6B5D]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#24201D]">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#7A6B5D]">
                    <span>Discount (৳)</span>
                    <input
                      type="number"
                      min={0}
                      className="w-24 form-input py-1 px-2 text-right text-xs bg-white"
                      value={discount}
                      onChange={e => setDiscount(Math.max(0, +e.target.value))}
                    />
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#720000] pt-2 border-t border-[#E8E0D4]">
                    <span>Total Tender</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="mt-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6B5D] block mb-1.5">
                    Tender Payment
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Cash', 'bKash', 'Nagad', 'Card'].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                          paymentMethod === m
                            ? 'bg-[#720000] text-white border-[#720000]'
                            : 'bg-white text-[#24201D] border-[#E8E0D4] hover:bg-gray-100'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3">
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 && !selectedService}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#720000] hover:bg-[#5A0000] disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Receipt size={15} />
                  <span>Complete POS Sale (৳{total.toLocaleString()})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
