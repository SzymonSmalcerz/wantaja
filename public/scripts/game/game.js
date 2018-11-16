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
        levels : [1,5,10,15,20,25,30,35],
        names : ['black','brown','blond','purple','red']
      },
      male : {
        levels : [1,5,10,15,20,25,30,35],
        names : ['green','white','blond','pink','bold','grey']
      }
    };
    this.socket = socket;
    this.startPlayerData = data;
    this.money = data.characterData.money;
    this.missions = data.characterData.missions;
    this.notOpenedMissions = []; // array for not opened missions, if this array has not opened mission it means that there is a stage that was not opened by this player at this session
    this.playerData = data.characterData;
    this.backgroundsData = data.mapData.backgrounds;
    this.fightingStageBackground = data.mapData.fightingStageBackground;
    this.mapDimensions = {
      width : data.mapData.dimensions.width || 1600,
      height : data.mapData.dimensions.height + 65 || 1665
    };
    let gameWidth = Math.min(window.innerWidth, 500);
    let gameHeight = Math.min(window.innerHeight, 700);
    // if(gameWidth%2 == 1) {
    //   gameWidth-=1
    // };
    // if(gameHeight%2 == 1) {
    //   gameHeight-=1
    //  };
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
      this.onResize();
    });


    this.onResize = () => {
      let width = Math.min(window.innerWidth, 500);
      let height = Math.min(window.innerHeight, 700);
      // console.log("_______________");
      // if(width%2 == 1) {
      //   console.log("decreased width");
      //   width-=1
      // } else {
      //   console.log("normal width")
      // }
      // if(height%2 == 1) {
      //   console.log("decreased height");
      //   height-=1
      //  } else {
      //    console.log("normal height")
      //  }
      this.game.scale.setGameSize(width, height);
      this.game.world.resize(this.mapDimensions.width, this.mapDimensions.height);
      this.game.camera.setBoundsToWorld();
      this.game.camera.setSize(width, height);
      this.game.scale.setShowAll();
      this.game.stage.width = width;
      this.game.stage.height = height
      this.game.scale.refresh();
      if(this.game.state.getCurrentState()){
        this.game.state.getCurrentState().onResize(width,height);
      };
    }
  }

  styleText(text) {
    let textCss = {
      font : "20px",
      fontWeight : "900",
      stroke : '#FFF',
      strokeThickness : 2,
      fill : '#000'
    };
    text.setStyle(textCss);
    text.lineSpacing = -5;
    text.smoothed = false;
    // if(text.width % 2 == 1) {
    //   console.log("XD");
    //   console.log(text._text);
    //   text.width += 1;
    // }
  }
};


let handler = new GameHandler();
