const express = require('express');
const {orgControllers, getByPan,getAllOrg, getOrgByName, approveOrgById, getAllOrgUnapproved } = require('../../controllers/masterControllers/orgControllers')
const router = express.Router();


router.get('/',getAllOrg); //only 
router.post('/create', orgControllers); //sadmin  dept:{onboard, (admin , user)}
router.get('/get-unapproved',  getAllOrgUnapproved);

router.get('/getOrg/:orgName', getOrgByName);
router.post('/approveOrgById', approveOrgById);
router.get('/:pan',getByPan); //sAdmin  dept:{onboard, (admin , user)}



module.exports = router;


