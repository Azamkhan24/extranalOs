const express = require('express');
const ecomloginUser = require('../../controllers/Ecommerce/eCommerceController')


const router = express.Router();


router.post('/login',ecomloginUser);


module.exports = router;


