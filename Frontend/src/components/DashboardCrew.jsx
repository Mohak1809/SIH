import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BusRouteVisualization from './BusRouteVisualisation/BusRouteVisualisation';


function DashboardCrew() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const excludedKeys = ["name", "_id", "__v", "routeShortName"];

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

  return (
    <>
      <h1 className='text-center text-4xl font-medium mt-4 text-green-500'>
        {data[0].name}
      </h1>
      <div className="p-6 text-lg font-serif grid grid-cols-2 gap-4">
        {filteredEntries.map(([key, value], index) => {
          // Format value for 'ExpectedTime
          const displayKey = key === "expectedTime" ? `${key.charAt(0).toUpperCase() + key.slice(1)} (In Minutes)` : key.charAt(0).toUpperCase() + key.slice(1);

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
      < BusRouteVisualization />
    </>
  );
}

export default DashboardCrew;
