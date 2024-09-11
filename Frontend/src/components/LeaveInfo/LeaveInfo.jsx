import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveInfo = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState(null); // Add an error state

  useEffect(() => {
    const fetchLeaveData = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        setError('You must be logged in to view leave requests.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/leave/leave-requests', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request header
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

    fetchLeaveData();
  }, []);
  return (
    <div className="overflow-x-auto">
        <h1 className="text-center text-5xl p-8 font-semibold text-green-900">Leave Details</h1>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-center font-bold">User Name</th>
            <th className="px-4 py-2 border text-center font-bold">User ID</th>
            <th className="px-4 py-2 border text-center font-bold">Leave Type</th>
            <th className="px-4 py-2 border text-center font-bold">From</th>
            <th className="px-4 py-2 border text-center font-bold">To</th>
            <th className="px-4 py-2 border text-center font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveData.map((leave) => (
            <tr key={leave._id}>
              <td className="px-4 py-2 border text-center">{leave.userId}</td>
              <td className="px-4 py-2 border text-center">{leave.userId}</td>
              <td className="px-4 py-2 border text-center">{leave.leaveType}</td>
              <td className="px-4 py-2 border text-center">
                {new Date(leave.leaveDates.from).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border text-center">
                {new Date(leave.leaveDates.to).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border text-center">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveInfo;
