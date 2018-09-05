const express = require('express'),
  router = express.Router(),
  Lists = require("./models/list.js"),
  Cards = require("./models/card.js");

router.get("/", (req, res)=>{
  Lists.find({})
    .exec()

})
