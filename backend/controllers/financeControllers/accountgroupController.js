const BalanceSheetSchema = require('../../model/financeModel/accountGroupModel'); // Adjust path to your model
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;
const mongoose = require('mongoose');

// Controller function to insert balance sheet data
 
const connectionCache = {};
 
const createGroup = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;
 
  if (!orgDbName) {
    return res.status(401).json({ message: 'Please login First' });
  }
 
  // Check if the connection for the organization exists in the cache, if not, create a new one
  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
 
    console.log(`Successfully connected to the organization's database: ${orgDbName}`);
  }
 
  // Retrieve the account model for the specific organization's database
  const Account = connectionCache[orgDbName].model('Account_Grp', BalanceSheetSchema);
 
  const session = await connectionCache[orgDbName].startSession(); // Start session here
  session.startTransaction(); // Start a transaction
 
  try {
    const {
      name,
      alias,
      primary,
      Nature_Of_Group,
      Under
    } = req.body;
 
    // Validate primary and Under fields
    if (primary && Under) {
      return res.status(400).json({ message: "The 'Under' field should not be set if 'primary' is true." });
    }
 
    // Validate Nature_Of_Group if primary is true
    if (primary && !['Liabilities', 'Assets', 'Income', 'Expenses'].includes(Nature_Of_Group)) {
      return res.status(400).json({ message: "Nature_Of_Group must be one of 'Liabilities', 'Assets', 'Income', 'Expenses' if primary is true." });
    }
 
    // Check for duplicate account name
    const existingAccount = await Account.findOne({ name }).session(session);
    if (existingAccount) {
      await session.abortTransaction(); // Abort transaction on error
      session.endSession(); // End the session
      return res.status(400).json({ message: 'An account with this name already exists.' });
    }
 
    // Handle 'Under' field if primary is false
    if (!primary) {
      const underExists = await Account.findOne({ name: Under }).session(session);
      if (!underExists) {
        await session.abortTransaction(); // Abort transaction on error
        session.endSession(); // End the session
        return res.status(400).json({ message: `'Under' must reference an existing account in the database.` });
      }
 
      // Update the referenced account
      underExists.dependency = underExists.dependency+1;
      await underExists.save({ session }); // Save with the transaction session
    }
    
    // Create and save the new account
    const newAccount = new Account({
      name,
      alias,
      primary,
      Nature_Of_Group,
      Under
    });
 
    const savedAccount = await newAccount.save({ session }); // Save with the transaction session
 
    await session.commitTransaction(); // Commit the transaction
    session.endSession(); // End the session
 
    // Respond with success
    res.status(201).json({
      message: 'Account created successfully',
      data: savedAccount
    });
 
  } catch (error) {
    await session.abortTransaction(); // Abort transaction on error
    console.error('Error inserting balance sheet:', error);
    res.status(500).json({ message: 'Error inserting balance sheet', error });
  } finally {
    session.endSession(); // Ensure session is ended
  }
};
 
// Controller to get a specific balance sheet by ID
const getGroupSheet = async (req, res) => {
  try {
    // Access the organization database name from cookies
    const orgDbName = req.cookies.dbConnection;
    
    if (!orgDbName) {
      return res.status(401).json({ message: "Please login First" });
    }
 
    // Check if the connection for the organization exists in the cache, if not, create a new one
    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;
 
      // Log the successful connection to the organization database
      console.log(`Successfully connected to the organization's database: ${orgDbName}`);
    }
 
    // Retrieve the account model for the specific organization's database
    const Account = connectionCache[orgDbName].model('Account_Grp', BalanceSheetSchema);
 
    // Fetch all balance sheets with only the name and Under fields
    const sheets = await Account.find({}, 'name alias Under'); // Use a more explicit select
 
    if (sheets.length === 0) {
      return res.status(404).json({ message: 'No balance sheets found.' });
    }
 
    // Respond with the selected fields of balance sheets
    res.status(200).json({
      message: 'Balance sheets retrieved successfully',
      data: sheets,
    });
  } catch (error) {
    console.error('Error fetching balance sheets:', error);
    res.status(500).json({ message: 'Error fetching balance sheets', error });
  }
};
 
 
const updateGroupSheetByName = async (req, res) => {
  try {
    const { previous_name, name } = req.body;
    const orgDbName = req.cookies.dbConnection;
    
    if (!orgDbName) {
      return res.status(401).json({ message: "Please login First" });
    }

    // Check if the connection for the organization exists in the cache, if not, create a new one
    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;

      console.log(`Successfully connected to the organization's database: ${orgDbName}`);
    }

    // Retrieve the account model for the specific organization's database
    const Account = connectionCache[orgDbName].model('Account_Grp', BalanceSheetSchema);

    // Find the account by previous name
    const sheet = await Account.findOne({ name: previous_name });
    if (!sheet || sheet.isPredefind) {
      return res.status(400).json({ message: 'This Group is not changeable' });
    }

    // Check for duplicate account name
    const check = await Account.findOne({ name: name });
    if (check) {
      return res.status(400).json({ message: 'This Group/Subgroup already exists. Please use another name.' });
    }

    // Update all dependent groups with the new name
    const dependents = await Account.find({ Under: previous_name });
    for (let dependent of dependents) {
      dependent.Under = name;
      await dependent.save(); // Ensure each dependent is saved with the new Under name
    }

    // Update the current group name
    sheet.name = name;
    const updatedBalanceSheet = await sheet.save();

    // Respond with success
    res.status(200).json({
      message: 'Balance sheet updated successfully',
      data: updatedBalanceSheet
    });

  } catch (error) {
    console.error('Error updating balance sheet:', error);
    res.status(500).json({ message: 'Error updating balance sheet', error });
  }
};

 
 
const deleteGroupByName = async (req, res) => {
 
  const orgDbName = req.cookies.dbConnection;
  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }
 
  // Check if the connection for the organization exists in the cache, if not, create a new one
  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    connectionCache[orgDbName] = orgConnection;
 
    console.log(`Successfully connected to the organization's database: ${orgDbName}`);
  }
 
  // Start a new session and transaction after establishing the connection
  const Account = connectionCache[orgDbName].model('Account_Grp', BalanceSheetSchema);
  const session =await connectionCache[orgDbName].startSession();
  session.startTransaction();
 
  try {
    const { name } = req.body; // Assuming name is passed as a URL parameter
 
    // Find the account by name
    const account = await Account.findOne({ name }).session(session);
   
    if (!account || account.isPredefind) {
      await session.abortTransaction(); // Abort transaction if account not found
      return res.status(404).json({ message: 'Account not found or not changable' });
    }
 
    // Check if there are any dependencies
    if (account.dependency > 0) {
      await session.abortTransaction(); // Abort transaction if dependencies exist
      return res.status(400).json({ message: 'Cannot delete account with existing dependencies.' });
    }
 
    // Handle 'Under' account if it exists
    if (account.Under) {
      const underAccount = await Account.findOne({ name: account.Under }).session(session);
      if (!underAccount) {
        await session.abortTransaction(); // Abort if 'Under' account not found
        return res.status(404).json({ message: `'Under' account not found` });
      }
 
      // Decrease the dependency by 1
      underAccount.dependency = Math.max(0, underAccount.dependency - 1); // Ensure dependency does not go below 0
      await underAccount.save({ session }); // Save with the transaction session
    }
 
    // Delete the account
    await Account.deleteOne({ name }).session(session); // Delete with transaction
 
    await session.commitTransaction(); // Commit the transaction
    res.status(200).json({
      message: 'Account deleted successfully'
    });
 
  } catch (error) {
    await session.abortTransaction(); // Abort transaction on error
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting account', error });
  } finally {
    session.endSession(); // Ensure session is ended
  }
};
 
 
 
// Export all functions
module.exports = {
  createGroup,
  updateGroupSheetByName,
  getGroupSheet,
  deleteGroupByName,
};