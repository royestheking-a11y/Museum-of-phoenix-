const fs = require('fs');

const ICONS = [
  'Sun', 'Moon', 'Star', 'Landmark', 'Crown', 'Hexagon', 'Shield', 'Sword', 'Zap', 
  'Droplets', 'TreeDeciduous', 'Bird', 'BookOpen', 'ScrollText', 'Sparkles', 'Building2',
  'Coins', 'Eye', 'PenTool', 'Compass', 'Globe', 'Map', 'Key', 'Lock', 'Diamond',
  'Feather', 'Anchor', 'Flag', 'Target', 'Wind', 'Flame', 'Mountain', 'Cloud', 'Tent'
];

function assignIcon(name, category, index) {
  name = (name || '').toLowerCase();
  category = (category || '').toLowerCase();
  
  let iconName = 'Landmark';
  if (name.includes('seal') || name.includes('stamp')) iconName = 'Sparkles';
  else if (name.includes('coin') || name.includes('dinar') || name.includes('dirham')) iconName = 'Coins';
  else if (name.includes('eye')) iconName = 'Eye';
  else if (name.includes('tablet') || name.includes('inscription') || category.includes('script') || name.includes('manuscript')) iconName = 'ScrollText';
  else if (name.includes('head') || name.includes('bull')) iconName = 'Hexagon';
  else if (name.includes('blazon') || name.includes('shield')) iconName = 'Shield';
  else if (name.includes('sword') || category.includes('weapon')) iconName = 'Sword';
  else if (name.includes('palace') || name.includes('temple') || name.includes('altar') || name.includes('city') || category.includes('architecture')) iconName = 'Building2';
  else if (name.includes('flower') || name.includes('tile') || name.includes('agricultural')) iconName = 'TreeDeciduous';
  else if (name.includes('star') || name.includes('astronomy')) iconName = 'Star';
  else if (name.includes('moon')) iconName = 'Moon';
  else if (name.includes('sun')) iconName = 'Sun';
  else if (name.includes('royal') || name.includes('king') || name.includes('sultan')) iconName = 'Crown';
  else if (category.includes('calligraphy')) iconName = 'PenTool';
  else if (name.includes('bird') || name.includes('eagle')) iconName = 'Bird';
  else if (name.includes('compass') || name.includes('astrolabe')) iconName = 'Compass';
  else {
    iconName = ICONS[index % ICONS.length];
  }
  return `<${iconName} size={32} color="#D4AF37" strokeWidth={1.5} />`;
}

let historyContent = fs.readFileSync('../src/app/components/halls/HistoryHall.tsx', 'utf8');

// Ensure all imports are there
const importsToAdd = ICONS.join(', ');
historyContent = historyContent.replace(
  /import \{ .* \} from 'lucide-react';/,
  `import { ${importsToAdd}, Filter, X, Volume2, Share2, Bookmark, MapPin, Tag } from 'lucide-react';`
);

// Remove renderPremiumIcon function
historyContent = historyContent.replace(/const renderPremiumIcon = \(artifact: any, size: number\) => \{[\s\S]*?\};\n\n/, '');

// Add explicit symbol property to artifacts
let updatedArtifacts = [];
let artifactMatch = historyContent.match(/const artifacts = \[\s*([\s\S]*?)\s*\];\n/);
if (artifactMatch) {
  let inner = artifactMatch[1];
  // naive split by '},'
  let items = inner.split(/},\s*(?=\{)/);
  items = items.map((item, i) => {
    if (!item.endsWith('}')) item += '}';
    let nameMatch = item.match(/name:\s*'([^']+)'/);
    let catMatch = item.match(/category:\s*'([^']+)'/);
    let name = nameMatch ? nameMatch[1] : '';
    let category = catMatch ? catMatch[1] : '';
    
    let symbol = assignIcon(name, category, i);
    // if it already has symbol, replace it
    if (item.includes('symbol:')) {
      item = item.replace(/symbol:\s*[^,]+,/, `symbol: ${symbol},`);
    } else {
      item = item.replace(/,\s*$/, '') + `, symbol: ${symbol}`;
      item = item.replace('}', ` symbol: ${symbol} }`);
    }
    return item;
  });
  
  historyContent = historyContent.replace(artifactMatch[0], `const artifacts = [\n  ${items.join(',\n  ')}\n];\n`);
}

// Replace renderPremiumIcon calls with artifact.symbol
historyContent = historyContent.replace(/\{renderPremiumIcon\(artifact, 40\)\}/g, '{artifact.symbol}');
historyContent = historyContent.replace(/\{renderPremiumIcon\(selected, 64\)\}/g, '{selected.symbol}');

fs.writeFileSync('../src/app/components/halls/HistoryHall.tsx', historyContent);

