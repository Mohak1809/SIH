import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveInfo = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [unallotted, setUnallotted] = useState([]); // State for unallotted employees
  const [error, setError] = useState(null);
  const [selectedReplacements, setSelectedReplacements] = useState({}); // State to track selected replacements for each leave request

  useEffect(() => {
    const fetchLeaveData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in to view leave requests.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/leave/leave-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setLeaveData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized - Please log in again.');
        } else {
          setError('Failed to fetch leave data.');
        }
      }
    };

    const fetchUnallotted = async () => {
      try {
        const response = await axios.get('/unallotted.json');
        if (response.headers['content-type'].includes('application/json')) {
          setUnallotted(response.data);
        } else {
          setError('Invalid content type. Expected JSON.');
        }
      } catch (error) {
        setError('Failed to fetch unallotted employees.');
      }
    };

    fetchLeaveData();
    fetchUnallotted(); // Fetch unallotted employees
  }, []);

  // Function to get the CSS class for leave status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600 font-semibold';
      case 'Pending':
        return 'text-orange-500 font-semibold';
      case 'Rejected':
        return 'text-red-600 font-semibold';
      default:
        return '';
    }
  };

  // Handle action (approve/reject) for leave requests
  const handleAction = async (leaveId, action) => {
    try {
      const token = localStorage.getItem('token');
      const replacement = selectedReplacements[leaveId]; // Get selected replacement for the specific leave request

      const response = await axios.post(`http://localhost:5000/api/leave/${leaveId}/${action}`, {
        replacement,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update the leave status in the state after action
      setLeaveData(prevState => prevState.map(leave =>
        leave._id === leaveId ? { ...leave, status: action === 'approve' ? 'Approved' : 'Rejected' } : leave
      ));
    } catch (error) {
      setError(`Failed to ${action} the request.`);
    }
  };

  // Handle the change of selected replacement for a specific leave request
  const handleReplacementChange = (leaveId, value) => {
    setSelectedReplacements(prevState => ({ ...prevState, [leaveId]: value }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-center text-5xl p-8 font-semibold text-green-900">Leave Details</h1>
      {error && <p className="text-red-500">{error}</p>}

      <table className="table-auto w-full mx-auto border-separate border-spacing-0 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#F1F8E8]">
            <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">User Name</th>
            <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">User ID</th>
            <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">Leave Type</th>
            <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">From</th>
            <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">To</th>
            <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">Status</th>
            <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {leaveData.map((leave) => (
            <tr key={leave._id} className="even:bg-[#F1F8E8]">
              <td className="border px-4 py-2 text-center border-gray-200">{leave.userName}</td>
              <td className="border px-4 py-2 text-center border-gray-200">{leave.userId}</td>
              <td className="border px-4 py-2 text-center border-gray-200">{leave.leaveType}</td>
              <td className="border px-4 py-2 text-center border-gray-200">
                {new Date(leave.leaveDates.from).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2 text-center border-gray-200">
                {new Date(leave.leaveDates.to).toLocaleDateString()}
              </td>
              <td className={`border px-4 py-2 text-center border-gray-200 ${getStatusClass(leave.status)}`}>
                {leave.status}
              </td>
              <td className="border px-4 py-2 text-center border-gray-200">
                {leave.status === 'Pending' ? (
                  <div className="flex items-center justify-center gap-2">
                    <select className="border rounded px-2 py-1" defaultValue="">
                      <option value="" disabled>Select Replacement</option>
                      {unallotted.map((emp) => (
                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                      ))}
                    </select>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
                      onClick={() => handleAction(leave._id, 'approve', document.querySelector('select').value)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                      onClick={() => handleAction(leave._id, 'reject')}
                    >
                      Reject
                    </button>
                  </div>
                ) : leave.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveInfo;
