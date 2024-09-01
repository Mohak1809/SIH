import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="shadow sticky z-50 top-0">
            <nav className="bg-[#F1F8E8] border-gray-200 px-4 lg:px-6 py-2.5 w-full h-full"> {/* Updated background color */}
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen">
                    <div className="flex items-center justify-between">
                        <img
                            src="/logo.png"  
                            className="mr-3 h-12"
                            alt="Logo"
                        />
                        <p className="text-xl font-medium text-[#55AD9B]">ScheduLine</p>
                    </div>
                    <div className="flex items-center lg:order-2">
                        <Link
                            to="/"
                            className="text-gray-800 hover:bg-[#D8EFD3] focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="text-white bg-[#55AD9B] hover:bg-[#95D2B3] focus:ring-4 focus:ring-[#D8EFD3] font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Get started
                        </Link>
                    </div>
                    <div
                        className=" justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <Link
                                    to="#"
                                    className={
                                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-[#D8EFD3] lg:hover:bg-transparent lg:border-0 hover:text-[#55AD9B] lg:p-0`
                                    }
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/BusInfo"
                                    className={
                                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-[#D8EFD3] lg:hover:bg-transparent lg:border-0 hover:text-[#55AD9B] lg:p-0`
                                    }
                                >
                                    Bus Info
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className={
                                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-[#D8EFD3] lg:hover:bg-transparent lg:border-0 hover:text-[#55AD9B] lg:p-0`
                                    }
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className={
                                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-[#D8EFD3] lg:hover:bg-transparent lg:border-0 hover:text-[#55AD9B] lg:p-0`
                                    }
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
