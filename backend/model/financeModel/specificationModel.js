const mongoose = require('mongoose');
 
const specificationSchema = new mongoose.Schema({
  sub_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory", // Links to the SubCategory schema
    required: true,
  },
  further_sub_categories: [
    {
      name: { type: String, required: true },
      options: [String],
    },
  ],
  isDelete:{
    type:Boolean,
    default: false
  }
},
{
  timestamps: true,
},
);
 
 
// module.exports =  mongoose.model("Specification", specificationSchema);
module.exports = specificationSchema;