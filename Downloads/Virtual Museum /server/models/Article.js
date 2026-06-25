const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  category: String,
  categoryAr: String,
  readTime: String,
  readTimeAr: String,
  date: String,
  dateAr: String,
  featured: Boolean,
  title: String,
  arabic: String,
  author: String,
  authorAr: String,
  authorTitle: String,
  authorTitleAr: String,
  excerpt: String,
  excerptAr: String,
  image: String,
  views: Number,
  likes: Number,
  content: String
});

module.exports = mongoose.model('Article', ArticleSchema);
