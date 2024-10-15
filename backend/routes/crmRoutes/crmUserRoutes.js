const express = require('express');
const crmloginUser = require('../../controllers/crmControllers/crmController')
const router = express.Router();


router.post('/login',crmloginUser);


module.exports = router;
