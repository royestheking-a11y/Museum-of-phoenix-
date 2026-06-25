const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
import { useState, useEffect, useCallback, useMemo, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Landmark, FileText, GraduationCap, Users, BarChart2,
  Settings, LogOut, Plus, Edit, Trash2, Eye, Search, Bell, ChevronDown,
  TrendingUp, TrendingDown, Globe, ScrollText, ArrowLeft, X, Save,
  User, CreditCard, Newspaper, CheckCircle2, XCircle, Clock, AlertTriangle, Banknote, RefreshCw, MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getPayments, updatePaymentStatus, type PaymentRecord } from '../utils/paymentStore';
import { getMessages, updateMessageStatus, deleteMessage, type Message } from '../utils/messageStore';













const navItems = [
  { id: 'dashboard', label: 'Dashboard', labelAr: 'لوحة القيادة', Icon: LayoutDashboard },
  { id: 'artifacts', label: 'Artifacts', labelAr: 'القطع الأثرية', Icon: Landmark },
  { id: 'articles', label: 'Articles', labelAr: 'المقالات', Icon: FileText },
  { id: 'courses', label: 'Courses', labelAr: 'الدورات', Icon: GraduationCap },
  { id: 'users', label: 'Users', labelAr: 'المستخدمين', Icon: Users },
  { id: 'payments', label: 'Payments', labelAr: 'المدفوعات', Icon: Banknote },
  { id: 'messages', label: 'Messages', labelAr: 'الرسائل', Icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', labelAr: 'التحليلات', Icon: BarChart2 },
  { id: 'settings', label: 'Settings', labelAr: 'الإعدادات', Icon: Settings },
];

interface Props { onBack: () => void; }

export default function AdminPanel({ onBack }: Props) {
  const { isAr } = useLanguage();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editItem, setEditItem] = useState<any>(null);

  // ── Payments state ──
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentTab, setPaymentTab] = useState<'pending'|'confirmed'|'rejected'>('pending');
  const [rejectTarget, setRejectTarget] = useState<PaymentRecord | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const loadPayments = useCallback(async () => {
    const data = await getPayments();
    setPayments(data);
  }, []);

  
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [dbArticles, setDbArticles] = useState<any[]>([]);
  const [dbCourses, setDbCourses] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [u, a, c] = await Promise.all([
        fetch(`${API_BASE_URL}/api/users`).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/articles`).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/courses`).then(r => r.json())
      ]);
      setDbUsers(u || []);
      setDbArticles(a || []);
      setDbCourses(c || []);
    } catch (e) { console.error(e); }
  };
const [dbArtifacts, setDbArtifacts] = useState<any[]>([]);
  const loadArtifacts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/artifacts`);
      const data = await res.json();
      setDbArtifacts(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // ── Messages state ──
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgTab, setMsgTab] = useState<'unread'|'read'|'replied'>('unread');
  const [msgView, setMsgView] = useState<Message | null>(null);

  const loadMessages = useCallback(async () => {
    const data = await getMessages();
    setMessages(data);
  }, []);

  useEffect(() => {
    if (activeNav === 'payments') loadPayments();
    if (activeNav === 'messages') loadMessages();
    if (activeNav === 'artifacts' || activeNav === 'dashboard') loadArtifacts();
    loadData();
  }, [activeNav, loadPayments, loadMessages, loadArtifacts]);

  useEffect(() => {
    const handleUpdate = () => { loadPayments(); loadMessages(); };
    window.addEventListener('payments_updated', handleUpdate);
    window.addEventListener('messages_updated', handleUpdate);
    return () => {
      window.removeEventListener('payments_updated', handleUpdate);
      window.removeEventListener('messages_updated', handleUpdate);
    };
  }, [loadPayments, loadMessages]);

  const handleConfirm = async (p: PaymentRecord) => {
    await updatePaymentStatus(p.id, 'confirmed');
    loadPayments();
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    await updatePaymentStatus(rejectTarget.id, 'rejected', rejectNote || 'No reason given');
    setRejectTarget(null);
    setRejectNote('');
    loadPayments();
  };

  

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'' | 'artifact' | 'user' | 'article' | 'course'>('');
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleEdit = (type: any, item: any) => {
    setModalType(type);
    setEditingItem(item ? { ...item } : {});
    setModalOpen(true);
  };

  const handleDelete = async (type: any, id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      let endpoint = '';
      if (type === 'artifact') endpoint = `/api/artifacts/${id}`;
      if (type === 'user') endpoint = `/api/users/${id}`;
      if (type === 'article') endpoint = `/api/articles/${id}`;
      if (type === 'course') endpoint = `/api/courses/${id}`;
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' });
      if (res.ok) {
        if (type === 'artifact') loadArtifacts();
        if (type === 'user') loadData();
        if (type === 'article') loadData();
        if (type === 'course') loadData();
      } else {
        alert('Failed to delete');
      }
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    try {
      let endpoint = '';
      if (modalType === 'artifact') endpoint = `/api/artifacts`;
      if (modalType === 'user') endpoint = `/api/users`;
      if (modalType === 'article') endpoint = `/api/articles`;
      if (modalType === 'course') endpoint = `/api/courses`;

      const isUpdate = !!editingItem._id;
      if (isUpdate) endpoint += `/${editingItem._id}`;

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });

      if (res.ok) {
        setModalOpen(false);
        if (modalType === 'artifact') {
          loadArtifacts();
        } else {
          loadData();
        }
      } else {
        alert('Failed to save');
      }
    } catch (e) { console.error(e); }
  };

  const totalVisitorsCount = dbArticles.reduce((sum, a) => sum + (a.views || 0), 0) + (dbUsers.length * 42);
  const activeMembersCount = dbUsers.length;
  const monthlyRevenueCount = payments.filter(p => p.status === 'confirmed').reduce((sum, p) => sum + (p.price || 0), 0);

  const trafficData = useMemo(() => {
    const baseV = Math.max(10, Math.floor(totalVisitorsCount / 7));
    const baseM = Math.max(2, Math.floor(activeMembersCount / 7));
    return [
      { day: 'Mon', visitors: Math.floor(baseV * 0.8), members: Math.floor(baseM * 0.9) },
      { day: 'Tue', visitors: Math.floor(baseV * 1.1), members: Math.floor(baseM * 1.2) },
      { day: 'Wed', visitors: Math.floor(baseV * 0.9), members: Math.floor(baseM * 0.8) },
      { day: 'Thu', visitors: Math.floor(baseV * 1.3), members: Math.floor(baseM * 1.1) },
      { day: 'Fri', visitors: Math.floor(baseV * 1.5), members: Math.floor(baseM * 1.4) },
      { day: 'Sat', visitors: Math.floor(baseV * 1.8), members: Math.floor(baseM * 1.7) },
      { day: 'Sun', visitors: Math.floor(baseV * 1.2), members: Math.floor(baseM * 1.3) },
    ];
  }, [totalVisitorsCount, activeMembersCount]);

  const hallData = useMemo(() => {
    if (dbArtifacts.length === 0) return [];
    const counts: Record<string, number> = {};
    dbArtifacts.forEach((a: any) => {
      const h = a.hall || 'Other';
      counts[h] = (counts[h] || 0) + 1;
    });
    const colors = ['#8B6914', '#1a6a4a', '#3a3a8a', '#6a2a8a', '#2a6a2a', '#7a4a1a', '#1a4a7a'];
    return Object.entries(counts).map(([name, count], i) => ({
      name, visits: (count) * 150 + 200, color: colors[i % colors.length]
    }));
  }, [dbArtifacts]);

  const revenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(m => ({ month: m, revenue: 0 }));
    payments.forEach(p => {
      const createdAt = (p as any).createdAt || p.submittedAt;
      if (p.status === 'confirmed' && createdAt) {
        const d = new Date(createdAt);
        data[d.getMonth()].revenue += (p.price || 0);
      } else if (p.status === 'confirmed') {
        data[new Date().getMonth()].revenue += (p.price || 0);
      }
    });
    const currentMonth = new Date().getMonth();
    const result = [];
    for(let i=5; i>=0; i--) {
      let mIdx = currentMonth - i;
      if(mIdx < 0) mIdx += 12;
      result.push(data[mIdx]);
    }
    return result;
  }, [payments]);

  const memberPieData = useMemo(() => {
    if (dbUsers.length === 0) return [];
    const counts: Record<string, number> = { Visitor: 0, Researcher: 0, Scholar: 0, Institution: 0 };
    dbUsers.forEach((u: any) => {
      const l = u.level || u.plan || 'Visitor';
      if (counts[l] !== undefined) counts[l]++;
      else counts['Visitor']++;
    });
    return [
      { name: 'Visitor (Free)', value: counts.Visitor, color: '#C7C3B9' },
      { name: 'Researcher', value: counts.Researcher, color: '#D4AF37' },
      { name: 'Scholar', value: counts.Scholar, color: '#F0D98A' },
      { name: 'Institution', value: counts.Institution, color: '#8a4a4a' },
    ].filter(x => x.value > 0);
  }, [dbUsers]);

  
  const topSearchTerms = useMemo(() => {
    if (dbArtifacts.length === 0 && dbArticles.length === 0) return [];
    const counts: Record<string, number> = {};
    dbArtifacts.forEach((a: any) => {
      const c = a.category || 'Artifact';
      const cAr = a.categoryAr || c;
      const key = c + '|' + cAr;
      counts[key] = (counts[key] || 0) + 120 + Math.floor(Math.random()*50);
    });
    dbArticles.forEach((a: any) => {
      const c = a.category || 'Article';
      const cAr = a.categoryAr || c;
      const key = c + '|' + cAr;
      counts[key] = (counts[key] || 0) + 90 + Math.floor(Math.random()*40);
    });
    const sorted = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 8);
    return sorted.map(([key, count]: any) => {
      const [en, ar] = key.split('|');
      return { en, ar, count };
    });
  }, [dbArtifacts, dbArticles]);

  const statCards = [
    { label: 'Total Visitors', arabic: 'إجمالي الزوار', value: totalVisitorsCount.toLocaleString(), delta: '+12.4%', up: true, color: '#D4AF37' },
    { label: 'Active Members', arabic: 'الأعضاء النشطين', value: activeMembersCount.toLocaleString(), delta: '+8.7%', up: true, color: '#1a6a4a' },
    { label: 'Monthly Revenue', arabic: 'الإيراد الشهري', value: '$' + monthlyRevenueCount.toLocaleString(), delta: '+4.3%', up: true, color: '#8a4a4a' },
    { label: 'Artifacts', arabic: 'القطع الأثرية', value: dbArtifacts.length > 0 ? dbArtifacts.length.toLocaleString() : '...', delta: isAr ? '+٥ هذا الأسبوع' : '+5 this week', up: true, color: '#6a2a8a' },
  ];

  const recentActivities = useMemo(() => {
    const activities: any[] = [];
    
    dbUsers.forEach((u: any) => {
      activities.push({
        type: 'user',
        icon: <User size={16} color="#D4AF37" />,
        text: isAr ? `عضو جديد: ${u.name} (${u.level || 'زائر'})` : `New Member: ${u.name} (${u.level || 'Visitor'})`,
        time: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent',
        date: new Date(u.createdAt || Date.now()).getTime()
      });
    });

    payments.filter(p => p.status === 'confirmed').forEach((p: any) => {
      const createdAt = p.createdAt || p.submittedAt || Date.now();
      activities.push({
        type: 'payment',
        icon: <CreditCard size={16} color="#4ade80" />,
        text: isAr ? `إيرادات: $${p.price} — خطة ${p.plan}` : `Revenue: $${p.price} — ${p.plan} Plan`,
        time: new Date(createdAt).toLocaleDateString(),
        date: new Date(createdAt).getTime()
      });
    });

    dbArticles.forEach((a: any) => {
      activities.push({
        type: 'article',
        icon: <ScrollText size={16} color="#7a4a1a" />,
        text: isAr ? `مقال جديد: ${a.arabic || a.title}` : `New Article: ${a.title}`,
        time: a.date || 'Recent',
        date: a.date ? new Date(a.date).getTime() : Date.now()
      });
    });

    return activities.sort((a, b) => b.date - a.date).slice(0, 5);
  }, [dbUsers, payments, dbArticles, isAr]);

  return (
    <motion.div className="fixed inset-0 flex overflow-hidden"
      style={{ background: '#0D1117', color: '#F8F4EA', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      {/* Sidebar */}
      <motion.div style={{ width: sidebarOpen ? 220 : 64, flexShrink: 0, background: 'rgba(6,43,36,0.95)', borderRight: isAr ? 'none' : '1px solid rgba(212,175,55,0.15)', borderLeft: isAr ? '1px solid rgba(212,175,55,0.15)' : 'none', display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden', direction: isAr ? 'rtl' : 'ltr' }}>
        {/* Logo */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexDirection: isAr ? 'row' : 'row' }}>
          <img src="/museum.png" alt="Museum Logo" style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }} />
          {sidebarOpen && <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.85rem', color: '#D4AF37', whiteSpace: 'nowrap' }}>{isAr ? 'لوحة الإدارة' : 'Admin Panel'}</div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {navItems.map(({ id, label, labelAr, Icon }) => (
            <button key={id} onClick={() => setActiveNav(id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', background: activeNav === id ? 'rgba(212,175,55,0.12)' : 'none', border: `1px solid ${activeNav === id ? 'rgba(212,175,55,0.3)' : 'transparent'}`, borderRadius: 6, cursor: 'pointer', marginBottom: 2, transition: 'all 0.2s', textAlign: isAr ? 'right' : 'left' }}>
              <Icon size={16} color={activeNav === id ? '#D4AF37' : '#C7C3B9'} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: activeNav === id ? '#D4AF37' : '#C7C3B9', whiteSpace: 'nowrap' }}>{isAr ? labelAr : label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(212,175,55,0.12)' }}>
          <button onClick={onBack}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: 6, cursor: 'pointer', marginBottom: 4, textAlign: isAr ? 'right' : 'left' }}>
            <ArrowLeft size={16} color="#ff6b6b" style={{ flexShrink: 0, transform: isAr ? 'rotate(180deg)' : 'none' }} />
            {sidebarOpen && <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#ff6b6b', whiteSpace: 'nowrap' }}>{isAr ? 'خروج من الإدارة' : 'Exit Admin'}</span>}
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', background: 'rgba(13,17,23,0.95)', borderBottom: '1px solid rgba(212,175,55,0.1)', backdropFilter: 'blur(20px)', direction: isAr ? 'rtl' : 'ltr' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#C7C3B9', cursor: 'pointer', display: 'flex' }}>
            <LayoutDashboard size={18} />
          </button>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.95rem', color: '#D4AF37', flex: 1 }}>{isAr ? navItems.find(n => n.id === activeNav)?.labelAr : navItems.find(n => n.id === activeNav)?.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 6, padding: '6px 12px', maxWidth: 240, direction: isAr ? 'rtl' : 'ltr' }}>
            <Search size={13} color="#D4AF37" />
            <input placeholder={isAr ? "بحث..." : "Search..."} style={{ background: 'none', border: 'none', outline: 'none', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#F8F4EA', width: '100%', textAlign: isAr ? 'right' : 'left' }} />
          </div>
          <button style={{ width: 34, height: 34, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C7C3B9', position: 'relative' }}>
            <Bell size={16} />
            <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: '#D4AF37', borderRadius: '50%' }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, cursor: 'pointer' }}>
            <img src="/museum.png" alt="Admin Avatar" style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0 }} />
            <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#D4AF37' }}>{isAr ? 'المسؤول' : 'Admin'}</span>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

          {activeNav === 'dashboard' && (
            <div>
              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 24, direction: isAr ? 'rtl' : 'ltr' }}>
                {statCards.map(card => (
                  <motion.div key={card.label} whileHover={{ y: -2 }}
                    style={{ background: `${card.color}0e`, border: `1px solid ${card.color}33`, borderRadius: 10, padding: '18px' }}>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9', letterSpacing: '0.05em', marginBottom: 6 }}>{isAr ? card.arabic : card.label}</div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '1.8rem', color: '#F8F4EA', marginBottom: 6 }}>{card.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {card.up ? <TrendingUp size={13} color="#4ade80" /> : <TrendingDown size={13} color="#ff6b6b" />}
                      <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: card.up ? '#4ade80' : '#ff6b6b', direction: 'ltr' }}>{card.delta}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24, direction: isAr ? 'rtl' : 'ltr' }}>
                {/* Traffic chart */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, padding: '18px' }}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 14 }}>{isAr ? 'حركة المرور الأسبوعية' : 'Weekly Traffic'}</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={trafficData}>
                      <XAxis dataKey="day" tick={{ fill: '#C7C3B9', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#C7C3B9', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#0B1F1B', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, fontSize: 11 }} />
                      <Line type="monotone" dataKey="visitors" stroke="#D4AF37" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="members" stroke="#4ade80" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                    {[['#D4AF37', isAr ? 'زوار' : 'Visitors'], ['#4ade80', isAr ? 'أعضاء' : 'Members']].map(([c, l]) => (
                      <div key={l} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        <div style={{ width: 10, height: 3, background: c, borderRadius: 2 }} />
                        <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9' }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, padding: '18px' }}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 14 }}>{isAr ? 'الإيرادات الشهرية' : 'Monthly Revenue'}</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={revenueData}>
                      <XAxis dataKey="month" tick={{ fill: '#C7C3B9', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#C7C3B9', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v: any) => [`$${v}`, 'Revenue']} contentStyle={{ background: '#0B1F1B', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, fontSize: 11 }} />
                      <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Membership pie */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, padding: '18px' }}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 14 }}>{isAr ? 'توزيع العضوية' : 'Membership Distribution'}</div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie data={memberPieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
                          {memberPieData.map((entry: any, i: any) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {memberPieData.map((item: any) => (
                        <div key={item.name} style={{ display: 'flex', gap: 7, alignItems: 'center', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9' }}>{isAr ? (item.name === 'Visitor (Free)' ? 'زائر (مجاني)' : item.name === 'Researcher' ? 'باحث' : item.name === 'Scholar' ? 'عالم' : 'مؤسسة') : item.name}</span>
                          <span style={{ fontFamily: 'Inter', fontSize: '0.68rem', color: '#F8F4EA', [isAr ? 'marginRight' : 'marginLeft']: 'auto' }}>{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hall visits */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, padding: '18px' }}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 14 }}>{isAr ? 'زيارات القاعات هذا الشهر' : 'Hall Visits This Month'}</div>
                  <ResponsiveContainer width="100%" height={160} style={{ direction: 'ltr' }}>
                    <BarChart data={hallData} layout="vertical">
                      <XAxis type="number" tick={{ fill: '#C7C3B9', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#C7C3B9', fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                      <Tooltip contentStyle={{ background: '#0B1F1B', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, fontSize: 11 }} />
                      <Bar dataKey="visits" radius={[0, 4, 4, 0]}>
                        {hallData.map((entry: any, i: any) => <Cell key={i} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent activity */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, padding: '18px', direction: isAr ? 'rtl' : 'ltr' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 14 }}>{isAr ? 'النشاط الأخير' : 'Recent Activity'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recentActivities.map((item: any, i: any) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, flexDirection: isAr ? 'row' : 'row' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20 }}>{item.icon}</span>
                      <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#C7C3B9', flex: 1 }}>{item.text}</span>
                      <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: 'rgba(199,195,185,0.4)', flexShrink: 0, direction: 'ltr' }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeNav === 'artifacts' && (
            <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1rem', color: '#F8F4EA', flex: 1 }}>{isAr ? 'مجموعة القطع الأثرية' : 'Artifacts Collection'}</div>
                <button onClick={() => handleEdit('artifact', null)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 6, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={14} /> {isAr ? 'إضافة قطعة' : 'Add Artifact'}
                </button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                      {(isAr ? ['الاسم', 'القاعة', 'الفئة', 'الحالة', 'المشاهدات', 'الإجراءات'] : ['Name', 'Hall', 'Category', 'Status', 'Views', 'Actions']).map(h => (
                        <th key={h} style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: '#C7C3B9', textAlign: isAr ? 'right' : 'left', padding: '10px 14px', fontWeight: 500, letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dbArtifacts.map((a, i) => {
                      const name = a.name || a.title || a.concept || a.cipherType || a.system || a.surah || a.period || 'Unnamed Artifact';
                      const nameAr = a.nameAr || a.arabic || a.title || name;
                      const hall = a.hall || 'Unknown';
                      const hallAr = a.hallAr || hall;
                      const category = a.category || a.mechanism || 'General';
                      const categoryAr = a.categoryAr || category;
                      const status = a.status || 'Published';
                      const statusAr = a.statusAr || 'منشور';
                      const views = a.views || 0;

                      return (
                      <tr key={a._id || i} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'none' }}>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#F8F4EA' }}>{isAr ? nameAr : name}</td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{isAr ? hallAr : hall}</td>
                        <td style={{ padding: '11px 14px' }}><span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#8B6914', background: 'rgba(139,105,20,0.12)', border: '1px solid rgba(139,105,20,0.25)', borderRadius: 10, padding: '2px 8px' }}>{isAr ? categoryAr : category}</span></td>
                        <td style={{ padding: '11px 14px' }}><span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: status === 'Published' ? '#4ade80' : '#D4AF37', background: status === 'Published' ? 'rgba(74,222,128,0.1)' : 'rgba(212,175,55,0.1)', border: `1px solid ${status === 'Published' ? 'rgba(74,222,128,0.3)' : 'rgba(212,175,55,0.25)'}`, borderRadius: 10, padding: '2px 8px' }}>{isAr ? statusAr : status}</span></td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{views.toLocaleString()}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            
                            <button onClick={() => handleEdit('artifact', a)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: `1px solid #D4AF3733`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}><Edit size={13} /></button>
                            <button onClick={() => handleDelete('artifact', a._id || a.id)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: `1px solid #ff6b6b33`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b' }}><Trash2 size={13} /></button>
    
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeNav === 'users' && (
            <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1rem', color: '#F8F4EA', flex: 1 }}>{isAr ? 'إدارة المستخدمين' : 'User Management'}</div>
                <button onClick={() => handleEdit('user', null)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 6, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={14} /> {isAr ? 'إضافة مستخدم' : 'Add User'}
                </button>
                <div style={{ display: 'flex', gap: 8, flexDirection: isAr ? 'row' : 'row' }}>
                  {(isAr ? ['الكل', 'نشط', 'موقوف'] : ['All', 'Active', 'Suspended']).map((f, idx) => {
                    const isAll = idx === 0;
                    return (
                      <button key={f} style={{ padding: '6px 12px', background: isAll ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isAll ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.1)'}`, borderRadius: 4, color: isAll ? '#D4AF37' : '#C7C3B9', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', cursor: 'pointer' }}>{f}</button>
                    );
                  })}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                  <thead>
                    <tr style={{ background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                      {(isAr ? ['المستخدم', 'الخطة', 'الدولة', 'انضم', 'الحالة', 'الإجراءات'] : ['User', 'Plan', 'Country', 'Joined', 'Status', 'Actions']).map(h => (
                        <th key={h} style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: '#C7C3B9', textAlign: isAr ? 'right' : 'left', padding: '10px 14px', fontWeight: 500, letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dbUsers.map((u, i) => (
                      <tr key={u._id || i} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'none' }}>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#F8F4EA' }}>{u.name}</div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: u.plan === 'Scholar' ? '#F0D98A' : u.plan === 'Researcher' ? '#D4AF37' : u.plan === 'Institution' ? '#8a4a4a' : '#C7C3B9', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '2px 8px' }}>{u.level || 'Visitor'}</span>
                        </td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{'Unknown'}</td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9', direction: 'ltr' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: u.status === 'Active' ? '#4ade80' : '#ff6b6b', background: u.status === 'Active' ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,107,0.1)', border: `1px solid ${u.status === 'Active' ? 'rgba(74,222,128,0.3)' : 'rgba(255,107,107,0.3)'}`, borderRadius: 10, padding: '2px 8px' }}>{'Active'}</span>
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button onClick={() => handleEdit('user', u)} style={{ padding: '4px 8px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 4, color: '#D4AF37', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', cursor: 'pointer' }}>{isAr ? 'تعديل' : 'Edit'}</button>
                            <button onClick={() => handleDelete('user', u._id || u.id)} style={{ padding: '4px 8px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 4, color: '#ff6b6b', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', cursor: 'pointer' }}>{isAr ? 'حذف' : 'Delete'}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeNav === 'settings' && (
            <div style={{ maxWidth: 600, direction: isAr ? 'rtl' : 'ltr' }}>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1rem', color: '#F8F4EA', marginBottom: 20 }}>{isAr ? 'إعدادات المتحف' : 'Museum Settings'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(isAr ? [
                  { label: 'اسم المتحف', value: 'متحف العنقاء' },
                  { label: 'الشعار', value: 'المتحف الافتراضي للرموز العربية' },
                  { label: 'البريد الإلكتروني للاتصال', value: 'admin@phoenix.museum' },
                  { label: 'بريد الدعم', value: 'support@phoenix.museum' },
                ] : [
                  { label: 'Museum Name', value: 'Phoenix Museum' },
                  { label: 'Slogan', value: 'Virtual Museum of Arabic Symbols' },
                  { label: 'Contact Email', value: 'admin@phoenix.museum' },
                  { label: 'Support Email', value: 'support@phoenix.museum' },
                ]).map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 8, padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#C7C3B9' }}>{s.label}</div>
                    </div>
                    <input defaultValue={s.value}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 5, padding: '9px 12px', color: '#F8F4EA', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', outline: 'none' }} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 6, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Save size={14} /> {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                  </button>
                  <button style={{ padding: '11px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 6, color: '#C7C3B9', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', cursor: 'pointer' }}>
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'analytics' && (
            <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1rem', color: '#F8F4EA', marginBottom: 20 }}>{isAr ? 'لوحة التحليلات' : 'Analytics Dashboard'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, padding: '18px' }}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 14 }}>{isAr ? 'إيرادات ٦ أشهر' : '6-Month Revenue'}</div>
                  <ResponsiveContainer width="100%" height={200} style={{ direction: 'ltr' }}>
                    <LineChart data={revenueData}>
                      <XAxis dataKey="month" tick={{ fill: '#C7C3B9', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#C7C3B9', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v: any) => [`$${v}`, isAr ? 'إيرادات' : 'Revenue']} contentStyle={{ background: '#0B1F1B', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, fontSize: 11 }} />
                      <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2.5} dot={{ fill: '#D4AF37', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, padding: '18px' }}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 14 }}>{isAr ? 'الزوار اليوميين مقابل الأعضاء' : 'Daily Visitors vs Members'}</div>
                  <ResponsiveContainer width="100%" height={200} style={{ direction: 'ltr' }}>
                    <BarChart data={trafficData}>
                      <XAxis dataKey="day" tick={{ fill: '#C7C3B9', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#C7C3B9', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#0B1F1B', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, fontSize: 11 }} />
                      <Bar dataKey="visitors" fill="#D4AF37" radius={[3, 3, 0, 0]} name={isAr ? 'زوار' : 'Visitors'} />
                      <Bar dataKey="members" fill="#4ade80" radius={[3, 3, 0, 0]} name={isAr ? 'أعضاء' : 'Members'} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, padding: '18px' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 14 }}>{isAr ? 'أكثر مصطلحات البحث هذا الأسبوع' : 'Top Search Terms This Week'}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                  {topSearchTerms.map(({ en, ar, count }) => (
                    <div key={en} style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 6, padding: '10px 12px' }}>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#F8F4EA', marginBottom: 3 }}>{isAr ? ar : en}</div>
                      <div style={{ fontFamily: '"Playfair Display"', fontSize: '1rem', color: '#D4AF37', direction: 'ltr', textAlign: isAr ? 'right' : 'left' }}>{Number(count).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PAYMENTS PANEL ── */}
          {activeNav === 'payments' && (() => {
            const pending   = payments.filter(p => p.status === 'pending');
            const confirmed = payments.filter(p => p.status === 'confirmed');
            const rejected  = payments.filter(p => p.status === 'rejected');
            const filtered  = paymentTab === 'pending' ? pending : paymentTab === 'confirmed' ? confirmed : rejected;

            const PaymentTypeIcon = ({ type }: { type: string }) => {
              const svgs: Record<string, ReactElement> = {
                visa: (
                  <svg viewBox="0 0 52 18" width="38" height="13" xmlns="http://www.w3.org/2000/svg">
                    <text x="1" y="15" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="17" fill="#1A1F71" letterSpacing="-0.5">VISA</text>
                  </svg>
                ),
                mastercard: (
                  <svg viewBox="0 0 38 24" width="34" height="22" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14" cy="12" r="10" fill="#EB001B" />
                    <circle cx="24" cy="12" r="10" fill="#F79E1B" opacity="0.9" />
                    <path d="M19 5.8a10 10 0 0 1 0 12.4A10 10 0 0 1 19 5.8z" fill="#FF5F00" />
                  </svg>
                ),
                amex: (
                  <svg viewBox="0 0 48 24" width="40" height="20" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="48" height="24" rx="4" fill="#007BC1" />
                    <text x="4" y="17" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="11" fill="white" letterSpacing="0.5">AMEX</text>
                  </svg>
                ),
                paypal: (
                  <svg viewBox="0 0 76 22" width="48" height="16" xmlns="http://www.w3.org/2000/svg">
                    <text x="0" y="17" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="17" fill="#003087">Pay</text>
                    <text x="30" y="17" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="17" fill="#009CDE">Pal</text>
                  </svg>
                ),
                bank_transfer: (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M8 10v11M12 10v11M16 10v11M20 10v11" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              };
              return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 28 }}>{svgs[type] ?? svgs['visa']}</div>;
            };

            return (
              <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.2rem', color: '#F8F4EA' }}>{isAr ? 'إدارة المدفوعات' : 'Payment Management'}</div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.74rem', color: '#C7C3B9', marginTop: 2 }}>{isAr ? 'مراجعة وتأكيد طلبات الدفع من العملاء' : 'Review and confirm payment submissions from customers'}</div>
                  </div>
                  <button onClick={loadPayments} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 6, color: '#D4AF37', cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.74rem' }}>
                    <RefreshCw size={13} /> {isAr ? 'تحديث' : 'Refresh'}
                  </button>
                </div>

                {/* Summary stat boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: isAr ? 'بانتظار المراجعة' : 'Pending Review', count: pending.length, color: '#F5A623', bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.3)', icon: <Clock size={18} color="#F5A623" /> },
                    { label: isAr ? 'مؤكدة' : 'Confirmed', count: confirmed.length, color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.3)', icon: <CheckCircle2 size={18} color="#4ade80" /> },
                    { label: isAr ? 'مرفوضة' : 'Rejected', count: rejected.length, color: '#ff6b6b', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.3)', icon: <XCircle size={18} color="#ff6b6b" /> },
                  ].map(s => (
                    <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      {s.icon}
                      <div>
                        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '1.6rem', color: s.color, fontWeight: 700, lineHeight: 1 }}>{s.count}</div>
                        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9', marginTop: 3 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 8, padding: 4, width: 'fit-content' }}>
                  {([['pending', isAr ? 'قيد المراجعة' : 'Pending', '#F5A623'], ['confirmed', isAr ? 'مؤكدة' : 'Confirmed', '#4ade80'], ['rejected', isAr ? 'مرفوضة' : 'Rejected', '#ff6b6b']] as const).map(([tab, label, color]) => (
                    <button key={tab} onClick={() => setPaymentTab(tab)}
                      style={{ padding: '7px 18px', background: paymentTab === tab ? `${color}18` : 'none', border: `1px solid ${paymentTab === tab ? color + '55' : 'transparent'}`, borderRadius: 6, color: paymentTab === tab ? color : '#C7C3B9', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.76rem', fontWeight: paymentTab === tab ? 700 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {label} {paymentTab === tab && `(${filtered.length})`}
                    </button>
                  ))}
                </div>

                {/* Payment cards */}
                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: 12 }}>
                    <div style={{ opacity: 0.3, marginBottom: 12 }}><Banknote size={48} /></div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', color: '#C7C3B9' }}>{isAr ? 'لا توجد مدفوعات بعد' : 'No payments yet in this category'}</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {filtered.map(p => (
                      <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${p.status === 'pending' ? 'rgba(245,166,35,0.25)' : p.status === 'confirmed' ? 'rgba(74,222,128,0.2)' : 'rgba(255,107,107,0.2)'}`, borderRadius: 12, overflow: 'hidden' }}>

                        {/* Card header */}
                        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, background: p.status === 'pending' ? 'rgba(245,166,35,0.04)' : p.status === 'confirmed' ? 'rgba(74,222,128,0.04)' : 'rgba(255,107,107,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <PaymentTypeIcon type={p.paymentType} />
                            <div>
                              <div style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#C7C3B9' }}>{p.id}</div>
                              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: 'rgba(199,195,185,0.5)', marginTop: 1 }}>
                                {new Date(p.submittedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.3rem', color: '#D4AF37', fontWeight: 700 }}>${p.price}</span>
                            <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9' }}>/{isAr ? 'شهر' : 'mo'}</span>
                            <span style={{
                              fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', fontWeight: 700,
                              padding: '3px 10px', borderRadius: 20,
                              background: p.status === 'pending' ? 'rgba(245,166,35,0.15)' : p.status === 'confirmed' ? 'rgba(74,222,128,0.15)' : 'rgba(255,107,107,0.15)',
                              color: p.status === 'pending' ? '#F5A623' : p.status === 'confirmed' ? '#4ade80' : '#ff6b6b',
                              border: `1px solid ${p.status === 'pending' ? 'rgba(245,166,35,0.4)' : p.status === 'confirmed' ? 'rgba(74,222,128,0.4)' : 'rgba(255,107,107,0.4)'}`,
                            }}>
                              {p.status === 'pending' ? (isAr ? 'قيد المراجعة' : 'Pending') : p.status === 'confirmed' ? (isAr ? 'مؤكد' : 'Confirmed') : (isAr ? 'مرفوض' : 'Rejected')}
                            </span>
                          </div>
                        </div>

                        {/* Card details */}
                        <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                          <div>
                            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>{isAr ? 'العميل' : 'Customer'}</div>
                            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#F8F4EA' }}>{p.cardholderName}</div>
                            <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#C7C3B9', marginTop: 1 }}>{p.email}</div>
                          </div>
                          <div>
                            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>{isAr ? 'الخطة' : 'Plan'}</div>
                            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#D4AF37' }}>{isAr ? p.planAr : p.plan}</div>
                            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: '#C7C3B9', marginTop: 1 }}>{p.billing === 'annual' ? (isAr ? 'سنوي' : 'Annual') : (isAr ? 'شهري' : 'Monthly')}</div>
                          </div>
                          <div>
                            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>{isAr ? 'بطاقة' : 'Card'}</div>
                            <div style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#F8F4EA', letterSpacing: '0.08em', direction: 'ltr' }}>{p.cardNumberMasked}</div>
                            <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#C7C3B9', marginTop: 1, direction: 'ltr' }}>انتهاء: {p.expiry}</div>
                          </div>
                          <div>
                            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>CVV</div>
                            <div style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#F8F4EA', letterSpacing: '0.15em' }}>{p.cvv}</div>
                          </div>
                          <div>
                            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>{isAr ? 'نوع الدفع' : 'Method'}</div>
                            <div style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#F8F4EA', textTransform: 'capitalize' }}>{p.paymentType.replace('_', ' ')}</div>
                          </div>
                          {(p.confirmedAt || p.rejectedAt) && (
                            <div>
                              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>{isAr ? 'تاريخ الإجراء' : 'Action Date'}</div>
                              <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{new Date((p.confirmedAt || p.rejectedAt)!).toLocaleString()}</div>
                            </div>
                          )}
                          {p.adminNote && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: 'rgba(255,107,107,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>{isAr ? 'سبب الرفض' : 'Reject Reason'}</div>
                              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#ff6b6b' }}>{p.adminNote}</div>
                            </div>
                          )}
                        </div>

                        {/* Actions — only for pending */}
                        {p.status === 'pending' && (
                          <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => { setRejectTarget(p); setRejectNote(''); }}
                              style={{ padding: '8px 18px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 7, color: '#ff6b6b', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <XCircle size={13} /> {isAr ? 'رفض' : 'Reject'}
                            </button>
                            <button onClick={() => handleConfirm(p)}
                              style={{ padding: '8px 22px', background: 'linear-gradient(135deg, #2d8a50, #1a6a35)', border: 'none', borderRadius: 7, color: '#fff', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <CheckCircle2 size={13} /> {isAr ? 'تأكيد الدفع' : 'Confirm Payment'}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Reject reason modal */}
                <AnimatePresence>
                  {rejectTarget && (
                    <motion.div className="fixed inset-0 flex items-center justify-center p-4"
                      style={{ background: 'rgba(0,0,0,0.8)', zIndex: 300, backdropFilter: 'blur(10px)' }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setRejectTarget(null)}>
                      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                        onClick={e => e.stopPropagation()}
                        style={{ background: 'linear-gradient(145deg, #0B1F1B, #0D1117)', border: '1px solid rgba(255,107,107,0.35)', borderRadius: 14, padding: '28px', maxWidth: 420, width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                          <AlertTriangle size={20} color="#ff6b6b" />
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1rem', color: '#F8F4EA' }}>{isAr ? 'رفض الطلب' : 'Reject Payment'}</div>
                        </div>
                        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#C7C3B9', marginBottom: 16 }}>
                          {isAr ? `هل تريد رفض طلب ${rejectTarget.cardholderName} ($${rejectTarget.price}/شهر)?` : `Reject ${rejectTarget.cardholderName}'s $${rejectTarget.price}/mo order?`}
                        </div>
                        <label style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: 'rgba(212,175,55,0.6)', display: 'block', marginBottom: 6 }}>
                          {isAr ? 'سبب الرفض (اختياري)' : 'Reason (optional)'}
                        </label>
                        <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)}
                          placeholder={isAr ? 'أدخل سبب الرفض...' : 'Enter reason for rejection...'}
                          rows={3}
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: 7, color: '#F8F4EA', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 18 }} />
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={() => setRejectTarget(null)}
                            style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#C7C3B9', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', cursor: 'pointer' }}>
                            {isAr ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button onClick={handleReject}
                            style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #8a2020, #5a1010)', border: 'none', borderRadius: 7, color: '#fff', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                            {isAr ? 'تأكيد الرفض' : 'Confirm Reject'}
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })()}

          {activeNav === 'messages' && (() => {
            const unread = messages.filter(m => m.status === 'unread');
            const read = messages.filter(m => m.status === 'read');
            const replied = messages.filter(m => m.status === 'replied');
            const filtered = msgTab === 'unread' ? unread : msgTab === 'read' ? read : replied;

            return (
              <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.2rem', color: '#F8F4EA' }}>{isAr ? 'رسائل الاتصال' : 'Contact Messages'}</div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.74rem', color: '#C7C3B9', marginTop: 2 }}>{isAr ? 'مراجعة الرسائل الواردة من صفحة الاتصال والرد عليها' : 'Review and reply to incoming messages from the contact page'}</div>
                  </div>
                  <button onClick={loadMessages} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 6, color: '#D4AF37', cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.74rem' }}>
                    <RefreshCw size={13} /> {isAr ? 'تحديث' : 'Refresh'}
                  </button>
                </div>

                {/* Summary stat boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: isAr ? 'غير مقروءة' : 'Unread', count: unread.length, color: '#ff6b6b', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.3)', icon: <AlertTriangle size={18} color="#ff6b6b" /> },
                    { label: isAr ? 'تمت القراءة' : 'Read', count: read.length, color: '#F5A623', bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.3)', icon: <Eye size={18} color="#F5A623" /> },
                    { label: isAr ? 'تم الرد' : 'Replied', count: replied.length, color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.3)', icon: <CheckCircle2 size={18} color="#4ade80" /> },
                  ].map(s => (
                    <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      {s.icon}
                      <div>
                        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '1.6rem', color: s.color, fontWeight: 700, lineHeight: 1 }}>{s.count}</div>
                        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9', marginTop: 3 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 8, padding: 4, width: 'fit-content' }}>
                  {([['unread', isAr ? 'غير مقروءة' : 'Unread', '#ff6b6b'], ['read', isAr ? 'تمت القراءة' : 'Read', '#F5A623'], ['replied', isAr ? 'تم الرد' : 'Replied', '#4ade80']] as const).map(([tab, label, color]) => (
                    <button key={tab} onClick={() => setMsgTab(tab)}
                      style={{ padding: '7px 18px', background: msgTab === tab ? `${color}18` : 'none', border: `1px solid ${msgTab === tab ? color + '55' : 'transparent'}`, borderRadius: 6, color: msgTab === tab ? color : '#C7C3B9', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.76rem', fontWeight: msgTab === tab ? 700 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {label} {msgTab === tab && `(${filtered.length})`}
                    </button>
                  ))}
                </div>

                {/* Messages list */}
                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: 12 }}>
                    <div style={{ opacity: 0.3, marginBottom: 12 }}><MessageSquare size={48} /></div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', color: '#C7C3B9' }}>{isAr ? 'لا توجد رسائل بعد' : 'No messages yet in this category'}</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {filtered.map(m => (
                      <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${m.status === 'unread' ? 'rgba(255,107,107,0.25)' : m.status === 'read' ? 'rgba(245,166,35,0.2)' : 'rgba(74,222,128,0.2)'}`, borderRadius: 12, overflow: 'hidden' }}>
                        
                        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontFamily: '"Playfair Display"', fontSize: '1rem', fontWeight: 700 }}>
                                {m.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', color: '#F8F4EA', fontWeight: 600 }}>{m.name}</div>
                                <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#C7C3B9' }}>{m.email}</div>
                              </div>
                              <div style={{ marginLeft: isAr ? 0 : 'auto', marginRight: isAr ? 'auto' : 0, display: 'flex', flexDirection: 'column', alignItems: isAr ? 'flex-start' : 'flex-end', gap: 6 }}>
                                <div style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: 'rgba(199,195,185,0.5)' }}>{new Date(m.timestamp).toLocaleString()}</div>
                                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  {m.subject.replace('_', ' ')}
                                </div>
                              </div>
                            </div>
                            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', color: '#C7C3B9', lineHeight: 1.6, background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: 8, marginTop: 12 }}>
                              {m.message}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 10, justifyContent: 'flex-end', background: 'rgba(0,0,0,0.1)' }}>
                          <button onClick={async () => { await deleteMessage(m.id); loadMessages(); }}
                            style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 6, color: '#ff6b6b', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Trash2 size={13} /> {isAr ? 'حذف' : 'Delete'}
                          </button>
                          {m.status !== 'read' && m.status !== 'replied' && (
                            <button onClick={async () => { await updateMessageStatus(m.id, 'read'); loadMessages(); }}
                              style={{ padding: '7px 14px', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 6, color: '#F5A623', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Eye size={13} /> {isAr ? 'تحديد كمقروء' : 'Mark Read'}
                            </button>
                          )}
                          {m.status !== 'replied' && (
                            <button onClick={async () => { await updateMessageStatus(m.id, 'replied'); loadMessages(); window.location.href = `mailto:${m.email}?subject=Re: ${m.subject}`; }}
                              style={{ padding: '7px 14px', background: 'linear-gradient(135deg, #2d8a50, #1a6a35)', border: 'none', borderRadius: 6, color: '#fff', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <MessageSquare size={13} /> {isAr ? 'رد' : 'Reply'}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {activeNav === 'articles' && (
            <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.2rem', color: '#F8F4EA' }}>{isAr ? 'المقالات' : 'Articles'}</div>
                <button onClick={() => handleEdit('article', null)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 6, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={14} /> {isAr ? 'إضافة مقال' : 'Add Article'}
                </button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left' }}>
                  <thead style={{ background: 'rgba(212,175,55,0.05)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                    <tr>
                      {['Title', 'Category', 'Author', 'Views', 'Actions'].map((h, i) => (
                        <th key={h} style={{ padding: '14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1, color: '#D4AF37', fontWeight: 600 }}>
                          {isAr ? ['العنوان', 'الفئة', 'المؤلف', 'المشاهدات', 'الإجراءات'][i] : h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dbArticles.map((a, i) => (
                      <tr key={a._id || i} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'none' }}>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#F8F4EA' }}>{isAr ? a.arabic || a.title : a.title}</td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{a.category}</td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{a.author}</td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{(a.views||0).toLocaleString()}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            
                            <button onClick={() => handleEdit('article', a)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: `1px solid #D4AF3733`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}><Edit size={13} /></button>
                            <button onClick={() => handleDelete('article', a._id || a.id)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: `1px solid #ff6b6b33`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b' }}><Trash2 size={13} /></button>
    
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeNav === 'courses' && (
            <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.2rem', color: '#F8F4EA' }}>{isAr ? 'الدورات' : 'Courses'}</div>
                <button onClick={() => handleEdit('course', null)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 6, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={14} /> {isAr ? 'إضافة دورة' : 'Add Course'}
                </button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left' }}>
                  <thead style={{ background: 'rgba(212,175,55,0.05)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                    <tr>
                      {['Title', 'Instructor', 'Level', 'Students', 'Actions'].map((h, i) => (
                        <th key={h} style={{ padding: '14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1, color: '#D4AF37', fontWeight: 600 }}>
                          {isAr ? ['العنوان', 'المدرب', 'المستوى', 'الطلاب', 'الإجراءات'][i] : h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dbCourses.map((c, i) => (
                      <tr key={c._id || i} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'none' }}>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#F8F4EA' }}>{isAr ? c.arabic || c.title : c.title}</td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{c.instructor}</td>
                        <td style={{ padding: '11px 14px' }}><span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#8B6914', background: 'rgba(139,105,20,0.12)', border: '1px solid rgba(139,105,20,0.25)', borderRadius: 10, padding: '2px 8px' }}>{c.level}</span></td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{(c.students||0).toLocaleString()}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            
                            <button onClick={() => handleEdit('course', c)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: `1px solid #D4AF3733`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}><Edit size={13} /></button>
                            <button onClick={() => handleDelete('course', c._id || c.id)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: `1px solid #ff6b6b33`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b' }}><Trash2 size={13} /></button>
    
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0D1117', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500, maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ color: '#F8F4EA', marginBottom: 20 }}>{editingItem?._id ? 'Edit' : 'Add'} {modalType}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['artifact', 'article', 'course'].includes(modalType) && (
                <>
                  <input placeholder="Title / Name" value={editingItem?.title || editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, [modalType === 'artifact' ? 'name' : 'title']: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
                  <input placeholder="Arabic Title" value={editingItem?.arabic || editingItem?.nameAr || ''} onChange={e => setEditingItem({...editingItem, [modalType === 'artifact' ? 'nameAr' : 'arabic']: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
                </>
              )}
              {modalType === 'user' && (
                <>
                  <input placeholder="Name" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
                  <input placeholder="Email" value={editingItem?.email || ''} onChange={e => setEditingItem({...editingItem, email: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
                  <select value={editingItem?.level || 'Visitor'} onChange={e => setEditingItem({...editingItem, level: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }}>
                    <option value="Visitor">Visitor</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Scholar">Scholar</option>
                    <option value="Admin">Admin</option>
                  </select>
                </>
              )}
              {editingItem && Object.keys(editingItem).filter(k => !['_id', '__v', 'createdAt', 'updatedAt', 'title', 'name', 'arabic', 'nameAr', 'email', 'level', 'password', 'id', 'lessons', 'forms', 'color'].includes(k) && typeof editingItem[k] === 'string').map(key => (
                <input key={key} placeholder={key} value={editingItem[key] || ''} onChange={e => setEditingItem({...editingItem, [key]: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} style={{ flex: 1, padding: '10px', background: '#D4AF37', border: 'none', color: '#000', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
