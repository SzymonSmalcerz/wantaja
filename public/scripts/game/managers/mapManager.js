class MapManager {
  constructor(state) {
    this.state = state;
  }

  initialize() {
    this.mapName = this.mapName || handler.playerData.currentMapName;
    this.state.allEntities = this.state.add.group();
    this.state.allEntities.smoothed = false;
    this.state.allEntities.enableBody = true;
    this.state.allEntities.objects = {};
    this.state.allEntities.enemies = {};
    this.state.map = this.state.add.tilemap(this.mapName,16,16);
    this.state.map.addTilesetImage("tileset16");
    this.state.floor = this.state.map.createLayer("Ground");
    this.state.floor_2 = this.state.map.createLayer("Ground2");
    this.state.colliders = this.state.add.group();
    this.state.doorToMap = new Button(this.state.game,50,50, "door_to_map",0,1,2,3)
    this.state.allEntities.add(this.state.doorToMap);
    this.state.doorToMap.addOnInputDownFunction(function(){
      handler.socketsManager.emit("changeMap", {
        mapName : "secondMap",
        id : handler.playerData.id
      })
    },this);
    // this.state.floor_2.layer.data.forEach((row,i) => {
    //   row.forEach((val,index) => {
    //     if(val.index > 3071) {
    //       let sprite = this.state.game.add.sprite(val.x * 16,val.y * 16,"collisionSquare");
    //       this.state.game.physics.enable(sprite);
    //       this.state.colliders.add(sprite);
    //       sprite.body.immovable = true;
    //       sprite.alpha = 0;
    //       // sprite.visible = trie;
    //       // sprite.body.onCollide = new Phaser.Signal();
    //       // sprite.body.onCollide.addOnce(function(){
    //       //   this.visible = false;
    //       // },sprite);
    //       // sprite.alpha = 0.00;
    //     }
    //   });
    // });
    this.state.floor.resizeWorld();
    // this.state.map.setCollisionBetween(3072,4096,true,"Ground2");
    this.state.entities = [];
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
    this.state.floor.resize(width,height);
    this.state.floor_2.resize(width,height);
    // this.state.walls.resize(width,height);
    this.state.allEntities.setAll("smoothed",false);
  };

  createPlayer() {
    if(!handler.player){
      console.log(handler.playerData.key);
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
        if(this.getDistanceBetweenEntityAndPlayer(newEnemy) <= 50){
          self.fightWithOpponentManager.showFightOptionsMenu(newEnemy);
        };
      }, this);
      self.setRenderOrder(newEnemy);
    } else {
      newEnemy.reset(data.x,data.y);
    }

    this.state.uiManager.addEnemyDescription(newEnemy);
  };

  update() {
    this.state.allEntities.mobs.forEach(mob => {
      mob.updateMob();
    })
  }
  getDistanceBetweenEntityAndPlayer(entity){
    let entityCoords = {
      x : entity.left + entity.width/2,
      y : entity.bottom - entity.height/2
    };
    let playerCoords = {
      x : this.state.player.left + this.state.player.width/2,
      y : this.state.player.bottom - this.state.player.height/2
    };
    return Math.sqrt(Math.pow(entityCoords.x - playerCoords.x,2) + Math.pow(entityCoords.y - playerCoords.y,2));
  };
}
