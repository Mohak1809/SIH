import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import config from '../config';

const AddBus = () => {
  const [formData, setFormData] = useState({
    routeID: '',
    agencyID: '',
    routeShortName: '',
    routeDesc: '',
    startPoint: '',
    endPoint: '',
    routeDifficulty: '',
    distance: '',
    expectedTime: '', // New field for expected time
    busNumber: '',
    shift: '',
    time: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { routeID, agencyID, routeShortName, routeDesc, startPoint, endPoint, routeDifficulty, distance, expectedTime, busNumber, shift, time } = formData;
    
    if (!routeID || !agencyID || !routeShortName || !routeDesc || !startPoint || !endPoint || !routeDifficulty || !distance || !expectedTime || !busNumber || !shift || !time) {
      alert('All fields are required');
      return;
    }

    try {
      const response = await axios.post(`${config.apiUrl}/bus/add`, {
        routeID,
        agencyID,
        routeShortName,
        routeDesc,
        startPoint,
        endPoint,
        routeDifficulty,
        distance,
        expectedTime,
        busNumbers: [
          {
            number: busNumber,
            shift,
            time,
          },
        ],
      });

      console.log('Bus added successfully:', response.data);
      alert('Bus added successfully!');
      navigate('/bus-list'); // Change this to your desired route after adding the bus
    } catch (error) {
      console.error('Error adding bus:', error);
      alert('Failed to add bus: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-[url('AddBus_bg.png')] bg-cover bg-center text-gray-900 flex justify-center">
      <div className="max-w-screen-md m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold text-[#55AD9B]">Add New Bus</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xl"> {/* Increased max width of the form container */}
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <input
                    type="text"
                    name="routeID"
                    placeholder="Route ID"
                    value={formData.routeID}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white"
                    required
                  />
                  <input
                    type="text"
                    name="agencyID"
                    placeholder="Agency ID"
                    value={formData.agencyID}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <input
                    type="text"
                    name="routeShortName"
                    placeholder="Route Short Name"
                    value={formData.routeShortName}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <input
                    type="text"
                    name="routeDesc"
                    placeholder="Route Description"
                    value={formData.routeDesc}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <input
                    type="text"
                    name="startPoint"
                    placeholder="Start Point"
                    value={formData.startPoint}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <input
                    type="text"
                    name="endPoint"
                    placeholder="End Point"
                    value={formData.endPoint}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <input
                    type="number"
                    name="routeDifficulty"
                    min="0"
                    max="10"
                    placeholder="Route Difficulty (0-10)"
                    value={formData.routeDifficulty}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <input
                    type="number"
                    name="distance"
                    placeholder="Distance (km)"
                    value={formData.distance}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <input
                    type="number"
                    name="expectedTime"
                    placeholder="Expected Time (minutes)"
                    value={formData.expectedTime}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <input
                    type="text"
                    name="busNumber"
                    placeholder="Bus Number"
                    value={formData.busNumber}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] text-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  >
                    <option value="" disabled>
                      Select Shift
                    </option>
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                  </select>
                  <input
                    type="time"
                    name="time"
                    placeholder="Time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-[#95D2B3] text-gray-900 w-full py-4 rounded-lg hover:bg-[#55AD9B] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span className="ml-3">Add Bus</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBus;
