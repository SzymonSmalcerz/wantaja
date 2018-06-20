class GameHandler {
  constructor(){
    this.otherPlayers = {};
    this.enemies = {};
    this.entities = {};
    this.game = undefined;
    this.playerID = undefined; // set in startGame function
    this.socket = undefined;
    this.startPlayerData = undefined;
    this.uiManager = new UIManager(this);
    this.fightingStageManager = new FightingStageManager(this);
    this.socketsManager = new SocketsManager(this);
  }

  startGame(data,socket){
    this.socket = socket;
    this.startPlayerData = data;
    this.playerID = data.characterData.id;
    this.game = new Phaser.Game(360,640, Phaser.CANVAS);
    this.game.state.add("PreState", PreState);
    this.game.state.add("LoadState", LoadState);
    this.game.state.add("HomeState", HomeState);
    this.game.state.add("GameState", GameState);
    this.game.state.start("PreState");
    window.addEventListener("resize", () => {
      this.game.scale.refresh();
    });

    this.setSockets();
  }

  setSockets(){
    let self = this;
    this.socket.on('checkForConnection', function () {
      self.socket.emit("checkedConnection",{
        id : self.playerID
      });
    });
  }
};


let handler = new GameHandler();
