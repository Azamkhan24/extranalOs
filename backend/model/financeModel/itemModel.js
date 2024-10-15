const mongoose = require('mongoose');
 
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  printName:{
    type: String,
  },
  alias:{
    type: String,
  },
  openingStockQuantity:{
    type:  Number,
    default: 0
  },
  openingStockValue:{
    type: Number,
    default: 0
  },
  unit:{
    type: String,
    required: true
  },
  hsn_code:{
    type:  String,
    required: true
  },
  tax_category:{
    type: String,
    required: true
  },
  Group_item:{
    Group:{
      id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemGroup'
      },
      name:{
        type: String
      }
    }
  },
  specification:{
    type: Map,
    of: String, // Correcting `off` to `of`
    required: true, // Map to handle dynamic further sub-category fields
  },
  isDelete:{
    type:Boolean,
    default: false
  }
})
 
module.exports = itemSchema;
 
// module.exports  = mongoose.model('Item', itemSchema)