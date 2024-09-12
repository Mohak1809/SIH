import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveStatus = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveStatus = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        setError('You must be logged in to view your leave status.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/leave/leave-status', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the Authorization header
          },
        });

        if (response.data.message) {
          setError(response.data.message); // Handle "No leave requests found" message
        } else {
          setLeaveRequests(response.data); // Set the fetched leave requests
        }
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch leave status.');
        setLoading(false);
      }
    };

    fetchLeaveStatus();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-5">
      <h1 className="text-center text-5xl p-8 font-semibold text-green-900">Your Leave Status</h1>
      
      {leaveRequests.length === 0 ? (
        <p className="text-center text-xl">No leave requests found.</p>
      ) : (
        <table className="table-auto w-full mx-auto border-separate border-spacing-0 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#F1F8E8]">
              <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">Leave Type</th>
              <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">From</th>
              <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">To</th>
              <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white m-4">
            {leaveRequests.map((leave) => (
              <tr key={leave._id} className="even:bg-[#F1F8E8]">
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Function to conditionally set the color of the status based on approval status
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

export default LeaveStatus;
