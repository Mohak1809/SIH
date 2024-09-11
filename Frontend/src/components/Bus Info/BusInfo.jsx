import axios from "axios";
import React, { useEffect, useState } from "react";

function BusInfo() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(15); // Adjust the number of entries per page here

    useEffect(() => {
        axios.get('http://localhost:5000/api/auth/bus-data')
            .then(res => {
                const expandedData = res.data.buses.flatMap(bus => {
                    const requirement = [];
                    bus.busNumbers.map(busNumber => {
                        const busData = {
                            routeID: bus.routeID,
                            startPoint: bus.startPoint,
                            endPoint: bus.endPoint,
                            busNumber: busNumber.number,
                            time: busNumber.time
                        };
                        
                        requirement.push(busData);  // Push each bus's data into the requirement array
                    });

                    return requirement;  // Return the array with bus details
                });

                // Sort by routeID first, and if routeIDs are the same, sort by time (AM/PM considered)
                expandedData.sort((a, b) => {
                    if (a.routeID === b.routeID) {
                        // Convert time to a comparable format
                        const timeA = new Date(`1970-01-01T${convertTo24Hour(a.time)}`);
                        const timeB = new Date(`1970-01-01T${convertTo24Hour(b.time)}`);
                        return timeA - timeB; // Sort by time
                    }
                    return a.routeID - b.routeID; // Sort by routeID
                });

                setData(expandedData);  // Set sorted data
            })
            .catch(error => {
                console.error('Error fetching JSON data:', error);
            });
    }, []);
    
    // Convert 12-hour time to 24-hour time for comparison
    const convertTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(' ');  // Split the time and AM/PM
        let [hours, minutes] = time.split(':');       // Split into hours and minutes
    
        hours = String(hours);  // Ensure hours is treated as a string
    
        if (hours === '12') {
            hours = '00';  // Special case for 12 AM
        }
    
        if (modifier === 'PM' && hours !== '12') {
            hours = String(parseInt(hours, 10) + 12);  // Convert PM times, but ignore 12 PM case
        }
    
        return `${hours.padStart(2, '0')}:${minutes}`;
    };
    
    const totalPages = Math.ceil(data.length / entriesPerPage);
    const currentEntries = data.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );
    
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (data.length === 0) return <p>Loading...</p>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <img
                src="Bus_info.png"
                alt="Image Not Found"
                className="bg-cover bg-center h-80 w-screen mb-8"
            />

            <table id="busInfoTable" className="table-auto w-[90%] mx-auto border-separate border-spacing-0 rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-[#F1F8E8]">
                        <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">Route Id</th>
                        <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">Starting Place</th>
                        <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">Ending Place</th>
                        <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">Bus Number</th>
                        <th className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">Starting Time</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {currentEntries.map((row, index) => (
                        <tr key={index} className="even:bg-[#F1F8E8]">
                            <td className="border px-4 py-2 text-center border-gray-200">{row.routeID}</td>
                            <td className="border px-4 py-2 text-center border-gray-200">{row.startPoint}</td>
                            <td className="border px-4 py-2 text-center border-gray-200">{row.endPoint}</td>
                            <td className="border px-4 py-2 text-center border-gray-200">{row.busNumber}</td>
                            <td className="border px-4 py-2 text-center border-gray-200">{row.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between mt-4 w-[90%] mx-auto">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#55AD9B] text-white rounded-lg hover:bg-[#95D2B3]  mb-4"
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
    );
}

export default BusInfo;
