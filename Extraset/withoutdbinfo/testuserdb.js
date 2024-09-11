const mongoose = require('mongoose');
const User = require('../../Backend/models/User'); // Adjust the path to where your User model is located

// MongoDB connection URL
const MONGO_URI = 'mongodb+srv://vanshaggrawal1:icWByhsiMxhAifYV@cluster0.rho0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to your MongoDB database using the provided URI
mongoose.connect(MONGO_URI, {
})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Function to find a user by username (id)
const findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ id: username });
    if (user) {
      console.log('User found:', user);
    } else {
      console.log('User not found');
    }
  } catch (err) {
    console.error('Error finding user:', err);
  }
};

// Search for the user with username 'DTC456ABC'
findUserByUsername('DTC598NKZ');
