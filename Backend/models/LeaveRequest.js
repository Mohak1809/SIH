const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveRequestSchema = new Schema({
  userId: {
    type: String, 
    required: true
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['Health', 'Emergency', 'Personal'],
  },
  leaveDates: {
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
