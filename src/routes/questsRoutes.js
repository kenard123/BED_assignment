const express = require('express');

const router = express.Router();

const questsController = require('../controllers/questsController');
const playerController = require('../controllers/playersController');

router.get('/', questsController.readAllQuests);
router.get('/:id', questsController.readQuestsById);
router.post('/:id', questsController.createCompleteRecord, playerController.addQuestLevel);

module.exports = router;