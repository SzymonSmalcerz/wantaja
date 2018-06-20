
let GameState = {
  create : function(){
    handler.currentState = this;
    this.allEntities = this.add.group();
    this.allEntities.objects = {};
    this.allEntities.enemies = {};
    this.createMap();
    this.createPlayer();
    this.setCamera();
    this.initUI();
    this.initFightingStage();
    this.setRenderingOrder();
    handler.socketsManager.sendToServerInitializedInfo();

  },
  update : function(){
    this.physics.arcade.collide(this.walls, this.player);
    this.physics.arcade.collide(this.entities, this.player);
    this.emitData();
    this.sortEntities();
    this.uiManager.update();
    // if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
    //   console.log(this.emitter);
    //   this.emitter.position.x = 200;
    //   this.emitter.position.y = 200;
    //   this.emitter.start(true,450,null,100);
    // };
  },
  initFightingStage(){
    this.fightingStageManager = new FightingStageManager(this);
    this.fightingStageManager.initialize();
  },
  setRenderingOrder(){
    this.game.world.bringToTop(this.allEntities);
    this.game.world.bringToTop(this.fightingStage);
    this.game.world.bringToTop(this.ui);
  },
  initUI(){
    this.uiManager = new UIManager(this);
    this.uiManager.initialize();
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
    let newPlayer = null;
    if(!newPlayer){
      newPlayer = new OtherPlayer(self.game,data.x,data.y,data.id);
      self.allEntities.add(newPlayer);
      self.allEntities.objects[data.id] = newPlayer;
    } else {
      newPlayer.reset(data.x,data.y);
    }
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
        self.fightingStageManager.startFight(newEnemy);
      },this);
    } else {
      newEnemy.reset(data.x,data.y);
    }
  }
};
