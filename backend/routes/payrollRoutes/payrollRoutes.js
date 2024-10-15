const express = require('express');
const payrollloginUser = require('../../controllers/payrollControllers/payrollController')


const router = express.Router();


router.post('/login',payrollloginUser);


module.exports = router;