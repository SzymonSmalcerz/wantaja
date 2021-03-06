class SocketsManager {
  constructor(handler) {
    this.handler = handler;
    this.lastTimeConnectionChecked = Date.now();
  }

  initialize() {
    let self = this;
    this.handler.socket.on("addPlayer", function(data) {
      self.handler.currentState.mapManager.addNewPlayer(data);
    });
    this.handler.socket.on("addEnemy", function(data) {
      self.handler.currentState.mapManager.addNewEnemy(data);
    });
    this.handler.socket.on("renderSwords", function(data) {
      self.handler.currentState.fightWithOpponentManager.renderSwords(data)
    });
    this.handler.socket.on("removeSwords", function(data) {
      self.handler.currentState.fightWithOpponentManager.removeSwords(data)
    });

    this.handler.socket.on("dodge", function() {
      self.handler.currentState.uiManager.showDodgeAlert();
    });
    this.handler.socket.on("removePlayer", function(data) {
      self.handler.currentState.mapManager.removePlayer(data);
    });

    this.handler.socket.on("removeEnemy", function(data) {
      self.handler.currentState.mapManager.removeEnemy(data);
    });

    this.handler.socket.on("fightEnemyAlreadyFighting", function(data) {
      self.handler.currentState.uiManager.showSomeoneElseFightingAlert();
      self.handler.currentState.player.quitFightingMode();
    })

    this.handler.socket.on("alert", function(data) {
      self.handler.currentState.uiManager.showAlert(data.message);
    })

    this.handler.socket.on("initialMapData", function(data) {
      for(let playerID in data.players) {
        if(data.players.hasOwnProperty(playerID)) {
          self.handler.currentState.mapManager.addNewPlayer(data.players[playerID]);
        }
      };

      for(let enemyID in data.mobs) {
        if(data.mobs.hasOwnProperty(enemyID)) {
          if(!self.handler.currentState.allEntities[enemyID]) {
            self.handler.currentState.mapManager.addNewEnemy(data.mobs[enemyID]);
          };
        }
      };

      for(let traderID in data.traders) {
        if(data.traders.hasOwnProperty(traderID)) {
          if(!self.handler.currentState.allEntities[traderID]) {
            self.handler.currentState.mapManager.addNewTrader(data.traders[traderID]);
          };
        }
      };

      if(data.teleporter) {
        self.handler.currentState.mapManager.addNewTeleporter(data.teleporter);
      }

      for(let npcID in data.npcs) {
        if(data.npcs.hasOwnProperty(npcID)) {
          if(!self.handler.currentState.allEntities[npcID]) {
            self.handler.currentState.mapManager.addNewNpc(data.npcs[npcID]);
          };
        }
      };

      for(let graveID in data.graves) {
        if(data.graves.hasOwnProperty(graveID)) {
          if(!self.handler.currentState.allEntities[graveID]) {
            self.handler.currentState.mapManager.addNewGrave(data.graves[graveID]);
          };
        }
      };

      handler.currentState.initMissionManager();
    });

    this.handler.socket.on("changeMissionStage", function(data) {
      self.handler.currentState.missionManager.changeMissionStage(data);
    });

    this.handler.socket.on("missionDone", function(data) {
      self.handler.currentState.missionManager.removeMission(data);
      self.handler.currentState.uiManager.showReward(data);
    });

    this.handler.socket.on("addNewMission", function(data) {
      self.handler.currentState.missionManager.addNewMission(data);
    });


    this.handler.socket.on("gameData", function(data) {
      let otherPlayersData = data.otherPlayersData;
      for(let playerID in otherPlayersData) {
        if(otherPlayersData.hasOwnProperty(playerID) && self.handler.currentState.allEntities.objects[playerID] && playerID != self.handler.playerID) {
          self.handler.currentState.allEntities.objects[playerID].x = otherPlayersData[playerID].x;
          self.handler.currentState.allEntities.objects[playerID].y = otherPlayersData[playerID].y;
          self.handler.currentState.allEntities.objects[playerID].frame = otherPlayersData[playerID].frame || 1;
        };
      };
    });

    this.handler.socket.on("fightInit",function(data) {
      let enemy = self.handler.currentState.allEntities.enemies[data.enemyID];
      enemy.health = data.enemyHealth;
      enemy.maxHealth = data.enemyMaxHealth;
      if (!enemy) {
        return;
      };
      self.handler.currentState.fightWithOpponentManager.initFight(enemy);
    });

    this.handler.socket.on("fightMove", function(data) {
      self.handler.currentState.player.mana = data.playerMana;
      self.handler.currentState.fightWithOpponentManager.animateEnemySkill(data);
      self.handler.currentState.fightWithOpponentManager.updateEnemyHealth(data.enemyHealth);
      self.handler.currentState.fightWithOpponentManager.updateStageUI();
      if(data.playerMoveResult.dodge) {
        self.handler.currentState.uiManager.showDodgeAlert("enemy dodged your attack !");
      } else if(data.playerMoveResult.takenHealth) {
        self.handler.currentState.uiManager.showDamageEnemyAlert("you damaged enemy with\n" + data.playerMoveResult.takenHealth + " health points");
      } else if(data.playerMoveResult.addedHealth || data.playerMoveResult.addedHealth === 0) {
        self.handler.currentState.uiManager.showHealthAlert("you recovered " + data.playerMoveResult.addedHealth + "\nhealth points");
      }
    });

    this.handler.socket.on("playerUpdate", function(data) {
      self.handler.currentState.player.updateData(data);
    });

    this.handler.socket.on("changedMap", function(data) {
      // handler.playerData = handler.currentState.player;
      handler.money = data.money;

      handler.playerData.experience = handler.currentState.player.experience || 10;
      handler.playerData.requiredExperience = handler.currentState.player.requiredExperience || 10;

      handler.playerData.strength = handler.currentState.player.strength || 1;
      handler.playerData.agility = handler.currentState.player.agility || 1;
      handler.playerData.vitality = handler.currentState.player.vitality || 1;
      handler.playerData.intelligence = handler.currentState.player.intelligence || 1;

      handler.playerData.attack = handler.currentState.player.attack || 1;
      handler.playerData.dodge = handler.currentState.player.dodge || 0;
      handler.playerData.level = handler.currentState.player.level || 1;
      handler.playerData.id = handler.currentState.player.id || 10;
      handler.playerData.leftStatusPoints = handler.currentState.player.leftStatusPoints || 0;
      handler.playerData.x = data.playerX;
      handler.playerData.y = data.playerY;
      handler.playerData.equipment = data.equipment;
      handler.playerData.equipmentCurrentlyDressed = data.equipmentCurrentlyDressed;
      handler.player.currentMapName = data.mapName;
      handler.playerData.currentMapName = data.mapName;
      handler.backgroundsData = data.mapBackgrounds;
      handler.fightingStageBackground = data.fightingStageBackground;
      self.handler.currentState.changeMap();
      handler.currentState.player.reset(data.playerX, data.playerY);
    });

    this.handler.socket.on("handleWinFight", function(data) {
      self.handler.currentState.player.experience = data.playerExperience;
      self.handler.currentState.fightWithOpponentManager.handleWinFight(data);
      if(data.playerMoveResult.takenHealth) {
        self.handler.currentState.uiManager.showDamageEnemyAlert("you damaged enemy with\n" + data.playerMoveResult.takenHealth + " health points");
      }
      if(data.missionToReduceNumOfMobs && data.missionToReduceNumOfMobs.length) {
        data.missionToReduceNumOfMobs.forEach(missionData => {
          self.handler.currentState.missionManager.changeStageInfo(missionData);
        })
      }
    });

    this.handler.socket.on('checkForConnection', function () {
      self.lastTimeConnectionChecked = Date.now();
      self.handler.socket.emit("checkedConnection");
    });

    this.handler.socket.on("updatePlayerData", function(data) {
      if(self.handler.currentState.player.level != data.level) {
        self.handler.currentState.uiManager.showLevelUpAlert();
      }
      self.handler.currentState.player.maxHealth = data.maxHealth;
      self.handler.currentState.player.health = data.maxHealth;
      self.handler.currentState.player.maxMana = data.maxMana;
      self.handler.currentState.player.mana = data.maxMana;
      self.handler.currentState.player.level = data.level;
      self.handler.currentState.player.attack = data.attack;
      self.handler.currentState.player.leftStatusPoints = data.leftStatusPoints;
      self.handler.currentState.player.experience = data.experience;
      self.handler.currentState.player.requiredExperience = data.requiredExperience;
    })

    this.handler.socket.on("takeOffItem", function(data) {
      self.handler.currentState.uiManager.equipmentManager.takeOffItem(data);
    })

    this.handler.socket.on("dressItem", function(data) {
      self.handler.currentState.uiManager.equipmentManager.dressItem(data);
    })

    this.handler.socket.on("discardItem", function(data) {
      self.handler.currentState.uiManager.equipmentManager.discardItem(data);
    })

    this.handler.socket.on("addItem", function(data) {
      self.handler.currentState.mapManager.addNewItem(data);
    });

    this.handler.socket.on("removeItem", function(data) {
      self.handler.currentState.mapManager.removeItem(data);
    });

    this.handler.socket.on("addGrave", function(data) {
      self.handler.currentState.mapManager.addNewGrave(data);
    });

    this.handler.socket.on("removeGrave", function(data) {
      self.handler.currentState.mapManager.removeGrave(data);
    });

    this.handler.socket.on("addItemToEquipment", function(data) {
      self.handler.currentState.player.addNewItem(data);
    });

    this.handler.socket.on("updateMoney", function(data) {
      handler.money = data.amount;
      if(handler.currentState.uiManager) {
        handler.currentState.uiManager.updateMoneyText();
      }
    });

    this.handler.socket.on("playerDied", function(data) {
      handler.currentState.handleDeath(data);
    });

    this.handler.socket.on("revive", function(data) {
      handler.currentState.revive(data);
    });

    this.checkConnection();
  }

  sendToServerInitializedInfo() {
    let self = this;
    this.handler.socket.emit("initialized");
  };

  emit(messageName,messageData) {
    this.handler.socket.emit(messageName,messageData);
  }

  checkConnection() {
    if(this.lastTimeConnectionChecked + 20000 < Date.now()) {
      let message = 'session has expired';
      window.location.replace(window.location.origin  + '/home?message=' + 'Error occured: session has expired, check your internet connection.');
    } else {
      let that = this;
      setTimeout(function() {
        that.checkConnection();
      }, 20000);
    }
  }
}
