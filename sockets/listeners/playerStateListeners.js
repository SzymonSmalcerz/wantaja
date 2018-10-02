const User = require("../../database/models/userModel");
const dm = require("../dataManager");

function playerStateListeners(socket, io) {

  socket.on("addStatusPoint", (data) => {
    let player = dm.allLoggedPlayersData[socket.playerID];
    if(player) {
      if(player.leftStatusPoints < 0 ) {return;}
      player[data.statusName] += 1;
      player.attack = dm.playerFunctions.calculateAttack(player);
      player.maxMana = dm.playerFunctions.calculateMaxMana(player);
      player.maxHealth = dm.playerFunctions.calculateMaxHp(player);
      player.dodge = dm.playerFunctions.calculateDodge(player);
      player.leftStatusPoints -= 1;
      socket.emit("playerUpdate",{
        attack : player.attack,
        maxMana : player.maxMana,
        maxHealth : player.maxHealth,
        dodge : player.dodge
      });
    };
  });

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
        socket.emit("alert",{
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
        socket.emit('changedMap', {
          mapName : dm.findMapNameByPlayerId[socket.playerID],
          mapBackgrounds : dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]] ? dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].backgrounds : [],
          fightingStageBackground : dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]] ? dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].fightingStageBackground : [],
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
                let equipmentToSave = [];
                player.equipment.forEach((row, y) => {
                  row.forEach((eqPlace, x) => {
                    if(eqPlace.item && eqPlace.placeTaken) {
                      equipmentToSave.push({
                        key : eqPlace.item.key,
                        type : eqPlace.item.type,
                        x,
                        y
                      })
                    }
                  })
                });
                user.equipment = equipmentToSave;
                let equipmentCurrentlyDressedToSave = {};
                for (var type in player.equipmentCurrentlyDressed) {
                  if (player.equipmentCurrentlyDressed.hasOwnProperty(type) && player.equipmentCurrentlyDressed[type].placeTaken) {
                    equipmentCurrentlyDressedToSave[type] = player.equipmentCurrentlyDressed[type].item.key;
                  }
                }
                user.equipmentCurrentlyDressed = equipmentCurrentlyDressedToSave;
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
                user.money = player.money;

                user.missions = player.missions;

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

  socket.on("checkedConnection", () => {
    if(dm.allLoggedPlayersData[socket.playerID]) {
        dm.allLoggedPlayersData[socket.playerID].active = true;
    };
  });

  if(!dm.serverStarted) {
    sendToUserData();
    checkForConnection();
    dm.serverStarted = true;
  };

}

module.exports = playerStateListeners;
