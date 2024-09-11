import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveInfo = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(15);

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
            'Authorization': `Bearer ${token}`,
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

  if (leaveData.length === 0 && !error) return <p>Loading...</p>;

  return (
    <div className=" px-4 sm:px-6 lg:px-8">
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
              <td className="border px-4 py-2 text-center border-gray-200">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveInfo;
