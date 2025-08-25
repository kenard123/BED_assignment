const express = require('express');

const router = express.Router();

const playerscontroller = require('../controllers/playersController');
const equipmentcontroller = require('../controllers/equipmentController');

router.get('/', playerscontroller.readAllPlayers);
router.get('/:id', playerscontroller.readPlayerById);
router.post('/', playerscontroller.createPlayer);
router.delete('/:id', playerscontroller.deletePlayerById);

router.get('/:id/quest-available', playerscontroller.readQuestAvailable);
router.get('/:id/armor', playerscontroller.readArmorByPlayerID, equipmentcontroller.readEquipmentByID);
router.get('/:id/weapon', playerscontroller.readWeaponByPlayerID, equipmentcontroller.readEquipmentByID);
router.put('/:id', playerscontroller.wearEquipmentByID);
router.put('/:id/name', playerscontroller.editPlayerName);

module.exports = router;