const express = require('express');

const router = express.Router();

const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.readAllInventory);
router.get('/user/:id', inventoryController.readInventoryByUserId);
router.get('/:id', inventoryController.readInventoryById);

module.exports = router;