var User = require("../../database/models/userModel");

var authenticationMiddleware = function(req,res,next){

  if(!(req.session && req.session.user)){
    res.render("newhome",{message:"Error: You must log in to get to this page ", loggedIn : false});
  }else{
    User.findById(req.session.user._id, (err,user) => {
      if(err || !user){
        res.render("newhome",{message:"Error occured: you must log in to get to continue.", loggedIn : false});
      }else{
        next();
      }
    });
  }

};

var loginAuthentication = function(req,res,next){

  User.getUserByNickAndPassword(req.body.nick,req.body.password).then((user) => {

    req.session.user = user;
    req.session.user.password = {};
    next();

  }).catch((err) => {
    return res.render("newhome",{message: `Error occured: ${err}`, loggedIn : false});
  })

};


var registrationMiddleware = async function(req,res,next){
  console.log(req.body);
  let duplicate = await User.findOne({ nick : req.body.nick });
  if(duplicate) {
    return res.render("newhome",{message:`Error occured: user with nick ${req.body.nick} already exists.`, loggedIn : false});
  };
  duplicate = await User.findOne({ email : req.body.email });
  if(duplicate) {
    return res.render("newhome",{message:`Error occured: user with email ${req.body.email} already exists.`, loggedIn : false});
  };

  var newUser = await new User(req.body);

  newUser.save((err,user) => {
    if(err || !user){
      return res.render("newhome",{message:`INTERNAL ERROR: ${err}\n\nContact administration.`, loggedIn : false});
    }else {
      req.session.user = user;
      req.session.user.password = {};
      next();
    }

  });
}


module.exports = {
  authenticationMiddleware,
  registrationMiddleware,
  loginAuthentication
};
