const mongoose = require("mongoose");

// Predefined parts for voucher number generation
const voucherPartsEnum = {
  VOUCHER_TYPE: "Type", // e.g., S for Sales, P for Purchase
  YEAR: "Year", // e.g., YYYY (2024) or YY-YY (24-25)
  NUMBER: "Number", // e.g., 001, 002
  ABBREVIATION: "Abbreviation", // e.g., IN for Invoice
};

// Schema for voucher configuration
const VoucherConfigSchema = new mongoose.Schema({
  voucherType: {
    type: String,
    enum: [
      "Sales",
      "Purchase",
      "Sales Return",
      "Purchase Return",
      "Payment",
      "Receipt",
      "Contra",
      "Material Issued",
      "Material Received",
    ],
    required: true,
  },
  autoNumbering: {
    type: Boolean,
    default: false,
  }, // Auto-numbering for vouchers
  withTax: {
    type: Boolean,
    default: false,
  }, // Apply tax with or without tax

  // Define how many parts to divide the voucher number into (3 or 4)
  numberOfParts: {
    type: Number,
    validate: {
      validator: function (value) {
        return value === 3 || value === 4; // Allow only 3 or 4 parts
      },
      message: "You can divide the voucher number into 3 or 4 parts.",
    },
    required: true,
  },

  // The actual parts for the voucher number (e.g., Type, Year, Number, Abbreviation)
  voucherParts: {
    type: [
      {
        partType: {
          type: String,
          enum: Object.values(voucherPartsEnum), // Only allow predefined parts (Type, Year, Number, Abbreviation)
          required: true,
        },
        value: {
          type: String,
          required: true,
          // Use a validator to ensure only predefined values for Type, Year, allow dynamic values for Number and Abbreviation
          validate: {
            validator: function (value) {
              const validValues = {
                Type: ["S", "P", "SR", "PR", "PY", "RE", "CO", "MI", "MR"], // Sales, Purchase, Sales Return, etc.
                Year: ["YYYY", "YY-YY"], // 2024, 24-25
              };
              // Check for valid predefined values for Type and Year, allow dynamic values for Number and Abbreviation
              if (
                this.partType === "Number" ||
                this.partType === "Abbreviation"
              ) {
                return true; // Allow dynamic user input
              }
              return validValues[this.partType]?.includes(value); // Validate based on partType for Type and Year
            },
            message: "Invalid value for voucher part.",
          },
        },
      },
    ],
    validate: {
      validator: function (parts) {
        // Ensure that the number of parts matches the user-specified number
        return parts.length === this.numberOfParts;
      },
      message: function () {
        return `The number of parts must match ${this.numberOfParts}`;
      },
    },
    required: true,
  },

  // Define the separator symbol (e.g., /, -, _) to be used between parts
  separatorSymbol: {
    type: String,
    enum: ["/", "-"],
    required: true,
  },

  // Starting and resetting options
  startingNumber: {
    type: Number,
    default: 1,
  }, // Starting number for vouchers
  resetNumbering: {
    type: String,
    enum: ["Never", "Daily", "Monthly", "Yearly"],
    default: "Never",
  }, // Frequency of resetting voucher numbering

  // Lock the voucher config for one year
  isLocked: {
    type: Boolean,
    default: false,
  },
  lockUntil: {
    type: Date,
    default: function () {
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      return oneYearLater; // Locked for one year
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add pre-save hook to validate total length of voucher number with separators
VoucherConfigSchema.pre("save", function (next) {
  const { voucherParts, separatorSymbol, numberOfParts } = this;

  // Combine voucher parts and separators into a single string
  let voucherString = "";
  for (let i = 0; i < voucherParts.length; i++) {
    voucherString += voucherParts[i].value;
    if (i < numberOfParts - 1) {
      voucherString += separatorSymbol; // Add the separator between each part
    }
  }

  // Validate that the length of the voucher string does not exceed 16 characters
  if (voucherString.length > 16) {
    return next(
      new Error(
        `Voucher number exceeds the maximum allowed length of 16 characters.`
      )
    );
  }
  next();
});

module.exports = VoucherConfigSchema;