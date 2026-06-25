import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Star, Shield, Sword, Zap, Droplets, TreeDeciduous, Bird, BookOpen, ScrollText, Sparkles, Building2, Eye, PenTool, Compass, Globe, Map, Key, Lock, Diamond, Feather, Target, Wind, Flame, Mountain, Cloud, Tent, Settings, Copy, ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ARABIC_ALPHABET = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
const LATIN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function caesarEncrypt(text: string, shift: number): string {
  return text.toUpperCase().split('').map(ch => { const idx = LATIN_ALPHABET.indexOf(ch); return idx === -1 ? ch : LATIN_ALPHABET[(idx + shift + 26) % 26]; }).join('');
}

function arabicCipherEncrypt(text: string, shift: number): string {
  return text.split('').map(ch => { const idx = ARABIC_ALPHABET.indexOf(ch); return idx === -1 ? ch : ARABIC_ALPHABET[(idx + shift + ARABIC_ALPHABET.length) % ARABIC_ALPHABET.length]; }).join('');
}



const ENGLISH_FREQ = [8.17,1.49,2.78,4.25,12.7,2.23,2.02,6.09,6.97,0.15,0.77,4.03,2.41,6.75,7.51,1.93,0.1,5.99,6.33,9.06,2.76,0.98,2.36,0.15,1.97,0.07];

const HISTORY_DATA = [
  {
    name: "Al-Kindi's Frequency Analysis", icon: <Sun size={32} color="#D4AF37" strokeWidth={1.5} />,
    arabic: "تحليل التكرار للكندي",
    year: "c. 850 CE",
    yearAr: "حوالي ٨٥٠ م",
    description: "Al-Kindi wrote 'Risalah fi Istikhraj al-Mu'amma' (Manuscript on Deciphering Cryptographic Messages). He realized that certain letters in Arabic appear more frequently than others (like 'ا' and 'ل'). By counting letter frequencies in an encrypted message, he could break substitution ciphers that were previously thought unbreakable. This was the birth of cryptanalysis, predating European discovery by over 500 years.",
    descriptionAr: "كتب الكندي 'رسالة في استخراج المعمى'. أدرك أن بعض الحروف في اللغة العربية تظهر بشكل متكرر أكثر من غيرها (مثل 'ا' و 'ل'). من خلال حساب تكرارات الحروف في رسالة مشفرة، استطاع كسر شفرات الاستبدال التي كان يُعتقد سابقًا أنه لا يمكن كسرها. كانت هذه ولادة تحليل الشفرات، والتي تسبق الاكتشاف الأوروبي بأكثر من 500 عام."
  },
  {
    name: "Ibn Wahshiyya's Alphabets", icon: <Moon size={32} color="#D4AF37" strokeWidth={1.5} />,
    arabic: "أبجديات ابن وحشية",
    year: "c. 855 CE",
    yearAr: "حوالي ٨٥٥ م",
    description: "Ibn Wahshiyya published the 'Kitab Shawq al-Mustaham', a remarkable book containing dozens of ancient and secret alphabets. He not only documented cryptographic scripts used by alchemists and magicians but also provided the first known translation of Egyptian Hieroglyphs, nearly a millennium before the Rosetta Stone.",
    descriptionAr: "نشر ابن وحشية 'كتاب شوق المستهام'، وهو كتاب رائع يحتوي على عشرات الأبجديات القديمة والسرية. لم يوثق فقط النصوص المشفرة التي استخدمها الخيميائيون والسحرة، بل قدم أيضًا أول ترجمة معروفة للهيروغليفية المصرية، قبل حجر رشيد بحوالي ألف عام."
  },
  {
    name: "Ibn Adlan's Cryptanalysis Manual", icon: <Star size={32} color="#D4AF37" strokeWidth={1.5} />,
    arabic: "دليل تحليل الشفرات لابن عدلان",
    year: "1212 CE",
    yearAr: "١٢١٢ م",
    description: "Ibn Adlan wrote a comprehensive manual on cryptanalysis called 'Al-Mu'allif lil-Mulk al-Ashraf'. He provided practical examples of breaking various ciphers, established rules for the minimum ciphertext length required for frequency analysis to work, and documented ways to defeat encryption by looking for word patterns and common prefixes.",
    descriptionAr: "كتب ابن عدلان دليلاً شاملاً حول تحليل الشفرات يسمى 'المؤلف للملك الأشرف'. قدم أمثلة عملية لكسر مختلف الشفرات، ووضع قواعد للحد الأدنى لطول النص المشفر المطلوب لعمل تحليل التكرار، ووثق طرقًا لهزيمة التشفير من خلال البحث عن أنماط الكلمات والبادئات الشائعة."
  },
  {
    name: "Al-Qalqashandi's Encyclopedia", icon: <Shield size={32} color="#D4AF37" strokeWidth={1.5} />,
    arabic: "موسوعة القلقشندي",
    year: "c. 1412 CE",
    yearAr: "حوالي ١٤١٢ م",
    description: "In his monumental 14-volume encyclopedia 'Subh al-A'sha', Al-Qalqashandi included a massive section on cryptography. He detailed seven different methods of encryption, including transposition ciphers (rearranging letters) and substitution ciphers (replacing letters), standardizing cryptographic techniques for the Mamluk state.",
    descriptionAr: "في موسوعته الضخمة المكونة من 14 مجلدًا 'صبح الأعشى'، أدرج القلقشندي قسمًا هائلاً عن التشفير. فصّل سبع طرق مختلفة للتشفير، بما في ذلك شفرات التبديل (إعادة ترتيب الحروف) وشفرات الاستبدال (استبدال الحروف)، مما أدى إلى توحيد تقنيات التشفير للدولة المملوكية."
  }
];

export default function CryptographyHall() {
  const { isAr } = useLanguage();
  const [mode, setMode] = useState<'caesar' | 'arabic' | 'frequency'>('caesar');
  const [inputText, setInputText] = useState('HELLO MUSEUM');
  const [arabicInput, setArabicInput] = useState('مرحبا بالمتحف');
  const [shift, setShift] = useState(7);
  const [activeHistory, setActiveHistory] = useState<number | null>(null);
  const [wheelAngle, setWheelAngle] = useState(0);


  const encrypted = mode === 'arabic' ? arabicCipherEncrypt(arabicInput, shift) : caesarEncrypt(inputText, shift);

  return (
    <div style={{ height: '100%', overflowY: 'auto', color: '#F8F4EA' }}>
      <div style={{ position: 'relative', height: 240, background: 'linear-gradient(180deg, #0a0a2a 0%, #1a1a4a 50%, #0D1117 100%)', overflow: 'hidden' }}>
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} style={{ position: 'absolute', left: `${i * 14}%`, top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, transparent, rgba(100,150,255,0.3), transparent)' }}
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 20px rgba(100,150,255,0.8))', display: 'flex' }}><Settings size="1em" strokeWidth={1.5} /></div>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.8rem', color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.5)' }}>{isAr ? 'غرفة علم التشفير' : 'Cryptography Chamber'}</div>
          {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1rem', color: '#F0D98A', direction: 'rtl' }}>غرفة علم التشفير</div>}
          <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#C7C3B9', textAlign: 'center', maxWidth: 480, lineHeight: 1.7, padding: '0 20px', direction: isAr ? 'rtl' : 'ltr' }}>{isAr ? 'مساهمة العالم العربي في علم التشفير تسبق الغرب بقرون. اخترع الكندي تحليل التكرار في عام 800 م.' : 'The Arab world\'s contribution to cryptography predates the West by centuries. Al-Kindi invented frequency analysis in 800 CE.'}</p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(100,150,255,0.5), #D4AF37, rgba(100,150,255,0.5), transparent)' }} />
      </div>

      <div style={{ background: 'rgba(0,0,15,0.8)', padding: '16px 32px', borderBottom: '1px solid rgba(212,175,55,0.12)', display: 'flex', gap: 8, direction: isAr ? 'rtl' : 'ltr' }}>
        {[{ id: 'caesar', label: 'Caesar Cipher', arabic: 'شيفرة قيصر' }, { id: 'arabic', label: 'Arabic Substitution', arabic: 'الاستبدال العربي' }, { id: 'frequency', label: 'Frequency Analysis', arabic: 'تحليل التكرار' }].map(tab => (
          <button key={tab.id} onClick={() => setMode(tab.id as typeof mode)} style={{ padding: '10px 20px', background: mode === tab.id ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${mode === tab.id ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.12)'}`, borderRadius: 6, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: mode === tab.id ? '#D4AF37' : '#C7C3B9' }}>{isAr ? tab.arabic : tab.label}</span>
            {!isAr && <span style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.68rem', color: 'rgba(199,195,185,0.5)', direction: 'rtl' }}>{tab.arabic}</span>}
          </button>
        ))}
      </div>

      <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {(mode === 'caesar' || mode === 'arabic') && (
            <motion.div key={mode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'start', marginBottom: 32, direction: isAr ? 'rtl' : 'ltr' }}>
                <div>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>{mode === 'arabic' ? (isAr ? 'الإدخال العربي' : 'Arabic Input') : (isAr ? 'نص عادي' : 'Plain Text')}</div>
                  <textarea value={mode === 'arabic' ? arabicInput : inputText} onChange={e => mode === 'arabic' ? setArabicInput(e.target.value) : setInputText(e.target.value)} rows={4} dir={mode === 'arabic' ? 'rtl' : 'ltr'}
                    style={{ width: '100%', padding: '14px', borderRadius: 8, resize: 'vertical', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)', color: '#F8F4EA', fontFamily: mode === 'arabic' ? '"IBM Plex Sans Arabic"' : '"Courier New", monospace', fontSize: mode === 'arabic' ? '1.1rem' : '0.95rem', lineHeight: 1.6, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 20 }}>
                  <motion.div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', border: '2px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', boxShadow: '0 0 20px rgba(212,175,55,0.2)' }}
                    animate={{ rotate: wheelAngle }} transition={{ type: 'spring', stiffness: 100 }}>
                    <span style={{ fontFamily: '"Courier New"', fontSize: '1.4rem', fontWeight: 'bold', color: '#D4AF37' }}>{shift}</span>
                    {[...Array(8)].map((_, i) => <div key={i} style={{ position: 'absolute', width: 2, height: 10, background: 'rgba(212,175,55,0.4)', top: 4, left: '50%', transformOrigin: '50% 46px', transform: `rotate(${i * 45}deg) translateX(-50%)` }} />)}
                  </motion.div>
                  <div style={{ display: 'flex', gap: 8, flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <button onClick={() => { setShift(s => (s - 1 + 26) % 26 + 1); setWheelAngle(a => a - 14); }} style={{ width: 32, height: 32, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 4, color: '#D4AF37', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                    <button onClick={() => { setShift(s => s % 25 + 1); setWheelAngle(a => a + 14); }} style={{ width: 32, height: 32, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 4, color: '#D4AF37', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                  </div>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', textAlign: 'center' }}>{isAr ? 'الإزاحة:' : 'Shift:'} {shift}</div>
                </div>
                <div>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>{isAr ? 'المخرجات المشفرة' : 'Encrypted Output'}</div>
                  <div style={{ width: '100%', minHeight: 88, padding: '14px', borderRadius: 8, background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)', fontFamily: '"Courier New", monospace', fontSize: '0.95rem', color: '#F0D98A', lineHeight: 1.6, wordBreak: 'break-all', letterSpacing: '0.15em', direction: 'ltr', textAlign: isAr ? 'right' : 'left' }}>{encrypted}</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, flexDirection: isAr ? 'row' : 'row' }}>
                    <button onClick={() => navigator.clipboard?.writeText(encrypted)} style={{ padding: '6px 14px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 4, color: '#D4AF37', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexDirection: isAr ? 'row' : 'row' }}><Copy size={12} /> {isAr ? 'نسخ' : 'Copy'}</button>
                    <button onClick={() => { setInputText(''); setArabicInput(''); }} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: '#C7C3B9', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', cursor: 'pointer' }}>{isAr ? 'مسح' : 'Clear'}</button>
                  </div>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,15,0.5)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 10, padding: '20px', marginBottom: 32, direction: isAr ? 'rtl' : 'ltr' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>{isAr ? 'خريطة التشفير' : 'Cipher Mapping'}</div>
                <div style={{ overflowX: 'auto' }}>
                  <div style={{ display: 'flex', gap: 0, minWidth: 'max-content', justifyContent: 'center', margin: '0 auto', direction: mode === 'arabic' ? 'rtl' : 'ltr' }}>
                    {(mode === 'arabic' ? ARABIC_ALPHABET : LATIN_ALPHABET).split('').map((letter, i) => (
                      <div key={letter} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: mode === 'arabic' ? 32 : 30 }}>
                        <div style={{ fontFamily: mode === 'arabic' ? '"IBM Plex Sans Arabic"' : '"Courier New"', fontSize: mode === 'arabic' ? '0.9rem' : '0.8rem', color: '#C7C3B9', padding: '4px 0', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>{letter}</div>
                        <div style={{ color: 'rgba(212,175,55,0.3)', fontSize: '0.7rem', padding: '2px' }}>↓</div>
                        <div style={{ fontFamily: mode === 'arabic' ? '"IBM Plex Sans Arabic"' : '"Courier New"', fontSize: mode === 'arabic' ? '0.9rem' : '0.8rem', color: '#D4AF37', padding: '4px 0' }}>
                          {mode === 'arabic' ? ARABIC_ALPHABET[(i + shift) % ARABIC_ALPHABET.length] : LATIN_ALPHABET[(i + shift) % 26]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {mode === 'frequency' && (
            <motion.div key="frequency" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ direction: isAr ? 'rtl' : 'ltr' }}>
              <h3 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', color: '#D4AF37', marginBottom: 8 }}>{isAr ? 'تحليل تكرار الحروف' : 'Letter Frequency Analysis'}</h3>
              <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', color: '#C7C3B9', lineHeight: 1.7, marginBottom: 24 }}>{isAr ? 'اكتشاف الكندي في القرن التاسع: يظهر كل حرف في أي لغة بتكرار مميز. من خلال مقارنة تكرارات التشفير مع تكرارات اللغة المعروفة، يمكن كسر أي شفرة استبدال.' : 'Al-Kindi\'s 9th century discovery: every letter in a language appears with a characteristic frequency. By comparing cipher frequencies to known language frequencies, any substitution cipher can be broken.'}</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 200, padding: '0 0 24px 0', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, height: 1, background: 'rgba(212,175,55,0.15)' }} />
                {LATIN_ALPHABET.split('').map((letter, i) => (
                  <div key={letter} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${ENGLISH_FREQ[i] * 12}px` }} transition={{ delay: i * 0.02, duration: 0.5 }}
                      style={{ background: ENGLISH_FREQ[i] > 8 ? 'linear-gradient(180deg,#F0D98A,#D4AF37)' : ENGLISH_FREQ[i] > 4 ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.3)', width: '100%', borderRadius: '2px 2px 0 0', boxShadow: ENGLISH_FREQ[i] > 8 ? '0 0 8px rgba(212,175,55,0.4)' : 'none' }} />
                    <div style={{ fontFamily: '"Courier New"', fontSize: '0.6rem', color: '#C7C3B9', marginTop: 4 }}>{letter}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ direction: isAr ? 'rtl' : 'ltr' }}>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>{isAr ? 'تاريخ التشفير العربي' : 'Arab Cryptography History'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {HISTORY_DATA.map((item, i) => (
              <motion.div key={item.name} onClick={() => setActiveHistory(activeHistory === i ? null : i)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 8, padding: '16px 20px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isAr ? 'row' : 'row' }}>
                  <div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.95rem', color: '#F8F4EA' }}>{isAr ? item.arabic : item.name}</div>
                    {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.8rem', color: '#D4AF37', direction: 'rtl', marginTop: 2 }}>{item.arabic}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: isAr ? 'row' : 'row' }}>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#8B6914', background: 'rgba(139,105,20,0.15)', border: '1px solid rgba(139,105,20,0.3)', borderRadius: 10, padding: '2px 10px', direction: 'ltr' }}>{isAr ? item.yearAr : item.year}</div>
                    <div style={{ color: '#C7C3B9', display: 'flex' }}>{activeHistory === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                  </div>
                </div>
                <AnimatePresence>
                  {activeHistory === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#C7C3B9', lineHeight: 1.7, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(212,175,55,0.1)' }}>{isAr ? item.descriptionAr : item.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
