const express = require('express');
 
const router = express.Router();
const {createItem, getAllItem, modifyItem, deleteItem,getItemById} = require('../../controllers/financeControllers/itemController')
 
router.post('/create', createItem);
router.get('/get-all-item',getAllItem);
router.patch('/modify/:id', modifyItem);
router.delete('/delete/:id', deleteItem);
router.get('/get-item/:id',getItemById);
 
 
module.exports =  router;