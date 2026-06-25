const mongoose = require('mongoose');

const SymbolSchema = new mongoose.Schema({
  name: String,
  arabic: String,
  meaning: String,
  meaningAr: String,
  region: String,
  regionAr: String,
  year: String,
  yearAr: String,
  visual: String,
  detail: String,
  detailAr: String
});

const TimelineEventSchema = new mongoose.Schema({
  id: String,
  label: String,
  labelAr: String,
  range: String,
  color: String,
  bg: String,
  description: String,
  descriptionAr: String,
  symbols: [SymbolSchema]
});

module.exports = mongoose.model('TimelineEvent', TimelineEventSchema);
