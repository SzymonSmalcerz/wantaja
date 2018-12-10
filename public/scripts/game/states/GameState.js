let GameState = {
  create : function() {
    this.smoothed = false;
    handler.currentState = this;
    this.missionManager = new MissionManager(this);
    this.initDeathManager();
    this.initializeMap();
    this.initUI();
    this.initFightWithOpponentManager();
    this.initMoveManager();
    this.setRenderingOrder();
    this.sortEntities();
    this.uiManager.showTownAlert(this.player.currentMapName);
    handler.onResize();
    handler.socketsManager.sendToServerInitializedInfo();
  },
  // destroyEveryElement
  changeMap() {
    this.uiManager.onMapChange();
    this.fightWithOpponentManager.onMapChange();
    this.mapManager.onMapChange();
    if(this.missionManager) {
      this.missionManager.onMapChange();
    }
    this.game.world.removeAll();
    handler.game.state.restart(true);
    this.playerBlocked = false;
  },
  update : function() {
    this.physics.arcade.collide(this.colliders, this.player);
    this.physics.arcade.collide(this.entities, this.player);
    this.physics.arcade.collide(this.player, this.fences);
    this.emitData();
    this.uiManager.update();
    this.mapManager.update();
    this.playerMoveManager.update();
    this.sort();
    this.camera.focusOnXY(this.player.x, this.player.y);
  },
  sort() {
    let indexOfentity = this.allEntities.children.length - 1;
    while(indexOfentity > 0) {
      if(this.allEntities.children[indexOfentity-1].bottom > this.allEntities.children[indexOfentity].bottom) {
        this.allEntities.children[indexOfentity].moveDown();
      }
      indexOfentity-=1;
    };
  },
  render() {
    if(this.player.nick == "admin") {
      this.game.debug.text('FPS: ' + this.game.time.fps || 'FPS: --', 40, this.game.height - 40, "#00ff00");
    }
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
    this.game.world.bringToTop(this.descriptions);
    this.fightWithOpponentManager.bringToTop();
    this.game.world.bringToTop(this.changeMapOptionsMenu);
    this.uiManager.bringToTop();
    this.missionManager.bringToTop();
  },
  initUI() {
    delete this.uiManager;
    this.uiManager = new UIManager(this);
    this.uiManager.initialize();
  },
  sortEntities() {
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
    throw new Error('SHOULD NOT BE CALLED, DEPRACATED METHOD');
    return;
  },
  emitData() {
    this.player.emitData(handler);
  },
  initializeMap() {
    this.mapManager = new MapManager(this);
    this.mapManager.initialize();
  },
  initDeathManager() {
    this.deathManager = new DeathManager(this);
    this.deathManager.initialize();
  },
  initMissionManager() {
    this.missionManager.initialize();
  },
  onResize(width, height) {
    this.fightWithOpponentManager.onResize();
    this.mapManager.onResize(width,height);
    this.uiManager.onResize();
    this.missionManager.onResize();
    this.setRenderingOrder();
    this.player.unblockMovement();
    this.deathManager.onResize();
  },
  setFightingModeOn() {
    this.playerMoveManager.eraseXses();
    this.uiManager.fightModeOn();
  },
  setFightingModeOff() {
    this.uiManager.fightModeOff();
  },
  styleText(text) {
    handler.styleText(text);
  },
  fixText(text, maxWidth, defaultFontSize) {
    handler.fixText(text, maxWidth, defaultFontSize);
  },
  blockPlayer() {
    this.playerBlocked = true;
  },
  unblockPlayer() {
    this.playerBlocked = false;
  },
  blockPlayerMovement(num) {
    this.playerMoveManager.blockPlayerMovement(num);
  },
  unblockPlayerMovement() {
    this.playerMoveManager.unblockPlayerMovement();
  },
  handleDeath(data) {
    this.deathManager.handleDeath(data);
  },
  updateExclamationMarks() {
    this.uiManager.updateExclamationMarks();
  },
  removeExclamationMark(stageCrypto) {
    this.missionManager.removeExclamationMark(stageCrypto);
  }
};
