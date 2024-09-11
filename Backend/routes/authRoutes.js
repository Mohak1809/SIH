const express = require('express');
const router = express.Router();
const { handleRegisterUser, getDashboardManagerDetails, handleLoginUser, getDashboardCrewId, addCrewToDashBoard, deleteCrewToDashBoard, addNewBus ,updateAssignedDb} = require('../controllers/authController');
const { authMiddleware, managerAuthMiddleware } = require('../middlewares/authMiddleware');

// Public endpoints
router.post('/register', handleRegisterUser);
router.post('/login', handleLoginUser);

// Protected endpoints
router.get('/dashboard-manager', authMiddleware, managerAuthMiddleware, getDashboardManagerDetails);
router.get('/dashboard-crew/:id', authMiddleware, getDashboardCrewId);
router.get('/bus-data/', getDashboardManagerDetails);
router.post('/add-bus', authMiddleware, addNewBus);

router.post('/dashboard-manager/add-crew', authMiddleware, managerAuthMiddleware, addCrewToDashBoard);
router.delete('/dashboard-manager/delete-crew', authMiddleware, managerAuthMiddleware, deleteCrewToDashBoard);

// PATCH route to update the assigned buses for a crew member
router.patch('/assigneddb/:userId', authMiddleware, managerAuthMiddleware, updateAssignedDb);
module.exports = router;
