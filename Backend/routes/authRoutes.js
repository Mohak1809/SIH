const express = require('express');
const router = express.Router();
const { handleRegisterUser, handleLoginUser, getDashboardCrewId, addCrewToDashBoard , deleteCrewToDashBoard, addNewBus} = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

// Registration endpoint
router.post('/register', handleRegisterUser);

// Login endpoint
router.post('/login', handleLoginUser);


router.get('/dashboard-manager', getDashboardManagerDetails, verifyToken );

router.get('/dashboard-crew/:id', getDashboardCrewId);
router.post('/add-bus', addNewBus);

router.post('/dashboard-manager/add-crew', addCrewToDashBoard);
router.delete('/dashboard-manager/delete-crew', deleteCrewToDashBoard);

module.exports = router;
