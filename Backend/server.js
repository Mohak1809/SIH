const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const authMiddleware= require('./middlewares/authMiddleware');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const connectMongodb=require("./db/connection")

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', // Update this to match your frontend URL
    credentials: true, // If you're sending cookies
    }));
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
 
// Database connection
connectMongodb(process.env.MONGO_URI);

  
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




//const express = require('express');
const path = require('path');
// const app = express();
const port = 3000;

// Serve JSON data
app.get('/api/crewMembers', (req, res) => {
    const filePath = path.join(__dirname, 'mockCrewMembers.json');
    res.sendFile(filePath);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


