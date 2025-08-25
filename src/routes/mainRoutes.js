const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const playerscontroller = require('../controllers/playersController');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

const userRoutes = require('./userRoutes');
const challengeRoutes = require('./challengeRoutes');
const equipmentRoutes = require('./equipmentRoutes');
const classRoutes = require('./classRoutes');
const playersRoutes = require('./playersRoutes');
const enemyRoutes = require('./enemyRoutes');
const questsRoutes = require('./questsRoutes');
const inventoryRoutes = require('./inventoryRoutes');

router.use("/user", userRoutes);
router.use("/challenges", challengeRoutes);
router.use("/equipment", equipmentRoutes);
router.use("/class", classRoutes);
router.use("/player", playersRoutes);
router.use("/enemy", enemyRoutes);
router.use("/quests", questsRoutes);
router.use("/inventory", inventoryRoutes);

router.post("/login", 
    userController.login, 
    bcryptMiddleware.comparePassword, 
    jwtMiddleware.generateToken, 
    jwtMiddleware.sendToken);
    
router.post("/register", 
    userController.checkUsernameOrEmailExist, 
    bcryptMiddleware.hashPassword, 
    userController.register, 
    jwtMiddleware.generateToken, 
    jwtMiddleware.sendToken);

router.get("/topplayers", playerscontroller.getTopTenPlayers)

module.exports = router;