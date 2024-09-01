import React, { useEffect, useRef } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";


const BusRouteVisualization = () => {
  const mapRef = useRef(null);
  const routingControlsRef = useRef([]);

  useEffect(() => {
    // Initialize the map centered on New Delhi
    mapRef.current = L.map('map').setView([28.6139, 77.2090], 13);

    // Add OSM tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Define major routes with different colors
    const majorRoutes = [
      {
        name: 'Route 1: Anand Vihar ISBT to Badarpur Border',
        waypoints: [
          [28.6506, 77.3152], // Anand Vihar ISBT
          [28.4944, 77.2971]  // Badarpur Border
        ],
        color: 'red'
      },
      {
        name: 'Route 2: Nehru Place to Uttam Nagar Terminal',
        waypoints: [
          { lat: 28.5497, lng: 77.2518, name: 'Nehru Place' },
          { lat: 28.6219, lng: 77.0730, name: 'Uttam Nagar Terminal' }
        ],
        color: 'blue'
      },
      {
        name: 'Route 3: Azadpur to Nizamuddin Railway Station',
        waypoints: [
          { lat: 28.7164, lng: 77.1730, name: 'Azadpur' },
          { lat: 28.5886, lng: 77.2506, name: 'Nizamuddin Railway Station' }
        ],
        color: 'green'
      },
      {
        name: 'Route 4: Mehrauli to Mori Gate',
        waypoints: [
          { lat: 28.5273, lng: 77.1839, name: 'Mehrauli' },
          { lat: 28.6680, lng: 77.2299, name: 'Mori Gate' }
        ],
        color: 'orange'
      },
      {
        name: 'Route 5: Uttam Nagar Terminal to Anand Vihar ISBT',
        waypoints: [
          { lat: 28.6219, lng: 77.0730, name: 'Uttam Nagar Terminal' },
          { lat: 28.6506, lng: 77.3152, name: 'Anand Vihar ISBT' }
        ],
        color: 'purple'
      },
      {
        name: 'Route 6: Dhaula Kuan to Badarpur Border',
        waypoints: [
          { lat: 28.5950, lng: 77.1629, name: 'Dhaula Kuan' },
          { lat: 28.4944, lng: 77.2971, name: 'Badarpur Border' }
        ],
        color: 'brown'
      },
      {
        name: 'Route 7: Janakpuri West to Shivaji Stadium',
        waypoints: [
          { lat: 28.6210, lng: 77.0922, name: 'Janakpuri West' },
          { lat: 28.6261, lng: 77.2106, name: 'Shivaji Stadium' }
        ],
        color: 'pink'
      },
      {
        name: 'Route 8: Saket to Narela',
        waypoints: [
          { lat: 28.5225, lng: 77.2107, name: 'Saket' },
          { lat: 28.8523, lng: 77.0929, name: 'Narela' }
        ],
        color: 'cyan'
      },
      {
        name: 'Route 9: Mayur Vihar Phase 3 to Safdarjung Terminal',
        waypoints: [
          { lat: 28.6169, lng: 77.3353, name: 'Mayur Vihar Phase 3' },
          { lat: 28.5651, lng: 77.2013, name: 'Safdarjung Terminal' }
        ],
        color: 'magenta'
      },
      {
        name: 'Route 10: Lajpat Nagar to Jahangirpuri',
        waypoints: [
          { lat: 28.5687, lng: 77.2433, name: 'Lajpat Nagar' },
          { lat: 28.7250, lng: 77.1729, name: 'Jahangirpuri' }
        ],
        color: 'violet'
      },
      {
        name: 'Route 11: Mukherjee Nagar to Nehru Place',
        waypoints: [
          { lat: 28.7016, lng: 77.2102, name: 'Mukherjee Nagar' },
          { lat: 28.5497, lng: 77.2518, name: 'Nehru Place' }
        ],
        color: 'yellow'
      },
      {
        name: 'Route 12: Uttam Nagar Terminal to ISBT Kashmere Gate',
        waypoints: [
          { lat: 28.6219, lng: 77.0730, name: 'Uttam Nagar Terminal' },
          { lat: 28.6674, lng: 77.2274, name: 'ISBT Kashmere Gate' }
        ],
        color: 'lime'
      },
      {
        name: 'Route 13: Azadpur to Malviya Nagar',
        waypoints: [
          { lat: 28.7164, lng: 77.1730, name: 'Azadpur' },
          { lat: 28.5273, lng: 77.2206, name: 'Malviya Nagar' }
        ],
        color: 'teal'
      },
      {
        name: 'Route 14: Mayur Vihar Phase 3 to Badarpur Border',
        waypoints: [
          { lat: 28.6169, lng: 77.3353, name: 'Mayur Vihar Phase 3' },
          { lat: 28.4944, lng: 77.2971, name: 'Badarpur Border' }
        ],
        color: 'silver'
      },
      {
        name: 'Route 15: Kashmere Gate ISBT to Saket',
        waypoints: [
          { lat: 28.6674, lng: 77.2274, name: 'Kashmere Gate ISBT' },
          { lat: 28.5225, lng: 77.2107, name: 'Saket' }
        ],
        color: 'gold'
      },
      {
        name: 'Route 16: Dhaula Kuan to Dwarka Sector 10',
        waypoints: [
          { lat: 28.5950, lng: 77.1629, name: 'Dhaula Kuan' },
          { lat: 28.5947, lng: 77.0466, name: 'Dwarka Sector 10' }
        ],
        color: 'indigo'
      },
      {
        name: 'Route 17: Rohini Sector 22 to AIIMS',
        waypoints: [
          { lat: 28.7176, lng: 77.0769, name: 'Rohini Sector 22' },
          { lat: 28.5726, lng: 77.2070, name: 'AIIMS' }
        ],
        color: 'coral'
      },
      {
        name: 'Route 18: HUDA City Centre to Jahangirpuri',
        waypoints: [
          { lat: 28.4532, lng: 77.0390, name: 'HUDA City Centre' },
          { lat: 28.7250, lng: 77.1729, name: 'Jahangirpuri' }
        ],
        color: 'salmon'
      },
      {
        name: 'Route 19: Green Park to Rohini Sector 18',
        waypoints: [
          { lat: 28.5482, lng: 77.2110, name: 'Green Park' },
          { lat: 28.7176, lng: 77.0896, name: 'Rohini Sector 18' }
        ],
        color: 'peach'
      },
      {
        name: 'Route 20: Lajpat Nagar to Sector 21 Dwarka',
        waypoints: [
          { lat: 28.5687, lng: 77.2433, name: 'Lajpat Nagar' },
          { lat: 28.5905, lng: 77.0311, name: 'Sector 21 Dwarka' }
        ],
        color: 'brown'
      }
      // ... (other routes as defined in the original code)
    ];

    // Add routes to the map
    majorRoutes.forEach(route => {
      const control = L.Routing.control({
        waypoints: route.waypoints.map(latlng => L.latLng(latlng[0], latlng[1])),
        routeWhileDragging: true,
        createMarker: () => null, // Hide default markers
        lineOptions: {
          styles: [{ color: route.color, weight: 5 }]
        }
      }).addTo(mapRef.current);

      routingControlsRef.current.push(control);
    });

    // Cleanup on unmount
    return () => {
      mapRef.current.remove();
    };
  }, []);

  const showRoute = () => {
    const startLocation = document.getElementById('start-location').value;
    const endLocation = document.getElementById('end-location').value;

    if (startLocation && endLocation) {
      L.Control.Geocoder.nominatim().geocode(startLocation, (startResults) => {
        if (startResults.length > 0) {
          const startLatLng = startResults[0].center;

          L.Control.Geocoder.nominatim().geocode(endLocation, (endResults) => {
            if (endResults.length > 0) {
              const endLatLng = endResults[0].center;

              // Clear existing user-input routes
              routingControlsRef.current.forEach(control => {
                mapRef.current.removeControl(control);
              });

              const control = L.Routing.control({
                waypoints: [
                  L.latLng(startLatLng.lat, startLatLng.lng),
                  L.latLng(endLatLng.lat, endLatLng.lng)
                ],
                routeWhileDragging: true,
                createMarker: () => null, // Hide default markers
                lineOptions: {
                  styles: [{ color: 'purple', weight: 5 }] // Color for user input route
                }
              }).addTo(mapRef.current);

              // Center the map to fit the route
              mapRef.current.fitBounds([
                L.latLng(startLatLng.lat, startLatLng.lng),
                L.latLng(endLatLng.lat, endLatLng.lng)
              ]);

              routingControlsRef.current.push(control);
            } else {
              alert('End location not found.');
            }
          });
        } else {
          alert('Start location not found.');
        }
      });
    } else {
      alert('Please enter both start and end locations.');
    }
  };

  return (
    <div>
      <div id="form">
      </div>
      <div id="map" style={{ height: '600px' }}></div>
    </div>
  );
};

export default BusRouteVisualization;
