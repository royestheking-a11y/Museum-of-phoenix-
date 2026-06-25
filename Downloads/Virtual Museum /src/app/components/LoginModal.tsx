const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, Shield, Sparkles, Ticket, Eye, EyeOff } from 'lucide-react';
import PhoenixSVG from './PhoenixSVG';
import TicketPass from './TicketPass';
import { useLanguage } from '../context/LanguageContext';
import { saveUserSession, getUserSession } from '../utils/auth';

import { Crown } from 'lucide-react';

type Tab = 'login' | 'register' | 'forgot' | 'upgrade';

interface Props {
  open: boolean;
  initialTab?: Tab;
  onClose: () => void;
  onAdminAccess: () => void;
  onEnterMuseum?: (level: 'Visitor' | 'Researcher' | 'Scholar') => void;
  onLogout?: () => void;
}

const InputField = ({ icon: Icon, type, placeholder, value, onChange, isAr }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', [isAr ? 'right' : 'left']: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(212,175,55,0.6)' }}>
        <Icon size={18} />
      </div>
      <input 
        type={inputType}
        placeholder={placeholder}
        value={value} 
        onChange={onChange} 
        style={{
          width: '100%',
          padding: isPassword
            ? (isAr ? '14px 44px 14px 44px' : '14px 44px 14px 44px')
            : (isAr ? '14px 44px 14px 14px' : '14px 14px 14px 44px'),
          background: 'rgba(212,175,55,0.03)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: 8,
          color: '#F8F4EA',
          fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter',
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'all 0.2s ease',
          direction: isAr ? 'rtl' : 'ltr'
        }}
        onFocus={(e) => {
          e.target.style.background = 'rgba(212,175,55,0.08)';
          e.target.style.borderColor = 'rgba(212,175,55,0.5)';
          e.target.style.boxShadow = '0 0 15px rgba(212,175,55,0.1)';
        }}
        onBlur={(e) => {
          e.target.style.background = 'rgba(212,175,55,0.03)';
          e.target.style.borderColor = 'rgba(212,175,55,0.2)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {isPassword && (
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ 
            position: 'absolute', 
            [isAr ? 'left' : 'right']: 12, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            background: 'none', 
            border: 'none', 
            color: 'rgba(212,175,55,0.6)', 
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
};

export default function LoginModal({ open, initialTab, onClose, onAdminAccess, onEnterMuseum, onLogout }: Props) {
  const { t, isAr } = useLanguage();
  const [tab, setTab] = useState<Tab>(initialTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [ticketIssued, setTicketIssued] = useState(false);
  const [userType, setUserType] = useState<'Visitor' | 'Researcher' | 'Scholar'>('Visitor');
  
  const session = getUserSession();

  useEffect(() => {
    if (open) {
      setTab(initialTab || 'login');
      setError('');
      setSuccess(false);
      setTicketIssued(false);
    }
  }, [open, initialTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Admin shortcut
    if (email === 'admin@phoenix.museum' && password === 'admin123') {
      setTimeout(() => { setLoading(false); onClose(); onAdminAccess(); }, 800);
      return;
    }

    if (tab === 'forgot') {
      setTimeout(() => { setLoading(false); setSuccess(true); }, 1000);
      return;
    }

    if (!email.includes('@')) { setLoading(false); setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setLoading(false); setError('Password must be at least 6 characters.'); return; }

    try {
      if (tab === 'login') {
        const res = await fetch(`${API_BASE_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Invalid credentials');
        const user = await res.json();
        saveUserSession(user);
        setUserType(user.level);
        setSuccess(true);
        setTimeout(() => { setSuccess(false); setTicketIssued(true); }, 1000);
      } else if (tab === 'register') {
        const res = await fetch(`${API_BASE_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name: name || 'User', level: 'Visitor' })
        });
        if (!res.ok) throw new Error('Registration failed, email might be in use');
        const user = await res.json();
        saveUserSession(user);
        setUserType(user.level);
        setSuccess(true);
        setTimeout(() => { setSuccess(false); setTicketIssued(true); }, 1000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
          style={{ zIndex: 1000 }}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
            style={{ background: 'rgba(2, 8, 6, 0.75)', backdropFilter: 'blur(16px)' }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row w-full max-w-4xl"
            style={{
              background: 'radial-gradient(120% 120% at 50% -10%, rgba(212,175,55,0.12), rgba(6,43,36,0.6) 30%, rgba(4,12,10,0.95) 100%)',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: 24,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            {/* Top Gold Accent Line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)' }} />
            
            {/* Geometric Background Subtle Pattern */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

            {/* Left Side (Branding/Visuals) - Hidden on Mobile */}
            <div className="hidden md:flex flex-1 flex-col items-center justify-center p-12 relative border-r border-white/5" style={{ background: 'linear-gradient(135deg, rgba(6, 43, 36, 0.4) 0%, rgba(11, 31, 27, 0.8) 100%)' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
                <PhoenixSVG size={280} glowIntensity={1.2} />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ textAlign: 'center', position: 'relative', zIndex: 2, marginTop: 32 }}
              >
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', color: '#F8F4EA', margin: '0 0 12px', letterSpacing: '0.02em' }}>
                  {t('modal.title')}
                </h2>
                <p style={{ fontFamily: 'Inter', fontSize: '0.95rem', color: '#A09D94', lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
                  {t('modal.desc')}
                </p>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic", sans-serif' : '"Playfair Display"', fontSize: '1.3rem', color: '#D4AF37', marginTop: 20, opacity: 0.8 }}>
                  {isAr ? 'متحف الفينيق' : 'Phoenix Museum'}
                </div>
              </motion.div>
            </div>

            {/* Right Side (Form) */}
            <div className="flex-1 p-8 sm:p-12 relative flex flex-col justify-center" style={{ background: 'rgba(13, 17, 23, 0.4)' }}>
              
              {/* Close Button */}
              <button 
                onClick={onClose} 
                style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: '#C7C3B9', cursor: 'pointer', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 20 }} 
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#FFF'; }} 
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#C7C3B9'; }}
              >
                <X size={18} />
              </button>

              <div style={{ maxWidth: 380, margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
              <AnimatePresence mode="wait">
                {ticketIssued ? (
                  <motion.div key="ticket-issued" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, padding: '20px 0' }}>
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.8rem', color: '#D4AF37', margin: '0 0 8px' }}>{isAr ? 'تم إصدار التذكرة' : 'Ticket Issued'}</h3>
                      <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', color: '#A09D94', margin: 0 }}>{isAr ? 'تذكرة الدخول الخاصة بك جاهزة.' : 'Your entry ticket is ready.'}</p>
                    </div>
                    
                    <TicketPass type={userType} userName={name || email.split('@')[0] || 'Explorer'} />
                    
                    <motion.button onClick={() => { if(onEnterMuseum) onEnterMuseum(userType); else onClose(); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #D4AF37, #8B6914)', border: 'none', borderRadius: 12, color: '#040B09', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 20px rgba(212,175,55,0.2)', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                      {isAr ? 'دخول المتحف' : 'Enter Museum'} <ArrowRight size={18} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {(session && !success) ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ width: 80, height: 80, background: 'rgba(212,175,55,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 0 30px rgba(212,175,55,0.1)' }}>
                      <User size={36} color="#D4AF37" />
                    </div>
                    <h3 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.8rem', color: '#D4AF37', margin: '0 0 12px' }}>{isAr ? 'حسابك' : 'Your Profile'}</h3>
                    <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.95rem', color: '#F8F4EA', lineHeight: 1.6, marginBottom: 8, margin: '0 auto' }}>
                      {session.name}
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#A09D94', lineHeight: 1.6, marginBottom: 32, margin: '0 auto 32px' }}>
                      {session.email}
                    </p>
                    <button onClick={onLogout} style={{ padding: '14px 32px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 12, color: '#ff6b6b', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', transition: 'all 0.2s', flexDirection: isAr ? 'row-reverse' : 'row' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,107,107,0.15)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}>
                      {isAr ? 'تسجيل الخروج' : 'Log Out'}
                    </button>
                  </div>
                ) : tab === 'upgrade' ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ width: 80, height: 80, background: 'rgba(212,175,55,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 0 30px rgba(212,175,55,0.1)' }}>
                      <Crown size={36} color="#D4AF37" />
                    </div>
                    <h3 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.8rem', color: '#D4AF37', margin: '0 0 12px' }}>{isAr ? 'افتح المتحف' : 'Unlock Museum'}</h3>
                    <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.95rem', color: '#A09D94', lineHeight: 1.6, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                      {isAr ? 'أنت تستكشف حالياً كضيف مجاني. احصل على تذكرة زائر لفتح جميع القاعات الـ 7، أو قم بترقية تذكرتك للوصول إلى مكتبة الأبحاث، الدورات، والأرشيف.' : 'You are currently exploring as a free guest. Get a visitor ticket to unlock all 7 halls, or upgrade your ticket for access to the research library, courses, and archives.'}
                    </p>
                    <button onClick={() => setTab('register')} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #D4AF37, #8B6914)', border: 'none', borderRadius: 12, color: '#040B09', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', boxShadow: '0 10px 20px rgba(212,175,55,0.2)', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                      {t('hero.get_ticket')} <ArrowRight size={18} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
                    </button>
                    <button onClick={() => setTab('login')} style={{ marginTop: 24, background: 'none', border: 'none', color: '#A09D94', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.2s', direction: isAr ? 'rtl' : 'ltr' }} onMouseOver={e => e.currentTarget.style.color = '#D4AF37'} onMouseOut={e => e.currentTarget.style.color = '#A09D94'}>
                      {isAr ? 'لديك تذكرة بالفعل؟ ' : 'Already have a ticket? '}<span style={{ color: '#D4AF37' }}>{isAr ? 'تسجيل الدخول' : 'Log In'}</span>
                    </button>
                  </div>
                ) : (
                  <>
                <div style={{ marginBottom: 32 }}>
                  <div className="md:hidden flex justify-center mb-6">
                     <PhoenixSVG size={64} glowIntensity={0.8} />
                  </div>
                  <h3 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.8rem', color: '#F8F4EA', margin: '0 0 8px', letterSpacing: '0.01em', textAlign: isAr ? 'right' : 'left' }}>
                    {tab === 'login' ? (isAr ? 'مرحباً بعودتك' : 'Welcome Back') : tab === 'register' ? (isAr ? 'انضم إلى الأكاديمية' : 'Join the Academy') : (isAr ? 'استعادة كلمة المرور' : 'Reset Password')}
                  </h3>
                  <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', color: '#A09D94', margin: 0, textAlign: isAr ? 'right' : 'left' }}>
                    {tab === 'login' ? (isAr ? 'أدخل بياناتك للمتابعة.' : 'Enter your details to continue.') : tab === 'register' ? (isAr ? 'أنشئ حساباً لحفظ مجموعاتك.' : 'Create an account to save collections.') : (isAr ? 'سنرسل لك رابط الاسترداد.' : 'We will send you a recovery link.')}
                  </p>
                </div>

                {/* Tabs */}
                {tab !== 'forgot' && (
                  <div style={{ display: 'flex', padding: 4, background: 'rgba(0,0,0,0.4)', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', direction: isAr ? 'rtl' : 'ltr' }}>
                    {(['login', 'register'] as Tab[]).map(tabKey => (
                      <button 
                        key={tabKey} 
                        onClick={() => { setTab(tabKey); setError(''); setSuccess(false); }}
                        style={{ 
                          flex: 1, padding: '10px', background: 'transparent', border: 'none', 
                          color: tab === tabKey ? '#F8F4EA' : '#8b949e', 
                          fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', fontWeight: 500,
                          cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.3s',
                          position: 'relative', zIndex: 2
                        }}
                      >
                        {tabKey === 'login' ? t('modal.login_link') : t('modal.register_link')}
                      </button>
                    ))}
                    <motion.div 
                      layoutId="tab-pill"
                      initial={false}
                      animate={{ 
                        left: isAr 
                          ? (tab === 'login' ? 'calc(50% + 2px)' : '4px') 
                          : (tab === 'login' ? '4px' : 'calc(50% + 2px)'),
                        width: 'calc(50% - 6px)' 
                      }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      style={{
                        position: 'absolute', top: 4, bottom: 4,
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8, zIndex: 1
                      }}
                    />
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={tab} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                    >
                      {tab === 'register' && (
                        <InputField icon={User} type="text" placeholder={t('modal.name')} value={name} onChange={(e: any) => setName(e.target.value)} isAr={isAr} />
                      )}

                      <InputField icon={Mail} type="email" placeholder={t('modal.email')} value={email} onChange={(e: any) => setEmail(e.target.value)} isAr={isAr} />

                      {tab !== 'forgot' && (
                        <InputField icon={Lock} type="password" placeholder={t('modal.pass')} value={password} onChange={(e: any) => setPassword(e.target.value)} isAr={isAr} />
                      )}

                      {tab === 'login' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: -4, padding: '0 4px', direction: isAr ? 'rtl' : 'ltr' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input type="checkbox" style={{ accentColor: '#D4AF37', width: 14, height: 14, cursor: 'pointer' }} />
                            <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#A09D94' }}>{isAr ? 'تذكرني' : 'Remember me'}</span>
                          </label>
                          <button type="button" onClick={() => { setTab('forgot'); setError(''); setSuccess(false); }} style={{ background: 'none', border: 'none', color: '#D4AF37', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#F0D98A'} onMouseOut={e => e.currentTarget.style.color = '#D4AF37'}>
                            {t('modal.forgot')}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.2)', borderRadius: 12, padding: '12px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: 8, direction: isAr ? 'rtl' : 'ltr' }}>
                      <Sparkles size={14} /> {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(74,138,74,0.1)', border: '1px solid rgba(74,138,74,0.2)', borderRadius: 12, padding: '12px 14px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: 8, direction: isAr ? 'rtl' : 'ltr' }}>
                      <Sparkles size={14} /> {tab === 'forgot' ? (isAr ? 'تم إرسال الرابط!' : 'Link sent!') : t('modal.success')}
                    </motion.div>
                  )}

                  <motion.button 
                    type="submit" 
                    disabled={loading}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ 
                      padding: '14px', marginTop: 8,
                      background: loading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', 
                      border: 'none', borderRadius: 12, color: '#040B09', 
                      fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.95rem', fontWeight: 700, 
                      cursor: loading ? 'not-allowed' : 'pointer', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: '0 4px 14px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
                      textShadow: '0 1px 1px rgba(255,255,255,0.2)'
                    }}
                  >
                    {loading ? (
                      <motion.div style={{ width: 18, height: 18, border: '2px solid #040B09', borderTopColor: 'transparent', borderRadius: '50%' }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: isAr ? 'row-reverse' : 'row' }}>
                        {tab === 'login' ? t('modal.login_btn') : tab === 'register' ? t('modal.register_btn') : (isAr ? 'إرسال رابط الاسترداد' : 'Send Recovery Link')} <ArrowRight size={16} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
                      </div>
                    )}
                  </motion.button>

                  {tab === 'forgot' && (
                     <button type="button" onClick={() => { setTab('login'); setError(''); setSuccess(false); }} style={{ background: 'none', border: 'none', color: '#A09D94', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', cursor: 'pointer', marginTop: 8 }}>
                       {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                     </button>
                  )}

                  {tab !== 'forgot' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 8px' }}>
                        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
                        <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#71717A', letterSpacing: '0.05em' }}>{isAr ? 'أو المتابعة باستخدام' : 'Or continue with'}</span>
                        <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.1))' }} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <button type="button"
                          style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#F8F4EA', fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
                          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg> Google
                        </button>
                        <button type="button"
                          style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#F8F4EA', fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
                          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.142 2.025c-1.32.062-2.874.887-3.79 1.954-.805.937-1.442 2.277-1.272 3.568 1.455.112 2.9-.74 3.75-1.782.802-.977 1.408-2.315 1.312-3.74zM16.711 7.49c-2.083-.105-3.957 1.183-4.966 1.183-1.036 0-2.585-1.15-4.225-1.12-2.137.034-4.108 1.246-5.21 3.178-2.222 3.861-.568 9.57 1.587 12.69 1.05 1.523 2.298 3.238 3.935 3.177 1.58-.063 2.18-.1 3.834-1.03 1.637-.923 2.302-1.033 3.938-1.033 1.611 0 2.228.09 3.81 1.033 1.608.932 2.223.986 3.757 1.05 1.688.07 2.804-1.493 3.844-3.024 1.206-1.769 1.704-3.483 1.727-3.568-.037-.016-3.342-1.285-3.375-5.114-.028-3.2 2.615-4.73 2.735-4.802-1.49-2.18-3.805-2.477-4.636-2.564z" />
                          </svg> Apple
                        </button>
                      </div>
                    </>
                  )}

                  {/* Admin hint */}
                  <div style={{ marginTop: 24, padding: '12px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.3s', cursor: 'pointer' }}
                    onClick={() => { setTab('login'); setEmail('admin@phoenix.museum'); setPassword('admin123'); }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.04)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.1)'; }}
                  >
                    <div style={{ width: 32, height: 32, background: 'rgba(212,175,55,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Shield size={14} color="#D4AF37" />
                    </div>
                    <div style={{ textAlign: isAr ? 'right' : 'left', flex: 1 }}>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', fontWeight: 600, color: '#D4AF37' }}>{t('modal.admin')}</div>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: '#A09D94' }}>{isAr ? 'انقر لتعبئة البيانات تلقائياً' : 'Click to autofill data'}</div>
                    </div>
                  </div>
                </form>
                  </>
                )}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
