import mongoose from 'mongoose';
import Artifact from './models/Artifact.js';
import dotenv from 'dotenv';
dotenv.config();

// Define dummy React components for the JSX tags
const Moon = () => null;
const Star = () => null;
const Activity = () => null;
const Wind = () => null;

const manuscripts = [
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

export const cipherHistory = [
  {
    id: 'khalil',
    name: 'Al-Khalil ibn Ahmad',
    nameAr: 'الخليل بن أحمد الفراهيدي',
    date: '786 CE',
    achievement: 'First cryptanalytic book',
    achievementAr: 'أول كتاب في التعمية (التشفير)',
    description: 'Wrote the first known book on cryptography "Kitab al-Muamma", containing the earliest recorded use of permutations and combinations.',
    descriptionAr: 'كتب أول كتاب معروف في التعمية "كتاب المعمى"، والذي يحتوي على أول استخدام مسجل للتباديل والتوافيق.',
  },
  {
    id: 'kindi',
    name: 'Al-Kindi',
    nameAr: 'الكندي',
    date: '850 CE',
    achievement: 'Invented Frequency Analysis',
    achievementAr: 'اخترع تحليل التكرار',
    description: 'Discovered that letter frequencies in text could be used to break substitution ciphers, fundamentally changing cryptography forever.',
    descriptionAr: 'اكتشف أن تكرار الحروف في النص يمكن استخدامه لكسر شفرات الاستبدال، مما أدى إلى تغيير جذري في علم التعمية إلى الأبد.',
  },
  {
    id: 'ibnadlan',
    name: 'Ibn Adlan',
    nameAr: 'ابن عدلان',
    date: '1268 CE',
    achievement: 'Sample size calculations',
    achievementAr: 'حسابات حجم العينة',
    description: 'First to realize that frequency analysis only works on texts of a certain minimum length (which he calculated as ~90 letters).',
    descriptionAr: 'أول من أدرك أن تحليل التكرار يعمل فقط على النصوص ذات الحد الأدنى المعين من الطول (والذي حسبه بـ 90 حرفًا تقريبًا).',
  },
  {
    id: 'qashqandi',
    name: 'Al-Qalqashandi',
    nameAr: 'القلقشندي',
    date: '1412 CE',
    achievement: 'Cipher encyclopedia',
    achievementAr: 'موسوعة التشفير',
    description: 'Compiled a massive 14-volume encyclopedia containing 7 different encryption methods and their cryptanalysis.',
    descriptionAr: 'جمع موسوعة ضخمة من 14 مجلدًا تحتوي على 7 طرق تشفير مختلفة وطرق تحليلها كسرها.',
  }
];

export const roots = [
  {
    id: 'RHM',
    arabic: 'ر-ح-م',
    transliteration: 'R-Ḥ-M',
    coreMeaning: 'Womb, Mercy, Compassion',
    coreMeaningAr: 'الرحم، الرحمة، الشفقة',
    occurrences: 339,
    derivatives: [
      { word: 'Rahma', arabic: 'رَحْمَة', meaning: 'Mercy (noun)', meaningAr: 'رحمة (اسم)', count: 114 },
      { word: 'Ar-Rahman', arabic: 'ٱلرَّحْمَـٰن', meaning: 'The Entirely Merciful', meaningAr: 'الرحمن', count: 57 },
      { word: 'Ar-Rahim', arabic: 'ٱلرَّحِيم', meaning: 'The Especially Merciful', meaningAr: 'الرحيم', count: 115 },
      { word: 'Rahm', arabic: 'رَحِم', meaning: 'Womb / Kinship', meaningAr: 'رحم / قرابة', count: 12 },
    ],
    visualization: {
      type: 'radial',
      nodes: [
        { id: 'rhm', label: 'ر-ح-م', type: 'root' },
        { id: 'rahma', label: 'رَحْمَة', type: 'noun', dist: 1 },
        { id: 'ar-rahman', label: 'ٱلرَّحْمَـٰن', type: 'name', dist: 1.5 },
        { id: 'ar-rahim', label: 'ٱلرَّحِيم', type: 'name', dist: 1.5 },
        { id: 'rahm', label: 'رَحِم', type: 'noun', dist: 2 },
      ],
      links: [
        { source: 'rhm', target: 'rahma' },
        { source: 'rhm', target: 'ar-rahman' },
        { source: 'rhm', target: 'ar-rahim' },
        { source: 'rhm', target: 'rahm' },
      ]
    },
    deepDive: "The root R-H-M connects the concept of divine mercy directly to the biological reality of the mother's womb (rahm). In Islamic theology, God's mercy is described as being 100 parts, with only 1 part sent to Earth—this 1 part is what causes a mother animal to lift her hoof off her newborn to avoid crushing it.",
    deepDiveAr: 'يربط الجذر ر-ح-م مفهوم الرحمة الإلهية مباشرة بالواقع البيولوجي لرحم الأم. في اللاهوت الإسلامي، توصف رحمة الله بأنها 100 جزء، تم إرسال جزء واحد منها فقط إلى الأرض - هذا الجزء الواحد هو ما يجعل الأم الحيوان ترفع حافرها عن وليدها لتجنب سحقه.'
  },
  {
    id: 'SLM',
    arabic: 'س-ل-م',
    transliteration: 'S-L-M',
    coreMeaning: 'Peace, Soundness, Submission',
    coreMeaningAr: 'السلام، السلامة، الاستسلام',
    occurrences: 140,
    derivatives: [
      { word: 'Islam', arabic: 'إِسْلَام', meaning: 'Submission (to God)', meaningAr: 'استسلام (لله)', count: 8 },
      { word: 'Salam', arabic: 'سَلَام', meaning: 'Peace', meaningAr: 'سلام', count: 42 },
      { word: 'Muslim', arabic: 'مُسْلِم', meaning: 'One who submits', meaningAr: 'من يستسلم', count: 42 },
      { word: 'Salim', arabic: 'سَلِيم', meaning: 'Sound / Flawless', meaningAr: 'سليم / خالٍ من العيوب', count: 2 },
    ],
    visualization: {
      type: 'radial',
      nodes: [
        { id: 'slm', label: 'س-ل-م', type: 'root' },
        { id: 'islam', label: 'إِسْلَام', type: 'noun', dist: 1 },
        { id: 'salam', label: 'سَلَام', type: 'noun', dist: 1 },
        { id: 'muslim', label: 'مُسْلِم', type: 'noun', dist: 1.5 },
        { id: 'salim', label: 'سَلِيم', type: 'adjective', dist: 2 },
      ],
      links: [
        { source: 'slm', target: 'islam' },
        { source: 'slm', target: 'salam' },
        { source: 'slm', target: 'muslim' },
        { source: 'slm', target: 'salim' },
      ]
    },
    deepDive: "S-L-M demonstrates the profound interconnectedness of Islamic concepts. The word 'Islam' means submission, but derived from a root meaning 'soundness' and 'peace'. The theological implication is that true peace (salam) and spiritual soundness (salim) can only be achieved through voluntary submission (islam) to the Creator.",
    deepDiveAr: 'يوضح الجذر س-ل-م الترابط العميق للمفاهيم الإسلامية. كلمة "إسلام" تعني الاستسلام، لكنها مشتقة من جذر يعني "السلامة" و"السلام". المعنى اللاهوتي هو أن السلام الحقيقي (سلام) والسلامة الروحية (سليم) لا يمكن تحقيقهما إلا من خلال الاستسلام الطوعي (إسلام) للخالق.'
  },
  {
    id: 'AQL',
    arabic: 'ع-ق-ل',
    transliteration: 'ʿ-Q-L',
    coreMeaning: 'Intellect, Tying, Restraining',
    coreMeaningAr: 'العقل، الربط، التقييد',
    occurrences: 49,
    derivatives: [
      { word: "Ya'qilun", arabic: 'يَعْقِلُون', meaning: 'They reason/understand', meaningAr: 'يعقلون/يفهمون', count: 22 },
      { word: "Ta'qilun", arabic: 'تَعْقِلُون', meaning: 'You reason/understand', meaningAr: 'تعقلون/تفهمون', count: 24 },
      { word: "Na'qilu", arabic: 'نَعْقِلُ', meaning: 'We reason/understand', meaningAr: 'نعقل/نفهم', count: 1 },
      { word: "'Aqalu", arabic: 'عَقَلُوهُ', meaning: 'They understood it', meaningAr: 'عقلوه', count: 1 },
    ],
    visualization: {
      type: 'tree',
      nodes: [
        { id: 'aql', label: 'ع-ق-ل', type: 'root' },
        { id: 'yaqilun', label: 'يَعْقِلُون', type: 'verb', dist: 1 },
        { id: 'taqilun', label: 'تَعْقِلُون', type: 'verb', dist: 1 },
        { id: 'naqilu', label: 'نَعْقِلُ', type: 'verb', dist: 1.5 },
      ],
      links: [
        { source: 'aql', target: 'yaqilun' },
        { source: 'aql', target: 'taqilun' },
        { source: 'aql', target: 'naqilu' },
      ]
    },
    deepDive: "Fascinatingly, the Quran never uses 'Aql as a static noun (intellect), but exclusively as an active verb (to reason, to understand). The root originally meant the hobbling cord used to tie a camel. Thus, reasoning ('aql) is the cognitive process that 'ties down' human impulses and passions, tethering a person to truth and ethical behavior.",
    deepDiveAr: 'من المثير للاهتمام أن القرآن لا يستخدم أبداً كلمة "عقل" كاسم ثابت، بل حصرياً كفعل نشط (يعقل، يفهم). كان الجذر يعني في الأصل عقال البعير المستخدم لربطه. وبالتالي، فإن التعقل (عقل) هو العملية المعرفية التي "تربط" الدوافع والعواطف البشرية، وتربط الشخص بالحقيقة والسلوك الأخلاقي.'
  }
];

export const symbolData = {
  light: [
    {
      word: 'NUR', arabic: 'نُور', name: 'Light',
      verse: 'Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp...',
      verseArabic: '۞ ٱللَّهُ نُورُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ ۚ مَثَلُ نُورِهِۦ كَمِشْكَوٰةٍ فِيهَا مِصْبَاحٌ ۖ',
      surah: 'Surah An-Nur 24:35',
      meaning: 'Divine guidance, knowledge, and spiritual illumination. Light removes the darkness of ignorance.',
      deepMeaning: 'The "Verse of Light" (Ayat an-Nur) is arguably the most famous mystical passage in the Quran. It builds a layered metaphor: a niche (the human body/chest), a glass (the pure heart), a lamp (the intellect/spirit), lit from a blessed olive tree (divine revelation). It suggests that human spiritual capacity must be ignited by divine grace ("light upon light").',
      references: ['Al-Ghazali\'s "Mishkat al-Anwar" (The Niche for Lights)', 'Ibn Sina\'s interpretations of intellect', 'Sufi cosmology'],
      scholars: 'Al-Ghazali, Fakhr al-Din al-Razi, Ibn Arabi',
    },
    {
      word: 'SIRAJ', arabic: 'سِرَاج', name: 'Lamp / Blazing Fire',
      verse: 'And We placed therein a blazing lamp.',
      verseArabic: 'وَجَعَلْنَا سِرَاجًا وَهَّاجًا',
      surah: 'Surah An-Naba 78:13',
      meaning: 'Often refers to the sun, a self-generating source of brilliant, burning light and heat.',
      deepMeaning: 'In the Quran, the sun is called a "siraj" (blazing lamp), while the moon is called "nur" (reflected light). Prophet Muhammad is uniquely referred to as "Siraj-an Munira" (an illuminating lamp), combining the self-generating heat/energy of the siraj with the gentle, guiding illumination of nur.',
      references: ['Scientific miracles in the Quran', 'Prophetic biography (Seerah)'],
      scholars: 'Ibn Kathir, Al-Qurtubi',
    }
  ],
  water: [
    {
      word: 'MAA', arabic: 'مَاء', name: 'Water',
      verse: 'And We made from water every living thing. Then will they not believe?',
      verseArabic: 'وَجَعَلْنَا مِنَ ٱلْمَآءِ كُلَّ شَىْءٍ حَىٍّ ۖ أَفَلَا يُؤْمِنُونَ',
      surah: 'Surah Al-Anbiya 21:30',
      meaning: 'Life, purification, divine mercy, and resurrection of the dead earth.',
      deepMeaning: 'Water in the Quran is the foundational element of biology ("made every living thing"), but also the primary vehicle of ritual purity (Wudu/Ghusl). Furthermore, the descending of rain upon barren land is consistently used as the primary rational proof for the bodily resurrection on the Day of Judgment.',
      references: ['Islamic ecotheology', 'Fiqh of Taharah (purification)', 'Eschatological parables'],
      scholars: 'Said Nursi, Al-Tabari',
    },
    {
      word: 'BAHR', arabic: 'بَحْر', name: 'The Sea / Ocean',
      verse: 'And He it is Who has subjected the sea that you may eat from it tender meat...',
      verseArabic: 'وَهُوَ ٱلَّذِى سَخَّرَ ٱلْبَحْرَ لِتَأْكُلُوا۟ مِنْهُ لَحْمًا طَرِيًّا',
      surah: 'Surah An-Nahl 16:14',
      meaning: 'Divine provision, overwhelming power, and the depths of knowledge.',
      deepMeaning: 'The sea represents the vastness of God\'s knowledge. The Quran states that if all oceans were ink, they would dry up before recording the words of God. The sea is also the setting for Moses\'s encounter with Khidr (the junction of the two seas), representing the meeting point of exoteric law and esoteric wisdom.',
      references: ['Story of Musa and Khidr', 'Maritime law in early Islam', 'Mystical poetry'],
      scholars: 'Ibn Ajiba, Rumi (poetry)',
    }
  ],
  nature: [
    {
      word: 'SHAJARAH', arabic: 'شَجَرَة', name: 'The Tree',
      verse: 'Have you not considered how Allah presents an example, [making] a good word like a good tree, whose root is firmly fixed and its branches [high] in the sky?',
      verseArabic: 'أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ طَيِّبَةٍ أَصْلُهَا ثَابِتٌ وَفَرْعُهَا فِى ٱلسَّمَآءِ',
      surah: 'Surah Ibrahim 14:24',
      meaning: 'Faith, groundedness, continuous charity, and the lineage of prophets.',
      deepMeaning: 'The "Good Tree" is the ultimate paradigm of the believer: rooted deeply in unseen faith (roots), extending upward in worship (branches), and providing continuous benefit to others (fruit). Conversely, the "Cursed Tree" (Zaqqum) in Hell represents the bitter harvest of corruption.',
      references: ['The Blessed Olive Tree', 'The Tree of Ridwan', 'The Lote Tree of the Utmost Boundary (Sidrat al-Muntaha)'],
      scholars: 'Al-Zamakhshari, Ibn Taymiyyah',
    },
    {
      word: 'JABAL', arabic: 'جَبَل', name: 'The Mountain',
      verse: 'And the mountains as pegs.',
      verseArabic: 'وَٱلْجِبَالَ أَوْتَادًا',
      surah: 'Surah An-Naba 78:7',
      meaning: 'Stability, majesty, the awe of God, and the weight of divine revelation.',
      deepMeaning: 'Mountains represent immense physical stability but total spiritual humility. The Quran states that if revelation had been sent down upon a mountain, it would have crumbled from the awe of God. Yet, the human heart was given the capacity to carry this "trust" (Amanah). Mountains are also where revelation occurs: Mount Sinai (Musa), Mount Hira (Muhammad).',
      references: ['Geological references in Quran', 'The concept of Amanah (Trust)'],
      scholars: 'Al-Maturidi, Al-Baghawi',
    }
  ],
  colors: [
    {
      word: 'ABYAD', arabic: 'أَبْيَض', name: 'White — Purity and Ihram',
      verse: 'On the Day when some faces will turn white and some faces will turn black. As for those whose faces turn black: Did you disbelieve after your belief?',
      verseArabic: 'يَوْمَ تَبْيَضُّ وُجُوهٌ وَتَسْوَدُّ وُجُوهٌ ۚ فَأَمَّا ٱلَّذِينَ ٱسْوَدَّتْ وُجُوهُهُمْ أَكَفَرْتُم',
      surah: 'Surah Al-Imran 3:106',
      meaning: 'White = spiritual purity, truthfulness, and the light of divine acceptance on the Day of Judgment.',
      deepMeaning: 'The Quran uses whitening and blackening of faces as the ultimate spiritual metaphor — not referring to race, but to inner states made visible. Pilgrims wear white ihram garments to symbolize spiritual equality and purity before God — all status markers removed. The Prophet described the heart as either white (clean, receptive to guidance) or black (sealed, hardened). Islamic ritual purity (taharah) culminates in the white garment, the white shroud of the deceased, and ultimately the Day when inner whiteness or blackness becomes outwardly manifest.',
      references: ['Quranic color theology', 'Ihram symbolism in Hajj studies', 'Heart symbolism in hadith and Sufi tradition'],
      scholars: 'Al-Ghazali, Ibn al-Qayyim, Tariq Ramadan',
    },
    {
      word: 'ASFAR', arabic: 'أَصْفَر', name: 'Yellow — Divine Sign',
      verse: 'Indeed, Allah commands you to slaughter a cow. They said: What color should it be? He said: Allah says it should be a yellow cow, intensely yellow, pleasing to the observers.',
      verseArabic: 'قَالَ إِنَّهُۥ يَقُولُ إِنَّهَا بَقَرَةٌ صَفْرَآءُ فَاقِعٌ لَّوْنُهَا تَسُرُّ ٱلنَّـٰظِرِينَ',
      surah: 'Surah Al-Baqarah 2:69',
      meaning: 'Joy, visibility, warning, and the cycle of life.',
      deepMeaning: 'Yellow in the Quran is uniquely described as "pleasing to the observers" (in the story of the cow), representing vitality and joy. However, it is also used eschatologically: when crops dry up and turn yellow, it is a metaphor for the fleeting nature of worldly life (Surah Az-Zumar 39:21). The dual nature of yellow—both the vibrant color of life and the withered color of decay—serves as a profound reminder of the temporal world.',
      references: ['Color psychology in Islamic art', 'Metaphors of agriculture in the Quran'],
      scholars: 'Al-Qurtubi, Sayyid Qutb',
    }
  ]
};

import { categories } from '../src/app/components/halls/QuranHall.tsx';
import { symbols } from '../src/app/components/halls/SemioticsHall.tsx';

async function execute() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const halls = [];

  manuscripts.forEach(m => halls.push({ hall: 'Manuscript', ...m }));
  mockResults.forEach(m => halls.push({ hall: 'AILab', ...m }));
  roots.forEach(r => halls.push({ hall: 'Semantics', ...r }));
  cipherHistory.forEach(c => halls.push({ hall: 'Cryptography', ...c }));

  Object.keys(symbolData).forEach(cat => {
    symbolData[cat].forEach(s => halls.push({ hall: 'QuranSymbol', categoryName: cat, ...s }));
  });

  categories.forEach(c => halls.push({ hall: 'QuranCategory', ...c }));

  symbols.forEach(s => halls.push({ hall: 'Semiotics', ...s, symbolIconName: typeof s.symbol === 'string' ? s.symbol : (s.name || 'Unknown') }));

  const newHalls = ['Manuscript', 'QuranCategory', 'QuranSymbol', 'Semantics', 'Cryptography', 'AILab', 'Semiotics'];
  await Artifact.deleteMany({ hall: { $in: newHalls } });
  
  await Artifact.insertMany(halls);
  console.log(`Seeded ${halls.length} artifacts to MongoDB!`);
  process.exit(0);
}

execute().catch(console.error);
import { artifacts as historyArtifacts, periods as historyPeriods } from '../src/app/components/halls/HistoryHall.tsx';

async function seedHistory() {
  await mongoose.connect(process.env.MONGODB_URI);
  const halls = [];
  historyPeriods.forEach(p => halls.push({ hall: 'HistoryPeriod', ...p }));
  historyArtifacts.forEach(a => halls.push({ hall: 'HistoryArtifact', ...a }));

  const newHalls = ['HistoryPeriod', 'HistoryArtifact'];
  await Artifact.deleteMany({ hall: { $in: newHalls } });
  
  await Artifact.insertMany(halls);
  console.log(`Seeded ${halls.length} History artifacts to MongoDB!`);
  process.exit(0);
}

seedHistory().catch(console.error);
