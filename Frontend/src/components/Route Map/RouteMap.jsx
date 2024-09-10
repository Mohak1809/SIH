import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

function RouteMap() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const required = ["startPoint", "endPoint"];
  const mapRef = useRef(null);
  const routingControlsRef = useRef([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/dashboard-manager")
      .then((res) => {
        const filterData = res.data.buses
          .map((item) => {
            const filteredItem = {};
            for (let key in item) {
              if (required.includes(key)) {
                filteredItem[key] = item[key];
              }
            }
            return filteredItem;
        });

        setData(filterData);
      })
      .catch((error) => {
        console.error("Error fetching JSON data:", error);
        setError(error);
      });
  }, []);
  console.log(data)

  useEffect(() => {
    if (data.length > 0) {
      // Initialize the map centered on New Delhi
      mapRef.current = L.map("map").setView([28.6139, 77.209], 12);

      // Add OSM tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Predefined colors for routes
      const colors = ["red", "blue", "green", "magenta", "orange", "purple", "aqua", "black", "yellow", "gray"];

      // Function to add route and markers to the map
      const addRoute = (startLatLng, endLatLng, startLabel, endLabel, color) => {
        // Add markers with popups for start and end points
        L.marker([startLatLng.lat, startLatLng.lng])
          .bindPopup(`<b>${startLabel}</b>`)
          .addTo(mapRef.current);

        L.marker([endLatLng.lat, endLatLng.lng])
          .bindPopup(`<b>${endLabel}</b>`)
          .addTo(mapRef.current);

        // Add routing control with the specified color
        const control = L.Routing.control({
          waypoints: [L.latLng(startLatLng.lat, startLatLng.lng), L.latLng(endLatLng.lat, endLatLng.lng)],
          routeWhileDragging: false,
          createMarker: () => null, // Hide default markers
          lineOptions: {
            styles: [{ color, weight: 5 }],
          },
          show: false, // Hide the control boxes
        }).addTo(mapRef.current);

        routingControlsRef.current.push(control);
      };

      // Function to handle rate limiting
      const geocodeWithDelay = (item, index, delay) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const start = item.startPoint;
            const end = item.endPoint;

            if (start && end) {
              // Geocode the start and end locations
              L.Control.Geocoder.nominatim().geocode(start, (startResults) => {
                if (startResults.length > 0) {
                  const startLatLng = startResults[0].center;
                  
                  L.Control.Geocoder.nominatim().geocode(end, (endResults) => {
                    if (endResults.length > 0) {
                      const endLatLng = endResults[0].center;

                      // Use a color based on the index, cycling through the array
                      const routeColor = colors[index % colors.length]; // Avoid overlapping

                      // Add the route with the start and end points labeled
                      addRoute(startLatLng, endLatLng, start, end, routeColor);
                      resolve();
                    } else {
                      console.error(`End location "${end}" not found.`);
                      resolve();
                    }
                  });
                } else {
                  console.error(`Start location "${start}" not found.`);
                  resolve();
                }
              });
            } else {
              console.error(`Invalid start or end point: Start: "${start}", End: "${end}"`);
              resolve();
            }
          }, delay);
        });
      };

      // Process the geocoding requests sequentially with delay
      const processGeocodingWithRateLimit = async () => {
        for (let i = 0; i < data.length; i++) {
          await geocodeWithDelay(data[i], i, i * 200); // 500ms delay between each request
        }
      };

      processGeocodingWithRateLimit();

      // Cleanup on unmount
      return () => {
        mapRef.current.remove();
      };
    }
  }, [data]);

  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div>
      <div id="map" style={{ height: "600px" }}></div>
    </div>
  );
}

export default RouteMap;
