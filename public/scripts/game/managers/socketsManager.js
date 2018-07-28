class SocketsManager {
  constructor(handler){
    this.handler = handler;
  }

  initialize() {
    let self = this;
    this.handler.socket.on("addPlayer", function(data){
      self.handler.currentState.mapManager.addNewPlayer(data);
    });
    this.handler.socket.on("addEnemy", function(data){
      self.handler.currentState.mapManager.addNewEnemy(data);
    });
    this.handler.socket.on("removePlayer", function(data){
      let playerToRemove = self.handler.currentState.allEntities.objects[data.id];
      playerToRemove.kill();
      delete self.handler.currentState.allEntities.objects[data.id];
    });
    this.handler.socket.on("removeEnemy", function(data){
      let enemyToRemove = self.handler.currentState.allEntities.enemies[data.id];
      enemyToRemove.kill();
      delete self.handler.currentState.allEntities.enemies[data.id];
    });

    this.handler.socket.on("fightEnemyAlreadyFighting", function(data){
      console.log("enemy is already fighting with someone else :C");
      self.handler.currentState.player.quitFightingMode();
    })

    this.handler.socket.on("initialMapData", function(data) {
      for(let playerID in data.players) {
        if(data.players.hasOwnProperty(playerID)){
          self.handler.currentState.mapManager.addNewPlayer(data.players[playerID]);
        }
      };

      for(let enemyID in data.mobs) {
        if(data.mobs.hasOwnProperty(enemyID)){
          if(!self.handler.currentState.allEntities[enemyID]){
            self.handler.currentState.mapManager.addNewEnemy(data.mobs[enemyID]);
          };
        }
      };
    });

    this.handler.socket.on("statusUpdate", function(data){

      console.log(self.handler.currentState.player.attack);
      self.handler.currentState.player.maxMana = data.maxMana;
      self.handler.currentState.player.maxHealth = data.maxHealth;
      self.handler.currentState.player.attack = data.attack;
      console.log(self.handler.currentState.player.attack);
    });
    this.handler.socket.on("gameData", function(data){
      let otherPlayersData = data.otherPlayersData;
      for(let playerID in otherPlayersData) {
        if(otherPlayersData.hasOwnProperty(playerID) && self.handler.currentState.allEntities.objects[playerID] && playerID != self.handler.playerID){
          self.handler.currentState.allEntities.objects[playerID].x = otherPlayersData[playerID].x;
          self.handler.currentState.allEntities.objects[playerID].y = otherPlayersData[playerID].y;
          self.handler.currentState.allEntities.objects[playerID].frame = otherPlayersData[playerID].frame || 1;
          self.handler.currentState.changeRenderOrder(self.handler.currentState.allEntities.objects[playerID]);
        };
      };
    });

    this.handler.socket.on("fightInit",function(data){
      let enemy = self.handler.currentState.allEntities.enemies[data.enemyID];
      enemy.health = data.enemyHealth;
      enemy.maxHealth = data.enemyMaxHealth;
      if (!enemy) {
        return;
      };

      self.handler.currentState.fightWithOpponentManager.initFight(enemy);
    });

    this.handler.socket.on("fightMove", function(data){
      console.log("x?x?x?x?x")
      let enemy = self.handler.currentState.player.opponent;
      enemy.health = data.enemyHealth;
      // self.handler.currentState.player.health = data.playerHealth;
      self.handler.currentState.player.mana = data.playerMana;
      self.handler.currentState.fightWithOpponentManager.animateEnemySkill(data);
      self.handler.currentState.fightWithOpponentManager.updateEnemyHealth();
    });

    this.handler.socket.on("playerUpdate", function(data){
      console.log("playerUpdate");
      self.handler.currentState.player.updateData(data);
    });

    this.handler.socket.on("handleWinFight", function(data){
      self.handler.currentState.player.experience = data.playerExperience;
      self.handler.currentState.fightWithOpponentManager.handleWinFight();
    });

    this.handler.socket.on('checkForConnection', function () {
      console.log("XDDD");
      self.handler.socket.emit("checkedConnection",{
        id : self.handler.playerID
      });
    });


    this.handler.socket.on("levelUp", function(data){
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

  }

  sendToServerInitializedInfo(){
    let self = this;
    this.handler.socket.emit("initialized", {
      id : self.handler.playerID,
      characterData : handler.startPlayerData.characterData
    });
  };


  emit(messageName,messageData){
    this.handler.socket.emit(messageName,messageData);
  }
}
