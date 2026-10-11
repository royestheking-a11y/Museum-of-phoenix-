import { useState, useMemo, useEffect } from 'react';
import {
  Users, Search, Phone, MapPin, ShoppingBag, TrendingUp,
  Package, Star, Clock, ArrowRight, BadgeCheck,
  Repeat, Hash, X, ChevronRight, Inbox
} from 'lucide-react';
import { db, Customer, Order } from '../lib/db';

// ─── Helpers ────────────────────────────────────────────────────────────────

const statusColors: Record<string, { bg: string; text: string }> = {
  new: { bg: '#EFF6FF', text: '#1D4ED8' },
  confirmed: { bg: '#EDE9FE', text: '#5B21B6' },
  processing: { bg: '#F3E8FF', text: '#7C3AED' },
  shipped: { bg: '#FEF3C7', text: '#92400E' },
  delivered: { bg: '#DCFCE7', text: '#166534' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  returned: { bg: '#F3F4F6', text: '#4B5563' },
};

function orderStatusBadge(status: string) {
  const c = statusColors[status] || { bg: '#F3F4F6', text: '#4B5563' };
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

// Tag chip based on order count
function LeadTag({ count }: { count: number }) {
  if (count >= 5) return (
    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#FBF0C4', color: '#92400E' }}>
      <Star size={9} /> VIP
    </span>
  );
  if (count >= 2) return (
    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#DCFCE7', color: '#166534' }}>
      <Repeat size={9} /> Repeat
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#92400E' }}>
      <BadgeCheck size={9} /> New Lead
    </span>
  );
}

// ─── Derived customer from orders ────────────────────────────────────────────

interface DerivedCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  source: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  firstOrderDate: string;
  orders: Order[];
  // From saved customer record (may have notes/email)
  email?: string;
  notes?: string;
  tags: string[];
}

function buildDerivedCustomers(orders: Order[], savedCustomers: Customer[]): DerivedCustomer[] {
  // Group orders by phone number
  const map = new Map<string, Order[]>();
  for (const o of orders) {
    const phone = o.customerPhone.trim();
    if (!phone) continue;
    if (!map.has(phone)) map.set(phone, []);
    map.get(phone)!.push(o);
  }

  const result: DerivedCustomer[] = [];
  map.forEach((ords, phone) => {
    const sorted = [...ords].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const latest = sorted[0];
    const oldest = sorted[sorted.length - 1];
    const totalSpent = ords.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + o.total, 0);
    const saved = savedCustomers.find(c => c.phone === phone);
    const count = ords.length;

    const tags: string[] = [];
    if (count >= 5) tags.push('VIP');
    else if (count >= 2) tags.push('Repeat');
    else tags.push('New');

    result.push({
      id: saved?.id || latest.customerId || phone,
      name: saved?.name || latest.customerName,
      phone,
      address: saved?.address || latest.deliveryAddress || '',
      city: saved?.city || latest.city || 'Dhaka',
      source: latest.source || 'WhatsApp',
      totalOrders: count,
      totalSpent,
      lastOrderDate: latest.createdAt.split('T')[0],
      firstOrderDate: oldest.createdAt.split('T')[0],
      orders: sorted,
      email: saved?.email,
      notes: saved?.notes,
      tags,
    });
  });

  // Sort by most total spent
  return result.sort((a, b) => b.totalSpent - a.totalSpent);
}

// ─── Customer Detail Panel ───────────────────────────────────────────────────

function CustomerDetail({ c, onBack }: { c: DerivedCustomer; onBack: () => void }) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity"
        style={{ color: '#720000' }}
      >
        ← Back to Customers
      </button>

      {/* Header card */}
      <div
        className="rounded-2xl p-6 flex items-start gap-5"
        style={{ background: 'linear-gradient(135deg, #720000 0%, #4A0000 100%)', color: 'white' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          {c.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-serif text-xl font-bold">{c.name}</h1>
            <LeadTag count={c.totalOrders} />
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-sm opacity-90">
            <span className="flex items-center gap-1.5"><Phone size={13} /> {c.phone}</span>
            {c.address && <span className="flex items-center gap-1.5"><MapPin size={13} /> {c.address}{c.city ? `, ${c.city}` : ''}</span>}
            {c.email && <span>{c.email}</span>}
          </div>
          <div className="flex flex-wrap gap-3 mt-2 text-xs opacity-75">
            <span>First order: {c.firstOrderDate}</span>
            <span>Last order: {c.lastOrderDate}</span>
            <span>Source: {c.source}</span>
          </div>
        </div>
        {/* Stats */}
        <div className="flex gap-4 shrink-0">
          {[
            { label: 'Orders', value: c.totalOrders, icon: ShoppingBag },
            { label: 'Spent', value: `৳${c.totalSpent.toLocaleString()}`, icon: TrendingUp },
          ].map(s => (
            <div key={s.label} className="text-center" style={{ background: 'rgba(255,255,255,0.12)', padding: '12px 18px', borderRadius: 12 }}>
              <s.icon size={18} className="mx-auto mb-1 opacity-80" />
              <p className="text-lg font-bold tabular-nums">{s.value}</p>
              <p className="text-[11px] opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {c.notes && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: '#FBF0C4', border: '1px solid #D9A900', color: '#92400E' }}>
          <span className="font-bold">Note: </span>{c.notes}
        </div>
      )}

      {/* Orders list */}
      <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E8E0D4', boxShadow: '0 2px 16px rgba(114,0,0,0.05)' }}>
        <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid #E8E0D4', background: '#FAF8F3' }}>
          <ShoppingBag size={15} style={{ color: '#720000' }} />
          <p className="font-semibold text-sm" style={{ color: '#24201D' }}>All Orders ({c.orders.length})</p>
        </div>
        {c.orders.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: '#B8A99A' }}>No orders found</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Delivery</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {c.orders.map(o => (
                <tr key={o.id}>
                  <td className="font-mono text-xs font-bold" style={{ color: '#720000' }}>{o.orderId}</td>
                  <td className="text-sm">
                    {o.items.map(i => `${i.quantity}× ${i.productName}`).join(', ')}
                  </td>
                  <td className="tabular-nums font-bold text-sm">৳{o.total.toLocaleString()}</td>
                  <td>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: o.paymentStatus === 'paid' ? '#DCFCE7' : '#FEF3C7', color: o.paymentStatus === 'paid' ? '#166534' : '#92400E' }}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td>{orderStatusBadge(o.orderStatus)}</td>
                  <td className="text-xs capitalize" style={{ color: '#7A6B5D' }}>{o.deliveryStatus}</td>
                  <td className="text-xs" style={{ color: '#7A6B5D' }}>{o.createdAt.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Customers({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [allOrders, setAllOrders] = useState<Order[]>(db.getOrders());
  const [savedCustomers, setSavedCustomers] = useState<Customer[]>(db.getCustomers());

  useEffect(() => {
    return db.subscribe(() => {
      setAllOrders(db.getOrders());
      setSavedCustomers(db.getCustomers());
    });
  }, []);

  const customers = useMemo(() => buildDerivedCustomers(allOrders, savedCustomers), [allOrders, savedCustomers]);

  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [selected, setSelected] = useState<DerivedCustomer | null>(null);

  if (selected) {
    return <CustomerDetail c={selected} onBack={() => setSelected(null)} />;
  }

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
    const matchTag = tagFilter === 'all' || c.tags.includes(tagFilter);
    return matchSearch && matchTag;
  });

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const vipCount = customers.filter(c => c.totalOrders >= 5).length;
  const repeatCount = customers.filter(c => c.totalOrders >= 2 && c.totalOrders < 5).length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: '#24201D' }}>Customer Leads</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A6B5D' }}>
            Auto-collected from all orders — {customers.length} unique clients
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Clients', value: customers.length, color: '#720000' },
          { icon: TrendingUp, label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, color: '#D9A900' },
          { icon: Star, label: 'VIP Clients', value: vipCount, color: '#D97706' },
          { icon: Repeat, label: 'Repeat Buyers', value: repeatCount, color: '#166534' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 bg-white flex items-center gap-3" style={{ border: '1px solid #E8E0D4', boxShadow: '0 1px 12px rgba(114,0,0,0.04)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold tabular-nums" style={{ color: '#24201D' }}>{s.value}</p>
              <p className="text-xs" style={{ color: '#7A6B5D' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B8A99A' }} />
          <input
            className="form-input text-sm"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by name, phone, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} style={{ color: '#B8A99A' }} />
            </button>
          )}
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#F5F0E8', border: '1px solid #E8E0D4' }}>
          {['all', 'VIP', 'Repeat', 'New'].map(t => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: tagFilter === t ? '#720000' : 'transparent', color: tagFilter === t ? 'white' : '#7A6B5D' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Customer list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white py-20 text-center" style={{ border: '1px solid #E8E0D4' }}>
          <Inbox size={40} className="mx-auto mb-3 opacity-20" style={{ color: '#720000' }} />
          <p className="text-sm font-semibold" style={{ color: '#7A6B5D' }}>No customers found</p>
          <p className="text-xs mt-1" style={{ color: '#B8A99A' }}>Customers are auto-collected when orders are placed</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E8E0D4', boxShadow: '0 1px 12px rgba(114,0,0,0.04)' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Source</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{
                          background: c.totalOrders >= 5
                            ? 'linear-gradient(135deg, #D9A900, #92400E)'
                            : c.totalOrders >= 2
                              ? 'linear-gradient(135deg, #166534, #14532D)'
                              : '#720000'
                        }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#24201D' }}>{c.name}</p>
                        <LeadTag count={c.totalOrders} />
                      </div>
                    </div>
                  </td>
                  <td className="text-sm font-mono">{c.phone}</td>
                  <td className="text-sm" style={{ color: '#7A6B5D' }}>
                    {c.city || '—'}
                    {c.address && <p className="text-xs truncate max-w-35" title={c.address}>{c.address}</p>}
                  </td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#F5F0E8', color: '#7A6B5D' }}>
                      {c.source}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold tabular-nums text-sm" style={{ color: '#24201D' }}>{c.totalOrders}</span>
                  </td>
                  <td>
                    <span className="font-bold tabular-nums text-sm" style={{ color: '#720000' }}>৳{c.totalSpent.toLocaleString()}</span>
                  </td>
                  <td className="text-xs" style={{ color: '#7A6B5D' }}>{c.lastOrderDate}</td>
                  <td>
                    <div className="flex gap-1">
                      {c.orders.some(o => o.orderStatus === 'delivered') && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#DCFCE7', color: '#166534' }}>Delivered</span>
                      )}
                      {c.orders.some(o => o.orderStatus === 'shipped') && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#FEF3C7', color: '#92400E' }}>In Transit</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <ChevronRight size={15} style={{ color: '#B8A99A' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
