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
    calculateMaxHp : function(player) {
      return (player.vitality + player.level + player.additionalVitality) * 15 + 70;
    },
    calculateMaxMana : function(player) {
      return (player.intelligence + player.level + player.additionalIntelligence) * 5;
    },
    calculateAttack : function(player) {
      // return (player.strength + player.level + player.additionalStrength) * 10 + player[type].attack;
      return (player.strength + player.level + player.additionalStrength) * 10;
    },
    calculateDodge : function(player) {
      return (player.agility + player.additionalAgility)/player.level * 10;
    },
    calculateRequiredExperience : function(player) {
      return player.level * 150;;
    },
    calculateLeftStatusPoints : function(player) {
      return player.level * 5 - (player.strength + player.vitality + player.intelligence + player.agility);
    },
    calculateAll : function(player) {
      player.maxHealth = this.calculateMaxHp(player);
      player.maxMana = this.calculateMaxMana(player);
      player.attack = this.calculateAttack(player);
      player.dodge = this.calculateDodge(player);
      player.requiredExperience = this.calculateRequiredExperience(player);
      player.leftStatusPoints = this.calculateLeftStatusPoints(player);
    },
    levelUp : function(player) {
      player.level += 1;
      player.experience = 0;
      player.leftStatusPoints += 5;
      this.updatePlayerData(player);
    },
    updatePlayerData : function(player) {
      player.requiredExperience = dm.playerFunctions.calculateRequiredExperience(player);
      player.attack = dm.playerFunctions.calculateAttack(player);
      player.maxMana = dm.playerFunctions.calculateMaxMana(player);
      player.maxHealth = dm.playerFunctions.calculateMaxHp(player);
      player.dodge = dm.playerFunctions.calculateDodge(player);
      dm.socketsOfPlayers[player.id].emit("updatePlayerData", {
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
  if(this.allLoggedPlayersData[playerID].fightData && this.allLoggedPlayersData[playerID].fightData.opponent && this.allLoggedPlayersData[playerID].fightData.opponent.isFighting) {
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
    if(dm.allLoggedPlayersData[object.id]) {
      socket.emit("alreadyLoggedIn", {
        message : "user already logged in"
      });
      return;
    }
    try {
      if (!object.id.match(/^[0-9a-fA-F]{24}$/)) {
        throw "id is not valid, doesn't mach ObjectID from mongodb";
      };
      let user = await User.findById(object.id);
      if(!user) {
        console.log("shouldn't happen but user not found in socket.on(getGameData) sockets.js");
      } else {
        let characterData = {};
        characterData.level = user.level;
        characterData.x = user.x;
        characterData.y = user.y;
        characterData.experience = user.experience;

        // characterData.equipmentCurrentlyDressed = user.equipmentCurrentlyDressed;
        characterData.equipment = user.equipment;
        characterData.additionalAgility = 0;
        characterData.additionalStrength = 0;
        characterData.additionalIntelligence = 0;
        characterData.additionalVitality = 0;

        characterData.equipmentCurrentlyDressed = {};
        if(user.equipmentCurrentlyDressed) {
          let allEquipmentTypes = ["weapon","helmet","gloves","armor","shield","boots","special"];
          allEquipmentTypes.forEach(type => {
            if(user.equipmentCurrentlyDressed[type]) {
              let key = user.equipmentCurrentlyDressed ? user.equipmentCurrentlyDressed[type] : null;
              characterData.additionalAgility += equipment[type][key] ? equipment[type][key].agility || 0 : 0;
              characterData.additionalStrength += equipment[type][key] ? equipment[type][key].strength || 0 : 0;
              characterData.additionalIntelligence += equipment[type][key] ? equipment[type][key].intelligence || 0 : 0;
              characterData.additionalVitality += equipment[type][key] ? equipment[type][key].vitality || 0 : 0;
              characterData.equipmentCurrentlyDressed[type] = {};
              characterData.equipmentCurrentlyDressed[type].item = equipment[type][key];
              characterData.equipmentCurrentlyDressed[type].placeTaken = true;
            } else {
              characterData.equipmentCurrentlyDressed[type] = {};
              characterData.equipmentCurrentlyDressed[type].item = null;
              characterData.equipmentCurrentlyDressed[type].placeTaken = false;
            }
          })
        }

        characterData.equipmentLength = 4;
        characterData.equipmentHeight = 3;
        characterData.equipment = [];
        for(let i = 0;i<characterData.equipmentHeight;i++) {
          for(let j = 0;j<characterData.equipmentLength;j++) {
            characterData.equipment[i] = characterData.equipment[i] || [];
            characterData.equipment[i][j] = {};
            characterData.equipment[i][j].item = {};
            characterData.equipment[i][j].placeTaken = false;
          }
        };

        user.equipment.forEach(object => {
          characterData.equipment[object.y][object.x].item = {
            ...object._doc,
            ...equipment[object.type][object.key]
          };
          characterData.equipment[object.y][object.x].placeTaken = true;
        });

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

        dm.playerFunctions.calculateAll(characterData);

        socket.characterData = characterData;
        socket.playerID = characterData.id;
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
    data = dm.socketsOfPlayers[socket.playerID].characterData;
    dm.allLoggedPlayersData[socket.playerID].key = data.key;
    dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].addPlayer(dm.allLoggedPlayersData[socket.playerID], dm.socketsOfPlayers[socket.playerID]);
    dm.allLoggedPlayersData[socket.playerID].socket = dm.socketsOfPlayers[socket.playerID];
    dm.allLoggedPlayersData[socket.playerID].active = true;
  });

  socket.on("takeOffItem", function(data) {
    let plData = dm.allLoggedPlayersData[socket.playerID];
    let item = plData.equipmentCurrentlyDressed[data.type].item;
    let result = takeOffItem(plData, item);
    if(result) {
      dm.playerFunctions.updatePlayerData(plData);
      socket.emit('takeOffItem', {
        type : item.type,
        position : result
      });
    } else {
      socket.emit('alert' , {
        message : `not enough space in equipment !`
      })
    }
  });

  function takeOffItem(plData, item) {
    if(!item) {
      console.log(`item doesn't exists`);
      return;
    }

    let type = item.type;
    let position = undefined;
    plData.equipment.forEach((row, yPos) => {
      row.forEach((object, xPos) => {
        if(!position && !object.placeTaken) {
          position = {
            x : xPos,
            y : yPos
          }
          plData.additionalAgility -= plData.equipmentCurrentlyDressed[type].item.agility;
          plData.additionalStrength -= plData.equipmentCurrentlyDressed[type].item.strength;
          plData.additionalIntelligence -= plData.equipmentCurrentlyDressed[type].item.intelligence;
          plData.additionalVitality -= plData.equipmentCurrentlyDressed[type].item.vitality;

          plData.equipment[yPos][xPos].item = plData.equipmentCurrentlyDressed[type].item;
          plData.equipment[yPos][xPos].placeTaken = true;

          plData.equipmentCurrentlyDressed[type].placeTaken = false;
        }
      })
    });

    if(position) {
      return position;
    } else {
      return false;
    }
  }

  socket.on("dressItem", function(data) {
    let plData = dm.allLoggedPlayersData[socket.playerID];
    let eqPlace = plData.equipment[data.y][data.x];

    if(!eqPlace) {
      console.log(`? :) eqPlace out of bounds`);
      return;
    } else if(!eqPlace.item || !eqPlace.placeTaken) {
      console.log(eqPlace.item);
      console.log(eqPlace.placeTaken);
        console.log('data');
        console.log(data);
      console.log(`item doesn't exists or this place is not occupied by any item`);
      return;
    }

    let item = plData.equipment[data.y][data.x].item;

    let newOldWearItemPositions;
    if(plData.equipmentCurrentlyDressed[item.type].placeTaken) {
      newOldWearItemPositions = takeOffItem(plData, plData.equipmentCurrentlyDressed[item.type].item);
    }

    plData.equipmentCurrentlyDressed[item.type].item = plData.equipment[data.y][data.x].item;
    plData.equipmentCurrentlyDressed[item.type].placeTaken = true;
    plData.additionalAgility += plData.equipmentCurrentlyDressed[item.type].item.agility;
    plData.additionalStrength += plData.equipmentCurrentlyDressed[item.type].item.strength;
    plData.additionalIntelligence += plData.equipmentCurrentlyDressed[item.type].item.intelligence;
    plData.additionalVitality += plData.equipmentCurrentlyDressed[item.type].item.vitality;
    plData.equipment[data.y][data.x].placeTaken = false;

    dm.playerFunctions.updatePlayerData(plData);

    socket.emit('dressItem', {
      newOldWearItemPositions,
      currentlyWearItemOldPositions : {
        x : data.x,
        y : data.y
      }
    });
  });

  socket.on("destroyItem", function(data) {
    let plData = dm.allLoggedPlayersData[socket.playerID];

    if(data.isCurrentlyWear) {
      if(!plData.equipmentCurrentlyDressed[data.type].item || !plData.equipmentCurrentlyDressed[data.type].placeTaken) {
        console.log(`? :) non item with type ${data.type} is wear by this player :o`);
        return;
      } else {
        plData.additionalAgility -= plData.equipmentCurrentlyDressed[data.type].item.agility;
        plData.additionalStrength -= plData.equipmentCurrentlyDressed[data.type].item.strength;
        plData.additionalIntelligence -= plData.equipmentCurrentlyDressed[data.type].item.intelligence;
        plData.additionalVitality -= plData.equipmentCurrentlyDressed[data.type].item.vitality;
        plData.equipmentCurrentlyDressed[data.type].placeTaken = false;
        dm.playerFunctions.updatePlayerData(plData);
      }
    } else {
      let eqPlace = plData.equipment[data.y][data.x];
      if(!eqPlace) {
        console.log(`? :) eqPlace out of bounds`);
        return;
      } else if(!eqPlace.item || !eqPlace.placeTaken) {
        console.log(`item doesn't exists or this place is not occupied by any item`);
        return;
      } else {
        plData.equipment[data.y][data.x].placeTaken = false;
      }
    }

    socket.emit('discardItem', data);
  });

  socket.on("discardItem", function(data) {
    let plData = dm.allLoggedPlayersData[socket.playerID];
    let discardedItem;
    if(data.isCurrentlyWear) {
      if(!plData.equipmentCurrentlyDressed[data.type].item || !plData.equipmentCurrentlyDressed[data.type].placeTaken) {
        console.log(`? :) non item with type ${data.type} is wear by this player :o`);
        return;
      } else {
        discardedItem = plData.equipmentCurrentlyDressed[data.type].item;
        plData.additionalAgility -= plData.equipmentCurrentlyDressed[data.type].item.agility;
        plData.additionalStrength -= plData.equipmentCurrentlyDressed[data.type].item.strength;
        plData.additionalIntelligence -= plData.equipmentCurrentlyDressed[data.type].item.intelligence;
        plData.additionalVitality -= plData.equipmentCurrentlyDressed[data.type].item.vitality;
        plData.equipmentCurrentlyDressed[data.type].placeTaken = false;
        dm.playerFunctions.updatePlayerData(plData);
      }
    } else {
      let eqPlace = plData.equipment[data.y][data.x];
      if(!eqPlace) {
        console.log(`? :) eqPlace out of bounds`);
        return;
      } else if(!eqPlace.item || !eqPlace.placeTaken) {
        console.log(`item doesn't exists or this place is not occupied by any item`);
        return;
      } else {
        discardedItem = eqPlace.item;
        eqPlace.placeTaken = false;
      }
    }

    dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].addItem({
      x : dm.allLoggedPlayersData[socket.playerID].x,
      y : dm.allLoggedPlayersData[socket.playerID].y,
      key : discardedItem.key,
      type : discardedItem.type
    });

    socket.emit('discardItem', data);
  });

  socket.on("pickUpItem", function(data) {

    let plData = dm.allLoggedPlayersData[socket.playerID];
    let map = dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]];
    if(map.items[data.itemID] && playerInRange(plData, map.items[data.itemID])) {
      let itemEqPosition = getFirstFreePositionInPlayerEquipment(plData);
      if(!itemEqPosition) {
        dm.socketsOfPlayers[socket.playerID].emit("alert",{
          message : `you don't have enough free\nspace in your equipment!\n`
        });
        return;
      }
      plData.equipment[itemEqPosition.y][itemEqPosition.x].item = {
        ...itemEqPosition,
        ...equipment[map.items[data.itemID].type][map.items[data.itemID].key]
      }
      plData.equipment[itemEqPosition.y][itemEqPosition.x].placeTaken = true;
      console.log('itemEqPosition');
      console.log(itemEqPosition);
      map.removeItem(data.itemID);
      dm.socketsOfPlayers[socket.playerID].emit("addItemToEquipment", plData.equipment[itemEqPosition.y][itemEqPosition.x]);

    }
  });

  function playerInRange(playerData, entity, range) {
    xDifference = playerData.x - entity.x;
    yDifference = playerData.y - entity.y;
    range = range || 100;
    //check if player is in range of the entity
    if(Math.abs(xDifference) < range && Math.abs(yDifference) < range) {
      return true;
    } else {
      return false;
    }
  }

  function getFirstFreePositionInPlayerEquipment(playerData) {
    let position = undefined;
    playerData.equipment.forEach((row, yPos) => {
      row.forEach((object, xPos) => {
        if(!position && !object.placeTaken) {
          position = {
            x : xPos,
            y : yPos
          }
        }
      })
    });
    return position;
  }

  let doorWidth = 30;
  let doorHeight = 46;
  let xDifference;
  let yDifference;
  let map;
  socket.on("changeMap", function(data) {
    map = dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]];
    //check if this door is registered for this map
    if(map && map.nextMaps[data.mapName]) {
      xDifference = dm.allLoggedPlayersData[socket.playerID].x - map.nextMaps[data.mapName].doorX;
      yDifference = dm.allLoggedPlayersData[socket.playerID].y - map.nextMaps[data.mapName].doorY;

      // check if player has required Level
      if(map.nextMaps[data.mapName].requiredLevel > dm.allLoggedPlayersData[socket.playerID].level) {
        dm.socketsOfPlayers[socket.playerID].emit("alert",{
          message : `you must reach ${map.nextMaps[data.mapName].requiredLevel} level\nto go to this location`
        });
        return;
      }

      //check if player is in range of the door
      if(Math.abs(xDifference) < 100 && Math.abs(yDifference) < 100) {

        map.removePlayer(socket.playerID);
        dm.allLoggedPlayersData[socket.playerID].currentMapName = data.mapName;
        dm.findMapNameByPlayerId[socket.playerID] = data.mapName;
        dm.allLoggedPlayersData[socket.playerID].active = true;
        dm.socketsOfPlayers[socket.playerID].emit('changedMap', {
          mapName : dm.findMapNameByPlayerId[socket.playerID],
          mapBackgrounds : dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]] ? dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].backgrounds : [],
          playerX : map.nextMaps[data.mapName].playerX,
          playerY : map.nextMaps[data.mapName].playerY
        });
        dm.allLoggedPlayersData[socket.playerID].x = map.nextMaps[data.mapName].playerX;
        dm.allLoggedPlayersData[socket.playerID].y = map.nextMaps[data.mapName].playerY;
      }
    } else {
      console.log(`map with name ${data.mapName} is not registered for ${dm.findMapNameByPlayerId[socket.playerID]}!!!!`);
    }
  });

  socket.on("initFight", function(data) {
    let mapName = dm.findMapNameByPlayerId[data.playerID];
    let opponent = dm.allMaps[mapName].mobs[data.enemyID];
    let player = dm.allLoggedPlayersData[data.playerID];
    if(mapName && opponent && !opponent.isFighting) {
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
      if(dm.socketsOfPlayers[data.playerID] && !(player.fightData && player.fightData.opponent && player.fightData.opponent.isFighting)) {
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
    if(!player || !player.fightData || !player.fightData.opponent) {return};
    let enemy = dm.allLoggedPlayersData[data.playerID].fightData.opponent;
    let enemyMoveResult = {};
    let playerMoveResult = {};
    if(player.mana >= playerSkill.manaCost) {
      playerMoveResult = playerSkill.getDamage(player,enemy);
    };
    if(enemy.health <= 0) {
      dm.allMaps[player.currentMapName].emitDataToPlayers("removeSwords",{
        enemyID : enemy.id,
        playerID : player.id
      });
      player.experience += enemy.exp;
      if(player.experience > player.requiredExperience) {
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
      if(player.health <=0) {
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
    if(!dm.allLoggedPlayersData[socket.playerID]) {return}
    dm.allLoggedPlayersData[socket.playerID].active = true;
    dm.allLoggedPlayersData[socket.playerID].x = data.x;
    dm.allLoggedPlayersData[socket.playerID].y = data.y;
    dm.allLoggedPlayersData[socket.playerID].frame = data.frame;
  })


  var sendToUserData = (time) => {
    requestAnimationFrame(sendToUserData);
    if(time - dm.keepAliveProtocol.lastTime > 1000/dm.fps) {
      dm.keepAliveProtocol.lastTime = time;
      for(var mapID in dm.allMaps) {
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
      setTimeout(async function() {
        for (var playerID in dm.allLoggedPlayersData) {
            // skip loop if the property is from prototype
            if (!dm.allLoggedPlayersData.hasOwnProperty(playerID)) continue;

            if(!dm.allLoggedPlayersData[playerID]) continue;
            var player = dm.allLoggedPlayersData[playerID];
            if(!dm.allLoggedPlayersData[playerID].active) {
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
              }catch(e) {
                console.log(e);
              };

              dm.removePlayer(playerID);
            }
        }
      }, 5000);


    }
  };

  socket.on("checkedConnection", (playerData) => {
    if(dm.allLoggedPlayersData[socket.playerID]) {
        dm.allLoggedPlayersData[socket.playerID].active = true;
    };
  });


  socket.on("addStatusPoint", (data) => {
    let player = dm.allLoggedPlayersData[data.playerID];
    if(player) {
      if(player.leftStatusPoints < 0 ) {return;}
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

  if(!dm.serverStarted) {
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
