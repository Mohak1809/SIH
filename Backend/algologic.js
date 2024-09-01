const mongoose = require('mongoose');
const User = require('./models/User'); // Path to your User model
const BusRoute = require('./models/BusRoute'); // Path to your BusRoute model
const AssignedDB = require('./models/AssignedDB'); // Path to your AssignedDB model

async function assignBusesToConductors() {
  try {
    // Connect to the MongoDB database using your URI
    await mongoose.connect('mongodb+srv://vanshaggrawal1:icWByhsiMxhAifYV@cluster0.rho0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch users with crewRole 'conductor'
    const conductors = await User.find({ crewRole: 'conductor' });

    if (conductors.length === 0) {
      console.error('No conductors found');
      return;
    }

    // Fetch the bus route data
    const busRoutes = await BusRoute.find({}); // Fetch all routes or use a specific filter if needed

    if (busRoutes.length === 0) {
      console.error('No bus routes found');
      return;
    }

    // Initialize variables for assigning buses
    let conductorIndex = 0;
    const numConductors = conductors.length;

    // Iterate through each bus route
    for (const busRoute of busRoutes) {
      const buses = busRoute.busNumbers;

      // Loop through each bus in the current route
      for (const bus of buses) {
        // Get the current conductor
        const assignedConductor = conductors[conductorIndex];

        // Create a new entry in AssignedDB
        const assignedEntry = new AssignedDB({
          name: assignedConductor.name,
          userId: assignedConductor.id,
          crewRole: assignedConductor.crewRole,
          busNumber: bus.number,
          routeId: busRoute.routeID,
          routeShortName: busRoute.routeShortName,
          startPoint: busRoute.startPoint,
          endPoint: busRoute.endPoint,
          distance: busRoute.distance,
          shift: bus.shift,
          startTime: bus.time,
          expectedTime: busRoute.expectedTime,
        });

        // Save the entry to the database
        await assignedEntry.save();
        console.log(`Assigned ${bus.number} to ${assignedConductor.name}`);

        // Move to the next conductor
        conductorIndex = (conductorIndex + 1) % numConductors;
      }
    }

  } catch (error) {
    console.error('Error assigning buses:', error);
  } finally {
    // Close the database connection
    await mongoose.disconnect();
  }
}

// Run the function
assignBusesToConductors();
