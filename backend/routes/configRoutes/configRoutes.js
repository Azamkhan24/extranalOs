const express = require('express');
const {
  createOrUpdateConfig,
  getConfig,
  deleteConfig
} = require('../../controllers/configControllers/generalConfigContoller');

const router = express.Router();

// Route to create or update configuration
router.post('/create', createOrUpdateConfig);

// Route to get configuration by organizationId
router.get('/:organizationId', getConfig);

// Optional: Route to delete configuration
router.delete('/:organizationId', deleteConfig);

module.exports = router;