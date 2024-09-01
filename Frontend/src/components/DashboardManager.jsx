import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardManager = () => {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const entries = ["_id","__v","routeShortName"];
  const entriesPerPage = 20;


  useEffect(() => {
    // Fetch the JSON file when the component mounts
    axios.get('http://localhost:5000/api/auth/dashboard-manager')
      .then(response => {
        setData(response.data);

        // Filter out the unwanted keys
        const filtereddata = response.data.map(item => {
          const filteredItem = {};
          for (let key in item) {
            if (!entries.includes(key)) {
              filteredItem[key] = item[key];
            }
          }
          return filteredItem;
        });

        setFilterData(filtereddata);

      })
      .catch(error => {
        console.error('Error fetching JSON data:', error);
        setError(error);
      });
  }, []);



  // if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  // Handle search functionality
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };


  const filteredData = filterData.filter(row => 
    Object.values(row).find(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate the index of the first and last entry on the current page
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  // Get the current entries to display
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Change page handler
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="shadow-lg rounded-lg flex flex-col items-center justify-center">
        <img src="ScheduLine_Tagline_img.png" className="bg-cover bg-center" alt="Banner" />
        <h1 className="text-center text-5xl p-8 font-semibold text-green-900">Crew Details</h1>
        <div className="flex items-center w-[90%] mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full"
          />
          <button
            onClick={() => setSearchQuery('')}
            className="ml-4 px-4 py-2 bg-[#55AD9B] text-white rounded-lg hover:bg-[#95D2B3]"
          >
            Clear
          </button>
          <Link
          to="/add-bus"
            className="ml-4 w-32 px-4 py-2 bg-[#55AD9B] text-white rounded-lg hover:bg-[#95D2B3]"
          >
            Add Buses
          </Link>
        </div>
        <table className="w-[90%] table-auto">
          <thead>
            <tr className="bg-[#F1F8E8]">
              {Object.keys(filteredData[0] || {}).map((header) => (
                <th key={header} className="py-4 px-6 text-gray-600 font-bold uppercase whitespace-nowrap text-center">
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentEntries.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i} className="py-4 px-6 border-b border-gray-200 break-words text-center">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4 w-[90%]">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#55AD9B] text-white rounded-lg hover:bg-[#95D2B3] disabled:bg-gray-300 mb-4"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#55AD9B] text-white rounded-lg hover:bg-[#95D2B3] disabled:bg-gray-300 mb-4"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardManager;
