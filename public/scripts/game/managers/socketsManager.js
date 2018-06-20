class SocketsManager {
  constructor(handler){
    this.handler = handler;
  }

  initialize(state) {
    let self = this;
    this.handler.socket.emit("initialized", {id : self.handler.playerID});

    this.handler.socket.on("fightData", function(data){

    });
    this.handler.socket.on("addPlayer", function(data){
      state.addNewPlayer(data);
    });
    this.handler.socket.on("addEnemy", function(data){
      state.addNewEnemy(data);
    });
    this.handler.socket.on("removePlayer", function(data){
      let playerToRemove = state.allEntities.objects[data.id];
      state.allEntities.remove(playerToRemove);
      delete state.allEntities.objects[data.id];
    });

    this.handler.socket.on("initialMapData", function(data) {
      for(let playerID in data.players) {
        if(data.players.hasOwnProperty(playerID)){
          state.addNewPlayer(data.players[playerID]);
        }
      };

      for(let enemyID in data.mobs) {
        if(data.mobs.hasOwnProperty(enemyID)){
          if(!state.allEntities[enemyID]){
            state.addNewEnemy(data.mobs[enemyID]);
          };
        }
      };
    });

    this.handler.socket.on("gameData", function(data){
      let playerData = data.playerData;
      state.player.updateData(playerData);
      let otherPlayersData = data.otherPlayersData;
      for(let playerID in otherPlayersData) {
        if(otherPlayersData.hasOwnProperty(playerID) && state.allEntities.objects[playerID] && playerID != self.handler.playerID){
          state.allEntities.objects[playerID].x = otherPlayersData[playerID].x;
          state.allEntities.objects[playerID].y = otherPlayersData[playerID].y;
          state.allEntities.objects[playerID].frame = otherPlayersData[playerID].frame || 1;
        };
      };
    });

    this.handler.socket.on("fightInit",function(data){
      let enemy = state.allEntities.enemies[data.enemyID];
      if(!enemy){
        console.log("??????????????");
        return;
      }
      self.handler.fightingStageManager.initFight(enemy,state.player,self.handler.game.state.getCurrentState());
    })
  }
}
