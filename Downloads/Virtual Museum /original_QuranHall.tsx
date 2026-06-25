Created At: 2026-06-24T07:02:00Z
Completed At: 2026-06-24T07:02:00Z
File Path: `file:///Users/mdsunny/Downloads/Virtual%20Museum%20/src/app/components/halls/QuranHall.tsx`
Total Lines: 416
Total Bytes: 44387
Showing lines 240 to 260
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
240:       deepMeaning: 'The Quran uses whitening and blackening of faces as the ultimate spiritual metaphor — not referring to race, but to inner states made visible. Pilgrims wear white ihram garments to symbolize spiritual equality and purity before God — all status markers removed. The Prophet described the heart as either white (clean, receptive to guidance) or black (sealed, hardened). Islamic ritual purity (taharah) culminates in the white garment, the white shroud of the deceased, and ultimately the Day when inner whiteness or blackness becomes outwardly manifest.',
241:       references: ['Quranic color theology', 'Ihram symbolism in Hajj studies', 'Heart symbolism in hadith and Sufi tradition'],
242:       scholars: 'Al-Ghazali, Ibn al-Qayyim, Tariq Ramadan',
243:     },
244:     {
245:       word: 'ASFAR', arabic: 'أَصْفَر', name: 'Yellow — Divine Sign',
246:       verse: 'Indeed, Allah commands you to slaughter a cow. They said: What color should it be? He said: Allah says it should be a yellow cow, intensely yellow, pleasing to the observers.',
247: export default function QuranHall() {
248:   const { isAr } = useLanguage();
249:   const [symbolData, setSymbolData] = useState<Record<string, any[]>>({});
250:   const [activeCategory, setActiveCategory] = useState('light');
251:   const [selectedSymbol, setSelectedSymbol] = useState<any | null>(null);
252: 
253:   useEffect(() => {
254:     fetch('/api/artifacts?hall=Quran')
255:       .then(res => res.json())
256:       .then(data => {
257:         const grouped: Record<string, any[]> = {};
258:         data.forEach((item: any) => {
259:            if (!grouped[item.category]) grouped[item.category] = [];
260:            grouped[item.category].push(item);
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
