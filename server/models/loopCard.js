var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var loopCardsSchema = new Schema({
  cardName: {
    type: String,
    require: true
  },
  listId:{
    type: Schema.Types.ObjectId,
    ref: 'lists',
  },
  time:{
    type: Date,
    default: new Date()
  },
  active: {
    type: Boolean,
    default: true
  }

});

module.exports = mongoose.model("loopCards", loopCardsSchema);
