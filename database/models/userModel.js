const mongoose = require("../connectionToServer");
const validator = require("validator");
const SECRET = "asddd123";
const bcrypt = require("bcryptjs");

// const { Mission,
//         Stage_goto,
//         Stage_getitem,
//         Stage_kill,
//         HighLight,
//         Dialog } = require("../../sockets/missions/missions");

// let getFirstMission = function() {
//   return new Mission([
//     new Stage_goto(
//       [new HighLight('greengrove_john', 'Greengrove')],
//       new Dialog("Hello wanderer!\n" +
//                   "I haven't expect you that early ! Anyway I\n" +
//                   "have small quest for you, recently many spiders\n" +
//                   "came to our village, destroy 10 of them or they\n" +
//                   "will destroy us !", "ok")
//     ),
//     new Stage_kill([], 'spider', 10, 10),
//     new Stage_goto(
//       [new HighLight('greengrove_john', 'Greengrove')],
//       new Dialog('Oh my.. You have done it!\nhere is your reward', 'ok')
//     )
//   ], 0, {
//     money : 100
//   }, "newcomers", 1);
// }

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
  money : {
    type : Number,
    required : true,
    default : 0
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
    default : "Greengrove"
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
      helmet : {
        type : String,
        required : true,
        default : null
      },
      armor : {
        type : String,
        required : true,
        default : null
      },
      special : {
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
      },
      gloves : {
        type : String,
        required : true,
        default : null
      }
    },
    // default : {
    //   weapon : "weapon_1",
    //   helmet : "helmet_1",
    //   armor : "armor_1",
    //   special : "special_1",
    //   shield : "shield_1",
    //   boots : "boots_1",
    //   gloves : "gloves_1"
    // }
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
      },
      x : {
        type : Number,
        required : true
      },
      y : {
        type : Number,
        required : true
      }
    }],
    default : [{
      key : "boots_2",
      type : "boots",
      x : 0,
      y : 0
    }]
  },
  missions : {
    type : [{
      missionName : {
        type : String,
        required : true
      },
      currentStage : {
        type : Number,
        required : true
      },
      missionData : {
        type : mongoose.Schema.Types.Mixed
      }
    }],
    required : true,
    default : [
      {
        missionName : 'newcomers',
        currentStage : 0
      }
    ]
  },
  doneMissions : {
    type : [String],
    required : true,
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
