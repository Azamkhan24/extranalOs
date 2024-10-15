const mongoose = require('mongoose');

// Address schema with _id disabled
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
}, { _id: false }); // Disable _id for sub-documents

// Define adadr and pradr schemas
const AdAdrSchema = new mongoose.Schema({
    addr: AddressSchema,
    ntr: { type: String, default: "" }
}, { _id: false });  // Disable _id for sub-documents

const PrAdrSchema = new mongoose.Schema({
    addr: AddressSchema,
    ntr: { type: String, default: "" }
}, { _id: false });  // Disable _id for sub-documents

// Main GST user schema
const YourSchema = new mongoose.Schema({
    stjCd: { type: String, default: "" },
    lgnm: { type: String, default: "" },
    stj: { type: String, default: "" },
    dty: { type: String, default: "" },
    adadr: [AdAdrSchema],  // List of adadr, without _id
    pradr: PrAdrSchema,  // Principal address, without _id
    cxdt: { type: String, default: "" },
    gstin: { type: String, default: "" },
    nba: { type: [String], default: [] },
    lstupdt: { type: String, default: "" },
    rgdt: { type: String, default: "" },
    ctb: { type: String, default: "" },
    tradeNam: { type: String, default: "" },
    ctjCd: { type: String, default: "" },
    sts: { type: String, default: "" },
    ctj: { type: String, default: "" },
    einvoiceStatus: { type: String, default: "" },
    lastModified: { type: Date, default: Date.now },  // Timestamp of the last modification
    versionHistory: [{
        record: mongoose.Schema.Types.Mixed,  // Store a full snapshot of the GST record
        updatedAt: { type: Date, default: Date.now }  // Timestamp of when this version was stored
    }]
});

const YourModel = mongoose.model('GSTUser', YourSchema);
module.exports = YourModel;
