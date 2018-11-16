const dm = require("../dataManager");
const equipment = require("../equipment/equipment");
const User = require("../../database/models/userModel");

function fightListeners(socket) {
  socket.on("initFight", function(data) {
    let mapName = dm.findMapNameByPlayerId[socket.playerID];
    let opponent = dm.allMaps[mapName].mobs[data.enemyID];
    let player = dm.allLoggedPlayersData[socket.playerID];
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
      socket.emit("fightInit",{
        enemyID : data.enemyID,
        enemyHealth : opponent.health,
        enemyMaxHealth : opponent.maxHealth
      });
      dm.allMaps[player.currentMapName].emitDataToPlayers("renderSwords",data);
    } else {
      if(socket && !(player.fightData && player.fightData.opponent && player.fightData.opponent.isFighting)) {
        socket.emit("fightEnemyAlreadyFighting");
      };
    }
  });

  socket.on("damageEnemy",function(data) {
    let playerSkill = dm.skills[data.skillName];
    if (!playerSkill) {
      console.log(`skill : ${data.skillName} doesn't exists !!!!`)
      return;
    }
    let player = dm.allLoggedPlayersData[socket.playerID];
    if(!player || !player.fightData || !player.fightData.opponent) {return};
    let enemy = dm.allLoggedPlayersData[socket.playerID].fightData.opponent;
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
        dm.playerFunctions.levelUp(player, socket);
      };

      // TODO
      player.claimedItem = null;
      let drop = enemy.drop();
      if(drop.droppedItem) {
        drop.droppedItem = equipment[drop.droppedItem.type][drop.droppedItem.key];
        player.claimedItem = drop.droppedItem;
      }
      player.money += drop.droppedMoney;
      if(dm.allLoggedPlayersData[socket.playerID].missionsKillEnemiesDictionary[enemy.key] && dm.allLoggedPlayersData[socket.playerID].missionsKillEnemiesDictionary[enemy.key].length > 0) {

        let missionToReduceNumOfMobs = [];
        dm.allLoggedPlayersData[socket.playerID].missionsKillEnemiesDictionary[enemy.key].forEach(mission => {
          mission.currentStage.numberLeft -= 1;
          if(mission.currentStage.numberLeft <= 0) {
            dm.changeMissionStage(socket, mission.missionName);
          } else {
            missionToReduceNumOfMobs.push({
              missionName : mission.missionName
            })
          }
        });
        socket.emit("handleWinFight",{
          playerExperience : player.experience,
          playerMoveResult,
          drop,
          missionToReduceNumOfMobs
        });

      } else {
        socket.emit("handleWinFight",{
          playerExperience : player.experience,
          playerMoveResult,
          drop
        });
      }

      dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].removeEnemy(enemy.id);
      player.fightData = {};
      // TODO


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
        dm.handlePlayerDeath(socket);
      } else {
        socket.emit("fightMove", {
          enemyHealth : enemy.health,
          enemySkillName : enemy.skillName,
          playerHealth : player.health,
          playerMana : player.mana,
          enemyMoveResult,
          playerMoveResult
        });
      }

    };
  });
}

module.exports = fightListeners;
