const mongoose = require('mongoose');

const assigneddbSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  userId: {
    type: String, 
    required: true,
  },
  crewRole: {
    type: String,
    required: true,
  },
  busNumber: {
    type: String,
    required: true,
  },
  routeId: {
    type: Number, 
    required: true,
  },
  routeShortName: {
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
  distance: {
    type: Number,
    required: true,
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  expectedTime: {
    type: Number,
    required: true,
  }
});

// Create the assigneddb model
const AssignedDB = mongoose.model('AssignedDB', assigneddbSchema);

module.exports = AssignedDB;
