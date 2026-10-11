import { useState, useMemo, useEffect } from 'react';
import {
  Truck, Upload, Download, FileText, CheckCircle2, Clock, ChevronRight,
  ArrowRight, Package, DollarSign, Zap, AlertCircle, X, ExternalLink, RefreshCw,
  Search, ShieldCheck, Key, Copy, Check, ShieldAlert
} from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { db, Order } from '../lib/db';
import CustomerFraudModal from '../components/ui/CustomerFraudModal';
import FraudBadge from '../components/ui/FraudBadge';
import {
  getSteadfastCredentials,
  checkSteadfastBalance,
  testSteadfastConnection,
  dispatchOrderToSteadfastAPI,
  trackSteadfastStatus,
  checkCustomerFraud,
  SteadfastConsignment
} from '../lib/steadfast';

interface Settlement {
  id: string;
  date: string;
  batchId: string;
  shipments: number;
  totalCOD: number;
  courierFee: number;
  netSettlement: number;
  status: 'settled' | 'pending';
}

interface ReadyOrder {
  orderId: string;
  rawOrder: Order;
  customerName: string;
  address: string;
  phone: string;
  codAmount: number;
  weight: string;
  notes: string;
}

const SETTLEMENTS: Settlement[] = [];

function fmt(n: number) { return '৳' + Math.round(n || 0).toLocaleString('en-IN'); }
function formatDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(36,32,29,0.45)' }}>
      <div className={`bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] w-full ${wide ? 'max-w-3xl' : 'max-w-lg'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E8E0D4' }}>
          <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: '#24201D' }}>{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"><X size={18} style={{ color: '#7A6B5D' }} /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Workflow Flow Diagram ────────────────────────────────────────────────────
function WorkflowDiagram() {
  const steps = [
    { icon: <Package size={20} />, label: 'Henna Royalin', sub: 'Create Order' },
    { icon: <Zap size={20} />, label: '1-Click API', sub: 'Instant Dispatch' },
    { icon: <Truck size={20} />, label: 'Steadfast Pickup', sub: 'Hub Assigned' },
    { icon: <Search size={20} />, label: 'Live Tracking', sub: 'Courier Realtime' },
    { icon: <DollarSign size={20} />, label: 'COD Settlement', sub: 'Bank / Wallet Remit' },
  ];

  return (
    <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: '#E8E0D4' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: '#24201D' }}>
          Automated Courier Workflow
        </h3>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
          API v1 Pipeline Active
        </span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-105" style={{ background: '#FFF5F5', color: '#720000' }}>
                {step.icon}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold" style={{ color: '#24201D' }}>{step.label}</p>
                <p className="text-xs" style={{ color: '#7A6B5D' }}>{step.sub}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight size={18} className="shrink-0 -mt-5" style={{ color: '#D9A900' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Action Cards ─────────────────────────────────────────────────────────────
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  badge?: string;
  badgeColor?: string;
  disabled?: boolean;
}

function ActionCard({ icon, title, description, actionLabel, onAction, badge, badgeColor, disabled }: ActionCardProps) {
  return (
    <div className="bg-white rounded-2xl border p-5 flex flex-col justify-between gap-3 shadow-xs" style={{ borderColor: '#E8E0D4', opacity: disabled ? 0.6 : 1 }}>
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#FFF5F5', color: '#720000' }}>
            {icon}
          </div>
          {badge && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: badgeColor ?? '#F5F0E8', color: '#720000' }}>{badge}</span>
          )}
        </div>
        <h4 className="font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#24201D' }}>{title}</h4>
        <p className="text-sm" style={{ color: '#7A6B5D' }}>{description}</p>
      </div>
      <button
        onClick={disabled ? undefined : onAction}
        disabled={disabled}
        className="py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
        style={{ background: disabled ? '#B8A99A' : '#720000', cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {actionLabel} <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ─── Export Preview Modal ─────────────────────────────────────────────────────
function ExportPreviewModal({ onClose, readyOrders }: { onClose: () => void; readyOrders: ReadyOrder[] }) {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Address', 'COD Amount', 'Weight', 'Notes'];
    const rows = readyOrders.map(o => [o.orderId, o.customerName, o.phone, `"${o.address}"`, o.codAmount, o.weight, `"${o.notes}"`]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'steadfast_orders.csv'; a.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: '#7A6B5D' }}>
        {readyOrders.length} orders ready to ship. Review below before exporting.
      </p>
      <div className="overflow-x-auto rounded-xl border mb-5" style={{ borderColor: '#E8E0D4' }}>
        <table className="data-table" style={{ minWidth: '500px' }}>
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Address</th><th>COD</th><th>Weight</th></tr>
          </thead>
          <tbody>
            {readyOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[#7A6B5D]">
                  No orders currently ready for export.
                </td>
              </tr>
            ) : (
              readyOrders.map(o => (
                <tr key={o.orderId}>
                  <td className="font-mono text-xs font-semibold">{o.orderId}</td>
                  <td className="font-medium">{o.customerName}</td>
                  <td style={{ color: '#7A6B5D' }}>{o.address}</td>
                  <td className="tabular-nums font-semibold">{fmt(o.codAmount)}</td>
                  <td style={{ color: '#7A6B5D' }}>{o.weight}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {exported && (
        <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm" style={{ background: '#DCFCE7', color: '#166534' }}>
          <CheckCircle2 size={16} /> CSV exported successfully! Upload it to the Steadfast portal.
        </div>
      )}
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold border cursor-pointer" style={{ borderColor: '#E8E0D4', color: '#7A6B5D' }}>Close</button>
        <button onClick={handleExport} disabled={readyOrders.length === 0} className="px-5 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-50 cursor-pointer" style={{ background: '#720000' }}>
          <Download size={15} /> Export CSV
        </button>
      </div>
    </div>
  );
}

// ─── Live Track Shipment Modal ────────────────────────────────────────────────
function TrackShipmentModal({ onClose, defaultCode }: { onClose: () => void; defaultCode?: string }) {
  const [trackingInput, setTrackingInput] = useState(defaultCode || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: number; delivery_status?: string; message?: string } | null>(null);

  const handleTrack = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await trackSteadfastStatus(code.trim());
    setLoading(false);
    setResult(res);
  };

  useEffect(() => {
    if (defaultCode) {
      handleTrack(defaultCode);
    }
  }, [defaultCode]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Steadfast Tracking Code or Invoice ID</label>
        <div className="flex gap-2">
          <input
            className="form-input font-mono text-sm"
            placeholder="e.g. SF83920194 or HR-ORD-1001"
            value={trackingInput}
            onChange={e => setTrackingInput(e.target.value)}
          />
          <button
            onClick={() => handleTrack(trackingInput)}
            disabled={loading || !trackingInput.trim()}
            className="px-5 py-2.5 rounded-xl font-bold text-white text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            style={{ background: '#720000' }}
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
            Track
          </button>
        </div>
      </div>

      {result && (
        <div className="p-4 rounded-xl border bg-[#FAF8F3]" style={{ borderColor: '#E8E0D4' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#7A6B5D] uppercase tracking-wider">Status Result:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase bg-[#DCFCE7] text-[#166534]">
              {result.delivery_status || 'In Transit'}
            </span>
          </div>
          <p className="text-xs text-[#24201D] mb-3">{result.message || 'Package is moving towards recipient via Steadfast logistics hub.'}</p>

          <a
            href={`https://steadfast.com.bd/t/${encodeURIComponent(trackingInput.trim())}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#720000] hover:underline"
          >
            View on official Steadfast Tracker <ExternalLink size={12} />
          </a>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button onClick={onClose} className="px-5 py-2 rounded-xl text-xs font-bold text-[#7A6B5D] border cursor-pointer" style={{ borderColor: '#E8E0D4' }}>
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Steadfast() {
  const { showAlert, showConfirm } = useModal();
  const credentials = getSteadfastCredentials();
  const [settlements] = useState<Settlement[]>(SETTLEMENTS);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showFraudModal, setShowFraudModal] = useState(false);
  const [auditPhone, setAuditPhone] = useState('');
  const [auditCustomerName, setAuditCustomerName] = useState('');
  const [selectedTrackingCode, setSelectedTrackingCode] = useState<string>('');
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  // Live Steadfast Balance state
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [orders, setOrders] = useState(db.getOrders());

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setOrders(db.getOrders());
    });
    // Check initial balance
    fetchBalance();
    return unsub;
  }, []);

  const fetchBalance = async () => {
    setCheckingBalance(true);
    const res = await checkSteadfastBalance();
    setCheckingBalance(false);
    if (res.status === 200 && res.current_balance !== undefined) {
      setWalletBalance(res.current_balance);
    }
  };

  const readyOrders = useMemo<ReadyOrder[]>(() => {
    return orders
      .filter(o => o.orderStatus === 'confirmed' || o.orderStatus === 'processing' || (o.deliveryStatus !== 'shipped' && o.deliveryStatus !== 'delivered' && o.orderStatus !== 'cancelled'))
      .map(o => ({
        orderId: o.orderId || o.id,
        rawOrder: o,
        customerName: o.customerName || 'Customer',
        address: o.deliveryAddress || 'Address not specified',
        phone: o.customerPhone || '—',
        codAmount: Math.round(o.total || 0),
        weight: '0.5kg',
        notes: (o.items || []).map(it => `${it.productName} (${it.quantity})`).join(', ') || 'Henna Products'
      }));
  }, [orders]);

  const dispatchedOrders = useMemo(() => {
    return orders.filter(o => o.steadfastTrackingCode || o.steadfastConsignmentId || o.deliveryStatus === 'shipped');
  }, [orders]);

  const codSummary = {
    total: settlements.reduce((s, x) => s + x.totalCOD, 0),
    settled: settlements.filter(x => x.status === 'settled').reduce((s, x) => s + x.netSettlement, 0),
    pending: settlements.filter(x => x.status === 'pending').reduce((s, x) => s + x.totalCOD, 0),
    fees: settlements.reduce((s, x) => s + x.courierFee, 0),
  };

  // Cancel & Restock Dispatched Shipment
  const handleCancelDispatchedShipment = async (order: Order) => {
    const tracking = order.steadfastTrackingCode || order.orderId;
    const confirmed = await showConfirm({
      title: 'Cancel Shipment & Restock?',
      message: `Do you want to cancel Order #${order.orderId} (Tracking: ${tracking})?\n\n⚠️ IMPORTANT STEADFAST POLICY:\nSteadfast Courier\'s API does NOT provide an automatic cancellation endpoint once a consignment is booked.\n\nCancelling here will:\n1. Immediately restock items back into your inventory.\n2. Mark the order as Cancelled in Henna Royalin.\n\nTo avoid courier pickup fees or accidental delivery, please also cancel/hold consignment ${tracking} in your Steadfast Portal (portal.steadfast.com.bd) or tell your pickup rider.`
    });

    if (!confirmed) return;

    db.cancelOrder(order.id, 'Cancelled via Steadfast Hub');
    setOrders(db.getOrders());
    showAlert({
      type: 'warning',
      title: 'Order Cancelled & Restocked',
      message: `Order #${order.orderId} cancelled and items returned to stock. Remember to mark consignment ${tracking} cancelled in your Steadfast Merchant Portal!`
    });
  };

  // 1-Click Direct API Dispatch Handler
  const handleDirectApiDispatch = async (readyOrder: ReadyOrder) => {
    setDispatchingId(readyOrder.orderId);
    try {
      const result = await dispatchOrderToSteadfastAPI(readyOrder.rawOrder);
      setDispatchingId(null);

      if (result.success && result.consignment) {
        showAlert({
          type: 'success',
          title: 'Order Dispatched to Steadfast!',
          message: `Consignment created successfully! Tracking code: ${result.consignment.tracking_code}. Consignment ID: ${result.consignment.consignment_id}`
        });
        setOrders(db.getOrders());
      } else {
        showAlert({
          type: 'error',
          title: 'Steadfast Dispatch Notice',
          message: result.message || 'Could not complete dispatch.'
        });
      }
    } catch (err: any) {
      setDispatchingId(null);
      showAlert({
        type: 'error',
        title: 'Dispatch Failed',
        message: err?.message || 'Error communicating with Steadfast API.'
      });
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 md:p-8" style={{ background: '#FAF8F3' }}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between mb-6 gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1a1a2e' }}>
                <Truck size={20} style={{ color: '#00c2e0' }} />
              </div>
              <span className="text-2xl font-black tracking-tight" style={{ color: '#1a1a2e', fontFamily: "'Manrope', sans-serif" }}>
                stead<span style={{ color: '#00c2e0' }}>fast</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live API Mode Connected
            </div>
          </div>
          <p className="text-sm" style={{ color: '#7A6B5D' }}>
            Official Steadfast Courier Hub for Henna Royalin · Direct Automated API Dispatch
          </p>
        </div>

        {/* Live Merchant Credentials & Balance Widget */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white p-3 rounded-2xl border shadow-xs" style={{ borderColor: '#E8E0D4' }}>
          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#7A6B5D] uppercase">
              <ShieldCheck size={13} className="text-[#166534]" />
              API Key: <code className="font-mono text-[#24201D] font-bold lowercase">{credentials.apiKey.slice(0, 10)}...</code>
            </div>
            <div className="text-xs font-semibold text-[#24201D] mt-0.5">
              Available COD Balance: <strong className="text-[#166534] text-sm tabular-nums">৳{walletBalance !== null ? walletBalance.toLocaleString() : '—'}</strong>
            </div>
          </div>
          <button
            onClick={fetchBalance}
            disabled={checkingBalance}
            title="Refresh Steadfast Balance"
            className="p-2 rounded-xl border hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: '#E8E0D4' }}
          >
            <RefreshCw size={14} className={checkingBalance ? 'animate-spin text-[#720000]' : 'text-[#7A6B5D]'} />
          </button>
        </div>
      </div>

      {/* Workflow */}
      <WorkflowDiagram />

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <ActionCard
          icon={<ShieldAlert size={22} className="text-red-700" />}
          title="Fake Buyer Shield"
          description="Detect serial returners, fake customers & courier fraud reports in real-time."
          actionLabel="Audit Any Phone"
          onAction={() => { setAuditPhone(''); setAuditCustomerName(''); setShowFraudModal(true); }}
          badge="Live API"
          badgeColor="#FEE2E2"
        />
        <ActionCard
          icon={<Zap size={22} />}
          title="Live API Dispatch"
          description="Send ready orders to Steadfast in 1 click. Generates instant consignment & tracking ID."
          actionLabel="View Ready Orders"
          onAction={() => document.getElementById('ready-orders-section')?.scrollIntoView({ behavior: 'smooth' })}
          badge={`${readyOrders.length} Ready`}
          badgeColor="#DCFCE7"
        />
        <ActionCard
          icon={<Search size={22} />}
          title="Track Any Shipment"
          description="Look up real-time delivery status, hub arrival, and customer delivery confirmation."
          actionLabel="Open Live Tracker"
          onAction={() => { setSelectedTrackingCode(''); setShowTrackModal(true); }}
        />
        <ActionCard
          icon={<Download size={22} />}
          title="Bulk CSV Export"
          description="Export orders as CSV for manual bulk submission or archival backup."
          actionLabel="Export CSV"
          onAction={() => setShowExportModal(true)}
        />
        <ActionCard
          icon={<FileText size={22} />}
          title="Settlement Records"
          description="View COD payout batches, courier fees deducted, and net remittance status."
          actionLabel="View Settlements"
          onAction={() => document.getElementById('settlements-section')?.scrollIntoView({ behavior: 'smooth' })}
        />
      </div>

      {/* COD Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total COD Dispatched', value: fmt(orders.filter(o => o.steadfastStatus === 'in_transit' || o.deliveryStatus === 'shipped').reduce((sum, o) => sum + (o.paymentMethod === 'COD' ? o.total : 0), 0)), color: '#24201D', bg: 'white' },
          { label: 'Net Settled', value: fmt(codSummary.settled), color: '#166534', bg: '#DCFCE7' },
          { label: 'Pending Settlement', value: fmt(codSummary.pending), color: '#92400E', bg: '#FEF3C7' },
          { label: 'Estimated Courier Fees', value: fmt(dispatchedOrders.length * 70), color: '#991B1B', bg: '#FEE2E2' },
        ].map(card => (
          <div key={card.label} className="rounded-2xl border p-5 shadow-xs" style={{ background: card.bg, borderColor: '#E8E0D4' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: card.color, opacity: 0.7 }}>{card.label}</p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Ready for Steadfast API Dispatch */}
      <div id="ready-orders-section" className="bg-white rounded-2xl border overflow-hidden mb-8 shadow-xs" style={{ borderColor: '#E8E0D4' }}>
        <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3" style={{ borderColor: '#E8E0D4' }}>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: '#24201D' }}>
                Orders Ready for Steadfast Dispatch
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-[#720000] border border-red-200">
                {readyOrders.length} Pending
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: '#7A6B5D' }}>
              Confirmed orders ready for 1-click transmission to Steadfast Courier API
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#720000] border cursor-pointer hover:bg-gray-50"
              style={{ borderColor: '#E8E0D4' }}
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table" style={{ minWidth: '780px' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Address</th>
                <th>COD Amount</th>
                <th>Items / Notes</th>
                <th className="text-right">Dispatch via API</th>
              </tr>
            </thead>
            <tbody>
              {readyOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-sm" style={{ color: '#7A6B5D' }}>
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 size={24} />
                    </div>
                    All confirmed orders have been dispatched to Steadfast Courier!
                  </td>
                </tr>
              ) : (
                readyOrders.map(o => (
                  <tr key={o.orderId} className="hover:bg-[#FAF8F3]/50 transition-colors">
                    <td className="font-mono text-xs font-bold" style={{ color: '#720000' }}>{o.orderId}</td>
                    <td className="font-semibold text-[#24201D]">{o.customerName}</td>
                    <td className="font-mono text-xs text-[#24201D]">
                      <div className="flex items-center gap-1.5">
                        <span>{o.phone}</span>
                        <FraudBadge phone={o.phone} customerName={o.customerName} />
                      </div>
                    </td>
                    <td className="text-xs max-w-xs truncate" style={{ color: '#7A6B5D' }} title={o.address}>{o.address}</td>
                    <td className="tabular-nums font-bold text-[#720000]">{fmt(o.codAmount)}</td>
                    <td className="text-xs max-w-xs truncate" style={{ color: '#7A6B5D' }}>{o.notes || '—'}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDirectApiDispatch(o)}
                        disabled={dispatchingId === o.orderId}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:opacity-90 disabled:opacity-50"
                        style={{ background: '#720000' }}
                      >
                        {dispatchingId === o.orderId ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Dispatching...
                          </>
                        ) : (
                          <>
                            <Zap size={13} className="text-[#D9A900]" />
                            Dispatch to Courier
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t flex flex-wrap items-center justify-between gap-2" style={{ borderColor: '#E8E0D4', background: '#FAF8F3' }}>
          <span className="text-sm font-medium" style={{ color: '#7A6B5D' }}>
            {readyOrders.length} orders · Total COD to collect: <strong style={{ color: '#720000' }}>{fmt(readyOrders.reduce((s, o) => s + o.codAmount, 0))}</strong>
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#166534] font-semibold">
            <ShieldCheck size={14} />
            Direct API dispatch assigns live tracking codes to customer orders immediately.
          </div>
        </div>
      </div>

      {/* Dispatched Orders & Live Tracking Codes */}
      <div className="bg-white rounded-2xl border overflow-hidden mb-8 shadow-xs" style={{ borderColor: '#E8E0D4' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8E0D4' }}>
          <div>
            <h3 className="font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: '#24201D' }}>
              Steadfast Dispatched Shipments
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#7A6B5D' }}>
              Orders currently with Steadfast Courier with tracking numbers
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
            {dispatchedOrders.length} Shipments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table" style={{ minWidth: '700px' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Recipient</th>
                <th>Tracking Code</th>
                <th>Consignment ID</th>
                <th>Status</th>
                <th>COD Value</th>
                <th className="text-right">Live Tracker</th>
              </tr>
            </thead>
            <tbody>
              {dispatchedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm" style={{ color: '#7A6B5D' }}>
                    No shipments dispatched yet. Use "Dispatch to Courier" above to send orders to Steadfast.
                  </td>
                </tr>
              ) : (
                dispatchedOrders.map(o => (
                  <tr key={o.id}>
                    <td className="font-mono text-xs font-bold" style={{ color: '#720000' }}>{o.orderId}</td>
                    <td className="font-medium text-[#24201D]">
                      <div className="flex items-center gap-1.5">
                        <span>{o.customerName}</span>
                        {o.customerPhone && <FraudBadge phone={o.customerPhone} customerName={o.customerName} compact />}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                        {o.steadfastTrackingCode || 'Pending'}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-[#7A6B5D]">{o.steadfastConsignmentId || '—'}</td>
                    <td>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase bg-green-50 text-green-700">
                        {o.steadfastStatus || 'In Transit'}
                      </span>
                    </td>
                    <td className="tabular-nums font-bold">{fmt(o.total)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => {
                            setSelectedTrackingCode(o.steadfastTrackingCode || o.orderId);
                            setShowTrackModal(true);
                          }}
                          className="text-xs font-bold text-[#720000] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Search size={12} /> Track Live
                        </button>
                        {o.orderStatus !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelDispatchedShipment(o)}
                            className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 cursor-pointer"
                            title="Cancel in Henna Royalin & Restock Products"
                          >
                            <X size={12} /> Cancel & Restock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancellation Notice Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-xs">
        <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold block text-sm mb-0.5 text-amber-950">
            Important Policy: Steadfast Consignment Cancellations
          </strong>
          Steadfast Courier’s API does <strong>not</strong> provide an automated API endpoint for cancelling consignments once created.
          If an order is cancelled or a customer rejects it:
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            <li>Cancelling in Henna Royalin automatically restocks all products and cones back to inventory.</li>
            <li>To prevent courier charges or rider collection, you must also cancel or hold the consignment directly on the <a href="https://portal.steadfast.com.bd" target="_blank" rel="noopener noreferrer" className="font-bold underline text-amber-950 hover:text-black">Steadfast Merchant Portal</a> before the parcel is picked up.</li>
          </ul>
        </div>
      </div>

      {/* Settlement Records */}
      <div id="settlements-section" className="bg-white rounded-2xl border overflow-hidden mb-8 shadow-xs" style={{ borderColor: '#E8E0D4' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8E0D4' }}>
          <div>
            <h3 className="font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: '#24201D' }}>Steadfast Settlement Records</h3>
            <p className="text-xs mt-0.5" style={{ color: '#7A6B5D' }}>COD payouts received and pending remittances</p>
          </div>
          <button onClick={fetchBalance} className="flex items-center gap-1.5 text-xs font-bold text-[#720000] cursor-pointer">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table" style={{ minWidth: '620px' }}>
            <thead>
              <tr>
                <th>Settlement Date</th>
                <th>Batch ID</th>
                <th>Shipments</th>
                <th>Total COD</th>
                <th>Courier Fee</th>
                <th>Net Settlement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {settlements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm" style={{ color: '#7A6B5D' }}>
                    No settlement records found. Completed Steadfast courier deliveries and COD remittances will appear here automatically.
                  </td>
                </tr>
              ) : (
                settlements.map(s => (
                  <tr key={s.id}>
                    <td>{formatDate(s.date)}</td>
                    <td className="font-mono text-xs font-semibold">{s.batchId}</td>
                    <td className="tabular-nums">{s.shipments}</td>
                    <td className="tabular-nums font-semibold">{fmt(s.totalCOD)}</td>
                    <td className="tabular-nums text-red-600">{fmt(s.courierFee)}</td>
                    <td className="tabular-nums font-bold text-green-700">{fmt(s.netSettlement)}</td>
                    <td>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.status === 'settled' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {s.status === 'settled' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {s.status === 'settled' ? 'Settled' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showExportModal && (
        <Modal title="Export Orders for Steadfast" onClose={() => setShowExportModal(false)} wide>
          <ExportPreviewModal onClose={() => setShowExportModal(false)} readyOrders={readyOrders} />
        </Modal>
      )}

      {showTrackModal && (
        <Modal title="Track Steadfast Courier Shipment" onClose={() => setShowTrackModal(false)}>
          <TrackShipmentModal onClose={() => setShowTrackModal(false)} defaultCode={selectedTrackingCode} />
        </Modal>
      )}

      {showFraudModal && (
        <CustomerFraudModal
          initialPhone={auditPhone}
          customerName={auditCustomerName}
          onClose={() => setShowFraudModal(false)}
        />
      )}
    </div>
  );
}
