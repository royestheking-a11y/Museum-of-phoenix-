import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ParticleField from './ParticleField';
import { useLanguage } from '../context/LanguageContext';

type Phase = 'approach' | 'opening' | 'entering' | 'done';

/* ─── Islamic 8-pointed star SVG ─── */
function IslamicStar({ size = 90, color = '#D4AF37', glow = false }: { size?: number; color?: string; glow?: boolean }) {
  const s = size / 2;
  const points = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 === 0 ? s * 0.92 : s * 0.52;
    return `${s + r * Math.cos(angle)},${s + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: glow ? `drop-shadow(0 0 8px ${color})` : undefined }}>
      <polygon points={points} fill="none" stroke={color} strokeWidth="1.5" opacity="0.9" />
      <circle cx={s} cy={s} r={s * 0.22} fill="none" stroke={color} strokeWidth="1.2" opacity="0.7" />
      <circle cx={s} cy={s} r={s * 0.06} fill={color} opacity="0.9" />
    </svg>
  );
}

/* ─── Gold geometric lattice pattern strip ─── */
function LatticeStrip({ width, height }: { width: string; height: number }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 200 ${height}`} preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.35 }}>
      <defs>
        <pattern id="lattice" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
          <path d="M0 0 L10 10 M20 0 L10 10 M0 20 L10 10 M20 20 L10 10" stroke="#D4AF37" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="200" height={height} fill="url(#lattice)" />
    </svg>
  );
}

/* ─── Arabic calligraphy panel ─── */
function CalligraphyPanel({ text, isLeft }: { text: string; isLeft: boolean }) {
  return (
    <div style={{
      width: '62%', padding: '18px 16px',
      border: '1px solid rgba(212,175,55,0.5)',
      background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%)',
      borderRadius: 3, textAlign: 'center', position: 'relative',
    }}>
      {/* Corner accents */}
      {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v, h], i) => (
        <div key={i} style={{
          position: 'absolute', [v]: -1, [h]: -1,
          width: 10, height: 10,
          borderTop: v === 'top' ? '2px solid #D4AF37' : 'none',
          borderBottom: v === 'bottom' ? '2px solid #D4AF37' : 'none',
          borderLeft: h === 'left' ? '2px solid #D4AF37' : 'none',
          borderRight: h === 'right' ? '2px solid #D4AF37' : 'none',
        }} />
      ))}
      <div style={{
        fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.55rem',
        color: '#D4AF37', direction: 'rtl',
        textShadow: '0 0 20px rgba(212,175,55,0.6), 0 0 40px rgba(212,175,55,0.3)',
        lineHeight: 1.3,
      }}>{text}</div>
    </div>
  );
}

/* ─── Main component ─── */
export default function MuseumGate({ onEnter }: { onEnter: () => void }) {
  const { isAr } = useLanguage();
  const [phase, setPhase] = useState<Phase>('approach');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('opening');
      import('../utils/soundManager').then(({ soundManager }) => {
        soundManager.playGateOpen();
      });
    }, 1200);
    const t2 = setTimeout(() => setPhase('entering'), 3800);
    const t3 = setTimeout(() => { setPhase('done'); onEnter(); }, 5400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onEnter]);

  const doorsOpen = phase === 'opening' || phase === 'entering' || phase === 'done';
  const zooming   = phase === 'entering' || phase === 'done';

  /* ─── Door panel (shared layout) ─── */
  const DoorDecor = ({ side }: { side: 'left' | 'right' }) => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>

      {/* Top star panel */}
      <div style={{ position: 'absolute', top: '6%', left: '10%', right: '10%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ border: '1px solid rgba(212,175,55,0.3)', padding: '14px 20px', background: 'rgba(212,175,55,0.04)', borderRadius: 2 }}>
          <IslamicStar size={80} color="#D4AF37" glow />
        </div>
      </div>

      {/* Vertical gold line */}
      <div style={{
        position: 'absolute',
        [side === 'left' ? 'right' : 'left']: 22,
        top: '5%', bottom: '5%', width: 1.5,
        background: 'linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.7) 30%, #D4AF37 50%, rgba(212,175,55,0.7) 70%, transparent 100%)',
      }} />

      {/* Middle panel with text */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {/* Small star above text */}
        <IslamicStar size={44} color="#D4AF37" />
        <CalligraphyPanel
          text={side === 'left' ? 'بوابة\nالمعرفة' : 'أكاديمية\nالرموز'}
          isLeft={side === 'left'}
        />
        <IslamicStar size={44} color="#D4AF37" />
      </div>

      {/* Bottom star panel */}
      <div style={{ position: 'absolute', bottom: '6%', left: '10%', right: '10%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ border: '1px solid rgba(212,175,55,0.3)', padding: '14px 20px', background: 'rgba(212,175,55,0.04)', borderRadius: 2 }}>
          <IslamicStar size={80} color="#D4AF37" glow />
        </div>
      </div>

      {/* Lattice strip bottom */}
      <div style={{ position: 'absolute', bottom: '3.5%', left: '8%', right: '8%' }}>
        <LatticeStrip width="100%" height={20} />
      </div>
      <div style={{ position: 'absolute', top: '3.5%', left: '8%', right: '8%' }}>
        <LatticeStrip width="100%" height={20} />
      </div>

      {/* Gold handle */}
      <div style={{
        position: 'absolute',
        [side === 'left' ? 'right' : 'left']: 18,
        top: '50%', transform: 'translateY(-50%)',
        width: 13, height: 70,
        background: 'linear-gradient(180deg, #F0D98A 0%, #D4AF37 40%, #8B6914 75%, #D4AF37 100%)',
        borderRadius: 7,
        boxShadow: '0 0 12px rgba(212,175,55,0.5), inset 0 1px 2px rgba(255,255,255,0.3)',
      }} />

      {/* Horizontal divider lines */}
      {[0.34, 0.67].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', left: '8%', right: '8%',
          top: `${pos * 100}%`, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
        }} />
      ))}
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: '#050e0b' }}
      dir="ltr"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
    >
      <ParticleField count={45} color="#D4AF37" />

      {/* Radial glow floor */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(212,175,55,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Revealed interior light */}
      <motion.div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(212,175,55,0.22) 0%, rgba(6,43,36,0.35) 45%, transparent 72%)' }}
        initial={{ opacity: 0 }} animate={{ opacity: doorsOpen ? 1 : 0 }} transition={{ duration: 1.6, delay: 0.4 }} />

      {/* Welcome text revealed after open */}
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
        initial={{ opacity: 0 }} animate={{ opacity: doorsOpen ? 1 : 0 }} transition={{ duration: 1.2, delay: 1 }}>
        <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '2.2rem', color: '#D4AF37', textShadow: '0 0 50px rgba(212,175,55,0.8)', letterSpacing: '0.05em' }}>مرحباً بكم</div>
        <div style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#F0D98A', letterSpacing: '0.4em', textTransform: 'uppercase', marginTop: 8, opacity: 0.6 }}>Welcome</div>
      </motion.div>

      {/* ═══ ARCH FRAME ═══ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        {/* Black marble arch shape — top fade */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '14%', background: 'linear-gradient(180deg, #050e0b 0%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '10%', background: 'linear-gradient(0deg, #050e0b 0%, transparent 100%)' }} />

        {/* Outer arch gold border */}
        <div style={{
          position: 'absolute', top: '4%', left: '4%', right: '4%', height: '92%',
          border: '2px solid rgba(212,175,55,0.45)',
          borderRadius: '48% 48% 0 0 / 8% 8% 0 0',
        }} />
        {/* Inner arch gold border */}
        <div style={{
          position: 'absolute', top: '5.5%', left: '5.5%', right: '5.5%', height: '90%',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '48% 48% 0 0 / 8% 8% 0 0',
        }} />

        {/* Arch keystone diamond */}
        <div style={{
          position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)',
          width: 24, height: 24,
          background: 'linear-gradient(135deg, #D4AF37, #8B6914)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          boxShadow: '0 0 14px rgba(212,175,55,0.7)',
        }} />

        {/* Arch top text: museum name */}
        <div style={{
          position: 'absolute', top: '6%', left: '50%', transform: 'translateX(-50%)',
          fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.8rem',
          color: 'rgba(212,175,55,0.7)', letterSpacing: '0.25em',
          whiteSpace: 'nowrap', textAlign: 'center',
        }}>
          ✦ &nbsp; أكاديمية الرموز &nbsp; ✦
        </div>

        {/* Side pillar accents */}
        {['left', 'right'].map(side => (
          <div key={side} style={{
            position: 'absolute', [side]: '4%', top: '15%', bottom: 0,
            width: 3,
            background: 'linear-gradient(180deg, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0.15) 60%, transparent 100%)',
          }} />
        ))}

        {/* Floor line */}
        <div style={{ position: 'absolute', bottom: '10%', left: '4%', right: '4%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)' }} />
      </div>

      {/* ═══ DOORS ═══ */}
      <div className="absolute inset-0 flex" style={{ perspective: '1600px', perspectiveOrigin: '50% 50%', zIndex: 10 }}>

        {/* Left door */}
        <motion.div
          style={{
            transformOrigin: 'left center',
            width: '50%', height: '100%',
            position: 'absolute', left: 0,
            background: 'linear-gradient(160deg, #0d2a1a 0%, #062414 35%, #041a10 65%, #062414 100%)',
            borderRight: '3px solid rgba(212,175,55,0.65)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            boxShadow: 'inset -8px 0 30px rgba(0,0,0,0.6), inset 0 0 60px rgba(6,36,20,0.5)',
          }}
          animate={{ rotateY: doorsOpen ? -84 : 0 }}
          transition={{ duration: 2.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Outer gold border lines on door face */}
          <div style={{ position: 'absolute', inset: '3% 4%', border: '1px solid rgba(212,175,55,0.3)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: '3.8% 4.8%', border: '1px solid rgba(212,175,55,0.12)', pointerEvents: 'none' }} />
          <DoorDecor side="left" />
        </motion.div>

        {/* Right door */}
        <motion.div
          style={{
            transformOrigin: 'right center',
            width: '50%', height: '100%',
            position: 'absolute', right: 0,
            background: 'linear-gradient(200deg, #0d2a1a 0%, #062414 35%, #041a10 65%, #062414 100%)',
            borderLeft: '3px solid rgba(212,175,55,0.65)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            boxShadow: 'inset 8px 0 30px rgba(0,0,0,0.6), inset 0 0 60px rgba(6,36,20,0.5)',
          }}
          animate={{ rotateY: doorsOpen ? 84 : 0 }}
          transition={{ duration: 2.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div style={{ position: 'absolute', inset: '3% 4%', border: '1px solid rgba(212,175,55,0.3)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: '3.8% 4.8%', border: '1px solid rgba(212,175,55,0.12)', pointerEvents: 'none' }} />
          <DoorDecor side="right" />
        </motion.div>

        {/* Center seam glow line (when closed) */}
        <AnimatePresence>
          {!doorsOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2,
                transform: 'translateX(-50%)',
                background: 'linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.6) 20%, rgba(212,175,55,0.9) 50%, rgba(212,175,55,0.6) 80%, transparent 100%)',
                boxShadow: '0 0 12px rgba(212,175,55,0.5)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Burst of light when opening */}
        <AnimatePresence>
          {doorsOpen && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 0.9, 0], scaleX: [0, 1, 0.4] }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              style={{
                position: 'absolute', left: '50%', top: '10%', bottom: '10%', width: 40,
                transform: 'translateX(-50%)',
                background: 'radial-gradient(ellipse 50% 100% at 50% 50%, rgba(240,217,138,0.95) 0%, rgba(212,175,55,0.4) 50%, transparent 100%)',
                filter: 'blur(4px)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ═══ CAPTION ═══ */}
      <AnimatePresence>
        {!doorsOpen && (
          <motion.div
            className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center"
            style={{ zIndex: 20 }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2.2 }}
              style={{ fontFamily: '"IBM Plex Sans Arabic"', color: '#C7C3B9', fontSize: '0.95rem', letterSpacing: '0.2em', direction: 'rtl' }}
            >
              {isAr ? 'انقر على الأبواب للدخول' : 'Click the doors to enter'}
            </motion.div>
            {/* Animated dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
              {[0, 0.3, 0.6].map((delay, i) => (
                <motion.div key={i}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4AF37' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ ZOOM-IN FLASH ═══ */}
      <AnimatePresence>
        {zooming && (
          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 30 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              style={{ width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,217,138,0.6) 0%, rgba(212,175,55,0.2) 50%, transparent 70%)' }}
              animate={{ scale: [1, 22], opacity: [0.9, 0] }}
              transition={{ duration: 1.8, ease: 'easeIn' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
