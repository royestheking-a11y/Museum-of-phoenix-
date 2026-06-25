import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Home, Volume2, Map, Search, Landmark, Moon, Lock, Layers, Languages, ScrollText, Brain } from 'lucide-react';
import ParticleField from './ParticleField';
import HistoryHall from './halls/HistoryHall';
import QuranHall from './halls/QuranHall';
import CryptographyHall from './halls/CryptographyHall';
import SemioticsHall from './halls/SemioticsHall';
import SemanticsHall from './halls/SemanticsHall';
import ManuscriptHall from './halls/ManuscriptHall';
import AILabHall from './halls/AILabHall';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

const hallMeta = [
  { id: 1, name: 'History of Symbols', arabic: 'تاريخ الرموز', Icon: Landmark, bg: 'linear-gradient(160deg, #1a0a00 0%, #062B24 100%)', accent: '#8B6914' },
  { id: 2, name: "Qur'anic Symbolism", arabic: 'رموز القرآن', Icon: Moon, bg: 'linear-gradient(160deg, #051a10 0%, #062B24 100%)', accent: '#1a6a4a' },
  { id: 3, name: 'Cryptography', arabic: 'علم التشفير', Icon: Lock, bg: 'linear-gradient(160deg, #050520 0%, #0D1117 100%)', accent: '#3a3a8a' },
  { id: 4, name: 'Semiotics', arabic: 'السيميائية', Icon: Layers, bg: 'linear-gradient(160deg, #150520 0%, #0D1117 100%)', accent: '#6a2a8a' },
  { id: 5, name: 'Semantics', arabic: 'علم الدلالة', Icon: Languages, bg: 'linear-gradient(160deg, #051505 0%, #062B24 100%)', accent: '#2a6a2a' },
  { id: 6, name: 'Manuscripts', arabic: 'المخطوطات', Icon: ScrollText, bg: 'linear-gradient(160deg, #1a0f00 0%, #0D1117 100%)', accent: '#7a4a1a' },
  { id: 7, name: 'AI Laboratory', arabic: 'مختبر الذكاء', Icon: Brain, bg: 'linear-gradient(160deg, #001020 0%, #0D1117 100%)', accent: '#1a4a7a' },
];

const hallComponents: Record<number, React.ComponentType> = {
  1: HistoryHall, 2: QuranHall, 3: CryptographyHall,
  4: SemioticsHall, 5: SemanticsHall, 6: ManuscriptHall, 7: AILabHall,
};

interface Props {
  hallId: number;
  onBack: () => void;
  onHome?: () => void;
  onOpenSearch?: () => void;
  onSelectHall?: (id: number) => void;
}

export default function HallView({ hallId: hallIdProp, onBack, onHome, onOpenSearch, onSelectHall }: Props) {
  const { isAr } = useLanguage();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Prefer URL param over prop so reload works correctly
  const hallId = params.id ? parseInt(params.id) : (hallIdProp ?? 1);
  const handleBack = onBack ?? (() => navigate('/dome'));
  const handleHome = onHome ?? (() => navigate('/home'));
  const handleSelectHall = onSelectHall ?? ((id: number) => navigate(`/hall/${id}`));
  const meta = hallMeta.find(h => h.id === hallId) ?? hallMeta[0];
  const HallComponent = hallComponents[hallId];
  const { Icon } = meta;

  return (
    <motion.div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: meta.bg }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
      <ParticleField count={25} color={meta.accent} />

      {/* Top bar */}
      <div style={{ position: 'relative', zIndex: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'calc(8px + env(safe-area-inset-top))', paddingBottom: '8px', paddingLeft: '12px', paddingRight: '12px', background: 'rgba(6,43,36,0.9)', borderBottom: `1px solid ${meta.accent}44`, backdropFilter: 'blur(20px)', flexWrap: 'wrap', gap: 6, direction: isAr ? 'rtl' : 'ltr' }}>
        {/* Left */}
        <div style={{ display: 'flex', gap: 6, flexDirection: isAr ? 'row-reverse' : 'row' }}>
          <motion.button onClick={handleBack} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 4, cursor: 'pointer', color: '#D4AF37', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', flexDirection: isAr ? 'row' : 'row' }}>
            <ArrowLeft size={13} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} /> <span className="hidden sm:inline">{isAr ? 'العودة إلى القبة' : 'Back to Dome'}</span>
          </motion.button>
          <button onClick={handleHome} style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C7C3B9' }}>
            <Home size={13} />
          </button>
        </div>

        {/* Center */}
        <div style={{ textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, flexDirection: isAr ? 'row' : 'row' }}>
          <Icon size={15} color={meta.accent} />
          <div>
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.85rem', color: '#F8F4EA' }}>{isAr ? meta.arabic : meta.name}</div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexDirection: isAr ? 'row-reverse' : 'row' }}>
          {onOpenSearch && (
            <button onClick={onOpenSearch} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 4, cursor: 'pointer', color: '#C7C3B9', flexDirection: isAr ? 'row' : 'row' }}>
              <Search size={13} /><span className="hidden sm:inline" style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem' }}>{isAr ? 'البحث' : 'Search'}</span>
            </button>
          )}
          <LanguageSwitcher compact />
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${meta.accent}, rgba(0,0,0,0.5))`, border: `1px solid ${meta.accent}88`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: '"Playfair Display"', fontSize: '0.82rem', color: '#D4AF37', fontWeight: 'bold' }}>{hallId}</span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ position: 'relative', zIndex: 40, flexShrink: 0, padding: '5px 14px', background: `${meta.accent}11`, borderBottom: `1px solid ${meta.accent}22`, display: 'flex', alignItems: 'center', gap: 5, overflowX: 'auto', direction: isAr ? 'rtl' : 'ltr' }}>
        {(isAr ? [['متحف الفينيق', ''], ['القبة المركزية', ''], [`قاعة ${hallId}: ${meta.arabic}`, meta.accent]] : [['Phoenix Museum', ''], ['Central Dome', ''], [`Hall ${hallId}: ${meta.name}`, meta.accent]]).map(([label, color], i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', flexDirection: isAr ? 'row' : 'row' }}>
            {i > 0 && <span style={{ color: 'rgba(212,175,55,0.3)', fontSize: '0.7rem', transform: isAr ? 'scaleX(-1)' : 'none' }}>›</span>}
            <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: color || 'rgba(199,195,185,0.5)' }}>{label}</span>
          </span>
        ))}
      </div>

      {/* Hall content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', direction: isAr ? 'rtl' : 'ltr' }}>
        {HallComponent ? <HallComponent /> : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
            <Icon size={60} color="rgba(212,175,55,0.3)" />
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', color: '#C7C3B9', fontSize: '1.4rem' }}>{isAr ? 'قريباً' : 'Coming Soon'}</div>
          </div>
        )}
      </div>

      {/* Bottom hall switcher */}
      <div style={{ position: 'relative', zIndex: 50, flexShrink: 0, padding: '6px 12px', background: 'rgba(6,43,36,0.9)', borderTop: `1px solid ${meta.accent}33`, backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', overflowX: 'auto', direction: isAr ? 'rtl' : 'ltr' }}>
        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: '#C7C3B9', letterSpacing: '0.1em', [isAr ? 'marginLeft' : 'marginRight']: 6, whiteSpace: 'nowrap' }}>{isAr ? 'القاعات' : 'Halls'}</div>
        {hallMeta.map(h => {
          const { Icon: HIcon } = h;
          return (
            <motion.button key={h.id} whileHover={{ scale: 1.14, y: -2 }} whileTap={{ scale: 0.9 }}
              onClick={() => h.id === hallId ? null : handleSelectHall(h.id)} title={h.name}
              style={{ width: 30, height: 30, borderRadius: '50%', background: h.id === hallId ? `linear-gradient(135deg, ${h.accent}, transparent)` : 'rgba(255,255,255,0.04)', border: `1px solid ${h.id === hallId ? h.accent : 'rgba(212,175,55,0.15)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: h.id === hallId ? `0 0 10px ${h.accent}66` : 'none', flexShrink: 0 }}>
              <HIcon size={13} color={h.id === hallId ? '#F0D98A' : h.accent} />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
