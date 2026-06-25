import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check, Loader2, Search, X } from 'lucide-react';
import { useLanguage, LANGUAGES, LangCode } from '../context/LanguageContext';

interface Props {
  compact?: boolean;
}

const LANG_GROUPS = [
  { label: 'Arabic & RTL', labelAr: 'العربية والـ RTL', codes: ['ar', 'ur', 'fa'] },
  { label: 'Global', labelAr: 'عالمي', codes: ['en', 'fr', 'de', 'es', 'pt', 'it', 'nl', 'ru'] },
  { label: 'Asian & African', labelAr: 'آسيوي وأفريقي', codes: ['tr', 'ms', 'id', 'hi', 'bn', 'zh', 'ja', 'ko', 'sw'] },
];

export default function LanguageSwitcher({ compact = false }: Props) {
  const { lang, setLanguage, isAr, isTranslating, langInfo } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Focus search on open
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open]);

  // Clamp dropdown so it never overflows the viewport
  useEffect(() => {
    if (!open || !dropdownRef.current || !menuRef.current) return;
    const el = dropdownRef.current;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal clamp
    if (rect.right > vw - 8) {
      el.style.right = '0px';
      el.style.left = 'auto';
    } else if (rect.left < 8) {
      el.style.left = '0px';
      el.style.right = 'auto';
    }

    // Vertical: if it spills below viewport, flip above button
    if (rect.bottom > vh - 8) {
      const btnH = menuRef.current.querySelector('button')?.offsetHeight ?? 36;
      el.style.top = 'auto';
      el.style.bottom = `${btnH + 8}px`;
    }
  }, [open]);

  const filteredLanguages = LANGUAGES.filter(l =>
    !search.trim() ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code: LangCode) => {
    setLanguage(code);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', zIndex: 1000, display: 'inline-block' }}>
      {/* ── Trigger button ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        title={isAr ? 'اختر اللغة' : 'Select Language'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: compact ? '6px 10px' : '8px 14px',
          background: open
            ? 'linear-gradient(135deg, rgba(212,175,55,0.22), rgba(212,175,55,0.10))'
            : 'rgba(255,255,255,0.06)',
          border: `1px solid ${open ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.25)'}`,
          borderRadius: 22,
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#F0D98A',
          transition: 'border-color 0.2s, background 0.2s',
          boxShadow: open ? '0 0 18px rgba(212,175,55,0.12)' : 'none',
          position: 'relative',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {isTranslating
          ? <Loader2 size={14} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite' }} />
          : <Globe size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
        }

        {/* Show native name on full, just lang code on compact */}
        {!compact && (
          <span style={{
            fontFamily: langInfo.dir === 'rtl' ? '"IBM Plex Sans Arabic"' : 'Inter',
            fontSize: '0.78rem',
            color: '#F0D98A',
            fontWeight: 500,
            maxWidth: 90,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {langInfo.nativeName}
          </span>
        )}

        {compact && (
          <span style={{
            fontFamily: langInfo.dir === 'rtl' ? '"IBM Plex Sans Arabic"' : 'Inter',
            fontSize: '0.7rem',
            color: '#F0D98A',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}>
            {langInfo.code.toUpperCase()}
          </span>
        )}
      </motion.button>

      {/* ── Dropdown ── */}
      <motion.div
        ref={dropdownRef}
        initial="closed"
        animate={open ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' },
          closed: { opacity: 0, y: -6, scale: 0.97, pointerEvents: 'none' }
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 8px)',
          width: 'min(280px, calc(100vw - 16px))',
          background: 'rgba(8, 20, 15, 0.98)',
          border: '1px solid rgba(212,175,55,0.28)',
          borderRadius: 12,
          overflow: 'hidden',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 16px 50px rgba(0,0,0,0.75), 0 0 0 1px rgba(212,175,55,0.08)',
          zIndex: 9999,
        }}
      >
        {/* Header */}
        <div style={{
          padding: '12px 14px 10px',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          background: 'rgba(212,175,55,0.04)',
        }}>
          <div style={{
            fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter',
            fontSize: '0.72rem',
            color: '#D4AF37',
            fontWeight: 600,
            letterSpacing: '0.06em',
            marginBottom: 9,
            direction: isAr ? 'rtl' : 'ltr',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <Globe size={12} color="#D4AF37" />
            {isAr ? 'اختر اللغة' : 'Select Language'}
          </div>

          {/* Search box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(212,175,55,0.18)',
            borderRadius: 7,
            padding: '5px 10px',
          }}>
            <Search size={11} color="#D4AF37" style={{ flexShrink: 0 }} />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isAr ? 'ابحث عن لغة...' : 'Search language...'}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                fontFamily: 'Inter',
                fontSize: '0.76rem',
                color: '#F8F4EA',
                flex: 1,
                direction: 'ltr',
                minWidth: 0,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', color: '#C7C3B9', cursor: 'pointer', display: 'flex', padding: 0, flexShrink: 0 }}
              >
                <X size={11} />
              </button>
            )}
          </div>
        </div>

        {/* Language list */}
        <div style={{ maxHeight: 260, overflowY: 'auto', padding: '6px 0' }}>
          {search.trim() ? (
            filteredLanguages.length === 0 ? (
              <div style={{ padding: '18px', textAlign: 'center', fontFamily: 'Inter', fontSize: '0.74rem', color: '#C7C3B9' }}>
                {isAr ? 'لم تُوجد نتائج' : 'No results found'}
              </div>
            ) : (
              filteredLanguages.map(l => (
                <LanguageOption key={l.code} lang={l} isSelected={lang === l.code} onClick={() => handleSelect(l.code)} />
              ))
            )
          ) : (
            LANG_GROUPS.map(group => {
              const langs = group.codes
                .map(c => LANGUAGES.find(l => l.code === c))
                .filter(Boolean) as typeof LANGUAGES;
              return (
                <div key={group.label}>
                  <div style={{
                    padding: '5px 14px 3px',
                    fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter',
                    fontSize: '0.56rem',
                    color: 'rgba(212,175,55,0.45)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    {isAr ? group.labelAr : group.label}
                  </div>
                  {langs.map(l => (
                    <LanguageOption key={l.code} lang={l} isSelected={lang === l.code} onClick={() => handleSelect(l.code)} />
                  ))}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '7px 14px',
          borderTop: '1px solid rgba(212,175,55,0.07)',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          <Globe size={9} color="rgba(212,175,55,0.35)" />
          <span style={{
            fontFamily: 'Inter',
            fontSize: '0.58rem',
            color: 'rgba(199,195,185,0.35)',
            fontStyle: 'italic',
          }}>
            {isAr ? 'ترجمة تلقائية · Google' : 'Auto-translated · Google Translate'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function LanguageOption({
  lang: l,
  isSelected,
  onClick,
}: {
  lang: typeof LANGUAGES[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ background: 'rgba(212,175,55,0.07)' } as any}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '8px 14px',
        background: isSelected ? 'rgba(212,175,55,0.11)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.12s',
        borderLeft: isSelected ? '2px solid #D4AF37' : '2px solid transparent',
      }}
    >
      {/* Lang code badge */}
      <span style={{
        fontFamily: 'Inter',
        fontSize: '0.6rem',
        fontWeight: 700,
        color: isSelected ? '#D4AF37' : 'rgba(199,195,185,0.5)',
        background: isSelected ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isSelected ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 4,
        padding: '1px 5px',
        letterSpacing: '0.06em',
        flexShrink: 0,
        minWidth: 28,
        textAlign: 'center',
        direction: 'ltr',
      }}>
        {l.code.toUpperCase()}
      </span>

      {/* Names */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: l.dir === 'rtl' ? '"IBM Plex Sans Arabic"' : 'Inter',
          fontSize: '0.8rem',
          color: isSelected ? '#F0D98A' : '#F8F4EA',
          fontWeight: isSelected ? 600 : 400,
          direction: l.dir,
          textAlign: l.dir === 'rtl' ? 'right' : 'left',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {l.nativeName}
        </div>
        <div style={{
          fontFamily: 'Inter',
          fontSize: '0.62rem',
          color: isSelected ? 'rgba(212,175,55,0.65)' : 'rgba(199,195,185,0.45)',
          direction: 'ltr',
          textAlign: 'left',
        }}>
          {l.name}
        </div>
      </div>

      {/* RTL badge */}
      {l.dir === 'rtl' && (
        <span style={{
          fontFamily: 'Inter',
          fontSize: '0.52rem',
          color: 'rgba(212,175,55,0.5)',
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.18)',
          borderRadius: 3,
          padding: '1px 4px',
          flexShrink: 0,
          letterSpacing: '0.04em',
        }}>RTL</span>
      )}

      {/* Check */}
      {isSelected && (
        <Check size={12} color="#D4AF37" style={{ flexShrink: 0 }} />
      )}
    </motion.button>
  );
}
