class MapManager {
  constructor(state) {
    this.state = state;
    this.preChangeMapMenu = new PreChangeMapMenu(this);
  }

  onMapChange() {
    this.preChangeMapMenu.onMapChange();
    this.state.allEntities.removeAll(true);
  }

  initialize() {

    this.mapName = handler.playerData.currentMapName;

    this.state.allEntities = this.state.add.group();
    this.state.allEntities.smoothed = false;
    this.state.allEntities.enableBody = true;
    this.state.allEntities.objects = {};
    this.state.allEntities.enemies = {};
    this.state.allEntities.items = {};
    this.state.allEntities.traders = {};
    this.state.allEntities.teleporters = {};
    this.state.allEntities.npcs = {};
    this.state.allEntities.graves = {};
    this.state.map = this.state.add.tilemap(this.mapName,16,16);
    this.state.map.addTilesetImage("tileset16");

    handler.backgroundsData.forEach((backgroundKey, index) => {
      this.state['background' + "_" + index] = this.state.game.add.sprite(0, 0,backgroundKey);
      this.state['background' + "_" + index].inputEnabled = true;
      this.state['background' + "_" + index].events.onInputDown.add(function() {
        this.state.unblockPlayerMovement()
      }, this);
    });

    this.preChangeMapMenu.initialize();
    this.state.entities = [];
    for(let i=0;i<this.state.map.objects["Doors"].length;i++) {
      let doorToMap = new Button(this.state,this.state.map.objects["Doors"][i].x,this.state.map.objects["Doors"][i].y, "door_to_map",0,1,2,3,false,false)
      this.state.allEntities.add(doorToMap);
      this.state.game.physics.enable(doorToMap);
      doorToMap.body.immovable = true;
      this.state.entities.push(doorToMap);
      doorToMap.anchor.setTo(0);
      let properites = {};
      this.state.map.objects["Doors"][i].properties.forEach(property => {
        properites[property.name] = property.value;
      });

      doorToMap.nextMapName = properites['nextMapName'];
      doorToMap.addOnInputDownFunction(function() {
        if(getDistanceBetweenEntityAndPlayer(doorToMap, this.state.player) <= 100) {
          this.state.blockPlayerMovement();
          this.preChangeMapMenu.showOptionsMenu(doorToMap);
        } else {
          this.state.playerMoveManager.eraseXses();
        }
      },this);
    }

    for(let i=0;i<this.state.map.objects["Entities"].length;i++) {
      let newObjData = {};
      this.state.map.objects["Entities"][i].properties.forEach(property => {
        newObjData[property.name] = property.value;
      });
      let newObj = this.state.game.add.sprite(this.state.map.objects["Entities"][i].x, this.state.map.objects["Entities"][i].y,newObjData["name"]);
      newObj.anchor.setTo(0,1);
      newObj.y += newObj.height;
      this.state.game.physics.enable(newObj);
      newObj.body.immovable = true;
      newObj.body.offset.x = parseInt(newObjData["offsetX"]);
      newObj.body.offset.y = parseInt(newObjData["offsetY"]);
      newObj.body.width = parseInt(newObjData["width"]);
      newObj.body.height = parseInt(newObjData["height"]);

      this.state.allEntities.add(newObj);
      this.state.entities.push(newObj);
    };


    this.state.fences = [];
    for(let i=0;i<this.state.map.objects["Fences"].length;i++) {
      let fenceData = {};
      this.state.map.objects["Fences"][i].properties.forEach(property => {
        fenceData[property.name] = property.value;
      });
      fenceData.x = this.state.map.objects["Fences"][i].x;
      fenceData.width = this.state.map.objects["Fences"][i].width;
      fenceData.y = this.state.map.objects["Fences"][i].y;
      fenceData.height = this.state.map.objects["Fences"][i].height;
      let fences = generateFence(this.state,fenceData,this.state.allEntities);
      this.state.fences = this.state.fences.concat(fences);
    };

    this.state.allEntities.mobs = [];
    for(let i=0;i<this.state.map.objects["Mobs"].length;i++) {
      let mobsData = {};
      this.state.map.objects["Mobs"][i].properties.forEach(property => {
        mobsData[property.name] = property.value;
      });
      mobsData.x = this.state.map.objects["Mobs"][i].x;
      mobsData.width = this.state.map.objects["Mobs"][i].width;
      mobsData.y = this.state.map.objects["Mobs"][i].y;
      mobsData.height = this.state.map.objects["Mobs"][i].height;
      mobsData.quantity = mobsData.quantity || 1;
      mobsData.key = mobsData.key || this.state.map.objects["Mobs"][i].name;
      while(mobsData.quantity > 0) {
        let mob = new Mob(this.state,mobsData);
        this.state.allEntities.add(mob);
        this.state.allEntities.mobs.push(mob);
        mobsData.quantity -= 1;
      }
    };

    this.createPlayer();
  };

  onResize(width, height) {
    this.state.allEntities.setAll("smoothed",false);
  };

  createPlayer() {
    this.state.player = new Player(this.state.game,handler.playerData);
    handler.player = this.state.player;
    this.state.allEntities.add(this.state.player);
  };

  addNewPlayer(data) {
    let self = this.state;

    let newPlayer = newPlayer = new OtherPlayer(self.game,data);
    self.allEntities.add(newPlayer);
    self.allEntities.objects[data.id] = newPlayer;
    self.setRenderOrder(newPlayer);

    this.state.uiManager.addPlayerDescription(newPlayer);
  };

  removeEnemy (data) {
    let enemyToRemove = this.state.allEntities.enemies[data.id];
    this.state.uiManager.removeEnemyDescription(enemyToRemove);
    this.state.fightWithOpponentManager.removeSwords({
      enemyID : data.id
    });
    enemyToRemove.kill();
    delete this.state.allEntities.enemies[data.id];
  }

  removePlayer (data) {
    let playerToRemove = this.state.allEntities.objects[data.id];
    this.state.uiManager.removePlayerDescription(playerToRemove);
    this.state.fightWithOpponentManager.removeSwords({
      playerID : data.id
    });
    playerToRemove.kill();
    delete this.state.allEntities.objects[data.id];
  }

  addNewEnemy(data) {
    let self = this.state;
    let newEnemy = new Enemy(self,data);
    self.allEntities.add(newEnemy);
    self.allEntities.enemies[data.id] = newEnemy;
    newEnemy.addOnInputDownFunction(function() {
      if(getDistanceBetweenEntityAndPlayer(newEnemy, this.state.player) <= 75) {
        this.state.blockPlayerMovement();
        self.fightWithOpponentManager.showFightOptionsMenu(newEnemy);
      };
    }, this);
    self.setRenderOrder(newEnemy);
    this.state.uiManager.addEnemyDescription(newEnemy);
  };

  addNewTrader(data) {
    let self = this.state;
    let newTrader = new Trader(self,data);
    self.allEntities.add(newTrader);
    self.allEntities.traders[data.id] = newTrader;
    self.setRenderOrder(newTrader);
    this.state.uiManager.addNpcDescription(newTrader);
  };

  addNewTeleporter(data) {
    let self = this.state;

    let newTeleporter = new Teleporter(self,data);
    self.allEntities.add(newTeleporter);
    self.allEntities.teleporters[data.id] = newTeleporter;
    self.setRenderOrder(newTeleporter);

    this.state.uiManager.addNpcDescription(newTeleporter);
  };

  addNewNpc(data) {
    let self = this.state;

    let newNpc = new Npc(self,data);
    self.allEntities.add(newNpc);
    self.allEntities.npcs[data.id] = newNpc;
    self.setRenderOrder(newNpc);

    this.state.uiManager.addNpcDescription(newNpc);
  };

  addNewItem(data) {
    let self = this.state;
    let newItem = new Button(this.state,data.x, data.y,data.key,0,1,2,3);
    newItem.scale.setTo(0.7);
    self.allEntities.add(newItem);
    self.allEntities.items[data.id] = newItem;
    newItem.addOnInputDownFunction(function() {
      if(getDistanceBetweenEntityAndPlayer(newItem, this.state.player) <= 50) {
        this.state.blockPlayerMovement();
        handler.socketsManager.emit('pickUpItem', {
          itemID : data.id
        })
      };
    }, this);
    self.setRenderOrder(newItem);
  };

  removeItem (data) {
    let itemToRemove = this.state.allEntities.items[data.id];
    if(itemToRemove) {
      itemToRemove.kill();
      delete this.state.allEntities.items[data.id];
    }
  }

  addNewGrave(data) {
    let self = this.state;
    let newGrave = this.state.game.add.sprite(data.x, data.y, 'grave');
    self.allEntities.add(newGrave);
    self.allEntities.graves[data.id] = newGrave;
    self.setRenderOrder(newGrave);
  };

  removeGrave (data) {
    let graveToRemove = this.state.allEntities.graves[data.id];
    if(graveToRemove) {
      graveToRemove.kill();
      delete this.state.allEntities.graves[data.id];
    }
  }

  update() {
    this.state.allEntities.mobs.forEach(mob => {
      mob.updateMob();
    })
  }
}
