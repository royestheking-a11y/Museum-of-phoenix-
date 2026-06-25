const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  id: String,
  submittedAt: String,
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
  plan: String,
  planAr: String,
  price: Number,
  billing: String,
  cardholderName: String,
  cardNumberMasked: String,
  cardNumberLast4: String,
  expiry: String,
  cvv: String,
  paymentType: String,
  email: String,
  adminNote: String,
  confirmedAt: String,
  rejectedAt: String
});

module.exports = mongoose.model('Payment', PaymentSchema);
