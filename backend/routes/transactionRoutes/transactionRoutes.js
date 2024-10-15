const express = require('express');
const router = express.Router();
const { createSales } = require('../../controllers/transactionControllers/transactController');

// Route to create a new sales transaction
router.post('/sales/create', createSales);

module.exports = router;
