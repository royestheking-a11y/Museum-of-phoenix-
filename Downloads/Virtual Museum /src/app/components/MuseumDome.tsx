import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Moon, Lock, Layers, Languages, ScrollText, Brain, Map, Compass, Search, ChevronUp, ChevronDown, BookOpen, GraduationCap, Crown, Users, Archive, Mic2, Clock, Shield } from 'lucide-react';
import ParticleField from './ParticleField';
import IslamicGeometry from './IslamicGeometry';
import PhoenixSVG from './PhoenixSVG';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { getUserSession } from '../utils/auth';

const halls = [
  { id: 1, name: 'History of Symbols', arabic: 'تاريخ الرموز', Icon: Landmark, angle: 270, color: '#8B6914', bg: '#3a2000', desc: 'Ancient civilizations & origins', descAr: 'الحضارات القديمة والأصول' },
  { id: 2, name: "Qur'anic Symbolism", arabic: 'رموز القرآن', Icon: Moon, angle: 322, color: '#1a6a4a', bg: '#0a2a18', desc: 'Sacred metaphors & divine signs', descAr: 'الاستعارات المقدسة والعلامات الإلهية' },
  { id: 3, name: 'Cryptography', arabic: 'علم التشفير', Icon: Lock, angle: 14, color: '#3a3a8a', bg: '#0a0a2a', desc: 'Ciphers & secret writing', descAr: 'الشيفرات والكتابة السرية' },
  { id: 4, name: 'Semiotics', arabic: 'السيميائية', Icon: Layers, angle: 66, color: '#6a2a8a', bg: '#1a0a2a', desc: 'Signs & meaning systems', descAr: 'العلامات وأنظمة المعاني' },
  { id: 5, name: 'Semantics', arabic: 'علم الدلالة', Icon: Languages, angle: 118, color: '#2a6a2a', bg: '#0a1a0a', desc: 'Word roots & linguistic depth', descAr: 'جذور الكلمات والعمق اللغوي' },
  { id: 6, name: 'Manuscripts', arabic: 'المخطوطات', Icon: ScrollText, angle: 170, color: '#7a4a1a', bg: '#2a1a08', desc: 'Rare historical documents', descAr: 'وثائق تاريخية نادرة' },
  { id: 7, name: 'AI Laboratory', arabic: 'مختبر الذكاء', Icon: Brain, angle: 218, color: '#1a4a7a', bg: '#001020', desc: 'Symbol analysis & AI research', descAr: 'تحليل الرموز وأبحاث الذكاء الاصطناعي' },
];

const floors = [
  {
    level: 0, name: 'Grand Exhibition', arabic: 'المعرض الكبير', icon: Landmark,
    description: 'The 7 main exhibition halls with artifacts, symbols, and interactive displays',
    descriptionAr: 'قاعات العرض السبع الرئيسية مع القطع الأثرية والرموز والشاشات التفاعلية',
    sections: ['Hall of Origins', "Qur'anic Wing", 'Cryptography Chamber', 'Semiotics Lab', 'Semantics Library', 'Manuscript Vault', 'AI Laboratory'],
    sectionsAr: ['قاعة الأصول', 'الجناح القرآني', 'غرفة التشفير', 'مختبر السيميائية', 'مكتبة علم الدلالة', 'قبو المخطوطات', 'مختبر الذكاء الاصطناعي'],
    color: '#D4AF37',
  },
  {
    level: 1, name: 'Research Library', arabic: 'مكتبة الأبحاث', icon: BookOpen,
    description: 'Academic papers, journals, lectures, and downloadable research archives',
    descriptionAr: 'الأوراق الأكاديمية، المجلات، المحاضرات، وأرشيفات الأبحاث القابلة للتنزيل',
    sections: ['Academic Journals', 'Research Papers', 'Lecture Theater', 'Digital Archive', 'Scholar Reading Room'],
    sectionsAr: ['المجلات الأكاديمية', 'الأوراق البحثية', 'مسرح المحاضرات', 'الأرشيف الرقمي', 'غرفة قراءة العلماء'],
    color: '#6a8a4a',
  },
  {
    level: 2, name: 'Scholar Tower', arabic: 'برج العلماء', icon: GraduationCap,
    description: 'Premium courses, certification programs, and private scholar chambers',
    descriptionAr: 'دورات متميزة، برامج شهادات، وغرف علماء خاصة',
    sections: ['Advanced Courses', 'Certification Center', 'Private Consultations', 'AI Research Lab', 'VIP Scholar Lounge'],
    sectionsAr: ['الدورات المتقدمة', 'مركز الشهادات', 'الاستشارات الخاصة', 'مختبر أبحاث الذكاء الاصطناعي', 'صالة كبار العلماء'],
    color: '#8a4a6a',
  },
  {
    level: 3, name: 'Royal Archive', arabic: 'الأرشيف الملكي', icon: Crown,
    description: 'Restricted rare manuscripts, private collections, and institutional partnerships',
    descriptionAr: 'مخطوطات نادرة مقيدة، مجموعات خاصة، وشراكات مؤسسية',
    sections: ['Restricted Manuscripts', 'Private Collections', 'Institutional Vault', 'Conservation Lab'],
    sectionsAr: ['مخطوطات مقيدة', 'مجموعات خاصة', 'القبو المؤسسي', 'مختبر الحفظ'],
    color: '#8B6914',
  },
];

type UserLevel = 'Visitor' | 'Researcher' | 'Scholar' | 'Guest' | 'Admin';

interface Props {
  userLevel?: UserLevel;
  onUpgradeRequired: () => void;
  onSelectHall: (id: number) => void;
  onOpenSearch?: () => void;
  onOpenTimeline?: () => void;
  onOpenResearch?: () => void;
  onOpenCourses?: () => void;
  onHome?: () => void;
  onOpenProfile?: () => void;
}

export default function MuseumDome({
  userLevel = 'Guest',
  onUpgradeRequired,
  onSelectHall,
  onOpenSearch,
  onOpenTimeline,
  onOpenResearch,
  onOpenCourses,
  onHome,
  onOpenProfile
}: Props) {
  const [hoveredHall, setHoveredHall] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showFloors, setShowFloors] = useState(false);
  const [activeFloor, setActiveFloor] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t, isAr } = useLanguage();
  const navigate = useNavigate();
  const session = getUserSession();
  const isAdmin = userLevel === 'Admin' || session?.level === 'Admin';
  const displayName = session?.name || (isAdmin ? 'Admin' : 'Guest');
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const isFloorLocked = (level: number) => {
    if (userLevel === 'Scholar') return false;
    if (userLevel === 'Researcher' && level <= 2) return false;
    if (userLevel === 'Visitor' && level <= 1) return false;
    if (userLevel === 'Guest' && level === 0) return false;
    return true;
  };

  const isHallLocked = (hallId: number) => {
    if (userLevel === 'Guest' && hallId > 1) return true;
    return false;
  };

  return (
    <motion.div className="fixed inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D1117 0%, #062B24 60%, #0B1F1B 100%)' }}
      initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
      <ParticleField count={70} color="#D4AF37" />
      <IslamicGeometry opacity={0.08} patternId="dome-geo" />

      {/* Ceiling */}
      <div className="absolute inset-0 flex items-start justify-center pointer-events-none" style={{ zIndex: 20 }}>
        <svg viewBox="0 0 1000 600" className="w-full" style={{ position: 'absolute', top: 0 }}>
          {[...Array(8)].map((_, i) => <ellipse key={i} cx="500" cy="0" rx={500*(0.3+i*0.1)} ry={300*(0.3+i*0.1)} fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity={0.06+i*0.015} />)}
          {[...Array(12)].map((_, i) => { const a=(i*30*Math.PI)/180; return <line key={i} x1="500" y1="0" x2={500+500*Math.cos(a-Math.PI/2)} y2={500*Math.sin(a-Math.PI/2)} stroke="#D4AF37" strokeWidth="0.4" opacity="0.08" />; })}
          <circle cx="500" cy="0" r="50" fill="rgba(212,175,55,0.06)" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
        </svg>
        <div style={{ position: 'absolute', top: '7vw', textAlign: 'center', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: 'clamp(1rem, 1.5vw, 1.5rem)', color: '#D4AF37', letterSpacing: '0.1em', opacity: 0.9 }}>
          {isAr ? 'القبة المركزية الكبرى' : 'Grand Central Dome'}
        </div>
      </div>

      {/* Floor ellipses */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '35%' }}>
        <svg viewBox="0 0 1000 350" className="w-full h-full">
          {[480,380,280].map((r,i) => <ellipse key={i} cx="500" cy="350" rx={r} ry={r*0.25} fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity={0.12-i*0.03} />)}
        </svg>
      </div>

      {/* ─── DESKTOP: Circular orbit layout ─── */}
      <div className="hidden md:block absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(min(1, calc(100vh / 720)))', transformOrigin: 'center' }}>
            {/* Rings */}
            <div style={{ position: 'absolute', width: 580, height: 580, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)', border: '1px solid rgba(212,175,55,0.08)' }} />
            <motion.div style={{ position: 'absolute', width: 440, height: 440, borderRadius: '50%', border: '1px solid rgba(212,175,55,0.15)' }} animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
              {[0,45,90,135,180,225,270,315].map(deg => (
                <div key={deg} style={{ position: 'absolute', width: 5, height: 5, background: '#D4AF37', borderRadius: '50%', top: '50%', left: '50%', transform: `rotate(${deg}deg) translateX(220px) translate(-50%,-50%)`, boxShadow: '0 0 6px #D4AF37', opacity: 0.6 }} />
              ))}
            </motion.div>
            <motion.div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(212,175,55,0.1)' }} animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />

          {/* Hall portals */}
          {halls.map(hall => {
            const rad = ((hall.angle - 90) * Math.PI) / 180;
            const x = Math.cos(rad) * 205;
            const y = Math.sin(rad) * 205;
            const isHovered = hoveredHall === hall.id;
            const { Icon } = hall;
            return (
              <motion.div key={hall.id} style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                onHoverStart={() => setHoveredHall(hall.id)} onHoverEnd={() => setHoveredHall(null)}>
                <motion.button onClick={() => isHallLocked(hall.id) ? onUpgradeRequired() : onSelectHall(hall.id)} whileHover={{ scale: 1.14 }} whileTap={{ scale: 0.95 }}
                  style={{ width: 86, height: 86, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, background: isHovered ? `linear-gradient(135deg, ${hall.bg}ff, ${hall.color}55)` : `linear-gradient(135deg, ${hall.bg}ee, rgba(13,17,23,0.95))`, border: `1.5px solid ${isHovered ? hall.color : 'rgba(212,175,55,0.3)'}`, borderRadius: 10, cursor: 'pointer', transition: 'background 0.3s, border-color 0.3s', boxShadow: isHovered ? `0 0 35px ${hall.color}66, 0 0 70px rgba(212,175,55,0.15)` : '0 4px 20px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden', opacity: isHallLocked(hall.id) ? 0.7 : 1 }}>
                  <div style={{ position: 'absolute', top: 5, left: 5, right: 5, bottom: 5, border: `1px solid ${hall.color}33`, borderRadius: 7, pointerEvents: 'none' }} />
                  {isHallLocked(hall.id) ? <Lock size={22} color={hall.color} style={{ opacity: 0.7 }} /> : <Icon size={22} color={isHovered ? '#F0D98A' : hall.color} />}
                  <div style={{ fontFamily: 'Inter', fontSize: '0.55rem', color: isHovered ? '#F0D98A' : '#C7C3B9', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2, padding: '0 6px' }}>
                    {isAr ? hall.arabic.split(' ')[0] : hall.name.split(' ')[0]}
                  </div>
                  <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.55rem', color: hall.color, opacity: 0.8 }}>{hall.id}</div>
                </motion.button>
                <AnimatePresence>
                  {isHovered && (
                    <motion.div key={`hall-tooltip-${hall.id}`} initial={{ opacity: 0, y: y > 100 ? -6 : 6, scale: 0.9, x: '-50%' }} animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }} exit={{ opacity: 0, y: y > 100 ? -6 : 6, scale: 0.9, x: '-50%' }} transition={{ duration: 0.18 }}
                      style={{ position: 'absolute', left: '50%', top: y > 100 ? 'auto' : '115%', bottom: y > 100 ? '115%' : 'auto', background: 'rgba(6,43,36,0.97)', border: `1px solid ${hall.color}66`, borderRadius: 8, padding: '12px 16px', minWidth: 160, textAlign: 'center', zIndex: 100, backdropFilter: 'blur(15px)', pointerEvents: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: isAr ? '0.85rem' : '0.82rem', color: '#F0D98A', marginBottom: 4 }}>{isAr ? hall.arabic : hall.name}</div>
                      <div style={{ fontFamily: isAr ? '"Playfair Display"' : '"IBM Plex Sans Arabic"', fontSize: isAr ? '0.65rem' : '0.75rem', color: hall.color, direction: isAr ? 'ltr' : 'rtl', marginBottom: 6 }}>{isAr ? hall.name : hall.arabic}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: '0.68rem', color: '#C7C3B9' }}>{isAr ? hall.descAr : hall.desc}</div>
                      <div style={{ width: '50%', height: 1, background: `${hall.color}66`, margin: '8px auto 4px' }} />
                      <div style={{ fontFamily: 'Inter', fontSize: '0.62rem', color: hall.color, letterSpacing: '0.1em' }}>{isHallLocked(hall.id) ? (isAr ? 'مغلق - احصل على التذكرة' : 'LOCKED - GET TICKET') : (isAr ? 'انقر للدخول ←' : 'CLICK TO ENTER →')}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Central phoenix */}
          <div style={{ position: 'absolute', zIndex: 10, textAlign: 'center' }}>
            <PhoenixSVG size={155} animate={true} glowIntensity={1.8} />
            <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.72rem', color: '#D4AF37', opacity: 0.7, marginTop: -16 }}>{t('hero.museum_name_ar')}</div>
          </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE TOP HEADER ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 pb-2 bg-[#062B24f2] backdrop-blur-md border-b border-[#D4AF3740]" style={{ paddingTop: 'calc(10px + env(safe-area-inset-top))' }}>
        <div className="flex gap-1.5">
          {onHome && (
            <button onClick={onHome} className="w-8 h-8 rounded-md bg-[#0D111780] border border-[#D4AF3766] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </button>
          )}
          <button onClick={() => { setShowMap(!showMap); setShowFloors(false); }} className={`w-8 h-8 rounded-md flex items-center justify-center border ${showMap ? 'bg-[#D4AF3733] border-[#D4AF37]' : 'bg-[#0D111780] border-[#D4AF3766]'}`}>
            <Map size={14} color="#D4AF37" />
          </button>
          <button onClick={() => { setShowFloors(!showFloors); setShowMap(false); }} className={`w-8 h-8 rounded-md flex items-center justify-center border ${showFloors ? 'bg-[#D4AF3733] border-[#D4AF37]' : 'bg-[#0D111780] border-[#D4AF3766]'}`}>
            <Compass size={14} color="#D4AF37" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', color: '#D4AF37', fontWeight: 600 }}>{t('dome.central')}</div>
        </div>

        <div className="flex gap-1.5 items-center">
          <button onClick={onOpenSearch} className="w-8 h-8 rounded-md bg-[#0D111780] border border-[#D4AF3766] flex items-center justify-center">
            <Search size={14} color="#D4AF37" />
          </button>
          {isAdmin ? (
            <button onClick={() => navigate('/admin')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.5)', borderRadius: 20, cursor: 'pointer', color: '#D4AF37' }}
              title="Admin Panel">
              <Shield size={12} color="#D4AF37" />
              <span style={{ fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 600 }}>Admin</span>
            </button>
          ) : (
            <div onClick={onOpenProfile} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6914] flex items-center justify-center border border-[#D4AF37] cursor-pointer" title={displayName}>
              <span style={{ fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 700, color: '#0D1117' }}>{avatarInitial}</span>
            </div>
          )}
          <div className="scale-75 origin-right">
            <LanguageSwitcher compact />
          </div>
        </div>
      </div>

      {/* ─── MOBILE: Grid layout ─── */}
      <div className="md:hidden absolute inset-0 flex flex-col items-center justify-start px-4 pb-[160px] gap-4 overflow-y-auto" style={{ paddingTop: 'calc(80px + env(safe-area-inset-top))' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 380 }}>
          {halls.map(hall => {
            const { Icon } = hall;
            return (
              <motion.button key={hall.id} onClick={() => isHallLocked(hall.id) ? onUpgradeRequired() : onSelectHall(hall.id)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 10px', background: `linear-gradient(135deg, ${hall.bg}ee, rgba(13,17,23,0.95))`, border: `1px solid ${hall.color}66`, borderRadius: 10, cursor: 'pointer', opacity: isHallLocked(hall.id) ? 0.7 : 1 }}>
                {isHallLocked(hall.id) ? <Lock size={30} color={hall.color} style={{ opacity: 0.7 }} /> : <Icon size={30} color={hall.color} />}
                <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.8rem', color: '#F8F4EA', textAlign: 'center', lineHeight: 1.3 }}>القاعة {hall.id}</div>
                <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.7rem', color: '#C7C3B9', textAlign: 'center', lineHeight: 1.3 }}>{hall.arabic}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Top Left Controls: Map, Home, Guide (Desktop only, Mobile handled in unified header) */}
      <div className="hidden md:flex absolute flex-row gap-4" style={{ top: 'calc(16px + env(safe-area-inset-top))', [isAr ? 'right' : 'left']: '24px', zIndex: 50, direction: 'ltr' }}>
        {onHome && (
          <button onClick={onHome} title="Back to Home"
            style={{ width: 40, height: 40, background: 'rgba(6,43,36,0.88)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C7C3B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </button>
        )}
        <button onClick={() => { setShowMap(!showMap); setShowFloors(false); }} title="Mini Map"
          style={{ width: 40, height: 40, background: showMap ? 'rgba(212,175,55,0.2)' : 'rgba(6,43,36,0.88)', border: `1px solid ${showMap ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.3)'}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <Map size={16} color={showMap ? '#D4AF37' : '#C7C3B9'} />
        </button>
        <button onClick={() => { setShowFloors(!showFloors); setShowMap(false); }} title="Floor Selector"
          style={{ width: 40, height: 40, background: showFloors ? 'rgba(212,175,55,0.2)' : 'rgba(6,43,36,0.88)', border: `1px solid ${showFloors ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.3)'}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <Compass size={16} color={showFloors ? '#D4AF37' : '#C7C3B9'} />
        </button>
      </div>

      {/* Mini map */}
      <AnimatePresence>
        {showMap && (
          <motion.div key="museum-map" initial={{ opacity: 0, scale: 0.8, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8, x: -20 }}
            style={{ position: 'absolute', top: 'calc(72px + env(safe-area-inset-top))', [isAr ? 'right' : 'left']: 24, zIndex: 50, background: 'rgba(6,43,36,0.97)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 12, padding: 16, width: 200, backdropFilter: 'blur(20px)' }}>
            <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.62rem', color: '#C7C3B9', marginBottom: 10, textAlign: 'center' }}>{isAr ? `خريطة المتحف — الطابق ${activeFloor}` : `Museum Map — Floor ${activeFloor}`}</div>
            <svg viewBox="0 0 150 150" style={{ width: '100%' }}>
              <circle cx="75" cy="75" r="70" fill="rgba(6,43,36,0.5)" stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
              <circle cx="75" cy="75" r="30" fill="rgba(212,175,55,0.05)" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
              <circle cx="75" cy="75" r="6" fill="#D4AF37" opacity="0.9" />
              {halls.map(hall => { const rad=((hall.angle-90)*Math.PI)/180; const x=75+55*Math.cos(rad); const y=75+55*Math.sin(rad); return (
                <g key={hall.id} style={{ cursor: 'pointer', opacity: isHallLocked(hall.id) ? 0.5 : 1 }} onClick={() => isHallLocked(hall.id) ? onUpgradeRequired() : onSelectHall(hall.id)}>
                  <circle cx={x} cy={y} r={8} fill={hall.bg} stroke={hall.color} strokeWidth="1.5" />
                  <text x={x} y={y+4} textAnchor="middle" style={{ fontSize: 8, fill: '#F0D98A', fontWeight: 'bold' }}>{hall.id}</text>
                  <line x1="75" y1="75" x2={x} y2={y} stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" />
                </g>
              ); })}
            </svg>
            <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.7rem', color: '#C7C3B9', textAlign: 'center', marginTop: 8 }}>{t('dome.enter')}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floor selector panel */}
      <AnimatePresence>
        {showFloors && (
          <motion.div key="museum-floors" initial={{ opacity: 0, scale: 0.9, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9, x: -20 }}
            style={{ position: 'absolute', top: 'calc(72px + env(safe-area-inset-top))', [isAr ? 'right' : 'left']: 24, zIndex: 50, background: 'rgba(6,43,36,0.97)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 12, overflow: 'hidden', width: 280, backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 100px)' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(212,175,55,0.15)', flexShrink: 0 }}>
              <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.65rem', color: '#C7C3B9', textAlign: 'center' }}>{isAr ? 'طوابق المتحف' : 'Museum Floors'}</div>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, paddingBottom: 8 }} className="custom-scrollbar">
            {floors.map(floor => {
              const { icon: FloorIcon } = { icon: floor.icon };
              const isActive = activeFloor === floor.level;
              const isLocked = isFloorLocked(floor.level);
              return (
                <motion.div key={floor.level} onClick={() => isLocked ? onUpgradeRequired() : setActiveFloor(floor.level)}
                  style={{ width: '100%', padding: '12px 16px', background: isActive ? `${floor.color}18` : 'none', border: 'none', borderBottom: '1px solid rgba(212,175,55,0.08)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', opacity: isLocked ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 6, background: `${floor.color}22`, border: `1px solid ${floor.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isLocked ? <Lock size={14} color={floor.color} /> : <floor.icon size={14} color={floor.color} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.75rem', color: isActive ? floor.color : '#F8F4EA', fontWeight: isActive ? 600 : 400 }}>{isAr ? `الطابق ${floor.level}: ${floor.arabic}` : `Floor ${floor.level}: ${floor.name}`}</div>
                        {isLocked && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.55rem', color: '#D4AF37', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, padding: '1px 6px', display: 'flex', alignItems: 'center', gap: 3 }}><Lock size={8}/> {isAr ? 'مغلق' : 'Locked'}</div>}
                      </div>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9', marginTop: 3, lineHeight: 1.4, textAlign: isAr ? 'right' : 'left' }}>{isAr ? floor.descriptionAr : floor.description}</div>
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ marginTop: 10, marginInlineStart: 40 }}>
                      {(isAr ? floor.sectionsAr : floor.sections).map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                          <div style={{ width: 3, height: 3, borderRadius: '50%', background: floor.color }} />
                          <div style={{ fontFamily: 'Inter', fontSize: '0.68rem', color: '#C7C3B9' }}>{s}</div>
                        </div>
                      ))}
                      {floor.level === 0 && onOpenTimeline && (
                        <button onClick={onOpenTimeline} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: `${floor.color}18`, border: `1px solid ${floor.color}44`, borderRadius: 4, color: floor.color, fontFamily: 'Inter', fontSize: '0.65rem', cursor: 'pointer', width: '100%' }}>
                          <Clock size={12} /> {t('dome.timeline')}
                        </button>
                      )}
                      {floor.level === 1 && onOpenResearch && (
                        <button onClick={onOpenResearch} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: `${floor.color}18`, border: `1px solid ${floor.color}44`, borderRadius: 4, color: floor.color, fontFamily: 'Inter', fontSize: '0.65rem', cursor: 'pointer', width: '100%' }}>
                          <BookOpen size={12} /> {t('dome.research')}
                        </button>
                      )}
                      {floor.level === 2 && onOpenCourses && (
                        <button onClick={onOpenCourses} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: `${floor.color}18`, border: `1px solid ${floor.color}44`, borderRadius: 4, color: floor.color, fontFamily: 'Inter', fontSize: '0.65rem', cursor: 'pointer', width: '100%' }}>
                          <GraduationCap size={12} /> {t('dome.courses')}
                        </button>
                      )}
                      {floor.level === 3 && (
                        <button onClick={onUpgradeRequired} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: `${floor.color}18`, border: `1px solid ${floor.color}44`, borderRadius: 4, color: floor.color, fontFamily: 'Inter', fontSize: '0.65rem', cursor: 'pointer', width: '100%' }}>
                          <Lock size={12} /> {t('dome.archive')}
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Right Controls: Search, Profile, Language (Desktop only, Mobile handled in unified header) */}
      <div className="hidden md:flex absolute items-center gap-2" style={{ top: 'calc(16px + env(safe-area-inset-top))', [isAr ? 'left' : 'right']: '24px', zIndex: 50, direction: isAr ? 'rtl' : 'ltr' }}>
        <button onClick={onOpenSearch}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(6,43,36,0.88)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
          <Search size={14} color="#D4AF37" />
          <span style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.72rem', color: '#C7C3B9' }}>{t('nav.search')}</span>
          <span style={{ fontFamily: 'Inter', fontSize: '0.6rem', color: 'rgba(199,195,185,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '1px 5px', display: 'none', direction: 'ltr' }} className="md:block">⌘K</span>
        </button>
        {isAdmin ? (
          <button onClick={() => navigate('/admin')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 20, cursor: 'pointer', color: '#D4AF37', backdropFilter: 'blur(10px)' }}
            title="Admin Panel">
            <Shield size={14} color="#D4AF37" />
            <span style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 600 }}>Admin Panel</span>
          </button>
        ) : (
          <div onClick={onOpenProfile} style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(212,175,55,0.5)', cursor: 'pointer' }} title={displayName}>
            <span style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 700, color: '#0D1117' }}>{avatarInitial}</span>
          </div>
        )}
        <LanguageSwitcher compact />
      </div>

      {/* Top Center Logo & Title */}
      <div className="absolute pointer-events-none hidden md:flex flex-col items-center" style={{ top: 'env(safe-area-inset-top)', zIndex: 40, paddingTop: '10px', paddingBottom: '30px', width: '400px', background: 'radial-gradient(ellipse at top, rgba(6,43,36,0.95) 0%, rgba(6,43,36,0.5) 40%, transparent 70%)', left: '50%', transform: 'translateX(-50%)' }}>
        <PhoenixSVG size={45} animate={false} glowIntensity={0.6} />
      </div>

      {/* ─── DESKTOP BOTTOM DOCK ─── */}
      <div className="absolute hidden md:block" style={{ bottom: 'calc(24px + env(safe-area-inset-bottom))', zIndex: 50, left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(6,43,36,0.95)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 50, padding: '8px 16px', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08)', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '95vw' }}>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.75rem', color: '#D4AF37', marginInlineEnd: 8, whiteSpace: 'nowrap' }}>{isAr ? 'القاعات' : 'Halls'}</div>
          {halls.map(hall => {
            const { Icon } = hall;
            return (
              <motion.button key={hall.id} onClick={() => isHallLocked(hall.id) ? onUpgradeRequired() : onSelectHall(hall.id)} title={isHallLocked(hall.id) ? `${hall.name} (Locked)` : hall.name} whileHover={{ scale: 1.18, y: -2 }} whileTap={{ scale: 0.9 }}
                style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${hall.bg}cc, rgba(13,17,23,0.6))`, border: `1px solid ${isHallLocked(hall.id) ? hall.color + '88' : hall.color + '55'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.2s', opacity: isHallLocked(hall.id) ? 0.85 : 1 }}>
                {isHallLocked(hall.id) ? <Lock size={15} color={hall.color} style={{ filter: 'brightness(1.2)' }} /> : <Icon size={15} color={hall.color} />}
              </motion.button>
            );
          })}
          <div style={{ width: 1, height: 24, background: 'rgba(212,175,55,0.2)', margin: '0 4px' }} />
          {onOpenTimeline && (
            <motion.button onClick={onOpenTimeline} title="Symbol Timeline" whileHover={{ scale: 1.18, y: -2 }} whileTap={{ scale: 0.9 }}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(13,17,23,0.6))', border: '1px solid rgba(212,175,55,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} color="#D4AF37" />
            </motion.button>
          )}
          {onOpenResearch && (
            <motion.button onClick={() => isFloorLocked(1) ? onUpgradeRequired() : onOpenResearch()} title={isFloorLocked(1) ? "Research Library (Locked)" : "Research Library"} whileHover={{ scale: 1.18, y: -2 }} whileTap={{ scale: 0.9 }}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(106,138,74,0.25), rgba(13,17,23,0.6))', border: `1px solid ${isFloorLocked(1) ? 'rgba(106,138,74,0.6)' : 'rgba(106,138,74,0.35)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isFloorLocked(1) ? 0.85 : 1 }}>
              {isFloorLocked(1) ? <Lock size={14} color="#6a8a4a" style={{ filter: 'brightness(1.2)' }} /> : <BookOpen size={16} color="#6a8a4a" />}
            </motion.button>
          )}
          {onOpenCourses && (
            <motion.button onClick={() => isFloorLocked(2) ? onUpgradeRequired() : onOpenCourses()} title={isFloorLocked(2) ? "Courses (Locked)" : "Courses"} whileHover={{ scale: 1.18, y: -2 }} whileTap={{ scale: 0.9 }}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(138,74,138,0.25), rgba(13,17,23,0.6))', border: `1px solid ${isFloorLocked(2) ? 'rgba(138,74,138,0.6)' : 'rgba(138,74,138,0.35)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isFloorLocked(2) ? 0.85 : 1 }}>
              {isFloorLocked(2) ? <Lock size={14} color="#8a4a6a" style={{ filter: 'brightness(1.2)' }} /> : <GraduationCap size={16} color="#8a4a6a" />}
            </motion.button>
          )}
        </div>
      </div>

      {/* ─── MOBILE BOTTOM DOCK ─── */}
      <div className="absolute w-full px-4 md:hidden block" style={{ bottom: 'calc(24px + env(safe-area-inset-bottom))', zIndex: 50, left: '50%', transform: 'translateX(-50%)' }}>
        <div className="mx-auto flex flex-col items-center gap-3 bg-[#062B24f2] border border-[#D4AF374d] rounded-2xl p-4 backdrop-blur-xl shadow-2xl max-w-sm">
          <div className="grid grid-cols-5 gap-3 justify-center items-center">
            {halls.map(hall => {
              const { Icon } = hall;
              return (
                <motion.button key={hall.id} onClick={() => isHallLocked(hall.id) ? onUpgradeRequired() : onSelectHall(hall.id)} title={isHallLocked(hall.id) ? `${hall.name} (Locked)` : hall.name} whileHover={{ scale: 1.18, y: -2 }} whileTap={{ scale: 0.9 }}
                  style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${hall.bg}cc, rgba(13,17,23,0.6))`, border: `1px solid ${isHallLocked(hall.id) ? hall.color + '88' : hall.color + '55'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.2s', opacity: isHallLocked(hall.id) ? 0.85 : 1 }}>
                  {isHallLocked(hall.id) ? <Lock size={16} color={hall.color} style={{ filter: 'brightness(1.2)' }} /> : <Icon size={16} color={hall.color} />}
                </motion.button>
              );
            })}
            {onOpenTimeline && (
              <motion.button onClick={onOpenTimeline} title="Symbol Timeline" whileHover={{ scale: 1.18, y: -2 }} whileTap={{ scale: 0.9 }}
                style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(13,17,23,0.6))', border: '1px solid rgba(212,175,55,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} color="#D4AF37" />
              </motion.button>
            )}
            {onOpenResearch && (
              <motion.button onClick={() => isFloorLocked(1) ? onUpgradeRequired() : onOpenResearch()} title={isFloorLocked(1) ? "Research Library (Locked)" : "Research Library"} whileHover={{ scale: 1.18, y: -2 }} whileTap={{ scale: 0.9 }}
                style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(106,138,74,0.25), rgba(13,17,23,0.6))', border: `1px solid ${isFloorLocked(1) ? 'rgba(106,138,74,0.6)' : 'rgba(106,138,74,0.35)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isFloorLocked(1) ? 0.85 : 1 }}>
                {isFloorLocked(1) ? <Lock size={16} color="#6a8a4a" style={{ filter: 'brightness(1.2)' }} /> : <BookOpen size={18} color="#6a8a4a" />}
              </motion.button>
            )}
            {onOpenCourses && (
              <motion.button onClick={() => isFloorLocked(2) ? onUpgradeRequired() : onOpenCourses()} title={isFloorLocked(2) ? "Courses (Locked)" : "Courses"} whileHover={{ scale: 1.18, y: -2 }} whileTap={{ scale: 0.9 }}
                style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(138,74,138,0.25), rgba(13,17,23,0.6))', border: `1px solid ${isFloorLocked(2) ? 'rgba(138,74,138,0.6)' : 'rgba(138,74,138,0.35)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isFloorLocked(2) ? 0.85 : 1 }}>
                {isFloorLocked(2) ? <Lock size={16} color="#8a4a6a" style={{ filter: 'brightness(1.2)' }} /> : <GraduationCap size={18} color="#8a4a6a" />}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
