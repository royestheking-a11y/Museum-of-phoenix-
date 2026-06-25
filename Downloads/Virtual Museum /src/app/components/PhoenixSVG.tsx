import { motion } from 'motion/react';
import { useId } from 'react';

export default function PhoenixSVG({ size = 320, animate = true, glowIntensity = 1 }: { size?: number; animate?: boolean; glowIntensity?: number }) {
  const idPrefix = useId().replace(/:/g, '');
  
  return (
    <motion.div style={{ width: size, height: size }} animate={animate ? { y: [0, -12, 0] } : {}} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
      <svg viewBox="0 0 400 440" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} role="img" aria-label="Museum of Phoenix golden phoenix logo">
        <defs>
          <radialGradient id={`phoenixBodyGrad-${idPrefix}`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#F0D98A" /><stop offset="50%" stopColor="#D4AF37" /><stop offset="100%" stopColor="#8B6914" />
          </radialGradient>
          <radialGradient id={`phoenixWingGrad-${idPrefix}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#F0D98A" stopOpacity="0.95" /><stop offset="40%" stopColor="#D4AF37" stopOpacity="0.85" /><stop offset="100%" stopColor="#7A5C10" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id={`fireGrad-${idPrefix}`} cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="#FF8C00" /><stop offset="50%" stopColor="#D4AF37" /><stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`glowBg-${idPrefix}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity={String(0.25 * glowIntensity)} />
            <stop offset="60%" stopColor="#D4AF37" stopOpacity={String(0.06 * glowIntensity)} />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
          <filter id={`phoenixGlow-${idPrefix}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id={`softGlow-${idPrefix}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <ellipse cx="200" cy="220" rx="170" ry="170" fill={`url(#glowBg-${idPrefix})`} />

        {/* Wings */}
        <motion.path d="M 195 210 C 165 190 110 155 65 115 C 55 105 45 90 50 75 C 70 100 100 130 135 155 C 95 125 60 90 50 55 C 75 90 115 130 155 165 C 110 135 75 100 70 65 C 100 105 140 145 175 178 C 140 155 110 125 108 90 C 130 130 160 165 188 192 Z"
          fill={`url(#phoenixWingGrad-${idPrefix})`} filter={`url(#softGlow-${idPrefix})`}
          animate={animate ? { scaleY: [1, 0.92, 1], rotate: [0, -2, 0] } : {}}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '195px 210px' }} />
        <motion.path d="M 205 210 C 235 190 290 155 335 115 C 345 105 355 90 350 75 C 330 100 300 130 265 155 C 305 125 340 90 350 55 C 325 90 285 130 245 165 C 290 135 325 100 330 65 C 300 105 260 145 225 178 C 260 155 290 125 292 90 C 270 130 240 165 212 192 Z"
          fill={`url(#phoenixWingGrad-${idPrefix})`} filter={`url(#softGlow-${idPrefix})`}
          animate={animate ? { scaleY: [1, 0.92, 1], rotate: [0, 2, 0] } : {}}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '205px 210px' }} />

        {/* Body, neck, head */}
        <ellipse cx="200" cy="235" rx="28" ry="45" fill={`url(#phoenixBodyGrad-${idPrefix})`} filter={`url(#phoenixGlow-${idPrefix})`} />
        <ellipse cx="200" cy="195" rx="16" ry="22" fill={`url(#phoenixBodyGrad-${idPrefix})`} filter={`url(#softGlow-${idPrefix})`} />
        <circle cx="200" cy="172" r="24" fill={`url(#phoenixBodyGrad-${idPrefix})`} filter={`url(#phoenixGlow-${idPrefix})`} />
        <path d="M 214 170 L 234 175 L 214 179 Z" fill="#F0D98A" />
        <circle cx="210" cy="167" r="6" fill="#0D1117" />
        <circle cx="212" cy="165" r="2.5" fill="#F0D98A" />
        <circle cx="213" cy="164.5" r="1" fill="white" />

        {/* Crest feathers */}
        <path d="M 193 150 C 186 132 182 114 185 98" stroke="#F0D98A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 198 148 C 195 127 195 108 198 92" stroke="#F0D98A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 203 149 C 206 130 210 112 208 96" stroke="#F0D98A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 208 151 C 215 135 222 118 220 102" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 188 152 C 180 136 176 120 178 104" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="185" cy="97" r="3" fill="#F0D98A" />
        <circle cx="198" cy="91" r="3.5" fill="#F0D98A" />
        <circle cx="208" cy="95" r="3" fill="#F0D98A" />
        <circle cx="220" cy="101" r="2.5" fill="#D4AF37" />
        <circle cx="177" cy="103" r="2.5" fill="#D4AF37" />

        {/* Wing feather details */}
        <path d="M 172 195 C 140 185 105 170 75 150" stroke="#F0D98A" strokeWidth="1.2" opacity="0.7" fill="none" />
        <path d="M 168 205 C 132 196 95 180 62 158" stroke="#F0D98A" strokeWidth="1" opacity="0.5" fill="none" />
        <path d="M 228 195 C 260 185 295 170 325 150" stroke="#F0D98A" strokeWidth="1.2" opacity="0.7" fill="none" />
        <path d="M 232 205 C 268 196 305 180 338 158" stroke="#F0D98A" strokeWidth="1" opacity="0.5" fill="none" />

        {/* Tail feathers */}
        <path d="M 188 278 C 175 310 165 340 158 375" stroke="#D4AF37" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 193 280 C 185 315 180 348 175 382" stroke="#F0D98A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 200 282 C 200 318 200 352 200 388" stroke="#F0D98A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 207 280 C 215 315 220 348 225 382" stroke="#F0D98A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 212 278 C 225 310 235 340 242 375" stroke="#D4AF37" strokeWidth="3" fill="none" strokeLinecap="round" />

        <ellipse cx="200" cy="285" rx="22" ry="12" fill={`url(#fireGrad-${idPrefix})`} opacity="0.6" />
        {[{ cx: 193, cy: 300, r: 3, delay: 0 }, { cx: 200, cy: 295, r: 3.5, delay: 0.3 }, { cx: 207, cy: 302, r: 2.5, delay: 0.6 }, { cx: 196, cy: 308, r: 2, delay: 0.15 }, { cx: 204, cy: 306, r: 2, delay: 0.45 }].map((p, i) => (
          <motion.circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={i % 2 === 0 ? '#D4AF37' : '#F0D98A'}
            animate={{ y: [-5, -25, -5], opacity: [0.9, 0, 0.9], scale: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: p.delay, ease: 'easeOut' }} />
        ))}
      </svg>
    </motion.div>
  );
}
