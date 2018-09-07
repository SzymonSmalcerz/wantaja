const User = require("../database/models/userModel");
const { FirstMap, SecondMap } = require("./maps/Maps");
const skills = require("./skills/skill");
const equipment = require("./equipment/equipment");

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
  fightingMobs : [],
  skills : {
    "punch" : new skills.Punch,
    "poison" : new skills.Poison,
    "ignite" : new skills.Ignite,
    "entangle" : new skills.Entangle,
    "health" : new skills.Health
  },
  playerFunctions : {
    calculateMaxHp : function(player){
      return (player.vitality + player.level + player.additionalVitality) * 15 + 70;
    },
    calculateMaxMana : function(player){
      return (player.intelligence + player.level + player.additionalIntelligence) * 5;
    },
    calculateAttack : function(player){
      // return (player.strength + player.level + player.additionalStrength) * 10 + player[type].attack;
      return (player.strength + player.level + player.additionalStrength) * 10;
    },
    calculateDodge : function(player){
      return (player.agility + player.additionalAgility)/player.level * 10;
    },
    calculateRequiredExperience : function(player){
      return player.level * 150;;
    },
    calculateLeftStatusPoints : function(player){
      return player.level * 5 - (player.strength + player.vitality + player.intelligence + player.agility);
    },
    levelUp : function(player) {
      player.level += 1;
      player.experience = 0;
      player.requiredExperience = dm.playerFunctions.calculateRequiredExperience(player);
      player.attack = dm.playerFunctions.calculateAttack(player);
      player.maxMana = dm.playerFunctions.calculateMaxMana(player);
      player.maxHealth = dm.playerFunctions.calculateMaxHp(player);
      player.dodge = dm.playerFunctions.calculateDodge(player);
      // player.dodge = 100;
      player.leftStatusPoints += 5;

      dm.socketsOfPlayers[player.id].emit("levelUp", {
        level : player.level,
        requiredExperience : player.requiredExperience,
        experience : player.experience,
        attack : player.attack,
        maxMana : player.maxMana,
        maxHealth : player.maxHealth,
        leftStatusPoints : player.leftStatusPoints,
        dodge : player.dodge
      })
    }
  }
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
dm.allMaps["secondMap"] = new SecondMap();



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
        characterData.level = user.level;
        characterData.x = user.x;
        characterData.y = user.y;
        characterData.experience = user.experience;

        characterData.equipmentCurrentlyDressed = user.equipmentCurrentlyDressed;
        characterData.equipment = user.equipment;
        characterData.additionalAgility = 0;
        characterData.additionalStrength = 0;
        characterData.additionalIntelligence = 0;
        characterData.additionalVitality = 0;
        if(user.equipmentCurrentlyDressed) {
          let allEquipmentTypes = ["weapon","helmet","gloves","armor","shield","boots"];
          allEquipmentTypes.forEach(type => {
            let key = user.equipmentCurrentlyDressed ? user.equipmentCurrentlyDressed[type] : null;
            characterData.additionalAgility += equipment[type][key] ? equipment[type][key].agility || 0 : 0;
            characterData.additionalStrength += equipment[type][key] ? equipment[type][key].strength || 0 : 0;
            characterData.additionalIntelligence += equipment[type][key] ? equipment[type][key].intelligence || 0 : 0;
            characterData.additionalVitality += equipment[type][key] ? equipment[type][key].vitality || 0 : 0;
          })
        }


        characterData.strength = user.strength;
        characterData.vitality = user.vitality;
        characterData.intelligence = user.intelligence;
        characterData.agility = user.agility;

        characterData.key = user.key;
        characterData.gender = "male";

        characterData.id = object.id;
        characterData.currentMapName = user.currentMapName;
        dm.socketsOfPlayers[object.id] = socket;
        dm.allLoggedPlayersData[characterData.id] = characterData;
        dm.allLoggedPlayersData[characterData.id].active = true;
        dm.findMapNameByPlayerId[characterData.id] = characterData.currentMapName;

        characterData.maxHealth = dm.playerFunctions.calculateMaxHp(characterData);
        characterData.maxMana = dm.playerFunctions.calculateMaxMana(characterData);
        characterData.attack = dm.playerFunctions.calculateAttack(characterData);
        characterData.requiredExperience = dm.playerFunctions.calculateRequiredExperience(characterData);
        characterData.leftStatusPoints = dm.playerFunctions.calculateLeftStatusPoints(characterData);

        socket.emit("initialData",{
          characterData,
          mapData : {
            backgrounds : dm.allMaps[characterData.currentMapName].backgrounds,
            dimensions : {
              height :  dm.allMaps[characterData.currentMapName].height,
              width :  dm.allMaps[characterData.currentMapName].width
            }
          }
        });
      }

    } catch(error) {
      console.log("SHIIIIT HAPPEND ! : " + error);
      socket.emit("error", {error});
    }
  });

  socket.on("initialized", function(data) {
    dm.allLoggedPlayersData[data.id].key = data.key;
    dm.allMaps[dm.findMapNameByPlayerId[data.id]].addPlayer(dm.allLoggedPlayersData[data.id], dm.socketsOfPlayers[data.id]);
    dm.allLoggedPlayersData[data.id].socket = dm.socketsOfPlayers[data.id];
    dm.allLoggedPlayersData[data.id].active = true;
  });

  let doorWidth = 30;
  let doorHeight = 46;
  let xDifference;
  let yDifference;
  let map;
  socket.on("changeMap", function(data) {
    map = dm.allMaps[dm.findMapNameByPlayerId[data.id]];
    //check if this door is registered for this map
    if(map && map.nextMaps[data.mapName]) {
      xDifference = dm.allLoggedPlayersData[data.id].x - map.nextMaps[data.mapName].doorX;
      yDifference = dm.allLoggedPlayersData[data.id].y - map.nextMaps[data.mapName].doorY;

      // check if player has required Level
      if(map.nextMaps[data.mapName].requiredLevel > dm.allLoggedPlayersData[data.id].level) {
        dm.socketsOfPlayers[data.id].emit("alert",{
          message : `you must reach ${map.nextMaps[data.mapName].requiredLevel} level\nto go to this location`
        });
        return;
      }

      //check if player is in range of the door
      if(Math.abs(xDifference) < 100 && Math.abs(yDifference) < 100) {

        map.removePlayer(data.id);
        dm.allLoggedPlayersData[data.id].currentMapName = data.mapName;
        dm.findMapNameByPlayerId[data.id] = data.mapName;
        dm.allLoggedPlayersData[data.id].active = true;
        dm.socketsOfPlayers[data.id].emit('changedMap', {
          mapName : dm.findMapNameByPlayerId[data.id],
          mapBackgrounds : dm.allMaps[dm.findMapNameByPlayerId[data.id]] ? dm.allMaps[dm.findMapNameByPlayerId[data.id]].backgrounds : [],
          playerX : map.nextMaps[data.mapName].playerX,
          playerY : map.nextMaps[data.mapName].playerY
        });
        dm.allLoggedPlayersData[data.id].x = map.nextMaps[data.mapName].playerX;
        dm.allLoggedPlayersData[data.id].y = map.nextMaps[data.mapName].playerY;
      }
    } else {
      console.log(`map with name ${data.mapName} is not registered for ${dm.findMapNameByPlayerId[data.id]}!!!!`);
    }
  });

  socket.on("initFight", function(data){
    let mapName = dm.findMapNameByPlayerId[data.playerID];
    let opponent = dm.allMaps[mapName].mobs[data.enemyID];
    let player = dm.allLoggedPlayersData[data.playerID];
    if(mapName && opponent && !opponent.isFighting){
      opponent.isFighting = true;
      player.fightData = {};
      player.fightData.opponent = opponent;
      player.mana = player.maxMana;
      player.health = player.maxHealth;
      opponent.fightData = {};
      opponent.fightData.opponent = player;
      opponent.fightData.fightTick = Date.now();
      dm.fightingMobs.push(opponent);
      dm.socketsOfPlayers[data.playerID].emit("fightInit",{
        enemyID : data.enemyID,
        enemyHealth : opponent.health,
        enemyMaxHealth : opponent.maxHealth
      });
      dm.allMaps[player.currentMapName].emitDataToPlayers("renderSwords",data);
    } else {
      if(dm.socketsOfPlayers[data.playerID] && !(player.fightData && player.fightData.opponent && player.fightData.opponent.isFighting)){
        dm.socketsOfPlayers[data.playerID].emit("fightEnemyAlreadyFighting");
      };
    }
  });

  socket.on("damageEnemy",function(data) {
    let playerSkill = dm.skills[data.skillName];
    if (!playerSkill) {
      console.log(`skill : ${data.skillName} doesn't exists !!!!`)
      return;
    }
    let player = dm.allLoggedPlayersData[data.playerID];
    if(!player || !player.fightData || !player.fightData.opponent){return};
    let enemy = dm.allLoggedPlayersData[data.playerID].fightData.opponent;
    let enemyMoveResult = {};
    let playerMoveResult = {};
    if(player.mana >= playerSkill.manaCost){
      playerMoveResult = playerSkill.getDamage(player,enemy);
    };
    if(enemy.health <= 0){
      dm.allMaps[player.currentMapName].emitDataToPlayers("removeSwords",{
        enemyID : enemy.id,
        playerID : player.id
      });
      player.experience += enemy.exp;
      if(player.experience > player.requiredExperience){
        dm.playerFunctions.levelUp(player);
      };
      dm.socketsOfPlayers[data.playerID].emit("handleWinFight",{
        playerExperience : player.experience,
        playerMoveResult
      });
      dm.allMaps[dm.findMapNameByPlayerId[data.playerID]].removeEnemy(enemy.id);
      player.fightData = {};
    } else {
      enemy.fightData.fightTick = Date.now();
      enemySkill = dm.skills[enemy.skillName];
      enemyMoveResult = enemySkill.getDamage(enemy,player);
      if(player.health <=0){
        enemy.isFighting = false;
        enemy.fightData = {};
        dm.allMaps[player.currentMapName].emitDataToPlayers("removeSwords",{
          enemyID : enemy.id,
          playerID : player.id
        });
        player.fightData = {};
        // inform other s on map that player papa
        // and handle his death TODO
      };
      dm.socketsOfPlayers[data.playerID].emit("fightMove", {
        enemyHealth : enemy.health,
        enemySkillName : enemy.skillName,
        playerHealth : player.health,
        playerMana : player.mana,
        enemyMoveResult,
        playerMoveResult
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
            if(!dm.allLoggedPlayersData[playerID].active){
              try {
                var player = dm.allLoggedPlayersData[playerID];
                var user = await User.findById(playerID);
                user.x = player.x;
                user.y = player.y;
                user.level = player.level;
                user.experience = player.experience;
                user.currentMapName = dm.findMapNameByPlayerId[player.id];
                user.strength = player.strength;
                user.vitality = player.vitality;
                user.intelligence = player.intelligence;
                user.agility = player.agility;
                user.key = player.key;
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


  socket.on("addStatusPoint", (data) => {
    let player = dm.allLoggedPlayersData[data.playerID];
    if(player) {
      if(player.leftStatusPoints < 0 ){return;}
      player[data.statusName] += 1;
      player.attack = dm.playerFunctions.calculateAttack(player);
      player.maxMana = dm.playerFunctions.calculateMaxMana(player);
      player.maxHealth = dm.playerFunctions.calculateMaxHp(player);
      player.dodge = dm.playerFunctions.calculateDodge(player);
      player.leftStatusPoints -= 1;
      dm.socketsOfPlayers[data.playerID].emit("playerUpdate",{
        attack : player.attack,
        maxMana : player.maxMana,
        maxHealth : player.maxHealth,
        dodge : player.dodge
      });
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
