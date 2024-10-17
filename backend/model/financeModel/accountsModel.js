const mongoose = require('mongoose');
 
// Address schema
const AddressSchema = new mongoose.Schema({
  bnm: { type: String, default: "" },   // Building name
  st: { type: String, default: "" },    // Street
  loc: { type: String, default: "" },   // Locality
  bno: { type: String, default: "" },   // Building number
  dst: { type: String, default: "" },   // District
  lt: { type: String, default: "" },    // Latitude
  locality: { type: String, default: "" },
  pncd: { type: String, default: "" },  // Postal Code
  landMark: { type: String, default: "" },
  stcd: { type: String, default: "" },  // State Code
  geocodelvl: { type: String, default: "" },
  flno: { type: String, default: "" },  // Floor number
  lg: { type: String, default: "" }     // Longitude
});
 
// Wrapper for addresses
const AddressWrapperSchema = new mongoose.Schema({
  addr: AddressSchema,
  ntr: { type: String, default: "" } // Nature of the address
});
 
// Contact person schema
const ContactPersonSchema = new mongoose.Schema({
  name: { type: String },
  designation: { type: String },
  mobile_no: { type: String },
  email: { type: String }
});
 
// Bank schema
const BankSchema = new mongoose.Schema({
  bank_name: { type: String },
  accountNo: { type: String },
  ifsc_code: { type: String },
  branch_name: { type: String },
  swift_code: { type: String },
  ad_code: { type: String },
  internet_banking_user: { type: Boolean, default: false },
  internet_banking_user_name: { type: String },
  internet_banking_user_login_password: { type: String },
  internet_banking_user_transaction_password: { type: String },
  upi_id: { type: String }
});
 
// Account schema
const AccountSchema = new mongoose.Schema({
  group: { type: String, required: true },  // Account group (e.g., Sundry Debtors, Bank Account)
  name: { type: String, required: true, unique: true },
   alias: { 
    type: mongoose.Schema.Types.Mixed,
    ref:'GeneralConfigSchema', // Could be either a string or an array
    validate: {
      validator: function(value) {
        if (Array.isArray(value)) {
          return value.every(alias => typeof alias === 'string'); // Check if all elements are strings
        }
        return typeof value === 'string'; // Otherwise, it must be a string
      },
      message: 'Alias must be either a string or an array of strings'
    }
  },
  printName: { type: String, required: true },
  registrationType: { type: Boolean, default: false },  // True if registered for GST
  gstin: { type: String },
  constitutions_of_bussiness: { type: String },
  email:{type: String},
  contact_no:{type: String},
  alternative_no:{type: String},
  opening_balance: {
    balance: { type: Number, default: 0.0 },
    type_of_Account: { type: String, enum: ['+', '-'], required: true }  // Credit or Debit (+/-)
  },
  principalPlaceOfAddress: {
    type: AddressWrapperSchema,
    required: function() { return !!this.gstin; }  // Required if GSTIN is provided
  },
  additionalPlaceOfAddress: [AddressWrapperSchema],  // Array of additional addresses
  contact_person: [ContactPersonSchema],  // Array of contact persons
 
  // Bank Details
  bank: BankSchema,
 
  // Registration details
  cin: { type: String },  // Corporate Identification Number (CIN)
  pan: {type: String},
  tan: { type: String },
  udyam_no: { type: String },  // Udyam No. for MSMEs
  iec: { type: String },  // Import Export Code (IEC)
  llpin: { type: String, required: function() { return this.name.endsWith('LLP'); } },  // LLP identification number
 
  // Attachments
  attachments: {
    canceled_cheque: { type: String },
    gstin_certificate: { type: String },
    others: { type: String }
  },
 
  // Other fields like Interest, Depreciation, etc.
  method_of_depreciation: { type: String },  // Only for Fixed Assets
  rate_of_depreciation: { type: Number },    // Only for Fixed Assets
  type_of_tax: { type: String },             // Only for Duties & Taxes
  type_of_supply: { type: String },          // Only for Income and Expenses
  type_of_interest: { type: String },        // Only for Loan Accounts
  interest_rate: { type: Number },           // Only for Loan Accounts
 
  isDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

AccountSchema.index({ alias: 1 }, { unique: true, partialFilterExpression: { alias: { $exists: true, $type: "string" } } });
 
// Pre-save middleware to update timestamps
AccountSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
 
module.exports = AccountSchema;