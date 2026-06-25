require('dotenv').config();
const mongoose = require('mongoose');

const Artifact = require('./models/Artifact');
const Message = require('./models/Message');
const Payment = require('./models/Payment');
const User = require('./models/User');
const Course = require('./models/Course');
const Article = require('./models/Article');
const ResearchPaper = require('./models/ResearchPaper');
const TimelineEvent = require('./models/TimelineEvent');

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const artifactCount = await Artifact.countDocuments();
  const messageCount = await Message.countDocuments();
  const paymentCount = await Payment.countDocuments();
  const userCount = await User.countDocuments();
  const courseCount = await Course.countDocuments();
  const articleCount = await Article.countDocuments();
  const researchCount = await ResearchPaper.countDocuments();
  const timelineCount = await TimelineEvent.countDocuments();

  console.log(`Artifacts: ${artifactCount}`);
  console.log(`Messages: ${messageCount}`);
  console.log(`Payments: ${paymentCount}`);
  console.log(`Users: ${userCount}`);
  console.log(`Courses: ${courseCount}`);
  console.log(`Articles: ${articleCount}`);
  console.log(`Research Papers: ${researchCount}`);
  console.log(`Timeline Events: ${timelineCount}`);

  process.exit(0);
}

verify().catch(console.error);
