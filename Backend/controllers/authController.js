const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secretKey = 'schedule_line_crew&manager:999';
require('dotenv').config({ path: "\Backend\.env" });
// const secretKey = process.env.JWT_SECRET;
const AssignedDB=require("../models/AssignedDB")
const BusRoute=require("../models/BusRoute")

// Make sure the secret key is being logged for verification
// console.log('JWT_SECRET:', process.env.PORT);
// console.log('JWT_SECRET:', secretKey);


// Handle user registration
async function handleRegisterUser(req, res) {
  try {
    const {
      name,
      id,
      password,
      phoneNumber,
      email,
      dob,
      gender,
      address,
      role,
      crewRole,
      experience,
      skillLevel,
      timingPreferences,
    } = req.body;

    console.log('Received data:', req.body);

    // Check if the user already exists
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      name,
      id,
      password: hashedPassword,
      phoneNumber,
      email,
      dob,
      gender,
      address,
      role,
    };

    // Add crew-specific fields if the role is 'Crew'
    if (role === 'crew') {
      newUser.crewRole = crewRole;
      newUser.experience = experience;
      newUser.skillLevel = skillLevel;
      newUser.timingPreferences = timingPreferences;
    }

    // Save the new user to the database
    await new User(newUser).save();


     // Generate a JWT token
     const token = jwt.sign(
      { id: newUser.id, role: newUser.crewRole }, // Payload data
      secretKey, // JWT Secret Key
      { expiresIn: '2h' } // Token expiry time
  );

    // res.status(201).json({ message: 'User registered successfully' });


       // Return success response along with token
       res.status(201).json({
        message: 'User registered successfully',
        token, // Send JWT token to the client
        user: {
            id: newUser.id,
            name: newUser.name,
            role: newUser.crewRole
        }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Handle user login
// async function handleLoginUser(req, res) {
//   try {
//     console.log(req.body);
    
//     const { id, password } = req.body;
//     console.log('Received data:', req.body);

//     // Find the user by ID
//     const user = await User.findOne({ id });
//     console.log(user);
    
//     if (!user) {
//       console.log('User not found:', id);
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check if the password is correct
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log('Password mismatch for user:', id);
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: user.id, role: user.role }, 
//       secretKey, 
//       { expiresIn: '2h' } // Token expires in 2 hour
//     );

  
//     // Respond with the token and user role
//     return res.status(200).json({ 
//       'message': 'Login successful', 
//       token, 
//       'role': user.role ,
//       'id':user.id,
//     });
//       //return res.status(200).json({ token,role: user.role });
    
//   } catch (error) {
//     console.error('Login error:', error); 
//     res.status(500).json({ message: 'Server error' });
//   }
// }


async function handleLoginUser(req, res) {
  try {
    const { id, password, } = req.body;
    console.log(secretKey);
    
    // Find the user by ID
    const user = await User.findOne({ id });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      secretKey,  // Use the secret key from the environment variables
      { expiresIn: '2h' }
    );

    // Respond with the token and user role
    return res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      id: user.id,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


async function getDashboardCrewId(req, res) {
  console.log(req);
  
  try {
      const crewId = req.params.id;
      

      // Find the crew member by ID and populate the AssignedDB field
      const crewMember = await AssignedDB.find({userId:crewId});;
      
      if (!crewMember) {
          return res.status(404).json({ message: 'Crew member not found' });
      }

      res.status(200).json(crewMember);
  } catch (error) {
      console.error('Error fetching crew member:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}

//Adding the new crew details
async function addCrewToDashBoard(req, res) {
  try {
    const { 
      userId,
      crewRole,
      busNumber,
      routeId,
      routeShortName,
      startPoint,
      endPoint,
      distance,
      shift,
      startTime,
      expectedTime
    } = req.body; // This is expected to be an object matching the `AssignedDB` schema

    // Creating a new instance of AssignedDB with the extracted details
    const newAssignment = new AssignedDB({
      userId,
      crewRole,
      busNumber,
      routeId,
      routeShortName,
      startPoint,
      endPoint,
      distance,
      shift,
      startTime,
      expectedTime
    });

    // Saving the new assignment to the database
    await newAssignment.save();

    // Responding with the saved assignment
    res.status(200).json(newAssignment);
  } catch (error) {
    console.error('Error in adding crew member:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

//Deleting the given crew details
async function deleteCrewToDashBoard(req, res) {
  try {
    console.log(req.body);
    const { userId } = req.body; // Expecting the user ID of the assignment to delete

    // Find the assignment with the given user ID
    const result = await AssignedDB.findOneAndDelete({ userId: userId });

    if (!result) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting crew assignment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function addNewBus(req, res) {
  try {
    const {
      routeID,
      agencyID,
      routeShortName,
      routeDesc,
      startPoint,
      endPoint,
      routeDifficulty,
      distance,
      expectedTime,
      busNumbers
    } = req.body;

    // Validate that all required fields are present
    if (!routeID || !agencyID || !routeShortName || !routeDesc || !startPoint || !endPoint || !routeDifficulty || !distance || !expectedTime || !busNumbers) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new BusRoute document
    const newBusRoute = new BusRoute({
      routeID,
      agencyID,
      routeShortName,
      routeDesc,
      startPoint,
      endPoint,
      routeDifficulty,
      distance,
      expectedTime,
      busNumbers
    });

    await newBusRoute.save();
    res.status(200).json({ message: 'Bus route added successfully', busRoute: newBusRoute });
  } catch (error) {
    console.error('Error adding bus route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

async function getDashboardManagerDetails(req, res) {
  try {
    // Fetch all records from the AssignedDB collection
    const assignments = await AssignedDB.find({});

    // If no records are found, return a message
    if (assignments.length === 0) {
      console.log("No data");
      
      return res.status(404).json({ message: 'No assignments found' });
    }

    // Return the assignments as a JSON response
    // console.log("data is here");
    // console.log(assignments);

    const buses=await BusRoute.find({});
    if(buses.length==0)
    {
      console.log("No bus data found");
      return res.status(404).json({ message: 'No busess found' });
      
    }
    // console.log("buses data  is here");
    // console.log(buses);
    return res.status(200).json({"assignments":assignments,"buses":buses});
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error('Error fetching manager dashboard details:', error);
    return res.status(500).json({ message: 'Server Error', error });

  }
}


// Controller to update the assigned buses when a crew member's leave is approved
const updateAssignedDb = async (req, res) => {
  const { userId } = req.params; // Get the userId from the request parameters
  console.log(userId);
  
  const { newUserId, newName } = req.body; // Get newUserId and newName from the request body

  try {
    // Find the assigned buses for the user on leave
    const assignedData = await AssignedDB.findOne({ userId });

    if (!assignedData) {
      return res.status(404).json({ message: 'No assigned buses found for this user' });
    }

    // Update the assigned buses to a new crew member
    assignedData.userId = newUserId; // Update with the new crew member's userId
    assignedData.name = newName; // Update with the new crew member's name

    await assignedData.save(); // Save the changes

    res.status(200).json({ message: 'Assigned buses updated successfully', assignedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleRegisterUser,
  handleLoginUser,
  getDashboardCrewId,
  getDashboardManagerDetails,
  addCrewToDashBoard,
  deleteCrewToDashBoard,
  addNewBus,
  updateAssignedDb
};
