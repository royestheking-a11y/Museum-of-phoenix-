import os

with open("src/app/components/AdminPanel.tsx", "r", encoding="utf8") as f:
    text = f.read()

# 1. Update imports
text = text.replace(
    "import { useState } from 'react';",
    "import { useState, useEffect, useMemo, useCallback } from 'react';\nimport { useLanguage } from '../context/LanguageContext';"
)

# 2. Add Payments to navItems
text = text.replace(
    "{ id: 'users', label: 'Users', Icon: Users },",
    "{ id: 'users', label: 'Users', Icon: Users },\n  { id: 'payments', label: 'Payments', Icon: Landmark },"
)

# Remove the static mock data definitions.
text = text.replace("const trafficData = [\n  { day: 'Mon', visitors: 1240, members: 89 },\n  { day: 'Tue', visitors: 1890, members: 134 },\n  { day: 'Wed', visitors: 1560, members: 102 },\n  { day: 'Thu', visitors: 2340, members: 187 },\n  { day: 'Fri', visitors: 2890, members: 221 },\n  { day: 'Sat', visitors: 3240, members: 265 },\n  { day: 'Sun', visitors: 2780, members: 198 },\n];\n\nconst hallData = [\n  { name: 'History', visits: 4200, color: '#8B6914' },\n  { name: \"Qur'anic\", visits: 5800, color: '#1a6a4a' },\n  { name: 'Crypto', visits: 3900, color: '#3a3a8a' },\n  { name: 'Semiotics', visits: 2100, color: '#6a2a8a' },\n  { name: 'Semantics', visits: 2800, color: '#2a6a2a' },\n  { name: 'Manuscripts', visits: 4600, color: '#7a4a1a' },\n  { name: 'AI Lab', visits: 6200, color: '#1a4a7a' },\n];\n\nconst revenueData = [\n  { month: 'Jan', revenue: 4200 }, { month: 'Feb', revenue: 5800 }, { month: 'Mar', revenue: 7200 },\n  { month: 'Apr', revenue: 6900 }, { month: 'May', revenue: 8400 }, { month: 'Jun', revenue: 11200 },\n];\n\nconst memberPieData = [\n  { name: 'Visitor (Free)', value: 68, color: '#C7C3B9' },\n  { name: 'Researcher', value: 24, color: '#D4AF37' },\n  { name: 'Scholar', value: 6, color: '#F0D98A' },\n  { name: 'Institution', value: 2, color: '#8a4a4a' },\n];\n\nconst artifacts = [\n  { id: 1, name: 'Seal of Dilmun', hall: 'History', category: 'Seal', status: 'Published', views: 3420 },\n  { id: 2, name: 'Al-Qanun fi al-Tibb', hall: 'Manuscripts', category: 'Medical', status: 'Published', views: 8901 },\n  { id: 3, name: 'Divine Light — Nur', hall: \"Qur'anic\", category: 'Light', status: 'Published', views: 12034 },\n  { id: 4, name: 'Al-Kindi Frequency Analysis', hall: 'Cryptography', category: 'Concept', status: 'Published', views: 5670 },\n  { id: 5, name: 'Crescent Symbol', hall: 'Semiotics', category: 'Cultural', status: 'Draft', views: 0 },\n];\n\nconst usersData = [\n  { id: 1, name: 'Ahmad Al-Rashid', email: 'ahmad@example.com', plan: 'Scholar', joined: 'Jan 2026', status: 'Active', country: 'Saudi Arabia' },\n  { id: 2, name: 'Fatima Hassan', email: 'fatima@example.com', plan: 'Researcher', joined: 'Feb 2026', status: 'Active', country: 'Egypt' },\n  { id: 3, name: 'Omar Khalil', email: 'omar@example.com', plan: 'Visitor', joined: 'Mar 2026', status: 'Active', country: 'UAE' },\n  { id: 4, name: 'Sara Mansouri', email: 'sara@example.com', plan: 'Researcher', joined: 'Mar 2026', status: 'Active', country: 'Morocco' },\n  { id: 5, name: 'Yusuf Al-Farsi', email: 'yusuf@example.com', plan: 'Scholar', joined: 'Apr 2026', status: 'Suspended', country: 'Oman' },\n  { id: 6, name: 'Leila Karimi', email: 'leila@example.com', plan: 'Institution', joined: 'May 2026', status: 'Active', country: 'Iran' },\n];\n", "")

text = text.replace(
    "export default function AdminPanel({ onBack }: Props) {\n  const [activeNav, setActiveNav] = useState('dashboard');",
    """export default function AdminPanel({ onBack }: Props) {
  const { isAr } = useLanguage();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [dbArticles, setDbArticles] = useState<any[]>([]);
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [dbArtifacts, setDbArtifacts] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [u, a, c, art, p] = await Promise.all([
        fetch('http://localhost:5005/api/users').then(r => r.json()),
        fetch('http://localhost:5005/api/articles').then(r => r.json()),
        fetch('http://localhost:5005/api/courses').then(r => r.json()),
        fetch('http://localhost:5005/api/artifacts').then(r => r.json()),
        fetch('http://localhost:5005/api/payments').then(r => r.json())
      ]);
      setDbUsers(Array.isArray(u) ? u : []);
      setDbArticles(Array.isArray(a) ? a : []);
      setDbCourses(Array.isArray(c) ? c : []);
      setDbArtifacts(Array.isArray(art) ? art : []);
      setPayments(Array.isArray(p) ? p : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalVisitorsCount = dbArticles.reduce((sum, a) => sum + (a.views || 0), 0) + dbArtifacts.reduce((sum, a) => sum + (a.views || 0), 0);
  const activeMembersCount = dbUsers.length;
  const monthlyRevenueCount = payments.filter(p => p.status === 'confirmed').reduce((sum, p) => sum + (p.price || 0), 0);

  const trafficData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];
    for(let i=6; i>=0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({ day: days[d.getDay()], members: 0, transactions: 0, fullDate: d.toDateString() });
    }
    dbUsers.forEach(u => {
      if(u.createdAt) {
        const ud = new Date(u.createdAt).toDateString();
        const match = data.find(d => d.fullDate === ud);
        if(match) match.members++;
      }
    });
    payments.forEach(p => {
      if(p.createdAt && p.status === 'confirmed') {
        const pd = new Date(p.createdAt).toDateString();
        const match = data.find(d => d.fullDate === pd);
        if(match) match.transactions++;
      }
    });
    return data;
  }, [dbUsers, payments]);

  const hallData = useMemo(() => {
    if (dbArtifacts.length === 0) return [];
    const counts: any = {};
    dbArtifacts.forEach(a => {
      const h = a.hall || 'Other';
      counts[h] = (counts[h] || 0) + 1;
    });
    const colors = ['#8B6914', '#1a6a4a', '#3a3a8a', '#6a2a8a', '#2a6a2a', '#7a4a1a', '#1a4a7a'];
    return Object.entries(counts).map(([name, count], i) => ({
      name, visits: (count as number) * 150 + 200, color: colors[i % colors.length]
    }));
  }, [dbArtifacts]);

  const revenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(m => ({ month: m, revenue: 0 }));
    payments.forEach(p => {
      if (p.status === 'confirmed' && p.createdAt) {
        const d = new Date(p.createdAt);
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
    const counts: any = { Visitor: 0, Researcher: 0, Scholar: 0, Institution: 0 };
    dbUsers.forEach(u => {
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

  const statCards = [
    { label: 'Total Views', arabic: 'إجمالي الزوار', value: totalVisitorsCount.toLocaleString(), delta: 'All Time', up: true, color: '#D4AF37' },
    { label: 'Active Members', arabic: 'الأعضاء النشطين', value: activeMembersCount.toLocaleString(), delta: (dbUsers.filter(u => new Date(u.createdAt) >= new Date(Date.now() - 7*24*60*60*1000)).length > 0 ? `+${dbUsers.filter(u => new Date(u.createdAt) >= new Date(Date.now() - 7*24*60*60*1000)).length} this week` : 'No new this week'), up: true, color: '#1a6a4a' },
    { label: 'Monthly Revenue', arabic: 'الإيراد الشهري', value: `$${monthlyRevenueCount.toLocaleString()}`, delta: (payments.filter(p => p.status === 'confirmed' && new Date(p.createdAt) >= new Date(Date.now() - 30*24*60*60*1000)).reduce((sum, p) => sum + (p.price || 0), 0) > 0 ? `+$${payments.filter(p => p.status === 'confirmed' && new Date(p.createdAt) >= new Date(Date.now() - 30*24*60*60*1000)).reduce((sum, p) => sum + (p.price || 0), 0)} this month` : 'No new revenue'), up: true, color: '#3a3a8a' },
    { label: 'Artifacts', arabic: 'القطع الأثرية', value: dbArtifacts.length > 0 ? dbArtifacts.length.toLocaleString() : '...', delta: (dbArtifacts.filter(a => new Date(a.createdAt) >= new Date(Date.now() - 7*24*60*60*1000)).length > 0 ? `+${dbArtifacts.filter(a => new Date(a.createdAt) >= new Date(Date.now() - 7*24*60*60*1000)).length} this week` : 'No new this week'), up: true, color: '#6a2a8a' },
  ];"""
)

# 4. Replace Weekly Traffic with Signups and Transactions
text = text.replace("Weekly Traffic", "Signups & Transactions")
text = text.replace('<Line type="monotone" dataKey="visitors" stroke="#D4AF37" strokeWidth={2} dot={false} />', '<Line type="monotone" dataKey="transactions" stroke="#D4AF37" strokeWidth={2} dot={false} />')
text = text.replace("{[['#D4AF37', 'Visitors'], ['#4ade80', 'Members']]}", "{[['#D4AF37', 'Transactions'], ['#4ade80', 'New Members']]}")

# 5. Fix Recent Activity to dynamically show recent events instead of mock
text = text.replace(
"""                <div style={{ fontFamily: '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 14 }}>Recent Activity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { icon: '👤', text: 'New scholar account registered', time: '10m ago', color: '#D4AF37' },
                    { icon: '🏛️', text: 'Seal of Dilmun updated', time: '1h ago', color: '#4ade80' },
                    { icon: '📄', text: 'New article submitted for review', time: '2h ago', color: '#60a5fa' },
                    { icon: '💰', text: 'Subscription payment received', time: '3h ago', color: '#ffb86c' },
                  ].map((act, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: i === 3 ? 'none' : '1px solid rgba(212,175,55,0.06)' }}>
                      <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.03)', border: `1px solid ${act.color}33`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                        {act.icon}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#F8F4EA', marginBottom: 2 }}>{act.text}</div>
                        <div style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#C7C3B9' }}>{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>""",
"""                <div style={{ fontFamily: '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 14 }}>Recent Activity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(() => {
                    const acts = [];
                    if(dbUsers.length > 0) {
                      const sorted = [...dbUsers].sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime());
                      acts.push({ icon: '👤', text: `New user: ${sorted[0].name}`, time: sorted[0].createdAt ? new Date(sorted[0].createdAt).toLocaleDateString() : 'Recent', color: '#D4AF37' });
                    }
                    if(dbArtifacts.length > 0) {
                      const sorted = [...dbArtifacts].sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime());
                      acts.push({ icon: '🏛️', text: `Artifact added: ${sorted[0].name}`, time: sorted[0].createdAt ? new Date(sorted[0].createdAt).toLocaleDateString() : 'Recent', color: '#4ade80' });
                    }
                    if(dbArticles.length > 0) {
                      const sorted = [...dbArticles].sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime());
                      acts.push({ icon: '📄', text: `Article added: ${sorted[0].title || 'Untitled'}`, time: sorted[0].createdAt ? new Date(sorted[0].createdAt).toLocaleDateString() : 'Recent', color: '#60a5fa' });
                    }
                    if(payments.filter(p=>p.status==='confirmed').length > 0) {
                      const sorted = [...payments.filter(p=>p.status==='confirmed')].sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime());
                      acts.push({ icon: '💰', text: `Payment of $${sorted[0].price} confirmed`, time: sorted[0].createdAt ? new Date(sorted[0].createdAt).toLocaleDateString() : 'Recent', color: '#ffb86c' });
                    }
                    if(acts.length === 0) acts.push({ icon: '⭐', text: 'System ready', time: 'Now', color: '#D4AF37' });
                    return acts.slice(0, 4).map((act, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: i === acts.length - 1 ? 'none' : '1px solid rgba(212,175,55,0.06)' }}>
                      <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.03)', border: `1px solid ${act.color}33`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                        {act.icon}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#F8F4EA', marginBottom: 2 }}>{act.text}</div>
                        <div style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#C7C3B9' }}>{act.time}</div>
                      </div>
                    </div>
                  ));
                  })()}
                </div>"""
)

# 6. Change artifacts.map to dbArtifacts.map
text = text.replace("artifacts.map((a, i) => (", "dbArtifacts.map((a, i) => (")
# 7. Change usersData.map to dbUsers.map
text = text.replace("usersData.map((u, i) => (", "dbUsers.map((u, i) => (")

# 8. Add payments view content (similar to users)
text = text.replace(
"""          {activeNav === 'settings' && (
            <div>
              <div style={{ fontFamily: '"Playfair Display"', fontSize: '1.2rem', color: '#F8F4EA', marginBottom: 20 }}>System Settings</div>""",
"""          {activeNav === 'payments' && (
            <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: '"Playfair Display"', fontSize: '1rem', color: '#D4AF37' }}>{isAr ? 'المدفوعات' : 'Payments'}</div>
                <div style={{ flex: 1 }} />
              </div>
              <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(212,175,55,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'المعرف' : 'ID'}</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'المستخدم' : 'User'}</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'الباقة' : 'Plan'}</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'السعر' : 'Price'}</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'التاريخ' : 'Date'}</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={p._id || i} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'none' }}>
                        <td style={{ padding: '11px 14px', fontFamily: 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{p._id ? p._id.substring(0,6) : (i+1)}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#F8F4EA' }}>{p.user?.name || p.userId || 'Unknown'}</div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9' }}>{p.user?.email || ''}</div>
                        </td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#F8F4EA' }}>{p.planId}</td>
                        <td style={{ padding: '11px 14px', fontFamily: 'Inter', fontSize: '0.75rem', color: '#D4AF37' }}>${p.price}</td>
                        <td style={{ padding: '11px 14px', fontFamily: 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: 12, fontSize: '0.65rem', fontFamily: 'Inter', background: p.status === 'confirmed' ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,107,0.1)', color: p.status === 'confirmed' ? '#4ade80' : '#ff6b6b' }}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeNav === 'settings' && (
            <div>
              <div style={{ fontFamily: '"Playfair Display"', fontSize: '1.2rem', color: '#F8F4EA', marginBottom: 20 }}>System Settings</div>"""
)


# Fix the Arabic texts in Users table (from my previous fixes that got overwritten)
text = text.replace(
"""          {activeNav === 'users' && (
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: '"Playfair Display"', fontSize: '1rem', color: '#D4AF37' }}>User Management</div>
                <div style={{ flex: 1 }} />
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, cursor: 'pointer', color: '#D4AF37', fontFamily: 'Inter', fontSize: '0.75rem' }}>
                  <Plus size={14} /> Add User
                </button>
              </div>
              <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(212,175,55,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>User</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>Plan</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>Joined</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>Country</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbUsers.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'none' }}>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: '#F8F4EA' }}>{u.name}</div>
                          <div style={{ fontFamily: 'Inter', fontSize: '0.68rem', color: '#C7C3B9' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '11px 14px', fontFamily: 'Inter', fontSize: '0.75rem', color: '#F8F4EA' }}>{u.plan}</td>
                        <td style={{ padding: '11px 14px', fontFamily: 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{u.joined}</td>
                        <td style={{ padding: '11px 14px', fontFamily: 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{u.country}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: 12, fontSize: '0.65rem', fontFamily: 'Inter', background: u.status === 'Active' ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,107,0.1)', color: u.status === 'Active' ? '#4ade80' : '#ff6b6b' }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {[{ icon: <Eye size={13} />, color: '#C7C3B9' }, { icon: <Edit size={13} />, color: '#D4AF37' }, { icon: <Trash2 size={13} />, color: '#ff6b6b' }].map((btn, bi) => (
                              <button key={bi} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: `1px solid ${btn.color}33`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: btn.color }}>{btn.icon}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}""",
"""          {activeNav === 'users' && (
            <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: '"Playfair Display"', fontSize: '1rem', color: '#D4AF37' }}>{isAr ? 'إدارة المستخدمين' : 'User Management'}</div>
                <div style={{ flex: 1 }} />
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, cursor: 'pointer', color: '#D4AF37', fontFamily: 'Inter', fontSize: '0.75rem' }}>
                  <Plus size={14} /> {isAr ? 'إضافة مستخدم' : 'Add User'}
                </button>
              </div>
              <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(212,175,55,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'المستخدم' : 'User'}</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'الباقة' : 'Plan'}</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'الانضمام' : 'Joined'}</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'الدولة' : 'Country'}</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'الحالة' : 'Status'}</th>
                      <th style={{ padding: '12px 14px', fontFamily: '"Playfair Display"', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>{isAr ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbUsers.map((u, i) => (
                      <tr key={u._id || i} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'none' }}>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#F8F4EA' }}>{isAr ? u.name : u.name}</div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '11px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#F8F4EA' }}>{u.plan || u.level || 'Visitor'}</td>
                        <td style={{ padding: '11px 14px', fontFamily: 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td style={{ padding: '11px 14px', fontFamily: 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{u.country || 'Unknown'}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: 12, fontSize: '0.65rem', fontFamily: 'Inter', background: u.isActive !== false ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,107,0.1)', color: u.isActive !== false ? '#4ade80' : '#ff6b6b' }}>
                            {u.isActive !== false ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {[{ icon: <Eye size={13} />, color: '#C7C3B9' }, { icon: <Edit size={13} />, color: '#D4AF37' }, { icon: <Trash2 size={13} />, color: '#ff6b6b' }].map((btn, bi) => (
                              <button key={bi} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: `1px solid ${btn.color}33`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: btn.color }}>{btn.icon}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}"""
)

with open("src/app/components/AdminPanel.tsx", "w", encoding="utf8") as f:
    f.write(text)

print("Done")
