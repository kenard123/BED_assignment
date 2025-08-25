const express = require('express');

const router = express.Router();

const classcontroller = require('../controllers/classController');
router.get('/', classcontroller.readAllClass);
router.get('/:number', classcontroller.readClassByNumber);

module.exports = router;