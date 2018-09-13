const createError = require('http-errors'),
  express = require('express'),
  app = express(),
  cardRoute = require("./routes/card.js"),
  listRoute = require("./routes/list.js"),
  bodyParser = require('body-parser'),
  mongoose = require("mongoose"),
  Lists = require("./models/list.js"),
  Cards = require("./models/card.js"),
  http = require('http'),
  server = http.createServer(app),
  io = require('socket.io').listen(server);

mongoose.connect("mongodb://localhost:27017/Project", {useNewUrlParser: true});

app.use(express.static("public"));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));

//app.use("/api/project/card", cardRoute);
// app.use("/api/project/list", listRoute);
//app.use("/api/project", projectRoute);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get("/api/project", (req, res) => {
  Lists.find({})
    .populate({path: "card"})
    .exec((err, lists) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(lists);
    })
});

io.on('connection', (socket) => {
  socket.on('sendList', (data) => {
    console.log(data);
    const list = new Lists({
      listName: data
    });
    list.save()
      .then((list) => {
        Lists.findOne({"_id": list._id})
          .populate("card")
          .exec((err, list) => {
            if (err) {
              throw err;
            }
            io.emit("newList", list);
          })
      })
  });

  socket.on('sendCard', (data) => {
    const card = new Cards({
      cardName: data.cardName,
      listId: data.id
    });
    card.save()
      .then((card1) => {
        Lists.findOne({"_id": data.id})
          .populate("card")
          .exec((err, list) => {
            if (err) {
              throw err;
            }
            list.card.push(card1);
            list.save()
              .then(() => {
                Lists.find({})
                  .populate({path: "card"})
                  .exec((err, arr) => {
                    io.emit("newCard", arr);
                  })
              })
              .catch((err) => {
                throw err;
              })
          })
      })
  })

  socket.on('editedCard',(data)=>{
   Cards.findByIdAndUpdate(data.cardId, {new: true}, function (err, card) {
     console.log(data)
     console.log(card)
     card.cardName = data.cardName;
     card.save()
       .then((card)=>{
         console.log(card)
         Lists.find({})
           .populate({path: "card"})
           .exec((err, arr) => {
             if (err) {
               throw err;
             }
             io.emit("newEditedCard", arr);
           })
       })
   })
  })

  socket.on('deletedCard', (data)=>{
    Cards.findByIdAndRemove(data, function (err) {
      if (err) {
        throw err
      }
      Lists.find({})
        .populate({path: "card"})
        .exec((err, arr) => {
          if (err) {
            throw err;
          }
          io.emit("newEditedCard", arr);
        })
    })
  })




  socket.on("dargableData", (data) => {
    // dragListId dropListId
    // dragCardId dropCardId
    if (data.dragListId === data.dropListId) {


      Lists.findOne({"_id": data.dragListId})
        .exec()
        .then((list) => {
          let dragCardIndex = list.card.indexOf(data.dragCardId);
          let dropCardIndex = list.card.indexOf(data.dropCardId);
          if (dropCardIndex < 0) {
            list.card.splice(dragCardIndex, 1);
            list.card.push(data.dragCardId);
          } else {
            list.card.splice(dragCardIndex, 1);
            if (dragCardIndex > dropCardIndex) {
              list.card.splice(dropCardIndex, 0, data.dragCardId);
            }
            else {
              list.card.splice(dropCardIndex - 1, 0, data.dragCardId);
            }
          }
          Lists.findByIdAndUpdate(data.dragListId, list, {new: true}, function (err, list) {
            if (err) {
              throw err;
            }
            Lists.find({})
              .populate({path: "card"})
              .exec((err, arr) => {
                if (err) {
                  throw err;
                }
                io.emit("newDragableData", arr);
              })
          });
        })
        .catch((err) => {
          throw {error: err};
        })
    } else {
      Lists.findOne({"_id": data.dragListId})
        .exec()
        .then((list) => {

            let dragCardIndex = list.card.indexOf(data.dragCardId);
            list.card.splice(dragCardIndex, 1);
            list.save()
              .then(() => {
                Lists.findOne({"_id": data.dropListId})
                  .exec()
                  .then((list) => {
                    let dropCardIndex = list.card.indexOf(data.dropCardId);
                    if (dropCardIndex < 0) {
                      list.card.push(data.dragCardId);
                    } else {
                      if (dropCardIndex === 0) {
                        list.card.unshift(data.dragCardId);
                      }
                      else {
                        list.card.splice(dropCardIndex - 1, 0, data.dragCardId);
                      }
                    }

                    Lists.findByIdAndUpdate(data.dropListId, list, {new: true}, function (err, list) {
                      if (err) {
                        throw err;
                      }
                      Cards.findOne({"_id": data.dragCardId})
                        .exec()
                        .then((card) => {
                          card.listId = data.dropListId;
                          card.save()
                            .then((card) => {
                              Lists.find({})
                                .populate({path: "card"})
                                .exec((err, arr) => {
                                  console.log(arr[1].card, "--------------Arr--card------------------");
                                  io.emit("newDragableData", arr);
                                })
                            })
                        })
                      console.log(list, "List------------------------------------------------");
                    });
                  })
                  .catch((err) => {
                    throw err;
                  })
              })
              .catch((err) => {
                throw err;
              })
          }
        )
        .catch((err) => {
          throw err;
        })
    }

  })

})


server.listen(8000, function () {
  console.log("socket run!!!")
})

app.listen(3000, function () {
  console.log("server run!!!");
});
