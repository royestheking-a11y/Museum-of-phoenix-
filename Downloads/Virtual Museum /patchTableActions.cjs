const fs = require('fs');

let content = fs.readFileSync('src/app/components/AdminPanel.tsx', 'utf8');

// Update Add Article/Course buttons
content = content.replace(
  /<button style=\{\{ padding: '8px 16px', background: 'linear-gradient\(135deg,#D4AF37,#8B6914\)', border: 'none', borderRadius: 6, color: '#0D1117', fontFamily: isAr \? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 \}\}>\s*<Plus size=\{14\} \/> \{isAr \? 'إضافة مقال' : 'Add Article'\}\s*<\/button>/,
  '<button onClick={() => handleEdit(\\'article\\', null)} style={{ padding: \\'8px 16px\\', background: \\'linear-gradient(135deg,#D4AF37,#8B6914)\\', border: \\'none\\', borderRadius: 6, color: \\'#0D1117\\', fontFamily: isAr ? \\'"IBM Plex Sans Arabic"\\' : \\'Inter\\', fontSize: \\'0.8rem\\', fontWeight: 700, cursor: \\'pointer\\', display: \\'flex\\', alignItems: \\'center\\', gap: 6 }}><Plus size={14} /> {isAr ? \\'إضافة مقال\\' : \\'Add Article\\'}</button>'
);

content = content.replace(
  /<button style=\{\{ padding: '8px 16px', background: 'linear-gradient\(135deg,#D4AF37,#8B6914\)', border: 'none', borderRadius: 6, color: '#0D1117', fontFamily: isAr \? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 \}\}>\s*<Plus size=\{14\} \/> \{isAr \? 'إضافة دورة' : 'Add Course'\}\s*<\/button>/,
  '<button onClick={() => handleEdit(\\'course\\', null)} style={{ padding: \\'8px 16px\\', background: \\'linear-gradient(135deg,#D4AF37,#8B6914)\\', border: \\'none\\', borderRadius: 6, color: \\'#0D1117\\', fontFamily: isAr ? \\'"IBM Plex Sans Arabic"\\' : \\'Inter\\', fontSize: \\'0.8rem\\', fontWeight: 700, cursor: \\'pointer\\', display: \\'flex\\', alignItems: \\'center\\', gap: 6 }}><Plus size={14} /> {isAr ? \\'إضافة دورة\\' : \\'Add Course\\'}</button>'
);


function replaceTableActions(typeStr, varName) {
  const findRegex = new RegExp(
    `\\{\\[\\{ icon: <Eye size=\\{13\\} \\/>, color: '#C7C3B9' \\}, \\{ icon: <Edit size=\\{13\\} \\/>, color: '#D4AF37' \\}, \\{ icon: <Trash2 size=\\{13\\} \\/>, color: '#ff6b6b' \\}\\]\\.map\\(\\(btn, bi\\) => \\(.*?<button key=\\{bi\\}[^>]+>\\{btn\\.icon\\}<\\/button>.*?\\)\\)\\}`
  );
  
  const replaceStr = `
                            <button onClick={() => handleEdit('${typeStr}', ${varName})} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: \`1px solid #D4AF3733\`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}><Edit size={13} /></button>
                            <button onClick={() => handleDelete('${typeStr}', ${varName}._id || ${varName}.id)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: \`1px solid #ff6b6b33\`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b' }}><Trash2 size={13} /></button>
  `;
  
  content = content.replace(findRegex, replaceStr);
}

replaceTableActions('artifact', 'a'); // first match in artifacts map
replaceTableActions('user', 'u'); // next match in users map
replaceTableActions('article', 'a'); // next match in articles map
replaceTableActions('course', 'c'); // next match in courses map

fs.writeFileSync('src/app/components/AdminPanel.tsx', content);
console.log('Action buttons patched');
