const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, BookOpen, Download, Clock, Star, BookMarked, Newspaper } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function ResearchLibrary({ onBack }: Props) {
  const { t, isAr } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [papers, setPapers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/research`)
      .then(res => res.json())
      .then(data => setPapers(data))
      .catch(console.error);
  }, []);

  const filteredPapers = filter === 'all' ? papers : papers.filter(p => p.type === filter);

  const getIcon = (type: string) => {
    if (type === 'paper') return <Newspaper size={20} color="#D4AF37" />;
    if (type === 'journal') return <BookOpen size={20} color="#D4AF37" />;
    return <BookMarked size={20} color="#D4AF37" />;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex flex-col" style={{ background: '#0a100d' }} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div style={{ padding: '24px 40px', borderBottom: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6,43,36,0.5)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{ background: 'none', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', cursor: 'pointer' }}>
            {isAr ? '→' : '←'}
          </button>
          <div>
            <h1 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.5rem', color: '#D4AF37', margin: 0 }}>{isAr ? 'مكتبة الأبحاث' : 'Research Library'}</h1>
            <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', color: '#C7C3B9', margin: '4px 0 0 0' }}>{isAr ? 'أوراق أكاديمية ومجلات ودراسات' : 'Academic papers, journals, and studies'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#C7C3B9" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isAr ? 'right' : 'left']: 12 }} />
            <input type="text" placeholder={isAr ? 'البحث في الأوراق...' : 'Search papers...'} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, padding: '8px 16px 8px 36px', color: '#F8F4EA', fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.9rem', width: 250, outline: 'none' }} />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '8px 16px', borderRadius: 20, cursor: 'pointer' }}>
            <Filter size={16} /> {isAr ? 'تصفية' : 'Filter'}
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 40px', display: 'flex', gap: 12, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        {[
          { id: 'all', label: 'All', labelAr: 'الكل' },
          { id: 'paper', label: 'Papers', labelAr: 'أوراق بحثية' },
          { id: 'journal', label: 'Journals', labelAr: 'مجلات' },
          { id: 'book', label: 'Books', labelAr: 'كتب' }
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '6px 16px', borderRadius: 20, background: filter === f.id ? '#D4AF37' : 'transparent', color: filter === f.id ? '#062B24' : '#C7C3B9', border: filter === f.id ? 'none' : '1px solid rgba(212,175,55,0.3)', fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            {isAr ? f.labelAr : f.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {filteredPapers.length === 0 ? (
            <div style={{ color: '#D4AF37', fontFamily: '"IBM Plex Sans Arabic"' }}>Loading research papers...</div>
          ) : filteredPapers.map(paper => (
            <motion.div key={paper.id} whileHover={{ x: isAr ? -5 : 5 }} style={{ background: 'rgba(6,43,36,0.3)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: 24, display: 'flex', gap: 24 }}>
              <div style={{ width: 60, height: 80, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {getIcon(paper.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: '#F8F4EA', margin: '0 0 8px 0' }}>{isAr ? paper.arabic : paper.title}</h3>
                    <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.9rem', color: '#D4AF37', marginBottom: 12 }}>
                      {isAr ? paper.authorAr : paper.author} <span style={{ color: '#C7C3B9', fontSize: '0.8rem', marginInlineStart: 8 }}>({isAr ? paper.affiliationAr : paper.affiliation})</span>
                    </div>
                  </div>
                  <div style={{ background: paper.access === 'Open' ? 'rgba(46,139,87,0.2)' : 'rgba(212,175,55,0.2)', color: paper.access === 'Open' ? '#4ade80' : '#D4AF37', padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontFamily: '"IBM Plex Sans Arabic"' }}>
                    {isAr ? paper.accessAr : paper.access}
                  </div>
                </div>
                <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.9rem', color: '#C7C3B9', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  {isAr ? paper.abstractAr : paper.abstract}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(isAr ? paper.tagsAr : paper.tags).map((tag: string, i: number) => (
                      <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', color: '#a0a0a0' }}>#{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#C7C3B9', fontSize: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {isAr ? paper.readTimeAr : paper.readTime}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Download size={14} /> {paper.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
