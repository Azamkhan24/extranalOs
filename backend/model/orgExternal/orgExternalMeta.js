const mongoose = require('mongoose');

const orgExternalMetaSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    unique: true, // Ensuring orgId is unique
  },
  orgName: {
    type: String,
    required: true,
    unique: true, // Ensuring orgName is unique
  },
  accountingDatabaseName:{
    type: String,
    unique: true, // Ensuring databaseName is unique
  },
  ecomDatabaseName:{
    type: String,
    unique: true
  },
  payrollDatabaseName:{
    type: String,
    unique: true
  },
  crmDatabaseName:{
    type: String,
    unique: true
  }

});

// Exporting the model
module.exports = mongoose.model('OrgExternalMeta', orgExternalMetaSchema);
