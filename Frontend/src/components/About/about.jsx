import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';


const AboutPage = () => {
  const features = [
    {
      title: 'AI-Driven Scheduling',
      description: 'Optimize your bus routes and schedules with our AI-powered algorithms that ensure efficiency and reduce costs.',
      likes: 498,
      comments: 64,
    },
    {
      title: 'Real-Time Monitoring',
      description: 'Keep track of your fleet in real-time with our advanced monitoring tools, providing insights into bus locations and statuses.',
      likes: 321,
      comments: 45,
    },
  ];

  return (
    <>
      <section className="bg-[#d1f3c9]">
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="max-w-xl ml-10">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center">About Us</h2>
              <p className="mt-4 text-gray-600 text-lg text-center">
                Welcome to our bus operations management system! We specialize in optimizing your bus operations with AI-driven scheduling, real-time monitoring, and efficient crew management. Our platform is designed to streamline your operations, reduce costs, and enhance the overall efficiency of your transportation services.
              </p>
              <p className="mt-4 text-gray-600 text-lg text-center">
                With our cutting-edge technology, you can easily manage routes, monitor your fleet, and generate automated reports, all in one place. Join us in transforming the future of public transportation.
              </p>
            </div>
            <div className="mt-12 md:mt-0">
              <img 
                src="/aboutUs.png" 
                alt="About Us Image" 
                className="object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
