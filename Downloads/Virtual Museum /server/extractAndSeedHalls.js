require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Artifact = require('./models/Artifact');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  function extractArray(filePath, varName) {
    const content = fs.readFileSync(filePath, 'utf8');
    const startIdx = content.indexOf(`const ${varName} =`);
    if (startIdx === -1) return null;
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
    if (endIdx === -1) return null;
    
    let arrStr = content.substring(content.indexOf('[', startIdx), endIdx + 1);
    // clean JSX elements e.g., <Icon ... /> to "Icon"
    arrStr = arrStr.replace(/<([A-Za-z]+)[^>]*\/>/g, '"$1"');
    arrStr = arrStr.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
    arrStr = arrStr.replace(/'/g, '"');
    arrStr = arrStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    try {
      return eval('(' + arrStr + ')');
    } catch(e) {
      console.error(`Failed to parse ${varName} in ${filePath}`);
      return null;
    }
  }

  function extractObject(filePath, varName) {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(new RegExp(`const ${varName}[^=]*= ({[\\s\\S]*?});\\n`));
    if (!match) return null;
    let objStr = match[1];
    // This is hard to parse safely with Regex.
    // Instead we can use a simpler approach for QuranHall symbolData:
    objStr = objStr.replace(/<([A-Za-z]+)[^>]*\/>/g, '"$1"');
    try {
      return eval('(' + objStr + ')');
    } catch(e) {
      console.error(`Failed to parse ${varName} in ${filePath}`);
      return null;
    }
  }

  const halls = [];

  // Manuscript
  const manuscripts = extractArray('../src/app/components/halls/ManuscriptHall.tsx', 'manuscripts');
  if (manuscripts) {
    manuscripts.forEach(m => halls.push({ hall: 'Manuscript', ...m }));
  }

  // Quran
  const categories = extractArray('../src/app/components/halls/QuranHall.tsx', 'categories');
  if (categories) {
    categories.forEach(c => halls.push({ hall: 'QuranCategory', ...c }));
  }
  const symbolData = extractObject('../src/app/components/halls/QuranHall.tsx', 'symbolData');
  if (symbolData) {
    Object.keys(symbolData).forEach(cat => {
      symbolData[cat].forEach(s => halls.push({ hall: 'QuranSymbol', categoryName: cat, ...s }));
    });
  }

  // Semantics
  const roots = extractArray('../src/app/components/halls/SemanticsHall.tsx', 'roots');
  if (roots) {
    roots.forEach(r => halls.push({ hall: 'Semantics', ...r }));
  }

  // Cryptography
  const cipherHistory = extractArray('../src/app/components/halls/CryptographyHall.tsx', 'cipherHistory');
  if (cipherHistory) {
    cipherHistory.forEach(c => halls.push({ hall: 'Cryptography', ...c }));
  }

  // AILab
  const mockResults = extractArray('../src/app/components/halls/AILabHall.tsx', 'mockResults');
  if (mockResults) {
    mockResults.forEach(r => halls.push({ hall: 'AILab', ...r }));
  }

  // Semiotics
  const symbols = extractArray('../src/app/components/halls/SemioticsHall.tsx', 'symbols');
  if (symbols) {
    symbols.forEach(s => {
      halls.push({ hall: 'Semiotics', ...s, symbolIcon: s.symbol }); // s.symbol is now a string like "Moon"
    });
  }

  // Before inserting, we shouldn't delete History artifacts. Let's just delete the new halls.
  const newHalls = ['Manuscript', 'QuranCategory', 'QuranSymbol', 'Semantics', 'Cryptography', 'AILab', 'Semiotics'];
  await Artifact.deleteMany({ hall: { $in: newHalls } });
  
  await Artifact.insertMany(halls);
  console.log(`Seeded ${halls.length} new artifacts across the 6 halls!`);

  console.log('Done.');
  process.exit(0);
}

seed().catch(console.error);
