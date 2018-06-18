
let GameState = {
  create : function(){
    this.createMap();
    this.createPlayer();
    this.setCamera();
    this.initOtherPlayers();
  },
  update : function(){
    this.physics.arcade.collide(this.walls, this.player);
  },
  createMap() {
    this.map = this.add.tilemap("firstMap",16,16);
    this.map.addTilesetImage("tileset16");
    this.floor = this.map.createLayer("Ground");
    this.walls = this.map.createLayer("Walls");
    this.floor.resizeWorld();
    this.map.setCollisionBetween(11,33,true,"Walls");
  },
  createPlayer() {
    this.player = new Player(this.game,100,100);
  },
  setCamera() {
    this.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON,1,1);
  },
  initOtherPlayers() {
    this.otherPlayers = this.add.group();
    this.otherPlayers.objects = {};
  }
};
