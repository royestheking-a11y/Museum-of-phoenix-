import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark, Moon, Lock, Layers, Languages, ScrollText, Brain,
  BookOpen, Globe, Menu, X, Search, Star, ArrowRight, Sparkles, Shield, Ticket
} from 'lucide-react';
import ParticleField from './ParticleField';
import IslamicGeometry from './IslamicGeometry';
import PhoenixSVG from './PhoenixSVG';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { getUserSession } from '../utils/auth';

// Social media SVG icons
function FacebookIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function LinkedInIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

const halls = [
  { id: 1, Icon: Landmark, title: 'History of Symbols', arabic: 'تاريخ الرموز', color: '#8B6914', bg: '#2a1500', desc: '25 artifacts across 5,500 years', descAr: '25 قطعة أثرية عبر 5,500 عام' },
  { id: 2, Icon: Moon, title: "Qur'anic Symbolism", arabic: 'رموز القرآن', color: '#1a6a4a', bg: '#051a10', desc: '7 categories of sacred metaphors', descAr: '7 فئات من الاستعارات المقدسة' },
  { id: 3, Icon: Lock, title: 'Cryptography', arabic: 'علم التشفير', color: '#3a3a8a', bg: '#080820', desc: 'Al-Kindi & Arab cipher legacy', descAr: 'الكندي وإرث التشفير العربي' },
  { id: 4, Icon: Layers, title: 'Semiotics', arabic: 'السيميائية', color: '#6a2a8a', bg: '#140820', desc: 'Signs, meaning & cultural memory', descAr: 'العلامات والمعاني والذاكرة الثقافية' },
  { id: 5, Icon: Languages, title: 'Semantics', arabic: 'علم الدلالة', color: '#2a6a2a', bg: '#081408', desc: '8 Arabic root word trees', descAr: '8 أشجار كلمات للجذور العربية' },
  { id: 6, Icon: ScrollText, title: 'Manuscripts', arabic: 'المخطوطات', color: '#7a4a1a', bg: '#1e1008', desc: '10 rare manuscripts, 9th–15th c.', descAr: '10 مخطوطات نادرة من القرن 9-15' },
  { id: 7, Icon: Brain, title: 'AI Laboratory', arabic: 'مختبر الذكاء', color: '#1a4a7a', bg: '#001020', desc: 'Symbol AI analysis & chat', descAr: 'تحليل الرموز ومحادثة الذكاء الاصطناعي' },
];

const stats = [
  { value: '25+', valueAr: '+25', label: 'Artifacts', labelAr: 'قطعة' },
  { value: '10', valueAr: '10', label: 'Manuscripts', labelAr: 'مخطوطة' },
  { value: '5,500', valueAr: '5,500', label: 'Years of History', labelAr: 'عام' },
  { value: '7', valueAr: '7', label: 'Museum Halls', labelAr: 'قاعة' },
];

export type NavPage = 'museum' | 'collections' | 'research' | 'courses' | 'articles' | 'membership' | 'login' | 'register' | 'admin' | 'contact' | 'chairman';
interface Props {
  onEnterMuseum: () => void;
  onOpenSearch: () => void;
  onNavigate: (page: NavPage) => void;
  onRegister: () => void;
  onLogout?: () => void;
}

export default function HeroLanding({ onEnterMuseum, onOpenSearch, onNavigate, onRegister, onLogout }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { t, lang, isAr } = useLanguage();
  const [session, setSession] = useState(getUserSession());
  useEffect(() => {
    const interval = setInterval(() => setSession(getUserSession()), 500);
    return () => clearInterval(interval);
  }, []);

  const navLinks: { label: string; page: NavPage }[] = [
    { label: 'Museum', page: 'museum' },
    { label: 'Collections', page: 'collections' },
    { label: 'Research', page: 'research' },
    { label: 'Courses', page: 'courses' },
    { label: 'Articles', page: 'articles' },
  ];

  const handleNav = (page: NavPage) => {
    setMenuOpen(false);
    if (page === 'museum') { onEnterMuseum(); return; }
    onNavigate(page);
  };

  return (
    <motion.div className="fixed inset-0 overflow-y-auto overflow-x-hidden"
      style={{ 
        background: 'linear-gradient(rgba(13,17,23,0.6), rgba(13,17,23,0.8)), url("/museum_exterior_phoenix.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        overscrollBehavior: 'none'
      }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.6 }}>
      <IslamicGeometry opacity={0.04} patternId="hero-geo" />

      {/* ─── MINIMAL FLOATING HEADER ─── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, pointerEvents: 'none', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1200, paddingTop: 'calc(24px + env(safe-area-inset-top))', paddingBottom: '24px', paddingLeft: 'max(4vw, 24px)', paddingRight: 'max(4vw, 24px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: isAr ? 'rtl' : 'ltr' }}>
        
        {/* Logo */}
        <button onClick={() => {}} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}>
          <img src="/museum.png" alt="Museum Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <div className="hidden sm:block" style={{ textAlign: 'start', marginInlineStart: 12 }}>
            <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.1rem', color: '#D4AF37', lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{t('hero.museum_name_ar')}</div>
          </div>
        </button>

        {/* Left Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
          <button onClick={onOpenSearch}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(13,17,23,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 30, color: '#F8F4EA', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(13,17,23,0.7)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(13,17,23,0.4)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'; }}>
            <Search size={16} color="#D4AF37" />
            <span className="hidden sm:inline" style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem' }}>{t('nav.search')}</span>
            <span className="hidden md:inline" style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#D4AF37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 4, padding: '2px 6px', marginInlineEnd: 4, direction: 'ltr' }}>⌘K</span>
          </button>

          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <div onClick={() => setProfileOpen(!profileOpen)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(212,175,55,0.5)', cursor: 'pointer' }} title={session.name}>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 700, color: '#0D1117' }}>{session.name.charAt(0).toUpperCase()}</span>
                </div>
                <AnimatePresence>
                  {profileOpen && onLogout && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{ position: 'absolute', top: '120%', right: 0, background: 'rgba(13,17,23,0.95)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, padding: '8px', minWidth: 150, backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100 }}>
                      <button onClick={() => { setProfileOpen(false); onLogout(); }}
                        style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: 6, color: '#ff6b6b', fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: isAr ? 'right' : 'left' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,100,100,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,100,100,0.1)'}>
                        {isAr ? 'تسجيل الخروج' : 'Log out'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <button onClick={() => onNavigate('login')}
              style={{ padding: '10px 24px', background: 'rgba(13,17,23,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 30, color: '#D4AF37', fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(13,17,23,0.4)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}>
              {t('nav.login')}
            </button>
          )}
        </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section style={{ 
        minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '80px 20px 40px', position: 'relative'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, marginBottom: 22, direction: isAr ? 'rtl' : 'ltr' }}
              animate={{ boxShadow: ['0 0 0px rgba(212,175,55,0)', '0 0 20px rgba(212,175,55,0.3)', '0 0 0px rgba(212,175,55,0)'] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <Sparkles size={11} color="#D4AF37" />
              <span style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.7rem', color: '#D4AF37', letterSpacing: '0.05em' }}>{t('hero.reception')}</span>
            </motion.div>

            <motion.h1
              style={{ fontFamily: '"IBM Plex Sans Arabic", "Noto Kufi Arabic"', fontSize: 'clamp(2.5rem,8vw,4.5rem)', color: '#D4AF37', lineHeight: 1.3, direction: isAr ? 'rtl' : 'ltr', marginBottom: 12, margin: '0 0 12px' }}
              animate={{ textShadow: ['0 0 20px rgba(212,175,55,0.3)', '0 0 50px rgba(212,175,55,0.6)', '0 0 20px rgba(212,175,55,0.3)'] }}
              transition={{ duration: 4, repeat: Infinity }}>
              {t('hero.museum_of_symbols')}
            </motion.h1>

            <h2 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: 'clamp(1.5rem,4vw,2.5rem)', color: '#F8F4EA', lineHeight: 1.4, marginBottom: 16, margin: '0 0 16px', fontWeight: 'normal' }}>
              {t('hero.gate')}
            </h2>

            <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: 'clamp(0.9rem,2vw,1.05rem)', color: '#C7C3B9', lineHeight: 1.85, maxWidth: 600, marginBottom: 40, direction: isAr ? 'rtl' : 'ltr' }}>
              {t('hero.desc')}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', direction: isAr ? 'rtl' : 'ltr' }}>
              {session ? (
                <motion.button onClick={onEnterMuseum}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(212,175,55,0.5)' }} whileTap={{ scale: 0.97 }}
                  style={{ padding: '16px 40px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 8, color: '#0D1117', fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 25px rgba(212,175,55,0.25)' }}>
                  <ArrowRight size={20} /> {isAr ? 'دخول المتحف' : 'Enter Museum'}
                </motion.button>
              ) : (
                <>
                  <motion.button onClick={() => onNavigate('register')}
                    whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(212,175,55,0.5)' }} whileTap={{ scale: 0.97 }}
                    style={{ padding: '16px 36px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 8, color: '#0D1117', fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 25px rgba(212,175,55,0.25)' }}>
                    <Ticket size={18} /> {t('hero.get_ticket')}
                  </motion.button>

                  <motion.button onClick={onEnterMuseum} whileHover={{ scale: 1.03 }}
                    style={{ padding: '16px 30px', background: 'rgba(13,17,23,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 8, color: '#D4AF37', fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Globe size={18} /> {t('hero.free_guest')}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      {/* ─── MEMBERSHIP CTA ─── */}
      <section style={{ padding: '60px 20px', background: 'rgba(13,17,23,0.2)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', color: '#D4AF37', letterSpacing: '0.2em', marginBottom: 8 }}>{t('hero.admission_tickets')}</div>
          <div style={{ fontFamily: '"Playfair Display"', fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#F8F4EA' }}>{t('hero.title')}</div>
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
          {[
            { tier: t('hero.visitor'), arabic: 'زائر', price: t('hero.free'), features: [t('feat.all_halls'), t('feat.symbol_search'), t('feat.basic_articles')], color: '#C7C3B9', cta: t('hero.get_ticket') },
            { tier: t('hero.researcher'), arabic: 'باحث', price: '$10' + t('hero.mo'), features: [t('feat.full_archive'), t('feat.all_manuscripts'), t('feat.ai_analyzer'), t('feat.courses_5')], color: '#D4AF37', cta: t('hero.claim'), featured: true },
            { tier: t('hero.scholar'), arabic: 'عالم', price: '$25' + t('hero.mo'), features: [t('feat.everything'), t('feat.all_courses'), t('feat.certificates'), t('feat.consultations')], color: '#F0D98A', cta: t('hero.claim') },
          ].map((plan) => (
            <motion.div key={plan.tier} onClick={() => onNavigate('register')} whileHover={{ scale: 1.02, y: -4 }}
              style={{ padding: '26px 20px', background: plan.featured ? 'linear-gradient(135deg,#2D2311,#0D1117)' : 'linear-gradient(135deg,#1A202C,#0D1117)', border: `1px solid ${plan.featured ? 'rgba(212,175,55,0.5)' : 'rgba(199,195,185,0.2)'}`, borderRadius: 16, position: 'relative', cursor: 'pointer', display: 'flex', flexDirection: 'column', boxShadow: plan.featured ? '0 20px 40px rgba(212,175,55,0.15)' : '0 10px 30px rgba(0,0,0,0.5)', borderRight: `2px dashed ${plan.featured ? 'rgba(212,175,55,0.5)' : 'rgba(199,195,185,0.2)'}` }}>
              
              <div style={{ position: 'absolute', top: -10, insetInlineEnd: -10, width: 20, height: 20, borderRadius: '50%', background: 'rgba(13,17,23,0.5)', borderBottom: `1px solid ${plan.featured ? 'rgba(212,175,55,0.5)' : 'rgba(199,195,185,0.2)'}`, borderInlineStart: `1px solid ${plan.featured ? 'rgba(212,175,55,0.5)' : 'rgba(199,195,185,0.2)'}` }} />
              <div style={{ position: 'absolute', bottom: -10, insetInlineEnd: -10, width: 20, height: 20, borderRadius: '50%', background: 'rgba(13,17,23,0.5)', borderTop: `1px solid ${plan.featured ? 'rgba(212,175,55,0.5)' : 'rgba(199,195,185,0.2)'}`, borderInlineStart: `1px solid ${plan.featured ? 'rgba(212,175,55,0.5)' : 'rgba(199,195,185,0.2)'}` }} />
              
              {plan.featured && <div style={{ position: 'absolute', top: -12, insetInlineStart: '50%', transform: `translateX(${lang === 'ar' ? '50%' : '-50%'})`, background: 'linear-gradient(135deg,#D4AF37,#8B6914)', padding: '3px 14px', borderRadius: 20, fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.58rem', color: '#0D1117', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}><Star size={10} fill="#0D1117" /> {t('hero.most_popular')}</div>}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, direction: isAr ? 'rtl' : 'ltr' }}>
                 <div>
                   <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: plan.color, marginBottom: 2 }}>{plan.tier}</div>
                 </div>
                 <Ticket size={24} color={plan.color} style={{ opacity: 0.5 }} />
              </div>
              <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.9rem', color: '#F8F4EA', marginBottom: 16, direction: isAr ? 'rtl' : 'ltr' }}>{plan.price}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18, flex: 1, direction: isAr ? 'rtl' : 'ltr' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 4, height: 4, background: plan.color, borderRadius: '50%', flexShrink: 0 }} />
                    <span style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.76rem', color: '#C7C3B9' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', padding: '10px', background: plan.featured ? 'linear-gradient(135deg,#D4AF37,#8B6914)' : 'rgba(212,175,55,0.08)', border: plan.featured ? 'none' : `1px solid ${plan.color}44`, borderRadius: 6, color: plan.featured ? '#0D1117' : plan.color, fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CHAIRMAN & FOUNDER MINI-BOX ─── */}
      <section style={{ padding: '60px 20px', background: 'rgba(13,17,23,0.3)', backdropFilter: 'blur(15px)', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: 'rgba(13,17,23,0.7)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 24, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}>
            
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #D4AF37, #8B6914, #D4AF37)' }} />
            
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #8B6914)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 10px 20px rgba(212,175,55,0.2)' }}>
              <span style={{ fontFamily: isAr ? '"Aref Ruqaa", "Amiri", serif' : '"Playfair Display"', fontSize: isAr ? '3.5rem' : '2.5rem', color: '#0D1117', marginTop: isAr ? -10 : 0 }}>{isAr ? 'ف' : 'F'}</span>
            </div>
            
            <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', color: '#D4AF37', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              {isAr ? 'مؤسسة المتحف ورئيسة مجلس الإدارة' : 'Museum Founder & Chairman'}
            </div>
            
            <h3 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '2.2rem', color: '#F8F4EA', marginBottom: 16 }}>
              {isAr ? 'د. فاطمة فاضل العيساوي' : 'Dr. Fatima Fadel Alissawi'}
            </h3>
            
            <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '1rem', color: '#C7C3B9', maxWidth: 600, lineHeight: 1.6, marginBottom: 30 }}>
              {isAr 
                ? 'باحثة متخصصة في الرموز، تكرس حياتها لكشف المعاني العميقة في التراث الإسلامي.' 
                : 'A dedicated researcher in symbolism, uncovering the deep meanings woven within Islamic heritage.'}
            </p>
            
            <button onClick={() => onNavigate('chairman')}
              style={{ padding: '12px 28px', background: 'rgba(212,175,55,0.1)', border: '1px solid #D4AF37', borderRadius: 30, color: '#D4AF37', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.color = '#0D1117'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; e.currentTarget.style.color = '#D4AF37'; }}>
              {isAr ? 'تعرف على المؤسسة' : 'Meet the Founder'} <ArrowRight size={16} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT US (SEO) ─── */}
      <section style={{ padding: '60px 20px', background: 'rgba(13,17,23,0.2)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', direction: isAr ? 'rtl' : 'ltr' }}>
          <h2 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#D4AF37', marginBottom: 24, fontWeight: 'normal' }}>
            {isAr ? 'اكتشف الحضارات القديمة' : 'Discover Ancient Civilizations'}
          </h2>
          <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '1rem', color: '#C7C3B9', lineHeight: 1.8, marginBottom: 16 }}>
            {isAr 
              ? 'متحف العنقاء هو مؤسسة ثقافية رائدة مكرسة للحفاظ على التاريخ والتراث والحضارة الإنسانية. يضم متحفنا قطعاً أثرية نادرة ومجموعات تاريخية ومعارض غامرة تربط الزوار بالماضي.'
              : 'Museum of Phoenix is a premier cultural institution dedicated to preserving history, heritage, and human civilization. Our museum houses rare artifacts, historical collections, and immersive exhibitions that connect visitors with the past.'}
          </p>
          <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '1rem', color: '#C7C3B9', lineHeight: 1.8 }}>
            {isAr
              ? 'مستوحين من طائر العنقاء الرمزي، نمثل الولادة الجديدة والمعرفة والتراث الخالد من خلال التعليم والبحث والحفظ.'
              : 'Inspired by the symbolic phoenix, we represent rebirth, knowledge, and timeless legacy through education, research, and preservation.'}
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid rgba(212,175,55,0.15)', background: 'rgba(13,17,23,0.4)', display: 'flex', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
        <div style={{ width: '100%', maxWidth: 1200, paddingTop: '52px', paddingLeft: 'max(4vw, 24px)', paddingRight: 'max(4vw, 24px)', paddingBottom: 'calc(32px + env(safe-area-inset-bottom))', direction: isAr ? 'rtl' : 'ltr' }}>

          {/* ── Museum Branding + Language + Social ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>

            {/* Museum identity block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="/museum.png" alt="Museum Logo" style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.15rem', color: '#D4AF37', lineHeight: 1.2, textShadow: '0 2px 10px rgba(212,175,55,0.3)' }}>{t('hero.museum_name_ar')}</div>
                </div>
              </div>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: 'rgba(199,195,185,0.5)', lineHeight: 1.6 }}>{t('hero.footer_desc')}</div>

              {/* Social Media Icons */}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  {isAr ? 'تابعنا' : 'Follow Us'}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { label: 'Facebook', href: 'https://facebook.com', icon: <FacebookIcon size={16} color="#F0D98A" /> },
                    { label: 'Website', href: '#', icon: <Globe size={16} color="#F0D98A" /> },
                    { label: 'Instagram', href: 'https://instagram.com', icon: <InstagramIcon size={16} color="#F0D98A" /> },
                    { label: 'LinkedIn', href: 'https://linkedin.com', icon: <LinkedInIcon size={16} color="#F0D98A" /> },
                  ].map(({ label, href, icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      title={label}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 38, height: 38,
                        background: 'rgba(212,175,55,0.08)',
                        border: '1px solid rgba(212,175,55,0.22)',
                        borderRadius: 10,
                        color: '#F0D98A',
                        textDecoration: 'none',
                        transition: 'background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,55,0.18)';
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,55,0.55)';
                        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 18px rgba(212,175,55,0.2)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,55,0.08)';
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,55,0.22)';
                        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                      }}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Language chooser */}
              <div style={{ marginTop: 4 }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {isAr ? 'اللغة' : 'Language'}
                </div>
                <LanguageSwitcher />
              </div>
            </div>

            {/* Nav link columns */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', flexDirection: isAr ? 'row-reverse' : 'row' }}>
              {(isAr ?
                [['المتحف', ['دخول المتحف', 'جميع القاعات', 'الجدول الزمني للرموز', 'المجموعات']], ['التعلم', ['المقالات', 'الأبحاث', 'الدورات', 'الشهادات']], ['الحساب', ['تسجيل الدخول', 'العضوية', 'اتصل بنا']]] :
                [['Museum', ['Enter Museum', 'All Halls', 'Symbol Timeline', 'Collections']], ['Learn', ['Articles', 'Research', 'Courses', 'Certificates']], ['Account', ['Login', 'Membership', 'Contact Us']]]
              ).map(([section, links]) => (
                <div key={section as string}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#D4AF37', marginBottom: 10, textAlign: isAr ? 'right' : 'left', letterSpacing: '0.06em', fontWeight: 600 }}>{section as string}</div>
                  {(links as string[]).map(link => (
                    <button key={link} onClick={() => {
                      const map: Record<string, NavPage | 'museum' | 'enter' | 'register'> = {
                        'دخول المتحف': 'register', 'جميع القاعات': 'register', 'الجدول الزمني للرموز': 'register',
                        'المجموعات': 'register', 'المقالات': 'register', 'الأبحاث': 'register',
                        'الدورات': 'register', 'الشهادات': 'register', 'تسجيل الدخول': 'login',
                        'العضوية': 'membership', 'اتصل بنا': 'contact',
                        'Enter Museum': 'register', 'All Halls': 'register', 'Symbol Timeline': 'register',
                        'Collections': 'register', 'Articles': 'register', 'Research': 'register',
                        'Courses': 'register', 'Certificates': 'register', 'Login': 'login',
                        'Membership': 'membership', 'Contact Us': 'contact',
                      };
                      const target = map[link];
                      if (target === 'register') onRegister();
                      else if (target === 'museum') onEnterMuseum();
                      else if (target) onNavigate(target as NavPage);
                    }}
                      style={{ display: 'block', background: 'none', border: 'none', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9', cursor: 'pointer', textAlign: isAr ? 'right' : 'left', marginBottom: 8, transition: 'color 0.2s', padding: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#C7C3B9')}>
                      {link}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div style={{ borderTop: '1px solid rgba(212,175,55,0.08)', paddingTop: 18, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'center', flexDirection: isAr ? 'row-reverse' : 'row' }}>
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: 'rgba(199,195,185,0.4)', direction: isAr ? 'rtl' : 'ltr' }}>
              {isAr ? '© 2026 متحف الفينيق الافتراضي. جميع الحقوق محفوظة.' : '© 2026 The Phoenix Virtual Museum. All rights reserved.'}
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
