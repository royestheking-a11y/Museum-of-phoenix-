import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Brain, Zap, BarChart2, BookOpen, Target, Moon, Star, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';



const features = [
  { icon: <Brain size={20} />, title: 'Symbol Recognition', arabic: 'التعرف على الرموز', desc: 'AI identifies symbols across 50+ civilizations and 5,000 years of history', descAr: 'يحدد الذكاء الاصطناعي الرموز عبر 50+ حضارة و 5000 عام من التاريخ' },
  { icon: <Target size={20} />, title: 'Origin Detection', arabic: 'تحديد الأصل', desc: 'Pinpoints geographic and temporal origin with confidence scoring', descAr: 'يحدد الأصل الجغرافي والزمني مع درجات الثقة' },
  { icon: <BookOpen size={20} />, title: 'Manuscript OCR', arabic: 'استخراج النص', desc: 'Reads and digitizes Arabic text from historical manuscript images', descAr: 'يقرأ ورقمنة النص العربي من صور المخطوطات التاريخية' },
  { icon: <BarChart2 size={20} />, title: 'Comparative Analysis', arabic: 'التحليل المقارن', desc: 'Compares uploaded symbols against 12,000+ catalogued specimens', descAr: 'يقارن الرموز المحملة بـ 12000+ عينة مفهرسة' },
];

export const mockResults = [
  {
    symbol: <Moon size="1em" strokeWidth={1.5} />,
    name: 'Crescent Moon',
    nameAr: 'هلال القمر',
    arabic: 'هلال القمر',
    confidence: 94,
    period: 'Islamic Era (7th–15th century CE)',
    periodAr: 'العصر الإسلامي (القرن 7-15 م)',
    civilization: 'Arab-Islamic',
    civilizationAr: 'العربية-الإسلامية',
    category: 'Celestial / Religious',
    categoryAr: 'فلكي / ديني',
    origin: 'Arabia / Levant',
    originAr: 'الجزيرة العربية / بلاد الشام',
    similar: ['Ottoman Crescent', 'Nabataean Moon Disc', 'Byzantine Lunate Epsilon'],
    similarAr: ['الهلال العثماني', 'قرص القمر النبطي', 'إبسيلون البيزنطي القمري'],
    notes: 'High confidence match. The proportions suggest Ottoman-period style (1300–1900 CE). The curvature ratio 0.618 matches the golden ratio observed in Mamluk-era coins.',
    notesAr: 'مطابقة عالية الثقة. تشير النسب إلى أسلوب العصر العثماني (1300-1900 م). تتطابق نسبة الانحناء 0.618 مع النسبة الذهبية الملاحظة في عملات العصر المملوكي.',
  },
  {
    symbol: <Star size="1em" fill="currentColor" strokeWidth={1.5} />,
    name: 'Eight-Pointed Star',
    nameAr: 'نجمة ثمانية الأضلاع',
    arabic: 'نجمة ثمانية الأضلاع',
    confidence: 87,
    period: 'Classical Islamic (9th–13th century CE)',
    periodAr: 'الإسلامي الكلاسيكي (القرن 9-13 م)',
    civilization: 'Abbasid / Seljuk',
    civilizationAr: 'العباسي / السلجوقي',
    category: 'Geometric / Architectural',
    categoryAr: 'هندسي / معماري',
    origin: 'Iraq / Persia',
    originAr: 'العراق / بلاد فارس',
    similar: ['Rub el Hizb', 'Seal of Solomon', 'Sufi Star Pattern'],
    similarAr: ['ربع الحزب', 'خاتم سليمان', 'نمط النجمة الصوفية'],
    notes: 'The 8-fold rotational symmetry is characteristic of Abbasid geometric art. Used extensively in tilework from Baghdad to Samarkand.',
    notesAr: 'التناظر الدوراني الثماني هو سمة مميزة للفن الهندسي العباسي. يستخدم على نطاق واسع في أعمال البلاط من بغداد إلى سمرقند.',
  },
];

export default function AILabHall() {
  const { isAr } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedResult, setSelectedResult] = useState<typeof mockResults[0] | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string; textAr?: string }[]>([
    { role: 'ai', text: 'مرحباً! I am the Phoenix AI Research Assistant. Ask me anything about Arabic symbols, manuscripts, or historical cryptography. What would you like to explore today?', textAr: 'مرحباً! أنا مساعد البحث الذكي العنقاء. اسألني عن أي شيء يخص الرموز العربية أو المخطوطات أو علم التشفير التاريخي. ماذا تود أن تستكشف اليوم؟' },
  ]);
  const fileRef = useRef<HTMLInputElement>(null);

  const analyzeSteps = [
    { text: 'Loading symbol database...', textAr: 'جاري تحميل قاعدة بيانات الرموز...' },
    { text: 'Running visual feature extraction...', textAr: 'جاري استخراج الميزات البصرية...' },
    { text: 'Matching geometric patterns...', textAr: 'جاري مطابقة الأنماط الهندسية...' },
    { text: 'Cross-referencing historical records...', textAr: 'مقارنة مع السجلات التاريخية...' },
    { text: 'Calculating confidence scores...', textAr: 'جاري حساب درجات الثقة...' },
    { text: 'Generating scholarly report...', textAr: 'جاري إنشاء التقرير العلمي...' },
  ];

  const runAnalysis = () => {
    setAnalyzing(true);
    setShowResults(false);
    setProgress(0);
    setActiveStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(Math.min(100, step * 17));
      setActiveStep(Math.min(step, analyzeSteps.length - 1));
      if (step >= 6) {
        clearInterval(interval);
        setTimeout(() => { setAnalyzing(false); setShowResults(true); }, 400);
      }
    }, 550);
  };

  const sendMessage = () => {
    if (!question.trim()) return;
    const userMsg = question;
    setQuestion('');
    setChatHistory(h => [...h, { role: 'user', text: userMsg }]);

    const responses: Record<string, { en: string; ar: string }> = {
      default: { en: 'This is a fascinating question about Arabic symbolism. Based on historical records and the museum\'s collection, I can tell you that Arabic symbols evolved through layers of civilization — Nabataean, Byzantine, early Islamic, and Abbasid traditions all contributed to the rich symbolic language we study today.', ar: 'هذا سؤال رائع حول الرمزية العربية. استنادًا إلى السجلات التاريخية ومجموعة المتحف، يمكنني إخبارك أن الرموز العربية تطورت عبر طبقات من الحضارة - ساهمت التقاليد النبطية والبيزنطية والإسلامية المبكرة والعباسية جميعها في اللغة الرمزية الغنية التي ندرسها اليوم.' },
      nur: { en: 'The word نور (Nur/Light) is one of the most theologically significant symbols in Arabic culture. The famous Ayat al-Nur (Light Verse, Quran 24:35) describes divine light through an elaborate metaphor of a niche, lamp, and glass. Sufi scholars interpret this as describing stages of spiritual illumination on the path to God.', ar: 'تعتبر كلمة نور من أهم الرموز اللاهوتية في الثقافة العربية. تصف آية النور الشهيرة (سورة النور 24:35) النور الإلهي من خلال استعارة متقنة للمشكاة والمصباح والزجاجة. يفسر علماء الصوفية هذا بأنه يصف مراحل التنوير الروحي في الطريق إلى الله.' },
      cipher: { en: 'Al-Kindi\'s 9th century treatise "Risalah fi Istikhraj al-Mu\'amma" (Manuscript on Deciphering Cryptographic Messages) is the world\'s oldest known cryptanalysis text. He pioneered frequency analysis — counting how often each letter appears to break substitution ciphers. This discovery preceded European cryptanalysis by 900 years.', ar: 'تعتبر رسالة الكندي في القرن التاسع "رسالة في استخراج المعمى" أقدم نص معروف في تحليل الشفرات في العالم. لقد كان رائدًا في تحليل التكرار - حساب عدد المرات التي يظهر فيها كل حرف لكسر شفرات الاستبدال. سبق هذا الاكتشاف تحليل الشفرات الأوروبي بـ 900 عام.' },
      phoenix: { en: 'The phoenix (anka or simurgh in Arabic/Persian tradition) appears in pre-Islamic Arabian mythology and Sufi literature. In Attar\'s "Conference of the Birds," the simurgh represents the divine — the birds\' journey to find the mythical bird is a metaphor for the soul\'s journey toward God.', ar: 'يظهر العنقاء (أو السيمرغ في التقاليد العربية / الفارسية) في الأساطير العربية قبل الإسلام والأدب الصوفي. في كتاب العطار "منطق الطير"، يمثل السيمرغ الألوهية - رحلة الطيور للعثور على الطائر الأسطوري هي استعارة لرحلة الروح نحو الله.' },
    };

    const lower = userMsg.toLowerCase();
    let response = responses.default;
    if (lower.includes('nur') || lower.includes('light') || lower.includes('نور')) response = responses.nur;
    else if (lower.includes('cipher') || lower.includes('crypto') || lower.includes('kindi') || lower.includes('كندي') || lower.includes('تشفير')) response = responses.cipher;
    else if (lower.includes('phoenix') || lower.includes('فينيق')) response = responses.phoenix;

    setTimeout(() => {
      setChatHistory(h => [...h, { role: 'ai', text: response.en, textAr: response.ar }]);
    }, 1200);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', color: '#F8F4EA' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 240, background: 'linear-gradient(180deg, #001025 0%, #001a35 50%, #0D1117 100%)', overflow: 'hidden' }}>
        {/* Scanning lines */}
        <motion.div style={{ position: 'absolute', inset: 0 }}
          animate={{ backgroundPosition: ['0% 0%', '0% 100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(100,180,255,0.04) 4px, rgba(100,180,255,0.04) 5px)' }} />
        </motion.div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <motion.div style={{ fontSize: '3rem' }} animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>◎</motion.div>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.8rem', color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.5)' }}>{isAr ? 'مختبر الذكاء الاصطناعي للرموز' : 'AI Symbol Laboratory'}</div>
          {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1rem', color: '#F0D98A', direction: 'rtl' }}>مختبر الذكاء الاصطناعي</div>}
          <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#C7C3B9', textAlign: 'center', maxWidth: 500, lineHeight: 1.7, direction: isAr ? 'rtl' : 'ltr' }}>
            {isAr ? 'قم بتحميل رمز أو صورة مخطوطة - سيحدد الذكاء الاصطناعي أصلها ومعناها وارتباطاتها التاريخية.' : 'Upload a symbol or manuscript image — our AI will identify its origin, meaning, and historical connections.'}
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(100,180,255,0.5), #D4AF37, rgba(100,180,255,0.5), transparent)' }} />
      </div>

      <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Features grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 36 }}>
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(100,180,255,0.15)', borderRadius: 8, padding: '18px', direction: isAr ? 'rtl' : 'ltr' }}>
              <div style={{ color: '#60A5FA', marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#F8F4EA', marginBottom: 3 }}>{isAr ? f.arabic : f.title}</div>
              {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.75rem', color: '#D4AF37', direction: 'rtl', marginBottom: 8 }}>{f.arabic}</div>}
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9', lineHeight: 1.6 }}>{isAr ? f.descAr : f.desc}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32, direction: isAr ? 'rtl' : 'ltr' }}>
          {/* Upload area */}
          <div>
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>{isAr ? 'تحميل الرمز / المخطوطة' : 'Upload Symbol / Manuscript'}</div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={runAnalysis} />
            <motion.div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); runAnalysis(); }}
              onClick={() => fileRef.current?.click()}
              whileHover={{ borderColor: 'rgba(212,175,55,0.6)' }}
              style={{
                border: `2px dashed ${dragOver ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.25)'}`,
                borderRadius: 10, padding: '40px 20px',
                textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.25s',
              }}
            >
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                <Upload size={40} color="#D4AF37" style={{ margin: '0 auto 16px' }} />
              </motion.div>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1rem', color: '#F8F4EA', marginBottom: 6 }}>
                {isAr ? 'أو اسحب الملف هنا' : 'Drop your symbol here'}
              </div>
              {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', color: '#D4AF37', direction: 'rtl', marginBottom: 12 }}>أو اسحب الملف هنا</div>}
              <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>PNG, JPG, PDF • Max 20MB</div>
            </motion.div>

            {/* Demo buttons */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9', letterSpacing: '0.1em', marginBottom: 8 }}>{isAr ? 'أو جرب رمزا تجريبيا:' : 'Or try a demo symbol:'}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[{icon: <Moon size={14}/>, label: 'Crescent', labelAr: 'هلال'}, {icon: <Star size={14} fill="currentColor"/>, label: 'Star', labelAr: 'نجمة'}, {icon: '◈', label: 'Diamond', labelAr: 'ماسة'}, {icon: '𓅃', label: 'Hawk', labelAr: 'صقر'}].map(sym => (
                  <button key={sym.label} onClick={runAnalysis} style={{ padding: '6px 14px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 4, color: '#D4AF37', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {sym.icon} {isAr ? sym.labelAr : sym.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis panel */}
          <div>
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>{isAr ? 'حالة التحليل' : 'Analysis Status'}</div>
            <div style={{ background: 'rgba(0,10,25,0.7)', border: '1px solid rgba(100,180,255,0.15)', borderRadius: 10, padding: '20px', minHeight: 200 }}>
              <AnimatePresence mode="wait">
                {!analyzing && !showResults && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', paddingTop: 40 }}>
                    <Zap size={36} color="rgba(100,180,255,0.3)" style={{ margin: '0 auto 14px' }} />
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', color: '#C7C3B9' }}>{isAr ? 'في انتظار تحميل الرمز' : 'Awaiting symbol upload'}</div>
                    {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.8rem', color: 'rgba(199,195,185,0.5)', marginTop: 6, direction: 'rtl' }}>في انتظار تحميل الرمز</div>}
                  </motion.div>
                )}
                {analyzing && (
                  <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#60A5FA', marginBottom: 8, textAlign: isAr ? 'right' : 'left' }}>
                        {isAr ? 'جاري التحليل...' : 'Analyzing...'} {progress}%
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 4 }}>
                        <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #60A5FA, #D4AF37)', borderRadius: 4 }}
                          animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {analyzeSteps.map((step, i) => (
                        <motion.div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', flexDirection: isAr ? 'row' : 'row' }}
                          initial={{ opacity: 0 }} animate={{ opacity: i <= activeStep ? 1 : 0.2 }}>
                          <div style={{
                            width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                            background: i < activeStep ? '#D4AF37' : i === activeStep ? '#60A5FA' : 'rgba(255,255,255,0.1)',
                            boxShadow: i === activeStep ? '0 0 8px #60A5FA' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.55rem', color: '#0D1117',
                          }}>
                            {i < activeStep ? '✓' : ''}
                          </div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: i <= activeStep ? '#F8F4EA' : '#C7C3B9' }}>{isAr ? step.textAr : step.text}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {showResults && !analyzing && (
                  <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#4ade80' }}>{isAr ? 'اكتمل التحليل - تم العثور على تطابقين' : 'Analysis Complete — 2 matches found'}</div>
                    </div>
                    {mockResults.map((r, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                        onClick={() => setSelectedResult(r)}
                        style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, marginBottom: 8, cursor: 'pointer', flexDirection: isAr ? 'row' : 'row' }}>
                        <div style={{ fontSize: '1.8rem' }}>{typeof r.symbol === 'object' ? '✧' : r.symbol}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.85rem', color: '#F8F4EA' }}>{isAr ? r.nameAr : r.name}</div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: '#C7C3B9' }}>{isAr ? r.periodAr : r.period}</div>
                        </div>
                        <div style={{ textAlign: isAr ? 'left' : 'right' }}>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.1rem', color: r.confidence > 90 ? '#4ade80' : '#D4AF37', direction: 'ltr' }}>{r.confidence}%</div>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: '#C7C3B9' }}>{isAr ? 'ثقة' : 'confidence'}</div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* AI Research Assistant Chat */}
        <div style={{ background: 'rgba(0,5,15,0.8)', border: '1px solid rgba(100,180,255,0.2)', borderRadius: 12, overflow: 'hidden', direction: isAr ? 'rtl' : 'ltr' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(100,180,255,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #1a4a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}
              animate={{ boxShadow: ['0 0 10px rgba(212,175,55,0.3)', '0 0 20px rgba(212,175,55,0.6)', '0 0 10px rgba(212,175,55,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}>
              𓅃
            </motion.div>
            <div>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#D4AF37' }}>{isAr ? 'مساعد البحث الذكي' : 'Phoenix AI Research Assistant'}</div>
              {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.7rem', color: 'rgba(199,195,185,0.6)', direction: 'rtl' }}>مساعد البحث الذكي</div>}
            </div>
            <div style={{ [isAr ? 'marginRight' : 'marginLeft']: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#4ade80' }}>{isAr ? 'متصل' : 'Online'}</span>
            </div>
          </div>

          {/* Chat messages */}
          <div style={{ height: 260, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {chatHistory.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? (isAr ? 'row-reverse' : 'row-reverse') : 'row' }}>
                {msg.role === 'ai' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>𓅃</div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                  background: msg.role === 'user' ? 'rgba(212,175,55,0.15)' : 'rgba(100,180,255,0.08)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(212,175,55,0.25)' : 'rgba(100,180,255,0.15)'}`,
                  fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#F8F4EA', lineHeight: 1.65,
                }}>
                  {isAr ? (msg.textAr || msg.text) : msg.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(100,180,255,0.12)', display: 'flex', gap: 10 }}>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={isAr ? 'اسأل عن الرموز أو المخطوطات أو التراث العربي...' : 'Ask about symbols, manuscripts, or Arabic heritage...'}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 6,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(100,180,255,0.2)',
                color: '#F8F4EA', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', outline: 'none', direction: isAr ? 'rtl' : 'ltr'
              }}
            />
            <button onClick={sendMessage} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', border: 'none', borderRadius: 6, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              {isAr ? 'اسأل' : 'Ask AI'}
            </button>
          </div>
        </div>
      </div>

      {/* Result detail modal */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div className="fixed inset-0 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,5,15,0.95)', zIndex: 100, backdropFilter: 'blur(15px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedResult(null)}>
            <motion.div initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'linear-gradient(135deg, #001025, #0D1117)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 14, padding: '40px', maxWidth: 600, width: '100%' }}>
              <button onClick={() => setSelectedResult(null)} style={{ position: 'absolute', top: 16, [isAr ? 'left' : 'right']: 16, background: 'none', border: 'none', color: '#C7C3B9', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24, direction: isAr ? 'rtl' : 'ltr' }}>
                <div style={{ fontSize: '4rem' }}>{typeof selectedResult.symbol === 'object' ? '✧' : selectedResult.symbol}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: isAr ? 'row' : 'row' }}>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.3rem', color: '#D4AF37' }}>{isAr ? selectedResult.nameAr : selectedResult.name}</div>
                    <div style={{ background: selectedResult.confidence > 90 ? 'rgba(74,222,128,0.15)' : 'rgba(212,175,55,0.15)', border: `1px solid ${selectedResult.confidence > 90 ? 'rgba(74,222,128,0.4)' : 'rgba(212,175,55,0.4)'}`, borderRadius: 20, padding: '2px 12px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: selectedResult.confidence > 90 ? '#4ade80' : '#D4AF37', direction: 'ltr' }}>
                      {selectedResult.confidence}% {isAr ? 'تطابق' : 'match'}
                    </div>
                  </div>
                  {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', color: '#F0D98A', direction: 'rtl', marginTop: 4 }}>{selectedResult.arabic}</div>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20, direction: isAr ? 'rtl' : 'ltr' }}>
                {[
                  { label: isAr ? 'الفترة' : 'Period', value: isAr ? selectedResult.periodAr : selectedResult.period },
                  { label: isAr ? 'الحضارة' : 'Civilization', value: isAr ? selectedResult.civilizationAr : selectedResult.civilization },
                  { label: isAr ? 'الفئة' : 'Category', value: isAr ? selectedResult.categoryAr : selectedResult.category },
                  { label: isAr ? 'الأصل' : 'Origin', value: isAr ? selectedResult.originAr : selectedResult.origin },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(100,180,255,0.12)', borderRadius: 6, padding: '10px 14px' }}>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#C7C3B9', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#F8F4EA' }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, padding: '14px', marginBottom: 16, direction: isAr ? 'rtl' : 'ltr' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{isAr ? 'ملاحظات تحليل الذكاء الاصطناعي' : 'AI Analysis Notes'}</div>
                <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#C7C3B9', lineHeight: 1.7 }}>{isAr ? selectedResult.notesAr : selectedResult.notes}</p>
              </div>
              <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{isAr ? 'رموز مشابهة' : 'Similar Symbols'}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(isAr ? selectedResult.similarAr : selectedResult.similar).map((s: string) => (
                    <div key={s} style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 4, padding: '4px 12px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#D4AF37' }}>{s}</div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
