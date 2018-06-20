
let GameState = {
  create : function(){
    this.allEntities = this.add.group();
    this.allEntities.objects = {};
    this.allEntities.enemies = {};
    this.createMap();
    this.createPlayer();
    this.setCamera();
    this.initSockets();
    this.initUI();
    this.initFightingStage();
    this.setRenderingOrder();
  },
  update : function(){
    this.physics.arcade.collide(this.walls, this.player);
    this.physics.arcade.collide(this.entities, this.player);
    this.emitData();
    this.sortEntities();
    this.handleBars();
    // if(this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
    //   this.fightingStage.visible = !this.fightingStage.visible;
    // }
  },
  initFightingStage(){
    this.fightingStage = this.add.group();


    this.fightingStageBackground = this.add.sprite(0,0,"fightingBackgroungFirstMap");
    this.enemyLogo = this.game.add.sprite(this.game.width - 78,8,"spiderlogo");
    this.emptyHpBarEnemy = this.game.add.sprite(this.game.width - 210,15,"healthBarDark");
    this.fullHpBarEnemy = this.game.add.sprite(this.game.width - 210,15,"healthBar");

    this.fightingStage.add(this.fightingStageBackground);
    this.fightingStage.add(this.enemyLogo);
    this.fightingStage.add(this.emptyHpBarEnemy);
    this.fightingStage.add(this.fullHpBarEnemy);

    this.fightingStage.visible = false;
    this.fightingStage.fixedToCamera = true;
  },
  handleBars(){
    this.fullHpBar.width = this.player.health/this.player.maxHealth * this.emptyHpBar.width;
    this.fullExpBar.width = this.player.experience/this.player.requiredExperience * this.emptyExpBar.width;
  },
  setRenderingOrder(){
    this.game.world.bringToTop(this.allEntities);
    this.game.world.bringToTop(this.fightingStage);
    this.game.world.bringToTop(this.ui);
  },
  initUI(){
    // health bars
    this.emptyHpBar = this.game.add.sprite(70,this.game.height - 60,"healthBarDark");
    this.fullHpBar = this.game.add.sprite(70,this.game.height - 60,"healthBar");

    //experience bars
    this.emptyExpBar = this.game.add.sprite(70,this.game.height - 36,"experienceBarDark");
    this.fullExpBar = this.game.add.sprite(70,this.game.height - 36,"experienceBar");

    //player logo
    this.playerlogo = this.game.add.sprite(2,this.game.height - 72,"playerlogo");


    //adding everything to one group
    this.ui = this.add.group();
    this.ui.add(this.playerlogo);
    this.ui.add(this.emptyHpBar);
    this.ui.add(this.fullHpBar);
    this.ui.add(this.emptyExpBar);
    this.ui.add(this.fullExpBar);

    this.ui.setAll("fixedToCamera",true);
  },
  sortEntities(){
    let entities = this.allEntities.children;
    for(let i=0;i<entities.length;i++){
      for(let j=0;j<entities.length;j++){
        if(entities[i].bottom > entities[j].bottom){
          entities[i].moveUp();
        }
      }
    }
  },
  emitData(){
    this.player.emitData(handler);
  },
  createMap() {
    this.map = this.add.tilemap("firstMap",16,16);
    this.map.addTilesetImage("tileset16");
    this.floor = this.map.createLayer("Ground");
    this.walls = this.map.createLayer("Walls");
    this.floor.resizeWorld();
    this.map.setCollisionBetween(11,33,true,"Walls");
    this.map.setCollisionBetween(197,229,true,"Walls");

    this.entities = [];
    // this.map.createFromObjects("Entities",197,"tileset16",15,true,false,this.entities,null,true,false);
    for(let i=0;i<this.map.objects["Entities"].length;i++){
      let newObjData = {};
      this.map.objects["Entities"][i].properties.forEach(property => {
        newObjData[property.name] = property.value;
      });
      let newObj = this.game.add.sprite(this.map.objects["Entities"][i].x, this.map.objects["Entities"][i].y,newObjData["name"]);
      newObj.anchor.setTo(0,1);
      this.game.physics.enable(newObj);
      newObj.body.immovable = true;
      newObj.body.offset.x = parseInt(newObjData["offsetX"]);
      newObj.body.offset.y = parseInt(newObjData["offsetY"]);
      newObj.body.width = parseInt(newObjData["width"]);
      newObj.body.height = parseInt(newObjData["height"]);

      this.allEntities.add(newObj);
      this.entities.push(newObj);
    }
  },
  createPlayer() {
    let receivedDataFromServer = handler.startPlayerData.characterData;
    this.player = new Player(this.game,receivedDataFromServer);
    this.allEntities.add(this.player);
  },
  setCamera() {
    this.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON,1,1);
  },
  addNewPlayer(data){
    let self = this;
    // let newPlayer = self.allEntities.getFirstExists(false,true);
    let newPlayer = null;
    if(!newPlayer){
      newPlayer = new OtherPlayer(self.game,data.x,data.y,data.id);
      self.allEntities.add(newPlayer);
      self.allEntities.objects[data.id] = newPlayer;
    } else {
      newPlayer.reset(data.x,data.y);
    }
  },
  startFight(enemy){
    this.player.isFighting = true; // player wont send any data about his position to the server while fighting
    this.player.frame = 1;
    this.fightingStage.add(this.player);
    this.fightingStage.add(enemy);
    enemy.oldCoords = {
      x : enemy.x,
      y : enemy.y
    };
    this.player.oldCoords = {
      x : this.player.x,
      y : this.player.y
    }
    enemy.x = this.game.width/2 + 50;
    enemy.y = this.game.height/2 - 45;

    this.player.x = this.game.width/2 - 50;
    this.player.y = this.game.height/2 + 70;
    this.player.bringToTop();
    enemy.bringToTop();
    this.fightingStage.visible = true;
  },
  handleWinFight(data){
    this.player.x = this.player.oldCoords.x;
    this.player.y = this.player.oldCoords.y;
    if(this.allEntities.enemies[data.enemyID]){
      this.allEntities.enemies[data.enemyID].kill();
    }
    this.player.isFighting = false;
  },
  addNewEnemy(data){
    let self = this;
    let newEnemy = null;
    if(!newEnemy){
      newEnemy = new Enemy(self.game,data.x,data.y,data.id,data.key,data.health,data.maxHealth);
      self.allEntities.add(newEnemy);
      self.allEntities.enemies[data.id] = newEnemy;
      newEnemy.inputEnabled = true;
      newEnemy.input.pixelPerfectClick = true;
      newEnemy.events.onInputDown.add(function(){
        self.startFight(newEnemy);
      }, this);
    } else {
      newEnemy.reset(data.x,data.y);
    }
  },
  initSockets() {
    let self = this;
    handler.socket.emit("initialized", {id : handler.playerID});

    handler.socket.on("fightData", (data) => {

    });
    handler.socket.on("addPlayer", function(data){
      self.addNewPlayer(data);
    });

    handler.socket.on("addEnemy", function(data){
      self.addNewEnemy(data);
    });

    handler.socket.on("removePlayer", function(data){
      let playerToRemove = self.allEntities.objects[data.id];
      self.allEntities.remove(playerToRemove);
      delete self.allEntities.objects[data.id];
    });

    handler.socket.on("initialMapData", function(data) {
      for(let playerID in data.players) {
        if(data.players.hasOwnProperty(playerID)){
          self.addNewPlayer(data.players[playerID]);
        }
      };

      for(let enemyID in data.mobs) {
        if(data.mobs.hasOwnProperty(enemyID)){
          if(!self.allEntities[enemyID]){
            self.addNewEnemy(data.mobs[enemyID]);
          };
        }
      };
    });

    handler.socket.on("gameData", function(data){
      let playerData = data.playerData;
      self.player.updateData(playerData);
      let otherPlayersData = data.otherPlayersData;
      for(let playerID in otherPlayersData) {
        if(otherPlayersData.hasOwnProperty(playerID) && self.allEntities.objects[playerID] && playerID != handler.playerID){
          self.allEntities.objects[playerID].x = otherPlayersData[playerID].x;
          self.allEntities.objects[playerID].y = otherPlayersData[playerID].y;
          self.allEntities.objects[playerID].frame = otherPlayersData[playerID].frame || 1;
        };
      };
    });
  }
};
