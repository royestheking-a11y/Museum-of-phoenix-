require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Artifact = require('./models/Artifact');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const artifactsRaw = fs.readFileSync('./artifacts_data.json', 'utf-8');
  const artifactsData = JSON.parse(artifactsRaw);
  
  await Artifact.deleteMany({});
  await Artifact.insertMany(artifactsData);
  console.log(`Seeded ${artifactsData.length} artifacts.`);

  console.log('Done.');
  process.exit(0);
}

seed().catch(console.error);
