import { useState, useRef, useEffect } from 'react';
import { Settings as SettingsIcon, Building2, Shield, Bell, CreditCard, Truck, Globe, Lock, Database, FileText, ChevronRight, Download, Upload, CheckCircle2, RefreshCw, Cloud, Eye, EyeOff, Zap, Check, AlertCircle } from 'lucide-react';
import { testSteadfastConnection } from '../lib/steadfast';
import hennaLogo from '../imports/Henna_Royalin.png';
import { db } from '../lib/db';
import { useModal } from '../context/ModalContext';

const sections = [
  { id: 'business', label: 'Business Profile', icon: Building2, color: '#720000' },
  { id: 'roles', label: 'Users & Roles', icon: Shield, color: '#4338CA' },
  { id: 'notifications', label: 'Notifications', icon: Bell, color: '#D97706' },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard, color: '#059669' },
  { id: 'delivery', label: 'Delivery & Steadfast', icon: Truck, color: '#0284C7' },
  { id: 'invoice', label: 'Invoice & Quotation', icon: FileText, color: '#7C3AED' },
  { id: 'security', label: 'Security', icon: Lock, color: '#DC2626' },
  { id: 'backup', label: 'Backup & Data', icon: Database, color: '#6B7280' }
];

const permissionMatrix = [
  { module: 'Dashboard', owner: '✓ Full', admin: '✓ Full', manager: '✓ Full', artist: '◉ Limited', accountant: '✓ Full' },
  { module: 'Orders & Invoices', owner: '✓ Full', admin: '✓ Full', manager: '✓ Full', artist: '◎ View', accountant: '✓ Full' },
  { module: 'Customers & Reviews', owner: '✓ Full', admin: '✓ Full', manager: '✓ Full', artist: '◉ Assigned', accountant: '◎ View' },
  { module: 'Products & Portfolio', owner: '✓ Full', admin: '✓ Full', manager: '✓ Full', artist: '◎ View', accountant: '◎ View' },
  { module: 'Production & Costing', owner: '✓ Full', admin: '✓ Full', manager: '✓ Full', artist: '— None', accountant: '✓ Full' },
  { module: 'Inventory & Stock', owner: '✓ Full', admin: '✓ Full', manager: '◉ View+', artist: '— None', accountant: '◎ View' },
  { module: 'Suppliers & Purchases', owner: '✓ Full', admin: '✓ Full', manager: '◉ View+', artist: '— None', accountant: '✓ Full' },
  { module: 'Delivery & Logistics', owner: '✓ Full', admin: '✓ Full', manager: '✓ Full', artist: '— None', accountant: '◎ View' },
  { module: 'Payments & Expenses', owner: '✓ Full', admin: '✓ Full', manager: '◉ View+', artist: '— None', accountant: '✓ Full' },
  { module: 'Reports & Analytics', owner: '✓ Full', admin: '✓ Full', manager: '◉ Limited', artist: '— None', accountant: '✓ Full' },
  { module: 'Settings & Audit', owner: '✓ Full', admin: '◉ Limited', manager: '— None', artist: '— None', accountant: '— None' }
];

export default function Settings() {
  const { showAlert, showConfirm } = useModal();
  const initialSettings = db.getSettings();
  const [activeSection, setActiveSection] = useState('business');
  const [businessName, setBusinessName] = useState(initialSettings.businessName || 'Henna Royalin');
  const [cloudStatus, setCloudStatus] = useState(db.getCloudStatus());
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [cloudSuccessMsg, setCloudSuccessMsg] = useState<string | null>(null);

  const [ownerName, setOwnerName] = useState(initialSettings.ownerName || 'Sumaiya Jabin');
  const [phone, setPhone] = useState(initialSettings.phone || '+880 1711-000001');
  const [email, setEmail] = useState(initialSettings.email || 'info@hennaroyalin.com');
  const [location, setLocation] = useState(initialSettings.location || 'Dhaka & Narayanganj, Bangladesh');
  const [currency, setCurrency] = useState(initialSettings.currency || 'BDT (৳)');
  const [saved, setSaved] = useState(false);

  // Payment methods state
  const [bkashNumber, setBkashNumber] = useState(initialSettings.bkashNumber || '01711-000001 (Merchant)');
  const [nagadNumber, setNagadNumber] = useState(initialSettings.nagadNumber || '01812-000002 (Personal)');
  const [bankAccount, setBankAccount] = useState(initialSettings.bankAccount || 'City Bank Ltd · A/C: 11029384910 · Gulshan Branch');

  // Steadfast delivery settings
  const [sfApiKey, setSfApiKey] = useState(initialSettings.sfApiKey && initialSettings.sfApiKey !== 'sf_live_a89f92e8c92a' ? initialSettings.sfApiKey : 'hbojkpmdxbxti3pmkgros8hou0huz5xc');
  const [sfSecretKey, setSfSecretKey] = useState(initialSettings.sfSecretKey && !initialSettings.sfSecretKey.includes('•') ? initialSettings.sfSecretKey : 'xv0nqm9s58rycuqsxrkkh4wu');
  const [showSfSecret, setShowSfSecret] = useState(false);
  const [testingSf, setTestingSf] = useState(false);
  const [sfTestResult, setSfTestResult] = useState<{ success: boolean; message: string; balance?: number } | null>(null);
  const [dhakaRate, setDhakaRate] = useState(initialSettings.dhakaRate || 70);
  const [outsideDhakaRate, setOutsideDhakaRate] = useState(initialSettings.outsideDhakaRate || 120);

  // Invoice settings
  const [invPrefix, setInvPrefix] = useState(initialSettings.invPrefix || 'HR-INV-');
  const [qtPrefix, setQtPrefix] = useState(initialSettings.qtPrefix || 'QT-2026-');
  const [aftercareText, setAftercareText] = useState(initialSettings.aftercareText || 'Leave mehendi paste for at least 4-6 hours. Scrape off gently without water. Apply coconut or mustard oil for rich dark stain.');

  useEffect(() => {
    const unsubCloud = db.subscribeCloudStatus(setCloudStatus);
    const unsubDB = db.subscribe(() => {
      const s = db.getSettings();
      if (s) {
        if (s.businessName) setBusinessName(s.businessName);
        if (s.ownerName) setOwnerName(s.ownerName);
        if (s.phone) setPhone(s.phone);
        if (s.email) setEmail(s.email);
        if (s.location) setLocation(s.location);
        if (s.currency) setCurrency(s.currency);
        if (s.bkashNumber) setBkashNumber(s.bkashNumber);
        if (s.nagadNumber) setNagadNumber(s.nagadNumber);
        if (s.bankAccount) setBankAccount(s.bankAccount);
        if (s.sfApiKey) setSfApiKey(s.sfApiKey);
        if (s.sfSecretKey) setSfSecretKey(s.sfSecretKey);
        if (s.dhakaRate) setDhakaRate(s.dhakaRate);
        if (s.outsideDhakaRate) setOutsideDhakaRate(s.outsideDhakaRate);
        if (s.invPrefix) setInvPrefix(s.invPrefix);
        if (s.qtPrefix) setQtPrefix(s.qtPrefix);
        if (s.aftercareText) setAftercareText(s.aftercareText);
      }
    });
    return () => {
      unsubCloud();
      unsubDB();
    };
  }, []);

  const handleSyncToCloudNow = async () => {
    try {
      setSyncingCloud(true);
      await db.syncAllToCloud();
      setCloudSuccessMsg('All local operational data successfully synced to Google Cloud Firestore!');
      setTimeout(() => setCloudSuccessMsg(null), 4000);
    } catch (err: any) {
      showAlert({ type: 'error', title: 'Cloud Sync Notice', message: err?.message || 'Sync failed. Will automatically retry.' });
    } finally {
      setSyncingCloud(false);
    }
  };

  // Backup file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  const handleSave = () => {
    db.saveSettings({
      businessName,
      ownerName,
      phone,
      email,
      location,
      currency,
      bkashNumber,
      nagadNumber,
      bankAccount,
      sfApiKey,
      sfSecretKey,
      dhakaRate,
      outsideDhakaRate,
      invPrefix,
      qtPrefix,
      aftercareText
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = db.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `henna_royalin_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatus('Backup downloaded successfully!');
    setTimeout(() => setBackupStatus(null), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = db.importBackupJSON(content);
      if (res.success) {
        showAlert({ type: 'success', title: 'Backup Restored!', message: 'Data successfully restored from backup! The app will refresh now.' }).then(() => window.location.reload());
      } else {
        showAlert({ type: 'error', title: 'Invalid Backup File', message: 'Invalid backup file: ' + res.error });
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const orders = db.getOrders();
    let csv = 'Order ID,Customer,Phone,Total,Payment,Delivery,Status,Date\n';
    orders.forEach(o => {
      csv += `"${o.orderId}","${o.customerName}","${o.customerPhone}",${o.total},"${o.paymentMethod}","${o.deliveryStatus}","${o.orderStatus}","${o.createdAt}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `henna_royalin_orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = async () => {
    const confirmed = await showConfirm({ title: 'Clear All Data?', message: 'Are you sure you want to clear all data to a clean slate? All orders, products, inventory, production, customer, and financial records will be wiped. Your admin account will be preserved.', confirmText: 'Yes, Clear All Data', cancelText: 'Cancel', type: 'error' });
    if (confirmed) {
      await db.clearAllData();
      showAlert({ type: 'success', title: 'Data Cleared', message: 'All demo and operational data has been wiped from local cache and Cloud Firestore. Starting with a 100% fresh clean slate.' }).then(() => window.location.reload());
    }
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold" style={{ color: '#24201D' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: '#7A6B5D' }}>Manage your business configuration, credentials, and data</p>
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="sm:col-span-1 rounded-2xl bg-white overflow-hidden" style={{ border: '1px solid #E8E0D4', height: 'fit-content' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors" style={{
              background: activeSection === s.id ? `${s.color}08` : 'transparent',
              borderLeft: activeSection === s.id ? `3px solid ${s.color}` : '3px solid transparent',
              borderBottom: '1px solid #F0EBE3'
            }}>
              <div className="flex items-center gap-3">
                <s.icon size={16} style={{ color: activeSection === s.id ? s.color : '#7A6B5D' }} />
                <span className="text-sm font-semibold" style={{ color: activeSection === s.id ? s.color : '#24201D' }}>{s.label}</span>
              </div>
              <ChevronRight size={14} style={{ color: '#B8A99A' }} />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="sm:col-span-3">
          {/* Business Profile */}
          {activeSection === 'business' && (
            <div className="rounded-2xl bg-white p-6" style={{ border: '1px solid #E8E0D4' }}>
              <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid #E8E0D4' }}>
                <img src={hennaLogo} alt="Henna Royalin" className="w-20 h-20 object-contain rounded-xl" style={{ border: '1px solid #E8E0D4', padding: 8, background: '#FAF8F3' }} />
                <div>
                  <h2 className="font-serif text-xl font-bold" style={{ color: '#24201D' }}>Henna Royalin</h2>
                  <p className="text-sm" style={{ color: '#7A6B5D' }}>Mehendi Artist • Organic Mehendi • Nail Tint • Hair Mehendi</p>
                  <p className="text-xs mt-1 font-bold" style={{ color: '#D9A900' }}>Since 2019 · Dhaka & Narayanganj</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="form-label">Business Name</label><input className="form-input" value={businessName} onChange={e => setBusinessName(e.target.value)} /></div>
                <div><label className="form-label">Owner / Artist Name</label><input className="form-input" value={ownerName} onChange={e => setOwnerName(e.target.value)} /></div>
                <div><label className="form-label">Phone</label><input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} /></div>
                <div><label className="form-label">Email</label><input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="sm:col-span-2"><label className="form-label">Business Location</label><input className="form-input" value={location} onChange={e => setLocation(e.target.value)} /></div>
                <div><label className="form-label">Currency</label><select className="form-input" value={currency} onChange={e => setCurrency(e.target.value)}><option>BDT (৳)</option><option>USD ($)</option></select></div>
                <div><label className="form-label">Trade License / Tax No</label><input className="form-input" placeholder="TR-DHK-2019-8472" defaultValue="TR-DHK-2019-8472" /></div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div>{saved && <span className="text-sm font-semibold text-green-600">✓ Changes saved successfully</span>}</div>
                <button onClick={handleSave} className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white" style={{ background: '#720000' }}>Save Changes</button>
              </div>
            </div>
          )}

          {/* Users & Roles */}
          {activeSection === 'roles' && (
            <div className="rounded-2xl bg-white overflow-hidden" style={{ border: '1px solid #E8E0D4' }}>
              <div className="px-6 py-4" style={{ borderBottom: '1px solid #E8E0D4' }}>
                <h2 className="font-serif text-lg font-bold" style={{ color: '#24201D' }}>Role & Permission Matrix</h2>
                <p className="text-xs mt-0.5" style={{ color: '#7A6B5D' }}>✓ Full access · ◉ Limited · ◎ View only · — No access</p>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Module</th>
                      {['Owner', 'Admin', 'Manager', 'Artist', 'Accountant'].map(r => (
                        <th key={r}><span className="text-xs font-bold uppercase" style={{ color: '#7A6B5D' }}>{r}</span></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionMatrix.map(row => (
                      <tr key={row.module}>
                        <td className="font-semibold text-sm" style={{ color: '#24201D' }}>{row.module}</td>
                        {[row.owner, row.admin, row.manager, row.artist, row.accountant].map((v, i) => (
                          <td key={i}><span className="text-xs font-medium" style={{ color: v.startsWith('✓') ? '#166534' : v.startsWith('◉') ? '#92400E' : v.startsWith('◎') ? '#1E40AF' : '#9CA3AF' }}>{v}</span></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {activeSection === 'payments' && (
            <div className="rounded-2xl bg-white p-6" style={{ border: '1px solid #E8E0D4' }}>
              <h2 className="font-serif text-lg font-bold mb-1" style={{ color: '#24201D' }}>Payment Gateways & Accounts</h2>
              <p className="text-xs text-[#7A6B5D] mb-5">Configure accounts used for advance bookings, orders, and POS transactions</p>
              <div className="space-y-4">
                <div>
                  <label className="form-label">bKash Merchant / Personal Number</label>
                  <input className="form-input" value={bkashNumber} onChange={e => setBkashNumber(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Nagad Account</label>
                  <input className="form-input" value={nagadNumber} onChange={e => setNagadNumber(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Bank Settlement Details</label>
                  <input className="form-input" value={bankAccount} onChange={e => setBankAccount(e.target.value)} />
                </div>
                <div className="rounded-xl p-4 bg-[#FAF8F3] border border-[#E8E0D4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#24201D]">Cash on Delivery (COD)</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-700">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#24201D]">Steadfast COD Settlement</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-700">Active</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={handleSave} className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white" style={{ background: '#720000' }}>Save Payment Settings</button>
              </div>
            </div>
          )}

          {/* Delivery & Steadfast */}
          {activeSection === 'delivery' && (
            <div className="rounded-2xl bg-white p-6" style={{ border: '1px solid #E8E0D4' }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-serif text-lg font-bold mb-1" style={{ color: '#24201D' }}>Delivery & Steadfast Integration</h2>
                  <p className="text-xs text-[#7A6B5D]">Official Steadfast Courier API credentials and automated shipping configuration</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live API Configured
                </div>
              </div>

              <div className="space-y-4">
                {/* API Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="form-label mb-0">Steadfast API Key</label>
                      <span className="text-[10px] font-bold text-[#166534] bg-green-50 px-2 py-0.5 rounded">Live Active</span>
                    </div>
                    <input
                      className="form-input font-mono text-xs"
                      value={sfApiKey}
                      onChange={e => setSfApiKey(e.target.value)}
                      placeholder="hbojkpmdxbxti3pmkgros8hou0huz5xc"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="form-label mb-0">Steadfast Secret Key</label>
                      <button
                        type="button"
                        onClick={() => setShowSfSecret(v => !v)}
                        className="text-[11px] font-bold text-[#720000] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {showSfSecret ? <EyeOff size={12} /> : <Eye size={12} />}
                        {showSfSecret ? 'Hide' : 'Show Key'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        className="form-input font-mono text-xs pr-10"
                        type={showSfSecret ? "text" : "password"}
                        value={sfSecretKey}
                        onChange={e => setSfSecretKey(e.target.value)}
                        placeholder="xv0nqm9s58rycuqsxrkkh4wu"
                      />
                    </div>
                  </div>
                </div>

                {/* Test Connection Button & Result */}
                <div className="p-4 rounded-xl border" style={{ background: '#FAF8F3', borderColor: '#E8E0D4' }}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#24201D]">Test Live Courier Connection</p>
                      <p className="text-[11px] text-[#7A6B5D]">Pings Steadfast Courier endpoint to verify credentials and fetch merchant wallet balance.</p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        setTestingSf(true);
                        setSfTestResult(null);
                        const res = await testSteadfastConnection();
                        setTestingSf(false);
                        setSfTestResult(res);
                      }}
                      disabled={testingSf}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                      style={{ background: '#720000', opacity: testingSf ? 0.7 : 1 }}
                    >
                      {testingSf ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Testing API...
                        </>
                      ) : (
                        <>
                          <Zap size={13} className="text-[#D9A900]" />
                          Test Connection & Balance
                        </>
                      )}
                    </button>
                  </div>

                  {sfTestResult && (
                    <div
                      className={`mt-3 p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                        sfTestResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {sfTestResult.success ? <CheckCircle2 size={16} className="text-green-600 shrink-0" /> : <AlertCircle size={16} className="text-red-600 shrink-0" />}
                      <span>{sfTestResult.message}</span>
                    </div>
                  )}
                </div>

                {/* Delivery Rates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Standard Delivery Charge (Inside Dhaka)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-[#7A6B5D]">৳</span>
                      <input className="form-input pl-7" type="number" value={dhakaRate} onChange={e => setDhakaRate(+e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Standard Delivery Charge (Outside Dhaka)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-[#7A6B5D]">৳</span>
                      <input className="form-input pl-7" type="number" value={outsideDhakaRate} onChange={e => setOutsideDhakaRate(+e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4 bg-blue-50 border border-blue-200 space-y-1">
                  <p className="text-xs text-blue-900 font-semibold">
                    Steadfast Courier API Base URL: <code className="bg-white px-2 py-0.5 rounded border border-blue-200 font-mono">https://portal.steadfast.com.bd/api/v1</code>
                  </p>
                  <p className="text-[11px] text-blue-700">
                    Active headers: <code>Api-Key</code>: {sfApiKey.slice(0, 10)}... | <code>Secret-Key</code>: {sfSecretKey.slice(0, 6)}...
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={handleSave} className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white cursor-pointer" style={{ background: '#720000' }}>Save Delivery Settings</button>
              </div>
            </div>
          )}

          {/* Invoice & Quotation */}
          {activeSection === 'invoice' && (
            <div className="rounded-2xl bg-white p-6" style={{ border: '1px solid #E8E0D4' }}>
              <h2 className="font-serif text-lg font-bold mb-1" style={{ color: '#24201D' }}>Invoice & Quotation Customization</h2>
              <p className="text-xs text-[#7A6B5D] mb-5">Define naming schemes and terms printed on customer invoices and receipts</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Invoice Number Prefix</label>
                    <input className="form-input" value={invPrefix} onChange={e => setInvPrefix(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Quotation Number Prefix</label>
                    <input className="form-input" value={qtPrefix} onChange={e => setQtPrefix(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Mehendi Aftercare Advice (Appears on receipts)</label>
                  <textarea className="form-input" rows={3} value={aftercareText} onChange={e => setAftercareText(e.target.value)} />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={handleSave} className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white" style={{ background: '#720000' }}>Save Invoice Settings</button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="rounded-2xl bg-white p-6" style={{ border: '1px solid #E8E0D4' }}>
              <h2 className="font-serif text-lg font-bold mb-5" style={{ color: '#24201D' }}>Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'New Booking', desc: 'When a new booking is created', enabled: true },
                  { label: 'Booking Reminder', desc: '24 hours before a scheduled booking', enabled: true },
                  { label: 'Payment Received', desc: 'When a payment is recorded', enabled: true },
                  { label: 'Pending Payment Alert', desc: 'When payment is overdue', enabled: true },
                  { label: 'Low Stock Alert', desc: 'When inventory drops below threshold', enabled: true },
                  { label: 'Order Shipped', desc: 'When order is dispatched via Steadfast', enabled: true },
                  { label: 'Client Portal Request', desc: 'When an inquiry arrives from online portal', enabled: true },
                  { label: 'Daily Summary', desc: 'End-of-day business summary report', enabled: true }
                ].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #F0EBE3' }}>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#24201D' }}>{notif.label}</p>
                      <p className="text-xs" style={{ color: '#7A6B5D' }}>{notif.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked={notif.enabled} className="w-4 h-4" style={{ accentColor: '#720000' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="rounded-2xl bg-white p-6" style={{ border: '1px solid #E8E0D4' }}>
              <h2 className="font-serif text-lg font-bold mb-5" style={{ color: '#24201D' }}>Security & Authentication</h2>
              <div className="space-y-4">
                <div>
                  <p className="form-label">Change Password</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input className="form-input" type="password" placeholder="Current password" />
                    <input className="form-input" type="password" placeholder="New password" />
                  </div>
                  <button className="mt-3 px-5 py-2 text-xs font-semibold rounded-lg text-white" style={{ background: '#720000' }}>Update Password</button>
                </div>
                <div className="pt-4" style={{ borderTop: '1px solid #F0EBE3' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#24201D' }}>Two-Factor Authentication (2FA)</p>
                      <p className="text-xs" style={{ color: '#7A6B5D' }}>Add an extra layer of security to your admin account</p>
                    </div>
                    <button className="px-4 py-2 text-xs font-semibold rounded-lg" style={{ border: '1.5px solid #720000', color: '#720000' }}>Enable 2FA</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backup & Data Management */}
          {activeSection === 'backup' && (
            <div className="rounded-2xl bg-white p-6" style={{ border: '1px solid #E8E0D4' }}>
              <h2 className="font-serif text-lg font-bold mb-2" style={{ color: '#24201D' }}>Backup & Data Management (Local-First Hybrid)</h2>
              <p className="text-xs text-[#7A6B5D] mb-5">Export complete JSON snapshots, restore datasets, or export sales records for accounting</p>

              {backupStatus && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{backupStatus}</span>
                </div>
              )}

              {/* Hidden file input for restore */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportFile}
              />

              <div className="space-y-4">
                {/* Cloud Storage */}
                <div className="p-4 rounded-xl" style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-800">
                        <Cloud size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-emerald-950">Cloud Storage</p>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            {cloudStatus.status === 'connected' ? 'Connected' : cloudStatus.status === 'syncing' ? 'Syncing...' : 'Offline'}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Real-time backup and synchronization
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSyncToCloudNow}
                      disabled={syncingCloud}
                      className="px-3.5 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      <RefreshCw size={13} className={syncingCloud ? 'animate-spin' : ''} />
                      {syncingCloud ? 'Syncing...' : 'Sync Now'}
                    </button>
                  </div>
                  {cloudSuccessMsg && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100/80 px-3 py-1.5 rounded-lg mt-3">
                      <CheckCircle2 size={14} className="text-emerald-700" />
                      <span>{cloudSuccessMsg}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#FAF8F3', border: '1px solid #E8E0D4' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#24201D' }}>Download JSON Backup</p>
                    <p className="text-xs" style={{ color: '#7A6B5D' }}>Save all customers, products, bookings, orders, and batches to a JSON file</p>
                  </div>
                  <button
                    onClick={handleDownloadBackup}
                    className="px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all hover:bg-[#720000] hover:text-white"
                    style={{ border: '1.5px solid #720000', color: '#720000' }}
                  >
                    <Download size={14} /> Download Backup
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#FAF8F3', border: '1px solid #E8E0D4' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#24201D' }}>Restore from Backup</p>
                    <p className="text-xs" style={{ color: '#7A6B5D' }}>Upload a previously downloaded Henna Royalin JSON backup file</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all hover:bg-[#4338CA] hover:text-white"
                    style={{ border: '1.5px solid #4338CA', color: '#4338CA' }}
                  >
                    <Upload size={14} /> Restore File
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#FAF8F3', border: '1px solid #E8E0D4' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#24201D' }}>Export Orders to CSV</p>
                    <p className="text-xs" style={{ color: '#7A6B5D' }}>Download spreadsheet-ready CSV file of all client orders and totals</p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all hover:bg-[#166534] hover:text-white"
                    style={{ border: '1.5px solid #166534', color: '#166534' }}
                  >
                    <FileText size={14} /> Export CSV
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
                  <div>
                    <p className="font-semibold text-sm text-red-900">Clear All Demo & Operational Data</p>
                    <p className="text-xs text-red-700">Wipe all orders, products, inventory, production, and records to start with a 100% fresh clean slate</p>
                  </div>
                  <button
                    onClick={handleResetData}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
                  >
                    Clear All Data
                  </button>
                </div>

                <div className="rounded-xl p-4" style={{ background: '#FBF0C4', border: '1px solid #D9A900' }}>
                  <p className="text-xs font-semibold" style={{ color: '#92400E' }}>
                    ℹ Henna Royalin operates as a Local-First Hybrid System: all records are instantly committed to browser persistent storage with instant offline recovery and seamless sync.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!['business', 'roles', 'payments', 'delivery', 'invoice', 'notifications', 'security', 'backup'].includes(activeSection) && (
            <div className="rounded-2xl bg-white p-12 text-center" style={{ border: '1px solid #E8E0D4' }}>
              <SettingsIcon size={48} className="mx-auto mb-4 opacity-20" style={{ color: '#720000' }} />
              <p className="font-serif text-lg font-bold mb-2" style={{ color: '#24201D' }}>Coming Soon</p>
              <p className="text-sm" style={{ color: '#7A6B5D' }}>This settings section will be available in the full release.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
