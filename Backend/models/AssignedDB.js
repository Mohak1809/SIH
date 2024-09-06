const mongoose = require('mongoose');

const assigneddbSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  crewRole: {
    type: String,
    required: true,
  },
  // First bus details
  busNumber1: {
    type: String,
    required: true,
  },
  routeId1: {
    type: Number,
    required: true,
  },
  routeShortName1: {
    type: String,
    required: true,
  },
  startPoint1: {
    type: String,
    required: true,
  },
  endPoint1: {
    type: String,
    required: true,
  },
  distance1: {
    type: Number,
    required: true,
  },
  shift1: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true,
  },
  startTime1: {
    type: String,
    required: true,
  },
  expectedTime1: {
    type: Number,
    required: true,
  },
  // Second bus details
  busNumber2: {
    type: String,
    required: true,
  },
  routeId2: {
    type: Number,
    required: true,
  },
  routeShortName2: {
    type: String,
    required: true,
  },
  startPoint2: {
    type: String,
    required: true,
  },
  endPoint2: {
    type: String,
    required: true,
  },
  distance2: {
    type: Number,
    required: true,
  },
  shift2: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true,
  },
  startTime2: {
    type: String,
    required: true,
  },
  expectedTime2: {
    type: Number,
    required: true,
  },
});

// Create the assigneddb model
const AssignedDB = mongoose.model('AssignedDBs', assigneddbSchema);

module.exports = AssignedDB;
