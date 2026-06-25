const fs = require('fs');
let content = fs.readFileSync('src/app/components/AdminPanel.tsx', 'utf8');

const regex = /\{\[\{ icon: <Eye size=\{13\} \/>, color: '#C7C3B9' \}, \{ icon: <Edit size=\{13\} \/>, color: '#D4AF37' \}, \{ icon: <Trash2 size=\{13\} \/>, color: '#ff6b6b' \}\]\.map\(\(btn, bi\) => \(\s*<button key=\{bi\} style=\{\{ width: 28, height: 28, background: 'rgba\(255,255,255,0\.05\)', border: `1px solid \$\{btn\.color\}33`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: btn\.color \}\}>\{btn\.icon\}<\/button>\s*\)\)\}/g;

let count = 0;
content = content.replace(regex, () => {
    count++;
    let typeStr = '';
    let varName = '';
    if (count === 1) { typeStr = 'artifact'; varName = 'a'; }
    if (count === 2) { typeStr = 'user'; varName = 'u'; }
    if (count === 3) { typeStr = 'article'; varName = 'a'; }
    if (count === 4) { typeStr = 'course'; varName = 'c'; }
    
    return `
                            <button onClick={() => handleEdit('${typeStr}', ${varName})} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: \`1px solid #D4AF3733\`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}><Edit size={13} /></button>
                            <button onClick={() => handleDelete('${typeStr}', ${varName}._id || ${varName}.id)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: \`1px solid #ff6b6b33\`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b' }}><Trash2 size={13} /></button>
    `;
});

fs.writeFileSync('src/app/components/AdminPanel.tsx', content);
console.log('Replaced ' + count + ' occurrences');
