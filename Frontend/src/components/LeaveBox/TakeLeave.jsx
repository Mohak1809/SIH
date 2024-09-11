import React, { useState } from 'react';
import axios from 'axios';

const TakeLeave = ({ show, onClose }) => {
  const [leaveData, setLeaveData] = useState({
    from: '',
    to: '',
    reason: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLeaveData({
      ...leaveData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage('');
    setIsSubmitting(true); // Start loading

    const token = localStorage.getItem('token'); // Assuming you store your token in localStorage

    if (!token) {
      setError('You must be logged in to submit a leave request.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/leave/leave-request',
        {
          leaveType: leaveData.reason,
          fromDate: leaveData.from,
          toDate: leaveData.to,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Adding Authorization header
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccessMessage('Leave request submitted successfully!');
      // Clear the form fields
      setLeaveData({ from: '', to: '', reason: '' });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Unauthorized - Please log in again.');
      } else {
        setError('Failed to submit leave request.');
      }
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  if (!show) return null; // Don't render the component if `show` is false

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Take a Leave</h2>
        {successMessage && (
          <p className="text-green-500 mb-4">{successMessage}</p>
        )}
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">From</label>
            <input
              type="date"
              name="from"
              value={leaveData.from}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">To</label>
            <input
              type="date"
              name="to"
              value={leaveData.to}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <select
              name="reason"
              value={leaveData.reason}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select the Reason</option>
              <option value="Health">Health</option>
              <option value="Personal">Personal</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white ${
                isSubmitting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeLeave;
