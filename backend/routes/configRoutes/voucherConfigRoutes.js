const express = require("express");
const {
  createOrUpdateVoucherConfig
} = require("../../controllers/configControllers/voucherConfigController");

const router = express.Router();

// Route to create or update configuration
router.post("/create", createOrUpdateVoucherConfig);



module.exports = router;