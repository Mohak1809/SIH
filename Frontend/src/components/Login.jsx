import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const LoginForm = () => {
  const [id, setid] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !password) {
      alert('User ID and password are required');
      return;
    }
    try {
      const response = await axios.post(`${config.apiUrl}/auth/login`, {
        id,
        password,
      });

      console.log('Response data:', response.data);

      const dat = response.data;
      localStorage.setItem('token', dat.token);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${dat.token}`;
      
      if (dat.role === 'manager') {
        navigate('/dashboard-manager');
      } else if (dat.role === 'crew') {
        // Make a GET request to fetch the crew data
        const crewResponse = await axios.get(`http://localhost:5000/api/auth/dashboard-crew/${dat.id}`);
        
        // Navigate to DashboardCrew with the fetched crew data
        navigate(`/dashboard-crew/${dat.id}`);
      } else {
        alert('Unknown role');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F8E8] text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold text-[#55AD9B]">Sign In</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <input
                    type="text"
                    placeholder="User ID"
                    value={id}
                    onChange={(e) => setid(e.target.value)}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-[rgb(254,255,250)] border border-[#95D2B3] placeholder-gray-500 text-sm focus:outline-none focus:border-[#55AD9B] focus:bg-white mt-5"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-[#95D2B3] text-gray-900 w-full py-4 rounded-lg hover:bg-[#55AD9B] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">Login</span>
                  </button>
                </form>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  New Member?{' '}
                  <Link to="/register" className="text-[#55AD9B] hover:underline">
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-[#c4dca9] text-center hidden lg:flex ">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat "
            style={{
              backgroundImage: 'url("/login_bg.jpg")',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
