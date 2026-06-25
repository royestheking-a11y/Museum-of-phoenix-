import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Hash, TreePine, Palette, Star, Shield, Sword, Zap, Droplets, TreeDeciduous, Bird, BookOpen, ScrollText, Sparkles, Building2, Eye, PenTool, Compass, Globe, Map, Key, Lock, Diamond, Feather, Target, Wind, Flame, Mountain, Cloud, Tent, Filter, X, Volume2, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const categories = [
  { id: 'light', label: 'Light', arabic: 'النور والضياء', Icon: Sun, color: '#D4AF37' },
  { id: 'water', label: 'Water', arabic: 'الماء والبحار', Icon: Droplets, color: '#4a8aba' },
  { id: 'animals', label: 'Animals', arabic: 'الحيوانات', Icon: Bird, color: '#4a8a4a' },
  { id: 'numbers', label: 'Sacred Numbers', arabic: 'الأرقام المقدسة', Icon: Hash, color: '#8a4a8a' },
  { id: 'trees', label: 'Trees & Plants', arabic: 'الأشجار والنبات', Icon: TreePine, color: '#2a7a3a' },
  { id: 'colors', label: 'Colors', arabic: 'الألوان', Icon: Palette, color: '#8a5a1a' },
  { id: 'structures', label: 'Sacred Structures', arabic: 'المواضع المقدسة', Icon: Building2, color: '#6a3a2a' },
];

type SE = {
  word: string; arabic: string; name: string; verse: string;
  verseArabic: string; surah: string; meaning: string;
  deepMeaning: string; references: string[]; scholars: string;
};

export const symbolData: Record<string, any[]> = {
  light: [
    {
      word: 'NUR', icon: <Sun size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'نُور', name: 'Divine Light',
      verse: 'Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp; the lamp is within glass, the glass as if it were a brilliant star lit from a blessed olive tree.',
      verseArabic: 'ٱللَّهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ۚ مَثَلُ نُورِهِۦ كَمِشْكَوٰةٍ فِيهَا مِصْبَاحٌ ۖ ٱلْمِصْبَاحُ فِى زُجَاجَةٍ ۖ ٱلزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّىٌّ',
      surah: 'Surah An-Nur 24:35',
      meaning: 'The primordial reality — divine guidance, spiritual illumination, the essence of God\'s presence in creation.',
      deepMeaning: 'The Light Verse (Ayat al-Nur) is the most analyzed verse in Islamic philosophy. Ibn Rushd called it "the most perfect description of reality in human language." Al-Ghazali wrote an entire treatise on it (Mishkat al-Anwar). The niche, lamp, and glass represent three stages of prophetic illumination. Sufi masters interpreted Nur as the pre-eternal Muhammadan Light from which all creation emanated.',
      references: ['Mishkat al-Anwar by Al-Ghazali', 'Tafsir Ibn Kathir', 'Fusus al-Hikam by Ibn Arabi', 'Mulla Sadra\'s commentary'],
      scholars: 'Al-Ghazali, Ibn Arabi, Rumi, Mulla Sadra',
    },
    {
      word: 'DIYA', icon: <Moon size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'ضِيَاء', name: 'Radiant Brightness',
      verse: 'It is He who made the sun a shining light and the moon a derived light and determined for it phases — that you may know the number of years and count of time.',
      verseArabic: 'هُوَ ٱلَّذِى جَعَلَ ٱلشَّمْسَ ضِيَآءً وَٱلْقَمَرَ نُورًا وَقَدَّرَهُۥ مَنَازِلَ لِتَعْلَمُوا۟ عَدَدَ ٱلسِّنِينَ وَٱلْحِسَابَ',
      surah: 'Surah Yunus 10:5',
      meaning: 'Active, outward brilliance — the sun\'s own generated light, distinguished from the moon\'s reflected light (nur).',
      deepMeaning: 'The Quran uses two distinct words for light: diya (self-generated brilliance, like the sun) and nur (reflective, transmitted light, like the moon). This distinction — made 1,000 years before modern astrophysics confirmed the moon has no light of its own — astonished medieval scholars. It encodes a fundamental cosmological truth about the nature of illumination.',
      references: ['Al-Tabari\'s Tafsir', 'Al-Razi\'s Mafatih al-Ghayb', 'Modern scientific tafsir literature'],
      scholars: 'Al-Tabari, Fakhr al-Din al-Razi, Zaghloul El-Naggar',
    },
    {
      word: 'NUUR AL-HUDA', icon: <Star size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'نُورُ الهُدى', name: 'Light of Guidance',
      verse: 'Indeed, it is We who sent down the Qur\'an and indeed, We will be its guardian. And We have already sent before you messengers to their peoples, and they came to them with clear evidences.',
      verseArabic: 'يُرِيدُونَ أَن يُطْفِـُٔوا۟ نُورَ ٱللَّهِ بِأَفْوَٰهِهِمْ وَيَأْبَى ٱللَّهُ إِلَّآ أَن يُتِمَّ نُورَهُۥ وَلَوْ كَرِهَ ٱلْكَٰفِرُونَ',
      surah: 'Surah At-Tawbah 9:32',
      meaning: 'The Qur\'an itself described as divine light — inextinguishable guidance sent to illuminate human civilization.',
      deepMeaning: 'The metaphor of enemies trying to extinguish God\'s light with their mouths — like blowing on the sun — captures the futility of suppressing divine revelation. Islamic civilization interpreted this as a command to spread the light of knowledge, leading to the great translation movement (Bayt al-Hikmah) that preserved and advanced Greek, Persian, and Indian learning.',
      references: ['Tafsir al-Jalalayn', 'Bayt al-Hikmah historical records', 'Al-Jahiz on Islamic intellectual tradition'],
      scholars: 'Al-Jalalayn, Ibn Khaldun, Al-Kindi',
    },
  ],
  water: [
    {
      word: "MA'", arabic: 'مَاء', name: 'Life-Giving Water',
      verse: 'And We made from water every living thing. Will they not then believe?',
      verseArabic: 'وَجَعَلْنَا مِنَ ٱلْمَآءِ كُلَّ شَىْءٍ حَىٍّ ۖ أَفَلَا يُؤْمِنُونَ',
      surah: 'Surah Al-Anbiya 21:30',
      meaning: 'The molecular origin of life — recognized 1,400 years before biology confirmed all cellular life requires water.',
      deepMeaning: 'Modern biology confirms that all known life is water-based — cells are 70% water, the cytoplasm requires water for biochemical reactions, and the first life emerged in primordial oceans. The Quranic statement predates Watson and Crick by 13 centuries. Islamic scholars interpreted this as both a biological fact and a spiritual truth: purification (taharah) requires water because the origin of all purity is water.',
      references: ['Modern Islamic science commentary', 'Tafsir al-Qurtubi', 'Dr. Zaghloul El-Naggar\'s scientific tafsir'],
      scholars: 'Al-Qurtubi, Ibn al-Qayyim, Maurice Bucaille',
    },
    {
      word: 'NAHR', icon: <Shield size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'نَهَر', name: 'Rivers of Paradise',
      verse: 'The description of Paradise which the righteous are promised — in it are rivers of water unaltered, rivers of milk unchanged, rivers of wine delicious to drinkers, and rivers of purified honey.',
      verseArabic: 'فِيهَآ أَنْهَٰرٌ مِّن مَّآءٍ غَيْرِ ءَاسِنٍ وَأَنْهَٰرٌ مِّن لَّبَنٍ لَّمْ يَتَغَيَّرْ طَعْمُهُۥ وَأَنْهَٰرٌ مِّنْ خَمْرٍ لَّذَّةٍ لِّلشَّٰرِبِينَ وَأَنْهَٰرٌ مِّنْ عَسَلٍ مُّصَفًّى',
      surah: 'Surah Muhammad 47:15',
      meaning: 'Four rivers of paradise symbolizing four dimensions of eternal nourishment: life, sustenance, joy, and sweetness.',
      deepMeaning: 'The four rivers of paradise (water, milk, wine, honey) map onto four states of human need: biological survival (water), nourishment (milk), intoxication of divine joy (wine — halal in paradise), and the sweetness of closeness to God (honey). Sufi commentators saw them as stages of mystical journey — each river representing a maqam (spiritual station) on the path to union.',
      references: ['Al-Qushayri\'s Risala', 'Tafsir Ibn Kathir on Surah Muhammad', 'Descriptions of Jannah in hadith literature'],
      scholars: 'Al-Qushayri, Ibn Kathir, Al-Ghazali',
    },
    {
      word: 'BAHR', icon: <Sword size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'بَحَر', name: 'The Great Sea',
      verse: 'And if whatever trees upon the earth were pens and the sea was ink, replenished thereafter by seven more seas, the words of Allah would not be exhausted.',
      verseArabic: 'وَلَوْ أَنَّمَا فِى ٱلْأَرْضِ مِن شَجَرَةٍ أَقْلَٰمٌ وَٱلْبَحْرُ يَمُدُّهُۥ مِنۢ بَعْدِهِۦ سَبْعَةُ أَبْحُرٍ مَّا نَفِدَتْ كَلِمَٰتُ ٱللَّهِ',
      surah: 'Surah Luqman 31:27',
      meaning: 'The infinite nature of divine knowledge — the ocean as a metaphor for the boundlessness of God\'s words and wisdom.',
      deepMeaning: 'This verse uses the most hyperbolic possible image — every tree as a pen, the ocean as ink, plus seven more oceans — to convey that divine knowledge cannot be exhausted. Medieval mathematicians used this verse to explore concepts of infinity. It also inspired the Islamic emphasis on writing and scholarship: if the universe\'s trees were pens, imagine how important actual pens and scholars are.',
      references: ['Al-Razi\'s mathematical commentary', 'Ibn Arabi on divine attributes', 'Islamic philosophy of infinite knowledge'],
      scholars: 'Fakhr al-Din al-Razi, Ibn Arabi, Al-Jurjani',
    },
  ],
  animals: [
    {
      word: 'TAYR', icon: <Zap size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'طَيْر', name: 'The Sacred Bird',
      verse: 'Do they not see the birds above them spreading and folding their wings? None holds them but the Most Merciful. Indeed He is Seeing of all things.',
      verseArabic: 'أَوَلَمْ يَرَوْا۟ إِلَى ٱلطَّيْرِ فَوْقَهُمْ صَٰٓفَّٰتٍ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا ٱلرَّحْمَٰنُ',
      surah: 'Surah Al-Mulk 67:19',
      meaning: 'Divine sustenance visible in flight — every wingbeat held by God, every creature sustained by the Most Merciful.',
      deepMeaning: 'The aerodynamics of bird flight — complex physics of lift, drag, and thrust — is presented as evidence of divine upholding. The image became central to Sufi symbolism: Farid ud-Din Attar\'s "Conference of the Birds" (Mantiq al-Tayr) uses 30 birds journeying to find the Simurgh (God) as the soul\'s journey to divine union. The hoopoe (hudhud) appears as Solomon\'s messenger in Surah An-Naml.',
      references: ["Attar's Mantiq al-Tayr", 'Tafsir Surah Al-Mulk', 'Sufi symbolism of birds', 'Quranic bird narratives'],
      scholars: 'Farid ud-Din Attar, Ibn Arabi, Al-Qushayri',
    },
    {
      word: 'NAHL', icon: <Droplets size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'نَحْل', name: 'The Inspired Bee',
      verse: 'And your Lord inspired the bee: Make your homes in the mountains, the trees, and what people construct. Then eat from all the fruits and follow the ways made easy for you by your Lord.',
      verseArabic: 'وَأَوْحَىٰ رَبُّكَ إِلَى ٱلنَّحْلِ أَنِ ٱتَّخِذِى مِنَ ٱلْجِبَالِ بُيُوتًا وَمِنَ ٱلشَّجَرِ وَمِمَّا يَعْرِشُونَ',
      surah: 'Surah An-Nahl 16:68',
      meaning: 'Divine inspiration (wahy) given to the bee — God communicates with all of creation, not only prophets.',
      deepMeaning: 'The word used for God\'s communication to the bee (awha) is the same word used for revelation to prophets — suggesting a spectrum of divine communication pervading all creation. The hexagonal honeycomb is mathematically optimal — the most efficient shape for storing maximum honey using minimum wax. Medieval mathematicians including Omar Khayyam studied this. The entire surah (An-Nahl, "The Bee") is named after this creature, honoring its community, precision, and gift.',
      references: ['Mathematical honeycomb studies by Islamic scholars', 'Surah An-Nahl complete tafsir', 'Al-Jahiz\'s Book of Animals'],
      scholars: 'Al-Jahiz, Al-Qazwini, Ibn al-Nafis',
    },
    {
      word: 'FIL', icon: <TreeDeciduous size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'فِيل', name: 'The Elephant',
      verse: 'Have you not considered how your Lord dealt with the companions of the elephant? Did He not make their plan go astray? And He sent against them birds in flocks.',
      verseArabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَٰبِ ٱلْفِيلِ ۝ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِى تَضْلِيلٍ ۝ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ',
      surah: 'Surah Al-Fil 105:1-3',
      meaning: 'Divine protection of the Sacred House — the elephant army of Abraha destroyed by birds, the year of the Prophet\'s birth.',
      deepMeaning: 'The Year of the Elephant (570 CE) — when the Abyssinian general Abraha marched on Mecca with war elephants — is the historical backdrop of the Prophet\'s birth. The "birds in flocks" (ababeel) carrying stones of baked clay are historically recorded by multiple sources. Modern scholars debate whether epidemic disease destroyed the army or literal bird attack. The event established Mecca\'s inviolability as a sacred protected zone in Arabian consciousness.',
      references: ['Ibn Ishaq\'s Sirah Rasul Allah', 'Al-Tabari\'s History', 'Modern historical analysis of the Year of the Elephant'],
      scholars: 'Ibn Ishaq, Al-Tabari, Martin Lings',
    },
    {
      word: "ANKABUT", arabic: 'عَنكَبُوت', name: 'The Spider',
      verse: 'The example of those who take allies other than Allah is like that of the spider who takes a home. And indeed, the weakest of homes is the home of the spider, if they only knew.',
      verseArabic: 'مَثَلُ ٱلَّذِينَ ٱتَّخَذُوا۟ مِن دُونِ ٱللَّهِ أَوْلِيَآءَ كَمَثَلِ ٱلْعَنكَبُوتِ ٱتَّخَذَتْ بَيْتًا',
      surah: "Surah Al-'Ankabut 29:41",
      meaning: 'The fragility of false protection — the spider\'s web, beautiful but structurally weak, represents idolatry and false security.',
      deepMeaning: "Spider silk is paradoxically the strongest natural material per unit weight — yet a spider's web is easily destroyed. This Quranic image captures the simultaneous appearance of strength and fundamental fragility in false refuges. Modern materials scientists marvel at spider silk's properties. The surah named after the spider (Al-Ankabut) was revealed during a period of persecution, reassuring believers that apparent worldly power is illusory.",
      references: ["Surah Al-'Ankabut complete tafsir", 'Modern materials science and spider silk', 'Ibn Kathir on false allies'],
      scholars: 'Ibn Kathir, Al-Qurtubi, Sayyid Qutb',
    },
    {
      word: 'BAQARA', icon: <Bird size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'بَقَرَة', name: 'The Yellow Cow',
      verse: 'Indeed, Allah commands you to slaughter a cow... They said: What color should it be? He said: Allah says it should be a yellow cow, bright in color, pleasing to the observers.',
      verseArabic: 'قَالُوا۟ ٱدْعُ لَنَا رَبَّكَ يُبَيِّن لَّنَا مَا لَوْنُهَا ۚ قَالَ إِنَّهُۥ يَقُولُ إِنَّهَا بَقَرَةٌ صَفْرَآءُ فَاقِعٌ لَّوْنُهَا تَسُرُّ ٱلنَّٰظِرِينَ',
      surah: 'Surah Al-Baqarah 2:69',
      meaning: "The obedience test — the Israelites' questioning of Moses over the color of a cow symbolizes humanity's tendency to complicate divine simplicity.",
      deepMeaning: 'The story of the cow (Surah Al-Baqarah — the longest Surah, named after it) is a lesson in the dangers of excessive questioning. A simple command became complicated through repeated questions. Islamic scholars teach this as a warning against legalistic hair-splitting that loses sight of the spirit of divine command. The yellow cow also connects to ancient Egyptian solar symbolism — the Israelites\' familiarity with sacred cow worship in Egypt.',
      references: ['Surah Al-Baqarah tafsir tradition', 'Al-Tabari on Israelite narratives', 'Connection to Egyptian Apis bull cult'],
      scholars: 'Al-Tabari, Ibn Kathir, Mahmoud Shaltout',
    },
  ],
  numbers: [
    {
      word: 'SAB\'A', arabic: 'سَبْعَة', name: 'Seven — Divine Completion',
      verse: 'He is the one who created for you all that is on earth, then turned to the sky and arranged it as seven heavens. And He has knowledge of all things.',
      verseArabic: 'هُوَ ٱلَّذِى خَلَقَ لَكُم مَّا فِى ٱلْأَرْضِ جَمِيعًا ثُمَّ ٱسْتَوَىٰٓ إِلَى ٱلسَّمَآءِ فَسَوَّىٰهُنَّ سَبْعَ سَمَٰوَٰتٍ',
      surah: 'Surah Al-Baqarah 2:29',
      meaning: '7 heavens, 7 earths, 7 circuits of tawaf, 7 days of creation — the number of divine completeness and cosmic order.',
      deepMeaning: 'Seven appears 24 times in the Quran, structuring sacred reality at every level. The Kaaba is circumambulated 7 times (tawaf). The Sa\'i (walking between Safa and Marwa) is 7 times. There are 7 heavens, 7 gates of hell, 7 verses in Al-Fatiha. The number 7 in ancient Semitic cosmology (shared by Hebrew, Aramaic, and Arabic traditions) represents completed divine cycles — creation in 7 days, the 7-day week, 7 planets of the ancient world.',
      references: ['Islamic numerology studies', 'Semitic sacred number traditions', 'Al-Suyuti on Quranic numbers'],
      scholars: 'Al-Suyuti, Ibn Abi Hatim, Professor Ayman Shahin',
    },
    {
      word: "TIS'ATA 'ASHAR", arabic: 'تِسْعَةَ عَشَر', name: 'Nineteen — Mathematical Miracle',
      verse: 'Over it are nineteen [angels as guardians]. And We have not made the keepers of the Fire except angels. And We have not made their number except as a trial for those who disbelieve.',
      verseArabic: 'عَلَيْهَا تِسْعَةَ عَشَرَ ۝ وَمَا جَعَلْنَا أَصْحَٰبَ ٱلنَّارِ إِلَّا مَلَٰٓئِكَةً ۙ وَمَا جَعَلْنَآ عِدَّتَهُمْ إِلَّا فِتْنَةً لِّلَّذِينَ كَفَرُوا۟',
      surah: 'Surah Al-Muddaththir 74:30-31',
      meaning: 'The number 19 encodes a mathematical pattern throughout the Quran — a divine signature of authenticity.',
      deepMeaning: 'Researcher Rashad Khalifa (1974) discovered that Bismillah has 19 letters; the Quran has 114 surahs (19×6); the word Allah appears 2698 times (19×142). The number 19 is itself a prime — indivisible, pure. Critics dispute the methodology, but the mathematical discussion sparked decades of Quranic computational analysis. The number 19 was also significant in ancient Semitic astronomical cycles (the Metonic cycle repeats every 19 years).',
      references: ['Rashad Khalifa\'s Quran: Visual Presentation', 'Critical academic responses', 'Metonic cycle in ancient astronomy'],
      scholars: 'Rashad Khalifa, Ahmad Deedat (critical), Ali Gümüş',
    },
    {
      word: 'ARBA\'UN', arabic: 'أَرْبَعُون', name: 'Forty — The Transformation Number',
      verse: 'And We appointed for Moses thirty nights and completed them with ten — so the term of his Lord was completed as forty nights.',
      verseArabic: 'وَوَٰعَدْنَا مُوسَىٰ ثَلَٰثِينَ لَيْلَةً وَأَتْمَمْنَٰهَا بِعَشْرٍ فَتَمَّ مِيقَٰتُ رَبِّهِۦٓ أَرْبَعِينَ لَيْلَةً',
      surah: 'Surah Al-A\'raf 7:142',
      meaning: '40 — the number of spiritual maturation, transformation, and divine preparation across prophetic traditions.',
      deepMeaning: 'Forty is the universal number of transformation in Abrahamic traditions: Moses 40 nights on Sinai, Jesus 40 days in the desert, Muhammad received revelation at 40, Noah\'s flood lasted 40 days, the Israelites wandered 40 years. In Islamic tradition, the Prophet forbade criticism of a person younger than 40 — the age of full spiritual maturity. Islamic spiritual retreat (khalwa) is traditionally 40 days.',
      references: ['Comparative religion study of the number 40', 'Ibn Arabi on numbers and mysticism', 'Islamic retreat (khalwa) traditions'],
      scholars: 'Ibn Arabi, Al-Nabulsi, Joseph Campbell (comparative)',
    },
    {
      word: "TIS'UN WA TIS'UN", arabic: 'تِسْعَةٌ وَتِسْعُون', name: 'Ninety-Nine — Divine Names',
      verse: 'Allah has the most beautiful names, so call upon Him by them.',
      verseArabic: 'وَلِلَّهِ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ فَٱدْعُوهُ بِهَا',
      surah: 'Surah Al-A\'raf 7:180',
      meaning: 'The 99 Beautiful Names of God (Asma\' Allah al-Husna) — a complete mapping of divine attributes.',
      deepMeaning: 'The Prophet said: "Allah has 99 names; whoever memorizes them will enter paradise." The 99 Names form a complete theological map of the divine — from Al-Rahman (the Compassionate) to Al-Qahhaar (the Dominator). Islamic rosaries (misbaha/tasbih) have 33 or 99 beads for recitation. Sufis contemplate the names as portals to divine attributes. Ibn Arabi organized the 99 Names into a complete philosophical system in the Futuhat al-Makkiyya.',
      references: ["Ibn Arabi's Futuhat al-Makkiyya", 'Al-Ghazali\'s Al-Maqsad al-Asna', 'Classical hadith collections on the 99 Names'],
      scholars: 'Al-Ghazali, Ibn Arabi, Al-Haddad',
    },
    {
      word: 'ALF', icon: <BookOpen size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'أَلْف', name: 'A Thousand — The Infinite Multitude',
      verse: 'The angels and the Spirit descend therein by permission of their Lord for every matter. Peace it is until the emergence of dawn.',
      verseArabic: 'لَيْلَةُ ٱلْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
      surah: 'Surah Al-Qadr 97:3',
      meaning: 'Laylat al-Qadr (Night of Power) = better than 1,000 months — divine time compression and the sacredness of spiritual intensity.',
      deepMeaning: 'A thousand months equals 83.3 years — approximately a complete human lifetime. The Night of Power (in Ramadan) is worth more than an entire lifetime of ordinary worship. This divine time compression — one sacred night outweighing decades of ordinary time — is the Quranic expression that quality of spiritual presence matters infinitely more than quantity of time. Mathematically, 83 years × 12 months = 996 months ≈ 1,000, suggesting the Night of Power erases an entire lifetime\'s missed devotion.',
      references: ['Tafsir Surah Al-Qadr', 'Islamic spiritual time theology', 'Sufi commentary on Laylat al-Qadr'],
      scholars: 'Al-Nawawi, Ibn Rajab al-Hanbali, Sheikh Hamza Yusuf',
    },
  ],
  trees: [
    {
      word: 'ZAYTUNA', icon: <ScrollText size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'زَيْتُونَة', name: 'The Blessed Olive Tree',
      verse: 'Lit from a blessed tree, an olive, neither of the east nor of the west, whose oil would almost glow even if untouched by fire.',
      verseArabic: 'تُوقَدُ مِن شَجَرَةٍ مُّبَٰرَكَةٍ زَيْتُونَةٍ لَّا شَرْقِيَّةٍ وَلَا غَرْبِيَّةٍ يَكَادُ زَيْتُهَا يُضِىٓءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌ',
      surah: 'Surah An-Nur 24:35',
      meaning: 'The olive tree transcends geography — "neither east nor west" — representing universal divine wisdom accessible to all humanity.',
      deepMeaning: 'The olive tree grows around the Mediterranean, including the Holy Land, making it a symbol of all three Abrahamic religions. "Neither east nor west" has been interpreted as: (1) a tree that receives sunlight all day; (2) a symbol transcending all cultural divisions; (3) the pre-eternal position of prophetic knowledge beyond space. The oil "almost glowing without fire" suggests spiritual truth that illuminates itself — needing no external source. Ibn Arabi saw the olive tree as the perfect metaphor for the Universal Human (al-Insan al-Kamil).',
      references: ['Mishkat al-Anwar by Al-Ghazali', 'Ibn Arabi on the Universal Human', 'Botanical symbolism in Islamic art'],
      scholars: 'Al-Ghazali, Ibn Arabi, Seyyed Hossein Nasr',
    },
    {
      word: 'NAKHL', icon: <Sparkles size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'نَخْل', name: 'The Date Palm',
      verse: "And We produced for you thereby gardens of date-palms and grapevines in which for you are abundant fruits and from which you eat.",
      verseArabic: 'وَنَخِيلٍ وَأَعْنَٰبٍ وَمِن كُلِّ ٱلثَّمَرَٰتِ ۚ إِنَّ فِى ذَٰلِكَ لَءَايَةً لِّقَوْمٍ يَتَفَكَّرُونَ',
      surah: 'Surah An-Nahl 16:11',
      meaning: 'The date palm — the tree of Arab civilization, sustaining life in the desert — as a divine gift and sign of God\'s mercy.',
      deepMeaning: 'The date palm appears 20 times in the Quran — more than any other tree. Every part of the palm is useful: fruit for food, sap for drink, leaves for weaving, trunk for building, fiber for rope. Mary (Maryam) is told to shake the palm tree for dates after giving birth to Jesus (Isa), making it the tree of the Miriamic tradition. The tall upright palm became the symbol of the believing soul in Islamic poetry — "firm of root, branches reaching heaven."',
      references: ['Maryam 19:25 and commentary', 'History of date palm cultivation', 'Arabic poetry on palm symbolism'],
      scholars: 'Al-Suyuti, Ibn Qayyim al-Jawziyya, Al-Bayhaqi',
    },
    {
      word: 'ZAQQUM', icon: <Building2 size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'زَقُّوم', name: 'The Tree of Hell',
      verse: 'Indeed, the tree of Zaqqum is the food of the sinner. Like murky oil, it boils within bellies, like the boiling of scalding water.',
      verseArabic: 'إِنَّ شَجَرَتَ ٱلزَّقُّومِ ۝ طَعَامُ ٱلْأَثِيمِ ۝ كَٱلْمُهْلِ يَغْلِى فِى ٱلْبُطُونِ ۝ كَغَلْىِ ٱلْحَمِيمِ',
      surah: 'Surah Ad-Dukhan 44:43-46',
      meaning: 'The anti-tree — growing in the deepest pit of hell, its fruit the punishment for the arrogant who denied divine truth.',
      deepMeaning: 'The Zaqqum tree is the Quran\'s most striking paradox: a tree that grows in fire. The Quraysh mocked this — "how can a tree grow in fire?" — and the Quran responded that God can make fire nourish what would normally burn it. Islamic philosophers saw this as a statement about the nature of divine power transcending natural laws. The real Zaqqum is a real desert plant (Balanites aegyptiaca) with bitter fruit. Its use as a name for the hellish tree may reference its notorious bitterness.',
      references: ['Quraysh\'s mockery and Quranic response', 'Botanical identification of zaqqum', 'Comparative hell-tree imagery in world religions'],
      scholars: 'Al-Qurtubi, Ibn Qayyim, Mahmoud Shaltout',
    },
  ],
  colors: [
    {
      word: 'AKHDAR', icon: <Eye size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'أَخْضَر', name: 'Green — Color of Paradise',
      verse: 'They will be adorned therein with bracelets of gold and will wear green garments of fine silk and brocade, reclining therein on adorned couches.',
      verseArabic: 'يُحَلَّوْنَ فِيهَا مِنْ أَسَاوِرَ مِن ذَهَبٍ وَيَلْبَسُونَ ثِيَابًا خُضْرًا مِّن سُندُسٍ وَإِسْتَبْرَقٍ',
      surah: 'Surah Al-Kahf 18:31',
      meaning: 'Green is the color of paradise, the Prophet\'s banner, and living Islamic art — the intersection of divine mercy and natural abundance.',
      deepMeaning: 'Green appears in paradise descriptions 8 times in the Quran. It is the color of vegetation — of life sustained by water (divine mercy). The Prophet\'s turban was green, his mosque\'s dome is green, and the Islamic color code places green above all others as sacred. Interestingly, the Arabic word for "garden" (janna) is the same root as "paradise" (jannat) — suggesting paradise is the ultimate garden. Islamic architecture uses green tiles (especially in Persian and Central Asian tradition) to evoke this paradise symbolism.',
      references: ['Islamic color symbolism', 'The Prophet\'s green turban in hadith', 'Architecture of paradise in Islamic art'],
      scholars: 'Al-Nawawi, Oleg Grabar, Robert Hillenbrand',
    },
    {
      word: 'ABYAD', icon: <PenTool size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'أَبْيَض', name: 'White — Purity and Ihram',
      verse: 'On the Day when some faces will turn white and some faces will turn black. As for those whose faces turn black: Did you disbelieve after your belief?',
      verseArabic: 'يَوْمَ تَبْيَضُّ وُجُوهٌ وَتَسْوَدُّ وُجُوهٌ ۚ فَأَمَّا ٱلَّذِينَ ٱسْوَدَّتْ وُجُوهُهُمْ أَكَفَرْتُم',
      surah: 'Surah Al-Imran 3:106',
      meaning: 'White = spiritual purity, truthfulness, and the light of divine acceptance on the Day of Judgment.',
      deepMeaning: 'The Quran uses whitening and blackening of faces as the ultimate spiritual metaphor — not referring to race, but to inner states made visible. Pilgrims wear white ihram garments to symbolize spiritual equality and purity before God — all status markers removed. The Prophet described the heart as either white (clean, receptive to guidance) or black (sealed, hardened). Islamic ritual purity (taharah) culminates in the white garment, the white shroud of the deceased, and ultimately the Day when inner whiteness or blackness becomes outwardly manifest.',
      references: ['Quranic color theology', 'Ihram symbolism in Hajj studies', 'Heart symbolism in hadith and Sufi tradition'],
      scholars: 'Al-Ghazali, Ibn al-Qayyim, Tariq Ramadan',
    },
    {
      word: 'ASFAR', icon: <Compass size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'أَصْفَر', name: 'Yellow — Divine Sign',
      verse: 'Indeed, Allah commands you to slaughter a cow. They said: What color should it be? He said: Allah says it should be a yellow cow, intensely yellow, pleasing to the observers.',
      verseArabic: 'إِنَّ ٱللَّهَ يَأْمُرُكُمْ أَن تَذْبَحُوا۟ بَقَرَةً ۖ قَالُوا۟ ٱدْعُ لَنَا رَبَّكَ يُبَيِّن لَّنَا مَا لَوْنُهَا ۚ قَالَ إِنَّهُۥ يَقُولُ إِنَّهَا بَقَرَةٌ صَفْرَآءُ فَاقِعٌ لَّوْنُهَا تَسُرُّ ٱلنَّٰظِرِينَ',
      surah: 'Surah Al-Baqarah 2:67-69',
      meaning: 'Yellow = bringing joy, intensely visible, a clear sign of divine command.',
      deepMeaning: 'The yellow cow of Bani Israel is one of the most famous stories in the Quran. The intense, pure yellow color was meant to be completely unambiguous, separating those who were looking for excuses from those willing to submit to God. In later Islamic tradition, bright yellow/gold became associated with joy, the sun, and sometimes with the intellect or sickness depending on the context, but here it represents a divine test of obedience.',
      references: ['Tafsir Ibn Kathir', 'Symbolism of colors in the Quran'],
      scholars: 'Ibn Abbas, Al-Qurtubi',
    },
  ],
  structures: [
    {
      word: 'KAABA', icon: <Globe size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'كَعْبَة', name: 'The Sacred House',
      verse: 'Indeed, the first House [of worship] established for mankind was that at Makkah - blessed and a guidance for the worlds.',
      verseArabic: 'إِنَّ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ لَلَّذِى بِبَكَّةَ مُبَارَكًا وَهُدًى لِّلْعَٰلَمِينَ',
      surah: 'Surah Al-Imran 3:96',
      meaning: 'The cubic heart of the Islamic world, representing unity, equality, and the absolute focus of prayer.',
      deepMeaning: 'The Kaaba (literally "the cube") represents the spiritual center (qibla) of the Muslim world. Its cubic shape is unique among ancient sacred structures, representing the intersection of the cardinal directions and the stability of the physical world. It is the earthly reflection of the heavenly Bait al-Ma\'mur. Muslims don\'t worship the Kaaba, but pray towards it as a unifying focal point, stripping away race, class, and geography during the circumambulation (tawaf).',
      references: ['Tafsir Ibn Kathir', 'History of Mecca by Al-Azraqi', 'Symbolism of the Kaaba in Sufism'],
      scholars: 'Ibn Arabi, Al-Ghazali, Martin Lings',
    },
    {
      word: 'MASJID AL-AQSA', icon: <Map size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'الْمَسْجِد الْأَقْصَى', name: 'The Farthest Mosque',
      verse: 'Exalted is He who took His Servant by night from al-Masjid al-Haram to al-Masjid al-Aqsa, whose surroundings We have blessed, to show him of Our signs.',
      verseArabic: 'سُبْحَٰنَ ٱلَّذِىٓ أَسْرَىٰ بِعَبْدِهِۦ لَيْلًا مِّنَ ٱلْمَسْجِدِ ٱلْحَرَامِ إِلَى ٱلْمَسْجِدِ ٱلْأَقْصَا ٱلَّذِى بَٰرَكْنَا حَوْلَهُۥ لِنُرِيَهُۥ مِنْ ءَايَٰتِنَآ',
      surah: 'Surah Al-Isra 17:1',
      meaning: 'The destination of the Night Journey and the first qibla, connecting the Abrahamic prophetic traditions.',
      deepMeaning: 'Al-Aqsa in Jerusalem forms the third holiest site in Islam. The Night Journey (Isra and Mi\'raj) links Mecca to Jerusalem, spiritually connecting Muhammad\'s revelation with the long line of Hebrew prophets. It was the first direction of prayer for the early Muslim community. The "blessed surroundings" refers to the land of prophets, making it a universally sacred geography in Islamic thought.',
      references: ['Tafsir al-Jalalayn', 'Al-Tabari\'s History', 'Islamic traditions regarding Jerusalem'],
      scholars: 'Al-Jalalayn, Ibn Ishaq, Al-Qurtubi',
    },
    {
      word: 'QIBLA', icon: <Key size={32} color="#D4AF37" strokeWidth={1.5} />, arabic: 'قِبْلَة', name: 'The Direction of Prayer',
      verse: 'So turn your face toward al-Masjid al-Haram. And wherever you [believers] are, turn your faces toward it [in prayer].',
      verseArabic: 'فَوَلِّ وَجْهَكَ شَطْرَ ٱلْمَسْجِدِ ٱلْحَرَامِ ۚ وَحَيْثُ مَا كُنتُمْ فَوَلُّوا۟ وُجُوهَكُمْ شَطْرَهُۥ',
      surah: 'Surah Al-Baqarah 2:144',
      meaning: 'The spiritual compass aligning millions of believers worldwide five times daily.',
      deepMeaning: 'The change of the Qibla from Jerusalem to Mecca was a defining moment in forming an independent Muslim identity. Symbolically, the Qibla ensures that wherever a believer stands on earth, they are physically and spiritually oriented towards the same center. This created an entire field of Islamic geography and astronomy dedicated to accurately calculating the Qibla from any point on the globe.',
      references: ['History of Islamic Science (Astronomy)', 'Tafsir on the change of Qibla', 'Al-Biruni\'s geographical works'],
      scholars: 'Al-Biruni, Al-Khwarizmi, Seyyed Hossein Nasr',
    }
  ],
};

export default function QuranHall() {
  const { isAr } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('light');
  const [selectedSymbol, setSelectedSymbol] = useState<any | null>(null);

  const symbols = symbolData[activeCategory] ?? [];
  const catMeta = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <div style={{ height: '100%', overflowY: 'auto', color: '#F8F4EA' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 280, background: 'linear-gradient(180deg, #0a2a1a 0%, #062B24 100%)', overflow: 'hidden' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: '100%', background: 'linear-gradient(180deg, rgba(212,175,55,0.15), transparent)', transform: `rotate(${(i - 4) * 15}deg)`, transformOrigin: 'top center' }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center', padding: '0 20px' }}>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}>
            <Moon size={52} color="#D4AF37" style={{ filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.8))' }} />
          </motion.div>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#D4AF37', textShadow: '0 0 30px rgba(212,175,55,0.5)' }}>{isAr ? 'رموز القرآن الكريم' : 'Qur\'anic Symbolism'}</div>
          {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: '#F0D98A', direction: 'rtl' }}>رموز القرآن الكريم</div>}
          <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.1rem', color: 'rgba(240,217,138,0.5)', direction: 'rtl', fontStyle: 'italic' }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, direction: isAr ? 'rtl' : 'ltr' }}>
            {(isAr ? [['٧', 'فئات'], ['٣٠+', 'رموز'], ['٦', 'علماء مشار إليهم'], ['١٤٠٠', 'سنوات من الدراسة']] : [['7', 'Categories'], ['30+', 'Symbols'], ['6', 'Scholars Referenced'], ['1400', 'Years of Study']]).map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.2rem', color: '#D4AF37', direction: 'ltr' }}>{v}</div>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: '#C7C3B9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
      </div>

      {/* Category tabs */}
      <div style={{ background: 'rgba(6,43,36,0.92)', borderBottom: '1px solid rgba(212,175,55,0.12)', overflowX: 'auto', direction: isAr ? 'rtl' : 'ltr' }}>
        <div style={{ display: 'flex', gap: 0, minWidth: 'max-content', justifyContent: 'center', margin: '0 auto' }}>
          {categories.map(cat => {
            const { Icon } = cat;
            const isActive = activeCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: isActive ? `${cat.color}18` : 'none', border: 'none', borderBottom: `2px solid ${isActive ? cat.color : 'transparent'}`, cursor: 'pointer', transition: 'all 0.25s', flexShrink: 0 }}>
                <Icon size={18} color={isActive ? cat.color : '#C7C3B9'} />
                <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: isActive ? cat.color : '#C7C3B9', whiteSpace: 'nowrap' }}>{isAr ? cat.arabic : cat.label}</span>
                {!isAr && <span style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.62rem', color: isActive ? `${cat.color}cc` : 'rgba(199,195,185,0.5)', direction: 'rtl', whiteSpace: 'nowrap' }}>{cat.arabic}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Symbols list */}
      <div style={{ padding: '28px 20px', maxWidth: 960, margin: '0 auto', direction: isAr ? 'rtl' : 'ltr' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {symbols.map((sym, i) => (
              <motion.div key={sym.arabic} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedSymbol(sym)}
                whileHover={{ borderColor: `${catMeta.color}88` } as any}
                style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '22px', cursor: 'pointer', transition: 'border-color 0.2s', textAlign: isAr ? 'right' : 'left' }}>
                <div style={{ width: 72, height: 72, flexShrink: 0, background: `${catMeta.color}15`, border: `1px solid ${catMeta.color}44`, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <catMeta.Icon size={32} color={catMeta.color} />
                </div>
                {sym.icon && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{sym.icon}</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.1rem', color: '#F8F4EA' }}>{isAr ? sym.arabic : sym.name}</div>
                    {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.88rem', color: catMeta.color, direction: 'rtl' }}>{sym.arabic}</div>}
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: catMeta.color, background: `${catMeta.color}18`, border: `1px solid ${catMeta.color}44`, borderRadius: 10, padding: '1px 8px', flexShrink: 0, direction: 'ltr' }}>{sym.surah}</div>
                  </div>
                  <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1rem', color: '#F0D98A', direction: 'rtl', textAlign: 'right', lineHeight: 2.2, padding: '10px 14px', background: `${catMeta.color}0a`, [isAr ? 'borderLeft' : 'borderRight']: `3px solid ${catMeta.color}`, borderRadius: isAr ? '4px 0 0 4px' : '0 4px 4px 0', marginBottom: 10 }}>
                    {sym.verseArabic}
                  </div>
                  {!isAr && <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#C7C3B9', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 8 }}>"{sym.verse}"</p>}
                  <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#F8F4EA', lineHeight: 1.7 }}>{sym.meaning}</p>
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, flexDirection: isAr ? 'row' : 'row' }}>
                    <Star size={11} color={catMeta.color} />
                    <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#C7C3B9' }}>{isAr ? 'انقر للتحليل العلمي العميق ←' : 'Click for deep scholarly analysis →'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedSymbol && (
          <motion.div className="fixed inset-0 flex items-center justify-center p-4"
            style={{ background: 'rgba(13,17,23,0.96)', zIndex: 100, backdropFilter: 'blur(15px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSymbol(null)}>
            <motion.div initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'linear-gradient(135deg, #062B24, #0D1117)', border: `1px solid ${catMeta.color}88`, borderRadius: 16, padding: '36px', maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', direction: isAr ? 'rtl' : 'ltr' }}>
              <button onClick={() => setSelectedSymbol(null)} style={{ position: 'absolute', top: 14, [isAr ? 'left' : 'right']: 14, background: 'none', border: 'none', color: '#C7C3B9', cursor: 'pointer' }}><X size={18} /></button>

              {/* Header */}
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', marginBottom: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: 12, background: `${catMeta.color}18`, border: `1px solid ${catMeta.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.5rem', color: catMeta.color }}>{selectedSymbol.arabic}</div>
                </div>
                <div>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.5rem', color: '#D4AF37' }}>{isAr ? selectedSymbol.arabic : selectedSymbol.name}</div>
                  {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1rem', color: '#F0D98A', direction: 'rtl' }}>{selectedSymbol.arabic}</div>}
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: catMeta.color, background: `${catMeta.color}18`, border: `1px solid ${catMeta.color}44`, borderRadius: 10, padding: '2px 10px', marginTop: 6, display: 'inline-block', direction: 'ltr' }}>{selectedSymbol.surah}</div>
                </div>
              </div>

              {/* Arabic verse */}
              <div style={{ background: `${catMeta.color}0a`, border: `1px solid ${catMeta.color}33`, borderRadius: 10, padding: '16px 20px', marginBottom: 18 }}>
                <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.1rem', color: '#F0D98A', direction: 'rtl', textAlign: 'right', lineHeight: 2.4, marginBottom: 10 }}>{selectedSymbol.verseArabic}</div>
                {!isAr && <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#C7C3B9', lineHeight: 1.8, fontStyle: 'italic' }}>"{selectedSymbol.verse}"</p>}
              </div>

              {/* Meaning */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: catMeta.color, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{isAr ? 'المعنى الرمزي' : 'Symbolic Meaning'}</div>
                <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', color: '#F8F4EA', lineHeight: 1.75 }}>{selectedSymbol.meaning}</p>
              </div>

              {/* Deep meaning */}
              <div style={{ background: 'rgba(6,43,36,0.6)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, padding: '16px', marginBottom: 18 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
                  <BookOpen size={13} color="#D4AF37" />
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#D4AF37', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{isAr ? 'التحليل العلمي العميق' : 'Deep Scholarly Interpretation'}</div>
                </div>
                <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', color: '#C7C3B9', lineHeight: 1.85 }}>{selectedSymbol.deepMeaning}</p>
              </div>

              {/* Scholars */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{isAr ? 'العلماء الرئيسيون' : 'Key Scholars'}</div>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.85rem', color: '#F0D98A', fontStyle: isAr ? 'normal' : 'italic' }}>{selectedSymbol.scholars}</div>
              </div>

              {/* References */}
              <div>
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{isAr ? 'المراجع الأكاديمية' : 'Academic References'}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {selectedSymbol.references.map((ref: any) => (
                    <div key={ref} style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 5, padding: '4px 12px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: '#D4AF37', direction: isAr ? 'rtl' : 'ltr' }}>{ref}</div>
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
