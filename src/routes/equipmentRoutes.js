const express = require('express');

const router = express.Router();

const equipmentcontroller = require('../controllers/equipmentController');
router.post('/', equipmentcontroller.forgingEquipment);
router.delete('/:id', equipmentcontroller.deleteEquipmentByID);
router.get('/', equipmentcontroller.readAllEquipment);
router.get('/:id', equipmentcontroller.readEquipmentByID);

router.post('/purchase', equipmentcontroller.purchaseEquipment);

module.exports = router;