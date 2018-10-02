class SocketsManager {
  constructor(handler) {
    this.handler = handler;
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

    this.handler.socket.on("dodge", function(){
      self.handler.currentState.uiManager.showDodgeAlert();
    });
    this.handler.socket.on("removePlayer", function(data) {
      self.handler.currentState.mapManager.removePlayer(data);
    });

    this.handler.socket.on("removeEnemy", function(data) {
      self.handler.currentState.mapManager.removeEnemy(data);
    });

    this.handler.socket.on("fightEnemyAlreadyFighting", function(data) {
      console.log("enemy is already fighting with someone else :C");
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

      for(let npcID in data.npcs) {
        if(data.npcs.hasOwnProperty(npcID)) {
          if(!self.handler.currentState.allEntities[npcID]) {
            self.handler.currentState.mapManager.addNewNpc(data.npcs[npcID]);
          };
        }
      };
    });

    this.handler.socket.on("statusUpdate", function(data) {
      alert("statusUpdate in sockets called !!!!");
      // self.handler.currentState.player.maxMana = data.maxMana;
      // self.handler.currentState.player.maxHealth = data.maxHealth;
      // self.handler.currentState.player.attack = data.attack;
    });
    this.handler.socket.on("gameData", function(data) {
      let otherPlayersData = data.otherPlayersData;
      for(let playerID in otherPlayersData) {
        if(otherPlayersData.hasOwnProperty(playerID) && self.handler.currentState.allEntities.objects[playerID] && playerID != self.handler.playerID){
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
      handler.player.currentMapName = data.mapName;
      handler.playerData.currentMapName = data.mapName;
      handler.backgroundsData = data.mapBackgrounds;
      handler.fightingStageBackground = data.fightingStageBackground;
      handler.player.reset(data.playerX, data.playerY);
      self.handler.currentState.changeMap();
    });

    this.handler.socket.on("handleWinFight", function(data) {
      self.handler.currentState.player.experience = data.playerExperience;
      self.handler.currentState.fightWithOpponentManager.handleWinFight(data);
      if(data.playerMoveResult.takenHealth) {
        self.handler.currentState.uiManager.showDamageEnemyAlert("you damaged enemy with\n" + data.playerMoveResult.takenHealth + " health points");
      }
    });

    this.handler.socket.on('checkForConnection', function () {
      console.log("tick");
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

    this.handler.socket.on("addItemToEquipment", function(data) {
      self.handler.currentState.player.addNewItem(data);
    });

    this.handler.socket.on("updateMoney", function(data) {
      handler.money = data.amount;
      if(handler.currentState.uiManager) {
        handler.currentState.uiManager.updateMoneyText();
      }
    });
  }

  sendToServerInitializedInfo() {
    let self = this;
    this.handler.socket.emit("initialized");
  };


  emit(messageName,messageData){
    this.handler.socket.emit(messageName,messageData);
  }
}
