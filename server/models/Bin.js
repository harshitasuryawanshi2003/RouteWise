const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
    // id: {
    //   type: String,
    //   required: true,
    //   // unique: true,
    // },
    location: {
      name: { type: String, required: true },    
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    node: {
      type: String, 
      required: true,
      unique: true,
    },
    fill: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    type: {
      type: String,
      enum: ['depot','residential', 'school', 'hospital', 'commercial', 'office', 'public'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    lastEmptiedAt: {
      type: Date,
    }
});

module.exports = mongoose.model('Bin', binSchema);
