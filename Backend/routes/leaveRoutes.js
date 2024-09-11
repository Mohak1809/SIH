const express = require('express');
const router = express.Router();
const {
  getAllLeaveRequests,
  getLeaveStatus,
  submitLeaveRequest,
  updateLeaveStatus
} = require("../controllers/leaveContoller");
const { authMiddleware, managerAuthMiddleware } = require('../middlewares/authMiddleware');

// Crew member can submit a leave request
router.post('/leave-request', authMiddleware, submitLeaveRequest);

// Manager can view all pending leave requests
router.get('/leave-requests', authMiddleware, managerAuthMiddleware, getAllLeaveRequests);

// Manager can approve or reject leave requests
router.patch('/leave-status/:id', authMiddleware, managerAuthMiddleware, updateLeaveStatus);

// Crew member can view their leave status
router.get('/leave-status', authMiddleware, getLeaveStatus);

module.exports = router;
