const mongoose = require('mongoose');
const connectionCache = {}; // Connection cache to store organization-specific DB connections
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI; // Make sure to configure your MongoDB Atlas URI
const AccountSchema = require('../../model/financeModel/accountsModel');
const GeneralConfig = require('../../model/configModel/generalConfigModel'); 


const createAccount = async (req, res) => {
  const orgDbName = req.cookies.dbConnection; // Assuming organization DB name is passed in request body
  try {
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
    const Account = connectionCache[orgDbName].model('Accounts', AccountSchema);
    const ConfigModel = connectionCache[orgDbName].model('GeneralConfig', GeneralConfig);

const config = await ConfigModel.findOne();

 let alias = req.body.alias;

   // Handle multiple account aliases if enabled in configuration
    if (config.accountConfig?.multipleAccountAliases) {
      if (Array.isArray(req.body.alias)) {
        alias = req.body.alias;
      } else {
        return res.status(400).json({ message: 'Alias should be an array when multiple aliases are enabled.' });
      }
    } else {
      alias = req.body.alias;
    }

    // Check if the alias is already in use
    const aliasExists = await Account.findOne({ alias });
    if (aliasExists) {
      return res.status(400).json({ message: 'Alias is already in use.' });
    }

    // Common data for all groups
    const commonAccountData = {
      group: req.body.group,
      name: req.body.name,
      alias, // Dynamic alias handling
      printName: req.body.printName,
      opening_balance: req.body.opening_balance,
    };

    // Group-specific logic
    switch (req.body.group) {
      case 'Sundry Debtors':
      case 'Sundry Creditors':
        // Validate and include specific fields for Sundry Debtors and Sundry Creditors
        if (req.body.registrationType && !req.body.gstin) {
          return res.status(400).json({ message: 'GSTIN is required for Sundry Debtors and Creditors.' });
        }
        if ((req.body.constitutions_of_bussiness === "Private Limited Company" || req.body.constitutions_of_bussiness === 'Public Limited Company') && !req.body.cin) {
          return res.status(400).json({ message: 'CIN is required for Private and Public' });
        }
        if (req.body.name && req.body.name.substring(req.body.name.length - 3) === 'LLP' && !req.body.llp) {
          return res.status(400).json({ message: 'LLPIN is required' });
        }

        commonAccountData.registrationType = req.body.registrationType;
        commonAccountData.gstin = req.body.gstin;
        commonAccountData.constitutions_of_bussiness = req.body.constitutions_of_bussiness;
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.additionalPlaceOfAddress = req.body.additionalPlaceOfAddress;
        commonAccountData.bank = req.body.bank;
        commonAccountData.email = req.body.email;
        commonAccountData.contact_no = req.body.contact_no;
        commonAccountData.alternative_contact_no = req.body.alternative_contact_no;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.pan = req.body.pan;
        commonAccountData.iec = req.body.iec;
        commonAccountData.tan = req.body.tan;
        commonAccountData.udyam_no = req.body.udyam_no;
        commonAccountData.cin = req.body.cin;
        commonAccountData.llpin = req.body.llpin;
        commonAccountData.attachments = {
          cancled_cheque: req.body.cancled_cheque,
          gstin_certificate: req.body.gstin_certificate,
          others: req.body.others,
        };
        break;

      case 'Bank Account':
      case 'Bank O/D Account':
        // Bank Accounts need specific fields like Internet Banking details
        if (!req.body.gstin) {
          return res.status(400).json({ message: 'GSTIN is required for Bank Accounts.' });
        }
        commonAccountData.registrationType = req.body.registrationType;
        commonAccountData.gstin = req.body.gstin;
        commonAccountData.constitutions_of_bussiness = req.body.constitutions_of_bussiness;
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.additionalPlaceOfAddress = req.body.additionalPlaceOfAddress;
        commonAccountData.bank = req.body.bank;
        commonAccountData.email = req.body.email;
        commonAccountData.contact_no = req.body.contact_no;
        commonAccountData.alternative_contact_no = req.body.alternative_contact_no;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.pan = req.body.pan;
        commonAccountData.tan = req.body.tan;
        commonAccountData.cin = req.body.cin;
        commonAccountData.llpin = req.body.llpin;
        commonAccountData.attachments = req.body.attachments;
        break;

      case 'Capital Account':
        commonAccountData.constitutions_of_bussiness = req.body.constitutions_of_bussiness; // required
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress; // address instead of principal address
        commonAccountData.bank = req.body.bank;
        commonAccountData.email = req.body.email;
        commonAccountData.contact_no = req.body.contact_no;
        commonAccountData.alternative_contact_no = req.body.alternative_contact_no;
        commonAccountData.contact_person = req.body.contact_person
        commonAccountData.pan = req.body.pan;
        commonAccountData.tan = req.body.tan;
        commonAccountData.udyam_no = req.body.udyam_no;
        commonAccountData.cin = req.body.cin;
        commonAccountData.llpin = req.body.llpin;
        commonAccountData.attachments = {
          cancled_cheque: req.body.cancled_cheque,
          others: req.body.others,
        };
        break;

      case 'Current Assets':
      case 'Current Liabilities':
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress; // address instead of principal address
        commonAccountData.bank = req.body.bank
        commonAccountData.pan = req.body.pan;
        commonAccountData.tan = req.body.tan;
        break;

      case 'Duties & Taxes':
        // Duties and Taxes need a type of tax field
        if (!req.body.type_of_tax) {
          return res.status(400).json({ message: 'Type of tax is required for Duties & Taxes.' });
        }
        commonAccountData.type_of_tax = req.body.type_of_tax;
        break;

      case 'Income (Direct)':
      case 'Income (Indirect)':
      case 'Expenses (Direct)':
      case 'Expenses (Indirect)':
        // Income and Expenses groups require the type of supply
        if (!req.body.type_of_supply) {
          return res.status(400).json({ message: 'Type of supply is required for Income and Expenses.' });
        }
        commonAccountData.type_of_supply = req.body.type_of_supply;
        break;

      case 'Fixed Assets':
        // Fixed Assets require depreciation methods and rates
        if (!req.body.method_of_depreciation || !req.body.rate_of_depreciation) {
          return res.status(400).json({ message: 'Depreciation method and rate are required for Fixed Assets.' });
        }
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.attachments = {
          others: req.body.others,
        };
        commonAccountData.method_of_depreciation = req.body.method_of_depreciation;
        commonAccountData.rate_of_depreciation = req.body.rate_of_depreciation;
        break;

      case 'Investments':
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.attachments = {
          others: req.body.others,
        };
        break;

      case 'Loans & Advances (Asset)':
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.tan = req.body.tan;
        commonAccountData.pan = req.body.pan;
        commonAccountData.attachments = {
          others: req.body.others,
        };
        break;

      case 'Loans (Liability)':
        // Loans need interest type and rate
        commonAccountData.bank = req.body.bank;
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.tan = req.body.tan;
        commonAccountData.pan = req.body.pan;
        commonAccountData.attachments = {
          others: req.body.others,
        };

        break;

      case 'Secured Loan':
        // Loans need interest type and rate
        if (!req.body.type_of_interest || !req.body.interest_rate) {
          return res.status(400).json({ message: 'Interest type and rate are required for loan accounts.' });
        }
        commonAccountData.bank = req.body.bank;
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.tan = req.body.tan;
        commonAccountData.pan = req.body.pan;
        commonAccountData.attachments = {
          others: req.body.others,
        };
        commonAccountData.type_of_interest = req.body.type_of_interest;
        commonAccountData.interest_rate = req.body.interest_rate;
        break;

      case 'Unsecured Loan':
        // Loans need interest type and rate
        if (!req.body.type_of_interest || !req.body.interest_rate) {
          return res.status(400).json({ message: 'Interest type and rate are required for loan accounts.' });
        }
        commonAccountData.constitutions_of_bussiness = req.body.constitutions_of_bussiness;
        commonAccountData.bank = req.body.bank;
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.tan = req.body.tan;
        commonAccountData.pan = req.body.pan;
        commonAccountData.attachments = {
          others: req.body.others,
        };
        commonAccountData.type_of_interest = req.body.type_of_interest;
        commonAccountData.interest_rate = req.body.interest_rate;
        break;


      case 'Non Current Liabilities':
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.pan = req.body.pan;
        commonAccountData.tan = req.body.tan;
        commonAccountData.bank = req.body.bank;
        break;


      case 'Securities & Deposit (Assets)':
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.tan = req.body.tan;
        commonAccountData.pan = req.body.pan;
        break;

      default:
        // Other groups do not need specific validation
        break;
    }

    // Create new account based on common data + specific group logic
    const newAccount = new Account(commonAccountData);

    // Save the new account document to the organization's database
    const savedAccount = await newAccount.save();

    res.status(200).json({
      message: 'Account created successfully',
      account: savedAccount,
    });
  } catch (error) {
    console.log('Error response:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};




// Get All Accounts Controller
const getAccountAll = async (req, res) => {
  try {
    const orgDbName = req.cookies.dbConnection;
    if (!orgDbName) {
      return res.status(401).json({ message: 'Please login First' });
    }

    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;
      console.log(`Successfully connected to the organization's database: ${orgDbName}`);
    }

    const Account = connectionCache[orgDbName].model('Accounts', AccountSchema);
    const accounts = await Account.find({ isDelete: { $ne: true } });
    res.status(200).json({
      message: 'All Accounts',
      accounts,
    });
  } catch (error) {
    console.log('Error response:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


const modifyAccount = async (req, res) => {
  try {
    const orgDbName = req.cookies.dbConnection;
    const accountId = req.params.id;

    if (!orgDbName) {
      return res.status(401).json({ message: 'Please login First' });
    }

    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;
      console.log(`Successfully connected to the organization's database: ${orgDbName}`);
    }

    const Account = connectionCache[orgDbName].model('Accounts', AccountSchema);

 const ConfigModel = connectionCache[orgDbName].model('GeneralConfig', GeneralConfig);

    // Get the general configuration for the organization
    const config = await ConfigModel.findOne();

    // Begin session for transaction
    const session = await connectionCache[orgDbName].startSession();
    session.startTransaction();

    if (config.accountConfig?.multipleAccountAliases) {
      if (Array.isArray(req.body.alias)) {
        alias = req.body.alias;
      } else {
        return res.status(400).json({ message: 'Alias should be an array when multiple aliases are enabled.' });
      }
    } else {
      alias = req.body.alias;
    }

    // Check if the alias is already in use
    const aliasExists = await Account.findOne({ alias });
    if (aliasExists) {
      return res.status(400).json({ message: 'Alias is already in use.' });
    }

    // Group-specific logic
    switch (req.body.group) {
      case 'Sundry Debtors':
      case 'Sundry Creditors':
        if (req.body.registrationType && !req.body.gstin) {
          return res.status(400).json({ message: 'GSTIN is required for Sundry Debtors and Creditors.' });
        }
        if ((req.body.constitutions_of_bussiness === "Private Limited Company" || req.body.constitutions_of_bussiness === 'Public Limited Company') && !req.body.cin) {
          return res.status(400).json({ message: 'CIN is required for Private and Public' });
        }
        if (req.body.name && req.body.name.substring(req.body.name.length - 3) === 'LLP' && !req.body.llp) {
          return res.status(400).json({ message: 'LLPIN is required' });
        }

        commonAccountData.registrationType = req.body.registrationType;
        commonAccountData.gstin = req.body.gstin;
        commonAccountData.constitutions_of_bussiness = req.body.constitutions_of_bussiness;
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.additionalPlaceOfAddress = req.body.additionalPlaceOfAddress;
        commonAccountData.bank = req.body.bank;
        commonAccountData.email = req.body.email;
        commonAccountData.contact_no = req.body.contact_no;
        commonAccountData.alternative_contact_no = req.body.alternative_contact_no;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.pan = req.body.pan;
        commonAccountData.iec = req.body.iec;
        commonAccountData.tan = req.body.tan;
        commonAccountData.udyam_no = req.body.udyam_no;
        commonAccountData.cin = req.body.cin;
        commonAccountData.llpin = req.body.llpin;
        commonAccountData.canceled_cheque = req.body.canceled_cheque;
        commonAccountData.gstin_certificate = req.body.gstin_certificate;
        commonAccountData.others = req.body.others;
        break;

      case 'Bank Account':
      case 'Bank O/D Account':
        if (!req.body.gstin) {
          return res.status(400).json({ message: 'GSTIN is required for Bank Accounts.' });
        }
        commonAccountData.registrationType = req.body.registrationType;
        commonAccountData.gstin = req.body.gstin;
        commonAccountData.constitutions_of_bussiness = req.body.constitutions_of_bussiness;
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.additionalPlaceOfAddress = req.body.additionalPlaceOfAddress;
        commonAccountData.bank = req.body.bank;
        commonAccountData.email = req.body.email;
        commonAccountData.contact_no = req.body.contact_no;
        commonAccountData.alternative_contact_no = req.body.alternative_contact_no;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.pan = req.body.pan;
        commonAccountData.tan = req.body.tan;
        commonAccountData.cin = req.body.cin;
        commonAccountData.llpin = req.body.llpin;
        commonAccountData.canceled_cheque = req.body.canceled_cheque;
        commonAccountData.gstin_certificate = req.body.gstin_certificate;
        commonAccountData.others = req.body.others;
        break;

      case 'Capital Account':
        commonAccountData.constitutions_of_bussiness = req.body.constitutions_of_bussiness;
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.bank = req.body.bank;
        commonAccountData.email = req.body.email;
        commonAccountData.contact_no = req.body.contact_no;
        commonAccountData.alternative_contact_no = req.body.alternative_contact_no;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.pan = req.body.pan;
        commonAccountData.tan = req.body.tan;
        commonAccountData.udyam_no = req.body.udyam_no;
        commonAccountData.cin = req.body.cin;
        commonAccountData.llpin = req.body.llpin;
        commonAccountData.canceled_cheque = req.body.canceled_cheque;
        commonAccountData.others = req.body.others;
        break;

      case 'Current Assets':
      case 'Current Liabilities':
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.bank = req.body.bank;
        commonAccountData.pan = req.body.pan;
        commonAccountData.tan = req.body.tan;
        break;

      case 'Duties & Taxes':
        if (!req.body.type_of_tax) {
          return res.status(400).json({ message: 'Type of tax is required for Duties & Taxes.' });
        }
        commonAccountData.type_of_tax = req.body.type_of_tax;
        break;

      case 'Income (Direct)':
      case 'Income (Indirect)':
      case 'Expenses (Direct)':
      case 'Expenses (Indirect)':
        if (!req.body.type_of_supply) {
          return res.status(400).json({ message: 'Type of supply is required for Income and Expenses.' });
        }
        commonAccountData.type_of_supply = req.body.type_of_supply;
        break;

      case 'Fixed Assets':
        if (!req.body.method_of_depreciation || !req.body.rate_of_depreciation) {
          return res.status(400).json({ message: 'Depreciation method and rate are required for Fixed Assets.' });
        }
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.others = req.body.others;
        commonAccountData.method_of_depreciation = req.body.method_of_depreciation;
        commonAccountData.rate_of_depreciation = req.body.rate_of_depreciation;
        break;

      case 'Investments':
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.others = req.body.others;
        break;

      case 'Loans & Advances (Asset)':
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.tan = req.body.tan;
        commonAccountData.pan = req.body.pan;
        commonAccountData.others = req.body.others;
        break;

      case 'Loans (Liability)':
      case 'Secured Loan':
      case 'Unsecured Loan':
        if (!req.body.type_of_interest || !req.body.interest_rate) {
          return res.status(400).json({ message: 'Interest type and rate are required for loan accounts.' });
        }
        commonAccountData.bank = {
          bank_name: req.body.bank_name,
          bank_account_number: req.body.bank_account_number,
          ifsc_code: req.body.ifsc_code,
        };
        commonAccountData.principalPlaceOfAddress = req.body.principalPlaceOfAddress;
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.tan = req.body.tan;
        commonAccountData.pan = req.body.pan;
        commonAccountData.others = req.body.others;
        commonAccountData.type_of_interest = req.body.type_of_interest;
        commonAccountData.interest_rate = req.body.interest_rate;
        break;

      case 'Securities & Deposit (Assets)':
        commonAccountData.contact_person = req.body.contact_person;
        commonAccountData.tan = req.body.tan;
        commonAccountData.pan = req.body.pan;
        break;

      default:
        break;
    }

    const updatedAccount = await Account.findOneAndUpdate(
      { _id: accountId, isDelete: { $ne: true } }, // Ensure account is not soft deleted
      commonAccountData,
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({
      message: 'Account updated successfully',
      account: updatedAccount,
    });
  } catch (error) {
    console.log('Error response:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


// Delete Account Controller pending
const deleteAccount = async (req, res) => {
  try {
    const orgDbName = req.cookies.dbConnection;
    const accountId = req.params.id;

    if (!orgDbName) {
      return res.status(401).json({ message: 'Please login First' });
    }

    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;
      console.log(`Successfully connected to the organization's database: ${orgDbName}`);
    }

    const Account = connectionCache[orgDbName].model('Accounts', AccountSchema);

    const deletedAccount = await Account.findByIdAndDelete(accountId);

    if (!deletedAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({
      message: 'Account deleted successfully',
      account: deletedAccount,
    });
  } catch (error) {
    console.log('Error response:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const getAccountById = async (req, res) => {
  try {
    const accountId = req.params.id;
    const orgDbName = req.cookies.dbConnection;

    if (!orgDbName) {
      return res.status(401).json({ message: 'Please login First' });
    }

    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;
      console.log(`Successfully connected to the organization's database: ${orgDbName}`);
    }

    const Account = connectionCache[orgDbName].model('Accounts', AccountSchema);

    // Fetch the account only if it is not soft deleted
    const account = await Account.findOne({ _id: accountId, isDelete: { $ne: true } });

    if (!account) {
      return res.status(404).json({ message: 'Account not found or is soft deleted' });
    }

    res.status(200).json({
      message: 'Account fetched successfully',
      account: account
    });
  } catch (error) {
    console.log('Error response:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


const getAccountByGroup = async (req, res) => {
  try {
    const group = decodeURIComponent(req.params.group); // Handles group with spaces or special characters
    const orgDbName = req.cookies.dbConnection;

    if (!orgDbName) {
      return res.status(401).json({ message: 'Please login First' });
    }

    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;
      console.log(`Successfully connected to the organization's database: ${orgDbName}`);
    }

    const Account = connectionCache[orgDbName].model('Accounts', AccountSchema);

    const accounts = await Account.find({ group: group });
    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ message: 'No accounts found for this group' });
    }

    res.status(200).json({
      message: `Accounts for group ${group} fetched successfully`,
      accounts: accounts,
    });
  } catch (error) {
    console.log('Error getAccountByGroup', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get Account by Name (optional)
const getAccountByName = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: 'Please login First' });
  }

  try {
    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;
      console.log(`Successfully connected to the organization's database: ${orgDbName}`);
    }
    const Account = connectionCache[orgDbName].model('Accounts', AccountSchema);

    const { name } = req.params; // Assuming the account name is passed as a URL parameter
    const account = await Account.findOne({ name });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({
      message: 'Account fetched successfully',
      account,
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  createAccount,
  getAccountAll,
  modifyAccount,
  deleteAccount,
  getAccountByGroup,
  getAccountById,
  getAccountByName
};