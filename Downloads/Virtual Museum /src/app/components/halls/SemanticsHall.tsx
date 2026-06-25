import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

type Node = { arabic: string; transliteration: string; type: 'root' | 'noun' | 'verb' | 'adjective' | 'concept'; meaning: string; meaningAr: string; example?: string; exampleAr?: string; x: number; y: number; children?: string[] };
type Root = { id: string; root: string; arabic: string; transliteration: string; desc: string; descAr: string; color: string; meaning: string; meaningAr: string; nodes: Node[] };

const TYPE_COLORS = { root: '#D4AF37', noun: '#4a8aba', verb: '#4a8a4a', adjective: '#8a4a8a', concept: '#8a5a1a' };
const TYPE_LABELS = { root: 'Tri-Root', noun: 'Noun', verb: 'Verb', adjective: 'Adjective', concept: 'Concept' };
const TYPE_LABELS_AR = { root: 'جذر ثلاثي', noun: 'اسم', verb: 'فعل', adjective: 'صفة', concept: 'مفهوم' };

export const roots: Root[] = [
  {
    id: 'nur', root: 'ن-و-ر', arabic: 'ن-و-ر', transliteration: 'N-W-R', desc: 'The light family — one of the most theologically significant roots in Arabic', descAr: 'عائلة النور — من أهم الجذور اللاهوتية في اللغة العربية', color: '#D4AF37', meaning: 'Light, illumination, enlightenment', meaningAr: 'النور، الإضاءة، التنوير',
    nodes: [
      { arabic: 'ن-و-ر', transliteration: 'N-W-R', type: 'root', meaning: 'Triliteral root: light / illuminate', meaningAr: 'جذر ثلاثي: النور / الإضاءة', x: 50, y: 8, children: ['نُور', 'نَار', 'مِنَارَة', 'تَنْوِير', 'نُوراني', 'مُسْتَنِير', 'إِنَارَة', 'مِنْوَار'] },
      { arabic: 'نُور', transliteration: 'Nur', type: 'noun', meaning: 'Light (divine & physical) — most important form', meaningAr: 'النور (الإلهي والمادي) — الشكل الأهم', example: 'اللَّهُ نُورُ السَّمَاوَاتِ', exampleAr: 'اللَّهُ نُورُ السَّمَاوَاتِ', x: 50, y: 26, children: ['نُوراني', 'مُسْتَنِير'] },
      { arabic: 'نَار', transliteration: 'Naar', type: 'noun', meaning: 'Fire — same root, opposite element (light vs. burning)', meaningAr: 'النار — نفس الجذر، العنصر المعاكس (النور مقابل الحرق)', example: 'Mentioned 145 times in Quran', exampleAr: 'ذكرت 145 مرة في القرآن', x: 18, y: 44, children: [] },
      { arabic: 'مِنَارَة', transliteration: 'Manaara', type: 'noun', meaning: 'Minaret / lighthouse — place of light-giving', meaningAr: 'مئذنة / منارة — مكان العطاء الضوئي', example: 'Architectural origin of the word "minaret"', exampleAr: 'الأصل المعماري لكلمة "مئذنة"', x: 35, y: 44, children: [] },
      { arabic: 'تَنْوِير', transliteration: 'Tanweer', type: 'noun', meaning: 'Enlightenment — the Arab intellectual Nahda movement', meaningAr: 'التنوير — حركة النهضة الفكرية العربية', example: 'عصر التنوير العربي', exampleAr: 'عصر التنوير العربي', x: 52, y: 44, children: [] },
      { arabic: 'نُوراني', transliteration: 'Noorani', type: 'adjective', meaning: 'Luminous / spiritual light — glowing with divine presence', meaningAr: 'نوراني / نور روحي — يتوهج بالحضور الإلهي', example: 'وجهه نوراني', exampleAr: 'وجهه نوراني', x: 69, y: 44, children: [] },
      { arabic: 'مُسْتَنِير', transliteration: "Mustaneer", type: 'adjective', meaning: 'Enlightened person — one who has received light', meaningAr: 'شخص مستنير — من تلقى النور', example: 'عقل مستنير', exampleAr: 'عقل مستنير', x: 85, y: 44, children: [] },
      { arabic: 'إِنَارَة', transliteration: 'Enaara', type: 'noun', meaning: 'Illumination — the act of bringing light to a dark space', meaningAr: 'إنارة — عملية إحضار النور إلى مكان مظلم', example: 'إنارة الطريق', exampleAr: 'إنارة الطريق', x: 26, y: 62, children: [] },
      { arabic: 'مِنْوَار', transliteration: "Min'waar", type: 'noun', meaning: 'Skylight / window — architectural light-bringer', meaningAr: 'منوار / نافذة — جالب النور المعماري', example: 'Traditional Arabian architecture', exampleAr: 'العمارة العربية التقليدية', x: 74, y: 62, children: [] },
    ],
  },
  {
    id: 'ramz', root: 'ر-م-ز', arabic: 'ر-م-ز', transliteration: 'R-M-Z', desc: 'The symbol family — the very heart of this museum\'s subject matter', descAr: 'عائلة الرمز — جوهر موضوع هذا المتحف', color: '#8a4a8a', meaning: 'Symbol, code, signal, gesture', meaningAr: 'رمز، شفرة، إشارة، إيماءة',
    nodes: [
      { arabic: 'ر-م-ز', transliteration: 'R-M-Z', type: 'root', meaning: 'Triliteral root: to signal / symbolize / encode', meaningAr: 'جذر ثلاثي: الإشارة / الترميز / التشفير', x: 50, y: 8, children: ['رَمَزَ', 'رَمْز', 'رُمُوز', 'رَمْزِي', 'تَرْمِيز', 'مَرْمُوز', 'إِيمَاء'] },
      { arabic: 'رَمَزَ', transliteration: 'Ramaza', type: 'verb', meaning: 'To gesture / to signal without words', meaningAr: 'الإيماء / الإشارة بدون كلمات', example: 'رمز بيده (he gestured with his hand)', exampleAr: 'رمز بيده', x: 35, y: 26, children: ['رَمْز', 'رُمُوز'] },
      { arabic: 'رَمْز', transliteration: 'Ramz', type: 'noun', meaning: 'Symbol, cipher, sign — the core noun of this museum', meaningAr: 'رمز، شفرة، علامة — الاسم الأساسي لهذا المتحف', example: 'رمز الحضارة', exampleAr: 'رمز الحضارة', x: 65, y: 26, children: ['رَمْزِي', 'رُمُوز'] },
      { arabic: 'رُمُوز', transliteration: 'Rumuz', type: 'noun', meaning: 'Symbols (plural) — a collection of symbolic signs', meaningAr: 'رموز (جمع) — مجموعة من العلامات الرمزية', example: 'رموز الحضارة العربية', exampleAr: 'رموز الحضارة العربية', x: 22, y: 44, children: [] },
      { arabic: 'رَمْزِي', transliteration: 'Ramzi', type: 'adjective', meaning: 'Symbolic — expressed through or pertaining to symbols', meaningAr: 'رمزي — معبر عنه من خلال الرموز', example: 'معنى رمزي', exampleAr: 'معنى رمزي', x: 42, y: 44, children: [] },
      { arabic: 'تَرْمِيز', transliteration: 'Tarmeez', type: 'noun', meaning: 'Encoding / symbolization — the act of converting to symbols', meaningAr: 'ترميز / تشفير — عملية التحويل إلى رموز', example: 'تشفير وترميز', exampleAr: 'تشفير وترميز', x: 62, y: 44, children: [] },
      { arabic: 'مَرْمُوز', transliteration: 'Marmuz', type: 'adjective', meaning: 'Encoded / symbolized — transformed into symbolic form', meaningAr: 'مرموز / مشفر — محول إلى شكل رمزي', example: 'نص مرموز', exampleAr: 'نص مرموز', x: 82, y: 44, children: [] },
      { arabic: 'إِيمَاء', transliteration: "Eemaa'", type: 'noun', meaning: 'Gesture / hint — non-verbal symbolic communication', meaningAr: 'إيماءة / تلميح — تواصل رمزي غير لفظي', example: 'أومأ برأسه (he nodded)', exampleAr: 'أومأ برأسه', x: 50, y: 62, children: [] },
    ],
  },
  {
    id: 'ilm', root: 'ع-ل-م', arabic: 'ع-ل-م', transliteration: "'-L-M", desc: 'The most prolific root in Arabic — over 200 words around knowledge', descAr: 'الجذر الأكثر غزارة في العربية — أكثر من 200 كلمة تدور حول المعرفة', color: '#2a6a2a', meaning: 'Knowledge, science, world, scholar', meaningAr: 'المعرفة، العلم، العالم، العالِم',
    nodes: [
      { arabic: 'ع-ل-م', transliteration: "'-L-M", type: 'root', meaning: 'Triliteral root: to know / mark / inform', meaningAr: 'جذر ثلاثي: المعرفة / العلامة / الإعلام', x: 50, y: 8, children: ['عِلْم', 'عَالَم', 'عَالِم', 'مُعَلِّم', 'تَعْلِيم', 'عَلَامَة', 'إِعْلَام', 'مَعْلُوم'] },
      { arabic: 'عِلْم', transliteration: "'Ilm", type: 'noun', meaning: 'Science / knowledge', meaningAr: 'العلم / المعرفة', example: 'طالب العلم', exampleAr: 'طالب العلم', x: 50, y: 26, children: ['عَالِم', 'مَعْلُوم'] },
      { arabic: 'عَالَم', transliteration: "'Aalam", type: 'noun', meaning: 'World / universe — that which is known by its signs', meaningAr: 'العالم / الكون — ما يُعرف بعلاماته', example: 'رب العالمين', exampleAr: 'رب العالمين', x: 18, y: 44, children: [] },
      { arabic: 'عَالِم', transliteration: "'Aalim", type: 'noun', meaning: 'Scholar / scientist — one who knows', meaningAr: 'عالم / مفكر — من يعرف', example: 'عالم فضاء', exampleAr: 'عالم فضاء', x: 35, y: 44, children: [] },
      { arabic: 'مُعَلِّم', transliteration: "Mu'allim", type: 'noun', meaning: 'Teacher — one who imparts knowledge', meaningAr: 'معلم — من ينقل المعرفة', example: 'المعلم الأول (Aristotle in Arabic tradition)', exampleAr: 'المعلم الأول', x: 52, y: 44, children: [] },
      { arabic: 'تَعْلِيم', transliteration: "Ta'leem", type: 'noun', meaning: 'Education — the process of giving knowledge', meaningAr: 'التعليم — عملية إعطاء المعرفة', example: 'التعليم العالي', exampleAr: 'التعليم العالي', x: 69, y: 44, children: [] },
      { arabic: 'عَلَامَة', transliteration: "'Alaama", type: 'noun', meaning: 'Sign / mark — that by which something is known', meaningAr: 'علامة / إشارة — ما يُعرف به الشيء', example: 'علامة تجارية', exampleAr: 'علامة تجارية', x: 85, y: 44, children: [] },
      { arabic: 'إِعْلَام', transliteration: "I'laam", type: 'noun', meaning: 'Media / information — making known', meaningAr: 'إعلام / معلومات — جعل الشيء معروفًا', example: 'وسائل الإعلام', exampleAr: 'وسائل الإعلام', x: 26, y: 62, children: [] },
      { arabic: 'مَعْلُوم', transliteration: "Ma'loom", type: 'adjective', meaning: 'Known — that which is understood', meaningAr: 'معلوم — ما هو مفهوم', example: 'أمر معلوم من الدين بالضرورة', exampleAr: 'أمر معلوم من الدين بالضرورة', x: 74, y: 62, children: [] },
    ],
  },
  {
    id: 'hkm', root: 'ح-ك-م', arabic: 'ح-ك-م', transliteration: 'H-K-M', desc: 'The governance family — from preventing wrongdoing to the heights of wisdom', descAr: 'عائلة الحكم — من منع الإساءة إلى ذروة الحكمة', color: '#8a2a2a', meaning: 'Wisdom, judgment, rule, arbitration', meaningAr: 'الحكمة، الحكم، القاعدة، التحكيم',
    nodes: [
      { arabic: 'ح-ك-م', transliteration: 'H-K-M', type: 'root', meaning: 'Triliteral root: to judge / rule / prevent', meaningAr: 'جذر ثلاثي: الحكم / القاعدة / المنع', x: 50, y: 8, children: ['حِكْمَة', 'حُكْم', 'حَاكِم', 'مَحْكَمَة', 'تَحْكِيم', 'مُحْكَم', 'حَكِيم'] },
      { arabic: 'حِكْمَة', transliteration: 'Hikma', type: 'noun', meaning: 'Wisdom — judging rightly', meaningAr: 'الحكمة — الحكم بالصواب', example: 'بيت الحكمة (House of Wisdom)', exampleAr: 'بيت الحكمة', x: 50, y: 26, children: ['حَكِيم', 'مُحْكَم'] },
      { arabic: 'حُكْم', transliteration: 'Hukm', type: 'noun', meaning: 'Judgment / ruling', meaningAr: 'الحكم / القرار', example: 'حكم المحكمة', exampleAr: 'حكم المحكمة', x: 18, y: 44, children: [] },
      { arabic: 'حَاكِم', transliteration: 'Haakim', type: 'noun', meaning: 'Ruler / governor', meaningAr: 'الحاكم / الوالي', example: 'الحاكم بأمر الله', exampleAr: 'الحاكم بأمر الله', x: 35, y: 44, children: [] },
      { arabic: 'مَحْكَمَة', transliteration: 'Mahkama', type: 'noun', meaning: 'Court — place of judgment', meaningAr: 'محكمة — مكان الحكم', example: 'محكمة العدل الدولية', exampleAr: 'محكمة العدل الدولية', x: 52, y: 44, children: [] },
      { arabic: 'تَحْكِيم', transliteration: 'Tahkeem', type: 'noun', meaning: 'Arbitration', meaningAr: 'التحكيم', example: 'لجنة التحكيم', exampleAr: 'لجنة التحكيم', x: 69, y: 44, children: [] },
      { arabic: 'مُحْكَم', transliteration: 'Muhkam', type: 'adjective', meaning: 'Perfected / ambiguous — firmly established', meaningAr: 'محكم / دقيق — راسخ بقوة', example: 'آيات محكمات', exampleAr: 'آيات محكمات', x: 85, y: 44, children: [] },
      { arabic: 'حَكِيم', transliteration: 'Hakeem', type: 'noun', meaning: 'Wise person / philosopher / doctor', meaningAr: 'الحكيم / الفيلسوف / الطبيب', example: 'الطبيب الحكيم', exampleAr: 'الطبيب الحكيم', x: 50, y: 62, children: [] },
    ],
  },
  {
    id: 'sml', root: 'س-ل-م', arabic: 'س-ل-م', transliteration: 'S-L-M', desc: 'The peace family — the foundation of Islamic greeting and theology', descAr: 'عائلة السلام — أساس التحية الإسلامية وعلم الكلام', color: '#2a8a8a', meaning: 'Peace, submission, safety, Islam', meaningAr: 'السلام، الاستسلام، السلامة، الإسلام',
    nodes: [
      { arabic: 'س-ل-م', transliteration: 'S-L-M', type: 'root', meaning: 'Triliteral root: to be safe / at peace', meaningAr: 'جذر ثلاثي: السلامة / السلام', x: 50, y: 8, children: ['سَلَام', 'إِسْلَام', 'مُسْلِم', 'تَسْلِيم', 'سَلِيم', 'سَلَامَة'] },
      { arabic: 'سَلَام', transliteration: 'Salaam', type: 'noun', meaning: 'Peace', meaningAr: 'السلام', example: 'السلام عليكم', exampleAr: 'السلام عليكم', x: 50, y: 26, children: ['سَلَامَة', 'سَلِيم'] },
      { arabic: 'إِسْلَام', transliteration: 'Islam', type: 'noun', meaning: 'Submission (to peace/God)', meaningAr: 'الإسلام (للسلام/لله)', example: 'الدين الإسلامي', exampleAr: 'الدين الإسلامي', x: 22, y: 44, children: [] },
      { arabic: 'مُسْلِم', transliteration: 'Muslim', type: 'noun', meaning: 'One who submits to peace/God', meaningAr: 'المسلم', example: 'العالم الإسلامي', exampleAr: 'العالم الإسلامي', x: 42, y: 44, children: [] },
      { arabic: 'تَسْلِيم', transliteration: 'Tasleem', type: 'noun', meaning: 'Handing over / surrender', meaningAr: 'التسليم', example: 'التسليم بقضاء الله', exampleAr: 'التسليم بقضاء الله', x: 62, y: 44, children: [] },
      { arabic: 'سَلِيم', transliteration: 'Saleem', type: 'adjective', meaning: 'Safe / intact / flawless', meaningAr: 'سليم / سليم / لا تشوبه شائبة', example: 'قلب سليم', exampleAr: 'قلب سليم', x: 82, y: 44, children: [] },
      { arabic: 'سَلَامَة', transliteration: 'Salaama', type: 'noun', meaning: 'Safety', meaningAr: 'السلامة', example: 'مع السلامة', exampleAr: 'مع السلامة', x: 50, y: 62, children: [] },
    ],
  },
  {
    id: 'ktb', root: 'ك-ت-ب', arabic: 'ك-ت-ب', transliteration: 'K-T-B', desc: 'The writing family — the foundation of knowledge transmission', descAr: 'عائلة الكتابة — أساس نقل المعرفة', color: '#5a5a8a', meaning: 'Writing, book, desk, library', meaningAr: 'الكتابة، الكتاب، المكتب، المكتبة',
    nodes: [
      { arabic: 'ك-ت-ب', transliteration: 'K-T-B', type: 'root', meaning: 'Triliteral root: to write / record', meaningAr: 'جذر ثلاثي: الكتابة / التسجيل', x: 50, y: 8, children: ['كِتَاب', 'كَاتِب', 'مَكْتَب', 'مَكْتَبَة', 'مَكْتُوب', 'كُتَيِّب'] },
      { arabic: 'كِتَاب', transliteration: 'Kitaab', type: 'noun', meaning: 'Book', meaningAr: 'الكتاب', example: 'أم الكتاب', exampleAr: 'أم الكتاب', x: 50, y: 26, children: ['كُتَيِّب'] },
      { arabic: 'كَاتِب', transliteration: 'Kaatib', type: 'noun', meaning: 'Writer', meaningAr: 'الكاتب', example: 'كاتب العدل', exampleAr: 'كاتب العدل', x: 22, y: 44, children: [] },
      { arabic: 'مَكْتَب', transliteration: 'Maktab', type: 'noun', meaning: 'Desk / office (place of writing)', meaningAr: 'مكتب (مكان الكتابة)', example: 'مكتب المدير', exampleAr: 'مكتب المدير', x: 42, y: 44, children: [] },
      { arabic: 'مَكْتَبَة', transliteration: 'Maktaba', type: 'noun', meaning: 'Library / bookstore (place of books)', meaningAr: 'مكتبة (مكان الكتب)', example: 'مكتبة الإسكندرية', exampleAr: 'مكتبة الإسكندرية', x: 62, y: 44, children: [] },
      { arabic: 'مَكْتُوب', transliteration: 'Maktoob', type: 'adjective', meaning: 'Written / destined (fate)', meaningAr: 'مكتوب / مقدر (القدر)', example: 'المكتوب على الجبين', exampleAr: 'المكتوب على الجبين', x: 82, y: 44, children: [] },
      { arabic: 'كُتَيِّب', transliteration: "Kutayyib", type: 'noun', meaning: 'Booklet', meaningAr: 'كتيب', example: 'كتيب إرشادات', exampleAr: 'كتيب إرشادات', x: 50, y: 62, children: [] },
    ],
  },
  {
    id: 'jml', root: 'ج-م-ل', arabic: 'ج-م-ل', transliteration: 'J-M-L', desc: 'The beauty family — and the camel! Beauty and the camel share the same Arabic root', descAr: 'عائلة الجمال — والجمل! الجمال والجمل يشتركان في نفس الجذر', color: '#8a6a1a', meaning: 'Beauty, camel, sentence, collection', meaningAr: 'الجمال، الجمل، الجملة',
    nodes: [
      { arabic: 'ج-م-ل', transliteration: 'J-M-L', type: 'root', meaning: 'Triliteral root: beauty / camel / to compile (all from same root!)', meaningAr: 'جذر ثلاثي: الجمال / الجمل / الجمع', x: 50, y: 8, children: ['جَمَال', 'جَمِيل', 'جُمْلَة', 'جَمَل', 'إِجْمَال', 'مَجْمُوع', 'جُمْلَة'] },
      { arabic: 'جَمَال', transliteration: 'Jamaal', type: 'noun', meaning: 'Beauty — divine aesthetic perfection', meaningAr: 'الجمال — الكمال الجمالي الإلهي', example: 'جمال الله الأزلي في التصوف', exampleAr: 'جمال الله الأزلي في التصوف', x: 50, y: 26, children: ['جَمِيل'] },
      { arabic: 'جَمِيل', transliteration: 'Jameel', type: 'adjective', meaning: 'Beautiful — one of the 99 names of God (Al-Jameel)', meaningAr: 'الجميل — من أسماء الله الحسنى', example: '"إن الله جميل يحب الجمال"', exampleAr: '"إن الله جميل يحب الجمال"', x: 22, y: 44, children: [] },
      { arabic: 'جُمْلَة', transliteration: 'Jumla', type: 'noun', meaning: 'Sentence — a beautiful, complete unit of meaning', meaningAr: 'الجملة — وحدة معنى مكتملة', example: 'الجملة الفعلية vs. الجملة الاسمية', exampleAr: 'الجملة الفعلية مقابل الجملة الاسمية', x: 42, y: 44, children: [] },
      { arabic: 'جَمَل', transliteration: 'Jamal', type: 'noun', meaning: 'Camel — the beautiful one, the ship of the desert', meaningAr: 'الجمل — سفينة الصحراء', example: 'الجمل في القرآن: آية رقم 17 سورة الغاشية', exampleAr: 'الجمل في القرآن: آية رقم 17 سورة الغاشية', x: 62, y: 44, children: [] },
      { arabic: 'مَجْمُوع', transliteration: 'Majmoo', type: 'noun', meaning: 'Collection / total — compiled beauty', meaningAr: 'المجموع — الكلي', example: 'مجموع الأعمال الأدبية', exampleAr: 'مجموع الأعمال الأدبية', x: 82, y: 44, children: [] },
      { arabic: 'إِجْمَال', transliteration: "Ijmaal", type: 'noun', meaning: 'Summary / overview — the beautiful distillation of ideas', meaningAr: 'الإجمال / الخلاصة — تكثيف الأفكار', example: 'إجمال وتفصيل في البلاغة', exampleAr: 'إجمال وتفصيل في البلاغة', x: 50, y: 62, children: [] },
    ],
  },
];

export default function SemanticsHall() {
  const { isAr } = useLanguage();
  const [activeRoot, setActiveRoot] = useState('nur');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const root = roots.find(r => r.id === activeRoot)!;

  const connections = root.nodes.flatMap(node =>
    (node.children ?? []).map(childAr => {
      const child = root.nodes.find(n => n.arabic === childAr);
      if (!child) return null;
      return { x1: node.x, y1: node.y + 3.5, x2: child.x, y2: child.y - 3.5 };
    }).filter(Boolean)
  ) as { x1: number; y1: number; x2: number; y2: number }[];

  return (
    <div style={{ height: '100%', overflowY: 'auto', color: '#F8F4EA', direction: isAr ? 'rtl' : 'ltr' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 260, background: 'linear-gradient(180deg, #051505 0%, #062B24 100%)', overflow: 'hidden' }}>
        {[...'معنىلغةدلالةجذر'].map((ch, i) => (
          <motion.div key={i} style={{ position: 'absolute', fontFamily: '"IBM Plex Sans Arabic"', fontSize: '2.5rem', color: 'rgba(212,175,55,0.06)', left: `${5 + i * 12}%`, top: `${10 + (i % 4) * 22}%` }}
            animate={{ y: [-4, 4, -4], opacity: [0.04, 0.12, 0.04] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}>{ch}</motion.div>
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, textAlign: 'center', padding: '0 20px' }}>
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }}>
            <Languages size={52} color="#D4AF37" style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.7))' }} />
          </motion.div>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.5)' }}>
            {isAr ? 'مكتبة علم الدلالة' : 'Semantics Library'}
          </div>
          {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.1rem', color: '#F0D98A', direction: 'rtl' }}>مكتبة علم الدلالة</div>}
          <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.82rem', color: '#C7C3B9', maxWidth: 520, lineHeight: 1.7 }}>
            {isAr ? 'الجذور العربية هي الحمض النووي للمعنى. كل جذر ثلاثي يولد العشرات من الكلمات — استكشف 8 أشجار عائلية دلالية كاملة.' : 'Arabic roots are the DNA of meaning. Each 3-letter root generates dozens of words — explore 8 complete semantic family trees.'}
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #2a6a2a, #D4AF37, #2a6a2a, transparent)' }} />
      </div>

      {/* Root selector */}
      <div style={{ background: 'rgba(5,25,5,0.88)', padding: '0', borderBottom: '1px solid rgba(74,138,74,0.2)', overflowX: 'auto', direction: 'ltr' }}>
        <div style={{ display: 'flex', gap: 0, minWidth: 'max-content', justifyContent: 'center', margin: '0 auto', flexDirection: isAr ? 'row-reverse' : 'row' }}>
          {roots.map(r => (
            <button key={r.id} onClick={() => setActiveRoot(r.id)}
              style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: activeRoot === r.id ? `${r.color}18` : 'none', border: 'none', borderBottom: `2px solid ${activeRoot === r.id ? r.color : 'transparent'}`, cursor: 'pointer', transition: 'all 0.25s', flexShrink: 0 }}>
              <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: activeRoot === r.id ? r.color : '#C7C3B9', letterSpacing: '0.05em' }}>{r.root}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '0.6rem', color: activeRoot === r.id ? r.color : 'rgba(199,195,185,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{r.transliteration}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeRoot} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Root header */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' }}>
              <div style={{ background: `${root.color}15`, border: `1px solid ${root.color}55`, borderRadius: 12, padding: '18px 24px', flexShrink: 0, textAlign: 'center' }}>
                <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '2.8rem', color: root.color, letterSpacing: '0.1em' }}>{root.arabic}</div>
                <div style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#C7C3B9', marginTop: 4, letterSpacing: '0.1em' }}>{root.transliteration}</div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.3rem', color: '#F8F4EA', marginBottom: 6 }}>
                  {isAr ? `الجذر: ${root.meaningAr}` : `Root: ${root.meaning}`}
                </div>
                <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', color: '#C7C3B9', lineHeight: 1.75, marginBottom: 14 }}>
                  {isAr ? root.descAr : root.desc}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(TYPE_COLORS).map(([type, color]) => (
                    <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}` }} />
                      <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9' }}>
                        {isAr ? TYPE_LABELS_AR[type as keyof typeof TYPE_LABELS_AR] : TYPE_LABELS[type as keyof typeof TYPE_LABELS]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SVG Tree */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 14, padding: '16px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 8, [isAr ? 'left' : 'right']: 12, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#C7C3B9', letterSpacing: '0.1em' }}>
                {isAr ? 'الشجرة الدلالية — انقر على أي عقدة للتفاصيل' : 'SEMANTIC TREE — Click any node for details'}
              </div>
              <svg viewBox="0 0 100 78" style={{ width: '100%', height: 'clamp(260px, 40vw, 420px)' }} preserveAspectRatio="xMidYMid meet">
                {/* Connection lines */}
                {connections.map((line, i) => (
                  <motion.line key={i} x1={`${isAr ? 100 - line.x1 : line.x1}%`} y1={`${line.y1}%`} x2={`${isAr ? 100 - line.x2 : line.x2}%`} y2={`${line.y2}%`}
                    stroke="rgba(212,175,55,0.2)" strokeWidth="0.4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: i * 0.08 }} />
                ))}
                {/* Nodes */}
                {root.nodes.map((node, i) => {
                  const color = TYPE_COLORS[node.type];
                  const isHovered = hoveredNode === node.arabic;
                  const r = node.type === 'root' ? 4 : 3;
                  const xPos = isAr ? 100 - node.x : node.x;
                  return (
                    <g key={node.arabic} style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredNode(node.arabic)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(node)}>
                      <motion.circle cx={`${xPos}%`} cy={`${node.y}%`} r={`${r}%`}
                        fill={`${color}25`} stroke={color} strokeWidth={isHovered ? '0.9' : '0.5'}
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.07 }}
                        filter={isHovered ? `drop-shadow(0 0 3px ${color})` : undefined} />
                      <motion.text x={`${xPos}%`} y={`${node.y}%`} textAnchor="middle" dominantBaseline="middle"
                        style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: node.type === 'root' ? '2.4%' : '2%', fill: isHovered ? '#F0D98A' : color, fontWeight: node.type === 'root' ? 'bold' : 'normal' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 + 0.2 }}>
                        {node.arabic}
                      </motion.text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Node cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {root.nodes.filter(n => n.type !== 'root').map((node, i) => {
                const color = TYPE_COLORS[node.type];
                return (
                  <motion.div key={node.arabic} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    onClick={() => setSelectedNode(node)} style={{ background: `${color}12`, border: `1px solid ${color}44`, borderRadius: 10, padding: '14px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    whileHover={{ borderColor: color } as any}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 6, flexWrap: 'wrap' }}>
                      <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.3rem', color }}>{node.arabic}</div>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color, background: `${color}22`, borderRadius: 8, padding: '1px 7px' }}>
                        {isAr ? TYPE_LABELS_AR[node.type] : TYPE_LABELS[node.type]}
                      </div>
                    </div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9', lineHeight: 1.55, marginBottom: node.example ? 6 : 0 }}>
                      {isAr ? node.meaningAr : node.meaning}
                    </div>
                    {node.example && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.72rem', color: `${color}cc`, direction: 'rtl', fontStyle: 'italic' }}>{isAr && node.exampleAr ? node.exampleAr : node.example}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                      <ChevronRight size={10} color={`${color}66`} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
                      <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: `${color}66` }}>
                        {isAr ? 'انقر للتفاصيل' : 'Click for details'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Node detail modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div className="fixed inset-0 flex items-center justify-center p-4"
            style={{ background: 'rgba(13,17,23,0.95)', zIndex: 100, backdropFilter: 'blur(15px)', direction: isAr ? 'rtl' : 'ltr' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNode(null)}>
            <motion.div initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 30 }} onClick={e => e.stopPropagation()}
              style={{ background: `linear-gradient(135deg, #062B24, #0D1117)`, border: `1px solid ${root.color}88`, borderRadius: 14, padding: '36px', maxWidth: 520, width: '100%', position: 'relative' }}>
              <button onClick={() => setSelectedNode(null)} style={{ position: 'absolute', top: 14, [isAr ? 'left' : 'right']: 14, background: 'none', border: 'none', color: '#C7C3B9', cursor: 'pointer' }}><X size={18} /></button>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 10, background: `${TYPE_COLORS[selectedNode.type]}18`, border: `1px solid ${TYPE_COLORS[selectedNode.type]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.6rem', color: TYPE_COLORS[selectedNode.type] }}>{selectedNode.arabic}</div>
                </div>
                <div>
                  <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.4rem', color: root.color }}>{selectedNode.arabic}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#C7C3B9', marginTop: 2 }}>{selectedNode.transliteration}</div>
                  <div style={{ display: 'inline-block', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: TYPE_COLORS[selectedNode.type], background: `${TYPE_COLORS[selectedNode.type]}18`, borderRadius: 8, padding: '1px 8px', marginTop: 4 }}>
                    {isAr ? TYPE_LABELS_AR[selectedNode.type] : TYPE_LABELS[selectedNode.type]}
                  </div>
                </div>
              </div>
              <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, padding: '14px', marginBottom: 16 }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                  {isAr ? 'المعنى' : 'Meaning'}
                </div>
                <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', color: '#F8F4EA', lineHeight: 1.7 }}>
                  {isAr ? selectedNode.meaningAr : selectedNode.meaning}
                </p>
              </div>
              {selectedNode.example && (
                <div style={{ background: `${root.color}0a`, border: `1px solid ${root.color}33`, borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: root.color, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                    {isAr ? 'مثال' : 'Example'}
                  </div>
                  <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.95rem', color: '#F0D98A', direction: 'rtl', fontStyle: 'italic' }}>
                    {isAr && selectedNode.exampleAr ? selectedNode.exampleAr : selectedNode.example}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
