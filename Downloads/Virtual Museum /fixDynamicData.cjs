const fs = require('fs');
let content = fs.readFileSync('src/app/components/AdminPanel.tsx', 'utf8');

// Fix 1: toLocaleString crash
content = content.replace(
  "{a.views.toLocaleString()}",
  "{(a.views || 0).toLocaleString()}"
);

// Fix 2: Recent Activity
const recentActivityRegex = /\{\[\s*\{\s*icon:\s*'👤'.*?\]\.map\(\(item,\s*i\)\s*=>\s*\(/s;
const newRecentActivity = `{(() => {
                    const acts = [];
                    if (dbUsers.length > 0) {
                      const u = dbUsers[dbUsers.length - 1];
                      acts.push({ icon: '👤', text: \`New member: \${u.name}\`, time: 'Recently', color: '#D4AF37' });
                    }
                    if (dbArtifacts.length > 0) {
                      const a = dbArtifacts[dbArtifacts.length - 1];
                      acts.push({ icon: '📜', text: \`Artifact updated: \${a.name}\`, time: 'Recently', color: '#7a4a1a' });
                    }
                    if (payments.length > 0) {
                      const p = payments[payments.length - 1];
                      acts.push({ icon: '💳', text: \`Payment: $\${p.price || 0}\`, time: 'Recently', color: '#4ade80' });
                    }
                    if (dbCourses.length > 0) {
                      const c = dbCourses[dbCourses.length - 1];
                      acts.push({ icon: '🎓', text: \`Course: "\${c.title}"\`, time: 'Recently', color: '#8a4a8a' });
                    }
                    if (dbArticles.length > 0) {
                      const a = dbArticles[dbArticles.length - 1];
                      acts.push({ icon: '📰', text: \`Article: "\${a.title}"\`, time: 'Recently', color: '#3a3a8a' });
                    }
                    if (acts.length === 0) {
                      acts.push({ icon: '✨', text: 'System Online. Waiting for activity...', time: 'Just now', color: '#C7C3B9' });
                    }
                    return acts;
                  })().map((item, i) => (`;

if (recentActivityRegex.test(content)) {
  content = content.replace(recentActivityRegex, newRecentActivity);
} else {
  console.log("Failed to match recent activity");
}

// Fix 3: Top Search Terms
const topSearchRegex = /\{\[\['Al-Kindi',\s*2340\].*?\]\.map\(\(\[term,\s*count\]\)\s*=>\s*\(/s;
const newTopSearch = `{(() => {
                    const terms = {};
                    dbArticles.forEach(a => { if(a.category) terms[a.category] = (terms[a.category] || 0) + (a.views || 10); });
                    dbArtifacts.forEach(a => { if(a.category) terms[a.category] = (terms[a.category] || 0) + (a.views || 20); });
                    const sorted = Object.entries(terms).sort((a,b) => b[1] - a[1]).slice(0, 8);
                    if (sorted.length === 0) return [['General', 120]];
                    return sorted;
                  })().map(([term, count]) => (`;

if (topSearchRegex.test(content)) {
  content = content.replace(topSearchRegex, newTopSearch);
} else {
  console.log("Failed to match top search");
}

fs.writeFileSync('src/app/components/AdminPanel.tsx', content);
