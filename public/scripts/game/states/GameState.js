
let GameState = {
  create : function(){
    this.allEntities = this.add.group();
    this.allEntities.objects = {};
    this.createMap();
    this.createPlayer();
    this.setCamera();
    this.initSockets();
    this.game.world.bringToTop(this.allEntities);
  },
  update : function(){
    this.physics.arcade.collide(this.walls, this.player);
    this.physics.arcade.collide(this.entities, this.player);
    this.emitData();
    this.sortEntities();
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
    this.map.setCollisionBetween(197,229,true,"Walls");


    this.entities = [];
    // this.map.createFromObjects("Entities",197,"tileset16",15,true,false,this.entities,null,true,false);
    for(let i=0;i<this.map.objects["Entities"].length;i++){
      let newObjData = {};
      this.map.objects["Entities"][i].properties.forEach(property => {
        newObjData[property.name] = property.value;
      });
      console.log(newObjData);
      let newObj = this.game.add.sprite(this.map.objects["Entities"][i].x, this.map.objects["Entities"][i].y,newObjData["name"]);
      newObj.anchor.setTo(0,1);
      console.log(newObj.position);
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
    this.player = new Player(this.game,100,100);
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
      self.allEntities.add(newPlayer);
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
      let playerToRemove = self.allEntities.objects[data.id];
      self.allEntities.remove(playerToRemove);
      delete self.allEntities.objects[data.id];
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
        if(data.hasOwnProperty(playerID) && self.allEntities.objects[playerID] && playerID != handler.playerID){
          self.allEntities.objects[playerID].x = data[playerID].x;
          self.allEntities.objects[playerID].y = data[playerID].y;
          self.allEntities.objects[playerID].frame = data[playerID].frame || 1;
        };
      };
    });
  }
};
