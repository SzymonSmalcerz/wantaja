
let GameState = {
  create : function(){
    handler.currentState = this;
    this.initializeMap();
    this.setCamera();
    this.initUI();
    this.initFightingStage();
    this.initMoveManager();
    this.setRenderingOrder();
    handler.socketsManager.sendToServerInitializedInfo();
    // this.allEntities.setAll("renderable", false);
    // this.player.renderable = true;

  },
  update : function(){
    // this.physics.arcade.collide(this.walls, this.player);
    // this.physics.arcade.collide(this.entities, this.player);
    this.emitData();
    this.sortEntities();
    this.uiManager.update();
    this.playerMoveManager.update();
    // if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
    //   console.log(this.emitter);
    //   this.emitter.position.x = 200;
    //   this.emitter.position.y = 200;
    //   this.emitter.start(true,450,null,100);
    // };


  },
  initMoveManager(){
    this.playerMoveManager = new PlayerMoveManager(this);
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
        };
      };
    };
  },
  emitData(){
    this.player.emitData(handler);
  },
  initializeMap() {
    this.mapManager = new MapManager(this);
    this.mapManager.initialize();
  },
  setCamera() {
    this.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON,1,1);
  }
};
