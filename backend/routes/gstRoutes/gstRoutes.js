const express = require('express');
const router = express.Router();
const { 
  enterGst, 
  
  getAllGst, 
  getGstById, 
  getGstHistory 
} = require('../../controllers/gstControllers/gstController');  // Assuming everything is now in the combined controller



// Route to enter or update GST data
router.post('/gst-details', enterGst);

// Route to fetch all GST data with streaming (get all GST users)
router.get('/getGst', getAllGst);

// Route to fetch a specific GST user by ID
router.get('/getGst/:id', getGstById);

// Route to fetch the version history of a specific GST user
router.get('/history/:gstin', getGstHistory);

module.exports = router;
