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
  },
  health : {
    type : Number,
    default : 100
  },
  mana : {
    type : Number,
    default : 10
  },
  strength : {
    type : Number,
    default : 1
  },
  agility : {
    type : Number,
    default : 1
  },
  vitality : {
    type : Number,
    default : 1
  },
  intelligence : {
    type : Number,
    default : 1
  },
  equipmentCurrentlyDressed : {
    type : {
      weapon : {
        type : String,
        required : true
      },
      helment : {
        type : String,
        required : true,
        default : null
      },
      armor : {
        type : String,
        required : true,
        default : null
      },
      special_1 : {
        type : String,
        required : true,
        default : null
      },
      shield : {
        type : String,
        required : true,
        default : null
      },
      boots : {
        type : String,
        required : true,
        default : null
      }
    },
    default : {
      weapon : "weapon_1",
      helment : null,
      armor : "armor_1",
      special_1 : null,
      special_2 : null,
      boots : null
    }
  },
  equipment : {
    type : [{
      key : {
        type : String,
        required : true
      },
      type : {
        type : String,
        required : true
      }
    }],
    default : []
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
