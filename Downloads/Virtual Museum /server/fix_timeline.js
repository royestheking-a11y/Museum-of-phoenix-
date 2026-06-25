const fs = require('fs');
let file = fs.readFileSync('../src/app/components/SymbolTimeline.tsx', 'utf8');

file = file.replace(
  "style={{ maxWidth: 800, padding: 40, display: 'flex', gap: 40, alignItems: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: 24, border: '1px solid rgba(212,175,55,0.2)', backdropFilter: 'blur(20px)' }}",
  "style={{ maxWidth: 800, padding: '20px 40px', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: 24, border: '1px solid rgba(212,175,55,0.2)', backdropFilter: 'blur(20px)', maxHeight: '90vh', overflowY: 'auto', margin: '0 20px' }}"
);

fs.writeFileSync('../src/app/components/SymbolTimeline.tsx', file);
