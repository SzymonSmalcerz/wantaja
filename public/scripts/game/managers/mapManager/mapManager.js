class MapManager {
  constructor(state) {
    this.state = state;
    this.preChangeMapMenu = new PreChangeMapMenu(this);
  }

  onMapChange() {
    this.preChangeMapMenu.onMapChange();
    this.state.backgrounds.removeAll(true);
    // this.state.allEntities.removeAll(true);
    // this.state.map.removeAll(true);
  }

  initialize() {

    this.mapName = handler.playerData.currentMapName;

    this.state.backgrounds = this.state.add.group();
    this.state.backgrounds.smoothed = false;
    handler.backgroundsData.forEach(backgroundKey => {
      this.state.background = this.state.game.add.sprite(0, 0,backgroundKey);
    });

    this.state.allEntities = this.state.add.group();
    this.state.allEntities.smoothed = false;
    this.state.allEntities.enableBody = true;
    this.state.allEntities.objects = {};
    this.state.allEntities.enemies = {};
    this.state.allEntities.items = {};
    this.state.allEntities.traders = {};
    this.state.allEntities.npcs = {};
    this.state.map = this.state.add.tilemap(this.mapName,16,16);
    this.state.map.addTilesetImage("tileset16");
    this.state.colliders = this.state.add.group();

    this.preChangeMapMenu.initialize();
    this.state.entities = [];
    for(let i=0;i<this.state.map.objects["Doors"].length;i++) {
      let doorToMap = new Button(this.state,this.state.map.objects["Doors"][i].x,this.state.map.objects["Doors"][i].y, "door_to_map",0,1,2,3)
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
        }
      },this);
    }

    for(let i=0;i<this.state.map.objects["Entities"].length;i++){
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
      while(mobsData.quantity > 0){
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
    if(!handler.player) {
      this.state.player = new Player(this.state.game,handler.playerData);
      handler.player = this.state.player;
    } else {
      this.state.player = handler.player;
    };

    this.state.allEntities.add(this.state.player);
  };

  addNewPlayer(data) {
    let self = this.state;
    let newPlayer = null;
    if(!newPlayer){
      newPlayer = new OtherPlayer(self.game,data);
      self.allEntities.add(newPlayer);
      self.allEntities.objects[data.id] = newPlayer;
      self.setRenderOrder(newPlayer);
    } else {
      newPlayer.reset(data.x,data.y);
    }
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
    this.state.fightWithOpponentManager.removeSwords({
      playerID : data.id
    });
    playerToRemove.kill();
    delete this.state.allEntities.objects[data.id];
  }

  addNewEnemy(data){
    let self = this.state;
    let newEnemy = null;
    if(!newEnemy){
      newEnemy = new Enemy(self,data);
      self.allEntities.add(newEnemy);
      self.allEntities.enemies[data.id] = newEnemy;
      newEnemy.addOnInputDownFunction(function(){
        if(getDistanceBetweenEntityAndPlayer(newEnemy, this.state.player) <= 50) {
          this.state.blockPlayerMovement();
          self.fightWithOpponentManager.showFightOptionsMenu(newEnemy);
        };
      }, this);
      self.setRenderOrder(newEnemy);
    } else {
      newEnemy.reset(data.x,data.y);
    }

    this.state.uiManager.addEnemyDescription(newEnemy);
  };

  addNewTrader(data) {
    let self = this.state;
    let newTrader = null;
    if(!newTrader){
      newTrader = new Trader(self,data);
      self.allEntities.add(newTrader);
      self.allEntities.traders[data.id] = newTrader;
      self.setRenderOrder(newTrader);
    } else {
      newTrader.reset(data.x,data.y);
    }
  };

  addNewNpc(data) {
    let self = this.state;
    let newNpc = null;
    if(!newNpc){
      newNpc = new Npc(self,data);
      self.allEntities.add(newNpc);
      self.allEntities.npcs[data.id] = newNpc;
      self.setRenderOrder(newNpc);
    } else {
      newNpc.reset(data.x,data.y);
    }
    console.log(data);
  };

  addNewItem(data) {
    let self = this.state;
    let newItem = null;
    if(!newItem){
      newItem = new Button(this.state,data.x, data.y,data.key,0,1,2,3);
      newItem.scale.setTo(0.7);
      self.allEntities.add(newItem);
      console.log(data);
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
    } else {
      newItem.reset(data.x,data.y);
    }
  };

  removeItem (data) {
    console.log(data.id);
    let itemToRemove = this.state.allEntities.items[data.id];
    itemToRemove.kill();
    delete this.state.allEntities.items[data.id];
  }

  update() {
    this.state.allEntities.mobs.forEach(mob => {
      mob.updateMob();
    })
  }
}
