import React, { useRef, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, DirectionsService } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
  maxWidth: '800px',
  margin: '20px auto'
};

const center = {
  lat: 28.6139, // Latitude for Delhi
  lng: 77.2090  // Longitude for Delhi
};

const API_KEY = 'AIzaSyA6-RMHDBcGLdOhgmuiGHnP3Ihjr6rhWJA';

function GIS() {
  const [response, setResponse] = useState(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  const directionsCallback = (res) => {
    if (res !== null && res.status === 'OK') {
      setResponse(res);
    }
  };

  const handleRoute = () => {
    if (originRef.current && destinationRef.current) {
      const origin = originRef.current.value;
      const destination = destinationRef.current.value;

      setResponse(null);

      return (
        <DirectionsService
          options={{
            origin,
            destination,
            travelMode: 'DRIVING'
          }}
          callback={directionsCallback}
        />
      );
    }
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <div className="flex justify-evenly items-center mb-5 w-full space-x-4">
        <input
          type="text"
          ref={originRef}
          placeholder="Enter starting location"
          className="p-2 w-80 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          ref={destinationRef}
          placeholder="Enter destination"
          className="p-2 w-80 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRoute}
          className="p-2 px-5 rounded-lg bg-green-500 text-white cursor-pointer hover:bg-green-600 transition ease-in-out duration-300"
        >
          Show Route
        </button>
      </div>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {response && (
          <DirectionsRenderer
            options={{
              directions: response
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default GIS;
