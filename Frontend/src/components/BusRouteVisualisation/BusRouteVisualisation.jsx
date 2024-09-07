import React, { useEffect, useRef } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

const BusRouteVisualization = ({ start, end }) => {
  const mapRef = useRef(null);
  const routingControlsRef = useRef([]);

  useEffect(() => {
    // Initialize the map centered on New Delhi
    mapRef.current = L.map('map').setView([28.6139, 77.2090], 13);

    // Add OSM tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Function to add route to the map
    const addRoute = (startLatLng, endLatLng, color) => {
      const control = L.Routing.control({
        waypoints: [L.latLng(startLatLng.lat, startLatLng.lng), L.latLng(endLatLng.lat, endLatLng.lng)],
        routeWhileDragging: true,
        createMarker: () => null, // Hide default markers
        lineOptions: {
          styles: [{ color, weight: 5 }]
        },
        show: false,
      }).addTo(mapRef.current);

      routingControlsRef.current.push(control);
    };

    // Use geocoder to find latlng for start and end
    L.Control.Geocoder.nominatim().geocode(start, (startResults) => {
      if (startResults.length > 0) {
        const startLatLng = startResults[0].center;

        L.Control.Geocoder.nominatim().geocode(end, (endResults) => {
          if (endResults.length > 0) {
            const endLatLng = endResults[0].center;

            // Clear existing user-input routes
            routingControlsRef.current.forEach(control => {
              mapRef.current.removeControl(control);
            });

            // Add route between the start and end locations
            addRoute(startLatLng, endLatLng, 'red'); // You can change the color if needed

            // Center the map to fit the route
            mapRef.current.fitBounds([
              L.latLng(startLatLng.lat, startLatLng.lng),
              L.latLng(endLatLng.lat, endLatLng.lng)
            ]);
          } else {
            alert('End location not found.');
          }
        });
      } else {
        alert('Start location not found.');
      }
    });

    // Cleanup on unmount
    return () => {
      mapRef.current.remove();
    };
  }, [start, end]);

  return (
    <div>
      <div id="map" style={{ height: '600px' }}></div>
    </div>
  );
};

export default BusRouteVisualization;
