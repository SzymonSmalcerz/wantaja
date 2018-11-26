require("./helpers/requestAnimationFrame");

const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const session = require("client-sessions");
const cookieParser = require('cookie-parser');
const http = require("http");
const socketIO = require("socket.io");

const {mongoose} = require("./database/connectionToServer");
const User = require("./database/models/userModel");
const {authenticationMiddleware,registrationMiddleware,loginAuthentication} = require("./authentication/middlewares/middlewares");
const {socketHandler} = require("./sockets/sockets");

const app = express();
var PORT = process.env.PORT || 3000;


app.set("view engine","ejs");

const server = http.createServer(app);
const io = socketIO(server);
io.on("connection", (socket) => {
  socketHandler(socket, io);
});

app.use(methodOverride('_method'))
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  httpOnly : true,
  secure : true,
  ephermal : true
}));


app.get("/game", authenticationMiddleware, (req,res) => {
  //converting hex to dec
  var firstHalfOfId = req.session.user._id.toString().substring(0,12);
  var secondtHalfOfId = req.session.user._id.toString().substring(12);
  var decIDofPlayerFIRSTHALF = parseInt(firstHalfOfId, 16);
  var decIDofPlayerSECONDHALF = parseInt(secondtHalfOfId, 16);
  res.render("game",{id1 : decIDofPlayerFIRSTHALF, id2 : decIDofPlayerSECONDHALF});
})


// app.get("/dashboard",authenticationMiddleware,(req,res) => {
//   res.render("dashboard");
// })

app.get("/logout",authenticationMiddleware,(req,res) => {
  req.session.reset();
  res.render("newhome",{loggedIn:false, message:"you have successfully logged out!"});
})

app.get("/register",(req,res) => {
  res.render("registrationPage");
})

app.post("/register",registrationMiddleware,(req,res) => {
  res.render("newhome", { loggedIn: false,  message : "Registration succesfull ! Now you can log into the game !" });
})

app.get("/login",(req,res) => {
  res.render("loginPage");
})

app.post("/login",loginAuthentication,(req,res) => {
  res.redirect("/newhome");
})

app.get("/home",(req,res) => {
  if(!(req.session && req.session.user)){
    res.render("newhome",{ loggedIn : false, message : false });
  } else{
    res.render("newhome",{ loggedIn : true, nick : req.session.user.nick.toString(), message : false });
  }
})

app.get("*", (req,res) => {
  res.redirect("home");
})

server.listen(PORT,() => {
  console.log("litening at port " + PORT);
});
