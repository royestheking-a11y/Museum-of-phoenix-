import { Product } from './db';

export interface ParsedAIOrder {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  cityZone: 'inside_dhaka' | 'outside_dhaka' | 'pickup';
  deliveryCharge: number;
  detectedProducts: Array<{
    product: Product;
    qty: number;
  }>;
  notes: string;
  rawText: string;
  confidence: {
    hasName: boolean;
    hasPhone: boolean;
    hasAddress: boolean;
  };
}

/**
 * Normalizes Bengali numerals to English numerals
 */
export function normalizeNumerals(str: string): string {
  const bengaliNumerals: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return str.replace(/[০-৯]/g, (w) => bengaliNumerals[w] || w);
}

/**
 * Intelligent parser that extracts customer name, phone number, delivery address,
 * delivery zone, and product intent from messy social media messages (WhatsApp, FB, SMS).
 */
export function parseAIOrderText(rawInput: string, allProducts: Product[] = []): ParsedAIOrder {
  const text = normalizeNumerals(rawInput || '');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let customerName = '';
  let phone = '';
  let address = '';
  let city = 'Dhaka';
  let cityZone: 'inside_dhaka' | 'outside_dhaka' | 'pickup' = 'inside_dhaka';
  let deliveryCharge = 70;
  const detectedProducts: Array<{ product: Product; qty: number }> = [];
  const noteLines: string[] = [];

  // 1. EXTRACT PHONE NUMBER
  // Match Bangladeshi mobile numbers: 013, 014, 015, 016, 017, 018, 019 with optional +88 / spaces / dashes
  const phoneRegex = /(?:\+?880\s*|0)?1[3-9]\d{2}[-\s]?\d{3}[-\s]?\d{3}/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    // Clean to standard 11-digit 01XXXXXXXXX
    let clean = phoneMatch[0].replace(/[^\d]/g, '');
    if (clean.startsWith('880')) {
      clean = clean.slice(2);
    }
    if (clean.length === 10 && clean.startsWith('1')) {
      clean = '0' + clean;
    }
    if (clean.length === 11 && clean.startsWith('01')) {
      phone = clean;
    }
  }

  // 2. EXTRACT CUSTOMER NAME
  // Check labeled lines first: Name:, Customer:, নাম:, কাস্টমার:
  const nameLabelRegex = /^(?:name|customer|client|recipient|receiver|নাম|কাস্টমার|গ্রাহক|প্রাপক)\s*[:：\-–=]\s*(.+)$/i;
  for (const line of lines) {
    const match = line.match(nameLabelRegex);
    if (match && match[1]) {
      customerName = cleanName(match[1]);
      break;
    }
  }

  // If no labeled name, look at lines that don't contain numbers or address keywords
  if (!customerName) {
    for (const line of lines) {
      // If line contains the phone number, skip
      if (phone && line.includes(phone)) continue;
      if (phoneMatch && line.includes(phoneMatch[0])) continue;

      // If line contains address keywords, skip
      if (isAddressLine(line)) continue;
      if (isProductLine(line)) continue;

      // If line is short and mostly letters (English or Bengali)
      const cleanCandidate = cleanName(line);
      if (cleanCandidate.length >= 2 && cleanCandidate.length <= 40 && !/\d{4,}/.test(cleanCandidate)) {
        customerName = cleanCandidate;
        break;
      }
    }
  }

  // 3. EXTRACT DELIVERY ADDRESS
  // Check labeled address first: Address:, Delivery Address:, ঠিকানা:, এড্রেস:
  const addressLabelRegex = /^(?:address|delivery address|shipping address|location|ঠিকানা|এড্রেস|লোকেশন)\s*[:：\-–=]\s*(.+)$/i;
  const addressParts: string[] = [];
  let foundAddressLabel = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(addressLabelRegex);
    if (match && match[1]) {
      foundAddressLabel = true;
      addressParts.push(match[1].trim());
      // Grab next lines if they look like continuation of address
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];
        if (
          !nextLine.match(phoneRegex) &&
          !nextLine.match(nameLabelRegex) &&
          !isProductLine(nextLine) &&
          (isAddressLine(nextLine) || nextLine.length > 5)
        ) {
          addressParts.push(nextLine.trim());
          i = j;
        } else {
          break;
        }
      }
      break;
    }
  }

  // If no labeled address, gather lines that look like addresses
  if (addressParts.length === 0) {
    for (const line of lines) {
      if (customerName && line.includes(customerName)) continue;
      if (phone && line.includes(phone)) continue;
      if (phoneMatch && line.includes(phoneMatch[0])) continue;
      if (isProductLine(line)) continue;

      if (isAddressLine(line)) {
        addressParts.push(line);
      }
    }
  }

  // Fallback: if we still have lines that are not name, phone, or product
  if (addressParts.length === 0) {
    for (const line of lines) {
      if (customerName && line === customerName) continue;
      if (phone && line.includes(phone)) continue;
      if (isProductLine(line)) continue;
      if (line.length > 8) {
        addressParts.push(line);
      }
    }
  }

  address = addressParts.join(', ').replace(/^[\s,]+|[\s,]+$/g, '');

  // 4. DETECT CITY & DELIVERY ZONE
  const fullTextLower = (address + ' ' + text).toLowerCase();

  // Dhaka metro areas (inside_dhaka zone - 70tk)
  const dhakaKeywords = [
    'dhaka', 'daka',
    // City thanas & areas
    'dhanmondi', 'mirpur', 'uttara', 'gulshan', 'banani', 'mohammadpur',
    'badda', 'bashundhara', 'rampura', 'khilgaon', 'motijheel', 'farmgate',
    'shyamoli', 'wari', 'jatrabari', 'lalbagh', 'azampur', 'nikunja',
    'moghbazar', 'malibagh', 'kakrail', 'tejgaon', 'mohakhali', 'paltan',
    'shahbag', 'azimpur', 'kafrul', 'demra', 'kotwali', 'sutrapur',
    'hazaribagh', 'kamrangirchar', 'shyampur', 'sabujbagh', 'khilkhet',
    'vatara', 'airport', 'turag', 'cantonment', 'adabor', 'panthapath',
    'kalabagan', 'newmarket', 'chawkbazar', 'keraniganj', 'dohar', 'savar',
    // Bengali
    'ঢাকা', 'ধানমন্ডি', 'মিরপুর', 'উত্তরা', 'গুলশান', 'বনানী',
    'মোহাম্মদপুর', 'বাড্ডা', 'বসুন্ধরা', 'রামপুরা', 'খিলগাঁও', 'মতিঝিল',
    'ফার্মগেট', 'শ্যামলী', 'ওয়ারী', 'যাত্রাবাড়ী', 'লালবাগ', 'আজমপুর',
    'নিকুঞ্জ', 'মগবাজার', 'মালিবাগ', 'কাকরাইল', 'তেজগাঁও', 'মহাখালী',
    'পল্টন', 'শাহবাগ', 'আজিমপুর', 'নিউমার্কেট', 'কেরানীগঞ্জ', 'সাভার',
  ];

  // All 64 Bangladesh districts by division (outside_dhaka zone - 130tk)

  // Dhaka Division (non-metro)
  const dhakaDivDistricts = [
    'gazipur', 'narayanganj', 'tangail', 'manikganj', 'munshiganj',
    'narsingdi', 'kishoreganj', 'faridpur', 'rajbari', 'shariatpur',
    'madaripur', 'gopalganj',
    'গাজীপুর', 'নারায়ণগঞ্জ', 'টাঙ্গাইল', 'মানিকগঞ্জ', 'মুন্সিগঞ্জ', 'মুন্সীগঞ্জ',
    'নরসিংদী', 'কিশোরগঞ্জ', 'ফরিদপুর', 'রাজবাড়ী', 'শরীয়তপুর',
    'মাদারীপুর', 'গোপালগঞ্জ',
  ];

  // Chittagong / Chattogram Division (11 districts)
  const ctgDivDistricts = [
    'chittagong', 'chattogram', 'ctg',
    'coxsbazar', 'cox bazar', "cox's bazar",
    'rangamati', 'khagrachhari', 'bandarban',
    'cumilla', 'comilla', 'brahmanbaria', 'bbaria', 'chandpur',
    'lakshmipur', 'noakhali', 'feni',
    'চট্টগ্রাম', 'কক্সবাজার', 'রাঙামাটি', 'রাঙ্গামাটি', 'খাগড়াছড়ি',
    'বান্দরবান', 'কুমিল্লা', 'ব্রাহ্মণবাড়িয়া', 'বিবাড়িয়া', 'বি-বাড়িয়া', 'চাঁদপুর',
    'লক্ষ্মীপুর', 'নোয়াখালী', 'ফেনী',
  ];

  // Rajshahi Division (8 districts)
  const rajshahiDivDistricts = [
    'rajshahi', 'chapainawabganj', 'chapai nawabganj', 'natore',
    'naogaon', 'pabna', 'sirajganj', 'bogra', 'bogura', 'joypurhat',
    'রাজশাহী', 'চাঁপাইনবাবগঞ্জ', 'নাটোর', 'নওগাঁ',
    'পাবনা', 'সিরাজগঞ্জ', 'বগুড়া', 'জয়পুরহাট',
  ];

  // Khulna Division (10 districts)
  const khulnaDivDistricts = [
    'khulna', 'jessore', 'jashore', 'satkhira', 'bagerhat',
    'narail', 'magura', 'jhenaidah', 'kushtia', 'chuadanga', 'meherpur',
    'খুলনা', 'যশোর', 'সাতক্ষীরা', 'বাগেরহাট',
    'নড়াইল', 'মাগুরা', 'ঝিনাইদহ', 'কুষ্টিয়া', 'চুয়াডাঙ্গা', 'মেহেরপুর',
  ];

  // Barisal / Barishal Division (6 districts)
  const barisalDivDistricts = [
    'barisal', 'barishal', 'bhola', 'patuakhali',
    'pirojpur', 'jhalokati', 'barguna',
    'বরিশাল', 'ভোলা', 'পটুয়াখালী', 'পিরোজপুর', 'ঝালকাঠি', 'বরগুনা',
  ];

  // Sylhet Division (4 districts)
  const sylhetDivDistricts = [
    'sylhet', 'moulvibazar', 'moulvi bazar', 'habiganj', 'sunamganj',
    'সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ',
  ];

  // Rangpur Division (8 districts)
  const rangpurDivDistricts = [
    'rangpur', 'dinajpur', 'thakurgaon', 'panchagarh',
    'nilphamari', 'lalmonirhat', 'gaibandha', 'kurigram',
    'রংপুর', 'দিনাজপুর', 'ঠাকুরগাঁও', 'পঞ্চগড়',
    'নীলফামারী', 'লালমনিরহাট', 'গাইবান্ধা', 'কুড়িগ্রাম',
  ];

  // Mymensingh Division (4 districts)
  const mymensinghDivDistricts = [
    'mymensingh', 'sherpur', 'jamalpur', 'netrokona',
    'ময়মনসিংহ', 'শেরপুর', 'জামালপুর', 'নেত্রকোণা', 'নেত্রকোনা',
  ];

  const outsideDhakaKeywords = [
    ...dhakaDivDistricts,
    ...ctgDivDistricts,
    ...rajshahiDivDistricts,
    ...khulnaDivDistricts,
    ...barisalDivDistricts,
    ...sylhetDivDistricts,
    ...rangpurDivDistricts,
    ...mymensinghDivDistricts,
    'outside dhaka', 'outside', 'ঢাকার বাইরে',
  ];

  // Outside wins unless a Dhaka metro keyword is also present
  const hasDhaka = dhakaKeywords.some(k => fullTextLower.includes(k.toLowerCase()));
  const hasOutside = outsideDhakaKeywords.some(k => fullTextLower.includes(k.toLowerCase()));

  if (hasOutside && !hasDhaka) {
    cityZone = 'outside_dhaka';
    deliveryCharge = 130;
    const foundOut = outsideDhakaKeywords.find(
      k => /^[a-zA-Z]/.test(k) && fullTextLower.includes(k.toLowerCase())
    );
    city = foundOut
      ? foundOut.charAt(0).toUpperCase() + foundOut.slice(1)
      : 'Outside Dhaka';
  } else {
    cityZone = 'inside_dhaka';
    deliveryCharge = 70;
    city = 'Dhaka';
  }

  // 5. DETECT PRODUCTS & CONE SIZES
  if (allProducts && allProducts.length > 0) {
    for (const prod of allProducts) {
      const prodNameLower = prod.name.toLowerCase();
      // Keywords for cone sizes
      let matchedQty = 0;

      // Extract variations like "20gm", "25gm", "30gm", "bridal", "gift"
      const sizeMatches = prodNameLower.match(/(\d+)\s*(?:gm|g|gram)/);
      const sizeTag = sizeMatches ? sizeMatches[1] : '';

      // Check lines for this product
      for (const line of lines) {
        const lineLower = line.toLowerCase();
        let isMatch = false;

        if (sizeTag && (lineLower.includes(`${sizeTag}gm`) || lineLower.includes(`${sizeTag} gm`) || lineLower.includes(`${sizeTag}g`))) {
          isMatch = true;
        } else if (prodNameLower.includes('bridal') && (lineLower.includes('bridal') || lineLower.includes('ব্রাইডাল'))) {
          isMatch = true;
        } else if (prodNameLower.includes('gift') && (lineLower.includes('gift') || lineLower.includes('pack'))) {
          isMatch = true;
        }

        if (isMatch) {
          // Look for quantity like: "5 pcs", "5টা", "5 ta", "5 cones", "x 5", "5pc"
          const qtyMatch = lineLower.match(/(\d+)\s*(?:pcs?|ta|টা|cones?|packs?|piece|টি)?/) || lineLower.match(/x\s*(\d+)/);
          if (qtyMatch && parseInt(qtyMatch[1], 10) > 0 && parseInt(qtyMatch[1], 10) !== parseInt(sizeTag || '0', 10)) {
            matchedQty = parseInt(qtyMatch[1], 10);
          } else {
            // Default 1 if matched
            matchedQty = matchedQty || 2;
          }
        }
      }

      if (matchedQty > 0) {
        detectedProducts.push({
          product: prod,
          qty: matchedQty
        });
      }
    }
  }

  // 6. DETECT SPECIAL NOTES
  for (const line of lines) {
    const l = line.toLowerCase();
    if (l.includes('urgent') || l.includes('জরুরি') || l.includes('call') || l.includes('কল') || l.includes('friday') || l.includes('কালকে') || l.includes('today')) {
      noteLines.push(line);
    }
  }

  return {
    customerName,
    phone,
    address,
    city,
    cityZone,
    deliveryCharge,
    detectedProducts,
    notes: noteLines.join(' · '),
    rawText: rawInput,
    confidence: {
      hasName: Boolean(customerName),
      hasPhone: Boolean(phone && phone.length === 11),
      hasAddress: Boolean(address && address.length > 5)
    }
  };
}

function cleanName(raw: string): string {
  return raw
    .replace(/^(?:hi|hello|hey|assalamu\s*alaikum|salam|ভাইয়া|আপু|ভাই|apu|bhaiya|bhai)\s*[,:!\-]?\s*/i, '')
    .replace(/[^\w\s\u0980-\u09FF.'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isAddressLine(line: string): boolean {
  const l = line.toLowerCase();
  const addressKeywords = [
    'house', 'road', 'flat', 'block', 'sector', 'holding', 'lane', 'avenue',
    'thana', 'district', 'post', 'area', 'floor', 'building', 'bhaban',
    'বাড়ি', 'রোড', 'ফ্ল্যাট', 'ব্লক', 'সেক্টর', 'থানা', 'জেলা', 'মহল্লা',
    'dhaka', 'chittagong', 'sylhet', 'mirpur', 'dhanmondi', 'uttara', 'gulshan', 'banani',
    'বাসা', 'গ্রাম', 'ডাকঘর'
  ];
  return addressKeywords.some(k => l.includes(k));
}

function isProductLine(line: string): boolean {
  const l = line.toLowerCase();
  const prodKeywords = [
    'cone', 'কোন', '20gm', '25gm', '30gm', 'bridal', 'ব্রাইডাল',
    'pcs', 'piece', 'ta', 'টা', 'pack', 'প্যাক', 'powder', 'mehendi'
  ];
  return prodKeywords.some(k => l.includes(k));
}
