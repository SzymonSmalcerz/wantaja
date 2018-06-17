const mongoose = require("../connectionToServer");
const validator = require("validator");
const SECRET = "asddd123";
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
  nick : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    unique : true,
    validate : {
      validator : validator.isEmail,
      message: '{VALUE} is not a valid email!'
    }
  },
  level : {
    type : Number,
    default : 1
  },
  experience : {
    type : Number,
    default : 0
  },
  x : {
    type : Number,
    default : 100
  },
  y : {
    type : Number,
    default : 100
  },
  currentMapName : {
    type : String,
    default : "firstMap"
  }
});


userSchema.statics.getUserByNickAndPassword = async function(nickOfUser,password){

  try {

    var user = await User.findOne({nick:nickOfUser});

    if(!user){
      return Promise.reject("wrong username");
    }

    if(bcrypt.compareSync(password, user.password)){
      return Promise.resolve(user);
    }

    return Promise.reject("wrong password");

  }catch (err){

    return Promise.reject(err);

  }



  return ;
};

userSchema.pre('save', function(next){
  const user = this;
  if(!user.isModified('password')){
    return next();
  };

  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(user.password);
  user.password = hashedPassword;
  next();
});

var User = mongoose.model("User", userSchema);

module.exports = User;
