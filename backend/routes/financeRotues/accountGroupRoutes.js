const express = require('express');
const balanceSheetController = require('../../controllers/financeControllers/accountgroupController'); // Adjust the path as necessary
 
const router = express.Router();
 
// Create a new balance sheet entry
router.post('/create-group', balanceSheetController.createGroup);
 
router.patch('/group-update', balanceSheetController.updateGroupSheetByName)
// Get a single balance sheet entry by ID
router.get('/get-all-group', balanceSheetController.getGroupSheet);
 
router.delete('/group-delete', balanceSheetController.deleteGroupByName);
 
module.exports = router;