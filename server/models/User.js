const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  role: {
    type: String,
    enum: ['Admin', 'Collector', 'Citizen'],
    default: 'citizen',
    required: true
  },

  token: {
        type:String,
  },

  phone: {
    type: String,
    trim: true
  },

  address: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('User', userSchema);
