const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const osInternal = require('../internalModel/osInternal')

// Contact Us Schema
const ContactUs = new Schema({
    name: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    description: {
        type: String
    },
    userSize: {
        type: Number,
        required: true
    },
    isAprove: {
        type: Boolean,
        default: false
    },
    crm: {
        type: Boolean,
        default: false
    },
    ecom: {
        type: Boolean,
        default: false
    },
    payroll: {
        type: Boolean,
        default: false
    },
    account: {
        type: Boolean,
        default: true
    },
    assign: {
        type: Schema.Types.ObjectId,
        ref: osInternal,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    isRejected: {
        type: Boolean,
        default: false
    },
    rejectionReason: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending',  'no response', 'approved', 'rejected'],
        default: 'pending'
    },
    followUpAttempts: {
        type: Number,
        default: 0
    },
    lastContactedAt: {
        type: Date,
        default: null
    },
    notes: [{
        message: String,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('ContactUs', ContactUs);
