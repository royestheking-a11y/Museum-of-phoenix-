require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Artifact = require('./models/Artifact');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  function parseStringArray(content) {
    let arrStr = content.substring(content.indexOf('['));
    // Clean JSX
    arrStr = arrStr.replace(/<([A-Za-z]+)[^>]*\/>/g, '"$1"');
    // Change unquoted keys to quoted
    arrStr = arrStr.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
    arrStr = arrStr.replace(/'/g, '"');
    arrStr = arrStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    try {
      return eval('(' + arrStr + ')');
    } catch(e) {
      console.error('Parse error', e.message);
      return [];
    }
  }

  function parseStringObject(content) {
    let objStr = content.substring(content.indexOf('{'));
    objStr = objStr.replace(/<([A-Za-z]+)[^>]*\/>/g, '"$1"');
    try {
      return eval('(' + objStr + ')');
    } catch(e) {
      console.error('Parse error', e.message);
      return {};
    }
  }

  function extractArray(filePath, varName) {
    const content = fs.readFileSync(filePath, 'utf8');
    const startIdx = content.indexOf(`const ${varName} =`);
    if (startIdx === -1) return [];
    let endIdx = -1;
    let brackets = 0;
    let inArray = false;
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === '[') {
        if (!inArray) inArray = true;
        brackets++;
      } else if (content[i] === ']') {
        brackets--;
        if (inArray && brackets === 0) {
          endIdx = i;
          break;
        }
      }
    }
    if (endIdx === -1) return [];
    
    let arrStr = content.substring(content.indexOf('[', startIdx), endIdx + 1);
    arrStr = arrStr.replace(/<([A-Za-z]+)[^>]*\/>/g, '"$1"');
    try {
      return eval('(' + arrStr + ')');
    } catch(e) {
      return [];
    }
  }

  const halls = [];

  // Recovered data
  const manuscripts = parseStringArray(fs.readFileSync('recovery/manuscripts.txt', 'utf8'));
  manuscripts.forEach(m => halls.push({ hall: 'Manuscript', ...m }));

  const mockResults = parseStringArray(fs.readFileSync('recovery/mockResults.txt', 'utf8'));
  mockResults.forEach(m => halls.push({ hall: 'AILab', ...m }));

  const roots = parseStringArray(fs.readFileSync('recovery/roots.txt', 'utf8'));
  roots.forEach(r => halls.push({ hall: 'Semantics', ...r }));

  const cipherHistory = parseStringArray(fs.readFileSync('recovery/cipherHistory.txt', 'utf8'));
  cipherHistory.forEach(c => halls.push({ hall: 'Cryptography', ...c }));

  const symbolData = parseStringObject(fs.readFileSync('recovery/symbolData.txt', 'utf8'));
  Object.keys(symbolData).forEach(cat => {
    symbolData[cat].forEach(s => halls.push({ hall: 'QuranSymbol', categoryName: cat, ...s }));
  });

  // Data from actual files
  const categories = extractArray('../src/app/components/halls/QuranHall.tsx', 'categories');
  categories.forEach(c => halls.push({ hall: 'QuranCategory', ...c }));

  const symbols = extractArray('../src/app/components/halls/SemioticsHall.tsx', 'symbols');
  symbols.forEach(s => halls.push({ hall: 'Semiotics', ...s, symbolIconName: typeof s.symbol === 'string' ? s.symbol : s.name }));

  const newHalls = ['Manuscript', 'QuranCategory', 'QuranSymbol', 'Semantics', 'Cryptography', 'AILab', 'Semiotics'];
  await Artifact.deleteMany({ hall: { $in: newHalls } });
  
  await Artifact.insertMany(halls);
  console.log(`Seeded ${halls.length} artifacts to MongoDB!`);
  process.exit(0);
}

seed().catch(console.error);
