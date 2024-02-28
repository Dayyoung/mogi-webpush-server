const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const pushRouter = require("./routes/push");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", pushRouter);

process.on("uncaughtException", function (err) {
  console.log("uncaughtException  : " + err);
});

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});

var minutes = 5,
  the_interval = minutes * 60 * 1000;
setInterval(function () {
  console.log("I am doing my 5 minutes check");
  doStuff();
}, the_interval);

//doStuff();

function doStuff() {
  // do your stuff here
  var request = require("request");
  request("https://mogi-webpush-server.onrender.com", function (error, response, body) {
    //callback
    console.log(body);
  });
}
