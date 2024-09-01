const mongoose = require('mongoose');
const User = require('./models/User'); // Path to your User model
const BusRoute = require('./models/BusRoute'); // Path to your BusRoute model
const AssignedDB = require('./models/AssignedDB'); // Path to your AssignedDB model

async function assignBusesToConductorsAndDrivers() {
  try {
    // Connect to the MongoDB database using your URI
    await mongoose.connect('mongodb+srv://vanshaggrawal1:icWByhsiMxhAifYV@cluster0.rho0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch users with crewRole 'conductor' and 'driver'
    const conductors = await User.find({ crewRole: 'conductor' });
    const drivers = await User.find({ crewRole: 'driver' });

    if (conductors.length === 0) {
      console.error('No conductors found');
      return;
    }

    if (drivers.length === 0) {
      console.error('No drivers found');
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
    let driverIndex = 0;
    const numConductors = conductors.length;
    const numDrivers = drivers.length;

    // Iterate through each bus route
    for (const busRoute of busRoutes) {
      const buses = busRoute.busNumbers;

      // Loop through each bus in the current route
      for (const bus of buses) {
        // Get the current conductor and driver
        const assignedConductor = conductors[conductorIndex];
        const assignedDriver = drivers[driverIndex];

        // Check if the assignment already exists in AssignedDB for conductor
        const existingConductorAssignment = await AssignedDB.findOne({
          userId: assignedConductor.id,
          busNumber: bus.number,
          routeId: busRoute.routeID,
        });

        // Check if the assignment already exists in AssignedDB for driver
        const existingDriverAssignment = await AssignedDB.findOne({
          userId: assignedDriver.id,
          busNumber: bus.number,
          routeId: busRoute.routeID,
        });

        // If the assignment for conductor already exists, continue to the next bus
        if (existingConductorAssignment) {
          console.log(`Conductor assignment already exists for bus ${bus.number} to ${assignedConductor.name}. Skipping...`);
        } else {
          // Create a new entry in AssignedDB for conductor
          const assignedConductorEntry = new AssignedDB({
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
          await assignedConductorEntry.save();
          console.log(`Assigned bus ${bus.number} to conductor ${assignedConductor.name}`);
        }

        // If the assignment for driver already exists, continue to the next bus
        if (existingDriverAssignment) {
          console.log(`Driver assignment already exists for bus ${bus.number} to ${assignedDriver.name}. Skipping...`);
        } else {
          // Create a new entry in AssignedDB for driver
          const assignedDriverEntry = new AssignedDB({
            name: assignedDriver.name,
            userId: assignedDriver.id,
            crewRole: assignedDriver.crewRole,
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
          await assignedDriverEntry.save();
          console.log(`Assigned bus ${bus.number} to driver ${assignedDriver.name}`);
        }

        // Move to the next conductor and driver
        conductorIndex = (conductorIndex + 1) % numConductors;
        driverIndex = (driverIndex + 1) % numDrivers;
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
assignBusesToConductorsAndDrivers();
