import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import IslamicGeometry from './IslamicGeometry';
import PhoenixSVG from './PhoenixSVG';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

export default function SplashScreen({ onEnter }: { onEnter: () => void }) {
  const { isAr } = useLanguage();
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    
    import('../utils/soundManager').then(({ soundManager }) => {
      soundManager.setGlobalSoundEnabled(true);
      soundManager.playGateOpen();
    });
    
    // Wait for the doors to slide open and light to consume the screen
    setTimeout(() => {
      onEnter();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-[#020504] flex flex-col items-center justify-end overflow-hidden perspective-[2500px] select-none"
      style={{ perspective: '2500px' }} dir="ltr">
      
      {/* ─── AMBIENT BACKGROUND (The Museum Exterior Wall) ─── */}
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 40%, #0a1f18 0%, #020504 100%)' }} />

      {/* ─── THE DOOR FRAME ─── */}
      <div className="relative z-10 w-[92vw] max-w-[1000px] h-[88vh] max-h-[900px] mt-auto flex"
           style={{
             background: '#000',
             borderTopLeftRadius: '24px',
             borderTopRightRadius: '24px',
             borderTop: '16px solid #140d05',
             borderLeft: '16px solid #140d05',
             borderRight: '16px solid #140d05',
             borderBottom: 'none',
             boxShadow: '0 -20px 60px rgba(0,0,0,0.9), inset 0 0 50px rgba(0,0,0,1)'
           }}>
        
        {/* Frame inner trim */}
        <div className="absolute inset-0 pointer-events-none z-20 border-[4px] border-[#D4AF37] opacity-20" style={{ borderBottom: 'none', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />

        {/* ─── BLINDING LIGHT BEHIND DOORS ─── */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: 'linear-gradient(180deg, #F0D98A 0%, #D4AF37 50%, #ffffff 100%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: opening ? 1 : 0 }}
          transition={{ duration: 2, delay: 0.8 }}
        />
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: '#ffffff' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: opening ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 1.8 }}
        />

        {/* ─── LEFT DOOR ─── */}
        <motion.div 
          className="relative w-1/2 h-full z-10 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
          onClick={handleOpen}
          style={{ 
            background: 'linear-gradient(to right, #03140f, #05231a)',
            borderRight: '4px solid #000', // Center crack
            boxShadow: 'inset 20px 20px 50px rgba(0,0,0,0.8), inset -5px -5px 20px rgba(0,0,0,0.5)'
          }}
          animate={{ x: opening ? '-100%' : '0%' }}
          transition={{ duration: 3, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        >
          {/* Subtle wood/marble grain */}
          <div className="absolute inset-0 opacity-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)' }} />
          <div className="absolute inset-0 opacity-20" style={{ transform: 'scale(1.5)' }}><IslamicGeometry opacity={1} patternId="door-l" /></div>

          {/* Golden Panel Molding */}
          <div className="absolute top-10 bottom-10 left-10 right-6 border-[4px] border-[#D4AF37] opacity-90"
               style={{ 
                 borderRadius: '4px',
                 boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.6)',
                 background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0.4))'
               }}>
            
            {/* Inner Panel */}
            <div className="absolute top-5 bottom-5 left-5 right-5 border-2 border-[rgba(212,175,55,0.3)] flex flex-col items-center justify-center"
                 style={{ background: 'rgba(0,0,0,0.3)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.7)' }}>
              
              {/* Embossed Calligraphy */}
              <div style={{ 
                display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px',
                fontFamily: isAr ? '"IBM Plex Sans Arabic", "Noto Kufi Arabic"' : '"Playfair Display", serif', 
                fontSize: 'clamp(1.5rem, 4vw, 4rem)', 
                color: '#D4AF37', 
                textShadow: '3px 3px 0px rgba(0,0,0,0.9), -1px -1px 0px rgba(255,255,255,0.2), 0 0 25px rgba(212,175,55,0.4)', 
                lineHeight: 1.2,
                transform: 'rotate(-90deg)',
                whiteSpace: 'nowrap'
              }} dir={isAr ? 'rtl' : 'ltr'}>
                <span>{isAr ? 'بوابة' : 'Gate of'}</span>
                <span>{isAr ? 'المعرفة' : 'Knowledge'}</span>
              </div>
            </div>
          </div>

          {/* Physical Door Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20 pointer-events-none" style={{ right: 'clamp(10px, 4vw, 24px)' }}>
             <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full" style={{ background: 'radial-gradient(circle, #F0D98A, #8B6914)', boxShadow: '0 5px 15px rgba(0,0,0,0.9)' }} />
             <div className="w-3 h-32 sm:w-5 sm:h-48 -mt-4 -mb-4 sm:-mt-6 sm:-mb-6 z-10" style={{ background: 'linear-gradient(to right, #F0D98A, #D4AF37, #8B6914)', borderRadius: '10px', boxShadow: '5px 10px 20px rgba(0,0,0,0.8), inset -2px -2px 5px rgba(0,0,0,0.5)' }} />
             <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full" style={{ background: 'radial-gradient(circle, #F0D98A, #8B6914)', boxShadow: '0 5px 15px rgba(0,0,0,0.9)' }} />
          </div>
        </motion.div>
        
        {/* ─── RIGHT DOOR ─── */}
        <motion.div 
          className="relative w-1/2 h-full z-10 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
          onClick={handleOpen}
          style={{ 
            background: 'linear-gradient(-90deg, #03140f, #05231a)',
            borderLeft: '4px solid #000', // Center crack
            boxShadow: 'inset 20px 20px 50px rgba(0,0,0,0.8), inset -5px -5px 20px rgba(0,0,0,0.5)'
          }}
          animate={{ x: opening ? '100%' : '0%' }}
          transition={{ duration: 3, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        >
          {/* Subtle wood/marble grain */}
          <div className="absolute inset-0 opacity-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)' }} />
          <div className="absolute inset-0 opacity-20" style={{ transform: 'scale(1.5)' }}><IslamicGeometry opacity={1} patternId="door-r" /></div>

          {/* Golden Panel Molding */}
          <div className="absolute top-10 bottom-10 right-10 left-6 border-[4px] border-[#D4AF37] opacity-90"
               style={{ 
                 borderRadius: '4px',
                 boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.6)',
                 background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0.4))'
               }}>
            
            {/* Inner Panel */}
            <div className="absolute top-5 bottom-5 left-5 right-5 border-2 border-[rgba(212,175,55,0.3)] flex flex-col items-center justify-center"
                 style={{ background: 'rgba(0,0,0,0.3)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.7)' }}>
              
              {/* Embossed Calligraphy */}
              <div style={{ 
                display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px',
                fontFamily: isAr ? '"IBM Plex Sans Arabic", "Noto Kufi Arabic"' : '"Playfair Display", serif', 
                fontSize: 'clamp(1.5rem, 4vw, 4rem)', 
                color: '#D4AF37', 
                textShadow: '3px 3px 0px rgba(0,0,0,0.9), -1px -1px 0px rgba(255,255,255,0.2), 0 0 25px rgba(212,175,55,0.4)', 
                lineHeight: 1.2,
                transform: 'rotate(-90deg)',
                whiteSpace: 'nowrap'
              }} dir={isAr ? 'rtl' : 'ltr'}>
                <span>{isAr ? 'أكاديمية' : 'Academy of'}</span>
                <span>{isAr ? 'الرموز' : 'Symbols'}</span>
              </div>
            </div>
          </div>

          {/* Physical Door Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20 pointer-events-none" style={{ left: 'clamp(10px, 4vw, 24px)' }}>
             <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full" style={{ background: 'radial-gradient(circle, #F0D98A, #8B6914)', boxShadow: '0 5px 15px rgba(0,0,0,0.9)' }} />
             <div className="w-3 h-32 sm:w-5 sm:h-48 -mt-4 -mb-4 sm:-mt-6 sm:-mb-6 z-10" style={{ background: 'linear-gradient(to left, #F0D98A, #D4AF37, #8B6914)', borderRadius: '10px', boxShadow: '-5px 10px 20px rgba(0,0,0,0.8), inset 2px -2px 5px rgba(0,0,0,0.5)' }} />
             <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full" style={{ background: 'radial-gradient(circle, #F0D98A, #8B6914)', boxShadow: '0 5px 15px rgba(0,0,0,0.9)' }} />
          </div>
        </motion.div>

        {/* ─── CENTER LOCK & PHOENIX ─── */}
        <AnimatePresence>
          {!opening && (
            <motion.div 
              className="absolute z-20 pointer-events-none flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 scale-[0.6] sm:scale-100"
              style={{ top: '72%', left: '50%' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
            >
              {/* Glowing orb behind Phoenix */}
              <motion.div 
                className="absolute rounded-full"
                style={{ width: 'clamp(80px, 20vw, 130px)', height: 'clamp(80px, 20vw, 130px)', background: 'radial-gradient(circle, rgba(212,175,55,0.45) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Golden Center Crest */}
              <div className="relative flex items-center justify-center" style={{ width: 100, height: 100, background: 'linear-gradient(135deg, #111, #000)', border: '3px solid #D4AF37', borderRadius: '50%', boxShadow: '0 0 30px rgba(212,175,55,0.4), inset 0 0 15px rgba(212,175,55,0.3)' }}>
                <PhoenixSVG size={60} animate={true} glowIntensity={1.2} />
              </div>

              {/* Removed Hint Button as requested */}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── FLOOR SHADOW ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }} />

      {/* ─── LANGUAGE SWITCHER (top-right overlay) ─── */}
      <div style={{ position: 'fixed', top: 'calc(16px + env(safe-area-inset-top))', right: 16, zIndex: 100 }}>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
