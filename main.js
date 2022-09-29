const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const http = require("http");
require("dotenv").config();

const app = express();

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "chatSession",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static("public"));

//socket 
io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});

//middleware to check cookie
const checkCookie = (req, res, next) => {
  if (req.cookies.username.trim() != "") {
    next();
  } else {
    res.redirect("/");
  }
};

app.get("/", (req, res) => {
  res.render("signIn");
});

app.post("/", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/chat");
});

app.get("/chat", checkCookie, (req, res) => {
  res.render("chat");
});

server.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
