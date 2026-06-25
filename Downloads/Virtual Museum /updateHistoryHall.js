const fs = require('fs');

const path = 'src/app/components/halls/HistoryHall.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update imports
content = content.replace(
  "import { Landmark, Clock, MapPin, Tag, BookOpen, Share2, Bookmark, Volume2, Filter, X, Cloud, Eye, Zap, TreeDeciduous, Sun, Bird, Moon, Droplets, Trophy } from 'lucide-react';",
  "import { Landmark, Clock, MapPin, Tag, BookOpen, Share2, Bookmark, Volume2, Filter, X, Cloud, Eye, Zap, TreeDeciduous, Sun, Bird, Moon, Droplets, Trophy, Coins, Shield, Crown, Flower2, ScrollText, Sparkles, Building2, PenTool, Hexagon } from 'lucide-react';"
);

// Add renderPremiumIcon function before export default
const renderIconFunc = `
const renderPremiumIcon = (artifact: any, size: number) => {
  const name = artifact.name.toLowerCase();
  const cat = artifact.category.toLowerCase();
  const c = "#D4AF37";
  
  if (name.includes('seal') || name.includes('stamp')) return <Sparkles size={size} color={c} strokeWidth={1.5} />;
  if (name.includes('coin') || name.includes('dinar') || name.includes('dirham')) return <Coins size={size} color={c} strokeWidth={1.5} />;
  if (name.includes('eye')) return <Eye size={size} color={c} strokeWidth={1.5} />;
  if (name.includes('tablet') || name.includes('inscription') || cat.includes('script')) return <ScrollText size={size} color={c} strokeWidth={1.5} />;
  if (name.includes('head') || name.includes('bull')) return <Hexagon size={size} color={c} strokeWidth={1.5} />;
  if (name.includes('blazon') || name.includes('shield')) return <Shield size={size} color={c} strokeWidth={1.5} />;
  if (name.includes('palace') || name.includes('temple') || name.includes('altar') || name.includes('city') || cat.includes('architecture')) return <Building2 size={size} color={c} strokeWidth={1.5} />;
  if (name.includes('flower') || name.includes('tile') || name.includes('agricultural')) return <Flower2 size={size} color={c} strokeWidth={1.5} />;
  if (name.includes('star') || name.includes('moon') || name.includes('sun') || name.includes('astronomy')) return <Moon size={size} color={c} strokeWidth={1.5} />;
  if (name.includes('royal') || name.includes('king') || name.includes('sultan')) return <Crown size={size} color={c} strokeWidth={1.5} />;
  if (cat.includes('manuscript') || cat.includes('calligraphy')) return <PenTool size={size} color={c} strokeWidth={1.5} />;
  if (cat.includes('weapon')) return <Zap size={size} color={c} strokeWidth={1.5} />;

  // Text fallback
  const textSymbol = typeof artifact.symbol === 'object' ? '✧' : artifact.symbol;
  return <div style={{ maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'inline-block' }}>{textSymbol}</div>;
};

export default function HistoryHall() {`;

content = content.replace("export default function HistoryHall() {", renderIconFunc);

// Update card rendering
content = content.replace(
  "<div style={{ fontSize: '2.5rem', marginBottom: 12, marginTop: artifact.significance === 'CRITICAL' ? 14 : 0, filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.4))', lineHeight: 1 }}>{typeof artifact.symbol === 'object' ? '✧' : artifact.symbol}</div>",
  "<div style={{ fontSize: '2.5rem', marginBottom: 12, marginTop: artifact.significance === 'CRITICAL' ? 14 : 0, filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.4))', lineHeight: 1, display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>{renderPremiumIcon(artifact, 40)}</div>"
);

// Update modal rendering
content = content.replace(
  "<div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: 16, filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.5))' }}>{typeof selected.symbol === 'object' ? '✧' : selected.symbol}</div>",
  "<div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: 16, filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.5))', display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>{renderPremiumIcon(selected, 64)}</div>"
);

fs.writeFileSync(path, content);
console.log('HistoryHall updated');
