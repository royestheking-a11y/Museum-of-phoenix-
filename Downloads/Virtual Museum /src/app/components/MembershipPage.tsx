import { useState, useEffect, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Star, Zap, Crown, X, CreditCard, Lock, AlertCircle, CheckCircle2, Clock, ChevronRight, Building2, Wallet } from 'lucide-react';
import IslamicGeometry from './IslamicGeometry';
import ParticleField from './ParticleField';
import { useLanguage } from '../context/LanguageContext';
import { savePayment, generateId, maskCard, detectCardType, type PaymentType } from '../utils/paymentStore';

const plans = [
  {
    id: 'visitor', name: 'Visitor', arabic: 'زائر', price: 0, period: 'Forever free', periodAr: 'مجاني للأبد',
    color: '#C7C3B9', icon: Star,
    description: 'Explore the museum freely with access to all public halls and basic content.',
    descriptionAr: 'استكشف المتحف بحرية مع إمكانية الوصول إلى جميع القاعات العامة والمحتوى الأساسي.',
    features: [
      { text: 'All 7 museum halls', textAr: 'جميع قاعات المتحف السبع', included: true },
      { text: 'Public symbol collection', textAr: 'مجموعة الرموز العامة', included: true },
      { text: 'Basic articles', textAr: 'المقالات الأساسية', included: true },
      { text: 'Symbol search', textAr: 'البحث عن الرموز', included: true },
      { text: 'Guided tour', textAr: 'الجولة الإرشادية', included: true },
      { text: 'Manuscript archive', textAr: 'أرشيف المخطوطات', included: false },
      { text: 'AI Symbol Analyzer', textAr: 'محلل الرموز بالذكاء الاصطناعي', included: false },
      { text: 'Course enrollment', textAr: 'التسجيل في الدورات', included: false },
      { text: 'Research downloads', textAr: 'تنزيلات البحوث', included: false },
      { text: 'Certificate programs', textAr: 'برامج الشهادات', included: false },
    ],
    cta: 'Start Free',
    ctaAr: 'ابدأ مجانًا',
    featured: false,
  },
  {
    id: 'researcher', name: 'Researcher', arabic: 'باحث', price: 10, period: 'per month', periodAr: 'شهرياً',
    color: '#D4AF37', icon: Zap,
    description: 'For scholars and students who need full access to archives, manuscripts, and research tools.',
    descriptionAr: 'للعلماء والطلاب الذين يحتاجون إلى وصول كامل إلى الأرشيف والمخطوطات وأدوات البحث.',
    features: [
      { text: 'Everything in Visitor', textAr: 'كل شيء في خطة الزائر', included: true },
      { text: 'Full manuscript archive', textAr: 'أرشيف المخطوطات الكامل', included: true },
      { text: 'Research library (240+ papers)', textAr: 'مكتبة البحوث (+٢٤٠ ورقة)', included: true },
      { text: 'Advanced symbol search', textAr: 'بحث متقدم عن الرموز', included: true },
      { text: 'AI Symbol Analyzer', textAr: 'محلل الرموز بالذكاء الاصطناعي', included: true },
      { text: 'PDF downloads', textAr: 'تنزيلات PDF', included: true },
      { text: '5 courses included', textAr: '٥ دورات متضمنة', included: true },
      { text: 'Private lectures', textAr: 'محاضرات خاصة', included: false },
      { text: 'Certificate programs', textAr: 'برامج الشهادات', included: false },
      { text: 'Expert consultation', textAr: 'استشارة الخبراء', included: false },
    ],
    cta: 'Start 7-Day Free Trial',
    ctaAr: 'ابدأ نسخة تجريبية مجانية ٧ أيام',
    featured: true,
  },
  {
    id: 'scholar', name: 'Scholar', arabic: 'عالم', price: 25, period: 'per month', periodAr: 'شهرياً',
    color: '#F0D98A', icon: Crown,
    description: 'The complete academic experience with certifications, private lectures, and expert access.',
    descriptionAr: 'التجربة الأكاديمية الكاملة مع الشهادات والمحاضرات الخاصة ووصول الخبراء.',
    features: [
      { text: 'Everything in Researcher', textAr: 'كل شيء في خطة الباحث', included: true },
      { text: 'All courses unlimited', textAr: 'جميع الدورات غير محدودة', included: true },
      { text: 'Certificate programs', textAr: 'برامج الشهادات', included: true },
      { text: 'Private lectures archive', textAr: 'أرشيف المحاضرات الخاصة', included: true },
      { text: 'Expert consultations (2/mo)', textAr: 'استشارات الخبراء (٢/شهر)', included: true },
      { text: 'AI Research Assistant', textAr: 'مساعد باحث بالذكاء الاصطناعي', included: true },
      { text: 'Priority support', textAr: 'دعم ذو أولوية', included: true },
      { text: 'Institutional license', textAr: 'رخصة مؤسسية', included: false },
      { text: 'Custom research reports', textAr: 'تقارير بحثية مخصصة', included: false },
      { text: 'Dedicated curator', textAr: 'أمين مخصص', included: false },
    ],
    cta: 'Become a Scholar',
    ctaAr: 'كن عالماً',
    featured: false,
  },
  {
    id: 'institution', name: 'Institution', arabic: 'مؤسسة', price: 100, period: 'per month', periodAr: 'شهرياً',
    color: '#8a4a4a', icon: Crown,
    description: 'For universities, research centers, and cultural institutions needing multi-user access.',
    descriptionAr: 'للجامعات ومراكز البحوث والمؤسسات الثقافية التي تحتاج إلى وصول متعدد المستخدمين.',
    features: [
      { text: 'Everything in Scholar', textAr: 'كل شيء في خطة العالم', included: true },
      { text: 'Up to 50 user seats', textAr: 'حتى ٥٠ مستخدم', included: true },
      { text: 'Custom research reports', textAr: 'تقارير بحثية مخصصة', included: true },
      { text: 'Dedicated curator', textAr: 'أمين مخصص', included: true },
      { text: 'API access', textAr: 'وصول API', included: true },
      { text: 'White-label option', textAr: 'خيار التسمية البيضاء', included: true },
      { text: 'Analytics dashboard', textAr: 'لوحة تحكم التحليلات', included: true },
      { text: 'Custom dataset exports', textAr: 'تصدير بيانات مخصصة', included: true },
      { text: 'On-site training session', textAr: 'جلسة تدريب في الموقع', included: true },
      { text: 'SLA guarantee', textAr: 'ضمان اتفاقية مستوى الخدمة', included: true },
    ],
    cta: 'Contact Us',
    ctaAr: 'اتصل بنا',
    featured: false,
  },
];

const faqs = [
  { q: 'Can I cancel anytime?', qAr: 'هل يمكنني الإلغاء في أي وقت؟', a: 'Yes. Cancel your subscription anytime with no fees or penalties. You keep access until the end of your billing period.', aAr: 'نعم. قم بإلغاء اشتراكك في أي وقت دون أي رسوم أو غرامات. تحتفظ بإمكانية الوصول حتى نهاية فترة الفاتورة الخاصة بك.' },
  { q: 'Is there a free trial?', qAr: 'هل توجد نسخة تجريبية مجانية؟', a: 'The Researcher plan includes a 7-day free trial. No credit card required to start. We\'ll remind you before your trial ends.', aAr: 'تتضمن خطة الباحث نسخة تجريبية مجانية لمدة ٧ أيام. لا يلزم وجود بطاقة ائتمان للبدء. سنقوم بتذكيرك قبل انتهاء نسختك التجريبية.' },
  { q: 'Do certificates expire?', qAr: 'هل تنتهي صلاحية الشهادات؟', a: 'Phoenix Museum certificates are permanent digital credentials with QR verification. They never expire and can be shared on LinkedIn and academic CVs.', aAr: 'شهادات متحف الفينيق هي أوراق اعتماد رقمية دائمة مع تحقق QR. لا تنتهي صلاحيتها أبدًا ويمكن مشاركتها على LinkedIn والسير الذاتية الأكاديمية.' },
  { q: 'What payment methods do you accept?', qAr: 'ما هي طرق الدفع التي تقبلونها؟', a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfer for institutional plans.', aAr: 'نحن نقبل جميع بطاقات الائتمان الرئيسية (Visa ، Mastercard ، Amex) و PayPal والتحويل المصرفي لخطط المؤسسات.' },
  { q: 'Is there a student discount?', qAr: 'هل يوجد خصم للطلاب؟', a: 'Yes — students with a valid .edu email receive 40% off all plans. Apply during checkout.', aAr: 'نعم — يحصل الطلاب الذين لديهم بريد إلكتروني صالح .edu على خصم ٤٠٪ على جميع الخطط. قم بالتطبيق أثناء الدفع.' },
  { q: 'Can I upgrade or downgrade?', qAr: 'هل يمكنني الترقية أو التخفيض؟', a: 'Absolutely. Upgrade immediately with prorated billing. Downgrade takes effect at your next billing cycle.', aAr: 'بالتأكيد. قم بالترقية فورًا بفواتير تناسبية. يسري التخفيض في دورة الفاتورة التالية.' },
];

interface Props { userLevel: string; onBack: () => void; onLogin: () => void; onRegister: () => void; }

export default function MembershipPage({ userLevel, onBack, onLogin, onRegister }: Props) {
  const { isAr } = useLanguage();
  const [selected, setSelected] = useState<typeof plans[0] | null>(null);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const price = (plan: typeof plans[0]) =>
    billing === 'annual' && plan.price > 0 ? Math.round(plan.price * 0.75) : plan.price;

  // ── Checkout state ──
  const [checkoutStep, setCheckoutStep] = useState<1|2|3>(1);
  const [paymentType, setPaymentType] = useState<PaymentType>('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetCheckout = () => {
    setCheckoutStep(1);
    setCardNumber(''); setCardHolder(''); setExpiry(''); setCvv(''); setEmail('');
    setFormError(''); setIsSubmitting(false); setPaymentType('visa');
  };

  const handleClose = () => { setSelected(null); resetCheckout(); };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0,2)}/${digits.slice(2)}`;
    return digits;
  };

  const autoDetectedType = detectCardType(cardNumber);

  const validateAndProceed = () => {
    setFormError('');
    if (paymentType === 'bank_transfer' || paymentType === 'paypal') {
      if (!email.trim()) { setFormError(isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email'); return; }
      if (!cardHolder.trim()) { setFormError(isAr ? 'يرجى إدخال الاسم' : 'Please enter your name'); return; }
    } else {
      if (!cardHolder.trim()) { setFormError(isAr ? 'يرجى إدخال اسم حامل البطاقة' : 'Please enter cardholder name'); return; }
      if (cardNumber.replace(/\s/g,'').length < 13) { setFormError(isAr ? 'رقم البطاقة غير صحيح' : 'Invalid card number'); return; }
      if (expiry.length < 5) { setFormError(isAr ? 'تاريخ انتهاء الصلاحية غير صحيح' : 'Invalid expiry date'); return; }
      if (cvv.length < 3) { setFormError(isAr ? 'رمز CVV غير صحيح' : 'Invalid CVV'); return; }
      if (!email.trim()) { setFormError(isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email'); return; }
    }
    setCheckoutStep(3);
    setIsSubmitting(true);
    setTimeout(() => {
      if (!selected) return;
      const raw = cardNumber.replace(/\s/g,'');
      savePayment({
        id: generateId(),
        submittedAt: new Date().toISOString(),
        status: 'pending',
        plan: selected.name,
        planAr: selected.arabic,
        price: price(selected),
        billing,
        cardholderName: cardHolder,
        cardNumberMasked: paymentType === 'bank_transfer' || paymentType === 'paypal' ? '—' : maskCard(raw),
        cardNumberLast4: raw.slice(-4) || '—',
        expiry: expiry || '—',
        cvv: cvv || '—',
        paymentType: (paymentType === 'bank_transfer' || paymentType === 'paypal') ? paymentType : autoDetectedType,
        email,
      });
      setIsSubmitting(false);
    }, 1800);
  };

  return (
    <motion.div className="fixed inset-0 overflow-y-auto"
      style={{ background: 'linear-gradient(160deg, #0D1117 0%, #062B24 50%, #0B1F1B 100%)', color: '#F8F4EA' }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <IslamicGeometry opacity={0.08} patternId="mem-geo" />
      <ParticleField count={30} color="#D4AF37" />

      {/* Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12, paddingTop: 'calc(12px + env(safe-area-inset-top))', paddingBottom: '12px', paddingLeft: '20px', paddingRight: '20px', background: 'rgba(6,43,36,0.95)', borderBottom: '1px solid rgba(212,175,55,0.15)', backdropFilter: 'blur(20px)', direction: isAr ? 'rtl' : 'ltr' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 4, color: '#D4AF37', cursor: 'pointer', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.72rem' }}>
          <ArrowLeft size={13} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} /> {isAr ? 'العودة' : 'Back'}
        </button>
        <div style={{ flex: 1, textAlign: isAr ? 'right' : 'left' }}>
          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1rem', color: '#D4AF37' }}>{isAr ? 'العضوية' : 'Membership'}</span>
        </div>
        <button onClick={onLogin} style={{ padding: '7px 18px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 4, color: '#D4AF37', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', cursor: 'pointer' }}>
          {isAr ? 'عضو بالفعل؟ تسجيل الدخول' : 'Already a member? Log in'}
        </button>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px', position: 'relative', direction: isAr ? 'rtl' : 'ltr' }}>
        <motion.div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, padding: '5px 16px', marginBottom: 20 }}
          animate={{ boxShadow: ['0 0 0 rgba(212,175,55,0)', '0 0 20px rgba(212,175,55,0.3)', '0 0 0 rgba(212,175,55,0)'] }}
          transition={{ duration: 3, repeat: Infinity }}>
          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#D4AF37', letterSpacing: '0.05em' }}>{isAr ? 'اكتشف المتحف بالكامل' : 'Unlock the Full Museum'}</span>
        </motion.div>
        <h1 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: 'clamp(1.8rem,5vw,3rem)', color: '#F8F4EA', marginBottom: 12 }}>
          {isAr ? 'اختر مستوى عضويتك' : 'Choose Your Membership Tier'}
        </h1>
        <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.95rem', color: '#C7C3B9', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.8 }}>
          {isAr ? 'من الاستكشاف المجاني إلى الوصول الأكاديمي الكامل - ابحث عن العضوية التي تناسب رحلتك البحثية.' : 'From free exploration to complete academic access — find the membership that fits your research journey.'}
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 50, padding: 4, gap: 4 }}>
          {(['monthly', 'annual'] as const).map(b => (
            <button key={b} onClick={() => setBilling(b)}
              style={{ padding: '7px 20px', background: billing === b ? 'linear-gradient(135deg,#D4AF37,#8B6914)' : 'none', border: 'none', borderRadius: 40, color: billing === b ? '#0D1117' : '#C7C3B9', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', fontWeight: billing === b ? 700 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>
              {isAr ? (b === 'monthly' ? 'شهري' : 'سنوي — وفر ٢٥٪') : (b === 'monthly' ? 'Monthly' : 'Annually — Save 25%')}
            </button>
          ))}
        </div>
      </div>

      {/* Plans grid */}
      <div style={{ padding: '0 20px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, alignItems: 'start' }}>
          {plans.map(plan => {
            const { icon: PlanIcon } = { icon: plan.icon };
            const isPopular = plan.featured;
            return (
              <motion.div key={plan.id} whileHover={{ y: isPopular ? 0 : -4 }}
                style={{
                  background: isPopular ? 'linear-gradient(145deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isPopular ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.12)'}`,
                  borderRadius: 14, padding: '28px 22px', position: 'relative',
                  boxShadow: isPopular ? '0 0 40px rgba(212,175,55,0.1)' : 'none',
                  marginTop: isPopular ? 0 : 16,
                }}>
                {isPopular && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', padding: '4px 18px', borderRadius: 20, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#0D1117', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4, direction: isAr ? 'rtl' : 'ltr' }}>
                    <Star size={10} fill="#0D1117" /> {isAr ? 'الأكثر شهرة' : 'Most Popular'}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, direction: isAr ? 'rtl' : 'ltr', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: `${plan.color}18`, border: `1px solid ${plan.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlanIcon size={18} color={plan.color} />
                  </div>
                  <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.1rem', color: plan.color }}>{isAr ? plan.arabic : plan.name}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 16, direction: isAr ? 'rtl' : 'ltr' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexDirection: isAr ? 'row-reverse' : 'row', justifyContent: isAr ? 'flex-end' : 'flex-start' }}>
                    {plan.price === 0 ? (
                      <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '2.2rem', color: '#F8F4EA' }}>{isAr ? 'مجاني' : 'Free'}</span>
                    ) : (
                      <>
                        <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '2.2rem', color: '#F8F4EA' }}>${price(plan)}</span>
                        <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#C7C3B9' }}>/{isAr ? (billing === 'annual' ? 'شهرياً، يدفع سنوياً' : 'شهر') : (billing === 'annual' ? 'mo, billed annually' : 'mo')}</span>
                      </>
                    )}
                  </div>
                  {billing === 'annual' && plan.price > 0 && (
                    <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.7rem', color: '#4ade80', marginTop: 2 }}>
                      وفر ${(plan.price - price(plan)) * 12}/سنوياً
                    </div>
                  )}
                </div>

                <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#C7C3B9', lineHeight: 1.6, marginBottom: 20, direction: isAr ? 'rtl' : 'ltr' }}>{isAr ? plan.descriptionAr : plan.description}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22, direction: isAr ? 'rtl' : 'ltr' }}>
                  {plan.features.map(f => (
                    <div key={f.text} style={{ display: 'flex', gap: 8, alignItems: 'center', flexDirection: isAr ? 'row-reverse' : 'row', justifyContent: isAr ? 'flex-end' : 'flex-start' }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: f.included ? `${plan.color}22` : 'rgba(255,255,255,0.05)', border: `1px solid ${f.included ? plan.color : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {f.included ? <Check size={9} color={plan.color} /> : <X size={9} color="rgba(199,195,185,0.3)" />}
                      </div>
                      <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: f.included ? '#F8F4EA' : 'rgba(199,195,185,0.35)' }}>{isAr ? f.textAr : f.text}</span>
                    </div>
                  ))}
                </div>

                <motion.button onClick={() => {
                  onRegister();
                }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', padding: '11px', background: isPopular ? 'linear-gradient(135deg,#D4AF37,#8B6914)' : `${plan.color}18`, border: isPopular ? 'none' : `1px solid ${plan.color}44`, borderRadius: 8, color: isPopular ? '#0D1117' : plan.color, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  {isAr ? plan.ctaAr : plan.cta}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Features comparison table */}
        <div style={{ marginTop: 60 }}>
          <h2 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.6rem', color: '#F8F4EA', textAlign: 'center', marginBottom: 8 }}>{isAr ? 'مقارنة جميع المميزات' : 'Compare All Features'}</h2>
          <div style={{ overflowX: 'auto', direction: isAr ? 'rtl' : 'ltr' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                  <th style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.88rem', color: '#C7C3B9', textAlign: isAr ? 'right' : 'left', padding: '10px 16px', fontWeight: 500 }}>{isAr ? 'الميزة' : 'Feature'}</th>
                  {plans.map(p => (
                    <th key={p.id} style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.88rem', color: p.color, textAlign: 'center', padding: '10px 16px' }}>{isAr ? p.arabic : p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(isAr ? [
                  ['جميع القاعات الـ ٧', true, true, true, true],
                  ['مجموعة الرموز', true, true, true, true],
                  ['المقالات الأساسية', true, true, true, true],
                  ['أرشيف المخطوطات', false, true, true, true],
                  ['محلل الرموز بالذكاء الاصطناعي', false, true, true, true],
                  ['مكتبة الأبحاث', false, true, true, true],
                  ['الدورات', false, '٥ متضمنة', 'غير محدود', 'غير محدود'],
                  ['برامج الشهادات', false, false, true, true],
                  ['استشارة الخبراء', false, false, '٢/شهر', 'غير محدود'],
                  ['الوصول إلى API', false, false, false, true],
                  ['عدد المستخدمين', '١', '١', '١', 'حتى ٥٠'],
                ] : [
                  ['All 7 Halls', true, true, true, true],
                  ['Symbol Collection', true, true, true, true],
                  ['Basic Articles', true, true, true, true],
                  ['Manuscript Archive', false, true, true, true],
                  ['AI Symbol Analyzer', false, true, true, true],
                  ['Research Library', false, true, true, true],
                  ['Courses', false, '5 included', 'Unlimited', 'Unlimited'],
                  ['Certificate Programs', false, false, true, true],
                  ['Expert Consultation', false, false, '2/mo', 'Unlimited'],
                  ['API Access', false, false, false, true],
                  ['User Seats', '1', '1', '1', 'Up to 50'],
                ]).map(([feature, ...vals], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'none' }}>
                    <td style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#C7C3B9', padding: '10px 16px', textAlign: isAr ? 'right' : 'left' }}>{feature}</td>
                    {vals.map((v, j) => (
                      <td key={j} style={{ textAlign: 'center', padding: '10px 16px' }}>
                        {typeof v === 'boolean' ? (
                          v ? <Check size={15} color="#4ade80" style={{ margin: '0 auto' }} /> : <X size={15} color="rgba(199,195,185,0.3)" style={{ margin: '0 auto' }} />
                        ) : (
                          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#D4AF37' }}>{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 60, maxWidth: 700, margin: '60px auto 0', direction: isAr ? 'rtl' : 'ltr' }}>
          <h2 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.5rem', color: '#F8F4EA', textAlign: 'center', marginBottom: 28 }}>{isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, i) => (
              <motion.div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: isAr ? 'right' : 'left' }}>
                  <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.92rem', color: '#F8F4EA' }}>{isAr ? faq.qAr : faq.q}</span>
                  <span style={{ color: '#D4AF37', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none', fontSize: '1.2rem' }}>+</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 18px 16px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.83rem', color: '#C7C3B9', lineHeight: 1.75, borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                        {isAr ? faq.aAr : faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROFESSIONAL CHECKOUT MODAL ── */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.88)', zIndex: 200, backdropFilter: 'blur(18px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={checkoutStep < 3 ? handleClose : undefined}>
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'linear-gradient(145deg, #09201A, #0D1117)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: 18,
                padding: '0',
                maxWidth: 500,
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.08)',
              }}>

              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))', borderBottom: '1px solid rgba(212,175,55,0.15)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: '"Playfair Display"', fontSize: '1.1rem', color: '#D4AF37' }}>
                    {checkoutStep === 3 && !isSubmitting ? (isAr ? 'تم إرسال الطلب' : 'Order Submitted') :
                     checkoutStep === 3 && isSubmitting ? (isAr ? 'جارٍ المعالجة...' : 'Processing...') :
                     checkoutStep === 2 ? (isAr ? 'تفاصيل الدفع' : 'Payment Details') :
                     (isAr ? 'ملخص الطلب' : 'Order Summary')}
                  </div>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: 'rgba(199,195,185,0.5)', marginTop: 2 }}>
                    {isAr ? `خطة ${selected.arabic}` : `${selected.name} Plan`}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Step dots */}
                  <div style={{ display: 'flex', gap: 5 }}>
                    {[1,2,3].map(s => (
                      <div key={s} style={{ width: s === checkoutStep ? 20 : 7, height: 7, borderRadius: 4, background: s <= checkoutStep ? '#D4AF37' : 'rgba(212,175,55,0.2)', transition: 'all 0.3s' }} />
                    ))}
                  </div>
                  {checkoutStep < 3 && (
                    <button onClick={handleClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C7C3B9', cursor: 'pointer' }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ padding: '24px' }}>

                {/* ── STEP 1: Plan Summary ── */}
                {checkoutStep === 1 && (
                  <div>
                    {/* Plan card */}
                    <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: '18px', marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.2rem', color: selected.color }}>{isAr ? selected.arabic : selected.name}</div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9', marginTop: 2 }}>{billing === 'annual' ? (isAr ? 'يُدفع سنوياً' : 'Billed Annually') : (isAr ? 'يُدفع شهرياً' : 'Billed Monthly')}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: '"Playfair Display"', fontSize: '2rem', color: '#F8F4EA' }}>${price(selected)}</div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9' }}>/{isAr ? 'شهر' : 'month'}</div>
                        </div>
                      </div>
                      {billing === 'annual' && selected.price > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 6, padding: '6px 10px' }}>
                          <Check size={12} color="#4ade80" />
                          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: '#4ade80' }}>
                            {isAr ? `توفر $${(selected.price - price(selected)) * 12} سنوياً` : `You save $${(selected.price - price(selected)) * 12}/year`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Included features preview */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: 'rgba(212,175,55,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                        {isAr ? 'يشمل' : 'Includes'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {selected.features.filter(f => f.included).slice(0,4).map(f => (
                          <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${selected.color}22`, border: `1px solid ${selected.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Check size={9} color={selected.color} />
                            </div>
                            <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{isAr ? f.textAr : f.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setCheckoutStep(2)}
                      style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 10, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      {isAr ? 'المتابعة إلى الدفع' : 'Continue to Payment'} <ChevronRight size={16} />
                    </motion.button>
                  </div>
                )}

                {/* ── STEP 2: Payment Details ── */}
                {checkoutStep === 2 && (
                  <div>
                    {/* Payment type selector */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: 'rgba(212,175,55,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                        {isAr ? 'طريقة الدفع' : 'Payment Method'}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                        {(['visa','mastercard','amex','paypal','bank_transfer'] as const).map(pt => {
                          const active = paymentType === pt;
                          // Always use brand colors — inactive is just slightly dimmed
                          const logoMap: Record<string, ReactElement> = {
                            visa: (
                              <svg viewBox="0 0 52 18" width="40" height="14" xmlns="http://www.w3.org/2000/svg">
                                <text x="1" y="15" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="17" fill="#1A1F71" letterSpacing="-0.5">VISA</text>
                              </svg>
                            ),
                            mastercard: (
                              <svg viewBox="0 0 38 24" width="36" height="24" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="14" cy="12" r="10" fill="#EB001B" />
                                <circle cx="24" cy="12" r="10" fill="#F79E1B" opacity="0.9" />
                                <path d="M19 5.8a10 10 0 0 1 0 12.4A10 10 0 0 1 19 5.8z" fill="#FF5F00" />
                              </svg>
                            ),
                            amex: (
                              <svg viewBox="0 0 48 24" width="42" height="22" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0" y="0" width="48" height="24" rx="4" fill="#007BC1" />
                                <text x="4" y="17" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="11" fill="white" letterSpacing="0.5">AMEX</text>
                              </svg>
                            ),
                            paypal: (
                              <svg viewBox="0 0 76 22" width="50" height="17" xmlns="http://www.w3.org/2000/svg">
                                <text x="0" y="17" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="17" fill="#003087">Pay</text>
                                <text x="30" y="17" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="17" fill="#009CDE">Pal</text>
                              </svg>
                            ),
                            bank_transfer: (
                              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M8 10v11M12 10v11M16 10v11M20 10v11" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ),
                          };
                          const labelMap: Record<string, string> = { visa: 'Visa', mastercard: 'MC', amex: 'Amex', paypal: 'PayPal', bank_transfer: isAr ? 'بنك' : 'Bank' };
                          return (
                            <button key={pt} onClick={() => setPaymentType(pt)}
                              style={{
                                padding: '10px 6px',
                                background: active ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${active ? 'rgba(212,175,55,0.75)' : 'rgba(255,255,255,0.08)'}`,
                                borderRadius: 10,
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 5,
                                transition: 'all 0.2s',
                                minHeight: 62,
                                opacity: active ? 1 : 0.55,
                                boxShadow: active ? '0 0 14px rgba(212,175,55,0.18)' : 'none',
                              }}>
                              {logoMap[pt]}
                              <span style={{ fontFamily: 'Inter', fontSize: '0.56rem', color: active ? '#D4AF37' : '#C7C3B9', fontWeight: active ? 700 : 400, letterSpacing: '0.03em' }}>{labelMap[pt]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                      {/* Name */}
                      <div>
                        <label style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: 'rgba(212,175,55,0.6)', display: 'block', marginBottom: 6 }}>
                          {isAr ? 'الاسم الكامل' : 'Full Name'}
                        </label>
                        <input value={cardHolder} onChange={e => setCardHolder(e.target.value)}
                          placeholder={isAr ? 'الاسم كما يظهر على البطاقة' : 'Name as on card'}
                          style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, color: '#F8F4EA', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>

                      {/* Email */}
                      <div>
                        <label style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: 'rgba(212,175,55,0.6)', display: 'block', marginBottom: 6 }}>
                          {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                        </label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, color: '#F8F4EA', fontFamily: 'Inter', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box', direction: 'ltr' }} />
                      </div>

                      {/* Card-specific fields */}
                      {paymentType !== 'bank_transfer' && paymentType !== 'paypal' && (
                        <>
                          <div style={{ position: 'relative' }}>
                            <label style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: 'rgba(212,175,55,0.6)', display: 'block', marginBottom: 6 }}>
                              {isAr ? 'رقم البطاقة' : 'Card Number'}
                            </label>
                            <div style={{ position: 'relative' }}>
                              <input value={cardNumber}
                                onChange={e => { setCardNumber(formatCardNumber(e.target.value)); }}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                style={{ width: '100%', padding: '11px 46px 11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, color: '#F8F4EA', fontFamily: 'Inter', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box', letterSpacing: '0.05em', direction: 'ltr' }} />
                              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                                {autoDetectedType === 'visa' ? (
                                  <svg viewBox="0 0 48 16" width="32" height="11" xmlns="http://www.w3.org/2000/svg"><text x="0" y="14" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="16" fill="#1A1F71" letterSpacing="-0.5">VISA</text></svg>
                                ) : autoDetectedType === 'mastercard' ? (
                                  <svg viewBox="0 0 38 24" width="28" height="18" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="14" cy="12" r="10" fill="#EB001B" />
                                    <circle cx="24" cy="12" r="10" fill="#F79E1B" opacity="0.9" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 48 24" width="34" height="18" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="48" height="24" rx="4" fill="#007BC1" /><text x="4" y="17" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="11" fill="white" letterSpacing="0.5">AMEX</text></svg>
                                )}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                              <label style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: 'rgba(212,175,55,0.6)', display: 'block', marginBottom: 6 }}>
                                {isAr ? 'تاريخ الانتهاء' : 'Expiry (MM/YY)'}
                              </label>
                              <input value={expiry}
                                onChange={e => setExpiry(formatExpiry(e.target.value))}
                                placeholder="MM/YY" maxLength={5}
                                style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, color: '#F8F4EA', fontFamily: 'Inter', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box', direction: 'ltr' }} />
                            </div>
                            <div>
                              <label style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: 'rgba(212,175,55,0.6)', display: 'block', marginBottom: 6 }}>
                                CVV
                              </label>
                              <input value={cvv}
                                onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,4))}
                                placeholder="123" maxLength={4} type="password"
                                style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, color: '#F8F4EA', fontFamily: 'Inter', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box', direction: 'ltr' }} />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Bank/PayPal info */}
                      {(paymentType === 'bank_transfer' || paymentType === 'paypal') && (
                        <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, padding: '14px' }}>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#C7C3B9', lineHeight: 1.7 }}>
                            {paymentType === 'bank_transfer' ? (
                              isAr ? 'أرسل بيانات التحويل البنكي عبر البريد الإلكتروني وسيتحقق الفريق خلال 24 ساعة.' :
                              'Send bank transfer details via email. Our team will verify within 24 hours.'
                            ) : (
                              isAr ? 'سيتم توجيهك إلى بوابة PayPal لإكمال الدفع بعد مراجعة الطلب.' :
                              'You will be redirected to PayPal after your order is reviewed.'
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Error */}
                    {formError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 7, padding: '9px 12px', marginBottom: 14 }}>
                        <AlertCircle size={13} color="#ff6b6b" />
                        <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#ff6b6b' }}>{formError}</span>
                      </div>
                    )}

                    {/* Security badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                      <Lock size={11} color="#4ade80" />
                      <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.66rem', color: '#4ade80' }}>
                        {isAr ? 'مشفر بـ SSL 256-بت • دفعك آمن تماماً' : '256-bit SSL Encrypted • Your payment is 100% secure'}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => setCheckoutStep(1)}
                        style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#C7C3B9', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', cursor: 'pointer' }}>
                        {isAr ? 'رجوع' : 'Back'}
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={validateAndProceed}
                        style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 10, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}>
                        {isAr ? `إرسال الطلب — $${price(selected)}/شهر` : `Submit Order — $${price(selected)}/mo`}
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Processing / Success ── */}
                {checkoutStep === 3 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div key="processing" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                            style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(212,175,55,0.15)', borderTop: '3px solid #D4AF37', margin: '0 auto 20px' }} />
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.1rem', color: '#F8F4EA', marginBottom: 8 }}>
                            {isAr ? 'جارٍ إرسال الطلب...' : 'Submitting Your Order...'}
                          </div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#C7C3B9' }}>
                            {isAr ? 'يرجى الانتظار' : 'Please wait'}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                          <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                            style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '2px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Clock size={30} color="#D4AF37" />
                          </motion.div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.2rem', color: '#D4AF37', marginBottom: 10 }}>
                            {isAr ? 'تم إرسال طلبك!' : 'Order Submitted!'}
                          </div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#C7C3B9', lineHeight: 1.7, marginBottom: 24 }}>
                            {isAr
                              ? 'تلقى فريقنا طلبك وسيقوم بمراجعة بيانات الدفع. ستصلك رسالة تأكيد على بريدك الإلكتروني خلال 24 ساعة.'
                              : 'Our team received your order and will review your payment details. You will receive a confirmation email within 24 hours.'}
                          </div>
                          <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, padding: '14px', marginBottom: 20, textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9' }}>{isAr ? 'الخطة' : 'Plan'}</span>
                              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#D4AF37' }}>{isAr ? selected.arabic : selected.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9' }}>{isAr ? 'المبلغ' : 'Amount'}</span>
                              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#D4AF37' }}>${price(selected)}/{isAr ? 'شهر' : 'mo'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9' }}>{isAr ? 'الحالة' : 'Status'}</span>
                              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#F5A623', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={11} /> {isAr ? 'قيد المراجعة' : 'Pending Review'}
                              </span>
                            </div>
                          </div>
                          <button onClick={handleClose}
                            style={{ width: '100%', padding: '12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 10, color: '#D4AF37', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}>
                            {isAr ? 'إغلاق' : 'Close'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
