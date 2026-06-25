const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  onBack: () => void;
}

export default function SymbolTimeline({ onBack }: Props) {
  const { t, isAr } = useLanguage();
  const [periods, setPeriods] = useState<any[]>([]);
  const [activePeriod, setActivePeriod] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<any | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/timeline`)
      .then(res => res.json())
      .then(data => {
        setPeriods(data);
        if (data.length > 0) setActivePeriod(data[0].id);
      })
      .catch(console.error);
  }, []);

  const period = periods.find(p => p.id === activePeriod);
  const periodIndex = periods.findIndex(p => p.id === activePeriod);

  if (!period) return <div style={{ color: '#D4AF37', padding: 40, fontFamily: '"IBM Plex Sans Arabic"' }}>Loading timeline...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex flex-col" style={{ background: period.bg, transition: 'background 0.8s ease' }} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Dynamic Background Effects */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '10%', left: '20%', width: '60vw', height: '60vw', background: `radial-gradient(circle, ${period.color}33 0%, transparent 70%)`, filter: 'blur(60px)' }} />
      </div>

      {/* Header */}
      <div style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{ background: 'rgba(6,43,36,0.5)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
            {isAr ? '→' : '←'}
          </button>
          <div>
            <h1 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.5rem', color: '#D4AF37', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{isAr ? 'التسلسل الزمني للرموز' : 'Symbol Timeline'}</h1>
            <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', color: '#C7C3B9', margin: '4px 0 0 0' }}>{isAr ? '5500 عام من التراث البصري' : '5,500 years of visual heritage'}</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        {/* Main Display Area */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {selectedSymbol ? (
              <motion.div key={selectedSymbol.name} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20 }} style={{ maxWidth: 800, padding: '20px 40px', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: 24, border: '1px solid rgba(212,175,55,0.2)', backdropFilter: 'blur(20px)', maxHeight: '90vh', overflowY: 'auto', margin: '0 20px' }}>
                <div style={{ fontSize: '12rem', lineHeight: 1, color: '#D4AF37', textShadow: `0 0 40px ${period.color}`, fontFamily: 'serif' }}>
                  {selectedSymbol.visual}
                </div>
                <div>
                  <h2 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '2rem', color: '#F8F4EA', margin: '0 0 8px 0' }}>{isAr ? selectedSymbol.arabic : selectedSymbol.name}</h2>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 24, fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.9rem' }}>
                    <span style={{ color: '#D4AF37', background: 'rgba(212,175,55,0.1)', padding: '4px 12px', borderRadius: 12 }}>{isAr ? selectedSymbol.yearAr : selectedSymbol.year}</span>
                    <span style={{ color: '#C7C3B9', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 12 }}>{isAr ? selectedSymbol.regionAr : selectedSymbol.region}</span>
                  </div>
                  <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: '#C7C3B9', margin: '0 0 16px 0', fontWeight: 600 }}>{isAr ? selectedSymbol.meaningAr : selectedSymbol.meaning}</p>
                  <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1rem', color: 'rgba(199,195,185,0.8)', lineHeight: 1.6, margin: 0 }}>{isAr ? selectedSymbol.detailAr : selectedSymbol.detail}</p>
                  <button onClick={() => setSelectedSymbol(null)} style={{ marginTop: 32, background: 'none', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', padding: '8px 24px', borderRadius: 20, cursor: 'pointer', fontFamily: '"IBM Plex Sans Arabic"' }}>
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key={`period-${period.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center', maxWidth: 800, padding: 40 }}>
                <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: '#D4AF37', letterSpacing: '0.2em', marginBottom: 16 }}>{period.range}</div>
                <h2 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '3.5rem', color: '#F8F4EA', margin: '0 0 24px 0', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{isAr ? period.labelAr : period.label}</h2>
                <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: '#C7C3B9', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{isAr ? period.descriptionAr : period.description}</p>
                
                {/* Period Symbols Grid */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 48, flexWrap: 'wrap' }}>
                  {period.symbols.map((sym: any, i: number) => (
                    <motion.div key={i} whileHover={{ y: -10, scale: 1.05 }} onClick={() => setSelectedSymbol(sym)} style={{ width: 120, height: 160, background: 'rgba(0,0,0,0.5)', border: `1px solid ${period.color}`, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)', boxShadow: `0 10px 30px rgba(0,0,0,0.5)` }}>
                      <div style={{ fontSize: '3rem', color: '#D4AF37', marginBottom: 12, fontFamily: 'serif' }}>{sym.visual}</div>
                      <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.75rem', color: '#F8F4EA', textAlign: 'center', padding: '0 8px' }}>{isAr ? sym.arabic : sym.name}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Timeline Slider */}
        <div style={{ height: 120, background: 'rgba(0,0,0,0.8)', borderTop: '1px solid rgba(212,175,55,0.2)', padding: '0 40px', display: 'flex', alignItems: 'center', backdropFilter: 'blur(20px)' }}>
          <div ref={sliderRef} style={{ display: 'flex', width: '100%', position: 'relative', height: 4 }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${(periodIndex / (periods.length - 1)) * 100}%`, background: '#D4AF37', transition: 'width 0.5s ease' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.1)' }} />
            
            {periods.map((p, i) => {
              const isActive = p.id === activePeriod;
              const isPast = i <= periodIndex;
              return (
                <div key={p.id} onClick={() => { setActivePeriod(p.id); setSelectedSymbol(null); }} style={{ position: 'absolute', left: `${(i / (periods.length - 1)) * 100}%`, transform: 'translate(-50%, -50%)', top: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ width: isActive ? 16 : 12, height: isActive ? 16 : 12, borderRadius: '50%', background: isActive ? '#D4AF37' : isPast ? '#a08429' : '#333', border: isActive ? '4px solid #000' : '2px solid #000', transition: 'all 0.3s ease', boxShadow: isActive ? `0 0 15px #D4AF37` : 'none' }} />
                  <div style={{ marginTop: 16, fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.75rem', color: isActive ? '#D4AF37' : '#888', whiteSpace: 'nowrap', transition: 'color 0.3s ease', fontWeight: isActive ? 600 : 400 }}>
                    {isAr ? p.labelAr : p.label}
                  </div>
                  <div style={{ marginTop: 4, fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.6rem', color: '#555', whiteSpace: 'nowrap' }}>
                    {p.range}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
