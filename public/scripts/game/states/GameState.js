
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
    this.emitData();
    // console.log("called");
  },
  emitData(){
    handler.socket.emit("playerData", {
      x : this.player.x,
      y : this.player.y,
      id : handler.playerID,
      frame : this.player.frame
    })
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
  addNewPlayer(data){
    let self = this;
    let newPlayer = self.otherPlayers.getFirstExists();
    if(!newPlayer){
      newPlayer = new OtherPlayer(self.game,data.x,data.y,data.id);
      self.otherPlayers.add(newPlayer);
      self.otherPlayers.objects[data.id] = newPlayer;
    } else {
      newPlayer.reset(data.x,data.y);
    }
  },
  initSockets() {
    let self = this;

    handler.socket.emit("initialized", {id : handler.playerID});
    handler.socket.on("addPlayer", function(data){
      self.addNewPlayer(data);
    });

    handler.socket.on("removePlayer", function(data){
      let playerToRemove = self.otherPlayers.objects[data.id];
      self.otherPlayers.remove(playerToRemove);
      delete self.otherPlayers.objects[data.id];
    });

    handler.socket.on("initialMapData", function(data) {
      console.log("in")
      for(let playerID in data.players) {
        if(data.players.hasOwnProperty(playerID)){
          self.addNewPlayer(data.players[playerID]);
        }
      };
    });

    handler.socket.on("gameData", function(data){
      for(let playerID in data) {
        if(data.hasOwnProperty(playerID) && self.otherPlayers.objects[playerID]){
          self.otherPlayers.objects[playerID].x = data[playerID].x;
          self.otherPlayers.objects[playerID].y = data[playerID].y;
          self.otherPlayers.objects[playerID].frame = data[playerID].frame || 1;
        };
      };
    });
  }
};
