const fs = require('fs');

const ICONS = [
  'Sun', 'Moon', 'Star', 'Shield', 'Sword', 'Zap', 
  'Droplets', 'TreeDeciduous', 'Bird', 'BookOpen', 'ScrollText', 'Sparkles', 'Building2',
  'Eye', 'PenTool', 'Compass', 'Globe', 'Map', 'Key', 'Lock', 'Diamond',
  'Feather', 'Target', 'Wind', 'Flame', 'Mountain', 'Cloud', 'Tent'
];

function getIcon(i) {
  let iconName = ICONS[i % ICONS.length];
  return `<${iconName} size={32} color="#D4AF37" strokeWidth={1.5} />`;
}

function processQuranHall() {
  let file = fs.readFileSync('../src/app/components/halls/QuranHall.tsx', 'utf8');
  if (file.includes('icon: <')) return; // already processed
  
  file = file.replace(
    /import \{ .* \} from 'lucide-react';/,
    `import { ${ICONS.join(', ')}, Filter, X, Volume2, Share2, Bookmark, ArrowLeft } from 'lucide-react';`
  );
  
  let match = file.match(/export const symbolData: Record<string, SE\[\]> = ([\s\S]*?);\n\n/);
  if (match) {
    let inner = match[1];
    let i = 0;
    inner = inner.replace(/word:\s*'[^']+',/g, (m) => {
      let icon = getIcon(i++);
      return `${m} icon: ${icon},`;
    });
    file = file.replace(match[0], `export const symbolData: Record<string, any[]> = ${inner};\n\n`);
  }
  
  // replace where it renders
  // In QuranHall.tsx, wait, let's see where it renders symbol details.
  // There's a motion.div for each symbol.
  file = file.replace(
    /<div style={{ flex: 1 }}>\n\s*<div style={{ display: 'flex'/,
    `{sym.icon && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{sym.icon}</div>}\n                    <div style={{ flex: 1 }}>\n                      <div style={{ display: 'flex'`
  );
  file = file.replace(
    /<div style={{ fontSize: '3\.5rem', color: '#D4AF37'/,
    `{selectedSymbol.icon && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>{selectedSymbol.icon}</div>}\n                <div style={{ fontSize: '3.5rem', color: '#D4AF37'`
  );
  fs.writeFileSync('../src/app/components/halls/QuranHall.tsx', file);
}

function processCryptoHall() {
  let file = fs.readFileSync('../src/app/components/halls/CryptographyHall.tsx', 'utf8');
  if (file.includes('icon: <')) return; // already processed
  file = file.replace(
    /import \{ .* \} from 'lucide-react';/,
    `import { ${ICONS.join(', ')}, Settings, Copy, ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';`
  );
  let match = file.match(/const HISTORY_DATA = \[\s*([\s\S]*?)\s*\];\n/);
  if (match) {
    let inner = match[1];
    let i = 0;
    inner = inner.replace(/name:\s*"[^"]+",/g, (m) => {
      let icon = getIcon(i++);
      return `${m} icon: ${icon},`;
    });
    file = file.replace(match[0], `const HISTORY_DATA = [\n  ${inner}\n];\n`);
  }
  // Cryptography renders HISTORY_DATA in a timeline or list
  file = file.replace(
    /<h3 style={{ fontFamily: '\"Playfair Display\"'/,
    `{item.icon && <div style={{ marginBottom: 12 }}>{item.icon}</div>}\n                      <h3 style={{ fontFamily: '"Playfair Display"'`
  );
  fs.writeFileSync('../src/app/components/halls/CryptographyHall.tsx', file);
}

function processManuscriptHall() {
  let file = fs.readFileSync('../src/app/components/halls/ManuscriptHall.tsx', 'utf8');
  if (file.includes('icon: <')) return; // already processed
  file = file.replace(
    /import \{ .* \} from 'lucide-react';/,
    `import { ${ICONS.join(', ')}, ZoomIn, ZoomOut, BookOpen, Search, X, Volume2, Bookmark, Share2 } from 'lucide-react';`
  );
  let match = file.match(/const manuscripts = \[\s*([\s\S]*?)\s*\];\n/);
  if (match) {
    let inner = match[1];
    let i = 0;
    inner = inner.replace(/id:\s*'[^']+',/g, (m) => {
      let icon = getIcon(i++);
      return `${m} icon: ${icon},`;
    });
    file = file.replace(match[0], `const manuscripts = [\n  ${inner}\n];\n`);
  }
  file = file.replace(
    /<div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>/,
    `<div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>\n                  {manuscript.icon && <div style={{ marginBottom: 12 }}>{manuscript.icon}</div>}`
  );
  file = file.replace(
    /<h3 style={{ fontFamily: '\"Playfair Display\"', fontSize: '1\.8rem', color: '#D4AF37'/,
    `{selected.icon && <div style={{ marginBottom: 16 }}>{selected.icon}</div>}\n                <h3 style={{ fontFamily: '"Playfair Display"', fontSize: '1.8rem', color: '#D4AF37'`
  );
  fs.writeFileSync('../src/app/components/halls/ManuscriptHall.tsx', file);
}

function processSemioticsHall() {
  let file = fs.readFileSync('../src/app/components/halls/SemioticsHall.tsx', 'utf8');
  if (file.includes('icon: <')) return; // already processed
  file = file.replace(
    /import \{ .* \} from 'lucide-react';/,
    `import { ${ICONS.join(', ')}, Circle, Triangle, Hexagon, X, Volume2, Share2, Bookmark } from 'lucide-react';`
  );
  let match = file.match(/const catalog = \[\s*([\s\S]*?)\s*\];\n/);
  if (match) {
    let inner = match[1];
    let i = 0;
    inner = inner.replace(/id:\s*'[^']+',/g, (m) => {
      let icon = getIcon(i++);
      return `${m} icon: ${icon},`;
    });
    file = file.replace(match[0], `const catalog = [\n  ${inner}\n];\n`);
  }
  file = file.replace(
    /<div style={{ padding: 24 }}>\n\s*<h3/,
    `<div style={{ padding: 24 }}>\n                  {item.icon && <div style={{ marginBottom: 12 }}>{item.icon}</div>}\n                  <h3`
  );
  file = file.replace(
    /<h3 style={{ fontFamily: '\"Playfair Display\"', fontSize: '2\.2rem', color: '#F8F4EA'/,
    `{selectedItem.icon && <div style={{ marginBottom: 16 }}>{selectedItem.icon}</div>}\n                <h3 style={{ fontFamily: '"Playfair Display"', fontSize: '2.2rem', color: '#F8F4EA'`
  );
  fs.writeFileSync('../src/app/components/halls/SemioticsHall.tsx', file);
}

try {
  processQuranHall();
  processCryptoHall();
  processManuscriptHall();
  processSemioticsHall();
} catch (e) {
  console.log(e);
}
