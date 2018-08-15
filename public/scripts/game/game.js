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
    this.playerAvatarDictionary = {
      female : {
        levels : [5,10,15,20,25,30,35],
        names : ['black','brown','blond','purple','red']
      },
      male : {
        levels : [5,10,15,20,25,30,35],
        names : ['green','white','blond','pink','bold','grey']
      }
    };
    this.socket = socket;
    this.startPlayerData = data;
    this.playerData = data.characterData;
    let gameWidth = Math.min(window.innerWidth, 500);
    let gameHeight = Math.min(window.innerHeight, 700);
    this.playerID = data.characterData.id;
    this.game = new Phaser.Game(gameWidth,gameHeight, Phaser.CANVAS);
    this.game.state.add("PreState", PreState);
    this.game.state.add("LoadState", LoadState);
    this.game.state.add("HomeState", HomeState);
    this.game.state.add("GameState", GameState);
    this.game.state.start("PreState");
    this.socketsManager = new SocketsManager(this);
    this.socketsManager.initialize();
    window.addEventListener("resize", () => {
      let width = Math.min(window.innerWidth, 500);
      let height = Math.min(window.innerHeight, 700);
      this.game.scale.setGameSize(width, height);
      this.game.camera.setBoundsToWorld();
      this.game.camera.setSize(width, height);
      this.game.scale.setShowAll();
      this.game.stage.width = width;
      this.game.stage.height = height
      this.game.scale.refresh();
      if(this.game.state.getCurrentState()){
        this.game.state.getCurrentState().onResize(width,height);
      };
      this.game.scale.refresh();
    });
  }
};


let handler = new GameHandler();
