const express = require('express');
const {createUserOS, approve,loginUserOS,logoutUserOS,getAll, getAllApprovedUser, resignationApproval, getUserDetails, getUserById} =  require('../../controllers/internalControllers/osInternalController.js');
const {approveMiddleware}= require('../../middleware/internalMiddleware/authenticateJWT.js');
const authToken = require('../../middleware/internalMiddleware/authMiddleWare.js')

const authenticateUser = require('../../middleware/internalMiddleware/authenticateUser.js')



const router =  express.Router();

router.post('/create', createUserOS );
router.post('/login',loginUserOS);
router.get('/user-details', authenticateUser, getUserDetails);
router.get('/logout',logoutUserOS);
router.get('/getAll', getAll);
router.get('/getAllApproved', getAllApprovedUser);
router.post('/resign', approveMiddleware, resignationApproval);
router.get('/getUser/:id', getUserById);
router.get('/approve/:id' ,approveMiddleware, approve);


module.exports  = router;