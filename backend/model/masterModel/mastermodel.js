const mongoose = require("mongoose");
const AddressSchema = new mongoose.Schema({
  bnm: { type: String, default: "" },
  st: { type: String, default: "" },
  loc: { type: String, default: "" },
  bno: { type: String, default: "" },
  dst: { type: String, default: "" },
  lt: { type: String, default: "" },
  locality: { type: String, default: "" },
  pncd: { type: String, default: "" },
  landMark: { type: String, default: "" },
  stcd: { type: String, default: "" },
  geocodelvl: { type: String, default: "" },
  flno: { type: String, default: "" },
  lg: { type: String, default: "" }
});
 
const AdAdrSchema = new mongoose.Schema({
  addr: AddressSchema,
  ntr: { type: String, default: "" }
});
const PrAdrSchema = new mongoose.Schema({
  addr: AddressSchema,
  ntr: { type: String, default: "" }
});
const MasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    typeOfAssessee: {
      type: String,
      required: true,
      trim: true,
    },
    pan: {
      type: String,
      required: true,
      unique: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    },
    PhoneNo: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },
    EmailId: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/,
    },
   
    dateOfIncorporation: {
      type: String,
      required: true,
    },
    gst:{
      type: Boolean,
      default:  false
    },
    gstDetails: {
      tradeName: {
        type: String,
        trim: true,
        require: function(){return this.gst}
      },
      gstin: {
        type: String,
        match: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
        require: function(){return this.gst}
      },
      principalPlaceOfAddress: {
        type: PrAdrSchema,
        trim: true,
        require: function(){return this.gst}
      },
      additionalPlaceOfAddress: [
        {
          type: AdAdrSchema,
          trim: true,
        },
      ],
      jurisdictionDetails: {
        center: { type: String, trim: true },
        state: { type: String, trim: true },
      },
     
    },
    registrationNumbers: {
      cin: {
        type: String,
        trim: true,
        require: function(){return this.typeOfAssessee==='Private Limited Company' || this.typeOfAssessee==="Public Limited Company"}
      },
      llpin:{
        type: String,
        trim: true,
        require: function(){return this.typeOfAssessee.slice(-3)==='LLP'}
      },
      tan: {
        type: String,
        match: /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/,
      },
      udhyam: {
        type: String,
        trim: true,
      },
      esic: {
        type: String,
        trim: true,
      },
      epfo: {
        type: String,
        trim: true,
      }
    },
    isApproved:{
      type: Boolean,
      default: false
    },
    account:{
      type: Boolean,
      default: true
    },
    crm:{
      type: Boolean,
      default: false
    },
    payroll:{
      type: Boolean,
      default:false
    },
    ecom:{
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Master", MasterSchema);
 