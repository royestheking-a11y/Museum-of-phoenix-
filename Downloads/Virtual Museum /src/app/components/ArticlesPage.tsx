const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Clock, Heart, Share2, Eye } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function ArticlesPage({ onBack }: Props) {
  const { t, isAr } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/articles`)
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(console.error);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex flex-col" style={{ background: '#0a100d' }} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div style={{ padding: '24px 40px', borderBottom: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6,43,36,0.5)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{ background: 'none', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', cursor: 'pointer' }}>
            {isAr ? '→' : '←'}
          </button>
          <div>
            <h1 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.5rem', color: '#D4AF37', margin: 0 }}>{isAr ? 'مقالات وقصص' : 'Articles & Stories'}</h1>
            <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', color: '#C7C3B9', margin: '4px 0 0 0' }}>{isAr ? 'استكشف المقالات المتعمقة حول الرمزية' : 'Explore in-depth articles on symbolism'}</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>
          {articles.length === 0 ? (
            <div style={{ color: '#D4AF37', fontFamily: '"IBM Plex Sans Arabic"' }}>Loading articles...</div>
          ) : articles.map(article => (
            <motion.div key={article.id} whileHover={{ y: -5 }} style={{ background: 'rgba(6,43,36,0.2)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 300, background: `url(${article.image}) center/cover`, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,16,13,1), transparent)' }} />
                <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.5)', padding: '6px 16px', borderRadius: 20, fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.8rem', color: '#D4AF37', backdropFilter: 'blur(10px)' }}>
                  {isAr ? article.categoryAr : article.category}
                </div>
              </div>
              <div style={{ padding: '0 32px 32px 32px', marginTop: -60, position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', gap: 16, fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.8rem', color: '#C7C3B9', marginBottom: 16 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> {isAr ? article.readTimeAr : article.readTime}</span>
                  <span>•</span>
                  <span>{isAr ? article.dateAr : article.date}</span>
                </div>
                <h2 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.8rem', color: '#F8F4EA', margin: '0 0 16px 0', lineHeight: 1.3 }}>
                  {isAr ? article.arabic : article.title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1a2520', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212,175,55,0.3)' }}>
                    <BookOpen size={20} color="#D4AF37" />
                  </div>
                  <div>
                    <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.9rem', color: '#F8F4EA' }}>{isAr ? article.authorAr : article.author}</div>
                    <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.75rem', color: '#C7C3B9' }}>{isAr ? article.authorTitleAr : article.authorTitle}</div>
                  </div>
                </div>
                <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1rem', color: '#C7C3B9', lineHeight: 1.7, margin: '0 0 32px 0' }}>
                  {isAr ? article.excerptAr : article.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(212,175,55,0.1)', paddingTop: 24 }}>
                  <div style={{ display: 'flex', gap: 24 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#C7C3B9', fontSize: '0.85rem' }}><Eye size={16} /> {article.views.toLocaleString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#C7C3B9', fontSize: '0.85rem', cursor: 'pointer' }}><Heart size={16} /> {article.likes.toLocaleString()}</span>
                  </div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '8px 16px', borderRadius: 20, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <Share2 size={16} /> {isAr ? 'مشاركة' : 'Share'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
