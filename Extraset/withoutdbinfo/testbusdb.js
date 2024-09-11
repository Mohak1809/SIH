const mongoose = require('mongoose');
const BusRoute = require('../../Backend/models/BusRoute'); // Adjust the path to where your BusRoute model is located

// MongoDB connection URL
const MONGO_URI = 'mongodb+srv://vanshaggrawal1:icWByhsiMxhAifYV@cluster0.rho0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to your MongoDB database using the provided URI
mongoose.connect(MONGO_URI, {
})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Function to find a bus route by routeID
const findBusRouteByRouteID = async (routeID) => {
  try {
    const busRoute = await BusRoute.findOne({ routeID: routeID });
    if (busRoute) {
      console.log('Bus Route found:', busRoute);
    } else {
      console.log('Bus Route not found');
    }
  } catch (err) {
    console.error('Error finding bus route:', err);
  }
};

// Search for the bus route with routeID 1
findBusRouteByRouteID(1);
