const User = require("../../database/models/userModel");
const dm = require("../dataManager");
const equipment = require("../equipment/equipment");

let initializers = function(socket) {
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

        characterData.missions = {};
        // characterData.doneMissions = user.doneMissions;

        user.missions.forEach(mission => {
          console.log(mission);
          characterData.missions[mission.missionName] = {
            missionName : mission.missionName,
            currentStage : dm.missions[mission.missionName].getStage(mission.currentStage)
          }
        });

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
        } else {
          let allEquipmentTypes = ["weapon","helmet","gloves","armor","shield","boots","special"];
          allEquipmentTypes.forEach(type => {
            characterData.equipmentCurrentlyDressed[type] = {};
            characterData.equipmentCurrentlyDressed[type].item = null;
            characterData.equipmentCurrentlyDressed[type].placeTaken = false;
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

        characterData.money = user.money;

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

        characterData.nick = user.nick;

        if(characterData.nick == "admin") {
          characterData.key = "gm";
          characterData.strength = 100;
          characterData.vitality = 100;
          characterData.intelligence = 100;
          characterData.agility = 100;
          characterData.money = 999999999;
          characterData.level = 99;
        } else {
          characterData.key = user.key;
        }
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
            fightingStageBackground : dm.allMaps[characterData.currentMapName].fightingStageBackground,
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

  socket.on("initialized", function() {
    let data = socket.characterData;
    dm.allLoggedPlayersData[socket.playerID].key = data.key;
    dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].addPlayer(dm.allLoggedPlayersData[socket.playerID], socket);
    // dm.allLoggedPlayersData[socket.playerID].socket = dm.socketsOfPlayers[socket.playerID];
    dm.allLoggedPlayersData[socket.playerID].active = true;
  });
}

module.exports = initializers;
