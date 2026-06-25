export default function IslamicGeometry({ opacity = 0.12, color = '#D4AF37', size = 80, patternId = 'islamic-geo' }: { opacity?: number; color?: string; size?: number; patternId?: string }) {
  const s = size;
  const r = s * 0.38;
  const innerR = s * 0.18;

  const star8Points = (cx: number, cy: number): string => {
    const pts: string[] = [];
    for (let i = 0; i < 8; i++) {
      const outerAngle = (i * Math.PI) / 4 - Math.PI / 8;
      const innerAngle = outerAngle + Math.PI / 8;
      pts.push(`${cx + r * Math.cos(outerAngle)},${cy + r * Math.sin(outerAngle)}`);
      pts.push(`${cx + innerR * Math.cos(innerAngle)},${cy + innerR * Math.sin(innerAngle)}`);
    }
    return pts.join(' ');
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} aria-hidden="true">
      <defs>
        <pattern id={patternId} x="0" y="0" width={s} height={s} patternUnits="userSpaceOnUse">
          <polygon points={star8Points(s / 2, s / 2)} fill="none" stroke={color} strokeWidth="0.7" />
          <polygon points={star8Points(0, 0)} fill="none" stroke={color} strokeWidth="0.7" />
          <polygon points={star8Points(s, 0)} fill="none" stroke={color} strokeWidth="0.7" />
          <polygon points={star8Points(0, s)} fill="none" stroke={color} strokeWidth="0.7" />
          <polygon points={star8Points(s, s)} fill="none" stroke={color} strokeWidth="0.7" />
          <line x1={s * 0.15} y1={s / 2} x2={s * 0.85} y2={s / 2} stroke={color} strokeWidth="0.35" opacity="0.5" />
          <line x1={s / 2} y1={s * 0.15} x2={s / 2} y2={s * 0.85} stroke={color} strokeWidth="0.35" opacity="0.5" />
          <line x1={s * 0.18} y1={s * 0.18} x2={s * 0.82} y2={s * 0.82} stroke={color} strokeWidth="0.25" opacity="0.3" />
          <line x1={s * 0.82} y1={s * 0.18} x2={s * 0.18} y2={s * 0.82} stroke={color} strokeWidth="0.25" opacity="0.3" />
          <rect x={s / 2 - innerR} y={s / 2 - innerR} width={innerR * 2} height={innerR * 2} transform={`rotate(45 ${s / 2} ${s / 2})`} fill="none" stroke={color} strokeWidth="0.4" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
