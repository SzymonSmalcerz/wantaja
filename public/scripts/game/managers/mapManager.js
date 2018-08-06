class MapManager {
  constructor(state) {
    this.state = state;
    this.enemiesDescriptionRendered = true;
    this.showPlayersDescription = true;

  }

  initialize() {
    this.state.allEntities = this.state.add.group();
    this.state.allEntities.smoothed = false;
    this.state.allEntities.enableBody = true;
    this.state.allEntities.objects = {};
    this.state.allEntities.enemies = {};

    this.state.map = this.state.add.tilemap("firstMap",16,16);
    this.state.map.addTilesetImage("tileset16");
    this.state.floor = this.state.map.createLayer("Ground");
    this.state.floor_2 = this.state.map.createLayer("Ground2");
    this.state.walls = this.state.map.createLayer("Walls");
    this.state.walls.layer.data = this.state.walls.layer.data.map((row,i) => {
      return row.map((val,index) => {
        if(val.index < 0){
          val.alpha = 0;
          val.visible = false;
          val.width = 0;
          val.height = 0;
          val.x = -500;
          val.y = -500;
          val.worldX = -500;
          val.worldY = -500;
        };
        return val;
      });
    });
    this.state.floor.resizeWorld();
    this.state.map.setCollisionBetween(0,64,true,"Walls");
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
    this.state.walls.resize(width,height);
    this.state.allEntities.setAll("smoothed",false);
  };

  createPlayer() {
    if(!handler.player){
      let receivedDataFromServer = handler.startPlayerData.characterData;
      this.state.player = new Player(this.state.game,receivedDataFromServer);
    } else {
      this.state.player = handler.player;
    };

    this.state.allEntities.add(this.state.player);
  };

  addNewPlayer(data) {
    let self = this.state;
    let newPlayer = null;
    if(!newPlayer){
      newPlayer = new OtherPlayer(self.game,data.x,data.y,data.id);
      self.allEntities.add(newPlayer);
      self.allEntities.objects[data.id] = newPlayer;
      self.setRenderOrder(newPlayer);
    } else {
      newPlayer.reset(data.x,data.y);
    }
  };

  hideEnemiesDescription() {
    this.enemiesDescriptionRendered = false;
    for (var key in this.state.allEntities.enemies) {
      if (this.state.allEntities.enemies.hasOwnProperty(key)) {
          this.state.allEntities.enemies[key].hideDescription();
      }
    }
  }

  showEnemiesDescription() {
    this.enemiesDescriptionRendered = true;
    for (var key in this.state.allEntities.enemies) {
      if (this.state.allEntities.enemies.hasOwnProperty(key)) {
          this.state.allEntities.enemies[key].showDescription();
      }
    }
  }

  removeEnemy (data) {
    let enemyToRemove = this.state.allEntities.enemies[data.id];
    enemyToRemove.kill();
    delete this.state.allEntities.enemies[data.id];
  }

  removePlayer (data) {
    let playerToRemove = this.state.allEntities.objects[data.id];
    playerToRemove.kill();
    delete this.state.allEntities.objects[data.id];
  }

  addNewEnemy(data){
    let self = this.state;
    let newEnemy = null;
    if(!newEnemy){
      newEnemy = new Enemy(self,data.x,data.y,data.id,data.key,data.health,data.maxHealth,data.animated);
      self.allEntities.add(newEnemy);
      self.allEntities.add(newEnemy.descriptionText);
      self.allEntities.enemies[data.id] = newEnemy;
      newEnemy.inputEnabled = true;
      newEnemy.input.pixelPerfectClick = true;
      newEnemy.events.onInputDown.add(function(){
        if(this.getDistanceBetweenEntityAndPlayer(newEnemy) <= 50){
          self.fightWithOpponentManager.showFightOptionsMenu(newEnemy);
        };
      }, this);
      self.setRenderOrder(newEnemy);
      if(!this.enemiesDescriptionRendered){
        newEnemy.hideDescription();
      }
    } else {
      newEnemy.reset(data.x,data.y);
    }
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
