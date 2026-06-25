Created At: 2026-06-24T06:06:29Z
Completed At: 2026-06-24T06:06:29Z
File Path: `file:///Users/mdsunny/Downloads/Virtual%20Museum%20/src/app/components/halls/HistoryHall.tsx`
Total Lines: 206
Total Bytes: 47401
Showing lines 1 to 206
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: import { useState } from 'react';
2: import { motion, AnimatePresence } from 'motion/react';
3: import { Landmark, Clock, MapPin, Tag, BookOpen, Share2, Bookmark, Volume2, Filter, X, Cloud, Eye, Zap, TreeDeciduous, Sun, Bird, Moon, Droplets, Trophy } from 'lucide-react';
4: import IslamicGeometry from '../IslamicGeometry';
5: import { useLanguage } from '../../context/LanguageContext';
6: 
7: const periods = [
8:   { era: '3500 BCE', name: 'Mesopotamian', arabic: 'بلاد الرافدين', color: '#8B6914', count: 4 },
9:   { era: '2000 BCE', name: 'Dilmun / Magan', arabic: 'دلمون / ماجان', color: '#7a5a10', count: 3 },
10:   { era: '1000 BCE', name: 'Nabataean', arabic: 'النبطية', color: '#6a4a10', count: 5 },
11:   { era: '800 BCE', name: 'Sabaean', arabic: 'السبئية', color: '#5a3a08', count: 4 },
12:   { era: '500 BCE', name: 'Pre-Islamic', arabic: 'ما قبل الإسلام', color: '#4a2a06', count: 6 },
13:   { era: '600 CE', name: 'Early Islamic', arabic: 'الإسلام المبكر', color: '#3a2004', count: 4 },
14:   { era: '900 CE', name: 'Classical', arabic: 'الحقبة الكلاسيكية', color: '#2a1802', count: 5 },
15: ];
16: 
17: const artifacts = [
18:   // Mesopotamian
19:   { id: 1, name: 'Seal of Dilmun', nameAr: 'ختم دلمون', arabic: 'ختم دلمون', period: 'Mesopotamian', meaning: 'Ancient trade authority mark of the Gulf civilization — used to authenticate commercial transactions between Mesopotamian merchants and the Dilmun island entrepôt (modern Bahrain).', meaningAr: 'علامة سلطة التجارة القديمة لحضارة الخليج - تستخدم لمصادقة المعاملات التجارية بين تجار بلاد الرافدين ومركز جزيرة دلمون (البحرين الحديثة).', symbol: '⬟', region: 'Bahrain', regionAr: 'البحرين', year: '2300 BCE', category: 'Seal', categoryAr: 'ختم', significance: 'HIGH', material: 'Steatite', materialAr: 'حجر صابوني', location: 'National Museum, Manama', locationAr: 'المتحف الوطني، المنامة', dimensions: '2.4cm × 2.1cm', inscription: 'Proto-Sumerian script with bull & water motifs', inscriptionAr: 'خط مبكر سومري مع زخارف ثور وماء' },
20:   { id: 2, name: 'Lagash Storm God Tablet', nameAr: 'لوح إله العاصفة لجاش', arabic: 'لوح إله العاصفة لجاش', period: 'Mesopotamian', meaning: 'Sacred symbol of Enlil — the supreme Sumerian deity of wind and storm. The tablet records a royal covenant between the city of Lagash and its divine patron.', meaningAr: 'رمز مقدس لإنليل - الإله السومري الأعلى للرياح والعاصفة. يسجل اللوح عهدا ملكيا بين مدينة لجاش وراعيها الإلهي.', symbol: <Cloud size="1em" strokeWidth={1.5} />, region: 'Southern Iraq', regionAr: 'جنوب العراق', year: '2450 BCE', category: 'Divine', categoryAr: 'إلهي', significance: 'CRITICAL', material: 'Clay', materialAr: 'طين', location: 'Baghdad Museum', locationAr: 'متحف بغداد', dimensions: '15cm × 10cm', inscription: 'Cuneiform dedicatory text to Enlil', inscriptionAr: 'نص إهدائي مسماري لإنليل' },
21:   { id: 3, name: 'Uruk Eye Idol', nameAr: 'صنم العين أوروك', arabic: 'صنم العين أوروك', period: 'Mesopotamian', meaning: 'The "eye" idols of Uruk are among humanity\'s earliest religious objects. The oversized eyes represent divine watchfulness and the omniscience of the gods.', meaningAr: 'أصنام "العين" من أوروك هي من أقدم الأشياء الدينية للبشرية. تمثل العيون الكبيرة المراقبة الإلهية وعلم الآلهة بكل شيء.', symbol: <Eye size="1em" strokeWidth={1.5} />, region: 'Uruk, Iraq', regionAr: 'أوروك، العراق', year: '3500 BCE', category: 'Religious', categoryAr: 'ديني', significance: 'CRITICAL', material: 'Alabaster', materialAr: 'مرمر', location: 'National Museum of Iraq', locationAr: 'المتحف الوطني العراقي', dimensions: '8cm height', inscription: 'None — pre-writing period', inscriptionAr: 'لا يوجد - فترة ما قبل الكتابة' },
22:   { id: 4, name: 'Cylinder Seal of Adad', nameAr: 'ختم اسطواني للإله أدد', arabic: 'ختم اسطواني للإله أدد', period: 'Mesopotamian', meaning: 'Rolling seal depicting the storm god Adad with lightning bolts — used to impress clay tablets as an official signature. Represents divine power, authority, and the administration of justice.', meaningAr: 'ختم متدحرج يصور إله العاصفة أدد مع صواعق برق - يستخدم لطبع ألواح الطين كتوقيع رسمي. يمثل القوة الإلهية والسلطة وإدارة العدالة.', symbol: <Zap size="1em" strokeWidth={1.5} />, region: 'Akkad, Iraq', regionAr: 'أكاد، العراق', year: '2200 BCE', category: 'Administrative', categoryAr: 'إداري', significance: 'HIGH', material: 'Lapis Lazuli', materialAr: 'لازورد', location: 'British Museum', locationAr: 'المتحف البريطاني', dimensions: '3cm × 1.5cm cylinder', inscription: 'Cuneiform: "Property of the god Adad"', inscriptionAr: 'مسماري: "ملك للإله أدد"' },
23:   // Dilmun
24:   { id: 5, name: 'Dilmun Temple Altar Symbol', nameAr: 'رمز مذبح معبد دلمون', arabic: 'رمز مذبح معبد دلمون', period: 'Dilmun / Magan', meaning: 'The tree-of-life motif from Dilmun temples represents the sacred freshwater springs of Bahrain, which made the island a paradise in Sumerian mythology — the original Garden of Eden.', meaningAr: 'يمثل شكل شجرة الحياة من معابد دلمون ينابيع المياه العذبة المقدسة في البحرين، والتي جعلت الجزيرة جنة في الأساطير السومرية - جنة عدن الأصلية.', symbol: <TreeDeciduous size="1em" strokeWidth={1.5} />, region: 'Bahrain', regionAr: 'البحرين', year: '1800 BCE', category: 'Religious', categoryAr: 'ديني', significance: 'HIGH', material: 'Limestone', materialAr: 'حجر جيري', location: 'Bahrain National Museum', locationAr: 'متحف البحرين الوطني', dimensions: '30cm × 22cm', inscription: 'Early Arabic proto-script', inscriptionAr: 'خط مبكر شبه عربي' },
25:   { id: 6, name: 'Magan Copper Bull Head', nameAr: 'رأس الثور النحاسي من ماجان', arabic: 'رأس الثور النحاسي من ماجان', period: 'Dilmun / Magan', meaning: 'The bull was the universal symbol of raw power and royal authority across ancient Arabia. Magan (Oman) was the world\'s primary source of copper in 2000 BCE — these artifacts marked divine ownership of the mines.', meaningAr: 'كان الثور رمزا عالميا للقوة الخام والسلطة الملكية عبر شبه الجزيرة العربية القديمة. كانت ماجان (عمان) المصدر الأساسي للنحاس في العالم عام 2000 قبل الميلاد - شكلت هذه القطع الأثرية الملكية الإلهية للمناجم.', symbol: '𓃒', region: 'Oman', regionAr: 'عمان', year: '2000 BCE', category: 'Royal', categoryAr: 'ملكي', significance: 'HIGH', material: 'Copper alloy', materialAr: 'سبائك النحاس', location: 'National Museum, Muscat', locationAr: 'المتحف الوطني، مسقط', dimensions: '12cm height', inscription: 'Unknown proto-Arabic script', inscriptionAr: 'خط عربي أولي غير معروف' },
26:   { id: 7, name: 'Meluḫḫa Trade Token', nameAr: 'رمز التبادل من ملوخا', arabic: 'رمز التبادل من ملوخا', period: 'Dilmun / Magan', meaning: 'Indus Valley civilization trade tokens found in Dilmun — evidence of the world\'s oldest transcontinental trade network linking the Indus, Arabia, and Mesopotamia via the Persian Gulf.', meaningAr: 'عثر على رموز تجارية لحضارة وادي السند في دلمون - دليل على أقدم شبكة تجارية عابرة للقارات في العالم تربط السند وشبه الجزيرة العربية وبلاد الرافدين عبر الخليج العربي.', symbol: '◈', region: 'Qatar / Bahrain coast', regionAr: 'ساحل قطر / البحرين', year: '2100 BCE', category: 'Commercial', categoryAr: 'تجاري', significance: 'MEDIUM', material: 'Terracotta', materialAr: 'طين محروق', location: 'Museum of Islamic Art, Doha', locationAr: 'متحف الفن الإسلامي، الدوحة', dimensions: '4cm diameter', inscription: 'Indus script (undeciphered)', inscriptionAr: 'نص السند (غير مشفر)' },
27:   // Nabataean
28:   { id: 8, name: 'Nabataean Sun Disc', nameAr: 'قرص الشمس النبطي', arabic: 'قرص الشمس النبطي', period: 'Nabataean', meaning: 'The winged sun disc was the supreme symbol of Nabataean royalty and divine authority. Found on tomb facades at Petra, it represents both the sun god Dushara and the soul\'s journey into the afterlife.', meaningAr: 'كان قرص الشمس المجنح الرمز الأعلى للملكية النبطية والسلطة الإلهية. وُجد على واجهات المقابر في البتراء، وهو يمثل كلاً من إله الشمس ذو الشرى ورحلة الروح إلى الحياة الآخرة.', symbol: <Sun size="1em" strokeWidth={1.5} />, region: 'Petra, Jordan', regionAr: 'البتراء، الأردن', year: '100 BCE', category: 'Divine', categoryAr: 'إلهي', significance: 'CRITICAL', material: 'Sandstone carving', materialAr: 'نحت من الحجر الرملي', location: 'In situ, Petra', locationAr: 'في الموقع، البتراء', dimensions: '80cm diameter (relief)', inscription: 'Nabataean script: "Dushara, god of our lord"', inscriptionAr: 'الخط النبطي: "ذو الشرى، إله سيدنا"' },
29:   { id: 9, name: 'Lihyanite Royal Inscription', nameAr: 'نقش ملكي لحياني', arabic: 'نقش ملكي لحياني', period: 'Nabataean', meaning: 'The Lihyanite kingdom of Dedan (modern Al-Ula) produced some of Arabia\'s most sophisticated pre-Islamic inscriptions. This royal dedication documents the first known Arabian bureaucratic state.', meaningAr: 'أنتجت المملكة اللحيانية في ديدان (العلا الحديثة) بعضًا من أكثر نقوش ما قبل الإسلام تطوراً في شبه الجزيرة العربية. يوثق هذا الإهداء الملكي أول دولة بيروقراطية عربية معروفة.', symbol: '𐪁', region: 'Al-Ula, Saudi Arabia', regionAr: 'العلا، المملكة العربية السعودية', year: '400 BCE', category: 'Script', categoryAr: 'مخطوطة', significance: 'CRITICAL', material: 'Sandstone', materialAr: 'حجر رملي', location: 'In situ, Al-Ula', locationAr: 'في الموقع، العلا', dimensions: '45cm × 60cm panel', inscription: 'Lihyanite (Ancient North Arabian)', inscriptionAr: 'لحياني (عربي شمالي قديم)' },
30:   { id: 10, name: 'Nabataean Incense Altar', nameAr: 'مذبح البخور النبطي', arabic: 'مذبح البخور النبطي', period: 'Nabataean', meaning: 'The incense trade made Nabataeans the wealthiest merchants of antiquity. These altars were placed at every caravanserai along the Incense Road — signaling safe haven, commerce, and divine protection for travelers.', meaningAr: 'جعلت تجارة البخور الأنباط أغنى تجار العصور القديمة. وُضعت هذه المذابح في كل خان على طول طريق البخور - مما يشير إلى الملاذ الآمن والتجارة والحماية الإلهية للمسافرين.', symbol: <Landmark size="1em" strokeWidth={1.5} />, region: 'Hegra (Mada\'in Saleh)', regionAr: 'الحجر (مدائن صالح)', year: '50 CE', category: 'Religious', categoryAr: 'ديني', significance: 'HIGH', material: 'Carved limestone', materialAr: 'حجر جيري منحوت', location: 'Saudi Heritage Commission Collection', locationAr: 'مجموعة هيئة التراث السعودي', dimensions: '40cm × 25cm × 25cm', inscription: 'Nabataean: prayer to Allat', inscriptionAr: 'نبطي: صلاة اللات' },
31:   { id: 11, name: 'Petra Rose City Façade Symbol', nameAr: 'رمز واجهة البتراء', arabic: 'رمز واجهة البتراء', period: 'Nabataean', meaning: 'The stepped merlons and eagle motifs carved into Petra\'s cliff faces blend Egyptian, Hellenistic, and Arabian traditions — the visual language of a civilization at the crossroads of three continents.', meaningAr: 'تمزج الزخارف المتدرجة والنقوش على شكل نسر المحفورة في وجوه جرف البتراء بين التقاليد المصرية والهلنستية والعربية - وهي لغة بصرية لحضارة في مفترق طرق ثلاث قارات.', symbol: <Bird size="1em" strokeWidth={1.5} />, region: 'Petra, Jordan', regionAr: 'البتراء، الأردن', year: '1st century CE', category: 'Architectural', categoryAr: 'معماري', significance: 'HIGH', material: 'Sandstone', materialAr: 'حجر رملي', location: 'In situ, Petra', locationAr: 'في الموقع، البتراء', dimensions: 'Full façade: 40m height', inscription: 'Various Nabataean dedicatory texts', inscriptionAr: 'نصوص إهدائية نبطية متنوعة' },
32:   { id: 12, name: 'Nabataean Coin — Aretas IV', nameAr: 'عملة نبطية أريتاس الرابع', arabic: 'عملة نبطية أريتاس الرابع', period: 'Nabataean', meaning: 'Nabataean coins from Aretas IV (9 BCE–40 CE) show the king wearing a royal diadem alongside his queen Shaqilath — one of the earliest depictions of political equality between royal couples in the ancient world.', meaningAr: 'تُظهر العملات النبطية لأريتاس الرابع (9 ق.م - 40 م) الملك مرتدياً إكليلاً ملكياً إلى جانب ملكته شقيلات - وهي من أقدم الرسوم للمساواة السياسية بين الأزواج الملكيين في العالم القديم.', symbol: '⊕', region: 'Petra / Bostra', regionAr: 'البتراء / بصرى', year: '9 BCE', category: 'Numismatic', categoryAr: 'نقودي', significance: 'HIGH', material: 'Silver', materialAr: 'فضة', location: 'Multiple museum collections', locationAr: 'مجموعات متاحف متعددة', dimensions: '21mm diameter', inscription: 'Nabataean: "Aretas, King of the Nabataeans"', inscriptionAr: 'نبطي: "أريتاس، ملك الأنباط"' },
33:   // Sabaean
34:   { id: 13, name: 'Sabaean Mukarrib Seal', nameAr: 'خاتم المكرب السبئي', arabic: 'خاتم المكرب السبئي', period: 'Sabaean', meaning: 'The Mukarrib was the sacred priest-king of Saba (Sheba). This seal bears the symbol of Almaqah, the Sabaean moon god, establishing divine authority over the incense trade. The Queen of Sheba ruled from this civilization.', meaningAr: 'المكرب هو الكاهن الملك المقدس في سبأ. يحمل هذا الختم رمز المقة، إله القمر السبئي، ليؤسس سلطة إلهية على تجارة البخور. حكمت ملكة سبأ من هذه الحضارة.', symbol: <Moon size="1em" strokeWidth={1.5} />, region: 'Marib, Yemen', regionAr: 'مأرب، اليمن', year: '800 BCE', category: 'Royal', categoryAr: 'ملكي', significance: 'CRITICAL', material: 'Gold', materialAr: 'ذهب', location: 'Yemen National Museum (pre-war)', locationAr: 'المتحف الوطني اليمني', dimensions: '3cm diameter', inscription: 'Ancient South Arabian: "Almaqah blessed this"', inscriptionAr: 'عربي جنوبي قديم: "المقة بارك هذا"' },
35:   { id: 14, name: 'Temple of Awam Inscription', nameAr: 'نقش معبد أوام', arabic: 'نقش معبد أوام', period: 'Sabaean', meaning: 'The Temple of Awam (Marib) was the holiest site in ancient Arabia. This dedicatory inscription records donations to Almaqah and provides crucial dating evidence for the biblical Queen of Sheba narrative.', meaningAr: 'كان معبد أوام (مأرب) أقدس موقع في شبه الجزيرة العربية القديمة. يسجل هذا النقش الإهدائي التبرعات إلى المقة ويوفر دليلاً تأريخياً حاسماً لقصة ملكة سبأ التوراتية.', symbol: '◉', region: 'Marib, Yemen', regionAr: 'مأرب، اليمن', year: '700 BCE', category: 'Religious', categoryAr: 'ديني', significance: 'CRITICAL', material: 'Bronze plaque', materialAr: 'لوحة برونزية', location: 'Marib Archaeological Site', locationAr: 'موقع مأرب الأثري', dimensions: '60cm × 45cm', inscription: 'Ancient South Arabian script — 180 characters', inscriptionAr: 'خط المسند - 180 حرف' },
36:   { id: 15, name: 'Sabaean Agricultural Symbol', nameAr: 'رمز الزراعة السبئي', arabic: 'رمز الزراعة السبئي', period: 'Sabaean', meaning: 'The Great Dam of Marib (8th century BCE) was the engineering wonder of the ancient world, irrigating 100km² of desert. Agricultural symbols on this stone celebrate the dam\'s completion under King Yitha\'amar Wattar.', meaningAr: 'كان سد مأرب العظيم (القرن 8 ق.م) أعجوبة هندسية في العالم القديم، وكان يروي 100 كيلومتر مربع من الصحراء. تحتفل الرموز الزراعية على هذا الحجر بإكمال السد تحت حكم الملك يثع أمر وتر.', symbol: <Droplets size="1em" strokeWidth={1.5} />, region: 'Marib, Yemen', regionAr: 'مأرب، اليمن', year: '715 BCE', category: 'Engineering', categoryAr: 'هندسي', significance: 'HIGH', material: 'Limestone', materialAr: 'حجر جيري', location: 'Yemen', locationAr: 'اليمن', dimensions: '30cm × 20cm', inscription: 'South Arabian: "Dam of Marib, gift of Almaqah"', inscriptionAr: 'جنوب الجزيرة العربية: "سد مأرب، هدية المقة"' },
37:   // Pre-Islamic
38:   { id: 16, name: 'Thamudic Rock Inscription', nameAr: 'نقش ثمودي صخري', arabic: 'نقش ثمودي صخري', period: 'Pre-Islamic', meaning: 'The Thamud were an ancient Arabian people mentioned in the Qur\'an. These rock inscriptions, scattered across thousands of sites in northern Arabia, are the largest corpus of pre-Islamic personal writing — a window into everyday life before Islam.', meaningAr: 'كانت ثمود أمة عربية قديمة ذُكرت في القرآن. تمثل هذه النقوش الصخرية المتناثرة عبر آلاف المواقع في شمال الجزيرة العربية، أكبر مجموعة من الكتابات الشخصية قبل الإسلام - وهي نافذة على الحياة اليومية قبل الإسلام.', symbol: '✦', region: 'Hail / Tabuk, Saudi Arabia', regionAr: 'حائل / تبوك، السعودية', year: '500 BCE – 400 CE', category: 'Script', categoryAr: 'مخطوطة', significance: 'HIGH', material: 'Sandstone rock surface', materialAr: 'سطح صخري رملي', location: 'In situ, multiple locations', locationAr: 'في الموقع، مواقع متعددة', dimensions: 'Varies', inscription: 'Thamudic alphabet (ancestor of modern Arabic)', inscriptionAr: 'الأبجدية الثمودية' },
39:   { id: 17, name: 'Qatabanian God Symbol', nameAr: 'رمز إله قتبان', arabic: 'رمز إله قتبان', period: 'Pre-Islamic', meaning: 'The kingdom of Qataban (modern Yemen) controlled the frankincense trade. This symbol of Amm, the Qatabanian moon god, was stamped on incense jars — guaranteeing divine quality certification on cargo worth more than gold.', meaningAr: 'سيطرت مملكة قتبان (اليمن الحديثة) على تجارة اللبان. تم ختم رمز عمّ هذا، إله القمر القتباني، على جرار البخور - مما يضمن شهادة الجودة الإلهية على حمولة أغلى من الذهب.', symbol: '◐', region: 'Timna, Yemen', regionAr: 'تمنع، اليمن', year: '400 BCE', category: 'Commercial', categoryAr: 'تجاري', significance: 'HIGH', material: 'Alabaster stamp', materialAr: 'ختم مرمر', location: 'Museum of Timna', locationAr: 'متحف تمنع', dimensions: '5cm × 4cm', inscription: 'Qatabanian: "Property of Amm"', inscriptionAr: 'قتباني: "ملك عمّ"' },
40:   { id: 18, name: 'Kindah Kingdom Tribal Mark', nameAr: 'وسم مملكة كندة', arabic: 'وسم مملكة كندة', period: 'Pre-Islamic', meaning: 'The Kindite kingdom produced Arabia\'s greatest pre-Islamic poet, Imru\' al-Qays. This royal tribe mark (wasm) was branded onto horses to identify ownership — in a culture where poets competed as fiercely as warriors.', meaningAr: 'أنتجت مملكة كندة أعظم شعراء ما قبل الإسلام، امرؤ القيس. كان هذا الوسم الملكي القبلي يُختم على الخيول لتحديد ملكيتها - في ثقافة يتنافس فيها الشعراء بضراوة مثل المحاربين.', symbol: '⚜', region: 'Central Arabia (Hadhramaut)', regionAr: 'وسط الجزيرة العربية (حضرموت)', year: '300 CE', category: 'Tribal', categoryAr: 'قبلي', significance: 'MEDIUM', material: 'Iron brand', materialAr: 'وسم حديدي', location: 'Private Arabian collection', locationAr: 'مجموعة عربية خاصة', dimensions: '20cm spread', inscription: 'Tribal mark, no text', inscriptionAr: 'علامة قبلية، بدون نص' },
41:   { id: 19, name: 'Al-Ula Ancient Arabian Script', nameAr: 'خط عربي قديم من العُلا', arabic: 'خط عربي قديم من العُلا', period: 'Pre-Islamic', meaning: 'Al-Ula (ancient Dedan and Hegra) contains the world\'s most intact Nabataean city and thousands of inscriptions in multiple pre-Islamic scripts. This multi-script inscription is the Rosetta Stone of Arabian linguistics.', meaningAr: 'تضم العلا (ديدان والحجر القديمة) مدينة نبطية هي الأكثر سلامة في العالم وآلاف النقوش في نصوص متعددة قبل الإسلام. هذا النقش متعدد النصوص هو حجر رشيد للغويات العربية.', symbol: '𐪀', region: 'Al-Ula, Saudi Arabia', regionAr: 'العلا، السعودية', year: '200 BCE', category: 'Linguistic', categoryAr: 'لغوي', significance: 'CRITICAL', material: 'Basalt column', materialAr: 'عمود بازلت', location: 'Al-Ula Museum, Saudi Arabia', locationAr: 'متحف العلا، السعودية', dimensions: '1.2m × 0.4m', inscription: 'Nabataean + Lihyanite + Dadanitic scripts simultaneously', inscriptionAr: 'نصوص نبطية + لحيانية + ديدانية' },
42:   // Early Islamic
43:   { id: 20, name: 'First Kufic Quran Page', nameAr: 'أول صفحة مصحف كوفي', arabic: 'أول صفحة مصحف كوفي', period: 'Early Islamic', meaning: 'Kufic script was the first standardized Arabic calligraphic style, developed in Kufa (Iraq) in the 7th century CE. This early Quran page represents the birth of Arabic typography — the most influential script system in history.', meaningAr: 'كان الخط الكوفي أول نمط خط عربي موحد، تطور في الكوفة (العراق) في القرن السابع الميلادي. تمثل هذه الصفحة القرآنية المبكرة ولادة فن الطباعة العربية - نظام الكتابة الأكثر تأثيرا في التاريخ.', symbol: '﷽', region: 'Kufa / Medina', regionAr: 'الكوفة / المدينة', year: '700 CE', category: 'Calligraphy', categoryAr: 'فن الخط', significance: 'CRITICAL', material: 'Parchment (gazelle skin)', materialAr: 'مخطوطة (جلد غزال)', location: 'Chester Beatty Library, Dublin', locationAr: 'مكتبة تشيستر بيتي، دبلن', dimensions: '30cm × 25cm', inscription: 'Kufic Arabic — Surah Al-Baqarah', inscriptionAr: 'خط كوفي - سورة البقرة' },
44:   { id: 21, name: 'Umayyad Governor Coin', nameAr: 'درهم الوالي الأموي', arabic: 'درهم الوالي الأموي', period: 'Early Islamic', meaning: 'The Umayyad Caliphate replaced human images with Arabic text on coins — a revolutionary act of iconoclasm that transformed visual culture. These coins spread Arabic script as a global visual language from Spain to Central Asia.', meaningAr: 'استبدلت الخلافة الأموية الصور البشرية بنص عربي على العملات المعدنية - وهو عمل ثوري في تحطيم الأيقونات والذي أدى إلى تحويل الثقافة المرئية. نشرت هذه العملات النص العربي كلغة مرئية عالمية من إسبانيا إلى آسيا الوسطى.', symbol: <Moon size="1em" strokeWidth={1.5} />, region: 'Damascus', regionAr: 'دمشق', year: '695 CE', category: 'Numismatic', categoryAr: 'نقودي', significance: 'HIGH', material: 'Silver dirham', materialAr: 'درهم فضي', location: 'Multiple Islamic museum collections', locationAr: 'مجموعات إسلامية متعددة', dimensions: '25mm diameter', inscription: 'Arabic: "There is no God but Allah" on both faces', inscriptionAr: 'عربي: "لا إله إلا الله" على كلا الوجهين' },
45:   { id: 22, name: 'Dome of the Rock Mosaic Inscription', nameAr: 'نقش فسيفساء قبة الصخرة', arabic: 'نقش فسيفساء قبة الصخرة', period: 'Early Islamic', meaning: 'The 240-meter Quranic inscription running inside the Dome of the Rock (691 CE) is the world\'s oldest surviving monumental Arabic text. It was deliberately designed to be read as a theological statement to Byzantine Christians and Jews in Jerusalem.', meaningAr: 'النقش القرآني الذي يبلغ طوله 240 مترا داخل قبة الصخرة (691 م) هو أقدم نص عربي ضخم باق في العالم. تم تصميمه عمدا ليكون بمثابة بيان لاهوتي للمسيحيين البيزنطيين واليهود في القدس.', symbol: '⬡', region: 'Jerusalem', regionAr: 'القدس', year: '691 CE', category: 'Architectural', categoryAr: 'معماري', significance: 'CRITICAL', material: 'Gold and glass mosaic', materialAr: 'فسيفساء ذهب وزجاج', location: 'In situ, Jerusalem', locationAr: 'في الموقع، القدس', dimensions: '240m circumference', inscription: 'Quranic verses — first dated Quranic inscription in history', inscriptionAr: 'آيات قرآنية - أول نقش قرآني مؤرخ' },
46:   // Classical
47:   { id: 23, name: 'Abbasid Calligraphic Band', nameAr: 'شريط خطي عباسي', arabic: 'شريط خطي عباسي', period: 'Classical', meaning: 'Under Abbasid patronage (750–1258 CE), Arabic calligraphy became a supreme art form. This decorative Quranic band from the palace of Samarra shows how Arabic script transcended writing to become pure abstract beauty.', meaningAr: 'في ظل رعاية العباسيين (750-1258 م)، أصبح الخط العربي فنا أسمى. يوضح هذا الشريط القرآني المزخرف من قصر سامراء كيف تجاوز النص العربي الكتابة ليصبح جمالا تجريديا خالصا.', symbol: 'ب', region: 'Samarra, Iraq', regionAr: 'سامراء، العراق', year: '850 CE', category: 'Calligraphy', categoryAr: 'فن الخط', significance: 'HIGH', material: 'Stucco relief', materialAr: 'نحت جصي', location: 'Museum of Islamic Art, Berlin', locationAr: 'متحف الفن الإسلامي، برلين', dimensions: '2m × 0.4m panel', inscription: 'Thuluth script — Ayat al-Kursi', inscriptionAr: 'خط الثلث - آية الكرسي' },
48:   { id: 24, name: 'Fatimid Gold Dinar', nameAr: 'دينار فاطمي ذهبي', arabic: 'دينار فاطمي ذهبي', period: 'Classical', meaning: 'Fatimid gold dinars (909–1171 CE) were the highest quality currency in the medieval world. Their geometric border patterns and Quranic text made them the global reserve currency of the medieval Islamic world — equivalent to the modern US dollar.', meaningAr: 'كانت الدنانير الذهبية الفاطمية (909-1171 م) هي العملة الأعلى جودة في عالم العصور الوسطى. جعلت أنماطها الحدودية الهندسية والنصوص القرآنية منها عملة الاحتياط العالمية للعالم الإسلامي في العصور الوسطى - أي ما يعادل الدولار الأمريكي الحديث.', symbol: '✦', region: 'Cairo / North Africa', regionAr: 'القاهرة / شمال أفريقيا', year: '1050 CE', category: 'Numismatic', categoryAr: 'نقودي', significance: 'HIGH', material: 'Gold 24 karat', materialAr: 'ذهب عيار 24', location: 'Egyptian Museum, Cairo', locationAr: 'المتحف المصري، القاهرة', dimensions: '22mm, 4.25g', inscription: 'Arabic: Imam Ali declaration', inscriptionAr: 'عربي: إعلان الإمام علي' },
49:   { id: 25, name: 'Mamluk Sultan Blazon', nameAr: 'رنك السلطان المملوكي', arabic: 'رنك السلطان المملوكي', period: 'Classical', meaning: 'Mamluk blazons (ranak) were heraldic symbols identifying sultanate officers — the world\'s most sophisticated medieval heraldic system. Each cup, pen box, or polo stick symbol identified a specific court office, creating a visual language of power.', meaningAr: 'كانت الرنوك المملوكية رموزا شعارية تحدد ضباط السلطنة - وهو أكثر أنظمة الشعارات تعقيدا في العصور الوسطى. حدد كل رمز كأس أو صندوق أقلام أو عصا بولو منصبا معينا في البلاط، مما خلق لغة مرئية للسلطة.', symbol: <Trophy size="1em" strokeWidth={1.5} />, region: 'Cairo, Egypt', regionAr: 'القاهرة، مصر', year: '1300 CE', category: 'Heraldic', categoryAr: 'شعاري', significance: 'HIGH', material: 'Enameled glass / bronze', materialAr: 'زجاج مطلي / برونز', location: 'Museum of Islamic Art, Cairo', locationAr: 'متحف الفن الإسلامي، القاهرة', dimensions: 'Varies by artifact', inscription: 'Arabic titles of the sultan', inscriptionAr: 'ألقاب عربية للسلطان' },
50: ];
51: 
52: export default function HistoryHall() {
53:   const { isAr } = useLanguage();
54:   const [selected, setSelected] = useState<typeof artifacts[0] | null>(null);
55:   const [activePeriod, setActivePeriod] = useState<string | null>(null);
56:   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
57:   const [filterCategory, setFilterCategory] = useState<string | null>(null);
58: 
59:   const categories = Array.from(new Set(artifacts.map(a => a.category)));
60:   let filtered = activePeriod ? artifacts.filter(a => a.period === activePeriod) : artifacts;
61:   if (filterCategory) filtered = filtered.filter(a => a.category === filterCategory);
62: 
63:   return (
64:     <div style={{ height: '100%', overflowY: 'auto', color: '#F8F4EA' }}>
65:       <IslamicGeometry opacity={0.06} patternId="history-geo" color="#8B6914" />
66: 
67:       {/* Hero */}
68:       <div style={{ position: 'relative', height: 300, background: 'linear-gradient(180deg, #3a2000 0%, #1a0f00 100%)', overflow: 'hidden' }}>
69:         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 20px, rgba(0,0,0,0.04) 20px)' }} />
70:         {/* Animated gold dust */}
71:         {[...Array(12)].map((_, i) => (
72:           <motion.div key={i} style={{ position: 'absolute', width: 2, height: 2, background: '#D4AF37', borderRadius: '50%', left: `${8 + i * 8}%`, top: `${20 + (i % 4) * 15}%` }}
73:             animate={{ y: [-10, -30, -10], opacity: [0, 0.8, 0] }}
74:             transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }} />
75:         ))}
76:         <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
77:           <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }}>
78:             <Landmark size={52} color="#D4AF37" style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.6))' }} />
79:           </motion.div>
80:           <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: '#D4AF37', textShadow: '0 0 40px rgba(212,175,55,0.5)', textAlign: 'center' }}>{isAr ? 'قاعة الأصول والتاريخ' : 'Hall of Origins'}</div>
81:           {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.1rem', color: '#F0D98A', direction: 'rtl', textAlign: 'center' }}>قاعة الأصول والتاريخ</div>}
82:           <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', direction: isAr ? 'rtl' : 'ltr' }}>
83:             {(isAr ? [['٢٥', 'قطعة أثرية'], ['٧', 'حضارات'], ['٥,٥٠٠ عام', 'من التاريخ'], ['١٢', 'خطوط']] : [['25', 'Artifacts'], ['7', 'Civilizations'], ['5,500 Years', 'of History'], ['12', 'Scripts']]).map(([val, label]) => (
84:               <div key={label} style={{ textAlign: 'center' }}>
85:                 <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.4rem', color: '#D4AF37', direction: 'ltr' }}>{val}</div>
86:                 <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
87:               </div>
88:             ))}
89:           </div>
90:         </div>
91:         <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
92:         <div style={{ position: 'absolute', top: 12, left: 16, fontFamily: 'monospace', fontSize: '1.2rem', opacity: 0.15, letterSpacing: '2px' }}>𓎡𓎛𓎟𓂀𓅃𓊹𓋴</div>
93:         <div style={{ position: 'absolute', top: 12, right: 16, fontFamily: 'monospace', fontSize: '1.2rem', opacity: 0.15, letterSpacing: '2px' }}>𓋴𓊹𓅃𓂀𓎟𓎛𓎡</div>
94:       </div>
95: 
96:       {/* Timeline */}
97:       <div style={{ background: 'rgba(13,17,23,0.85)', padding: '18px 24px', borderBottom: '1px solid rgba(212,175,55,0.12)', overflowX: 'auto', direction: isAr ? 'rtl' : 'ltr' }}>
98:         <div style={{ display: 'flex', gap: 0, position: 'relative', minWidth: 500 }}>
99:           <div style={{ position: 'absolute', top: 7, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))', zIndex: 0 }} />
100:           {periods.map(p => (
101:             <button key={p.era} onClick={() => setActivePeriod(activePeriod === p.name ? null : p.name)}
102:               style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1, padding: '0 2px' }}>
103:               <motion.div whileHover={{ scale: 1.4 }} style={{ width: 14, height: 14, borderRadius: '50%', background: activePeriod === p.name ? '#D4AF37' : p.color, border: `2px solid ${activePeriod === p.name ? '#F0D98A' : 'rgba(212,175,55,0.4)'}`, boxShadow: activePeriod === p.name ? '0 0 14px rgba(212,175,55,0.9)' : 'none', transition: 'all 0.2s', flexShrink: 0 }} />
104:               <div style={{ fontFamily: 'Inter', fontSize: '0.58rem', color: activePeriod === p.name ? '#D4AF37' : 'rgba(199,195,185,0.7)', whiteSpace: 'nowrap', direction: 'ltr' }}>{p.era}</div>
105:               <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: activePeriod === p.name ? '#F0D98A' : '#C7C3B9', fontWeight: activePeriod === p.name ? 600 : 400, whiteSpace: 'nowrap' }}>{isAr ? p.arabic : p.name}</div>
106:               {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.58rem', color: 'rgba(199,195,185,0.5)', whiteSpace: 'nowrap' }}>{p.arabic}</div>}
107:               <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.55rem', color: 'rgba(212,175,55,0.5)' }}>{p.count} {isAr ? 'عناصر' : 'items'}</div>
108:             </button>
109:           ))}
110:         </div>
111:       </div>
112: 
113:       {/* Toolbar */}
114:       <div style={{ padding: '14px 24px', background: 'rgba(6,43,36,0.5)', borderBottom: '1px solid rgba(212,175,55,0.08)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', direction: isAr ? 'rtl' : 'ltr' }}>
115:         <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1rem', color: '#F8F4EA', flex: 1 }}>
116:           {activePeriod ? (isAr ? `قطع ${periods.find(p => p.name === activePeriod)?.arabic} الأثرية` : `${activePeriod} Artifacts`) : (isAr ? 'المجموعة الكاملة' : 'Complete Collection')} <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.75rem', color: '#C7C3B9' }}>({filtered.length} {isAr ? 'عناصر' : 'items'})</span>
117:         </div>
118:         <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
119:           {categories.slice(0, 5).map(cat => (
120:             <button key={cat} onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
121:               style={{ padding: '4px 10px', background: filterCategory === cat ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${filterCategory === cat ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.12)'}`, borderRadius: 20, color: filterCategory === cat ? '#D4AF37' : '#C7C3B9', fontFamily: 'Inter', fontSize: '0.65rem', cursor: 'pointer', letterSpacing: '0.06em' }}>
122:               {cat}
123:             </button>
124:           ))}
125:           {(activePeriod || filterCategory) && <button onClick={() => { setActivePeriod(null); setFilterCategory(null); }} style={{ padding: '4px 10px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 20, color: '#ff6b6b', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><X size={10} /> {isAr ? 'مسح' : 'Clear'}</button>}
126:         </div>
127:       </div>
128: 
129:       {/* Artifacts */}
130:       <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', direction: isAr ? 'rtl' : 'ltr' }}>
131:         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
132:           {filtered.map((artifact, i) => (
133:             <motion.div key={artifact.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
134:               whileHover={{ y: -5, boxShadow: '0 16px 50px rgba(212,175,55,0.12)' }} onClick={() => setSelected(artifact)}
135:               style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.16)', borderRadius: 10, padding: '18px', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.3s', textAlign: isAr ? 'right' : 'left' }}>
136:               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: artifact.significance === 'CRITICAL' ? 'linear-gradient(90deg, #D4AF37, #F0D98A, #D4AF37)' : artifact.significance === 'HIGH' ? `linear-gradient(90deg, transparent, ${artifact.significance === 'HIGH' ? '#8B6914' : 'rgba(212,175,55,0.3)'}, transparent)` : 'transparent' }} />
137:               {artifact.significance === 'CRITICAL' && <div style={{ position: 'absolute', top: 10, [isAr ? 'right' : 'left']: 12, background: 'linear-gradient(135deg,#D4AF37,#8B6914)', borderRadius: 3, padding: '1px 7px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.55rem', color: '#0D1117', fontWeight: 700, letterSpacing: '0.08em' }}>{isAr ? 'نادر' : 'RARE'}</div>}
138:               <div style={{ position: 'absolute', top: 10, [isAr ? 'left' : 'right']: 12, background: 'rgba(139,105,20,0.15)', border: '1px solid rgba(139,105,20,0.3)', borderRadius: 10, padding: '1px 8px', fontFamily: 'Inter', fontSize: '0.58rem', color: '#8B6914' }}>{artifact.category}</div>
139:               <div style={{ fontSize: '2.5rem', marginBottom: 12, marginTop: artifact.significance === 'CRITICAL' ? 14 : 0, filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.4))', lineHeight: 1 }}>{artifact.symbol}</div>
140:               <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.92rem', color: '#F8F4EA', marginBottom: 3, lineHeight: 1.3 }}>{isAr ? artifact.nameAr : artifact.name}</div>
141:               {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.78rem', color: '#D4AF37', direction: 'rtl', marginBottom: 10 }}>{artifact.arabic}</div>}
142:               <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexDirection: isAr ? 'row' : 'row' }}>
143:                 <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9' }}><MapPin size={10} color="#8B6914" /> {isAr ? artifact.regionAr : artifact.region}</div>
144:                 <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', direction: 'ltr' }}><Clock size={10} color="#8B6914" /> {artifact.year}</div>
145:               </div>
146:             </motion.div>
147:           ))}
148:         </div>
149:       </div>
150: 
151:       {/* Detail Modal */}
152:       <AnimatePresence>
153:         {selected && (
154:           <motion.div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: 'rgba(13,17,23,0.95)', zIndex: 100, backdropFilter: 'blur(12px)' }}
155:             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
156:             <motion.div initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 30 }} onClick={e => e.stopPropagation()}
157:               style={{ background: 'linear-gradient(135deg, #1a0f00, #0D1117)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 14, padding: '32px', maxWidth: 640, width: '100%', maxHeight: '88vh', overflowY: 'auto', position: 'relative', direction: isAr ? 'rtl' : 'ltr' }}>
158:               <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 14, [isAr ? 'left' : 'right']: 14, background: 'none', border: 'none', color: '#C7C3B9', cursor: 'pointer' }}><X size={18} /></button>
159:               {selected.significance === 'CRITICAL' && (
160:                 <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#D4AF37,#8B6914)', borderRadius: 4, padding: '3px 12px', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.62rem', color: '#0D1117', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>{isAr ? 'قطعة نادرة' : 'RARE ARTIFACT'}</div>
161:               )}
162:               <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: 16, filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.5))' }}>{selected.symbol}</div>
163:               <div style={{ textAlign: 'center', marginBottom: 24 }}>
164:                 <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.5rem', color: '#D4AF37', marginBottom: 4 }}>{isAr ? selected.nameAr : selected.name}</div>
165:                 {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.1rem', color: '#F0D98A', direction: 'rtl' }}>{selected.arabic}</div>}
166:               </div>
167:               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
168:                 {(isAr ? [
169:                   { label: 'الفترة', value: periods.find(p => p.name === selected.period)?.arabic || selected.period }, 
170:                   { label: 'السنة', value: selected.year }, 
171:                   { label: 'المنطقة', value: selected.regionAr }, 
172:                   { label: 'الفئة', value: selected.categoryAr }, 
173:                   { label: 'المادة', value: selected.materialAr }, 
174:                   { label: 'الموقع', value: selected.locationAr }
175:                 ] : [
176:                   { label: 'Period', value: selected.period }, 
177:                   { label: 'Year', value: selected.year }, 
178:                   { label: 'Region', value: selected.region }, 
179:                   { label: 'Category', value: selected.category }, 
180:                   { label: 'Material', value: selected.material }, 
181:                   { label: 'Location', value: selected.location }
182:                 ]).map(({ label, value }) => (
183:                   <div key={label} style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 6, padding: '8px 12px' }}>
184:                     <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.58rem', color: '#C7C3B9', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
185:                     <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#F8F4EA', direction: label === 'السنة' || label === 'Year' ? 'ltr' : 'inherit', textAlign: isAr && (label === 'السنة' || label === 'Year') ? 'right' : 'left' }}>{value}</div>
186:                   </div>
187:                 ))}
188:               </div>
189:               <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 6, padding: '16px', marginBottom: 12, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', color: '#F8F4EA', textAlign: isAr ? 'right' : 'left', lineHeight: 1.6 }}>
190:                 {isAr ? selected.meaningAr : selected.meaning}
191:               </div>
192:               <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 6, padding: '12px', marginBottom: 12, fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#D4AF37', textAlign: isAr ? 'right' : 'left' }}>
193:                 <div style={{ fontSize: '0.6rem', color: '#C7C3B9', textTransform: 'uppercase', marginBottom: 4 }}>{isAr ? 'النقش' : 'Inscription'}</div>
194:                 {isAr ? selected.inscriptionAr : selected.inscription}
195:               </div>
196:               {selected.dimensions && <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 6, padding: '8px 12px', marginBottom: 12, fontFamily: 'Inter', fontSize: '0.75rem', color: '#C7C3B9', textAlign: isAr ? 'right' : 'left', direction: 'ltr' }}>
197:                 <span style={{ color: '#D4AF37', marginLeft: isAr ? 8 : 0 }}>{isAr ? 'الأبعاد:' : 'Dimensions:'}</span> {selected.dimensions}
198:               </div>}
199:             </motion.div>
200:           </motion.div>
201:         )}
202:       </AnimatePresence>
203:     </div>
204:   );
205: }
206: 
The above content shows the entire, complete file contents of the requested file.
