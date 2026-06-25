import mongoose from 'mongoose';
import Artifact from './models/Artifact.js';
import dotenv from 'dotenv';
dotenv.config();

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI);
  const halls = ['HistoryPeriod', 'HistoryArtifact', 'Semantics', 'Cryptography', 'Manuscript', 'QuranCategory', 'QuranSymbol', 'Semiotics', 'AILab'];
  
  console.log("=== MongoDB Data Verification ===");
  for (const h of halls) {
    const count = await Artifact.countDocuments({ hall: h });
    console.log(`${h}: ${count} items`);
  }
  
  const allCount = await Artifact.countDocuments();
  console.log(`\nTotal items in DB: ${allCount}`);
  
  process.exit(0);
}
verify().catch(console.error);
