import { useState, useEffect } from 'react';
import { CreditCard, Plus, X, CheckCircle2, Clock, AlertCircle, Banknote, Building2, Package, Truck, Smartphone, Search, Filter } from 'lucide-react';
import { db, Payment, Order } from '../lib/db';
import { useModal } from '../context/ModalContext';

function PaymentMethodBadge({ method }: { method: string }) {
  const config: Record<string, { icon: any; color: string; bg: string }> = {
    bKash: { icon: Smartphone, color: '#E2136E', bg: '#FDF2F7' },
    Nagad: { icon: Smartphone, color: '#EA580C', bg: '#FFF7ED' },
    Cash: { icon: Banknote, color: '#15803D', bg: '#F0FDF4' },
    Bank: { icon: Building2, color: '#1E40AF', bg: '#EFF6FF' },
    Card: { icon: CreditCard, color: '#720000', bg: '#FBF0F0' },
    COD: { icon: Package, color: '#92400E', bg: '#FEF3C7' },
    'Steadfast COD': { icon: Truck, color: '#0369A1', bg: '#F0F9FF' },
    'Cash on Delivery': { icon: Truck, color: '#0369A1', bg: '#F0F9FF' },
  };
  const c = config[method] || { icon: CreditCard, color: '#7A6B5D', bg: '#F5F0E8' };
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold" style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}20` }}>
      <Icon size={12} strokeWidth={2.2} />
      {method}
    </span>
  );
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  paid: { bg: '#DCFCE7', text: '#166534', label: 'Paid / Remitted' },
  partial: { bg: '#FEF3C7', text: '#92400E', label: 'Partial' },
  pending: { bg: '#FEE2E2', text: '#991B1B', label: 'Pending / In Transit' },
  failed: { bg: '#F3F4F6', text: '#6B7280', label: 'Failed' },
  refunded: { bg: '#EDE9FE', text: '#4338CA', label: 'Refunded' }
};

interface PaymentFormProps { onClose: () => void; onSave: () => void; }
function PaymentForm({ onClose, onSave }: PaymentFormProps) {
  const { showAlert } = useModal();
  const customers = db.getCustomers();
  const orders = db.getOrders();
  const [form, setForm] = useState({
    customerId: '', orderId: '', amount: 0,
    method: 'Cash on Delivery', status: 'paid' as Payment['status'], date: new Date().toISOString().split('T')[0], notes: ''
  });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    const customer = customers.find(c => c.id === form.customerId);
    if (!customer || !form.amount) { showAlert({ type: 'warning', title: 'Required Fields', message: 'Customer and amount are required.' }); return; }
    const refNum = `PAY-${String(db.getPayments().length + 101).padStart(3, '0')}`;
    db.addPayment({
      reference: refNum, customerId: customer.id, customerName: customer.name,
      orderId: form.orderId || undefined,
      amount: form.amount, method: form.method, status: form.status, date: form.date, notes: form.notes
    });
    onSave();
  };

  const customerOrders = orders.filter(o => o.customerId === form.customerId);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label text-xs font-bold text-[#24201D]">Customer *</label>
        <select className="form-input text-xs" value={form.customerId} onChange={e => { set('customerId', e.target.value); set('orderId', ''); }}>
          <option value="">Select customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
        </select>
      </div>
      {form.customerId && (
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Linked Order (optional)</label>
          <select className="form-input text-xs" value={form.orderId} onChange={e => set('orderId', e.target.value)}>
            <option value="">None</option>
            {customerOrders.map(o => <option key={o.id} value={o.id}>{o.orderId} — ৳{o.total.toLocaleString()}</option>)}
          </select>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Amount (৳) *</label>
          <input type="number" className="form-input text-xs" value={form.amount} onChange={e => set('amount', +e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Payment Method</label>
          <select className="form-input text-xs" value={form.method} onChange={e => set('method', e.target.value)}>
            {['Cash on Delivery', 'Steadfast COD', 'bKash', 'Nagad', 'Cash', 'Bank', 'Card'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Date</label>
          <input type="date" className="form-input text-xs" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs font-bold text-[#24201D]">Status</label>
          <select className="form-input text-xs" value={form.status} onChange={e => set('status', e.target.value as Payment['status'])}>
            {(['paid', 'partial', 'pending', 'failed', 'refunded'] as Payment['status'][]).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="form-label text-xs font-bold text-[#24201D]">Notes</label>
        <input className="form-input text-xs" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. Steadfast Courier COD collection" />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button onClick={onClose} className="px-5 py-2 text-xs font-semibold rounded-xl border border-[#E8E0D4] text-[#7A6B5D]">Cancel</button>
        <button onClick={handleSave} className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-[#720000] hover:bg-[#5a0000]">Record Payment</button>
      </div>
    </div>
  );
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>(db.getPayments());
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [showNew, setShowNew] = useState(false);
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe to live database changes
  useEffect(() => {
    return db.subscribe(() => {
      setPayments(db.getPayments());
      setOrders(db.getOrders());
    });
  }, []);

  const refresh = () => {
    setPayments(db.getPayments());
    setOrders(db.getOrders());
  };

  // Compute breakdown between COD vs other methods
  const codPayments = payments.filter(p => p.method.includes('COD') || p.method.includes('Delivery'));
  const otherMethodPayments = payments.filter(p => !p.method.includes('COD') && !p.method.includes('Delivery'));

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending' || p.status === 'partial').reduce((s, p) => s + p.amount, 0);

  const totalCodCollected = codPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalCodPending = codPayments.filter(p => p.status === 'pending' || p.status === 'partial').reduce((s, p) => s + p.amount, 0);

  const totalOtherPaid = otherMethodPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  // Filter payments
  const filteredPayments = payments.filter(p => {
    if (methodFilter === 'cod') return p.method.includes('COD') || p.method.includes('Delivery');
    if (methodFilter === 'bkash') return p.method.toLowerCase().includes('bkash');
    if (methodFilter === 'nagad') return p.method.toLowerCase().includes('nagad');
    if (methodFilter === 'cash') return p.method.toLowerCase() === 'cash';
    if (methodFilter === 'bank') return p.method.toLowerCase().includes('bank');
    if (methodFilter === 'card') return p.method.toLowerCase().includes('card');
    return true;
  }).filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  }).filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.reference.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q) ||
      (p.orderId && p.orderId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <CreditCard size={20} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#24201D]">Payments & COD Ledger</h1>
              <p className="text-xs text-[#7A6B5D]">
                Cash on Delivery (Steadfast) and digital payments (bKash, Nagad, Bank, Cash)
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#720000] hover:bg-[#5a0000] transition shadow-xs"
        >
          <Plus size={15} /> Record Payment
        </button>
      </div>

      {/* KPI Cards: COD vs Digital Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl p-4 bg-white border border-[#E8E0D4] border-l-4 border-l-emerald-600 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold uppercase text-[#7A6B5D]">Total Received</p>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold tabular-nums text-emerald-800">৳{totalPaid.toLocaleString()}</p>
          <p className="text-[11px] text-[#7A6B5D] mt-0.5">All methods cleared</p>
        </div>

        <div className="rounded-xl p-4 bg-white border border-[#E8E0D4] border-l-4 border-l-sky-600 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold uppercase text-sky-800">Cash on Delivery (COD)</p>
            <Truck size={15} className="text-sky-600" />
          </div>
          <p className="text-2xl font-bold tabular-nums text-sky-900">৳{totalCodCollected.toLocaleString()}</p>
          <p className="text-[11px] text-[#7A6B5D] mt-0.5">
            Pending: <span className="font-semibold text-amber-600">৳{totalCodPending.toLocaleString()}</span>
          </p>
        </div>

        <div className="rounded-xl p-4 bg-white border border-[#E8E0D4] border-l-4 border-l-pink-600 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold uppercase text-pink-800">Digital (bKash/Nagad/Bank)</p>
            <Smartphone size={15} className="text-pink-600" />
          </div>
          <p className="text-2xl font-bold tabular-nums text-pink-900">৳{totalOtherPaid.toLocaleString()}</p>
          <p className="text-[11px] text-[#7A6B5D] mt-0.5">Instant prepayment</p>
        </div>

        <div className="rounded-xl p-4 bg-white border border-[#E8E0D4] border-l-4 border-l-amber-500 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold uppercase text-amber-800">Pending / In Transit</p>
            <Clock size={15} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold tabular-nums text-amber-700">৳{totalPending.toLocaleString()}</p>
          <p className="text-[11px] text-[#7A6B5D] mt-0.5">Awaiting courier settlement</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4 mb-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#FAF8F3] rounded-xl border border-[#E8E0D4]">
            {[
              { id: 'all', label: `All Methods (${payments.length})` },
              { id: 'cod', label: `Cash on Delivery / COD (${codPayments.length})` },
              { id: 'bkash', label: 'bKash' },
              { id: 'nagad', label: 'Nagad' },
              { id: 'cash', label: 'Cash' },
              { id: 'bank', label: 'Bank' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMethodFilter(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  methodFilter === m.id
                    ? 'bg-[#720000] text-white shadow-xs'
                    : 'text-[#7A6B5D] hover:text-[#24201D] hover:bg-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs rounded-xl border border-[#E8E0D4] px-3 py-1.5 font-medium text-[#7A6B5D]"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid / Remitted</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <div className="relative min-w-50">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6B5D] pointer-events-none" />
              <input
                type="text"
                placeholder="Search reference, customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
                className="w-full pl-9! pr-3 py-1.5 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E0D4] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Notes / Courier Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D4]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7A6B5D] text-sm">
                    No payment transactions recorded yet. Payments received via POS, Orders, or Manual Entry will be logged here.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => {
                  const s = statusConfig[p.status] || statusConfig.pending;
                  const isCOD = p.method.includes('COD') || p.method.includes('Delivery');
                  return (
                    <tr key={p.id} className={`hover:bg-[#FFFDF5] transition ${isCOD ? 'bg-sky-50/20' : ''}`}>
                      <td className="py-3 px-4 font-mono font-bold text-[#720000]">
                        {p.reference}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#24201D]">
                        {p.customerName}
                      </td>
                      <td className="py-3 px-4">
                        <PaymentMethodBadge method={p.method} />
                      </td>
                      <td className="py-3 px-4 tabular-nums font-bold text-sm text-[#24201D]">
                        ৳{p.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full inline-block" style={{ background: s.bg, color: s.text }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#7A6B5D]">
                        {p.date}
                      </td>
                      <td className="py-3 px-4 text-[#7A6B5D] max-w-xs truncate">
                        {p.notes || (p.orderId ? `Order: ${p.orderId}` : '—')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#E8E0D4]">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#E8E0D4]">
              <h2 className="font-serif text-lg font-bold text-[#24201D]">Record Payment</h2>
              <button onClick={() => setShowNew(false)} className="p-2 rounded-lg hover:bg-gray-100 text-[#7A6B5D]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <PaymentForm onClose={() => setShowNew(false)} onSave={() => { setShowNew(false); refresh(); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

