const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User Schema
const UserSchema = new Schema({
  userType: {
    type: String,
    enum: ["Business", "Professional"],
    required: true,
  },
  role: {
    type: String,
    enum: ["SuperAdmin", "Admin", "User"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  organizationType: {
    type: String,
    required: function () {
      return this.userType === "Business";
    },
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  employeeType: {
    type: String,
    enum: ["On Record", "Off Record"],
    required: function () {
      return this.role === "User" && this.userType === "Business";
    },
  },
  orgAdmins: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.role === "SuperAdmin" && this.userType === "Business";
      },
    },
  ],
  professionType: {
    type: String,
    required: function () {
      return this.userType === "Professional";
    },
  },
  orgEntity: {
    type: String,
    required: true,
  },
  crm: {
    type: Boolean,
    default: false,
    validate: {
      validator: function () {
        return this.userType !== "Business" || !this.crm;
      },
      message: 'CRM should be false for Business users.',
    },
  },
  ecom: {
    type: Boolean,
    default: false,
    validate: {
      validator: function () {
        return this.userType !== "Professional" || !this.ecom;
      },
      message: 'Ecom should be false for Professional users.',
    },
  },
  payroll: {
    type: Boolean,
    default: false,
    validate: {
      validator: function () {
        return this.userType !== "Professional" || !this.payroll;
      },
      message: 'Payroll should be false for Professional users.',
    },
  },
  account: {
    type: Boolean,
    default: true,  // Set default as true, since it's required for both user types
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = UserSchema;
