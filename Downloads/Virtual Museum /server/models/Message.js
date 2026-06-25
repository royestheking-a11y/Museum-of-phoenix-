const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  subject: String,
  message: String,
  timestamp: String,
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' }
});

module.exports = mongoose.model('Message', MessageSchema);
