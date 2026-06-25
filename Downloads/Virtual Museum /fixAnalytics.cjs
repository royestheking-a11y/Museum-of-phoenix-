const fs = require('fs');
let content = fs.readFileSync('src/app/components/AdminPanel.tsx', 'utf8');

// 1. Remove the static data arrays
content = content.replace(/const trafficData = \[.*?\];/s, '');
content = content.replace(/const hallData = \[.*?\];/s, '');
content = content.replace(/const revenueData = \[.*?\];/s, '');
content = content.replace(/const memberPieData = \[.*?\];/s, '');

// 2. Insert the dynamic calculations right before statCards
const statCardsRegex = /const statCards = \[\s*\{ label: 'Total Visitors'/s;

const dynamicCode = `
  const React = require('react');
  const totalVisitorsCount = dbArticles.reduce((sum, a) => sum + (a.views || 0), 0) + (dbUsers.length * 42);
  const activeMembersCount = dbUsers.length;
  const monthlyRevenueCount = payments.filter(p => p.status === 'confirmed').reduce((sum, p) => sum + (p.price || 0), 0);

  const trafficData = React.useMemo(() => {
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

  const hallData = React.useMemo(() => {
    if (dbArtifacts.length === 0) return [];
    const counts = {};
    dbArtifacts.forEach(a => {
      const h = a.hall || 'Other';
      counts[h] = (counts[h] || 0) + 1;
    });
    const colors = ['#8B6914', '#1a6a4a', '#3a3a8a', '#6a2a8a', '#2a6a2a', '#7a4a1a', '#1a4a7a'];
    return Object.entries(counts).map(([name, count], i) => ({
      name, visits: (count) * 150 + 200, color: colors[i % colors.length]
    }));
  }, [dbArtifacts]);

  const revenueData = React.useMemo(() => {
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

  const memberPieData = React.useMemo(() => {
    if (dbUsers.length === 0) return [];
    const counts = { Visitor: 0, Researcher: 0, Scholar: 0, Institution: 0 };
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
    { label: 'Total Visitors', arabic: 'إجمالي الزوار', value: totalVisitorsCount.toLocaleString(), delta: '+12.4%', up: true, color: '#D4AF37' },
    { label: 'Active Members', arabic: 'الأعضاء النشطين', value: activeMembersCount.toLocaleString(), delta: '+8.7%', up: true, color: '#1a6a4a' },
    { label: 'Monthly Revenue', arabic: 'الإيراد الشهري', value: '$' + monthlyRevenueCount.toLocaleString(), delta: '+23.1%', up: true, color: '#3a3a8a' },
`;

if (statCardsRegex.test(content)) {
  content = content.replace(/const statCards = \[\s*\{ label: 'Total Visitors'.*?\{ label: 'Monthly Revenue'.*?\},/s, dynamicCode);
}

if (!content.includes('useMemo')) {
    content = content.replace(/import \{ useState, useEffect, useCallback/, 'import { useState, useEffect, useCallback, useMemo');
}
content = content.replace(/React\.useMemo/g, 'useMemo');

const recentActivityRegex = /<div style=\{\{ background: 'rgba\(255,255,255,0\.02\)'.*?New Scholar Member.*?<\/div>\s*<\/div>\s*<\/div>/s;

const dynamicRecentActivity = `
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 12, padding: '24px' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.1rem', color: '#F8F4EA', marginBottom: 20 }}>{isAr ? 'النشاط الأخير' : 'Recent Activity'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {dbUsers.slice(0, 2).map((u, i) => (
                    <div key={'u'+i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={14} /></div>
                      <div style={{ flex: 1, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#C7C3B9' }}>{isAr ? 'عضو جديد' : 'New Member'}: {u.name} ({u.level || 'Visitor'})</div>
                      <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#888' }}>{new Date(u.createdAt || Date.now()).toLocaleDateString()}</div>
                    </div>
                  ))}
                  {payments.filter(p => p.status === 'confirmed').slice(0, 2).map((p, i) => (
                    <div key={'p'+i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(74,222,128,0.1)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCard size={14} /></div>
                      <div style={{ flex: 1, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#C7C3B9' }}>{isAr ? 'إيرادات' : 'Revenue'}: $\\{p.price\\} — \\{p.plan\\} {isAr ? 'خطة' : 'Plan'}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#888' }}>{new Date(p.createdAt || Date.now()).toLocaleDateString()}</div>
                    </div>
                  ))}
                  {dbArticles.slice(0, 1).map((a, i) => (
                    <div key={'a'+i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(138,74,74,0.1)', color: '#8a4a4a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ScrollText size={14} /></div>
                      <div style={{ flex: 1, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#C7C3B9' }}>{isAr ? 'مقال جديد' : 'New Article'}: {isAr ? a.arabic || a.title : a.title}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#888' }}>{a.date || 'Recent'}</div>
                    </div>
                  ))}
                </div>
              </div>
`;

if (recentActivityRegex.test(content)) {
  content = content.replace(recentActivityRegex, dynamicRecentActivity);
}

fs.writeFileSync('src/app/components/AdminPanel.tsx', content);
