import mongoose from 'mongoose';
import Artifact from './models/Artifact.js';
import dotenv from 'dotenv';
dotenv.config();

import { artifacts as historyArtifacts, periods as historyPeriods } from '../src/app/components/halls/HistoryHall.tsx';

async function seedHistory() {
  await mongoose.connect(process.env.MONGODB_URI);
  const halls = [];
  historyPeriods.forEach(p => halls.push({ hall: 'HistoryPeriod', ...p }));
  historyArtifacts.forEach(a => halls.push({ hall: 'HistoryArtifact', ...a }));

  const newHalls = ['HistoryPeriod', 'HistoryArtifact'];
  await Artifact.deleteMany({ hall: { $in: newHalls } });
  
  await Artifact.insertMany(halls);
  console.log(`Seeded ${halls.length} History artifacts to MongoDB!`);
  process.exit(0);
}

seedHistory().catch(console.error);
