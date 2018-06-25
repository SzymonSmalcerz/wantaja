class SocketsManager {
  constructor(handler){
    this.handler = handler;
  }

  initialize() {
    let self = this;

    this.handler.socket.on("fightData", function(data){

    });
    this.handler.socket.on("addPlayer", function(data){
      self.handler.currentState.mapManager.addNewPlayer(data);
    });
    this.handler.socket.on("addEnemy", function(data){
      self.handler.currentState.mapManager.addNewEnemy(data);
    });
    this.handler.socket.on("removePlayer", function(data){
      let playerToRemove = self.handler.currentState.allEntities.objects[data.id];
      self.handler.currentState.allEntities.remove(playerToRemove);
      delete self.handler.currentState.allEntities.objects[data.id];
    });

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
        };
      };
    });

    this.handler.socket.on("fightInit",function(data){
      let enemy = self.handler.currentState.allEntities.enemies[data.enemyID];
      if (!enemy) {
        console.log("??????????????");
        return;
      };

      self.handler.currentState.fightingStageManager.initFight(enemy);
    });

    this.handler.socket.on('checkForConnection', function () {
      console.log("XDDD");
      self.handler.socket.emit("checkedConnection",{
        // id : self.handler.playerID
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
