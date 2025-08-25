const express = require('express');

const router = express.Router();

const enemyController = require('../controllers/enemyController');
router.get('/', enemyController.readAllEnemy);
router.get('/:number', enemyController.readEnemyByNumber);

module.exports = router;