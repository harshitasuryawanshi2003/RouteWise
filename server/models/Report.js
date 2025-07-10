const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  binId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bin',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    default: "Bin reported full or problematic"
  },
  status: {
    type: String,
    enum: ['Open','In progress','Resolved'],
    default: 'Open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
