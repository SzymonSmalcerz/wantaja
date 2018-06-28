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
      self.handler.currentState.player.isFighting = false;
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

    this.handler.socket.on("gameData", function(data){
      let playerData = data.playerData;
      self.handler.currentState.player.updateData(playerData);
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
      console.log(data);
      if (!enemy) {
        console.log("??????????????");
        return;
      };

      self.handler.currentState.fightWithOpponentManager.initFight(enemy);
    });

    this.handler.socket.on("fightMove", function(data){
      console.log("x?x?x?x?x")
      let enemy = self.handler.currentState.player.opponent;
      enemy.health = data.enemyHealth;
      self.handler.currentState.player.health = data.playerHealth;
      self.handler.currentState.fightWithOpponentManager.animateEnemySkill(data.enemySkillName);
      self.handler.currentState.fightWithOpponentManager.updateEnemyHealth();
    });

    this.handler.socket.on("handleWinFight", function(data){
      self.handler.currentState.fightWithOpponentManager.handleWinFight();
    });

    this.handler.socket.on('checkForConnection', function () {
      console.log("XDDD");
      self.handler.socket.emit("checkedConnection",{
        id : self.handler.playerID
      });
    });

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
