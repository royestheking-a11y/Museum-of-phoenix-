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

const data = JSON.parse(fs.readFileSync('artifacts_data.json', 'utf8')).filter(x => x.hall === 'History');
let arrayStr = 'const artifacts = [\n';
data.forEach((item, i) => {
  // delete the old symbol string if it exists
  delete item.symbol;
  let itemStr = JSON.stringify(item);
  itemStr = itemStr.slice(0, -1) + `, symbol: ${assignIcon(item.name, item.category, i)} }`;
  arrayStr += '  ' + itemStr + ',\n';
});
arrayStr += '];\n';

let file = fs.readFileSync('../src/app/components/halls/HistoryHall.tsx', 'utf8');
let match = file.match(/const artifacts = \[\s*([\s\S]*?)\s*\];\n/);
if (match) {
  file = file.replace(match[0], arrayStr);
}

fs.writeFileSync('../src/app/components/halls/HistoryHall.tsx', file);
