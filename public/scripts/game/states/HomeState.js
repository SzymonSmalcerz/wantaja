let HomeState = {
  init() {
    this.game.stage.backgroundColor = "#000";
  },
  create() {
    this.game.stage.backgroundColor = '#ede5d8';
    this.buttons = this.game.add.group();
    let startGameButton = new Button(this.game,this.game.world.centerX, this.game.world.centerY - 100,"buttonStart",0,1,2,3)
    startGameButton.addOnInputDownFunction(function(){
      this.game.state.start("GameState");
    },this)

    let showPlayerAvatarPanelButton = new Button(this.game,this.game.world.centerX, this.game.world.centerY + 100,"buttonStart",0,1,2,3)
    showPlayerAvatarPanelButton.addOnInputDownFunction(function(){
      this.showPlayerAvatarPanel();
    },this)

    this.buttons.add(startGameButton);
    this.buttons.add(showPlayerAvatarPanelButton);

    console.log(handler.playerAvatarDictionary);
    this.playerAvatars = this.game.add.group();
  },
  startGame(){
    this.game.state.start("GameState");
  },
  showPlayerAvatarPanel() {
    if(handler.playerData.gender == "male") {
      console.log("showing male options");
    } else {
      console.log("showing female options");
    }
    console.log(":)");
  }
}
