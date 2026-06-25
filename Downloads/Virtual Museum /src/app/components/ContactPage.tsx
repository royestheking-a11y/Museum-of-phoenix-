import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Mail, Phone, MapPin, Clock, Send, Check,
  MessageSquare, Globe, Instagram, Linkedin, Twitter,
  ChevronDown, Loader2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import IslamicGeometry from './IslamicGeometry';
import ParticleField from './ParticleField';
import { saveMessage } from '../utils/messageStore';

interface Props { onBack: () => void; }

const contactCards = [
  {
    icon: Mail,
    label: 'Email Us', labelAr: 'راسلنا',
    value: 'contact@phoenix.museum',
    sub: 'We reply within 24 hours', subAr: 'نرد خلال 24 ساعة',
    color: '#D4AF37', href: 'mailto:contact@phoenix.museum',
  },
  {
    icon: Phone,
    label: 'Call Us', labelAr: 'اتصل بنا',
    value: '+880 1234-567890',
    sub: 'Sun–Thu, 9am–6pm (BST)', subAr: 'أحد–خميس، ٩ص–٦م',
    color: '#4ade80', href: 'tel:+8801234567890',
  },
  {
    icon: MapPin,
    label: 'Visit Us', labelAr: 'زورنا',
    value: 'Saudi Arabia, Dubai-Sharjah',
    sub: 'Virtual HQ — worldwide', subAr: 'مقر افتراضي — عالمي',
    color: '#60a5fa', href: '#',
  },
  {
    icon: Clock,
    label: 'Working Hours', labelAr: 'ساعات العمل',
    value: '9:00 AM – 6:00 PM',
    sub: 'Sunday to Thursday', subAr: 'من الأحد إلى الخميس',
    color: '#f472b6', href: '#',
  },
];

const faqs = [
  {
    q: 'How do I submit a research paper?', qAr: 'كيف أقدم ورقة بحثية؟',
    a: 'Use the contact form and select "Research Collaboration" as the subject. Attach a brief abstract and our research team will be in touch within 3 business days.',
    aAr: 'استخدم نموذج الاتصال واختر "تعاون بحثي" كموضوع. أرفق ملخصًا موجزًا وسيتواصل معك فريق البحث خلال 3 أيام عمل.',
  },
  {
    q: 'Can I partner with the museum for events?', qAr: 'هل يمكنني الشراكة مع المتحف للفعاليات؟',
    a: 'Yes, we welcome institutional partnerships for conferences, workshops, and cultural events. Contact us via "Institutional Inquiry" for tailored arrangements.',
    aAr: 'نعم، نرحب بالشراكات المؤسسية للمؤتمرات وورش العمل والفعاليات الثقافية. تواصل معنا عبر "استفسار مؤسسي" للحصول على ترتيبات مخصصة.',
  },
  {
    q: 'How long does it take to get a response?', qAr: 'كم يستغرق الحصول على رد؟',
    a: 'General inquiries are answered within 24 hours. Research and partnership requests may take up to 3–5 business days.',
    aAr: 'يُجاب على الاستفسارات العامة خلال 24 ساعة. قد تستغرق طلبات البحث والشراكة ما يصل إلى 3-5 أيام عمل.',
  },
];

const subjects = [
  { id: 'general', label: 'General Inquiry', labelAr: 'استفسار عام' },
  { id: 'research', label: 'Research Collaboration', labelAr: 'تعاون بحثي' },
  { id: 'membership', label: 'Membership Support', labelAr: 'دعم العضوية' },
  { id: 'institutional', label: 'Institutional Inquiry', labelAr: 'استفسار مؤسسي' },
  { id: 'technical', label: 'Technical Support', labelAr: 'الدعم التقني' },
  { id: 'press', label: 'Press & Media', labelAr: 'الصحافة والإعلام' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 13px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(212,175,55,0.18)',
  borderRadius: 8, color: '#F8F4EA',
  fontFamily: 'Inter', fontSize: '0.84rem',
  outline: 'none', boxSizing: 'border-box',
};

export default function ContactPage({ onBack }: Props) {
  const { isAr } = useLanguage();
  const dir = isAr ? 'rtl' : 'ltr';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setFormState('sending');
    
    // Save to local storage
    await saveMessage({ name, email, subject, message });

    setTimeout(() => setFormState('sent'), 1500);
  };

  return (
    <motion.div className="fixed inset-0 overflow-y-auto"
      style={{ background: 'linear-gradient(160deg,#0D1117 0%,#062B24 45%,#0B1F1B 100%)', color: '#F8F4EA' }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>

      <IslamicGeometry opacity={0.06} patternId="contact-geo" />
      <ParticleField count={25} color="#D4AF37" />

      {/* NAV */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12, padding: 'calc(12px + env(safe-area-inset-top)) 20px 12px', background: 'rgba(6,43,36,0.95)', borderBottom: '1px solid rgba(212,175,55,0.15)', backdropFilter: 'blur(20px)', direction: dir }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, color: '#D4AF37', cursor: 'pointer', fontFamily: '"Playfair Display"', fontSize: '0.72rem' }}>
          <ArrowLeft size={13} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
          {isAr ? 'العودة' : 'Back'}
        </button>
        <div style={{ flex: 1, textAlign: isAr ? 'right' : 'left' }}>
          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1rem', color: '#D4AF37' }}>
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ Icon: Instagram, color: '#E1306C' }, { Icon: Linkedin, color: '#0A66C2' }, { Icon: Twitter, color: '#1DA1F2' }].map(({ Icon, color }, i) => (
            <a key={i} href="#" style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color, textDecoration: 'none' }}>
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '64px 20px 48px', direction: dir }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'inline-block', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, padding: '5px 18px', marginBottom: 20 }}>
          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#D4AF37', letterSpacing: '0.08em' }}>
            {isAr ? '— نحن هنا لمساعدتك —' : "— We're Here to Help —"}
          </span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: 'clamp(2rem,5vw,3.4rem)', color: '#F8F4EA', marginBottom: 14, lineHeight: 1.2 }}>
          {isAr ? 'تواصل مع فريقنا' : 'Get in Touch'}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.95rem', color: '#C7C3B9', maxWidth: 580, margin: '0 auto', lineHeight: 1.85 }}>
          {isAr ? 'هل لديك سؤال حول بحثك، أو عضويتك، أو شراكة محتملة؟ فريق متحف فينيكس يسعد بمساعدتك.' : 'Have a question about your research, membership, or a potential partnership? Our dedicated Phoenix Museum team is delighted to assist.'}
        </motion.p>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
          style={{ width: 80, height: 2, background: 'linear-gradient(90deg,transparent,#D4AF37,transparent)', margin: '28px auto 0', borderRadius: 2 }} />
      </div>

      <div style={{ padding: '0 20px 60px', maxWidth: 1100, margin: '0 auto', direction: dir }}>

        {/* CONTACT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginBottom: 52 }}>
          {contactCards.map((card, i) => (
            <motion.a key={card.label} href={card.href}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.25 }}
              whileHover={{ y: -4, boxShadow: `0 12px 36px ${card.color}22` }}
              style={{ display: 'block', textDecoration: 'none', background: `linear-gradient(145deg,${card.color}09,rgba(255,255,255,0.02))`, border: `1px solid ${card.color}28`, borderRadius: 14, padding: '22px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${card.color}12`, filter: 'blur(20px)' }} />
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${card.color}14`, border: `1px solid ${card.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <card.icon size={20} color={card.color} />
              </div>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: card.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{isAr ? card.labelAr : card.label}</div>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: 'rgba(199,195,185,0.5)' }}>{isAr ? card.subAr : card.sub}</div>
            </motion.a>
          ))}
        </div>

        {/* TWO COLUMN */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 28, alignItems: 'start' }}>

          {/* FORM */}
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 18, padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.6),transparent)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={16} color="#D4AF37" />
              </div>
              <div>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.1rem', color: '#F8F4EA' }}>{isAr ? 'أرسل رسالة' : 'Send a Message'}</div>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.66rem', color: 'rgba(199,195,185,0.5)' }}>{isAr ? 'نرد في غضون 24 ساعة' : 'We respond within 24 hours'}</div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {formState === 'sent' ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                    style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(74,222,128,0.1)', border: '2px solid rgba(74,222,128,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={30} color="#4ade80" />
                  </motion.div>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.3rem', color: '#4ade80', marginBottom: 10 }}>{isAr ? 'تم إرسال رسالتك!' : 'Message Sent!'}</div>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#C7C3B9', lineHeight: 1.7, marginBottom: 24 }}>{isAr ? 'شكرًا لتواصلك معنا. سيرد فريقنا خلال 24 ساعة.' : 'Thank you for reaching out. Our team will reply within 24 hours.'}</div>
                  <button onClick={() => { setFormState('idle'); setName(''); setEmail(''); setMessage(''); }}
                    style={{ padding: '10px 24px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: '#D4AF37', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', cursor: 'pointer' }}>
                    {isAr ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { label: isAr ? 'الاسم الكامل *' : 'Full Name *', val: name, set: setName, ph: isAr ? 'اسمك الكامل' : 'Your full name', type: 'text', ltr: false },
                      { label: isAr ? 'البريد الإلكتروني *' : 'Email Address *', val: email, set: setEmail, ph: 'you@example.com', type: 'email', ltr: true },
                    ].map(({ label, val, set, ph, type, ltr }) => (
                      <div key={label}>
                        <label style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: 'rgba(212,175,55,0.65)', display: 'block', marginBottom: 6, letterSpacing: '0.06em' }}>{label}</label>
                        <input type={type} value={val} onChange={e => set(e.target.value)} required placeholder={ph}
                          style={{ ...inputStyle, fontFamily: isAr && !ltr ? '"IBM Plex Sans Arabic"' : 'Inter', direction: ltr ? 'ltr' : dir }} />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: 'rgba(212,175,55,0.65)', display: 'block', marginBottom: 6, letterSpacing: '0.06em' }}>{isAr ? 'الموضوع' : 'Subject'}</label>
                    <div style={{ position: 'relative' }}>
                      <select value={subject} onChange={e => setSubject(e.target.value)}
                        style={{ ...inputStyle, padding: '11px 36px 11px 13px', appearance: 'none', cursor: 'pointer', direction: dir }}>
                        {subjects.map(s => <option key={s.id} value={s.id} style={{ background: '#0D1117' }}>{isAr ? s.labelAr : s.label}</option>)}
                      </select>
                      <ChevronDown size={14} color="#D4AF37" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: 'rgba(212,175,55,0.65)', display: 'block', marginBottom: 6, letterSpacing: '0.06em' }}>{isAr ? 'رسالتك *' : 'Your Message *'}</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} required
                      placeholder={isAr ? 'اكتب رسالتك هنا...' : 'Write your message here...'} rows={5}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', direction: dir }} />
                    <div style={{ textAlign: 'right', fontFamily: 'Inter', fontSize: '0.6rem', color: 'rgba(199,195,185,0.35)', marginTop: 4 }}>{message.length} / 1000</div>
                  </div>

                  <motion.button type="submit" disabled={formState === 'sending'}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ padding: 14, background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 10, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {formState === 'sending'
                      ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />{isAr ? 'جارٍ الإرسال...' : 'Sending...'}</>
                      : <><Send size={15} />{isAr ? 'إرسال الرسالة' : 'Send Message'}</>}
                  </motion.button>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.64rem', color: 'rgba(199,195,185,0.35)', textAlign: 'center' }}>
                    {isAr ? 'لن نشارك معلوماتك مع أي طرف ثالث.' : 'Your information is never shared with third parties.'}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT: Map + Hours + Social */}
          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Map */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 18, overflow: 'hidden', position: 'relative', height: 220 }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(212,175,55,0.07) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,rgba(6,43,36,0.4),rgba(13,17,23,0.6))' }} />
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}>
                {[...Array(5)].map((_,i) => <line key={'h'+i} x1="0" y1={`${(i+1)*44}px`} x2="100%" y2={`${(i+1)*44}px`} stroke="#D4AF37" strokeWidth="0.5" />)}
                {[...Array(8)].map((_,i) => <line key={'v'+i} x1={`${(i+1)*44}px`} y1="0" x2={`${(i+1)*44}px`} y2="100%" stroke="#D4AF37" strokeWidth="0.5" />)}
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <motion.div animate={{ scale: [1,2,1], opacity: [0.4,0,0.4] }} transition={{ duration: 2.5, repeat: Infinity }}
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(212,175,55,0.28)' }} />
                <div style={{ position: 'relative', width: 14, height: 14, borderRadius: '50%', background: '#D4AF37', border: '3px solid rgba(212,175,55,0.4)', boxShadow: '0 0 18px rgba(212,175,55,0.55)' }} />
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(6,43,36,0.88)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 20, padding: '5px 14px', backdropFilter: 'blur(8px)' }}>
                  <MapPin size={11} color="#D4AF37" />
                  <span style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#D4AF37' }}>Saudi Arabia • Dubai • Sharjah</span>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 14, padding: '20px', direction: dir }}>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.92rem', color: '#F8F4EA', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={14} color="#D4AF37" />{isAr ? 'ساعات العمل' : 'Office Hours'}
              </div>
              {[
                { day: isAr ? 'الأحد – الثلاثاء' : 'Sun – Tue', time: '9:00 AM – 6:00 PM', on: true },
                { day: isAr ? 'الأربعاء – الخميس' : 'Wed – Thu', time: '9:00 AM – 5:00 PM', on: true },
                { day: isAr ? 'الجمعة' : 'Friday', time: isAr ? 'مغلق' : 'Closed', on: false },
                { day: isAr ? 'السبت' : 'Saturday', time: isAr ? 'مغلق' : 'Closed', on: false },
              ].map((r,i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#C7C3B9' }}>{r.day}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: r.on ? '#D4AF37' : 'rgba(199,195,185,0.3)', fontWeight: r.on ? 600 : 400 }}>{r.time}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 14, padding: '20px', direction: dir }}>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.92rem', color: '#F8F4EA', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={14} color="#D4AF37" />{isAr ? 'تابعنا على' : 'Follow Us'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { Icon: Instagram, label: '@phoenix_museum', color: '#E1306C', bg: 'rgba(225,48,108,0.08)', bd: 'rgba(225,48,108,0.22)' },
                  { Icon: Linkedin, label: 'Phoenix Museum', color: '#0A66C2', bg: 'rgba(10,102,194,0.08)', bd: 'rgba(10,102,194,0.22)' },
                  { Icon: Twitter, label: '@phoenix_museum', color: '#1DA1F2', bg: 'rgba(29,161,242,0.08)', bd: 'rgba(29,161,242,0.22)' },
                ].map(({ Icon, label, color, bg, bd }) => (
                  <a key={label} href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: bg, border: `1px solid ${bd}`, borderRadius: 8, textDecoration: 'none' }}>
                    <Icon size={16} color={color} />
                    <span style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#C7C3B9' }}>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 60, maxWidth: 760, margin: '60px auto 0', direction: dir }}>
          <h2 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.5rem', color: '#F8F4EA', textAlign: 'center', marginBottom: 8 }}>
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: 'rgba(199,195,185,0.5)', textAlign: 'center', marginBottom: 26 }}>
            {isAr ? 'إجابات سريعة على الأسئلة الأكثر شيوعًا' : 'Quick answers to the most common questions'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: isAr ? 'right' : 'left' }}>
                  <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.88rem', color: '#F8F4EA' }}>{isAr ? faq.qAr : faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                    style={{ color: '#D4AF37', fontSize: '1.4rem', flexShrink: 0, marginLeft: 12, lineHeight: 1 }}>+</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '14px 20px 18px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#C7C3B9', lineHeight: 1.82, borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                        {isAr ? faq.aAr : faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div style={{ textAlign: 'center', padding: '64px 20px 40px', direction: dir }}>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.4rem', color: '#F8F4EA', marginBottom: 10 }}>
            {isAr ? 'لم تجد إجابتك؟' : "Didn't find your answer?"}
          </div>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.84rem', color: '#C7C3B9', marginBottom: 22 }}>
            {isAr ? 'راسلنا مباشرة وسنرد في أقرب وقت ممكن.' : "Email us directly and we'll respond as soon as possible."}
          </div>
          <a href="mailto:contact@phoenix.museum"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', borderRadius: 10, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none' }}>
            <Mail size={15} />contact@phoenix.museum
          </a>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </motion.div>
  );
}
