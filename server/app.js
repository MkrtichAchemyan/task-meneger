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
        throw err;
      }
      res.send(lists);
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
        // .populate("card")
          .exec((err, list) => {
            if (err) {
              throw err;
            }
            console.log(list, "++++++++++++++++++++++++++");
            io.emit("newList", list);
          })
      })
  });

  socket.on('sendCard', (data) => {
    var promise = new Promise(((resolve, reject) => {
      const card = new Cards({
        cardName: data.cardName,
        listId:data.id
      });
      card.save()
        .then((card1) => {
          Lists.findOne({"_id":data.id})
            .populate("card")
            .exec((err, list)=>{
               if (err) {
                 throw err;
               }
              list.card.push(card1);
              list.save()
                .then((list)=>{
                  resolve("done");
                });
              //console.log(list.card, "--------------+++++++++++-----------------");
            })

        })
    }))

    promise.then((val) => {
      Lists.findOne({"_id": data.id})
        .populate({path: "card"})
        .exec((err, list) => {
         // console.log(list.card, "--------------LIst--card------------------");
          io.emit("newCard", list.card[list.card.length-1]);
        })
    })
  })

  socket.on("dargableData", (data)=>{
    console.log(data, "dargableData");
    Lists.findOne({_id:data.dragListId}, (list)=>{

     list.card.splice(data.dragCardIndex,1);
     list.save();
      console.log(list, "-----------------------");
    })

    Lists.findOne({_id:data.dropListId}, (list)=>{
      list.card.splice(data.dropCardIndex, 0, data.dragCardId);
      list.save();
      console.log(list, "+++++++++++++++++++");
    })
    Lists.find({})
      .populate("card")
      .exec((err, lists)=>{
        socket.broadcast.emit("newDragableData", lists);
      })
  })
})


server.listen(8000, function () {
  console.log("socket run!!!")
})

app.listen(3000, function () {
  console.log("server run!!!");
});
