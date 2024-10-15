const {
  createAccount,
  getAccountAll,
  modifyAccount,
  deleteAccount,
  getAccountByGroup,
  getAccountById,
  getAccountByName
} = require('../../controllers/financeControllers/accountController');
 
const express = require('express');
const router = express.Router();
 
// Route to create a new account
router.post('/create-account', createAccount);
 
// Route to get all accounts
router.get('/get-all-accounts', getAccountAll);
 
// Route to modify an existing account by ID
router.patch('/modify/:id', modifyAccount);
 
// Route to delete an account by ID
router.delete('/delete-account/:id', deleteAccount);
 
// Route to get accounts by group (handles group with spaces)
router.get('/get-accounts-by-group/:group', getAccountByGroup);
 
// Route to get an account by its ID
router.get('/get-account-by-id/:id', getAccountById);
 
// Route to get accounts by name
router.get('/get-account-by-name/:name', getAccountByName);
 
module.exports = router;
 