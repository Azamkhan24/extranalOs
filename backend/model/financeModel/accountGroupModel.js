const mongoose = require("mongoose");

// Utility function to capitalize words
const capitalizeWords = (value) => {
  if (value) {
    return value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  return value;
};

const accountgrpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    set: capitalizeWords,
  },
  alias: {
    type: String,
    unique: true,
    trim: true,
    set: capitalizeWords,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  Nature_Of_Group: {
    type: String,
    enum: ["Liabilities", "Assets", "Income", "Expenses"],
    required: function () {
      return this.primary;
    } // Default value if primary
  },
  Under: {
    type: String,
    required: function () {
      return !this.primary;
    }, // Required only when it's not a primary group
    trim: true,
    set: capitalizeWords,
  },
  dependency: {
    type: Number,
    default: 0,
  },
  isPredefind: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false, // By default, account is not deleted
  },
 
});

// Add pre-save hook for validation or other purposes if needed
accountgrpSchema.pre('save', async function (next) {
  if (!this.primary && !this.Under) {
    return next(new Error("Non-primary groups must have an 'Under' group."));
  }
  next();
});

module.exports = accountgrpSchema;
