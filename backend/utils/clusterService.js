const mongoose = require('mongoose');
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;
const orgMeta = require('../model/orgExternal/orgExternalMeta');
const count = require('../model/orgExternal/orgCount');
const userSchema = require('../model/orgExternal/User');
const BalanceSheetSchema = require('../model/financeModel/accountGroupModel')
const AccountSchema = require('../model/financeModel/accountsModel')
const TransactionSchema = require('../model/transactionModel/salesModel')
const itemSchema = require('../model/financeModel/itemModel');
const specificationSchema = require('../model/financeModel/specificationModel');
const itemGroupSchema = require('../model/financeModel/itemGroupModel');

const VoucherConfigSchema = require('../model/configModel/voucherConfigModel')
 
/**
 * Generate an organization ID based on initials of the organization's name
 * and a count that increments with each new organization.
 * @param {string} name - Name of the organization
 * @returns {Promise<string>} - The generated organization ID
 */
async function getInitials(name) {
  const words = name.split(" ");
  const initials = words.map(word => word[0].toUpperCase()).join(""); // Get initials
 
  // Update the count in the `orgCount` collection
  const updatedCount = await count.findOneAndUpdate(
    {},
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );
 
  // Generate orgId with initials and incrementing count
  const id = `${initials}-${updatedCount.count}`;
  return id;
}
 
/**
 * Creates a connection to an organization's database and defines schemas dynamically.
 * @param {string} organizationName - Name of the organization
 * @returns {Promise<Connection>} - Returns the mongoose connection object for the organization's database
 */
 
const accounts =[
  {
    "name": "Capital Account",
    "primary": true,
    "Nature_Of_Group": "Liabilities",
    "isPredefind":true
  },
  {
    "name": "Capital",
    "primary": false,
    "Under": "Capital Account",
    "isPredefind":true
  },
  {
    "name": "Surplus",
    "primary": false,
    "Under": "Capital Account",
    "isPredefind":true
  },
  {
    "name": "Non Current Liabilities",
    "primary": true,
    "Nature_Of_Group": "Liabilities",
    "isPredefind":true
  },
  {
    "name": "Secured Loan",
    "primary": false,
    "Under": "Non Current Liabilities",
    "isPredefind":true
  },
  {
    "name": "Unsecured Loan",
    "primary": false,
    "Under": "Non Current Liabilities",
    "isPredefind":true
  },
  {
    "name": "Other Non Current Liabilities",
    "primary": false,
    "Under": "Non Current Liabilities",
    "isPredefind":true
  },
  {
    "name": "Current Liabilities",
    "primary": true,
    "Nature_Of_Group": "Liabilities",
    "isPredefind":true
  },
  {
    "name": "Duties & Taxes",
    "primary": false,
    "Under": "Current Liabilities",
    "isPredefind":true
  },
  {
    "name": "Sundry Creditors",
    "primary": false,
    "Under": "Current Liabilities",
    "isPredefind":true
  },
  {
    "name": "Short Term Provisions",
    "primary": false,
    "Under": "Current Liabilities",
    "isPredefind":true
  },
  {
    "name": "Tax Payable",
    "primary": false,
    "Under": "Current Liabilities",
    "isPredefind":true
  },
  {
    "name": "Expenses Payable",
    "primary": false,
    "Under": "Current Liabilities",
    "isPredefind":true
  },
  {
    "name": "Loans & Advances (Liabilities)",
    "primary": false,
    "Under": "Current Liabilities",
    "isPredefind":true
  },
  {
    "name": "Fixed Assets",
    "primary": true,
    "Nature_Of_Group": "Assets",
    "isPredefind":true
  },
  {
    "name": "Investments",
    "primary": false,
    "Under": "Fixed Assets",
    "isPredefind":true
  },
  {
    "name": "Plant & Machinery",
    "primary": false,
    "Under": "Fixed Assets",
    "isPredefind":true
  },
  {
    "name": "Land & Building",
    "primary": false,
    "Under": "Fixed Assets",
    "isPredefind":true
  },
  {
    "name": "Vehicle",
    "primary": false,
    "Under": "Fixed Assets",
    "isPredefind":true
  },
  {
    "name": "Current Assets",
    "primary": true,
    "Nature_Of_Group": "Assets",
    "isPredefind":true
  },
  {
    "name": "Sundry Debtors",
    "primary": false,
    "Under": "Current Assets",
    "isPredefind":true
  },
  {
    "name": "Cash-in-Hand",
    "primary": false,
    "Under": "Current Assets",
    "isPredefind":true
  },
  {
    "name": "Bank Account",
    "primary": false,
    "Under": "Current Assets",
    "isPredefind":true
  },
  {
    "name": "Bank O/D Account",
    "primary": false,
    "Under": "Secured Loan",
    "isPredefind":true
  },
  {
    "name": "Stock-in-Hand",
    "primary": false,
    "Under": "Current Assets",
    "isPredefind":true
  },
  {
    "name": "Loans & Advances (Assets)",
    "primary": false,
    "Under": "Current Assets",
    "isPredefind":true
  },
  {
    "name": "Other Current Assets",
    "primary": false,
    "Under": "Current Assets",
    "isPredefind":true
  },
  {
    "name": "Expenses (Direct)",
    "primary": true,
    "Nature_Of_Group": "Expenses",
    "isPredefind":true
  },
  {
    "name": "Wages",
    "primary": false,
    "Under": "Expenses (Direct)",
    "isPredefind":true
  },
  {
    "name": "Freight",
    "primary": false,
    "Under": "Expenses (Direct)",
    "isPredefind":true
  },
  {
    "name": "Water Bill",
    "primary": false,
    "Under": "Expenses (Direct)",
    "isPredefind":true
  },
  {
    "name": "Electricity Bill",
    "primary": false,
    "Under": "Expenses (Direct)",
    "isPredefind":true
  },
  {
    "name": "Other Direct Expenses",
    "primary": false,
    "Under": "Expenses (Direct)",
    "isPredefind":true
  },
  {
    "name": "Expenses (Indirect)",
    "primary": true,
    "Nature_Of_Group": "Expenses",
    "isPredefind":true
  },
  {
    "name": "Salary",
    "primary": false,
    "Under": "Expenses (Indirect)",
    "isPredefind":true
  },
  {
    "name": "Office Expenses",
    "primary": false,
    "Under": "Expenses (Indirect)",
    "isPredefind":true
  },
  {
    "name": "Finance Cost",
    "primary": false,
    "Under": "Expenses (Indirect)",
    "isPredefind":true
  },
  {
    "name": "Advertisement Cost",
    "primary": false,
    "Under": "Expenses (Indirect)",
    "isPredefind":true
  },
  {
    "name": "Petty Cash Expenses",
    "primary": false,
    "Under": "Expenses (Indirect)",
    "isPredefind":true
  },
  {
    "name": "Other Operating Expenses",
    "primary": false,
    "Under": "Expenses (Indirect)",
    "isPredefind":true
  },
  {
    "name": "Income (Indirect)",
    "primary": true,
    "Nature_Of_Group": "Income",
    "isPredefind":true
  },
  {
    "name": "Income from Investments",
    "primary": false,
    "Under": "Income (Indirect)",
    "isPredefind":true
  },
  {
    "name": "Other Income",
    "primary": false,
    "Under": "Income (Indirect)",
    "isPredefind":true
  },
  {
    "name": "Opening Stock",
    "primary": false,
    "Under": "Expenses (Direct)",
    "isPredefind":true
  },
  {
    "name": "Closing Stock",
    "primary": false,
    "Under": "Expenses (Direct)",
    "isPredefind":true
  },
  {
    "name": "Purchase",
    "primary": false,
    "Under": "Expenses (Direct)",
    "isPredefind":true
  },
  {
    "name": "Sales",
    "primary": false,
    "Under": "Income (Indirect)",
    "isPredefind":true
  }
]
 
async function createOrganizationDatabase(organizationName) {
  // Helper function to generate a short name based on initials
  function generateShortName(name) {
    return name
      .split(/\s+/) // Split by spaces
      .map(word => word[0].toLowerCase()) // Take the first letter of each word
      .join(''); // Join them into a short string
  }
 
  // Create a database name using initials of the organization
  const shortName = generateShortName(organizationName);
 
  // Ensure the database name stays under the limit and append a unique identifier
  const uniqueId = new Date().getTime().toString().slice(-4); // Last 4 digits of the timestamp
  const dbName = `acc_org_${shortName}_${uniqueId}`; // Final DB name
  const dbNameEcom = `ecom_org_${shortName}_${uniqueId}`;
  const dbNamepayroll = `payroll_org_${shortName}_${uniqueId}`; // Final DB name
  const dbNamecrm = `ecom_org_${shortName}_${uniqueId}`;
  // Check if the final name length is within the MongoDB limit (38 bytes)
  if (dbName.length > 38) {
    throw new Error(`Database name ${dbName} exceeds the max length of 38 characters.`);
  }
 
  // Create the full MongoDB URI
  const orgUri = `${MONGO_ATLAS_URI}/${dbName}?retryWrites=true&w=majority`;
 
  // Create a dynamic connection to the specific organization's database
  const orgConnection = await mongoose.createConnection(orgUri, {
   
  });
 
  console.log(`Database connection created for organization: ${dbName}`);
 
  // Generate organization ID based on initials and count
  const orgId = await getInitials(organizationName);
 
  // Define a schema dynamically for the organization's database
 
 
  // Example: User schema for each organization
 
  // Attach the schema to the specific organization's database
  const UserModel = orgConnection.model('RegisterUser', userSchema);
  const Finanace = orgConnection.model('Account_Grp', BalanceSheetSchema);
  const Account = orgConnection.model('Account', AccountSchema)
  const Transaction = orgConnection.model('Transaction_Sales',TransactionSchema)
  const specificationModel = orgConnection.model('Specification', specificationSchema);
  const itemGroup = orgConnection.model('ItemGroup', itemGroupSchema);
  const Item = orgConnection.model('Item', itemSchema);
  // const GeneralConfig = orgConnection.model('GeneralConfig', GeneralConfigSchema);
  const VoucherConfig = orgConnection.model('VoucherConfig',VoucherConfigSchema);
  await Finanace.insertMany(accounts);
  // Insert an initial record (this will also create the database if it doesn't exist)
 
 
 
  // Create metadata about the organization in the global `orgExternalMeta` collection
  const orgCreated = new orgMeta({
    orgId: orgId,
    orgName: organizationName,
    accountingDatabaseName: dbName,
    ecomDatabaseName:dbNameEcom,
    payrollDatabaseName:dbNamepayroll,
    crmDatabaseName:dbNamecrm,
  });
 
  await orgCreated.save();
  console.log("Organization metadata added to global collection.");
 
  return orgConnection; // Return the connection object
}
 
 
module.exports = createOrganizationDatabase;