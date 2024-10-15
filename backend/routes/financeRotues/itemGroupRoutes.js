const express = require('express');
const router = express.Router();
const {createGroup, getAllItemGroup,modifyItemGroup, deleteItemGroup, getGroupSpecification, getGroupById, getSpecification,getAllGroupDependent} = require('../../controllers/financeControllers/itemGroupController')
 
router.post('/create',createGroup);
router.get('/getAll', getAllItemGroup);
 
router.get('/get-specific-group', getGroupSpecification);
router.get('/getby-group/:id',getGroupById)
router.patch('/modifyById/:id', modifyItemGroup);
router.delete('/delete/:id',  deleteItemGroup);
router.get('/get-specification/:id', getSpecification);
router.get('/get-depedent-group/:name', getAllGroupDependent);
module.exports = router;