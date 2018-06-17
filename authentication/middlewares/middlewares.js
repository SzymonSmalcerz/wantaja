var User = require("../../database/models/userModel");

var authenticationMiddleware = function(req,res,next){

  if(!(req.session && req.session.user)){
    res.render("home",{message:" You must log in to get to this page "});
  }else{
    User.findById(req.session.user._id, (err,user) => {
      if(err || !user){
        res.render("home",{message:" You must log in to get to this page "});
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
    return res.render("home",{message:err});
  })

};


var registrationMiddleware = async function(req,res,next){

  var newUser = await new User(req.body);

  newUser.save((err,user) => {

    if(err || !user){
      res.send("error in registration/n" + err);
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
