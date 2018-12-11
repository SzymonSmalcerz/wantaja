const { Greengrove, Northpool, Southpool, Frozendefile, Blackford } = require("./maps/Maps");
const skills = require("./skills/skill");
const { Mission,
        Stage_goto,
        Stage_getitem,
        Stage_kill,
        HighLight,
        Dialog } = require("./missions/missions");
const User = require("../database/models/userModel");
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
  // missions dictionary is a cache which is mapping level of player to mission wchich is given at this level
  missionsDictionary : {
    '1' : ['newcomers'],
    '2' : ['milk'],
    '3' : ['south'],
    '4' : ['revenge'],
  },
  missions : {
    'newcomers' : new Mission([
      new Stage_goto(
        [new HighLight('John', 'Greengrove')], 'goto',
        new Dialog("Hello wanderer!\n" +
                    "I haven't expect you that early ! Anyway I\n" +
                    "have small quest for you, recently many spiders\n" +
                    "came to our village, destroy 10 of them or they\n" +
                    "will destroy us !", "ok")
      ),
      new Stage_kill([], 'kill', 'bee', 10, 10),
      new Stage_goto(
        [new HighLight('John', 'Greengrove')], 'return',
        new Dialog('Oh my.. You have done it!\nhere is your reward', 'Yes sir!')
      )
    ], 0, {
      money : 100,
      item : {
        key : 'weapon_1',
        type : 'weapon'
      }
    }, "newcomers", 1),

    'milk' : new Mission([
      new Stage_goto(
        [new HighLight('John', 'Greengrove')], 'first',
        new Dialog("Hello again!\n" +
                    "Could you go to my beloved daughter Serena,\n" +
                    "who lives at the south, and get her some milk\n" +
                    "from me? Of course you will get your reward !\n", "Got it!")
      ),
      new Stage_goto(
        [new HighLight('Serena', 'Northpool')], 'second',
        new Dialog("What a surprise!\n" +
                    "Thank you very much! Go back to Greengrove\n" +
                    "and give my regards to my father !\n" +
                    "Maybe he will get you some milk too :)\n", "Got it!")
      ),
      new Stage_goto(
        [new HighLight('John', 'Greengrove')], 'third',
        new Dialog("You are back!\n" +
                    "You did it in no time !\n" +
                    "Thank you again, your are a true hero !\n" +
                    "Here is your reward !\n", "Thank you too!")
      )
    ], 0, {
      money : 100,
      item : {
        key : 'helmet_1',
        type : 'helmet'
      }
    }, "milk", 2),
    'south' : new Mission([
      new Stage_goto(
        [new HighLight('Shura', 'Northpool')], 'first',
        new Dialog("Hello wanderer!\n" +
                    "So the stories that I hear are true! You look like\n" +
                    "a true warrior. Could you go to my sister and help her\n" +
                    "in finding her daughter? It seems you are our last hope!\n", "Got it!")
      ),
      new Stage_goto(
        [new HighLight('Lidia', 'Southpool')], 'second',
        new Dialog("Oh my.. The story is short, my sweet daughter Praxana\n" +
                    "went to find her teddy bear somewhere south yesterday\n" +
                    "and I haven't heard from her from that point...\n" +
                    "I really miss her...\n", "I will find her!")
      ),
      new Stage_goto(
        [new HighLight('Praxana', 'Southpool')], 'third',
        new Dialog("Hlip hlip...\n" +
                    "I want to come back to my mommy...\n" +
                    "But this bad wolf took my teddy bear and ran away!\n" +
                    "Could you help me in finding my teddy bear?\n", "I will!")
      ),
      new Stage_kill([], 'kill', 'wolf', 1, 1),
      new Stage_goto(
        [new HighLight('Praxana', 'Southpool')], 'fourth',
        new Dialog("My teddy bear!\n" +
                    "Now I can come back home!\n" +
                    "Can You go to my mommy and tell her that I'm fine?\n" +
                    "I will play here a little bit longer and I will return!\n", "Oki!")
      ),
      new Stage_goto(
        [new HighLight('Lidia', 'Southpool')], 'fifth',
        new Dialog("Oh my!\n" +
                    "Thank you very much! You really are a true hero!\n" +
                    "I'm so relieved right now..\n" +
                    "Here is your reward!\n", "No problem!")
      ),
    ], 0, {
      money : 1000,
      item : {
        key : 'helmet_2',
        type : 'helmet'
      }
    }, "south", 3),
    'revenge' : new Mission([
      new Stage_goto(
        [new HighLight('Fenryl', 'Southpool')], 'first',
        new Dialog("Hello!\n" +
                    "Are you interested in helping old fellow?\n" +
                    "Ice golems from Frozendefile destroyed my cartload which\n" +
                    "was full of food! It's time for revenge!\n", "Revenge it is!")
      ),
      new Stage_kill([], 'kill', 'iceGolem', 1, 1),
      new Stage_goto(
        [new HighLight('Fenryl', 'Southpool')], 'second',
        new Dialog("Hello again!\n" +
                    "It seems that you have done it! You showed golems who\n" +
                    "is the boss! Few years ago i would do it myself, but\n" +
                    "time is merciless.. Anyway, here is your reward!\n", "Thank you!")
      )
    ], 0, {
      money : 1500,
      item : {
        key : 'helmet_2',
        type : 'helmet'
      }
    }, "revenge", 4),
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
    levelUp : function(player, socket) {
      player.level += 1;
      player.experience = 0;
      player.leftStatusPoints += 5;
      this.updatePlayerData(player);
      if(dm.missionsDictionary[player.level.toString()]) {
        dm.missionsDictionary[player.level.toString()].forEach(missionName => {
          player.missions[missionName] = {
            missionName : missionName,
            currentStage : dm.missions[missionName].getStage(0) //get first stage of the mission
          }
          socket.emit("addNewMission", {
            missionName : missionName,
            currentStage : dm.missions[missionName].getStage(0) //get first stage of the mission
          });
        });
      }

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
  this.allLoggedPlayersData[playerID] = null;
  delete this.allLoggedPlayersData[playerID];
  this.socketsOfPlayers[playerID].disconnect();
  this.socketsOfPlayers[playerID] = null;
  delete this.socketsOfPlayers[playerID];
  this.findMapNameByPlayerId[playerID] = null;
  delete this.findMapNameByPlayerId[playerID];
};

dm.handlePlayerDeath = function(socket) {

  let playerID = socket.playerID;
  dm.allLoggedPlayersData[playerID].revivalTime = Date.now() + dm.allLoggedPlayersData[playerID].level * 10000;
  socket.emit("playerDied", {
    revivalTime : dm.allLoggedPlayersData[playerID].revivalTime,
    deathTime : Date.now()
  });
  let mapName = dm.allLoggedPlayersData[playerID].currentMapName;
  setTimeout(async function() {
    if(dm.allLoggedPlayersData[playerID]) {
      dm.allLoggedPlayersData[playerID].revivalTime = null;

      dm.addPlayerToFirstMap(dm.socketsOfPlayers[playerID]);
    } else {
      var user = await User.findById(playerID);
      user.revivalTime = null;
      user.save();
    }

    dm.removePlayerGrave(mapName, playerID);
  }, dm.allLoggedPlayersData[playerID].level * 10000);
  dm.addPlayerGrave(socket);
  dm.removePlayerFromMap(socket);
};

dm.addPlayerGrave = function(socket) {
  dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].addGrave({
    id : socket.playerID,
    nick : dm.allLoggedPlayersData[socket.playerID].nick,
    x : dm.allLoggedPlayersData[socket.playerID].x,
    y : dm.allLoggedPlayersData[socket.playerID].y
  })
};

dm.removePlayerGrave = function(mapName, playerID) {
  dm.allMaps[mapName].removeGrave(playerID);
};

dm.addPlayerToFirstMap = function (socket) {
  dm.addPlayerToMap(socket, {
    mapName : 'Greengrove',
    newPlayerX : 900,
    newPlayerY : 250
  });
};

dm.removePlayerFromMap = function(socket) {
  if(dm.findMapNameByPlayerId[socket.playerID] && dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]]) {
    dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].removePlayer(socket.playerID);
  }
};

dm.addPlayerToMap = function(socket, data) {
  dm.allLoggedPlayersData[socket.playerID].currentMapName = data.mapName;
  dm.findMapNameByPlayerId[socket.playerID] = data.mapName;
  dm.allLoggedPlayersData[socket.playerID].active = true;
  socket.emit('changedMap', {
    mapName : dm.findMapNameByPlayerId[socket.playerID],
    mapBackgrounds : dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]] ? dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].backgrounds : [],
    fightingStageBackground : dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]] ? dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].fightingStageBackground : [],
    playerX : data.newPlayerX,
    playerY : data.newPlayerY,
    money : dm.allLoggedPlayersData[socket.playerID].money,
    equipmentCurrentlyDressed : dm.allLoggedPlayersData[socket.playerID].equipmentCurrentlyDressed,
    equipment : dm.allLoggedPlayersData[socket.playerID].equipment
  });
  dm.allLoggedPlayersData[socket.playerID].x = data.newPlayerX;
  dm.allLoggedPlayersData[socket.playerID].y = data.newPlayerY;
};

dm.changeMap = function (socket, data) {
  if(!dm.findMapNameByPlayerId[socket.playerID] || !dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]] || !dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].nextMaps[data.mapName]) { return; }
  data.newPlayerX = data.newPlayerX || dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].nextMaps[data.mapName].playerX;
  data.newPlayerY = data.newPlayerY || dm.allMaps[dm.findMapNameByPlayerId[socket.playerID]].nextMaps[data.mapName].playerY;
  dm.removePlayerFromMap(socket);
  dm.addPlayerToMap(socket, data);
};

dm.changeMissionStage = function(socket, missionName, onlyWhenGotoStage) {
  let playerMissionData = dm.allLoggedPlayersData[socket.playerID].missions[missionName];
  if(onlyWhenGotoStage && (!playerMissionData || playerMissionData.currentStage.type != "goto")) { return };

  let mission = dm.missions[missionName];
  let currentStageIndex = mission.getStageIndex(playerMissionData.currentStage);
  if(playerMissionData.currentStage.type == 'kill') {
    // if type == kill remove this mission from dcitionary of missions where there are enemies to kill
    dm.allLoggedPlayersData[socket.playerID].missionsKillEnemiesDictionary[playerMissionData.currentStage.enemyKey] = dm.allLoggedPlayersData[socket.playerID].missionsKillEnemiesDictionary[playerMissionData.currentStage.enemyKey].filter(m => m.missionName != missionName);
  }


  if(mission.isDone(currentStageIndex + 1)) {
    dm.allLoggedPlayersData[socket.playerID].claimedItem = mission.reward.item ? mission.reward.item : null;
    let droppedItem = equipment[dm.allLoggedPlayersData[socket.playerID].claimedItem.type][dm.allLoggedPlayersData[socket.playerID].claimedItem.key];
    socket.emit("missionDone", {
      missionName : missionName,
      reward : {
        droppedMoney : mission.reward.money ? mission.reward.money : 0,
        droppedItem
      }
    });
    dm.allLoggedPlayersData[socket.playerID].missions[missionName] = null;
  } else {
    playerMissionData.currentStage = mission.getStage(currentStageIndex + 1);
    socket.emit("changeMissionStage", {
      missionName : missionName,
      newStage : playerMissionData.currentStage
    });

    if(playerMissionData.currentStage.type == 'kill') {
      dm.allLoggedPlayersData[socket.playerID].missionsKillEnemiesDictionary[playerMissionData.currentStage.enemyKey] = dm.allLoggedPlayersData[socket.playerID].missionsKillEnemiesDictionary[playerMissionData.currentStage.enemyKey] || [];
      dm.allLoggedPlayersData[socket.playerID].missionsKillEnemiesDictionary[playerMissionData.currentStage.enemyKey].push(playerMissionData);
    }
  }
};

dm.allMaps["Greengrove"] = new Greengrove();
dm.allMaps["Northpool"] = new Northpool();
dm.allMaps["Southpool"] = new Southpool();
dm.allMaps["Frozendefile"] = new Frozendefile();
dm.allMaps["Blackford"] = new Blackford();

module.exports = dm;
