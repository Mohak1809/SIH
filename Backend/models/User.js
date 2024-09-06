const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  id: { type: String, required: true, trim: true },
  password: { type: String, required: true , minlength: 4},
  phoneNumber: { type: String, required: true,},
  email: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true ,enum: ['male', 'female' ,'other']},
  address: { type: String, required: true ,trim: true},
  role: { type: String, enum:['manager', 'crew'], required: true }, // Manager or Crew

  // Crew-specific fields
  crewRole: { type: String, required: function() { return this.role === 'Crew'; } }, // Conductor/Driver
  experience: { type: Number, required: function() { return this.role === 'Crew'; } },
  skillLevel: {
    type: String,
    enum: ['Urban', 'Busy routes', 'Suburban', 'Rural', 'Highway'],
    required: function() { return this.role === 'Crew'; }
  },
  latitude:{
    type:Number,
  },
  longitude:{
    type:Number,
  },
  timingPreferences: { type: String, required: function() { return this.role === 'Crew'; } },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
