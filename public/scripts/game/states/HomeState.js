let HomeState = {
  init(){
    this.game.stage.backgroundColor = "#000";
  },
  create(){
    this.game.state.start("GameState");
    // this state MAY be used in the future if
    // we will want to make some screen to choose
    // concrete hero
    this.textStyle = {
      font : "40pt bold",
      fill : "#fff"
    };

    this.background = this.game.add.sprite(0,0,"player");
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.startGame, this);

    let tapText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "tap to start", this.textStyle);
    tapText.anchor.setTo(0.5);

  },
  startGame(){
    this.game.state.start("GameState");
  }
}
