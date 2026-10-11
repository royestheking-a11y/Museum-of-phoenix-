import { useState, useEffect } from 'react';
import {
  ShoppingBag, Plus, Search, Eye, Check, X, Clock, Package,
  Truck, CheckCircle2, RotateCcw, AlertTriangle, AlertCircle,
  Copy, ExternalLink, Send, MapPin, Phone, ShieldAlert, ArrowRight,
  Sparkles, FileText, Printer, Trash2
} from 'lucide-react';
import { db, Order, Product, Customer, formatDateTime } from '../lib/db';
import AIOrderModal from '../components/ui/AIOrderModal';
import { parseAIOrderText } from '../lib/aiOrderParser';
import { useModal } from '../context/ModalContext';
import { dispatchOrderToSteadfastAPI } from '../lib/steadfast';
import FraudBadge from '../components/ui/FraudBadge';
import OrderInvoiceModal from '../components/ui/OrderInvoiceModal';

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  ready: 'bg-orange-50 text-orange-700 border-orange-200',
  shipped: 'bg-amber-50 text-amber-800 border-amber-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  returned: 'bg-gray-100 text-gray-600 border-gray-200',
  failed: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
};

const paymentColors: Record<string, string> = {
  paid: 'bg-green-50 text-green-700 border-green-200',
  partial: 'bg-amber-50 text-amber-800 border-amber-200',
  pending: 'bg-orange-50 text-orange-700 border-orange-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  refunded: 'bg-gray-100 text-gray-600 border-gray-200',
};

function StatusPill({ status, colors }: { status: string | undefined; colors: Record<string, string> }) {
  const cls = (status && colors[status]) || 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${cls}`}
    >
      {status === 'failed' ? (
        <>
          <AlertCircle size={12} className="text-rose-600 shrink-0" />
          <span>Failed</span>
        </>
      ) : (
        status?.replace(/_/g, ' ') ?? '—'
      )}
    </span>
  );
}

// ─── New Order Form ────────────────────────────────────────────────────────
interface NewOrderFormProps {
  onClose: () => void;
  onSave: () => void;
}

function NewOrderForm({ onClose, onSave }: NewOrderFormProps) {
  const { showAlert, showConfirm, showOrderSuccess } = useModal();
  const products = db.getProducts();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [source, setSource] = useState('WhatsApp');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [discount, setDiscount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(70);
  const [aiQuickText, setAiQuickText] = useState('');
  const [aiDetectedMsg, setAiDetectedMsg] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{ productId: string; qty: number; price: number; cost: number }>>([
    { productId: products[0]?.id || '', qty: 5, price: products[0]?.sellingPrice || 100, cost: products[0]?.costPrice || 6 }
  ]);

  const [cityZone, setCityZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');

  const handleApplyAIPaste = (text: string) => {
    setAiQuickText(text);
    if (!text.trim()) return;
    const parsed = parseAIOrderText(text, products);
    if (parsed.customerName) setCustomerName(parsed.customerName);
    if (parsed.phone) setCustomerPhone(parsed.phone);
    if (parsed.address) setDeliveryAddress(parsed.address);
    if (parsed.city) setCity(parsed.city);
    // Auto-set delivery zone & charge based on detected district
    setCityZone(parsed.cityZone === 'pickup' ? 'inside_dhaka' : parsed.cityZone);
    setDeliveryCharge(parsed.deliveryCharge);
    if (parsed.detectedProducts.length > 0) {
      setItems(parsed.detectedProducts.map(dp => ({
        productId: dp.product.id,
        qty: dp.qty,
        price: dp.product.sellingPrice,
        cost: dp.product.costPrice || 6
      })));
    }
    const zoneLabel = parsed.cityZone === 'outside_dhaka' ? 'Outside Dhaka (৳130)' : 'Inside Dhaka (৳70)';
    setAiDetectedMsg(`✔ ${parsed.customerName || 'Customer'} · ${parsed.phone || 'Phone'} · ${parsed.city || 'City'} · ${zoneLabel}`);
  };



  const addItem = () => {
    const defaultProd = products[0];
    setItems([
      ...items,
      {
        productId: defaultProd?.id || '',
        qty: 1,
        price: defaultProd?.sellingPrice || 100,
        cost: defaultProd?.costPrice || 6
      }
    ]);
  };

  const updateItem = (i: number, field: string, val: any) => {
    const next = [...items];
    (next[i] as any)[field] = val;
    if (field === 'productId') {
      const p = products.find(prod => prod.id === val);
      if (p) {
        next[i].price = p.sellingPrice;
        next[i].cost = p.costPrice;
      }
    }
    setItems(next);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = Math.round(items.reduce((s, i) => s + (i.price * i.qty), 0));
  const total = Math.round(Math.max(0, subtotal - (discount || 0) + (deliveryCharge || 0)));
  const totalCost = Math.round(items.reduce((s, i) => s + ((i.cost || 0) * i.qty), 0));
  const estimatedProfit = Math.round(Math.max(0, total - totalCost));

  const handleCreateOrder = async () => {
    if (!customerName.trim()) {
      showAlert({ type: 'warning', title: 'Customer Name Required', message: 'Please enter the client name.' });
      return;
    }
    if (!customerPhone.trim()) {
      showAlert({ type: 'warning', title: 'Phone Number Required', message: 'Please enter a valid phone number.' });
      return;
    }
    if (!deliveryAddress.trim()) {
      showAlert({ type: 'warning', title: 'Delivery Address Required', message: 'Please enter the full delivery address.' });
      return;
    }

    const validItems = items.filter(i => i.productId && i.qty > 0);
    if (!validItems.length) {
      showAlert({ type: 'warning', title: 'Items Required', message: 'Please add at least one cone or product.' });
      return;
    }

    // Check stock warning
    for (const item of validItems) {
      const p = products.find(prod => prod.id === item.productId);
      if (p && item.qty > p.stock) {
        const proceed = await showConfirm({
          title: 'Stock Warning',
          message: `Warning: You requested ${item.qty}x ${p.name}, but current stock is only ${p.stock}. Proceed anyway?`,
          confirmText: 'Proceed Anyway',
          cancelText: 'Cancel & Adjust',
          type: 'warning'
        });
        if (!proceed) return;
      }
    }

    const orderItems = validItems.map(i => {
      const p = products.find(prod => prod.id === i.productId)!;
      return {
        productId: i.productId,
        productName: p.name,
        category: p.category,
        quantity: i.qty,
        price: Math.round(i.price),
        cost: Math.round(i.cost || 0),
        total: Math.round(i.price * i.qty)
      };
    });

    const nextId = `HR-${10001 + db.getOrders().length}`;

    // Create order in 'new' state so the user can Confirm & Deduct Stock or Auto-Confirm
    const created = db.addOrder({
      orderId: nextId,
      customerId: `c_${Date.now().toString().slice(-4)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      city: city.trim() || 'Dhaka',
      items: orderItems,
      subtotal: Math.round(subtotal),
      discount: Math.round(discount || 0),
      discountType: 'fixed',
      deliveryCharge: Math.round(deliveryCharge || 0),
      total: Math.round(total),
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      deliveryStatus: 'pending',
      orderStatus: 'new',
      source,
      profit: Math.round(estimatedProfit),
    });

    showOrderSuccess({
      orderId: created.orderId,
      trackingCode: created.steadfastTrackingCode,
      customerName: created.customerName,
      customerPhone: created.customerPhone,
      deliveryAddress: created.deliveryAddress,
      total: created.total,
    }, `Order #${created.orderId} Successfully Created!`);

    onSave();
  };

  return (
    <div className="space-y-4">


      <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-300 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#720000] flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles size={14} className="text-amber-600" />
            <span>AI Order Quick-Paste (WhatsApp / Facebook)</span>
          </label>
          {aiDetectedMsg && (
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-700 shrink-0" />
              <span>{aiDetectedMsg}</span>
            </span>
          )}
        </div>
        <textarea
          rows={2}
          value={aiQuickText}
          onChange={(e) => handleApplyAIPaste(e.target.value)}
          placeholder="Paste raw client message here... Name, Number & Address are auto-filled instantly!"
          className="w-full p-2.5 rounded-lg border border-[#E8E0D4] bg-white text-xs font-sans text-[#24201D] focus:ring-1 focus:ring-[#720000]"
        />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#7A6B5D]">Quick Sample:</span>
          <button
            type="button"
            onClick={() => handleApplyAIPaste('Name: Nusrat Jahan\nPhone: 01712345678\nAddress: House 14, Road 5, Dhanmondi, Dhaka\n5 pcs 25gm cone')}
            className="px-2 py-0.5 rounded text-[10px] bg-white border border-[#E8E0D4] text-gray-700 hover:border-[#720000] cursor-pointer"
          >
            WhatsApp Message
          </button>
          <button
            type="button"
            onClick={() => handleApplyAIPaste('Amina Sultana\n01819234567\nSector 11, Uttara, Dhaka\n10 ta 20gm cone')}
            className="px-2 py-0.5 rounded text-[10px] bg-white border border-[#E8E0D4] text-gray-700 hover:border-[#720000] cursor-pointer"
          >
            Facebook Messenger
          </button>
          <button
            type="button"
            onClick={() => handleApplyAIPaste('Farhana Akter\n01712998877\nZindabazar, Sylhet Sadar\n4 pcs 25gm cone')}
            className="px-2 py-0.5 rounded text-[10px] bg-white border border-[#E8E0D4] text-gray-700 hover:border-[#720000] cursor-pointer"
          >
            Outside Dhaka (District)
          </button>
        </div>
      </div>

      {/* Customer Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="form-label">Customer Name *</label>
          <input
            className="form-input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Nusrat Jahan"
          />
        </div>
        <div>
          <label className="form-label">Customer Phone *</label>
          <input
            className="form-input"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="e.g. 01711-234567"
          />
        </div>
      </div>

      {/* Delivery Address & City */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="form-label">Delivery Address * (Sent to Steadfast Courier)</label>
          <input
            className="form-input"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="e.g. House 14, Road 7A, Dhanmondi"
          />
        </div>
        <div>
          <label className="form-label">City / District *</label>
          <select
            className="form-input"
            value={city}
            onChange={(e) => {
              const val = e.target.value;
              setCity(val);
              // Auto-update delivery zone & charge based on selected district
              const dhakaMetro = [
                'dhaka','dhanmondi','mirpur','uttara','gulshan','banani','mohammadpur',
                'badda','bashundhara','rampura','khilgaon','motijheel','farmgate',
                'shyamoli','jatrabari','lalbagh','moghbazar','malibagh','mohakhali',
                'tejgaon','shahbag','kafrul','demra','hazaribagh','keraniganj','savar',
              ];
              const isInside = dhakaMetro.some(k => val.toLowerCase().includes(k));
              if (isInside) {
                setCityZone('inside_dhaka');
                setDeliveryCharge(70);
              } else {
                setCityZone('outside_dhaka');
                setDeliveryCharge(130);
              }
            }}
          >
            <optgroup label="— Dhaka Metro (Inside ৳70) —">
              <option value="Dhaka">Dhaka (City)</option>
              <option value="Dhanmondi">Dhanmondi</option>
              <option value="Mirpur">Mirpur</option>
              <option value="Uttara">Uttara</option>
              <option value="Gulshan">Gulshan</option>
              <option value="Mohammadpur">Mohammadpur</option>
              <option value="Badda">Badda</option>
              <option value="Bashundhara">Bashundhara</option>
              <option value="Jatrabari">Jatrabari</option>
              <option value="Tejgaon">Tejgaon</option>
              <option value="Mohakhali">Mohakhali</option>
              <option value="Keraniganj">Keraniganj</option>
              <option value="Savar">Savar</option>
            </optgroup>
            <optgroup label="— Dhaka Division (Outside ৳130) —">
              <option value="Gazipur">৫ Gazipur</option>
              <option value="Narayanganj">৫ Narayanganj</option>
              <option value="Tangail">৫ Tangail</option>
              <option value="Manikganj">৫ Manikganj</option>
              <option value="Munshiganj">৫ Munshiganj</option>
              <option value="Narsingdi">৫ Narsingdi</option>
              <option value="Kishoreganj">৫ Kishoreganj</option>
              <option value="Faridpur">৫ Faridpur</option>
              <option value="Rajbari">৫ Rajbari</option>
              <option value="Shariatpur">৫ Shariatpur</option>
              <option value="Madaripur">৫ Madaripur</option>
              <option value="Gopalganj">৫ Gopalganj</option>
            </optgroup>
            <optgroup label="— Chattogram Division —">
              <option value="Chattogram">Chattogram</option>
              <option value="Cox's Bazar">Cox's Bazar</option>
              <option value="Rangamati">Rangamati</option>
              <option value="Khagrachhari">Khagrachhari</option>
              <option value="Bandarban">Bandarban</option>
              <option value="Cumilla">Cumilla</option>
              <option value="Brahmanbaria">Brahmanbaria</option>
              <option value="Chandpur">Chandpur</option>
              <option value="Lakshmipur">Lakshmipur</option>
              <option value="Noakhali">Noakhali</option>
              <option value="Feni">Feni</option>
            </optgroup>
            <optgroup label="— Rajshahi Division —">
              <option value="Rajshahi">Rajshahi</option>
              <option value="Chapainawabganj">Chapainawabganj</option>
              <option value="Natore">Natore</option>
              <option value="Naogaon">Naogaon</option>
              <option value="Pabna">Pabna</option>
              <option value="Sirajganj">Sirajganj</option>
              <option value="Bogura">Bogura</option>
              <option value="Joypurhat">Joypurhat</option>
            </optgroup>
            <optgroup label="— Khulna Division —">
              <option value="Khulna">Khulna</option>
              <option value="Jashore">Jashore (Jessore)</option>
              <option value="Satkhira">Satkhira</option>
              <option value="Bagerhat">Bagerhat</option>
              <option value="Narail">Narail</option>
              <option value="Magura">Magura</option>
              <option value="Jhenaidah">Jhenaidah</option>
              <option value="Kushtia">Kushtia</option>
              <option value="Chuadanga">Chuadanga</option>
              <option value="Meherpur">Meherpur</option>
            </optgroup>
            <optgroup label="— Barisal Division —">
              <option value="Barisal">Barisal</option>
              <option value="Bhola">Bhola</option>
              <option value="Patuakhali">Patuakhali</option>
              <option value="Pirojpur">Pirojpur</option>
              <option value="Jhalokati">Jhalokati</option>
              <option value="Barguna">Barguna</option>
            </optgroup>
            <optgroup label="— Sylhet Division —">
              <option value="Sylhet">Sylhet</option>
              <option value="Moulvibazar">Moulvibazar</option>
              <option value="Habiganj">Habiganj</option>
              <option value="Sunamganj">Sunamganj</option>
            </optgroup>
            <optgroup label="— Rangpur Division —">
              <option value="Rangpur">Rangpur</option>
              <option value="Dinajpur">Dinajpur</option>
              <option value="Thakurgaon">Thakurgaon</option>
              <option value="Panchagarh">Panchagarh</option>
              <option value="Nilphamari">Nilphamari</option>
              <option value="Lalmonirhat">Lalmonirhat</option>
              <option value="Gaibandha">Gaibandha</option>
              <option value="Kurigram">Kurigram</option>
            </optgroup>
            <optgroup label="— Mymensingh Division —">
              <option value="Mymensingh">Mymensingh</option>
              <option value="Sherpur">Sherpur</option>
              <option value="Jamalpur">Jamalpur</option>
              <option value="Netrokona">Netrokona</option>
            </optgroup>
          </select>
          {/* Zone badge */}
          <p className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
            cityZone === 'inside_dhaka'
              ? 'text-green-700 bg-green-50'
              : 'text-amber-800 bg-amber-50'
          }`}>
            {cityZone === 'inside_dhaka' ? '✔ Inside Dhaka · ৳70' : '📦 Outside Dhaka · ৳130'}
          </p>
        </div>
      </div>

      {/* Item Selector with Live Stock Warnings */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-2">
          <label className="form-label mb-0">Select Cones / Items *</label>
          <button
            onClick={addItem}
            className="text-xs font-bold flex items-center gap-1 text-[#720000] hover:underline"
          >
            <Plus size={13} /> Add Another Cone
          </button>
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {items.map((item, idx) => {
            const selectedProd = products.find((p) => p.id === item.productId);
            const isStockLow = selectedProd && selectedProd.stock <= 20;

            return (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4]"
              >
                <div className="col-span-6">
                  <select
                    className="form-input text-xs py-1.5"
                    value={item.productId}
                    onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — Stock: {p.stock} pcs {p.stock <= 20 ? '(Low Stock)' : ''} (৳{p.sellingPrice})
                      </option>
                    ))}
                  </select>
                  {isStockLow && (
                    <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 mt-1">
                      <AlertTriangle size={12} className="text-amber-600 shrink-0" />
                      <span>Low stock alert: ≤ 20 cones left</span>
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min={1}
                    className="form-input text-xs py-1.5"
                    value={item.qty}
                    onChange={(e) => updateItem(idx, 'qty', Math.max(1, Number(e.target.value)))}
                    placeholder="Qty"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    className="form-input text-xs py-1.5"
                    value={item.price}
                    onChange={(e) => updateItem(idx, 'price', Number(e.target.value))}
                    placeholder="Price"
                  />
                </div>
                <div className="col-span-1 text-right text-xs font-bold tabular-nums text-[#24201D]">
                  ৳{(item.price * item.qty).toLocaleString()}
                </div>
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => removeItem(idx)}
                    disabled={items.length <= 1}
                    className="text-gray-400 hover:text-red-600 disabled:opacity-30"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Charge, Discount & Payment Method */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="form-label">Delivery Charge (৳)</label>
          <input
            type="number"
            className="form-input"
            value={deliveryCharge}
            onChange={(e) => setDeliveryCharge(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="form-label">Discount (৳)</label>
          <input
            type="number"
            className="form-input"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="form-label">Payment Method</label>
          <select
            className="form-input"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="COD">Cash on Delivery (Steadfast COD)</option>
            <option value="bKash">bKash (Prepaid)</option>
            <option value="Nagad">Nagad (Prepaid)</option>
            <option value="Bank">Bank Transfer</option>
            <option value="Cash">Cash (Store / Hand-to-hand)</option>
          </select>
        </div>
      </div>

      {/* Summary Box */}
      <div className="rounded-xl p-4 space-y-1.5 bg-[#FAF8F3] border border-[#E8E0D4] text-xs">
        <div className="flex justify-between text-[#7A6B5D]">
          <span>Cones Subtotal</span>
          <span className="font-semibold text-[#24201D] tabular-nums">৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[#7A6B5D]">
          <span>Delivery Charge</span>
          <span className="font-semibold text-[#24201D] tabular-nums">+৳{deliveryCharge.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Discount Applied</span>
            <span className="font-semibold tabular-nums">-৳{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="border-t border-[#E8E0D4] pt-2 flex justify-between text-sm font-bold">
          <span className="text-[#24201D]">Total Amount (COD to Collect)</span>
          <span className="text-base text-[#720000] tabular-nums">৳{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-[#E8E0D4] text-[#7A6B5D]"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateOrder}
          className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white shadow-md hover:opacity-95"
          style={{ background: '#720000' }}
        >
          Create Order
        </button>
      </div>
    </div>
  );
}

// ─── Dispatch To Steadfast Confirmation Modal ──────────────────────────────
function SteadfastDispatchModal({
  order,
  onClose,
  onConfirm,
  isDispatching,
}: {
  order: Order;
  onClose: () => void;
  onConfirm: () => void;
  isDispatching?: boolean;
}) {
  const codToCollect = order.paymentMethod === 'COD' || order.paymentMethod === 'Steadfast COD' ? order.total : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E8E0D4]">
        <div className="px-6 py-4 bg-[#720000] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck size={20} />
            <h3 className="font-serif font-bold text-base">Send to Steadfast Courier</h3>
          </div>
          <button onClick={onClose} disabled={isDispatching} className="p-1 rounded hover:bg-white/10 text-white/80 disabled:opacity-40">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-[#7A6B5D]">
            The following details will be automatically transmitted to Steadfast Courier API:
          </p>

          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7A6B5D]">Invoice / Order ID:</span>
              <span className="font-mono font-bold text-[#720000]">{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A6B5D]">Recipient Name:</span>
              <span className="font-bold text-[#24201D]">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7A6B5D]">Recipient Phone:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#24201D]">{order.customerPhone}</span>
                <FraudBadge phone={order.customerPhone} customerName={order.customerName} />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A6B5D]">Delivery Address:</span>
              <span className="font-medium text-[#24201D] text-right max-w-60">
                {order.deliveryAddress || order.city || 'Dhaka'}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#E8E0D4] pt-2">
              <span className="font-bold text-[#24201D]">COD Collection Amount:</span>
              <span className="font-bold text-sm text-[#720000] tabular-nums">
                ৳{codToCollect.toLocaleString()} {codToCollect === 0 ? '(Prepaid)' : ''}
              </span>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              disabled={isDispatching}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E8E0D4] text-[#7A6B5D] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDispatching}
              className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-[#720000] shadow hover:opacity-95 flex items-center gap-1.5 disabled:opacity-70 cursor-pointer"
            >
              {isDispatching ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Transmitting to Steadfast...
                </>
              ) : (
                <>
                  <Send size={13} /> Confirm & Dispatch
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Orders Page Component ─────────────────────────────────────────────
export default function Orders() {
  const { showAlert, showConfirm, showPrompt, showOrderSuccess } = useModal();
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [showAIOrder, setShowAIOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [dispatchOrder, setDispatchOrder] = useState<Order | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const refresh = () => {
    const updated = db.getOrders();
    setOrders(updated);
    if (selectedOrder) {
      const found = updated.find((o) => o.id === selectedOrder.id);
      if (found) setSelectedOrder(found);
    }
  };

  useEffect(() => {
    refresh();
    const unsub = db.subscribe(refresh);
    return () => unsub();
  }, [selectedOrder?.id]);

  // Actions
  const handleConfirmOrder = (orderId: string) => {
    const updated = db.confirmOrder(orderId);
    if (updated) {
      showAlert({
        type: 'success',
        title: 'Order Confirmed',
        message: `Order #${updated.orderId} confirmed! Cones and items have been deducted from inventory stock.`
      });
      refresh();
    }
  };

  const handleDispatchSteadfast = async () => {
    if (!dispatchOrder) return;
    setIsDispatching(true);
    try {
      const res = await dispatchOrderToSteadfastAPI(dispatchOrder);
      setIsDispatching(false);
      if (res.success && res.consignment) {
        setDispatchOrder(null);
        showOrderSuccess({
          orderId: res.order?.orderId || dispatchOrder.orderId,
          trackingCode: res.consignment.tracking_code,
          customerName: dispatchOrder.customerName,
          customerPhone: dispatchOrder.customerPhone,
          deliveryAddress: dispatchOrder.deliveryAddress,
          total: dispatchOrder.total,
        }, `Order Dispatched to Steadfast Courier! (Tracking: ${res.consignment.tracking_code})`);
        refresh();
      } else {
        showAlert({
          type: 'error',
          title: 'Steadfast Dispatch Failed',
          message: res.message || 'Could not dispatch order to Steadfast Courier API. Please verify recipient address and phone number.'
        });
      }
    } catch (err: any) {
      setIsDispatching(false);
      showAlert({
        type: 'error',
        title: 'Dispatch Connection Error',
        message: err?.message || 'Error communicating with Steadfast Courier API.'
      });
    }
  };

  const handleCancelAndRestock = async (orderId: string) => {
    const existingOrder = orders.find(o => o.id === orderId);
    const trackingCode = existingOrder?.steadfastTrackingCode;

    const reason = await showPrompt({
      title: 'Cancel Order & Restock Cones',
      message: trackingCode
        ? `⚠️ Note: Order #${existingOrder?.orderId || orderId} has already been dispatched to Steadfast (Tracking: ${trackingCode}). Enter reason to cancel and restock inventory:`
        : 'Enter reason for cancellation. All mehendi cones and products will be immediately returned to inventory stock:',
      placeholder: 'e.g. Customer requested cancellation over phone',
      quickOptions: ['Customer requested cancellation', 'Duplicate order', 'Customer phone unreachable', 'Wrong address entered']
    });
    if (reason === null) return; // user cancelled prompt
    const updated = db.cancelOrder(orderId, reason || 'Customer requested cancellation');
    if (updated) {
      if (trackingCode) {
        showAlert({
          type: 'warning',
          title: 'Order Cancelled & Restocked (Steadfast Action Required)',
          message: `Order #${updated.orderId} is now CANCELLED in Henna Royalin and products have been restocked to inventory.

⚠️ IMPORTANT STEADFAST NOTE: Steadfast Courier's API does not support automated cancellations after a consignment is booked. To prevent courier charges or accidental delivery, please also cancel or hold consignment ${trackingCode} directly in your Steadfast Portal (portal.steadfast.com.bd) or tell your pickup rider.`
        });
      } else {
        showAlert({
          type: 'warning',
          title: 'Order Cancelled & Restocked',
          message: `Order #${updated.orderId} cancelled. Items have been automatically returned to inventory.`
        });
      }
      refresh();
    }
  };

  const handleUpdateCourierStatus = async (orderId: string, status: Order['steadfastStatus']) => {
    let failReason: string | undefined = undefined;
    if (status === 'failed') {
      const reason = await showPrompt({
        title: 'Steadfast Delivery Failure',
        message: 'Enter the failure reason reported by courier rider:',
        placeholder: 'e.g. Customer phone switched off',
        quickOptions: ['Customer phone unreachable', 'Customer refused parcel', 'Address not found by rider']
      });
      failReason = reason || 'Customer unreachable / delivery attempt failed';
    }
    db.updateSteadfastStatus(orderId, status, failReason);
    refresh();
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    const existingOrder = orders.find(o => o.id === orderId);
    const trackingCode = existingOrder?.steadfastTrackingCode;

    const confirmed = await showConfirm({
      title: `Delete Order #${orderNumber}?`,
      message: trackingCode
        ? `⚠️ Caution: Order #${orderNumber} has a courier tracking code (${trackingCode}). Permanently deleting this order will remove all order records from Henna Royalin database. Are you sure you want to proceed?`
        : `Are you sure you want to permanently delete Order #${orderNumber}? This will remove all records for this order and cannot be undone.`,
      confirmText: 'Yes, Delete Permanently',
      cancelText: 'Cancel',
      type: 'warning'
    });
    if (!confirmed) return;

    db.deleteOrder(orderId);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
    refresh();
    showAlert({
      type: 'success',
      title: 'Order Deleted',
      message: `Order #${orderNumber} has been permanently deleted.`
    });
  };

  // Filter orders
  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (o.orderId ?? '').toLowerCase().includes(q) ||
      (o.customerName ?? '').toLowerCase().includes(q) ||
      (o.customerPhone ?? '').includes(q) ||
      (o.steadfastTrackingCode ?? '').toLowerCase().includes(q);

    if (statusFilter === 'all') return matchSearch;
    if (statusFilter === 'failed') return matchSearch && (o.deliveryStatus === 'failed' || o.steadfastStatus === 'failed');
    return matchSearch && (o.orderStatus === statusFilter || o.deliveryStatus === statusFilter);
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: '#24201D' }}>
              Orders & Courier Dispatch
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Steadfast Integrated
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: '#7A6B5D' }}>
            Create orders, confirm stock deduction, dispatch to Steadfast Courier, and auto-restock on cancellation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAIOrder(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #720000 0%, #8B1A1A 100%)',
              border: '1px solid #D9A900',
              boxShadow: '0 3px 10px rgba(114,0,0,0.25)'
            }}
          >
            <Sparkles size={16} className="text-[#F8E29B] animate-pulse" />
            <span>AI Order (Paste)</span>
          </button>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-95 cursor-pointer"
            style={{ background: '#720000' }}
          >
            <Plus size={16} /> Create Order
          </button>
        </div>
      </div>

      {/* KPI mini-cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'All Orders', value: orders.length, color: '#24201D', bg: '#FAF8F3' },
          { label: 'New / Unconfirmed', value: orders.filter((o) => o.orderStatus === 'new').length, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Steadfast In-Transit', value: orders.filter((o) => o.steadfastStatus === 'in_transit').length, color: '#D97706', bg: '#FEF3C7' },
          { label: 'Delivered / Completed', value: orders.filter((o) => o.orderStatus === 'delivered').length, color: '#166534', bg: '#F0FDF4' },
          { label: 'Failed Deliveries', value: orders.filter((o) => o.steadfastStatus === 'failed' || o.deliveryStatus === 'failed').length, color: '#DC2626', bg: '#FEF2F2' },
        ].map((k) => (
          <div
            key={k.label}
            className="p-3.5 rounded-xl border border-[#E8E0D4] bg-white shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold text-[#7A6B5D]">{k.label}</p>
              <p className="text-xl font-bold tabular-nums mt-0.5" style={{ color: k.color }}>
                {k.value}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs" style={{ background: k.bg, color: k.color }}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A3907C] pointer-events-none" />
          <input
            className="form-input form-input-search pl-10! text-xs py-2 bg-white"
            style={{ paddingLeft: '2.6rem' }}
            placeholder="Search by Order ID, Customer Name, Phone, or Steadfast Tracking Code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-1 p-1 rounded-xl bg-[#F5F0E8] border border-[#E8E0D4]">
            {['all', 'new', 'confirmed', 'shipped', 'delivered', 'failed', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap flex items-center gap-1.5"
                style={{
                  background: statusFilter === s ? '#720000' : 'transparent',
                  color: statusFilter === s ? '#FFFFFF' : '#7A6B5D',
                }}
              >
                {s === 'failed' ? (
                  <>
                    <AlertCircle size={13} className={statusFilter === 'failed' ? 'text-[#F8E29B]' : 'text-rose-600'} />
                    <span>Failed</span>
                  </>
                ) : (
                  s
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E0D4] shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table min-w-240">
            <thead>
              <tr>
                <th>Order / Invoice</th>
                <th>Customer & Address</th>
                <th>Ordered Cones</th>
                <th>Total (COD)</th>
                <th>Order Status</th>
                <th>Steadfast Courier</th>
                <th>Stock State</th>
                <th className="text-right whitespace-nowrap min-w-56">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#7A6B5D]">
                    <ShoppingBag size={36} className="mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-sm">No orders matching criteria</p>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const isFailed = order.steadfastStatus === 'failed' || order.deliveryStatus === 'failed';
                  const isCancelled = order.orderStatus === 'cancelled';

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-[#FAF8F3] ${isFailed ? 'bg-red-50/50' : isCancelled ? 'opacity-60 bg-gray-50' : ''}`}
                    >
                      <td>
                        <span className="font-mono text-xs font-bold text-[#720000]">
                          {order.orderId}
                        </span>
                        <p className="text-[11px] text-[#A3907C]">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </p>
                        <span className="text-[10px] text-[#7A6B5D]">via {order.source}</span>
                      </td>

                      <td>
                        <p className="font-bold text-sm text-[#24201D]">{order.customerName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-xs text-[#7A6B5D] flex items-center gap-1">
                            <Phone size={11} /> {order.customerPhone}
                          </p>
                          <FraudBadge phone={order.customerPhone} customerName={order.customerName} compact />
                        </div>
                        <p className="text-[11px] text-[#A3907C] flex items-center gap-1 max-w-55 truncate">
                          <MapPin size={11} className="shrink-0" /> {order.deliveryAddress || order.city || 'Dhaka'}
                        </p>
                      </td>

                      <td>
                        <div className="space-y-0.5">
                          {order.items.map((it, i) => (
                            <p key={i} className="text-xs text-[#24201D]">
                              <span className="font-bold">{it.quantity}x</span> {it.productName}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td>
                        <span className="font-bold text-sm text-[#720000] tabular-nums">
                          ৳{order.total.toLocaleString()}
                        </span>
                        <span className="block text-[11px] text-[#7A6B5D]">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td>
                        <StatusPill status={order.orderStatus} colors={statusColors} />
                      </td>

                      <td>
                        {order.steadfastTrackingCode ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[11px] font-bold text-[#1E40AF]">
                                {order.steadfastTrackingCode}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block ${
                                order.steadfastStatus === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.steadfastStatus === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.steadfastStatus === 'failed' ? (
                                <span className="inline-flex items-center gap-1 text-red-800">
                                  <AlertCircle size={10} className="text-red-600 shrink-0" />
                                  <span>Delivery Failed</span>
                                </span>
                              ) : (
                                order.steadfastStatus || 'In Transit'
                              )}
                            </span>
                            {order.steadfastFailedReason && (
                              <p className="text-[10px] text-red-600 font-medium max-w-37.5 truncate">
                                {order.steadfastFailedReason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-[#A3907C] italic">Not dispatched</span>
                        )}
                      </td>

                      <td>
                        {order.restocked ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                            ✓ Restocked
                          </span>
                        ) : order.orderStatus === 'confirmed' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                            Deducted
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#A3907C]">Pending confirm</span>
                        )}
                      </td>

                      <td className="text-right py-3 px-3">
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                          {/* 1. Contextual Primary Workflow Button */}
                          {order.orderStatus === 'new' ? (
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
                              title="Confirms order and immediately deducts raw ingredients & cone stock from inventory"
                            >
                              <CheckCircle2 size={13} className="text-emerald-200" />
                              <span>Confirm & Deduct</span>
                            </button>
                          ) : (order.orderStatus === 'confirmed' || order.orderStatus === 'ready' || order.orderStatus === 'processing') &&
                            !order.steadfastTrackingCode ? (
                            <button
                              onClick={() => setDispatchOrder(order)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#720000] to-[#8B1A1A] hover:from-[#5a0000] hover:to-[#720000] shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
                              title="Send order details to Steadfast Courier"
                            >
                              <Truck size={13} className="text-amber-200" />
                              <span>Send to Steadfast</span>
                            </button>
                          ) : order.steadfastTrackingCode && order.steadfastStatus === 'in_transit' ? (
                            <div className="inline-flex items-center bg-white border border-[#E8E0D4] p-0.5 rounded-xl shadow-2xs">
                              <button
                                onClick={() => handleUpdateCourierStatus(order.id, 'delivered')}
                                className="px-2 py-1 text-[11px] font-bold rounded-lg text-emerald-800 hover:bg-emerald-50 transition cursor-pointer"
                                title="Mark Delivered & Record COD Payment"
                              >
                                ✓ Delivered
                              </button>
                              <span className="w-px h-3.5 bg-[#E8E0D4]" />
                              <button
                                onClick={() => handleUpdateCourierStatus(order.id, 'failed')}
                                className="px-2 py-1 text-[11px] font-bold rounded-lg text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                                title="Mark Delivery Failed"
                              >
                                ✕ Failed
                              </button>
                            </div>
                          ) : order.orderStatus === 'delivered' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                              <Check size={12} /> Delivered
                            </span>
                          ) : order.orderStatus === 'cancelled' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-red-700 bg-red-50 border border-red-200">
                              <X size={12} /> Cancelled
                            </span>
                          ) : null}

                          {/* 2. Unified Luxury Action Icon Dock */}
                          <div className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-white border border-[#E8E0D4] shadow-2xs">
                            {/* View Full Details */}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A6B5D] hover:text-[#24201D] hover:bg-[#FAF8F3] transition-colors cursor-pointer"
                              title="View Full Details"
                            >
                              <Eye size={13} />
                            </button>

                            {/* View & Print Invoice */}
                            <button
                              onClick={() => setInvoiceOrder(order)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#720000] hover:text-[#5a0000] hover:bg-red-50/60 transition-colors cursor-pointer"
                              title="View & Print Invoice"
                            >
                              <FileText size={13} />
                            </button>

                            {/* Cancel & Restock (if order is active) */}
                            {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                              <button
                                onClick={() => handleCancelAndRestock(order.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-700 hover:text-amber-900 hover:bg-amber-50 transition-colors cursor-pointer"
                                title="Cancel Order & Restock Items to Inventory"
                              >
                                <RotateCcw size={13} />
                              </button>
                            )}

                            {/* Delete Order Permanently */}
                            <button
                              onClick={() => handleDeleteOrder(order.id, order.orderId)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Order Permanently"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
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

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E8E0D4] max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#E8E0D4] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#24201D]">
                  Order #{selectedOrder.orderId}
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Placed on {formatDateTime(selectedOrder.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#720000] bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                  title="View and print official invoice"
                >
                  <Printer size={13} />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-[#7A6B5D]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {/* Failed alert if failed */}
              {(selectedOrder.steadfastStatus === 'failed' || selectedOrder.deliveryStatus === 'failed') && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <div>
                    <p className="font-bold">Steadfast Courier Delivery Failed</p>
                    <p>{selectedOrder.steadfastFailedReason || 'Customer unreachable / delivery returned'}</p>
                  </div>
                </div>
              )}

              {/* Customer & Courier Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-1 text-xs">
                  <p className="font-bold text-[#720000] uppercase text-[10px]">Customer & Destination</p>
                  <p className="font-bold text-sm text-[#24201D]">{selectedOrder.customerName}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#7A6B5D]">Phone: {selectedOrder.customerPhone}</p>
                    <FraudBadge phone={selectedOrder.customerPhone} customerName={selectedOrder.customerName} />
                  </div>
                  <p className="text-[#7A6B5D]">Address: {selectedOrder.deliveryAddress || selectedOrder.city || 'Dhaka'}</p>
                  <p className="text-[#7A6B5D]">City: {selectedOrder.city || 'Dhaka'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-1 text-xs">
                  <p className="font-bold text-[#720000] uppercase text-[10px]">Steadfast Courier Details</p>
                  <p className="text-[#24201D]">
                    Consignment ID: <span className="font-mono font-bold">{selectedOrder.steadfastConsignmentId || '—'}</span>
                  </p>
                  <p className="text-[#24201D]">
                    Tracking Code: <span className="font-mono font-bold text-blue-700">{selectedOrder.steadfastTrackingCode || '—'}</span>
                  </p>
                  <p className="text-[#24201D]">
                    Courier Status: <span className="font-bold capitalize">{selectedOrder.steadfastStatus || 'Pending'}</span>
                  </p>
                  <p className="text-[#24201D]">
                    Inventory Restocked: <span className="font-bold text-emerald-700">{selectedOrder.restocked ? 'YES' : 'NO'}</span>
                  </p>
                </div>
              </div>

              {/* Ordered Cones Table */}
              <div>
                <p className="font-bold text-xs text-[#720000] uppercase mb-1.5">Order Items</p>
                <div className="rounded-xl border border-[#E8E0D4] overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-[#FAF8F3] text-[#7A6B5D]">
                      <tr>
                        <th className="p-2.5 text-left">Product</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E0D4]">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-medium text-[#24201D]">{item.productName}</td>
                          <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                          <td className="p-2.5 text-right">৳{Math.round(item.price)}</td>
                          <td className="p-2.5 text-right font-bold text-[#720000]">৳{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Raw Ingredients Deducted from Inventory */}
              {selectedOrder.ingredientsUsed && selectedOrder.ingredientsUsed.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-900 flex items-center gap-1.5 uppercase">
                      <Sparkles size={13} className="text-amber-600" /> Raw Materials Deducted from Stock
                    </span>
                    <span className="text-[11px] font-bold text-[#720000]">
                      Material Cost: ৳{selectedOrder.materialCostTotal?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                    {selectedOrder.ingredientsUsed.map((ing, i) => (
                      <div key={i} className="p-1.5 bg-white rounded-lg border border-amber-200/60 flex justify-between items-center">
                        <span className="text-gray-700">{ing.materialName}:</span>
                        <span className="font-bold text-[#24201D] font-mono">
                          {ing.quantity} {ing.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7A6B5D]">
                  <span>Subtotal</span>
                  <span>৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7A6B5D]">
                  <span>Delivery Charge</span>
                  <span>৳{selectedOrder.deliveryCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span>-৳{selectedOrder.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-[#E8E0D4] pt-1.5 font-bold text-sm text-[#720000]">
                  <span>Total Amount</span>
                  <span>৳{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-[#E8E0D4] bg-[#FAF8F3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E8E0D4] bg-white text-[#7A6B5D]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#720000]/30 bg-white text-[#720000] hover:bg-[#FAF8F3] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <FileText size={14} />
                  <span>View & Print Invoice</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedOrder.id;
                    const oNum = selectedOrder.orderId;
                    handleDeleteOrder(id, oNum);
                  }}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-800 transition flex items-center gap-1.5 cursor-pointer"
                  title="Delete Order Permanently"
                >
                  <Trash2 size={13} />
                  <span>Delete Order</span>
                </button>

                {selectedOrder.orderStatus !== 'cancelled' && (
                  <button
                    onClick={() => {
                      const id = selectedOrder.id;
                      setSelectedOrder(null);
                      handleCancelAndRestock(id);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    Cancel & Restock Items
                  </button>
                )}

                {!selectedOrder.steadfastTrackingCode && (
                  <button
                    onClick={() => {
                      const o = selectedOrder;
                      setSelectedOrder(null);
                      setDispatchOrder(o);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-[#720000] shadow flex items-center gap-1"
                  >
                    <Truck size={14} /> Send to Steadfast
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E8E0D4] max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#E8E0D4] flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#24201D]">Create New Order</h2>
              <button
                onClick={() => setShowNew(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-[#7A6B5D]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <NewOrderForm
                onClose={() => setShowNew(false)}
                onSave={() => {
                  setShowNew(false);
                  refresh();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Steadfast Dispatch Confirmation Modal */}
      {dispatchOrder && (
        <SteadfastDispatchModal
          order={dispatchOrder}
          onClose={() => setDispatchOrder(null)}
          onConfirm={handleDispatchSteadfast}
          isDispatching={isDispatching}
        />
      )}

      {/* AI Smart Order Modal */}
      {showAIOrder && (
        <AIOrderModal
          isOpen={showAIOrder}
          onClose={() => setShowAIOrder(false)}
          onSuccess={(newOrder) => {
            refresh();
            showOrderSuccess({
              orderId: newOrder.orderId,
              trackingCode: newOrder.steadfastTrackingCode,
              customerName: newOrder.customerName,
              customerPhone: newOrder.customerPhone,
              deliveryAddress: newOrder.deliveryAddress,
              total: newOrder.total,
            }, `Order #${newOrder.orderId} Successfully Created via AI Autofill!`);
          }}
        />
      )}

      {/* Official Customer Invoice & Download Modal */}
      {invoiceOrder && (
        <OrderInvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
}

