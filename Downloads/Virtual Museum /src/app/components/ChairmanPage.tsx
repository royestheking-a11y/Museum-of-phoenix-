import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, GraduationCap, BookOpen, Quote, Download,
  ExternalLink, ArrowRight, BookMarked, Globe, CheckCircle2,
  Award, PlayCircle, Star, Sparkles, Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ChairmanPage({ onBack }: { onBack: () => void }) {
  const { t, isAr } = useLanguage();
  const [activePaper, setActivePaper] = useState<number | null>(null);
  
  // Constellation map state
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const timelineEvents = [
    { year: '2014', title: 'Educational Diploma', desc: 'Higher Diploma in Educational Qualification', arabicTitle: 'دبلوم التأهيل التربوي' },
    { year: '2018', title: 'Master\'s Degree', desc: 'Master in Islamic Studies & Symbolism', arabicTitle: 'درجة الماجستير' },
    { year: '2022', title: 'Sociology Impact', desc: 'Interdisciplinary research bridging sociology and faith', arabicTitle: 'تأثير علم الاجتماع' },
    { year: '2026', title: 'PhD Candidate', desc: 'Doctoral research in deep Islamic Symbolism', arabicTitle: 'باحثة دكتوراه' },
  ];

  const papers = [
    {
      id: 1,
      title: 'The Impact of Religious Symbols on Social Cohesion',
      arabicTitle: 'تأثير الرموز الدينية على التماسك الاجتماعي',
      journal: 'Journal of Semiotic Studies',
      doi: '10.1016/j.semiotics.2025.04.002',
      abstract: 'This paper explores the deep neurological and social impact of religious symbols in shaping communal identity and fostering cohesion across diverse Islamic societies.',
      topics: ['Sociology', 'Semiotics', 'Community']
    },
    {
      id: 2,
      title: 'Symbols-and-Icons Strategy in Arabic Education',
      arabicTitle: 'استراتيجية الرموز والأيقونات في التعليم العربي',
      journal: 'International Journal of Educational Research',
      doi: '10.1080/09614524.2024.1928374',
      abstract: 'An empirical study on utilizing visual symbolism and iconography to enhance the cognitive retention and engagement of students learning classical Arabic texts.',
      topics: ['Education', 'Pedagogy', 'Cognition']
    }
  ];

  const nodes = [
    { id: 'semiotics', label: 'Semiotics', ar: 'السيميائية', angle: 0, distance: 240 },
    { id: 'interpretation', label: 'Interpretation Science', ar: 'علم التفسير', angle: 45, distance: 230 },
    { id: 'semantics', label: 'Semantics', ar: 'علم الدلالة', angle: 90, distance: 180 },
    { id: 'crypto', label: 'Cryptography', ar: 'علم التشفير', angle: 135, distance: 230 },
    { id: 'manuscripts', label: 'Manuscript Studies', ar: 'دراسات المخطوطات', angle: 180, distance: 250 },
    { id: 'writing', label: 'Research Writing', ar: 'كتابة البحوث', angle: 225, distance: 230 },
    { id: 'shorthand', label: 'Arabic Shorthand', ar: 'الاختزال العربي', angle: 270, distance: 180 },
    { id: 'quranic', label: 'Qur\'anic Symbolism', ar: 'الرموز القرآنية', angle: 315, distance: 230 },
  ];

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#062B24', color: '#F8F4EA', direction: isAr ? 'rtl' : 'ltr' }}>
      
      {/* ─── HEADER ─── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '20px 30px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(rgba(6,43,36,0.9), transparent)', pointerEvents: 'none' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(13,17,23,0.6)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 30, padding: '8px 16px', color: '#D4AF37', cursor: 'pointer', pointerEvents: 'auto', backdropFilter: 'blur(10px)' }}>
          <ArrowLeft size={16} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
          <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.8rem' }}>{isAr ? 'العودة للمتحف' : 'Back to Museum'}</span>
        </button>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'radial-gradient(circle at center, #D4AF37 0%, transparent 60%)', y: yBg }} />
        
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            style={{ display: 'inline-block', padding: '6px 16px', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 30, color: '#D4AF37', fontFamily: 'Inter', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20, background: 'rgba(212,175,55,0.1)', backdropFilter: 'blur(5px)' }}>
            {isAr ? 'باحثة | معلمة | متخصصة في الرموز' : 'Researcher | Educator | Symbolism Specialist'}
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#F0D98A', marginBottom: 20, textShadow: '0 10px 30px rgba(212,175,55,0.3)', lineHeight: 1.1 }}>
            {isAr ? 'د. فاطمة فاضل العيساوي' : 'Dr. Fatima Fadel Alissawi'}
          </motion.h1>
          
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#C7C3B9', fontWeight: 300, maxWidth: 700, margin: '0 auto 40px' }}>
            {isAr ? 'نحو فهم أعمق للرموز والمعاني' : 'Toward a Deeper Understanding of Symbols and Meanings'}
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #D4AF37, #8B6914)', border: 'none', borderRadius: 30, color: '#0D1117', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(212,175,55,0.4)' }}>
              <BookOpen size={18} /> {isAr ? 'استكشاف الأبحاث' : 'Explore Research'}
            </button>
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.5)', borderRadius: 30, color: '#D4AF37', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(5px)' }}>
              <GraduationCap size={18} /> {isAr ? 'الرحلة الأكاديمية' : 'View Academic Journey'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section id="about" style={{ padding: '100px 20px', background: '#081C17', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: 60, alignItems: 'center' }} className="md:grid-cols-1">
          
          <motion.div initial={{ opacity: 0, x: isAr ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ position: 'relative', borderRadius: 20, padding: 8, background: 'linear-gradient(135deg, rgba(212,175,55,0.4), rgba(212,175,55,0.05))' }}>
            <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 16, background: 'rgba(6,43,36,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(212,175,55,0.2) 0%, transparent 70%)' }} />
              <Quote size={80} color="rgba(212,175,55,0.15)" style={{ position: 'absolute' }} />
              {/* Premium Placeholder for Portrait */}
              <div style={{ textAlign: 'center', zIndex: 10 }}>
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #8B6914)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(212,175,55,0.3)' }}>
                  <span style={{ fontFamily: '"Playfair Display"', fontSize: '3rem', color: '#0D1117' }}>F</span>
                </div>
                <div style={{ fontFamily: 'Inter', color: '#D4AF37', letterSpacing: '0.2em', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                  {isAr ? 'الصورة الرسمية' : 'Official Portrait'}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: isAr ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h3 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '2.5rem', color: '#F0D98A', marginBottom: 24 }}>
              {isAr ? 'قصة نجاح أكاديمية' : 'An Academic Story'}
            </h3>
            <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '1.05rem', color: '#C7C3B9', lineHeight: 1.8, marginBottom: 40 }}>
              {isAr 
                ? 'رحلة د. فاطمة تجمع بين الشغف العميق بالدراسات الإسلامية والتحليل السوسيولوجي. تمتد مسيرتها الأكاديمية عبر دراسة الرموز، وتحليل المعاني، وصولاً إلى استراتيجيات التعليم المبتكرة.' 
                : 'Dr. Fatima\'s journey weaves a deep passion for Islamic studies with sociological analysis. Her academic path spans the study of symbols, meaning interpretation, and innovative educational strategies.'}
            </p>

            <div style={{ position: 'relative', paddingLeft: isAr ? 0 : 20, paddingRight: isAr ? 20 : 0 }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, [isAr ? 'right' : 'left']: 0, width: 2, background: 'linear-gradient(180deg, #D4AF37, transparent)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                {timelineEvents.map((evt, i) => (
                  <motion.div key={evt.year} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                    style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 6, [isAr ? 'right' : 'left']: -25, width: 12, height: 12, borderRadius: '50%', background: '#081C17', border: '2px solid #D4AF37' }} />
                    <div style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600, marginBottom: 4, direction: 'ltr', textAlign: isAr ? 'right' : 'left' }}>{evt.year}</div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.2rem', color: '#F8F4EA', marginBottom: 4 }}>
                      {isAr ? evt.arabicTitle : evt.title}
                    </div>
                    <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', color: 'rgba(199,195,185,0.8)' }}>
                      {evt.desc}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── ACADEMIC EXPERTISE (CONSTELLATION) ─── */}
      <section style={{ padding: '120px 20px', background: '#062B24', position: 'relative', overflow: 'hidden', minHeight: 800, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: 80, zIndex: 10 }}>
          <h3 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '2.5rem', color: '#F0D98A', marginBottom: 16 }}>
            {isAr ? 'الخبرة الأكاديمية' : 'Academic Expertise'}
          </h3>
          <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', color: '#C7C3B9' }}>
            {isAr ? 'الترابط المعرفي لعلوم الرموز والدلالة' : 'The cognitive interconnectivity of symbolism and semantics'}
          </p>
        </div>

        <div style={{ position: 'relative', width: '100%', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Zero-size centered container */}
          <div style={{ position: 'relative', width: 0, height: 0 }}>
            
            {/* SVG Connection Lines */}
            <svg style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}>
              {nodes.map(node => {
                const rad = (node.angle * Math.PI) / 180;
                const x = Math.cos(rad) * node.distance;
                const y = Math.sin(rad) * node.distance;
                const isHovered = hoveredNode === node.id;
                return (
                  <line key={`line-${node.id}`} x1="0" y1="0" x2={x} y2={y} stroke={isHovered ? '#D4AF37' : 'rgba(212,175,55,0.2)'} strokeWidth={isHovered ? 2 : 1} style={{ transition: 'all 0.3s' }} />
                );
              })}
            </svg>

            {/* Center Node */}
            <motion.div animate={{ boxShadow: ['0 0 20px rgba(212,175,55,0.3)', '0 0 60px rgba(212,175,55,0.6)', '0 0 20px rgba(212,175,55,0.3)'] }} transition={{ duration: 4, repeat: Infinity }}
              style={{ position: 'absolute', left: 0, top: 0, x: '-50%', y: '-50%', width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #1A463B, #0D261E)', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: isAr ? '1.4rem' : '1.2rem', color: '#F0D98A', textAlign: 'center', lineHeight: 1.2 }}>
                {isAr ? 'الرمزية' : 'Symbolism'}
              </span>
            </motion.div>

            {/* Orbiting Nodes */}
            {nodes.map(node => {
              const rad = (node.angle * Math.PI) / 180;
              const left = Math.cos(rad) * node.distance;
              const top = Math.sin(rad) * node.distance;
              
              return (
                <motion.div key={node.id} onHoverStart={() => setHoveredNode(node.id)} onHoverEnd={() => setHoveredNode(null)}
                  whileHover={{ scale: 1.1, zIndex: 20 }}
                  style={{ position: 'absolute', left, top, x: '-50%', y: '-50%', background: '#081C17', border: `1px solid ${hoveredNode === node.id ? '#D4AF37' : 'rgba(212,175,55,0.3)'}`, borderRadius: 30, padding: '10px 20px', cursor: 'pointer', transition: 'border-color 0.3s', zIndex: 5 }}>
                  <span style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', color: hoveredNode === node.id ? '#F0D98A' : '#C7C3B9', whiteSpace: 'nowrap' }}>
                    {isAr ? node.ar : node.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── ACADEMY SECTION ─── */}
      <section style={{ padding: '100px 20px', background: 'linear-gradient(to bottom, #062B24, #0D1117)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Globe size={28} color="#D4AF37" />
            </motion.div>
            <h3 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '2.5rem', color: '#F0D98A', marginBottom: 16 }}>
              {isAr ? 'الأكاديمية العربية الأولى للرموز' : 'First Arab Academy For Symbols'}
            </h3>
            <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', color: '#C7C3B9', maxWidth: 600, margin: '0 auto' }}>
              {isAr ? 'مؤسسة رائدة مكرسة لفك شفرات الرموز وإعادة إحياء التراث الدلالي عبر نهج أكاديمي محايد.' : 'A pioneering institution dedicated to decoding symbols and reviving semantic heritage through a neutral academic approach.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {[
              { icon: BookMarked, title: 'Research-Based Education', ar: 'تعليم مبني على الأبحاث', desc: 'Curriculum founded on rigorous academic methodologies.' },
              { icon: Languages, title: 'Bilingual Learning', ar: 'تعلم ثنائي اللغة', desc: 'Programs available in both Arabic and English.' },
              { icon: Star, title: 'Expert-Led Lectures', ar: 'محاضرات بقيادة خبراء', desc: 'Insights directly from specialists in the field.' },
              { icon: CheckCircle2, title: 'Neutral Academic Approach', ar: 'نهج أكاديمي محايد', desc: 'Objective analysis devoid of ideological bias.' }
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, background: 'rgba(212,175,55,0.1)' }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 16, padding: '30px 24px', textAlign: 'center', transition: 'all 0.3s' }}>
                <feature.icon size={32} color="#D4AF37" style={{ margin: '0 auto 20px' }} />
                <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '1.1rem', color: '#F8F4EA', fontWeight: 600, marginBottom: 12 }}>
                  {isAr ? feature.ar : feature.title}
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#C7C3B9', lineHeight: 1.6 }}>
                  {feature.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RESEARCH LABORATORY ─── */}
      <section id="research" style={{ padding: '100px 20px 140px', background: 'linear-gradient(180deg, #0D1117 0%, #1A150A 100%)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 60, direction: isAr ? 'rtl' : 'ltr' }}>
            <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
            <h3 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '2.5rem', color: '#F0D98A', margin: 0 }}>
              {isAr ? 'مختبر الأبحاث' : 'Research Laboratory'}
            </h3>
            <div style={{ width: 50, height: 1, background: 'linear-gradient(270deg, transparent, #D4AF37)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {papers.map((paper) => (
              <motion.div key={paper.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                style={{ background: 'rgba(6,43,36,0.6)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 16, padding: 30, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 16px', background: 'rgba(212,175,55,0.1)', borderBottomLeftRadius: 16, color: '#D4AF37', fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {paper.journal}
                </div>
                
                <h4 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '1.6rem', color: '#F8F4EA', marginBottom: 12, maxWidth: '85%' }}>
                  {isAr ? paper.arabicTitle : paper.title}
                </h4>
                
                <div style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: 'rgba(199,195,185,0.6)', marginBottom: 20 }}>
                  DOI: {paper.doi}
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                  {paper.topics.map(topic => (
                    <span key={topic} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', color: '#C7C3B9', fontSize: '0.75rem', fontFamily: 'Inter' }}>
                      {topic}
                    </span>
                  ))}
                </div>

                <AnimatePresence>
                  {activePaper === paper.id ? (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 12, marginBottom: 24 }}>
                      <h5 style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.9rem', color: '#D4AF37', marginBottom: 10 }}>{isAr ? 'الملخص' : 'Abstract'}</h5>
                      <p style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.95rem', color: '#F8F4EA', lineHeight: 1.7 }}>
                        {paper.abstract}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <button onClick={() => setActivePaper(activePaper === paper.id ? null : paper.id)}
                    style={{ padding: '10px 20px', background: 'none', border: '1px solid rgba(212,175,55,0.5)', borderRadius: 30, color: '#D4AF37', cursor: 'pointer', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {activePaper === paper.id ? (isAr ? 'إخفاء الملخص' : 'Hide Abstract') : (isAr ? 'قراءة الملخص' : 'Read Abstract')}
                  </button>
                  <button style={{ padding: '10px 20px', background: 'rgba(212,175,55,0.15)', border: '1px solid transparent', borderRadius: 30, color: '#F0D98A', cursor: 'pointer', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Download size={16} /> {isAr ? 'تحميل PDF' : 'Download PDF'}
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(`Citation: ${paper.title}, ${paper.journal}, DOI: ${paper.doi}`)}
                    style={{ padding: '10px 20px', background: 'none', border: '1px dashed rgba(199,195,185,0.3)', borderRadius: 30, color: '#C7C3B9', cursor: 'pointer', fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}
                    title="Copy Citation">
                    <Quote size={16} /> {isAr ? 'نسخ الاستشهاد' : 'Cite'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
