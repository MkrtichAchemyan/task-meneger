var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var schedulerSxema = new Schema({
  cardId:{
    type: Schema.Types.ObjectId,
    ref: 'cards',
    require:true
  },
  listId:{
    type: Schema.Types.ObjectId,
    ref: 'lists',
    require:true
  }

});

module.exports = mongoose.model("schedulers", schedulerSxema);
