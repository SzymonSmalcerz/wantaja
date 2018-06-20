class GameHandler {
  constructor(){
    this.otherPlayers = {};
    this.enemies = {};
    this.entities = {};
    this.game = undefined;
    this.playerID = undefined; // set in startGame function
    this.player = undefined;
    this.socket = undefined;
    this.startPlayerData = undefined;
    this.currentState = undefined;
  }

  startGame(data,socket){
    this.socket = socket;
    this.startPlayerData = data;
    console.log(data);
    this.playerID = data.characterData.id;
    this.game = new Phaser.Game(360,640, Phaser.CANVAS);
    this.game.state.add("PreState", PreState);
    this.game.state.add("LoadState", LoadState);
    this.game.state.add("HomeState", HomeState);
    this.game.state.add("GameState", GameState);
    this.game.state.start("PreState");
    this.socketsManager = new SocketsManager(this);
    this.socketsManager.initialize();
    window.addEventListener("resize", () => {
      this.game.scale.refresh();
    });
  }
};


let handler = new GameHandler();
