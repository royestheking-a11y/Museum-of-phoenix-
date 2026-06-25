require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const TimelineEvent = require('./models/TimelineEvent');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const timelineRaw = fs.readFileSync('../src/app/components/SymbolTimeline.tsx', 'utf-8');
  const timelineMatch = timelineRaw.match(/const periods = (\[[\s\S]*?\]);\n/);
  if (timelineMatch) {
    let code = timelineMatch[1];
    const eventsData = eval(code);
    await TimelineEvent.deleteMany({});
    await TimelineEvent.insertMany(eventsData);
    console.log(`Seeded ${eventsData.length} timeline periods.`);
  }

  console.log('Done.');
  process.exit(0);
}

seed().catch(console.error);
