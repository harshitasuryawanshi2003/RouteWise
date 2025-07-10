const mongoose = require('mongoose');

const edgeSchema = new mongoose.Schema({
  from:{
     type: String, 
     required: true 
  }, // Node name
  to: { 
    type: String, 
    required: true
  },   // Node name
  distance: { 
    type: Number, 
    required: true 
  }, // in meters
  lastFetchedAt: {
    type: Date,
    default: Date.now
  }
});

edgeSchema.index({ from: 1, to: 1 }, { unique: true }); // Prevent duplicate edge pair

module.exports = mongoose.model('Edge', edgeSchema);
