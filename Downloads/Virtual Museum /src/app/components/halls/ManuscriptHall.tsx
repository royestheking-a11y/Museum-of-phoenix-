import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, ZoomOut, RotateCcw, Bookmark, Download, Share2, ChevronLeft, ChevronRight, ScrollText, X, BookOpen, Globe, FlaskConical } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
export const manuscripts = [
  {
    id: 1, title: 'Kitab al-Aghani', titleAr: 'كتاب الأغاني', arabic: 'كتاب الأغاني', author: 'Abu al-Faraj al-Isfahani', authorArabic: 'أبو الفرج الأصفهاني', year: '967 CE', region: 'Baghdad, Iraq', regionAr: 'بغداد، العراق', language: 'Classical Arabic', languageAr: 'عربي فصحى', pages: 24, type: 'Music & Poetry Anthology', typeAr: 'مقتطفات موسيقى وشعر', century: '10th',
    description: 'A monumental 21-volume encyclopedia of Arabic poetry and music spanning Islamic history from pre-Islamic times to the 10th century. Contains accounts of over 10,000 songs and their poets, making it the definitive record of Arab musical culture.',
    descriptionAr: 'موسوعة ضخمة من 21 مجلدا للشعر والموسيقى العربية تغطي التاريخ الإسلامي من عصور ما قبل الإسلام حتى القرن العاشر. تحتوي على روايات عن أكثر من 10000 أغنية وشعرائها، مما يجعلها السجل النهائي للثقافة الموسيقية العربية.',
    significance: 'Considered the most comprehensive record of Arab cultural life ever written. Scholars still cite it as a primary source for understanding Abbasid court culture.',
    significanceAr: 'يعتبر السجل الأكثر شمولاً للحياة الثقافية العربية الذي كُتب على الإطلاق. لا يزال العلماء يستشهدون به كمصدر أساسي لفهم ثقافة البلاط العباسي.',
    img: 'https://images.unsplash.com/photo-1720701574998-d68020bce2bd?w=800&q=80',
    annotations: ['Gold illumination border — hallmark of Abbasid court patronage', 'Naskh script — newly standardized in 10th-century Baghdad', 'Colophon seal identifies the royal library of the Hamdanid court', 'Red and gold ink hierarchy: red for poet names, black for verse'],
    annotationsAr: ['حواف مزخرفة بالذهب — سمة مميزة لرعاية البلاط العباسي', 'خط النسخ — تم توحيده حديثا في بغداد في القرن العاشر', 'ختم الكولوفون يحدد المكتبة الملكية للبلاط الحمداني', 'تدرج الحبر الأحمر والذهبي: أحمر لأسماء الشعراء، أسود للشعر'],
    tags: ['music', 'poetry', 'abbasid', 'culture'],
  },
  {
    id: 2, title: 'Al-Qanun fi al-Tibb', titleAr: 'القانون في الطب', arabic: 'القانون في الطب', author: 'Ibn Sina (Avicenna)', authorArabic: 'ابن سينا', year: '1025 CE', region: 'Isfahan, Persia', regionAr: 'أصفهان، بلاد فارس', language: 'Classical Arabic', languageAr: 'عربي فصحى', pages: 31, type: 'Medical Encyclopedia', typeAr: 'موسوعة طبية', century: '11th',
    description: 'The Canon of Medicine — five volumes containing the definitive medieval synthesis of Greek, Islamic, Indian, and Chinese medical knowledge. Avicenna described the germ theory of disease and contagion 800 years before Pasteur.',
    descriptionAr: 'القانون في الطب - خمسة مجلدات تحتوي على التوليفة النهائية في العصور الوسطى للمعرفة الطبية اليونانية والإسلامية والهندية والصينية. وصف ابن سينا نظرية الجراثيم للأمراض والعدوى قبل باستير بـ 800 عام.',
    significance: 'Used as the primary medical textbook in European universities including Montpellier and Padua until the mid-17th century. Translated into Latin in 12th century.',
    significanceAr: 'استخدم ككتاب طبي أساسي في الجامعات الأوروبية بما في ذلك مونبلييه وبادوا حتى منتصف القرن السابع عشر. تمت ترجمته إلى اللاتينية في القرن الثاني عشر.',
    img: 'https://images.unsplash.com/photo-1720701575003-51dafcf39cb4?w=800&q=80',
    annotations: ['Anatomical diagrams show advanced physiological knowledge', 'Persian miniature illustrations added by later Central Asian copyists', 'Glosses in Syriac, Hebrew, and Latin visible in the margins', 'Page organization: topic in red, explanation in black — a publishing innovation'],
    annotationsAr: ['تظهر المخططات التشريحية معرفة فسيولوجية متقدمة', 'الرسوم التوضيحية المصغرة الفارسية المضافة من قبل نساخ آسيويين لاحقين', 'حواشي بالسريانية والعبرية واللاتينية مرئية في الهوامش', 'تنظيم الصفحة: الموضوع باللون الأحمر، الشرح باللون الأسود - ابتكار في النشر'],
    tags: ['medicine', 'avicenna', 'science', 'persian'],
  },
  {
    id: 3, title: 'Maqamat al-Hariri', titleAr: 'مقامات الحريري', arabic: 'مقامات الحريري', author: 'Al-Hariri of Basra', authorArabic: 'الحريري البصري', year: '1237 CE', region: 'Baghdad (Al-Wasiti illumination)', regionAr: 'بغداد (إضاءة الواسطي)', language: 'Classical Arabic', languageAr: 'عربي فصحى', pages: 50, type: 'Literary Masterpiece', typeAr: 'تحفة أدبية', century: '13th',
    description: 'One of the greatest masterworks of Arabic literature — 50 rhymed prose tales following the rogue Abu Zayd. The 1237 Baghdad copy by Yahya al-Wasiti is universally considered the finest illustrated Arabic manuscript in existence.',
    descriptionAr: 'واحدة من أعظم روائع الأدب العربي - 50 حكاية نثرية مقفاة تتبع المحتال أبو زيد. تعتبر نسخة بغداد لعام 1237 ليحيى الواسطي عالميًا أفضل مخطوطة عربية مصورة موجودة.',
    significance: 'Al-Wasiti\'s miniatures are the most important surviving examples of 13th-century Iraqi painting, documenting Abbasid court life, markets, mosques, and society months before the Mongol sack of Baghdad.',
    significanceAr: 'تعتبر منمنمات الواسطي أهم الأمثلة الباقية للرسم العراقي في القرن الثالث عشر، حيث توثق حياة البلاط العباسي والأسواق والمساجد والمجتمع قبل أشهر من نهب المغول لبغداد.',
    img: 'https://images.unsplash.com/photo-1696513553729-17129c427356?w=800&q=80',
    annotations: ["Al-Wasiti's signature appears in six of the 99 miniatures", 'Rhetorical wordplay is encoded in the margin symbol system', 'The lapis lazuli blue was imported from Afghanistan — worth more than gold', 'Lacquered binding in Persian tradition shows multicultural patronage'],
    annotationsAr: ['يظهر توقيع الواسطي في ست من المنمنمات الـ 99', 'التلاعب اللفظي البلاغي مشفر في نظام رموز الهامش', 'اللون الأزرق اللازوردي تم استيراده من أفغانستان - أغلى من الذهب', 'يظهر التجليد المطلي بالورنيش في التقاليد الفارسية رعاية متعددة الثقافات'],
    tags: ['literature', 'illustration', 'abbasid', 'painting'],
  },
  {
    id: 4, title: 'Kitab Suwar al-Kawakib', titleAr: 'كتاب صور الكواكب الثابتة', arabic: 'كتاب صور الكواكب الثابتة', author: 'Abd al-Rahman al-Sufi', authorArabic: 'عبد الرحمن الصوفي', year: '964 CE', region: 'Isfahan, Persia', regionAr: 'أصفهان، بلاد فارس', language: 'Classical Arabic', languageAr: 'عربي فصحى', pages: 18, type: 'Astronomical Atlas', typeAr: 'أطلس فلكي', century: '10th',
    description: 'Book of Fixed Stars — 48 constellation maps with Arabic star names, recorded with unprecedented accuracy. Over 200 modern star names including Aldebaran, Vega, Rigel, Fomalhaut, and Deneb are direct Arabic transcriptions from this manuscript.',
    descriptionAr: 'كتاب صور الكواكب الثابتة - 48 خريطة كوكبية مع أسماء النجوم العربية، مسجلة بدقة غير مسبوقة. أكثر من 200 اسم حديث للنجوم بما في ذلك الدبران والنسر الواقع ورجل الجبار وفم الحوت وذنب الدجاجة هي ترجمات عربية مباشرة من هذه المخطوطة.',
    significance: 'The Oxford MS Marsh 144 copy (1009 CE) is the oldest surviving illustrated Islamic manuscript. Al-Sufi first described what is now known as the Andromeda Galaxy — the first record of any object beyond the Milky Way.',
    significanceAr: 'نسخة أكسفورد (1009 م) هي أقدم مخطوطة إسلامية مصورة باقية. وصف الصوفي لأول مرة ما يُعرف الآن بمجرة أندروميدا - وهو أول سجل لأي جسم خارج درب التبانة.',
    img: 'https://images.unsplash.com/photo-1564547889147-caa58fd02c0d?w=800&q=80',
    annotations: ['Star positions recorded to 1/6 degree accuracy without telescopes', 'Constellation figures drawn in both Arabic and Greek conventions', 'Arabic star names became the foundation of modern astronomical nomenclature', 'Andromeda Galaxy described as "small cloud" — first extragalactic observation in history'],
    annotationsAr: ['مواقع النجوم مسجلة بدقة 1/6 درجة بدون تلسكوبات', 'أشكال الكوكبات مرسومة بالتقاليد العربية واليونانية معًا', 'أصبحت أسماء النجوم العربية أساس التسمية الفلكية الحديثة', 'مجرة أندروميدا الموصوفة بـ "سحابة صغيرة" - أول ملاحظة خارج المجرة في التاريخ'],
    tags: ['astronomy', 'stars', 'science', 'persian'],
  },
  {
    id: 5, title: 'Kitab al-Hiyal (Book of Ingenious Devices)', titleAr: 'كتاب الحيل', arabic: 'كتاب الحيل', author: 'Al-Jazari', authorArabic: 'إسماعيل بن الرزاز الجزري', year: '1206 CE', region: 'Diyarbakır, Anatolia', regionAr: 'ديار بكر، الأناضول', language: 'Classical Arabic', languageAr: 'عربي فصحى', pages: 35, type: 'Mechanical Engineering', typeAr: 'هندسة ميكانيكية', century: '13th',
    description: 'The most important mechanical engineering text of the medieval world — describes 100 machines including programmable robots, early crankshaft mechanisms, and water-raising devices. Al-Jazari is called the "father of modern engineering."',
    descriptionAr: 'أهم نص هندسي ميكانيكي في العالم في العصور الوسطى - يصف 100 آلة بما في ذلك الروبوتات القابلة للبرمجة، وآليات العمود المرفقي المبكرة، وأجهزة رفع المياه. يُطلق على الجزري لقب "أبو الهندسة الحديثة".',
    significance: 'The elephant clock, programmable musical robot, and camshaft-driven water pump described here are the direct ancestors of modern automation. Many devices were not reinvented in Europe for 500 years.',
    significanceAr: 'ساعة الفيل والروبوت الموسيقي المبرمج ومضخة المياه المدفوعة بعمود الكامات الموصوفة هنا هي الأسلاف المباشرة للأتمتة الحديثة. لم يتم إعادة اختراع العديد من الأجهزة في أوروبا لمدة 500 عام.',
    img: 'https://images.unsplash.com/photo-1634630487525-84df162e5305?w=800&q=80',
    annotations: ["Al-Jazari's elephant clock used five different cultural motifs simultaneously", 'Detailed measurements are given to 1/16 of a cubit — extraordinary precision', 'Instructions are reproducible — designed as an engineering manual, not display', 'Color-coded diagrams: blue for water flow, red for moving parts'],
    annotationsAr: ['استخدمت ساعة فيل الجزري خمسة أشكال ثقافية مختلفة في وقت واحد', 'تم إعطاء قياسات تفصيلية بدقة 1/16 ذراع - دقة استثنائية', 'التعليمات قابلة للنسخ - مصممة كدليل هندسي وليس للعرض', 'مخططات مرمزة لونيًا: الأزرق لتدفق المياه، والأحمر للأجزاء المتحركة'],
    tags: ['engineering', 'machines', 'medieval', 'technology'],
  },
  {
    id: 6, title: 'Al-Muqaddimah', titleAr: 'المقدمة', arabic: 'المقدمة', author: 'Ibn Khaldun', authorArabic: 'ابن خلدون', year: '1377 CE', region: 'Tunis / Cairo', regionAr: 'تونس / القاهرة', language: 'Classical Arabic', languageAr: 'عربي فصحى', pages: 28, type: 'Philosophy of History', typeAr: 'فلسفة التاريخ', century: '14th',
    description: 'The greatest work of medieval Islamic scholarship — the prolegomena to Ibn Khaldun\'s universal history. Considered the first work of economics, sociology, and philosophy of history, it introduces the concept of \'asabiyyah (social cohesion).',
    descriptionAr: 'أعظم عمل في المنح الدراسية الإسلامية في العصور الوسطى - مقدمة لتاريخ ابن خلدون العالمي. يُعتبر أول عمل في الاقتصاد وعلم الاجتماع وفلسفة التاريخ، ويقدم مفهوم العصبية (التماسك الاجتماعي).',
    significance: 'Arnold Toynbee called it "the greatest work of its kind that has ever yet been created by any mind in any time or place." Ibn Khaldun predicted the rise and fall of civilizations through quantifiable social cycles — 500 years before Max Weber.',
    significanceAr: 'أسماها أرنولد توينبي "أعظم عمل من نوعه أبدعه أي عقل في أي زمان أو مكان". تنبأ ابن خلدون بصعود وسقوط الحضارات من خلال دورات اجتماعية قابلة للقياس الكمي - 500 عام قبل ماكس ويبر.',
    img: 'https://images.unsplash.com/photo-1720701574998-d68020bce2bd?w=800&q=80',
    annotations: ["Ibn Khaldun's theory of 'asabiyyah (group feeling) is the first sociological model", 'Economic theory of supply, demand, and labor value predates Adam Smith by 400 years', 'Cyclical theory of civilization: nomad → city → decay → nomad', 'Contains the first demographic analysis — population census theory'],
    annotationsAr: ['نظرية ابن خلدون في العصبية (الشعور الجماعي) هي النموذج السوسيولوجي الأول', 'النظرية الاقتصادية للعرض والطلب وقيمة العمل تسبق آدم سميث بـ 400 عام', 'النظرية الدورية للحضارة: بدو ← مدينة ← اضمحلال ← بدو', 'يحتوي على التحليل الديموغرافي الأول - نظرية التعداد السكاني'],
    tags: ['history', 'sociology', 'economics', 'north africa'],
  },
  {
    id: 7, title: 'Rihla of Ibn Battuta', titleAr: 'رحلة ابن بطوطة', arabic: 'رحلة ابن بطوطة', author: 'Ibn Battuta', authorArabic: 'أبو عبدالله محمد ابن بطوطة', year: '1355 CE', region: 'Tangier / Morocco', regionAr: 'طنجة / المغرب', language: 'Classical Arabic', languageAr: 'عربي فصحى', pages: 22, type: 'Travel Literature', typeAr: 'أدب الرحلات', century: '14th',
    description: 'The greatest medieval travel narrative — covering 75,000 miles across Africa, the Middle East, India, Southeast Asia, and China over 29 years. Ibn Battuta visited more of the known world than any person of his age.',
    descriptionAr: 'أعظم سرد رحلات في العصور الوسطى - غطت 75 ألف ميل عبر إفريقيا والشرق الأوسط والهند وجنوب شرق آسيا والصين على مدار 29 عامًا. زار ابن بطوطة أكثر أجزاء العالم المعروفة من أي شخص في عصره.',
    significance: 'Provides the only eyewitness account of the Black Death\'s impact on Alexandria, the pre-Ming Chinese court, 14th-century Mali Empire, and dozens of societies never otherwise documented. Dictated in Fez to Ibn Juzayy.',
    significanceAr: 'يُقدم الشاهد العيان الوحيد على تأثير الموت الأسود في الإسكندرية، والبلاط الصيني قبل المينغ، وإمبراطورية مالي في القرن الرابع عشر، وعشرات المجتمعات التي لم يتم توثيقها بطريقة أخرى.',
    img: 'https://images.unsplash.com/photo-1720701575003-51dafcf39cb4?w=800&q=80',
    annotations: ['Dictated from memory 29 years after travels began — extraordinary recall', "Contains the only Islamic description of the Maldives' matriarchal society", 'First Arabic account of Chinese porcelain manufacturing', 'Describes sub-Saharan Africa in unprecedented detail — 120 years before Portuguese'],
    annotationsAr: ['أُملي من الذاكرة بعد 29 عامًا من بدء الرحلات - ذاكرة استثنائية', 'يحتوي على الوصف الإسلامي الوحيد لمجتمع جزر المالديف الأمومي', 'أول رواية عربية عن صناعة الخزف الصيني', 'يصف أفريقيا جنوب الصحراء الكبرى بتفاصيل غير مسبوقة - قبل 120 عامًا من البرتغاليين'],
    tags: ['travel', 'africa', 'asia', 'exploration'],
  },
  {
    id: 8, title: 'Tabula Rogeriana (Al-Idrisi World Map)', titleAr: 'خريطة الإدريسي', arabic: 'خريطة الإدريسي', author: 'Muhammad al-Idrisi', authorArabic: 'محمد الإدريسي', year: '1154 CE', region: 'Palermo, Sicily', regionAr: 'باليرمو، صقلية', language: 'Arabic + Latin', languageAr: 'عربي + لاتيني', pages: 12, type: 'Cartography', typeAr: 'علم الخرائط', century: '12th',
    description: 'The most accurate world map of the medieval period — compiled for Norman King Roger II of Sicily. Al-Idrisi combined Islamic geographic knowledge with Greek Ptolemaic tradition, producing a map that was used for 300 years.',
    descriptionAr: 'أدق خريطة للعالم في فترة العصور الوسطى - جُمعت للملك النورماندي روجر الثاني ملك صقلية. جمع الإدريسي المعرفة الجغرافية الإسلامية مع التقاليد البطلمية اليونانية، وأنتج خريطة استخدمت لمدة 300 عام.',
    significance: 'Oriented with south at the top (Islamic convention), it correctly shows Africa as a southward-tapering continent — 300 years before Vasco da Gama proved it. More geographically accurate than any European map until the 16th century.',
    significanceAr: 'موجّهة مع الجنوب في الأعلى (المعاهدة الإسلامية)، تظهر إفريقيا بشكل صحيح كقارة تتناقص تدريجياً باتجاه الجنوب - 300 عام قبل أن يثبت ذلك فاسكو دا غاما. أكثر دقة جغرافية من أي خريطة أوروبية حتى القرن السادس عشر.',
    img: 'https://images.unsplash.com/photo-1696513553729-17129c427356?w=800&q=80',
    annotations: ['70 regional maps combine to form a 3-meter wide planisphere', 'Shows the sources of the Nile in the Mountains of the Moon', 'Produced in a unique cross-cultural court of Muslims, Christians, and Jews', 'Describes the Earth as "round like a sphere" and calculates its circumference'],
    annotationsAr: ['تتحد 70 خريطة إقليمية لتشكل خريطة كروية بعرض 3 أمتار', 'تُظهر منابع النيل في جبال القمر', 'تم إنتاجها في بلاط ثقافي فريد من المسلمين والمسيحيين واليهود', 'تصف الأرض بأنها "مستديرة كالكرة" وتحسب محيطها'],
    tags: ['geography', 'maps', 'sicily', 'science'],
  }
];


const TYPE_COLORS: Record<string, string> = {
  'Music & Poetry Anthology': '#8B6914',
  'Medical Encyclopedia': '#1a6a4a',
  'Literary Masterpiece': '#4a1a5a',
  'Astronomical Atlas': '#1a3a6a',
  'Mechanical Engineering': '#5a3a1a',
  'Philosophy of History': '#3a3a1a',
  'Travel Literature': '#1a5a3a',
  'Cartography': '#1a3a5a',
  'Music Theory': '#4a2a6a',
  'Folk Literature Anthology': '#5a2a1a',
};

export default function ManuscriptHall() {
  const { isAr } = useLanguage();
  const [selected, setSelected] = useState<typeof manuscripts[0] | null>(null);
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const types = ['all', ...Array.from(new Set(manuscripts.map(m => m.type)))];
  let filtered = filter === 'all' ? manuscripts : manuscripts.filter(m => m.type === filter);
  if (search.trim()) filtered = filtered.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.arabic.includes(search) || m.author.toLowerCase().includes(search.toLowerCase()) || m.tags.some((t: string) => t.includes(search.toLowerCase())));

  const centuries = Array.from(new Set(manuscripts.map(m => m.century))).sort();

  return (
    <div style={{ height: '100%', overflowY: 'auto', color: '#F8F4EA', direction: isAr ? 'rtl' : 'ltr' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1720701574998-d68020bce2bd?w=1400&q=80" alt="Manuscript" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,17,23,0.3) 0%, rgba(13,17,23,0.9) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <motion.div animate={{ rotate: [0, -3, 3, 0] }} transition={{ duration: 5, repeat: Infinity }}>
            <ScrollText size={52} color="#D4AF37" style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.7))' }} />
          </motion.div>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: '#D4AF37', textShadow: '0 0 30px rgba(212,175,55,0.6)', textAlign: 'center' }}>{isAr ? 'خزينة المخطوطات النادرة' : 'Manuscript Vault'}</div>
          {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.1rem', color: '#F0D98A', direction: 'rtl' }}>خزينة المخطوطات النادرة</div>}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(isAr ? [['10', 'مخطوطات'], ['9-15', 'قرون'], ['12', 'علماء'], ['5', 'لغات']] : [['10', 'Manuscripts'], ['9th–15th', 'Centuries'], ['12', 'Scholars'], ['5', 'Languages']]).map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.2rem', color: '#D4AF37' }}>{val}</div>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: '#C7C3B9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
      </div>

      {/* Search + filters */}
      <div style={{ background: 'rgba(42,26,10,0.7)', padding: '14px 24px', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', direction: isAr ? 'rtl' : 'ltr' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={isAr ? "ابحث في المخطوطات، المؤلفين، القرون..." : "Search manuscripts, authors, centuries..."}
            style={{ flex: 1, minWidth: 200, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 6, color: '#F8F4EA', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', outline: 'none' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#C7C3B9', cursor: 'pointer' }}><X size={16} /></button>}
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ padding: '5px 12px', whiteSpace: 'nowrap', background: filter === t ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.04)', border: `1px solid ${filter === t ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.12)'}`, borderRadius: 20, cursor: 'pointer', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: filter === t ? '#D4AF37' : '#C7C3B9', flexShrink: 0 }}>
              {t === 'all' ? (isAr ? `الكل (${manuscripts.length})` : `All (${manuscripts.length})`) : (isAr ? manuscripts.find(m => m.type === t)?.typeAr || t : t)}
            </button>
          ))}
        </div>
      </div>

      {/* Century timeline */}
      <div style={{ padding: '12px 24px', background: 'rgba(13,17,23,0.6)', borderBottom: '1px solid rgba(212,175,55,0.08)', display: 'flex', gap: 4, alignItems: 'center', overflowX: 'auto' }}>
        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#C7C3B9', letterSpacing: '0.1em', textTransform: 'uppercase', margin: isAr ? '0 0 0 10px' : '0 10px 0 0', whiteSpace: 'nowrap' }}>{isAr ? 'حسب القرن:' : 'By Century:'}</div>
        {centuries.map(c => <button key={c} style={{ padding: '3px 10px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 10, fontFamily: 'Inter', fontSize: '0.65rem', color: '#D4AF37', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c}{isAr ? ' م' : ' CE'}</button>)}
      </div>

      {/* Grid */}
      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 16, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>{filtered.length} {isAr ? 'مخطوطات' : 'manuscripts'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {filtered.map((ms, i) => (
            <motion.div key={ms.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} onClick={() => { setSelected(ms); setZoom(1); setPage(1); }}
              style={{ background: 'rgba(42,26,10,0.6)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.3s' }}>
              <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
                <img src={ms.img} alt={ms.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.1)'; }}
                  onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(42,26,10,0.95) 100%)' }} />
                <div style={{ position: 'absolute', top: 10, [isAr ? 'left' : 'right']: 10, background: 'rgba(42,26,10,0.9)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 4, padding: '2px 8px', fontFamily: 'Inter', fontSize: '0.62rem', color: '#D4AF37' }}>{ms.year}</div>
                <div style={{ position: 'absolute', top: 10, [isAr ? 'right' : 'left']: 10, background: `${(TYPE_COLORS[ms.type] ?? '#8B6914')}22`, border: `1px solid ${(TYPE_COLORS[ms.type] ?? '#8B6914')}44`, borderRadius: 4, padding: '2px 8px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: TYPE_COLORS[ms.type] ?? '#8B6914' }}>{isAr ? ms.typeAr : ms.type}</div>
                <div style={{ position: 'absolute', bottom: 10, [isAr ? 'right' : 'left']: 12, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#C7C3B9' }}>{ms.pages} {isAr ? 'صحيفة' : 'folios'} · {isAr ? ms.regionAr : ms.region}</div>
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.95rem', color: '#F8F4EA', marginBottom: 3, lineHeight: 1.3 }}>{isAr ? ms.titleAr : ms.title}</div>
                {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.82rem', color: '#D4AF37', direction: 'rtl', marginBottom: 6 }}>{ms.arabic}</div>}
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: '#C7C3B9', marginBottom: 6 }}>{isAr ? 'بواسطة' : 'by'} {isAr ? ms.authorArabic : ms.author}</div>
                <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: 'rgba(199,195,185,0.7)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{isAr ? ms.significanceAr : ms.significance}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Viewer Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0" style={{ background: 'rgba(5,5,10,0.97)', zIndex: 100, backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'rgba(42,26,10,0.95)', borderBottom: '1px solid rgba(212,175,55,0.2)', flexWrap: 'wrap', gap: 8, direction: isAr ? 'rtl' : 'ltr' }}>
              <button onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 4, color: '#D4AF37', padding: '6px 12px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', cursor: 'pointer' }}>
                {isAr ? <ChevronRight size={13} /> : <ChevronLeft size={13} />} {isAr ? 'العودة للخزينة' : 'Back to Vault'}
              </button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.9rem', color: '#D4AF37' }}>{isAr ? selected.titleAr : selected.title}</div>
                {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.72rem', color: '#C7C3B9', direction: 'rtl' }}>{selected.arabic} — {selected.authorArabic}</div>}
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[{ icon: <ZoomOut size={14} />, action: () => setZoom(z => Math.max(0.5, z - 0.25)) }, { icon: <ZoomIn size={14} />, action: () => setZoom(z => Math.min(3, z + 0.25)) }, { icon: <RotateCcw size={14} />, action: () => setZoom(1) }, { icon: <Bookmark size={14} />, action: () => {} }, { icon: <Download size={14} />, action: () => {} }, { icon: <Share2 size={14} />, action: () => {} }].map((btn, i) => (
                  <button key={i} onClick={btn.action} style={{ width: 32, height: 32, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 4, color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{btn.icon}</button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
              {/* Image viewer */}
              <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: 16, minHeight: 300 }}>
                <motion.img src={selected.img} alt={selected.title}
                  style={{ maxWidth: Math.min(700, window.innerWidth - 32), maxHeight: '65vh', objectFit: 'contain', borderRadius: 4, boxShadow: '0 20px 80px rgba(0,0,0,0.8)', border: '2px solid rgba(212,175,55,0.3)', scale: zoom }}
                  transition={{ type: 'spring', stiffness: 200 }} />
              </div>

              {/* Metadata */}
              <div style={{ width: window.innerWidth < 768 ? '100%' : 320, background: 'rgba(42,26,10,0.9)', borderLeft: window.innerWidth >= 768 && !isAr ? '1px solid rgba(212,175,55,0.2)' : 'none', borderRight: window.innerWidth >= 768 && isAr ? '1px solid rgba(212,175,55,0.2)' : 'none', borderTop: window.innerWidth < 768 ? '1px solid rgba(212,175,55,0.2)' : 'none', display: 'flex', flexDirection: 'column', maxHeight: window.innerWidth < 768 ? 300 : undefined, direction: isAr ? 'rtl' : 'ltr' }}>
                <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#C7C3B9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>{isAr ? 'تفاصيل المخطوطة' : 'Manuscript Details'}</div>
                  {(isAr ? [['المؤلف', selected.authorArabic], ['المؤلف (انجليزي)', selected.author], ['السنة', selected.year], ['المنطقة', selected.regionAr], ['اللغة', selected.languageAr], ['النوع', selected.typeAr], ['الصفحات', `${selected.pages} صحيفة`]] : [['Author', selected.author], ['Author (Arabic)', selected.authorArabic], ['Year', selected.year], ['Region', selected.region], ['Language', selected.language], ['Type', selected.type], ['Pages', `${selected.pages} folios`]]).map(([l, v]) => (
                    <div key={l} style={{ marginBottom: 8, padding: '8px 10px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 5 }}>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.58rem', color: '#C7C3B9', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{l}</div>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.78rem', color: '#F8F4EA', direction: isAr && (l === 'السنة' || l === 'المؤلف (انجليزي)') ? 'ltr' : 'inherit', textAlign: isAr && (l === 'السنة' || l === 'المؤلف (انجليزي)') ? 'right' : 'left' }}>{v}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#D4AF37', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{isAr ? 'الوصف' : 'Description'}</div>
                    <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.76rem', color: '#C7C3B9', lineHeight: 1.65 }}>{isAr ? selected.descriptionAr : selected.description}</p>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#D4AF37', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{isAr ? 'الأهمية التاريخية' : 'Historical Significance'}</div>
                    <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.76rem', color: '#C7C3B9', lineHeight: 1.65 }}>{isAr ? selected.significanceAr : selected.significance}</p>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#D4AF37', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{isAr ? `توضيحات (${selected.annotationsAr.length})` : `Annotations (${selected.annotations.length})`}</div>
                    {(isAr ? selected.annotationsAr : selected.annotations).map((ann: string, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                        <div style={{ width: 18, height: 18, background: '#D4AF37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontSize: '0.58rem', color: '#0D1117', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9', lineHeight: 1.5 }}>{ann}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', gap: 8, direction: 'ltr' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} style={{ width: 28, height: 28, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 4, color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={12} /></button>
                  <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 4, height: 3 }}>
                    <div style={{ height: '100%', background: '#D4AF37', borderRadius: 4, width: `${(page / selected.pages) * 100}%`, transition: 'width 0.3s' }} />
                  </div>
                  <button onClick={() => setPage(p => Math.min(selected.pages, p + 1))} style={{ width: 28, height: 28, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 4, color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={12} /></button>
                  <div style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#C7C3B9', whiteSpace: 'nowrap' }}>{page}/{selected.pages}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
