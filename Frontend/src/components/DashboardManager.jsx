import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardManager = () => {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterData1, setFilterData1] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const entries1 = ["routeId1", "shift1", "startPoint1", "startTime1", "endPoint1", "distance1", "expectedTime1", "name", "crewRole", "userId", "busNumber1"];
  const entries2 = ["routeId2", "shift2", "startPoint2", "startTime2", "endPoint2", "distance2", "expectedTime2", "busNumber2"];
  const entriesPerPage = 15;

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/dashboard-manager')
      .then(response => {
        setData(response.data);

        // Filter for first set of data
        const filtereddata = response.data.assignments.map(item => {
          const filteredItem = {};
          for (let key in item) {
            if (entries1.includes(key)) {
              filteredItem[key] = item[key];
            }
          }
          return filteredItem;
        });
        setFilterData(filtereddata);

        // Filter for second set of data (filterData1)
        const filtereddata1 = response.data.assignments.map(item => {
          const filteredItem = {};
          for (let key in item) {
            if (entries2.includes(key)) {
              filteredItem[key] = item[key];
            }
          }
          return filteredItem;
        });
        setFilterData1(filtereddata1);
      })
      .catch(error => {
        console.error('Error fetching JSON data:', error);
        setError(error);
      });
  }, []);

  if (error) return <p>Error loading data: {error.message}</p>;

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);  // Reset pagination to the first page

    // Filter both filterData and filterData1 based on the search query
    const filteredResults = data.assignments.filter((item) => {
      // Check if any value in either filterData or filterData1 contains the search query
      const matchesFirstFragment = Object.values(item).find(value =>
        value && value.toString().toLowerCase().includes(query)
      );
      return matchesFirstFragment;
    });

    // Update both filteredData and filterData1 based on the filtered results
    setFilterData(filteredResults.map(item => {
      const filteredItem = {};
      for (let key in item) {
        if (entries1.includes(key)) {
          filteredItem[key] = item[key];
        }
      }
      return filteredItem;
    }));

    setFilterData1(filteredResults.map(item => {
      const filteredItem = {};
      for (let key in item) {
        if (entries2.includes(key)) {
          filteredItem[key] = item[key];
        }
      }
      return filteredItem;
    }));
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  const currentEntries = filterData.slice(indexOfFirstEntry, indexOfLastEntry);
  const currentEntries1 = filterData1.slice(indexOfFirstEntry, indexOfLastEntry); // Paginated filterData1

  const totalPages = Math.ceil(filterData.length / entriesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getkey = (key) => {
    switch (key) {
      case "name": return "Name";
      case "userId": return "User Id";
      case "crewRole": return "Crew Role";
      case "busNumber1": return "Bus Number";
      case "routeId1": return "Route Id";
      case "startPoint1": return "Start Point";
      case "endPoint1": return "End Point";
      case "distance1": return "Distance";
      case "startTime1": return "Starting Time";
      case "expectedTime1": return "Expected Time";
      case "shift1": return "Shift";
      default: return key;
    }
  }

  return (
    <>
      <div className="shadow-lg rounded-lg flex flex-col items-center justify-center w-full overflow-x-auto">
        <img
          src="ScheduLine_Tagline_img.png"
          className="w-full h-auto object-cover"
          alt="Banner"
        />
        <h1 className="text-center text-5xl p-8 font-semibold text-green-900">
          Crew Details
        </h1>
        <div className="flex flex-col md:flex-row items-center w-[90%] mb-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="flex mt-2 md:mt-0 ml-0 md:ml-4">
            <button
              onClick={() => setSearchQuery('')}
              className="ml-0 md:ml-4 px-4 py-2 bg-[#55AD9B] text-white rounded-lg hover:bg-[#95D2B3]"
            >
              Clear
            </button>
            <Link
              to={"/Leave-Data"}
              target = "_blank"
              className="ml-4 w-auto px-4 py-2 bg-[#55AD9B] text-white rounded-lg hover:bg-[#95D2B3]"
            >
              Leave Info
            </Link>
            <Link
              to="/add-bus"
              className="ml-4 w-auto px-4 py-2 bg-[#55AD9B] text-white rounded-lg hover:bg-[#95D2B3]"
            >
              Add Buses
            </Link>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#F1F8E8]">
                {Object.keys(filterData[0] || {}).map((header) => {
                  const displayKeys = getkey(header);
                  return (
                    <th
                      key={header}
                      className="py-4 px-6 text-gray-600 font-bold uppercase whitespace-nowrap text-center border border-gray-300"
                    >
                      {displayKeys}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentEntries.map((row, index) => (
                <React.Fragment key={index}>
                  <tr>
                    {Object.values(row).map((value, i) => (
                      <td
                        key={i}
                        className="py-4 px-6 border border-gray-300 break-words text-center"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {Object.keys(row).map((key, i) => (
                      <td
                        key={i}
                        className="py-4 px-6 border border-gray-300 break-words text-center"
                      >
                        {currentEntries1[index][key.slice(0, key.length - 1) + '2']}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4 w-[90%]">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#55AD9B] text-white rounded-lg hover:bg-[#95D2B3] disabled:bg-gray-300 mb-4"
          >
            Previous
          </button>
          <span className="text-lg">Page {currentPage} of {totalPages}</span>
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
