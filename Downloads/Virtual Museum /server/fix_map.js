const fs = require('fs');
let content = fs.readFileSync('../src/app/components/MuseumDome.tsx', 'utf8');

// Find the control buttons container
content = content.replace(
  /className="hidden md:flex absolute flex-row gap-4" style=\{\{ top: 'calc\(16px \+ env\(safe-area-inset-top\)\)', left: '24px', zIndex: 50 \}\}/g,
  'className="hidden md:flex absolute flex-row gap-4" style={{ top: \'calc(16px + env(safe-area-inset-top))\', [isAr ? \'right\' : \'left\']: \'24px\', zIndex: 50, direction: \'ltr\' }}'
);

// Find the map popup
content = content.replace(
  /style=\{\{ position: 'absolute', top: 'calc\(72px \+ env\(safe-area-inset-top\)\)', left: 24, zIndex: 50,/g,
  'style={{ position: \'absolute\', top: \'calc(72px + env(safe-area-inset-top))\', [isAr ? \'right\' : \'left\']: 24, zIndex: 50,'
);

// Find the floor selector popup
content = content.replace(
  /style=\{\{ position: 'absolute', top: 'calc\(72px \+ env\(safe-area-inset-top\)\)', left: 80, zIndex: 50,/g,
  'style={{ position: \'absolute\', top: \'calc(72px + env(safe-area-inset-top))\', [isAr ? \'right\' : \'left\']: 80, zIndex: 50,'
);

fs.writeFileSync('../src/app/components/MuseumDome.tsx', content);
