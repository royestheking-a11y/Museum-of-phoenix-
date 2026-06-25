const fs = require('fs');
let content = fs.readFileSync('src/app/components/AdminPanel.tsx', 'utf8');

// Replace trafficData to be based strictly on dbUsers and payments (since we don't have visitor history)
const trafficRegex = /const trafficData = useMemo\(\(\) => \{[\s\S]*?\}, \[totalVisitorsCount, activeMembersCount\]\);/;
const newTraffic = `const trafficData = useMemo(() => {
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
  }, [dbUsers, payments]);`;

content = content.replace(trafficRegex, newTraffic);

// Replace Weekly Traffic title and chart lines
content = content.replace(/Weekly Traffic/g, "Weekly Signups & Transactions");
content = content.replace(/<Line type="monotone" dataKey="visitors" stroke="#D4AF37" strokeWidth=\{2\} dot=\{false\} \/>/g, '<Line type="monotone" dataKey="transactions" stroke="#D4AF37" strokeWidth={2} dot={false} />');
content = content.replace(/\{\[\['#D4AF37', 'Visitors'\], \['#4ade80', 'Members'\]\]/g, "{[['#D4AF37', 'Transactions'], ['#4ade80', 'New Members']]");


// Replace statCards deltas with real calculations
const statCardsRegex = /const statCards = \[[\s\S]*?\];/;
const newStatCards = `const statCards = [
    { label: 'Total Visitors', arabic: 'إجمالي الزوار', value: totalVisitorsCount.toLocaleString(), delta: 'All Time', up: true, color: '#D4AF37' },
    { label: 'Active Members', arabic: 'الأعضاء النشطين', value: activeMembersCount.toLocaleString(), delta: (dbUsers.filter(u => new Date(u.createdAt) >= new Date(Date.now() - 7*24*60*60*1000)).length > 0 ? \`+\${dbUsers.filter(u => new Date(u.createdAt) >= new Date(Date.now() - 7*24*60*60*1000)).length} this week\` : 'No new this week'), up: true, color: '#1a6a4a' },
    { label: 'Monthly Revenue', arabic: 'الإيراد الشهري', value: '$' + monthlyRevenueCount.toLocaleString(), delta: (payments.filter(p => p.status === 'confirmed' && new Date(p.createdAt) >= new Date(Date.now() - 30*24*60*60*1000)).reduce((sum, p) => sum + (p.price || 0), 0) > 0 ? \`+\$\${payments.filter(p => p.status === 'confirmed' && new Date(p.createdAt) >= new Date(Date.now() - 30*24*60*60*1000)).reduce((sum, p) => sum + (p.price || 0), 0)} this month\` : 'No new revenue'), up: true, color: '#3a3a8a' },
    { label: 'Artifacts', arabic: 'القطع الأثرية', value: dbArtifacts.length > 0 ? dbArtifacts.length.toLocaleString() : '...', delta: (dbArtifacts.filter(a => new Date(a.createdAt) >= new Date(Date.now() - 7*24*60*60*1000)).length > 0 ? \`+\${dbArtifacts.filter(a => new Date(a.createdAt) >= new Date(Date.now() - 7*24*60*60*1000)).length} this week\` : 'No new this week'), up: true, color: '#6a2a8a' },
  ];`;

content = content.replace(statCardsRegex, newStatCards);


fs.writeFileSync('src/app/components/AdminPanel.tsx', content);
