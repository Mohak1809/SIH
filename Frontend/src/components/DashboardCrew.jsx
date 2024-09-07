import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BusRouteVisualization from './BusRouteVisualisation/BusRouteVisualisation';


function DashboardCrew() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const excludedKeys = ["name", "_id", "__v", "routeShortName1","routeId2", "endPoint2","startPoint2","routeShortName2","distance2"];

  // Get the `id` from the route parameters
  const { id } = useParams();

  useEffect(() => {
    // Fetch data from the backend using the `id`
    axios.get(`http://localhost:5000/api/auth/dashboard-crew/${id}`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  // Flatten the data into an array of entries
  const entries = Object.entries(data[0] || {}); 
  const filteredEntries = entries.filter(([key]) => !excludedKeys.includes(key));
  console.log(data);
  console.log(entries)
  console.log(filteredEntries);
const getkey = (key) => {
  switch(key) {
    case "userId" : return "User Id";
    case "crewRole" : return "Crew Role";
    case "busNumber1" : return "Bus Number 1";
    case "busNumber2" : return "Bus Number 2";
    case "routeId1" : return "Route Id";
    case "startPoint1" : return "Start Point";
    case "endPoint1" : return "End Point";
    case "distance1" : return "Distance (in km)";
    case "startTime1" : return "Starting Time";
    case "startTime2" : return "Starting Time";
    case "expectedTime1" : return "Expected Time(in Minutes)"
    case "expectedTime2" : return "Expected Time(in Minutes)"
    case "shift1" : return "Shift 1";
    case "shift2" : return "Shift 2";
  }
}


  
  return (
    <>
      <h1 className='text-center text-4xl font-medium mt-4 text-green-500'>
        {data[0].name}
      </h1>
      <div className="p-6 text-lg font-serif grid grid-cols-2 gap-4">
        {filteredEntries.map(([key, value], index) => {
          // Format value for 'ExpectedTime
          const displayKey = getkey(key);
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
      < BusRouteVisualization start={data[0].startPoint1} end={data[0].endPoint1}/>
    </>
  );
}

export default DashboardCrew;
