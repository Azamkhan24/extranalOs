const express = require('express');
const router = express.Router();
const contactUsController = require('../../controllers/userControllers/contactUsController');

// Route to handle creating a contact
router.post('/create', contactUsController.handleSendContact);

// Route to get all user contacts for the sales department
router.get('/details', contactUsController.getAllUserContacts);

// Route to soft delete a user by ID
router.put('/soft-delete/:id', contactUsController.softDeleteUser);

// Route to approve a user by ID
router.put('/approve/:id', contactUsController.approveUserById);

// Route to assign a contact to a user
router.put('/assign/:id', contactUsController.assignContact);

// Route to get assigned work for the logged-in user
router.get('/assigned-work', contactUsController.getAssignedWork);    

router.put('/reject/:id', contactUsController.rejectUserById);

// Route to handle both no response marking and follow-up
router.put('/no-response-or-follow-up/:id', contactUsController.handleNoResponseAndFollowUp);

// Route to mark a contact as "done"
router.put('/done/:id', contactUsController.markContactAsDone);

// Add this in the routes file (e.g., contactRoutes.js)
router.get('/successful-leads', contactUsController.getSuccessfulLeads);


router.get('/successful-leads-onBoard', contactUsController.getSuccessfulLeadsByOnboarding);

router.get('/getContactUsById/:id',  contactUsController.getContactUsById);
module.exports = router;
