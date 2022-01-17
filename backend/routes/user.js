const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require('../middleware/rate-limit');
const userValidator = require('../middleware/userValidator');

router.post('/signup',userValidator, userCtrl.signup);
router.post('/login',userValidator, rateLimit, userCtrl.login);

module.exports = router;