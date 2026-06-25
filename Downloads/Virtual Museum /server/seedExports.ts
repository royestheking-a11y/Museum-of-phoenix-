import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Artifact from './models/Artifact.js';

import { manuscripts } from '../src/app/components/halls/ManuscriptHall.tsx';
import { categories, symbolData } from '../src/app/components/halls/QuranHall.tsx';
import { roots } from '../src/app/components/halls/SemanticsHall.tsx';
import { cipherHistory } from '../src/app/components/halls/CryptographyHall.tsx';
import { mockResults } from '../src/app/components/halls/AILabHall.tsx';
import { symbols } from '../src/app/components/halls/SemioticsHall.tsx';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || '');
  console.log('Connected to MongoDB');

  const halls = [];

  manuscripts.forEach(m => halls.push({ hall: 'Manuscript', ...m }));
  
  categories.forEach(c => halls.push({ hall: 'QuranCategory', ...c }));
  
  Object.keys(symbolData).forEach(cat => {
    symbolData[cat].forEach(s => halls.push({ hall: 'QuranSymbol', categoryName: cat, ...s }));
  });

  roots.forEach(r => halls.push({ hall: 'Semantics', ...r }));

  cipherHistory.forEach(c => halls.push({ hall: 'Cryptography', ...c }));

  mockResults.forEach(r => halls.push({ hall: 'AILab', ...r }));

  // For semiotics, the symbol property contains JSX objects which cannot be saved to MongoDB directly.
  // We will stringify the name to use as a reference.
  symbols.forEach(s => {
    const { symbol, ...rest } = s;
    halls.push({ hall: 'Semiotics', ...rest, symbolIconName: s.name });
  });

  const newHalls = ['Manuscript', 'QuranCategory', 'QuranSymbol', 'Semantics', 'Cryptography', 'AILab', 'Semiotics'];
  await Artifact.deleteMany({ hall: { $in: newHalls } });
  
  for (const item of halls) {
    try {
      await Artifact.create(item);
    } catch (e) {
      console.error('Failed on item:', JSON.stringify(item));
      console.error(e.message);
      process.exit(1);
    }
  }

  console.log(`Seeded ${halls.length} new artifacts across the 6 halls!`);
  console.log('Done.');
  process.exit(0);
}

seed().catch(console.error);
