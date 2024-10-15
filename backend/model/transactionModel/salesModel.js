const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  series: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  voucherNo: {
    type: String,
    maxlength: 16,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  narration: {
    type: String,
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
      discountPercentage: {
        type: Number,
        default: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
      listPrice: { // Renamed 'price' to 'listPrice'
        type: Number,
        required: true,
      },
      price: { // Renamed 'amount' to 'price'
        type: Number,
        required: true,
      },
      taxPercentage: {
        type: Number,
        required:true
      },
      taxAmount:{
        type: Number,
        default: 0
      },
      amount: { // Renamed 'totalAmount' to 'amount'
        type: Number,
        required: true,
      },
    },
  ],
  transporter: {
    type: String,
  },
  gr_rrNo: {
    type: String,
  },
  vehicleNo: {
    type: String,
  },
  eInvoiceRequired: {
    type: Boolean,
    default: false,
  },
  eWayBillRequired: {
    type: Boolean,
    default: false,
  },
  modeOfTransport: {
    type: String,
  },
  billFrom: {
    name: { type: String, required: true },
    gstin: { type: String, required: true },
    state: { type: String, required: true },
    dispatchFrom: {
      address: { type: String, required: true },
      place: { type: String, required: true },
      pincode: { type: String, required: true },
    },
  },
  billTo: {
    name: { type: String, required: true },
    gstin: { type: String, required: true },
    state: { type: String, required: true },
    shipTo: {
      address: { type: String, required: true },
      place: { type: String, required: true },
      pincode: { type: String, required: true },
    },
  },
  distance: {
    type: Number,
  },
  eWayBillDetails: {
    eWayBillNo: { type: String },
    eWayBillDate: { type: Date },
  },
  eInvoiceDetails: {
    eInvoiceAckNo: { type: String },
    eInvoiceAckDate: { type: Date },
    eInvoiceIRN: { type: String },
  },
});

module.exports = salesSchema;
