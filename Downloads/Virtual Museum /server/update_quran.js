const fs = require('fs');

let file = fs.readFileSync('../src/app/components/halls/QuranHall.tsx', 'utf8');

// The replacement for the item list
if (file.includes('<div style={{ flex: 1, minWidth: 0 }}>')) {
  file = file.replace(
    /<div style={{ flex: 1, minWidth: 0 }}>/,
    `{sym.icon && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{sym.icon}</div>}\n                <div style={{ flex: 1, minWidth: 0 }}>`
  );
}

fs.writeFileSync('../src/app/components/halls/QuranHall.tsx', file);
