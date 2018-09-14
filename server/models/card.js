var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var cardsSchema = new Schema({
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
  cardType:{
    type: String,
    default:"simple"
  }

});

module.exports = mongoose.model("cards", cardsSchema);
