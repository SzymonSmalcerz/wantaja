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
  },
  fps : 10,
  fightingMobs : []
};
dm.removePlayer = function(playerID) {
  this.allMaps[this.findMapNameByPlayerId[playerID]].removePlayer(playerID);
  if(this.allLoggedPlayersData[playerID].fightData && this.allLoggedPlayersData[playerID].fightData.opponent && this.allLoggedPlayersData[playerID].fightData.opponent.isFighting){
    this.allLoggedPlayersData[playerID].fightData.opponent.isFighting = false;
  };
  delete this.allLoggedPlayersData[playerID];
  this.socketsOfPlayers[playerID].disconnect();
  delete this.socketsOfPlayers[playerID];
  delete this.findMapNameByPlayerId[playerID];
};
dm.allMaps["firstMap"] = new FirstMap();



let socketHandler = (socket, io) => {

  socket.on("getGameData", async (object) => {

    console.log("got request to get game data from player with id: " + object.id);
    if(dm.allLoggedPlayersData[object.id] && dm.allLoggedPlayersData[object.id].initialized){
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
        characterData.mana = 50;
        characterData.maxMana = 75;
        characterData.attack = 50;
        characterData.id = object.id;
        characterData.currentMapName = user.currentMapName;


        dm.socketsOfPlayers[object.id] = socket;
        socket.emit("initialData",{
          characterData : characterData
        });

      }

    } catch(error) {
      console.log("SHIIIIT HAPPEND ! : " + error);
      socket.emit("error", {error});
    }
  });

  socket.on("initialized", function(data) {
    if(!dm.allLoggedPlayersData[data.id]){
      dm.allLoggedPlayersData[data.id] = data.characterData;
      dm.findMapNameByPlayerId[data.id] = data.characterData.currentMapName;
      console.log(data);
      console.log("initialized player with id : " + data.id);
      dm.allLoggedPlayersData[data.id].initialized = true;
      dm.allMaps[dm.findMapNameByPlayerId[data.id]].addPlayer(dm.allLoggedPlayersData[data.id], dm.socketsOfPlayers[data.id]);
    };
  });

  socket.on("initFight", function(data){
    let mapName = dm.findMapNameByPlayerId[data.playerID];
    let opponent = dm.allMaps[mapName].mobs[data.enemyID];
    let player = dm.allLoggedPlayersData[data.playerID];
    if(mapName && opponent && !opponent.isFighting){
      opponent.isFighting = true;
      player.fightData = {};
      player.fightData.opponent = opponent;
      opponent.fightData = {};
      opponent.fightData.opponent = player;
      opponent.fightData.fightTick = Date.now();
      dm.fightingMobs.push(opponent);
      // TODO skoncz prace z fightTick !!!!!
      dm.socketsOfPlayers[data.playerID].emit("fightInit",{
        enemyID : data.enemyID,
        enemyHealth : opponent.health,
        enemyMaxHealth : opponent.maxHealth
      });
    } else {
      if(dm.socketsOfPlayers[data.playerID] && !(player.fightData && player.fightData.opponent && player.fightData.opponent.isFighting)){
        dm.socketsOfPlayers[data.playerID].emit("fightEnemyAlreadyFighting");
      };
    }
  });

  socket.on("damageEnemy",function(data) {
    let player = dm.allLoggedPlayersData[data.playerID];
    if(!player || !player.fightData || !player.fightData.opponent){return};
    let enemy = dm.allLoggedPlayersData[data.playerID].fightData.opponent;
    enemy.health -= player.attack;
    if(enemy.health <= 0){
      dm.socketsOfPlayers[data.playerID].emit("handleWinFight");
      dm.allMaps[dm.findMapNameByPlayerId[data.playerID]].removeEnemy(enemy.id);
    } else {
      enemy.fightData.fightTick = Date.now();
      player.health -= enemy.damage;
      if(player.health <=0){
        enemy.isFighting = false;
        enemy.fightData = {};
        // inform other s on map that player papa
        // and handle his death TODO
      };
      dm.socketsOfPlayers[data.playerID].emit("fightMove", {
        enemyHealth : enemy.health,
        enemySkillName : enemy.skillName,
        playerHealth : player.health
      });
    };
  });




  socket.on("playerData", function(data) {
    if(!dm.allLoggedPlayersData[data.id]){return}
    dm.allLoggedPlayersData[data.id].active = true;
    dm.allLoggedPlayersData[data.id].x = data.x;
    dm.allLoggedPlayersData[data.id].y = data.y;
    dm.allLoggedPlayersData[data.id].frame = data.frame;
  })


  var sendToUserData = (time) => {
    requestAnimationFrame(sendToUserData);
    if(time - dm.keepAliveProtocol.lastTime > 1000/dm.fps){
      dm.keepAliveProtocol.lastTime = time;
      for(var mapID in dm.allMaps){
        if(!dm.allMaps.hasOwnProperty(mapID)) continue;
        dm.allMaps[mapID].tick();
      }
    }
  };

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
            if(dm.allLoggedPlayersData[playerID].initialized && !dm.allLoggedPlayersData[playerID].active){
              try {
                var player = dm.allLoggedPlayersData[playerID];
                var user = await User.findById(playerID);
                user.x = player.x;
                user.y = player.y;
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
    if(dm.allLoggedPlayersData[playerData.id]){
        dm.allLoggedPlayersData[playerData.id].active = true;
    };
  });

  if(!dm.serverStarted){
    sendToUserData();
    checkForConnection();
    dm.serverStarted = true;
  };
};

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
