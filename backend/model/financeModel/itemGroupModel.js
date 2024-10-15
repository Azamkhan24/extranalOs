const mongoose = require('mongoose');
 
const itemGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing spaces
    set: value => value?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '), // Capitalizes each word
    validate: {
      validator: async function (value) {
        // Check if groupName exists where isDelete is false
        const group = await mongoose.models.ItemGroup.findOne({ groupName: value, isDelete: false });
        return !group || group._id.equals(this._id); // Ensure that we don't count the current document
      },
      message: 'Group name already exists for a non-deleted group'
    }
  },
  alias: {
    type: String,
    trim: true, // Ensures no leading/trailing spaces
    set: value => value?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '), // Capitalizes each word
    validate: {
      validator: async function (value) {
        // Check if alias exists where isDelete is false
        const group = await mongoose.models.ItemGroup.findOne({ alias: value, isDelete: false });
        return !group || group._id.equals(this._id); // Ensure that we don't count the current document
      },
      message: 'Alias already exists for a non-deleted group'
    }
  },
  primary: {
    type: Boolean,
    default: false
  },
  under: {
    type: String,
    trim: true, // Trim leading/trailing spaces
    set: value => value?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') // Capitalizes each word
  },
  specification: {
    type: Boolean,
    default: false
  },
  dependencies: {
    type: Number,
    default: 0
  },
  hierarchyNo:{
    type: Number,
    default: 0
  },
  isDelete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds `createdAt` and `updatedAt` fields automatically
});
 
// Create the model
const ItemGroup = mongoose.model('ItemGroup', itemGroupSchema);
 
module.exports = itemGroupSchema;
 