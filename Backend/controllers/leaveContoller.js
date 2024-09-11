const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// Fetch all leave requests for managers to view
const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ status: 'Pending' });
    // You might need to manually populate user data based on userId
    const users = await User.find({ id: { $in: leaveRequests.map(req => req.userId) } });
    const userMap = new Map(users.map(user => [user.id, user.name]));

    const leaveRequestsWithUserNames = leaveRequests.map(request => ({
      ...request.toObject(),
      userName: userMap.get(request.userId)
    }));

    res.status(200).json(leaveRequestsWithUserNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Submit a leave request from a crew member
const submitLeaveRequest = async (req, res) => {
  const { leaveType, fromDate, toDate } = req.body;
  console.log("request user is ",req.user);
  const userId = req.user[0].id; 
  

  try {
    const leaveRequest = new LeaveRequest({
      userId,
      leaveType,
      leaveDates: {
        from: new Date(fromDate),
        to: new Date(toDate)
      }
    });

    await leaveRequest.save();
    res.status(201).json({ message: 'Leave request submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update leave request status (approved or rejected)
const updateLeaveStatus = async (req, res) => {
  const { status, leaveRequestIds } = req.body; // Expect an array of leave request IDs
  const validStatuses = ['Pending', 'Approved', 'Rejected'];

  // Ensure status is valid
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  // Ensure leaveRequestIds is an array and not empty
  if (!Array.isArray(leaveRequestIds) || leaveRequestIds.length === 0) {
    return res.status(400).json({ message: 'No leave request IDs provided' });
  }

  try {
    // Update the status for each leave request
    const leaveRequests = await LeaveRequest.find({ _id: { $in: leaveRequestIds } });

    if (leaveRequests.length === 0) {
      return res.status(404).json({ message: 'No leave requests found for the provided IDs' });
    }

    // Update status for each leave request found
    for (let leaveRequest of leaveRequests) {
      leaveRequest.status = status;
      await leaveRequest.save();
    }

    console.log(`Updated leave requests: \n${JSON.stringify(leaveRequests)}`);

    res.status(200).json({ message: `Leave requests updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
};

// Fetch current user's leave status
const getLeaveStatus = async (req, res) => {
  const userId = req.user[0].id; // Extract userId from req.user

  try {
    // Find all leave requests for the specified user
    const leaveRequests = await LeaveRequest.find({ userId });
    
    if (leaveRequests.length === 0) {
      return res.status(200).json({ message: 'No leave requests found' });
    }

    // Return all leave requests for the user
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exporting the functions using module.exports
module.exports = {
  getAllLeaveRequests,
  submitLeaveRequest,
  updateLeaveStatus,
  getLeaveStatus,
};
