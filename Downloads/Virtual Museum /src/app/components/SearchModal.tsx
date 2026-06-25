import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Landmark, Moon, Lock, Layers, Languages, ScrollText, Brain, Star, Clock, Hash } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface SearchResult {
  id: string;
  hall: number;
  hallName: string;
  title: string;
  arabic: string;
  type: 'Artifact' | 'Symbol' | 'Manuscript' | 'Concept' | 'Hall';
  description: string;
  descriptionAr?: string;
  tags: string[];
}

const HALL_ICONS: Record<number, React.ReactNode> = {
  1: <Landmark size={14} />,
  2: <Moon size={14} />,
  3: <Lock size={14} />,
  4: <Layers size={14} />,
  5: <Languages size={14} />,
  6: <ScrollText size={14} />,
  7: <Brain size={14} />,
};

const HALL_COLORS: Record<number, string> = {
  1: '#8B6914', 2: '#1a6a4a', 3: '#1a1a5a',
  4: '#4a1a5a', 5: '#1a5a1a', 6: '#5a3a1a', 7: '#1a3a5a',
};

const SEARCH_INDEX: SearchResult[] = [
  // ─── Hall 1: History ───
  { id: 'h1-1', hall: 1, hallName: 'History of Symbols', title: 'Seal of Dilmun', arabic: 'ختم دلمون', type: 'Artifact', description: 'Trade authority & divine protection symbol from Bronze Age Bahrain', descriptionAr: 'رمز السلطة التجارية والحماية الإلهية من العصر البرونزي في البحرين', tags: ['seal', 'dilmun', 'mesopotamian', 'bronze age', 'trade', 'bahrain'] },
  { id: 'h1-2', hall: 1, hallName: 'History of Symbols', title: 'Nabataean Sun Disc', arabic: 'قرص الشمس النبطي', type: 'Artifact', description: 'Solar deity worship & cosmic order from Petra', descriptionAr: 'عبادة إله الشمس والنظام الكوني من البتراء', tags: ['nabataean', 'sun', 'petra', 'jordan', 'religious', 'solar'] },
  { id: 'h1-3', hall: 1, hallName: 'History of Symbols', title: 'Lihyanite Script', arabic: 'خط اللحياني', type: 'Artifact', description: 'Royal proclamations from ancient Hegra in north Arabia', descriptionAr: 'إعلانات ملكية من الحجر القديمة في شمال الجزيرة العربية', tags: ['lihyanite', 'script', 'hegra', 'writing', 'pre-islamic'] },
  { id: 'h1-4', hall: 1, hallName: 'History of Symbols', title: 'Sabaean Star', arabic: 'نجمة سبأ', type: 'Artifact', description: 'Venus worship and feminine divinity from ancient Yemen', descriptionAr: 'عبادة كوكب الزهرة والأنوثة الإلهية من اليمن القديم', tags: ['sabaean', 'star', 'venus', 'yemen', 'feminine', 'sheba'] },
  { id: 'h1-5', hall: 1, hallName: 'History of Symbols', title: 'Thamudic Ibex', arabic: 'وعل ثمودي', type: 'Artifact', description: 'Tribal strength and virility carved in Tabuk rock', descriptionAr: 'القوة القبلية والرجولة المنحوتة في صخور تبوك', tags: ['thamudic', 'ibex', 'rock art', 'tribal', 'tabuk'] },
  { id: 'h1-6', hall: 1, hallName: 'History of Symbols', title: 'Himyarite Coin', arabic: 'عملة حميرية', type: 'Artifact', description: 'Economic power and royal legitimacy of ancient Yemen', descriptionAr: 'القوة الاقتصادية والشرعية الملكية لليمن القديم', tags: ['himyarite', 'coin', 'yemen', 'economy', 'numismatic'] },
  { id: 'h1-7', hall: 1, hallName: 'History of Symbols', title: 'Proto-Arabic Inscription', arabic: 'نقش بدائي عربي', type: 'Artifact', description: 'Earliest known Arabic writing from northern Arabia', descriptionAr: 'أقدم كتابة عربية معروفة من شمال الجزيرة العربية', tags: ['proto-arabic', 'inscription', 'oldest', 'writing'] },
  { id: 'h1-8', hall: 1, hallName: 'History of Symbols', title: 'Nabataean Graffiti', arabic: 'نقوش نبطية', type: 'Artifact', description: 'Camel caravan trail markings from the incense route', descriptionAr: 'علامات مسار قوافل الجمال من طريق البخور', tags: ['nabataean', 'graffiti', 'caravan', 'incense road'] },
  { id: 'h1-9', hall: 1, hallName: 'History of Symbols', title: 'Qatabanian Temple Seal', arabic: 'ختم المعبد القتباني', type: 'Artifact', description: 'Religious authority symbol from ancient south Arabian kingdom', descriptionAr: 'رمز السلطة الدينية من المملكة العربية الجنوبية القديمة', tags: ['qatabanian', 'temple', 'seal', 'south arabia', 'religious'] },
  { id: 'h1-10', hall: 1, hallName: 'History of Symbols', title: 'Minaean Trade Symbol', arabic: 'رمز التجارة المعيني', type: 'Artifact', description: 'Commercial identity mark of the ancient Minaean traders', descriptionAr: 'علامة الهوية التجارية للتجار المعينيين القدماء', tags: ['minaean', 'trade', 'commerce', 'arabia'] },
  { id: 'h1-11', hall: 1, hallName: 'History of Symbols', title: 'Ugaritic Cuneiform Tablet', arabic: 'لوح أوغاريت المسماري', type: 'Artifact', description: 'First alphabetic writing system ancestor of Arabic script', descriptionAr: 'أول نظام كتابة أبجدي سلف الخط العربي', tags: ['ugaritic', 'cuneiform', 'alphabet', 'levant', 'tablet'] },
  { id: 'h1-12', hall: 1, hallName: 'History of Symbols', title: 'Tribal Wasm Brand', arabic: 'وسم قبلي', type: 'Artifact', description: 'Tribal identity mark burned into camels and property', descriptionAr: 'علامة الهوية القبلية المحروقة على الجمال والممتلكات', tags: ['wasm', 'tribal', 'brand', 'identity', 'camel'] },
  // ─── Hall 2: Quran ───
  { id: 'h2-1', hall: 2, hallName: "Qur'anic Symbolism", title: 'Divine Light — Nur', arabic: 'النور', type: 'Symbol', description: 'God described as the Light of the heavens (An-Nur 24:35)', descriptionAr: 'وصف الله بأنه نور السماوات (النور 24:35)', tags: ['light', 'nur', 'quran', 'divine', 'illumination', 'sufi'] },
  { id: 'h2-2', hall: 2, hallName: "Qur'anic Symbolism", title: 'Crescent — Hilal', arabic: 'الهلال', type: 'Symbol', description: 'Measurement of sacred time and Islamic calendar (Al-Baqarah 2:189)', descriptionAr: 'قياس الوقت المقدس والتقويم الإسلامي (البقرة 2:189)', tags: ['crescent', 'moon', 'hilal', 'time', 'ramadan', 'calendar'] },
  { id: 'h2-3', hall: 2, hallName: "Qur'anic Symbolism", title: 'Water — Ma\'a', arabic: 'الماء', type: 'Symbol', description: 'Origin of all life (Al-Anbiya 21:30)', descriptionAr: 'أصل كل حياة (الأنبياء 21:30)', tags: ['water', 'life', 'creation', 'purification', 'rain'] },
  { id: 'h2-4', hall: 2, hallName: "Qur'anic Symbolism", title: 'Bird — Tayr', arabic: 'الطير', type: 'Symbol', description: "Soul's journey toward God (Al-Mulk 67:19)", descriptionAr: "رحلة الروح نحو الله (الملك 67:19)", tags: ['bird', 'soul', 'journey', 'sufi', 'hoopoe', 'hudhud'] },
  { id: 'h2-5', hall: 2, hallName: "Qur'anic Symbolism", title: 'Olive Tree — Zaytuna', arabic: 'الزيتونة', type: 'Symbol', description: 'Blessed tree beyond east and west in the Light Verse', descriptionAr: 'الشجرة المباركة لا شرقية ولا غربية في آية النور', tags: ['olive', 'tree', 'light verse', 'wisdom', 'blessed'] },
  { id: 'h2-6', hall: 2, hallName: "Qur'anic Symbolism", title: 'Number Seven', arabic: 'رقم سبعة', type: 'Symbol', description: 'Seven heavens, seven circuits of tawaf, divine perfection', descriptionAr: 'سبع سماوات، سبعة أشواط من الطواف، الكمال الإلهي', tags: ['seven', 'number', 'heavens', 'tawaf', 'perfection'] },
  { id: 'h2-7', hall: 2, hallName: "Qur'anic Symbolism", title: 'The Bee — Nahl', arabic: 'النحل', type: 'Symbol', description: 'Receives divine revelation like the Prophet (An-Nahl 16:68)', descriptionAr: 'تتلقى الوحي الإلهي مثل النبي (النحل 16:68)', tags: ['bee', 'honey', 'revelation', 'community', 'nahl'] },
  { id: 'h2-8', hall: 2, hallName: "Qur'anic Symbolism", title: 'Green Color — Akhdar', arabic: 'الأخضر', type: 'Symbol', description: 'Color of paradise and divine mercy in Quranic imagery', descriptionAr: 'لون الجنة والرحمة الإلهية في التصوير القرآني', tags: ['green', 'paradise', 'jannah', 'mercy', 'color'] },
  { id: 'h2-9', hall: 2, hallName: "Qur'anic Symbolism", title: 'The Elephant — Fil', arabic: 'الفيل', type: 'Symbol', description: 'Surah Al-Fil: Army of Abraha and divine protection of Mecca', descriptionAr: 'سورة الفيل: جيش أبرهة والحماية الإلهية لمكة', tags: ['elephant', 'fil', 'abraha', 'mecca', 'protection'] },
  { id: 'h2-10', hall: 2, hallName: "Qur'anic Symbolism", title: 'Number Forty', arabic: 'الأربعون', type: 'Symbol', description: 'Moses forty nights, Jesus forty days — transformation period', descriptionAr: 'موسى أربعون ليلة، عيسى أربعون يوماً - فترة التحول', tags: ['forty', 'number', 'moses', 'transformation', 'spiritual'] },
  // ─── Hall 3: Cryptography ───
  { id: 'h3-1', hall: 3, hallName: 'Cryptography', title: 'Al-Kindi Frequency Analysis', arabic: 'تحليل تكرار الكندي', type: 'Concept', description: 'World\'s first cryptanalysis method invented 800 CE Baghdad', tags: ['al-kindi', 'frequency', 'analysis', 'Baghdad', 'cryptanalysis'] },
  { id: 'h3-2', hall: 3, hallName: 'Cryptography', title: 'Caesar Cipher', arabic: 'شيفرة قيصر', type: 'Concept', description: 'Substitution cipher shifting alphabet by fixed number', descriptionAr: 'شيفرة استبدال تقوم بإزاحة الأبجدية برقم ثابت', tags: ['caesar', 'cipher', 'shift', 'substitution', 'encryption'] },
  { id: 'h3-3', hall: 3, hallName: 'Cryptography', title: 'Arabic Substitution Cipher', arabic: 'شيفرة الاستبدال العربية', type: 'Concept', description: 'Classical Arabic letter substitution using alphabet shift', descriptionAr: 'استبدال الحروف العربية الكلاسيكية باستخدام إزاحة الأبجدية', tags: ['arabic', 'cipher', 'substitution', 'classical'] },
  { id: 'h3-4', hall: 3, hallName: 'Cryptography', title: 'Royal Messenger Code', arabic: 'شيفرة الرسائل الملكية', type: 'Concept', description: 'Ayyubid court military communication encryption', descriptionAr: 'تشفير الاتصالات العسكرية في البلاط الأيوبي', tags: ['ayyubid', 'royal', 'military', 'encryption', 'medieval'] },
  { id: 'h3-5', hall: 3, hallName: 'Cryptography', title: 'Ibn Adlan Polyalphabetic', arabic: 'متعدد الحروف لابن عدلان', type: 'Concept', description: 'Advanced multi-alphabet substitution predating Vigenère', descriptionAr: 'استبدال متقدم متعدد الأبجديات يسبق فيجنير', tags: ['ibn adlan', 'polyalphabetic', 'vigenere', 'advanced'] },
  { id: 'h3-6', hall: 3, hallName: 'Cryptography', title: 'Atbash Cipher', arabic: 'شيفرة أتباش', type: 'Concept', description: 'Mirror substitution: first letter maps to last, used in Hebrew texts', descriptionAr: 'استبدال مرآة: الحرف الأول يعين للأخير، يستخدم في النصوص العبرية', tags: ['atbash', 'mirror', 'substitution', 'hebrew', 'ancient'] },
  // ─── Hall 4: Semiotics ───
  { id: 'h4-1', hall: 4, hallName: 'Semiotics', title: 'Crescent Moon Symbol', arabic: 'رمز الهلال', type: 'Symbol', description: 'Four semiotic layers: icon, index, symbol, cultural memory', descriptionAr: 'أربع طبقات سيميائية: أيقونة، مؤشر، رمز، ذاكرة ثقافية', tags: ['crescent', 'semiotic', 'layers', 'islamic', 'moon'] },
  { id: 'h4-2', hall: 4, hallName: 'Semiotics', title: 'Palm Tree Symbol', arabic: 'رمز النخلة', type: 'Symbol', description: 'National identity and desert civilization signifier', descriptionAr: 'الهوية الوطنية ودلالة حضارة الصحراء', tags: ['palm', 'tree', 'national', 'desert', 'arabia'] },
  { id: 'h4-3', hall: 4, hallName: 'Semiotics', title: 'Falcon Symbolism', arabic: 'رمزية الصقر', type: 'Symbol', description: 'Royal power, vision, and loyalty in Arabian culture', descriptionAr: 'القوة الملكية والرؤية والولاء في الثقافة العربية', tags: ['falcon', 'royal', 'uae', 'falconry', 'power'] },
  { id: 'h4-4', hall: 4, hallName: 'Semiotics', title: 'Khamsa Hand', arabic: 'الخمسة', type: 'Symbol', description: 'Pre-Islamic protection symbol adopted across cultures', descriptionAr: 'رمز حماية ما قبل الإسلام تم تبنيه عبر الثقافات', tags: ['khamsa', 'hamsa', 'hand', 'protection', 'evil eye'] },
  { id: 'h4-5', hall: 4, hallName: 'Semiotics', title: 'Star of Solomon', arabic: 'نجمة سليمان', type: 'Symbol', description: 'Six-pointed star of divine authority and wisdom', descriptionAr: 'نجمة سداسية تمثل السلطة الإلهية والحكمة', tags: ['solomon', 'star', 'authority', 'wisdom', 'alchemy'] },
  // ─── Hall 5: Semantics ───
  { id: 'h5-1', hall: 5, hallName: 'Semantics', title: 'Root: N-W-R (Light)', arabic: 'جذر ن-و-ر', type: 'Concept', description: 'Generates nur, tenwir, nuri, naar — light family of words', descriptionAr: 'يولد كلمات مثل نور، تنوير، نوري، نار - عائلة كلمات النور', tags: ['nur', 'light', 'root', 'arabic', 'semantic tree', 'نور'] },
  { id: 'h5-2', hall: 5, hallName: 'Semantics', title: 'Root: R-M-Z (Symbol)', arabic: 'جذر ر-م-ز', type: 'Concept', description: 'Generates ramz, rumuz, ramzi, tarmeez — symbol family', descriptionAr: 'يولد كلمات مثل رمز، رموز، رمزي، ترميز - عائلة كلمات الرمز', tags: ['ramz', 'symbol', 'root', 'arabic', 'رمز', 'encoding'] },
  { id: 'h5-3', hall: 5, hallName: 'Semantics', title: 'Root: ʿ-L-M (Knowledge)', arabic: 'جذر ع-ل-م', type: 'Concept', description: 'Most prolific Arabic root — 200+ words around knowledge', descriptionAr: 'الجذر العربي الأكثر إنتاجاً - أكثر من 200 كلمة حول المعرفة', tags: ['ilm', 'knowledge', 'root', 'arabic', 'science', 'علم'] },
  { id: 'h5-4', hall: 5, hallName: 'Semantics', title: 'Root: S-L-M (Peace)', arabic: 'جذر س-ل-م', type: 'Concept', description: 'Generates salam, muslim, islam, salaam — peace & submission', descriptionAr: 'يولد كلمات مثل سلام، مسلم، إسلام، سَلَام - السلام والاستسلام', tags: ['salam', 'peace', 'islam', 'muslim', 'سلم', 'submission'] },
  { id: 'h5-5', hall: 5, hallName: 'Semantics', title: 'Root: K-T-B (Write)', arabic: 'جذر ك-ت-ب', type: 'Concept', description: 'Generates kitab, kataba, maktaba, maktub — writing family', descriptionAr: 'يولد كلمات مثل كتاب، كتب، مكتبة، مكتوب - عائلة الكتابة', tags: ['kitab', 'write', 'book', 'library', 'كتب', 'scripture'] },
  { id: 'h5-6', hall: 5, hallName: 'Semantics', title: 'Root: Ḥ-B-B (Love)', arabic: 'جذر ح-ب-ب', type: 'Concept', description: 'Generates hubb, habib, mahbub, hub — love & affection', descriptionAr: 'يولد كلمات مثل حب، حبيب، محبوب - عائلة الحب والمودة', tags: ['hubb', 'love', 'habib', 'حب', 'affection', 'sufi'] },
  // ─── Hall 6: Manuscripts ───
  { id: 'h6-1', hall: 6, hallName: 'Manuscripts', title: 'Kitab al-Aghani', arabic: 'كتاب الأغاني', type: 'Manuscript', description: '21-volume encyclopedia of Arabic poetry and music, 967 CE', descriptionAr: 'موسوعة من 21 مجلداً للشعر والموسيقى العربية، 967 م', tags: ['aghani', 'music', 'poetry', 'isfahani', 'abbasid', '967'] },
  { id: 'h6-2', hall: 6, hallName: 'Manuscripts', title: 'Al-Qanun fi al-Tibb', arabic: 'القانون في الطب', type: 'Manuscript', description: "Avicenna's Canon of Medicine — used in European universities until 1650", descriptionAr: "القانون في الطب لابن سينا - استخدم في الجامعات الأوروبية حتى عام 1650", tags: ['avicenna', 'ibn sina', 'medicine', 'canon', '1025'] },
  { id: 'h6-3', hall: 6, hallName: 'Manuscripts', title: 'Maqamat al-Hariri', arabic: 'مقامات الحريري', type: 'Manuscript', description: 'Masterpiece of Arabic literature, 1237 CE illustrated Baghdad copy', descriptionAr: 'رائعة من الأدب العربي، نسخة بغداد المصورة عام 1237 م', tags: ['hariri', 'maqamat', 'literature', 'al-wasiti', 'baghdad'] },
  { id: 'h6-4', hall: 6, hallName: 'Manuscripts', title: 'Book of Fixed Stars', arabic: 'كتاب صور الكواكب', type: 'Manuscript', description: "Al-Sufi's 964 CE star atlas with 48 constellation maps", descriptionAr: "أطلس النجوم للصوفي عام 964 م مع 48 خريطة للكوكبات", tags: ['al-sufi', 'stars', 'astronomy', 'constellations', '964'] },
  { id: 'h6-5', hall: 6, hallName: 'Manuscripts', title: 'Book of Ingenious Devices', arabic: 'كتاب الحيل', type: 'Manuscript', description: "Al-Jazari's mechanical engineering masterpiece, 1206 CE", descriptionAr: "رائعة الهندسة الميكانيكية للجزري، 1206 م", tags: ['al-jazari', 'mechanical', 'engineering', 'devices', '1206'] },
  { id: 'h6-6', hall: 6, hallName: 'Manuscripts', title: 'Al-Muqaddimah', arabic: 'المقدمة', type: 'Manuscript', description: "Ibn Khaldun's 1377 treatise — father of sociology and economics", descriptionAr: "مقدمة ابن خلدون عام 1377 م - أبو علم الاجتماع والاقتصاد", tags: ['ibn khaldun', 'muqaddimah', 'sociology', 'history', '1377'] },
  { id: 'h6-7', hall: 6, hallName: 'Manuscripts', title: 'Rihla of Ibn Battuta', arabic: 'رحلة ابن بطوطة', type: 'Manuscript', description: 'Greatest medieval travel account — 75,000 miles across the world', descriptionAr: 'أعظم رحلة في العصور الوسطى - 75,000 ميل عبر العالم', tags: ['ibn battuta', 'travel', 'rihla', 'journey', '1355'] },
  { id: 'h6-8', hall: 6, hallName: 'Manuscripts', title: 'Al-Idrisi World Map', arabic: 'خريطة الإدريسي', type: 'Manuscript', description: "Al-Idrisi's 1154 CE world map for King Roger II — most accurate of its era", descriptionAr: "خريطة العالم للإدريسي عام 1154 م للملك روجر الثاني - الأكثر دقة في عصرها", tags: ['al-idrisi', 'map', 'cartography', 'world', '1154', 'sicily'] },
  // ─── Hall 7: AI Lab ───
  { id: 'h7-1', hall: 7, hallName: 'AI Laboratory', title: 'Symbol Recognition AI', arabic: 'التعرف الذكي على الرموز', type: 'Concept', description: 'Computer vision analysis of 12,000+ Arabic symbols', descriptionAr: 'تحليل الرؤية الحاسوبية لأكثر من 12,000 رمز عربي', tags: ['AI', 'recognition', 'computer vision', 'symbol'] },
  { id: 'h7-2', hall: 7, hallName: 'AI Laboratory', title: 'Arabic OCR System', arabic: 'نظام التعرف البصري العربي', type: 'Concept', description: 'Neural network trained on 500 years of Arabic manuscript styles', descriptionAr: 'شبكة عصبية مدربة على 500 عام من أنماط المخطوطات العربية', tags: ['OCR', 'arabic', 'manuscripts', 'neural network'] },
  { id: 'h7-3', hall: 7, hallName: 'AI Laboratory', title: 'Phoenix AI Assistant', arabic: 'مساعد الفينيق الذكي', type: 'Concept', description: 'Multilingual research assistant for Arabic cultural heritage', descriptionAr: 'مساعد أبحاث متعدد اللغات للتراث الثقافي العربي', tags: ['AI', 'assistant', 'research', 'multilingual', 'chatbot'] },
  // ─── Halls themselves ───
  { id: 'hall-1', hall: 1, hallName: 'History of Symbols', title: 'Hall 1: History of Symbols', arabic: 'قاعة تاريخ الرموز', type: 'Hall', description: 'Ancient civilizations, Nabataean, Phoenician, pre-Islamic symbols', descriptionAr: 'الحضارات القديمة، الأنباط، الفينيقيون، رموز ما قبل الإسلام', tags: ['history', 'ancient', 'civilization', 'hall', 'artifacts'] },
  { id: 'hall-2', hall: 2, hallName: "Qur'anic Symbolism", title: "Hall 2: Qur'anic Symbolism", arabic: 'قاعة رموز القرآن', type: 'Hall', description: 'Sacred metaphors, divine signs, Quranic numbers and animals', descriptionAr: 'الاستعارات المقدسة، الآيات الإلهية، الأرقام والحيوانات في القرآن', tags: ['quran', 'islamic', 'sacred', 'hall', 'verses'] },
  { id: 'hall-3', hall: 3, hallName: 'Cryptography', title: 'Hall 3: Cryptography', arabic: 'قاعة التشفير', type: 'Hall', description: 'Arab ciphers, Al-Kindi, frequency analysis, secret writing', descriptionAr: 'الشيفرات العربية، الكندي، تحليل التكرار، الكتابة السرية', tags: ['cryptography', 'cipher', 'al-kindi', 'hall', 'encryption'] },
  { id: 'hall-4', hall: 4, hallName: 'Semiotics', title: 'Hall 4: Semiotics', arabic: 'قاعة السيميائية', type: 'Hall', description: 'Signs, meanings, visual symbolism, cultural identity', descriptionAr: 'العلامات، المعاني، الرمزية البصرية، الهوية الثقافية', tags: ['semiotics', 'signs', 'meaning', 'hall', 'visual'] },
  { id: 'hall-5', hall: 5, hallName: 'Semantics', title: 'Hall 5: Semantics', arabic: 'قاعة الدلالة', type: 'Hall', description: 'Arabic root system, semantic trees, word evolution', descriptionAr: 'نظام الجذور العربية، الأشجار الدلالية، تطور الكلمات', tags: ['semantics', 'roots', 'arabic', 'hall', 'linguistics'] },
  { id: 'hall-6', hall: 6, hallName: 'Manuscripts', title: 'Hall 6: Manuscripts', arabic: 'قاعة المخطوطات', type: 'Hall', description: 'Rare historical manuscripts, digital viewer, annotations', descriptionAr: 'مخطوطات تاريخية نادرة، عارض رقمي، شروحات', tags: ['manuscripts', 'rare', 'books', 'hall', 'archive'] },
  { id: 'hall-7', hall: 7, hallName: 'AI Laboratory', title: 'Hall 7: AI Laboratory', arabic: 'مختبر الذكاء', type: 'Hall', description: 'Symbol AI analysis, OCR, research assistant', descriptionAr: 'تحليل الرموز بالذكاء الاصطناعي، التعرف البصري، مساعد بحث', tags: ['AI', 'laboratory', 'analysis', 'hall', 'technology'] },
];

const TYPE_COLORS = { Artifact: '#8B6914', Symbol: '#1a6a4a', Manuscript: '#5a3a1a', Concept: '#1a1a5a', Hall: '#4a1a5a' };

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (hallId: number) => void;
}

export default function SearchModal({ open, onClose, onNavigate }: Props) {
  const { isAr } = useLanguage();
  const [query, setQuery] = useState('');
  const [recent] = useState(['نور', 'Al-Kindi', 'Manuscripts', 'Cipher', 'Crescent']);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50); setQuery(''); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open ? onClose() : undefined; }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const results = query.trim().length > 0
    ? SEARCH_INDEX.filter(item => {
        const q = query.toLowerCase();
        return item.title.toLowerCase().includes(q)
          || item.arabic.includes(q)
          || item.description.toLowerCase().includes(q)
          || (item as any).descriptionAr?.includes(q)
          || item.tags.some(t => t.toLowerCase().includes(q))
          || item.hallName.toLowerCase().includes(q)
          || item.type.toLowerCase().includes(q);
      }).slice(0, 12)
    : [];

  const handleSelect = useCallback((result: SearchResult) => {
    onNavigate(result.hall);
    onClose();
  }, [onNavigate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-start justify-center pt-[8vh] px-4"
          style={{ zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.93, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.93, y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 660, background: '#0B1F1B', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.1)' }}
          >
            {/* Search input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(212,175,55,0.15)', direction: isAr ? 'rtl' : 'ltr' }}>
              <Search size={18} color="#D4AF37" style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن الرموز، المخطوطات، القاعات، المفاهيم..." : "Search artifacts, manuscripts, halls, concepts..."}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '1rem', color: '#F8F4EA', direction: isAr ? 'rtl' : 'ltr' }}
              />
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#C7C3B9', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, padding: '2px 6px' }}>ESC</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C7C3B9', display: 'flex' }}><X size={16} /></button>
              </div>
            </div>

            {/* Results or recent */}
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {query.trim() === '' ? (
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9', letterSpacing: '0.12em', marginBottom: 10, textAlign: isAr ? 'right' : 'left', textTransform: isAr ? 'none' : 'uppercase' }}>{isAr ? 'عمليات البحث الأخيرة' : 'Recent Searches'}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, direction: isAr ? 'rtl' : 'ltr' }}>
                    {recent.map(r => (
                      <button key={r} onClick={() => setQuery(r)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 20, color: '#C7C3B9', fontFamily: 'Inter', fontSize: '0.78rem', cursor: 'pointer', direction: 'ltr' }}>
                        <Clock size={11} color="#D4AF37" /> {r}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9', letterSpacing: '0.12em', marginBottom: 10, textAlign: isAr ? 'right' : 'left', textTransform: isAr ? 'none' : 'uppercase' }}>{isAr ? 'تصفح القاعات' : 'Browse Halls'}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {[1,2,3,4,5,6,7].map(id => {
                      const item = SEARCH_INDEX.find(s => s.id === `hall-${id}`)!;
                      return (
                        <button key={id} onClick={() => handleSelect(item)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 8, cursor: 'pointer', textAlign: isAr ? 'right' : 'left', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                          <div style={{ color: HALL_COLORS[id] }}>{HALL_ICONS[id]}</div>
                          <div style={{ flex: 1, textAlign: isAr ? 'right' : 'left' }}>
                            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.82rem', color: '#F8F4EA' }}>{isAr ? item.arabic : item.title}</div>
                            <div style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#D4AF37' }}>{isAr ? item.title : ''}</div>
                          </div>
                          <ArrowRight size={14} color="#D4AF37" style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <Hash size={36} color="rgba(212,175,55,0.2)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', color: '#C7C3B9', fontSize: '1rem', direction: isAr ? 'rtl' : 'ltr' }}>{isAr ? `لا نتائج لـ "${query}"` : `No results for "${query}"`}</div>
                </div>
              ) : (
                <div style={{ padding: '8px' }}>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', letterSpacing: '0.12em', padding: '6px 12px 4px', textAlign: isAr ? 'right' : 'left', textTransform: isAr ? 'none' : 'uppercase' }}>
                    {results.length} {isAr ? 'نتائج' : 'results'}
                  </div>
                  {results.map(result => (
                    <motion.button key={result.id} onClick={() => handleSelect(result)}
                      whileHover={{ background: 'rgba(212,175,55,0.08)' }}
                      style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, textAlign: isAr ? 'right' : 'left', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: `${HALL_COLORS[result.hall]}22`, border: `1px solid ${HALL_COLORS[result.hall]}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: HALL_COLORS[result.hall] }}>
                        {HALL_ICONS[result.hall]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, textAlign: isAr ? 'right' : 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexDirection: isAr ? 'row-reverse' : 'row' }}>
                          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.85rem', color: '#F8F4EA', fontWeight: 500 }}>{isAr ? result.arabic : result.title}</div>
                          <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: '#D4AF37' }}>{isAr ? result.title : ''}</div>
                        </div>
                        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', direction: isAr ? 'rtl' : 'ltr' }}>{isAr && (result as any).descriptionAr ? (result as any).descriptionAr : result.description}</div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexDirection: isAr ? 'row-reverse' : 'row' }}>
                          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: HALL_COLORS[result.hall], background: `${HALL_COLORS[result.hall]}22`, borderRadius: 4, padding: '1px 6px' }}>{isAr ? (result.type === 'Artifact' ? 'قطعة أثرية' : result.type === 'Symbol' ? 'رمز' : result.type === 'Concept' ? 'مفهوم' : result.type === 'Manuscript' ? 'مخطوطة' : 'قاعة') : result.type}</span>
                          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: '#C7C3B9' }}>{isAr ? `قاعة ${result.hall}` : `Hall ${result.hall}`}</span>
                        </div>
                      </div>
                      <ArrowRight size={14} color="rgba(212,175,55,0.4)" style={{ flexShrink: 0, marginTop: 4, transform: isAr ? 'rotate(180deg)' : 'none' }} />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(212,175,55,0.1)', display: 'flex', gap: 16, alignItems: 'center', direction: isAr ? 'rtl' : 'ltr' }}>
              {[['↵', isAr ? 'تصفح' : 'Select'], ['↑↓', isAr ? 'تحرك' : 'Navigate'], ['ESC', isAr ? 'إغلاق' : 'Close']].map(([key, label]) => (
                <div key={key} style={{ display: 'flex', gap: 5, alignItems: 'center', direction: 'ltr' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#C7C3B9', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, padding: '1px 5px' }}>{key}</span>
                  <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: 'rgba(199,195,185,0.5)' }}>{label}</span>
                </div>
              ))}
              <div style={{ [isAr ? 'marginRight' : 'marginLeft']: 'auto', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.7rem', color: '#D4AF37', opacity: 0.6 }}>{isAr ? 'متحف الفينيق' : 'Phoenix Museum'}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
