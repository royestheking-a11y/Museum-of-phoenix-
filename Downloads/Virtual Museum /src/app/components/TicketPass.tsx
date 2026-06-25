import React from 'react';
import { motion } from 'motion/react';
import { QrCode, Sparkles, User, Calendar } from 'lucide-react';
import PhoenixSVG from './PhoenixSVG';
import { useLanguage } from '../context/LanguageContext';

interface TicketPassProps {
  type: 'Visitor' | 'Researcher' | 'Scholar';
  userName?: string;
  date?: string;
}

export default function TicketPass({ type, userName = 'Guest Explorer', date = new Date().toLocaleDateString() }: TicketPassProps) {
  const { isAr } = useLanguage();
  const config = {
    Visitor: { color: '#C7C3B9', bg: 'linear-gradient(135deg, #1A202C, #0D1117)', accent: 'rgba(199,195,185,0.2)' },
    Researcher: { color: '#D4AF37', bg: 'linear-gradient(135deg, #2D2311, #0D1117)', accent: 'rgba(212,175,55,0.3)' },
    Scholar: { color: '#F0D98A', bg: 'linear-gradient(135deg, #3A2F1D, #1A150D)', accent: 'rgba(240,217,138,0.4)' }
  };

  const { color, bg, accent } = config[type];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, rotateY: 90 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5, boxShadow: `0 30px 60px ${accent}` }}
      style={{
        width: 340,
        height: 180,
        background: bg,
        borderRadius: 16,
        position: 'relative',
        display: 'flex',
        flexDirection: isAr ? 'row-reverse' : 'row',
        border: `1px solid ${accent}`,
        boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)`,
        overflow: 'hidden',
        cursor: 'pointer',
        perspective: 1000
      }}
    >
      {/* Holographic Glare */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 25%, transparent 30%)',
          backgroundSize: '200% 200%',
          pointerEvents: 'none',
          zIndex: 10
        }}
        animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main Ticket Body */}
      <div style={{ flex: 1, padding: 20, borderRight: isAr ? 'none' : `2px dashed ${accent}`, borderLeft: isAr ? `2px dashed ${accent}` : 'none', position: 'relative', direction: isAr ? 'rtl' : 'ltr' }}>
        <div style={{ position: 'absolute', top: -10, [isAr ? 'left' : 'right']: -10, width: 20, height: 20, borderRadius: '50%', background: 'rgba(2, 8, 6, 0.9)', borderBottom: `1px solid ${accent}`, [isAr ? 'borderRight' : 'borderLeft']: `1px solid ${accent}` }} />
        <div style={{ position: 'absolute', bottom: -10, [isAr ? 'left' : 'right']: -10, width: 20, height: 20, borderRadius: '50%', background: 'rgba(2, 8, 6, 0.9)', borderTop: `1px solid ${accent}`, [isAr ? 'borderRight' : 'borderLeft']: `1px solid ${accent}` }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <PhoenixSVG size={28} glowIntensity={0.5} />
          <div>
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', lineHeight: 1 }}>{isAr ? 'متحف الفينيق' : 'Phoenix Museum'}</div>
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: '#A09D94', letterSpacing: '0.05em', textTransform: isAr ? 'none' : 'uppercase' }}>{isAr ? 'تذكرة دخول' : 'Entry Ticket'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Sparkles size={12} color={color} />
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.2rem', color, fontWeight: 700 }}>
            {isAr ? (type === 'Visitor' ? 'تذكرة زائر' : type === 'Researcher' ? 'تذكرة باحث' : 'تذكرة عالم') : (type === 'Visitor' ? 'Visitor Pass' : type === 'Researcher' ? 'Researcher Pass' : 'Scholar Pass')}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          <div>
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: '#71717A', marginBottom: 2 }}>{isAr ? 'اسم الزائر' : 'Visitor Name'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Inter', fontSize: '0.8rem', color: '#F8F4EA' }}>
              <User size={10} /> {userName === 'Guest Explorer' ? (isAr ? 'ضيف مستكشف' : 'Guest Explorer') : userName}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: '#71717A', marginBottom: 2 }}>{isAr ? 'تاريخ الإصدار' : 'Issue Date'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Inter', fontSize: '0.8rem', color: '#F8F4EA' }}>
              <Calendar size={10} /> {date}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Stub */}
      <div style={{ width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', padding: '10px 0' }}>
        <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: '#71717A', marginBottom: 12, letterSpacing: '0.1em' }}>
          {isAr ? 'دخول شخص واحد' : 'ADMIT ONE'}
        </div>
        <QrCode size={34} color={color} style={{ opacity: 0.8 }} />
        <div style={{ fontFamily: 'Inter', fontSize: '0.45rem', color: '#71717A', marginTop: 8 }}>#TK-{(Math.random() * 100000).toFixed(0)}</div>
      </div>
    </motion.div>
  );
}
