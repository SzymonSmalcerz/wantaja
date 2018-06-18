class Map {
  constructor(name,maxNumberOfMobs = 15,respTime = 1000){
    this.name = name;
    this.maxNumberOfMobs = maxNumberOfMobs;
    this.currentNumberOfMobs = 0;
    this.respTime = respTime;
    this.players = {};
    this.dataToSend = {};
  }

  respMobs() {
    if(this.currentNumberOfMobs < this.maxNumberOfMobs) {
      //create mob
    }

    setTimeout(this.respMobs, this.respTime);
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

    this.players[playerData.id] = {
      socket : playerSocket,
      data : playerData
    };
    // TODO send to this player all data about this particular map (all players and mobs)
  }

  removePlayer(idOfRemovedPlayer) {
    delete this.players[idOfRemovedPlayer];

    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)){
        this.players[playerID].socket.emit("removePlayer", {
          id : idOfRemovedPlayer
        });
      }
    };
  }

  tick() {
    for(playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)){
        // TODO add data to dataToSend and then send this information to all players
      }
    }
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
