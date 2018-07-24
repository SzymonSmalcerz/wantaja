
let GameState = {
  create : function(){
    this.smoothed = false;
    handler.currentState = this;

    this.initializeMap();
    this.setCamera();
    this.initUI();
    this.initFightWithOpponentManager();
    this.initMoveManager();

    this.setRenderingOrder();
    this.sortEntities();
    handler.socketsManager.sendToServerInitializedInfo();

  },
  update : function() {
    this.physics.arcade.collide(this.walls, this.player);
    this.physics.arcade.collide(this.entities, this.player);
    this.emitData();
    this.uiManager.update();
    this.playerMoveManager.update();
  },
  render(){
    this.game.debug.text('FPS: ' + this.game.time.fps || 'FPS: --', 40, 40, "#00ff00");
  },
  initMoveManager() {
    this.playerMoveManager = new PlayerMoveManager(this);
  },
  initFightWithOpponentManager() {
    this.fightWithOpponentManager = new FightWithOpponentManager(this);
    this.fightWithOpponentManager.initialize();
  },
  setRenderingOrder() {
    this.game.world.bringToTop(this.map);
    this.game.world.bringToTop(this.allEntities);
    this.game.world.bringToTop(this.fightingStage);
    this.game.world.bringToTop(this.fightingOptionsMenu);
    this.game.world.bringToTop(this.ui);

    this.game.world.bringToTop(this.skillDescriptions);
    this.game.world.bringToTop(this.wonAlert);

    this.game.world.bringToTop(this.statusPoints);
  },
  initUI(){
    this.uiManager = new UIManager(this);
    this.uiManager.initialize();
  },
  sortEntities(){
    this.allEntities.children = this.allEntities.children.sort((a,b) => {
      return a.bottom - b.bottom;
    });
  },
  setRenderOrder(entity) {
    entity.bringToTop();
    let indexOfentity = this.allEntities.children.indexOf(entity);
    while(indexOfentity > 0 && this.allEntities.children[indexOfentity-1].bottom > entity.bottom) {
      entity.moveDown();
      indexOfentity-=1;
    };
  },
  changeRenderOrder(entity) {

    let indexOfentity = this.allEntities.children.indexOf(entity);
    if(indexOfentity > 0 && indexOfentity < this.allEntities.children.length && this.allEntities.children[indexOfentity-1].bottom > entity.bottom){
      while(indexOfentity > 0 && this.allEntities.children[indexOfentity-1].bottom > entity.bottom) {
        entity.moveDown();
        indexOfentity-=1;
      };
    } else {
      while(indexOfentity < this.allEntities.children.length - 1 && this.allEntities.children[indexOfentity+1].bottom < entity.bottom) {
        entity.moveUp();
        indexOfentity+=1;
      };
    }

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
  },
  onResize(width, height) {
    this.uiManager.onResize();
    this.fightWithOpponentManager.onResize();
    this.mapManager.onResize(width,height);
    this.setRenderingOrder();
  },
  setFightingModeOn(){
    this.uiManager.fightModeOn();
  },
  setFightingModeOff(){
    this.uiManager.fightModeOff();
  }
};
