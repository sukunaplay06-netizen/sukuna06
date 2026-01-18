// models/Commission.js
const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  amount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model('Commission', commissionSchema);
