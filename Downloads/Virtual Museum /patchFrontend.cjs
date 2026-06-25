const fs = require('fs');

let content = fs.readFileSync('src/app/components/AdminPanel.tsx', 'utf8');

// 1. Add state and handlers
const stateAndHandlers = `
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'' | 'artifact' | 'user' | 'article' | 'course'>('');
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleEdit = (type: any, item: any) => {
    setModalType(type);
    setEditingItem(item ? { ...item } : {});
    setModalOpen(true);
  };

  const handleDelete = async (type: any, id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      let endpoint = '';
      if (type === 'artifact') endpoint = \`/api/artifacts/\${id}\`;
      if (type === 'user') endpoint = \`/api/users/\${id}\`;
      if (type === 'article') endpoint = \`/api/articles/\${id}\`;
      if (type === 'course') endpoint = \`/api/courses/\${id}\`;
      
      const res = await fetch(\`http://localhost:5005\${endpoint}\`, { method: 'DELETE' });
      if (res.ok) {
        if (type === 'artifact') loadArtifacts();
        if (type === 'user') loadData();
        if (type === 'article') loadData();
        if (type === 'course') loadData();
      } else {
        alert('Failed to delete');
      }
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    try {
      let endpoint = '';
      if (modalType === 'artifact') endpoint = \`/api/artifacts\`;
      if (modalType === 'user') endpoint = \`/api/users\`;
      if (modalType === 'article') endpoint = \`/api/articles\`;
      if (modalType === 'course') endpoint = \`/api/courses\`;

      const isUpdate = !!editingItem._id;
      if (isUpdate) endpoint += \`/\${editingItem._id}\`;

      const res = await fetch(\`http://localhost:5005\${endpoint}\`, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });

      if (res.ok) {
        setModalOpen(false);
        if (modalType === 'artifact') loadArtifacts();
        if (modalType === 'user') loadData();
        if (modalType === 'article') loadData();
        if (modalType === 'course') loadData();
      } else {
        alert('Failed to save');
      }
    } catch (e) { console.error(e); }
  };
`;

if (!content.includes('const handleSave = async () => {')) {
  content = content.replace('const totalVisitorsCount', stateAndHandlers + '\n  const totalVisitorsCount');
}

// 2. Add Modal
const modalJSX = `
  {modalOpen && (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#0D1117', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500, maxHeight: '80vh', overflowY: 'auto' }}>
        <h2 style={{ color: '#F8F4EA', marginBottom: 20 }}>{editingItem._id ? 'Edit' : 'Add'} {modalType}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['artifact', 'article', 'course'].includes(modalType) && (
            <>
              <input placeholder="Title / Name" value={editingItem.title || editingItem.name || ''} onChange={e => setEditingItem({...editingItem, [modalType === 'artifact' ? 'name' : 'title']: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
              <input placeholder="Arabic Title" value={editingItem.arabic || editingItem.nameAr || ''} onChange={e => setEditingItem({...editingItem, [modalType === 'artifact' ? 'nameAr' : 'arabic']: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
            </>
          )}
          {modalType === 'user' && (
            <>
              <input placeholder="Name" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
              <input placeholder="Email" value={editingItem.email || ''} onChange={e => setEditingItem({...editingItem, email: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
              <select value={editingItem.level || 'Visitor'} onChange={e => setEditingItem({...editingItem, level: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }}>
                <option value="Visitor">Visitor</option>
                <option value="Researcher">Researcher</option>
                <option value="Scholar">Scholar</option>
                <option value="Admin">Admin</option>
              </select>
            </>
          )}
          {Object.keys(editingItem).filter(k => !['_id', '__v', 'createdAt', 'updatedAt', 'title', 'name', 'arabic', 'nameAr', 'email', 'level', 'password', 'id'].includes(k) && typeof editingItem[k] === 'string').map(key => (
            <input key={key} placeholder={key} value={editingItem[key] || ''} onChange={e => setEditingItem({...editingItem, [key]: e.target.value})} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave} style={{ flex: 1, padding: '10px', background: '#D4AF37', border: 'none', color: '#000', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )}
`;

if (!content.includes('setModalOpen(false)')) {
  content = content.replace('</motion.div>', modalJSX + '\n    </motion.div>');
}

// 3. Update Add buttons
content = content.replace(
  /<button style=\{\{ padding: '8px 16px', background: 'linear-gradient\(135deg,#D4AF37,#8B6914\)'([^>]+)>\s*<Plus size=\{14\} \/> \{isAr \? 'إضافة قطعة أثرية' : 'Add Artifact'\}\s*<\/button>/g,
  '<button onClick={() => handleEdit(\\'artifact\\', null)} style={{ padding: \\'8px 16px\\', background: \\'linear-gradient(135deg,#D4AF37,#8B6914)\\'$1><Plus size={14} /> {isAr ? \\'إضافة قطعة أثرية\\' : \\'Add Artifact\\'}</button>'
);

content = content.replace(
  /<button style=\{\{ padding: '8px 16px', background: 'linear-gradient\(135deg,#D4AF37,#8B6914\)'([^>]+)>\s*<Plus size=\{14\} \/> \{isAr \? 'إضافة مستخدم' : 'Add User'\}\s*<\/button>/g,
  '<button onClick={() => handleEdit(\\'user\\', null)} style={{ padding: \\'8px 16px\\', background: \\'linear-gradient(135deg,#D4AF37,#8B6914)\\'$1><Plus size={14} /> {isAr ? \\'إضافة مستخدم\\' : \\'Add User\\'}</button>'
);

content = content.replace(
  /<button style=\{\{ padding: '8px 16px', background: 'linear-gradient\(135deg,#D4AF37,#8B6914\)'([^>]+)>\s*<Plus size=\{14\} \/> \{isAr \? 'إضافة مقال' : 'Add Article'\}\s*<\/button>/g,
  '<button onClick={() => handleEdit(\\'article\\', null)} style={{ padding: \\'8px 16px\\', background: \\'linear-gradient(135deg,#D4AF37,#8B6914)\\'$1><Plus size={14} /> {isAr ? \\'إضافة مقال\\' : \\'Add Article\\'}</button>'
);

content = content.replace(
  /<button style=\{\{ padding: '8px 16px', background: 'linear-gradient\(135deg,#D4AF37,#8B6914\)'([^>]+)>\s*<Plus size=\{14\} \/> \{isAr \? 'إضافة دورة' : 'Add Course'\}\s*<\/button>/g,
  '<button onClick={() => handleEdit(\\'course\\', null)} style={{ padding: \\'8px 16px\\', background: \\'linear-gradient(135deg,#D4AF37,#8B6914)\\'$1><Plus size={14} /> {isAr ? \\'إضافة دورة\\' : \\'Add Course\\'}</button>'
);

// 4. Update Edit/Delete Action buttons inside lists
function replaceActions(text, listName, typeStr, idField) {
  const regex = new RegExp(
    `\{db${listName}\\.map\\(\\((${listName[0]}: any), i: any\\) => \\(.*?\\{/\* Actions \*/\\}?.*?` +
    `\\{\\[\\{ icon: <Eye size=\\{13\\} \\/>, color: '#C7C3B9' \\}, \\{ icon: <Edit size=\\{13\\} \\/>, color: '#D4AF37' \\}, \\{ icon: <Trash2 size=\\{13\\} \\/>, color: '#ff6b6b' \\}\\]\\.map\\(\\(btn, bi\\) => \\(.*?<button key=\\{bi\\}[^>]+>\\{btn\\.icon\\}<\\/button>.*?\\)\\)\\}` +
    `(.*?)<\\/td>`, 'gs'
  );

  return text.replace(regex, (match, vName) => {
    const actionButtons = `
                            <button onClick={() => handleEdit('${typeStr}', ${vName})} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: \`1px solid #D4AF3733\`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}><Edit size={13} /></button>
                            <button onClick={() => handleDelete('${typeStr}', ${vName}._id)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: \`1px solid #ff6b6b33\`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b' }}><Trash2 size={13} /></button>
    `;
    return match.replace(
      /\{\[\{ icon: <Eye.*?\)\)\}/s,
      actionButtons
    );
  });
}

content = replaceActions(content, 'Artifacts', 'artifact');
content = replaceActions(content, 'Users', 'user');
content = replaceActions(content, 'Articles', 'article');
content = replaceActions(content, 'Courses', 'course');

fs.writeFileSync('src/app/components/AdminPanel.tsx', content);
console.log('Frontend patched');
