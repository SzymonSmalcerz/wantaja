const { Greengrove, Northpool } = require("./maps/Maps");
const skills = require("./skills/skill");

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
dm.allMaps["Greengrove"] = new Greengrove();
dm.allMaps["Northpool"] = new Northpool();

module.exports = dm;
