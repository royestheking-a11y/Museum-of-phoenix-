const mongoose = require('mongoose');

const ResearchPaperSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  type: { type: String, enum: ['paper', 'journal', 'book'] },
  title: String,
  arabic: String,
  author: String,
  authorAr: String,
  affiliation: String,
  affiliationAr: String,
  year: Number,
  readTime: String,
  readTimeAr: String,
  tags: [String],
  tagsAr: [String],
  abstract: String,
  abstractAr: String,
  downloads: Number,
  access: String,
  accessAr: String
});

module.exports = mongoose.model('ResearchPaper', ResearchPaperSchema);
