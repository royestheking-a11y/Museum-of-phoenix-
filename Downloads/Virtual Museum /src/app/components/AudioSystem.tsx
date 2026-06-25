import { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const HALL_FREQUENCIES: Record<number, { base: number; harm: number; label: string; labelAr: string }> = {
  0: { base: 55,  harm: 82.5,  label: 'Grand Dome', labelAr: 'القبة الكبرى' },
  1: { base: 65,  harm: 97.5,  label: 'History', labelAr: 'التاريخ' },
  2: { base: 48,  harm: 72,    label: "Qur'anic", labelAr: 'القرآن الكريم' },
  3: { base: 80,  harm: 120,   label: 'Cryptography', labelAr: 'التشفير' },
  4: { base: 58,  harm: 87,    label: 'Semiotics', labelAr: 'السيميائية' },
  5: { base: 52,  harm: 78,    label: 'Semantics', labelAr: 'علم الدلالة' },
  6: { base: 44,  harm: 66,    label: 'Manuscripts', labelAr: 'المخطوطات' },
  7: { base: 90,  harm: 135,   label: 'AI Lab', labelAr: 'مختبر الذكاء الاصطناعي' },
};

interface Props {
  currentHall: number; // 0 = dome, 1-7 = halls
  enabled: boolean;
  onToggle: () => void;
}

export default function AudioSystem({ currentHall, enabled, onToggle }: Props) {
  const { isAr } = useLanguage();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const osc3Ref = useRef<OscillatorNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = enabled ? volume * 0.03 : 0;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Base drone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = HALL_FREQUENCIES[currentHall]?.base ?? 55;
    gain1.gain.value = 1;
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start();
    osc1Ref.current = osc1;

    // Harmonic (fifth above)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = HALL_FREQUENCIES[currentHall]?.harm ?? 82.5;
    gain2.gain.value = 0.4;
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start();
    osc2Ref.current = osc2;

    // Subtle shimmer
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.value = (HALL_FREQUENCIES[currentHall]?.base ?? 55) * 4;
    gain3.gain.value = 0.05;
    osc3.connect(gain3);
    gain3.connect(masterGain);
    osc3.start();
    osc3Ref.current = osc3;

    // Slow frequency wobble for organic feel
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 0.5;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfo.start();
  }, []);

  // Toggle audio
  useEffect(() => {
    if (!audioCtxRef.current) return;
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(enabled ? volume * 0.03 : 0, audioCtxRef.current.currentTime, 0.5);
    }
  }, [enabled, volume]);

  // Change frequencies when hall changes
  useEffect(() => {
    if (!audioCtxRef.current || !osc1Ref.current || !osc2Ref.current || !osc3Ref.current) return;
    const freq = HALL_FREQUENCIES[currentHall] ?? HALL_FREQUENCIES[0];
    const now = audioCtxRef.current.currentTime;
    osc1Ref.current.frequency.setTargetAtTime(freq.base, now, 1.5);
    osc2Ref.current.frequency.setTargetAtTime(freq.harm, now, 1.5);
    osc3Ref.current.frequency.setTargetAtTime(freq.base * 4, now, 1.5);
  }, [currentHall]);

  const handleToggle = () => {
    if (!audioCtxRef.current) initAudio();
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
    onToggle();
  };

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={handleToggle}
        onContextMenu={e => { e.preventDefault(); setShowPanel(!showPanel); }}
        title={isAr ? (enabled ? 'كتم الصوت المحيطي (انقر بزر الماوس الأيمن للإعدادات)' : 'تفعيل الصوت المحيطي') : (enabled ? 'Mute ambient sound (right-click for settings)' : 'Enable ambient sound')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 42, height: 42,
          background: enabled ? 'rgba(212,175,55,0.15)' : 'rgba(6,43,36,0.85)',
          border: `1px solid ${enabled ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.3)'}`,
          borderRadius: 6, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        {enabled
          ? <Volume2 size={16} color="#D4AF37" />
          : <VolumeX size={16} color="#C7C3B9" />
        }
      </motion.button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            style={{
              position: 'absolute', top: 48, [isAr ? 'right' : 'left']: 0, zIndex: 200,
              background: 'rgba(6,43,36,0.97)', border: '1px solid rgba(212,175,55,0.35)',
              borderRadius: 10, padding: 16, minWidth: 200, backdropFilter: 'blur(20px)', direction: isAr ? 'rtl' : 'ltr'
            }}
          >
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.65rem', color: '#C7C3B9', letterSpacing: '0.12em', textTransform: isAr ? 'none' : 'uppercase', marginBottom: 10, textAlign: isAr ? 'right' : 'left' }}>{isAr ? 'الصوت المحيطي' : 'Ambient Sound'}</div>
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : '"Playfair Display"', fontSize: '0.78rem', color: '#D4AF37', marginBottom: 12, textAlign: isAr ? 'right' : 'left' }}>
              {isAr ? HALL_FREQUENCIES[currentHall]?.labelAr ?? 'المتحف' : HALL_FREQUENCIES[currentHall]?.label ?? 'Museum'} — {isAr ? (enabled ? 'نشط' : 'مكتوم') : (enabled ? 'Active' : 'Muted')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <VolumeX size={12} color="#C7C3B9" />
              <input type="range" min={0} max={1} step={0.05} value={volume}
                onChange={e => { setVolume(+e.target.value); if (masterGainRef.current && audioCtxRef.current) masterGainRef.current.gain.setTargetAtTime(+e.target.value * 0.03 * (enabled ? 1 : 0), audioCtxRef.current.currentTime, 0.1); }}
                style={{ flex: 1, accentColor: '#D4AF37', direction: 'ltr' }} />
              <Volume2 size={12} color="#D4AF37" />
            </div>
            <div style={{ fontFamily: isAr ? '"IBM Plex Sans Arabic"' : 'Inter', fontSize: '0.68rem', color: 'rgba(199,195,185,0.5)', lineHeight: 1.5, textAlign: isAr ? 'right' : 'left' }}>
              {isAr ? 'يتغير الصوت المحيطي مع كل قاعة. انقر بزر الماوس الأيمن على زر الصوت لفتح الإعدادات.' : 'Ambient drone changes with each hall. Right-click the sound button to open settings.'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
