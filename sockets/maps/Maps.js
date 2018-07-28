const {Spider} = require("../enemies/enemy");

class Map {
  constructor(name,maxNumberOfMobs = 15,respTime = 1000){
    this.name = name;
    this.maxNumberOfMobs = maxNumberOfMobs;
    this.currentNumberOfMobs = 0;
    this.respTime = respTime;
    this.players = {};
    this.dataToSend = {};
    this.mobsDataToSend = {};
    this.mobs = {};
    this.respMobs();
  }

  respMobs() {
    if(this.currentNumberOfMobs < this.maxNumberOfMobs) {

    let newSpider = new Spider(Math.floor(Math.random() * 500) + 100,Math.floor(Math.random() * 500) + 100, this);
    this.currentNumberOfMobs += 1;
    this.mobs[newSpider.id] = newSpider;
    this.mobsDataToSend[newSpider.id] = {
      x : newSpider.x,
      y : newSpider.y,
      id : newSpider.id,
      key : newSpider.key,
      health : newSpider.health,
      maxHealth : newSpider.maxHealth
    };
      for(let playerID in this.players) {
        if(this.players.hasOwnProperty(playerID)){
          this.players[playerID].socket.emit("addEnemy", this.mobsDataToSend[newSpider.id]);
        }
      };
    }

    setTimeout(() => {
      this.respMobs();
    }, this.respTime);
  }

  addPlayer(playerData, playerSocket) {

    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)){
        this.players[playerID].socket.emit("addPlayer", {
          x : playerData.x,
          y : playerData.y,
          id : playerData.id
        });
      }
    };

    let self = this;
    let data = {
      players : {},
      mobs : self.mobsDataToSend
    };

    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)){
        data.players[playerID] = {
          x : this.players[playerID].data.x,
          y : this.players[playerID].data.y,
          id : playerID
        }
      }
    };


    playerSocket.emit("initialMapData", data);

    this.players[playerData.id] = {
      socket : playerSocket,
      data : playerData
    };

    this.dataToSend[playerData.id] = {
      x : playerData.x,
      y : playerData.y,
      id : playerData.id
    };
  }

  removePlayer(idOfRemovedPlayer) {
    delete this.dataToSend[idOfRemovedPlayer];
    delete this.players[idOfRemovedPlayer];

    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)){
        this.players[playerID].socket.emit("removePlayer", {
          id : idOfRemovedPlayer
        });
      }
    };
  };

  removeEnemy(idOfRemovedMob) {

    if(!this.mobs[idOfRemovedMob]){return};
    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)){
        this.players[playerID].socket.emit("removeEnemy", {
          id : idOfRemovedMob
        });
      }
    };

    this.mobs[idOfRemovedMob].onDie();
  };

  tick() {
    let newDataToSend = {};
    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)){
        // console.log(this.players[playerID].data.x);
        if(this.dataToSend[playerID].x != this.players[playerID].data.x || this.dataToSend[playerID].y != this.players[playerID].data.y) {
          newDataToSend[playerID] = {
            x : this.players[playerID].data.x,
            y : this.players[playerID].data.y,
            frame : this.players[playerID].data.frame || 1
          };
          this.dataToSend[playerID].x = this.players[playerID].data.x;
          this.dataToSend[playerID].y = this.players[playerID].data.y;
        }
      }
    };

    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)){
        this.players[playerID].socket.emit("gameData", {
          otherPlayersData : newDataToSend
        });
      }
    };
  }
};


class FirstMap extends Map {
  constructor() {
    super("firstMap");
  }
};


module.exports = {
  FirstMap
};
