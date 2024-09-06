const mongoose = require('mongoose');

// Define the bus schema
const busSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

// Define the route schema with the new expectedTime field
const routeSchema = new mongoose.Schema({
  routeID: {
    type: Number,
    required: true,
    unique: true,
  },
  agencyID: {
    type: String,
    required: true,
  },
  routeShortName: {
    type: Number,
    required: true,
  },
  routeDesc: {
    type: String,
    required: true,
  },
  startPoint: {
    type: String,
    required: true,
  },
  endPoint: {
    type: String,
    required: true,
  },
  routeDifficulty: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  startLatitude:{
    type:Number,
    required: true,
  },
  startLongitude:{
    type:Number,
    required: true,
  },
  expectedTime: { // New field added here
    type: Number,
    required: true,
  },
  busNumbers: [busSchema],
});

// Create the model
const BusRoute = mongoose.model('BusRoute', routeSchema);

module.exports = BusRoute;
