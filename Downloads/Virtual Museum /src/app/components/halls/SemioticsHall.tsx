import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Hand, Flower, Scale, Ruler, Sun, Moon, Star, Shield, Sword, Zap, Droplets, TreeDeciduous, Bird, BookOpen, ScrollText, Sparkles, Building2, Eye, PenTool, Compass, Globe, Map, Key, Lock, Diamond, Feather, Target, Wind, Flame, Mountain, Cloud, Tent, Circle, Triangle, Hexagon, X, Volume2, Share2, Bookmark } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';


export const symbols = [
  { id: 1, symbolIconName: 'Moon', name: 'Crescent', arabic: 'هلال', color: '#1a4a3a', layers: [{ level: 'Iconic', levelAr: 'أيقوني', meaning: 'Moon in its crescent phase — direct visual representation', meaningAr: 'القمر في مرحلة الهلال - تمثيل بصري مباشر' }, { level: 'Indexical', levelAr: 'إشاري', meaning: 'Points to time: the beginning of Ramadan, start of Islamic months', meaningAr: 'يشير إلى الوقت: بداية رمضان، بداية الأشهر الإسلامية' }, { level: 'Symbolic', levelAr: 'رمزي', meaning: 'Islam, Muslim identity, the divine order of celestial time', meaningAr: 'الإسلام، الهوية الإسلامية، النظام الإلهي للوقت السماوي' }, { level: 'Cultural', levelAr: 'ثقافي', meaning: 'Appears on flags of 21 Muslim-majority nations; resistance and faith', meaningAr: 'يظهر على أعلام 21 دولة ذات أغلبية مسلمة؛ المقاومة والإيمان' }] },
  { id: 2, symbolIconName: 'TreeDeciduous', name: 'Palm Tree', arabic: 'نخلة', color: '#1a3a1a', layers: [{ level: 'Iconic', levelAr: 'أيقوني', meaning: 'Date palm — a tree native to the Arabian Peninsula', meaningAr: 'نخلة التمر - شجرة موطنها شبه الجزيرة العربية' }, { level: 'Indexical', levelAr: 'إشاري', meaning: 'Signs of desert civilization, oasis, and fertile land', meaningAr: 'علامات الحضارة الصحراوية والواحات والأرض الخصبة' }, { level: 'Symbolic', levelAr: 'رمزي', meaning: 'Nobility, generosity, steadfastness, and the Arabian spirit', meaningAr: 'النبل والكرم والصمود والروح العربية' }, { level: 'Cultural', levelAr: 'ثقافي', meaning: 'National symbol of Saudi Arabia; appears in ancient Nabataean coinage', meaningAr: 'رمز وطني للسعودية؛ يظهر في العملات النبطية القديمة' }] },
  { id: 3, symbolIconName: 'Bird', name: 'Falcon', arabic: 'صقر', color: '#3a2a1a', layers: [{ level: 'Iconic', levelAr: 'أيقوني', meaning: 'Raptor bird with exceptional vision and speed', meaningAr: 'طائر جارح ذو رؤية وسرعة استثنائية' }, { level: 'Indexical', levelAr: 'إشاري', meaning: 'Indicates mastery, precision, and elevated status', meaningAr: 'يشير إلى الإتقان والدقة والمكانة المرتفعة' }, { level: 'Symbolic', levelAr: 'رمزي', meaning: 'Power, vision, loyalty, freedom — royal and warrior virtues', meaningAr: 'القوة، الرؤية، الولاء، الحرية - فضائل ملكية ومحاربة' }, { level: 'Cultural', levelAr: 'ثقافي', meaning: 'National bird of UAE; used in falconry since 2000 BCE', meaningAr: 'الطائر الوطني للإمارات العربية المتحدة؛ يستخدم في الصيد بالصقور منذ 2000 قبل الميلاد' }] },
  { id: 4, symbolIconName: 'Hand', name: 'Khamsa', arabic: 'خمسة', color: '#3a1a3a', layers: [{ level: 'Iconic', levelAr: 'أيقوني', meaning: 'An open hand with five fingers', meaningAr: 'يد مفتوحة بخمسة أصابع' }, { level: 'Indexical', levelAr: 'إشاري', meaning: 'Points to protection — ward against the evil eye', meaningAr: 'يشير إلى الحماية - درء العين الشريرة' }, { level: 'Symbolic', levelAr: 'رمزي', meaning: 'Divine protection, blessing, the five pillars of Islam', meaningAr: 'الحماية الإلهية، البركة، أركان الإسلام الخمسة' }, { level: 'Cultural', levelAr: 'ثقافي', meaning: 'Predates Islam; found in Phoenician, Carthaginian traditions as "Hamsa"', meaningAr: 'يسبق الإسلام؛ وجد في التقاليد الفينيقية والقرطاجية باسم "خمسة"' }] },
  { id: 5, symbolIconName: '◎', name: 'Eye of Wisdom', arabic: 'عين الحكمة', color: '#1a1a3a', layers: [{ level: 'Iconic', levelAr: 'أيقوني', meaning: 'A single eye, often radiating light', meaningAr: 'عين واحدة، غالباً ما تشع نوراً' }, { level: 'Indexical', levelAr: 'إشاري', meaning: 'Signals divine observation — "God sees all"', meaningAr: 'يشير إلى المراقبة الإلهية - "الله يرى كل شيء"' }, { level: 'Symbolic', levelAr: 'رمزي', meaning: 'Omniscience, protection, esoteric wisdom, the unseen world', meaningAr: 'المعرفة المطلقة، الحماية، الحكمة الباطنية، عالم الغيب' }, { level: 'Cultural', levelAr: 'ثقافي', meaning: 'Present in ancient Egyptian (Eye of Ra/Horus) and Islamic traditions', meaningAr: 'موجود في التقاليد المصرية القديمة (عين رع / حورس) والتقاليد الإسلامية' }] },
  { id: 6, symbolIconName: 'Star', name: 'Star of Solomon', arabic: 'نجمة سليمان', color: '#1a2a1a', layers: [{ level: 'Iconic', levelAr: 'أيقوني', meaning: 'A six-pointed star formed by two overlapping triangles', meaningAr: 'نجمة سداسية تتكون من مثلثين متداخلين' }, { level: 'Indexical', levelAr: 'إشاري', meaning: 'Associated with King Solomon and his legendary ring of power', meaningAr: 'مرتبطة بالملك سليمان وخاتم قوته الأسطوري' }, { level: 'Symbolic', levelAr: 'رمزي', meaning: 'Divine authority, wisdom, protection, unity of opposing forces', meaningAr: 'السلطة الإلهية، الحكمة، الحماية، وحدة القوى المتعارضة' }, { level: 'Cultural', levelAr: 'ثقافي', meaning: 'Used in Islamic architecture, Jewish tradition, and medieval alchemy', meaningAr: 'تستخدم في العمارة الإسلامية والتقاليد اليهودية وكيمياء القرون الوسطى' }] },
  { id: 7, symbolIconName: 'Flower', name: 'Arabesque', arabic: 'الأرابيسك', color: '#2a1a0a', layers: [{ level: 'Iconic', levelAr: 'أيقوني', meaning: 'Interlacing floral and geometric patterns with no end', meaningAr: 'أنماط نباتية وهندسية متشابكة بلا نهاية' }, { level: 'Indexical', levelAr: 'إشاري', meaning: 'Signals Islamic art and the avoidance of human representation', meaningAr: 'يشير إلى الفن الإسلامي وتجنب التمثيل البشري' }, { level: 'Symbolic', levelAr: 'رمزي', meaning: 'The infinite nature of God, unity of creation, divine order', meaningAr: 'الطبيعة اللانهائية لله، وحدة الخلق، النظام الإلهي' }, { level: 'Cultural', levelAr: 'ثقافي', meaning: 'Defining feature of Islamic architecture from Alhambra to Istanbul', meaningAr: 'سمة مميزة للعمارة الإسلامية من قصر الحمراء إلى إسطنبول' }] },
  { id: 8, symbolIconName: 'Scale', name: 'Scale of Justice', arabic: 'ميزان العدل', color: '#2a2a0a', layers: [{ level: 'Iconic', levelAr: 'أيقوني', meaning: 'A balance scale with two equal pans', meaningAr: 'ميزان ذو كفتين متساويتين' }, { level: 'Indexical', levelAr: 'إشاري', meaning: 'Points to weighing, measurement, and fair judgment', meaningAr: 'يشير إلى الوزن والقياس والحكم العادل' }, { level: 'Symbolic', levelAr: 'رمزي', meaning: 'Divine justice, accountability on the Day of Judgment', meaningAr: 'العدالة الإلهية، المساءلة في يوم القيامة' }, { level: 'Cultural', levelAr: 'ثقافي', meaning: 'Appears in Islamic jurisprudence and ancient Egyptian cosmology (Ma\'at)', meaningAr: 'يظهر في الفقه الإسلامي وعلم الكونيات المصري القديم (ماعت)' }] },
];

export default function SemioticsHall() {
  const { isAr } = useLanguage();
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<typeof symbols[0] | null>(null);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Moon': return <Moon size="1em" strokeWidth={1.5} />;
      case 'TreeDeciduous': return <TreeDeciduous size="1em" strokeWidth={1.5} />;
      case 'Bird': return <Bird size="1em" strokeWidth={1.5} />;
      case 'Hand': return <Hand size="1em" strokeWidth={1.5} />;
      case 'Star': return <Star size="1em" fill="currentColor" strokeWidth={1.5} />;
      case 'Flower': return <Flower size="1em" strokeWidth={1.5} />;
      case 'Scale': return <Scale size="1em" strokeWidth={1.5} />;
      case '◎': return '◎';
      default: return '◎';
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', color: '#F8F4EA' }}>
      <div style={{ position: 'relative', height: 230, background: 'linear-gradient(180deg, #1a0a2a 0%, #2a0a3a 50%, #0D1117 100%)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 20px rgba(150,100,255,0.7))' }}>◈</div>
          <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.8rem', color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.5)' }}>{isAr ? 'مختبر السيميائية' : 'Semiotics Lab'}</div>
          {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1rem', color: '#F0D98A', direction: 'rtl' }}>مختبر السيميائية</div>}
          <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem', color: '#C7C3B9', textAlign: 'center', maxWidth: 500, lineHeight: 1.7, padding: '0 20px', direction: isAr ? 'rtl' : 'ltr' }}>
            {isAr ? 'حرك مؤشر الماوس فوق أي رمز للكشف عن معناه المتعدد المستويات. انقر لاستكشاف التحليل السيميائي الكامل.' : 'Hover any symbol to reveal its layered meaning. Click to explore the full semiotic analysis.'}
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(150,100,255,0.5), #D4AF37, rgba(150,100,255,0.5), transparent)' }} />
      </div>

      <div style={{ background: 'rgba(150,100,255,0.05)', borderBottom: '1px solid rgba(150,100,255,0.15)', padding: '16px 32px', direction: isAr ? 'rtl' : 'ltr' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ fontSize: '1.5rem', flexShrink: 0, display: 'flex' }}><Ruler size="1em" /></div>
          <div>
            <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', color: '#D4AF37' }}>{isAr ? 'نموذج بيرس الثلاثي: ' : 'Peirce\'s Triadic Model: '}</span>
            <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.83rem', color: '#C7C3B9', lineHeight: 1.7 }}>
              {isAr ? (
                <>لكل رمز ثلاث طبقات — <em style={{ color: '#F0D98A' }}>أيقونة</em> (التشابه البصري)، <em style={{ color: '#F0D98A' }}>فهرس</em> (العلاقة السببية)، و <em style={{ color: '#F0D98A' }}>رمز</em> (المعنى المتفق عليه ثقافيًا). تضيف السيميائية العربية طبقة رابعة: طبقة <em style={{ color: '#F0D98A' }}>الذاكرة الثقافية</em>.</>
              ) : (
                <>Every symbol has three layers — the <em style={{ color: '#F0D98A' }}>icon</em> (visual resemblance), the <em style={{ color: '#F0D98A' }}>index</em> (causal relationship), and the <em style={{ color: '#F0D98A' }}>symbol</em> (culturally agreed-upon meaning). Arabic semiotics adds a fourth: the <em style={{ color: '#F0D98A' }}>cultural memory</em> layer.</>
              )}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto', direction: isAr ? 'rtl' : 'ltr' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {symbols.map((sym, i) => (
            <motion.div key={sym.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
              onHoverStart={() => setHovered(sym.id)} onHoverEnd={() => setHovered(null)} onClick={() => setSelected(sym)}
              style={{ position: 'relative', background: `linear-gradient(135deg, ${sym.color}cc, rgba(13,17,23,0.9))`, border: `1px solid ${hovered === sym.id ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.18)'}`, borderRadius: 10, padding: '24px', cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.25s, box-shadow 0.25s', boxShadow: hovered === sym.id ? '0 10px 40px rgba(0,0,0,0.4)' : 'none' }}>
              <div style={{ fontSize: '3rem', marginBottom: 14, filter: hovered === sym.id ? 'drop-shadow(0 0 15px rgba(212,175,55,0.6))' : 'none', transition: 'filter 0.3s', lineHeight: 1 }}>{renderIcon(sym.symbolIconName)}</div>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.95rem', color: '#F8F4EA', marginBottom: 4 }}>{isAr ? sym.arabic : sym.name}</div>
              {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.8rem', color: '#D4AF37', direction: 'rtl', marginBottom: 14 }}>{sym.arabic}</div>}
              <AnimatePresence>
                {hovered === sym.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                    {sym.layers.slice(0, 2).map((layer: any, li: number) => (
                      <div key={li} style={{ marginBottom: 6 }}>
                        <div style={{ display: 'inline-block', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.6rem', color: '#8B6914', background: 'rgba(139,105,20,0.2)', borderRadius: 10, padding: '1px 8px', marginBottom: 3 }}>{isAr ? layer.levelAr : layer.level}</div>
                        <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.72rem', color: '#C7C3B9', lineHeight: 1.5 }}>{isAr ? layer.meaningAr : layer.meaning}</div>
                      </div>
                    ))}
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#D4AF37', marginTop: 8 }}>{isAr ? `+ ${sym.layers.length - 2} طبقات إضافية ←` : `+ ${sym.layers.length - 2} more layers →`}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 flex items-center justify-center p-6" style={{ background: 'rgba(13,17,23,0.95)', zIndex: 100, backdropFilter: 'blur(15px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 30 }} onClick={e => e.stopPropagation()}
              style={{ background: `linear-gradient(135deg, ${selected.color}dd, #0D1117)`, border: '1px solid rgba(212,175,55,0.4)', borderRadius: 14, padding: '40px', maxWidth: 600, width: '100%' }}>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, [isAr ? 'left' : 'right']: 16, background: 'none', border: 'none', color: '#C7C3B9', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 28, flexDirection: isAr ? 'row' : 'row' }}>
                <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.5))' }}>{renderIcon(selected.symbolIconName)}</div>
                <div>
                  <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.4rem', color: '#D4AF37' }}>{isAr ? selected.arabic : selected.name}</div>
                  {!isAr && <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.1rem', color: '#F0D98A', direction: 'rtl' }}>{selected.arabic}</div>}
                </div>
              </div>
              <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.7rem', color: '#C7C3B9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>{isAr ? 'الطبقات السيميائية' : 'Semiotic Layers'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selected.layers.map((layer: any, i: number) => (
                  <motion.div key={layer.level} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ display: 'flex', gap: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, padding: '14px 16px', flexDirection: isAr ? 'row' : 'row' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4AF37', flexShrink: 0, marginTop: 5, opacity: 1 - i * 0.15 }} />
                    <div>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{isAr ? `طبقة ${i + 1}: ${layer.levelAr}` : `Layer ${i + 1}: ${layer.level}`}</div>
                      <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', color: '#F8F4EA', lineHeight: 1.6 }}>{isAr ? layer.meaningAr : layer.meaning}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
