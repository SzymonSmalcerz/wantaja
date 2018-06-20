class MapManager {
  constructor(state) {
    this.state = state;
  }

  initialize() {

    this.state.allEntities = this.state.add.group();
    this.state.allEntities.objects = {};
    this.state.allEntities.enemies = {};

    this.state.map = this.state.add.tilemap("firstMap",16,16);
    this.state.map.addTilesetImage("tileset16");
    this.state.floor = this.state.map.createLayer("Ground");
    this.state.walls = this.state.map.createLayer("Walls");
    this.state.floor.resizeWorld();
    this.state.map.setCollisionBetween(11,33,true,"Walls");
    this.state.map.setCollisionBetween(197,229,true,"Walls");

    this.state.entities = [];
    for(let i=0;i<this.state.map.objects["Entities"].length;i++){
      let newObjData = {};
      this.state.map.objects["Entities"][i].properties.forEach(property => {
        newObjData[property.name] = property.value;
      });
      let newObj = this.state.game.add.sprite(this.state.map.objects["Entities"][i].x, this.state.map.objects["Entities"][i].y,newObjData["name"]);
      newObj.anchor.setTo(0,1);
      this.state.game.physics.enable(newObj);
      newObj.body.immovable = true;
      newObj.body.offset.x = parseInt(newObjData["offsetX"]);
      newObj.body.offset.y = parseInt(newObjData["offsetY"]);
      newObj.body.width = parseInt(newObjData["width"]);
      newObj.body.height = parseInt(newObjData["height"]);

      this.state.allEntities.add(newObj);
      this.state.entities.push(newObj);
    };


    this.createPlayer();
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

  addNewPlayer(data){
    let self = this.state;
    let newPlayer = null;
    if(!newPlayer){
      newPlayer = new OtherPlayer(self.game,data.x,data.y,data.id);
      self.allEntities.add(newPlayer);
      self.allEntities.objects[data.id] = newPlayer;
    } else {
      newPlayer.reset(data.x,data.y);
    }
  };

  addNewEnemy(data){
    let self = this.state;
    let newEnemy = null;
    if(!newEnemy){
      newEnemy = new Enemy(self.game,data.x,data.y,data.id,data.key,data.health,data.maxHealth);
      self.allEntities.add(newEnemy);
      self.allEntities.enemies[data.id] = newEnemy;
      newEnemy.inputEnabled = true;
      newEnemy.input.pixelPerfectClick = true;
      newEnemy.events.onInputDown.add(function(){
        self.fightingStageManager.startFight(newEnemy);
      });
    } else {
      newEnemy.reset(data.x,data.y);
    }
  };
}
