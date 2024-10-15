const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const count = new Schema(
  {
    role:{
      type: Number,
      default:0
    }
  }
)

module.exports = mongoose.model('Count',count);