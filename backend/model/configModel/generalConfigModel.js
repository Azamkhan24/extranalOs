const mongoose = require('mongoose');

const GeneralConfigSchema = new mongoose.Schema({

  
  // Account Configuration
  accountConfig: {
    multipleAccountAliases: { type: Boolean, default: false },
    accountAliases: [String], // For multiple aliases
  },
  
  // Inventory Configuration
  inventoryConfig: {
    qtyDecimalPlace: {
      type: Number,
      min: 0,
      max: 2,
      default: 2 // Default to 2 decimal places for quantity
    },
    discountDecimalPlace: {
      type: Number,
      min: 0,
      max: 2,
      default: 2 // Default to 2 decimal places for discount
    },
    maintainMultipleItemAlias: { type: Boolean, default: false },
    
    stockValuationMethod: {
      type: String,
      enum: ['FIFO', 'LIFO', 'Last Purchase', 'Last Qty In', 'Last Sale', 'Self Evaluation', 'Weighted Average', 'Avg. Price (Qty. In)', 'Avg. Price (Invoice)'],
      default: 'Weighted Average'
    },
    
    maintainStock: { type: Boolean, default: true }
  },
    // Locking the configuration
  isLocked: {
    type: Boolean,
    default: false
  },
  lockUntil: {
    type: Date,
    default: function() {
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      return oneYearLater; // Locked for one year by default
    },
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  }
});

// Middleware to update the `lastModifiedAt` field before saving
GeneralConfigSchema.pre('save', function(next) {
  this.lastModifiedAt = new Date(); // Update the last modified time
  next();
});


module.exports =  GeneralConfigSchema;