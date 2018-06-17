const User = require("../database/models/userModel");

let dm = { // data manager, created to hold values for game purpose
  allLoggedPlayersData : {},
  findMapNameByPlayerId : {},
  socketsOfPlayers : {}
}
let socketHandler = (socket, io) => {

  socket.on("getGameData", async (object) => {

    console.log("got request to get game data from player with id: " + object.id);
    if(dm.allLoggedPlayersData[object.id]){
      socket.emit("alreadyLoggedIn", {
        message : "user already logged in"
      });
      return;
    }
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

        socket.emit("initialData",{
          characterData : characterData
        });
      }

    }catch(error){
      console.log("SHIIIIT HAPPEND ! : " + error);
      socket.emit("error", {error});
    }
  })

}

module.exports = {
  socketHandler
};
