import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Zap, TreeDeciduous, Sun, Moon, Droplets, Bug, Circle, Leaf, Hand, Bird, ScrollText, Star, Map, ArrowLeft, Search, Filter, X, Landmark, Lock, Layers, Languages, Brain, MapPin, Clock, Check } from 'lucide-react';
import IslamicGeometry from './IslamicGeometry';
import ParticleField from './ParticleField';
import { useLanguage } from '../context/LanguageContext';

const ALL_ITEMS = [
  { id: 'h1', hall: 1, category: 'Seal', categoryAr: 'ختم', period: 'Mesopotamian', periodAr: 'بلاد الرافدين', civilization: 'Sumerian', civilizationAr: 'سومرية', year: '3500 BCE', yearAr: '3500 ق.م', region: 'Iraq', regionAr: 'العراق', name: 'Uruk Eye Idol', arabic: 'صنم العين أوروك', symbol: <Eye size="1em" strokeWidth={1.5} />, meaning: 'Divine watchfulness and omniscience of the gods', meaningAr: 'المراقبة الإلهية ومعرفة الآلهة بكل شيء', significance: 'CRITICAL' },
  { id: 'h2', hall: 1, category: 'Administrative', categoryAr: 'إداري', period: 'Mesopotamian', periodAr: 'بلاد الرافدين', civilization: 'Akkadian', civilizationAr: 'أكادية', year: '2200 BCE', yearAr: '2200 ق.م', region: 'Iraq', regionAr: 'العراق', name: 'Cylinder Seal of Adad', arabic: 'ختم اسطواني أكادي', symbol: <Zap size="1em" strokeWidth={1.5} />, meaning: 'Storm god — lightning and royal authority', meaningAr: 'إله العاصفة — البرق والسلطة الملكية', significance: 'HIGH' },
  { id: 'h3', hall: 1, category: 'Seal', categoryAr: 'ختم', period: 'Dilmun', periodAr: 'دلمون', civilization: 'Dilmunite', civilizationAr: 'دلمونية', year: '1800 BCE', yearAr: '1800 ق.م', region: 'Bahrain', regionAr: 'البحرين', name: 'Dilmun Temple Altar', arabic: 'رمز معبد دلمون', symbol: <TreeDeciduous size="1em" strokeWidth={1.5} />, meaning: 'Tree of life — sacred freshwater springs of paradise', meaningAr: 'شجرة الحياة — ينابيع المياه العذبة المقدسة في الجنة', significance: 'HIGH' },
  { id: 'h4', hall: 1, category: 'Divine', categoryAr: 'إلهي', period: 'Nabataean', periodAr: 'نبطي', civilization: 'Nabataean', civilizationAr: 'نبطية', year: '100 BCE', yearAr: '100 ق.م', region: 'Petra, Jordan', regionAr: 'البتراء، الأردن', name: 'Nabataean Sun Disc', arabic: 'قرص الشمس النبطي', symbol: <Sun size="1em" strokeWidth={1.5} />, meaning: 'Solar deity worship and cosmic order', meaningAr: 'عبادة إله الشمس والنظام الكوني', significance: 'CRITICAL' },
  { id: 'h5', hall: 1, category: 'Script', categoryAr: 'مخطوطة', period: 'Nabataean', periodAr: 'نبطي', civilization: 'Lihyanite', civilizationAr: 'لحيانية', year: '400 BCE', yearAr: '400 ق.م', region: 'Al-Ula, Saudi Arabia', regionAr: 'العلا، السعودية', name: 'Lihyanite Royal Inscription', arabic: 'نقش ملكي لحياني', symbol: '𐪁', meaning: 'Royal proclamations — first known Arabian bureaucratic state', meaningAr: 'إعلانات ملكية — أول دولة بيروقراطية عربية معروفة', significance: 'CRITICAL' },
  { id: 'h6', hall: 1, category: 'Royal', categoryAr: 'ملكي', period: 'Sabaean', periodAr: 'سبئي', civilization: 'Sabaean', civilizationAr: 'سبئية', year: '800 BCE', yearAr: '800 ق.م', region: 'Marib, Yemen', regionAr: 'مأرب، اليمن', name: 'Sabaean Mukarrib Seal', arabic: 'خاتم المكرب السبئي', symbol: <Moon size="1em" strokeWidth={1.5} />, meaning: 'Divine authority of the priest-king', meaningAr: 'السلطة الإلهية للملك الكاهن', significance: 'CRITICAL' },
  { id: 'h7', hall: 1, category: 'Tribal', categoryAr: 'قبلي', period: 'Pre-Islamic', periodAr: 'قبل الإسلام', civilization: 'Arabian', civilizationAr: 'عربية', year: '300 BCE', yearAr: '300 ق.م', region: 'Central Arabia', regionAr: 'وسط الجزيرة العربية', name: 'Tribal Wasm Brand', arabic: 'الوسم القبلي', symbol: '⚜', meaning: 'Tribal identity and property ownership', meaningAr: 'الهوية القبلية وملكية الممتلكات', significance: 'MEDIUM' },
  { id: 'h8', hall: 1, category: 'Calligraphy', categoryAr: 'خط', period: 'Early Islamic', periodAr: 'الإسلامي المبكر', civilization: 'Umayyad', civilizationAr: 'أموية', year: '700 CE', yearAr: '700 م', region: 'Damascus', regionAr: 'دمشق', name: 'Kufic Quranic Script', arabic: 'الخط الكوفي القرآني', symbol: 'ب', meaning: 'Birth of standardized Arabic writing as sacred art', meaningAr: 'ولادة الكتابة العربية الموحدة كفن مقدس', significance: 'CRITICAL' },
  { id: 'h9', hall: 1, category: 'Numismatic', categoryAr: 'عملات', period: 'Early Islamic', periodAr: 'الإسلامي المبكر', civilization: 'Umayyad', civilizationAr: 'أموية', year: '696 CE', yearAr: '696 م', region: 'Damascus', regionAr: 'دمشق', name: 'Umayyad Reform Dirham', arabic: 'الدرهم الأموي الإصلاحي', symbol: <Moon size="1em" strokeWidth={1.5} />, meaning: 'First purely text-based coins — Arabic as global language', meaningAr: 'أول عملات تعتمد على النصوص — العربية كلغة عالمية', significance: 'HIGH' },
  { id: 'q1', hall: 2, category: 'Light', categoryAr: 'نور', period: 'Quranic', periodAr: 'قرآني', civilization: 'Islamic', civilizationAr: 'إسلامية', year: '610–632 CE', yearAr: '610-632 م', region: 'Arabia', regionAr: 'الجزيرة العربية', name: 'Divine Light — Nur', arabic: 'النور الإلهي', symbol: <Sun size="1em" strokeWidth={1.5} />, meaning: 'Allah is the Light of the heavens and earth (24:35)', meaningAr: 'الله نور السموات والأرض (24:35)', significance: 'CRITICAL' },
  { id: 'q2', hall: 2, category: 'Water', categoryAr: 'ماء', period: 'Quranic', periodAr: 'قرآني', civilization: 'Islamic', civilizationAr: 'إسلامية', year: '610–632 CE', yearAr: '610-632 م', region: 'Arabia', regionAr: 'الجزيرة العربية', name: 'Life-Giving Water', arabic: 'الماء الحياة', symbol: <Droplets size="1em" strokeWidth={1.5} />, meaning: 'We made from water every living thing (21:30)', meaningAr: 'وجعلنا من الماء كل شيء حي (21:30)', significance: 'CRITICAL' },
  { id: 'q3', hall: 2, category: 'Animals', categoryAr: 'حيوانات', period: 'Quranic', periodAr: 'قرآني', civilization: 'Islamic', civilizationAr: 'إسلامية', year: '610–632 CE', yearAr: '610-632 م', region: 'Arabia', regionAr: 'الجزيرة العربية', name: 'The Inspired Bee — Nahl', arabic: 'النحل المُلهم', symbol: <Bug size="1em" strokeWidth={1.5} />, meaning: 'The bee receives divine wahy like the Prophet (16:68)', meaningAr: 'وأوحى ربك إلى النحل (16:68)', significance: 'HIGH' },
  { id: 'q4', hall: 2, category: 'Numbers', categoryAr: 'أرقام', period: 'Quranic', periodAr: 'قرآني', civilization: 'Islamic', civilizationAr: 'إسلامية', year: '610–632 CE', yearAr: '610-632 م', region: 'Arabia', regionAr: 'الجزيرة العربية', name: 'Sacred Seven', arabic: 'الرقم سبعة المقدس', symbol: '٧', meaning: '7 heavens, 7 circuits of tawaf — divine completeness', meaningAr: '7 سماوات، 7 أشواط في الطواف — الكمال الإلهي', significance: 'HIGH' },
  { id: 'q5', hall: 2, category: 'Colors', categoryAr: 'ألوان', period: 'Quranic', periodAr: 'قرآني', civilization: 'Islamic', civilizationAr: 'إسلامية', year: '610–632 CE', yearAr: '610-632 م', region: 'Arabia', regionAr: 'الجزيرة العربية', name: 'Green — Color of Paradise', arabic: 'الأخضر لون الجنة', symbol: <Circle size="1em" color="#4ade80" fill="#4ade80" strokeWidth={1.5} />, meaning: "Color of paradise, Prophet's banner, divine mercy", meaningAr: 'لون الجنة، راية النبي، الرحمة الإلهية', significance: 'HIGH' },
  { id: 'q6', hall: 2, category: 'Trees', categoryAr: 'أشجار', period: 'Quranic', periodAr: 'قرآني', civilization: 'Islamic', civilizationAr: 'إسلامية', year: '610–632 CE', yearAr: '610-632 م', region: 'Arabia', regionAr: 'الجزيرة العربية', name: 'The Blessed Olive Tree', arabic: 'الزيتونة المباركة', symbol: <Leaf size="1em" strokeWidth={1.5} />, meaning: 'Universal wisdom transcending east and west (24:35)', meaningAr: 'حكمة عالمية تتجاوز الشرق والغرب (24:35)', significance: 'CRITICAL' },
  { id: 's1', hall: 4, category: 'Cultural', categoryAr: 'ثقافي', period: 'Various', periodAr: 'مختلف', civilization: 'Pan-Islamic', civilizationAr: 'عموم الإسلام', year: '7th c.+', yearAr: 'القرن 7+', region: 'Islamic World', regionAr: 'العالم الإسلامي', name: 'Crescent — 4 Semiotic Layers', arabic: 'الهلال وطبقاته الأربع', symbol: <Moon size="1em" strokeWidth={1.5} />, meaning: 'Icon → Index → Symbol → Cultural Memory', meaningAr: 'أيقونة → مؤشر → رمز → ذاكرة ثقافية', significance: 'CRITICAL' },
  { id: 's2', hall: 4, category: 'Cultural', categoryAr: 'ثقافي', period: 'Pre-Islamic', periodAr: 'قبل الإسلام', civilization: 'Arabian', civilizationAr: 'عربية', year: '3000 BCE+', yearAr: '3000 ق.م+', region: 'Arabian Peninsula', regionAr: 'شبه الجزيرة العربية', name: 'Khamsa — Hand of Fatima', arabic: 'الخمسة / يد فاطمة', symbol: <Hand size="1em" strokeWidth={1.5} />, meaning: 'Protection layered across Phoenician, Jewish, Islamic traditions', meaningAr: 'حماية متقاطعة عبر التقاليد الفينيقية واليهودية والإسلامية', significance: 'HIGH' },
  { id: 's3', hall: 4, category: 'Royal', categoryAr: 'ملكي', period: 'Various', periodAr: 'مختلف', civilization: 'Gulf States', civilizationAr: 'دول الخليج', year: '2000 BCE+', yearAr: '2000 ق.م+', region: 'Arabian Peninsula', regionAr: 'شبه الجزيرة العربية', name: 'The Falcon', arabic: 'الصقر الملكي', symbol: <Bird size="1em" strokeWidth={1.5} />, meaning: 'Power, vision, loyalty — UAE national bird', meaningAr: 'القوة، الرؤية، الولاء — الطائر الوطني للإمارات', significance: 'HIGH' },
  { id: 's4', hall: 4, category: 'Architectural', categoryAr: 'معماري', period: 'Islamic Golden Age', periodAr: 'العصر الذهبي', civilization: 'Abbasid/Seljuk', civilizationAr: 'عباسية/سلجوقية', year: '900–1300 CE', yearAr: '900-1300 م', region: 'Iraq, Iran, Spain', regionAr: 'العراق، إيران، إسبانيا', name: 'Arabesque — Infinite Pattern', arabic: 'الأرابيسك اللانهائي', symbol: '❋', meaning: 'Infinite geometry mirroring the infinite nature of God', meaningAr: 'هندسة لانهائية تعكس الطبيعة اللانهائية لله', significance: 'CRITICAL' },
  { id: 'm1', hall: 6, category: 'Medical', categoryAr: 'طبي', period: 'Classical Islamic', periodAr: 'الإسلامي الكلاسيكي', civilization: 'Persian-Islamic', civilizationAr: 'فارسية إسلامية', year: '1025 CE', yearAr: '1025 م', region: 'Isfahan, Persia', regionAr: 'أصفهان، فارس', name: 'Al-Qanun fi al-Tibb', arabic: 'القانون في الطب', symbol: <ScrollText size="1em" strokeWidth={1.5} />, meaning: "Avicenna's Canon — used in European universities until 1650", meaningAr: 'قانون ابن سينا — استُخدم في جامعات أوروبا حتى 1650', significance: 'CRITICAL' },
  { id: 'm2', hall: 6, category: 'Literary', categoryAr: 'أدبي', period: 'Classical Islamic', periodAr: 'الإسلامي الكلاسيكي', civilization: 'Abbasid', civilizationAr: 'عباسية', year: '1237 CE', yearAr: '1237 م', region: 'Baghdad, Iraq', regionAr: 'بغداد، العراق', name: 'Maqamat al-Hariri', arabic: 'مقامات الحريري', symbol: <ScrollText size="1em" strokeWidth={1.5} />, meaning: 'Finest illustrated Arabic manuscript — Al-Wasiti miniatures', meaningAr: 'أفضل مخطوطة عربية مصورة — منمنمات الواسطي', significance: 'CRITICAL' },
  { id: 'm3', hall: 6, category: 'Astronomical', categoryAr: 'فلكي', period: 'Classical Islamic', periodAr: 'الإسلامي الكلاسيكي', civilization: 'Persian-Islamic', civilizationAr: 'فارسية إسلامية', year: '964 CE', yearAr: '964 م', region: 'Isfahan', regionAr: 'أصفهان', name: 'Book of Fixed Stars', arabic: 'كتاب صور الكواكب', symbol: <Star size="1em" fill="currentColor" strokeWidth={1.5} />, meaning: 'First description of Andromeda Galaxy — 200+ modern star names', meaningAr: 'أول وصف لمجرة أندروميدا — أكثر من 200 اسم نجم حديث', significance: 'CRITICAL' },
  { id: 'm4', hall: 6, category: 'Philosophy', categoryAr: 'فلسفي', period: 'Late Islamic', periodAr: 'الإسلامي المتأخر', civilization: 'North African', civilizationAr: 'شمال أفريقيا', year: '1377 CE', yearAr: '1377 م', region: 'Tunis/Cairo', regionAr: 'تونس/القاهرة', name: 'Al-Muqaddimah — Ibn Khaldun', arabic: 'المقدمة', symbol: <ScrollText size="1em" strokeWidth={1.5} />, meaning: "Ibn Khaldun's invention of sociology — 500 years before Weber", meaningAr: 'اختراع ابن خلدون لعلم الاجتماع — قبل فيبر بـ 500 عام', significance: 'CRITICAL' },
  { id: 'm5', hall: 6, category: 'Cartography', categoryAr: 'خرائط', period: 'Medieval Islamic', periodAr: 'الإسلامي الوسيط', civilization: 'Sicilian-Islamic', civilizationAr: 'صقلية إسلامية', year: '1154 CE', yearAr: '1154 م', region: 'Palermo', regionAr: 'باليرمو', name: 'Al-Idrisi World Map', arabic: 'خريطة الإدريسي', symbol: <Map size="1em" strokeWidth={1.5} />, meaning: 'Most accurate medieval world map — 300 years ahead of Europe', meaningAr: 'أدق خريطة للعالم في العصور الوسطى — تسبق أوروبا بـ 300 عام', significance: 'CRITICAL' },
  { id: 'ai1', hall: 7, category: 'Technology', categoryAr: 'تكنولوجيا', period: 'Present', periodAr: 'الحاضر', civilization: 'Global', civilizationAr: 'عالمي', year: '2024–2026', yearAr: '2024-2026', region: 'Digital', regionAr: 'رقمي', name: 'Symbol Recognition AI', arabic: 'الذكاء التعرف على الرموز', symbol: '◎', meaning: 'Computer vision trained on 12,000+ Arabic symbols', meaningAr: 'رؤية حاسوبية مدربة على أكثر من 12000 رمز عربي', significance: 'HIGH' },
];

const HALL_ICONS: Record<number, React.ComponentType<any>> = { 1: Landmark, 2: Moon, 3: Lock, 4: Layers, 5: Languages, 6: ScrollText, 7: Brain };
const HALL_COLORS: Record<number, string> = { 1: '#8B6914', 2: '#1a6a4a', 3: '#3a3a8a', 4: '#6a2a8a', 5: '#2a6a2a', 6: '#7a4a1a', 7: '#1a4a7a' };
const CATEGORIES = Array.from(new Set(ALL_ITEMS.map(i => i.category)));

interface Props { onBack: () => void; onGoToHall: (id: number) => void; }

export default function CollectionsPage({ onBack, onGoToHall }: Props) {
  const { t, isAr } = useLanguage();
  const [search, setSearch] = useState('');
  const [activeHall, setActiveHall] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'hall' | 'name' | 'year'>('hall');
  const [selected, setSelected] = useState<typeof ALL_ITEMS[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  let items = [...ALL_ITEMS];
  if (activeHall) items = items.filter(i => i.hall === activeHall);
  if (activeCategory) items = items.filter(i => i.category === activeCategory);
  if (search.trim()) items = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.arabic.includes(search) ||
    i.meaning.toLowerCase().includes(search.toLowerCase()) ||
    i.civilization.toLowerCase().includes(search.toLowerCase())
  );
  items.sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : sortBy === 'year' ? (parseInt(a.year) || 0) - (parseInt(b.year) || 0) : a.hall - b.hall);

  return (
    <motion.div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0D1117 0%, #062B24 60%)', color: '#F8F4EA' }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
      <IslamicGeometry opacity={0.07} patternId="col-geo" />
      <ParticleField count={25} color="#D4AF37" />

      {/* Topbar */}
      <div style={{ position: 'relative', zIndex: 50, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, paddingTop: 'calc(10px + env(safe-area-inset-top))', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px', background: 'rgba(6,43,36,0.95)', borderBottom: '1px solid rgba(212,175,55,0.15)', backdropFilter: 'blur(20px)', flexWrap: 'wrap', direction: isAr ? 'rtl' : 'ltr' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 4, color: '#D4AF37', cursor: 'pointer', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.72rem', flexShrink: 0 }}>
          <ArrowLeft size={13} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} /> {isAr ? 'العودة' : 'Back'}
        </button>
        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1rem', color: '#D4AF37', flex: 1, textAlign: isAr ? 'right' : 'left' }}>
          {isAr ? 'المجموعات' : 'Collections'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, padding: '6px 12px', flex: 1, maxWidth: 320 }}>
          <Search size={13} color="#D4AF37" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={isAr ? "ابحث عن الرموز، الحضارات..." : "Search symbols, civilizations..."}
            style={{ background: 'none', border: 'none', outline: 'none', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#F8F4EA', width: '100%', direction: isAr ? 'rtl' : 'ltr' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#C7C3B9', cursor: 'pointer', display: 'flex' }}><X size={12} /></button>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: showFilters ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showFilters ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.2)'}`, borderRadius: 4, color: '#D4AF37', cursor: 'pointer', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.72rem', flexShrink: 0 }}>
          <Filter size={13} /> {isAr ? 'التصفية' : 'Filter'} {(activeHall || activeCategory) ? '●' : ''}
        </button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', flexShrink: 0, background: 'rgba(6,43,36,0.85)', borderBottom: '1px solid rgba(212,175,55,0.12)', padding: '14px 20px', position: 'relative', zIndex: 40 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center', direction: isAr ? 'rtl' : 'ltr' }}>
              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', letterSpacing: '0.1em' }}>{isAr ? 'القاعة' : 'Hall'}</span>
              <button onClick={() => setActiveHall(null)} style={{ padding: '3px 10px', background: !activeHall ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.04)', border: `1px solid ${!activeHall ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.12)'}`, borderRadius: 20, cursor: 'pointer', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: !activeHall ? '#D4AF37' : '#C7C3B9' }}>{isAr ? 'الكل' : 'All'}</button>
              {[1,2,3,4,5,6,7].map(h => {
                const HIcon = HALL_ICONS[h];
                return (
                  <button key={h} onClick={() => setActiveHall(activeHall === h ? null : h)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: activeHall === h ? `${HALL_COLORS[h]}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${activeHall === h ? HALL_COLORS[h] : 'rgba(212,175,55,0.12)'}`, borderRadius: 20, cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.65rem', color: activeHall === h ? HALL_COLORS[h] : '#C7C3B9' }}>
                    <HIcon size={11} /> {h}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', direction: isAr ? 'rtl' : 'ltr' }}>
              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', letterSpacing: '0.1em' }}>{isAr ? 'الفئة' : 'Category'}</span>
              {['All', ...CATEGORIES].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat === 'All' ? null : cat)}
                  style={{ padding: '2px 8px', background: (cat === 'All' && !activeCategory) || activeCategory === cat ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${(cat === 'All' && !activeCategory) || activeCategory === cat ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.1)'}`, borderRadius: 20, cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.62rem', color: (cat === 'All' && !activeCategory) || activeCategory === cat ? '#D4AF37' : '#C7C3B9' }}>
                  {cat === 'All' ? (isAr ? 'الكل' : 'All') : cat}
                </button>
              ))}
              <div style={{ marginInlineEnd: 'auto', display: 'flex', gap: 4 }}>
                <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#C7C3B9' }}>{isAr ? 'فرز:' : 'Sort:'}</span>
                {(['hall', 'name', 'year'] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)} style={{ padding: '2px 7px', background: sortBy === s ? 'rgba(212,175,55,0.15)' : 'none', border: `1px solid ${sortBy === s ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.1)'}`, borderRadius: 4, cursor: 'pointer', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: sortBy === s ? '#D4AF37' : '#C7C3B9', textTransform: 'capitalize' }}>
                    {isAr ? (s === 'hall' ? 'القاعة' : s === 'name' ? 'الاسم' : 'السنة') : s}
                  </button>
                ))}
              </div>
            </div>
            {(activeHall || activeCategory) && (
              <button onClick={() => { setActiveHall(null); setActiveCategory(null); }} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', marginTop: 8 }}>
                <X size={11} /> {isAr ? 'مسح التصفية' : 'Clear Filters'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div style={{ flexShrink: 0, padding: '8px 20px', background: 'rgba(13,17,23,0.5)', borderBottom: '1px solid rgba(212,175,55,0.08)', display: 'flex', gap: 16, alignItems: 'center', position: 'relative', zIndex: 30, direction: isAr ? 'rtl' : 'ltr' }}>
        <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9' }}>{items.length} {isAr ? 'عناصر' : 'items'}</span>
        {activeHall && <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: HALL_COLORS[activeHall], background: `${HALL_COLORS[activeHall]}18`, border: `1px solid ${HALL_COLORS[activeHall]}44`, borderRadius: 10, padding: '1px 8px' }}>{isAr ? 'قاعة' : 'Hall'} {activeHall}</span>}
        <div style={{ display: 'flex', gap: 16, marginInlineStart: 'auto' }}>
          {(isAr ? [['+٢٥', 'أثر'], ['١٠', 'مخطوطة'], ['+٣٠', 'رمز']] : [['25+', 'Artifacts'], ['10', 'Manuscripts'], ['30+', 'Symbols']]).map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.95rem', color: '#D4AF37' }}>{v}</span>
              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: '#C7C3B9', marginInlineStart: 4 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', position: 'relative', zIndex: 20 }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', direction: isAr ? 'rtl' : 'ltr' }}>
            <Search size={48} color="rgba(212,175,55,0.2)" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', color: '#C7C3B9', fontSize: '1.1rem' }}>{isAr ? 'لا توجد عناصر تطابق التصفية' : 'No items match filters'}</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, maxWidth: 1200, margin: '0 auto' }}>
            {items.map((item, i) => {
              const HIcon = HALL_ICONS[item.hall];
              const hColor = HALL_COLORS[item.hall];
              return (
                <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -4, boxShadow: `0 12px 40px ${hColor}18` }} onClick={() => setSelected(item)}
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${hColor}22`, borderRadius: 10, padding: '18px', cursor: 'pointer', transition: 'box-shadow 0.3s', position: 'relative' }}>
                  {item.significance === 'CRITICAL' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${hColor}, transparent)` }} />}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, direction: isAr ? 'rtl' : 'ltr' }}>
                    <div style={{ fontSize: '2rem', lineHeight: 1 }}>{item.symbol}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.88rem', color: '#F8F4EA', lineHeight: 1.3 }}>{isAr ? item.arabic : item.name}</div>
                      <div style={{ fontFamily: isAr ? '"Playfair Display"' : '"IBM Plex Sans Arabic"', fontSize: '0.72rem', color: hColor, direction: isAr ? 'ltr' : 'rtl' }}>{isAr ? item.name : item.arabic}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, direction: isAr ? 'rtl' : 'ltr' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#C7C3B9' }}><Clock size={9} /> {isAr ? item.yearAr : item.year}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#C7C3B9' }}><MapPin size={9} /> {isAr ? item.regionAr : item.region}</span>
                  </div>
                  <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: 'rgba(199,195,185,0.75)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 10, direction: isAr ? 'rtl' : 'ltr' }}>{isAr ? item.meaningAr : item.meaning}</p>
                  <div style={{ display: 'flex', gap: 5, direction: isAr ? 'rtl' : 'ltr' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: `${hColor}15`, border: `1px solid ${hColor}33`, borderRadius: 10, padding: '2px 7px' }}>
                      <HIcon size={9} color={hColor} />
                      <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.58rem', color: hColor }}>{isAr ? 'قاعة' : 'Hall'} {item.hall}</span>
                    </div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.58rem', color: '#8B6914', background: 'rgba(139,105,20,0.12)', border: '1px solid rgba(139,105,20,0.25)', borderRadius: 10, padding: '2px 7px' }}>{isAr ? item.categoryAr : item.category}</div>
                    {item.significance === 'CRITICAL' && <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.55rem', color: '#D4AF37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 10, padding: '1px 6px' }}>{isAr ? 'نادر' : 'RARE'}</div>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.9)', zIndex: 200, backdropFilter: 'blur(15px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={e => e.stopPropagation()}
              style={{ background: `linear-gradient(135deg, ${HALL_COLORS[selected.hall]}18, #0D1117)`, border: `1px solid ${HALL_COLORS[selected.hall]}55`, borderRadius: 14, padding: '36px', maxWidth: 560, width: '100%', position: 'relative' }}>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#C7C3B9', cursor: 'pointer' }}><X size={18} /></button>
              <div style={{ fontSize: '4.5rem', textAlign: 'center', marginBottom: 16 }}>{selected.symbol}</div>
              <div style={{ textAlign: 'center', marginBottom: 22, direction: isAr ? 'rtl' : 'ltr' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.5rem', color: HALL_COLORS[selected.hall], marginBottom: 4 }}>{isAr ? selected.arabic : selected.name}</div>
                <div style={{ fontFamily: isAr ? '"Playfair Display"' : '"IBM Plex Sans Arabic"', fontSize: '1.1rem', color: '#F0D98A', direction: isAr ? 'ltr' : 'rtl' }}>{isAr ? selected.name : selected.arabic}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18, direction: isAr ? 'rtl' : 'ltr' }}>
                {(isAr ? [
                  ['الفترة', selected.periodAr], ['السنة', selected.yearAr], ['الحضارة', selected.civilizationAr], ['المنطقة', selected.regionAr], ['الفئة', selected.categoryAr], ['القاعة', `قاعة ${selected.hall}`]
                ] : [
                  ['Period', selected.period], ['Year', selected.year], ['Civilization', selected.civilization], ['Region', selected.region], ['Category', selected.category], ['Hall', `Hall ${selected.hall}`]
                ]).map(([l, v]) => (
                  <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${HALL_COLORS[selected.hall]}22`, borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.58rem', color: '#C7C3B9', marginBottom: 3 }}>{l}</div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#F8F4EA' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${HALL_COLORS[selected.hall]}22`, borderRadius: 8, padding: '14px', marginBottom: 16, direction: isAr ? 'rtl' : 'ltr' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: HALL_COLORS[selected.hall], marginBottom: 8 }}>{isAr ? 'المعنى الرمزي' : 'Symbolic Meaning'}</div>
                <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.88rem', color: '#F8F4EA', lineHeight: 1.75 }}>{isAr ? selected.meaningAr : selected.meaning}</p>
              </div>
              <button onClick={() => { onGoToHall(selected.hall); setSelected(null); }}
                style={{ width: '100%', padding: '11px', background: `linear-gradient(135deg, ${HALL_COLORS[selected.hall]}, ${HALL_COLORS[selected.hall]}88)`, border: 'none', borderRadius: 8, color: '#F8F4EA', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', direction: isAr ? 'rtl' : 'ltr' }}>
                {isAr ? `عرض في القاعة ${selected.hall} ←` : `View in Hall ${selected.hall} →`}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
