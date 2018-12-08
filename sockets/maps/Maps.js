const { Spider, Bee, IceGolem, Snake, WormSmall, Worm } = require("../enemies/enemy");
const { Trader_Greengrove, traders_utils } = require("../traders/traders");
const Item = require("../equipment/itemOnTheGround");
const Npc = require("../npcs/npcs");
const Teleporter = require("../teleporters/teleporters");

class Map {
  constructor(name, fightingStageBackground ,backgrounds = ['grass'], traders, teleporter, npcs, width = 1600, height = 1600, maxNumberOfMobs = 10, respTime = 100) {
    this.name = name;
    this.maxNumberOfMobs = 10 || maxNumberOfMobs;
    this.fightingStageBackground = fightingStageBackground;
    this.currentNumberOfMobs = 0;
    this.respTime = respTime;
    this.players = {};
    this.dataToSend = {};
    this.mobs = {};
    this.mobsDataToSend = {};
    this.items = {};
    this.graves = {};
    this.traders = traders || {};
    this.teleporter = teleporter || {};
    this.npcs = npcs || {};
    this.nextMaps = {};
    this.backgrounds = backgrounds;
    this.width = width;
    this.height = height;
    this.respMobs();
  }

  respMobs() {
    if(this.currentNumberOfMobs < this.maxNumberOfMobs) {
      let newEnemy;
      if(Math.random() > 0.2) {
        newEnemy = new Spider(Math.floor(Math.random() * 500) + 100,Math.floor(Math.random() * 500) + 400, this);
      } else {
        newEnemy = new IceGolem(Math.floor(Math.random() * 500) + 100,Math.floor(Math.random() * 500) + 400, this);
      }
      this.currentNumberOfMobs += 1;
      this.mobs[newEnemy.id] = newEnemy;
      this.mobsDataToSend[newEnemy.id] = {
        x : newEnemy.x,
        y : newEnemy.y,
        id : newEnemy.id,
        key : newEnemy.key,
        health : newEnemy.health,
        maxHealth : newEnemy.maxHealth,
        animated : newEnemy.animated,
        level : newEnemy.level
      };
      for(let playerID in this.players) {
        if(this.players.hasOwnProperty(playerID)) {
          this.players[playerID].socket.emit("addEnemy", this.mobsDataToSend[newEnemy.id]);
        }
      };
    }

    setTimeout(() => {
      this.respMobs();
    }, this.respTime);
  }

  addPlayer(playerData, playerSocket) {
    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)) {
        this.players[playerID].socket.emit("addPlayer", {
          x : playerData.x,
          y : playerData.y,
          id : playerData.id,
          key : playerData.key,
          nick : playerData.nick,
          level : playerData.level
        });
      }
    };

    let self = this;
    let data = {
      players : {},
      mobs : self.mobsDataToSend,
      traders : self.traders,
      teleporter : self.teleporter,
      npcs : self.npcs,
      graves : self.graves
    };

    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)) {
        data.players[playerID] = {
          x : this.players[playerID].data.x,
          y : this.players[playerID].data.y,
          key : this.players[playerID].data.key,
          id : playerID,
          nick : this.players[playerID].data.nick,
          level : this.players[playerID].data.level
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

    if(this.players[idOfRemovedPlayer]) {
      delete this.dataToSend[idOfRemovedPlayer];
      delete this.players[idOfRemovedPlayer];

      for(let playerID in this.players) {
        if(this.players.hasOwnProperty(playerID)) {
          this.players[playerID].socket.emit("removePlayer", {
            id : idOfRemovedPlayer
          });
        }
      };
    }

  };

  removeEnemy(idOfRemovedMob) {

    if(!this.mobs[idOfRemovedMob]) {return};
    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)) {
        this.players[playerID].socket.emit("removeEnemy", {
          id : idOfRemovedMob
        });
      }
    };

    this.mobs[idOfRemovedMob].onDie();
  };

  removeItem(idOfRemovedItem) {
    if(!this.items[idOfRemovedItem]) {return};
    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)) {
        this.players[playerID].socket.emit("removeItem", {
          id : idOfRemovedItem
        });
      }
    };
    delete this.items[idOfRemovedItem];
  };

  addItem(itemData) {
    let item = new Item(itemData.x,itemData.y,this,itemData.key,itemData.type)
    this.items[item.id] = item;
    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)) {
        this.players[playerID].socket.emit("addItem", {
          x : item.x,
          y : item.y,
          id : item.id,
          key : item.key
        });
      }
    };
  }

  removeGrave(idOfRemovedGrave) {
    if(!this.graves[idOfRemovedGrave]) {return};
    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)) {
        this.players[playerID].socket.emit("removeGrave", {
          id : idOfRemovedGrave
        });
      }
    };
    delete this.graves[idOfRemovedGrave];
  };

  addGrave(graveData) {
    this.graves[graveData.id] = graveData;
    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)) {
        this.players[playerID].socket.emit("addGrave", graveData);
      }
    };
  }

  tick() {
    let newDataToSend = {};
    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)) {
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
      if(this.players.hasOwnProperty(playerID)) {
        this.players[playerID].socket.emit("gameData", {
          otherPlayersData : newDataToSend
        });
      }
    };
  }

  emitDataToPlayers(messageName, messageObj) {
    for(let playerID in this.players) {
      if(this.players.hasOwnProperty(playerID)) {
        this.players[playerID].socket.emit(messageName, messageObj);
      }
    };
  }
};

class Greengrove extends Map {
  constructor() {
    super("Greengrove", "fightingBackgroundGreengrove", ['grass','GreengroveBackground']);
    this.nextMaps = {
      'Northpool' : {
        doorX : 133,
        doorY : 1552,
        playerX : 290,
        playerY : 40,
        requiredLevel : 2
      },
      'Blackford' : {
        doorX : 0,
        doorY : 616,
        playerX : 616,
        playerY : 1500,
        requiredLevel : 5
      }
    };
    this.traders = {
      'Trader' : new Trader_Greengrove(1260, 312)
    }
    this.teleporter = new Teleporter(150, 300, [
      {
        mapName : 'Northpool',
        price : 1000,
        x : 913,
        y : 1100,
        requiredLevel : 2
      }
    ]);
    this.npcs = {
      'John' : new Npc(900, 180, 'John')
    }
  }
};

class Northpool extends Map {
  constructor() {
    super("Northpool", "fightingBackgroundNorthpool", ['grass','NorthpoolBackground']);
    this.nextMaps = {
      'Greengrove' : {
        doorX : 290,
        doorY : 2,
        playerX : 133,
        playerY : 1512,
        requiredLevel : 1
      },
      'Southpool' : {
        doorX : 1490,
        doorY : 1552,
        playerX : 1521,
        playerY : 100,
        requiredLevel : 1
      }
    };

    this.npcs = {
      'Serena' : new Npc(900, 180, 'Serena')
    }

    this.teleporter = new Teleporter(913, 1250, [
      {
        mapName : 'Greengrove',
        price : 10000,
        x : 900,
        y : 250,
        requiredLevel : 2
      }
    ])
  }

  respMobs() {
    if(this.currentNumberOfMobs < this.maxNumberOfMobs) {

    let newEnemy = new Bee(Math.floor(Math.random() * 100) + 100,Math.floor(Math.random() * 100) + 400, this);
    this.currentNumberOfMobs += 1;
    this.mobs[newEnemy.id] = newEnemy;
    this.mobsDataToSend[newEnemy.id] = {
      x : newEnemy.x,
      y : newEnemy.y,
      id : newEnemy.id,
      key : newEnemy.key,
      health : newEnemy.health,
      maxHealth : newEnemy.maxHealth,
      animated : newEnemy.animated,
      level : newEnemy.level
    };
      for(let playerID in this.players) {
        if(this.players.hasOwnProperty(playerID)) {
          this.players[playerID].socket.emit("addEnemy", this.mobsDataToSend[newEnemy.id]);
        }
      };
    }

    setTimeout(() => {
      this.respMobs();
    }, this.respTime);
  }
};

class Southpool extends Map {
  constructor() {
    super("Southpool", "fightingBackgroundNorthpool", ['grass-snow','SouthpoolBackground']);
    this.nextMaps = {
      'Frozendefile' : {
        doorX : 1570,
        doorY : 631,
        playerX : 100,
        playerY : 631,
        requiredLevel : 1
      },
      'Northpool' : {
        doorX : 1488,
        doorY : 0,
        playerX : 1490,
        playerY : 1482,
        requiredLevel : 1
      }
    };
  }

  respMobs() {
    setTimeout(() => {
      this.respMobs();
    }, this.respTime);
  }
};

class Frozendefile extends Map {
  constructor() {
    super("Frozendefile", "fightingBackgroundNorthpool", ['grass-snow','FrozendefileBackground']);
    this.nextMaps = {
      'Southpool' : {
        doorX : 0,
        doorY : 631,
        playerX : 1470,
        playerY : 631,
        requiredLevel : 1
      }
    };
  }

  respMobs() {
    setTimeout(() => {
      this.respMobs();
    }, this.respTime);
  }
};


class Blackford extends Map {
  constructor() {
    super("Blackford", "fightingBackgroundNorthpool", ['grass','BlackfordBackground']);
    this.nextMaps = {
      'Greengrove' : {
        doorX : 1570,
        doorY : 616,
        playerX : 40,
        playerY : 616,
        requiredLevel : 0
      }
    };
  }

  respMobs() {
    setTimeout(() => {
      this.respMobs();
    }, this.respTime);
  }
};

module.exports = {
  Greengrove,
  Northpool,
  Southpool,
  Frozendefile,
  Blackford
};
