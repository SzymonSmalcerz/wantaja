class Map {
  constructor(name,maxNumberOfMobs = 15,respTime = 1000){
    this.name = name;
    this.maxNumberOfMobs = maxNumberOfMobs;
    this.currentNumberOfMobs = 0;
    this.respTime = respTime;
    this.players = {};
  }

  respMobs() {
    if(this.currentNumberOfMobs < this.maxNumberOfMobs) {
      //create mob
    }

    setTimeout(this.respMobs, this.respTime);
  }

  addPlayer(playerData, playerSocket) {
    this.players[playerData.id] = {
      socket : playerSocket,
      data : playerData
    };
  }
  
  removePlayer(playerID) {
    delete this.players[playerID];
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
