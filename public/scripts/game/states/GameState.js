
let GameState = {
  create : function(){
    this.createMap();
    this.createPlayer();
    this.setCamera();
    this.initOtherPlayers();
    // this.newPlayer = new OtherPlayer(this.game,100,100,100);
    this.initSockets();
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
  },
  initSockets() {
    let self = this;
    handler.socket.on("addPlayer", function(data){
      let newPlayer = self.otherPlayers.getFirstExists();
      console.log("adding new plyaer");
      if(!newPlayer){
        console.log("craeting new player");
        newPlayer = new OtherPlayer(self.game,data.x,data.y,data.id);
        self.otherPlayers.add(newPlayer);
        self.otherPlayers.objects[data.id] = newPlayer;
      } else {
        newPlayer.reset(data.x,data.y);
      }
    });

    handler.socket.on("removePlayer", function(data){
      let playerToRemove = self.otherPlayers.objects[data.id];
      console.log(playerToRemove);
      console.log(self.otherPlayers.total);
      self.otherPlayers.remove(playerToRemove);
      console.log(self.otherPlayers.total);
    });

    handler.socket.on("gameData", function(data){

    });
  }
};
