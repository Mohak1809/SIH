const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const authMiddleware= require('./middlewares/authMiddleware');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const connectMongodb=require("./db/connection")

const app = express();

// Middleware
// app.use(cors({ origin: 'http://localhost:5173', // Update this to match your frontend URL
//     credentials: true, // If you're sending cookies
//     }));

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);
// Database connection
connectMongodb(process.env.MONGO_URI);

  
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
