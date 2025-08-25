const express = require('express');
const router = express.Router();

const jwtMiddleware = require('../middlewares/jwtMiddleware');
const controller = require('../controllers/userController');
const challengeController = require('../controllers/challengeController');

router.post('/', controller.createNewUser);
router.get('/', controller.readAllUser);
router.get('/:id', jwtMiddleware.verifyToken, controller.readUserById);
router.put('/:id', jwtMiddleware.verifyToken, controller.updateUserById);

router.get('/:id/equipment-available-purchase', controller.readEquipmentAvailablePurchase);
router.get('/:id/players', controller.readPlayerByUserID);
router.get('/:id/challenge', challengeController.readChallengeDoneByUserId);
router.put('/:id/challenge/:complete_id', challengeController.updateChallengeNotes);

module.exports = router;