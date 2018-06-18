const User = require("../database/models/userModel");
const {FirstMap} = require("./maps/Maps");

let dm = { // data manager, created to hold values for game purpose
  allLoggedPlayersData : {},
  findMapNameByPlayerId : {},
  socketsOfPlayers : {},
  allMaps : {},
  keepAliveProtocol : {
    lastTime : 0,
    lastTimeForCheckingIfPlayersAreActive : 0
  }
};
dm.removePlayer = function(playerID) {
  this.allMaps[this.findMapNameByPlayerId[playerID]].removePlayer(playerID);
  delete this.allLoggedPlayersData[playerID];
  delete this.socketsOfPlayers[playerID];
  delete this.findMapNameByPlayerId[playerID];
};
dm.allMaps["firstMap"] = new FirstMap();



let socketHandler = (socket, io) => {

  socket.on("getGameData", async (object) => {

    console.log("got request to get game data from player with id: " + object.id);
    // if(dm.allLoggedPlayersData[object.id]){
    //   socket.emit("alreadyLoggedIn", {
    //     message : "user already logged in"
    //   });
    //   return;
    // }
    try {
      if (!object.id.match(/^[0-9a-fA-F]{24}$/)) {
        throw "id is not valid, doesn't mach ObjectID from monbodb";
      };
      let user = await User.findById(object.id);
      if(!user){
        console.log("shouldn't happen but user not found in socket.on(getGameData) sockets.js");
      } else {
        let characterData = {};
        characterData.x = user.x;
        characterData.y = user.y;
        characterData.experience = user.experience;
        characterData.requiredExperience = 1000;
        characterData.speed = 10;
        characterData.level = user.level;
        characterData.maxHealth = 10000;
        characterData.health = 5000;
        characterData.maxMana = 1000;
        characterData.mana = 500;
        characterData.attack = 50;
        characterData.id = object.id;
        characterData.active = true;
        characterData.width = 32;
        characterData.height = 32;
        characterData.currentMapName = user.currentMapName;

        dm.findMapNameByPlayerId[object.id] = user.currentMapName;
        dm.socketsOfPlayers[object.id] = socket;
        dm.allLoggedPlayersData[object.id] = characterData;
        dm.allMaps[user.currentMapName].addPlayer(characterData, socket);

        socket.emit("initialData",{
          characterData : characterData
        });
      }

    } catch(error) {
      console.log("SHIIIIT HAPPEND ! : " + error);
      socket.emit("error", {error});
    }
  });


  // keep alive protocol below

  let checkForConnection = (time) => {
    requestAnimationFrame(checkForConnection);

    if (time - dm.keepAliveProtocol.lastTimeForCheckingIfPlayersAreActive > 10000) {//every 10 sec we check for connection
      dm.keepAliveProtocol.lastTimeForCheckingIfPlayersAreActive = time;
      for (var playerID in dm.allLoggedPlayersData) {
          // skip loop if the property is from prototype
          if (!dm.allLoggedPlayersData.hasOwnProperty(playerID)) continue;
          if(!dm.allLoggedPlayersData[playerID]) continue;
          dm.allLoggedPlayersData[playerID].active = false;
      }
      io.emit("checkForConnection");
      setTimeout(async function(){
        for (var playerID in dm.allLoggedPlayersData) {
            // skip loop if the property is from prototype
            if (!dm.allLoggedPlayersData.hasOwnProperty(playerID)) continue;

            if(!dm.allLoggedPlayersData[playerID]) continue;
            var player = dm.allLoggedPlayersData[playerID];
            if(!dm.allLoggedPlayersData[playerID].active){
              try {
                var player = dm.allLoggedPlayersData[playerID];
                var user = await User.findById(playerID);
                user.x = player.x;
                user.y = player.y;
                console.log(player.x + " X");
                console.log(player.y + " Y");
                user.level = player.level;
                user.experience = player.experience;
                user.currentMapName = dm.findMapNameByPlayerId[player.id];
                await user.save();
                console.log("saved statis of :", user._id);
              }catch(e){
                console.log(e);
              };

              dm.removePlayer(playerID);
            }
        }
      }, 5000);


    }
  };

  socket.on("checkedConnection", (playerData) => {
    console.log("connecttion checked for player with id : " + playerData.id);
    if(dm.allLoggedPlayersData[playerData.id])
      dm.allLoggedPlayersData[playerData.id].active = true;
  });

  if(!dm.serverStarted){
    // sendToUserData();
    checkForConnection();
    dm.serverStarted = true;
  };
};


//polyfill to requestAnimationFrame
(function() {
    var lastTime = 0;

    if (!global.requestAnimationFrame)
        global.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = global.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!global.cancelAnimationFrame)
        global.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

module.exports = {
  socketHandler
};