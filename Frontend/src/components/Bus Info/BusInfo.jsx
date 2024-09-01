import React, { useEffect, useState } from "react";

function BusInfo() {
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(15); // Adjust the number of entries per page here
    const [searchQuery, setSearchQuery] = useState('');
    const entries = ["busnumber", "routeid", "start_time", "start_place", "end_place"];

    useEffect(() => {
        fetch('/crew_dashboard.json')
            .then(res => res.json())
            .then(res => {
                setData(res);
                const filteredData = res.map(row => {
                    const filtered = {};
                    entries.forEach(key => {
                        filtered[key] = row[key];
                    });
                    return filtered;
                });
                setFilterData(filteredData);
            })
            .catch(error => {
                console.error('Error fetching JSON data:', error);
            });
    }, []);

    const totalPages = Math.ceil(filterData.length / entriesPerPage);
    const currentEntries = filterData.slice(
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
                        {Object.keys(currentEntries[0]).map((val) => (
                            <th key={val} className="px-4 py-2 bg-[#55AD9B] text-white font-bold text-center">
                                {val.charAt(0).toUpperCase() + val.slice(1)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {currentEntries.map((row, index) => (
                        <tr key={index} className="even:bg-[#F1F8E8]">
                            {Object.values(row).map((value, i) => (
                                <td key={i} className="border px-4 py-2 text-center border-gray-200">
                                    {value}
                                </td>
                            ))}
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
