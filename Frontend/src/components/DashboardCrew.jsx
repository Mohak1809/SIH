import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BusRouteVisualization from './BusRouteVisualisation/BusRouteVisualisation';
import TakeLeave from './LeaveBox/TakeLeave'; // Import the TakeLeave component

function DashboardCrew() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false); // State to handle modal visibility

  const customOrder = [
    "userId", "crewRole", "shift1", "startTime1", "busNumber1", "routeId1", "startPoint1", "endPoint1",
    "distance1", "expectedTime1", "shift2", "startTime2", "busNumber2", "routeId2",
    "endPoint2", "startPoint2"
  ];

  const excludedKeys = [
    "name", "_id", "__v", "routeShortName1",
    "routeShortName2", "distance2",  "expectedTime2"
  ];

  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/auth/dashboard-crew/${id}`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
        } else {
          setError(error);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;



  // Ensure that data[0] exists before attempting to access its properties
  if (data.length === 0 || !data[0]) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-semibold text-red-500">
          No route assigned today
        </h1>
        <div className="text-center mt-4">
          {/* Leave button for unassigned users */}
          <button
            onClick={() => setModalVisible(true)}
            className="ml-4 w-32 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Take a Leave
          </button>
        </div>

        {/* Render TakeLeave modal */}
        <TakeLeave show={isModalVisible} onClose={() => setModalVisible(false)} />
      </div>
    );
  }


  const entries = Object.entries(data[0] || {});
  const filteredEntries = entries
    .filter(([key]) => !excludedKeys.includes(key))
    .sort(([a], [b]) => customOrder.indexOf(a) - customOrder.indexOf(b));

  const getKeyLabel = (key) => {
    switch (key) {
      case "userId": return "User Id";
      case "crewRole": return "Crew Role";
      case "busNumber1": return "Bus Number 1";
      case "busNumber2": return "Bus Number 2";
      case "routeId1": return "Route Id";
      case "routeId2": return "Route Id";
      case "startPoint1": return "Start Point 1";
      case "startPoint2": return "End Point 2";
      case "endPoint1": return "End Point 1";
      case "endPoint2": return "Start Point 2";
      case "distance1": return "Distance (in km)";
      case "startTime1": return "Starting Time";
      case "startTime2": return "Starting Time";
      case "expectedTime1": return "Expected Time (in Minutes) 1";
      case "expectedTime2": return "Expected Time (in Minutes) 2";
      case "shift1": return "Shift 1";
      case "shift2": return "Shift 2";
      default: return key;
    }
  };

  return (
    <>
      <h1 className='text-center text-4xl font-medium mt-4 text-green-500'>
        {data[0]?.name} {/* Safely access name */}
      </h1>
      <div className="p-6 text-lg font-serif grid grid-cols-2 gap-4">
        {filteredEntries.map(([key, value], index) => {
          const displayKey = getKeyLabel(key);
          return (
            <div
              key={index}
              className="bg-gray-100 text-black border-l-8 border-green-500 rounded-md px-3 py-2 w-full text-left"
            >
              <span className="font-semibold">
                {displayKey}:
              </span>
              <span className="text-gray-500 font-thin text-sm block pt-1">
                {value}
              </span>
            </div>
          );
        })}
      </div>
      <div className="text-center mb-6">
        <button
          onClick={() => setModalVisible(true)}
          className="ml-4 w-32 px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Take a Leave
        </button>
      </div>

      <BusRouteVisualization start={data[0]?.startPoint1} end={data[0]?.endPoint1} />
      <TakeLeave show={isModalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

export default DashboardCrew;
