var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var listsSchema = new Schema({
  listName: {
    type: String,
    require: true
  },
  card: [
    {type: Schema.Types.ObjectId, ref: 'cards'}
  ],
  // time:{
  //   type: Date,
  // }
});

module.exports = mongoose.model("lists", listsSchema);
