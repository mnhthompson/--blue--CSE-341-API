
const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/tasks', require('./task'));


module.exports = router;