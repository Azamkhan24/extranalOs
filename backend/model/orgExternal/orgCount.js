const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const count = new Schema(
  {
    count:{
      type: Number,
      default:0
    }
  }
)

module.exports = mongoose.model('CountOrg',count);