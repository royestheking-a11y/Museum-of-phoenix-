const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Clock, Users, Star, Award, PlayCircle, CheckCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function CourseDashboard({ onBack }: Props) {
  const { t, isAr } = useLanguage();
  const [courses, setCourses] = useState<any[]>([]);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(console.error);
  }, []);

  if (activeCourse) {
    return (
      <div className="absolute inset-0 z-50 flex" style={{ background: '#0a100d' }} dir={isAr ? 'rtl' : 'ltr'}>
        {/* Sidebar */}
        <div style={{ width: 320, background: '#0d1511', borderInlineEnd: '1px solid rgba(212,175,55,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 24, borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
            <button onClick={() => setActiveCourse(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer', fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.9rem', marginBottom: 16 }}>
              {isAr ? '← العودة للدورات' : '← Back to Courses'}
            </button>
            <h2 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: '#F8F4EA', margin: 0, lineHeight: 1.4 }}>
              {isAr ? activeCourse.arabic : activeCourse.title}
            </h2>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.8rem', color: '#C7C3B9', opacity: 0.8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {isAr ? activeCourse.totalDurationAr : activeCourse.totalDuration}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} /> {activeCourse.students.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeCourse.lessons.map((lesson: any, i: number) => (
              <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: i === 0 ? 'rgba(212,175,55,0.1)' : 'transparent', border: i === 0 ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent', borderRadius: 8, cursor: lesson.free || lesson.done ? 'pointer' : 'not-allowed', opacity: lesson.free || lesson.done ? 1 : 0.5 }}>
                {lesson.done ? <CheckCircle size={18} color="#D4AF37" /> : <PlayCircle size={18} color={i === 0 ? '#D4AF37' : '#C7C3B9'} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.9rem', color: i === 0 ? '#D4AF37' : '#F8F4EA' }}>{isAr ? lesson.arabic : lesson.title}</div>
                  <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.75rem', color: '#C7C3B9', marginTop: 4 }}>{isAr ? lesson.durationAr : lesson.duration}</div>
                </div>
                {!lesson.free && !lesson.done && <LockIcon />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Video Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#000' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(212,175,55,0.05), transparent)' }} />
            <PlayCircle size={80} color="rgba(212,175,55,0.8)" style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ padding: 32, background: '#0a100d', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
            <h3 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.5rem', color: '#F8F4EA', margin: '0 0 8px 0' }}>{isAr ? activeCourse.lessons[0].arabic : activeCourse.lessons[0].title}</h3>
            <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.95rem', color: '#C7C3B9', lineHeight: 1.6, maxWidth: 800 }}>
              {isAr ? 'في هذا الدرس، سنستكشف الأصول التاريخية...' : 'In this lesson, we will explore the historical origins...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex flex-col" style={{ background: '#0a100d' }} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div style={{ padding: '24px 40px', borderBottom: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6,43,36,0.5)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{ background: 'none', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', cursor: 'pointer' }}>
            {isAr ? '→' : '←'}
          </button>
          <div>
            <h1 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.5rem', color: '#D4AF37', margin: 0 }}>{isAr ? 'أكاديمية المتحف' : 'Museum Academy'}</h1>
            <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', color: '#C7C3B9', margin: '4px 0 0 0' }}>{isAr ? 'دورات متخصصة في الرمزية العربية' : 'Specialized courses in Arabic symbolism'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: '#F8F4EA' }}>{courses.length}</div>
            <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.7rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>{isAr ? 'دورات' : 'Courses'}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: '#F8F4EA' }}>2</div>
            <div style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.7rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>{isAr ? 'شهادات' : 'Certificates'}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 32 }}>
          {courses.length === 0 ? (
            <div style={{ color: '#D4AF37', fontFamily: '"IBM Plex Sans Arabic"' }}>Loading courses...</div>
          ) : courses.map(course => (
            <motion.div key={course.id} whileHover={{ y: -5 }} style={{ background: 'rgba(6,43,36,0.4)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 160, background: course.color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: 20, fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.75rem', color: '#F8F4EA', backdropFilter: 'blur(10px)' }}>
                  {isAr ? course.levelAr : course.level}
                </div>
                <BookOpen size={48} color="rgba(255,255,255,0.2)" />
              </div>
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '1.2rem', color: '#F8F4EA', margin: '0 0 12px 0', lineHeight: 1.4 }}>{isAr ? course.arabic : course.title}</h3>
                <p style={{ fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.85rem', color: '#C7C3B9', margin: '0 0 20px 0', lineHeight: 1.6, flex: 1 }}>{isAr ? course.descriptionAr : course.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#C7C3B9', fontSize: '0.8rem', fontFamily: '"IBM Plex Sans Arabic"' }}><Clock size={14} color="#D4AF37"/> {isAr ? course.totalDurationAr : course.totalDuration}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#C7C3B9', fontSize: '0.8rem', fontFamily: '"IBM Plex Sans Arabic"' }}><Users size={14} color="#D4AF37"/> {course.students.toLocaleString()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#C7C3B9', fontSize: '0.8rem', fontFamily: '"IBM Plex Sans Arabic"' }}><Star size={14} color="#D4AF37"/> {course.rating}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#C7C3B9', fontSize: '0.8rem', fontFamily: '"IBM Plex Sans Arabic"' }}><Award size={14} color="#D4AF37"/> {course.certificate ? (isAr ? 'شهادة' : 'Certificate') : ''}</div>
                </div>

                <button onClick={() => setActiveCourse(course)} style={{ width: '100%', padding: '12px', background: course.progress > 0 ? 'transparent' : '#D4AF37', border: course.progress > 0 ? '1px solid #D4AF37' : 'none', color: course.progress > 0 ? '#D4AF37' : '#062B24', borderRadius: 8, fontFamily: '"IBM Plex Sans Arabic"', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                  {course.progress > 0 ? (isAr ? 'متابعة التعلم' : 'Continue Learning') : (isAr ? 'بدء الدورة' : 'Start Course')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C7C3B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}
