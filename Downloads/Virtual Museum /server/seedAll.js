require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const Course = require('./models/Course');
const Article = require('./models/Article');
const ResearchPaper = require('./models/ResearchPaper');
const TimelineEvent = require('./models/TimelineEvent');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Parse Courses
  const coursesRaw = fs.readFileSync('../src/app/components/CourseDashboard.tsx', 'utf-8');
  const coursesMatch = coursesRaw.match(/const courses = (\[[\s\S]*?\]);\n/);
  if (coursesMatch) {
    // We will use eval to parse the array safely because it contains JS objects, not strict JSON.
    // Replace unquoted keys and single quotes to make it easier, or just eval.
    let code = coursesMatch[1];
    // This is safe since we control the source code.
    const coursesData = eval(code);
    await Course.deleteMany({});
    await Course.insertMany(coursesData);
    console.log(`Seeded ${coursesData.length} courses.`);
  }

  // Parse Articles
  const articlesRaw = fs.readFileSync('../src/app/components/ArticlesPage.tsx', 'utf-8');
  const articlesMatch = articlesRaw.match(/const ARTICLES = (\[[\s\S]*?\]);\n/);
  if (articlesMatch) {
    let code = articlesMatch[1];
    const articlesData = eval(code);
    await Article.deleteMany({});
    await Article.insertMany(articlesData);
    console.log(`Seeded ${articlesData.length} articles.`);
  }

  // Parse Research Papers
  const papersRaw = fs.readFileSync('../src/app/components/ResearchLibrary.tsx', 'utf-8');
  const papersMatch = papersRaw.match(/const papers = (\[[\s\S]*?\]);\n/);
  if (papersMatch) {
    let code = papersMatch[1];
    const papersData = eval(code);
    await ResearchPaper.deleteMany({});
    await ResearchPaper.insertMany(papersData);
    console.log(`Seeded ${papersData.length} research papers.`);
  }

  // Parse Timeline Events
  const timelineRaw = fs.readFileSync('../src/app/components/SymbolTimeline.tsx', 'utf-8');
  const timelineMatch = timelineRaw.match(/const events = (\[[\s\S]*?\]);\n/);
  if (timelineMatch) {
    let code = timelineMatch[1];
    const eventsData = eval(code);
    await TimelineEvent.deleteMany({});
    await TimelineEvent.insertMany(eventsData);
    console.log(`Seeded ${eventsData.length} timeline events.`);
  }

  console.log('Done.');
  process.exit(0);
}

seed().catch(console.error);
